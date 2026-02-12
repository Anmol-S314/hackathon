import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import Razorpay from 'razorpay';
import { Resend } from 'resend';
import crypto from 'crypto';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { createClient } from '@supabase/supabase-js';
import cron from 'node-cron';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') }); // Load root .env

// --- SECURITY UTILS (Anti-SQLi, Anti-XSS, Anti-Prompt Injection) ---
const MALICIOUS_PATTERNS = [
    /<script.*?>.*?<\/script>/gi,
    /UNION\s+SELECT/gi,
    /OR\s+['"]?\d+['"]?\s*=\s*['"]?\d+/gi,
    /DROP\s+TABLE/gi,
    /truncate\s+table/gi,
    /delete\s+from/gi,
    /update\s+.*\s+set/gi,
    /;\s*--/g,
    /\[IGNORE\s+PREVIOUS\s+INSTRUCTIONS\]/gi,
    /system\s+prompt/gi,
    /DAN\s+mode/gi,
    /xp_cmdshell/gi,
    /exec\(/gi,
    /base64_decode/gi
];
const DRIVE_LINK_REGEX = /^(https?:\/\/)?(drive\.google\.com|docs\.google\.com|forms\.gle|files.datavex.ai)\/.+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeInput(text) {
    if (typeof text !== 'string') return text;
    let sanitized = text;
    MALICIOUS_PATTERNS.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '[SEC_REDACTED]');
    });
    return sanitized
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * Recursively sanitizes an object or array for SQLi, XSS, and Prompt Injection.
 */
function sanitizeObject(obj) {
    if (Array.isArray(obj)) return obj.map(sanitizeObject);
    if (obj !== null && typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
            newObj[key] = sanitizeObject(obj[key]);
        }
        return newObj;
    }
    if (typeof obj === 'string') return sanitizeInput(obj);
    return obj;
}

const app = express();

// Trust Render's proxy (Required for express-rate-limit to see real client IPs)
app.set('trust proxy', 1);

// --- SECURITY MIDDLEWARE ---

// 1. Helment for secure headers
app.use(helmet());

// 2. CORS - RESTRICTIVE
const allowedOrigins = [
    process.env.CLIENT_URL,
    'https://vexstorm26.datavex.ai',
    'http://localhost:5173',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'https://datavex.ai',
    'https://www.datavex.ai'
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl) or 'null' origin (file://)
        if (!origin || origin === 'null') return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            console.warn(`[CORS BLOCKED] Origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-razorpay-signature'],
    credentials: true
}));

// Debug Middleware: Log all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from ${req.headers.origin || 'unknown origin'}`);
    next();
});

// 3. Rate Limiting (Global)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === 'OPTIONS',
    message: { error: "Too many requests, please try again later." }
});
app.use(globalLimiter);

// 4. Stricter Rate Limiting (Sync with Firebase Functions)
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20, // Strict limit for auth-related tasks
    skip: (req) => req.method === 'OPTIONS',
    message: { error: "Too many attempts. Please wait a while." }
});

const registrationLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 500, // Handle high-volume college traffic
    skip: (req) => req.method === 'OPTIONS',
    message: { error: "Registration limit exceeded for this device/network." }
});

const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50, // More breathing room for teams in labs
    skip: (req) => req.method === 'OPTIONS',
    message: { error: "Too many OTP requests. Please try again in 15 minutes." }
});

app.use(express.json({ limit: '10kb' })); // Limit body size to prevent DoS

// --- INITIALIZE SERVICES ---

// Google Sheets


// --- INITIALIZE SERVICES ---

let supabaseInstance = null;
function getSupabase() {
    if (!supabaseInstance) {
        if (!process.env.SUPABASE_URL) {
            console.warn("⚠️ SUPABASE_URL missing in environment.");
            return null;
        }
        supabaseInstance = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY || ''
        );
    }
    return supabaseInstance;
}

// Resend - Mock if key is missing
let resend;
if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
    console.log("✅ Resend Client Initialized");
} else {
    console.warn("⚠️  RESEND_API_KEY missing. Using Mock");
    resend = {
        emails: {
            send: async ({ to, from, subject, html }) => {
                console.log(`[MOCK EMAIL] To: ${to}, Subject: ${subject}`);
                return { data: { id: 'mock_id' }, error: null };
            }
        }
    };
}

const HACKATHON_SENDER = process.env.EMAIL_HACK_FROM || process.env.EMAIL_FROM || 'noreply@datavex.ai';
const CONTACT_RECEIVER = process.env.EMAIL_CONTACT_TO || 'info@datavex.ai';

// --- OTP STORE (In-Memory) ---
const apiOtpStore = new Map();

// --- Path Normalization Middleware ---
app.use((req, res, next) => {
    // 1. Remove Firebase internal path if present (happens in emulator)
    // Example: /project-id/region/function-name/path -> /path
    const firebasePrefix = /^\/[^\/]+\/[^\/]+\/[^\/]+/;
    if (firebasePrefix.test(req.url)) {
        req.url = req.url.replace(firebasePrefix, '') || '/';
    }

    // 2. Remove /api prefix if present (handling hosting rewrites or Render proxy)
    if (req.url.startsWith('/api')) {
        req.url = req.url.replace(/^\/api/, '') || '/';
    }
    console.log(`[ROUTE LOG] Normalized Path: ${req.url}`);
    next();
});

// --- HEALTH CHECK ---
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'DataVex Render Backend', timestamp: new Date().toISOString() });
});

// --- API ROUTES ---

// 0. Send & Verify OTP
app.post('/send-otp', otpLimiter, async (req, res) => {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    // 1. Check if already registered
    try {
        const supabase = getSupabase();
        if (!supabase) throw new Error("Database not configured");

        const { data: existingTeam } = await supabase
            .from('registrations')
            .select('id')
            .eq('leader_email', email.toLowerCase().trim())
            .single();

        if (existingTeam) {
            return res.status(400).json({ error: "Email already registered." });
        }



        // Generate 6-digit Code
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store with 10 min expiry
        apiOtpStore.set(email, {
            code: otp,
            expires: Date.now() + 10 * 60 * 1000
        });

        // Send Email
        await resend.emails.send({
            from: `VexStorm 26 <${HACKATHON_SENDER}>`,
            to: email,
            subject: '🔐 Access Code: Verify Identity',
            html: `
                <div style="font-family: monospace; padding: 20px; border: 2px solid #000; background: #eee;">
                    <h2 style="color: #000; text-transform: uppercase;">Identity Verification</h2>
                    <p>Agent <strong>${name || 'Operative'}</strong>,</p>
                    <p>Use the following clearance code to proceed with registration:</p>
                    <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; color: #8B5CF6;">
                        ${otp}
                    </div>
                    <p style="font-size: 10px; color: #666;">EXPIRES IN 600 SECONDS. DO NOT SHARE.</p>
                </div>
            `
        });

        res.json({ status: 'success', message: 'OTP Sent' });
    } catch (error) {
        console.error("OTP Error:", error);
        res.status(500).json({ error: "Failed to send verification email" });
    }
});

app.post('/verify-otp', authLimiter, (req, res) => {
    const { email, otp } = req.body;
    const record = apiOtpStore.get(email);

    if (!record) return res.status(400).json({ error: "Request specific OTP first" });
    if (Date.now() > record.expires) {
        apiOtpStore.delete(email);
        return res.status(400).json({ error: "Code expired. Request new one." });
    }
    if (record.code !== otp) {
        return res.status(400).json({ error: "Invalid Code. Access Denied." });
    }

    // OTP Verified
    apiOtpStore.delete(email); // Prevent reuse
    res.json({ status: 'success', verified: true });
});

// 1. Create Razorpay Order
/*
app.post('/api/create-order', authLimiter, async (req, res) => {
    try {
        const { amount, receipt } = req.body;
        // Basic validation
        if (!amount || amount !== 150) throw new Error("Invalid amount");

        const options = {
            amount: amount * 100, // amount in the smallest currency unit (paise for INR)
            currency: "INR",
            currency: "INR",
            receipt: receipt,
        };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(500).json({ error: error.message });
    }
});
*/

// 2. Verify Payment & Save to Sheets
/*
app.post('/api/verify-payment', authLimiter, async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            formData
        } = req.body;

        // Verify Signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ status: 'failure', message: 'Invalid payment signature' });
        }

        // Save to Google Sheets
        const registrationId = `REG-${Date.now()}`;
        // ... (rest of logic)
        const values = [[
            new Date().toISOString(),
            registrationId,
            formData.teamName || 'Solo',
            formData.type,
            formData.track,
            formData.leader.name,
            formData.leader.email,
            formData.leader.phone,
            formData.leader.college,
            formData.leader.year,
            formData.leader.dept,
            formData.member?.name || '',
            formData.member?.email || '',
            formData.member?.phone || '',
            formData.member?.college || '',
            formData.member?.year || '',
            formData.member?.dept || '',
            formData.projectIdea,
            formData.whyParticipate,
            '', // GitHub
            '', // LinkedIn
            'PAID',
            razorpay_payment_id,
            razorpay_order_id,
            '150',
            'CONFIRMED'
        ]];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Registrations!A:Z',
            valueInputOption: 'USER_ENTERED',
            resource: { values },
        });

        // Send Confirmation Email via Resend
        await resend.emails.send({
            from: `VexStorm 26 <${HACKATHON_SENDER}>`,
            to: formData.leader.email,
            subject: '✅ Registration Confirmed - VexStorm 26',
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h1 style="color: #8B5CF6;">Welcome to VexStorm 26! 🎉</h1>
                    <p>Hi ${formData.leader.name},</p>
                    <p>Your registration for the <strong>DataVex AI Agent Hackathon</strong> is confirmed.</p>
                    <p><strong>Registration ID:</strong> ${registrationId}</p>
                    <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
                    <p>Next steps will be shared via email soon. Get ready to build!</p>
                    <br/>
                    <p>Best regards,<br/>Team DataVex</p>
                </div>
            `
        });

        res.json({ status: 'success', registrationId });
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ error: error.message });
    }
});
*/

app.post('/manual-register', registrationLimiter, async (req, res) => {
    try {
        const { formData: rawFormData, transactionId: rawTxId, deviceId: rawDeviceId, honeypot, duration } = req.body;

        const formData = sanitizeObject(rawFormData);
        const transactionId = sanitizeInput(rawTxId);
        const deviceId = sanitizeInput(rawDeviceId);

        // --- BOT PROTECTION ---
        if (honeypot && honeypot.length > 0) {
            console.warn(`[BOT BLOCKED] Honeypot filled: ${honeypot}`);
            return res.status(400).json({ status: 'failure', error: 'System Error: Validation Failed (Code: 101).' });
        }

        if (!duration || typeof duration !== 'number' || duration < 5000) {
            console.warn(`[BOT BLOCKED] Submission too fast: ${duration}ms`);
            return res.status(400).json({ status: 'failure', error: 'Submission too fast.' });
        }

        const leaderEmail = (formData.leader?.email || '').toLowerCase().trim();
        const teamName = (formData.teamName || '').toLowerCase().trim();

        // Check for Malicious Content after sanitization (if redacts happened)
        if (JSON.stringify(formData).includes('[SEC_REDACTED]')) {
            return res.status(400).json({ status: 'failure', error: 'Malicious content detected and blocked.' });
        }

        // Format Validation
        if (formData.driveLink && !DRIVE_LINK_REGEX.test(formData.driveLink)) {
            return res.status(400).json({ status: 'failure', error: 'Invalid Google Drive link format.' });
        }
        if (!EMAIL_REGEX.test(leaderEmail)) {
            return res.status(400).json({ status: 'failure', error: 'Invalid email address.' });
        }

        // 1. Check for duplicates (Supabase)
        const supabase = getSupabase();
        if (supabase) {
            try {
                // Build dynamic OR filter to avoid empty value errors
                const orFilters = [`leader_email.eq.${leaderEmail}`];
                if (teamName && teamName !== 'solo') orFilters.push(`team_name.eq.${teamName}`);
                if (transactionId && transactionId !== "TEST_PAYMENT_SKIP") orFilters.push(`transaction_id.eq.${transactionId}`);
                if (deviceId) orFilters.push(`device_id.eq.${deviceId}`);

                const { data: dupCheck } = await supabase
                    .from('registrations')
                    .select('leader_email, team_name, transaction_id, device_id')
                    .or(orFilters.join(','));

                if (dupCheck?.length > 0) {
                    const isEmailDup = dupCheck.some(r => r.leader_email?.toLowerCase().trim() === leaderEmail);
                    const isTeamDup = teamName !== 'solo' && dupCheck.some(r => r.team_name?.toLowerCase().trim() === teamName);
                    const isDeviceDup = deviceId && dupCheck.some(r => r.device_id === deviceId);

                    if (isEmailDup) return res.status(400).json({ status: 'failure', error: 'Email already registered.' });
                    if (isTeamDup) return res.status(400).json({ status: 'failure', error: 'Team name taken.' });
                    if (isDeviceDup) return res.status(400).json({ status: 'failure', error: 'Only one registration allowed per device.' });
                }
            } catch (e) {
                console.warn("Supabase duplicate check failed:", e.message);
            }
        }



        const registrationId = `REG-${Date.now()}`;
        // If no real transaction ID is provided (payment skipped), generate a unique one
        const finalTxId = (transactionId && transactionId !== "TEST_PAYMENT_SKIP")
            ? transactionId
            : `WAITLIST-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // --- DOUBLE WRITE START ---

        // A. Write to Supabase
        if (supabase) {
            try {
                const { error: sbError } = await supabase.from('registrations').insert([{
                    registration_id: registrationId,
                    team_name: formData.teamName || 'Solo',
                    type: formData.type,
                    track: formData.track,
                    leader_name: formData.leader.name,
                    leader_email: leaderEmail,
                    leader_phone: formData.leader.phone,
                    leader_college: formData.leader.college,
                    leader_year: formData.leader.year,
                    leader_shirt: formData.leader.shirtSize,
                    member1_name: formData.member1?.name,
                    member1_email: formData.member1?.email,
                    member1_phone: formData.member1?.phone,
                    member1_college: formData.member1?.college,
                    member1_year: formData.member1?.year,
                    member1_shirt: formData.member1?.shirtSize,
                    member2_name: formData.member2?.name,
                    member2_email: formData.member2?.email,
                    member2_phone: formData.member2?.phone,
                    member2_college: formData.member2?.college,
                    member2_year: formData.member2?.year,
                    member2_shirt: formData.member2?.shirtSize,
                    project_idea: formData.projectIdea,
                    why_participate: formData.whyParticipate,
                    drive_link: formData.driveLink,
                    transaction_id: finalTxId,
                    payment_method: 'MANUAL_Payment',
                    mode: 'QR_CODE_MODE',
                    amount: '350',
                    device_id: deviceId,
                    status: 'PENDING_VERIFICATION'
                }]);
                if (sbError) throw sbError;
                console.log("✅ Saved to Supabase");
            } catch (e) {
                console.error("Supabase Save Error:", e);
            }
        }



        // Send 'Pending' Email (DISABLED: Not needed)
        /*
        resend.emails.send({
            from: `VexStorm 26 <${HACKATHON_SENDER}>`,
            to: formData.leader.email,
            subject: '⏳ Registration Received - VexStorm 26',
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <div style="background-color: #8B5CF6; padding: 24px; color: white; text-align: center;">
                        <h2 style="margin: 0; font-size: 24px;">Registration Received!</h2>
                    </div>
                    <div style="padding: 24px;">
                        <p>Hi <strong>${formData.leader.name}</strong>,</p>
                        <p>Your team <strong>${formData.teamName || 'Solo'}</strong> has successfully submitted their entry for VexStorm 26.</p>
                        <p style="background: #f3f4f6; padding: 15px; border-radius: 8px; font-family: monospace;">
                            <strong>Registration ID:</strong> ${registrationId}
                        </p>
                        <p><strong>Next Steps:</strong> We are currently in the selection phase. Once the top teams are shortlisted, we will reach out to you with details regarding the final confirmation and payment setup.</p>
                        <p>Keep an eye on your inbox for further updates!</p>
                        <br/>
                        <p>Best regards,<br/>Team DataVex</p>
                    </div>
                </div>
            `
        }).then(() => console.log(`✅ Confirmation email sent to ${formData.leader.email}`))
            .catch(e => console.error("❌ Email background failed:", e.message));
        */

        res.json({ status: 'success', registrationId });
    } catch (error) {
        console.error("Manual Reg Error:", error);
        console.error("Stack:", error.stack);
        res.status(500).json({ error: error.message, stack: error.stack });
    }
});

// 4. Contact Form Endpoint
app.post('/contact', authLimiter, async (req, res) => {
    try {
        let { name, email, company, phone, message, projectStage, budget, aiUsage, location, employees, experience } = req.body;

        // Sanitize all inputs
        name = sanitizeInput(name);
        email = sanitizeInput(email);
        company = sanitizeInput(company);
        phone = sanitizeInput(phone);
        message = sanitizeInput(message);
        projectStage = sanitizeInput(projectStage);
        budget = sanitizeInput(budget);
        aiUsage = sanitizeInput(aiUsage);
        location = sanitizeInput(location);
        employees = sanitizeInput(employees);
        experience = sanitizeInput(experience);

        // Basic validation
        if (!name || !email || !phone) {
            return res.status(400).json({ error: "Name, Email, and Phone are required." });
        }

        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ error: "Invalid email format." });
        }

        // Check for Malicious Content after sanitization (if redacts happened)
        const allContent = name + email + company + phone + message + projectStage + budget + aiUsage + location + employees + experience;
        if (allContent.includes('[SEC_REDACTED]')) {
            return res.status(400).json({ error: "Malicious content detected and blocked." });
        }

        // --- SUPABASE LOGGING (Contact Inquiries) ---
        const supabase = getSupabase();
        if (supabase) {
            try {
                const { error: sbContactError } = await supabase
                    .from('contact_inquiries')
                    .insert([{
                        name, email, phone, company, location,
                        project_stage: projectStage,
                        budget,
                        ai_usage: aiUsage,
                        employees,
                        experience,
                        message,
                        created_at: new Date().toISOString()
                    }]);

                if (sbContactError) {
                    console.warn("⚠️ Supabase Contact Log Failed (Table might be missing):", sbContactError.message);
                } else {
                    console.log("✅ Contact Inquiry saved to Supabase");
                }
            } catch (e) {
                console.error("❌ Supabase Contact Exception:", e.message);
            }
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email address." });
        }

        // Send Email (DISABLED: Using Daily Digest Strategy)
        /*
        const { data: emailData, error: emailError } = await resend.emails.send({
            from: `DataVex Inquiries <${HACKATHON_SENDER}>`,
            to: CONTACT_RECEIVER,
            reply_to: email, // Resend uses 'reply_to' (snake_case)
            subject: `New Project Inquiry from ${name}`,
            html: `...` // (Snippet omitted for brevity)
        });
 
        if (emailError) {
             console.error("❌ Resend API Error:", emailError);
             // return res.status(400).json({ error: "Failed to send email. " + emailError.message });
        }
        console.log("✅ Inquiry Sent via Resend:", emailData);
        */
        console.log("✅ Inquiry queue for Daily Digest.");

        res.json({ status: 'success', message: 'Thank you for your inquiry. Our team will get back to you shortly.' });
    } catch (error) {
        console.error("Contact API Error:", error);
        res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
});

// --- CRON JOBS ---

// Run at 11:55 PM every day
// Run at 09:00 AM every day (Sync with Firebase Schedule)
cron.schedule('0 9 * * *', async () => {
    console.log("⏰ Running Daily Contact Digest...");
    const supabase = getSupabase();
    if (!supabase) {
        console.error("Digest Skipped: DB not configured");
        return;
    }

    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        const { data: contacts, error } = await supabase
            .from('contact_inquiries')
            .select('*')
            .gte('created_at', twentyFourHoursAgo)
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!contacts || contacts.length === 0) {
            console.log("No new contacts in the last 24h.");
            return;
        }

        console.log(`Found ${contacts.length} new inquiries. Sending digest...`);

        const cards = contacts.map(c => `
            <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 24px; background-color: #ffffff;">
                <h3 style="margin: 0 0 16px 0; color: #4F46E5; font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                    New Contact Submission
                </h3>
                
                <div style="margin-bottom: 20px;">
                    <strong style="color: #111827; font-size: 14px; display: block; margin-bottom: 8px;">Contact Info</strong>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 14px;">
                        <div><span style="color: #6b7280;">Name:</span> <span style="color: #111827;">${c.name}</span></div>
                        <div><span style="color: #6b7280;">Email:</span> <span style="color: #111827;">${c.email}</span></div>
                        <div><span style="color: #6b7280;">Phone:</span> <span style="color: #111827;">${c.phone || 'N/A'}</span></div>
                        <div><span style="color: #6b7280;">Company:</span> <span style="color: #111827;">${c.company || 'Not Specified'}</span></div>
                        <div><span style="color: #6b7280;">Location:</span> <span style="color: #111827;">${c.location || 'Not Specified'}</span></div>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <strong style="color: #111827; font-size: 14px; display: block; margin-bottom: 8px;">Project Qualification</strong>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 14px;">
                        <div><span style="color: #6b7280;">Project Stage:</span> <span style="color: #111827;">${c.project_stage || 'Not Specified'}</span></div>
                        <div><span style="color: #6b7280;">Estimated Budget:</span> <span style="color: #111827;">${c.budget || 'Not Specified'}</span></div>
                        <div><span style="color: #6b7280;">AI Usage:</span> <span style="color: #111827;">${c.ai_usage || 'Not Specified'}</span></div>
                        <div><span style="color: #6b7280;">Employees:</span> <span style="color: #111827;">${c.employees || 'Not Specified'}</span></div>
                        <div><span style="color: #6b7280;">Tech Experience:</span> <span style="color: #111827;">${c.experience || 'Not Specified'}</span></div>
                    </div>
                </div>

                <div>
                    <strong style="color: #111827; font-size: 14px; display: block; margin-bottom: 8px;">Main Goal & Message</strong>
                    <div style="background-color: #f9fafb; padding: 12px; border-radius: 6px; color: #374151; font-size: 14px; line-height: 1.5;">
                        ${c.message || 'No message provided.'}
                    </div>
                </div>
                
                <div style="margin-top: 12px; font-size: 12px; color: #9ca3af; text-align: right;">
                    Received: ${new Date(c.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </div>
            </div>
        `).join('');

        const html = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; background-color: #f3f4f6; padding: 24px;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <h2 style="color: #1F2937; margin: 0;">DataVex Daily Digest</h2>
                    <p style="color: #6B7280; font-size: 16px; margin-top: 8px;">
                        You received <strong>${contacts.length}</strong> new inquiries in the last 24 hours.
                    </p>
                </div>
                ${cards}
            </div>
        `;

        await resend.emails.send({
            from: `DataVex Digest <${HACKATHON_SENDER}>`,
            to: CONTACT_RECEIVER,
            subject: `📊 Daily Leads: ${contacts.length} New Inquiries`,
            html: html
        });
        console.log("✅ Digest Email Sent Successfully");
    } catch (err) {
        console.error("❌ Daily Digest Failed:", err);
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
    console.log(`CORS Allowed Origin: ${process.env.CLIENT_URL || '*'}`);
});

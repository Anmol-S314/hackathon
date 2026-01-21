import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import Razorpay from 'razorpay';
import { Resend } from 'resend';
import crypto from 'crypto';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { createClient } from '@supabase/supabase-js';
import cron from 'node-cron';

dotenv.config({ path: '.env.local' });
dotenv.config(); // Also load .env if present

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

// --- SECURITY MIDDLEWARE ---

// 1. Helment for secure headers
app.use(helmet());

// 2. CORS (Restrict to your frontend domain in production)
app.use(cors({
    origin: process.env.CLIENT_URL || '*', // Update this in .env (e.g., https://datavex.ai)
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-razorpay-signature']
}));

// 3. Rate Limiting (Global)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." }
});
app.use(globalLimiter);

// 4. Stricter Rate Limiting for Registration/Payment (Increased for Dev Testing)
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // Increased from 10 to 100 for testing
    message: { error: "Too many registration attempts. Please wait a while." }
});

app.use(express.json({ limit: '10kb' })); // Limit body size to prevent DoS

// --- INITIALIZE SERVICES ---

// Google Sheets
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

// Supabase
const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Razorpay
/*
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
*/

// Resend - Mock if key is missing
let resend;
if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
    console.log("✅ Resend Client Initialized");
} else {
    console.warn("⚠️  RESEND_API_KEY missing. Using Mock Email Service (Check Console for OTPs).");
    resend = {
        emails: {
            send: async ({ to, from, subject, html }) => {
                console.log(`\n--- [MOCK EMAIL] To: ${to} ---`);
                console.log(`From: ${from}`);
                console.log(`Subject: ${subject}`);
                console.log(`Body Snippet: ${html.substring(0, 200)}...`);

                // Extract OTP for easy viewing
                const otpMatch = html.match(/>\s*(\d{6})\s*</);
                if (otpMatch) {
                    console.log(`🔐 OTP: ${otpMatch[1]}`);
                }
                console.log(`-----------------------------\n`);
                return { data: { id: 'mock_id' }, error: null };
            }
        }
    };
}

const HACKATHON_SENDER = process.env.EMAIL_HACK_FROM || process.env.EMAIL_FROM || 'noreply@datavex.ai';
const CONTACT_RECEIVER = process.env.EMAIL_CONTACT_TO || 'info@datavex.ai';

// --- OTP STORE (In-Memory) ---
// In production, replace with Redis
const otpStore = new Map();

// --- API ROUTES ---

// 0. Send & Verify OTP
app.post('/api/send-otp', authLimiter, async (req, res) => {
    try {
        const { email, name } = req.body;
        if (!email) return res.status(400).json({ error: "Email is required" });

        // 1. Check if already registered (Supabase First, then Sheets)
        try {
            const { data: existingTeam } = await supabase
                .from('registrations')
                .select('id')
                .eq('leader_email', email.toLowerCase().trim())
                .single();

            if (existingTeam) {
                return res.status(400).json({ error: "This email is already registered in our core database." });
            }

            // Fallback check Sheets if Supabase is empty/new
            const checkResponse = await sheets.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: 'Registrations!G:G',
            });
            const registeredEmails = checkResponse.data.values?.map(row => row[0]?.toLowerCase().trim()) || [];
            if (registeredEmails.includes(email.toLowerCase().trim())) {
                return res.status(400).json({ error: "This email is already registered. Access denied." });
            }
        } catch (e) {
            console.log("Duplicate check note:", e.message);
        }

        // Generate 6-digit Code
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store with 10 min expiry
        otpStore.set(email, {
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

app.post('/api/verify-otp', authLimiter, (req, res) => {
    const { email, otp } = req.body;
    const record = otpStore.get(email);

    if (!record) return res.status(400).json({ error: "Request specific OTP first" });
    if (Date.now() > record.expires) {
        otpStore.delete(email);
        return res.status(400).json({ error: "Code expired. Request new one." });
    }
    if (record.code !== otp) {
        return res.status(400).json({ error: "Invalid Code. Access Denied." });
    }

    // OTP Verified
    otpStore.delete(email); // Prevent reuse
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

// 3. Manual Registration (UPI QR)
app.post('/api/manual-register', authLimiter, async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'failure', errors: errors.array() });
    }

    try {
        const { formData: rawFormData, transactionId: rawTxId } = req.body;

        const formData = sanitizeObject(rawFormData);
        const transactionId = sanitizeInput(rawTxId);

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
        try {
            // Build dynamic OR filter to avoid empty value errors
            const orFilters = [`leader_email.eq.${leaderEmail}`];
            if (formData.teamName && formData.teamName.toLowerCase() !== 'solo') {
                orFilters.push(`team_name.eq.${formData.teamName}`);
            }
            if (transactionId && transactionId !== "TEST_PAYMENT_SKIP") {
                orFilters.push(`transaction_id.eq.${transactionId}`);
            }

            const { data: dupCheck } = await supabase
                .from('registrations')
                .select('leader_email, team_name, transaction_id')
                .or(orFilters.join(','));

            if (dupCheck?.length > 0) {
                const isEmailDup = dupCheck.some(r => (r.leader_email || '').toLowerCase().trim() === leaderEmail);
                const isTeamDup = teamName && teamName !== 'solo' && dupCheck.some(r => (r.team_name || '').toLowerCase().trim() === teamName);
                const isTxDup = transactionId && transactionId !== "TEST_PAYMENT_SKIP" && dupCheck.some(r => r.transaction_id === transactionId);

                if (isEmailDup) return res.status(400).json({ status: 'failure', error: 'Email already registered.' });
                if (isTeamDup) return res.status(400).json({ status: 'failure', error: 'Team name already taken.' });
                if (isTxDup) return res.status(400).json({ status: 'failure', error: 'Transaction ID used.' });
            }
        } catch (e) {
            console.warn("Supabase check failed, falling back to Sheets:", e.message);
        }

        // 2. Check for duplicates in Google Sheets (Fallback/Double Check)
        let rows = [];
        try {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: 'Registrations!A:AE',
            });
            rows = response.data.values || [];
        } catch (e) {
            console.log("No existing registrations found in Sheets. Proceeding...");
        }

        const isTeamDuplicate = teamName && teamName !== 'solo' && rows.some(row => (row[2] || '').toLowerCase().trim() === teamName);
        const isEmailDuplicate = rows.some(row => (row[6] || '').toLowerCase().trim() === leaderEmail);
        const isTxDuplicate = rows.some(row => (row[26] || '').trim() === transactionId.trim());

        if (isTeamDuplicate) {
            return res.status(400).json({ status: 'failure', error: 'Team name taken (Sheets).' });
        }
        if (isEmailDuplicate) {
            return res.status(400).json({ status: 'failure', error: 'Email registered (Sheets).' });
        }
        if (isTxDuplicate && transactionId !== "TEST_PAYMENT_SKIP") {
            return res.status(400).json({ status: 'failure', error: 'Transaction ID used (Sheets).' });
        }

        const registrationId = `REG-${Date.now()}`;
        // If no real transaction ID is provided (payment skipped), generate a unique one
        const finalTxId = (transactionId && transactionId !== "TEST_PAYMENT_SKIP")
            ? transactionId
            : `WAITLIST-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // --- DOUBLE WRITE START ---

        // A. Write to Supabase
        try {
            const { error: sbError } = await supabase
                .from('registrations')
                .insert([{
                    registration_id: registrationId,
                    team_name: formData.teamName || 'Solo',
                    type: formData.type,
                    track: formData.track,
                    leader_name: formData.leader.name,
                    leader_email: leaderEmail,
                    leader_phone: formData.leader.phone,
                    leader_college: formData.leader.college,
                    leader_year: formData.leader.year,
                    member1_name: formData.member1?.name,
                    member1_email: formData.member1?.email,
                    member1_phone: formData.member1?.phone,
                    member1_college: formData.member1?.college,
                    member1_year: formData.member1?.year,
                    member2_name: formData.member2?.name,
                    member2_email: formData.member2?.email,
                    member2_phone: formData.member2?.phone,
                    member2_college: formData.member2?.college,
                    member2_year: formData.member2?.year,
                    project_idea: formData.projectIdea,
                    why_participate: formData.whyParticipate,
                    drive_link: formData.driveLink,
                    transaction_id: finalTxId,
                    payment_method: 'MANUAL_Payment',
                    mode: 'QR_CODE_MODE',
                    amount: '150',
                    status: 'PENDING_VERIFICATION'
                }]);

            if (sbError) throw sbError;
            console.log("✅ Saved to Supabase");
        } catch (e) {
            console.error("❌ Supabase Write Error:", e.message);
            // We continue anyway since Sheets is the primary for now
        }

        // B. Write to Google Sheets
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
            formData.member1?.name || '',
            formData.member1?.email || '',
            formData.member1?.phone || '',
            formData.member1?.college || '',
            formData.member1?.year || '',
            formData.member2?.name || '',
            formData.member2?.email || '',
            formData.member2?.phone || '',
            formData.member2?.college || '',
            formData.member2?.year || '',
            formData.projectIdea,
            formData.whyParticipate,
            formData.driveLink || '', // Drive Link
            '', // GitHub
            '', // LinkedIn
            'MANUAL_Payment',
            finalTxId, // User entered UTR/ID
            'QR_CODE_MODE',
            '150',
            'PENDING_VERIFICATION' // Needs manual check
        ]];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Registrations',
            valueInputOption: 'USER_ENTERED',
            resource: { values },
        });

        // Send 'Pending' Email
        await resend.emails.send({
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
        });

        res.json({ status: 'success', registrationId });
    } catch (error) {
        console.error("Manual Reg Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// 4. Contact Form Endpoint
app.post('/api/contact', authLimiter, async (req, res) => {
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

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email address." });
        }

        // Send Email
        const { data: emailData, error: emailError } = await resend.emails.send({
            from: `DataVex Inquiries <${HACKATHON_SENDER}>`,
            to: CONTACT_RECEIVER,
            reply_to: email, // Resend uses 'reply_to' (snake_case)
            subject: `New Project Inquiry from ${name}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <div style="background-color: #4f46e5; padding: 24px; color: white;">
                        <h2 style="margin: 0; font-size: 24px;">New Contact Submission</h2>
                        <p style="margin: 4px 0 0 0; opacity: 0.8;">Detailed project inquiry details</p>
                    </div>
                    <div style="padding: 24px; background-color: #ffffff;">
                        <h3 style="color: #1e293b; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Contact Info</h3>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600; width: 140px;">Name:</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">Email:</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b;"><a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">Phone:</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${phone || 'Not Specified'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">Company:</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${company || 'Not Specified'}</td>
                            </tr>
                             <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">Location:</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${location || 'Not Specified'}</td>
                            </tr>
                        </table>

                        <h3 style="color: #1e293b; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Project Qualification</h3>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600; width: 140px;">Project Stage:</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${projectStage || 'Not Specified'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">Estimated Budget:</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${budget || 'Not Specified'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">AI Usage:</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${aiUsage || 'Not Specified'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">Employees:</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${employees || 'Not Specified'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">Tech Experience:</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${experience || 'Not Specified'}</td>
                            </tr>
                        </table>

                        <div style="margin-top: 24px;">
                            <p style="color: #64748b; font-weight: 600; margin-bottom: 8px;">Main Goal & Message:</p>
                            <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${message}</div>
                        </div>
                    </div>
                    <div style="background-color: #f1f5f9; padding: 16px; text-align: center; color: #94a3b8; font-size: 12px;">
                        This email was sent from the DataVex contact form.
                    </div>
                </div>
            `
        });

        if (emailError) {
            console.error("❌ Resend API Error:", emailError);
            return res.status(400).json({ error: "Failed to send email. " + emailError.message });
        }

        console.log("✅ Inquiry Sent via Resend:", emailData);


        res.json({ status: 'success', message: 'Thank you for your inquiry. Our team will get back to you shortly.' });
    } catch (error) {
        console.error("Contact API Error:", error);
        res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
});

// --- CRON JOBS ---

// Run at 11:55 PM every day
cron.schedule('55 23 * * *', async () => {
    console.log("⏰ Running Daily Contact Digest...");

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data: leads, error } = await supabase
            .from('contact_inquiries')
            .select('*')
            .gte('created_at', today.toISOString());

        if (error) throw error;

        if (!leads || leads.length === 0) {
            console.log("📭 No new inquiries today.");
            return;
        }

        console.log(`📨 Found ${leads.length} inquiries. Sending digest...`);

        // Generate HTML Table
        const tableRows = leads.map(lead => `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px;"><strong>${lead.name}</strong><br/><a href="mailto:${lead.email}">${lead.email}</a></td>
                <td style="padding: 10px;">${lead.company || '-'}</td>
                <td style="padding: 10px;">${lead.project_stage || '-'}</td>
                <td style="padding: 10px;">${lead.budget || '-'}</td>
                <td style="padding: 10px; font-size: 12px; color: #555;">${(lead.message || '').substring(0, 100)}...</td>
            </tr>
        `).join('');

        const { data: reportData, error: reportError } = await resend.emails.send({
            from: `DataVex Reports <${HACKATHON_SENDER}>`,
            to: CONTACT_RECEIVER,
            subject: `📊 Daily Inquiry Digest (${leads.length} Leads) - ${new Date().toLocaleDateString()}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2 style="color: #4f46e5;">Daily Lead Report</h2>
                    <p>Here is a summary of the contact inquiries received today:</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <thead style="background: #f3f4f6; text-align: left;">
                            <tr>
                                <th style="padding: 10px;">Contact</th>
                                <th style="padding: 10px;">Company</th>
                                <th style="padding: 10px;">Stage</th>
                                <th style="padding: 10px;">Budget</th>
                                <th style="padding: 10px;">Message Snippet</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>

                    <p style="margin-top: 30px; font-size: 12px; color: #888;">
                        This automated report was generated by the DataVex Server.
                    </p>
                </div>
            `
        });

        if (reportError) {
            console.error("❌ Daily Digest Failed:", reportError);
        } else {
            console.log("✅ Daily Digest Sent Successfully:", reportData);
        }
    } catch (err) {
        console.error("❌ Daily Digest Failed:", err);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

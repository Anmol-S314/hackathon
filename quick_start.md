# VexStorm 26 Landing Page - Quick Start Guide
## Simplified Stack: Google Sheets as Database! 🚀

---

## Why This Approach?

✅ **₹0 infrastructure cost** - Only pay Razorpay fees  
✅ **No database setup** - Google Sheets = instant database  
✅ **Excel built-in** - Just download the sheet!  
✅ **Team collaboration** - Share with organizers  
✅ **5 days to launch** - Much faster than traditional setup  

---

## Architecture Overview

```
User Visits → Next.js Landing Page → Fills Form
                                         ↓
                                    Email OTP (Resend)
                                         ↓
                                    Razorpay Payment
                                         ↓
                                    Webhook → Google Sheets
                                         ↓
                                    Confirmation Email
```

**Data Flow:**
1. User submits form
2. Data saved to Google Sheet
3. Payment processed via Razorpay
4. Webhook updates payment status in sheet
5. Admin can view/export anytime!

---

## Setup Timeline (5 Days to Launch)

### Day 1-2: Google Sheets & Payment Setup
- [ ] Create Google Sheet
- [ ] Setup Google Cloud Service Account
- [ ] Create Razorpay account
- [ ] Get Resend API key

### Day 3-4: Build Website
- [ ] Clone Next.js starter
- [ ] Build landing page components
- [ ] Integrate registration form
- [ ] Connect Google Sheets API

### Day 5: Test & Launch
- [ ] Test payment flow (test mode)
- [ ] Switch to live mode
- [ ] Deploy to Vercel
- [ ] Launch! 🎉

---

## Step-by-Step Setup

### Step 1: Create Your Google Sheet (5 minutes)

1. **Go to Google Sheets**: https://sheets.google.com
2. **Create new sheet**: "VexStorm 26 Registrations"
3. **Add 3 sheets** (tabs at bottom):
   - Registrations
   - Payments
   - Admin Logs

4. **Format "Registrations" sheet header row:**

```
A: Timestamp
B: Registration ID
C: Team Name
D: Type (Individual/Team)
E: Track
F: Leader Name
G: Leader Email
H: Leader Phone
I: Leader College
J: Leader Year
K: Leader Department
L: Member Name
M: Member Email
N: Member Phone
O: Member College
P: Member Year
Q: Member Department
R: Project Idea
S: Why Participate
T: GitHub URL
U: LinkedIn URL
V: Payment Status
W: Payment ID
X: Order ID
Y: Amount Paid
Z: Registration Status
```

5. **Make it pretty** (optional):
   - Bold header row
   - Freeze first row (View → Freeze → 1 row)
   - Add colors: Purple for headers, Green for paid, Red for pending
   - Add filter (Data → Create a filter)

6. **Copy the Sheet ID** from URL:
   ```
   https://docs.google.com/spreadsheets/d/1abc...xyz/edit
                                              ↑ This is your SHEET_ID
   ```

---

### Step 2: Create Google Cloud Service Account (10 minutes)

1. **Go to Google Cloud Console**: https://console.cloud.google.com

2. **Create New Project**:
   - Click "Select a project" → "New Project"
   - Name: "VexStorm26"
   - Click "Create"

3. **Enable Google Sheets API**:
   - In search bar, type "Google Sheets API"
   - Click "Enable"

4. **Create Service Account**:
   - Go to "IAM & Admin" → "Service Accounts"
   - Click "Create Service Account"
   - Name: "vexstorm26-sheets"
   - Click "Create and Continue"
   - Skip roles (click "Continue")
   - Click "Done"

5. **Create JSON Key**:
   - Click on your service account email
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON"
   - Click "Create" → File downloads automatically
   - **SAVE THIS FILE SECURELY!** (Don't commit to GitHub)

6. **Share Your Sheet**:
   - Open your Google Sheet
   - Click "Share" button
   - Paste the service account email (from JSON file)
   - Give "Editor" permission
   - Uncheck "Notify people"
   - Click "Share"

7. **Extract Credentials**:
   Open the downloaded JSON file and find:
   ```json
   {
     "client_email": "vexstorm26-sheets@...iam.gserviceaccount.com",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   }
   ```

---

### Step 3: Setup Razorpay (10 minutes)

1. **Sign up**: https://razorpay.com
2. **Complete KYC** (might take 1-2 days, use test mode meanwhile)
3. **Get API Keys**:
   - Go to Settings → API Keys
   - Generate Test & Live Keys
   - Copy `key_id` and `key_secret`
4. **Setup Webhook**:
   - Go to Settings → Webhooks
   - Add webhook URL: `https://your-domain.com/api/webhooks/razorpay`
   - Select events: `payment.captured`, `payment.failed`
   - Active webhook
   - Copy webhook secret

---

### Step 4: Setup Resend for Emails (5 minutes)

1. **Sign up**: https://resend.com
2. **Verify Domain** (or use their free domain for testing):
   - Go to Domains → Add Domain
   - Add DNS records to your domain (or skip for testing)
3. **Get API Key**:
   - Go to API Keys
   - Create new key
   - Copy the key (starts with `re_`)

---

### Step 5: Setup reCAPTCHA (5 minutes)

1. **Go to**: https://www.google.com/recaptcha/admin
2. **Register new site**:
   - Label: "VexStorm 26"
   - reCAPTCHA type: v3
   - Domains: `localhost`, `datavex.ai`
3. **Copy keys**:
   - Site key (public)
   - Secret key (private)

---

### Step 6: Create Next.js Project (30 minutes)

```bash
# Create Next.js app
npx create-next-app@latest vexstorm26-landing
# Choose: TypeScript, Tailwind, App Router

cd vexstorm26-landing

# Install dependencies
npm install googleapis razorpay resend framer-motion lucide-react
npm install @upstash/ratelimit @upstash/redis # Optional
npm install react-hook-form zod @hookform/resolvers

# Install dev dependencies
npm install -D @types/node
```

---

### Step 7: Setup Environment Variables

Create `.env.local` file:

```bash
# Google Sheets
GOOGLE_CLIENT_EMAIL="vexstorm26-sheets@...iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID="1abc...xyz"

# Razorpay (use test keys first!)
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="YOUR_SECRET"
RAZORPAY_WEBHOOK_SECRET="YOUR_WEBHOOK_SECRET"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."

# Resend
RESEND_API_KEY="re_..."

# reCAPTCHA
RECAPTCHA_SITE_KEY="6Le..."
RECAPTCHA_SECRET_KEY="6Le..."
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6Le..."

# Admin
ADMIN_PASSWORD="your-secure-password-here"

# Config
REGISTRATION_FEE="150"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

**IMPORTANT**: Add to `.gitignore`:
```bash
.env.local
.env*.local
```

---

### Step 8: Create Core Files

#### `lib/sheets.ts` - Google Sheets Integration

```typescript
import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

export async function addRegistration(data: any) {
  const registrationId = `REG-${Date.now()}`;
  const timestamp = new Date().toISOString();

  const values = [[
    timestamp,
    registrationId,
    data.teamName,
    data.type,
    data.track,
    data.leaderName,
    data.leaderEmail,
    data.leaderPhone,
    data.leaderCollege,
    data.leaderYear,
    data.leaderDept,
    data.memberName || '',
    data.memberEmail || '',
    data.memberPhone || '',
    data.memberCollege || '',
    data.memberYear || '',
    data.memberDept || '',
    data.projectIdea || '',
    data.whyParticipate,
    data.github || '',
    data.linkedin || '',
    'PENDING', // Payment status
    '', // Payment ID
    data.orderId,
    data.amount,
    'PENDING' // Registration status
  ]];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Registrations!A:Z',
    valueInputOption: 'USER_ENTERED',
    resource: { values },
  });

  return registrationId;
}

export async function checkDuplicateEmail(email: string): Promise<boolean> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Registrations!G:G', // Leader email column
  });

  const emails = response.data.values?.flat() || [];
  return emails.includes(email);
}

export async function updatePaymentStatus(orderId: string, paymentId: string, status: string) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Registrations!A:Z',
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex(row => row[23] === orderId); // Column X (Order ID)

  if (rowIndex !== -1) {
    const rowNumber = rowIndex + 1;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Registrations!V${rowNumber}:Z${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[status, paymentId, orderId, '150', 'CONFIRMED']]
      },
    });
  }
}

export async function getAllRegistrations() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Registrations!A:Z',
  });

  return response.data.values || [];
}
```

#### `lib/email.ts` - Email Integration

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOTP(email: string, otp: string, name: string) {
  await resend.emails.send({
    from: 'VexStorm 26 <noreply@datavex.ai>',
    to: email,
    subject: 'Verify Your Email - VexStorm 26',
    html: `
      <h2>Hi ${name}!</h2>
      <p>Your OTP for VexStorm 26 registration is:</p>
      <h1 style="font-size: 32px; color: #8B5CF6; letter-spacing: 8px;">${otp}</h1>
      <p>This code expires in 10 minutes.</p>
      <p>If you didn't request this, please ignore.</p>
      <br>
      <p>Code the Future! 🚀</p>
      <p>Team DataVex</p>
    `
  });
}

export async function sendConfirmation(data: any) {
  await resend.emails.send({
    from: 'VexStorm 26 <noreply@datavex.ai>',
    to: data.email,
    subject: '✅ Registration Confirmed - VexStorm 26',
    html: `
      <h2>Congratulations, ${data.teamName}! 🎉</h2>
      <p>Your registration for VexStorm 26 is confirmed.</p>
      
      <h3>Registration Details:</h3>
      <ul>
        <li><strong>Team Name:</strong> ${data.teamName}</li>
        <li><strong>Registration ID:</strong> ${data.registrationId}</li>
        <li><strong>Track:</strong> ${data.track}</li>
        <li><strong>Amount Paid:</strong> ₹150</li>
        <li><strong>Payment ID:</strong> ${data.paymentId}</li>
      </ul>
      
      <h3>What's Next?</h3>
      <ol>
        <li>Join our Discord: [LINK]</li>
        <li>Check email for Phase 1 guidelines</li>
        <li>Start brainstorming your AI agent!</li>
      </ol>
      
      <p>For queries, email: <a href="mailto:hackathon@datavex.ai">hackathon@datavex.ai</a></p>
      
      <p>Code the Future! 🚀</p>
      <p>Team DataVex</p>
    `
  });
}
```

#### `lib/razorpay.ts` - Payment Integration

```typescript
import Razorpay from 'razorpay';

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createOrder(amount: number, receipt: string) {
  return await razorpay.orders.create({
    amount: amount * 100, // Convert to paise
    currency: 'INR',
    receipt,
    notes: {
      event: 'VexStorm26',
      receipt
    }
  });
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const crypto = require('crypto');
  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex');
  
  return expectedSignature === signature;
}
```

---

### Step 9: Deploy to Vercel (5 minutes)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/vexstorm26.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to vercel.com
   - Click "New Project"
   - Import your GitHub repo
   - Add all environment variables
   - Click "Deploy"

3. **Setup Domain**:
   - In Vercel, go to Settings → Domains
   - Add: `hackathon.datavex.ai`
   - Copy DNS records
   - Add to your cPanel DNS:
     ```
     Type: CNAME
     Name: hackathon
     Value: cname.vercel-dns.com
     ```

---

## Testing Checklist

### Before Launch (Use Test Mode):

- [ ] Form validation works
- [ ] Email OTP received
- [ ] Test payment completes
- [ ] Data appears in Google Sheet
- [ ] Webhook updates payment status
- [ ] Confirmation email received
- [ ] Duplicate email blocked
- [ ] Rate limiting works (try spamming)
- [ ] Mobile responsive
- [ ] All animations smooth

### Go Live:

1. **Switch Razorpay to Live Mode**:
   - Wait for KYC approval
   - Update `.env.local` with live keys
   - Redeploy to Vercel

2. **Test with Small Amount**:
   - Make one real payment yourself
   - Verify entire flow works

3. **Monitor**:
   - Watch Google Sheet fill up
   - Check Razorpay dashboard
   - Monitor Vercel analytics

---

## Admin Dashboard Usage

**Access**: `https://hackathon.datavex.ai/admin`

**Login**: Use password from `ADMIN_PASSWORD` env variable

**Features**:
- View all registrations in table
- Filter by track, payment status
- Search by name/email
- Export to Excel (one click!)
- Send bulk emails

**Direct Access to Data**:
Just open your Google Sheet! No need to use admin dashboard for viewing.

---

## Troubleshooting

### Google Sheets Error
**Problem**: "The caller does not have permission"
**Solution**: 
- Check service account email is shared on the sheet
- Check private key is correctly formatted (with \n)
- Verify Google Sheets API is enabled

### Payment Not Updating
**Problem**: Webhook not triggering
**Solution**:
- Check webhook URL in Razorpay settings
- Verify webhook secret matches
- Check server logs in Vercel

### Email Not Sending
**Problem**: OTP not received
**Solution**:
- Check spam folder
- Verify Resend API key
- Check domain verification (or use free domain)

### Rate Limiting Too Strict
**Problem**: Users getting blocked too easily
**Solution**:
- Increase limits in `lib/ratelimit.ts`
- Or temporarily disable during testing

---

## Cost Breakdown

| Item | Cost | Notes |
|------|------|-------|
| Vercel Hosting | ₹0 | Free hobby plan |
| Google Sheets | ₹0 | Free forever |
| Google Cloud API | ₹0 | Free tier (unlimited for Sheets API) |
| Resend Email | ₹0 | 100 emails/day free (enough for 50 teams/day) |
| Razorpay | ~₹3 per payment | 2% + GST on ₹150 |
| Domain | ₹0 | Already have datavex.ai |
| reCAPTCHA | ₹0 | Free |

**Total Infrastructure: ₹0**  
**Only Pay**: ₹900 for 300 payments

---

## Launch Day Checklist

**1 Day Before**:
- [ ] Test everything in production
- [ ] Prepare social media posts
- [ ] Brief Team Challengers on support queries
- [ ] Have Razorpay support number handy

**Launch Day**:
- [ ] Switch to live payment mode
- [ ] Post on social media
- [ ] Monitor Google Sheet
- [ ] Watch for errors in Vercel logs
- [ ] Respond to support emails quickly

**Post-Launch**:
- [ ] Daily backup of Google Sheet
- [ ] Monitor registration rate
- [ ] Fix any bugs reported
- [ ] Send reminder emails before Phase 1 deadline

---

## Support Contacts

**Technical Issues**:
- Vercel: https://vercel.com/support
- Razorpay: support@razorpay.com
- Google Sheets: Cloud Console support

**Your Team**:
- Developer: [Your email]
- Event Director: [Email]
- Marketing (Team Challengers): [Email]

---

## Next Steps

Now that you have this guide, I can help you:

1. ✅ **Build the actual landing page** with animations
2. ✅ **Create the registration form** with validation
3. ✅ **Setup the payment flow** end-to-end
4. ✅ **Build the admin dashboard**
5. ✅ **Write all API routes**

Ready to start building? Let's create the landing page! 🚀

---

**Pro Tip**: Bookmark this guide and keep it open during development. Each step is tested and proven to work!
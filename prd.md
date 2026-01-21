# Product Requirements Document (PRD)
## DataVex AI Agent Hackathon 2025 - Landing Page & Registration System

---

## 1. Executive Summary

### 1.1 Project Overview
Development of a modern, animated landing page for **VexStorm 26: DataVex AI Agent Hackathon 2025** with integrated payment gateway and registration system. The platform will handle ~300 team registrations with robust security measures and rate limiting.

### 1.2 Project Goals
- Create an engaging, vibrant landing page inspired by Meta Hackathon design aesthetics
- Enable seamless team registration with payment processing (₹150/team - subject to change)
- Implement security best practices and rate limiting
- Provide admin dashboard for registration management
- Ensure mobile responsiveness and fast load times

### 1.3 Key Metrics
- Target: 300+ team registrations
- Registration completion rate: >85%
- Page load time: <2 seconds
- Mobile traffic: ~60% expected
- Payment success rate: >95%

---

## 2. Event Details

### 2.1 Event Information
- **Event Name**: DataVex AI Agent Hackathon 2025 (VexStorm 26)
- **Tagline**: "Code the Future"
- **Duration**: 3 weeks + 2-day finale
- **Format**: Hybrid (Remote development + Onsite finale at TCE Skill Labs)
- **Expected Participants**: 300 teams (~600 individuals)
- **Registration Fee**: ₹150 per team (configurable)

### 2.2 Timeline
**Phase 1: Team Formation & Registration** (Week 1)
- Online registration opens
- Team formation or individual sign-ups

**Phase 2: Development** (Week 2-3)
- Remote/hybrid development
- Mentor checkpoints

**Phase 3: Grand Finale** (2 Days - Onsite)
- **Day 1**: 
  - 9:30 AM: Inauguration
  - 11:00 AM: Hackathon begins
  - 5:00 PM: First mentor evaluation
- **Day 2**:
  - 9:00 AM: Second evaluation
  - 11:00 AM: Phase 2 ends
  - 2:15 PM: Phase 3 pitching
  - 4:30 PM: Winner announcement

### 2.3 Prizes
- 🥇 **1st Place**: ₹30,000 + Champion Title
- 🥈 **2nd Place**: ₹20,000
- 🥉 **3rd Place**: ₹10,000
- 🎖️ **Consolation**: ₹1,000 each (remaining finalists)
- 💼 **Internship Opportunity**: 6-month paid internship for top 15 participants

### 2.4 Tracks
1. **Healthcare** - Patient triage agents, diagnostic assistants
2. **Infrastructure & Smart Cities** - Traffic management, energy optimization
3. **FinTech** - Fraud detection, financial advisors
4. **Education** - Personalized learning tutors

---

## 3. Technical Requirements

### 3.1 Technology Stack

#### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, GSAP
- **Icons**: Lucide React
- **Form Handling**: React Hook Form + Zod validation

#### Backend
- **API Routes**: Next.js API Routes
- **Database**: PostgreSQL (Supabase or Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js (optional for admin)
- **File Storage**: Supabase Storage / AWS S3

#### Payment Integration
- **Primary**: Razorpay (Indian market preference)
- **Fallback**: Stripe
- **Currency**: INR
- **Amount**: ₹150 (configurable via environment variable)

#### Infrastructure
- **Hosting**: Vercel (free tier sufficient for traffic)
- **Domain**: datavex.ai (cPanel redirect to Vercel deployment)
- **CDN**: Vercel Edge Network
- **Analytics**: Vercel Analytics + Google Analytics 4

#### Security & Rate Limiting
- **Rate Limiting**: Upstash Redis + Vercel Edge Config
- **CAPTCHA**: Google reCAPTCHA v3 (invisible)
- **Email Verification**: Required before payment
- **DDoS Protection**: Vercel's built-in + Cloudflare (if needed)

---

## 4. Functional Requirements

### 4.1 Landing Page Sections

#### 4.1.1 Hero Section
**Requirements:**
- Animated headline with gradient text effects
- Event name: "VexStorm 26"
- Tagline: "Code the Future"
- Vibrant illustration (hand holding "META" style graphic)
- Primary CTA: "Register Now" (₹150)
- Secondary CTA: "View Schedule"
- Animated background particles/grid

**Animations:**
- Text fade-in with stagger effect
- Floating/pulsing illustration
- Gradient shift on hover for CTAs
- Parallax scroll effect

#### 4.1.2 Event Overview
**Content:**
- 3-week timeline visualization
- 4 challenge tracks with icons
- Key dates (TBD placeholders)
- Stats counter: "300+ Teams | ₹60K Prizes | 4 Tracks | 15 Finalists"

**Animations:**
- Counter animation on scroll into view
- Timeline cards slide in from sides
- Track cards hover effects with color shifts

#### 4.1.3 Prizes Section
**Content:**
- Medal/trophy icons for top 3
- Prize amounts with currency
- Internship opportunity highlight
- "Get ready to elevate your project!" copy

**Animations:**
- Prize cards scale on hover
- Shimmer effect on prize amounts
- Confetti animation on section view

#### 4.1.4 Timeline/Schedule
**Content:**
- Day 1 & Day 2 schedules
- Time-based layout
- Phase indicators (Phase 2, Phase 3)

**Animations:**
- Timeline progress bar
- Event cards fade in sequentially
- Current time indicator (if live)

#### 4.1.5 Tracks/Themes
**Content:**
- 4 theme cards with icons
- Brief description for each track
- Example use cases

**Design:**
- Pink/purple gradient cards
- Icon animations on hover
- Expandable descriptions

#### 4.1.6 Sponsors Section
**Content:**
- Sponsor logos (TBD)
- Tier-based layout (Platinum, Gold, Silver)
- "Become a Sponsor" CTA

**Animations:**
- Logo carousel/grid
- Grayscale to color on hover

#### 4.1.7 Stats/Numbers
**Content:**
- "4+ Formats"
- "5+ Workshops"  
- "20+ Speakers"
- "16+ Talks"

**Animations:**
- Count-up animation
- Pulse effect on numbers

#### 4.1.8 FAQ Section
**Content:**
- Registration process
- Team size (1-2 members)
- Submission guidelines
- Prize distribution
- Refund policy

**Interactions:**
- Accordion expand/collapse
- Smooth scroll to open items

#### 4.1.9 Footer
**Content:**
- DataVex branding
- Social media links
- Contact email
- Terms & Conditions
- Privacy Policy
- Organized by: "Team Challengers" & "Inuinity Team"

---

### 4.2 Registration System

#### 4.2.1 Registration Flow

**Step 1: User Selection**
```
┌─────────────────────────────┐
│   Register as:              │
│   ○ Individual              │
│   ○ Team (2 members)        │
└─────────────────────────────┘
```

**Step 2: Form Fields**

**For Individuals:**
- Full Name* (text, 3-50 chars)
- Email* (email validation)
- Phone Number* (Indian format validation)
- College/University* (text)
- Year of Study* (dropdown: 1st, 2nd, 3rd, 4th, PG)
- Department* (text)
- Preferred Track* (dropdown: Healthcare, Infrastructure, FinTech, Education)
- Why do you want to participate?* (textarea, 50-500 chars)
- GitHub Profile (optional, URL validation)
- LinkedIn Profile (optional, URL validation)
- Resume Upload (optional, PDF only, max 2MB)

**For Teams:**
- Team Name* (text, 3-30 chars, unique)
- Leader Information (same as individual fields)
- Teammate Information (same as individual fields)
- Team Email* (single point of contact)
- Preferred Track*
- Project Idea (brief, 100-300 chars)

**Step 3: Email Verification**
- Send OTP to email(s)
- 6-digit code
- 10-minute expiry
- Resend option (rate limited)

**Step 4: Payment**
- Display: Team Name / Individual Name
- Amount: ₹150 (+ Razorpay fees ~₹3)
- Total: ₹153
- Payment methods: UPI, Cards, Net Banking, Wallets
- Razorpay checkout integration

**Step 5: Confirmation**
- Success page with registration ID
- Email confirmation with:
  - Registration details
  - Payment receipt
  - Event schedule
  - Discord/Slack invite link
  - Next steps

#### 4.2.2 Validation Rules

**Frontend Validation:**
- Real-time field validation
- Email format check
- Phone number: 10 digits
- File type and size validation
- URL format validation
- Character limits

**Backend Validation:**
- Duplicate email check
- Duplicate team name check
- SQL injection prevention
- XSS attack prevention
- Rate limit check
- Payment verification

#### 4.2.3 Data Storage Schema

```typescript
// Teams Table
interface Team {
  id: string; // UUID
  teamName: string; // Unique
  registrationType: 'individual' | 'team';
  preferredTrack: 'Healthcare' | 'Infrastructure' | 'FinTech' | 'Education';
  projectIdea?: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentId?: string; // Razorpay payment_id
  orderId: string; // Razorpay order_id
  registrationStatus: 'pending' | 'confirmed' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

// Participants Table
interface Participant {
  id: string; // UUID
  teamId: string; // Foreign key
  role: 'leader' | 'member' | 'individual';
  fullName: string;
  email: string; // Unique
  phone: string;
  college: string;
  yearOfStudy: string;
  department: string;
  whyParticipate: string;
  githubUrl?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  emailVerified: boolean;
  verificationToken?: string;
  createdAt: Date;
}

// Payments Table
interface Payment {
  id: string;
  teamId: string;
  orderId: string; // Razorpay
  paymentId?: string; // Razorpay
  amount: number; // 150
  currency: string; // INR
  status: 'created' | 'authorized' | 'captured' | 'failed';
  method?: string; // upi, card, netbanking
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 5. Security Requirements

### 5.1 Rate Limiting Strategy

#### 5.1.1 API Endpoints Rate Limits

```typescript
// Registration Form Submission
- 3 attempts per IP per hour
- 5 attempts per email per day
- Exponential backoff on failures

// Email Verification (OTP)
- 3 OTP requests per email per hour
- 5 verification attempts per OTP
- 10-minute OTP expiry

// Payment Initiation
- 5 payment attempts per team per hour
- Webhook verification required

// General Page Access
- 100 requests per IP per minute (CDN level)
```

#### 5.1.2 Implementation
```typescript
// Using Upstash Redis
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
});

// Usage in API route
const { success } = await ratelimit.limit(identifier);
if (!success) {
  return Response.json(
    { error: "Too many requests. Please try again later." },
    { status: 429 }
  );
}
```

### 5.2 CAPTCHA Implementation

**Google reCAPTCHA v3:**
- Score threshold: 0.5
- Trigger on form submission
- Fallback to v2 checkbox if score < 0.3
- Server-side verification required

```typescript
// Frontend
const token = await grecaptcha.execute(SITE_KEY, {
  action: 'register'
});

// Backend verification
const verifyResponse = await fetch(
  'https://www.google.com/recaptcha/api/siteverify',
  {
    method: 'POST',
    body: new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: token
    })
  }
);
```

### 5.3 Input Sanitization

**Prevention Measures:**
1. **XSS Prevention:**
   - HTML escape all user inputs
   - Content Security Policy headers
   - DOMPurify for any rich text

2. **SQL Injection Prevention:**
   - Parameterized queries (Prisma ORM)
   - No raw SQL queries
   - Input validation with Zod

3. **CSRF Protection:**
   - CSRF tokens on forms
   - SameSite cookie attributes
   - Origin header validation

4. **File Upload Security:**
   - Whitelist: PDF only for resumes
   - Max size: 2MB
   - Virus scanning (ClamAV if budget permits)
   - Rename files to UUID
   - Store outside web root

### 5.4 Environment Variables Protection

```bash
# .env.local (NEVER commit)
DATABASE_URL=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
NEXTAUTH_SECRET=
RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
REDIS_URL=
REDIS_TOKEN=
AWS_S3_BUCKET= # or Supabase Storage
```

### 5.5 HTTPS & Headers

**Security Headers:**
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://checkout.razorpay.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' data:;
      connect-src 'self' https://api.razorpay.com;
      frame-src https://api.razorpay.com;
    `.replace(/\s{2,}/g, ' ').trim()
  }
];
```

### 5.6 Database Security

- Encrypted connections (SSL/TLS)
- Least privilege access
- Regular backups (daily)
- No sensitive data in logs
- Hashed/salted passwords for admin

---

## 6. Payment Integration

### 6.1 Razorpay Implementation

#### 6.1.1 Flow Diagram
```
User Submits Form
      ↓
Email Verification (OTP)
      ↓
Create Razorpay Order (Server)
      ↓
Display Razorpay Checkout (Client)
      ↓
User Completes Payment
      ↓
Razorpay Webhook → Verify Signature
      ↓
Update Database (payment_captured)
      ↓
Send Confirmation Email
```

#### 6.1.2 Order Creation (Backend)
```typescript
// /api/payment/create-order
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request: Request) {
  const { teamId, amount } = await request.json();
  
  // Create order
  const order = await razorpay.orders.create({
    amount: amount * 100, // Convert to paise
    currency: 'INR',
    receipt: `order_${teamId}`,
    notes: {
      teamId: teamId,
      event: 'VexStorm26'
    }
  });
  
  // Save to database
  await prisma.payment.create({
    data: {
      teamId,
      orderId: order.id,
      amount,
      currency: 'INR',
      status: 'created'
    }
  });
  
  return Response.json({ orderId: order.id });
}
```

#### 6.1.3 Checkout (Frontend)
```typescript
const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: 15000, // ₹150 in paise
  currency: 'INR',
  name: 'DataVex Hackathon',
  description: 'VexStorm 26 Registration',
  image: '/datavex-logo.png',
  order_id: orderId,
  handler: function (response) {
    // Payment successful
    verifyPayment(response);
  },
  prefill: {
    name: teamName,
    email: teamEmail,
    contact: teamPhone,
  },
  theme: {
    color: '#8B5CF6', // Purple theme
  },
};

const rzp = new Razorpay(options);
rzp.open();
```

#### 6.1.4 Webhook Verification
```typescript
// /api/webhooks/razorpay
import crypto from 'crypto';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('x-razorpay-signature');
  
  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  const event = JSON.parse(body);
  
  if (event.event === 'payment.captured') {
    const paymentId = event.payload.payment.entity.id;
    const orderId = event.payload.payment.entity.order_id;
    
    // Update database
    await prisma.payment.update({
      where: { orderId },
      data: {
        paymentId,
        status: 'captured',
        method: event.payload.payment.entity.method
      }
    });
    
    // Update team status
    const payment = await prisma.payment.findUnique({
      where: { orderId },
      include: { team: true }
    });
    
    await prisma.team.update({
      where: { id: payment.teamId },
      data: { 
        paymentStatus: 'completed',
        registrationStatus: 'confirmed'
      }
    });
    
    // Send confirmation email
    await sendConfirmationEmail(payment.team);
  }
  
  return Response.json({ received: true });
}
```

### 6.2 Dynamic Pricing

**Configuration:**
```typescript
// /lib/config.ts
export const PRICING = {
  baseAmount: parseInt(process.env.REGISTRATION_FEE || '150'),
  currency: 'INR',
  razorpayFee: 0.02, // 2% + GST
  gst: 0.18
};

// Calculate total
export function calculateTotal(baseAmount: number) {
  const razorpayFee = baseAmount * PRICING.razorpayFee;
  const gst = razorpayFee * PRICING.gst;
  return Math.ceil(baseAmount + razorpayFee + gst);
}
```

**Admin Dashboard to Update:**
```typescript
// Admin can update via environment variable or database config
// Recommended: Store in database for real-time updates without deployment
```

---

## 7. Admin Dashboard

### 7.1 Features

#### 7.1.1 Authentication
- NextAuth.js with credentials provider
- Admin email/password (stored hashed)
- Session management
- Protected routes

#### 7.1.2 Dashboard Views

**Overview:**
- Total registrations count
- Payment completion rate
- Revenue generated
- Registrations by track (pie chart)
- Registrations over time (line chart)

**Registrations Table:**
- Sortable columns
- Filters: Track, Payment Status, Registration Type
- Search: Name, Email, Team Name
- Pagination (50 per page)
- Bulk actions: Export, Email

**Team Details Modal:**
- View all team information
- Member details
- Payment information
- Download resume
- Manual approval/rejection

**Export Functionality:**
```typescript
// Export to Excel
import * as XLSX from 'xlsx';

function exportToExcel(data) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
  XLSX.writeFile(workbook, `registrations_${Date.now()}.xlsx`);
}
```

**Export Columns:**
- Registration ID
- Team Name
- Registration Type
- Leader Name
- Leader Email
- Leader Phone
- Leader College
- Member Name (if team)
- Member Email (if team)
- Preferred Track
- Payment Status
- Amount Paid
- Registration Date
- Project Idea

#### 7.1.3 Email Blast
- Select recipients: All, By Track, By Status
- Rich text editor
- Preview before send
- Schedule option
- Track open rates (optional)

#### 7.1.4 Settings
- Update registration fee
- Open/close registrations
- Set registration deadline
- Update prize amounts
- Manage FAQ content

### 7.2 Admin Routes
```
/admin/login
/admin/dashboard
/admin/registrations
/admin/payments
/admin/email-blast
/admin/settings
/admin/export
```

---

## 8. Design System

### 8.1 Color Palette

```css
/* Primary Colors (from inspiration images) */
--purple-dark: #1a0033;
--purple-primary: #8B5CF6;
--purple-light: #A78BFA;
--pink-primary: #EC4899;
--pink-light: #F472B6;
--neon-green: #84CC16;
--neon-yellow: #FACC15;

/* Neutral Colors */
--white: #FFFFFF;
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-800: #1F2937;
--gray-900: #111827;

/* Gradients */
--gradient-primary: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
--gradient-neon: linear-gradient(135deg, #84CC16 0%, #FACC15 100%);
--gradient-bg: linear-gradient(180deg, #1a0033 0%, #0f001a 100%);
```

### 8.2 Typography

```css
/* Font Family */
--font-heading: 'Inter', 'Poppins', sans-serif;
--font-body: 'Inter', system-ui, sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
--text-6xl: 3.75rem;   /* 60px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### 8.3 Spacing System
```css
/* Tailwind default scale */
0.25rem, 0.5rem, 0.75rem, 1rem, 1.25rem, 1.5rem, 2rem, 2.5rem, 3rem, 4rem, 5rem, 6rem...
```

### 8.4 Animation Library

```typescript
// Framer Motion Variants

// Fade In Up
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

// Stagger Container
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Scale In
export const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

// Slide In Left
export const slideInLeft = {
  hidden: { x: -100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Number Counter
export const counterAnimation = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 1 }
  }
};
```

### 8.5 Component Patterns

#### 8.5.1 Buttons
```tsx
// Primary Button
<button className="
  px-8 py-4 
  bg-gradient-to-r from-purple-600 to-pink-600 
  text-white font-semibold text-lg
  rounded-full
  hover:shadow-2xl hover:shadow-purple-500/50
  transform hover:scale-105
  transition-all duration-300
  relative overflow-hidden
  group
">
  <span className="relative z-10">Register Now</span>
  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
</button>

// Secondary Button
<button className="
  px-6 py-3
  border-2 border-purple-400
  text-purple-400 font-medium
  rounded-full
  hover:bg-purple-400 hover:text-white
  transition-all duration-300
">
  View Schedule
</button>
```

#### 8.5.2 Cards
```tsx
// Gradient Card
<div className="
  bg-gradient-to-br from-purple-900/50 to-pink-900/50
  backdrop-blur-lg
  border border-purple-500/20
  rounded-2xl
  p-6
  hover:border-purple-500/40
  hover:shadow-lg hover:shadow-purple-500/20
  transition-all duration-300
  group
">
  <div className="transform group-hover:scale-105 transition-transform duration-300">
    {/* Content */}
  </div>
</div>
```

#### 8.5.3 Input Fields
```tsx
<input className="
  w-full
  px-4 py-3
  bg-white/5
  border border-purple-500/30
  rounded-lg
  text-white
  placeholder:text-gray-400
  focus:outline-none
  focus:border-purple-500
  focus:ring-2 focus:ring-purple-500/20
  transition-all duration-200
" />
```

### 8.6 Responsive Breakpoints
```css
/* Mobile First Approach */
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

---

## 9. Performance Requirements

### 9.1 Metrics Targets

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| First Contentful Paint (FCP) | <1.5s | <2.5s |
| Largest Contentful Paint (LCP) | <2s | <3s |
| Time to Interactive (TTI) | <3s | <5s |
| Cumulative Layout Shift (CLS) | <0.1 | <0.25 |
| Total Blocking Time (TBT) | <200ms | <500ms |

### 9.2 Optimization Strategies

#### 9.2.1 Image Optimization
```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/hero-illustration.png"
  alt="VexStorm 26"
  width={600}
  height={600}
  priority // For hero images
  quality={85}
  placeholder="blur"
  blurDataURL="data:image/jpeg..."
/>
```

- WebP format with PNG fallback
- Lazy loading for below-fold images
- Responsive images with srcset
- CDN delivery (Vercel)

#### 9.2.2 Code Splitting
```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const RegistrationForm = dynamic(
  () => import('@/components/RegistrationForm'),
  { ssr: false, loading: () => <FormSkeleton /> }
);

const AnimatedBackground = dynamic(
  () => import('@/components/AnimatedBackground'),
  { ssr: false }
);
```

#### 9.2.3 Font Optimization
```typescript
// next/font
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});
```

#### 9.2.4 Bundle Size
- Target: <200KB initial JS
- Use tree shaking
- Remove unused dependencies
- Analyze with `@next/bundle-analyzer`

#### 9.2.5 Caching Strategy
```typescript
// Static pages: 1 year cache
export const revalidate = 31536000;

// Dynamic data: Revalidate every hour
export const revalidate = 3600;

// API routes: Cache-Control headers
res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
```

---

## 10. Email System

### 10.1 Email Provider
**Recommended**: Resend.com (Developer-friendly, 100 emails/day free)
**Alternative**: SendGrid, Amazon SES

### 10.2 Email Templates

#### 10.2.1 OTP Verification
```html
Subject: Verify Your Email - VexStorm 26 Registration

Hi [Name],

Your OTP for VexStorm 26 registration is:

[OTP: 123456]

This code will expire in 10 minutes.

If you didn't request this, please ignore this email.

---
Team DataVex
```

#### 10.2.2 Payment Confirmation
```html
Subject: Registration Confirmed - VexStorm 26 🎉

Hi [Team Name],

Congratulations! Your registration for VexStorm 26 is confirmed.

Registration Details:
- Team Name: [Team Name]
- Registration ID: [REG-ID]
- Track: [Track Name]
- Amount Paid: ₹150
- Payment ID: [Payment ID]

What's Next?
1. Join our Discord community: [link]
2. Check your email for Phase 1 submission guidelines
3. Start brainstorming your project idea!

Important Dates:
- Phase 1 Deadline: [Date]
- Grand Finale: [Date]

Download your receipt: [Link]

For any queries, contact us at hackathon@datavex.ai

Best of luck!
Team DataVex
```

#### 10.2.3 Reminder Email (Phase 1 Deadline)
```html
Subject: 48 Hours Left - Submit Your Phase 1 PPT! ⏰

Hi [Team Name],

This is a friendly reminder that Phase 1 submissions close in 48 hours.

Submission Requirements:
- 5-slide PPT
- Problem statement
- Solution architecture
- AI agent workflow

Submit here: [Portal Link]

Need help? Check our FAQ or join Discord.

Deadline: [Date & Time]

Code the Future!
Team DataVex
```

### 10.3 Email Implementation
```typescript
// /lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOTP(email: string, otp: string, name: string) {
  await resend.emails.send({
    from: 'VexStorm 26 <noreply@datavex.ai>',
    to: email,
    subject: 'Verify Your Email - VexStorm 26',
    react: OTPEmailTemplate({ name, otp })
  });
}

export async function sendConfirmation(team: Team) {
  await resend.emails.send({
    from: 'VexStorm 26 <noreply@datavex.ai>',
    to: team.email,
    subject: 'Registration Confirmed - VexStorm 26 🎉',
    react: ConfirmationEmailTemplate({ team })
  });
}
```

---

## 11. Hosting & Deployment

### 11.1 Domain Setup

**Primary Domain**: datavex.ai (cPanel hosted)

**Landing Page**: hackathon.datavex.ai or datavex.ai/vexstorm26

**Setup Options:**

**Option A: Subdomain (Recommended)**
1. Create A record in cPanel DNS:
   ```
   Type: A
   Name: hackathon
   Value: 76.76.21.21 (Vercel IP)
   ```
2. Add domain in Vercel project settings
3. SSL auto-configured by Vercel

**Option B: Subdirectory Redirect**
1. Create redirect in cPanel:
   ```
   datavex.ai/vexstorm26 → https://vexstorm26.vercel.app
   ```
2. Not recommended for branding

### 11.2 Vercel Deployment

**Deployment Steps:**
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy to production

**Environment Variables (Vercel):**
```bash
DATABASE_URL=postgresql://...
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://hackathon.datavex.ai
RECAPTCHA_SITE_KEY=...
RECAPTCHA_SECRET_KEY=...
RESEND_API_KEY=...
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
REGISTRATION_FEE=150
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=...
NEXT_PUBLIC_SITE_URL=https://hackathon.datavex.ai
```

**Build Settings:**
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

### 11.3 Database Hosting

**Recommended**: Supabase (Free tier: 500MB, sufficient for 300 teams)

**Alternative**: Neon, PlanetScale, Railway

**Supabase Setup:**
1. Create project
2. Copy connection string
3. Run Prisma migrations
4. Enable Row Level Security (optional)

### 11.4 CI/CD Pipeline

**GitHub Actions:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npx prisma generate
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### 11.5 Monitoring

**Vercel Analytics**: Enabled by default
**Error Tracking**: Sentry (optional)
**Uptime Monitoring**: Vercel (99.99% SLA)

```typescript
// Sentry setup (optional)
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

---

## 12. Testing Strategy

### 12.1 Testing Phases

#### 12.1.1 Unit Testing
**Framework**: Jest + React Testing Library

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

**Test Coverage:**
- Form validation functions
- Payment calculation logic
- Email/phone validation
- Rate limiting logic

**Example Test:**
```typescript
// __tests__/validation.test.ts
import { validateEmail, validatePhone } from '@/lib/validation';

describe('Validation Functions', () => {
  test('validates email correctly', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
  });
  
  test('validates Indian phone number', () => {
    expect(validatePhone('9876543210')).toBe(true);
    expect(validatePhone('12345')).toBe(false);
  });
});
```

#### 12.1.2 Integration Testing
- Registration flow end-to-end
- Payment flow with Razorpay test mode
- Email sending
- Database operations

#### 12.1.3 Load Testing
**Tool**: Artillery or k6

**Scenarios:**
- 50 concurrent users registering
- 100 requests/minute to homepage
- Payment webhook handling

```yaml
# artillery.yml
config:
  target: 'https://hackathon.datavex.ai'
  phases:
    - duration: 60
      arrivalRate: 10
      name: Warm up
    - duration: 120
      arrivalRate: 50
      name: Peak load
scenarios:
  - name: Register Team
    flow:
      - get:
          url: "/"
      - post:
          url: "/api/register"
          json:
            teamName: "Test Team"
            email: "test@example.com"
```

### 12.2 Cross-Browser Testing

**Target Browsers:**
- Chrome 90+ (60% traffic)
- Safari 14+ (20% traffic)
- Firefox 88+ (10% traffic)
- Edge 90+ (5% traffic)
- Mobile browsers (iOS Safari, Chrome Android) (5% traffic)

**Testing Tools:**
- BrowserStack (manual testing)
- Playwright (automated)

### 12.3 Mobile Testing

**Devices:**
- iPhone 12/13/14 (iOS 15+)
- Samsung Galaxy S21/S22
- OnePlus 9/10
- Budget Android (1080p screens)

**Responsive Breakpoints:**
- 375px (iPhone SE)
- 390px (iPhone 12/13)
- 414px (iPhone Plus)
- 768px (iPad)
- 1024px (iPad Pro)

### 12.4 Security Testing

**Penetration Testing:**
- SQL injection attempts
- XSS payloads
- CSRF attacks
- Rate limit bypass attempts
- Payment flow manipulation

**Tools:**
- OWASP ZAP (automated scan)
- Manual testing with Burp Suite

### 12.5 Pre-Launch Checklist

**Functionality:**
- [ ] Registration form works (individual & team)
- [ ] Email verification sends OTP
- [ ] Payment integration (test mode)
- [ ] Payment webhook receives events
- [ ] Confirmation email sent
- [ ] Admin dashboard accessible
- [ ] Export to Excel works
- [ ] Mobile responsive
- [ ] All animations smooth
- [ ] Form validation working

**Security:**
- [ ] Rate limiting active
- [ ] CAPTCHA functional
- [ ] HTTPS enforced
- [ ] Security headers set
- [ ] Environment variables secured
- [ ] No sensitive data in logs
- [ ] Payment webhook signature verified

**Performance:**
- [ ] Lighthouse score >90
- [ ] LCP <2s
- [ ] Images optimized
- [ ] Fonts loaded
- [ ] No console errors

**Content:**
- [ ] All text proofread
- [ ] Links working
- [ ] Contact email correct
- [ ] Social media links
- [ ] Terms & Privacy pages
- [ ] FAQ complete

**Analytics:**
- [ ] Google Analytics installed
- [ ] Vercel Analytics active
- [ ] Goal tracking configured

---

## 13. Post-Launch Monitoring

### 13.1 Daily Metrics

**Day 1-7 (Launch Week):**
- Hourly traffic monitoring
- Registration count
- Payment success rate
- Error rate in logs
- Server response times

**Dashboard Metrics:**
```typescript
// Real-time stats to monitor
{
  totalVisitors: 1500,
  totalRegistrations: 87,
  conversionRate: 5.8%, // registrations/visitors
  paymentSuccessRate: 95.4%, // successful/attempted
  avgResponseTime: 250ms,
  errorRate: 0.2%,
}
```

### 13.2 Alert System

**Critical Alerts (Immediate Action):**
- Payment webhook failures
- Database connection errors
- Server downtime
- Error rate >5%

**Warning Alerts (Monitor):**
- Registration rate spike
- Payment success rate <90%
- Response time >1s
- High rate limit hits

**Setup:**
```typescript
// Vercel Log Drains or custom webhook
if (errorRate > 0.05) {
  await sendAlert('CRITICAL: Error rate above 5%');
}

if (paymentSuccessRate < 0.90) {
  await sendAlert('WARNING: Payment success rate below 90%');
}
```

### 13.3 User Feedback

**Feedback Collection:**
- Post-registration survey (optional)
- Thumbs up/down on FAQ
- Contact form for issues
- Monitor social media mentions

**Common Issues Tracking:**
- Payment failures
- Email not received
- Form validation errors
- Mobile UX issues

---

## 14. Launch Timeline

### Week 1 (Jan 15-21, 2026)

**Day 1-2: Development Setup**
- [ ] Initialize Next.js project
- [ ] Setup database (Supabase)
- [ ] Configure Razorpay test mode
- [ ] Create base components

**Day 3-4: Core Development**
- [ ] Build landing page sections
- [ ] Implement registration form
- [ ] Email OTP system
- [ ] Payment integration

**Day 5: Security & Testing**
- [ ] Rate limiting implementation
- [ ] CAPTCHA integration
- [ ] Security testing
- [ ] Cross-browser testing

**Day 6: Admin Dashboard**
- [ ] Build admin login
- [ ] Registration table
- [ ] Export functionality
- [ ] Email blast feature

**Day 7: Pre-Launch**
- [ ] Content proofread
- [ ] Final QA testing
- [ ] Deploy to Vercel
- [ ] DNS configuration

### Week 2 (Jan 22-28, 2026)

**Day 8 (Friday): LAUNCH** 🚀
- [ ] Switch Razorpay to live mode
- [ ] Announce on social media
- [ ] Monitor traffic & registrations
- [ ] Be ready for support queries

**Day 9-14: Active Monitoring**
- [ ] Daily metric reviews
- [ ] Address user feedback
- [ ] Fix bugs if any
- [ ] Marketing push continues

### Week 3 (Jan 29 - Feb 4, 2026)

**Registration Phase 1 Closes**
- [ ] Final registration count
- [ ] Export all data
- [ ] Send reminder emails
- [ ] Prepare for Phase 2

---

## 15. Success Criteria

### 15.1 Technical Success

✅ **Must Have:**
- Zero critical bugs in payment flow
- 95%+ payment success rate
- <2s page load time
- 100% uptime during peak hours
- All 300 registrations processed smoothly

✅ **Good to Have:**
- Lighthouse score >95
- Zero security incidents
- <1% support tickets for technical issues

### 15.2 Business Success

✅ **Must Have:**
- 300+ team registrations
- ₹45,000+ revenue (300 × ₹150)
- Smooth Phase 1 submission process
- Data exported for organizers

✅ **Good to Have:**
- 400+ registrations
- 20%+ conversion rate (visitors to registrations)
- Positive user feedback
- Reusable template for future events

---

## 16. Risk Assessment

### 16.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Payment gateway downtime | Low | High | Test mode pre-launch, Razorpay status monitoring |
| Database overload | Low | High | Supabase auto-scaling, connection pooling |
| Email delivery failure | Medium | Medium | Resend has 99.9% SLA, backup SMTP |
| DDoS attack | Low | High | Vercel DDoS protection, rate limiting |
| Bug in registration form | Medium | High | Thorough testing, soft launch to team first |

### 16.2 Business Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Low registration turnout | Low | Medium | Marketing push, campus ambassadors |
| Payment abandonment | Medium | Medium | Clear pricing, easy UX, support chat |
| Duplicate/spam registrations | Medium | Low | Email verification, CAPTCHA, manual review |
| Last-minute registrations surge | High | Low | Auto-scaling infrastructure |

### 16.3 Contingency Plans

**Payment Gateway Failure:**
1. Monitor Razorpay status page
2. If down >30min, extend deadline
3. Communicate via email/social media
4. Manual payment option (UPI to organizer)

**Website Downtime:**
1. Vercel has 99.99% SLA
2. If critical issue, deploy to backup (Netlify)
3. Update DNS within 5 minutes
4. Inform users via social media

**Email Delivery Issues:**
1. Resend has retry mechanism
2. Backup: SendGrid account ready
3. Manual email to affected users
4. Support contact for OTP issues

---

## 17. Budget Breakdown

### 17.1 Development Costs

| Item | Cost | Notes |
|------|------|-------|
| Vercel Hosting | ₹0 | Free tier sufficient |
| Supabase Database | ₹0 | Free tier (500MB) |
| Razorpay Transaction Fees | ~₹900 | 2% of ₹45,000 |
| Resend Email | ₹0 | Free tier (100/day) |
| Domain (existing) | ₹0 | Using datavex.ai |
| Upstash Redis | ₹0 | Free tier (10K commands/day) |
| **Total** | **₹900** | **Negligible** |

### 17.2 Optional Costs

| Item | Cost | Notes |
|------|------|-------|
| Sentry Error Tracking | ₹0 | Free tier |
| Cloudflare CDN | ₹0 | Free tier |
| Premium Email (SendGrid) | ₹1,500/mo | Only if needed |
| Developer Time | Variable | In-house team |

**Note**: Infrastructure costs are minimal due to free tiers. Main cost is Razorpay transaction fees.

---

## 18. Future Enhancements (Post-Launch)

### Phase 2 Portal Features
- Submission portal for PPTs
- File upload with virus scanning
- Deadline countdown timer
- Submission status tracking
- Automated evaluation scoring

### Phase 3 Live Dashboard
- Real-time judging scores
- Live leaderboard
- Audience voting (optional)
- Live streaming integration

### Analytics & Insights
- Registration funnel analysis
- Drop-off points identification
- A/B testing for CTAs
- Heat map tracking

### Community Features
- Discord/Slack auto-invite
- Team matching for individuals
- Discussion forum
- Resource library

---

## 19. Documentation Deliverables

### 19.1 For Developers

**Technical Documentation:**
- README.md with setup instructions
- API documentation
- Database schema diagram
- Deployment guide
- Troubleshooting guide

**Code Documentation:**
- Inline comments for complex logic
- Function/component JSDoc
- Environment variable list
- Git commit guidelines

### 19.2 For Organizers

**User Guides:**
- Admin dashboard manual
- How to export data
- How to send email blasts
- How to update pricing
- FAQ management

**Runbooks:**
- How to handle payment disputes
- How to manually verify registrations
- How to extend deadline
- Emergency contact protocols

### 19.3 For Participants

**Help Center:**
- Registration guide
- Payment issues troubleshooting
- Team formation tips
- Submission guidelines (Phase 1)
- Contact support

---

## 20. Appendix

### 20.1 Database Schema (Prisma)

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Team {
  id                 String        @id @default(uuid())
  teamName           String        @unique
  registrationType   RegistrationType
  preferredTrack     Track
  projectIdea        String?
  paymentStatus      PaymentStatus @default(PENDING)
  registrationStatus RegistrationStatus @default(PENDING)
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt
  
  participants       Participant[]
  payments           Payment[]
}

model Participant {
  id              String   @id @default(uuid())
  teamId          String
  role            Role
  fullName        String
  email           String   @unique
  phone           String
  college         String
  yearOfStudy     String
  department      String
  whyParticipate  String
  githubUrl       String?
  linkedinUrl     String?
  resumeUrl       String?
  emailVerified   Boolean  @default(false)
  verificationToken String?
  createdAt       DateTime @default(now())
  
  team            Team     @relation(fields: [teamId], references: [id])
  
  @@index([email])
  @@index([teamId])
}

model Payment {
  id        String        @id @default(uuid())
  teamId    String
  orderId   String        @unique
  paymentId String?       @unique
  amount    Int
  currency  String        @default("INR")
  status    PaymentStatus @default(CREATED)
  method    String?
  receiptUrl String?
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
  
  team      Team          @relation(fields: [teamId], references: [id])
  
  @@index([orderId])
  @@index([teamId])
}

model Admin {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String // Hashed
  name      String
  createdAt DateTime @default(now())
}

enum RegistrationType {
  INDIVIDUAL
  TEAM
}

enum Track {
  HEALTHCARE
  INFRASTRUCTURE
  FINTECH
  EDUCATION
}

enum Role {
  LEADER
  MEMBER
  INDIVIDUAL
}

enum PaymentStatus {
  PENDING
  CREATED
  AUTHORIZED
  CAPTURED
  FAILED
}

enum RegistrationStatus {
  PENDING
  CONFIRMED
  REJECTED
}
```

### 20.2 API Routes Summary

```
GET  /api/health - Health check
POST /api/register - Submit registration
POST /api/verify-otp - Verify email OTP
POST /api/resend-otp - Resend OTP
POST /api/payment/create-order - Create Razorpay order
POST /api/payment/verify - Verify payment on client
POST /api/webhooks/razorpay - Razorpay webhook
GET  /api/admin/stats - Dashboard stats
GET  /api/admin/registrations - Get all registrations
POST /api/admin/export - Export to Excel
POST /api/admin/email-blast - Send bulk email
POST /api/admin/update-fee - Update registration fee
```

### 20.3 File Structure

```
vexstorm26-landing/
├── app/
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── registrations/
│   │   │   ├── export/
│   │   │   └── settings/
│   │   └── layout.tsx
│   ├── api/
│   │   ├── register/
│   │   ├── verify-otp/
│   │   ├── payment/
│   │   └── webhooks/
│   ├── layout.tsx
│   ├── page.tsx (Landing page)
│   └── globals.css
├── components/
│   ├── Hero.tsx
│   ├── Timeline.tsx
│   ├── Prizes.tsx
│   ├── Tracks.tsx
│   ├── FAQ.tsx
│   ├── Footer.tsx
│   ├── RegistrationModal.tsx
│   ├── AnimatedBackground.tsx
│   └── ui/ (shadcn components)
├── lib/
│   ├── prisma.ts
│   ├── razorpay.ts
│   ├── email.ts
│   ├── validation.ts
│   ├── ratelimit.ts
│   └── utils.ts
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── prisma/
│   └── schema.prisma
├── .env.local
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### 20.4 Third-Party Services

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| Vercel | Hosting | ✅ 100GB bandwidth |
| Supabase | Database | ✅ 500MB storage |
| Razorpay | Payments | ❌ 2% + GST per transaction |
| Resend | Emails | ✅ 100/day |
| Upstash | Redis | ✅ 10K requests/day |
| Google reCAPTCHA | Bot protection | ✅ Unlimited |
| Cloudflare | CDN (optional) | ✅ Unlimited |

### 20.5 Contact & Support

**Development Team:**
- Project Lead: [Name]
- Email: dev@datavex.ai

**Event Organizers:**
- Team Challengers (Marketing)
- Inuinity Team (Technical Evaluation)
- Event Director: [Name]

**Support Channels:**
- Email: hackathon@datavex.ai
- Discord: [Link to be added]
- Phone: [Emergency contact]

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 15, 2026 | Claude | Initial PRD creation |

---

## Approval & Sign-off

- [ ] **Technical Lead**: Approved
- [ ] **Event Director**: Approved
- [ ] **Marketing Lead**: Approved
- [ ] **Budget Owner**: Approved

---

**END OF DOCUMENT**

*This PRD is a living document and may be updated as requirements evolve.*
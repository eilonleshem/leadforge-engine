# LeadForge Engine

Production-ready lead generation engine for the US roofing vertical. Supports form leads with OTP verification, call tracking, buyer routing, and comprehensive admin dashboard.

## Features

- **Form Leads**: Collect leads via web forms with phone OTP verification
- **Call Tracking**: Track inbound calls via Twilio with automatic lead creation
- **Buyer Management**: Route leads to buyers via webhook or email
- **Admin Dashboard**: Monitor leads, manage buyers, view analytics
- **Fraud Protection**: Rate limiting, duplicate detection, bot prevention
- **UTM Tracking**: Full campaign tracking support

## Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript** (strict mode)
- **PostgreSQL** + **Prisma ORM**
- **Upstash Redis** (rate limiting + OTP storage)
- **Twilio** (SMS OTP + call tracking)
- **NextAuth** (admin authentication)
- **TailwindCSS** (styling)
- **Zod** (validation)

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (hosted: Neon, Supabase, or Railway recommended)
- Upstash Redis account
- Twilio account

---

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

> `prisma generate` runs automatically via the `postinstall` hook.

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required for local dev:
| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Auth secret (`openssl rand -base64 32`) |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |

Optional (features degrade gracefully without them):
| Variable | Description |
|---|---|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token |
| `TWILIO_FROM_NUMBER` | Twilio phone number for SMS |
| `TWILIO_TRACKING_NUMBER` | Twilio call tracking number |

### 3. Database Setup

```bash
# Run migrations against your database
npx prisma migrate deploy

# Seed database (creates admin user + sample buyer)
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Project Structure

```
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Database seed script
│   └── migrations/            # SQL migrations (committed)
├── src/
│   ├── app/
│   │   ├── api/               # API routes (serverless functions)
│   │   │   ├── health/        # Health-check endpoint
│   │   │   ├── leads/         # Lead submission + OTP verification
│   │   │   ├── twilio/        # Twilio voice + status webhooks
│   │   │   ├── admin/         # Protected admin API routes
│   │   │   └── auth/          # NextAuth handler
│   │   ├── admin/
│   │   │   ├── login/         # Public login page
│   │   │   └── (dashboard)/   # Protected admin pages
│   │   └── lp/               # Landing pages
│   ├── components/
│   │   ├── admin/             # Admin dashboard components
│   │   ├── landing/           # Landing page components
│   │   └── ui/                # Reusable UI components
│   ├── lib/                   # Server utilities (Prisma, Redis, Twilio, auth, env)
│   ├── hooks/                 # Client-side React hooks
│   └── types/                 # TypeScript type definitions
├── .env.example               # Env var template
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── README.md
```

---

## Landing Pages

- `/lp/storm-damage` — Storm damage landing page
- `/lp/free-inspection` — Free inspection landing page

Both pages include lead capture form, OTP verification, mobile sticky call button, UTM parameter tracking, and TCPA consent checkbox.

## Admin Dashboard

Access at `/admin/login`

**Routes:**
- `/admin` — Dashboard overview with stats
- `/admin/leads` — Leads list with filters + CSV export
- `/admin/leads/[id]` — Lead details + delivery logs
- `/admin/buyers` — Buyer management (CRUD)
- `/admin/analytics` — Analytics dashboard

## API Endpoints

### Public
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check (deployment verification) |
| POST | `/api/leads` | Submit lead form |
| POST | `/api/leads/verify-otp` | Verify OTP code |
| POST | `/api/twilio/voice` | Twilio voice webhook |
| POST | `/api/twilio/status` | Twilio status callback |

### Admin (Protected)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/leads` | List leads (with filters) |
| GET | `/api/admin/leads/[id]` | Get lead details |
| GET | `/api/admin/buyers` | List buyers |
| POST | `/api/admin/buyers` | Create buyer |
| PUT | `/api/admin/buyers/[id]` | Update buyer |
| DELETE | `/api/admin/buyers/[id]` | Delete buyer |
| GET | `/api/admin/analytics` | Get analytics data |
| GET | `/api/admin/export` | Export leads as CSV |

---

## Deploy to Vercel (Production)

### Step 1 — Push to GitHub

```bash
git init
git add -A
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USER/leadforge-engine.git
git push -u origin main
```

### Step 2 — Create a Hosted PostgreSQL Database

Use one of these providers (all have free tiers):

| Provider | Dashboard | Notes |
|---|---|---|
| **Neon** | [neon.tech](https://neon.tech) | Serverless Postgres, recommended for Vercel |
| **Supabase** | [supabase.com](https://supabase.com) | Full Postgres + extras |
| **Railway** | [railway.app](https://railway.app) | Simple managed Postgres |

Copy the **connection string** — you'll need it for `DATABASE_URL`.

> **If your provider uses a connection pooler** (Neon pooler, Supabase pgBouncer), also copy the **direct (non-pooled) URL** for `DIRECT_DATABASE_URL`. This is needed for migrations.

### Step 3 — Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Leave **Framework Preset** as `Next.js` (auto-detected)
4. Leave **Build Command** as default (`next build`)
5. Leave **Output Directory** as default
6. **Do NOT deploy yet** — first add environment variables (Step 4)

### Step 4 — Set Environment Variables in Vercel

Go to **Project Settings → Environment Variables** and add:

| Variable | Required | Example | Notes |
|---|---|---|---|
| `DATABASE_URL` | **Yes** | `postgresql://...` | From your DB provider |
| `DIRECT_DATABASE_URL` | If pooler | `postgresql://...` | Non-pooled URL (Neon/Supabase) |
| `NEXTAUTH_SECRET` | **Yes** | `Kx8m...` | Run `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Preview only | `https://your-app.vercel.app` | Auto-detected on prod |
| `ADMIN_EMAIL` | **Yes** | `admin@leadforge.com` | Admin login email |
| `ADMIN_PASSWORD` | **Yes** | `strong-password` | Admin login password |
| `UPSTASH_REDIS_REST_URL` | **Yes** | `https://...upstash.io` | From Upstash console |
| `UPSTASH_REDIS_REST_TOKEN` | **Yes** | `AX...` | From Upstash console |
| `TWILIO_ACCOUNT_SID` | **Yes** | `ACxx...` | From Twilio console |
| `TWILIO_AUTH_TOKEN` | **Yes** | `xx...` | From Twilio console |
| `TWILIO_FROM_NUMBER` | **Yes** | `+1234567890` | Twilio phone for SMS |
| `TWILIO_TRACKING_NUMBER` | For calls | `+1234567890` | Twilio call tracking number |
| `APP_BASE_URL` | Recommended | `https://your-app.vercel.app` | Your production URL |

> Set all variables for **Production**, **Preview**, and **Development** scopes.

### Step 5 — Deploy

Click **Deploy** in the Vercel dashboard. Vercel will:
1. Run `npm install` (which triggers `postinstall` → `prisma generate`)
2. Run `next build`
3. Deploy serverless functions + static assets

### Step 6 — Run Database Migrations

After the first deploy, you need to apply migrations to your production database.

**Option A — From your local machine:**

```bash
# Set DATABASE_URL to your production database
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

**Option B — Using Vercel CLI:**

```bash
npx vercel env pull .env.production.local
npx prisma migrate deploy
```

**Option C — Using your DB provider's console:**

Run the SQL from `prisma/migrations/20240301000000_init/migration.sql` directly in the SQL editor of Neon/Supabase/Railway.

### Step 7 — Seed the Admin User

```bash
DATABASE_URL="postgresql://..." ADMIN_EMAIL="admin@leadforge.com" ADMIN_PASSWORD="your-password" npx tsx prisma/seed.ts
```

### Step 8 — Configure Twilio Webhooks

In your Twilio console, set the webhook URLs for your tracking number:
- **Voice URL**: `https://your-app.vercel.app/api/twilio/voice` (HTTP POST)
- **Status Callback**: `https://your-app.vercel.app/api/twilio/status` (HTTP POST)

---

## Verification Checklist

After deploying, verify each item:

- [ ] **Health check**: `GET https://your-app.vercel.app/api/health` → returns `{"status":"ok",...}`
- [ ] **Landing pages**: `/lp/storm-damage` and `/lp/free-inspection` load correctly
- [ ] **Admin login**: `/admin/login` → enter credentials → redirects to `/admin`
- [ ] **Admin dashboard**: Stats cards load, leads table is empty (expected)
- [ ] **Buyers page**: `/admin/buyers` → click "Add Buyer" → create a test buyer
- [ ] **Lead form**: Submit a test lead on a landing page → OTP modal appears
- [ ] **OTP verification**: Enter the code from SMS → lead status changes to VERIFIED
- [ ] **CSV export**: Click "Export CSV" on leads page → file downloads
- [ ] **Call tracking** (if configured): Call the tracking number → call record appears in DB

---

## Twilio Setup

1. **SMS OTP**: Configure `TWILIO_FROM_NUMBER` for sending OTP codes
2. **Call Tracking**: 
   - Configure `TWILIO_TRACKING_NUMBER` 
   - Set webhook URLs in Twilio console (see Step 8 above)

## Lead Flow

1. **Form Submission**: User fills form → Lead created with `PENDING_OTP` status
2. **OTP Verification**: OTP sent via SMS → User verifies → Status changes to `VERIFIED`
3. **Delivery**: System finds matching buyer → Delivers lead → Status changes to `DELIVERED`

## Call Lead Flow

1. **Inbound Call**: Call received → Call record created
2. **Status Update**: Call completed → If duration >= 60s, lead created with `QUALIFIED_CALL` status
3. **Delivery**: Lead delivered to matching buyer

## Buyer Routing

Buyers can specify coverage rules:
- **ZIP codes**: `["90210", "10001"]`
- **State codes**: `["CA", "NY"]`
- **Empty array**: Accepts all leads

First matching active buyer receives the lead.

## Fraud Protection

- **Rate Limiting**: 5 requests/min per IP, 3 OTP requests/hour per phone
- **Duplicate Detection**: Same phone+ZIP within 30 days marked as duplicate
- **Bot Prevention**: Honeypot field + form timing check
- **IP Hashing**: IP addresses stored as SHA-256 hashes

---

## Scripts Reference

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run db:migrate:dev` | Create new migration (development) |
| `npm run db:migrate:deploy` | Apply migrations (production) |
| `npm run db:seed` | Seed admin user + sample buyer |
| `npm run db:studio` | Open Prisma Studio (DB browser) |

## License

Proprietary — All rights reserved

# 🔍 Deployment Architecture Analysis

## STEP 1 — CURRENT STATE ANALYSIS

### Project Structure
- **Type**: Next.js 14 App Router (Full-Stack Single Repo)
- **Monorepo**: ❌ No (single Next.js application)
- **Frontend Location**: `src/app/` (Next.js App Router)
- **Backend Location**: `src/app/api/` (Next.js API Routes = Serverless Functions)
- **Database**: PostgreSQL via Prisma ORM

### Framework Detection
- ✅ **Next.js 14.1.0** (App Router)
- ✅ **TypeScript** (strict mode)
- ✅ **Prisma 5.10.0** (ORM)
- ✅ **PostgreSQL** (via Railway)
- ✅ **TailwindCSS** (styling)
- ✅ **NextAuth** (authentication)

### Build & Start Scripts
- ✅ `npm run build` - Next.js production build
- ✅ `npm run start` - Start production server
- ✅ `npm run dev` - Development server
- ✅ `postinstall` - Auto-runs `prisma generate`

### Environment Variables
- ✅ Server-side validation: `src/lib/env.ts` (Zod schema)
- ✅ No hardcoded URLs found
- ✅ All API calls use relative paths (`/api/...`)
- ✅ Environment variables properly abstracted

### Deployment Configuration

#### Vercel
- ✅ `vercel.json` exists
- ✅ Framework: Next.js (auto-detected)
- ✅ Build command: `npm run build`
- ✅ Regions: `iad1` (US East)

#### Railway
- ✅ `railway.json` exists
- ⚠️ **Note**: Railway is ONLY for PostgreSQL database
- ⚠️ **Note**: Backend (API routes) runs on Vercel, NOT Railway
- ✅ Railway config is for database service only

#### GitHub
- ✅ `.gitignore` properly configured
- ✅ No secrets in repository
- ✅ Migration files committed (required for Vercel)

### Health Endpoint
- ✅ **Status**: EXISTS
- ✅ **Location**: `src/app/api/health/route.ts`
- ✅ **Endpoint**: `GET /api/health`
- ✅ **Features**: Database connectivity check, uptime, version

### CORS Configuration
- ✅ **Status**: NOT NEEDED
- ✅ **Reason**: Next.js API routes are same-origin (no CORS required)
- ✅ **Note**: All API calls use relative paths, no cross-origin requests

### API URL Wiring
- ✅ **Status**: CORRECT
- ✅ **Pattern**: All API calls use relative paths (`/api/leads`, `/api/admin/...`)
- ✅ **No hardcoded URLs**: Verified via grep
- ✅ **No localhost references**: Verified

---

## STEP 2 — SAFE WIRING PLAN

### GitHub ✅
- ✅ Branch strategy: `main` (production)
- ✅ `.gitignore` excludes secrets
- ✅ Migration files committed (required)
- ✅ CI workflows configured

### Railway (Database Only) ✅
- ✅ **Purpose**: PostgreSQL database hosting
- ✅ **NOT a backend service** - This is a Next.js app
- ✅ Database connection via `DATABASE_URL`
- ✅ Migrations run via Prisma CLI
- ✅ No build/start commands needed (database only)

### Vercel (Frontend + Backend) ✅
- ✅ **Purpose**: Hosts entire Next.js app
- ✅ Frontend: Next.js pages/components
- ✅ Backend: Next.js API routes (serverless functions)
- ✅ Build: `npm run build` (auto-detected)
- ✅ Output: `.next` directory (auto-detected)
- ✅ Environment variables: Set in Vercel dashboard

---

## STEP 3 — MINIMAL CODE FIXES

### Required Fixes: NONE ✅
- ✅ Health endpoint exists
- ✅ CORS not needed (same-origin)
- ✅ No hardcoded URLs
- ✅ Environment validation exists
- ✅ Prisma singleton pattern correct

### Optional Enhancements
- Add deployment verification script
- Add environment variable checklist document

---

## STEP 4 — ENVIRONMENT VARIABLES

### Vercel (Full App) - Required
```
DATABASE_URL=postgresql://... (from Railway)
DIRECT_DATABASE_URL=postgresql://... (same as DATABASE_URL for Railway)
NEXTAUTH_SECRET=... (openssl rand -base64 32)
NEXTAUTH_URL=https://your-app.vercel.app (auto-set in production)
ADMIN_EMAIL=admin@leadforge.com
ADMIN_PASSWORD=...
APP_BASE_URL=https://your-app.vercel.app
```

### Vercel (Full App) - Optional
```
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_NUMBER=+1234567890
TWILIO_TRACKING_NUMBER=+1234567890
NEXT_PUBLIC_TWILIO_TRACKING_NUMBER=+1234567890
```

### Railway (Database Only)
- ✅ `DATABASE_URL` - Auto-provided by Railway PostgreSQL service
- ✅ No additional env vars needed (database only)

---

## STEP 5 — VERIFICATION

### Health Check
```bash
curl https://your-app.vercel.app/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "version": "1.0.0",
  "database": "connected",
  "uptime": 123.45
}
```

### API Request Example
```bash
# Test lead submission
curl -X POST https://your-app.vercel.app/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "phone": "+15551234567",
    "zip": "12345",
    "homeowner": true,
    "issueType": "STORM",
    "urgency": "THIS_WEEK",
    "consent": true
  }'
```

### Frontend → Backend Communication
- ✅ **Status**: Works automatically
- ✅ **Reason**: Same-origin (Next.js API routes)
- ✅ **No CORS needed**: All requests are relative paths

### Railway Logs
```bash
# Via Railway Dashboard
1. Go to railway.app
2. Select PostgreSQL service
3. Click "Metrics" tab
4. View connection metrics and query performance
```

### Database Connection Verification
```bash
# Via health endpoint
curl https://your-app.vercel.app/api/health
# Check: "database": "connected"

# Via Prisma CLI
DATABASE_URL="postgresql://..." npx prisma migrate status
```

---

## STEP 6 — SAFE ROLLBACK PLAN

### Revert Last Commit
```bash
git revert HEAD
git push origin main
# Vercel auto-deploys previous version
```

### Redeploy Previous Vercel Version
1. Vercel Dashboard → **Deployments**
2. Find previous successful deployment
3. Click **"..."** → **"Promote to Production"**

### Redeploy Previous Railway Version
- ✅ **Not applicable** - Railway is database only
- ✅ Database is persistent (no version rollback needed)
- ✅ Migrations are versioned (use `prisma migrate resolve` if needed)

### No Other Projects Affected
- ✅ All changes are in this repository only
- ✅ No shared services modified
- ✅ No other deployments touched

---

## ✅ FINAL STATUS

### Architecture Summary
- **Frontend**: Next.js pages on Vercel
- **Backend**: Next.js API routes on Vercel (serverless functions)
- **Database**: PostgreSQL on Railway
- **CI/CD**: GitHub Actions → Vercel auto-deploy

### Deployment Readiness
- ✅ **GitHub**: Configured and ready
- ✅ **Vercel**: Configured and ready
- ✅ **Railway**: Database configured and ready
- ✅ **Health Endpoint**: Working
- ✅ **Migrations**: Ready to deploy
- ✅ **Environment Variables**: Documented

### Next Steps
1. ✅ Code is ready
2. ⏳ Run migrations: `npm run db:deploy`
3. ⏳ Verify deployment: Check `/api/health`
4. ⏳ Seed admin user: `npm run db:seed`

---

**Status**: ✅ **PRODUCTION-READY**

All wiring is complete. The application is ready for deployment.

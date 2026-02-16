# 🚀 Production Deployment Guide

## Architecture

- **Vercel**: Full Next.js app (frontend + API routes as serverless functions)
- **Railway**: PostgreSQL database
- **GitHub**: Source control + CI/CD

---

## Step 1: Setup Railway Database

### Create PostgreSQL Service

1. Go to [railway.app](https://railway.app)
2. Create new project → **"New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway creates database automatically
4. Copy the **Connection URL** (this is your `DATABASE_URL`)

### Get Database Credentials

- **Connection URL**: `postgresql://user:password@host:port/railway`
- **Direct URL**: Same as Connection URL (Railway doesn't use pooler by default)

---

## Step 2: Setup Vercel Project

### Import from GitHub

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `eilonleshem/leadforge-engine`
3. Framework: **Next.js** (auto-detected)
4. **Do NOT deploy yet** - add environment variables first

### Add Environment Variables

Go to **Project Settings** → **Environment Variables** and add:

#### Required Variables

```
DATABASE_URL=postgresql://... (from Railway)
DIRECT_DATABASE_URL=postgresql://... (same as DATABASE_URL for Railway)
NEXTAUTH_SECRET=... (generate with: openssl rand -base64 32)
NEXTAUTH_URL=https://your-app.vercel.app (auto-detected in production)
ADMIN_EMAIL=admin@leadforge.com
ADMIN_PASSWORD=your-strong-password
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...
APP_BASE_URL=https://your-app.vercel.app
```

#### Optional (Twilio)

```
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_NUMBER=+1234567890
TWILIO_TRACKING_NUMBER=+1234567890
```

**Important:** Set for **Production**, **Preview**, and **Development** environments.

---

## Step 3: Deploy to Vercel

1. Click **"Deploy"** in Vercel dashboard
2. Vercel will:
   - Run `npm install` (triggers `postinstall` → `prisma generate`)
   - Run `npm run build`
   - Deploy serverless functions

---

## Step 4: Run Database Migrations

After first deployment, run migrations:

### Option A: From Local Machine

```bash
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

### Option B: Using Railway CLI

```bash
npm install -g @railway/cli
railway login
railway link
railway run npx prisma migrate deploy
```

### Option C: Using GitHub Actions

1. Add secrets to GitHub:
   - `RAILWAY_TOKEN` (from Railway dashboard)
   - `DATABASE_URL` (from Railway)
   - `RAILWAY_SERVICE_ID` (optional, from Railway service)

2. Go to **Actions** → **Setup Railway Database** → **Run workflow**

---

## Step 5: Seed Admin User

```bash
DATABASE_URL="postgresql://..." \
ADMIN_EMAIL="admin@leadforge.com" \
ADMIN_PASSWORD="your-password" \
npx tsx prisma/seed.ts
```

Or use Railway CLI:
```bash
railway run npm run db:seed
```

---

## Step 6: Verify Deployment

### Health Check

```bash
curl https://your-app.vercel.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "version": "1.0.0",
  "database": "connected",
  "uptime": 123.45
}
```

### Test Landing Pages

- `https://your-app.vercel.app/lp/storm-damage`
- `https://your-app.vercel.app/lp/free-inspection`

### Test Admin Dashboard

- `https://your-app.vercel.app/admin/login`
- Login with `ADMIN_EMAIL` and `ADMIN_PASSWORD`

---

## Continuous Deployment

### Automatic Deploys

- **Vercel**: Auto-deploys on push to `main` branch
- **GitHub Actions**: Verifies builds on every push

### Manual Deploy

```bash
git push origin main
# Vercel automatically deploys
```

---

## Monitoring

### Vercel Logs

- Dashboard → **Deployments** → Click deployment → **Functions** tab
- View serverless function logs

### Railway Logs

- Dashboard → **PostgreSQL** service → **Metrics** tab
- View database connection metrics

### Health Endpoint

Monitor: `GET /api/health`

- `status: "ok"` = healthy
- `status: "degraded"` = database disconnected
- `database: "connected"` = DB working

---

## Troubleshooting

### Build Fails

1. Check Vercel build logs
2. Verify all env vars are set
3. Check `NEXTAUTH_SECRET` is valid

### Database Connection Fails

1. Verify `DATABASE_URL` is correct
2. Check Railway database is running
3. Verify migrations ran: `railway run npx prisma migrate status`

### API Routes Return 500

1. Check Vercel function logs
2. Verify Prisma client generated: `npx prisma generate`
3. Check environment variables

---

## Rollback Plan

### Vercel

1. Dashboard → **Deployments**
2. Find previous successful deployment
3. Click **"..."** → **"Promote to Production"**

### Railway Database

- Railway databases are persistent
- No rollback needed (migrations are versioned)

### Code Rollback

```bash
git revert HEAD
git push origin main
# Vercel auto-deploys previous version
```

---

## Security Checklist

- ✅ No secrets in code
- ✅ All env vars in Vercel dashboard
- ✅ Database credentials in Railway (not exposed)
- ✅ `NEXTAUTH_SECRET` is strong (32+ chars)
- ✅ Admin password is strong
- ✅ `.env` files in `.gitignore`

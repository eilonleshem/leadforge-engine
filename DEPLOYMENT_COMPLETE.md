# ✅ Deployment Wiring Complete

## 🎯 Architecture Overview

```
┌─────────────┐
│   GitHub    │ (Source Control + CI/CD)
└──────┬──────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌─────────────┐   ┌─────────────┐
│   Vercel    │   │   Railway   │
│             │   │             │
│ Frontend    │   │  PostgreSQL │
│ + API       │   │   Database  │
│ Routes      │   │             │
└─────────────┘   └─────────────┘
```

**Key Points:**
- **Vercel**: Hosts entire Next.js app (frontend + API routes as serverless functions)
- **Railway**: PostgreSQL database only (NOT a backend service)
- **GitHub**: Source control + triggers Vercel auto-deploy

---

## ✅ What's Configured

### GitHub ✅
- ✅ Repository: `eilonleshem/leadforge-engine`
- ✅ Branch: `main` (production)
- ✅ `.gitignore`: Excludes secrets
- ✅ CI Workflows: Auto-verify builds
- ✅ Migration files: Committed (required for Vercel)

### Vercel ✅
- ✅ Framework: Next.js (auto-detected)
- ✅ Build: `npm run build`
- ✅ API Routes: Serverless functions (auto-configured)
- ✅ Health Endpoint: `/api/health`
- ✅ Environment Variables: Set in dashboard
- ✅ Auto-deploy: On push to `main`

### Railway ✅
- ✅ Service: PostgreSQL database
- ✅ Connection: Via `DATABASE_URL`
- ✅ Migrations: Run via Prisma CLI
- ✅ No build/start needed (database only)

---

## 🚀 Deployment Status

### Current State
- ✅ **Code**: Pushed to GitHub
- ✅ **Vercel**: Project linked and configured
- ✅ **Railway**: Database created
- ✅ **Environment Variables**: Set in Vercel
- ⏳ **Migrations**: Ready to run
- ⏳ **Seed**: Ready to run

### Next Actions

#### 1. Run Migrations
```powershell
# Get DATABASE_URL from Vercel Dashboard → Settings → Environment Variables
$env:DATABASE_URL="postgresql://..."
npm run db:deploy
```

#### 2. Verify Database
```powershell
npm run db:verify
```

#### 3. Seed Admin User
```powershell
$env:ADMIN_EMAIL="admin@leadforge.com"
$env:ADMIN_PASSWORD="your-password"
npm run db:seed
```

#### 4. Verify Deployment
```bash
curl https://your-app.vercel.app/api/health
```

---

## 📋 Environment Variables Checklist

### Vercel (Required)
- [ ] `DATABASE_URL` (from Railway)
- [ ] `DIRECT_DATABASE_URL` (same as DATABASE_URL)
- [ ] `NEXTAUTH_SECRET`
- [ ] `ADMIN_EMAIL`
- [ ] `ADMIN_PASSWORD`
- [ ] `APP_BASE_URL`

### Vercel (Optional)
- [ ] `UPSTASH_REDIS_REST_URL`
- [ ] `UPSTASH_REDIS_REST_TOKEN`
- [ ] `TWILIO_ACCOUNT_SID`
- [ ] `TWILIO_AUTH_TOKEN`
- [ ] `TWILIO_FROM_NUMBER`
- [ ] `TWILIO_TRACKING_NUMBER`
- [ ] `NEXT_PUBLIC_TWILIO_TRACKING_NUMBER`

### Railway
- ✅ `DATABASE_URL` (auto-provided)

---

## ✅ Verification Commands

### Health Check
```bash
curl https://your-app.vercel.app/api/health
```

### Test API
```bash
curl -X POST https://your-app.vercel.app/api/leads \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","phone":"+15551234567","zip":"12345","homeowner":true,"issueType":"STORM","urgency":"THIS_WEEK","consent":true}'
```

### Check Railway Database
```bash
# Via Railway Dashboard
railway.app → PostgreSQL → Metrics

# Via Prisma
DATABASE_URL="postgresql://..." npx prisma migrate status
```

---

## 🔄 Continuous Deployment

### Automatic Flow
1. **Push to `main`** → GitHub receives commit
2. **Vercel detects push** → Auto-deploys
3. **Build runs** → `npm install` → `prisma generate` → `next build`
4. **Deploy** → Serverless functions + static assets

### Manual Steps (One-Time)
- ✅ Run migrations: `npm run db:deploy`
- ✅ Seed admin: `npm run db:seed`

---

## 🆘 Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify all env vars are set
- Check `NEXTAUTH_SECRET` is valid

### Database Connection Fails
- Verify `DATABASE_URL` is correct
- Check Railway database is running
- Run migrations: `npm run db:deploy`

### API Routes Return 500
- Check Vercel function logs
- Verify Prisma client generated
- Check environment variables

---

## 📚 Documentation

- **Full Guide**: `DEPLOYMENT_GUIDE.md`
- **Migration Commands**: `MIGRATION_COMMANDS.md`
- **Quick Start**: `QUICK_START.md`
- **Analysis**: `DEPLOYMENT_ANALYSIS.md`

---

**Status**: ✅ **DEPLOYMENT WIRING COMPLETE**

All systems are configured and ready. Run migrations to complete setup.

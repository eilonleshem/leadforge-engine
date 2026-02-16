# ⚡ Quick Start - Production Deployment

## Current State ✅

- ✅ **GitHub**: Repository configured with CI workflows
- ✅ **Vercel**: Configuration ready (`vercel.json`)
- ✅ **Railway**: Database configuration ready (`railway.json`)
- ✅ **Health Endpoint**: Enhanced with DB connectivity check
- ✅ **Build**: Verified working
- ✅ **No Hardcoded URLs**: All environment-based

---

## 🚀 Deploy in 5 Steps

### 1. Create Railway PostgreSQL (2 minutes)

```bash
# Go to railway.app → New Project → Add PostgreSQL
# Copy the Connection URL
```

### 2. Import to Vercel (1 minute)

```bash
# Go to vercel.com/new → Import eilonleshem/leadforge-engine
```

### 3. Add Environment Variables (3 minutes)

In Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgresql://... (from Railway)
DIRECT_DATABASE_URL=postgresql://... (same as above)
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
ADMIN_EMAIL=admin@leadforge.com
ADMIN_PASSWORD=<strong-password>
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
APP_BASE_URL=https://your-app.vercel.app
```

### 4. Deploy (automatic)

```bash
# Click "Deploy" in Vercel
# Or push to main branch
git push origin main
```

### 5. Run Migrations (1 minute)

```bash
# Option A: Railway CLI
railway login
railway link
railway run npx prisma migrate deploy

# Option B: Local
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

---

## ✅ Verify Deployment

```bash
# Health check
curl https://your-app.vercel.app/api/health

# Expected:
{
  "status": "ok",
  "database": "connected",
  "version": "1.0.0"
}
```

---

## 📋 Environment Variables Checklist

### Vercel (Required)
- [ ] `DATABASE_URL`
- [ ] `DIRECT_DATABASE_URL`
- [ ] `NEXTAUTH_SECRET`
- [ ] `ADMIN_EMAIL`
- [ ] `ADMIN_PASSWORD`
- [ ] `UPSTASH_REDIS_REST_URL`
- [ ] `UPSTASH_REDIS_REST_TOKEN`
- [ ] `APP_BASE_URL`

### Railway (Automatic)
- Database provides `DATABASE_URL` automatically
- No manual configuration needed

---

## 🔄 Continuous Deployment

- **Push to `main`** → Vercel auto-deploys
- **GitHub Actions** → Verifies builds
- **No manual steps** after initial setup

---

## 🆘 Troubleshooting

### Build Fails
→ Check Vercel logs, verify env vars

### Database Disconnected
→ Run migrations: `railway run npx prisma migrate deploy`

### Health Check Fails
→ Check Railway database is running

---

## 📚 Full Documentation

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

# ✅ Deployment Verification Guide

## 🔍 How to Check Your Deployment

### Quick Check

Run the verification script:

```powershell
.\scripts\check-deployment.ps1 -VercelUrl "https://your-app.vercel.app"
```

Or manually check:

```bash
# Health check
curl https://your-app.vercel.app/api/health

# Expected response:
{
  "status": "ok",
  "database": "connected",
  "version": "1.0.0"
}
```

---

## ✅ What to Verify

### 1. Health Endpoint ✅
- **URL**: `https://your-app.vercel.app/api/health`
- **Expected**: `{"status":"ok","database":"connected"}`
- **If fails**: Check DATABASE_URL in Vercel

### 2. Landing Pages ✅
- **URL**: `https://your-app.vercel.app/lp/storm-damage`
- **Expected**: Page loads correctly
- **URL**: `https://your-app.vercel.app/lp/free-inspection`
- **Expected**: Page loads correctly

### 3. Admin Login ✅
- **URL**: `https://your-app.vercel.app/admin/login`
- **Expected**: Login page loads
- **Test**: Login with ADMIN_EMAIL and ADMIN_PASSWORD

### 4. Database Connection ✅
- **Check**: Health endpoint shows `"database": "connected"`
- **If "disconnected"**: 
  - Verify DATABASE_URL is set in Vercel
  - Verify it's the PUBLIC connection string (not `.internal`)
  - Check Railway database is running

---

## 🔧 Common Issues

### Database Disconnected

**Symptoms**: Health endpoint shows `"database": "disconnected"`

**Solutions**:
1. Check DATABASE_URL in Vercel → Settings → Environment Variables
2. Verify it's the PUBLIC connection string (not `postgres.railway.internal`)
3. Get public URL: Railway Dashboard → PostgreSQL → Connect tab
4. Re-deploy Vercel after updating DATABASE_URL

### Health Endpoint Returns 500

**Symptoms**: Health endpoint fails or returns error

**Solutions**:
1. Check Vercel deployment logs
2. Verify all required env vars are set
3. Check NEXTAUTH_SECRET is valid
4. Verify Prisma client generated (check build logs)

### Landing Pages Don't Load

**Symptoms**: 404 or blank page

**Solutions**:
1. Check Vercel deployment succeeded
2. Verify build completed without errors
3. Check Vercel function logs

---

## 📋 Verification Checklist

After deployment:

- [ ] Health endpoint: `/api/health` → `{"status":"ok"}`
- [ ] Database: Health shows `"database":"connected"`
- [ ] Landing pages: `/lp/storm-damage` and `/lp/free-inspection` load
- [ ] Admin login: `/admin/login` loads
- [ ] Can login: Use ADMIN_EMAIL and ADMIN_PASSWORD
- [ ] Migrations run: `npm run db:deploy` (if not done yet)
- [ ] Database seeded: `npm run db:seed` (if not done yet)

---

## 🚀 Next Steps After Verification

1. ✅ Run migrations: `npm run db:deploy`
2. ✅ Seed admin user: `npm run db:seed`
3. ✅ Test lead submission on landing page
4. ✅ Test OTP verification
5. ✅ Test admin dashboard

---

**Status**: Use the verification script or manual checks above to verify your deployment!

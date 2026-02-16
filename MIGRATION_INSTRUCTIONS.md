# 🗄️ Database Migration Instructions

## ✅ Status

- ✅ **Git pushed to GitHub** - Auto-deploy triggered
- ✅ **Prisma schema fixed** - `directUrl` is now optional
- ⏳ **Migrations pending** - Need DATABASE_URL

---

## 🚀 Run Migrations - Choose Your Method

### Method 1: Railway CLI (Recommended)

**If you have Railway project with PostgreSQL:**

```bash
# 1. Link to Railway project
railway link

# 2. Run migrations
railway run npx prisma migrate deploy

# 3. Seed database (optional)
railway run npm run db:seed
```

---

### Method 2: Direct DATABASE_URL

**If you have DATABASE_URL from Railway dashboard:**

```bash
# PowerShell
$env:DATABASE_URL="postgresql://..."
npx prisma migrate deploy

# Or use the script
.\scripts\run-migrations.ps1 -DatabaseUrl "postgresql://..."
```

---

### Method 3: GitHub Actions (Automated)

**If you set up Railway secrets in GitHub:**

1. Go to GitHub → **Settings** → **Secrets and variables** → **Actions**
2. Add secrets:
   - `RAILWAY_TOKEN` (from Railway dashboard)
   - `DATABASE_URL` (from Railway PostgreSQL)
   - `RAILWAY_SERVICE_ID` (optional)

3. Go to **Actions** → **Setup Railway Database** → **Run workflow**

---

### Method 4: Vercel Post-Deploy Hook

**After Vercel deployment, migrations run automatically if:**
- `DATABASE_URL` is set in Vercel
- Vercel build includes migration step

**To enable, add to `package.json`:**
```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

---

## 📋 Step-by-Step: Create Railway Database First

If you don't have Railway database yet:

1. **Go to [railway.app](https://railway.app)**
2. **Create new project** → **"New"** → **"Database"** → **"Add PostgreSQL"**
3. **Copy Connection URL** (starts with `postgresql://`)
4. **Run migrations:**

```bash
# Set DATABASE_URL
$env:DATABASE_URL="postgresql://user:pass@host:port/railway"

# Run migrations
npx prisma migrate deploy

# Seed database
$env:ADMIN_EMAIL="admin@leadforge.com"
$env:ADMIN_PASSWORD="your-password"
npx tsx prisma/seed.ts
```

---

## ✅ Verify Migrations

```bash
# Check migration status
npx prisma migrate status

# Should show: "Database schema is up to date!"
```

---

## 🔍 Current Status

- ✅ Code pushed to GitHub
- ✅ Vercel will auto-deploy (if project is linked)
- ⏳ Migrations: **Waiting for DATABASE_URL**

**Next step:** Create Railway PostgreSQL database and run migrations using one of the methods above.

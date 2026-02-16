# 🚂 Railway Database - Quick Setup

## ✅ Current Status

- ✅ **Git pushed** - Code is on GitHub
- ✅ **Railway project linked** - `intuitive-friendship`
- ⏳ **Need PostgreSQL service** - To run migrations

---

## 🚀 Create PostgreSQL Database (2 minutes)

### Option 1: Via Railway Dashboard (Easiest)

1. **Go to [railway.app](https://railway.app)**
2. **Open project**: `intuitive-friendship`
3. **Click "+ New"** → **"Database"** → **"Add PostgreSQL"**
4. Railway creates database automatically
5. **Copy the Connection URL** (starts with `postgresql://`)

### Option 2: Via Railway CLI

```bash
# Create PostgreSQL service
railway add postgresql

# Get connection URL
railway variables --service postgresql
```

---

## 🗄️ Run Migrations

After PostgreSQL is created, run:

```bash
# Method 1: Via Railway (if service is linked)
railway service postgresql
railway run npx prisma migrate deploy

# Method 2: Direct DATABASE_URL
$env:DATABASE_URL="postgresql://..."
npx prisma migrate deploy

# Method 3: Use the script
.\scripts\setup-railway-db.ps1
```

---

## 📋 Complete Setup Checklist

- [ ] PostgreSQL service created in Railway
- [ ] DATABASE_URL copied from Railway
- [ ] Migrations run: `railway run npx prisma migrate deploy`
- [ ] Database seeded: `railway run npm run db:seed`
- [ ] DATABASE_URL added to Vercel environment variables

---

## 🔍 Verify

```bash
# Check migration status
railway run npx prisma migrate status

# Should show: "Database schema is up to date!"
```

---

**Next:** Once PostgreSQL is created, I can run the migrations automatically! 🚀

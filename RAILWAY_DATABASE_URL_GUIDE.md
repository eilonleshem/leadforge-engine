# 🔍 Railway DATABASE_URL - Verification Guide

## ✅ What You're Seeing is CORRECT

The Railway dashboard shows:
- ✅ `DATABASE_URL` variable exists
- ✅ PostgreSQL connection string is set
- ✅ Railway automatically provides this for PostgreSQL services

---

## ⚠️ Important: Internal vs Public URL

### Current Value (Internal)
```
postgresql://postgres:...@postgres.railway.internal:5432/railway
```

**Problem**: `postgres.railway.internal` is an **internal hostname** that only works within Railway's network.

**For Vercel**: You need the **public connection string**.

---

## 🔧 How to Get the Public DATABASE_URL

### Method 1: Railway Dashboard (Recommended)

1. Go to Railway Dashboard
2. Click on your **PostgreSQL service**
3. Go to **"Connect"** or **"Variables"** tab
4. Look for **"Public Network"** or **"Connection URL"**
5. Copy the **public connection string** (should have a public hostname, not `.internal`)

### Method 2: Railway CLI

```bash
railway variables --service postgresql
# Look for DATABASE_URL with public hostname
```

### Method 3: Railway Dashboard → PostgreSQL → Connect

1. Click on PostgreSQL service
2. Click **"Connect"** tab
3. Look for **"Connection String"** or **"Public URL"**
4. Copy the public connection string

---

## ✅ Correct DATABASE_URL Format for Vercel

### Internal (Railway only - ❌ Don't use for Vercel)
```
postgresql://postgres:...@postgres.railway.internal:5432/railway
```

### Public (Use this for Vercel - ✅)
```
postgresql://postgres:...@containers-us-west-xxx.railway.app:5432/railway
# OR
postgresql://postgres:...@[public-ip]:5432/railway
```

**Key Difference**: Public URL has a public hostname (not `.internal`)

---

## 📋 Steps to Fix

### Step 1: Get Public DATABASE_URL from Railway

1. Railway Dashboard → PostgreSQL service
2. **"Connect"** tab or **"Variables"** tab
3. Find **"Public Connection URL"** or **"Connection String"**
4. Copy the public URL (has public hostname, not `.internal`)

### Step 2: Add to Vercel

1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `DATABASE_URL` with the **public connection string**
3. Set for **Production**, **Preview**, and **Development**

### Step 3: Verify

```bash
# Test connection from your local machine
DATABASE_URL="postgresql://..." npx prisma migrate status
```

---

## 🔍 How to Identify Public vs Internal

| Type | Hostname Pattern | Works In |
|------|------------------|----------|
| **Internal** | `postgres.railway.internal` | Railway network only |
| **Public** | `containers-us-west-xxx.railway.app` | Internet (Vercel, local, etc.) |
| **Public** | `[ip-address]` | Internet (Vercel, local, etc.) |

---

## ✅ Verification Checklist

- [ ] Found public DATABASE_URL in Railway (not `.internal`)
- [ ] Copied public DATABASE_URL
- [ ] Added to Vercel environment variables
- [ ] Tested connection: `npx prisma migrate status`
- [ ] Health endpoint shows: `"database": "connected"`

---

## 🆘 Troubleshooting

### "Connection refused" in Vercel
- **Cause**: Using internal URL (`.internal`)
- **Solution**: Use public connection string

### "Connection timeout" in Vercel
- **Cause**: Railway database not accessible publicly
- **Solution**: Check Railway PostgreSQL service → Enable public access

### Can't find public URL
- **Solution**: Railway Dashboard → PostgreSQL → Connect tab → Look for "Public Network" toggle

---

**Status**: The DATABASE_URL exists, but make sure you're using the **public** connection string for Vercel!

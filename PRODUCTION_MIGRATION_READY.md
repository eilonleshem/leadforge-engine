# ✅ Production Migration - Ready to Execute

## Status: READY

All prerequisites verified and scripts prepared.

---

## ✅ Verification Complete

### 1. Prisma Schema
- ✅ **Status**: Valid
- ✅ **Location**: `prisma/schema.prisma`
- ✅ **Models**: Lead, Buyer, Call, Delivery, AdminUser
- ✅ **Enums**: All defined correctly
- ✅ **Indexes**: All configured
- ✅ **Relations**: All foreign keys defined

### 2. Prisma Client Generation
- ✅ **Status**: Working
- ✅ **Command**: `npm run db:generate` ✅
- ✅ **Postinstall**: Auto-runs on `npm install`

### 3. Prisma Singleton Pattern
- ✅ **Status**: Implemented correctly
- ✅ **File**: `src/lib/prisma.ts`
- ✅ **Serverless-safe**: Uses `globalThis` pattern
- ✅ **Connection pooling**: Handled by Prisma

### 4. Migration Files
- ✅ **Status**: Ready
- ✅ **Location**: `prisma/migrations/20240301000000_init/`
- ✅ **Lock file**: `prisma/migrations/migration_lock.toml`

### 5. Package.json Scripts
- ✅ `db:generate` - Generate Prisma Client
- ✅ `db:deploy` - Deploy migrations (production)
- ✅ `db:status` - Check migration status
- ✅ `db:verify` - Verify all tables exist

---

## 🚀 Execute Migrations - Choose Your Method

### Method 1: Automated Script (Recommended)

**PowerShell:**
```powershell
# Get DATABASE_URL from Vercel Dashboard → Settings → Environment Variables
.\scripts\run-production-migrations.ps1 -DatabaseUrl "postgresql://..."
```

**Bash/Linux/Mac:**
```bash
./scripts/run-production-migrations.sh "postgresql://..."
```

### Method 2: Manual Commands

**PowerShell:**
```powershell
# 1. Set DATABASE_URL
$env:DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# 2. Generate Prisma Client
npm run db:generate

# 3. Deploy migrations
npm run db:deploy

# 4. Verify tables
npm run db:verify

# 5. Clear DATABASE_URL (security)
Remove-Item Env:\DATABASE_URL
```

**CMD:**
```cmd
REM 1. Set DATABASE_URL
set DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

REM 2. Generate Prisma Client
npm run db:generate

REM 3. Deploy migrations
npm run db:deploy

REM 4. Verify tables
npm run db:verify

REM 5. Clear DATABASE_URL
set DATABASE_URL=
```

### Method 3: Railway CLI

```bash
railway service postgresql
railway run npm run db:deploy
railway run npm run db:verify
```

---

## 📋 What Will Be Created

Running `npm run db:deploy` will create:

### Tables (5)
1. ✅ **Lead** - Lead records with all fields
2. ✅ **Buyer** - Buyer configurations
3. ✅ **Call** - Call tracking records
4. ✅ **Delivery** - Lead delivery logs
5. ✅ **AdminUser** - Admin authentication

### Enums (6)
1. ✅ LeadType (FORM, CALL)
2. ✅ LeadStatus (PENDING_OTP, VERIFIED, QUALIFIED_CALL, etc.)
3. ✅ IssueType (STORM, LEAK, REPLACE, OTHER)
4. ✅ Urgency (TODAY, THIS_WEEK, THIS_MONTH)
5. ✅ DeliveryType (WEBHOOK, EMAIL)
6. ✅ DeliveryStatus (SENT, FAILED, RETRY, PENDING)

### Indexes (12)
- Lead: `(phone, zip)`, `createdAt`, `status`, `type`
- Call: `fromNumber`, `createdAt`, `sid`
- Buyer: `isActive`
- Delivery: `leadId`, `buyerId`, `status`, `createdAt`
- AdminUser: `email`

### Foreign Keys (4)
- Lead → Lead (duplicates)
- Call → Lead
- Delivery → Lead
- Delivery → Buyer

---

## ✅ Verification Checklist

After running migrations:

```powershell
# 1. Check migration status
npx prisma migrate status
# Expected: "Database schema is up to date!"

# 2. Verify all tables exist
npm run db:verify
# Expected: All 5 tables listed with ✅

# 3. Test health endpoint (after Vercel deploy)
curl https://your-app.vercel.app/api/health
# Expected: { "database": "connected" }
```

---

## 🔒 Security: Setting DATABASE_URL Safely

### PowerShell - Secure Method

```powershell
# Method 1: Read securely (password hidden)
$secure = Read-Host "Enter DATABASE_URL" -AsSecureString
$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
$env:DATABASE_URL = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)

# Method 2: From Vercel CLI (if installed)
npx vercel env pull .env.production.local
Get-Content .env.production.local | ForEach-Object {
    if ($_ -match '^DATABASE_URL=(.+)$') {
        $env:DATABASE_URL = $matches[1]
    }
}
```

### CMD - Secure Method

```cmd
REM Create temporary file (delete after use!)
REM temp-db-url.bat:
@echo off
set DATABASE_URL=postgresql://...
call npm run db:deploy
set DATABASE_URL=
del temp-db-url.bat
```

**⚠️ Never commit files with DATABASE_URL!**

---

## 🎯 Quick Start (Copy & Paste)

### Get DATABASE_URL from Vercel

1. Go to: Vercel Dashboard → Your Project → Settings → Environment Variables
2. Copy `DATABASE_URL` value
3. Run:

```powershell
# Paste your DATABASE_URL here
$env:DATABASE_URL="postgresql://..."

# Run migrations
npm run db:deploy

# Verify
npm run db:verify
```

---

## 📊 Expected Output

### Successful Migration:
```
✅ Schema is valid
✅ Prisma Client generated
✅ Migrations deployed successfully!
✅ Lead table exists (0 records)
✅ Buyer table exists (0 records)
✅ Call table exists (0 records)
✅ Delivery table exists (0 records)
✅ AdminUser table exists (0 records)
✅ All tables verified successfully!
```

---

## 🆘 Troubleshooting

| Error | Solution |
|-------|----------|
| `Environment variable not found: DATABASE_URL` | Set `$env:DATABASE_URL="postgresql://..."` |
| `Migration X already applied` | Normal - migrations are idempotent |
| `Connection refused` | Check DATABASE_URL, verify Railway DB is running |
| `Table already exists` | Check status: `npx prisma migrate status` |

---

## ✅ Confirmation

**Yes, `npm run db:deploy` will:**
- ✅ Create all 5 tables
- ✅ Create all 6 enums
- ✅ Create all 12 indexes
- ✅ Create all 4 foreign keys
- ✅ Safe to run multiple times (idempotent)

**Prisma singleton is production-ready:**
- ✅ Serverless-safe (Vercel compatible)
- ✅ Connection pooling handled
- ✅ No connection explosion risk

---

**Status**: ✅ **READY TO EXECUTE**

Run the commands above to deploy migrations to production!

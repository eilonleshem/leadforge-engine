# 🗄️ Production Migration Commands

## ✅ Prerequisites Verified

- ✅ Prisma schema is valid
- ✅ `prisma generate` works correctly
- ✅ Prisma singleton pattern implemented (serverless-safe)
- ✅ Migration files exist in `prisma/migrations/`

---

## 🚀 Run Migrations - Exact Commands

### Method 1: PowerShell (Recommended)

#### Step 1: Get DATABASE_URL from Vercel

**Option A - From Vercel Dashboard:**
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Copy `DATABASE_URL` value

**Option B - From Railway Dashboard:**
1. Go to Railway Dashboard → PostgreSQL service
2. Copy Connection URL

#### Step 2: Set DATABASE_URL Temporarily

```powershell
# Set DATABASE_URL for current PowerShell session
$env:DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Verify it's set (password will be hidden)
Write-Host "DATABASE_URL is set: $($env:DATABASE_URL -replace ':[^:@]+@', ':****@')"
```

#### Step 3: Run Migrations

```powershell
# Generate Prisma Client (if needed)
npm run db:generate

# Deploy migrations to production
npm run db:deploy

# Or use npx directly
npx prisma migrate deploy
```

#### Step 4: Verify Database

```powershell
# Check migration status
npx prisma migrate status

# Verify tables exist
npm run db:verify
```

---

### Method 2: CMD (Windows Command Prompt)

#### Step 1: Set DATABASE_URL

```cmd
REM Set DATABASE_URL for current CMD session
set DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

REM Verify (password will be visible - be careful!)
echo %DATABASE_URL%
```

#### Step 2: Run Migrations

```cmd
REM Generate Prisma Client
npm run db:generate

REM Deploy migrations
npm run db:deploy
```

#### Step 3: Verify

```cmd
npx prisma migrate status
npm run db:verify
```

---

### Method 3: Railway CLI (If Project is Linked)

```bash
# Link to Railway project (if not already linked)
railway link

# Select PostgreSQL service
railway service postgresql

# Run migrations
railway run npm run db:deploy

# Verify
railway run npm run db:verify
```

---

## 🔒 Security: Setting DATABASE_URL Safely

### PowerShell - Secure Method

```powershell
# Method 1: Read from secure input (password hidden)
$secure = Read-Host "Enter DATABASE_URL" -AsSecureString
$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
$env:DATABASE_URL = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)

# Method 2: From file (create .env.local, then)
Get-Content .env.local | ForEach-Object {
    if ($_ -match '^DATABASE_URL=(.+)$') {
        $env:DATABASE_URL = $matches[1]
    }
}
```

### CMD - Secure Method

```cmd
REM Create a temporary batch file (do NOT commit!)
REM save-db-url.bat:
@echo off
set DATABASE_URL=postgresql://...
call npm run db:deploy
set DATABASE_URL=

REM Then delete the file immediately after use
```

**⚠️ Important:** Never commit files containing DATABASE_URL!

---

## ✅ Verification Checklist

After running migrations, verify:

```powershell
# 1. Check migration status
npx prisma migrate status
# Expected: "Database schema is up to date!"

# 2. Verify tables exist
npm run db:verify
# Expected: All tables listed with ✅

# 3. Test connection
npx prisma db execute --stdin
# Type: SELECT 1;
# Expected: Returns 1
```

---

## 📋 What `prisma migrate deploy` Will Create

Running `npx prisma migrate deploy` will create:

1. ✅ **Enums:**
   - `LeadType` (FORM, CALL)
   - `LeadStatus` (PENDING_OTP, VERIFIED, QUALIFIED_CALL, etc.)
   - `IssueType` (STORM, LEAK, REPLACE, OTHER)
   - `Urgency` (TODAY, THIS_WEEK, THIS_MONTH)
   - `DeliveryType` (WEBHOOK, EMAIL)
   - `DeliveryStatus` (SENT, FAILED, RETRY, PENDING)

2. ✅ **Tables:**
   - `Lead` (with all fields + indexes)
   - `Call` (with all fields + indexes)
   - `Buyer` (with all fields + indexes)
   - `Delivery` (with all fields + indexes)
   - `AdminUser` (with all fields + indexes)

3. ✅ **Indexes:**
   - Lead: `(phone, zip)`, `createdAt`, `status`, `type`
   - Call: `fromNumber`, `createdAt`, `sid`
   - Buyer: `isActive`
   - Delivery: `leadId`, `buyerId`, `status`, `createdAt`
   - AdminUser: `email`

4. ✅ **Foreign Keys:**
   - Lead → Lead (duplicates)
   - Call → Lead
   - Delivery → Lead
   - Delivery → Buyer

---

## 🎯 Complete Migration Workflow

### One-Time Setup (Production)

```powershell
# 1. Set DATABASE_URL
$env:DATABASE_URL="postgresql://..."

# 2. Generate Prisma Client
npm run db:generate

# 3. Deploy migrations
npm run db:deploy

# 4. Verify tables
npm run db:verify

# 5. Seed admin user (optional)
$env:ADMIN_EMAIL="admin@leadforge.com"
$env:ADMIN_PASSWORD="your-password"
npm run db:seed

# 6. Clear DATABASE_URL from session
Remove-Item Env:\DATABASE_URL
```

---

## 🔍 Troubleshooting

### Error: "Environment variable not found: DATABASE_URL"

**Solution:**
```powershell
# Set it before running command
$env:DATABASE_URL="postgresql://..."
npx prisma migrate deploy
```

### Error: "Migration X already applied"

**Solution:** This is normal. Migrations are idempotent. Safe to ignore.

### Error: "Table already exists"

**Solution:** Migration was partially applied. Check status:
```powershell
npx prisma migrate status
```

### Error: "Connection refused"

**Solution:** 
- Verify DATABASE_URL is correct
- Check Railway database is running
- Verify network/firewall allows connection

---

## 📝 Quick Reference

| Command | Purpose |
|--------|---------|
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:deploy` | Deploy migrations (production) |
| `npm run db:status` | Check migration status |
| `npm run db:verify` | Verify all tables exist |
| `npm run db:seed` | Seed admin user |

---

## ✅ Confirmation

**Yes, running `npx prisma migrate deploy` will:**
- ✅ Create all tables (Lead, Buyer, Call, Delivery, AdminUser)
- ✅ Create all indexes
- ✅ Create all foreign keys
- ✅ Create all enums
- ✅ Apply all migrations from `prisma/migrations/`

**Safe to run multiple times:** Migrations are idempotent - safe to re-run.

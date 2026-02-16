# Production Migration Script for LeadForge Engine
# Safely runs Prisma migrations against Railway PostgreSQL database

param(
    [Parameter(Mandatory=$false)]
    [string]$DatabaseUrl = $env:DATABASE_URL
)

Write-Host "🗄️  LeadForge Engine - Production Migration" -ForegroundColor Cyan
Write-Host ""

# Check if DATABASE_URL is provided
if (-not $DatabaseUrl) {
    Write-Host "❌ DATABASE_URL is required" -ForegroundColor Red
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\scripts\run-production-migrations.ps1 -DatabaseUrl 'postgresql://...'" -ForegroundColor White
    Write-Host ""
    Write-Host "Or set environment variable:" -ForegroundColor Yellow
    Write-Host "  `$env:DATABASE_URL='postgresql://...'" -ForegroundColor White
    Write-Host "  .\scripts\run-production-migrations.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "To get DATABASE_URL:" -ForegroundColor Cyan
    Write-Host "  1. Vercel Dashboard → Settings → Environment Variables" -ForegroundColor Gray
    Write-Host "  2. Railway Dashboard → PostgreSQL → Connection URL" -ForegroundColor Gray
    exit 1
}

# Mask password in output
$maskedUrl = $DatabaseUrl -replace ':[^:@]+@', ':****@'
Write-Host "📊 Database: $maskedUrl" -ForegroundColor Green
Write-Host ""

# Set environment variable
$env:DATABASE_URL = $DatabaseUrl

# Step 1: Validate Prisma schema
Write-Host "1️⃣  Validating Prisma schema..." -ForegroundColor Yellow
$validate = npx prisma validate 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Schema validation failed!" -ForegroundColor Red
    Write-Host $validate
    exit 1
}
Write-Host "✅ Schema is valid" -ForegroundColor Green
Write-Host ""

# Step 2: Generate Prisma Client
Write-Host "2️⃣  Generating Prisma Client..." -ForegroundColor Yellow
$generate = npm run db:generate 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prisma Client generation failed!" -ForegroundColor Red
    Write-Host $generate
    exit 1
}
Write-Host "✅ Prisma Client generated" -ForegroundColor Green
Write-Host ""

# Step 3: Check migration status
Write-Host "3️⃣  Checking migration status..." -ForegroundColor Yellow
$status = npx prisma migrate status 2>&1
Write-Host $status
Write-Host ""

# Step 4: Deploy migrations
Write-Host "4️⃣  Deploying migrations to production..." -ForegroundColor Yellow
Write-Host "⚠️  This will create/modify tables in the production database!" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Continue? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "❌ Migration cancelled" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🚀 Running migrations..." -ForegroundColor Cyan
$deploy = npm run db:deploy 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Migrations deployed successfully!" -ForegroundColor Green
    Write-Host ""
    
    # Step 5: Verify database
    Write-Host "5️⃣  Verifying database tables..." -ForegroundColor Yellow
    $verify = npm run db:verify 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Database verification complete!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "⚠️  Verification had issues (check output above)" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "🎉 Migration process complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  - Seed admin user: npm run db:seed" -ForegroundColor White
    Write-Host "  - Verify in Vercel: Check /api/health endpoint" -ForegroundColor White
    
} else {
    Write-Host ""
    Write-Host "❌ Migration failed!" -ForegroundColor Red
    Write-Host $deploy
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  1. Verify DATABASE_URL is correct" -ForegroundColor White
    Write-Host "  2. Check Railway database is running" -ForegroundColor White
    Write-Host "  3. Verify network connectivity" -ForegroundColor White
    exit 1
}

# Clear DATABASE_URL from environment (security)
Remove-Item Env:\DATABASE_URL
Write-Host ""
Write-Host "🔒 DATABASE_URL cleared from environment" -ForegroundColor Green

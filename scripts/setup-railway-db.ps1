# Setup Railway Database and Run Migrations
# This script helps you set up Railway PostgreSQL and run migrations

Write-Host "🚂 Railway Database Setup" -ForegroundColor Cyan
Write-Host ""

# Check if Railway CLI is installed
if (-not (Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Railway CLI not found. Installing..." -ForegroundColor Red
    npm install -g @railway/cli
}

# Check if logged in
Write-Host "Checking Railway authentication..." -ForegroundColor Yellow
$whoami = railway whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not logged in to Railway. Please run: railway login" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Logged in: $($whoami -replace '.*Logged in as ', '')" -ForegroundColor Green
Write-Host ""

# Check if project is linked
Write-Host "Checking Railway project link..." -ForegroundColor Yellow
$status = railway status 2>&1
if ($status -match "No linked project") {
    Write-Host "⚠️  No Railway project linked." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please do one of the following:" -ForegroundColor Cyan
    Write-Host "1. Link existing project: railway link" -ForegroundColor White
    Write-Host "2. Create new PostgreSQL database in Railway dashboard:" -ForegroundColor White
    Write-Host "   - Go to railway.app" -ForegroundColor Gray
    Write-Host "   - New Project → Database → Add PostgreSQL" -ForegroundColor Gray
    Write-Host "   - Copy the Connection URL" -ForegroundColor Gray
    Write-Host "   - Then run: railway link" -ForegroundColor Gray
    Write-Host ""
    Write-Host "After linking, run this script again." -ForegroundColor Yellow
    exit 0
}

Write-Host "✅ Project linked" -ForegroundColor Green
Write-Host ""

# Try to get DATABASE_URL from Railway
Write-Host "Fetching DATABASE_URL from Railway..." -ForegroundColor Yellow
try {
    # Try to get variables (might need service selection)
    $dbUrl = railway variables --json 2>&1 | ConvertFrom-Json | Where-Object { $_.name -eq "DATABASE_URL" } | Select-Object -ExpandProperty value -First 1
    
    if ($dbUrl) {
        Write-Host "✅ Found DATABASE_URL in Railway" -ForegroundColor Green
        $env:DATABASE_URL = $dbUrl
    } else {
        Write-Host "⚠️  DATABASE_URL not found in Railway variables" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Please ensure:" -ForegroundColor Cyan
        Write-Host "1. PostgreSQL service exists in Railway project" -ForegroundColor White
        Write-Host "2. DATABASE_URL is set in Railway (usually auto-set for PostgreSQL)" -ForegroundColor White
        Write-Host ""
        Write-Host "To set manually:" -ForegroundColor Yellow
        Write-Host "  railway variables set DATABASE_URL='postgresql://...'" -ForegroundColor Gray
        exit 1
    }
} catch {
    Write-Host "⚠️  Could not fetch variables. You may need to:" -ForegroundColor Yellow
    Write-Host "   1. Select a service: railway service <service-name>" -ForegroundColor White
    Write-Host "   2. Or set DATABASE_URL manually" -ForegroundColor White
    Write-Host ""
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Run migrations
Write-Host ""
Write-Host "🚀 Running Prisma migrations..." -ForegroundColor Cyan
railway run npx prisma migrate deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Migrations completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Seed database: railway run npm run db:seed" -ForegroundColor White
    Write-Host "2. Verify: railway run npx prisma migrate status" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Migration failed!" -ForegroundColor Red
    Write-Host "Check the error above and ensure DATABASE_URL is correct." -ForegroundColor Yellow
    exit 1
}

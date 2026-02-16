# Run Prisma Migrations (PowerShell)
# Usage: .\scripts\run-migrations.ps1 [DATABASE_URL]

param(
    [string]$DatabaseUrl = $env:DATABASE_URL
)

if (-not $DatabaseUrl) {
    Write-Host "❌ Error: DATABASE_URL is required" -ForegroundColor Red
    Write-Host "Usage: .\scripts\run-migrations.ps1 -DatabaseUrl 'postgresql://...'"
    Write-Host "Or set DATABASE_URL environment variable"
    exit 1
}

Write-Host "🚀 Running Prisma migrations..." -ForegroundColor Green
$maskedUrl = $DatabaseUrl -replace ':[^:@]+@', ':****@'
Write-Host "Database: $maskedUrl"

# Set environment variable for this session
$env:DATABASE_URL = $DatabaseUrl

# Run migrations
npx prisma migrate deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migrations completed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Migration failed!" -ForegroundColor Red
    exit 1
}

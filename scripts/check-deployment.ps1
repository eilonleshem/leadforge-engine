# Check Deployment Status
# This script helps verify that the deployment is working correctly

param(
    [Parameter(Mandatory=$false)]
    [string]$VercelUrl = ""
)

Write-Host "🔍 LeadForge Engine - Deployment Status Check" -ForegroundColor Cyan
Write-Host ""

if (-not $VercelUrl) {
    Write-Host "⚠️  Vercel URL not provided" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Cyan
    Write-Host "  .\scripts\check-deployment.ps1 -VercelUrl 'https://your-app.vercel.app'" -ForegroundColor White
    Write-Host ""
    Write-Host "Or set environment variable:" -ForegroundColor Cyan
    Write-Host "  `$env:VERCEL_URL='https://your-app.vercel.app'" -ForegroundColor White
    Write-Host "  .\scripts\check-deployment.ps1" -ForegroundColor White
    exit 1
}

$url = $VercelUrl.TrimEnd('/')

Write-Host "📊 Checking: $url" -ForegroundColor Green
Write-Host ""

# 1. Health Check
Write-Host "1️⃣  Health Endpoint Check..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "$url/api/health" -Method Get -ErrorAction Stop
    Write-Host "✅ Health endpoint is working" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    $healthResponse | ConvertTo-Json -Depth 3
    Write-Host ""
    
    # Check database status
    if ($healthResponse.database -eq "connected") {
        Write-Host "✅ Database: Connected" -ForegroundColor Green
    } elseif ($healthResponse.database -eq "disconnected") {
        Write-Host "❌ Database: Disconnected" -ForegroundColor Red
        Write-Host "   Check DATABASE_URL in Vercel environment variables" -ForegroundColor Yellow
    } elseif ($healthResponse.database -eq "not_configured") {
        Write-Host "⚠️  Database: Not configured" -ForegroundColor Yellow
        Write-Host "   DATABASE_URL not set in Vercel" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Health endpoint failed!" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "   Possible causes:" -ForegroundColor Yellow
    Write-Host "   - Application not deployed yet" -ForegroundColor White
    Write-Host "   - Wrong URL" -ForegroundColor White
    Write-Host "   - Deployment failed" -ForegroundColor White
    exit 1
}

Write-Host ""

# 2. Landing Pages Check
Write-Host "2️⃣  Landing Pages Check..." -ForegroundColor Yellow
$landingPages = @(
    @{ Path = "/lp/storm-damage"; Name = "Storm Damage" },
    @{ Path = "/lp/free-inspection"; Name = "Free Inspection" }
)

foreach ($page in $landingPages) {
    try {
        $response = Invoke-WebRequest -Uri "$url$($page.Path)" -Method Get -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $($page.Name): OK (200)" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $($page.Name): Status $($response.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ $($page.Name): Failed" -ForegroundColor Red
        Write-Host "   Error: $_" -ForegroundColor Red
    }
}

Write-Host ""

# 3. Admin Login Check
Write-Host "3️⃣  Admin Login Page Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$url/admin/login" -Method Get -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Admin Login: OK (200)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Admin Login: Status $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Admin Login: Failed" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
}

Write-Host ""

# 4. API Endpoint Check
Write-Host "4️⃣  API Endpoint Check..." -ForegroundColor Yellow
try {
    # Test leads endpoint (will fail validation, but tests if endpoint exists)
    $testBody = @{
        test = "data"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$url/api/leads" -Method Post -Body $testBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "⚠️  API Endpoint: Unexpected success (should fail validation)" -ForegroundColor Yellow
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 400 -or $statusCode -eq 422) {
        Write-Host "✅ API Endpoint: Working (validation error expected)" -ForegroundColor Green
    } elseif ($statusCode -eq 401 -or $statusCode -eq 403) {
        Write-Host "✅ API Endpoint: Working (auth required)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  API Endpoint: Status $statusCode" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎉 Deployment check complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  - Health: $($healthResponse.status)" -ForegroundColor White
Write-Host "  - Database: $($healthResponse.database)" -ForegroundColor White
Write-Host "  - Version: $($healthResponse.version)" -ForegroundColor White
Write-Host ""

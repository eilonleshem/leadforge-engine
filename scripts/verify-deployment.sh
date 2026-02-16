#!/bin/bash
# Deployment Verification Script
# Usage: ./scripts/verify-deployment.sh <APP_URL>

APP_URL="${1:-https://your-app.vercel.app}"

echo "🔍 Verifying deployment: $APP_URL"
echo ""

# Health check
echo "1. Health Endpoint:"
HEALTH=$(curl -s "$APP_URL/api/health")
echo "$HEALTH" | jq '.' 2>/dev/null || echo "$HEALTH"
echo ""

# Check database status
DB_STATUS=$(echo "$HEALTH" | grep -o '"database":"[^"]*"' | cut -d'"' -f4)
if [ "$DB_STATUS" = "connected" ]; then
  echo "✅ Database: Connected"
elif [ "$DB_STATUS" = "disconnected" ]; then
  echo "❌ Database: Disconnected"
else
  echo "⚠️  Database: Not configured"
fi
echo ""

# Landing pages
echo "2. Landing Pages:"
curl -s -o /dev/null -w "  /lp/storm-damage: %{http_code}\n" "$APP_URL/lp/storm-damage"
curl -s -o /dev/null -w "  /lp/free-inspection: %{http_code}\n" "$APP_URL/lp/free-inspection"
echo ""

# Admin login
echo "3. Admin Dashboard:"
curl -s -o /dev/null -w "  /admin/login: %{http_code}\n" "$APP_URL/admin/login"
echo ""

echo "✅ Verification complete!"

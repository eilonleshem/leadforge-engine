#!/bin/bash
# API Testing Script
# Usage: ./scripts/test-api.sh <APP_URL>

APP_URL="${1:-https://your-app.vercel.app}"

echo "🧪 Testing API endpoints: $APP_URL"
echo ""

# Health check
echo "GET /api/health"
curl -s "$APP_URL/api/health" | jq '.' 2>/dev/null || curl -s "$APP_URL/api/health"
echo ""
echo ""

# Test lead submission (will fail without proper data, but tests endpoint)
echo "POST /api/leads (test - will fail validation)"
curl -s -X POST "$APP_URL/api/leads" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}' | jq '.' 2>/dev/null || curl -s -X POST "$APP_URL/api/leads" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
echo ""
echo ""

echo "✅ API tests complete!"

#!/bin/bash
# Railway Environment Variables Setup Script
# Usage: ./scripts/setup-railway-env.sh

# Install Railway CLI if not installed
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login to Railway
railway login

# Link to project (or create new)
railway link

# Set environment variables
echo "Setting environment variables..."

railway variables set DATABASE_URL="$DATABASE_URL"
railway variables set NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
railway variables set ADMIN_EMAIL="$ADMIN_EMAIL"
railway variables set ADMIN_PASSWORD="$ADMIN_PASSWORD"
railway variables set UPSTASH_REDIS_REST_URL="$UPSTASH_REDIS_REST_URL"
railway variables set UPSTASH_REDIS_REST_TOKEN="$UPSTASH_REDIS_REST_TOKEN"
railway variables set APP_BASE_URL="$APP_BASE_URL"

# Optional Twilio variables
if [ -n "$TWILIO_ACCOUNT_SID" ]; then
    railway variables set TWILIO_ACCOUNT_SID="$TWILIO_ACCOUNT_SID"
    railway variables set TWILIO_AUTH_TOKEN="$TWILIO_AUTH_TOKEN"
    railway variables set TWILIO_FROM_NUMBER="$TWILIO_FROM_NUMBER"
    railway variables set TWILIO_TRACKING_NUMBER="$TWILIO_TRACKING_NUMBER"
fi

echo "✅ Environment variables set successfully!"

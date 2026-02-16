#!/bin/bash
# Run Prisma Migrations
# Usage: ./scripts/run-migrations.sh [DATABASE_URL]

DATABASE_URL="${1:-$DATABASE_URL}"

if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL is required"
  echo "Usage: ./scripts/run-migrations.sh postgresql://..."
  echo "Or set DATABASE_URL environment variable"
  exit 1
fi

echo "🚀 Running Prisma migrations..."
echo "Database: ${DATABASE_URL%%@*}@***" # Hide password

# Run migrations
npx prisma migrate deploy

if [ $? -eq 0 ]; then
  echo "✅ Migrations completed successfully!"
else
  echo "❌ Migration failed!"
  exit 1
fi

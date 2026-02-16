#!/bin/bash
# Production Migration Script for LeadForge Engine
# Safely runs Prisma migrations against Railway PostgreSQL database

set -e

DATABASE_URL="${1:-$DATABASE_URL}"

echo "🗄️  LeadForge Engine - Production Migration"
echo ""

# Check if DATABASE_URL is provided
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL is required"
    echo ""
    echo "Usage:"
    echo "  ./scripts/run-production-migrations.sh postgresql://..."
    echo ""
    echo "Or set environment variable:"
    echo "  export DATABASE_URL='postgresql://...'"
    echo "  ./scripts/run-production-migrations.sh"
    exit 1
fi

# Mask password in output
MASKED_URL=$(echo "$DATABASE_URL" | sed 's/:[^:@]*@/:****@/')
echo "📊 Database: $MASKED_URL"
echo ""

# Step 1: Validate Prisma schema
echo "1️⃣  Validating Prisma schema..."
if ! npx prisma validate; then
    echo "❌ Schema validation failed!"
    exit 1
fi
echo "✅ Schema is valid"
echo ""

# Step 2: Generate Prisma Client
echo "2️⃣  Generating Prisma Client..."
if ! npm run db:generate; then
    echo "❌ Prisma Client generation failed!"
    exit 1
fi
echo "✅ Prisma Client generated"
echo ""

# Step 3: Check migration status
echo "3️⃣  Checking migration status..."
npx prisma migrate status
echo ""

# Step 4: Deploy migrations
echo "4️⃣  Deploying migrations to production..."
echo "⚠️  This will create/modify tables in the production database!"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Migration cancelled"
    exit 0
fi

echo ""
echo "🚀 Running migrations..."
if npm run db:deploy; then
    echo ""
    echo "✅ Migrations deployed successfully!"
    echo ""
    
    # Step 5: Verify database
    echo "5️⃣  Verifying database tables..."
    if npm run db:verify; then
        echo ""
        echo "✅ Database verification complete!"
    else
        echo ""
        echo "⚠️  Verification had issues (check output above)"
    fi
    
    echo ""
    echo "🎉 Migration process complete!"
    echo ""
    echo "Next steps:"
    echo "  - Seed admin user: npm run db:seed"
    echo "  - Verify in Vercel: Check /api/health endpoint"
else
    echo ""
    echo "❌ Migration failed!"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Verify DATABASE_URL is correct"
    echo "  2. Check Railway database is running"
    echo "  3. Verify network connectivity"
    exit 1
fi

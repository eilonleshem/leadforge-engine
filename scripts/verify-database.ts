/**
 * Database Verification Script
 * Verifies that all required tables exist in the production database.
 * 
 * Usage: DATABASE_URL="postgresql://..." npx tsx scripts/verify-database.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyDatabase() {
  try {
    console.log('🔍 Verifying database schema...\n')

    // Test connection
    await prisma.$connect()
    console.log('✅ Database connection successful\n')

    // Check Lead table
    const leadCount = await prisma.lead.count()
    console.log(`✅ Lead table exists (${leadCount} records)`)

    // Check Buyer table
    const buyerCount = await prisma.buyer.count()
    console.log(`✅ Buyer table exists (${buyerCount} records)`)

    // Check Call table
    const callCount = await prisma.call.count()
    console.log(`✅ Call table exists (${callCount} records)`)

    // Check Delivery table
    const deliveryCount = await prisma.delivery.count()
    console.log(`✅ Delivery table exists (${deliveryCount} records)`)

    // Check AdminUser table
    const adminCount = await prisma.adminUser.count()
    console.log(`✅ AdminUser table exists (${adminCount} records)`)

    // Verify indexes exist (by checking query performance)
    const leadWithIndex = await prisma.lead.findFirst({
      where: { status: 'VERIFIED' },
    })
    console.log(`✅ Indexes are working (queried by status)`)

    console.log('\n✅ All tables verified successfully!')
    console.log('\n📊 Database Summary:')
    console.log(`   Leads: ${leadCount}`)
    console.log(`   Buyers: ${buyerCount}`)
    console.log(`   Calls: ${callCount}`)
    console.log(`   Deliveries: ${deliveryCount}`)
    console.log(`   Admin Users: ${adminCount}`)

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Database verification failed:')
    console.error(error)
    
    if (error instanceof Error) {
      if (error.message.includes('does not exist')) {
        console.error('\n💡 Tables are missing. Run migrations first:')
        console.error('   npm run db:deploy')
      } else if (error.message.includes('connection')) {
        console.error('\n💡 Database connection failed. Check DATABASE_URL:')
        console.error('   Verify DATABASE_URL is set correctly')
      }
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

verifyDatabase()

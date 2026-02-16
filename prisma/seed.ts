import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@leadforge.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  // Hash password
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  // Create admin user
  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin User',
      isActive: true,
    },
  })

  console.log('Admin user created/updated:', admin.email)

  // Create sample buyer
  const buyer = await prisma.buyer.upsert({
    where: { id: 'sample-buyer-1' },
    update: {},
    create: {
      id: 'sample-buyer-1',
      name: 'Sample Buyer',
      deliveryType: 'WEBHOOK',
      webhookUrl: 'https://webhook.site/your-webhook-url',
      pricePerLead: 25.0,
      coverage: ['90210', '10001', 'CA'], // Example coverage
      isActive: true,
    },
  })

  console.log('Sample buyer created:', buyer.name)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

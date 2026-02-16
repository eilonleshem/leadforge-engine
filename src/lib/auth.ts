import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

/**
 * NextAuth configuration.
 * 
 * Auth modes (tried in order):
 * 1. If DATABASE_URL is set, check AdminUser table via Prisma
 * 2. Otherwise, check ADMIN_EMAIL + ADMIN_PASSWORD from env vars
 */
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Try database auth only if DATABASE_URL is configured
        if (process.env.DATABASE_URL) {
          try {
            const bcrypt = await import('bcryptjs')
            const { prisma } = await import('./prisma')
            const adminUser = await prisma.adminUser.findUnique({
              where: { email: credentials.email },
            })

            if (adminUser && adminUser.isActive) {
              const isValid = await bcrypt.compare(credentials.password, adminUser.password)
              if (isValid) {
                return {
                  id: adminUser.id,
                  email: adminUser.email,
                  name: adminUser.name || 'Admin',
                }
              }
            }
          } catch (error) {
            console.warn('Database auth error:', (error as Error).message)
          }
        }

        // Fallback: env-based admin credentials (works without database)
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if (
          adminEmail &&
          adminPassword &&
          credentials.email === adminEmail &&
          credentials.password === adminPassword
        ) {
          return {
            id: 'admin-1',
            email: adminEmail,
            name: 'Admin',
          }
        }

        return null
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      return session
    },
  },
}

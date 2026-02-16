import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/admin/Sidebar'
import { Providers } from '@/components/Providers'

/**
 * Protected dashboard layout - requires authentication.
 * Only wraps dashboard pages, NOT the login page.
 * Includes SessionProvider for signOut and other client-side auth hooks.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <Providers>
      <div className="flex">
        <Sidebar />
        <div className="ml-64 flex-1 p-8">
          {children}
        </div>
      </div>
    </Providers>
  )
}

import { Providers } from '@/components/Providers'

/**
 * Login page has its own layout WITHOUT auth check
 * to prevent infinite redirect loops.
 * Includes SessionProvider for next-auth/react hooks.
 */
export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Providers>{children}</Providers>
}

/**
 * Admin root layout - provides minimal wrapper.
 * Auth checks happen at the page level or in (dashboard) group layout.
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {children}
    </div>
  )
}

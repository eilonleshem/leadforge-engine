import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-5xl font-bold text-primary-900">
          LeadForge Engine
        </h1>
        <p className="text-xl text-slate-600">
          Roofing Lead Generation Platform
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/lp/storm-damage">
            <Button>Storm Damage Landing Page</Button>
          </Link>
          <Link href="/lp/free-inspection">
            <Button>Free Inspection Landing Page</Button>
          </Link>
          <Link href="/admin">
            <Button variant="secondary">Admin Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

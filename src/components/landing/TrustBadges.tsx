import { Shield, Award, Users, Clock } from 'lucide-react'

const badges = [
  {
    icon: Shield,
    title: 'Licensed & Insured',
    description: 'Fully licensed and insured roofing professionals',
  },
  {
    icon: Award,
    title: '5-Star Rated',
    description: 'Thousands of satisfied customers',
  },
  {
    icon: Users,
    title: 'Local Experts',
    description: 'Trusted by homeowners in your area',
  },
  {
    icon: Clock,
    title: 'Fast Response',
    description: 'Free inspections within 24 hours',
  },
]

export function TrustBadges() {
  return (
    <div className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, index) => {
            const Icon = badge.icon
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <Icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{badge.title}</h3>
                <p className="text-slate-600 text-sm">{badge.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

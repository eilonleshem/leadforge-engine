import { ReactNode } from 'react'

interface HeroProps {
  headline: string
  subheadline?: string
  children?: ReactNode
}

export function Hero({ headline, subheadline, children }: HeroProps) {
  return (
    <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {headline}
          </h1>
          {subheadline && (
            <p className="text-xl md:text-2xl text-primary-100 mb-8">
              {subheadline}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

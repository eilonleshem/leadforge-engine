import { LeadForm } from '@/components/landing/LeadForm'
import { Hero } from '@/components/landing/Hero'
import { TrustBadges } from '@/components/landing/TrustBadges'
import { FAQ } from '@/components/landing/FAQ'
import { StickyCallButton } from '@/components/landing/StickyCallButton'

const faqItems = [
  {
    question: 'Is the inspection really free?',
    answer: 'Yes! Our roof inspection is completely free with no obligation. We provide a detailed report of your roof condition at no cost to you.',
  },
  {
    question: 'How long does the inspection take?',
    answer: 'A typical roof inspection takes 30-60 minutes. Our inspector will examine both the interior and exterior of your roof.',
  },
  {
    question: 'What will the inspection cover?',
    answer: 'We check for damage, wear, leaks, missing shingles, gutter condition, and overall roof health. You receive a detailed written report.',
  },
  {
    question: 'Do I need to be home during the inspection?',
    answer: 'While it\'s helpful if you\'re available, it\'s not required. Our inspector can access your roof from the exterior if needed.',
  },
]

export default function FreeInspectionPage() {
  return (
    <>
      <Hero
        headline="Free Roof Inspection - No Obligation"
        subheadline="Expert roof assessment to protect your home investment"
      />
      <TrustBadges />
      
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Schedule Your Free Inspection</h2>
              <p className="text-slate-600 mb-6">
                Regular roof inspections can save you thousands in repairs. Our certified inspectors 
                will thoroughly examine your roof and provide a comprehensive report on its condition.
              </p>
              <ul className="space-y-3 text-slate-700 mb-8">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>100% free inspection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>Detailed written report</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>No pressure sales tactics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>Scheduled at your convenience</span>
                </li>
              </ul>
            </div>
            <div className="bg-slate-50 p-6 rounded-lg">
              <LeadForm landingPage="free-inspection" />
            </div>
          </div>
        </div>
      </div>

      <FAQ items={faqItems} />
      
      <div className="py-12 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm text-slate-400">
            By submitting this form, you consent to be contacted by phone, SMS, and email. 
            Message and data rates may apply. You are not required to agree as a condition of purchase.
          </p>
        </div>
      </div>

      <StickyCallButton campaignId="free-inspection" trackingNumber={process.env.TWILIO_TRACKING_NUMBER} />
    </>
  )
}

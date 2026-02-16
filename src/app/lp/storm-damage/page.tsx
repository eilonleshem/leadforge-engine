import { LeadForm } from '@/components/landing/LeadForm'
import { Hero } from '@/components/landing/Hero'
import { TrustBadges } from '@/components/landing/TrustBadges'
import { FAQ } from '@/components/landing/FAQ'
import { StickyCallButton } from '@/components/landing/StickyCallButton'

const faqItems = [
  {
    question: 'How do I know if I have storm damage?',
    answer: 'Common signs include missing or damaged shingles, dents in gutters, granule loss in gutters, and leaks. Our free inspection will identify all damage.',
  },
  {
    question: 'Will insurance cover storm damage?',
    answer: 'Most homeowner insurance policies cover storm damage. We can help you file a claim and work directly with your insurance company.',
  },
  {
    question: 'How quickly can you inspect my roof?',
    answer: 'We typically schedule free inspections within 24-48 hours of your request, depending on weather conditions.',
  },
  {
    question: 'What areas do you serve?',
    answer: 'We serve homeowners throughout the United States. Enter your ZIP code to see if we cover your area.',
  },
]

export default function StormDamagePage() {
  return (
    <>
      <Hero
        headline="Storm Damage? Get Your Free Roof Inspection Today"
        subheadline="Licensed professionals ready to assess and repair your roof damage"
      />
      <TrustBadges />
      
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get Your Free Inspection</h2>
              <p className="text-slate-600 mb-6">
                Don't wait until it's too late. Storm damage can lead to leaks, mold, and structural issues. 
                Our certified roofing experts will inspect your roof at no cost and provide a detailed report.
              </p>
              <ul className="space-y-3 text-slate-700 mb-8">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>Free, no-obligation inspection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>Licensed and insured professionals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>Insurance claim assistance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>Fast response time</span>
                </li>
              </ul>
            </div>
            <div className="bg-slate-50 p-6 rounded-lg">
              <LeadForm landingPage="storm-damage" />
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

      <StickyCallButton campaignId="storm-damage" trackingNumber={process.env.TWILIO_TRACKING_NUMBER} />
    </>
  )
}

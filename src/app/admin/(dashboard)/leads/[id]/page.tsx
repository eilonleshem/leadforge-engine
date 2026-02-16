import { LeadDetails } from '@/components/admin/LeadDetails'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function AdminLeadDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Lead Details</h1>
        <Link href="/admin/leads">
          <Button variant="outline">Back to Leads</Button>
        </Link>
      </div>
      <LeadDetails leadId={params.id} />
    </div>
  )
}

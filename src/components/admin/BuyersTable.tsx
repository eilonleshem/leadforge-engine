'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { BuyerModal } from './BuyerModal'
import { Buyer } from '@prisma/client'

export function BuyersTable() {
  const [buyers, setBuyers] = useState<Buyer[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBuyer, setEditingBuyer] = useState<Buyer | null>(null)

  useEffect(() => {
    fetchBuyers()
  }, [])

  const fetchBuyers = async () => {
    try {
      const res = await fetch('/api/admin/buyers')
      const data = await res.json()
      setBuyers(data.buyers || [])
    } catch (error) {
      console.error('Failed to fetch buyers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (buyer: Buyer) => {
    setEditingBuyer(buyer)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this buyer?')) return

    try {
      await fetch(`/api/admin/buyers/${id}`, { method: 'DELETE' })
      fetchBuyers()
    } catch (error) {
      console.error('Failed to delete buyer:', error)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingBuyer(null)
    fetchBuyers()
  }

  if (loading) {
    return <div className="text-center py-8">Loading buyers...</div>
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setIsModalOpen(true)}>Add Buyer</Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Delivery Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Endpoint</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Price/Lead</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {buyers.map((buyer) => (
              <tr key={buyer.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold">{buyer.name}</td>
                <td className="px-4 py-3">
                  <Badge>{buyer.deliveryType}</Badge>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {buyer.deliveryType === 'WEBHOOK' ? buyer.webhookUrl : buyer.email}
                </td>
                <td className="px-4 py-3">${buyer.pricePerLead.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <Badge variant={buyer.isActive ? 'success' : 'default'}>
                    {buyer.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(buyer)}
                      className="text-primary-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(buyer.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {buyers.length === 0 && (
          <div className="text-center py-8 text-slate-500">No buyers found</div>
        )}
      </div>

      <BuyerModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        buyer={editingBuyer}
      />
    </>
  )
}

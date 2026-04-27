'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Link2, RefreshCw, Search, Plus, QrCode, Copy, ExternalLink, Trash2, CheckCircle2, AlertTriangle, User
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import QRCode from 'qrcode'
import type { PaymentLink } from '@/types'

export default function PaymentLinksPage() {
  const [toast, setToast] = useState('')
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  // Links State
  const [links, setLinks] = useState<PaymentLink[]>([])
  const [loadingLinks, setLoadingLinks] = useState(true)
  const [searchLinks, setSearchLinks] = useState('')
  const [filterLinks, setFilterLinks] = useState('all')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [qrModal, setQrModal] = useState<{ id: string; url: string; qrDataUrl: string } | null>(null)

  const fetchLinks = async () => {
    setLoadingLinks(true)
    const res = await fetch('/api/admin/payment-links')
    if (res.ok) {
      const data = await res.json()
      setLinks(data)
    }
    setLoadingLinks(false)
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Delete this payment link?')) return
    const res = await fetch(`/api/admin/payment-links/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setLinks(prev => prev.filter(l => l.id !== id))
      showToast('Link deleted')
    } else {
      const { error } = await res.json()
      showToast(error || 'Failed to delete')
    }
  }

  const filteredLinks = links
    .filter(l => filterLinks === 'all' || l.status === filterLinks)
    .filter(l => {
      const q = searchLinks.toLowerCase()
      return l.id.toLowerCase().includes(q) || l.description.toLowerCase().includes(q) || (l.customer_name ?? '').toLowerCase().includes(q) || (l.customer_email ?? '').toLowerCase().includes(q)
    })

  const showQr = async (link: PaymentLink) => {
    const url = `${process.env.NEXT_PUBLIC_PAY_URL || 'https://pay.tajwater.ca'}/${link.id}`
    try {
      const qrDataUrl = await QRCode.toDataURL(url, { margin: 2, scale: 8, color: { dark: '#0c2340', light: '#ffffff' } })
      setQrModal({ id: link.id, url, qrDataUrl })
    } catch (e) {
      console.error('QR error', e)
    }
  }

  return (
    <div className="space-y-5 relative">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-[#0097a7] text-white px-4 py-3 rounded-2xl shadow-xl text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0c2340] dark:text-[#f8fafc]">Custom Payment Links</h2>
          <p className="text-sm text-[#4a7fa5] dark:text-[#94a3b8]">Manage ad-hoc invoices and direct payment links</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
           <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0097a7]" />
              <Input placeholder="Search links..." value={searchLinks} onChange={e => setSearchLinks(e.target.value)} className="pl-10 border-[#cce7f0] bg-white text-[#0c2340]" />
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'paid'].map(f => (
                <button key={f} onClick={() => setFilterLinks(f)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize ${filterLinks === f ? 'bg-[#0097a7] text-white' : 'bg-white border border-[#cce7f0] text-[#4a7fa5]'}`}>{f}</button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={fetchLinks} className="border-[#cce7f0] text-[#4a7fa5]"><RefreshCw className={`w-4 h-4 ${loadingLinks ? 'animate-spin' : ''}`} /></Button>
            <Button size="sm" onClick={() => setIsCreateOpen(true)} className="bg-[#0097a7] text-white hover:bg-[#006064] gap-2 shadow-md shadow-[#0097a7]/20"><Plus className="w-4 h-4" /> New Link</Button>
          </div>
        </div>

        {loadingLinks ? (
          <div className="h-32 bg-white rounded-2xl border border-[#cce7f0] animate-pulse" />
        ) : filteredLinks.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#cce7f0] p-16 text-center">
            <Link2 className="w-10 h-10 text-[#cce7f0] mx-auto mb-3" />
            <p className="text-[#4a7fa5] font-medium">No payment links found</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#cce7f0] shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#f0f9ff] border-b border-[#cce7f0]">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-[#4a7fa5] uppercase">ID</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#4a7fa5] uppercase">Description</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#4a7fa5] uppercase">Amount</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#4a7fa5] uppercase">Customer</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#4a7fa5] uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#4a7fa5] uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f9ff]">
                {filteredLinks.map(link => (
                  <tr key={link.id} className="hover:bg-[#f0f9ff]">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-[#0097a7]">{link.id}</td>
                    <td className="px-4 py-3">
                      <div className="text-[#0c2340] max-w-[200px] truncate">{link.description}</div>
                      {link.internal_note && <div className="text-[10px] text-amber-600 font-medium truncate max-w-[200px]">Note: {link.internal_note}</div>}
                    </td>
                    <td className="px-4 py-3 font-bold text-[#0c2340]">${link.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className="text-[#0c2340]">{link.customer_name || '—'}</div>
                      {link.customer_email && <div className="text-[10px] text-[#4a7fa5]">{link.customer_email}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`text-[10px] ${link.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{link.status}</Badge>
                    </td>
                    <td className="px-4 py-3 flex gap-2 justify-end">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-[#0097a7]" onClick={() => showQr(link)} title="Show QR / URL">
                        <QrCode className="w-4 h-4" />
                      </Button>
                      <a href={`${process.env.NEXT_PUBLIC_PAY_URL || 'https://pay.tajwater.ca'}/${link.id}`} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-[#4a7fa5]" title="Open Link">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                      {link.status !== 'paid' && (
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500 hover:bg-red-50" onClick={() => handleDeleteLink(link.id)} title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AnimatePresence>
          {qrModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/40" onClick={() => setQrModal(null)} />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm relative z-10 border border-[#cce7f0] text-center">
                <h3 className="font-extrabold text-[#0c2340] text-xl mb-1">{qrModal.id}</h3>
                <p className="text-[#4a7fa5] text-sm mb-6">Scan to pay securely</p>
                <div className="bg-white p-2 rounded-2xl border border-[#cce7f0] shadow-sm inline-block mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrModal.qrDataUrl} alt="QR Code" className="w-48 h-48 mx-auto" />
                </div>
                <div className="flex items-center gap-2 bg-[#f0f9ff] p-2 rounded-xl border border-[#cce7f0] mb-4">
                  <input type="text" readOnly value={qrModal.url} className="bg-transparent text-xs text-[#0c2340] w-full outline-none pl-2" />
                  <Button size="sm" className="bg-[#0097a7] text-white hover:bg-[#006064] h-7" onClick={() => { navigator.clipboard.writeText(qrModal.url); showToast('Copied to clipboard') }}>
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <Button variant="outline" className="w-full text-[#4a7fa5]" onClick={() => setQrModal(null)}>Close</Button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        
        <CreateLinkModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onCreated={(link) => { setLinks(prev => [link, ...prev]); showQr(link); showToast('Link created') }} />

      </motion.div>
    </div>
  )
}

function CreateLinkModal({ isOpen, onClose, onCreated }: { isOpen: boolean; onClose: () => void; onCreated: (link: PaymentLink) => void }) {
  const [desc, setDesc] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [internalNote, setInternalNote] = useState('')
  
  const [lineItems, setLineItems] = useState<{description: string, quantity: number, unit_price: number}[]>([])
  const [manualAmount, setManualAmount] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setDesc('')
      setName('')
      setEmail('')
      setInternalNote('')
      setLineItems([])
      setManualAmount('')
      setError('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const calculatedTotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
  const finalAmount = lineItems.length > 0 ? calculatedTotal : parseFloat(manualAmount || '0')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (finalAmount < 0.5) { setError('Amount must be at least $0.50'); return }
    if (lineItems.length > 0 && lineItems.some(i => !i.description.trim() || i.quantity <= 0 || i.unit_price < 0)) {
      setError('Please ensure all line items have a valid description, quantity, and price.')
      return
    }

    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/payment-links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: desc,
        amount: finalAmount,
        customer_name: name,
        customer_email: email,
        internal_note: internalNote,
        line_items: lineItems.length > 0 ? lineItems : null
      })
    })
    const json = await res.json()
    setLoading(false)
    if (!res.ok) { setError(json.error || 'Failed to create'); return }
    onClose()
    onCreated(json)
  }

  const addLineItem = () => setLineItems(prev => [...prev, { description: '', quantity: 1, unit_price: 0 }])
  const updateLineItem = (index: number, field: string, value: any) => {
    setLineItems(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }
  const removeLineItem = (index: number) => setLineItems(prev => prev.filter((_, i) => i !== index))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !loading && onClose()} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-lg relative z-10 border border-[#cce7f0] max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-extrabold text-[#0c2340] mb-4">Create Custom Payment Link</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#4a7fa5] uppercase mb-1 block">Invoice Summary / Title</label>
              <Input required placeholder="e.g. Filter Installation & Maintenance" value={desc} onChange={e => setDesc(e.target.value)} />
            </div>

            <div className="bg-[#f0f9ff] rounded-2xl p-4 border border-[#cce7f0]">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-semibold text-[#4a7fa5] uppercase">Line Items (Optional)</label>
                <Button type="button" size="sm" variant="ghost" className="h-6 text-xs text-[#0097a7] hover:bg-[#e0f7fa]" onClick={addLineItem}>
                  <Plus className="w-3 h-3 mr-1" /> Add Item
                </Button>
              </div>
              
              {lineItems.length > 0 ? (
                <div className="space-y-3">
                  {lineItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Input placeholder="Item description" className="flex-1 text-xs h-8" value={item.description} onChange={e => updateLineItem(i, 'description', e.target.value)} required />
                      <Input type="number" min="1" placeholder="Qty" className="w-16 text-xs h-8 text-center" value={item.quantity} onChange={e => updateLineItem(i, 'quantity', parseInt(e.target.value) || 0)} required />
                      <Input type="number" step="0.01" min="0" placeholder="$ Price" className="w-24 text-xs h-8 text-right" value={item.unit_price || ''} onChange={e => updateLineItem(i, 'unit_price', parseFloat(e.target.value) || 0)} required />
                      <Button type="button" variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 shrink-0" onClick={() => removeLineItem(i)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  ))}
                  <div className="text-right text-sm font-bold text-[#0c2340] pt-2 border-t border-[#cce7f0]">
                    Total: ${calculatedTotal.toFixed(2)}
                  </div>
                </div>
              ) : (
                <div>
                  <Input type="number" step="0.01" required min="0.5" placeholder="Total Amount (CAD)" value={manualAmount} onChange={e => setManualAmount(e.target.value)} className="text-lg font-bold text-center" />
                  <p className="text-[10px] text-[#4a7fa5] mt-1 text-center">Add line items above to automatically calculate the total.</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#f0f9ff]">
            <p className="text-xs text-[#4a7fa5] mb-3 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Customer Info (Optional)</p>
            <div className="space-y-3">
              <Input placeholder="Customer Name" value={name} onChange={e => setName(e.target.value)} />
              <Input type="email" placeholder="Customer Email (Sends link automatically)" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="pt-4 border-t border-[#f0f9ff]">
            <label className="text-xs font-semibold text-[#4a7fa5] uppercase mb-1 block">Internal Note (Private)</label>
            <Input placeholder="Notes for staff..." value={internalNote} onChange={e => setInternalNote(e.target.value)} />
          </div>

          {error && <p className="text-red-500 text-xs flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {error}</p>}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1 text-[#4a7fa5]" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" className="flex-1 bg-[#0097a7] text-white hover:bg-[#006064]" disabled={loading}>{loading ? 'Creating...' : 'Generate Link'}</Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

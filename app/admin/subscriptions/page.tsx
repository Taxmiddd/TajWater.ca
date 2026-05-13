'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Pause, Play, XCircle, Search, DollarSign, Calendar, CheckCircle2, Plus, X, User, Package, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { supabase } from '@/lib/supabase'

type SubRow = {
  id: string
  user_id: string | null
  status: string
  frequency: string
  quantity: number
  next_delivery: string | null
  created_at: string
  price: number | null
  custom_plan?: boolean
  plan_name?: string | null
  profile: { name: string | null; email: string | null } | null
  product: { name: string; price: number } | null
}

type CustomerOption = { id: string; name: string | null; email: string | null }
type ProductOption = { id: string; name: string; price: number }
type ZoneOption = { id: string; name: string }

const FREQUENCIES = [
  { value: 'daily',    label: 'Daily',     sub: 'Every day' },
  { value: 'weekly',   label: 'Weekly',    sub: 'Every 7 days' },
  { value: 'biweekly', label: 'Biweekly',  sub: 'Every 14 days' },
  { value: 'monthly',  label: 'Monthly',   sub: 'Every 30 days' },
] as const

const statusBadge = (s: string) => {
  if (s === 'active')    return 'bg-green-100 text-green-700'
  if (s === 'paused')    return 'bg-amber-100 text-amber-700'
  if (s === 'cancelled') return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-600'
}

function calcMRR(subs: SubRow[]): number {
  return subs
    .filter(s => s.status === 'active' && s.product)
    .reduce((total, s) => {
      const price = s.price ?? (s.product?.price ?? 0)
      const qty = s.quantity ?? 1
      const perDelivery = price * qty
      const multiplier =
        s.frequency === 'daily'    ? 30 :
        s.frequency === 'weekly'   ? 4  :
        s.frequency === 'biweekly' ? 2  : 1
      return total + perDelivery * multiplier
    }, 0)
}

const emptyPlan = {
  user_id: '',
  product_id: '',
  plan_name: '',
  frequency: 'weekly' as typeof FREQUENCIES[number]['value'],
  quantity: 1,
  price: '',
  zone_id: '',
  custom_delivery_address: '',
  next_delivery: '',
  admin_notes: '',
}

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<SubRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'cancelled'>('active')
  const [editingDelivery, setEditingDelivery] = useState<{ id: string; value: string } | null>(null)
  const [savingDelivery, setSavingDelivery] = useState(false)
  const [toast, setToast] = useState('')

  // Custom plan modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [plan, setPlan] = useState(emptyPlan)
  const [saving, setSaving] = useState(false)
  const [customers, setCustomers] = useState<CustomerOption[]>([])
  const [products, setProducts] = useState<ProductOption[]>([])
  const [zones, setZones] = useState<ZoneOption[]>([])
  const [customerSearch, setCustomerSearch] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const fetchSubs = async () => {
    setLoading(true)
    const { data: rawData, error } = await supabase
      .from('subscriptions')
      .select('id, user_id, status, frequency, quantity, next_delivery, created_at, price, custom_plan, plan_name, product:products(name, price)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch subscriptions error:', error)
      setSubs([])
      setLoading(false)
      return
    }

    if (rawData) {
      const uids = [...new Set(rawData.map(s => s.user_id).filter(Boolean))] as string[]
      const profMap: Record<string, { name: string | null; email: string | null }> = {}

      if (uids.length > 0) {
        const { data: profs } = await supabase
          .from('profiles')
          .select('id, name, email')
          .in('id', uids)

        profs?.forEach(p => {
          profMap[p.id] = { name: p.name, email: p.email }
        })
      }

      const merged: SubRow[] = rawData.map(s => ({
        ...s,
        profile: s.user_id ? (profMap[s.user_id] ?? null) : null,
        product: Array.isArray(s.product) ? s.product[0] : s.product
      })) as unknown as SubRow[]

      setSubs(merged)
    }
    setLoading(false)
  }

  const fetchModalData = async () => {
    const [{ data: profs }, { data: prods }, { data: zoneData }] = await Promise.all([
      supabase.from('profiles').select('id, name, email').order('name'),
      supabase.from('products').select('id, name, price').eq('active', true).order('name'),
      supabase.from('zones').select('id, name').eq('active', true).order('name'),
    ])
    if (profs) setCustomers(profs)
    if (prods) setProducts(prods)
    if (zoneData) setZones(zoneData)
  }

  useEffect(() => { fetchSubs() }, [])

  const openModal = () => {
    setPlan(emptyPlan)
    setCustomerSearch('')
    fetchModalData()
    setModalOpen(true)
  }

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from('subscriptions').update({ status: newStatus }).eq('id', id)
    setSubs((prev) => prev.map((s) => s.id === id ? { ...s, status: newStatus } : s))
    showToast(`Subscription ${newStatus}`)
  }

  const saveDeliveryDate = async () => {
    if (!editingDelivery) return
    setSavingDelivery(true)
    await supabase.from('subscriptions').update({ next_delivery: editingDelivery.value }).eq('id', editingDelivery.id)
    setSubs(prev => prev.map(s => s.id === editingDelivery.id ? { ...s, next_delivery: editingDelivery.value } : s))
    setEditingDelivery(null)
    setSavingDelivery(false)
    showToast('Next delivery updated')
  }

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!plan.user_id || !plan.product_id) {
      showToast('Please select a customer and product.')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/create-custom-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...plan,
          price: parseFloat(String(plan.price)) || 0,
          quantity: parseInt(String(plan.quantity)) || 1,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create plan')
      showToast('Custom plan created!')
      setModalOpen(false)
      fetchSubs()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to create plan')
    } finally {
      setSaving(false)
    }
  }

  const selectedProduct = products.find(p => p.id === plan.product_id)
  const filteredCustomers = customers.filter(c =>
    !customerSearch ||
    (c.name ?? '').toLowerCase().includes(customerSearch.toLowerCase()) ||
    (c.email ?? '').toLowerCase().includes(customerSearch.toLowerCase())
  )

  const filtered = subs.filter((s) => {
    const matchStatus = filter === 'all' || s.status === filter
    const customer = `${s.profile?.name ?? ''} ${s.profile?.email ?? ''}`.toLowerCase()
    const matchSearch = !search || customer.includes(search.toLowerCase()) || (s.product?.name ?? '').toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const activeCnt    = subs.filter(s => s.status === 'active').length
  const pausedCnt    = subs.filter(s => s.status === 'paused').length
  const cancelledCnt = subs.filter(s => s.status === 'cancelled').length
  const mrr          = calcMRR(subs)

  return (
    <div className="space-y-5 relative">
      {/* Toast */}
      {toast && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-[#0097a7] text-white px-4 py-3 rounded-2xl shadow-xl text-sm font-medium">
          <CheckCircle2 className="w-4 h-4" /> {toast}
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0c2340]">Subscriptions</h1>
          <p className="text-sm text-[#4a7fa5]">{activeCnt} active · {pausedCnt} paused · {cancelledCnt} cancelled</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={openModal} className="bg-gradient-to-r from-[#0097a7] to-[#1565c0] text-white gap-2 shadow-md">
            <Plus className="w-4 h-4" /> Custom Plan
          </Button>
          <Button size="sm" variant="outline" onClick={fetchSubs} className="border-[#cce7f0] text-[#4a7fa5]">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Active',     count: activeCnt,    color: 'bg-green-100 text-green-700',  isMoney: false },
          { label: 'Paused',     count: pausedCnt,    color: 'bg-amber-100 text-amber-700',  isMoney: false },
          { label: 'Cancelled',  count: cancelledCnt, color: 'bg-red-100 text-red-700',      isMoney: false },
          { label: 'Est. MRR',   count: mrr,          color: 'bg-[#e0f7fa] text-[#0097a7]', isMoney: true  },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#cce7f0] p-4">
            <div className="flex items-center gap-2 mb-1">
              {s.isMoney ? <DollarSign className="w-4 h-4 text-[#0097a7]" /> : null}
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
            </div>
            <p className="text-2xl font-extrabold text-[#0c2340]">
              {s.isMoney ? `$${(s.count as number).toFixed(0)}` : String(s.count)}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0097a7]" />
          <Input placeholder="Search customer or product..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 border-[#cce7f0]" />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'paused', 'cancelled'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${filter === f ? 'bg-[#0097a7] text-white' : 'border border-[#cce7f0] text-[#4a7fa5] hover:border-[#0097a7]'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-[#cce7f0] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#4a7fa5]">Loading subscriptions...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 text-[#cce7f0] mx-auto mb-3" />
            <p className="text-[#4a7fa5]">No subscriptions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f0f9ff] text-xs text-[#4a7fa5] uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Product / Plan</th>
                  <th className="px-4 py-3 text-left">Frequency</th>
                  <th className="px-4 py-3 text-left">Qty</th>
                  <th className="px-4 py-3 text-left">Next Delivery</th>
                  <th className="px-4 py-3 text-left">Value/mo</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub) => {
                  const pricePerDelivery = (sub.price ?? sub.product?.price ?? 0) * (sub.quantity ?? 1)
                  const multiplier =
                    sub.frequency === 'daily'    ? 30 :
                    sub.frequency === 'weekly'   ? 4  :
                    sub.frequency === 'biweekly' ? 2  : 1
                  const monthly = pricePerDelivery * multiplier
                  const isEditingThis = editingDelivery?.id === sub.id
                  return (
                    <tr key={sub.id} className="border-t border-[#f0f9ff] hover:bg-[#f8fbfe]">
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#0c2340]">{sub.profile?.name ?? '—'}</p>
                        <p className="text-xs text-[#4a7fa5]">{sub.profile?.email ?? ''}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[#4a7fa5]">{sub.product?.name ?? '—'}</p>
                        {sub.custom_plan && sub.plan_name && (
                          <span className="inline-block text-[10px] font-semibold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-md mt-0.5">{sub.plan_name}</span>
                        )}
                        {sub.custom_plan && !sub.plan_name && (
                          <span className="inline-block text-[10px] font-semibold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-md mt-0.5">Custom Plan</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize text-[#4a7fa5]">{sub.frequency}</span>
                      </td>
                      <td className="px-4 py-3 text-[#0c2340] font-medium">{sub.quantity}</td>
                      <td className="px-4 py-3">
                        {isEditingThis ? (
                          <div className="flex items-center gap-1.5">
                            <Input
                              type="date"
                              value={editingDelivery.value}
                              onChange={e => setEditingDelivery({ ...editingDelivery, value: e.target.value })}
                              className="h-7 text-xs border-[#cce7f0] w-32"
                            />
                            <button onClick={saveDeliveryDate} disabled={savingDelivery}
                              className="w-6 h-6 rounded-lg bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 text-xs font-bold">
                              ✓
                            </button>
                            <button onClick={() => setEditingDelivery(null)}
                              className="w-6 h-6 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 text-xs font-bold">
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingDelivery({ id: sub.id, value: sub.next_delivery?.slice(0, 10) ?? '' })}
                            className="flex items-center gap-1.5 text-xs text-[#4a7fa5] hover:text-[#0097a7] group"
                          >
                            <Calendar className="w-3 h-3 group-hover:text-[#0097a7]" />
                            {sub.next_delivery
                              ? new Date(sub.next_delivery).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
                              : <span className="text-[#cce7f0]">Not set</span>}
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#0097a7] text-xs">${monthly.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <Badge className={statusBadge(sub.status)}>{sub.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          {sub.status === 'active' && (
                            <button onClick={() => updateStatus(sub.id, 'paused')} title="Pause"
                              className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center hover:bg-amber-100 transition-colors">
                              <Pause className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {sub.status === 'paused' && (
                            <button onClick={() => updateStatus(sub.id, 'active')} title="Resume"
                              className="w-7 h-7 rounded-lg bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors">
                              <Play className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {sub.status !== 'cancelled' && (
                            <button onClick={() => updateStatus(sub.id, 'cancelled')} title="Cancel"
                              className="w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Custom Plan Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-[#cce7f0]">
          <DialogHeader>
            <DialogTitle className="text-[#0c2340] flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0097a7] to-[#1565c0] flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
              Create Custom Subscription Plan
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreatePlan} className="space-y-5 mt-2">
            {/* Customer Selection */}
            <div>
              <label className="text-sm font-semibold text-[#0c2340] mb-2 flex items-center gap-1.5 block">
                <User className="w-3.5 h-3.5 text-[#0097a7]" /> Customer *
              </label>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0097a7]" />
                <Input
                  placeholder="Search customers..."
                  value={customerSearch}
                  onChange={e => setCustomerSearch(e.target.value)}
                  className="pl-9 border-[#cce7f0] text-sm"
                />
              </div>
              <div className="max-h-40 overflow-y-auto border border-[#cce7f0] rounded-xl divide-y divide-[#f0f9ff]">
                {filteredCustomers.length === 0 ? (
                  <p className="text-xs text-[#4a7fa5] p-3 text-center">No customers found</p>
                ) : filteredCustomers.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setPlan(p => ({ ...p, user_id: c.id }))}
                    className={`w-full text-left px-3 py-2 transition-colors flex items-center gap-2 ${plan.user_id === c.id ? 'bg-[#e0f7fa]' : 'hover:bg-[#f8fbfe]'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${plan.user_id === c.id ? 'border-[#0097a7] bg-[#0097a7]' : 'border-[#cce7f0]'}`}>
                      {plan.user_id === c.id && <div className="w-full h-full rounded-full flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-white" /></div>}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0c2340]">{c.name ?? 'Unnamed'}</p>
                      <p className="text-[10px] text-[#4a7fa5]">{c.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Plan Name */}
            <div>
              <label className="text-sm font-semibold text-[#0c2340] mb-1.5 block">Plan Name (optional)</label>
              <Input
                placeholder="e.g. Family Bundle, Office Supply..."
                value={plan.plan_name}
                onChange={e => setPlan(p => ({ ...p, plan_name: e.target.value }))}
                className="border-[#cce7f0]"
              />
            </div>

            {/* Product */}
            <div>
              <label className="text-sm font-semibold text-[#0c2340] mb-1.5 flex items-center gap-1.5 block">
                <Package className="w-3.5 h-3.5 text-[#0097a7]" /> Product *
              </label>
              <select
                required
                value={plan.product_id}
                onChange={e => {
                  const prod = products.find(p => p.id === e.target.value)
                  setPlan(p => ({ ...p, product_id: e.target.value, price: prod ? String(prod.price) : p.price }))
                }}
                className="w-full h-10 px-3 rounded-xl border border-[#cce7f0] bg-white text-[#0c2340] text-sm focus:border-[#0097a7] focus:outline-none"
              >
                <option value="">Select product...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} — ${p.price.toFixed(2)}</option>
                ))}
              </select>
            </div>

            {/* Frequency */}
            <div>
              <label className="text-sm font-semibold text-[#0c2340] mb-2 block">Delivery Frequency *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {FREQUENCIES.map(f => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setPlan(p => ({ ...p, frequency: f.value }))}
                    className={`flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all ${
                      plan.frequency === f.value
                        ? 'border-[#0097a7] bg-[#e0f7fa]'
                        : 'border-[#cce7f0] hover:border-[#0097a7]'
                    }`}
                  >
                    <span className="text-sm font-semibold text-[#0c2340]">{f.label}</span>
                    <span className="text-[10px] text-[#4a7fa5]">{f.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-[#0c2340] mb-1.5 block">Quantity (jugs/delivery) *</label>
                <Input
                  type="number"
                  min="1"
                  required
                  value={plan.quantity}
                  onChange={e => setPlan(p => ({ ...p, quantity: parseInt(e.target.value) || 1 }))}
                  className="border-[#cce7f0]"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#0c2340] mb-1.5 block">
                  Price per Jug ($) *
                  {selectedProduct && (
                    <span className="ml-1 text-[10px] text-[#4a7fa5] font-normal">
                      (retail ${selectedProduct.price.toFixed(2)})
                    </span>
                  )}
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={plan.price}
                  onChange={e => setPlan(p => ({ ...p, price: e.target.value }))}
                  placeholder="0.00"
                  className="border-[#cce7f0]"
                />
              </div>
            </div>

            {/* Zone + Next Delivery */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-[#0c2340] mb-1.5 flex items-center gap-1.5 block">
                  <MapPin className="w-3.5 h-3.5 text-[#0097a7]" /> Delivery Zone
                </label>
                <select
                  value={plan.zone_id}
                  onChange={e => setPlan(p => ({ ...p, zone_id: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-[#cce7f0] bg-white text-[#0c2340] text-sm focus:border-[#0097a7] focus:outline-none"
                >
                  <option value="">Select zone...</option>
                  {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#0c2340] mb-1.5 flex items-center gap-1.5 block">
                  <Calendar className="w-3.5 h-3.5 text-[#0097a7]" /> First Delivery Date
                </label>
                <Input
                  type="date"
                  value={plan.next_delivery}
                  onChange={e => setPlan(p => ({ ...p, next_delivery: e.target.value }))}
                  className="border-[#cce7f0]"
                />
              </div>
            </div>

            {/* Custom Delivery Address */}
            <div>
              <label className="text-sm font-semibold text-[#0c2340] mb-1.5 block">
                Custom Delivery Address <span className="text-[#4a7fa5] font-normal text-xs">(overrides profile address)</span>
              </label>
              <Input
                placeholder="123 Main St, Vancouver, BC V6B 1A1"
                value={plan.custom_delivery_address}
                onChange={e => setPlan(p => ({ ...p, custom_delivery_address: e.target.value }))}
                className="border-[#cce7f0]"
              />
            </div>

            {/* Admin Notes */}
            <div>
              <label className="text-sm font-semibold text-[#0c2340] mb-1.5 block">Admin Notes (internal)</label>
              <textarea
                rows={2}
                placeholder="e.g. Gate code 5678, call 30 min before..."
                value={plan.admin_notes}
                onChange={e => setPlan(p => ({ ...p, admin_notes: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#cce7f0] text-sm text-[#0c2340] focus:border-[#0097a7] focus:outline-none resize-none"
              />
            </div>

            {/* Summary */}
            {plan.user_id && plan.product_id && plan.price && (
              <div className="bg-[#f0f9ff] rounded-2xl p-4 border border-[#cce7f0] text-sm">
                <p className="font-semibold text-[#0c2340] mb-2">Plan Summary</p>
                <div className="space-y-1 text-xs text-[#4a7fa5]">
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span className="text-[#0c2340] font-medium">{customers.find(c => c.id === plan.user_id)?.name ?? '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Product:</span>
                    <span className="text-[#0c2340] font-medium">{selectedProduct?.name ?? '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Schedule:</span>
                    <span className="text-[#0c2340] font-medium capitalize">{plan.quantity} jug(s) · {plan.frequency}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-1 border-t border-[#cce7f0] text-[#0097a7]">
                    <span>Est. Monthly Value:</span>
                    <span>${(
                      parseFloat(String(plan.price) || '0') *
                      plan.quantity *
                      (plan.frequency === 'daily' ? 30 : plan.frequency === 'weekly' ? 4 : plan.frequency === 'biweekly' ? 2 : 1)
                    ).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1 border-[#cce7f0] text-[#4a7fa5]">
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
              <Button type="submit" disabled={saving || !plan.user_id || !plan.product_id} className="flex-1 bg-gradient-to-r from-[#0097a7] to-[#1565c0] text-white shadow-md">
                {saving ? 'Creating...' : 'Create Custom Plan'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

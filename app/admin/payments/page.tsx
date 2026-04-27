'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DollarSign, TrendingUp, Clock, XCircle, Download,
  RefreshCw, Search, CheckCircle2, Package, CreditCard,
  RotateCcw, AlertTriangle, ExternalLink, Trash2, Link2, Plus, QrCode, Copy, Mail, Calendar, Check, User
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { exportCSV } from '@/lib/csv'
import QRCode from 'qrcode'
import type { PaymentLink } from '@/types'

// ── Shared Types & Helpers ──────────────────────────────────────────────────
type TxnRow = {
  id: string
  user_id: string | null
  status: string
  payment_status: string | null
  payment_method?: string | null
  total: number
  refund_amount: number | null
  created_at: string
  customer_name: string | null
  square_payment_id: string | null
  zones: { name: string } | { name: string }[] | null
  profile: { name: string } | null
}

function getZoneName(zones: TxnRow['zones']): string {
  if (!zones) return '—'
  return Array.isArray(zones) ? (zones[0]?.name ?? '—') : (zones.name ?? '—')
}
function shortId(id: string) { return '#TW-' + id.slice(-6).toUpperCase() }
function fmtDate(ts: string) {
  return new Date(ts).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
}

function paymentBadge(ps: string | null): { label: string; color: string } {
  switch (ps) {
    case 'paid':     return { label: 'Paid',     color: 'bg-green-100 text-green-700' }
    case 'refunded': return { label: 'Refunded', color: 'bg-red-100 text-red-600' }
    case 'failed':   return { label: 'Failed',   color: 'bg-gray-100 text-gray-500' }
    case 'disputed': return { label: 'Disputed', color: 'bg-orange-100 text-orange-700' }
    default:         return { label: 'Pending',  color: 'bg-amber-100 text-amber-700' }
  }
}

const FILTER_OPTIONS = ['all', 'paid', 'pending', 'failed', 'refunded', 'disputed']

type RefundDialog = { orderId: string; total: number; amount: string; loading: boolean; error: string }

// ── Main Component ────────────────────────────────────────────────────────────
export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'links'>('orders')
  const [toast, setToast] = useState('')
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  // Orders State
  const [txns, setTxns] = useState<TxnRow[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [searchOrders, setSearchOrders] = useState('')
  const [filterOrders, setFilterOrders] = useState('all')
  const [refundDlg, setRefundDlg] = useState<RefundDialog | null>(null)

  // Links State
  const [links, setLinks] = useState<PaymentLink[]>([])
  const [loadingLinks, setLoadingLinks] = useState(true)
  const [searchLinks, setSearchLinks] = useState('')
  const [filterLinks, setFilterLinks] = useState('all')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [qrModal, setQrModal] = useState<{ id: string; url: string; qrDataUrl: string } | null>(null)

  // Fetch Data
  const fetchOrders = async () => {
    setLoadingOrders(true)
    const { data: rows, error } = await supabase
      .from('orders')
      .select('id, user_id, status, payment_status, payment_method, total, refund_amount, created_at, customer_name, square_payment_id, zones(name)')
      .order('created_at', { ascending: false })
      .limit(300)

    if (error) { console.error(error); setLoadingOrders(false); return }

    const orderRows = (rows ?? []) as Omit<TxnRow, 'profile'>[]
    const uids = [...new Set(orderRows.map(o => o.user_id).filter(Boolean))] as string[]
    const profMap: Record<string, { name: string }> = {}
    if (uids.length > 0) {
      const { data: profs } = await supabase.from('profiles').select('id, name').in('id', uids)
      profs?.forEach((p: { id: string; name: string }) => { profMap[p.id] = p })
    }

    setTxns(orderRows.map(o => ({ ...o, profile: o.user_id ? (profMap[o.user_id] ?? null) : null })))
    setLoadingOrders(false)
  }

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
    if (activeTab === 'orders' && txns.length === 0) fetchOrders()
    if (activeTab === 'links' && links.length === 0) fetchLinks()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  // ── Orders Helpers ──────────────────────────────────────────────────────────
  const submitRefund = async () => {
    if (!refundDlg) return
    const amt = parseFloat(refundDlg.amount)
    if (isNaN(amt) || amt <= 0 || amt > refundDlg.total) {
      setRefundDlg(d => d ? { ...d, error: `Amount must be between $0.01 and $${refundDlg.total.toFixed(2)}` } : null)
      return
    }
    setRefundDlg(d => d ? { ...d, loading: true, error: '' } : null)
    const res = await fetch('/api/admin/refund', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: refundDlg.orderId, amount: amt }),
    })
    const json = await res.json()
    if (!res.ok) {
      setRefundDlg(d => d ? { ...d, loading: false, error: json.error ?? 'Refund failed' } : null)
      return
    }
    setTxns(prev => prev.map(t => t.id === refundDlg.orderId ? { ...t, payment_status: 'refunded', status: 'cancelled', refund_amount: amt } : t))
    setRefundDlg(null)
    showToast(`Refund of $${amt.toFixed(2)} processed`)
  }

  const handleCleanup = async () => {
    const pendingCount = txns.filter(t => (t.payment_status ?? 'pending') === 'pending').length
    if (pendingCount === 0) return showToast('No pending orders to clean up')
    if (!confirm(`Delete all ${pendingCount} pending test orders? This cannot be undone.`)) return
    
    setLoadingOrders(true)
    try {
      const pendingIds = txns.filter(t => (t.payment_status ?? 'pending') === 'pending').map(t => t.id)
      await supabase.from('order_items').delete().in('order_id', pendingIds)
      const { error } = await supabase.from('orders').delete().in('id', pendingIds)
      if (error) throw error
      setTxns(prev => prev.filter(t => !pendingIds.includes(t.id)))
      showToast(`Cleaned up ${pendingCount} orders`)
    } catch (err) {
      console.error('Cleanup error:', err)
      showToast('Cleanup failed')
    } finally {
      setLoadingOrders(false)
    }
  }

  const filteredOrders = txns
    .filter(t => filterOrders === 'all' || (t.payment_status ?? 'pending') === filterOrders)
    .filter(t => {
      const q = searchOrders.toLowerCase()
      return shortId(t.id).toLowerCase().includes(q) || (t.profile?.name ?? t.customer_name ?? '').toLowerCase().includes(q) || getZoneName(t.zones).toLowerCase().includes(q) || (t.square_payment_id ?? '').toLowerCase().includes(q)
    })

  // ── Links Helpers ───────────────────────────────────────────────────────────
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0c2340] dark:text-[#f8fafc]">Payments</h2>
          <p className="text-sm text-[#4a7fa5] dark:text-[#94a3b8]">Manage order transactions and custom payment links</p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-[#e0f7fa] dark:bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'orders' ? 'bg-white dark:bg-[#1e293b] text-[#0097a7] dark:text-[#b3e5fc] shadow-sm' : 'text-[#4a7fa5] hover:text-[#0097a7]'
            }`}
          >
            <DollarSign className="w-4 h-4" /> Orders
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'links' ? 'bg-white dark:bg-[#1e293b] text-[#0097a7] dark:text-[#b3e5fc] shadow-sm' : 'text-[#4a7fa5] hover:text-[#0097a7]'
            }`}
          >
            <Link2 className="w-4 h-4" /> Custom Links
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        // ── ORDERS TAB ─────────────────────────────────────────────────────────
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="flex flex-1 gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0097a7]" />
                <Input
                  placeholder="Search orders..."
                  value={searchOrders}
                  onChange={e => setSearchOrders(e.target.value)}
                  className="pl-10 border-[#cce7f0] dark:border-white/10 bg-white dark:bg-[#1e293b] text-[#0c2340] dark:text-[#f8fafc]"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {FILTER_OPTIONS.map(f => (
                  <button key={f} onClick={() => setFilterOrders(f)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize ${
                      filterOrders === f ? 'bg-[#0097a7] text-white' : 'bg-white dark:bg-[#1e293b] border border-[#cce7f0] text-[#4a7fa5]'
                    }`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleCleanup} className="border-red-200 text-red-500 hover:bg-red-50 gap-2">
                <Trash2 className="w-4 h-4" /> Cleanup Pending
              </Button>
              <Button size="sm" variant="outline" onClick={fetchOrders} className="border-[#cce7f0] text-[#4a7fa5] hover:bg-white/10">
                <RefreshCw className={`w-4 h-4 ${loadingOrders ? 'animate-spin' : ''}`} />
              </Button>
              <Button size="sm" variant="outline" className="border-[#cce7f0] text-[#4a7fa5] gap-2"
                onClick={() => exportCSV('payments.csv', filteredOrders.map(t => ({ id: shortId(t.id), amount: t.total, status: t.payment_status }))) }>
                <Download className="w-4 h-4" /> Export
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-4 border border-[#cce7f0] shadow-sm">
              <p className="text-xl font-extrabold text-[#0c2340]">${filteredOrders.reduce((s, t) => s + (t.payment_status === 'paid' ? t.total : 0), 0).toFixed(2)}</p>
              <p className="text-xs text-[#4a7fa5]">Filtered Paid Revenue</p>
            </div>
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-4 border border-[#cce7f0] shadow-sm">
              <p className="text-xl font-extrabold text-[#0c2340]">{filteredOrders.length}</p>
              <p className="text-xs text-[#4a7fa5]">Filtered Orders</p>
            </div>
          </div>

          {/* Table */}
          {loadingOrders ? (
             <div className="h-32 bg-white rounded-2xl border border-[#cce7f0] animate-pulse" />
          ) : (
            <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-[#cce7f0] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#f0f9ff] dark:bg-white/5 border-b border-[#cce7f0]">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold text-[#4a7fa5] uppercase">Order</th>
                      <th className="px-4 py-3 text-xs font-semibold text-[#4a7fa5] uppercase">Customer</th>
                      <th className="px-4 py-3 text-xs font-semibold text-[#4a7fa5] uppercase">Amount</th>
                      <th className="px-4 py-3 text-xs font-semibold text-[#4a7fa5] uppercase">Payment</th>
                      <th className="px-4 py-3 text-xs font-semibold text-[#4a7fa5] uppercase">Square ID</th>
                      <th className="px-4 py-3 text-xs font-semibold text-[#4a7fa5] uppercase">Date</th>
                      <th className="px-4 py-3 text-xs font-semibold text-[#4a7fa5] uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f9ff] dark:divide-white/5">
                    {filteredOrders.map(txn => {
                      const pb = paymentBadge(txn.payment_status)
                      return (
                        <tr key={txn.id} className="hover:bg-[#f0f9ff] dark:hover:bg-white/5">
                          <td className="px-4 py-3 font-mono text-xs font-bold text-[#0097a7]">{shortId(txn.id)}</td>
                          <td className="px-4 py-3 font-medium text-[#0c2340] max-w-[110px] truncate">{txn.profile?.name ?? txn.customer_name ?? 'Guest'}</td>
                          <td className="px-4 py-3 font-bold text-[#0c2340]">${txn.total.toFixed(2)}</td>
                          <td className="px-4 py-3"><Badge className={`text-[10px] ${pb.color}`}>{pb.label}</Badge></td>
                          <td className="px-4 py-3 font-mono text-[10px] text-[#4a7fa5]">{txn.square_payment_id ?? '—'}</td>
                          <td className="px-4 py-3 text-xs text-[#4a7fa5]">{fmtDate(txn.created_at)}</td>
                          <td className="px-4 py-3 flex gap-2">
                            {txn.payment_status === 'paid' && (
                              <Button size="sm" variant="outline" onClick={() => setRefundDlg({ orderId: txn.id, total: txn.total, amount: txn.total.toFixed(2), loading: false, error: '' })} className="h-7 text-xs border-red-200 text-red-500 hover:bg-red-50"><RotateCcw className="w-3 h-3 mr-1" /> Refund</Button>
                            )}
                            {txn.square_payment_id && (
                              <a href={`https://squareup.com/dashboard/sales/transactions/${txn.square_payment_id}`} target="_blank" rel="noreferrer"><Button size="sm" variant="outline" className="h-7 text-xs border-[#0097a7]/30 text-[#0097a7] hover:bg-[#e0f7fa]"><ExternalLink className="w-3 h-3 mr-1" /> Square</Button></a>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Refund Modal */}
          <AnimatePresence>
            {refundDlg && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/40" onClick={() => setRefundDlg(null)} />
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm relative z-10 border border-[#cce7f0]">
                  <h3 className="font-bold text-[#0c2340] mb-2">Issue Refund</h3>
                  <Input type="number" step="0.01" value={refundDlg.amount} onChange={e => setRefundDlg(d => d ? { ...d, amount: e.target.value } : null)} className="mb-4" />
                  {refundDlg.error && <p className="text-red-500 text-xs mb-4">{refundDlg.error}</p>}
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setRefundDlg(null)}>Cancel</Button>
                    <Button className="flex-1 bg-red-500 text-white hover:bg-red-600" onClick={submitRefund} disabled={refundDlg.loading}>{refundDlg.loading ? 'Processing' : 'Confirm'}</Button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        // ── LINKS TAB ──────────────────────────────────────────────────────────
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

          {/* QR Modal */}
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
          
          {/* Create Modal */}
          <CreateLinkModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onCreated={(link) => { setLinks(prev => [link, ...prev]); showQr(link); showToast('Link created') }} />

        </motion.div>
      )}
    </div>
  )
}

// ── Create Link Modal ─────────────────────────────────────────────────────────
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

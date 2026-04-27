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
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [searchOrders, setSearchOrders] = useState('')
  const [filterOrders, setFilterOrders] = useState('all')
  const [refundDlg, setRefundDlg] = useState<RefundDialog | null>(null)
  const [txns, setTxns] = useState<TxnRow[]>([])
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

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

  useEffect(() => {
    fetchOrders()
  }, [])

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
    setTxns((prev: TxnRow[]) => prev.map((t: TxnRow) => t.id === refundDlg.orderId ? { ...t, payment_status: 'refunded', status: 'cancelled', refund_amount: amt } : t))
    setRefundDlg(null)
    showToast(`Refund of $${amt.toFixed(2)} processed`)
  }

  const handleCleanup = async () => {
    const pendingCount = txns.filter((t: TxnRow) => (t.payment_status ?? 'pending') === 'pending').length
    if (pendingCount === 0) return showToast('No pending orders to clean up')
    if (!confirm(`Delete all ${pendingCount} pending test orders? This cannot be undone.`)) return
    
    setLoadingOrders(true)
    try {
      const pendingIds = txns.filter(t => (t.payment_status ?? 'pending') === 'pending').map(t => t.id)
      await supabase.from('order_items').delete().in('order_id', pendingIds)
      const { error } = await supabase.from('orders').delete().in('id', pendingIds)
      if (error) throw error
      setTxns((prev: TxnRow[]) => prev.filter((t: TxnRow) => !pendingIds.includes(t.id)))
      showToast(`Cleaned up ${pendingCount} orders`)
    } catch (err) {
      console.error('Cleanup error:', err)
      showToast('Cleanup failed')
    } finally {
      setLoadingOrders(false)
    }
  }

  const filteredOrders = txns
    .filter((t: TxnRow) => filterOrders === 'all' || (t.payment_status ?? 'pending') === filterOrders)
    .filter((t: TxnRow) => {
      const q = searchOrders.toLowerCase()
      return shortId(t.id).toLowerCase().includes(q) || (t.profile?.name ?? t.customer_name ?? '').toLowerCase().includes(q) || getZoneName(t.zones).toLowerCase().includes(q) || (t.square_payment_id ?? '').toLowerCase().includes(q)
    })



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
          <h2 className="text-2xl font-extrabold text-[#0c2340] dark:text-[#f8fafc]">Payments</h2>
          <p className="text-sm text-[#4a7fa5] dark:text-[#94a3b8]">Manage order transactions and refunds</p>
        </div>
      </div>

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
                onClick={() => exportCSV('payments.csv', filteredOrders.map((t: TxnRow) => ({ id: shortId(t.id), amount: t.total, status: t.payment_status }))) }>
                <Download className="w-4 h-4" /> Export
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-4 border border-[#cce7f0] shadow-sm">
              <p className="text-xl font-extrabold text-[#0c2340]">${filteredOrders.reduce((s: number, t: TxnRow) => s + (t.payment_status === 'paid' ? t.total : 0), 0).toFixed(2)}</p>
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
                    {filteredOrders.map((txn: TxnRow) => {
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
    </div>
  )
}

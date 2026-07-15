'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wallet, Search, Plus, Minus, History, RefreshCw, Users,
  ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Settings
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { adjustCustomerWallet, bulkAdjustCustomerWallets } from '@/app/admin/actions'

type CustomerWallet = {
  id: string
  name: string | null
  email: string | null
  wallet_balance: number
  created_at: string
}

type WalletTransaction = {
  id: string
  user_id: string
  amount: number
  balance_after: number
  transaction_type: string
  reason: string | null
  created_by: string | null
  created_at: string
}

const REASON_OPTIONS = [
  'Manual Adjustment',
  'Promotional Bonus',
  'Refund',
  'Correction',
  'Customer Service Credit',
  'Other',
]

export default function AdminWalletPage() {
  const [customers, setCustomers] = useState<CustomerWallet[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<CustomerWallet | null>(null)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [loadingTx, setLoadingTx] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  // Adjust form
  const [adjustAmount, setAdjustAmount] = useState('')
  const [adjustReason, setAdjustReason] = useState(REASON_OPTIONS[0])
  const [adjustCustomReason, setAdjustCustomReason] = useState('')
  const [adjustDir, setAdjustDir] = useState<'add' | 'deduct'>('add')
  const [adjusting, setAdjusting] = useState(false)

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Settings
  const [minTopup, setMinTopup] = useState('')
  const [presets, setPresets] = useState('')
  const [savingSettings, setSavingSettings] = useState(false)

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, wallet_balance, created_at')
      .order('wallet_balance', { ascending: false })
    if (!error && data) setCustomers(data)
    setLoading(false)
  }, [])

  const fetchSettings = useCallback(async () => {
    const { data } = await supabase
      .from('site_content')
      .select('key, value')
      .in('key', ['wallet_min_topup', 'wallet_presets'])
    if (data) {
      const map: Record<string, string> = {}
      for (const d of data) map[d.key] = d.value
      setMinTopup(map['wallet_min_topup'] ?? '20')
      setPresets(map['wallet_presets'] ?? '50,100,150,200')
    }
  }, [])

  useEffect(() => {
    fetchCustomers()
    fetchSettings()
  }, [fetchCustomers, fetchSettings])

  const openCustomer = async (customer: CustomerWallet) => {
    setSelected(customer)
    setAdjustAmount('')
    setAdjustDir('add')
    setLoadingTx(true)
    const { data } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', customer.id)
      .order('created_at', { ascending: false })
      .limit(50)
    setTransactions((data ?? []) as WalletTransaction[])
    setLoadingTx(false)
  }

  const handleAdjust = async () => {
    if (!selected) return
    const amount = parseFloat(adjustAmount)
    if (isNaN(amount) || amount <= 0) { showToast('Enter a valid amount', false); return }
    const finalReason = adjustReason === 'Other' ? adjustCustomReason : adjustReason
    if (!finalReason.trim()) { showToast('Please enter a reason', false); return }

    setAdjusting(true)
    const delta = adjustDir === 'add' ? amount : -amount
    const newBalance = Math.max(0, (selected.wallet_balance ?? 0) + delta)

    const { success, error } = await adjustCustomerWallet(selected.id, delta, newBalance, finalReason)

    if (!success) {
      showToast('Update failed: ' + error, false)
      setAdjusting(false)
      return
    }

    // Update local state
    const updated = { ...selected, wallet_balance: newBalance }
    setSelected(updated)
    setCustomers(prev => prev.map(c => c.id === selected.id ? updated : c))
    setAdjustAmount('')
    showToast(`Successfully ${adjustDir === 'add' ? 'added' : 'deducted'} $${amount.toFixed(2)} ${adjustDir === 'add' ? 'to' : 'from'} ${selected.name ?? selected.email}`)

    // Refresh transactions
    const { data } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', selected.id)
      .order('created_at', { ascending: false })
      .limit(50)
    setTransactions((data ?? []) as WalletTransaction[])

    setAdjusting(false)
  }

  const handleBulkAdjust = async () => {
    if (selectedIds.size === 0) return
    const amount = parseFloat(adjustAmount)
    if (isNaN(amount) || amount <= 0) { showToast('Enter a valid amount', false); return }
    const finalReason = adjustReason === 'Other' ? adjustCustomReason : adjustReason
    if (!finalReason.trim()) { showToast('Please enter a reason', false); return }

    setAdjusting(true)
    const delta = adjustDir === 'add' ? amount : -amount

    const { successCount, failCount } = await bulkAdjustCustomerWallets(Array.from(selectedIds), delta, finalReason)

    showToast(`Bulk updated: ${successCount} successful, ${failCount} failed.`)
    setAdjustAmount('')
    setSelectedIds(new Set())
    setAdjusting(false)
    fetchCustomers() // Refresh list to get new balances
  }

  const handleSaveSettings = async () => {
    setSavingSettings(true)
    const minVal = parseFloat(minTopup)
    if (isNaN(minVal) || minVal < 0) { showToast('Enter a valid minimum', false); setSavingSettings(false); return }
    const presetList = presets.split(',').map(p => parseFloat(p.trim())).filter(n => !isNaN(n))
    if (presetList.length === 0) { showToast('Enter at least one preset', false); setSavingSettings(false); return }

    await Promise.all([
      supabase.from('site_content').upsert({ key: 'wallet_min_topup', value: String(minVal) }, { onConflict: 'key' }),
      supabase.from('site_content').upsert({ key: 'wallet_presets', value: presetList.join(',') }, { onConflict: 'key' }),
    ])
    showToast('Settings saved!')
    setSavingSettings(false)
  }

  const filtered = customers.filter(c => {
    const q = search.toLowerCase()
    return (c.name ?? '').toLowerCase().includes(q) || (c.email ?? '').toLowerCase().includes(q)
  })

  const totalWalletValue = customers.reduce((s, c) => s + (c.wallet_balance ?? 0), 0)

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map(c => c.id)))
    }
  }

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent opening the individual customer view
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold ${
              toast.ok ? 'bg-[#0097a7] text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0c2340] dark:text-white flex items-center gap-2">
            <Wallet className="w-7 h-7 text-[#0097a7]" /> Wallet Management
          </h1>
          <p className="text-sm text-[#4a7fa5] dark:text-[#94a3b8] mt-1">View and manage customer wallet balances</p>
        </div>
        <Button onClick={fetchCustomers} variant="outline" size="sm" className="gap-2 border-[#cce7f0]">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Customers with Wallets', value: customers.filter(c => (c.wallet_balance ?? 0) > 0).length, icon: Users, color: '#0097a7' },
          { label: 'Total Wallet Value', value: `$${totalWalletValue.toFixed(2)}`, icon: Wallet, color: '#1565c0' },
          { label: 'Total Customer Accounts', value: customers.length, icon: Users, color: '#006064' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#1a2a3a] rounded-2xl p-5 border border-[#cce7f0] dark:border-[#1e3a52]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: stat.color + '18' }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#0c2340] dark:text-white">{stat.value}</p>
                <p className="text-xs text-[#4a7fa5] dark:text-[#94a3b8]">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a2a3a] rounded-3xl border border-[#cce7f0] dark:border-[#1e3a52] overflow-hidden flex flex-col max-h-[600px]">
          <div className="p-5 border-b border-[#f0f9ff] dark:border-[#1e3a52] flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a7fa5]" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 border-[#cce7f0]"
              />
            </div>
            <Button variant="outline" size="sm" onClick={toggleSelectAll} className="shrink-0 border-[#cce7f0] text-[#0097a7]">
              {selectedIds.size === filtered.length && filtered.length > 0 ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
          <div className="divide-y divide-[#f0f9ff] dark:divide-[#1e3a52] flex-1 overflow-y-auto">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 animate-pulse flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e0f7fa]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#e0f7fa] rounded w-1/2" />
                    <div className="h-3 bg-[#e0f7fa] rounded w-1/3" />
                  </div>
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="p-10 text-center text-[#4a7fa5]">No customers found</div>
            ) : (
              filtered.map(c => (
                <button
                  key={c.id}
                  onClick={() => openCustomer(c)}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[#f0f9ff] dark:hover:bg-white/5 transition-colors ${
                    selected?.id === c.id ? 'bg-[#e0f7fa] dark:bg-[#0097a7]/10' : ''
                  }`}
                >
                  <div 
                    className="pl-5 py-4 flex items-center shrink-0 cursor-pointer"
                    onClick={(e) => toggleSelect(c.id, e)}
                  >
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      selectedIds.has(c.id) ? 'bg-[#0097a7] border-[#0097a7]' : 'border-[#cce7f0] bg-white'
                    }`}>
                      {selectedIds.has(c.id) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0097a7] to-[#1565c0] flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {((c.name || c.email || '?')[0] || '?').toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#0c2340] dark:text-white text-sm truncate">{c.name ?? '(no name)'}</p>
                    <p className="text-xs text-[#4a7fa5] truncate">{c.email}</p>
                  </div>
                  <span className={`shrink-0 font-bold text-sm px-3 py-1 rounded-full ${
                    (c.wallet_balance ?? 0) > 0
                      ? 'bg-[#e0f7fa] text-[#0097a7]'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    ${(c.wallet_balance ?? 0).toFixed(2)}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">

          {/* Bulk Adjust Action */}
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#1a2a3a] rounded-3xl border border-[#cce7f0] dark:border-[#1e3a52] p-5 shadow-lg shadow-[#0097a7]/5"
            >
              <h3 className="font-bold text-[#0c2340] dark:text-white mb-1 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0097a7]" /> Bulk Adjust ({selectedIds.size})
              </h3>
              <p className="text-xs text-[#4a7fa5] mb-4">Apply a wallet credit or deduction to all selected customers simultaneously.</p>
              
              <div className="flex p-1 bg-[#f0f9ff] rounded-xl border border-[#cce7f0] mb-4">
                <button
                  onClick={() => setAdjustDir('add')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    adjustDir === 'add' ? 'bg-white text-green-600 shadow-sm' : 'text-[#4a7fa5]'
                  }`}
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
                <button
                  onClick={() => setAdjustDir('deduct')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    adjustDir === 'deduct' ? 'bg-white text-red-500 shadow-sm' : 'text-[#4a7fa5]'
                  }`}
                >
                  <Minus className="w-4 h-4" /> Deduct
                </button>
              </div>

              <div className="space-y-3">
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Amount ($)"
                  value={adjustAmount}
                  onChange={e => setAdjustAmount(e.target.value)}
                  className="border-[#cce7f0]"
                />
                <select
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#cce7f0] text-sm text-[#0c2340] dark:text-white dark:bg-[#1a2a3a] focus:border-[#0097a7] focus:outline-none"
                >
                  {REASON_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                {adjustReason === 'Other' && (
                  <Input
                    placeholder="Enter custom reason..."
                    value={adjustCustomReason}
                    onChange={e => setAdjustCustomReason(e.target.value)}
                    className="border-[#cce7f0]"
                  />
                )}
                <Button
                  onClick={handleBulkAdjust}
                  disabled={adjusting || !adjustAmount}
                  className={`w-full font-bold ${adjustDir === 'add' ? 'bg-[#0097a7] hover:bg-[#00838f]' : 'bg-red-500 hover:bg-red-600'} text-white`}
                >
                  {adjusting ? 'Processing Bulk...' : `Bulk ${adjustDir === 'add' ? 'Add' : 'Deduct'} $${parseFloat(adjustAmount || '0').toFixed(2)}`}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Settings */}
          <div className="bg-white dark:bg-[#1a2a3a] rounded-3xl border border-[#cce7f0] dark:border-[#1e3a52] p-5">
            <h3 className="font-bold text-[#0c2340] dark:text-white flex items-center gap-2 mb-4">
              <Settings className="w-4 h-4 text-[#0097a7]" /> Wallet Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#4a7fa5] uppercase tracking-wide block mb-1.5">Minimum Top-Up ($)</label>
                <Input
                  type="number"
                  value={minTopup}
                  onChange={e => setMinTopup(e.target.value)}
                  className="border-[#cce7f0]"
                  placeholder="e.g. 20"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#4a7fa5] uppercase tracking-wide block mb-1.5">Preset Amounts (comma-separated)</label>
                <Input
                  value={presets}
                  onChange={e => setPresets(e.target.value)}
                  className="border-[#cce7f0]"
                  placeholder="e.g. 50,100,150,200"
                />
                <p className="text-[10px] text-[#4a7fa5] mt-1">These appear as quick-select buttons on the customer wallet top-up page.</p>
              </div>
              <Button onClick={handleSaveSettings} disabled={savingSettings} className="w-full bg-[#0097a7] text-white">
                {savingSettings ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>

          {/* Adjust Wallet */}
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#1a2a3a] rounded-3xl border border-[#cce7f0] dark:border-[#1e3a52] p-5"
            >
              <h3 className="font-bold text-[#0c2340] dark:text-white mb-1">
                {selected.name ?? selected.email}
              </h3>
              <p className="text-2xl font-extrabold text-[#0097a7] mb-4">
                ${(selected.wallet_balance ?? 0).toFixed(2)}
              </p>

              {/* Add / Deduct toggle */}
              <div className="flex p-1 bg-[#f0f9ff] rounded-xl border border-[#cce7f0] mb-4">
                <button
                  onClick={() => setAdjustDir('add')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    adjustDir === 'add' ? 'bg-white text-green-600 shadow-sm' : 'text-[#4a7fa5]'
                  }`}
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
                <button
                  onClick={() => setAdjustDir('deduct')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    adjustDir === 'deduct' ? 'bg-white text-red-500 shadow-sm' : 'text-[#4a7fa5]'
                  }`}
                >
                  <Minus className="w-4 h-4" /> Deduct
                </button>
              </div>

              <div className="space-y-3">
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Amount ($)"
                  value={adjustAmount}
                  onChange={e => setAdjustAmount(e.target.value)}
                  className="border-[#cce7f0]"
                />
                <select
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#cce7f0] text-sm text-[#0c2340] dark:text-white dark:bg-[#1a2a3a] focus:border-[#0097a7] focus:outline-none"
                >
                  {REASON_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                {adjustReason === 'Other' && (
                  <Input
                    placeholder="Enter custom reason..."
                    value={adjustCustomReason}
                    onChange={e => setAdjustCustomReason(e.target.value)}
                    className="border-[#cce7f0]"
                  />
                )}
                <Button
                  onClick={handleAdjust}
                  disabled={adjusting || !adjustAmount}
                  className={`w-full font-bold ${adjustDir === 'add' ? 'bg-[#0097a7] hover:bg-[#00838f]' : 'bg-red-500 hover:bg-red-600'} text-white`}
                >
                  {adjusting ? 'Processing...' : `${adjustDir === 'add' ? 'Add' : 'Deduct'} $${parseFloat(adjustAmount || '0').toFixed(2)}`}
                </Button>
              </div>

              {/* Transaction History */}
              <div className="mt-6">
                <h4 className="text-sm font-bold text-[#0c2340] dark:text-white flex items-center gap-2 mb-3">
                  <History className="w-4 h-4 text-[#0097a7]" /> Transaction History
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {loadingTx ? (
                    <div className="text-center py-4 text-[#4a7fa5] text-sm animate-pulse">Loading...</div>
                  ) : transactions.length === 0 ? (
                    <div className="text-center py-4 text-[#4a7fa5] text-xs">No transactions yet</div>
                  ) : (
                    transactions.map(tx => (
                      <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc] dark:bg-white/5 text-sm">
                        <div>
                          <p className="font-medium text-[#0c2340] dark:text-white text-xs">{tx.reason ?? tx.transaction_type}</p>
                          <p className="text-[10px] text-[#4a7fa5]">
                            {new Date(tx.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                            {tx.created_by && ` · ${tx.created_by}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-sm ${tx.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {tx.amount > 0 ? '+' : ''}${tx.amount.toFixed(2)}
                          </p>
                          <p className="text-[10px] text-slate-400">${tx.balance_after.toFixed(2)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

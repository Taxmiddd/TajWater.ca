'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wallet, Search, Plus, Minus, History, RefreshCw, Users,
  AlertCircle, CheckCircle2, Settings, Mail, FileText, Package
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase'
import { adjustCustomerWallet, bulkAdjustCustomerWallets, getWalletTransactions, getAllWalletTransactions } from '@/app/admin/actions'

type CustomerWallet = {
  id: string
  name: string | null
  email: string | null
  wallet_balance: number
  created_at: string
  account_type: string
}

type Product = {
  id: string
  name: string
  price: number
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
  proof_url?: string | null
  profiles?: { name: string | null; email: string | null }
}

const REASON_OPTIONS = [
  'Manual Adjustment',
  'Product Purchase',
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
  const [activeTab, setActiveTab] = useState<'customer' | 'business'>('customer')
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [loadingTx, setLoadingTx] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [products, setProducts] = useState<Product[]>([])

  // Global History
  const [globalTransactions, setGlobalTransactions] = useState<WalletTransaction[]>([])
  const [loadingGlobalTx, setLoadingGlobalTx] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')

  // Product selection
  const [selectedItems, setSelectedItems] = useState<{product: Product, qty: number}[]>([])
  const [productSearch, setProductSearch] = useState('')
  const [discountPercent, setDiscountPercent] = useState('0')

  // Adjust form
  const [adjustAmount, setAdjustAmount] = useState('')
  const [adjustReason, setAdjustReason] = useState(REASON_OPTIONS[0])
  const [adjustCustomReason, setAdjustCustomReason] = useState('')
  const [adjustDir, setAdjustDir] = useState<'add' | 'deduct'>('add')
  const [adjusting, setAdjusting] = useState(false)
  
  // New features
  const [notifyCustomer, setNotifyCustomer] = useState(true)
  const [internalNotes, setInternalNotes] = useState('')

  // Custom charges (delivery fee, upstairs fee, rack rental, etc.)
  const [customCharges, setCustomCharges] = useState<{label: string, amount: string}[]>([])
  const addCustomCharge = () => setCustomCharges(prev => [...prev, { label: '', amount: '' }])
  const updateCustomCharge = (i: number, field: 'label' | 'amount', val: string) =>
    setCustomCharges(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c))
  const removeCustomCharge = (i: number) => setCustomCharges(prev => prev.filter((_, idx) => idx !== i))

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkSelectedItems, setBulkSelectedItems] = useState<{product: Product, qty: number}[]>([])
  const [bulkProductSearch, setBulkProductSearch] = useState('')
  const [bulkDiscountPercent, setBulkDiscountPercent] = useState('0')
  const [bulkNotifyCustomer, setBulkNotifyCustomer] = useState(true)
  const [bulkInternalNotes, setBulkInternalNotes] = useState('')

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
      .select('id, name, email, wallet_balance, created_at, account_type')
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

  const fetchProducts = useCallback(async () => {
    const { data } = await supabase.from('products').select('id, name, price').eq('active', true).order('name')
    if (data) setProducts(data)
  }, [])

  const fetchGlobalTransactions = useCallback(async (q?: string) => {
    setLoadingGlobalTx(true)
    const data = await getAllWalletTransactions(q)
    setGlobalTransactions(data as WalletTransaction[])
    setLoadingGlobalTx(false)
  }, [])

  useEffect(() => {
    fetchCustomers()
    fetchSettings()
    fetchProducts()
    fetchGlobalTransactions()
  }, [fetchCustomers, fetchSettings, fetchProducts, fetchGlobalTransactions])

  const openCustomer = async (customer: CustomerWallet) => {
    setSelected(customer)
    setAdjustAmount('')
    setAdjustDir('add')
    setAdjustReason(REASON_OPTIONS[0])
    setSelectedItems([])
    setDiscountPercent('0')
    setInternalNotes('')
    setNotifyCustomer(true)
    setLoadingTx(true)
    const data = await getWalletTransactions(customer.id)
    setTransactions(data as WalletTransaction[])
    setLoadingTx(false)
  }

  // Auto-calculate amount for product purchases
  useEffect(() => {
    if (adjustReason === 'Product Purchase' && adjustDir === 'deduct') {
      const subtotal = selectedItems.reduce((sum, item) => sum + (item.product.price * item.qty), 0)
      const customTotal = customCharges.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0)
      const discount = parseFloat(discountPercent) || 0
      const total = (subtotal + customTotal) - ((subtotal + customTotal) * discount / 100)
      setAdjustAmount(Math.max(0, total).toFixed(2))
    }
  }, [selectedItems, customCharges, discountPercent, adjustReason, adjustDir])

  useEffect(() => {
    if (adjustReason === 'Product Purchase' && adjustDir === 'deduct') {
      const subtotal = bulkSelectedItems.reduce((sum, item) => sum + (item.product.price * item.qty), 0)
      const discount = parseFloat(bulkDiscountPercent) || 0
      const total = subtotal - (subtotal * discount / 100)
      setAdjustAmount(Math.max(0, total).toFixed(2))
    }
  }, [bulkSelectedItems, bulkDiscountPercent, adjustReason, adjustDir])

  const handleAdjust = async () => {
    if (!selected) return
    const amount = parseFloat(adjustAmount)
    if (isNaN(amount) || amount <= 0) { showToast('Enter a valid amount', false); return }
    let finalReason = adjustReason === 'Other' ? adjustCustomReason : adjustReason
    if (adjustReason === 'Product Purchase' && adjustDir === 'deduct') {
      if (selectedItems.length === 0 && customCharges.filter(c => c.label && parseFloat(c.amount) > 0).length === 0) { showToast('Please select at least one product or add a custom charge', false); return }
      const itemsStr = [
        ...selectedItems.map(i => `${i.qty}x ${i.product.name}`),
        ...customCharges.filter(c => c.label && parseFloat(c.amount) > 0).map(c => `${c.label} ($${parseFloat(c.amount).toFixed(2)})`)
      ].join(', ')
      const discountStr = (parseFloat(discountPercent) || 0) > 0 ? ` (${discountPercent}% Off)` : ''
      finalReason = `Product Purchase: ${itemsStr}${discountStr}`
    }
    if (!finalReason.trim()) { showToast('Please enter a reason', false); return }

    setAdjusting(true)
    const delta = adjustDir === 'add' ? amount : -amount
    const newBalance = Math.max(0, (selected.wallet_balance ?? 0) + delta)

    // Build items for email (products + custom charges)
    const emailItems: { name: string; qty: number; unitPrice: number }[] = [
      ...selectedItems.map(i => ({ name: i.product.name, qty: i.qty, unitPrice: i.product.price })),
      ...customCharges.filter(c => c.label && parseFloat(c.amount) > 0).map(c => ({ name: c.label, qty: 1, unitPrice: parseFloat(c.amount) })),
    ]

    const { success, error } = await adjustCustomerWallet(selected.id, delta, newBalance, finalReason, notifyCustomer, internalNotes.trim() || undefined, emailItems.length > 0 ? emailItems : undefined)

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
    setInternalNotes('')
    setCustomCharges([])
    setSelectedItems([])
    setDiscountPercent('0')
    showToast(`Successfully ${adjustDir === 'add' ? 'added' : 'deducted'} $${amount.toFixed(2)} ${adjustDir === 'add' ? 'to' : 'from'} ${selected.name ?? selected.email}`)

    // Refresh transactions
    const data = await getWalletTransactions(selected.id)
    setTransactions(data as WalletTransaction[])
    fetchGlobalTransactions(globalSearch)

    setAdjusting(false)
  }

  const handleBulkAdjust = async () => {
    if (selectedIds.size === 0) return
    const amount = parseFloat(adjustAmount)
    if (isNaN(amount) || amount <= 0) { showToast('Enter a valid amount', false); return }
    let finalReason = adjustReason === 'Other' ? adjustCustomReason : adjustReason
    if (adjustReason === 'Product Purchase' && adjustDir === 'deduct') {
      if (bulkSelectedItems.length === 0) { showToast('Please select at least one product', false); return }
      const itemsStr = bulkSelectedItems.map(i => `${i.qty}x ${i.product.name}`).join(', ')
      const discountStr = (parseFloat(bulkDiscountPercent) || 0) > 0 ? ` (${bulkDiscountPercent}% Off)` : ''
      finalReason = `Product Purchase: ${itemsStr}${discountStr}`
    }
    if (!finalReason.trim()) { showToast('Please enter a reason', false); return }

    setAdjusting(true)
    const delta = adjustDir === 'add' ? amount : -amount

    const { successCount, failCount } = await bulkAdjustCustomerWallets(Array.from(selectedIds), delta, finalReason, bulkNotifyCustomer, bulkInternalNotes.trim() || undefined)

    showToast(`Bulk updated: ${successCount} successful, ${failCount} failed.`)
    setAdjustAmount('')
    setSelectedIds(new Set())
    setBulkInternalNotes('')
    setAdjusting(false)
    fetchCustomers() // Refresh list to get new balances
    fetchGlobalTransactions(globalSearch)
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

  const customersInTab = customers.filter(c => (c.account_type || 'customer') === activeTab)

  const filtered = customersInTab.filter(c => {
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
    <div className="space-y-6 pb-20">
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
          <p className="text-sm text-[#4a7fa5] dark:text-[#94a3b8] mt-1">Manage balances and view transaction history</p>
        </div>
        <Button onClick={() => { fetchCustomers(); fetchGlobalTransactions(globalSearch) }} variant="outline" size="sm" className="gap-2 border-[#cce7f0]">
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

      {/* Main Content Tabs */}
      <Tabs defaultValue="customers" className="w-full">
        <TabsList className="bg-[#f0f9ff] dark:bg-[#1a2a3a] border border-[#cce7f0] dark:border-[#1e3a52] h-12 px-1 rounded-2xl mb-6">
          <TabsTrigger value="customers" className="rounded-xl data-[state=active]:bg-[#0097a7] data-[state=active]:text-white data-[state=active]:shadow-sm">
            Customers & Adjustments
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-xl data-[state=active]:bg-[#0097a7] data-[state=active]:text-white data-[state=active]:shadow-sm">
            Global History
          </TabsTrigger>
          <TabsTrigger value="bulk" className="rounded-xl data-[state=active]:bg-[#0097a7] data-[state=active]:text-white data-[state=active]:shadow-sm flex items-center gap-1">
            Bulk Operations {selectedIds.size > 0 && <span className="bg-white text-[#0097a7] text-[10px] font-bold px-1.5 rounded-full">{selectedIds.size}</span>}
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-xl data-[state=active]:bg-[#0097a7] data-[state=active]:text-white data-[state=active]:shadow-sm">
            Settings
          </TabsTrigger>
        </TabsList>

        {/* --- CUSTOMERS TAB --- */}
        <TabsContent value="customers">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer List */}
            <div className="lg:col-span-2 bg-white dark:bg-[#1a2a3a] rounded-3xl border border-[#cce7f0] dark:border-[#1e3a52] overflow-hidden flex flex-col min-h-[600px]">
              <div className="p-5 border-b border-[#f0f9ff] dark:border-[#1e3a52] flex flex-col sm:flex-row gap-4 items-center bg-slate-50 dark:bg-slate-900/50">
                <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto shrink-0 shadow-sm border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => { setActiveTab('customer'); setSelectedIds(new Set()) }}
                    className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'customer' ? 'bg-[#0097a7] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                  >
                    Customers
                  </button>
                  <button
                    onClick={() => { setActiveTab('business'); setSelectedIds(new Set()) }}
                    className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'business' ? 'bg-[#0097a7] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                  >
                    Business
                  </button>
                </div>
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a7fa5]" />
                  <Input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-10 border-[#cce7f0] dark:border-[#1e3a52] bg-white dark:bg-slate-800 focus:border-[#0097a7] rounded-xl"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={toggleSelectAll} className="shrink-0 border-[#cce7f0] text-[#0097a7] rounded-xl h-10">
                  {selectedIds.size === filtered.length && filtered.length > 0 ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              <div className="divide-y divide-[#f0f9ff] dark:divide-[#1e3a52] flex-1 overflow-y-auto max-h-[800px]">
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
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0097a7] to-[#1565c0] flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
                        {((c.name || c.email || '?')[0] || '?').toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#0c2340] dark:text-white text-sm truncate">{c.name ?? '(no name)'}</p>
                        <p className="text-xs text-[#4a7fa5] truncate">{c.email}</p>
                      </div>
                      <span className={`shrink-0 font-bold text-sm px-3 py-1 rounded-full shadow-sm ${
                        (c.wallet_balance ?? 0) > 0
                          ? 'bg-[#e0f7fa] text-[#0097a7] border border-[#b3e5fc]'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        ${(c.wallet_balance ?? 0).toFixed(2)}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Adjust Wallet Right Panel */}
            <div className="space-y-6">
              {selected ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white dark:bg-[#1a2a3a] rounded-3xl border border-[#cce7f0] dark:border-[#1e3a52] p-5 shadow-lg shadow-[#0097a7]/5"
                >
                  <div className="flex items-start justify-between mb-4 border-b border-[#f0f9ff] pb-4">
                    <div>
                      <h3 className="font-bold text-[#0c2340] dark:text-white mb-1 text-lg">
                        {selected.name ?? selected.email}
                      </h3>
                      <p className="text-3xl font-extrabold text-[#0097a7]">
                        ${(selected.wallet_balance ?? 0).toFixed(2)}
                      </p>
                    </div>
                    <select
                      value={selected.account_type || 'customer'}
                      onChange={async (e) => {
                        const newType = e.target.value
                        const { error } = await supabase.from('profiles').update({ account_type: newType }).eq('id', selected.id)
                        if (!error) {
                          setSelected({ ...selected, account_type: newType })
                          showToast('Account type updated')
                          fetchCustomers()
                        } else {
                          showToast('Error updating account type', false)
                        }
                      }}
                      className="px-3 py-1.5 bg-[#f0f9ff] dark:bg-slate-800 rounded-lg text-xs font-semibold text-[#0097a7] border border-[#cce7f0] dark:border-slate-700 outline-none cursor-pointer"
                    >
                      <option value="customer">Customer</option>
                      <option value="business">Business</option>
                    </select>
                  </div>

                  {/* Add / Deduct toggle */}
                  {adjustReason !== 'Product Purchase' && (
                    <div className="flex p-1.5 bg-[#f0f9ff] dark:bg-slate-800 rounded-2xl border border-[#cce7f0] dark:border-slate-700 mb-5">
                      <button
                        onClick={() => setAdjustDir('add')}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          adjustDir === 'add' ? 'bg-white dark:bg-slate-700 text-green-600 shadow-sm' : 'text-[#4a7fa5] hover:bg-white/50'
                        }`}
                      >
                        <Plus className="w-4 h-4" /> Add Funds
                      </button>
                      <button
                        onClick={() => setAdjustDir('deduct')}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          adjustDir === 'deduct' ? 'bg-white dark:bg-slate-700 text-red-500 shadow-sm' : 'text-[#4a7fa5] hover:bg-white/50'
                        }`}
                      >
                        <Minus className="w-4 h-4" /> Deduct Funds
                      </button>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-[#4a7fa5] uppercase mb-1 block">Amount ($)</label>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="0.00"
                        value={adjustAmount}
                        onChange={e => setAdjustAmount(e.target.value)}
                        className="border-[#cce7f0] text-lg font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#4a7fa5] uppercase mb-1 block">Reason for adjustment</label>
                      <select
                        value={adjustReason}
                        onChange={e => {
                          setAdjustReason(e.target.value)
                          if (e.target.value === 'Product Purchase') setAdjustDir('deduct')
                        }}
                        className="w-full h-11 px-3 rounded-xl border border-[#cce7f0] text-sm text-[#0c2340] dark:text-white dark:bg-[#1a2a3a] focus:border-[#0097a7] focus:outline-none"
                      >
                        {REASON_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>

                    {/* Product Purchase selection */}
                    {adjustReason === 'Product Purchase' && (
                      <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                          <Input
                            placeholder="Search products to charge..."
                            value={productSearch}
                            onChange={e => setProductSearch(e.target.value)}
                            className="pl-9 border-slate-300 dark:border-slate-700 bg-white"
                          />
                        </div>
                        {productSearch && (
                          <div className="max-h-40 overflow-y-auto space-y-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 shadow-sm">
                            {products
                              .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                              .map(p => (
                                <button
                                  key={p.id}
                                  onClick={() => {
                                    const existing = selectedItems.find(i => i.product.id === p.id)
                                    if (existing) {
                                      setSelectedItems(selectedItems.map(i => i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i))
                                    } else {
                                      setSelectedItems([...selectedItems, { product: p, qty: 1 }])
                                    }
                                    setProductSearch('')
                                  }}
                                  className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 flex justify-between items-center"
                                >
                                  <span className="font-medium text-slate-800 dark:text-slate-200">{p.name}</span>
                                  <span className="text-[#0097a7] font-semibold">${p.price.toFixed(2)}</span>
                                </button>
                            ))}
                          </div>
                        )}
                        {selectedItems.length > 0 && (
                          <div className="space-y-2 mt-3">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Selected Products</label>
                            {selectedItems.map(item => (
                              <div key={item.product.id} className="flex items-center justify-between bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                <div className="flex flex-col">
                                  <span className="text-sm font-semibold">{item.product.name}</span>
                                  <span className="text-xs text-slate-500">${item.product.price.toFixed(2)} each</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button onClick={() => setSelectedItems(selectedItems.map(i => i.product.id === item.product.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))} className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200">-</button>
                                  <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
                                  <button onClick={() => setSelectedItems(selectedItems.map(i => i.product.id === item.product.id ? { ...i, qty: i.qty + 1 } : i))} className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200">+</button>
                                  <button onClick={() => setSelectedItems(selectedItems.filter(i => i.product.id !== item.product.id))} className="w-7 h-7 rounded bg-red-100 text-red-500 flex items-center justify-center ml-2 hover:bg-red-200">×</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-3">
                          <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Discount (%)</label>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={discountPercent}
                            onChange={e => setDiscountPercent(e.target.value)}
                            className="border-slate-300 dark:border-slate-700 bg-white"
                          />
                        </div>

                        {/* Custom charges (delivery fee, upstairs, rack rental, etc.) */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Custom Charges</label>
                            <button
                              type="button"
                              onClick={addCustomCharge}
                              className="text-xs font-semibold text-[#0097a7] hover:text-[#00838f] flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#f0f9ff] transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Charge
                            </button>
                          </div>
                          {customCharges.length === 0 && (
                            <p className="text-[11px] text-slate-400 italic">e.g. Delivery Fee, Upstairs Fee, Rack Rental…</p>
                          )}
                          <div className="space-y-2">
                            {customCharges.map((charge, i) => (
                              <div key={i} className="flex gap-2 items-center">
                                <Input
                                  placeholder="Label (e.g. Delivery Fee)"
                                  value={charge.label}
                                  onChange={e => updateCustomCharge(i, 'label', e.target.value)}
                                  className="flex-1 border-slate-300 dark:border-slate-700 bg-white text-sm"
                                />
                                <div className="relative w-28 shrink-0">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">$</span>
                                  <Input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    placeholder="0.00"
                                    value={charge.amount}
                                    onChange={e => updateCustomCharge(i, 'amount', e.target.value)}
                                    className="pl-6 border-slate-300 dark:border-slate-700 bg-white text-sm font-semibold"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeCustomCharge(i)}
                                  className="w-7 h-7 rounded bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200 shrink-0"
                                >×</button>
                              </div>
                            ))}
                          </div>
                          {customCharges.filter(c => c.label && parseFloat(c.amount) > 0).length > 0 && (
                            <div className="mt-2 flex justify-between text-xs font-semibold text-[#0097a7] bg-[#f0f9ff] rounded-lg px-3 py-1.5">
                              <span>Custom charges subtotal</span>
                              <span>${customCharges.reduce((s, c) => s + (parseFloat(c.amount) || 0), 0).toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {adjustReason === 'Other' && (
                      <Input
                        placeholder="Enter custom reason..."
                        value={adjustCustomReason}
                        onChange={e => setAdjustCustomReason(e.target.value)}
                        className="border-[#cce7f0]"
                      />
                    )}

                    {/* Notification & Notes */}
                    <div className="bg-[#f8fafc] dark:bg-slate-800/50 p-4 rounded-xl border border-[#cce7f0] dark:border-slate-700 space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifyCustomer}
                          onChange={e => setNotifyCustomer(e.target.checked)}
                          className="w-4 h-4 text-[#0097a7] rounded border-[#cce7f0] focus:ring-[#0097a7]"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-[#0c2340] dark:text-white flex items-center gap-1.5">
                            <Mail className="w-4 h-4 text-[#0097a7]" /> Send Email Notification
                          </span>
                          <span className="text-[10px] text-[#4a7fa5]">Notify the customer of this wallet update</span>
                        </div>
                      </label>
                      <div>
                        <label className="text-sm font-semibold text-[#0c2340] dark:text-white flex items-center gap-1.5 mb-1.5">
                          <FileText className="w-4 h-4 text-[#0097a7]" /> Internal Notes
                        </label>
                        <textarea
                          placeholder="Optional notes for admins only. Not visible to the customer."
                          value={internalNotes}
                          onChange={e => setInternalNotes(e.target.value)}
                          rows={2}
                          className="w-full text-sm border border-[#cce7f0] dark:border-slate-700 rounded-xl p-2.5 bg-white dark:bg-slate-900 focus:outline-none focus:border-[#0097a7] resize-none"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleAdjust}
                      disabled={adjusting || !adjustAmount}
                      className={`w-full font-bold h-12 text-base rounded-xl ${adjustDir === 'add' ? 'bg-[#0097a7] hover:bg-[#00838f]' : 'bg-red-500 hover:bg-red-600'} text-white shadow-lg`}
                    >
                      {adjusting ? 'Processing...' : `${adjustDir === 'add' ? 'Add' : 'Deduct'} $${parseFloat(adjustAmount || '0').toFixed(2)}`}
                    </Button>
                  </div>

                  {/* Customer specific transaction history preview */}
                  <div className="mt-8 border-t border-[#f0f9ff] pt-6">
                    <h4 className="text-sm font-bold text-[#0c2340] dark:text-white flex items-center justify-between mb-4">
                      <span className="flex items-center gap-2"><History className="w-4 h-4 text-[#0097a7]" /> Recent History</span>
                      <span className="text-[10px] bg-[#f0f9ff] text-[#0097a7] px-2 py-0.5 rounded-full">{transactions.length} total</span>
                    </h4>
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                      {loadingTx ? (
                        <div className="text-center py-4 text-[#4a7fa5] text-sm animate-pulse">Loading history...</div>
                      ) : transactions.length === 0 ? (
                        <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-[#4a7fa5] text-xs">No transactions yet</div>
                      ) : (
                        transactions.map(tx => {
                          const isAdd = tx.amount > 0
                          const reasonParts = (tx.reason ?? '').split(' | Notes: ')
                          const mainReason = reasonParts[0]
                          const notes = reasonParts[1]
                          
                          return (
                            <div key={tx.id} className="flex items-start justify-between p-3 rounded-xl bg-[#f8fafc] dark:bg-white/5 border border-[#f0f9ff] dark:border-slate-800">
                              <div className="flex-1 pr-4">
                                <p className="font-semibold text-[#0c2340] dark:text-white text-xs leading-tight">
                                  {mainReason ?? tx.transaction_type.replace(/_/g, ' ')}
                                </p>
                                {notes && (
                                  <p className="mt-1 text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded inline-flex">
                                    Notes: {notes}
                                  </p>
                                )}
                                <p className="text-[10px] text-[#4a7fa5] mt-1 flex items-center gap-2">
                                  <span>{new Date(tx.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</span>
                                  {tx.created_by && <span className="bg-[#e0f7fa] px-1.5 rounded-full text-[#0097a7]">By {tx.created_by}</span>}
                                </p>
                                {tx.proof_url && (
                                  <div className="mt-2">
                                    <a href={tx.proof_url} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 underline flex items-center gap-1">
                                      <Package className="w-3 h-3" /> View Delivery Photo
                                    </a>
                                  </div>
                                )}
                              </div>
                              <div className="text-right shrink-0">
                                <p className={`font-bold text-sm ${isAdd ? 'text-green-600' : 'text-red-500'}`}>
                                  {isAdd ? '+' : ''}${tx.amount.toFixed(2)}
                                </p>
                                <p className="text-[10px] text-slate-400 font-medium">Bal: ${tx.balance_after.toFixed(2)}</p>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white dark:bg-[#1a2a3a] rounded-3xl border border-[#cce7f0] dark:border-[#1e3a52] h-full min-h-[400px] flex flex-col items-center justify-center p-10 text-center shadow-sm">
                  <div className="w-16 h-16 bg-[#f0f9ff] rounded-2xl flex items-center justify-center mb-4 text-[#0097a7]">
                    <Wallet className="w-8 h-8" />
                  </div>
                  <h3 className="font-extrabold text-lg text-[#0c2340]">No Customer Selected</h3>
                  <p className="text-sm text-[#4a7fa5] mt-2 max-w-[250px]">
                    Click on a customer from the list to view their wallet details and make adjustments.
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* --- GLOBAL HISTORY TAB --- */}
        <TabsContent value="history">
          <div className="bg-white dark:bg-[#1a2a3a] rounded-3xl border border-[#cce7f0] dark:border-[#1e3a52] overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#f0f9ff] dark:border-[#1e3a52] flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <h2 className="font-extrabold text-[#0c2340] dark:text-white flex items-center gap-2">
                <History className="w-5 h-5 text-[#0097a7]" /> Global Transaction History
              </h2>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a7fa5]" />
                <Input
                  placeholder="Search reasons, emails, names..."
                  value={globalSearch}
                  onChange={e => {
                    setGlobalSearch(e.target.value)
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') fetchGlobalTransactions(globalSearch)
                  }}
                  className="pl-10 border-[#cce7f0] dark:border-[#1e3a52] focus:border-[#0097a7] rounded-xl bg-white"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#f8fafc] dark:bg-slate-800 text-[#4a7fa5] font-semibold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Balance After</th>
                    <th className="px-6 py-4 w-full">Reason & Notes</th>
                    <th className="px-6 py-4 text-right">Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f9ff] dark:divide-[#1e3a52]">
                  {loadingGlobalTx ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-[#4a7fa5] animate-pulse">Loading global transactions...</td>
                    </tr>
                  ) : globalTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-[#4a7fa5]">No transactions found.</td>
                    </tr>
                  ) : (
                    globalTransactions.map(tx => {
                      const isAdd = tx.amount > 0
                      // Parse reason to extract notes if they were appended with " | Notes: "
                      const reasonParts = (tx.reason ?? '').split(' | Notes: ')
                      const mainReason = reasonParts[0]
                      const notes = reasonParts[1]

                      return (
                        <tr key={tx.id} className="hover:bg-[#f8fafc] dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 text-xs text-[#4a7fa5]">
                            {new Date(tx.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-[#0c2340] dark:text-white">{tx.profiles?.name ?? 'Unknown'}</span>
                              <span className="text-[10px] text-[#4a7fa5]">{tx.profiles?.email ?? ''}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-bold inline-flex items-center justify-center px-2 py-1 rounded-md text-xs ${isAdd ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {isAdd ? '+' : ''}${tx.amount.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-[#0c2340] dark:text-slate-300">
                            ${tx.balance_after.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-normal min-w-[250px]">
                            <p className="font-medium text-[#0c2340] dark:text-slate-200 text-xs">{mainReason || tx.transaction_type}</p>
                            {notes && (
                              <p className="mt-1 text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-lg inline-flex items-center gap-1.5">
                                <FileText className="w-3 h-3" /> {notes}
                              </p>
                            )}
                            {tx.proof_url && (
                              <div className="mt-2">
                                <a href={tx.proof_url} target="_blank" rel="noreferrer" className="text-[11px] text-blue-500 underline flex items-center gap-1">
                                  <Package className="w-3 h-3" /> View Delivery Photo
                                </a>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right text-xs text-[#4a7fa5]">
                            {tx.created_by ?? 'System'}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* --- BULK OPERATIONS TAB --- */}
        <TabsContent value="bulk">
          <div className="bg-white dark:bg-[#1a2a3a] rounded-3xl border border-[#cce7f0] dark:border-[#1e3a52] p-8 shadow-sm max-w-3xl mx-auto">
            <h2 className="font-extrabold text-2xl text-[#0c2340] dark:text-white mb-2 flex items-center gap-3">
              <Users className="w-7 h-7 text-[#0097a7]" /> Bulk Wallet Adjustments
            </h2>
            <p className="text-sm text-[#4a7fa5] mb-8">Apply a credit or deduction to multiple customers at once. First, select customers from the Customers tab.</p>
            
            {selectedIds.size === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-10 text-center">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-500 mb-1">No Customers Selected</h3>
                <p className="text-sm text-slate-400">Go to the Customers tab and use the checkboxes to select the customers you want to adjust.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-[#e0f7fa] border border-[#b3e5fc] rounded-2xl p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#0097a7]" />
                  <div>
                    <p className="font-bold text-[#006064]">Ready to adjust {selectedIds.size} customers</p>
                    <p className="text-xs text-[#0097a7]">The settings below will be applied to all selected accounts.</p>
                  </div>
                </div>

                <div className="flex p-1.5 bg-[#f0f9ff] dark:bg-slate-800 rounded-2xl border border-[#cce7f0] dark:border-slate-700">
                  <button
                    onClick={() => setAdjustDir('add')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-bold transition-all ${
                      adjustDir === 'add' ? 'bg-white text-green-600 shadow-sm' : 'text-[#4a7fa5]'
                    }`}
                  >
                    <Plus className="w-5 h-5" /> Add Funds
                  </button>
                  <button
                    onClick={() => setAdjustDir('deduct')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-bold transition-all ${
                      adjustDir === 'deduct' ? 'bg-white text-red-500 shadow-sm' : 'text-[#4a7fa5]'
                    }`}
                  >
                    <Minus className="w-5 h-5" /> Deduct Funds
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#4a7fa5] uppercase mb-1 block">Amount per user ($)</label>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="0.00"
                      value={adjustAmount}
                      onChange={e => setAdjustAmount(e.target.value)}
                      className="border-[#cce7f0] h-12 text-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#4a7fa5] uppercase mb-1 block">Reason</label>
                    <select
                      value={adjustReason}
                      onChange={e => {
                        setAdjustReason(e.target.value)
                        if (e.target.value === 'Product Purchase') setAdjustDir('deduct')
                      }}
                      className="w-full h-12 px-3 rounded-xl border border-[#cce7f0] text-sm text-[#0c2340] dark:text-white dark:bg-[#1a2a3a] focus:border-[#0097a7] focus:outline-none"
                    >
                      {REASON_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                {adjustReason === 'Other' && (
                  <div>
                    <label className="text-xs font-semibold text-[#4a7fa5] uppercase mb-1 block">Custom Reason</label>
                    <Input
                      placeholder="Enter custom reason..."
                      value={adjustCustomReason}
                      onChange={e => setAdjustCustomReason(e.target.value)}
                      className="border-[#cce7f0] h-11"
                    />
                  </div>
                )}

                {/* Notifications & Notes for Bulk */}
                <div className="bg-[#f8fafc] dark:bg-slate-800/50 p-5 rounded-xl border border-[#cce7f0] dark:border-slate-700 space-y-5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bulkNotifyCustomer}
                      onChange={e => setBulkNotifyCustomer(e.target.checked)}
                      className="w-5 h-5 text-[#0097a7] rounded border-[#cce7f0] focus:ring-[#0097a7]"
                    />
                    <div className="flex flex-col">
                      <span className="text-base font-semibold text-[#0c2340] dark:text-white flex items-center gap-2">
                        <Mail className="w-5 h-5 text-[#0097a7]" /> Send Email Notifications
                      </span>
                      <span className="text-xs text-[#4a7fa5]">This will send an email to ALL {selectedIds.size} customers. Uncheck to update silently.</span>
                    </div>
                  </label>
                  <div>
                    <label className="text-sm font-semibold text-[#0c2340] dark:text-white flex items-center gap-1.5 mb-2">
                      <FileText className="w-4 h-4 text-[#0097a7]" /> Internal Notes
                    </label>
                    <textarea
                      placeholder="Optional notes for admins only..."
                      value={bulkInternalNotes}
                      onChange={e => setBulkInternalNotes(e.target.value)}
                      rows={2}
                      className="w-full text-sm border border-[#cce7f0] dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-900 focus:outline-none focus:border-[#0097a7] resize-none"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleBulkAdjust}
                  disabled={adjusting || !adjustAmount}
                  className={`w-full font-bold h-14 text-lg rounded-xl ${adjustDir === 'add' ? 'bg-[#0097a7] hover:bg-[#00838f]' : 'bg-red-500 hover:bg-red-600'} text-white shadow-lg`}
                >
                  {adjusting ? 'Processing Bulk Action...' : `Bulk ${adjustDir === 'add' ? 'Add' : 'Deduct'} $${parseFloat(adjustAmount || '0').toFixed(2)} to ${selectedIds.size} users`}
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* --- SETTINGS TAB --- */}
        <TabsContent value="settings">
          <div className="bg-white dark:bg-[#1a2a3a] rounded-3xl border border-[#cce7f0] dark:border-[#1e3a52] p-8 max-w-xl mx-auto shadow-sm">
            <h2 className="font-extrabold text-2xl text-[#0c2340] dark:text-white flex items-center gap-3 mb-2">
              <Settings className="w-7 h-7 text-[#0097a7]" /> Wallet Settings
            </h2>
            <p className="text-sm text-[#4a7fa5] mb-8">Configure how the wallet system behaves for customers on the front-end.</p>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-[#0c2340] dark:text-white block mb-1.5">Minimum Top-Up Amount ($)</label>
                <p className="text-xs text-[#4a7fa5] mb-2">The lowest amount a customer can add to their wallet.</p>
                <Input
                  type="number"
                  value={minTopup}
                  onChange={e => setMinTopup(e.target.value)}
                  className="border-[#cce7f0] h-12 text-lg"
                  placeholder="e.g. 20"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-[#0c2340] dark:text-white block mb-1.5">Preset Quick-Add Amounts</label>
                <p className="text-xs text-[#4a7fa5] mb-2">Comma-separated values for the quick-select buttons.</p>
                <Input
                  value={presets}
                  onChange={e => setPresets(e.target.value)}
                  className="border-[#cce7f0] h-12"
                  placeholder="e.g. 50,100,150,200"
                />
              </div>
              <Button onClick={handleSaveSettings} disabled={savingSettings} className="w-full h-12 bg-[#0097a7] hover:bg-[#00838f] text-white font-bold rounded-xl text-lg mt-4">
                {savingSettings ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import { FileEdit, Search, Download, CheckCircle2, AlertCircle, RefreshCw, Eye } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

type Invoice = {
  id: string
  customer_email: string
  amount: number
  description: string
  status: string
  created_at: string
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const fetchInvoices = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setInvoices(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdating(id)
    const { error } = await supabase.from('invoices').update({ status: newStatus }).eq('id', id)
    if (!error) {
      setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv))
    }
    setUpdating(null)
  }

  const handleDownloadCsv = () => {
    const headers = ['ID', 'Date', 'Customer Email', 'Description', 'Amount', 'Status']
    const csvContent = [
      headers.join(','),
      ...invoices.map(inv => 
        [
          inv.id,
          new Date(inv.created_at).toLocaleDateString(),
          `"${inv.customer_email}"`,
          `"${(inv.description || '').replace(/"/g, '""')}"`,
          inv.amount.toFixed(2),
          inv.status
        ].join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'invoices.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filtered = invoices.filter(inv => 
    inv.customer_email.toLowerCase().includes(search.toLowerCase()) || 
    (inv.description && inv.description.toLowerCase().includes(search.toLowerCase()))
  )

  const stats = {
    total: invoices.length,
    unpaid: invoices.filter(i => i.status === 'unpaid').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    unpaidValue: invoices.filter(i => i.status === 'unpaid').reduce((s, i) => s + Number(i.amount), 0)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0c2340] dark:text-[#f8fafc] tracking-tight flex items-center gap-2">
            <FileEdit className="w-8 h-8 text-[#0097a7]" /> Invoices
          </h1>
          <p className="text-sm text-[#4a7fa5] dark:text-[#b3e5fc]/60 mt-1">Manage manual invoices logged by drivers or admins.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/invoice-preview">
            <Button variant="outline" className="border-[#0097a7] text-[#0097a7] dark:text-cyan-400">
              <Eye className="w-4 h-4 mr-2" /> Invoice Preview Tool
            </Button>
          </Link>
          <Button onClick={fetchInvoices} variant="outline" className="border-[#cce7f0] dark:border-white/10 dark:text-white">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button onClick={handleDownloadCsv} className="bg-[#0097a7] hover:bg-[#007b8a] text-white">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-5 border border-[#cce7f0] dark:border-white/5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
            <FileEdit className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[#0c2340] dark:text-white">{stats.total}</p>
            <p className="text-xs font-semibold text-[#4a7fa5] uppercase">Total Invoices</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-5 border border-[#cce7f0] dark:border-white/5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[#0c2340] dark:text-white">{stats.unpaid}</p>
            <p className="text-xs font-semibold text-[#4a7fa5] uppercase">Unpaid</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-5 border border-[#cce7f0] dark:border-white/5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[#0c2340] dark:text-white">{stats.paid}</p>
            <p className="text-xs font-semibold text-[#4a7fa5] uppercase">Paid</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-5 border border-amber-200 dark:border-amber-900/50 shadow-sm flex items-center gap-4 bg-amber-50/50 dark:bg-amber-900/10">
          <div>
            <p className="text-2xl font-extrabold text-amber-700 dark:text-amber-500">${stats.unpaidValue.toFixed(2)}</p>
            <p className="text-xs font-semibold text-amber-600/70 uppercase">Outstanding Value</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#cce7f0] dark:border-white/5 relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a7fa5] dark:text-[#b3e5fc]/40" />
            <Input 
              placeholder="Search by customer email or description..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-[#cce7f0] dark:border-white/10 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#cce7f0] dark:border-white/10">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f0f9ff] dark:bg-white/5 border-b border-[#cce7f0] dark:border-white/10 text-[#4a7fa5] dark:text-[#b3e5fc]/60">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Description</th>
                <th className="px-4 py-3 font-semibold text-right">Amount</th>
                <th className="px-4 py-3 font-semibold text-center">Status</th>
                <th className="px-4 py-3 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cce7f0] dark:divide-white/5">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-4 py-3"><div className="h-6 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#4a7fa5] dark:text-[#b3e5fc]/60">No invoices found.</td>
                </tr>
              ) : (
                filtered.map((inv, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    key={inv.id} 
                    className="hover:bg-[#f0f9ff]/50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 text-[#0c2340] dark:text-[#f8fafc]">{new Date(inv.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-[#0c2340] dark:text-[#f8fafc] font-medium">{inv.customer_email}</td>
                    <td className="px-4 py-3 text-[#4a7fa5] dark:text-[#b3e5fc]/80 truncate max-w-[200px]" title={inv.description}>{inv.description || '—'}</td>
                    <td className="px-4 py-3 text-[#0c2340] dark:text-[#f8fafc] font-black text-right">${inv.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge className={inv.status === 'paid' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-amber-100 text-amber-700 hover:bg-amber-100'}>
                        {inv.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {inv.status === 'unpaid' ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          disabled={updating === inv.id}
                          onClick={() => handleStatusChange(inv.id, 'paid')}
                          className="h-7 text-xs border-green-200 text-green-600 hover:bg-green-50"
                        >
                          Mark Paid
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          disabled={updating === inv.id}
                          onClick={() => handleStatusChange(inv.id, 'unpaid')}
                          className="h-7 text-xs border-amber-200 text-amber-600 hover:bg-amber-50"
                        >
                          Mark Unpaid
                        </Button>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

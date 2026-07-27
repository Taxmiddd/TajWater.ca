'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, History, Search, RefreshCw, Box, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

type InventoryLog = {
  id: string
  action_type: 'stock_add' | 'stock_remove' | 'bottle_return' | 'manual_adjust'
  quantity: number
  driver_name: string | null
  customer_name: string | null
  notes: string | null
  created_at: string
}

export default function InventoryPage() {
  const [logs, setLogs] = useState<InventoryLog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchLogs = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('inventory_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)
    
    if (!error && data) {
      setLogs(data as InventoryLog[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const filtered = logs.filter(l => 
    (l.driver_name?.toLowerCase().includes(search.toLowerCase())) ||
    (l.customer_name?.toLowerCase().includes(search.toLowerCase())) ||
    (l.notes?.toLowerCase().includes(search.toLowerCase()))
  )

  const totalReturned = logs.filter(l => l.action_type === 'bottle_return').reduce((sum, l) => sum + l.quantity, 0)
  const totalAdded = logs.filter(l => l.action_type === 'stock_add').reduce((sum, l) => sum + l.quantity, 0)
  
  // Calculate current estimated stock based on logs
  const currentStock = logs.reduce((sum, l) => {
    if (l.action_type === 'stock_add' || l.action_type === 'bottle_return') return sum + l.quantity
    if (l.action_type === 'stock_remove') return sum - l.quantity
    return sum
  }, 0)

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0c2340] dark:text-white flex items-center gap-2">
            <Package className="w-7 h-7 text-[#0097a7]" /> Inventory Management
          </h1>
          <p className="text-sm text-[#4a7fa5] dark:text-[#94a3b8] mt-1">Track empty jars, stock levels, and automated driver logs.</p>
        </div>
        <Button onClick={fetchLogs} variant="outline" size="sm" className="gap-2 border-[#cce7f0]">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1a2a3a] rounded-2xl p-5 border border-[#cce7f0] dark:border-[#1e3a52]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#e0f7fa]">
              <Box className="w-5 h-5 text-[#0097a7]" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#0c2340] dark:text-white">{currentStock}</p>
              <p className="text-xs text-[#4a7fa5] dark:text-[#94a3b8]">Est. Current Stock</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#1a2a3a] rounded-2xl p-5 border border-[#cce7f0] dark:border-[#1e3a52]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-100">
              <ArrowDownRight className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#0c2340] dark:text-white">{totalReturned}</p>
              <p className="text-xs text-[#4a7fa5] dark:text-[#94a3b8]">Total Empties Returned</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#1a2a3a] rounded-2xl p-5 border border-[#cce7f0] dark:border-[#1e3a52]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-100">
              <ArrowUpRight className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#0c2340] dark:text-white">{totalAdded}</p>
              <p className="text-xs text-[#4a7fa5] dark:text-[#94a3b8]">Total Stock Added</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a2a3a] rounded-3xl border border-[#cce7f0] dark:border-[#1e3a52] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#f0f9ff] dark:border-[#1e3a52] flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <h2 className="font-extrabold text-[#0c2340] dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-[#0097a7]" /> Action Logs
          </h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a7fa5]" />
            <Input
              placeholder="Search driver, customer, notes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 border-[#cce7f0] dark:border-[#1e3a52] focus:border-[#0097a7] rounded-xl bg-white"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f8fafc] dark:bg-slate-800 text-[#4a7fa5] font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4 w-full">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f9ff] dark:divide-[#1e3a52]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#4a7fa5] animate-pulse">Loading inventory logs...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#4a7fa5]">No logs found.</td>
                </tr>
              ) : (
                filtered.map(log => {
                  const isPositive = log.action_type === 'stock_add' || log.action_type === 'bottle_return'
                  
                  return (
                    <tr key={log.id} className="hover:bg-[#f8fafc] dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 text-xs text-[#4a7fa5]">
                        {new Date(log.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-[#0c2340] dark:text-white capitalize">
                          {log.action_type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold inline-flex items-center justify-center px-2 py-1 rounded-md text-xs ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {isPositive ? '+' : '-'}{log.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#0c2340] dark:text-slate-300">
                        {log.driver_name ?? '—'}
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#0c2340] dark:text-slate-300">
                        {log.customer_name ?? '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-normal min-w-[200px] text-xs text-[#4a7fa5]">
                        {log.notes ?? '—'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

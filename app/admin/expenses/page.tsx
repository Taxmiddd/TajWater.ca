'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { Download, Search, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type Expense = {
  id: string
  amount: number
  category: string
  description: string
  logged_by: string
  created_at: string
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')


  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setExpenses(data)
    setLoading(false)
  }

  const handleDownloadCsv = () => {
    const headers = ['Date', 'Category', 'Description', 'Amount', 'Logged By']
    const csvContent = [
      headers.join(','),
      ...expenses.map(e => 
        [
          new Date(e.created_at).toLocaleDateString(),
          `"${e.category}"`,
          `"${(e.description || '').replace(/"/g, '""')}"`,
          e.amount.toFixed(2),
          `"${e.logged_by}"`
        ].join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'expenses.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filtered = expenses.filter(e => 
    e.category.toLowerCase().includes(search.toLowerCase()) || 
    (e.description && e.description.toLowerCase().includes(search.toLowerCase()))
  )

  const total = filtered.reduce((sum, e) => sum + Number(e.amount), 0)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0c2340] dark:text-[#f8fafc] tracking-tight flex items-center gap-2">
            <FileText className="w-8 h-8 text-[#0097a7]" /> Expenses
          </h1>
          <p className="text-sm text-[#4a7fa5] dark:text-[#b3e5fc]/60 mt-1">Manage and export all expenses logged via the bot.</p>
        </div>
        <Button onClick={handleDownloadCsv} className="bg-[#0097a7] hover:bg-[#007b8a] text-white">
          <Download className="w-4 h-4 mr-2" /> Download CSV
        </Button>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#cce7f0] dark:border-white/5 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a7fa5] dark:text-[#b3e5fc]/40" />
            <Input 
              placeholder="Search category or description..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-[#cce7f0] dark:border-white/10"
            />
          </div>
          <div className="text-right">
            <p className="text-xs text-[#4a7fa5] dark:text-[#b3e5fc]/60 uppercase font-bold tracking-wider">Total Filtered</p>
            <p className="text-xl font-black text-[#0c2340] dark:text-[#f8fafc]">${total.toFixed(2)}</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#cce7f0] dark:border-white/10">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f0f9ff] dark:bg-white/5 border-b border-[#cce7f0] dark:border-white/10 text-[#4a7fa5] dark:text-[#b3e5fc]/60">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Description</th>
                <th className="px-4 py-3 font-semibold text-right">Amount</th>
                <th className="px-4 py-3 font-semibold">Logged By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cce7f0] dark:divide-white/5">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[#4a7fa5] dark:text-[#b3e5fc]/60">No expenses found.</td>
                </tr>
              ) : (
                filtered.map((e, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={e.id} 
                    className="hover:bg-[#f0f9ff]/50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 text-[#0c2340] dark:text-[#f8fafc]">{new Date(e.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-[#0c2340] dark:text-[#f8fafc] font-medium">{e.category}</td>
                    <td className="px-4 py-3 text-[#4a7fa5] dark:text-[#b3e5fc]/80 truncate max-w-[200px]">{e.description}</td>
                    <td className="px-4 py-3 text-[#0c2340] dark:text-[#f8fafc] font-black text-right">${e.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-[#4a7fa5] dark:text-[#b3e5fc]/60">{e.logged_by}</td>
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

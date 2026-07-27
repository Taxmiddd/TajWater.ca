'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Phone, FileText, CheckCircle2, Clock, Search, RefreshCw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'

type Lead = {
  id: string
  name: string
  contact_info: string
  notes: string | null
  status: string
  created_by: string
  created_at: string
}

const STATUS_COLOR: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  converted: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700'
}

export default function LeadsCRMPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchLeads = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setLeads(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdating(id)
    const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', id)
    if (!error) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l))
    }
    setUpdating(null)
  }

  const filtered = leads.filter(l => 
    l.name?.toLowerCase().includes(search.toLowerCase()) || 
    l.contact_info?.toLowerCase().includes(search.toLowerCase()) ||
    l.notes?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    converted: leads.filter(l => l.status === 'converted').length,
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0c2340] dark:text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-[#0097a7]" /> Leads CRM
          </h1>
          <p className="text-sm text-[#4a7fa5] dark:text-[#94a3b8] mt-1">Manage leads captured by drivers on the field.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchLeads} variant="outline" size="sm" className="gap-2 border-[#cce7f0]">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1a2a3a] rounded-2xl p-5 border border-[#cce7f0] dark:border-[#1e3a52] flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[#0c2340] dark:text-white">{stats.total}</p>
            <p className="text-xs font-semibold text-[#4a7fa5] uppercase">Total Leads</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1a2a3a] rounded-2xl p-5 border border-[#cce7f0] dark:border-[#1e3a52] flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[#0c2340] dark:text-white">{stats.new}</p>
            <p className="text-xs font-semibold text-[#4a7fa5] uppercase">New / Uncontacted</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1a2a3a] rounded-2xl p-5 border border-[#cce7f0] dark:border-[#1e3a52] flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[#0c2340] dark:text-white">{stats.converted}</p>
            <p className="text-xs font-semibold text-[#4a7fa5] uppercase">Converted</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0097a7]" />
        <Input
          placeholder="Search by name, contact info, notes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10 border-[#cce7f0] bg-white dark:bg-slate-800"
        />
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-[#4a7fa5] animate-pulse">Loading leads...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-[#1a2a3a] rounded-3xl border border-[#cce7f0] dark:border-[#1e3a52]">
            <Users className="w-12 h-12 text-[#cce7f0] mx-auto mb-3" />
            <p className="text-[#0c2340] dark:text-white font-bold">No leads found</p>
            <p className="text-sm text-[#4a7fa5] mt-1">Drivers can add leads via the Telegram bot using /lead</p>
          </div>
        ) : (
          filtered.map(lead => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#1a2a3a] rounded-2xl border border-[#cce7f0] dark:border-[#1e3a52] p-5 shadow-sm flex flex-col sm:flex-row gap-5"
            >
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-lg text-[#0c2340] dark:text-white flex items-center gap-2">
                      {lead.name}
                      <Badge className={STATUS_COLOR[lead.status] ?? 'bg-gray-100 text-gray-700'}>
                        {lead.status.toUpperCase()}
                      </Badge>
                    </h3>
                    <p className="text-xs text-[#4a7fa5] mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Added on {new Date(lead.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-[#0097a7] bg-[#e0f7fa] dark:bg-[#0097a7]/20 px-3 py-2 rounded-xl inline-flex w-fit">
                  <Phone className="w-4 h-4" /> {lead.contact_info}
                </div>

                {lead.notes && (
                  <div className="text-sm text-[#4a7fa5] dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    <span className="font-bold flex items-center gap-1.5 mb-1"><FileText className="w-3.5 h-3.5" /> Notes:</span>
                    {lead.notes}
                  </div>
                )}
              </div>

              <div className="sm:w-48 shrink-0 flex flex-col justify-between border-t sm:border-t-0 sm:border-l border-[#f0f9ff] dark:border-slate-800 pt-4 sm:pt-0 sm:pl-5 gap-3">
                <div>
                  <p className="text-xs font-semibold text-[#4a7fa5] uppercase mb-2">Update Status</p>
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    disabled={updating === lead.id}
                    className="w-full h-10 px-3 rounded-xl border border-[#cce7f0] text-sm text-[#0c2340] dark:text-white dark:bg-slate-800 focus:border-[#0097a7] focus:outline-none disabled:opacity-50"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
                
                <p className="text-[10px] text-slate-400">Captured by Driver ID: {lead.created_by}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

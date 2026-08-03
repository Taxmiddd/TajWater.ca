'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Package, Search, RefreshCw, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type Profile = {
  id: string
  name: string | null
  email: string | null
  empty_jars_held: number
}

type InventoryLog = {
  id: string
  created_at: string
  quantity: number
  customer_email: string | null
  driver_id: string | null
}

export default function AdminBottlesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [logs, setLogs] = useState<InventoryLog[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    
    // Fetch profiles that hold jars
    const { data: profData } = await supabase
      .from('profiles')
      .select('id, name, email, empty_jars_held')
      .order('empty_jars_held', { ascending: false })
      
    if (profData) {
      setProfiles(profData)
    }

    // Fetch recent pickup logs
    const { data: logData } = await supabase
      .from('inventory_logs')
      .select('id, created_at, quantity, customer_email, driver_id')
      .eq('action_type', 'picked_up_empty')
      .order('created_at', { ascending: false })
      .limit(100)
      
    if (logData) {
      setLogs(logData)
    }
    
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filtered = profiles.filter(p => {
    const q = search.toLowerCase()
    return (p.name?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q) || false)
  })
  
  // Only show profiles holding at least 1 jar, unless searched
  const displayProfiles = search ? filtered : filtered.filter(p => (p.empty_jars_held || 0) > 0)
  const totalJars = profiles.reduce((sum, p) => sum + (p.empty_jars_held || 0), 0)

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0c2340] dark:text-white flex items-center gap-2">
            <Package className="w-7 h-7 text-[#0097a7]" /> Bottle Tracking
          </h1>
          <p className="text-sm text-[#4a7fa5] dark:text-[#94a3b8] mt-1">Track empty bottles held by customers and recent driver pickups</p>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm" className="gap-2 border-[#cce7f0]">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1a2a3a] rounded-3xl border border-[#cce7f0] dark:border-[#1e3a52] overflow-hidden flex flex-col h-[600px] shadow-sm">
          <div className="p-5 border-b border-[#f0f9ff] dark:border-[#1e3a52] bg-slate-50 dark:bg-slate-900/50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-[#0c2340] dark:text-white">Customers Holding Jars</h2>
              <span className="bg-[#e0f7fa] text-[#0097a7] font-bold px-3 py-1 rounded-full text-sm">
                Total Jars Out: {totalJars}
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a7fa5]" />
              <Input
                placeholder="Search customers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 border-[#cce7f0] dark:border-[#1e3a52] bg-white dark:bg-slate-800 rounded-xl"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-[#f0f9ff] dark:divide-[#1e3a52]">
            {loading ? (
              <div className="p-10 text-center text-[#4a7fa5] animate-pulse">Loading data...</div>
            ) : displayProfiles.length === 0 ? (
              <div className="p-10 text-center text-[#4a7fa5]">No customers found holding jars</div>
            ) : (
              displayProfiles.map(p => (
                <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <div>
                    <p className="font-semibold text-[#0c2340] dark:text-white text-sm">{p.name || 'Unnamed'}</p>
                    <p className="text-xs text-[#4a7fa5]">{p.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {(p.empty_jars_held || 0) >= 5 && (
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    )}
                    <span className="font-bold text-lg text-[#0097a7] bg-[#f0f9ff] dark:bg-slate-800 w-10 h-10 flex items-center justify-center rounded-xl border border-[#cce7f0] dark:border-slate-700">
                      {p.empty_jars_held || 0}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a2a3a] rounded-3xl border border-[#cce7f0] dark:border-[#1e3a52] overflow-hidden flex flex-col h-[600px] shadow-sm">
          <div className="p-5 border-b border-[#f0f9ff] dark:border-[#1e3a52] bg-slate-50 dark:bg-slate-900/50">
            <h2 className="font-bold text-[#0c2340] dark:text-white mb-1">Recent Driver Pickups</h2>
            <p className="text-xs text-[#4a7fa5]">Last 100 empty bottles returned via Telegram Bot</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-[#f0f9ff] dark:divide-[#1e3a52]">
            {loading ? (
              <div className="p-10 text-center text-[#4a7fa5] animate-pulse">Loading logs...</div>
            ) : logs.length === 0 ? (
              <div className="p-10 text-center text-[#4a7fa5]">No recent pickups logged</div>
            ) : (
              logs.map(log => (
                <div key={log.id} className="p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-[#0c2340] dark:text-white text-sm">
                        Picked up {log.quantity} {log.quantity === 1 ? 'bottle' : 'bottles'}
                      </p>
                      <p className="text-xs text-[#4a7fa5] mt-1">From: {log.customer_email || 'Unknown'}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(log.created_at).toLocaleString('en-CA', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                    </span>
                  </div>
                  <div className="mt-2 text-[10px] bg-[#f0f9ff] text-[#0097a7] px-2 py-1 rounded inline-block font-medium">
                    Logged by Driver ID: {log.driver_id}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building, Mail, Phone, MapPin, CheckCircle2, XCircle, Search, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { WholesaleApplication } from '@/types'
import { useEffect } from 'react'

export default function WholesaleAdminPage() {
  const [apps, setApps] = useState<WholesaleApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchApps()
  }, [])

  const fetchApps = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('wholesale_applications')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) {
      setApps(data)
    }
    setLoading(false)
  }

  const filtered = apps.filter(a => 
    a.business_name.toLowerCase().includes(search.toLowerCase()) || 
    a.first_name.toLowerCase().includes(search.toLowerCase()) ||
    a.last_name.toLowerCase().includes(search.toLowerCase())
  )

  const handleApprove = async (id: string) => {
    const { error } = await supabase.from('wholesale_applications').update({ status: 'approved' }).eq('id', id)
    if (!error) {
      setApps(apps.map(a => a.id === id ? { ...a, status: 'approved' } : a))
    }
  }
  
  const handleReject = async (id: string) => {
    const { error } = await supabase.from('wholesale_applications').update({ status: 'rejected' }).eq('id', id)
    if (!error) {
      setApps(apps.map(a => a.id === id ? { ...a, status: 'rejected' } : a))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0c2340] dark:text-white">Wholesale Applications</h1>
          <p className="text-[#4a7fa5] dark:text-[#b3e5fc]/70 text-sm mt-1">Manage B2B resellers and wholesale partners</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a7fa5]" />
          <Input 
            placeholder="Search business or city..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-white dark:bg-[#1e293b] border-[#cce7f0] dark:border-white/10" 
          />
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0097a7]"></div>
          </div>
        ) : (
          <>
            {filtered.map((app, i) => (
              <motion.div 
                key={app.id} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-[#1e293b] rounded-2xl border border-[#cce7f0] dark:border-white/10 p-5 flex flex-col md:flex-row gap-4 md:items-center justify-between shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#e0f7fa] dark:bg-white/5 flex items-center justify-center shrink-0">
                    <Building className="w-6 h-6 text-[#0097a7] dark:text-[#b3e5fc]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-[#0c2340] dark:text-white text-lg">{app.business_name}</h3>
                      <Badge className={
                        app.status === 'approved' ? 'bg-green-100 text-green-700' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }>
                        {app.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#4a7fa5] dark:text-[#b3e5fc]/70">
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {app.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {app.phone}</span>
                      {app.estimated_volume && (
                        <span className="flex items-center gap-1 font-medium text-[#0097a7] dark:text-[#00bcd4]">
                           Vol: {app.estimated_volume} jugs/mo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#4a7fa5]/70 dark:text-[#b3e5fc]/50 mt-2">
                      Applied: {new Date(app.created_at).toLocaleDateString()} · Contact: {app.first_name} {app.last_name} · Type: {app.business_type}
                    </p>
                  </div>
                </div>

                {app.status === 'pending' && (
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button onClick={() => handleApprove(app.id)} className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </Button>
                    <Button onClick={() => handleReject(app.id)} variant="outline" className="flex-1 md:flex-none border-red-200 text-red-600 hover:bg-red-50 gap-2">
                      <XCircle className="w-4 h-4" /> Reject
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-[#1e293b] rounded-2xl border border-[#cce7f0] dark:border-white/10">
                <Building className="w-12 h-12 text-[#cce7f0] dark:text-white/10 mx-auto mb-3" />
                <p className="text-[#4a7fa5] dark:text-[#b3e5fc]/60">No wholesale applications found.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

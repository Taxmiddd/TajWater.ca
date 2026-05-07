'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Search, CheckCircle2, XCircle, ArrowRight, Clock, Send } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const HARDCODED_ZONES = [
  { name: 'Vancouver', slug: 'vancouver', fee: 'Free', schedule: 'Daily', color: '#006064', districts: ['Downtown', 'Kitsilano', 'East Van', 'Marpole', 'Kerrisdale'] },
  { name: 'Burnaby', slug: 'burnaby', fee: 'Free', schedule: 'Mon–Sat', color: '#0097a7', districts: ['Metrotown', 'Brentwood', 'Heights', 'South Slope'] },
  { name: 'Richmond', slug: 'richmond', fee: 'Free', schedule: 'Mon–Sat', color: '#00acc1', districts: ['Steveston', 'City Centre', 'Brighouse', 'Shellmont'] },
  { name: 'Surrey', slug: 'surrey', fee: 'Free', schedule: 'Mon–Sat', color: '#00acc1', districts: ['City Centre', 'Newton', 'Fleetwood', 'Cloverdale', 'White Rock'] },
  { name: 'Coquitlam', slug: 'coquitlam', fee: 'Free', schedule: 'Tue, Thu, Sat', color: '#1565c0', districts: ['Maillardville', 'Burke Mountain', 'Westwood Plateau'] },
  { name: 'Port Coquitlam', slug: 'port-coquitlam', fee: 'Free', schedule: 'Tue, Thu, Sat', color: '#0097a7', districts: ['Mary Hill', 'Citadel', 'Riverwood', 'Birchland'] },
  { name: 'Port Moody', slug: 'port-moody', fee: 'Free', schedule: 'Tue, Thu', color: '#006064', districts: ['Inlet Centre', 'Heritage Woods', 'Glenayre'] },
  { name: 'North Vancouver', slug: 'north-vancouver', fee: 'Free', schedule: 'Mon, Wed, Fri', color: '#0097a7', districts: ['Lynn Valley', 'Capilano', 'Deep Cove', 'Seymour'] },
  { name: 'West Vancouver', slug: 'west-vancouver', fee: 'Free', schedule: 'Tue, Thu, Sat', color: '#1565c0', districts: ['Dundarave', 'Ambleside', 'Horseshoe Bay', 'Caulfeild'] },
  { name: 'Langley', slug: 'langley', fee: 'Free', schedule: 'Tue, Thu, Sat', color: '#1565c0', districts: ['Langley City', 'Willoughby', 'Brookswood'] },
  { name: 'Langley Township', slug: 'langley-township', fee: 'Free', schedule: 'Tue, Thu, Sat', color: '#00acc1', districts: ['Fort Langley', 'Aldergrove', 'Walnut Grove'] },
  { name: 'Walnut Grove', slug: 'walnut-grove', fee: 'Free', schedule: 'Tue, Thu, Sat', color: '#0097a7', districts: ['Town Centre', 'Walnut Grove North', 'Topham Park'] },
  { name: 'Cloverdale', slug: 'cloverdale', fee: 'Free', schedule: 'Mon, Wed, Fri', color: '#006064', districts: ['Clayton', 'Clayton Heights', 'Cloverdale Town Centre'] },
  { name: 'Delta', slug: 'delta', fee: 'Free', schedule: 'Mon, Wed, Fri', color: '#0097a7', districts: ['Ladner', 'North Delta', 'Sunbury'] },
  { name: 'Tsawwassen', slug: 'tsawwassen', fee: 'Free', schedule: 'Mon, Wed, Fri', color: '#1565c0', districts: ['Tsawwassen Heights', 'Beach Grove', 'Boundary Bay'] },
  { name: 'White Rock', slug: 'white-rock', fee: 'Free', schedule: 'Mon, Wed, Fri', color: '#00acc1', districts: ['East Beach', 'West Beach', 'Hillcrest'] },
  { name: 'Maple Ridge', slug: 'maple-ridge', fee: 'Free', schedule: 'Wed, Fri', color: '#0097a7', districts: ['Albion', 'Haney', 'Silver Valley'] },
  { name: 'Pitt Meadows', slug: 'pitt-meadows', fee: 'Free', schedule: 'Wed, Fri', color: '#006064', districts: ['Central Pitt Meadows', 'South Bonson', 'North Meadows'] },
  { name: 'Mary Hill', slug: 'mary-hill', fee: 'Free', schedule: 'Tue, Thu, Sat', color: '#1565c0', districts: ['Mary Hill', 'Citadel Heights', 'Riverwood'] },
  { name: 'Squamish', slug: 'squamish', fee: 'Free', schedule: 'Thursdays', color: '#0097a7', districts: ['Downtown Squamish', 'Garibaldi', 'Hospital Hill'] },
  { name: 'Whistler', slug: 'whistler', fee: 'Free', schedule: 'Thursdays', color: '#006064', districts: ['Village', 'Creekside', 'Alta Lake', 'Brio'] },
]

interface Zone {
  name: string
  delivery_fee: number
  schedule: string
}

interface AreasContentProps {
  initialDbZones: Zone[]
}

export default function AreasContent({ initialDbZones }: AreasContentProps) {
  const [displayZones, setDisplayZones] = useState<typeof HARDCODED_ZONES>(HARDCODED_ZONES)
  const [search, setSearch] = useState('')
  const [result, setResult] = useState<typeof HARDCODED_ZONES[0] | null | 'notfound'>(null)
  const [checking, setChecking] = useState(false)
  const [requestForm, setRequestForm] = useState({ name: '', email: '', area: '', message: '' })
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (initialDbZones.length > 0) {
      const merged = initialDbZones.map((dbZone, i) => {
        const existing = HARDCODED_ZONES.find(hz => hz.name.toLowerCase() === dbZone.name.toLowerCase())
        return {
          name: dbZone.name,
          slug: existing?.slug || dbZone.name.toLowerCase().replace(/\s+/g, '-'),
          fee: dbZone.delivery_fee === 0 ? 'Free' : `$${dbZone.delivery_fee.toFixed(2)}`,
          schedule: dbZone.schedule,
          color: existing?.color || ['#0097a7', '#1565c0', '#006064', '#00acc1'][i % 4],
          districts: existing?.districts || []
        }
      })
      setDisplayZones(merged)
    } else {
      const fetchZones = async () => {
        const { supabase } = await import('@/lib/supabase')
        const { data } = await supabase
          .from('zones')
          .select('name, delivery_fee, schedule')
          .eq('active', true)
        if (data) {
          const merged = data.map((dbZone, i) => {
            const existing = HARDCODED_ZONES.find(hz => hz.name.toLowerCase() === dbZone.name.toLowerCase())
            return {
              name: dbZone.name,
              slug: existing?.slug || dbZone.name.toLowerCase().replace(/\s+/g, '-'),
              fee: dbZone.delivery_fee === 0 ? 'Free' : `$${dbZone.delivery_fee.toFixed(2)}`,
              schedule: dbZone.schedule,
              color: existing?.color || ['#0097a7', '#1565c0', '#006064', '#00acc1'][i % 4],
              districts: existing?.districts || []
            }
          })
          setDisplayZones(merged)
        }
      }
      fetchZones()
    }
  }, [initialDbZones])

  const checkArea = async () => {
    if (!search.trim()) return
    setChecking(true)
    await new Promise((r) => setTimeout(r, 600))
    const q = search.toLowerCase()
    const found = displayZones.find((z) =>
      z.name.toLowerCase().includes(q) ||
      z.districts.some((d) => d.toLowerCase().includes(q))
    )
    setResult(found ?? 'notfound')
    setChecking(false)
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-28 hero-gradient overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
            <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="#f0f9ff" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold mb-4">Delivery Coverage</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-5">
              We Deliver Across<br /><span className="gradient-text-light">Metro Vancouver</span>
            </h1>
            <p className="text-[#b3e5fc] text-xl max-w-2xl mx-auto">
              21 zones are covered and growing. Check your area and see our delivery schedule.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-[#0c2340] mb-6">Check Your Delivery Area</h2>
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0097a7]" />
                <Input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setResult(null) }}
                  onKeyDown={(e) => e.key === 'Enter' && checkArea()}
                  placeholder="Enter your city or neighbourhood..."
                  className="pl-10 h-12 rounded-xl border-[#cce7f0] focus:border-[#0097a7]"
                />
              </div>
              <Button onClick={checkArea} disabled={checking} className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#0097a7] to-[#1565c0] text-white font-semibold">
                {checking ? '...' : <><Search className="w-4 h-4 mr-2" />Check</>}
              </Button>
            </div>

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`rounded-2xl p-5 border text-left ${result !== 'notfound' ? 'bg-[#e0f7fa] border-[#0097a7]/30' : 'bg-red-50 border-red-200'}`}
                >
                  {result !== 'notfound' ? (
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-[#0097a7] mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold text-[#006064] mb-2">Yes! We deliver to {result.name}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                          <div className="flex items-center gap-1.5 text-[#0097a7]"><Clock className="w-3.5 h-3.5 shrink-0" /><span>{result.schedule}</span></div>
                        </div>
                      </div>
                      <Link href={`/areas/${result.slug}`} className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0097a7] hover:bg-[#006064] text-white text-sm font-semibold rounded-lg shrink-0 transition-colors">View Area <ArrowRight className="w-3 h-3" /></Link>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <XCircle className="w-6 h-6 text-red-500 shrink-0" />
                      <div>
                        <p className="font-bold text-red-700">Not in our coverage yet</p>
                        <p className="text-sm text-red-500">Submit a request below and we&apos;ll expand soon!</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Map embed */}
      <section className="py-4 bg-[#f0f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden border border-[#cce7f0] shadow-lg h-80 sm:h-96 lg:h-[480px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d350000!2d-122.95!3d49.45!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sca!4v1711680000000!5m2!1sen!2sca"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="TajWater Sea-to-Sky & Metro Vancouver Delivery Map"
            />
          </div>
        </div>
      </section>

      {/* Zone cards */}
      <section className="py-20 bg-[#f0f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#0c2340] mb-3">All Delivery Zones</h2>
            <p className="text-[#4a7fa5]">21 zones across Metro Vancouver with competitive delivery fees</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {displayZones.map((zone, i) => (
              <motion.div
                key={zone.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  href={`/areas/${zone.slug}`}
                  className="group block water-card bg-white rounded-2xl p-5 border border-[#cce7f0] hover:border-[#0097a7]/40 hover:shadow-md transition-all h-full"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: zone.color + '22' }}>
                      <MapPin className="w-4 h-4" style={{ color: zone.color }} />
                    </div>
                    <h3 className="font-bold text-[#0c2340] text-sm group-hover:text-[#0097a7] transition-colors">{zone.name}</h3>
                  </div>
                  <div className="space-y-1.5 text-xs text-[#4a7fa5]">
                    <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {zone.schedule}</div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {zone.districts.slice(0, 3).map((d) => (
                      <span key={d} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: zone.color + '18', color: zone.color }}>{d}</span>
                    ))}
                    {zone.districts.length > 3 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0f9ff] text-[#4a7fa5]">+{zone.districts.length - 3}</span>}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Static city links — SEO internal linking */}
      <section className="py-16 bg-white border-t border-[#cce7f0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-[#0c2340] text-center mb-3">
            Water Delivery Service Pages — All Metro Vancouver Cities
          </h2>
          <p className="text-[#4a7fa5] text-center text-sm mb-8">
            Click any city to see delivery schedules, pricing, neighbourhoods served, and frequently asked questions.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {HARDCODED_ZONES.map((zone) => (
              <Link
                key={zone.slug}
                href={`/areas/${zone.slug}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#cce7f0] bg-[#f0f9ff] hover:border-[#0097a7]/40 hover:bg-[#e0f7fa] transition-all text-sm font-medium text-[#0c2340] hover:text-[#0097a7]"
              >
                <MapPin className="w-3.5 h-3.5 text-[#0097a7] shrink-0" />
                {zone.name} Water Delivery
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Request new area */}
      <section className="py-20 bg-white">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0097a7] to-[#1565c0] mb-5">
              <Send className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#0c2340] mb-3">Request a New Area</h2>
            <p className="text-[#4a7fa5] mb-8">Not in our zone yet? Let us know and we&apos;ll prioritize your area for expansion.</p>
            {sent ? (
              <div className="p-6 rounded-2xl bg-[#e0f7fa] border border-[#0097a7]/30 text-[#006064]">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">Request received! We&apos;ll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true) }} className="space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#0c2340] mb-1 block">Name</label>
                    <Input placeholder="Your name" className="border-[#cce7f0]" required onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#0c2340] mb-1 block">Email</label>
                    <Input type="email" placeholder="your@email.com" className="border-[#cce7f0]" required onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#0c2340] mb-1 block">Your Area / City</label>
                  <Input placeholder="e.g. Maple Ridge, White Rock..." className="border-[#cce7f0]" required onChange={(e) => setRequestForm({ ...requestForm, area: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#0c2340] mb-1 block">Additional Notes</label>
                  <Textarea placeholder="Any additional information..." className="border-[#cce7f0]" rows={3} onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })} />
                </div>
                <Button type="submit" className="w-full h-11 rounded-xl bg-gradient-to-r from-[#0097a7] to-[#1565c0] text-white font-semibold">
                  Submit Request
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

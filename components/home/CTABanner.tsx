'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Phone, MessageCircle, ShoppingCart, ArrowRight, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const trustItems = [
  'No contracts or commitments',
  'Same-day delivery available',
  'BPA-free, NSF tested jugs',
  'Bottle swap included free',
]

export default function CTABanner() {
  const [phone, setPhone] = useState(process.env.NEXT_PUBLIC_COMPANY_PHONE || '')

  useEffect(() => {
    if (!supabase.from) return
    supabase
      .from('site_content')
      .select('key, value')
      .eq('key', 'settings_phone')
      .single()
      .then(({ data }) => { if (data?.value) setPhone(data.value) })
  }, [])

  const whatsapp = phone.replace(/\D/g, '')

  return (
    <section className="py-20 bg-[#f0f9ff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#006064] via-[#0097a7] to-[#1565c0] p-10 sm:p-14 lg:p-16"
        >
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-white/4 animate-float-bubble pointer-events-none" />

          {/* Shimmer overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <div className="absolute -inset-full animate-shimmer opacity-5" />
          </div>

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-10">

            {/* Left: copy */}
            <div className="text-center lg:text-left max-w-2xl">
              <p className="text-[#b3e5fc] text-xs font-bold uppercase tracking-widest mb-3">
                Ready to Get Started?
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
                Fresh Water Delivered
                <br className="hidden sm:block" />
                <span className="text-[#b3e5fc]"> to Your Door — Today</span>
              </h2>
              <p className="text-[#b3e5fc] text-lg mb-6">
                Order online in minutes. No contracts, no commitments. Just great water.
              </p>

              {/* Trust checkmarks */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {trustItems.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#00bcd4] shrink-0" />
                    <span className="text-sm text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: action buttons */}
            <div className="flex flex-col gap-3 shrink-0 w-full lg:w-auto min-w-[200px]">
              <Link href="/shop" className="block">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-[#0097a7] font-extrabold text-base shadow-xl shadow-black/20 hover:shadow-white/20 transition-all duration-300"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Order Now
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>

              {phone && (
                <a href={`tel:${phone}`} className="block">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/40 bg-white/10 backdrop-blur-sm text-white font-semibold text-base hover:bg-white/20 hover:border-white/60 transition-all duration-300"
                  >
                    <Phone className="w-5 h-5" />
                    {phone}
                  </motion.button>
                </a>
              )}

              {whatsapp && (
                <a href={`https://wa.me/${whatsapp}?text=Hi! I'd like to order water delivery.`} target="_blank" rel="noopener noreferrer" className="block">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-[#25d366]/50 bg-[#25d366]/15 text-white font-semibold text-base hover:bg-[#25d366]/30 transition-all duration-300"
                  >
                    <MessageCircle className="w-5 h-5 text-[#25d366]" />
                    WhatsApp Us
                  </motion.button>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

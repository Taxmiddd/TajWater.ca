'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Phone, MessageCircle, ShoppingCart, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

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
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#006064] via-[#0097a7] to-[#1565c0] p-10 sm:p-16"
        >
          {/* Decorative glows */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-white/5 animate-float-bubble pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">

            {/* Left: copy */}
            <div className="text-center lg:text-left max-w-xl">
              <p className="text-[#b3e5fc] text-sm font-semibold uppercase tracking-widest mb-3">Ready to Get Started?</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
                Fresh Water Delivered<br className="hidden sm:block" /> to Your Door — Today
              </h2>
              <p className="text-[#b3e5fc] text-lg">
                Order online in minutes. Free delivery on every order. No contracts, no commitments.
              </p>
            </div>

            {/* Right: action buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 shrink-0">
              <Link href="/shop">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-7 py-4 rounded-2xl bg-white text-[#0097a7] font-bold text-base shadow-xl shadow-black/20 hover:shadow-white/20 transition-all duration-300 whitespace-nowrap"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Order Now
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>

              {phone && (
                <a href={`tel:${phone}`}>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-7 py-4 rounded-2xl border-2 border-white/40 bg-white/10 backdrop-blur-sm text-white font-semibold text-base hover:bg-white/20 hover:border-white/60 transition-all duration-300 whitespace-nowrap"
                  >
                    <Phone className="w-5 h-5" />
                    {phone}
                  </motion.button>
                </a>
              )}

              {whatsapp && (
                <a href={`https://wa.me/${whatsapp}?text=Hi! I'd like to order water delivery.`} target="_blank" rel="noopener noreferrer">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-7 py-4 rounded-2xl border-2 border-[#25d366]/50 bg-[#25d366]/15 text-white font-semibold text-base hover:bg-[#25d366]/30 transition-all duration-300 whitespace-nowrap"
                  >
                    <MessageCircle className="w-5 h-5 text-[#25d366]" />
                    WhatsApp Us
                  </motion.button>
                </a>
              )}
            </div>
          </div>

          {/* Bottom trust strip */}
          <div className="relative mt-10 pt-6 border-t border-white/10 flex flex-wrap justify-center gap-x-8 gap-y-2">
            {[
              '✓  Free delivery on every order',
              '✓  No contracts or commitments',
              '✓  Same-day delivery available',
              '✓  BPA-free, NSF tested jugs',
            ].map((item) => (
              <span key={item} className="text-sm text-[#b3e5fc] font-medium">{item}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

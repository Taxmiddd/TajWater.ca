'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play, Droplets, ChevronDown } from 'lucide-react'
import WaterBackground from '@/components/shared/WaterBackground'
import { supabase } from '@/lib/supabase'

export default function Hero() {
  const { scrollY } = useScroll()
  const [services, setServices] = useState<string[]>([])

  // Very subtle — blobs drift 40px up over first 500px of scroll
  const blobY = useTransform(scrollY, [0, 500], [0, -40])

  useEffect(() => {
    supabase
      .from('services')
      .select('title')
      .eq('active', true)
      .order('sort_order')
      .limit(3)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setServices(data.map(s => s.title))
        }
      })
  }, [])

  const description = services.length > 0
    ? `${services.join(', ')} Across Metro Vancouver. Affordable and Competitive 5-Gallon Water Delivery — Fresh, Clean, and on Time.`
    : 'Affordable and Competitive 5-Gallon Water Delivery, Filter Installation, and Commercial Supply Across Metro Vancouver. Your #1 Drinking Water Supplier.'

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden hero-gradient">
      <WaterBackground />

      {/* Animated wave layers */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 160" className="w-full animate-wave-slow" preserveAspectRatio="none">
          <path d="M0,80 C180,140 360,20 540,80 C720,140 900,20 1080,80 C1260,140 1380,60 1440,80 L1440,160 L0,160 Z"
            fill="rgba(255,255,255,0.06)" />
        </svg>
        <svg viewBox="0 0 1440 120" className="w-full animate-wave-medium absolute bottom-0" preserveAspectRatio="none">
          <path d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 C1300,100 1380,40 1440,60 L1440,120 L0,120 Z"
            fill="rgba(255,255,255,0.08)" />
        </svg>
        <svg viewBox="0 0 1440 80" className="w-full animate-wave-fast absolute bottom-0" preserveAspectRatio="none">
          <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
            fill="#f0f9ff" />
        </svg>
      </div>

      {/* Floating drop decorations — subtle parallax on scroll */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: blobY }}>
        {[
          { size: 'w-20 h-20', pos: 'top-1/4 right-[10%]', delay: '0s', dur: '6s' },
          { size: 'w-12 h-12', pos: 'top-1/3 right-[25%]', delay: '1.5s', dur: '5s' },
          { size: 'w-8 h-8', pos: 'top-2/3 left-[8%]', delay: '0.8s', dur: '7s' },
          { size: 'w-16 h-16', pos: 'top-1/2 left-[18%]', delay: '2s', dur: '5.5s' },
        ].map((drop, i) => (
          <div
            key={i}
            className={`absolute ${ drop.pos } ${ drop.size } rounded-full border border-white/20 animate-float-bubble`}
            style={{ animationDelay: drop.delay, animationDuration: drop.dur, background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15), transparent)' }}
          />
        ))}
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/25 text-white text-sm mb-6 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#00bcd4] animate-pulse" />
            Trusted by 5,000+ Metro Vancouver Families
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] mb-6"
          >
            Vancouver&apos;s Best
            <br />
            <span className="gradient-text-light">Drinking Water Supplier</span>
            <br />
            Delivered to Your Door
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-lg sm:text-xl text-[#b3e5fc] mb-10 max-w-xl leading-relaxed min-h-[3.5rem]"
          >
            {description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-[#0097a7] font-bold text-base shadow-2xl shadow-black/20 hover:shadow-white/20 transition-all duration-300"
              >
                <Droplets className="w-5 h-5" />
                Order Now
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link href="/services">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/40 bg-white/10 backdrop-blur-sm text-white font-semibold text-base hover:bg-white/20 hover:border-white/60 transition-all duration-300"
              >
                <Play className="w-4 h-4" />
                Learn More
              </motion.button>
            </Link>
          </motion.div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-6 mt-12">
            {[
              { value: '2,000+', label: 'Happy Customers' },
              { value: '21', label: 'Delivery Zones' },
              { value: '5+', label: 'Years Serving BC' },
              { value: '24h', label: 'Delivery Window' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-0 sm:bg-transparent sm:backdrop-blur-none sm:text-center">
                <p className="text-xl sm:text-2xl font-extrabold text-white">{stat.value}</p>
                <p className="text-[10px] sm:text-xs text-[#b3e5fc] uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/60"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  )
}

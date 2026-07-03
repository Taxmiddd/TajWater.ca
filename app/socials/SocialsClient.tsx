'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z" />
    </svg>
  )
}

const PLATFORMS = [
  {
    key: 'facebook' as const,
    label: 'Facebook',
    desc: 'Like our page for the latest updates, exclusive promotions, and community news.',
    cta: 'Follow on Facebook',
    gradient: 'from-[#1877f2] to-[#0d5dbf]',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-200',
    ctaRing: 'ring-blue-400',
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    key: 'instagram' as const,
    label: 'Instagram',
    desc: 'See behind-the-scenes content, delivery highlights, and water quality tips.',
    cta: 'Follow on Instagram',
    gradient: 'from-[#f58529] via-[#dd2a7b] to-[#8134af]',
    bgLight: 'bg-pink-50',
    borderColor: 'border-pink-200',
    ctaRing: 'ring-pink-400',
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    key: 'twitter' as const,
    label: 'X (Twitter)',
    desc: 'Follow for quick hydration tips, service announcements, and real-time updates.',
    cta: 'Follow on X',
    gradient: 'from-[#111111] to-[#333333]',
    bgLight: 'bg-gray-50',
    borderColor: 'border-gray-200',
    ctaRing: 'ring-gray-400',
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.26 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    key: 'tiktok' as const,
    label: 'TikTok',
    desc: 'Watch our water delivery in action — fun, short-form videos about pure water life.',
    cta: 'Follow on TikTok',
    gradient: 'from-[#010101] to-[#69c9d0]',
    bgLight: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    ctaRing: 'ring-cyan-400',
    icon: <TikTokIcon className="w-12 h-12" />,
  },
]

export default function SocialsClient() {
  const [socials, setSocials] = useState<Record<string, string>>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    supabase
      .from('site_content')
      .select('key, value')
      .in('key', ['social_facebook', 'social_instagram', 'social_twitter', 'social_tiktok'])
      .then(({ data }) => {
        const map: Record<string, string> = {}
        if (data) {
          for (const row of data) {
            const platform = row.key.replace('social_', '')
            if (row.value) map[platform] = row.value
          }
        }
        setSocials(map)
        setLoaded(true)
      })
  }, [])

  const activePlatforms = PLATFORMS.filter(p => socials[p.key])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-28 hero-gradient overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
            <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="#f0f9ff" />
          </svg>
        </div>
        {/* Decorative blobs */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#00bcd4]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex justify-center mb-6">
              <Image src="/logo/tajwhite.svg" alt="TajWater" width={160} height={50} className="h-12 w-auto" />
            </div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold mb-4">
              Stay Connected
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-5 leading-tight">
              Follow <span className="gradient-text-light">TajWater</span><br />
              on Social Media
            </h1>
            <p className="text-[#b3e5fc] text-xl max-w-2xl mx-auto">
              Get water delivery updates, hydration tips, behind-the-scenes content, and exclusive promos — all in one place.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Social Cards */}
      <section className="py-20 bg-[#f0f9ff]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {!loaded ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 bg-white rounded-3xl border border-[#cce7f0] animate-pulse" />
              ))}
            </div>
          ) : activePlatforms.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#4a7fa5] text-lg">Social links coming soon — check back shortly!</p>
              <Link href="/" className="mt-6 inline-block text-[#0097a7] hover:underline font-semibold">← Back to Home</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {activePlatforms.map((platform, i) => (
                <motion.a
                  key={platform.key}
                  href={socials[platform.key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className={`group relative bg-white rounded-3xl border ${platform.borderColor} shadow-sm hover:shadow-2xl transition-all duration-300 p-8 flex flex-col gap-5 overflow-hidden`}
                >
                  {/* Background glow on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${platform.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-3xl`} />

                  {/* Platform icon */}
                  <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {platform.icon}
                  </div>

                  {/* Content */}
                  <div className="relative flex-1">
                    <h2 className="text-2xl font-extrabold text-[#0c2340] mb-2">{platform.label}</h2>
                    <p className="text-[#4a7fa5] text-sm leading-relaxed">{platform.desc}</p>
                  </div>

                  {/* CTA */}
                  <div className={`relative inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r ${platform.gradient} text-white self-start shadow-md group-hover:shadow-lg transition-shadow duration-200`}>
                    {platform.cta}
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-gradient-to-br from-[#006064] to-[#1565c0] text-center">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">Ready to order pure water?</h2>
            <p className="text-[#b3e5fc] mb-8">Follow us, then place your first delivery order — Metro Vancouver&apos;s freshest water, delivered.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="px-8 py-3 rounded-2xl bg-white text-[#006064] font-bold hover:bg-[#e0f7fa] transition-colors shadow-lg"
              >
                Shop Now
              </Link>
              <Link
                href="/about"
                className="px-8 py-3 rounded-2xl border border-white/30 text-white font-bold hover:bg-white/10 transition-colors"
              >
                Learn About Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, MessageCircle, Clock, Droplets } from 'lucide-react'

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z" />
    </svg>
  )
}
import { supabase } from '@/lib/supabase'

export default function Footer() {
  const pathname = usePathname()
  const [phone, setPhone] = useState(process.env.NEXT_PUBLIC_COMPANY_PHONE || '')
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_COMPANY_EMAIL || '')
  const [address, setAddress] = useState('Vancouver, BC, Canada')
  const [hours, setHours] = useState('Mon – Sat: 7am – 7pm\nSunday: 9am – 5pm')
  const [zones, setZones] = useState<string[]>([])
  const [socials, setSocials] = useState({ facebook: '', instagram: '', twitter: '', tiktok: '' })

  useEffect(() => {
    if (!supabase.from) return
    supabase
      .from('site_content')
      .select('key, value')
      .in('key', ['settings_phone', 'settings_email', 'settings_address', 'settings_hours', 'social_facebook', 'social_instagram', 'social_twitter', 'social_tiktok'])
      .then(({ data }) => {
        if (!data) return
        const fb: typeof socials = { facebook: '', instagram: '', twitter: '', tiktok: '' }
        for (const row of data) {
          if (row.key === 'settings_phone') setPhone(row.value)
          if (row.key === 'settings_email') setEmail(row.value)
          if (row.key === 'settings_address') setAddress(row.value)
          if (row.key === 'settings_hours') setHours(row.value)
          if (row.key === 'social_facebook') fb.facebook = row.value
          if (row.key === 'social_instagram') fb.instagram = row.value
          if (row.key === 'social_twitter') fb.twitter = row.value
          if (row.key === 'social_tiktok') fb.tiktok = row.value
        }
        setSocials(fb)
      })
    if (!supabase.from) return
    supabase
      .from('zones')
      .select('name')
      .eq('active', true)
      .order('name')
      .then(({ data }) => {
        if (data) setZones(data.map((z: { name: string }) => z.name))
      })
  }, [])

  if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) return null

  const whatsapp = phone.replace(/\D/g, '')

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Our Services', href: '/services' },
    { label: 'Delivery Areas', href: '/areas' },
    { label: 'Shop', href: '/shop' },
    { label: 'Blog', href: '/blog' },
    { label: 'FAQ', href: '/faq' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  const waterTypes = [
    { label: 'Spring Water Delivery', href: '/spring-water-delivery-vancouver' },
    { label: 'Alkaline Water Delivery', href: '/alkaline-water-delivery-vancouver' },
    { label: 'Distilled Water Delivery', href: '/distilled-water-delivery-vancouver' },
    { label: 'Follow Us', href: '/socials' },
  ]

  return (
    <footer className="relative overflow-hidden bg-[#011f22]">
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00bcd4]/60 to-transparent" />

      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#006064]/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative pt-16 pb-0 px-4 max-w-7xl mx-auto">

        {/* ── Top row: Brand + columns ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12">

          {/* Brand column */}
          <div className="md:col-span-4 lg:col-span-4">
            <div className="mb-5">
              <Image src="/logo/tajwhite.svg" alt="TajWater" width={140} height={44} className="h-10 w-auto" />
            </div>
            <p className="text-[#7ecfdc] text-sm leading-relaxed mb-6 max-w-xs">
              Metro Vancouver&apos;s trusted source for pure, fresh water delivery. Independently tested spring, alkaline, and distilled water — right to your door.
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5 flex-wrap">
              {[
                { icon: Facebook, href: socials.facebook || null, label: 'Facebook', hover: 'hover:bg-[#1877f2] hover:border-[#1877f2]' },
                { icon: Instagram, href: socials.instagram || null, label: 'Instagram', hover: 'hover:bg-[#e1306c] hover:border-[#e1306c]' },
                { icon: Twitter, href: socials.twitter || null, label: 'X / Twitter', hover: 'hover:bg-white/10 hover:border-white/30' },
                { icon: TikTokIcon, href: socials.tiktok || null, label: 'TikTok', hover: 'hover:bg-white/10 hover:border-white/30' },
              ].filter(s => s.href).map(({ icon: Icon, href, label, hover }, i) => (
                <a
                  key={i}
                  href={href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-9 h-9 rounded-xl border border-white/10 bg-white/5 ${hover} flex items-center justify-center text-[#7ecfdc] hover:text-white transition-all duration-200 hover:scale-110`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  aria-label="WhatsApp"
                  className="w-9 h-9 rounded-xl border border-[#25d366]/30 bg-[#25d366]/10 hover:bg-[#25d366] hover:border-[#25d366] flex items-center justify-center text-[#25d366] hover:text-white transition-all duration-200 hover:scale-110"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 lg:col-span-2">
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Pages</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[#7ecfdc] hover:text-white text-sm transition-colors duration-150"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Water Types */}
          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Products</h4>
            <ul className="space-y-2.5">
              {waterTypes.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[#7ecfdc] hover:text-white text-sm transition-colors duration-150"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="md:col-span-3 lg:col-span-4">
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Contact</h4>
            <ul className="space-y-3">
              {phone && (
                <li>
                  <a href={`tel:${phone}`} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 group-hover:bg-[#00bcd4]/20 group-hover:border-[#00bcd4]/40 flex items-center justify-center shrink-0 transition-all">
                      <Phone className="w-3.5 h-3.5 text-[#00bcd4]" />
                    </div>
                    <span className="text-sm text-[#7ecfdc] group-hover:text-white transition-colors">{phone}</span>
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 group-hover:bg-[#00bcd4]/20 group-hover:border-[#00bcd4]/40 flex items-center justify-center shrink-0 transition-all">
                      <Mail className="w-3.5 h-3.5 text-[#00bcd4]" />
                    </div>
                    <span className="text-sm text-[#7ecfdc] group-hover:text-white transition-colors">{email}</span>
                  </a>
                </li>
              )}
              <li>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#00bcd4]" />
                  </div>
                  <span className="text-sm text-[#7ecfdc] whitespace-pre-line">{address}</span>
                </div>
              </li>

              {/* Hours card */}
              <li className="mt-1">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/8">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-[#00bcd4]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Business Hours</p>
                    {hours.split('\n').map((line, i) => (
                      <p key={i} className={`text-sm ${i === 0 ? 'text-white font-medium' : 'text-[#7ecfdc]'}`}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Delivery zones strip ── */}
        {zones.length > 0 && (
          <div className="border-t border-white/5 py-6">
            <div className="flex items-start gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 shrink-0">
                <Droplets className="w-3.5 h-3.5 text-[#00bcd4]" />
                <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Delivery Zones</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {zones.map((zone) => (
                  <Link
                    key={zone}
                    href="/areas"
                    className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-[#7ecfdc] hover:bg-[#00bcd4]/20 hover:border-[#00bcd4]/40 hover:text-white transition-all duration-150"
                  >
                    {zone}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/5 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/25 text-xs">© {new Date().getFullYear()} TajWater LTD. All rights reserved.</p>
          <div className="flex gap-5 items-center">
            <Link href="/legal/privacy" className="text-white/30 hover:text-[#7ecfdc] text-xs transition-colors">Privacy Policy</Link>
            <Link href="/legal/terms" className="text-white/30 hover:text-[#7ecfdc] text-xs transition-colors">Terms of Service</Link>
            <span className="text-white/10">·</span>
            <a
              href="https://noeticstudio.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/25 hover:text-white text-xs transition-colors"
            >
              Built by <span className="font-semibold text-white/60 hover:text-white">NOÉTIC Studio</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}

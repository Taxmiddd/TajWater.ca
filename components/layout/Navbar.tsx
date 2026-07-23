'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, ShoppingCart, User, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useCart } from '@/store/cartStore'

const navLinks = [
  { label: 'Services', href: '/services' },
  { label: 'Delivery Areas', href: '/areas' },
  { label: 'Shop', href: '/shop' },
  { label: 'Wallet', href: '/wallet' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
]

type Announcement = { text: string, href: string }

import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()
  const count = useCart((s) => s.count())
  const cartHydrated = useCart((s) => s._hasHydrated)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!supabase.auth) return
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const [annIdx, setAnnIdx] = useState(0)
  const [annDismissed, setAnnDismissed] = useState(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])

  useEffect(() => {
    supabase
      .from('site_content')
      .select('key, value')
      .in('key', [
        'announcement_1_text', 'announcement_1_href',
        'announcement_2_text', 'announcement_2_href',
        'announcement_3_text', 'announcement_3_href'
      ])
      .then(({ data }) => {
        if (data && data.length > 0) {
          const map: Record<string, string> = {}
          data.forEach(r => { map[r.key] = r.value })
          
          const loadedAnn: Announcement[] = []
          if (map['announcement_1_text']) loadedAnn.push({ text: map['announcement_1_text'], href: map['announcement_1_href'] || '#' })
          if (map['announcement_2_text']) loadedAnn.push({ text: map['announcement_2_text'], href: map['announcement_2_href'] || '#' })
          if (map['announcement_3_text']) loadedAnn.push({ text: map['announcement_3_text'], href: map['announcement_3_href'] || '#' })
          
          setAnnouncements(loadedAnn)
        }
      })
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Cycle announcement bar
  useEffect(() => {
    if (announcements.length <= 1) return
    const t = setInterval(() => setAnnIdx(i => (i + 1) % announcements.length), 4000)
    return () => clearInterval(t)
  }, [announcements.length])

  const isHome = pathname === '/'
  const transparent = isHome && !scrolled
  const showAnnouncement = announcements.length > 0 && !annDismissed

  if (pathname.startsWith('/admin') || pathname.startsWith('/auth') || pathname.startsWith('/dashboard')) return null

  return (
    <>
      {/* ── Announcement bar ── */}
      <AnimatePresence>
        {showAnnouncement && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-[#006064] via-[#0097a7] to-[#1565c0] overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9">
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={annIdx}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <Link
                      href={announcements[annIdx].href}
                      className="flex items-center justify-center gap-2 text-white text-xs sm:text-sm font-medium hover:underline w-full"
                    >
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{announcements[annIdx].text}</span>
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>
              <button
                onClick={() => setAnnDismissed(true)}
                className="ml-3 text-white/60 hover:text-white transition-colors p-1"
                aria-label="Dismiss announcement"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${showAnnouncement ? 'top-9' : 'top-0'} ${
          transparent
            ? 'bg-transparent'
            : 'glass shadow-lg shadow-aqua/10 border-b border-white/30'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src={transparent ? '/logo/tajwhite.svg' : '/logo/tajcyan.svg'}
                alt="TajWater"
                width={140}
                height={44}
                priority
                className="h-8 sm:h-10 w-auto transition-all duration-300"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${active
                      ? 'text-[#0097a7] bg-[#e0f7fa]'
                      : transparent
                        ? 'text-white/90 hover:text-white hover:bg-white/15'
                        : 'text-[#0c2340] hover:text-[#0097a7] hover:bg-[#e0f7fa]'
                      }`}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#0097a7]" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href={cartHydrated && count > 0 ? '/checkout' : '/shop'}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`relative ${transparent ? 'text-white hover:bg-white/15' : 'text-[#0c2340] hover:bg-[#e0f7fa]'}`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartHydrated && count > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold bg-[#0097a7] text-white rounded-full flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </Button>
              </Link>
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 ${transparent ? 'text-white hover:bg-white/15' : 'text-[#0c2340] hover:bg-[#e0f7fa]'}`}
                  >
                    <User className="w-4 h-4" />
                    My Account
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`gap-2 ${transparent ? 'text-white hover:bg-white/15' : 'text-[#0c2340] hover:bg-[#e0f7fa]'}`}
                    >
                      <User className="w-4 h-4" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`font-semibold ${transparent ? 'border-white/40 text-white bg-transparent hover:bg-white/15' : 'border-[#0097a7]/30 text-[#0097a7] bg-transparent hover:bg-[#e0f7fa]'}`}
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
              <Link href="/shop">
                <Button size="sm" className="bg-gradient-to-r from-[#0097a7] to-[#1565c0] hover:from-[#006064] hover:to-[#0d47a1] text-white shadow-lg shadow-aqua/30 transition-all duration-300 hover:scale-105">
                  Order Now
                </Button>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${transparent ? 'text-white hover:bg-white/15' : 'text-[#0c2340] hover:bg-[#e0f7fa]'}`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-[#f0f9ff] shadow-2xl lg:hidden flex flex-col h-full border-l border-white overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-[#cce7f0]">
                <span className="font-extrabold text-[#0c2340] text-lg">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg text-[#0c2340] hover:bg-[#e0f7fa] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 px-5 py-6 flex flex-col gap-2">
                <p className="px-3 text-[10px] font-bold text-[#0097a7] uppercase tracking-widest mb-2">Navigation</p>
                {navLinks.map((link) => {
                  const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`px-4 py-3.5 rounded-2xl text-base font-semibold transition-all flex items-center justify-between group ${active
                        ? 'bg-[#0097a7] text-white shadow-lg shadow-[#0097a7]/20'
                        : 'text-[#0c2340] hover:bg-[#e0f7fa] hover:text-[#0097a7]'
                        }`}
                    >
                      {link.label}
                      {!active && <div className="w-1.5 h-1.5 rounded-full bg-[#0097a7] opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </Link>
                  )
                })}
                
                <div className="mt-auto pt-8 flex flex-col gap-3">
                  <div className="flex gap-3">
                    <Link href={cartHydrated && count > 0 ? '/checkout' : '/shop'} className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full h-12 rounded-2xl border-[#cce7f0] text-[#0c2340] gap-2 font-semibold">
                        <ShoppingCart className="w-4 h-4 text-[#0097a7]" />
                        Cart {count > 0 && `(${count})`}
                      </Button>
                    </Link>
                    {isLoggedIn ? (
                      <Link href="/dashboard" className="flex-1" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full h-12 rounded-2xl border-[#cce7f0] text-[#0c2340] gap-2 font-semibold">
                          <User className="w-4 h-4 text-[#0097a7]" />
                          Account
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/auth/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full h-12 rounded-2xl border-[#cce7f0] text-[#0c2340] gap-2 font-semibold">
                          <User className="w-4 h-4 text-[#0097a7]" />
                          Login
                        </Button>
                      </Link>
                    )}
                  </div>
                  {!isLoggedIn && (
                    <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full h-12 rounded-2xl border-[#0097a7]/30 text-[#0097a7] bg-[#0097a7]/5 font-semibold hover:bg-[#0097a7]/10">
                        Sign Up
                      </Button>
                    </Link>
                  )}
                  <Link href="/shop" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#0097a7] to-[#1565c0] text-white font-bold text-lg shadow-xl shadow-[#0097a7]/20 active:scale-[0.98] transition-transform">
                      Order Now
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}


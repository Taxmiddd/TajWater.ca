'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, ShoppingCart, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useCart } from '@/store/cartStore'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Delivery Areas', href: '/areas' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

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

  // Close mobile menu on route change
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMobileOpen(false) }, [pathname])

  if (pathname.startsWith('/admin') || pathname.startsWith('/auth') || pathname.startsWith('/dashboard')) return null

  const isHome = pathname === '/'
  const transparent = isHome && !scrolled

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${transparent
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-0 top-16 z-40 glass border-b border-white/30 shadow-2xl lg:hidden"
          >
            <div className="px-5 py-8 flex flex-col gap-3">
              <p className="px-4 text-[10px] font-bold text-[#0097a7] uppercase tracking-widest mb-1">Navigation</p>
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
              <div className="mt-6 pt-6 border-t border-[#cce7f0] flex flex-col gap-3">
                <div className="flex gap-3">
                  <Link href={cartHydrated && count > 0 ? '/checkout' : '/shop'} className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full h-12 rounded-2xl border-[#cce7f0] text-[#0c2340] gap-2 font-semibold">
                      <ShoppingCart className="w-4 h-4 text-[#0097a7]" />
                      Cart {count > 0 && `(${count})`}
                    </Button>
                  </Link>
                  <Link href={isLoggedIn ? '/dashboard' : '/auth/login'} className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full h-12 rounded-2xl border-[#cce7f0] text-[#0c2340] gap-2 font-semibold">
                      <User className="w-4 h-4 text-[#0097a7]" />
                      {isLoggedIn ? 'Account' : 'Login'}
                    </Button>
                  </Link>
                </div>
                <Link href="/shop" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#0097a7] to-[#1565c0] text-white font-bold text-lg shadow-xl shadow-[#0097a7]/20 active:scale-[0.98] transition-transform">
                    Order Now
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

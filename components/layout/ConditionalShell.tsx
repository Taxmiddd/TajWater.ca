'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingOrderButton from '@/components/shared/FloatingOrderButton'

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // To prevent hydration mismatches, the server and the first client render must perfectly match.
  // The server might evaluate pathname differently. By defaulting to the public shell layout 
  // during SSR and hydration (mounted = false), React correctly hydrates without crashing.
  // Once mounted, it correctly evaluates the path and hides the shell if needed.
  const isExcluded = pathname?.startsWith('/admin') || pathname?.startsWith('/auth') || pathname?.startsWith('/dashboard')
  const hideShell = mounted ? isExcluded : false

  return (
    <>
      {!hideShell && <Navbar />}
      <main>{children}</main>
      {!hideShell && <Footer />}
      {!hideShell && <FloatingOrderButton />}
    </>
  )
}


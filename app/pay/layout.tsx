import Image from 'next/image'
import Link from 'next/link'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'TajWater Secure Payments',
  description: 'Pay your TajWater invoice securely online.',
}

export default function PayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f0f9ff]">
      {/* Compact pay-portal navbar: logo + Home only */}
      <header className="bg-white border-b border-[#cce7f0] shadow-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="https://tajwater.ca" aria-label="TajWater Home">
            <Image
              src="/logo/tajcyan.svg"
              alt="TajWater"
              width={120}
              height={36}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <Link
            href="https://tajwater.ca"
            className="flex items-center gap-1.5 text-sm font-medium text-[#0097a7] hover:text-[#006064] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  )
}

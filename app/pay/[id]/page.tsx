import { createServerClient } from '@/lib/supabase'
import PaymentClient from './PaymentClient'
import type { PaymentLink } from '@/types'
import { CheckCircle2, AlertTriangle, Droplets } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// ── Static state screens ───────────────────────────────────────────────────────
function PaidScreen({ link }: { link: PaymentLink }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#0c2340] mb-2">Invoice Already Paid</h1>
        <p className="text-[#4a7fa5] mb-6">
          Payment <span className="font-mono font-bold text-[#0097a7]">{link.id}</span> has been successfully processed.
        </p>
        <div className="bg-white rounded-2xl border border-[#cce7f0] p-5 text-left mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#4a7fa5]">Description</span>
            <span className="font-medium text-[#0c2340] text-right max-w-[60%]">{link.description}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#4a7fa5]">Amount Paid</span>
            <span className="font-bold text-green-600">${link.amount.toFixed(2)} {link.currency}</span>
          </div>
          {link.paid_at && (
            <div className="flex justify-between text-sm">
              <span className="text-[#4a7fa5]">Paid On</span>
              <span className="text-[#0c2340]">{new Date(link.paid_at).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          )}
        </div>
        <Link href="https://tajwater.ca" className="inline-flex items-center gap-2 text-sm font-medium text-[#0097a7] hover:underline">
          ← Return to TajWater
        </Link>
      </div>
    </div>
  )
}

function NotFoundScreen({ id }: { id: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 mb-6">
          <AlertTriangle className="w-10 h-10 text-amber-500" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#0c2340] mb-2">Payment Not Found</h1>
        <p className="text-[#4a7fa5] mb-4">
          We couldn&apos;t find a payment request for{' '}
          <span className="font-mono font-bold text-[#0097a7]">{id}</span>.
        </p>
        <p className="text-sm text-[#4a7fa5] mb-8">
          Please double-check the ID from your invoice or email. Contact{' '}
          <a href="mailto:support@tajwater.ca" className="text-[#0097a7] hover:underline">support@tajwater.ca</a>{' '}
          if you need assistance.
        </p>
        <Link
          href="/pay"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0097a7] text-white text-sm font-semibold hover:bg-[#006064] transition-colors"
        >
          Try Another ID
        </Link>
      </div>
    </div>
  )
}

// ── Main server page ───────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return {
    title: `Payment ${id.toUpperCase()} | TajWater`,
    description: 'Complete your TajWater payment securely.',
  }
}

export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const upperId = id.toUpperCase()

  const db = createServerClient()
  const { data: link, error } = await db
    .from('payment_links')
    .select('id, description, amount, currency, customer_name, customer_phone, customer_email, status, created_at, paid_at, square_payment_id')
    .eq('id', upperId)
    .single()

  if (error || !link) {
    return <NotFoundScreen id={upperId} />
  }

  if (link.status === 'paid') {
    return <PaidScreen link={link as PaymentLink} />
  }

  // Pending — show payment form
  return <PaymentClient link={link as PaymentLink} paymentId={upperId} />
}

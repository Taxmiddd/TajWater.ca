'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { generateInvoicePDF, type InvoiceOrderData, type CompanyInfo } from '@/lib/generateInvoice'
import { Button } from '@/components/ui/button'
import {
  Download,
  RefreshCw,
  CreditCard,
  Coins,
  Wallet,
  Eye
} from 'lucide-react'

import { PDFViewer } from '@react-pdf/renderer'

// Mock Data
const MOCK_COMPANY: CompanyInfo = {
  name: 'Taj Water LTD.',
  address: '1770 McLean Ave, Port Coquitlam, BC V3C 4K8, Canada',
  phone: '604-555-0199',
  email: 'billing@tajwater.ca',
  website: 'tajwater.ca'
}

const MOCK_ORDER: InvoiceOrderData = {
  id: 'order_1234567890abcdef',
  total: 42.56,
  payment_status: 'paid',
  payment_method: 'square_online',
  delivery_address: '789 Rainfall Ave, Burnaby, BC V5H 3Z8',
  customer_name: 'Alex Thompson',
  customer_phone: '+1 (778) 123-4567',
  created_at: new Date().toISOString(),
  zones: { name: 'Burnaby Central' },
  order_items: [
    { id: 'item_1', quantity: 2, price: 15.00, products: { name: '18.9L Premium Spring Water' } },
    { id: 'item_2', quantity: 1, price: 8.00, products: { name: 'Manual Water Pump' } }
  ],
  profiles: { name: 'Alex Thompson', email: 'alex.t@example.com' },
  tax_amount: 4.56, // (30.00 + 8.00) * 0.12 = 38 * 0.12 = 4.56
  discount_amount: 0,
  notes: 'Gate code 1234. Leave at the front door.'
}

export default function InvoicePreviewPage() {
  const [mounted, setMounted] = useState(false)
  const [method, setMethod] = useState<'square_online' | 'cash_on_delivery' | 'card_on_delivery'>(MOCK_ORDER.payment_method as any)
  const [status, setStatus] = useState<'paid' | 'pending'>(MOCK_ORDER.payment_status as any)
  const [InvoiceComponent, setInvoiceComponent] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    // Dynamic import the component from the lib
    import('@/lib/generateInvoice').then(mod => {
      // @ts-ignore - access internal component if exported
      if (mod.InvoicePDF) {
        setInvoiceComponent(() => mod.InvoicePDF)
      }
    })
  }, [])

  if (!mounted) return null

  const order = { ...MOCK_ORDER, payment_method: method, payment_status: status }

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500 p-2 rounded-lg">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Invoice Visual Preview</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Real-time customization for TajWater invoices</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {[
              { id: 'square_online', icon: CreditCard, label: 'Online' },
              { id: 'cash_on_delivery', icon: Coins, label: 'Cash' },
              { id: 'card_on_delivery', icon: Wallet, label: 'Card' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => {
                  setMethod(m.id as any)
                  setStatus(m.id === 'square_online' ? 'paid' : 'pending')
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  method === m.id 
                    ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <m.icon className="w-3.5 h-3.5" />
                {m.label}
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm" className="gap-2 border-slate-200 dark:border-slate-700 dark:text-white" onClick={() => window.location.reload()}>
            <RefreshCw className="w-3.5 h-3.5" />
            Reload Lib
          </Button>

          <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2">
            <Download className="w-3.5 h-3.5" />
            Download Sample
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden p-6 lg:p-10 flex justify-center">
        <div className="w-full max-w-5xl h-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {InvoiceComponent ? (
            <PDFViewer className="w-full h-full border-none">
              <InvoiceComponent order={order} companyInfo={MOCK_COMPANY} />
            </PDFViewer>
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center text-slate-500 gap-4">
              <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="font-medium">Initializing PDF Renderer...</p>
              <p className="text-xs text-slate-400">Make sure to export InvoicePDF in lib/generateInvoice.ts</p>
            </div>
          )}
        </div>
      </main>

      {/* Sidebar for quick settings if needed */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-8 py-3 text-[10px] text-slate-400 flex justify-between">
        <p>© 2026 TajWater Admin • Invoice Engine v2.0</p>
        <p>Using Helvetica System Fonts for maximum PDF compatibility</p>
      </footer>
    </div>
  )
}

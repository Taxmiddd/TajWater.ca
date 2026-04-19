import { createServerClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Package, Truck, CheckCircle2, Clock, MapPin, Phone, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface TrackPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ token?: string }>
}

export default async function TrackOrderPage({ params, searchParams }: TrackPageProps) {
  const { id } = await params
  const { token } = await searchParams

  if (!token) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-[#e2e8f0] p-8 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#0c2340] mb-3">Secure Track Link Required</h1>
          <p className="text-[#4a7fa5] mb-8">For your privacy, order tracking is only available via the secure link sent to your confirmation email.</p>
          <Button asChild className="w-full bg-[#0c2340] hover:bg-[#071930] rounded-xl h-12">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  const supabase = createServerClient()
  
  // Fetch order and verify token
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        quantity,
        price,
        products (name, image_url)
      )
    `)
    .eq('id', id)
    .eq('tracking_token', token)
    .single()

  if (error || !order) {
    console.error('Track order fetch error:', error)
    return notFound()
  }

  const orderDate = new Date(order.created_at).toLocaleDateString('en-CA', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  // Status mapping
  const statuses = [
    { key: 'pending', label: 'Order Received', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { key: 'processing', label: 'Processing', icon: Package, color: 'text-amber-500', bg: 'bg-amber-50' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' }
  ]

  const currentIndex = statuses.findIndex(s => s.key === order.status)
  const displayIndex = currentIndex === -1 ? 0 : currentIndex

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <Link href="/" className="text-sm font-bold text-[#0097a7] hover:underline mb-2 inline-block">
              &larr; Back to TajWater
            </Link>
            <h1 className="text-3xl font-extrabold text-[#0c2340] tracking-tight">Order #{order.id.slice(-8).toUpperCase()}</h1>
            <p className="text-[#4a7fa5]">Placed on {orderDate}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 capitalize py-1.5 px-3 rounded-lg">
              {order.payment_status}
            </Badge>
            <Badge className="bg-[#0c2340] text-white py-1.5 px-3 rounded-lg">
              Tracking Active
            </Badge>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm p-8 mb-8 overflow-hidden relative">
          <div className="relative flex justify-between">
            {statuses.map((step, idx) => {
              const Icon = step.icon
              const isActive = idx <= displayIndex
              const isCurrent = idx === displayIndex

              return (
                <div key={step.key} className="flex flex-col items-center relative z-10 w-1/4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-500 ${
                    isCurrent ? `${step.bg} ${step.color} ring-4 ring-white shadow-md scale-110` : 
                    isActive ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] md:text-sm font-bold text-center px-1 transition-colors ${
                    isActive ? 'text-[#0c2340]' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                  
                  {/* Progress Line */}
                  {idx < statuses.length - 1 && (
                    <div className="absolute top-6 left-[60%] w-[80%] h-0.5 bg-gray-100 -z-10">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-1000 ease-out" 
                        style={{ width: idx < displayIndex ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items Card */}
            <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm p-6">
              <h3 className="font-bold text-[#0c2340] mb-4 text-lg">Order Items</h3>
              <div className="space-y-4">
                {(order.order_items || []).map((item: { quantity: number; price: number; products: { name: string; image_url: string | null } | null }, i: number) => (
                  <div key={i} className="flex items-center gap-4 py-3 border-b border-[#f1f5f9] last:border-0">
                    <div className="w-16 h-16 bg-[#f8fafc] rounded-xl flex-shrink-0 overflow-hidden border border-[#e2e8f0]">
                      {item.products?.image_url && (
                        <img 
                          src={item.products.image_url} 
                          alt={item.products.name} 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#0c2340] text-sm">{item.products?.name}</h4>
                      <p className="text-xs text-[#4a7fa5]">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#0c2340] text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm p-6">
              <h3 className="font-bold text-[#0c2340] mb-4 text-lg">Delivery Information</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-[#0097a7] mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-[#4a7fa5] uppercase tracking-wider">Address</p>
                    <p className="text-[#0c2340] font-medium">{order.delivery_address}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-[#0097a7] mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-[#4a7fa5] uppercase tracking-wider">Customer</p>
                    <p className="text-[#0c2340] font-medium">{order.customer_name} • {order.customer_phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="space-y-6">
            <div className="bg-[#0c2340] rounded-3xl p-6 text-white shadow-lg">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> Summary
              </h3>
              <div className="space-y-3 text-sm border-b border-white/10 pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="opacity-70">Payment</span>
                  <span className="capitalize">{order.payment_method?.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Tax</span>
                  <span>${order.tax_amount?.toFixed(2) || '0.00'}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Discount</span>
                    <span>-${order.discount_amount.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-end">
                <span className="font-bold text-lg">Total Paid</span>
                <span className="text-3xl font-black">${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm p-6 text-center">
              <p className="text-sm text-[#4a7fa5] mb-4">Need help with your delivery?</p>
              <Button asChild variant="outline" className="w-full rounded-xl border-[#cce7f0] text-[#0097a7] hover:bg-[#f0f9ff]">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

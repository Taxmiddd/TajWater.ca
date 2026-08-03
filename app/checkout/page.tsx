'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, 
  MapPin, 
  CreditCard as CreditCardIcon, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  Truck as TruckIcon, 
  AlertCircle, 
  Wallet,
  Info,
  Package,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/store/cartStore'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  PaymentForm, 
  CreditCard as SquareCreditCard, 
  ApplePay, 
  GooglePay,
} from 'react-square-web-payments-sdk'
import { supabase } from '@/lib/supabase'

type Step = 'cart' | 'address' | 'payment' | 'confirmed'
type Zone = { id: string; name: string; delivery_fee: number }

// Wallet-eligible product categories
const WALLET_ELIGIBLE_CATEGORIES = ['water', 'refill', 'water_product', 'accessories']

// --- Main checkout page ---
export default function CheckoutPage() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart()
  const [paymentMode, setPaymentMode] = useState<'online' | 'wallet'>('online')
  const [fulfillmentType, setFulfillmentType] = useState<'delivery' | 'pickup'>('delivery')

  const PICKUP_ADDRESS = '1770 McLean Ave, Port Coquitlam, BC V3C 4K8'

  const [step, setStep] = useState<Step>('cart')
  const [walletBalance, setWalletBalance] = useState<number>(0)
  const [address, setAddress] = useState({ name: '', phone: '', street: '', city: '', zone: '', postal: '', notes: '', email: '' })
  const [zones, setZones] = useState<Zone[]>([])
  const [intentError, setIntentError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [serverTotal, setServerTotal] = useState<number | null>(null)
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isFirstOrder, setIsFirstOrder] = useState(false)
  const [cartError, setCartError] = useState('')
  const router = useRouter()

  const [upstairsCharge, setUpstairsCharge] = useState(0)
  const [pickupCharge, setPickupCharge] = useState(0)
  const [isUpstairs, setIsUpstairs] = useState(false)
  const [showDepositPopup, setShowDepositPopup] = useState(false)
  const [hasBoughtDeposit, setHasBoughtDeposit] = useState(false)
  const [bottleDepositItem, setBottleDepositItem] = useState<any>(null)

  // Fetch active zones and settings from DB
  useEffect(() => {
    supabase
      .from('zones')
      .select('id, name, delivery_fee')
      .eq('active', true)
      .order('name')
      .then(({ data }) => { if (data) setZones(data) })

    supabase
      .from('site_content')
      .select('key, value')
      .in('key', ['upstairs_delivery_charge', 'bottle_pickup_charge'])
      .then(({ data }) => {
        if (data) {
          const map: Record<string, string> = {}
          data.forEach(d => map[d.key] = d.value)
          setUpstairsCharge(parseFloat(map['upstairs_delivery_charge'] ?? '7.5') || 0)
          setPickupCharge(parseFloat(map['bottle_pickup_charge'] ?? '10') || 0)
        }
      })

    supabase
      .from('products')
      .select('id, name, price, image_url, category')
      .ilike('name', '%deposit%')
      .eq('active', true)
      .limit(1)
      .single()
      .then(({ data }) => { if (data) setBottleDepositItem(data) })
  }, [])

  // Update delivery fee when zone changes (pickup always has $0 delivery)
  useEffect(() => {
    if (fulfillmentType === 'pickup') {
      setDeliveryFee(0)
    } else {
      const zone = zones.find(z => z.name === address.zone)
      setDeliveryFee(zone?.delivery_fee ?? 0)
    }
  }, [address.zone, zones, fulfillmentType])

  // Require login — redirect if not authenticated; pre-fill address from profile
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUserId(session.user.id)
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, phone, delivery_address, zone_id, email, wallet_balance')
          .eq('id', session.user.id)
          .single()

        if (profile) {
          setWalletBalance(profile.wallet_balance ?? 0)
          let zoneName = ''
          if (profile.zone_id) {
            const { data: zoneRow } = await supabase
              .from('zones')
              .select('name')
              .eq('id', profile.zone_id)
              .single()
            zoneName = zoneRow?.name ?? ''
          }
          setAddress(prev => ({
            ...prev,
            name: profile.name ?? '',
            phone: profile.phone ?? '',
            street: profile.delivery_address ?? '',
            zone: zoneName,
            email: profile.email ?? session.user.email ?? '',
          }))
        } else {
          setAddress(prev => ({ ...prev, email: session.user.email ?? '' }))
        }

        // Check if this is a first-time order
        const { count } = await supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', session.user.id)
        setIsFirstOrder((count ?? 0) === 0)

        // Check if they have bought a bottle deposit before
        const { data: depositProd } = await supabase.from('products').select('id').ilike('name', '%deposit%').limit(1).single()
        if (depositProd) {
          const { data: pastItems } = await supabase
            .from('order_items')
            .select('id, orders!inner(user_id)')
            .eq('product_id', depositProd.id)
            .eq('orders.user_id', session.user.id)
            .limit(1)
          setHasBoughtDeposit(pastItems !== null && pastItems.length > 0)
        }
      }
      setAuthChecked(true)
    }
    checkAuth()
  }, [router])
  
  // Total water jug quantity in cart
  const waterJugQty = items
    .filter(i => i.product.category === 'water')
    .reduce((sum, i) => sum + i.quantity, 0)

  const calculatedUpstairsCharge = waterJugQty > 2 
    ? upstairsCharge + (waterJugQty - 2) * 2.5 
    : upstairsCharge;

  const subtotal = total()
  const taxableSubtotal = items.reduce((acc, item) => {
    const isWalletCredit = item.product.category === 'wallet_credit'
    const isDeposit = item.product.name.toLowerCase().includes('deposit')
    const isTaxable = (isWalletCredit || isDeposit) ? false : item.product.taxable !== false
    return acc + (isTaxable ? item.product.price * item.quantity : 0)
  }, 0)
  const tax = Math.round(taxableSubtotal * 0.12 * 100) / 100

  // Wallet credit orders are digital — no delivery fee applies
  const isAllWalletCredit = items.length > 0 && items.every(i => i.product.category === 'wallet_credit' || i.product.id.startsWith('wallet_credit_'))
  const deliveryFeeValue = (fulfillmentType === 'pickup' || isAllWalletCredit) ? 0 : deliveryFee + (isUpstairs ? calculatedUpstairsCharge : 0)

  // Wallet: covers items + tax only. Delivery always paid by card.
  const walletItemsTotal = Math.max(0, subtotal) + tax
  // Online / card on delivery: full total
  const orderTotal = Math.max(0, subtotal) + deliveryFeeValue + tax
  const displayTotal = serverTotal ?? orderTotal

  // For wallet mode, wallet covers items+tax; delivery charged to card separately
  const walletDeductAmount = walletItemsTotal
  const walletDeliveryCardAmount = deliveryFeeValue

  // Check if all items in cart are wallet-eligible
  // Use per-product wallet_eligible field if available, otherwise fall back to category check
  const allItemsWalletEligible = items.every(i =>
    i.product.wallet_eligible !== false && WALLET_ELIGIBLE_CATEGORIES.includes(i.product.category)
  )

  // --- Cart validation ---
  const validateCart = (): boolean => {
    setCartError('')
    if (items.length === 0) return false

    // First-order minimum: 2 water jugs
    if (isFirstOrder && waterJugQty > 0 && waterJugQty < 2) {
      setCartError('Your first order must include at least 2 water jugs.')
      return false
    }

    return true
  }

  const handleProceedFromCart = () => {
    if (validateCart()) {
      // Wallet credit orders are digital — skip address & delivery entirely
      if (isAllWalletCredit) {
        setFulfillmentType('pickup')
        setStep('payment')
        return
      }
      if (waterJugQty > 0 && !hasBoughtDeposit) {
        setShowDepositPopup(true)
      } else {
        setStep('address')
      }
    }
  }

  const handleConfirmDeposit = () => {
    setShowDepositPopup(false)
    // For wallet credit orders: skip address step, go straight to payment
    if (isAllWalletCredit) {
      setFulfillmentType('pickup')
      setStep('payment')
      return
    }
    setStep('address')
  }

  // --- Validation Logic ---
  const validateField = (name: string, value: string) => {
    let error = ''
    if (name === 'name') {
      if (!/^[a-zA-Z\s]+$/.test(value)) error = 'Name must only contain letters and spaces.'
      else if (value.trim().split(' ').length < 2) error = 'Please enter your full name (first and last).'
    } else if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '')
      if (cleaned.length < 10) error = 'Invalid phone format (min 10 digits).'
      else if (cleaned.length > 11) error = 'Excessive digits in phone number.'
      else if (cleaned.length === 11 && !cleaned.startsWith('1')) error = 'US/Canada numbers must start with 1 if 11 digits.'
    } else if (name === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address.'
    } else if (name === 'postal') {
      const isCanada = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i.test(value)
      const isUSA = /^\d{5}(-\d{4})?$/.test(value)
      if (!isCanada && !isUSA) error = 'Invalid Postal/Zip code format.'
    }

    setErrors(prev => ({ ...prev, [name]: error }))
    return !error
  }

  const handleAddressChange = (name: string, value: string) => {
    setAddress(prev => ({ ...prev, [name]: value }))
    if (errors[name]) validateField(name, value)
  }

  const handleNextFromAddress = (e: React.FormEvent) => {
    e.preventDefault()
    const isNameValid   = validateField('name', address.name)
    const isPhoneValid  = validateField('phone', address.phone)
    const isEmailValid  = validateField('email', address.email)

    if (fulfillmentType === 'pickup') {
      // For pickup: only name, phone, email required
      if (isNameValid && isPhoneValid && isEmailValid) setStep('payment')
      return
    }

    const isPostalValid = validateField('postal', address.postal)
    const isStreetValid = !!address.street.trim()
    const isZoneValid   = !!address.zone

    if (isNameValid && isPhoneValid && isEmailValid && isPostalValid && isStreetValid && isZoneValid) {
      setStep('payment')
    } else {
      if (!isStreetValid) setErrors(prev => ({ ...prev, street: 'Street address is required.' }))
      if (!isZoneValid)   setErrors(prev => ({ ...prev, zone: 'Please select a delivery zone.' }))
    }
  }

  const handlePaymentMethodTokenized = useCallback(async (token: { token: string }) => {
    setProcessing(true)
    setIntentError('')
    try {
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: token.token,
          amount: orderTotal,
          items: items.map(i => ({
            product_id: i.product.id,
            quantity: i.quantity,
            price: i.product.price,
            subscribeFrequency: i.product.subscription_interval ?? null,
          })),
          address: {
            name: address.name,
            phone: address.phone,
            street: address.street,
            zone: address.zone,
            postal: address.postal,
            email: address.email,
          },
          notes: address.notes ? `${address.notes}${isUpstairs ? ' | Upstairs Delivery Requested' : ''}` : (isUpstairs ? 'Upstairs Delivery Requested' : null),
          userId,
          discountCodeId: null,
          discountAmount: 0,
          paymentMethod: 'square_online',
          fulfillmentType,
          isUpstairs,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setOrderId(data.orderId)
      setServerTotal(data.serverTotal ?? orderTotal)
      if (data.deliveryFee !== undefined) setDeliveryFee(data.deliveryFee)
      clearCart()
      setStep('confirmed')
      window.scrollTo(0, 0)
    } catch (err) {
      setIntentError(err instanceof Error ? err.message : 'Payment failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }, [orderTotal, items, address, userId, clearCart])



  const handleWalletOrder = async (deliveryToken?: string) => {
    setProcessing(true)
    setIntentError('')
    try {
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: walletDeductAmount,
          deliveryFeeCardToken: deliveryToken ?? null,
          items: items.map(i => ({
            product_id: i.product.id,
            quantity: i.quantity,
            price: i.product.price,
            category: i.product.category,
            name: i.product.name,
          })),
          address: {
            name: address.name,
            phone: address.phone,
            street: address.street,
            zone: address.zone,
            postal: address.postal,
            email: address.email,
          },
          notes: address.notes ? `${address.notes}${isUpstairs ? ' | Upstairs Delivery Requested' : ''}` : (isUpstairs ? 'Upstairs Delivery Requested' : null),
          userId,
          discountCodeId: null,
          discountAmount: 0,
          paymentMethod: 'wallet',
          fulfillmentType,
          isUpstairs,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to place order')
      clearCart()
      setOrderId(data.orderId)
      setStep('confirmed')
      window.scrollTo(0, 0)
    } catch (err: unknown) {
      setIntentError(err instanceof Error ? err.message : 'Failed to place order')
    } finally {
      setProcessing(false)
    }
  }

  const StepIndicator = () => {
    return (
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-10">
        {(['cart', 'address', 'payment'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-1.5 sm:gap-2">
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all ${step === s ? 'bg-[#0097a7] text-white' :
              ['cart', 'address', 'payment', 'confirmed'].indexOf(step) > i ? 'bg-[#e0f7fa] text-[#0097a7]' :
                'bg-[#f0f9ff] text-[#4a7fa5] border border-[#cce7f0]'
              }`}>
              {['cart', 'address', 'payment', 'confirmed'].indexOf(step) > i ? '✓' : i + 1}
            </div>
            <span className={`text-xs sm:text-sm font-medium ${step === s ? 'text-[#0097a7]' : 'text-[#4a7fa5]'} ${step !== s && 'hidden sm:block'}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
            {i < 2 && <div className="w-4 sm:w-8 h-px sm:h-0.5 bg-[#cce7f0]" />}
          </div>
        ))}
      </div>
    )
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-8 h-8 border-3 border-[#cce7f0] border-t-[#0097a7] rounded-full"
        />
      </div>
    )
  }

  if (step === 'confirmed') {
    return (
      <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center px-4 pt-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-10 max-w-md w-full text-center border border-[#cce7f0] shadow-xl"
        >
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}>
            <CheckCircle2 className="w-20 h-20 text-[#0097a7] mx-auto mb-5" />
          </motion.div>
          <h2 className="text-2xl font-extrabold text-[#0c2340] mb-2">Order Confirmed!</h2>
          {orderId && (
            <p className="text-sm font-mono font-bold text-[#0097a7] mb-3">
              #{`TW-${orderId.slice(-8).toUpperCase()}`}
            </p>
          )}
          <p className="text-[#4a7fa5] mb-6">
            {fulfillmentType === 'pickup'
              ? 'Your order is confirmed. We\'ll call you when it\'s ready for pickup!'
              : 'Your water is on its way. You\'ll receive a confirmation email shortly with your tracking details.'}
          </p>
          <div className="bg-[#e0f7fa] rounded-2xl p-4 mb-6 text-left">
            <div className="flex items-center gap-2 text-[#0097a7] font-semibold text-sm mb-1">
              {fulfillmentType === 'pickup' ? <Package className="w-4 h-4" /> : <TruckIcon className="w-4 h-4" />}
              {fulfillmentType === 'pickup' ? 'Pickup Location' : 'Estimated Delivery'}
            </div>
            {fulfillmentType === 'pickup' ? (
              <>
                <p className="text-[#0c2340] font-bold">1770 McLean Ave, Port Coquitlam, BC</p>
                <p className="text-xs text-[#4a7fa5] mt-1">Mon–Fri 9am–5pm · We&apos;ll call when ready.</p>
              </>
            ) : (
              <>
                <p className="text-[#0c2340] font-bold">Within 1–2 business days</p>
                <p className="text-xs text-[#4a7fa5] mt-1">Our driver will call before arrival.</p>
              </>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/dashboard/orders">
              <Button className="w-full bg-gradient-to-r from-[#0097a7] to-[#1565c0] text-white">Track Order</Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline" className="w-full border-[#cce7f0] text-[#0097a7]">Continue Shopping</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f0f9ff] pt-24 pb-16 relative">
      <AnimatePresence>
        {showDepositPopup && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c2340]/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-[#cce7f0]"
            >
              <div className="w-16 h-16 bg-[#e0f7fa] rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-[#0097a7]" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#0c2340] text-center mb-3">Bottle Deposit Reminder</h3>
              <p className="text-[#4a7fa5] text-center mb-6">
                Do you have your own empty bottles to exchange? If not, please ensure you have added a Bottle Deposit to your cart.
              </p>
              
              <div className="space-y-3">
                <Button onClick={handleConfirmDeposit} className="w-full h-12 bg-gradient-to-r from-[#0097a7] to-[#1565c0] text-white font-bold rounded-xl shadow-md">
                  I Have Empties / Added Deposit
                </Button>
                <Button onClick={() => setShowDepositPopup(false)} variant="outline" className="w-full h-12 border-[#cce7f0] text-[#0097a7] font-bold rounded-xl">
                  Wait, Go Back to Cart
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/shop">
            <Button variant="ghost" size="sm" className="gap-1 text-[#4a7fa5]">
              <ArrowLeft className="w-4 h-4" /> Back to Shop
            </Button>
          </Link>
          <h1 className="text-2xl font-extrabold text-[#0c2340]">Checkout</h1>
        </div>

        <StepIndicator />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 'cart' && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl border border-[#cce7f0] shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[#cce7f0] flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#0097a7]" />
                  <h2 className="font-bold text-[#0c2340]">Your Cart ({items.length} items)</h2>
                </div>
                {items.length === 0 ? (
                  <div className="p-10 text-center text-[#4a7fa5]">
                    <div className="text-4xl mb-3">🛒</div>
                    <p>Your cart is empty.</p>
                    <Link href="/shop"><Button className="mt-4 bg-[#0097a7] text-white">Browse Products</Button></Link>
                  </div>
                ) : (
                  <div className="divide-y divide-[#f0f9ff]">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-4 p-4">
                        <div className="w-14 h-14 rounded-xl bg-[#e0f7fa] flex items-center justify-center shrink-0 overflow-hidden">
                          {item.product.image_url ? (
                            <Image src={item.product.image_url} alt={item.product.name} width={56} height={56} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl">💧</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#0c2340] truncate">{item.product.name}</p>
                          <p className="text-sm text-[#0097a7] font-bold">${item.product.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded-lg border border-[#cce7f0] flex items-center justify-center hover:border-[#0097a7] transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-[#0097a7] flex items-center justify-center text-white">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="w-16 text-right font-bold text-[#0c2340]">${(item.product.price * item.quantity).toFixed(2)}</p>
                        <button onClick={() => removeItem(item.product.id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* First-order notice */}
                {isFirstOrder && waterJugQty > 0 && (
                  <div className="mx-5 mb-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 font-medium">
                      First order requires a minimum of <strong>2 water jugs</strong>.
                      {waterJugQty < 2 && ` You currently have ${waterJugQty}.`}
                    </p>
                  </div>
                )}

                {cartError && (
                  <div className="mx-5 mb-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {cartError}
                  </div>
                )}

                {/* Delivery or Pickup toggle — hidden for wallet credit-only carts */}
                {items.length > 0 && !isAllWalletCredit && (

                  <div className="mx-5 mb-4">
                    <p className="text-xs font-semibold text-[#4a7fa5] mb-2 uppercase tracking-wider">Fulfillment</p>
                    <div className="flex p-1 bg-[#f0f9ff] rounded-2xl border border-[#cce7f0]">
                      <button
                        onClick={() => setFulfillmentType('delivery')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          fulfillmentType === 'delivery' ? 'bg-white text-[#0097a7] shadow-sm' : 'text-[#4a7fa5] hover:text-[#0097a7]'
                        }`}
                      >
                        <TruckIcon className="w-4 h-4" /> Delivery
                      </button>
                      <button
                        onClick={() => { setFulfillmentType('pickup'); setPaymentMode('online') }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          fulfillmentType === 'pickup' ? 'bg-white text-[#0097a7] shadow-sm' : 'text-[#4a7fa5] hover:text-[#0097a7]'
                        }`}
                      >
                        <Package className="w-4 h-4" /> Store Pickup
                      </button>
                    </div>
                    {fulfillmentType === 'pickup' && (
                      <div className="mt-3 flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl p-3">
                        <Package className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-green-700">No delivery charge — pickup is free!</p>
                          <p className="text-xs text-green-600 mt-0.5">Pick up at: 1770 McLean Ave, Port Coquitlam, BC V3C 4K8</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {items.length > 0 && (
                  <div className="p-5 pt-0">
                    <Button onClick={handleProceedFromCart} className="w-full h-12 rounded-xl bg-gradient-to-r from-[#0097a7] to-[#1565c0] text-white font-semibold">
                      {fulfillmentType === 'pickup' ? 'Continue to Details' : 'Continue to Address'}
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {step === 'address' && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl border border-[#cce7f0] shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[#cce7f0] flex items-center gap-2">
                  {fulfillmentType === 'pickup' ? <Package className="w-5 h-5 text-[#0097a7]" /> : <MapPin className="w-5 h-5 text-[#0097a7]" />}
                  <h2 className="font-bold text-[#0c2340]">{fulfillmentType === 'pickup' ? 'Your Details' : 'Delivery Address'}</h2>
                </div>
                <form onSubmit={handleNextFromAddress} className="p-5 space-y-4">

                  {/* Pickup info banner */}
                  {fulfillmentType === 'pickup' && (
                    <div className="flex items-start gap-3 bg-[#e0f7fa] rounded-2xl p-4 border border-[#b3e5fc]">
                      <Package className="w-5 h-5 text-[#0097a7] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-[#0c2340] text-sm">Store Pickup — No Delivery Fee</p>
                        <p className="text-xs text-[#0097a7] mt-1">📍 1770 McLean Ave, Port Coquitlam, BC V3C 4K8</p>
                        <p className="text-xs text-[#4a7fa5] mt-1">We&apos;ll contact you when your order is ready for pickup. Mon–Fri 9am–5pm.</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-[#0c2340] mb-1.5 block">Full Name</label>
                      <Input 
                        placeholder="John Smith" 
                        className={`border-[#cce7f0] ${errors.name ? 'border-red-500 bg-red-50' : ''}`}
                        required 
                        value={address.name} 
                        onChange={(e) => handleAddressChange('name', e.target.value)}
                        onBlur={(e) => validateField('name', e.target.value)}
                      />
                      {errors.name && <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#0c2340] mb-1.5 block">Phone Number</label>
                      <Input 
                        placeholder="(604) 555-0123" 
                        className={`border-[#cce7f0] ${errors.phone ? 'border-red-500 bg-red-50' : ''}`}
                        required 
                        value={address.phone} 
                        onChange={(e) => handleAddressChange('phone', e.target.value)}
                        onBlur={(e) => validateField('phone', e.target.value)}
                      />
                      {errors.phone && <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#0c2340] mb-1.5 block">Email Address</label>
                    <Input 
                      type="email" 
                      placeholder="email@example.com" 
                      className={`border-[#cce7f0] ${errors.email ? 'border-red-500 bg-red-50' : ''}`}
                      required 
                      value={address.email} 
                      onChange={(e) => handleAddressChange('email', e.target.value)}
                      onBlur={(e) => validateField('email', e.target.value)}
                    />
                    {errors.email ? (
                      <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium">{errors.email}</p>
                    ) : (
                      !userId && <p className="text-[10px] text-[#4a7fa5] mt-1">Used for your order confirmation and pickup notification.</p>
                    )}
                  </div>

                  {/* Delivery-only fields */}
                  {fulfillmentType === 'delivery' && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-[#0c2340] mb-1.5 block">Street Address</label>
                        <Input 
                          placeholder="123 Main Street, Suite 4" 
                          className={`border-[#cce7f0] ${errors.street ? 'border-red-500 bg-red-50' : ''}`}
                          required 
                          value={address.street} 
                          onChange={(e) => handleAddressChange('street', e.target.value)}
                        />
                        {errors.street && <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium">{errors.street}</p>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-[#0c2340] mb-1.5 block">Delivery Zone</label>
                          <select
                            required
                            value={address.zone}
                            onChange={(e) => handleAddressChange('zone', e.target.value)}
                            className={`w-full h-10 px-3 rounded-xl border border-[#cce7f0] text-sm focus:border-[#0097a7] focus:outline-none text-[#0c2340] ${errors.zone ? 'border-red-500 bg-red-50' : ''}`}
                          >
                            <option value="">Select zone...</option>
                            {zones.map((z) => <option key={z.id} value={z.name}>{z.name}</option>)}
                          </select>
                          {errors.zone && <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium">{errors.zone}</p>}
                        </div>
                        <div>
                          <label className="text-sm font-medium text-[#0c2340] mb-1.5 block">Postal / Zip Code</label>
                          <Input 
                            placeholder="V6B 1A1" 
                            className={`border-[#cce7f0] ${errors.postal ? 'border-red-500 bg-red-50' : ''}`}
                            required 
                            value={address.postal} 
                            onChange={(e) => handleAddressChange('postal', e.target.value)}
                            onBlur={(e) => validateField('postal', e.target.value)}
                          />
                          {errors.postal && <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium">{errors.postal}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-[#0c2340] mb-1.5 block">Delivery Instructions <span className="text-[#4a7fa5] font-normal">(optional)</span></label>
                        <textarea
                          placeholder="Leave at back door, call before arriving, gate code: 1234…"
                          value={address.notes}
                          onChange={(e) => setAddress({ ...address, notes: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 rounded-xl border border-[#cce7f0] text-sm focus:border-[#0097a7] focus:outline-none text-[#0c2340] resize-none"
                        />
                      </div>
                      <div className="pt-2">
                        <label className="flex items-start gap-3 p-3 border border-[#cce7f0] rounded-xl cursor-pointer hover:bg-[#f0f9ff] transition-colors">
                          <input
                            type="checkbox"
                            checked={isUpstairs}
                            onChange={(e) => setIsUpstairs(e.target.checked)}
                            className="mt-1 w-4 h-4 accent-[#0097a7]"
                          />
                          <div>
                            <p className="text-sm font-bold text-[#0c2340]">I need delivery upstairs / to my apartment</p>
                            <p className="text-xs text-[#4a7fa5] mt-0.5">
                              {isUpstairs 
                                ? `An additional fee of $${calculatedUpstairsCharge.toFixed(2)} will apply.` 
                                : `If unchecked, delivery will be made to the downstairs/lobby only.`}
                            </p>
                          </div>
                        </label>
                      </div>
                    </>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => setStep('cart')} className="flex-1 border-[#cce7f0]">Back to Cart</Button>
                    <Button type="submit" className="flex-1 bg-gradient-to-r from-[#0097a7] to-[#1565c0] text-white shadow-md shadow-[#0097a7]/20">
                      Payment & Review →
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl border border-[#cce7f0] shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[#cce7f0] flex items-center gap-2">
                  <CreditCardIcon className="w-5 h-5 text-[#0097a7]" />
                  <h2 className="font-bold text-[#0c2340]">Select Payment Method</h2>
                  <span className="ml-auto text-xs text-[#4a7fa5] bg-[#f0f9ff] px-2 py-1 rounded-full">Secure Checkout</span>
                </div>

                <div className="p-5 space-y-6">
                  {/* Payment Mode Toggle */}
                  <div className="flex p-1 bg-[#f0f9ff] rounded-2xl border border-[#cce7f0]">
                      <button
                        onClick={() => setPaymentMode('online')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                          paymentMode === 'online'
                            ? 'bg-white text-[#0097a7] shadow-sm'
                            : 'text-[#4a7fa5] hover:text-[#0097a7]'
                        }`}
                      >
                        <CreditCardIcon className="w-4 h-4" />
                        Pay Online
                      </button>
                      {userId && allItemsWalletEligible && (
                      <button
                        onClick={() => setPaymentMode('wallet')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                          paymentMode === 'wallet'
                            ? 'bg-white text-[#0097a7] shadow-sm'
                            : 'text-[#4a7fa5] hover:text-[#0097a7]'
                        }`}
                      >
                        <Wallet className="w-4 h-4" />
                        Wallet
                      </button>
                    )}
                  </div>

                  {intentError && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {intentError}
                    </div>
                  )}

                  {processing && (
                    <div className="flex items-center justify-center gap-3 text-[#4a7fa5] py-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-[#cce7f0] border-t-[#0097a7] rounded-full"
                      />
                      Processing payment...
                    </div>
                  )}

                  {paymentMode === 'online' ? (
                    <PaymentForm
                      applicationId={process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID ?? ''}
                      locationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? ''}
                      cardTokenizeResponseReceived={async (token) => {
                        if (token.status === 'OK' && token.token) {
                          await handlePaymentMethodTokenized({ token: token.token })
                        } else {
                          setIntentError('Payment failed. Please check your details and try again.')
                        }
                      }}
                      createPaymentRequest={() => ({
                        countryCode: 'CA',
                        currencyCode: 'CAD',
                        total: {
                          amount: displayTotal.toFixed(2),
                          label: 'TajWater Order',
                        },
                      })}
                    >
                      <div className="space-y-4">
                        <div className="space-y-3 mb-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <ApplePay />
                            <GooglePay />
                          </div>
                        </div>

                        <div className="relative flex py-3 items-center">
                          <div className="flex-grow border-t border-[#cce7f0]"></div>
                          <span className="flex-shrink mx-4 text-[#4a7fa5] text-xs">Or Pay by Card</span>
                          <div className="flex-grow border-t border-[#cce7f0]"></div>
                        </div>

                        <SquareCreditCard
                          buttonProps={{
                            css: {
                              backgroundColor: '#0097a7',
                              color: '#fff',
                              fontSize: '14px',
                              fontWeight: '600',
                              borderRadius: '12px',
                              padding: '12px 0',
                              marginTop: '10px',
                              '&:hover': { backgroundColor: '#00838f' },
                            },
                          }}
                        >
                          {processing ? 'Processing...' : `Pay $${displayTotal.toFixed(2)} with Card`}
                        </SquareCreditCard>
                      </div>
                    </PaymentForm>
                  ) : (
                    <div className="space-y-4">
                      {/* Wallet balance info */}
                      <div className="p-4 rounded-2xl border-2 border-[#0097a7] bg-[#f0f9ff]">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-xl bg-[#0097a7] text-white">
                            <Wallet className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-[#0c2340]">Wallet Balance</p>
                            <p className="text-xl font-black text-[#0097a7]">{walletBalance.toFixed(0)} credits</p>
                          </div>
                        </div>

                        {/* Split payment explanation */}
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between font-medium text-[#0c2340]">
                            <span>Wallet pays (items + tax)</span>
                            <span className="text-[#0097a7] font-bold">{walletDeductAmount.toFixed(0)} credits</span>
                          </div>
                          {walletDeliveryCardAmount > 0 && (
                            <div className="flex justify-between font-medium text-[#0c2340]">
                              <span>Card pays (delivery fee)</span>
                              <span className="font-bold">${walletDeliveryCardAmount.toFixed(2)}</span>
                            </div>
                          )}
                        </div>

                        {walletBalance < walletDeductAmount ? (
                          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 mt-3">
                            Insufficient wallet credits. You need {walletDeductAmount.toFixed(0)} credits but have {walletBalance.toFixed(0)}.
                          </div>
                        ) : (
                          <div className="flex items-start gap-2 bg-green-50 p-3 rounded-xl border border-green-200 mt-3">
                            <Info className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-green-700">You have sufficient credits for this order.</p>
                          </div>
                        )}
                      </div>

                      {/* Delivery fee card payment (if applicable) */}
                      {walletDeliveryCardAmount > 0 ? (
                        <div className="p-4 rounded-2xl border border-[#cce7f0] bg-white">
                          <div className="flex items-center gap-2 mb-3">
                            <CreditCardIcon className="w-4 h-4 text-[#0097a7]" />
                            <p className="text-sm font-bold text-[#0c2340]">
                              Card required for delivery fee (${walletDeliveryCardAmount.toFixed(2)})
                            </p>
                          </div>
                          <p className="text-xs text-[#4a7fa5] mb-4">
                            Delivery charges are always collected by card. Enter your card below to pay the ${walletDeliveryCardAmount.toFixed(2)} delivery fee.
                          </p>
                          <PaymentForm
                            applicationId={process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID ?? ''}
                            locationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? ''}
                            cardTokenizeResponseReceived={async (token) => {
                              if (token.status === 'OK' && token.token) {
                                await handleWalletOrder(token.token)
                              } else {
                                setIntentError('Card payment for delivery fee failed. Please check your card details.')
                              }
                            }}
                            createPaymentRequest={() => ({
                              countryCode: 'CA',
                              currencyCode: 'CAD',
                              total: {
                                amount: walletDeliveryCardAmount.toFixed(2),
                                label: 'Delivery Fee',
                              },
                            })}
                          >
                            <SquareCreditCard
                              buttonProps={{
                                css: {
                                  backgroundColor: walletBalance < walletDeductAmount ? '#94a3b8' : '#0097a7',
                                  color: '#fff',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  borderRadius: '12px',
                                  padding: '12px 0',
                                  marginTop: '10px',
                                },
                              }}
                            >
                              {processing
                                ? 'Processing...'
                                : walletBalance < walletDeductAmount
                                ? 'Insufficient Wallet Credits'
                                : `Pay $${walletDeliveryCardAmount.toFixed(2)} Delivery & Confirm`}
                            </SquareCreditCard>
                          </PaymentForm>
                        </div>
                      ) : (
                        // No delivery fee — wallet-only checkout
                        <Button
                          onClick={() => handleWalletOrder()}
                          disabled={processing || walletBalance < walletDeductAmount}
                          className="w-full bg-[#0097a7] hover:bg-[#00838f] text-white font-bold py-4 h-auto rounded-2xl shadow-lg shadow-[#0097a7]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {processing ? 'Processing...' : `Confirm Order — ${walletDeductAmount.toFixed(0)} Credits`}
                        </Button>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-center text-[#4a7fa5] pt-4">
                    By completing your purchase you agree to our{' '}
                    <a href="/legal/terms" target="_blank" className="underline hover:text-[#0097a7]">Terms of Service</a>
                  </p>
                  
                  <div className="pt-2">
                    <Button variant="ghost" size="sm" onClick={() => setStep('address')} className="text-[#4a7fa5] hover:text-[#0097a7]">
                       ← Change Address
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-[#cce7f0] shadow-sm sticky top-24 overflow-hidden">
              <div className="p-5 border-b border-[#cce7f0] bg-[#f0f9ff]/50">
                <h3 className="font-bold text-[#0c2340] flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#0097a7]" /> Order Summary
                </h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="w-12 h-12 bg-[#f0f9ff] rounded-xl flex-shrink-0 overflow-hidden border border-[#cce7f0]">
                        <Image src={item.product.image_url} alt={item.product.name} width={48} height={48} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#0c2340] truncate">{item.product.name}</p>
                        <p className="text-[10px] text-[#4a7fa5]">Qty: {item.quantity} × ${item.product.price.toFixed(2)}</p>
                      </div>
                      <div className="text-xs font-bold text-[#0c2340]">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#f0f9ff] space-y-2">
                  <div className="flex justify-between text-xs text-[#4a7fa5]">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#4a7fa5]">
                    {fulfillmentType === 'pickup' || isAllWalletCredit ? (
                      <>
                        <span>{isAllWalletCredit ? 'Delivery' : 'Pickup'}</span>
                        <span className="text-green-600 font-semibold">{isAllWalletCredit ? 'N/A (Digital)' : 'Free'}</span>
                      </>
                    ) : (
                      <>
                        <span>Delivery {isUpstairs ? '(+ Upstairs)' : ''}</span>
                        <span>${deliveryFeeValue.toFixed(2)}</span>
                      </>
                    )}
                  </div>
                  {tax > 0 && (
                    <div className="flex justify-between text-xs text-[#4a7fa5]">
                      <span>Tax (12% BC)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  )}

                  {paymentMode === 'wallet' && (
                    <>
                      <div className="flex justify-between text-xs font-medium text-[#0097a7] bg-[#f0f9ff] rounded-lg px-2 py-1.5">
                        <span>Wallet (items + tax)</span>
                        <span>{walletDeductAmount.toFixed(0)} credits</span>
                      </div>
                      {walletDeliveryCardAmount > 0 && (
                        <div className="flex justify-between text-xs font-medium text-[#4a7fa5] bg-[#f0f9ff] rounded-lg px-2 py-1.5">
                          <span>Card (delivery)</span>
                          <span>${walletDeliveryCardAmount.toFixed(2)}</span>
                        </div>
                      )}
                    </>
                  )}

                  {paymentMode !== 'wallet' && (
                    <div className="flex justify-between text-base font-black text-[#0c2340] pt-2 border-t border-[#f0f9ff]">
                      <span>Total</span>
                      <span>${displayTotal.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {paymentMode === 'wallet' && (
                  <div className="flex items-start gap-2 bg-[#e0f7fa] p-3 rounded-xl">
                    <Info className="w-3.5 h-3.5 text-[#0097a7] shrink-0 mt-0.5" />
                    <p className="text-[10px] leading-relaxed text-[#0097a7]">
                      Delivery fees are always charged by card. Wallet credits cover water products and tax only.
                    </p>
                  </div>
                )}

                {fulfillmentType === 'pickup' ? (
                  <div className="bg-green-50 border border-green-200 p-3 rounded-xl flex items-start gap-2">
                    <Package className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] leading-tight text-green-700 font-medium">
                      <span className="font-bold">Store Pickup — No Delivery Fee</span><br/>
                      1770 McLean Ave, Port Coquitlam<br/>
                      Mon–Fri 9am–5pm
                    </p>
                  </div>
                ) : address.zone ? (
                   <div className="bg-[#e0f7fa] p-3 rounded-xl flex items-start gap-2">
                     <TruckIcon className="w-4 h-4 text-[#0097a7] shrink-0 mt-0.5" />
                     <p className="text-[10px] leading-tight text-[#0097a7] font-medium">
                       Delivering to: <span className="font-bold text-[#0c2340]">{address.zone}</span><br/>
                       Usually arrives in 24-48 hours.
                     </p>
                   </div>
                ) : null}

                {/* Bottle Return Policy Notice */}
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] leading-tight text-amber-800 font-medium">
                    <strong className="text-amber-900 block mb-0.5">Bottle Return Policy</strong>
                    Customers must return empty bottles to our depot. If you require us to pick them up, a pickup charge of ${pickupCharge.toFixed(2)} will apply.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

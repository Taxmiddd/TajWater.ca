export interface Profile {
  id: string
  name: string
  email: string
  phone: string
  delivery_address: string
  zone_id: string
  avatar_url?: string
  square_customer_id?: string | null
  square_card_id?: string | null
  square_card_brand?: string | null
  square_card_last4?: string | null
  square_card_exp_month?: number | null
  square_card_exp_year?: number | null
  wallet_balance: number
  is_admin?: boolean
  created_at: string
}

export interface Zone {
  id: string
  name: string
  delivery_fee: number
  schedule: string
  active: boolean
}

export interface Product {
  id: string
  slug?: string | null
  name: string
  description: string
  price: number
  image_url: string
  stock: number
  category: string
  active: boolean
  featured?: boolean
  unit_label?: string
  rating?: number
  review_count?: number
  subscription_interval?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | null
  taxable?: boolean
}

export interface Order {
  id: string
  user_id: string
  status: 'pending' | 'processing' | 'out_for_delivery' | 'delivered' | 'cancelled'
  total: number
  delivery_address: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  zone_id: string
  created_at: string
  payment_method: 'square_online' | 'cash_on_delivery' | 'card_on_delivery'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'disputed'
  tracking_token?: string
  items?: OrderItem[]
  profile?: Profile
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  product?: Product
}

export interface Subscription {
  id: string
  user_id: string
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  next_delivery: string
  next_payment_at?: string | null
  status: 'active' | 'paused' | 'cancelled'
  quantity: number
  zone_id: string
  product_id: string
  square_customer_id?: string | null
  square_card_id?: string | null
  payment_card_brand?: string | null
  payment_card_last4?: string | null
  custom_plan?: boolean
  plan_name?: string | null
  custom_delivery_address?: string | null
  admin_notes?: string | null
}

export interface SupportTicket {
  id: string
  user_id: string
  subject: string
  message: string
  status: 'open' | 'in_progress' | 'resolved'
  created_at: string
}

export interface AdminUser {
  id: string
  email: string
  role: 'super_admin' | 'manager' | 'delivery'
  name: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface DeliveryZone {
  name: string
  areas: string[]
  fee: number
  schedule: string
}

export interface PaymentLink {
  id: string
  description: string
  amount: number
  currency: string
  customer_name: string | null
  customer_phone: string | null
  customer_email: string | null
  internal_note: string | null
  status: 'pending' | 'paid'
  square_payment_id: string | null
  line_items: { description: string; quantity: number; unit_price: number }[] | null
  created_at: string
  paid_at: string | null
  created_by: string | null
}

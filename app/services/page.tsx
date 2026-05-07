import { createServerClient } from '@/lib/supabase'
import ServicesContent from './ServicesContent'

const FALLBACK_SERVICES = [
  {
    id: 'water-delivery',
    title: '5-Gallon Water Jug Delivery',
    description: 'Fresh 5-gallon (20L) spring, alkaline, and distilled water jug delivery to your home or office across Metro Vancouver. Same-day delivery available for orders placed before 12pm. Free delivery on every order — no minimum, no contracts.',
    features: [
      'Spring, alkaline, and distilled water available',
      'BPA-free food-grade polycarbonate jugs',
      'Free delivery on all orders across 21 zones',
      'Same-day delivery before 12pm',
      'Flexible subscription — pause or cancel anytime',
      'Jug swap system — leave empties, get fresh filled jugs',
    ],
    pricing: [
      { label: 'Spring Water (5 gal)', price: '$8.99/jug' },
      { label: 'Alkaline Water (5 gal)', price: '$12.99/jug' },
      { label: 'Distilled Water (5 gal)', price: '$9.99/jug' },
      { label: 'Subscription (10+ jugs)', price: 'From $6.49/jug' },
    ],
    icon: 'Droplets',
    color: '#0097a7',
    image_url: null,
    sort_order: 1,
  },
  {
    id: 'filter-installation',
    title: 'Water Filter Installation',
    description: 'Professional under-sink and whole-home water filter system installation across Metro Vancouver. Our certified technicians install, test, and maintain reverse osmosis and multi-stage filtration systems. All installations come with a 2-year parts and labour warranty.',
    features: [
      'Under-sink reverse osmosis systems',
      'Whole-home filtration systems',
      'Countertop filter installation',
      'Annual filter replacement service',
      '2-year parts and labour warranty',
      'Free water quality assessment before installation',
    ],
    pricing: [
      { label: 'Under-sink RO system (supply + install)', price: 'From $399' },
      { label: 'Whole-home filter (supply + install)', price: 'From $599' },
      { label: 'Annual filter maintenance', price: '$79/year' },
      { label: 'Filter-only replacement', price: 'From $49' },
    ],
    icon: 'Settings',
    color: '#1565c0',
    image_url: null,
    sort_order: 2,
  },
  {
    id: 'commercial-supply',
    title: 'Commercial Water Supply',
    description: 'Bulk water delivery and recurring supply contracts for restaurants, offices, gyms, hotels, and industrial facilities across Metro Vancouver. Dedicated account management, Net-30 invoicing, and custom delivery scheduling for businesses requiring 10 or more jugs per delivery.',
    features: [
      'Custom pricing for 10+ jugs per delivery',
      'Net-30 invoicing for businesses',
      'Dedicated account manager',
      'Priority delivery scheduling',
      'Commercial-grade water dispensers available',
      'Flexible delivery frequency — weekly, bi-weekly, or custom',
    ],
    pricing: [
      { label: '10–24 jugs per delivery', price: '$7.49/jug' },
      { label: '25–49 jugs per delivery', price: '$6.99/jug' },
      { label: '50+ jugs per delivery', price: 'Custom quote' },
      { label: 'Net-30 invoicing (approved accounts)', price: 'No surcharge' },
    ],
    icon: 'Building2',
    color: '#006064',
    image_url: null,
    sort_order: 3,
  },
]

export default async function ServicesPage() {
  const db = createServerClient()
  const { data } = await db
    .from('services')
    .select('*')
    .eq('active', true)
    .order('sort_order')

  const services = (data && data.length > 0) ? data : FALLBACK_SERVICES

  return <ServicesContent initialServices={services} />
}

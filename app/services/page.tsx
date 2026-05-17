import type { Metadata } from 'next'
import Script from 'next/script'
import { createServerClient } from '@/lib/supabase'
import ServicesContent from './ServicesContent'

export const metadata: Metadata = {
  title: 'Water Delivery Services — Metro Vancouver | Taj Water',
  description: '5-gallon water jug delivery, water filter installation, and commercial water supply across Metro Vancouver. Spring, alkaline & distilled water from $8.99/jug. Free delivery, no contracts.',
  keywords: [
    'water delivery services Vancouver',
    'water filter installation Metro Vancouver',
    'commercial water supply Vancouver',
    '5 gallon water delivery Vancouver',
    'water jug delivery service BC',
  ],
  alternates: { canonical: 'https://tajwater.ca/services' },
  openGraph: {
    title: 'Water Delivery Services — Metro Vancouver | Taj Water',
    description: '5-gallon jug delivery, filter installation, and commercial supply across 21 Metro Vancouver cities. Free delivery, no contracts.',
    url: 'https://tajwater.ca/services',
    type: 'website',
    images: [{ url: 'https://tajwater.ca/opengraph-image', width: 1200, height: 630 }],
  },
}

const servicesJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: '5-Gallon Water Jug Delivery',
      serviceType: 'Water Delivery',
      description: 'Fresh 5-gallon spring, alkaline, and distilled water jug delivery to homes and offices across Metro Vancouver. Same-day delivery available before 12pm. Free delivery on every order.',
      provider: { '@id': 'https://tajwater.ca/#business' },
      areaServed: { '@type': 'AdministrativeArea', name: 'Metro Vancouver, British Columbia, Canada' },
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: '8.99',
        highPrice: '10.99',
        priceCurrency: 'CAD',
        offerCount: 3,
      },
    },
    {
      '@type': 'Service',
      name: 'Water Filter Installation',
      serviceType: 'Water Filter Installation',
      description: 'Professional under-sink and whole-home water filter system installation across Metro Vancouver. Reverse osmosis and multi-stage filtration. 2-year parts and labour warranty.',
      provider: { '@id': 'https://tajwater.ca/#business' },
      areaServed: { '@type': 'AdministrativeArea', name: 'Metro Vancouver, British Columbia, Canada' },
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: '399',
        highPrice: '599',
        priceCurrency: 'CAD',
      },
    },
    {
      '@type': 'Service',
      name: 'Commercial Water Supply',
      serviceType: 'Commercial Water Delivery',
      description: 'Bulk water delivery and recurring supply contracts for restaurants, offices, gyms, hotels, and industrial facilities across Metro Vancouver. Net-30 invoicing, dedicated account management.',
      provider: { '@id': 'https://tajwater.ca/#business' },
      areaServed: { '@type': 'AdministrativeArea', name: 'Metro Vancouver, British Columbia, Canada' },
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: '6.99',
        highPrice: '7.49',
        priceCurrency: 'CAD',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'How quickly can I get my first water delivery?', acceptedAnswer: { '@type': 'Answer', text: 'For most Metro Vancouver zones, Taj Water offers same-day delivery if you order before 12pm. Otherwise, next-day delivery is always available. Scheduling takes only 2 minutes online at tajwater.ca/shop.' } },
        { '@type': 'Question', name: 'Can I pause or cancel my water delivery subscription?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. You can pause, change frequency, or cancel your subscription anytime from your customer dashboard — no fees, no questions asked.' } },
        { '@type': 'Question', name: 'Does Taj Water service commercial and industrial clients?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Taj Water has dedicated commercial accounts with custom pricing, Net-30 invoicing, and a dedicated account manager for businesses needing 10 or more jugs per delivery.' } },
        { '@type': 'Question', name: 'What Metro Vancouver cities does Taj Water deliver to?', acceptedAnswer: { '@type': 'Answer', text: 'Taj Water delivers to 21 cities across Metro Vancouver and the Sea-to-Sky corridor: Vancouver, Burnaby, Richmond, Surrey, Coquitlam, Port Coquitlam, Port Moody, North Vancouver, West Vancouver, Delta, Langley, Langley Township, Maple Ridge, Pitt Meadows, White Rock, Cloverdale, Tsawwassen, Walnut Grove, Mary Hill, Squamish, and Whistler.' } },
        { '@type': 'Question', name: 'How do I pay for water delivery?', acceptedAnswer: { '@type': 'Answer', text: 'Taj Water accepts Visa, Mastercard, American Express, e-Transfer, and cash on delivery. Business accounts can apply for Net-30 invoicing.' } },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tajwater.ca' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://tajwater.ca/services' },
      ],
    },
  ],
}

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
      { label: 'Alkaline Water (5 gal)', price: '$10.99/jug' },
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

  return (
    <>
      <Script id="services-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }} />
      <ServicesContent initialServices={services} />
    </>
  )
}

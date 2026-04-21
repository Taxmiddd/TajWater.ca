import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { createServerClient } from '@/lib/supabase'
import { Droplets, MapPin, Clock, Phone, ArrowRight, CheckCircle2, ShieldCheck, Truck } from 'lucide-react'

type Props = {
  params: Promise<{ city: string }>
}

const CITY_DATA: Record<string, { name: string; districts: string[]; schedule: string; description: string }> = {
  'vancouver': {
    name: 'Vancouver',
    districts: ['Downtown', 'Kitsilano', 'East Vancouver', 'Marpole', 'Kerrisdale', 'Dunbar', 'Point Grey', 'Mount Pleasant'],
    schedule: 'Daily',
    description: 'Vancouver\'s most trusted water delivery service. We deliver 5-gallon spring, alkaline, and distilled water jugs to homes and offices throughout Vancouver — from Downtown to Marpole, Kitsilano to East Van.',
  },
  'burnaby': {
    name: 'Burnaby',
    districts: ['Metrotown', 'Brentwood', 'Burnaby Heights', 'South Slope', 'Edmonds', 'Deer Lake'],
    schedule: 'Mon–Sat',
    description: 'Fast and affordable water jug delivery in Burnaby. Same-day delivery available to Metrotown, Brentwood, Burnaby Heights, and all Burnaby neighbourhoods.',
  },
  'richmond': {
    name: 'Richmond',
    districts: ['Steveston', 'City Centre', 'Brighouse', 'Shellmont', 'Terra Nova', 'Hamilton'],
    schedule: 'Mon–Sat',
    description: 'Reliable 5-gallon water delivery across Richmond. From Steveston to City Centre, we bring pure spring and alkaline water right to your door.',
  },
  'surrey': {
    name: 'Surrey',
    districts: ['City Centre', 'Newton', 'Fleetwood', 'Cloverdale', 'Guildford', 'South Surrey', 'Panorama Ridge'],
    schedule: 'Mon–Sat',
    description: 'Affordable water jug delivery across Surrey and its neighbourhoods. Serving Newton, Fleetwood, Cloverdale, Guildford, and more.',
  },
  'langley': {
    name: 'Langley',
    districts: ['Langley City', 'Langley Township', 'Willoughby', 'Brookswood', 'Walnut Grove', 'Murrayville'],
    schedule: 'Tue, Thu, Sat',
    description: 'Water delivery to Langley City and Langley Township. 5-gallon spring, alkaline, and distilled water jugs delivered to your home or office.',
  },
  'coquitlam': {
    name: 'Coquitlam',
    districts: ['Maillardville', 'Burke Mountain', 'Coquitlam Centre', 'Westwood Plateau', 'Austin Heights'],
    schedule: 'Tue, Thu, Sat',
    description: 'Water jug delivery service in Coquitlam. Fast delivery to Burke Mountain, Maillardville, Westwood Plateau, and all Coquitlam areas.',
  },
  'port-coquitlam': {
    name: 'Port Coquitlam',
    districts: ['Citadel', 'Mary Hill', 'Oxford Heights', 'Riverwood', 'Prairie'],
    schedule: 'Tue, Thu, Sat',
    description: 'TajWater delivers fresh 5-gallon water jugs to Port Coquitlam. Serving Citadel, Mary Hill, Oxford Heights, and surrounding neighbourhoods.',
  },
  'port-moody': {
    name: 'Port Moody',
    districts: ['Inlet Centre', 'Heritage Woods', 'Glenayre', 'College Park', 'Suter Brook'],
    schedule: 'Tue, Thu',
    description: 'Water delivery service in Port Moody. Fresh spring and alkaline water delivered to Inlet Centre, Heritage Woods, Glenayre, and more.',
  },
  'north-vancouver': {
    name: 'North Vancouver',
    districts: ['Lynn Valley', 'Capilano', 'Deep Cove', 'Seymour', 'Lonsdale', 'Lower Lonsdale'],
    schedule: 'Mon, Wed, Fri',
    description: 'Premium water delivery in North Vancouver. 5-gallon jugs delivered to Lynn Valley, Deep Cove, Lonsdale, and across the North Shore.',
  },
  'west-vancouver': {
    name: 'West Vancouver',
    districts: ['Dundarave', 'Ambleside', 'Horseshoe Bay', 'Caulfeild', 'Park Royal', 'British Properties'],
    schedule: 'Tue, Thu, Sat',
    description: 'Water jug delivery to West Vancouver. Serving Dundarave, Ambleside, Horseshoe Bay, and the British Properties.',
  },
  'delta': {
    name: 'Delta',
    districts: ['Ladner', 'Tsawwassen', 'North Delta', 'Sunshine Hills', 'Scottsdale'],
    schedule: 'Mon, Wed, Fri',
    description: 'Water delivery across Delta — Ladner, Tsawwassen, and North Delta. Fresh 5-gallon jugs at competitive prices.',
  },
  'maple-ridge': {
    name: 'Maple Ridge',
    districts: ['Albion', 'Silver Valley', 'Haney', 'Kanaka Creek', 'Thornhill'],
    schedule: 'Wed, Fri',
    description: 'Water jug delivery to Maple Ridge. Serving Albion, Silver Valley, Haney, and surrounding areas.',
  },
  'pitt-meadows': {
    name: 'Pitt Meadows',
    districts: ['Central Pitt Meadows', 'South Bonson', 'North Pitt Meadows'],
    schedule: 'Wed, Fri',
    description: 'Affordable water delivery service in Pitt Meadows. Fresh 5-gallon water jugs delivered to your door.',
  },
  'white-rock': {
    name: 'White Rock',
    districts: ['White Rock Beach', 'East White Rock', 'West White Rock', 'Hillcrest'],
    schedule: 'Mon, Wed, Fri',
    description: 'Water delivery in White Rock. 5-gallon spring and alkaline water jugs delivered to homes and businesses.',
  },
  'squamish': {
    name: 'Squamish',
    districts: ['Downtown Squamish', 'Garibaldi Highlands', 'Valleycliffe', 'Brackendale'],
    schedule: 'Thursdays',
    description: 'Water jug delivery to Squamish. Fresh 5-gallon spring water delivered weekly to Garibaldi Highlands, Valleycliffe, and Brackendale.',
  },
  'whistler': {
    name: 'Whistler',
    districts: ['Whistler Village', 'Creekside', 'Function Junction', 'Alpine Meadows'],
    schedule: 'Thursdays',
    description: 'Water delivery in Whistler. Premium 5-gallon water jugs for homes, hotels, and businesses in Whistler Village and surrounding areas.',
  },
}

export async function generateStaticParams() {
  return Object.keys(CITY_DATA).map((city) => ({ city }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params
  const data = CITY_DATA[city]
  if (!data) return { title: 'Not Found' }

  const title = `Water Delivery ${data.name} — 5-Gallon Jugs, Filters & Commercial Supply`
  const description = data.description

  return {
    title,
    description,
    keywords: [
      `water delivery ${data.name}`,
      `5 gallon water ${data.name}`,
      `water jug delivery ${data.name}`,
      `drinking water ${data.name}`,
      `water filter installation ${data.name}`,
      `water delivery near me ${data.name}`,
      `cheap water delivery ${data.name}`,
    ],
    openGraph: {
      title: `${title} | TajWater`,
      description,
      url: `/areas/${city}`,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `TajWater Water Delivery ${data.name}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | TajWater`,
      description,
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: `/areas/${city}`,
    },
  }
}

export default async function CityPage({ params }: Props) {
  const { city } = await params
  const data = CITY_DATA[city]
  if (!data) notFound()

  // Fetch featured products for CTA
  let products: { id: string; name: string; price: number; category: string }[] = []
  try {
    const db = createServerClient()
    const { data: prods } = await db
      .from('products')
      .select('id, name, price, category')
      .eq('active', true)
      .eq('category', 'water')
      .order('price')
      .limit(3)
    if (prods) products = prods
  } catch { /* graceful fallback */ }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Water Delivery ${data.name}`,
    provider: {
      '@type': 'LocalBusiness',
      name: 'TajWater',
      url: 'https://tajwater.ca',
    },
    areaServed: {
      '@type': 'City',
      name: data.name,
      containedInPlace: { '@type': 'AdministrativeArea', name: 'British Columbia' },
    },
    description: data.description,
    serviceType: 'Water Delivery',
    offers: products.length > 0
      ? {
          '@type': 'AggregateOffer',
          lowPrice: products[0].price.toFixed(2),
          highPrice: products[products.length - 1].price.toFixed(2),
          priceCurrency: 'CAD',
          offerCount: products.length,
        }
      : undefined,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tajwater.ca' },
      { '@type': 'ListItem', position: 2, name: 'Delivery Areas', item: 'https://tajwater.ca/areas' },
      { '@type': 'ListItem', position: 3, name: data.name, item: `https://tajwater.ca/areas/${city}` },
    ],
  }

  return (
    <>
      <Script id="city-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Script id="breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative py-28 hero-gradient overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
              <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="#f0f9ff" />
            </svg>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold mb-4">
              <MapPin className="w-3.5 h-3.5 inline mr-1" />{data.name}, BC
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-5">
              Water Delivery in<br /><span className="gradient-text-light">{data.name}</span>
            </h1>
            <p className="text-[#b3e5fc] text-lg sm:text-xl max-w-2xl mx-auto mb-8">
              {data.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/shop" className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-[#0097a7] font-bold text-base shadow-2xl hover:shadow-white/20 transition-all">
                <Droplets className="w-5 h-5" /> Order Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/40 bg-white/10 backdrop-blur-sm text-white font-semibold hover:bg-white/20 transition-all">
                <Phone className="w-4 h-4" /> Get a Quote
              </Link>
            </div>
          </div>
        </section>

        {/* Trust badges */}
        <section className="py-12 bg-white border-b border-[#cce7f0]">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Truck, label: 'Same-Day Delivery', sub: `Available in ${data.name}` },
              { icon: Droplets, label: 'Pure & Certified', sub: 'NSF/ANSI Tested' },
              { icon: ShieldCheck, label: 'Best Prices', sub: 'From $6.49/jug' },
              { icon: Clock, label: data.schedule, sub: 'Delivery Schedule' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-[#e0f7fa] flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-[#0097a7]" />
                </div>
                <p className="font-bold text-[#0c2340] text-sm">{item.label}</p>
                <p className="text-xs text-[#4a7fa5]">{item.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Neighbourhoods */}
        <section className="py-20 bg-[#f0f9ff]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0c2340] text-center mb-4">
              Neighbourhoods We Serve in {data.name}
            </h2>
            <p className="text-[#4a7fa5] text-center mb-10 max-w-xl mx-auto">
              TajWater delivers to all major neighbourhoods in {data.name}. Same-day delivery available for orders placed before 12pm.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {data.districts.map((district) => (
                <div key={district} className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 border border-[#cce7f0] shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#0097a7] shrink-0" />
                  <span className="text-sm font-medium text-[#0c2340]">{district}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products CTA */}
        {products.length > 0 && (
          <section className="py-20 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0c2340] text-center mb-4">
                Popular Products in {data.name}
              </h2>
              <p className="text-[#4a7fa5] text-center mb-10">
                Order online and get fresh water delivered to your door.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {products.map((p) => (
                  <Link key={p.id} href={`/shop/${p.id}`} className="group block">
                    <div className="bg-[#f0f9ff] rounded-2xl p-6 border border-[#cce7f0] hover:border-[#0097a7]/40 hover:shadow-md transition-all text-center">
                      <div className="text-4xl mb-3">💧</div>
                      <h3 className="font-bold text-[#0c2340] group-hover:text-[#0097a7] transition-colors mb-1">{p.name}</h3>
                      <p className="text-2xl font-extrabold text-[#0097a7]">${p.price.toFixed(2)}</p>
                      <p className="text-xs text-[#4a7fa5] mt-1">per jug</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border-2 border-[#0097a7] text-[#0097a7] font-semibold hover:bg-[#0097a7] hover:text-white transition-all">
                  View All Products <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Back to areas */}
        <section className="py-12 bg-[#f0f9ff] border-t border-[#cce7f0]">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <p className="text-[#4a7fa5] mb-4">Looking for delivery in another area?</p>
            <Link href="/areas" className="inline-flex items-center gap-2 text-[#0097a7] font-semibold hover:underline">
              <MapPin className="w-4 h-4" /> View All Delivery Areas
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}

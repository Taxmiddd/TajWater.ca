import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import ConditionalShell from '@/components/layout/ConditionalShell'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tajwater.ca'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'TajWater — #1 Water Delivery Service in Metro Vancouver',
    template: '%s | TajWater',
  },
  description: '5-gallon water jug delivery across Metro Vancouver. Spring, alkaline & distilled water, filter installation, and commercial supply. Same-day delivery available.',
  keywords: [
    'drinking water supplier Vancouver',
    '5 gallon water jug delivery Vancouver',
    'cheap water delivery Vancouver',
    'water dispenser delivery Vancouver',
    'water filter installation Vancouver',
    'bulk water delivery Metro Vancouver',
    '5 gallon water jug delivery BC',
    'alkaline water delivery Vancouver',
    'distilled water delivery Vancouver',
    'spring water delivery Vancouver',
    'same day water delivery Vancouver',
    'water delivery Burnaby',
    'water delivery Richmond',
    'water delivery Surrey',
    'water delivery Langley',
    'TajWater',
  ],
  authors: [{ name: 'TajWater' }],
  creator: 'TajWater',
  publisher: 'TajWater',
  category: 'Water Delivery Service',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: BASE_URL,
    siteName: 'TajWater',
    title: 'TajWater — Vancouver\'s Best Drinking Water Supplier | 5 Gallon Jugs',
    description: 'Affordable and Competitive 5-gallon jug delivery, filter installation, and commercial supply in Vancouver. Same-day delivery available.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TajWater — Pure Water Delivered to Your Door in Metro Vancouver',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TajWater — Vancouver\'s Best Drinking Water Supplier | 5 Gallon Jugs',
    description: 'Affordable and Competitive 5-gallon jug delivery, filter installation, and commercial supply in Vancouver. Order now.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  additionalType: 'https://schema.org/WaterDeliveryService',
  '@id': `${BASE_URL}/#business`,
  name: 'TajWater',
  alternateName: 'Taj Water',
  description: '5-gallon water jug delivery across Metro Vancouver. Spring, alkaline & distilled water, filter installation, and commercial supply.',
  url: BASE_URL,
  logo: `${BASE_URL}/logo/tajcyan.svg`,
  image: `${BASE_URL}/og-image.png`,
  telephone: process.env.NEXT_PUBLIC_COMPANY_PHONE ?? '+16041234567',
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? 'info@tajwater.ca',
  priceRange: '$$',
  currenciesAccepted: 'CAD',
  paymentAccepted: 'Cash, Credit Card, Debit Card, Online Payment',
  areaServed: [
    { '@type': 'City', name: 'Vancouver', '@id': 'https://www.wikidata.org/wiki/Q24639' },
    { '@type': 'City', name: 'Burnaby' },
    { '@type': 'City', name: 'Richmond' },
    { '@type': 'City', name: 'Surrey' },
    { '@type': 'City', name: 'North Vancouver' },
    { '@type': 'City', name: 'West Vancouver' },
    { '@type': 'City', name: 'Coquitlam' },
    { '@type': 'City', name: 'Port Coquitlam' },
    { '@type': 'City', name: 'Port Moody' },
    { '@type': 'City', name: 'Delta' },
    { '@type': 'City', name: 'Langley' },
    { '@type': 'City', name: 'Maple Ridge' },
    { '@type': 'City', name: 'Pitt Meadows' },
    { '@type': 'City', name: 'White Rock' },
    { '@type': 'City', name: 'Squamish' },
    { '@type': 'City', name: 'Whistler' },
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: '1770 McLean Ave',
    addressLocality: 'Port Coquitlam',
    addressRegion: 'BC',
    addressCountry: 'CA',
    postalCode: 'V3C 4K8',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 49.2614,
    longitude: -122.7681,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '07:00',
      closes: '19:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '08:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Sunday',
      opens: '09:00',
      closes: '17:00',
    },
  ],
  sameAs: [],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Water Delivery and Filter Services',
    itemListElement: [
      {
        '@type': 'Offer',
        name: '5 Gallon (20L) Water Jug Delivery',
        description: 'Affordable and Competitive 5-gallon spring, alkaline & distilled water jug delivery to your home or office across Metro Vancouver',
        price: '8.99',
        priceCurrency: 'CAD',
        availability: 'https://schema.org/InStock',
        url: `${BASE_URL}/shop`,
        itemOffered: {
          '@type': 'Product',
          name: '5 Gallon Spring Water Jug',
          category: 'Water',
          image: `${BASE_URL}/og-image.png`,
          description: 'Premium spring water in a 20L BPA-free jug.',
          offers: {
            '@type': 'Offer',
            price: '8.99',
            priceCurrency: 'CAD',
            availability: 'https://schema.org/InStock',
            url: `${BASE_URL}/shop`,
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: 5.0,
            reviewCount: 128,
          },
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Water Filter Installation',
          description: 'Professional under-sink and whole-home water filter system installation with 2-year warranty',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Commercial Water Supply',
          description: 'Bulk water supply and recurring delivery for restaurants, offices, gyms, and industrial facilities',
        },
      },
    ],
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  name: 'TajWater',
  url: BASE_URL,
  description: 'Premium water delivery across Metro Vancouver',
  publisher: { '@id': `${BASE_URL}/#business` },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/shop?search={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </head>
      <body className="antialiased bg-[#f0f9ff]" suppressHydrationWarning>
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  )
}


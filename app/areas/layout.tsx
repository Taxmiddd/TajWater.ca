import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Service Areas — 5-Gallon Water Delivery Across Metro Vancouver | TajWater',
  description: 'Cheap and competitive 5-gallon water jug delivery in Vancouver, Burnaby, Richmond, Surrey, Langley and more. See our full service area and delivery schedule.',
  keywords: [
    'water delivery Vancouver',
    'water delivery Burnaby',
    'water delivery Richmond',
    'water delivery Surrey',
    'water delivery Langley',
    'water delivery Coquitlam',
    '5 gallon water delivery BC',
    'drinking water delivery Metro Vancouver',
    'cheap water delivery service BC',
    'water delivery Port Moody',
    'Metro Vancouver water delivery zones',
    'water delivery near me Vancouver',
  ],
  openGraph: {
    title: 'Delivery Areas — TajWater Metro Vancouver',
    description: 'Serving 21 zones across Metro Vancouver with same-day and scheduled water delivery. Check if we deliver to your area.',
    url: '/areas',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'TajWater Delivery Areas Metro Vancouver' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Delivery Areas — TajWater Metro Vancouver',
    description: 'Serving 21 zones across Metro Vancouver. Check your delivery zone.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/areas',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tajwater.ca' },
    { '@type': 'ListItem', position: 2, name: 'Delivery Areas', item: 'https://tajwater.ca/areas' },
  ],
}

const serviceAreaSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Water Delivery Metro Vancouver',
  provider: { '@type': 'LocalBusiness', name: 'TajWater', url: 'https://tajwater.ca' },
  areaServed: [
    'North Vancouver BC', 'West Vancouver BC', 'Vancouver BC', 'Richmond BC',
    'Burnaby BC', 'Coquitlam BC', 'Port Moody BC', 'Surrey BC', 'Delta BC', 'Langley BC',
  ],
  description: '5 Gallon water jug delivery across Metro Vancouver. Same-day and scheduled delivery available.',
}

export default function AreasLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="service-area-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceAreaSchema) }} />
      {children}
    </>
  )
}


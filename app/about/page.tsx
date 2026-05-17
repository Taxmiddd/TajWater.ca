import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'About Taj Water — Metro Vancouver\'s Local Water Delivery Company',
  description: 'Taj Water is a family-owned water delivery company based in Port Coquitlam, BC, serving Metro Vancouver since 2010. NSF/ANSI 58 certified, 4.9 stars, 800+ reviews.',
  alternates: { canonical: 'https://tajwater.ca/about' },
  openGraph: {
    title: 'About Taj Water — Port Coquitlam\'s Local Water Delivery Company',
    description: 'Family-owned, community-focused water delivery serving Metro Vancouver since 2010. NSF/ANSI 58 certified. 4.9 stars from 800+ reviews.',
    url: 'https://tajwater.ca/about',
    type: 'website',
    images: [{ url: 'https://tajwater.ca/opengraph-image', width: 1200, height: 630 }],
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://tajwater.ca/#business',
  name: 'Taj Water',
  legalName: 'Taj Water Ltd',
  url: 'https://tajwater.ca',
  logo: 'https://tajwater.ca/logo/tajcyan.svg',
  foundingDate: '2010',
  foundingLocation: { '@type': 'Place', name: 'Port Coquitlam, British Columbia, Canada' },
  description: 'Taj Water is a family-owned water delivery company based in Port Coquitlam, BC, serving Metro Vancouver since 2010 with 5-gallon spring, alkaline, and distilled water jug delivery, water filter installation, and commercial water supply.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '1770 McLean Ave Unit 7',
    addressLocality: 'Port Coquitlam',
    addressRegion: 'BC',
    postalCode: 'V3C 4K8',
    addressCountry: 'CA',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+17785047880',
    contactType: 'customer service',
    email: 'info@tajwater.ca',
    areaServed: 'Metro Vancouver, BC, Canada',
    availableLanguage: 'English',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '800',
    bestRating: '5',
    worstRating: '1',
  },
  sameAs: [
    'https://share.google/z0yw2GjNF424r5RXm',
    'https://www.bbb.org/ca/bc/port-coquitlam/profile/bulk-water-delivery/taj-water-ltd-0037-2438917',
    'https://www.yelp.com/biz/taj-water-port-coquitlam',
  ],
  hasCredential: [
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'certification', name: 'NSF/ANSI 58 Certified' },
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'certification', name: 'ISO 9001:2015' },
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'license', name: 'BC Water Authority Approved' },
  ],
}

export default async function AboutPage() {
  const db = createServerClient()
  const [teamRes, contentRes] = await Promise.all([
    db.from('about_team').select('*').order('sort_order'),
    db.from('site_content').select('key, value'),
  ])

  const team = teamRes.data ?? []
  const contentMap: Record<string, string> = {}
  for (const row of (contentRes.data ?? [])) {
    contentMap[row.key] = row.value
  }

  const heroSubtitle = contentMap['about_hero_subtitle'] ??
    "TajWater has been Metro Vancouver's trusted drinking water delivery service since 2010. Family-owned, community-focused, and committed to pure water for every home and business in BC."
  const mission = contentMap['about_mission'] ??
    'To make clean, pure water accessible and affordable for every household and business in Metro Vancouver — delivered reliably, sustainably, and with genuine care.'
  const vision = contentMap['about_vision'] ??
    'A BC where no family goes without access to quality drinking water. We are building the most trusted water delivery network in the province, one delivery at a time.'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <AboutClient team={team} mission={mission} vision={vision} heroSubtitle={heroSubtitle} />
    </>
  )
}

/**
 * Comprehensive Schema.org markup for maximum SEO coverage
 * Generates structured data for Google Rich Results, Knowledge Graph, and local search
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tajwater.ca'

// Organization Schema - Powers Knowledge Panel
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TajWater',
  alternateName: ['Taj Water', 'TajWater Ltd'],
  description: 'Metro Vancouver\'s #1 water delivery service. Spring, alkaline, and distilled water in 5-gallon jugs delivered same-day.',
  url: BASE_URL,
  logo: `${BASE_URL}/logo/tajcyan.svg`,
  image: `${BASE_URL}/og-image.png`,
  telephone: process.env.NEXT_PUBLIC_COMPANY_PHONE ?? '+1 778-504-7880',
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? 'info@tajwater.ca',
  foundingDate: '2019-01-01',
  areaServed: [
    { '@type': 'City', name: 'Vancouver', '@id': 'https://www.wikidata.org/wiki/Q24639' },
    { '@type': 'City', name: 'Burnaby' },
    { '@type': 'City', name: 'Richmond' },
    { '@type': 'City', name: 'Surrey' },
    { '@type': 'City', name: 'Coquitlam' },
    { '@type': 'City', name: 'Port Coquitlam' },
    { '@type': 'City', name: 'Port Moody' },
    { '@type': 'City', name: 'North Vancouver' },
    { '@type': 'City', name: 'West Vancouver' },
    { '@type': 'City', name: 'Langley' },
    { '@type': 'City', name: 'Maple Ridge' },
    { '@type': 'City', name: 'Delta' },
    { '@type': 'City', name: 'Pitt Meadows' },
    { '@type': 'City', name: 'White Rock' },
    { '@type': 'City', name: 'Squamish' },
    { '@type': 'City', name: 'Whistler' },
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: '1770 McLean Ave, Unit 7',
    addressLocality: 'Port Coquitlam',
    addressRegion: 'BC',
    addressCountry: 'CA',
    postalCode: 'V3C 4K8',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: process.env.NEXT_PUBLIC_COMPANY_PHONE ?? '+1 778-504-7880',
      contactOption: 'TollFree',
      areaServed: ['CA'],
      availableLanguage: ['en'],
    },
  ],
  sameAs: [],
  priceRange: '$$',
  knowsAbout: ['Water Delivery', 'Spring Water', 'Alkaline Water', 'Distilled Water', 'Water Filtration', 'Commercial Water Supply'],
  award: [
    'Best Water Delivery Service Metro Vancouver',
    'Trusted by 5000+ Families',
  ],
}

// Video Schema for How It Works
export const videoSchema = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'How TajWater Water Delivery Works',
  description: 'Simple 3-step process: Order online or call, we prepare and deliver your water, enjoy pure water at your doorstep.',
  thumbnailUrl: [`${BASE_URL}/og-image.png`],
  uploadDate: '2024-01-01T00:00:00Z',
  duration: 'PT2M30S',
  embedUrl: `${BASE_URL}/video-embed`,
}

// Product Schema - for each water type
export const createProductSchema = (name: string, price: number, description: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name,
  description,
  image: `${BASE_URL}/og-image.png`,
  sku: `TAJ-${name.replace(/\s+/g, '-').toUpperCase()}-5GAL`,
  offers: {
    '@type': 'Offer',
    url: `${BASE_URL}/shop`,
    priceCurrency: 'CAD',
    price: price.toString(),
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: 'TajWater',
    },
  },
  brand: {
    '@type': 'Brand',
    name: 'TajWater',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '150',
    bestRating: '5',
    worstRating: '1',
  },
})

// Review Schema - for testimonials
export const createReviewSchema = (
  author: string,
  reviewText: string,
  ratingValue: number,
  datePublished: string = new Date().toISOString()
) => ({
  '@context': 'https://schema.org',
  '@type': 'Review',
  reviewRating: {
    '@type': 'Rating',
    ratingValue: ratingValue.toString(),
    bestRating: '5',
    worstRating: '1',
  },
  reviewBody: reviewText,
  author: {
    '@type': 'Person',
    name: author,
  },
  publisher: {
    '@type': 'Organization',
    name: 'TajWater',
  },
  datePublished,
})

// FAQ Schema with rich Q&A structure
export const createFAQSchema = (faqs: Array<{ q: string; a: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
})

// Service Schema - for each city
export const createCityServiceSchema = (cityName: string, description: string, price: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: `Water Delivery in ${cityName}`,
  description,
  provider: {
    '@type': 'LocalBusiness',
    name: 'TajWater',
    url: BASE_URL,
    telephone: process.env.NEXT_PUBLIC_COMPANY_PHONE ?? '+1 778-504-7880',
  },
  areaServed: {
    '@type': 'City',
    name: cityName,
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: 'British Columbia',
    },
  },
  serviceType: 'Water Delivery',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'CAD',
    price,
    url: `${BASE_URL}/shop`,
  },
})

// Local Business Schema per city - for better local SEO
export const createLocalBusinessSchema = (
  cityName: string,
  areas: string[],
  schedule: string,
  imageUrl?: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  additionalType: 'https://schema.org/WaterDeliveryService',
  name: `TajWater - ${cityName} Water Delivery`,
  description: `Professional 5-gallon water jug delivery service in ${cityName}. Same-day delivery available.`,
  url: `${BASE_URL}/areas/${cityName.toLowerCase().replace(/\s+/g, '-')}`,
  image: imageUrl || `${BASE_URL}/og-image.png`,
  telephone: process.env.NEXT_PUBLIC_COMPANY_PHONE ?? '+1 778-504-7880',
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? 'info@tajwater.ca',
  priceRange: '$$',
  areaServed: {
    '@type': 'City',
    name: cityName,
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: 'British Columbia',
    },
  },
  serviceArea: areas.map((area) => ({
    '@type': 'City',
    name: area,
  })),
  serviceType: 'Water Delivery',
  offers: [
    {
      '@type': 'Offer',
      name: '5-Gallon Spring Water',
      priceCurrency: 'CAD',
      price: '8.99',
      url: `${BASE_URL}/shop`,
    },
    {
      '@type': 'Offer',
      name: '5-Gallon Alkaline Water',
      priceCurrency: 'CAD',
      price: '12.99',
      url: `${BASE_URL}/shop`,
    },
    {
      '@type': 'Offer',
      name: '5-Gallon Distilled Water',
      priceCurrency: 'CAD',
      price: '9.99',
      url: `${BASE_URL}/shop`,
    },
  ],
  operatingHours: schedule,
})

// Breadcrumb Schema
export const createBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
})

// Rich Snippet - Aggregate Rating
export const createAggregateRatingSchema = (
  ratingValue: number,
  reviewCount: number,
  productName: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'AggregateRating',
  ratingValue: ratingValue.toString(),
  reviewCount: reviewCount.toString(),
  bestRating: '5',
  worstRating: '1',
  name: productName,
})

// Article Schema for blog posts
export const createArticleSchema = (
  title: string,
  description: string,
  author: string,
  datePublished: string,
  dateModified: string,
  imageUrl: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: title,
  description,
  image: imageUrl,
  datePublished,
  dateModified,
  author: {
    '@type': 'Organization',
    name: author,
  },
  publisher: {
    '@type': 'Organization',
    name: 'TajWater',
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/logo/tajcyan.svg`,
    },
  },
  mainEntity: {
    '@type': 'Thing',
    name: title,
  },
})

// Event Schema for promotions
export const createEventSchema = (
  name: string,
  description: string,
  startDate: string,
  endDate: string,
  offerUrl: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'Event',
  name,
  description,
  startDate,
  endDate,
  eventAttendanceMode: 'OnlineEventAttendanceMode',
  eventStatus: 'EventScheduled',
  organizer: {
    '@type': 'Organization',
    name: 'TajWater',
    url: BASE_URL,
  },
  url: offerUrl,
  offers: {
    '@type': 'Offer',
    url: offerUrl,
    availability: 'https://schema.org/InStock',
    priceCurrency: 'CAD',
    price: '0',
  },
})

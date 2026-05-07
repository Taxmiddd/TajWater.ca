import { Metadata } from 'next'
import AreasContent from './AreasContent'

export const metadata: Metadata = {
  title: 'Water Delivery Areas — All 21 Metro Vancouver Zones | TajWater',
  description: 'TajWater delivers 5-gallon water jugs to 21 cities across Metro Vancouver. Check your city — Vancouver, Burnaby, Surrey, Richmond, Langley, Coquitlam, and more.',
  keywords: [
    'water delivery Metro Vancouver',
    'water delivery areas Vancouver',
    'water delivery zones BC',
    'water delivery near me Metro Vancouver',
    '5 gallon water delivery Vancouver',
    'water delivery Burnaby',
    'water delivery Surrey',
    'water delivery Richmond',
    'water delivery Langley',
    'water delivery Coquitlam',
  ],
  alternates: { canonical: 'https://tajwater.ca/areas' },
  openGraph: {
    title: 'Water Delivery Areas — All 21 Metro Vancouver Zones | TajWater',
    description: 'TajWater delivers spring, alkaline, and distilled 5-gallon water jugs to 21 cities across Metro Vancouver. Free delivery, same-day available.',
    url: 'https://tajwater.ca/areas',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

export default function AreasPage() {
  return <AreasContent initialDbZones={[]} />
}

import { Metadata } from 'next'
import ContactContent from './ContactContent'

export const metadata: Metadata = {
  title: 'Contact TajWater — Water Delivery in Metro Vancouver',
  description: 'Contact TajWater for water delivery, filter installation, or commercial water supply in Metro Vancouver. Call +1 778-504-7880, email info@tajwater.ca, or send a message.',
  keywords: [
    'contact TajWater',
    'water delivery contact Vancouver',
    'order water delivery Vancouver',
    'TajWater phone number',
    'TajWater Port Coquitlam',
  ],
  alternates: { canonical: 'https://tajwater.ca/contact' },
  openGraph: {
    title: 'Contact TajWater — Water Delivery Metro Vancouver',
    description: 'Get in touch for water jug delivery, water filter installation, or a commercial water supply quote. Serving all 21 Metro Vancouver zones.',
    url: 'https://tajwater.ca/contact',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

export default function ContactPage() {
  return <ContactContent />
}

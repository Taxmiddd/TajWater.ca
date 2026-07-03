import { Metadata } from 'next'
import SocialsClient from './SocialsClient'

export const metadata: Metadata = {
  title: 'Follow TajWater on Social Media | Vancouver Water Delivery',
  description: 'Stay connected with TajWater on Facebook, Instagram, X (Twitter), and TikTok. Get updates, promotions, and behind-the-scenes water delivery content.',
  openGraph: {
    title: 'Follow TajWater on Social Media',
    description: 'Connect with Metro Vancouver\'s trusted water delivery company across all social platforms.',
    url: 'https://tajwater.ca/socials',
  },
  alternates: { canonical: 'https://tajwater.ca/socials' },
}

export default function SocialsPage() {
  return <SocialsClient />
}

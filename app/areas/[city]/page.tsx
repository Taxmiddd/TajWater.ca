import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { createServerClient } from '@/lib/supabase'
import { Droplets, MapPin, Clock, Phone, ArrowRight, CheckCircle2, ShieldCheck, Truck } from 'lucide-react'

type Props = {
  params: Promise<{ city: string }>
}

const CITY_DATA: Record<string, { name: string; districts: string[]; schedule: string; description: string; why: string; faq: { q: string; a: string }[] }> = {
  'vancouver': {
    name: 'Vancouver',
    districts: ['Downtown', 'Kitsilano', 'East Vancouver', 'Marpole', 'Kerrisdale', 'Dunbar', 'Point Grey', 'Mount Pleasant'],
    schedule: 'Daily',
    description: 'Vancouver\'s most trusted water delivery service. We deliver 5-gallon spring, alkaline, and distilled water jugs to homes and offices throughout Vancouver — from Downtown to Marpole, Kitsilano to East Van.',
    why: 'Vancouver has excellent municipal water, but many residents notice a chlorine taste — especially in older buildings with aging pipes in Kitsilano and East Van. TajWater delivers independently tested, purified water straight to your door, so every glass is fresh and clean. We offer same-day delivery in Vancouver for orders placed before 12pm, free delivery on every order, and a flexible jug swap system with no commitment required.',
    faq: [
      { q: 'How much does water delivery cost in Vancouver?', a: 'TajWater\'s 5-gallon water jugs start at $8.99 each for spring water, $12.99 for alkaline, and $9.99 for distilled. Delivery is always free across Vancouver. Orders of 10+ jugs or subscriptions start from $6.49/jug.' },
      { q: 'Do you offer same-day water delivery in Vancouver?', a: 'Yes. Orders placed before 12pm on a weekday qualify for same-day delivery across most Vancouver neighbourhoods including Downtown, Kitsilano, East Vancouver, Marpole, and Mount Pleasant.' },
      { q: 'Do I need to be home when the water is delivered in Vancouver?', a: 'No. Most Vancouver customers leave a note with their delivery instructions — we place your new jugs and pick up your empties without you needing to be present.' },
    ],
  },
  'burnaby': {
    name: 'Burnaby',
    districts: ['Metrotown', 'Brentwood', 'Burnaby Heights', 'South Slope', 'Edmonds', 'Deer Lake'],
    schedule: 'Mon–Sat',
    description: 'Fast and affordable water jug delivery in Burnaby. Same-day delivery available to Metrotown, Brentwood, Burnaby Heights, and all Burnaby neighbourhoods.',
    why: 'Burnaby residents in high-rise buildings at Metrotown and Brentwood often experience water pressure and taste variations depending on floor level. TajWater\'s 5-gallon jug delivery eliminates any uncertainty — pure, tested water delivered directly to your suite or lobby. We deliver Monday through Saturday across all Burnaby zones with free delivery every time.',
    faq: [
      { q: 'How much does water delivery cost in Burnaby?', a: 'Water jug delivery in Burnaby starts at $8.99 per 5-gallon jug. Free delivery is included on all orders. Subscriptions and bulk orders of 10+ jugs bring the price down to $6.49/jug.' },
      { q: 'Can you deliver water to my condo or apartment in Burnaby?', a: 'Yes. We deliver to condos, apartments, houses, and offices across Burnaby including Metrotown, Brentwood, and Burnaby Heights. Leave delivery instructions in your order notes.' },
      { q: 'What days do you deliver water in Burnaby?', a: 'We deliver in Burnaby Monday through Saturday. Same-day delivery is available for orders placed before 12pm.' },
    ],
  },
  'richmond': {
    name: 'Richmond',
    districts: ['Steveston', 'City Centre', 'Brighouse', 'Shellmont', 'Terra Nova', 'Hamilton'],
    schedule: 'Mon–Sat',
    description: 'Reliable 5-gallon water delivery across Richmond. From Steveston to City Centre, we bring pure spring and alkaline water right to your door.',
    why: 'Richmond\'s water supply passes through an extensive distribution network across the delta, and many residents — particularly in Steveston and Terra Nova — prefer bottled water for drinking and cooking. TajWater delivers BPA-free, purified 5-gallon jugs to Richmond homes and businesses Monday to Saturday with same-day service available.',
    faq: [
      { q: 'How much does water jug delivery cost in Richmond?', a: 'TajWater delivers 5-gallon water jugs to Richmond starting at $8.99 each with free delivery. Alkaline water is $12.99/jug and distilled is $9.99/jug.' },
      { q: 'Do you deliver water to Steveston?', a: 'Yes. TajWater delivers to all Richmond neighbourhoods including Steveston, City Centre, Brighouse, Terra Nova, and Hamilton.' },
      { q: 'How does the jug return system work in Richmond?', a: 'On your first order, a $12 bottle deposit applies per jug. On every subsequent delivery, our driver swaps your empties for fresh full jugs. The deposit stays on account as long as you order.' },
    ],
  },
  'surrey': {
    name: 'Surrey',
    districts: ['City Centre', 'Newton', 'Fleetwood', 'Cloverdale', 'Guildford', 'South Surrey', 'Panorama Ridge'],
    schedule: 'Mon–Sat',
    description: 'Affordable water jug delivery across Surrey and its neighbourhoods. Serving Newton, Fleetwood, Cloverdale, Guildford, and more.',
    why: 'Surrey is Metro Vancouver\'s fastest-growing city, and water demand across Newton, Fleetwood, and South Surrey continues to rise. TajWater offers competitive pricing on 5-gallon jug delivery to all Surrey zones with no contracts. Whether you\'re in a Panorama Ridge single family home or a Guildford apartment, we deliver fresh, clean water on schedule.',
    faq: [
      { q: 'How much does water delivery cost in Surrey?', a: 'Water jug delivery in Surrey starts at $8.99 per 5-gallon jug with free delivery included. Bulk orders and subscriptions bring pricing down to $6.49/jug.' },
      { q: 'Which Surrey neighbourhoods do you deliver water to?', a: 'We deliver across all of Surrey including City Centre, Newton, Fleetwood, Cloverdale, Guildford, South Surrey, Panorama Ridge, Whalley, and Bear Creek.' },
      { q: 'Can I set up recurring water delivery in Surrey?', a: 'Yes. Our subscription service lets you schedule weekly, bi-weekly, or monthly deliveries at a lower per-jug price. Cancel or pause anytime from your online account.' },
    ],
  },
  'langley': {
    name: 'Langley',
    districts: ['Langley City', 'Langley Township', 'Willoughby', 'Brookswood', 'Walnut Grove', 'Murrayville'],
    schedule: 'Tue, Thu, Sat',
    description: 'Water delivery to Langley City and Langley Township. 5-gallon spring, alkaline, and distilled water jugs delivered to your home or office.',
    why: 'Langley City and Langley Township residents have fewer local water delivery options than Vancouver\'s urban core. TajWater fills that gap with three delivery days per week covering Willoughby, Walnut Grove, Brookswood, and Murrayville. Pure 5-gallon spring, alkaline, and distilled water at Metro Vancouver\'s most competitive prices.',
    faq: [
      { q: 'Do you deliver water to Langley Township?', a: 'Yes. TajWater delivers to both Langley City and Langley Township, including Willoughby, Walnut Grove, Brookswood, Fort Langley, Aldergrove, and Murrayville.' },
      { q: 'How much does water delivery cost in Langley?', a: 'Water delivery in Langley starts at $8.99 per 5-gallon jug with free delivery. Subscription customers pay from $6.49/jug.' },
      { q: 'What days does TajWater deliver in Langley?', a: 'We deliver to Langley on Tuesdays, Thursdays, and Saturdays. Order before 12pm for same-day delivery on available days.' },
    ],
  },
  'coquitlam': {
    name: 'Coquitlam',
    districts: ['Maillardville', 'Burke Mountain', 'Coquitlam Centre', 'Westwood Plateau', 'Austin Heights'],
    schedule: 'Tue, Thu, Sat',
    description: 'Water jug delivery service in Coquitlam. Fast delivery to Burke Mountain, Maillardville, Westwood Plateau, and all Coquitlam areas.',
    why: 'TajWater is based in Port Coquitlam, which means Coquitlam is our home territory. Burke Mountain, Westwood Plateau, and Austin Heights customers receive some of our fastest delivery windows — often within hours of ordering. We know the neighbourhoods, the roads, and the delivery windows better than any competitor.',
    faq: [
      { q: 'How much does water delivery cost in Coquitlam?', a: 'TajWater delivers 5-gallon water jugs to Coquitlam starting at $8.99 each. Free delivery on all orders. Subscriptions from $6.49/jug.' },
      { q: 'Do you deliver water to Burke Mountain in Coquitlam?', a: 'Yes. Burke Mountain is one of our most popular delivery zones in Coquitlam. We deliver Tuesday, Thursday, and Saturday.' },
      { q: 'Can I get same-day water delivery in Coquitlam?', a: 'Yes. As a Port Coquitlam-based company, we frequently fulfill same-day orders in Coquitlam for orders placed before 12pm.' },
    ],
  },
  'port-coquitlam': {
    name: 'Port Coquitlam',
    districts: ['Citadel', 'Mary Hill', 'Oxford Heights', 'Riverwood', 'Prairie'],
    schedule: 'Tue, Thu, Sat',
    description: 'TajWater delivers fresh 5-gallon water jugs to Port Coquitlam. Serving Citadel, Mary Hill, Oxford Heights, and surrounding neighbourhoods.',
    why: 'Port Coquitlam is TajWater\'s home base. Our warehouse is located on McLean Ave in Port Coquitlam, which means PoCo customers get the fastest service, most flexible delivery windows, and our most competitive pricing. If you\'re in Citadel, Mary Hill, Oxford Heights, or Riverwood, you\'re minutes from our facility.',
    faq: [
      { q: 'How much does water delivery cost in Port Coquitlam?', a: 'Port Coquitlam is TajWater\'s home base. 5-gallon water jugs start at $8.99 with free delivery. As a local PoCo business, we also offer flexible scheduling and fast turnaround.' },
      { q: 'What areas of Port Coquitlam do you deliver to?', a: 'We deliver across all of Port Coquitlam: Citadel, Mary Hill, Oxford Heights, Riverwood, Prairie, and the McLean Ave area.' },
      { q: 'Can I pick up water from your facility in Port Coquitlam?', a: 'Yes. Our warehouse is at 1770 McLean Ave unit 7, Port Coquitlam. Contact us to arrange a pickup instead of delivery.' },
    ],
  },
  'port-moody': {
    name: 'Port Moody',
    districts: ['Inlet Centre', 'Heritage Woods', 'Glenayre', 'College Park', 'Suter Brook'],
    schedule: 'Tue, Thu',
    description: 'Water delivery service in Port Moody. Fresh spring and alkaline water delivered to Inlet Centre, Heritage Woods, Glenayre, and more.',
    why: 'Port Moody residents value quality — and TajWater delivers exactly that. From the Heritage Woods hillside to Suter Brook\'s waterfront, we bring certified 5-gallon water jugs twice a week with free delivery and a simple jug swap system.',
    faq: [
      { q: 'How much does water delivery cost in Port Moody?', a: 'TajWater delivers 5-gallon water jugs to Port Moody starting at $8.99 each with free delivery included.' },
      { q: 'Do you deliver water to Heritage Woods?', a: 'Yes. Heritage Woods, Inlet Centre, Glenayre, College Park, and Suter Brook are all in our Port Moody delivery zone.' },
      { q: 'What days do you deliver water in Port Moody?', a: 'We deliver to Port Moody on Tuesdays and Thursdays.' },
    ],
  },
  'north-vancouver': {
    name: 'North Vancouver',
    districts: ['Lynn Valley', 'Capilano', 'Deep Cove', 'Seymour', 'Lonsdale', 'Lower Lonsdale'],
    schedule: 'Mon, Wed, Fri',
    description: 'Premium water delivery in North Vancouver. 5-gallon jugs delivered to Lynn Valley, Deep Cove, Lonsdale, and across the North Shore.',
    why: 'North Vancouver\'s mountain water supply is among the cleanest in BC, but many North Shore residents still prefer the convenience and consistency of filtered jug delivery. TajWater serves North Vancouver three days a week with next-day delivery guaranteed and same-day available for Lynn Valley and Lower Lonsdale.',
    faq: [
      { q: 'How much does water delivery cost in North Vancouver?', a: 'TajWater delivers 5-gallon water jugs to North Vancouver starting at $8.99 each with free delivery.' },
      { q: 'Do you deliver water to Deep Cove and Lynn Valley?', a: 'Yes. Deep Cove, Lynn Valley, Capilano, Seymour, Lonsdale, and Lower Lonsdale are all covered in our North Vancouver delivery zone.' },
      { q: 'What days do you deliver water in North Vancouver?', a: 'We deliver in North Vancouver on Mondays, Wednesdays, and Fridays.' },
    ],
  },
  'west-vancouver': {
    name: 'West Vancouver',
    districts: ['Dundarave', 'Ambleside', 'Horseshoe Bay', 'Caulfeild', 'Park Royal', 'British Properties'],
    schedule: 'Tue, Thu, Sat',
    description: 'Water jug delivery to West Vancouver. Serving Dundarave, Ambleside, Horseshoe Bay, and the British Properties.',
    why: 'West Vancouver homes in the British Properties and Caulfeild area often have long pipe runs from the municipal supply, making filtered delivery the preferred choice. TajWater delivers 5-gallon spring and alkaline water to West Vancouver three times a week.',
    faq: [
      { q: 'How much does water delivery cost in West Vancouver?', a: 'Water jug delivery to West Vancouver starts at $8.99 per 5-gallon jug with free delivery included.' },
      { q: 'Do you deliver water to the British Properties in West Vancouver?', a: 'Yes. The British Properties, Dundarave, Ambleside, Horseshoe Bay, and Caulfeild are all on our West Vancouver delivery route.' },
      { q: 'What days do you deliver water in West Vancouver?', a: 'We deliver to West Vancouver on Tuesdays, Thursdays, and Saturdays.' },
    ],
  },
  'delta': {
    name: 'Delta',
    districts: ['Ladner', 'Tsawwassen', 'North Delta', 'Sunshine Hills', 'Scottsdale'],
    schedule: 'Mon, Wed, Fri',
    description: 'Water delivery across Delta — Ladner, Tsawwassen, and North Delta. Fresh 5-gallon jugs at competitive prices.',
    why: 'Delta spans three distinct communities — Ladner, Tsawwassen, and North Delta — and TajWater serves all three. Our Monday, Wednesday, Friday schedule means you\'re never more than two days away from a fresh water delivery across all of Delta.',
    faq: [
      { q: 'How much does water delivery cost in Delta?', a: 'Water delivery in Delta starts at $8.99 per 5-gallon jug. Free delivery on all orders.' },
      { q: 'Do you deliver water to Ladner and Tsawwassen?', a: 'Yes. Ladner, Tsawwassen, North Delta, Sunshine Hills, and Scottsdale are all in our Delta delivery zone.' },
      { q: 'What days do you deliver water in Delta?', a: 'We deliver to Delta on Mondays, Wednesdays, and Fridays.' },
    ],
  },
  'maple-ridge': {
    name: 'Maple Ridge',
    districts: ['Albion', 'Silver Valley', 'Haney', 'Kanaka Creek', 'Thornhill'],
    schedule: 'Wed, Fri',
    description: 'Water jug delivery to Maple Ridge. Serving Albion, Silver Valley, Haney, and surrounding areas.',
    why: 'Maple Ridge and Pitt Meadows are underserved by most Metro Vancouver water delivery companies. TajWater is committed to the Fraser Valley corridor — we deliver to Albion, Silver Valley, and Haney twice weekly at the same prices as central Vancouver.',
    faq: [
      { q: 'How much does water delivery cost in Maple Ridge?', a: 'Water delivery in Maple Ridge starts at $8.99 per 5-gallon jug with free delivery — same price as Vancouver.' },
      { q: 'Do you deliver water to Silver Valley and Albion?', a: 'Yes. Silver Valley, Albion, Haney, Kanaka Creek, and Thornhill are all covered in our Maple Ridge delivery zone.' },
      { q: 'What days do you deliver water in Maple Ridge?', a: 'We deliver to Maple Ridge on Wednesdays and Fridays.' },
    ],
  },
  'pitt-meadows': {
    name: 'Pitt Meadows',
    districts: ['Central Pitt Meadows', 'South Bonson', 'North Pitt Meadows'],
    schedule: 'Wed, Fri',
    description: 'Affordable water delivery service in Pitt Meadows. Fresh 5-gallon water jugs delivered to your door.',
    why: 'Pitt Meadows is a growing community with limited local water delivery options. TajWater delivers twice weekly to all Pitt Meadows areas at Metro Vancouver prices — no rural premium, no extra fees.',
    faq: [
      { q: 'How much does water delivery cost in Pitt Meadows?', a: 'Water delivery in Pitt Meadows starts at $8.99 per 5-gallon jug with free delivery.' },
      { q: 'What areas of Pitt Meadows do you deliver to?', a: 'We deliver to Central Pitt Meadows, South Bonson, and North Pitt Meadows.' },
      { q: 'What days do you deliver water in Pitt Meadows?', a: 'We deliver to Pitt Meadows on Wednesdays and Fridays.' },
    ],
  },
  'white-rock': {
    name: 'White Rock',
    districts: ['White Rock Beach', 'East White Rock', 'West White Rock', 'Hillcrest'],
    schedule: 'Mon, Wed, Fri',
    description: 'Water delivery in White Rock. 5-gallon spring and alkaline water jugs delivered to homes and businesses.',
    why: 'White Rock\'s ocean proximity and municipal supply system make many residents prefer purified water for drinking. TajWater delivers to White Rock Beach, East White Rock, and Hillcrest three times a week with the same free delivery and competitive pricing as all Metro Vancouver zones.',
    faq: [
      { q: 'How much does water delivery cost in White Rock?', a: 'TajWater delivers 5-gallon water jugs to White Rock starting at $8.99 each with free delivery.' },
      { q: 'Do you deliver water to White Rock Beach?', a: 'Yes. White Rock Beach, East White Rock, West White Rock, and Hillcrest are all in our delivery zone.' },
      { q: 'What days do you deliver in White Rock?', a: 'We deliver to White Rock on Mondays, Wednesdays, and Fridays.' },
    ],
  },
  'squamish': {
    name: 'Squamish',
    districts: ['Downtown Squamish', 'Garibaldi Highlands', 'Valleycliffe', 'Brackendale'],
    schedule: 'Thursdays',
    description: 'Water jug delivery to Squamish. Fresh 5-gallon spring water delivered weekly to Garibaldi Highlands, Valleycliffe, and Brackendale.',
    why: 'Squamish is the gateway to the Sea-to-Sky corridor, and TajWater is one of the only Metro Vancouver water delivery services that extends service this far north. We deliver to Squamish every Thursday — spring, alkaline, and distilled water at the same flat rate as Vancouver.',
    faq: [
      { q: 'How much does water delivery cost in Squamish?', a: 'Water delivery to Squamish starts at $8.99 per 5-gallon jug with free delivery — same price as Vancouver.' },
      { q: 'Do you deliver water to Garibaldi Highlands?', a: 'Yes. We deliver to Garibaldi Highlands, Downtown Squamish, Valleycliffe, and Brackendale every Thursday.' },
      { q: 'What day do you deliver water in Squamish?', a: 'We deliver to Squamish every Thursday. Order by Wednesday evening to be on the next run.' },
    ],
  },
  'whistler': {
    name: 'Whistler',
    districts: ['Whistler Village', 'Creekside', 'Function Junction', 'Alpine Meadows'],
    schedule: 'Thursdays',
    description: 'Water delivery in Whistler. Premium 5-gallon water jugs for homes, hotels, and businesses in Whistler Village and surrounding areas.',
    why: 'Whistler hotels, chalets, and businesses rely on consistent supply. TajWater delivers 5-gallon spring and alkaline water to Whistler Village, Creekside, and Function Junction every Thursday — reliable, affordable, and on schedule year-round.',
    faq: [
      { q: 'How much does water delivery cost in Whistler?', a: 'Water delivery to Whistler starts at $8.99 per 5-gallon jug. We also offer commercial account pricing for hotels and businesses needing 10+ jugs.' },
      { q: 'Do you deliver water to hotels and businesses in Whistler?', a: 'Yes. We offer commercial water delivery accounts for Whistler businesses including hotels, restaurants, and offices.' },
      { q: 'What day do you deliver water in Whistler?', a: 'We deliver to Whistler every Thursday, same as Squamish — it\'s a combined Sea-to-Sky run.' },
    ],
  },
  'cloverdale': {
    name: 'Cloverdale',
    districts: ['Cloverdale Town Centre', 'Clayton', 'Clayton Heights', 'Hillcrest'],
    schedule: 'Mon, Wed, Fri',
    description: 'Water jug delivery in Cloverdale, Surrey. 5-gallon spring, alkaline, and distilled water delivered to Clayton, Clayton Heights, and Cloverdale Town Centre.',
    why: 'Cloverdale and Clayton Heights are among Surrey\'s fastest-growing residential areas. TajWater delivers three times a week to all Cloverdale neighbourhoods at the same competitive rates as central Vancouver.',
    faq: [
      { q: 'How much does water delivery cost in Cloverdale?', a: 'Water delivery in Cloverdale starts at $8.99 per 5-gallon jug with free delivery.' },
      { q: 'Do you deliver water to Clayton Heights?', a: 'Yes. Clayton, Clayton Heights, Cloverdale Town Centre, and Hillcrest are all covered.' },
      { q: 'What days do you deliver in Cloverdale?', a: 'We deliver to Cloverdale on Mondays, Wednesdays, and Fridays.' },
    ],
  },
  'langley-township': {
    name: 'Langley Township',
    districts: ['Willoughby', 'Walnut Grove', 'Brookswood', 'Murrayville', 'Fort Langley', 'Aldergrove'],
    schedule: 'Tue, Thu, Sat',
    description: 'Water delivery across Langley Township. Serving Willoughby, Walnut Grove, Brookswood, Fort Langley, Aldergrove, and Murrayville with fresh 5-gallon jugs.',
    why: 'Langley Township is one of BC\'s largest municipalities by area, and water delivery coverage is inconsistent. TajWater covers the full township — from Willoughby\'s new neighbourhoods to historic Fort Langley and rural Aldergrove — three times a week.',
    faq: [
      { q: 'How much does water delivery cost in Langley Township?', a: 'Water delivery in Langley Township starts at $8.99 per 5-gallon jug with free delivery.' },
      { q: 'Do you deliver water to Aldergrove and Fort Langley?', a: 'Yes. Aldergrove, Fort Langley, Willoughby, Walnut Grove, Brookswood, and Murrayville are all covered.' },
      { q: 'What days do you deliver in Langley Township?', a: 'We deliver to Langley Township on Tuesdays, Thursdays, and Saturdays.' },
    ],
  },
  'mary-hill': {
    name: 'Mary Hill',
    districts: ['Mary Hill', 'Citadel Heights', 'Riverwood', 'Prairie'],
    schedule: 'Tue, Thu, Sat',
    description: 'Water delivery to Mary Hill in Port Coquitlam. Fresh 5-gallon water jugs delivered to Mary Hill, Citadel Heights, and surrounding neighbourhoods.',
    why: 'Mary Hill is minutes from TajWater\'s Port Coquitlam warehouse. Residents here receive our fastest delivery and most flexible scheduling — same-day service is frequently available.',
    faq: [
      { q: 'How much does water delivery cost in Mary Hill?', a: 'Water delivery in Mary Hill (Port Coquitlam) starts at $8.99 per 5-gallon jug with free delivery.' },
      { q: 'What areas do you cover in Mary Hill?', a: 'We cover Mary Hill, Citadel Heights, Riverwood, and Prairie in the Port Coquitlam area.' },
      { q: 'What days do you deliver in Mary Hill?', a: 'We deliver to Mary Hill on Tuesdays, Thursdays, and Saturdays.' },
    ],
  },
  'tsawwassen': {
    name: 'Tsawwassen',
    districts: ['Tsawwassen Heights', 'English Bluff', 'Pebble Hill', 'Beach Grove', 'Boundary Bay'],
    schedule: 'Mon, Wed, Fri',
    description: 'Water delivery in Tsawwassen, Delta. 5-gallon spring and alkaline water jugs delivered to Tsawwassen Heights, Beach Grove, Boundary Bay, and all Tsawwassen areas.',
    why: 'Tsawwassen\'s peninsula geography means fewer delivery services reach this area. TajWater covers the full Tsawwassen area three times a week — Heights, English Bluff, Beach Grove, and Boundary Bay included.',
    faq: [
      { q: 'How much does water delivery cost in Tsawwassen?', a: 'Water delivery in Tsawwassen starts at $8.99 per 5-gallon jug with free delivery — same as all Metro Vancouver zones.' },
      { q: 'Do you deliver water to Beach Grove and Boundary Bay?', a: 'Yes. Beach Grove, Boundary Bay, Tsawwassen Heights, English Bluff, and Pebble Hill are all covered.' },
      { q: 'What days do you deliver in Tsawwassen?', a: 'We deliver to Tsawwassen on Mondays, Wednesdays, and Fridays.' },
    ],
  },
  'walnut-grove': {
    name: 'Walnut Grove',
    districts: ['Walnut Grove Town Centre', 'Walnut Grove North', 'Walnut Grove South', 'Topham Park'],
    schedule: 'Tue, Thu, Sat',
    description: 'Water jug delivery in Walnut Grove, Langley Township. Fresh 5-gallon spring and alkaline water delivered to your door.',
    why: 'Walnut Grove is a family-oriented community in Langley Township where clean drinking water is a priority. TajWater delivers spring, alkaline, and distilled water jugs to all Walnut Grove neighbourhoods three times a week.',
    faq: [
      { q: 'How much does water delivery cost in Walnut Grove?', a: 'Water delivery in Walnut Grove starts at $8.99 per 5-gallon jug with free delivery.' },
      { q: 'What areas of Walnut Grove do you cover?', a: 'We cover Walnut Grove Town Centre, Walnut Grove North, Walnut Grove South, and Topham Park.' },
      { q: 'What days do you deliver in Walnut Grove?', a: 'We deliver to Walnut Grove on Tuesdays, Thursdays, and Saturdays.' },
    ],
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

  // Hardcoded featured products to ensure 100% static stability without DB hits at runtime
  const products = [
    { id: 'spring-5g', name: '5 Gallon Spring Water', price: 8.99, category: 'water' },
    { id: 'alkaline-5g', name: '5 Gallon Alkaline Water', price: 12.99, category: 'water' },
    { id: 'distilled-5g', name: '5 Gallon Distilled Water', price: 9.99, category: 'water' },
  ]

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

        {/* Pricing */}
        <section className="py-20 bg-[#f0f9ff]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0c2340] text-center mb-4">
              Water Delivery Prices in {data.name}
            </h2>
            <p className="text-[#4a7fa5] text-center mb-8 max-w-xl mx-auto">
              Free delivery on every order. No contracts. Cancel or pause anytime.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-[#cce7f0] bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#e0f7fa]">
                    <th scope="col" className="text-left px-5 py-3 font-bold text-[#0c2340]">Water Type</th>
                    <th scope="col" className="text-left px-5 py-3 font-bold text-[#0c2340]">Size</th>
                    <th scope="col" className="text-left px-5 py-3 font-bold text-[#0c2340]">Price</th>
                    <th scope="col" className="text-left px-5 py-3 font-bold text-[#0c2340]">Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: 'Spring Water', size: '5 gallon (20L)', price: '$8.99/jug', delivery: 'Free' },
                    { type: 'Alkaline Water', size: '5 gallon (20L)', price: '$12.99/jug', delivery: 'Free' },
                    { type: 'Distilled Water', size: '5 gallon (20L)', price: '$9.99/jug', delivery: 'Free' },
                    { type: 'Subscription (any type)', size: '5 gallon (20L)', price: 'From $6.49/jug', delivery: 'Free + priority' },
                  ].map((row, i) => (
                    <tr key={row.type} className={i < 3 ? 'border-b border-[#cce7f0]' : ''}>
                      <td className="px-5 py-3 font-medium text-[#0c2340]">{row.type}</td>
                      <td className="px-5 py-3 text-[#4a7fa5]">{row.size}</td>
                      <td className="px-5 py-3 font-semibold text-[#0097a7]">{row.price}</td>
                      <td className="px-5 py-3 text-[#4a7fa5]">{row.delivery}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#4a7fa5] mt-4 text-center">
              A one-time $12 bottle deposit per jug applies on your first order. Refunded when you stop service.
            </p>
          </div>
        </section>

        {/* Why TajWater in this city */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0c2340] mb-6">
              Why Choose TajWater for Water Delivery in {data.name}?
            </h2>
            <p className="text-[#4a7fa5] text-base leading-relaxed mb-8">
              {data.why}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Free delivery', detail: 'On every order, every time' },
                { label: 'No contracts', detail: 'Order once or subscribe — your choice' },
                { label: 'BPA-free jugs', detail: 'Food-grade polycarbonate, sanitized before each fill' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 bg-[#f0f9ff] rounded-xl p-4 border border-[#cce7f0]">
                  <CheckCircle2 className="w-5 h-5 text-[#0097a7] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#0c2340] text-sm">{item.label}</p>
                    <p className="text-xs text-[#4a7fa5]">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* City FAQ */}
        <section className="py-20 bg-[#f0f9ff]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0c2340] text-center mb-10">
              Water Delivery {data.name} — Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {data.faq.map((item) => (
                <div key={item.q} className="bg-white rounded-2xl border border-[#cce7f0] p-6">
                  <h3 className="font-bold text-[#0c2340] mb-2">{item.q}</h3>
                  <p className="text-[#4a7fa5] text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Back to areas */}
        <section className="py-12 bg-white border-t border-[#cce7f0]">
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

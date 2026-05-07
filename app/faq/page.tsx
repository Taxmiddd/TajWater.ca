import { Metadata } from 'next'
import Link from 'next/link'
import { HelpCircle, Phone, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Water Delivery FAQ — Metro Vancouver | TajWater',
  description: 'Answers to the most common questions about water delivery in Metro Vancouver. Pricing, same-day delivery, subscriptions, CPAP water, areas served, jug swaps, and more.',
  keywords: [
    'water delivery FAQ Vancouver',
    'water delivery questions Metro Vancouver',
    'how does water delivery work Vancouver',
    'water delivery pricing FAQ',
    'CPAP water delivery FAQ',
    'water jug subscription FAQ',
    'TajWater FAQ',
  ],
  alternates: { canonical: 'https://tajwater.ca/faq' },
  openGraph: {
    title: 'Water Delivery FAQ — Metro Vancouver | TajWater',
    description: 'Answers to the most common questions about water delivery in Metro Vancouver. Pricing, same-day delivery, subscriptions, CPAP water, and more.',
    url: 'https://tajwater.ca/faq',
    type: 'website',
    images: [{ url: 'https://tajwater.ca/opengraph-image', width: 1200, height: 630 }],
  },
}

const faqSections = [
  {
    title: 'Ordering & Delivery',
    faqs: [
      {
        q: 'How do I order water delivery in Metro Vancouver?',
        a: 'You can order through our online shop at tajwater.ca/shop, by calling 778-504-7880, or by emailing info@tajwater.ca. For recurring deliveries, you can set up a weekly or bi-weekly subscription. Orders placed before 12pm are eligible for same-day delivery.'
      },
      {
        q: 'Do you offer same-day water delivery?',
        a: 'Yes. Orders placed before 12pm (noon) are eligible for same-day delivery across most Metro Vancouver cities including Vancouver, Burnaby, Richmond, Surrey, Coquitlam, Port Coquitlam, North Vancouver, and West Vancouver. Contact us if you have an urgent same-day need.'
      },
      {
        q: 'Is delivery free?',
        a: 'Yes, delivery is always free on every order — no minimum order required. There is no delivery fee, no fuel surcharge, and no service fee. What you see on the price list is what you pay.'
      },
      {
        q: 'What areas do you deliver to?',
        a: 'TajWater delivers to 21 cities across Metro Vancouver and the Sea-to-Sky corridor: Vancouver, Burnaby, Richmond, Surrey, Coquitlam, Port Coquitlam, Port Moody, North Vancouver, West Vancouver, Langley, Langley Township, Delta, White Rock, Cloverdale, Tsawwassen, Walnut Grove, Maple Ridge, Pitt Meadows, Mary Hill, Squamish, and Whistler.'
      },
      {
        q: 'How do jug swaps work?',
        a: 'On each delivery, our driver brings your fresh jugs and collects your empty ones. Simply leave your empty jugs outside your door (or in the designated spot) before your scheduled delivery window. No need to be home. We wash and sanitize all returned jugs before refilling.'
      },
      {
        q: 'Do I need to be home for delivery?',
        a: 'No. Most of our customers are not home during delivery. Just tell us where to leave your jugs (front door, garage, building lobby, etc.) when you place your order. We will leave fresh jugs and collect empties from the same spot.'
      },
    ]
  },
  {
    title: 'Pricing & Subscriptions',
    faqs: [
      {
        q: 'How much does water delivery cost?',
        a: 'Taj Water pricing is: Spring Water — $8.99/jug one-time. Alkaline Water — $10.99/jug one-time. Distilled Water — $9.99/jug one-time. Subscription plans start at $29.99/week or $59.99/month. All prices include free delivery and are in CAD.'
      },
      {
        q: 'Are there any contracts or minimum commitments?',
        a: 'No. There is no contract, no minimum order, and no cancellation fee. Subscriptions can be cancelled, paused, or changed at any time with no penalty. We believe in earning your business every delivery.'
      },
      {
        q: 'How do subscriptions work?',
        a: 'Choose weekly ($29.99/week) or monthly ($59.99/month) delivery. Your jugs arrive on a fixed schedule. You can pause deliveries when you go on vacation, change your schedule, or cancel anytime with no penalty.'
      },
      {
        q: 'Is there a minimum order quantity?',
        a: 'No. You can order as few as one jug. There is no minimum quantity for one-time orders or subscriptions. Most households order 2–4 jugs per delivery.'
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, Mastercard, Amex), e-transfer, and cash on delivery. Commercial accounts with net-30 invoicing are available for businesses — contact us for details.'
      },
    ]
  },
  {
    title: 'Water Types',
    faqs: [
      {
        q: 'What types of water do you deliver?',
        a: 'Taj Water delivers three types of water: (1) Natural Spring Water — sourced from a natural underground spring, naturally pH balanced, with natural minerals intact. $8.99/jug. (2) Alkaline Water — pH balanced alkaline water with trace electrolytes. $10.99/jug. (3) Distilled Water — 100% pure H₂O, all minerals removed, ideal for CPAP machines and appliances. $9.99/jug.'
      },
      {
        q: 'What is the difference between spring, alkaline, and distilled water?',
        a: 'Spring water is natural water from an underground source with minerals intact — the most popular choice for everyday drinking. Alkaline water is pH balanced with trace electrolytes, preferred by health-conscious and active individuals. Distilled water has all minerals removed and is used for CPAP machines, baby formula, humidifiers, and appliances that require pure H₂O.'
      },
      {
        q: 'Which water type is best for drinking?',
        a: 'All three types are safe for drinking. For most families, spring water ($8.99/jug) is the best everyday choice because of its natural taste and mineral content. Active individuals who prefer a smoother taste often choose alkaline water. Distilled water is the right choice for specific uses like CPAP or baby formula — it is safe to drink but tastes very flat.'
      },
      {
        q: 'Which water is best for CPAP machines?',
        a: 'Distilled water is the only recommended water for CPAP humidifier chambers. All major CPAP brands specify distilled water to prevent mineral scale buildup and bacterial growth. Taj Water distilled water is $9.99/jug one-time, or from $29.99/week on a subscription — ideal for CPAP users.'
      },
      {
        q: 'Which water is safe for baby formula?',
        a: 'Distilled water is the safest choice for mixing infant formula, as it contains no fluoride, chlorine, or dissolved minerals that could alter formula\'s nutritional balance. Health Canada recommends purified or distilled water for infant formula, particularly when local water quality is uncertain. Spring water is also commonly used for infants over 6 months. Alkaline water is not recommended under 12 months.'
      },
      {
        q: 'Is alkaline water actually better for you?',
        a: 'Many customers report that alkaline water tastes smoother and that they drink more water because of it — which is a real benefit. Taj Water does not make medical claims, but many of our customers love alkaline water and have been ordering it for years.'
      },
    ]
  },
  {
    title: 'Jugs & Equipment',
    faqs: [
      {
        q: 'What size are the water jugs?',
        a: 'TajWater delivers in 5-gallon (18.9 litre) jugs — the standard size for home and office water dispensers across North America. This is the most economical size for households and businesses.'
      },
      {
        q: 'Are the jugs BPA-free?',
        a: 'Yes. All Taj Water jugs are made from BPA-free polycarbonate. The jugs are designed for reuse and are rigorously sanitized between uses.'
      },
      {
        q: 'Do I need to own a water dispenser?',
        a: 'You need some way to dispense the water — either a freestanding or countertop water cooler/dispenser, or a manual pump. TajWater does not currently sell or rent dispensers, but we can recommend compatible models. Most customers use a standard countertop or floor dispenser that accepts 5-gallon jugs.'
      },
      {
        q: 'What if I have too many empty jugs?',
        a: 'We collect all empty jugs on every delivery at no charge. If you have extras that have built up, contact us and we will schedule a pickup. We wash, sanitize, and reuse every jug — it is part of how we keep prices low and reduce plastic waste.'
      },
    ]
  },
  {
    title: 'About TajWater',
    faqs: [
      {
        q: 'Where is TajWater located?',
        a: 'TajWater is based in Port Coquitlam, BC at 1770 McLean Ave Unit 7, Port Coquitlam, BC V3C 4K8. We are a locally-owned Metro Vancouver business, not a national franchise. Our delivery routes cover all of Metro Vancouver and the Sea-to-Sky corridor.'
      },
      {
        q: 'How long has TajWater been operating?',
        a: 'TajWater has been serving Metro Vancouver families and businesses for over 5 years. We started as a small local delivery service and have grown to serve thousands of households across 21 cities while remaining family-owned and locally operated.'
      },
      {
        q: 'Is Taj Water water tested and certified?',
        a: 'Yes. Every batch is tested for purity and mineral content before delivery. Our facility follows all BC Environmental regulations for water bottling and distribution.'
      },
      {
        q: 'Do you offer commercial water delivery for businesses?',
        a: 'Yes. Taj Water serves offices, restaurants, gyms, hotels, medical facilities, and industrial businesses across Metro Vancouver. Commercial accounts receive net-30 invoicing, dedicated account management, and priority scheduling. Contact us at info@tajwater.ca for a commercial quote.'
      },
    ]
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqSections.flatMap((section) =>
    section.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    }))
  ),
}

export default function FAQPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="min-h-screen bg-[#f0f9ff]">

        {/* Hero */}
        <section className="hero-gradient py-20 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
              Water Delivery FAQ<br /><span className="text-[#b3e5fc]">Metro Vancouver</span>
            </h1>
            <p className="text-[#b3e5fc] text-lg max-w-2xl mx-auto">
              Everything you need to know about TajWater's water delivery service in Metro Vancouver.
              Can't find what you're looking for? Call us at 778-504-7880.
            </p>
          </div>
        </section>

        {/* FAQ content */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

            {faqSections.map((section) => (
              <div key={section.title} className="mb-16">
                <h2 className="text-2xl font-extrabold text-[#0c2340] mb-8 pb-3 border-b-2 border-[#cce7f0]">
                  {section.title}
                </h2>
                <div className="space-y-5">
                  {section.faqs.map((faq) => (
                    <div key={faq.q} className="bg-white rounded-2xl border border-[#cce7f0] p-6 shadow-sm">
                      <h3 className="text-[#0c2340] font-bold text-lg mb-3">{faq.q}</h3>
                      <p className="text-[#4a7fa5] leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Contact block */}
            <div className="bg-gradient-to-r from-[#0097a7] to-[#006064] rounded-3xl p-8 sm:p-12 text-center text-white">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Still have questions?</h2>
              <p className="text-[#b3e5fc] text-lg mb-8">
                Our Port Coquitlam team is available 7 days a week to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+17785047880"
                  className="flex items-center justify-center gap-2 bg-white text-[#0097a7] font-bold px-6 py-3 rounded-xl hover:bg-[#f0f9ff] transition-colors"
                >
                  <Phone className="w-4 h-4" /> 778-504-7880
                </a>
                <a
                  href="mailto:info@tajwater.ca"
                  className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  <Mail className="w-4 h-4" /> info@tajwater.ca
                </a>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  Contact Form
                </Link>
              </div>
            </div>

          </div>
        </section>

      </main>
    </>
  )
}

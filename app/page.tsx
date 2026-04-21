import Hero from '@/components/home/Hero'
import ProductShowcase from '@/components/home/ProductShowcase'
import HowItWorks from '@/components/home/HowItWorks'
import ServicesOverview from '@/components/home/ServicesOverview'
import DeliveryChecker from '@/components/home/DeliveryChecker'
import TrustSignals from '@/components/home/TrustSignals'
import Testimonials from '@/components/home/Testimonials'
import Newsletter from '@/components/home/Newsletter'
import FAQ from '@/components/home/FAQ'

import { createServerClient } from '@/lib/supabase'

export default async function HomePage() {
  const { data } = await createServerClient()
    .from('services')
    .select('title')
    .eq('active', true)
    .order('sort_order')
    .limit(3)
  
  const services = (data || [])
    .map(s => s.title)
    .filter(title => !title.toLowerCase().includes('ice'))

  const description = services.length > 0
    ? (services.length > 1 
        ? `${services.slice(0, -1).join(', ')}, and ${services[services.length - 1]}`
        : services[0]) + ' Across Metro Vancouver. Affordable and Competitive 5-Gallon Water Delivery — Fresh, Clean, and on Time.'
    : 'Affordable and Competitive 5-Gallon Water Delivery, Filter Installation, and Commercial Supply Across Metro Vancouver. Your #1 Drinking Water Supplier.'

  return (
    <>
      <Hero description={description} />
      <ProductShowcase />
      <HowItWorks />
      <TrustSignals />
      <ServicesOverview />
      <DeliveryChecker />
      <Testimonials />
      <FAQ />
      <Newsletter />
    </>
  )
}

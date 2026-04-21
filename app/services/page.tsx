import { createServerClient } from '@/lib/supabase'
import ServicesContent from './ServicesContent'

export const revalidate = 3600 // revalidate every hour

async function getServices() {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('sort_order')
  
  if (error) {
    console.error('Error fetching services:', error)
    return []
  }
  return data || []
}

export default async function ServicesPage() {
  const services = await getServices()

  return <ServicesContent initialServices={services} />
}

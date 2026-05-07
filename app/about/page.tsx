import { createServerClient } from '@/lib/supabase'
import AboutClient from './AboutClient'

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

  return <AboutClient team={team} mission={mission} vision={vision} heroSubtitle={heroSubtitle} />
}

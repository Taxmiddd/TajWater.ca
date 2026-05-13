import PlanSetupClient from './PlanSetupClient'

export const dynamic = 'force-dynamic'

export default async function PlanSetupPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  return <PlanSetupClient token={token} />
}

import { api } from '~/lib/trpc'
import { PageLayoutFluid } from '../../shared.component'
import { MapWork } from './client.component'

export default async function DashboardPage() {
  const workplaces = await api.user.workplace.list()

  return (
    <PageLayoutFluid>
      <MapWork locations={workplaces} />
    </PageLayoutFluid>
  )
}

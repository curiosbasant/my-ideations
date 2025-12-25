import { SubmitButton } from '~/app/client.component'
import { PageLayoutFixed, PageLayoutFluid } from '~/components/layout'
import { getDepartments, getProfileDetails } from '~/features/user/dal'
import { api } from '~/lib/trpc'
import { handleDesignationUpdate } from './client.action'
import { DepartmentDesignation, MapWorkPlaces } from './client.component'

export default async function DashboardPage() {
  const profile = await getProfileDetails()

  if (profile?.designation?.departmentId && profile.designation?.name) {
    const workplaces = await api.priyasthan.workplace.list()

    return (
      <PageLayoutFluid>
        <MapWorkPlaces locations={workplaces} />
      </PageLayoutFluid>
    )
  }

  return (
    <PageLayoutFixed>
      <form className='mx-auto grid max-w-sm gap-8' action={handleDesignationUpdate}>
        <DepartmentDesignation departments={getDepartments()} />
        <div className='col-span-full justify-self-end'>
          <SubmitButton>Save</SubmitButton>
        </div>
      </form>
    </PageLayoutFixed>
  )
}

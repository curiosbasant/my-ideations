import { SubmitButton } from '~/app/client.component'
import { PageLayoutFixed, PageLayoutFluid } from '~/components/layout'
import { getDepartments, getProfileDetails } from '~/features/user/dal'
import { handleDesignationUpdate } from './client.action'
import { DepartmentDesignation } from './client.component'

export default async function DashboardPage() {
  const profile = await getProfileDetails()

  if (profile?.designation?.departmentId && profile.designation?.name) {
    return (
      <PageLayoutFluid>
        Here you would be able to see and manage your workplace locations on the map.
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

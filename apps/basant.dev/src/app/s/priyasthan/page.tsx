import { redirect } from 'next/navigation'

import { PageLayoutFixed, PageLayoutFluid } from '~/components/layout'
import { DepartmentDesignationForm } from '~/features/priyasthan/components/form-department-designation'
import { WorkplacesMap } from '~/features/priyasthan/components/workplaces-map'
import { getWorkplaces } from '~/features/priyasthan/dal'
import { SIGN_IN_PATH } from '~/features/shared/constants'
import { getDepartments, getProfileDetails } from '~/features/user/dal'

export default async function PriyasthanHomePage() {
  const profile = await getProfileDetails()
  if (!profile) redirect(SIGN_IN_PATH)

  if (profile.designation?.departmentId && profile.designation.name) {
    const workplaces = await getWorkplaces()

    return (
      <PageLayoutFluid>
        <WorkplacesMap userProfileId={profile.id} locations={workplaces} />
      </PageLayoutFluid>
    )
  }

  return (
    <PageLayoutFixed>
      <DepartmentDesignationForm departmentsPromise={getDepartments()} />
    </PageLayoutFixed>
  )
}

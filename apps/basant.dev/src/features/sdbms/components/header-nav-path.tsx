import { Suspense, type PropsWithChildren } from 'react'

import { Skeleton } from '~/components/ui/skeleton'
import { HeaderNavItem } from '~/features/shared/components/header-nav-item'
import { getProfileDetails } from '~/features/user/dal'

export function PathDocuments() {
  return (
    <PathSuspense>
      <PathDocumentsInner />
    </PathSuspense>
  )
}
async function PathDocumentsInner() {
  const profile = await getProfileDetails()
  return profile?.personId && <HeaderNavItem path='/documents'>My Documents</HeaderNavItem>
}

function PathSuspense(props: PropsWithChildren) {
  return <Suspense fallback={<Skeleton className='h-7 w-32' />}>{props.children}</Suspense>
}

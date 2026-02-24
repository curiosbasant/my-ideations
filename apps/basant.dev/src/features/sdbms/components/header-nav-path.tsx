import { Suspense, type PropsWithChildren } from 'react'

import { Skeleton } from '~/components/ui/skeleton'
import { getPersonId } from '~/features/person/dal'
import { HeaderNavItem } from '~/features/shared/components/header-nav-item'

export function PathDocuments() {
  return (
    <PathSuspense>
      <PathDocumentsInner />
    </PathSuspense>
  )
}
async function PathDocumentsInner() {
  const personId = await getPersonId()
  return personId && <HeaderNavItem path='/documents'>My Documents</HeaderNavItem>
}

function PathSuspense(props: PropsWithChildren) {
  return <Suspense fallback={<Skeleton className='h-7 w-32' />}>{props.children}</Suspense>
}

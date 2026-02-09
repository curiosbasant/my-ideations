'use client'

import type { PropsWithChildren } from 'react'

import { actionTeacherImportFile } from '~/features/sdbms/actions'
import { useAction } from '~/lib/utils/helper-action/client'

export function FormWrapper(props: PropsWithChildren) {
  const { state, actionTransition } = useAction({
    actionFn: actionTeacherImportFile,
  })

  return (
    <>
      <form
        className='grid gap-4'
        action={async (fd) => {
          const instituteId = +(fd.get('school') as string)
          const file = fd.get('file') as File

          actionTransition({ instituteId, file })
        }}>
        {props.children}
      </form>
      {state?.success && <p className='text-emerald-500'>Success!</p>}
      {state && !state.success && <p className='text-danger'>{state.message}</p>}
    </>
  )
}

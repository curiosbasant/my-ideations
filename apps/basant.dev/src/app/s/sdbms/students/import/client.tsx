'use client'

import type { PropsWithChildren } from 'react'

import { toast } from '~/components/ui/sonner'
import { actionStudentImportFile } from '~/features/sdbms/actions'
import { useAction } from '~/lib/utils/helper-action/client'

export function FormWrapper(props: PropsWithChildren) {
  const { state, actionTransition } = useAction({
    actionFn: actionStudentImportFile,
    onSuccess: () => {
      toast.success('Students imported successfully')
    },
  })

  return (
    <>
      <form
        className='grid gap-4'
        action={async (fd) => {
          const sessionId = +(fd.get('session') as string)
          const file = fd.get('file') as File

          actionTransition({ sessionId, file })
        }}>
        {props.children}
      </form>
      {state?.success && <p className='text-emerald-500'>Success!</p>}
      {state && !state.success && <p className='text-danger'>{state.message}</p>}
    </>
  )
}

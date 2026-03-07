'use client'

import type { PropsWithChildren } from 'react'

import { toast } from '~/components/ui/sonner'
import { actionStudentImportFile } from '~/features/sdbms/actions'
import { useDalMutation } from '~/lib/dal/use-action'

export function FormWrapper(props: PropsWithChildren) {
  const { success, errorMessage, action } = useDalMutation(actionStudentImportFile, {
    onSuccess: () => {
      toast.success('Students imported successfully')
    },
  })

  return (
    <>
      <form
        className='grid gap-4'
        action={async (fd) => {
          const sessionId = fd.get('session') as string
          const file = fd.get('file') as File

          action({ sessionId, file })
        }}>
        {props.children}
      </form>
      {success && <p className='text-emerald-500'>Success!</p>}
      {errorMessage && <p className='text-danger'>{errorMessage}</p>}
    </>
  )
}

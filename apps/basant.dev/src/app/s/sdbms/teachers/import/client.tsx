'use client'

import type { PropsWithChildren } from 'react'

import { toast } from '~/components/ui/sonner'
import { actionTeacherImportFile } from '~/features/sdbms/actions'
import { useDalMutation } from '~/lib/dal/use-action'

export function FormWrapper(props: PropsWithChildren) {
  const { success, errorMessage, action } = useDalMutation(actionTeacherImportFile, {
    onSuccess: () => {
      toast.success('Teachers imported successfully')
    },
  })

  return (
    <>
      <form
        className='grid gap-4'
        action={async (fd) => {
          const instituteId = +(fd.get('school') as string)
          const file = fd.get('file') as File
          action({ instituteId, file })
        }}>
        {props.children}
      </form>
      {success && <p className='text-emerald-500'>Success!</p>}
      {errorMessage && <p className='text-danger'>{errorMessage}</p>}
    </>
  )
}

'use client'

import type { ComponentProps, PropsWithChildren } from 'react'

import { actionConnectStudent, actionCreateTeacher } from '~/features/sdbms/actions'
import { useAction } from '~/lib/utils/helper-action/client'

type FormProps = Omit<ComponentProps<'form'>, 'action'>

export function FormConnectTeacher(props: FormProps) {
  const { state, actionTransition } = useAction({ actionFn: actionCreateTeacher })

  return (
    <form
      {...props}
      action={(fd) => {
        const instituteId = +(fd.get('school') as string)
        const firstName = fd.get('firstName') as string
        const lastName = (fd.get('lastName') as string) || null
        const gender = +(fd.get('gender') as string)
        actionTransition({ instituteId, firstName, lastName, gender })
      }}>
      {props.children}
      {state && !state.success && <p className='text-destructive'>There is some problem!</p>}
    </form>
  )
}

export function FormConnectStudent(props: FormProps) {
  const { state, actionTransition } = useAction({ actionFn: actionConnectStudent })

  return (
    <form
      {...props}
      action={(fd) => {
        const srNo = fd.get('srNo') as string
        const dob = fd.get('dob') as string
        actionTransition({ srNo, dob })
      }}>
      {props.children}
      {state && !state.success && <p className='text-destructive'>No Match Found!</p>}
    </form>
  )
}

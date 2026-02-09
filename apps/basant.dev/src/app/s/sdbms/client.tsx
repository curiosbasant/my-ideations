'use client'

import type { ComponentProps } from 'react'

import { actionConnectStudent, actionConnectTeacher } from '~/features/sdbms/actions'
import { useAction } from '~/lib/utils/helper-action/client'

type FormProps = Omit<ComponentProps<'form'>, 'action'>

export function FormConnectTeacher(props: FormProps) {
  const { state, actionTransition } = useAction({ actionFn: actionConnectTeacher })

  return (
    <form
      {...props}
      action={(fd) => {
        const employeeId = fd.get('employeeId') as string
        const dob = fd.get('dob') as string
        actionTransition({ employeeId, dob })
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

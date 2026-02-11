'use client'

import type { ComponentProps } from 'react'

import { toast } from '~/components/ui/sonner'
import { actionConnectStudent, actionConnectTeacher } from '~/features/sdbms/actions'
import { useAction } from '~/lib/utils/helper-action/client'

type FormProps = Omit<ComponentProps<'form'>, 'action'>

export function FormConnectTeacher(props: FormProps) {
  const { state, actionTransition } = useAction({
    actionFn: actionConnectTeacher,
    onSuccess: () => {
      toast.success('Teacher connected successfully')
    },
  })

  return (
    <form
      {...props}
      onSubmit={() => {
        toast.success('Teacher connected successfully')
      }}
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
  const { state, actionTransition } = useAction({
    actionFn: actionConnectStudent,
    onSuccess: () => {
      toast.success('Student connected successfully')
    },
  })

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

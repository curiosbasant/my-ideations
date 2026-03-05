'use client'

import type { ComponentProps } from 'react'

import { toast } from '~/components/ui/sonner'
import { actionConnectStudent, actionConnectTeacher } from '~/features/sdbms/actions'
import { useDalMutation } from '~/lib/dal/use-action'

type FormProps = Omit<ComponentProps<'form'>, 'action'>

export function FormConnectTeacher(props: FormProps) {
  const { errorMessage, action } = useDalMutation(actionConnectTeacher, {
    onSuccess: () => {
      toast.success("You're now a teacher")
    },
  })

  return (
    <form
      {...props}
      action={(fd) => {
        const employeeId = fd.get('employeeId') as string
        const dob = fd.get('dob') as string
        action({ employeeId, dob })
      }}>
      {props.children}
      {errorMessage && <p className='text-destructive'>{errorMessage}</p>}
    </form>
  )
}

export function FormConnectStudent(props: FormProps) {
  const { errorMessage, action } = useDalMutation(actionConnectStudent, {
    onSuccess: () => {
      toast.success("You're now a student")
    },
  })

  return (
    <form
      {...props}
      action={(fd) => {
        const srNo = fd.get('srNo') as string
        const dob = fd.get('dob') as string
        action({ srNo, dob })
      }}>
      {props.children}
      {errorMessage && <p className='text-destructive'>{errorMessage}</p>}
    </form>
  )
}

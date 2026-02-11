'use client'

import type { ComponentProps } from 'react'

import { Input } from '~/components/ui/input'
import { actionSetStudentClassMark } from '~/features/sdbms/actions'
import { cn } from '~/lib/utils'
import { useAction } from '~/lib/utils/helper-action/client'

export function MarkInput({
  classStudentId,
  ...props
}: ComponentProps<'input'> & { classStudentId: number }) {
  const { state, isPending, actionTransition } = useAction({
    actionFn: actionSetStudentClassMark,
  })
  return (
    <Input
      {...props}
      className={cn(
        props.className,
        isPending ? 'animate-pulse' : (
          state && (state.success ? 'border-emerald-500' : 'border-destructive')
        ),
      )}
      autoComplete='off'
      autoCorrect='off'
      inputMode='numeric'
      onBlur={(ev) => {
        const mark = Number(ev.currentTarget.value)
        if (ev.currentTarget.value === '' || isNaN(mark)) return

        const searchParams = new URLSearchParams(window.location.search)
        const exam = searchParams.get('exam')
        const subject = searchParams.get('subject')

        if (exam && subject) {
          actionTransition({
            exam: +exam,
            subject: +subject,
            classStudentId,
            mark,
          })
        }
      }}
    />
  )
}

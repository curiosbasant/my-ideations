'use client'

import { Suspense, use, useActionState, type PropsWithChildren } from 'react'

import { Query } from '@my/core/trpc/query'

import { DropdownMenuItem } from '~/components/ui/dropdown-menu'
import { FieldSet } from '~/components/ui/field'
import { FormSelect } from '~/components/ui/form'
import { ModalContext } from '~/components/ui/modal'
import { SelectItem } from '~/components/ui/select'
import { toast } from '~/components/ui/sonner'

export function FormFeedbackWrapper(
  props: PropsWithChildren<{ action: (fd: FormData) => Promise<void> }>,
) {
  const isInModal = use(ModalContext)
  const [, action, pending] = useActionState(
    async (_: void, fd: FormData) => {
      if (isInModal) {
        const page = sessionStorage.getItem('feedback-page')
        page && fd.set('page', page)
      }

      await props.action(fd)

      toast.success('Sent Successfully', {
        description: 'We have received your feedback. Thanks!',
      })
      if (isInModal) {
        window.history.back()
        sessionStorage.removeItem('feedback-page')
      }
    },
    void 0,
  )

  return (
    <form className='max-w-lg' action={action}>
      <FieldSet disabled={pending}>{props.children}</FieldSet>
    </form>
  )
}

export function SelectFeedbackType() {
  return (
    <Suspense fallback={<FormSelect placeholder='Loading...' />}>
      <FormSelect name='type' placeholder='- - / - -' fieldId='type' required>
        <Query options={(api) => api.feedback.type.list.queryOptions()}>
          {(feedbackTypes) =>
            feedbackTypes.map((type) => (
              <SelectItem value={type.id.toString()} key={type.id}>
                {type.name}
              </SelectItem>
            ))
          }
        </Query>
      </FormSelect>
    </Suspense>
  )
}

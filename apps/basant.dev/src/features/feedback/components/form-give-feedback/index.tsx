import { FormSubmitButton } from '~/components/forms/client'
import { FormControl } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { dalDbOperation, dalVerifySuccess } from '~/lib/dal/helpers'
import { api } from '~/lib/trpc'
import { FormFeedbackWrapper, SelectFeedbackType } from './client'

export function FormGiveFeedback() {
  return (
    <FormFeedbackWrapper
      action={async (fd: FormData) => {
        'use server'
        const title = fd.get('title') as string
        const content = fd.get('content') as string
        const page = fd.get('page') as string
        const type = fd.get('type') as string
        const rating = fd.get('rating') as string

        const payload = {
          title,
          content,
          type,
          page,
          rating: parseInt(rating),
        }
        await dalVerifySuccess(dalDbOperation(() => api.feedback.create(payload)))
      }}>
      <FormControl fieldId='title' label='Title'>
        <Input name='title' required />
      </FormControl>
      <FormControl fieldId='content' label='Your Feedback'>
        <Textarea name='content' required />
      </FormControl>
      <FormControl fieldId='type' label='Feedback Type'>
        <SelectFeedbackType />
      </FormControl>
      <FormControl label='Rate Your Experience'>
        <ol className='flex items-center gap-2'>
          <RateItem value={1} />
          <RateItem value={2} />
          <RateItem value={3} />
          <RateItem value={4} />
          <RateItem value={5} />
        </ol>
      </FormControl>
      <div className='flex justify-end'>
        <FormSubmitButton>Submit</FormSubmitButton>
      </div>
    </FormFeedbackWrapper>
  )
}

function RateItem(props: { value: number }) {
  return (
    <li className=''>
      <label className='flex size-10 rounded-full border transition hover:bg-muted has-checked:border-none has-checked:bg-primary has-checked:text-primary-foreground has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring'>
        <input className='swoosh' name='rating' value={props.value} type='radio' />
        <span className='m-auto text-xl font-bold'>{props.value}</span>
      </label>
    </li>
  )
}

import type { Metadata } from 'next/types'

import { FormGiveFeedback } from '~/features/feedback/components/form-give-feedback'

export const metadata: Metadata = {
  title: 'Give Feedback',
}

export default function GiveFeedbackPage() {
  return (
    <div className='space-y-8 py-8'>
      <header className='space-y-2'>
        <h1 className='me-auto text-2xl font-bold'>We value your feedback</h1>
        <p className='text-muted-foreground text-sm'>
          Let us know how we're doing, so we can improve your experience.
        </p>
      </header>
      <FormGiveFeedback />
    </div>
  )
}

'use client'

import { FormSubmitButton } from '~/components/forms/client'
import { FormField } from '~/components/forms/shared'
import { Input } from '~/components/ui/input'
import { connectProfileAction } from '~/features/sdbms/actions'
import { useAction } from '~/lib/utils/helper-action/client'

export function ConnectProfileForm() {
  const { state, actionTransition } = useAction({ actionFn: connectProfileAction })

  return (
    <div className='@container mx-auto max-w-sm space-y-8'>
      <form
        action={(fd) => {
          const srNo = fd.get('srNo') as string
          const dob = fd.get('dob') as string
          actionTransition({ srNo, dob })
        }}
        className='@xl:grid-cols-3 grid gap-4'>
        <FormField label='SR Number'>
          <Input className='backdrop-blur-2xs' name='srNo' />
        </FormField>
        <FormField label='Date of Birth'>
          <Input className='backdrop-blur-2xs' name='dob' type='date' />
        </FormField>
        {state && !state.success && <p className='text-destructive'>No Match Found!</p>}
        <div className='col-span-full flex justify-end'>
          <FormSubmitButton>Submit</FormSubmitButton>
        </div>
      </form>
    </div>
  )
}

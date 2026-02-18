import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'

import { FormSubmitButton } from '~/components/forms/client'
import { FormField } from '~/components/forms/shared'
import { Input } from '~/components/ui/input'
import { FormFieldSelectInstitute } from '~/features/sdbms/components/form-fields'
import { checkIfAdmin } from '~/features/sdbms/dal'
import { FormWrapper } from './client'

export const metadata: Metadata = {
  title: 'Import Teachers',
}

export default async function TeachersImportPage() {
  const isAdmin = await checkIfAdmin()
  if (!isAdmin) notFound()

  return (
    <div className='mx-auto max-w-sm'>
      <FormWrapper>
        <FormFieldSelectInstitute />
        <FormField label='Excel File'>
          <Input
            className='backdrop-blur-2xs'
            required
            name='file'
            accept='.xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
            type='file'
          />
        </FormField>
        <div className='flex justify-end'>
          <FormSubmitButton>Submit</FormSubmitButton>
        </div>
      </FormWrapper>
    </div>
  )
}

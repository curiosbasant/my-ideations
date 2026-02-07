import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'

import { FormSubmitButton } from '~/components/forms/client'
import { FormField } from '~/components/forms/shared'
import { Input } from '~/components/ui/input'
import { FormFieldSelectSession } from '~/features/sdbms/components/form-fields'
import { checkIfAdmin } from '~/features/sdbms/dal'
import { FormWrapper } from './client'

export const metadata: Metadata = {
  title: 'Import File',
}

export default async function StudentsImportPage() {
  const isAdmin = await checkIfAdmin()
  if (!isAdmin) notFound()

  return (
    <FormWrapper>
      <FormFieldSelectSession />
      <FormField label='Excel File'>
        <Input
          className='backdrop-blur-2xs'
          required
          name='file'
          accept='.xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
          type='file'
        />
      </FormField>
      <div className='col-span-full flex justify-end'>
        <FormSubmitButton>Submit</FormSubmitButton>
      </div>
    </FormWrapper>
  )
}

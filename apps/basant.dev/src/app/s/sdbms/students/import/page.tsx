import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'

import { FormSubmitButton } from '~/components/forms/client'
import { FormControl } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { FormFieldSelectSession } from '~/features/sdbms/components/form-fields'
import { checkIfAdmin } from '~/features/sdbms/dal'
import { FormWrapper } from './client'

export const metadata: Metadata = {
  title: 'Import Students',
}

export default async function StudentsImportPage() {
  const isAdmin = await checkIfAdmin()
  if (!isAdmin) notFound()

  return (
    <div className='mx-auto max-w-sm'>
      <FormWrapper>
        <FormFieldSelectSession />
        <FormControl labelClassName='text-lg font-bold' label='Excel File' fieldId='excel-file'>
          <Input
            className='backdrop-blur-2xs'
            name='file'
            accept='.xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
            id='excel-file'
            required
            type='file'
          />
        </FormControl>
        <div className='flex justify-end'>
          <FormSubmitButton>Submit</FormSubmitButton>
        </div>
      </FormWrapper>
    </div>
  )
}

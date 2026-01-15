import { Suspense } from 'react'

import { FormSubmitButton } from '~/components/forms/client'
import { FormField } from '~/components/forms/shared'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { getSessions } from '~/features/sdbms/dal'
import { FormWrapper } from './client'

export default function ImportPage() {
  return (
    <FormWrapper>
      <FormField label='Session'>
        <Suspense>
          <SessionOptions />
        </Suspense>
      </FormField>
      <FormField label='Excel File'>
        <Input
          className='backdrop-blur-2xs'
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

async function SessionOptions() {
  const sessions = await getSessions()
  const lastSessionId = Math.max(...sessions.map((s) => s.id))
  return (
    <Select name='session' defaultValue={lastSessionId.toString()}>
      <SelectTrigger className='backdrop-blur-2xs w-full'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {sessions.map((opt) => (
          <SelectItem value={String(opt.id)} key={opt.id}>
            {opt.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

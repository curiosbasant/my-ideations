import Form from 'next/form'

import { resolveStringParam } from '@my/lib/utils'

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

export default async function FormSlot(props: PageProps<'/s/parinaam'>) {
  const searchParams = await props.searchParams

  const year = resolveStringParam(searchParams.year) ?? '2025'
  const standard = resolveStringParam(searchParams.standard)
  const roll = resolveStringParam(searchParams.roll)

  return (
    <Form action='/' className='grid gap-4 sm:grid-cols-3'>
      <FormField label='Session'>
        <Select name='year' defaultValue={year} key={year}>
          <SelectTrigger className='backdrop-blur-2xs w-full'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='2025'>2024-25</SelectItem>
            <SelectItem value='2024'>2023-24</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
      <FormField label='Standard'>
        <Select name='standard' defaultValue={standard ?? undefined} key={standard}>
          <SelectTrigger className='backdrop-blur-2xs w-full'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='10'>Class 10</SelectItem>
            <SelectItem value='12'>Class 12</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
      <FormField label='Starting Roll Number'>
        <Input
          className='backdrop-blur-2xs'
          name='roll'
          defaultValue={roll ?? undefined}
          key={roll}
        />
      </FormField>
      <div className='col-span-full flex justify-end'>
        <FormSubmitButton>Submit</FormSubmitButton>
      </div>
    </Form>
  )
}

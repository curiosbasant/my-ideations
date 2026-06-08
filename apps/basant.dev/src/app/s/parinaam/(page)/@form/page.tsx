import Form from 'next/form'

import { resolveStringParam } from '@my/lib/utils'

import { FormSubmitButton } from '~/components/forms/client'
import { FormControl, FormSelect } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { SelectItem } from '~/components/ui/select'

export default async function FormSlot(props: PageProps<'/s/parinaam'>) {
  const searchParams = await props.searchParams

  const year = resolveStringParam(searchParams['year']) ?? '2026'
  const standard = resolveStringParam(searchParams['class'])
  const roll = resolveStringParam(searchParams['roll'])

  return (
    <Form action='/' className='grid gap-4 sm:grid-cols-3'>
      <FormControl labelClassName='text-lg font-bold' label='Select Session' fieldId='session'>
        <FormSelect name='year' defaultValue={year} fieldId='session' required key={year}>
          <SelectItem value='2026'>2025-26</SelectItem>
          <SelectItem value='2025'>2024-25</SelectItem>
          <SelectItem value='2024'>2023-24</SelectItem>
        </FormSelect>
      </FormControl>
      <FormControl labelClassName='text-lg font-bold' label='Select Class' fieldId='class'>
        <FormSelect
          name='class'
          defaultValue={standard ?? undefined}
          fieldId='class'
          required
          key={standard}>
          <SelectItem value='10'>Class 10</SelectItem>
          <SelectItem value='12'>Class 12</SelectItem>
        </FormSelect>
      </FormControl>
      <FormControl labelClassName='text-lg font-bold' label='Roll Number' fieldId='roll-num'>
        <Input
          className='backdrop-blur-2xs'
          name='roll'
          defaultValue={roll ?? undefined}
          id='roll-num'
          required
          key={roll}
        />
      </FormControl>
      <div className='col-span-full flex justify-end'>
        <FormSubmitButton>Submit</FormSubmitButton>
      </div>
    </Form>
  )
}

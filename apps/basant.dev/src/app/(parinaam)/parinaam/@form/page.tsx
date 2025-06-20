import Form from 'next/form'
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
import type { HomeProps } from '../shared'

export default async function FormSlot(props: HomeProps) {
  const { year = '2025', standard, roll } = await props.searchParams

  return (
    <Form action='/' className='grid gap-4 sm:grid-cols-3'>
      <FormField label='Session'>
        <Select name='year' defaultValue={year} key={year}>
          <SelectTrigger className='w-full backdrop-blur-2xs'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='2025'>2024-25</SelectItem>
            <SelectItem value='2024'>2023-24</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
      <FormField label='Standard'>
        <Select name='standard' defaultValue={standard} key={standard}>
          <SelectTrigger className='w-full backdrop-blur-2xs'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='10'>Class 10</SelectItem>
            <SelectItem value='12'>Class 12</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
      <FormField label='Starting Roll Number'>
        <Input className='backdrop-blur-2xs' name='roll' defaultValue={roll} key={roll} />
      </FormField>
      <div className='col-span-full flex justify-end'>
        <FormSubmitButton>Submit</FormSubmitButton>
      </div>
    </Form>
  )
}

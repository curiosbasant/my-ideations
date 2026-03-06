'use client'

import Form from 'next/form'

import { debounce } from '@my/lib/utils'

import { Input, type InputProps } from '~/components/ui/input'

const debouncedSearch = debounce((form: HTMLFormElement) => form.requestSubmit(), { wait: 500 })

export function SearchQueryInput(props: InputProps) {
  return (
    <Form action='' onChange={(ev) => debouncedSearch(ev.currentTarget)}>
      <Input name='query' {...props} type='search' />
    </Form>
  )
}

'use client'

import type { FormEvent } from 'react'
import Form from 'next/form'

function debounce<T extends any[]>(cb: (...args: T) => void, delay: number) {
  let timeout = 0
  return function (...args: T) {
    window.clearTimeout(timeout) // Clear previous timeout if exists
    timeout = window.setTimeout(cb, delay, ...args)
  }
}

const debouncedSearch = debounce((form: HTMLFormElement) => {
  const query = (form.elements.namedItem('query') as HTMLInputElement).value
  console.log(query)
  form.requestSubmit()
}, 500)

export const handleChange = (ev: FormEvent<HTMLFormElement>) => {
  debouncedSearch(ev.currentTarget)
}
export function SearchForm(props: { query?: string }) {
  return (
    <Form className='' action='' onChange={handleChange}>
      <input
        className='w-full rounded-md border px-4 py-3 text-xl'
        name='query'
        defaultValue={props.query ?? undefined}
        placeholder='Search for a format'
        type='search'
      />
    </Form>
  )
}

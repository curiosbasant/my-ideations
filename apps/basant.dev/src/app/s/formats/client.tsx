'use client'

import type { FormEvent } from 'react'
import Form from 'next/form'
import { CloudUploadIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'

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
function SearchForm(props: { query?: string }) {
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

export function DropContainer(props: { onDrop: (files: File[]) => void }) {
  const handleDrop = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault()
    if (ev.dataTransfer.files) {
      props.onDrop(Array.from(ev.dataTransfer.files))
    }
  }

  return (
    <div
      className='grid h-96 place-items-center rounded-2xl border-2 border-dashed'
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}>
      <CloudUploadIcon className='size-12 text-gray-400' />
      <p className='text-gray-500'>Drag and drop your file here</p>
      <p className='text-gray-500'>or click to select a file</p>
      <Button variant='outline' className='mt-4' asChild>
        <label>
          Select File
          <input
            type='file'
            className='hidden'
            onChange={(e) => {
              if (e.target.files) {
                props.onDrop(Array.from(e.target.files))
              }
            }}
          />
        </label>
      </Button>
    </div>
  )
}

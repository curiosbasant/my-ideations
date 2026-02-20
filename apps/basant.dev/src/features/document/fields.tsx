'use client'

import { Suspense } from 'react'

import { Query } from '@my/core/trpc/query'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

export function SelectDocumentType() {
  return (
    <Suspense
      fallback={
        <Select name='documentType' required disabled>
          <SelectTrigger className='backdrop-blur-2xs w-full' id='document-type'>
            <SelectValue placeholder='Loading document types...' />
          </SelectTrigger>
        </Select>
      }>
      <Query options={(api) => api.person.document.type.list.queryOptions()}>
        {(documentTypes) => (
          <Select name='documentType' required>
            <SelectTrigger className='backdrop-blur-2xs w-full' id='document-type'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((type) => (
                <SelectItem value={type.id.toString()} key={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </Query>
    </Suspense>
  )
}

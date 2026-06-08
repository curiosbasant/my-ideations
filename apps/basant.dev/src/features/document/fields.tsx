'use client'

import { Suspense } from 'react'

import { Query } from '@my/core/trpc/query'

import { FormSelect } from '~/components/ui/form'
import { SelectItem } from '~/components/ui/select'

export function SelectDocumentType() {
  return (
    <Suspense
      fallback={
        <FormSelect
          name='documentType'
          fieldId='document-type'
          placeholder='Loading document types...'
          disabled
          required
        />
      }>
      <Query options={(api) => api.person.document.type.list.queryOptions()}>
        {(documentTypes) => (
          <FormSelect name='documentType' fieldId='document-type' required>
            {documentTypes.map((type) => (
              <SelectItem value={type.id.toString()} key={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </FormSelect>
        )}
      </Query>
    </Suspense>
  )
}

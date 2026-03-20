'use client'

import { use } from 'react'

import type { RouterOutputs } from '@my/api'

import { DialogContext } from '~/components/ui/dialog'
import { toast } from '~/components/ui/sonner'
import { actionCreateDocument, actionUpdateDocument } from '~/features/document/actions'
import { FormSetDocument } from '~/features/document/components/form-set-document'
import { dalFormatErrorMessage } from '~/lib/dal/helpers'

export function DocumentCreateForm() {
  const setOpen = use(DialogContext)

  return (
    <FormSetDocument
      onSubmit={async (value) => {
        const result = await actionCreateDocument({
          relation: value.relation as 'mine',
          documentType: value.documentType,
          documentNo: value.documentNo,
          filePath: value.filePath,
          note: value.note,
        })
        if (result.success) {
          toast.success('Document added successfully')
          setOpen(false)
        } else {
          toast.error(dalFormatErrorMessage(result.error))
        }
      }}
    />
  )
}

export function DocumentUpdateForm(props: {
  document: RouterOutputs['person']['document']['list'][number]
}) {
  const setOpen = use(DialogContext)

  return (
    <FormSetDocument
      defaultValues={{
        relation: props.document.relation?.toLowerCase() ?? 'mine',
        documentType: props.document.type.id.toString(),
        documentNo: props.document.number ?? '',
        url: props.document.signedUrl ?? '',
        note: props.document.note ?? '',
        filePath: props.document.file.path ?? '',
      }}
      onSubmit={async (value) => {
        const result = await actionUpdateDocument({
          personId: props.document.personId,
          documentType: props.document.type.id,

          relation: value.relation || undefined,
          newDocumentType: value.documentType || undefined,
          documentNo: value.documentNo || undefined,
          filePath: value.filePath || undefined,
          note: value.note || null, // remove note, if empty string
        })
        if (result.success) {
          toast.success('Document updated successfully')
          setOpen(false)
        } else {
          toast.error(dalFormatErrorMessage(result.error))
        }
      }}
    />
  )
}

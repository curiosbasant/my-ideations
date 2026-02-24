'use client'

import { use } from 'react'

import type { RouterOutputs } from '@my/api'

import { DialogContext } from '~/components/ui/dialog'
import { toast } from '~/components/ui/sonner'
import { actionCreateDocument, actionUpdateDocument } from '~/features/document/actions'
import { FormSetDocument } from '~/features/document/components/form-set-document'

export function DocumentCreateForm() {
  const setOpen = use(DialogContext)

  return (
    <FormSetDocument
      onSubmit={async (value) => {
        try {
          const errMessage = await actionCreateDocument({
            relation: value.relation as 'mine',
            documentType: parseInt(value.documentType),
            documentNo: value.documentNo,
            filePath: value.filePath,
            note: value.note,
          })
          if (errMessage) {
            toast.error(errMessage)
          } else {
            toast.success('Document added successfully')
            setOpen(false)
          }
        } catch (error) {
          if (error instanceof Error && error.message === 'Related person not found') {
            toast.error(`Relation with ${value.relation} doesn't exist`)
            return
          }
          throw error
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
        filePath: props.document.path ?? '',
      }}
      onSubmit={async (value) => {
        try {
          const errMessage = await actionUpdateDocument({
            personId: props.document.personId,
            documentType: props.document.type.id,

            relation: value.relation || undefined,
            newDocumentType: parseInt(value.documentType) || undefined,
            documentNo: value.documentNo || undefined,
            filePath: value.filePath || undefined,
            note: value.note || null, // remove note, if empty string
          })
          if (errMessage) {
            toast.error(errMessage)
          } else {
            toast.success('Document updated successfully')
            setOpen(false)
          }
        } catch (error) {
          if (error instanceof Error && error.message === 'Related person not found') {
            toast.error(`Relation with ${value.relation} doesn't exist`)
            return
          }
          throw error
        }
      }}
    />
  )
}

'use client'

import { use } from 'react'

import { DialogContext } from '~/components/ui/dialog'
import { toast } from '~/components/ui/sonner'
import { actionCreateDocument } from '~/features/document/actions'
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
          }
          setOpen(false)
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

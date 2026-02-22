import type { Metadata } from 'next/types'

import { FormSubmitButton } from '~/components/forms/client'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Field, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { SelectDocumentType } from '~/features/document/fields'
import { DocumentView, FormWrapper } from './client'

export const metadata: Metadata = {
  title: 'Documents',
}

export default async function DocumentsLayout(props: LayoutProps<'/s/sdbms/documents'>) {
  return (
    <div className='space-y-12'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl'>My Documents</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button size='sm'>Add</Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-3xl'>
            <DialogHeader>
              <DialogTitle>Add a document</DialogTitle>
              <DialogDescription>
                Upload and save a document to your profile. You can view and edit them later.
              </DialogDescription>
            </DialogHeader>
            <FormWrapper>
              <div className='grid gap-6 md:grid-cols-2 md:grid-rows-[1fr_auto]'>
                <div className='space-y-6'>
                  <Field>
                    <FieldLabel htmlFor='relation'>Relation</FieldLabel>
                    <Select name='relation' defaultValue='mine' required>
                      <SelectTrigger className='backdrop-blur-2xs w-full' id='relation'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='mine'>Mine</SelectItem>
                        <SelectItem value='father'>Father</SelectItem>
                        <SelectItem value='mother'>Mother</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor='document-type'>Document Type</FieldLabel>
                    <SelectDocumentType />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor='document-no'>Document Number</FieldLabel>
                    <Input
                      className='backdrop-blur-2xs'
                      id='document-no'
                      name='documentNo'
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor='note'>Note (optional)</FieldLabel>
                    <Input className='backdrop-blur-2xs' id='note' name='note' />
                  </Field>
                </div>
                <DocumentView />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant='outline'>Cancel</Button>
                  </DialogClose>
                  <FormSubmitButton>Save changes</FormSubmitButton>
                </DialogFooter>
              </div>
            </FormWrapper>
          </DialogContent>
        </Dialog>
      </div>
      {props.children}
    </div>
  )
}

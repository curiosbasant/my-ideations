import { Suspense, useState, type PropsWithChildren } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import imageCompression from 'browser-image-compression'

import { useTrpc } from '@my/core/trpc/client'
import { Query } from '@my/core/trpc/query'
import { getSupabaseClient } from '@my/lib/supabase/client'
import { z } from '@my/lib/zod'

import { DropArea } from '~/components/elements/drop-area'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import { DialogClose, DialogFooter } from '~/components/ui/dialog'
import { SelectItem } from '~/components/ui/select'
import { toast } from '~/components/ui/sonner'
import { useAppForm } from '~/features/shared/form/hooks'
import { cn } from '~/lib/utils'

const schema = z.object({
  relation: z.string(),
  documentType: z.string(),
  documentNo: z.string().nonempty(),
  filePath: z.string().nonempty(),
  note: z.string().optional(),
})

type FormInput = z.input<typeof schema>

export function FormSetDocument(props: {
  defaultValues?: FormInput & { url: string }
  onSubmit: (values: FormInput) => Promise<void>
}) {
  const form = useAppForm({
    defaultValues: {
      relation: 'mine',
      documentType: '',
      documentNo: '',
      filePath: '',
      note: '',
      ...props.defaultValues,
    } as FormInput,
    validators: {
      onChange: schema,
      onMount: schema,
    },
    async onSubmit({ value }) {
      const dirtyFields = Object.fromEntries(
        Object.entries(value).filter(
          ([key]) => !form.getFieldMeta(key as keyof FormInput)?.isDefaultValue,
        ),
      ) as FormInput // Can't trust

      await props.onSubmit(dirtyFields)
    },
  })

  return (
    <form
      className='grid gap-6 md:grid-cols-2 md:grid-rows-[1fr_auto]'
      onSubmit={(ev) => {
        ev.preventDefault()
        if (form.state.isPristine) return
        return form.handleSubmit()
      }}>
      <form.AppForm>
        <div className='space-y-6'>
          <form.AppField name='relation'>
            {(field) => (
              <form.Control>
                <field.Select required>
                  <SelectItem value='mine'>Mine</SelectItem>
                  <SelectItem value='father'>Father</SelectItem>
                  <SelectItem value='mother'>Mother</SelectItem>
                </field.Select>
              </form.Control>
            )}
          </form.AppField>
          <form.AppField name='documentType'>
            {(field) => (
              <form.Control>
                <Suspense
                  fallback={
                    <field.Select placeholder='Loading document types...' required disabled />
                  }>
                  <field.Select required>
                    <Query options={(api) => api.person.document.type.list.queryOptions()}>
                      {(documentTypes) =>
                        documentTypes.map((type) => (
                          <SelectItem value={type.id.toString()} key={type.id}>
                            {type.name}
                          </SelectItem>
                        ))
                      }
                    </Query>
                  </field.Select>
                </Suspense>
              </form.Control>
            )}
          </form.AppField>
          <form.AppField name='documentNo'>
            {(field) => (
              <form.Control>
                <field.Input required />
              </form.Control>
            )}
          </form.AppField>
          <form.AppField name='note'>
            {(field) => (
              <form.Control>
                <field.Input />
              </form.Control>
            )}
          </form.AppField>
        </div>
        <form.Field name='filePath'>
          {(field) => (
            <DocumentUploadArea
              url={props.defaultValues?.url}
              invalid={field.form.state.submissionAttempts > 0 && !field.state.meta.isValid}
              onSelect={field.handleChange}
            />
          )}
        </form.Field>
        <DialogFooter>
          <form.Subscribe selector={(state) => state.isDirty}>
            {(isDirty) => {
              const buttonJsx = <Button variant='outline'>Cancel</Button>
              return isDirty ?
                  <AlertConfirmDiscardChanges>{buttonJsx}</AlertConfirmDiscardChanges>
                : <DialogClose asChild>{buttonJsx}</DialogClose>
            }}
          </form.Subscribe>
          <form.SubmitButton>Save Document</form.SubmitButton>
        </DialogFooter>
      </form.AppForm>
    </form>
  )
}

function AlertConfirmDiscardChanges(props: PropsWithChildren) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{props.children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard your changed?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure, you want to discard your changes? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <DialogClose asChild>
            <AlertDialogAction variant='destructive'>Discard</AlertDialogAction>
          </DialogClose>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function DocumentUploadArea(props: {
  url?: string
  invalid?: boolean
  onSelect?: (file: string) => void
}) {
  const [fileUrl, setFileUrl] = useState<string | null>(props.url ?? null)
  const trpc = useTrpc()
  const query = useQueryClient()

  return (
    <DropArea
      className={cn(
        'group flex min-h-80 overflow-clip rounded-lg border-2 border-dashed transition hover:bg-input/25 md:row-span-full',
        props.invalid && 'border-destructive bg-destructive/5',
      )}
      activeClassName='border-primary bg-primary/10'
      enablePromptFile
      aria-invalid={props.invalid}
      onFilesDrop={async ([file]) => {
        setFileUrl((prev) => {
          prev && URL.revokeObjectURL(prev)
          return URL.createObjectURL(file)
        })
        const obj = await query.ensureQueryData(
          trpc.person.document.getSignedUrl.queryOptions({ fileName: file.name }),
        )
        const supabase = getSupabaseClient()
        const bkt = supabase.storage.from('__documents')

        const processedFile = await processFile(file)
        const { data, error } = await bkt.uploadToSignedUrl(obj.path, obj.token, processedFile)
        if (error) {
          if (error.message === 'The resource already exists') {
            return props.onSelect?.(obj.path)
          }
          toast.error('Failed to upload file')
          return console.error(error)
        }
        props.onSelect?.(data.path)
      }}>
      {fileUrl ?
        <div className='flex flex-1'>
          <img src={fileUrl} className='m-auto object-contain group-data-drag-over:opacity-20' />
        </div>
      : <div className='m-auto'>
          <p className='text-center text-sm text-balance text-muted-foreground'>
            Drag and drop a file here to upload
          </p>
        </div>
      }
    </DropArea>
  )
}

function processFile(file: File) {
  if (file.type.startsWith('image/')) {
    return imageCompression(file, {
      maxWidthOrHeight: 1080,
      alwaysKeepResolution: true,
      maxSizeMB: 1,
    })
  }
  return file
}

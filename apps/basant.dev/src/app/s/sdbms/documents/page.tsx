'use client'

import { useQueryClient } from '@tanstack/react-query'

import { useTrpc } from '@my/core/trpc/client'
import { getSupabaseClient } from '@my/lib/supabase/client'

import { FormSubmitButton } from '~/components/forms/client'
import { FormField } from '~/components/forms/shared'
import { Input } from '~/components/ui/input'
import { actionAddDocument } from '~/features/document/actions'
import { useAction } from '~/lib/utils/helper-action/client'

export default function DocumentsPage() {
  const { state, actionTransition } = useAction({ actionFn: actionAddDocument })
  const trpc = useTrpc()
  const query = useQueryClient()

  return (
    <div className='@container space-y-8'>
      <form
        action={async (fd) => {
          const docNumber = fd.get('aadharNo') as string
          const file = fd.get('file') as File

          const obj = await query.ensureQueryData(
            trpc.person.document.getSignedUrl.queryOptions({ fileName: file.name }),
          )

          const supabase = getSupabaseClient()
          const bkt = supabase.storage.from('__documents')
          bkt.createSignedUrl(obj.path, 600)
          const { data, error } = await bkt.uploadToSignedUrl(obj.path, obj.token, file)
          if (error) throw error

          actionTransition({ docNumber, filePath: data.path })
        }}
        className='@xl:grid-cols-3 grid gap-4'>
        <FormField label='Aadhar Number'>
          <Input className='backdrop-blur-2xs' name='aadharNo' required />
        </FormField>
        <FormField label='Upload Document'>
          <Input
            className='backdrop-blur-2xs'
            name='file'
            accept='image/*'
            capture='environment'
            required
            type='file'
          />
        </FormField>
        {state && !state.success && <p className='text-destructive'>{state.message}</p>}
        <div className='col-span-full flex justify-end'>
          <FormSubmitButton>Submit</FormSubmitButton>
        </div>
      </form>
    </div>
  )
}

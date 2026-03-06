import { getSupabaseClient } from '@my/lib/supabase/client'

import { createErrorReturn, createSuccessReturn } from '~/lib/dal/shared'
import { zipFiles } from '~/lib/utils'
import { actionUploadSnapFile } from './actions'

export async function actionUploadFiles(files: File[]) {
  const fileToUpload = files.length > 1 ? await zipFiles(files) : files[0]
  const supabase = getSupabaseClient()
  const bkt = supabase.storage.from('sf__files')
  const { code: fileShortCode, url: filePath } = await actionUploadSnapFile({
    fileName: fileToUpload.name,
  })
  const { error } = await bkt.upload(filePath, fileToUpload)
  if (error) {
    return createErrorReturn({ type: 'unknown-error', error })
  }

  return createSuccessReturn(fileShortCode)
}

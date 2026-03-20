import { getSupabaseClient } from '@my/lib/supabase/client'

import { createErrorReturn, createSuccessReturn } from '~/lib/dal/types'
import { zipFiles } from '~/lib/utils'
import { actionCreateFormat, actionUploadSnapFile } from './actions'

export async function actionUploadFiles(files: File[]) {
  const fileToUpload = files.length > 1 ? await zipFiles(files) : files[0]
  const { code: fileShortCode, url: filePath } = await actionUploadSnapFile({
    fileName: fileToUpload.name,
  })

  const supabase = getSupabaseClient()
  const bkt = supabase.storage.from('sf__files')
  const { error } = await bkt.upload(filePath, fileToUpload)
  if (error) {
    return createErrorReturn({ type: 'unknown-error', error })
  }

  return createSuccessReturn(fileShortCode)
}

export const actionUploadFormatFile = async (payload: {
  file: File
  fileName: string
  fileDescription?: string
}) => {
  const { filePath } = await actionCreateFormat({
    fileOriginalName: payload.file.name,
    fileName: payload.fileName,
    description: payload.fileDescription || null,
  })

  const supabase = getSupabaseClient()
  const bkt = supabase.storage.from('sf__files')
  const { error } = await bkt.upload(filePath, payload.file)
  if (error) {
    return createErrorReturn({ type: 'unknown-error', error })
  }

  return createSuccessReturn(filePath)
}

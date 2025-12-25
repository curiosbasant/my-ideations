import { getSupabaseClient } from '@my/lib/supabase/client'
import { throwOnError } from '@my/lib/supabase/shared'

import { actionWrapper } from '~/app/shared'

export const uploadFileAction = actionWrapper(async (file: File) => {
  const fileShortCode = crypto.randomUUID().slice(-6)
  const filePath = `${fileShortCode}-${file.name}`

  const supabase = getSupabaseClient()
  const filesBucket = supabase.storage.from('sf__files')
  const filePublicUrl = filesBucket.getPublicUrl(filePath, {
    download: `snapfile__${file.name}`,
  }).data.publicUrl

  try {
    const [, row] = await Promise.all([
      filesBucket.upload(filePath, file).then(throwOnError),
      // Create a short-code for the url
      supabase
        .from('sf__short_url')
        .insert({ code: fileShortCode, url: filePublicUrl })
        .select('created_at')
        .single()
        .then(throwOnError),
    ])

    return {
      shortcode: fileShortCode,
      publicUrl: filePublicUrl,
      createdAt: row!.created_at,
    }
  } catch {
    throw new Error('There seems to some problem uploading your file!')
  }
})

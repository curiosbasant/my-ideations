'use client'

import type { FormEvent } from 'react'

import { getSupabaseClient } from '@my/lib/supabase/client'
import { throwOnError } from '@my/lib/supabase/shared'

import { createAction } from '~/lib/utils/helper-action/shared'

function debounce<T extends any[]>(cb: (...args: T) => void, delay: number) {
  let timeout = 0
  return function (...args: T) {
    window.clearTimeout(timeout) // Clear previous timeout if exists
    timeout = window.setTimeout(cb, delay, ...args)
  }
}

const debouncedSearch = debounce((form: HTMLFormElement) => {
  form.requestSubmit()
}, 500)

export const handleChange = (ev: FormEvent<HTMLFormElement>) => {
  debouncedSearch(ev.currentTarget)
}

export const uploadFileAction = createAction(
  async (p: { file: File; fileName: string; fileDescription?: string }) => {
    const fileShortCode = crypto.randomUUID().slice(-6)
    const filePath = `${fileShortCode}-${p.fileName}`

    const supabase = getSupabaseClient()
    const filesBucket = supabase.storage.from('format--files')
    const filePublicUrl = filesBucket.getPublicUrl(filePath, {
      download: p.file.name,
    }).data.publicUrl

    try {
      await Promise.all([
        filesBucket.upload(filePath, p.file).then(throwOnError),
        supabase
          .from('format__file')
          .insert({ name: p.fileName, description: p.fileDescription || null, url: filePublicUrl })
          .then(throwOnError),
      ])

      return {
        publicUrl: filePublicUrl,
      }
    } catch {
      throw new Error('There seems to some problem uploading your file!')
    }
  },
)

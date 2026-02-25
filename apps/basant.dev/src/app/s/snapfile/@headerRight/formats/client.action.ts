'use client'

import type { FormEvent } from 'react'

import { getSupabaseClient } from '@my/lib/supabase/client'
import { throwOnError } from '@my/lib/supabase/shared'
import { sanitizeFilenameForStorage } from '@my/lib/utils'

import { actionCreateFormat } from '~/features/snapfile/actions'
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
    const filePath = `formats/${sanitizeFilenameForStorage(p.file.name)}`

    const supabase = getSupabaseClient()
    const bkt = supabase.storage.from('sf__files')

    try {
      await Promise.all([
        bkt.upload(filePath, p.file).then(throwOnError),
        actionCreateFormat({
          fileName: p.fileName,
          description: p.fileDescription || null,
          path: filePath,
        }),
      ])
    } catch {
      throw new Error('There seems to some problem uploading your file!')
    }
  },
)

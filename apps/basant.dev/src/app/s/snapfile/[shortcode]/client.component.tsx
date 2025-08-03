'use client'

import { ClientOnly } from '@my/core/elements'

export function FileDownloadingText() {
  return (
    <ClientOnly fallback='Downloading file...'>{() => 'Your file has been downloaded!'}</ClientOnly>
  )
}

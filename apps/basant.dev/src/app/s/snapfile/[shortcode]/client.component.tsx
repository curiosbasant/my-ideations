'use client'

import { useEffect } from 'react'

import { ClientOnly } from '@my/core/elements'

import { Button } from '~/components/ui/button'
import { downloadFileFromUrl } from '~/lib/utils'

export function FileDownloadingText() {
  return (
    <ClientOnly fallback='Downloading file...'>{() => 'Your file has been downloaded!'}</ClientOnly>
  )
}

export function FileDownloadButton(props: { url: string }) {
  const handleDownloadFile = () => {
    downloadFileFromUrl(props.url)
  }
  useEffect(handleDownloadFile, [props.url])
  return <Button onClick={handleDownloadFile}>Download File</Button>
}

'use client'

import { useEffect } from 'react'

import { Button, type ButtonProps } from '~/components/ui/button'
import { downloadFileFromUrl } from '~/lib/utils'

export function FileDownloadButton({
  url,
  autoDownload,
  ...props
}: ButtonProps & { url: string; autoDownload?: boolean }) {
  const handleDownloadFile = () => {
    downloadFileFromUrl(url)
  }
  autoDownload && useEffect(handleDownloadFile, [url])

  return <Button {...props} onClick={handleDownloadFile} />
}

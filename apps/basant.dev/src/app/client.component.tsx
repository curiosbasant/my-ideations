'use client'

import { useEffect } from 'react'
import { LoaderCircleIcon } from 'lucide-react'
import { useFormStatus } from 'react-dom'

import { Button, type ButtonProps } from '~/components/ui/button'
import { cn, downloadFileFromUrl } from '~/lib/utils'

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

export function SubmitButton(props: ButtonProps) {
  const { pending } = useFormStatus()
  return (
    <Button
      {...props}
      className={cn(props.className, 'group grid place-items-center *:col-start-1 *:row-start-1')}
      disabled={pending}
      type='submit'>
      <div className='group-disabled:opacity-0'>{props.children || 'Submit'}</div>
      {pending && (
        <div>
          <LoaderCircleIcon className='size-5 animate-spin text-white' />
        </div>
      )}
    </Button>
  )
}

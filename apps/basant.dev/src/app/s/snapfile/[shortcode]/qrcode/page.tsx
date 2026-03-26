'use client'

import { Suspense, use } from 'react'
import Image from 'next/image'
import { CopyIcon } from 'lucide-react'
import QRCode from 'qrcode'

import { ClientOnly } from '@my/core/elements'

import { Spinner } from '~/components/elements/spinner'
import { Skeleton } from '~/components/ui/skeleton'
import { toast } from '~/components/ui/sonner'

export default function SnapFileQrCodePage() {
  return (
    <>
      <QrPreview />
      <small className='text-sm'>or copy and share this url.</small>
      <CopyShortLink />
    </>
  )
}

function QrPreview() {
  const spinner = <Spinner />
  return (
    <div className='inline-flex size-80 items-center justify-center'>
      <Suspense fallback={spinner}>
        <ClientOnly fallback={spinner}>
          {() => (
            <QrImage qrPromise={QRCode.toDataURL(`${location.origin}/${extractShortcode()}`)} />
          )}
        </ClientOnly>
      </Suspense>
    </div>
  )
}

function QrImage(props: { qrPromise: Promise<string> }) {
  const qrCodeDataUrl = use(props.qrPromise)
  return (
    <Image
      className='size-full rounded-md border shadow-lg'
      src={qrCodeDataUrl}
      alt='QR Code'
      height={320}
      width={320}
    />
  )
}

function CopyShortLink() {
  return (
    <div className='flex divide-x rounded-md border bg-background'>
      <div className='px-4 pt-1 pb-2 leading-none tabular-nums'>
        <ClientOnly fallback={<Skeleton className='-mb-1 inline-block h-5 w-40 rounded-xs' />}>
          {() => (
            <>
              {location.origin}/
              <span className='text-xl font-bold text-slate-700'>{extractShortcode()}</span>
            </>
          )}
        </ClientOnly>
      </div>
      <button
        className='inline-flex aspect-square h-full transition hover:bg-secondary/50 hover:opacity-80'
        onClick={async () => {
          if (!navigator.clipboard)
            return toast.info('That action is only supported in secure environment')
          await navigator.clipboard.writeText(`${location.origin}/${extractShortcode()}`)
          return toast.success('Copied to clipboard')
        }}
        title='Copy URL'
        type='button'>
        <CopyIcon className='m-auto size-5' />
      </button>
    </div>
  )
}

/**
 * Couldn't get from params, because of this issue
 * @link https://github.com/vercel/next.js/issues/86870
 */
function extractShortcode() {
  return location.pathname.match(/^\/([^/]+)/)?.[1]
}

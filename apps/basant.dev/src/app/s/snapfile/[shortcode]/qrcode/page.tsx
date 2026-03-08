'use client'

import { Suspense, use } from 'react'
import Image from 'next/image'
import { CopyIcon } from 'lucide-react'
import QRCode from 'qrcode'

import { ClientOnly } from '@my/core/elements'

import { Spinner } from '~/components/elements/spinner'
import { Skeleton } from '~/components/ui/skeleton'
import { toast } from '~/components/ui/sonner'

export default function SnapFileQrCodePage(props: PageProps<'/s/snapfile/[shortcode]/qrcode'>) {
  const { shortcode } = use(props.params)

  return (
    <>
      <QrPreview shortcode={shortcode} />
      <small className='text-sm'>or copy and share this url.</small>
      <CopyShortLink shortcode={shortcode} />
    </>
  )
}

function QrPreview(props: { shortcode: string }) {
  const spinner = <Spinner />
  return (
    <div className='inline-flex size-80 items-center justify-center'>
      <Suspense fallback={spinner}>
        <ClientOnly fallback={spinner}>
          {() => <QrImage qrPromise={QRCode.toDataURL(`${location.origin}/${props.shortcode}`)} />}
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

function CopyShortLink(props: { shortcode: string }) {
  return (
    <div className='flex divide-x rounded-md border bg-background'>
      <div className='px-4 pt-1 pb-2 leading-none tabular-nums'>
        <ClientOnly fallback={<Skeleton className='-mb-1 inline-block h-5 w-40 rounded-xs' />}>
        </ClientOnly>
        /<span className='text-xl font-bold text-slate-700'>{props.shortcode}</span>
      </div>
      <button
        className='inline-flex aspect-square h-full transition hover:bg-secondary/50 hover:opacity-80'
        onClick={async () => {
          if (!navigator.clipboard)
            return toast.info('That action is only supported in secure environment')
          await navigator.clipboard.writeText(`${location.origin}/${props.shortcode}`)
          toast.success('Copied to clipboard')
        }}
        title='Copy URL'
        type='button'>
        <CopyIcon className='m-auto size-5' />
      </button>
    </div>
  )
}

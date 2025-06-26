'use client'

import { Suspense, use } from 'react'
import Image from 'next/image'
import { CopyIcon } from 'lucide-react'
import QRCode from 'qrcode'

import { ClientOnly } from '@my/core/elements'

import { Spinner } from '~/app/s/snapfile/shared.component'

export default function SnapFileQrCodePage(props: PageProps<{ params: 'shortcode' }>) {
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
    <div className='bg-background flex divide-x rounded-md border'>
      <div className='px-4 pb-2 pt-1 tabular-nums leading-none'>
        <ClientOnly
          fallback={
            <div className='rounded-xs bg-secondary -mb-1 inline-block h-5 w-40 animate-pulse' />
          }>
          {() => location.origin}
        </ClientOnly>
        /<span className='text-xl font-bold text-slate-700'>{props.shortcode}</span>
      </div>
      <button
        className='hover:bg-secondary/50 inline-flex aspect-square h-full transition hover:opacity-80'
        onClick={() => {
          navigator.clipboard.writeText(props.shortcode)
        }}
        title='Copy URL'
        type='button'>
        <CopyIcon className='m-auto size-5' />
      </button>
    </div>
  )
}

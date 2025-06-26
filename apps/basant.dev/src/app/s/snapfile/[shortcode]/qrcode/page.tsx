'use client'

import { Suspense, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeftIcon, CopyIcon } from 'lucide-react'
import QRCode from 'qrcode'

import { ClientOnly } from '@my/core/elements'

import { Spinner } from '~/app/s/snapfile/shared.component'
import { Button } from '~/components/ui/button'

export default function SnapFileQrCodePage(props: PageProps<{ params: 'shortcode' }>) {
  const { shortcode } = use(props.params)

  return (
    <div className='flex h-full flex-col items-center justify-center gap-6'>
      <p className='text-balance text-center'>
        Ask your friend to scan this QR Code to get access to the uploaded file on their device.
      </p>
      <div className='inline-flex size-80 items-center justify-center'>
        <Suspense fallback={<Spinner />}>
          <ClientOnly fallback={<Spinner />}>
            {() => <QrImage qrPromise={QRCode.toDataURL(`${location.origin}/${shortcode}`)} />}
          </ClientOnly>
        </Suspense>
      </div>
      <small className='text-sm'>or copy and share this url.</small>
      <CopyShortLink shortcode={shortcode} />
      <Button asChild>
        <Link href='/'>
          <ChevronLeftIcon className='size-5' /> Go Back
        </Link>
      </Button>
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

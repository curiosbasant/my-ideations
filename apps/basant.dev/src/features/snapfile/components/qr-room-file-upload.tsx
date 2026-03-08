'use client'

import { Suspense, use } from 'react'
import Image from 'next/image'
import { LoaderCircleIcon } from 'lucide-react'
import QRCode from 'qrcode'

import { ClientOnly } from '@my/core/elements'

export function QrRoomFileUpload(props: { slug: string }) {
  const spinner = <LoaderCircleIcon className='size-6 animate-spin md:size-8' />

  return (
    <div className='inline-flex size-80 items-center justify-center'>
      <Suspense fallback={spinner}>
        <ClientOnly fallback={spinner}>
          {() => (
            <QrImage qrPromise={QRCode.toDataURL(`${location.origin}/rooms/${props.slug}/new`)} />
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
      className='size-full rounded-md border'
      src={qrCodeDataUrl}
      alt='QR Code'
      height={320}
      width={320}
    />
  )
}

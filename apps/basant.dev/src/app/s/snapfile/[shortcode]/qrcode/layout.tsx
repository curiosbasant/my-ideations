import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeftIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'

export const metadata: Metadata = {
  title: 'QR Code',
}

export default function SnapFileQrCodeLayout(props: LayoutProps<'/s/snapfile/[shortcode]/qrcode'>) {
  return (
    <div className='flex h-full flex-col items-center justify-center gap-6'>
      <p className='text-balance text-center'>
        Ask your friend to scan this QR Code to get access to the uploaded file on their device.
      </p>
      {props.children}
      <Button asChild>
        <Link href='/'>
          <ChevronLeftIcon className='size-5' /> Go Back
        </Link>
      </Button>
    </div>
  )
}

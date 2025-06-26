'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import QRScanner from 'qr-scanner'

export default function SnapFileScanQrCodePage() {
  const router = useRouter()
  return <QRCodeScanner onDecode={(text) => router.replace(text)} />
}

function QRCodeScanner(props: { onDecode(text: string): void }) {
  const [error, setError] = useState('')

  const videoRef = useCallback((videoElem: HTMLVideoElement) => {
    const scanner = new QRScanner(videoElem, ({ data }) => props.onDecode(data), {
      highlightScanRegion: true,
      highlightCodeOutline: true,
    })

    scanner.start().catch(setError)

    return () => {
      scanner.stop()
      scanner.destroy()
    }
  }, [])

  return error ?
      <p className='mb-8 text-balance text-center text-rose-500'>
        This device either does not have a camera or does not have permission to access it.
      </p>
    : <video
        ref={videoRef}
        className='bg-background/50 size-full rounded-md object-cover'
        width={1080}
        height={1080}
        autoPlay
        muted
        playsInline
      />
}

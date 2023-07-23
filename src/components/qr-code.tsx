'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import QRScanner from 'qr-scanner'
import QRCode from 'qrcode'

import Spinner from './spinner'

export function QRCodeScanner(props: { onDecode(text: string): void }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const videoElem = videoRef.current
    if (!videoElem) return

    const scanner = new QRScanner(videoElem, ({ data }) => props.onDecode(data), {
      highlightScanRegion: true,
    })
    scanner.start()

    return () => {
      scanner.stop()
      scanner.destroy()
    }
  }, [])

  return <video ref={videoRef} width={1920} height={1080} autoPlay muted playsInline />
}

export function QRCodePreview(props: { text: string }) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('')

  useEffect(() => {
    QRCode.toDataURL(props.text).then(setQrCodeDataUrl)
  }, [props.text])

  return qrCodeDataUrl ? (
    <Image
      className='h-72 w-72 rounded-md border shadow-md'
      src={qrCodeDataUrl}
      alt='QR Code'
      height={212}
      width={212}
    />
  ) : (
    <Spinner />
  )
}

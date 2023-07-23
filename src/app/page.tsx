'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import QRScanner from 'qr-scanner'
import QRCode from 'qrcode'

import { getSupabaseClient } from '~/lib/supabase'

const supabaseClient = getSupabaseClient()

export default function HomePage() {
  const [isScanning, setIsScanning] = useState(false)
  const [uploadedFileUrl, setUploadedFileUrl] = useState('')

  return (
    <div className='h-full px-4'>
      <div className='mx-auto flex h-full max-w-md flex-col gap-4 py-8'>
        {isScanning ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-4'>
            <QRCodeScanner
              onComplete={(text) => {
                window.open(text, '__blank')
                setIsScanning(false)
              }}
            />
            <button
              className='flex gap-2 rounded-md bg-blue-500 px-4 py-2 text-white'
              onClick={() => void setUploadedFileUrl('')}
              type='button'>
              <span className='font-icon'>arrow_back_ios_new</span> Go Back
            </button>
          </div>
        ) : uploadedFileUrl ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-4'>
            <p className='text-center'>
              Ask your friend to scan this QR Code to get access to the uploaded file on their
              device.
            </p>
            <QRCodePreview text={uploadedFileUrl} />
            <button
              className='flex gap-2 rounded-md bg-blue-500 px-4 py-2 text-white'
              onClick={() => void setUploadedFileUrl('')}
              type='button'>
              <span className='font-icon'>arrow_back_ios_new</span> Go Back
            </button>
          </div>
        ) : (
          <InitialView
            onSelectFiles={async (files) => {
              const [fileToUpload] = files

              const filesBucket = supabaseClient.storage.from('files')

              const { error } = await filesBucket.upload(fileToUpload.name, fileToUpload)
              if (error) {
                console.log(error)
                return
              }

              const { data } = filesBucket.getPublicUrl(fileToUpload.name, {
                download: fileToUpload.name,
              })

              setUploadedFileUrl(data.publicUrl)
            }}
            onScanPress={() => setIsScanning(true)}
          />
        )}
      </div>
    </div>
  )
}

function QRCodePreview(props: { text: string }) {
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
    <div className='animate-spin rounded-full border-2 border-slate-500 border-x-transparent p-4' />
  )
}

function InitialView(props: { onSelectFiles(files: File[]): void; onScanPress(): void }) {
  const handleFileDrop = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault()

    if (!ev.dataTransfer.items) {
      props.onSelectFiles([...ev.dataTransfer.files])
    } else if (ev.dataTransfer.items[0].kind === 'file') {
      props.onSelectFiles(Array.from(ev.dataTransfer.items, (item) => item.getAsFile()!))
    }
  }

  return (
    <>
      <div
        className='flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border-4 border-dotted bg-white'
        onDragOver={(ev) => {
          // Prevent files from being opened in the browser
          ev.preventDefault()
        }}
        onDrop={handleFileDrop}>
        <p className=''>Drop files here to share!</p>
        <span className=''>or</span>
        <label className='flex gap-2 rounded-md bg-blue-500 px-4 py-2 text-white'>
          <input
            className='woosh'
            multiple
            onChange={async (ev) => {
              props.onSelectFiles([...ev.currentTarget.files!])
            }}
            type='file'
          />
          <span className='font-icon'>upload_file</span> Select Files
        </label>
      </div>
      <div className='flex items-center gap-4'>
        <div className='flex-1 border-t' />
        <small className='text-slate-400'>or</small>
        <div className='flex-1 border-t' />
      </div>
      <footer className='flex w-full justify-center'>
        <button
          className='flex gap-2 rounded-md bg-blue-500 px-4 py-2 text-white'
          onClick={props.onScanPress}
          type='button'>
          <span className='font-icon'>qr_code_scanner</span> Scan QR to Download
        </button>
      </footer>
    </>
  )
}

function QRCodeScanner(props: { onComplete(text: string): void }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const videoElem = videoRef.current
    if (!videoElem) return

    const scanner = new QRScanner(videoElem, ({ data }) => props.onComplete(data), {
      highlightScanRegion: true,
    })
    scanner.start()

    return () => {
      scanner.stop()
    }
  }, [])

  return <video ref={videoRef} width={1920} height={1080} autoPlay muted playsInline />
}

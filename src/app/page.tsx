'use client'

import { useState } from 'react'

import { QRCodePreview, QRCodeScanner } from '~/components/qr-code'
import Spinner from '~/components/spinner'
import { zipFiles } from '~/lib/file'
import { getSupabaseClient } from '~/lib/supabase'

const supabaseClient = getSupabaseClient()

export default function HomePage() {
  const [activeView, setActiveView] = useState<'initial' | 'scanning' | 'uploading' | 'uploaded'>(
    'initial'
  )
  const [uploadedFileUrl, setUploadedFileUrl] = useState('')

  return (
    <div className='h-full px-4'>
      <div className='mx-auto flex h-full max-w-md flex-col gap-4 py-8'>
        {activeView === 'scanning' ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-4'>
            <QRCodeScanner
              onDecode={(text) => {
                window.open(text, '__blank')
                setActiveView('initial')
              }}
            />
            <button
              className='flex gap-2 rounded-md bg-blue-500 px-4 py-2 text-white'
              onClick={() => void setActiveView('initial')}
              type='button'>
              <span className='font-icon'>arrow_back_ios_new</span> Go Back
            </button>
          </div>
        ) : activeView === 'uploading' ? (
          <div className='flex flex-1 items-center justify-center gap-4'>
            <Spinner /> Uploading files...
          </div>
        ) : activeView === 'uploaded' ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-4'>
            <p className='text-center'>
              Ask your friend to scan this QR Code to get access to the uploaded file on their
              device.
            </p>
            <QRCodePreview text={uploadedFileUrl} />
            <button
              className='flex gap-2 rounded-md bg-blue-500 px-4 py-2 text-white'
              onClick={() => void setActiveView('initial')}
              type='button'>
              <span className='font-icon'>arrow_back_ios_new</span> Go Back
            </button>
          </div>
        ) : (
          <InitialView
            onSelectFiles={async (files) => {
              setActiveView('uploading')

              try {
                const fileToUpload = files.length > 1 ? await zipFiles(files) : files[0]

                const filesBucket = supabaseClient.storage.from('files')
                const { error } = await filesBucket.upload(fileToUpload.name, fileToUpload)
                if (error) {
                  console.log(error)
                  return
                }

                const { data } = filesBucket.getPublicUrl(fileToUpload.name, { download: true })

                setUploadedFileUrl(data.publicUrl)
                setActiveView('uploaded')
              } catch (err) {
                setActiveView('initial')
              }
            }}
            onScanPress={() => setActiveView('scanning')}
          />
        )}
      </div>
    </div>
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

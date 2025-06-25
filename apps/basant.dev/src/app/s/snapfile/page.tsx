'use client'

import { useState } from 'react'
import { ChevronLeftIcon, CopyIcon, ScanQrCodeIcon, UploadIcon } from 'lucide-react'

import { getSupabaseClient } from '@my/lib/supabase/client'

import { zipFiles } from '~/lib/utils'
import { QRCodePreview, QRCodeScanner } from './client.component'
import { Spinner } from './shared.component'

export default function SnapFileHomePage() {
  const [activeView, setActiveView] = useState<'initial' | 'scanning' | 'uploading' | 'uploaded'>(
    'initial',
  )
  const [uploadedFileUrl, setUploadedFileUrl] = useState('')

  return (
    <div className='h-full px-4'>
      <div className='mx-auto flex h-full max-w-md flex-col gap-4 py-8'>
        {activeView === 'scanning' ?
          <div className='flex flex-1 flex-col items-center justify-center gap-4'>
            <QRCodeScanner
              onDecode={(text) => {
                window.open(text, '__blank')
                setActiveView('initial')
              }}
            />
            <button
              className='flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white transition hover:opacity-80'
              onClick={() => void setActiveView('initial')}
              type='button'>
              <ChevronLeftIcon className='size-5' /> Go Back
            </button>
          </div>
        : activeView === 'uploading' ?
          <div className='flex flex-1 items-center justify-center gap-4'>
            <Spinner /> Uploading files...
          </div>
        : activeView === 'uploaded' ?
          <div className='flex flex-1 flex-col items-center justify-center gap-4'>
            <p className='text-center'>
              Ask your friend to scan this QR Code to get access to the uploaded file on their
              device.
            </p>
            <QRCodePreview text={uploadedFileUrl} />
            <small className=''>or copy and share this url.</small>
            <CopyLinkForm link={uploadedFileUrl} />
            <button
              className='flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white transition hover:opacity-80'
              onClick={() => void setActiveView('initial')}
              type='button'>
              <ChevronLeftIcon className='size-5' /> Go Back
            </button>
          </div>
        : <InitialView
            onSelectFiles={async (files) => {
              setActiveView('uploading')

              try {
                const supabase = getSupabaseClient()
                const fileToUpload = files.length > 1 ? await zipFiles(files) : files[0]

                const fileShortCode = crypto.randomUUID().slice(-6)
                const filesBucket = supabase.storage.from('snapfile--files')
                const fileName = `${fileShortCode}-${fileToUpload.name}`
                const { error } = await filesBucket.upload(fileName, fileToUpload)
                if (error) {
                  console.log(error)
                  return
                }

                const filePublicUrl = filesBucket.getPublicUrl(fileName, {
                  download: `snapfile_${fileToUpload.name}`,
                }).data.publicUrl

                // Create a short-code for the url
                await supabase.from('snapfile__short_url').insert({
                  url: filePublicUrl,
                  code: fileShortCode,
                })

                setUploadedFileUrl(`${location.origin}/${fileShortCode}`)
                setActiveView('uploaded')
              } catch (err) {
                setActiveView('initial')
              }
            }}
            onScanPress={() => setActiveView('scanning')}
          />
        }
      </div>
    </div>
  )
}

function CopyLinkForm(props: { link: string }) {
  const slashIndex = props.link.lastIndexOf('/') + 1

  return (
    <form
      className='flex divide-x rounded-lg border'
      onSubmit={(ev) => {
        ev.preventDefault()
        const inputRef = ev.currentTarget.elements.namedItem('file-url') as HTMLInputElement
        if (inputRef) {
          // Select the text field
          inputRef.select()
          inputRef.setSelectionRange(0, 99999) // For mobile devices
        }

        // Copy the text inside the text field
        navigator.clipboard.writeText(props.link)
      }}>
      <p className='border-none bg-inherit px-4 pb-2 pt-1 text-sm tabular-nums'>
        {props.link.slice(0, slashIndex)}
        <span className='text-lg font-bold text-slate-700'>{props.link.slice(slashIndex)}</span>
      </p>
      <button className='p-2 transition hover:opacity-80'>
        <CopyIcon />
      </button>
    </form>
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
        <label className='flex cursor-pointer items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white transition hover:opacity-80'>
          <input
            className='swoosh'
            multiple
            onChange={async (ev) => {
              props.onSelectFiles([...ev.currentTarget.files!])
            }}
            type='file'
          />
          <UploadIcon className='size-5' /> Select Files
        </label>
      </div>
      <div className='flex items-center gap-4'>
        <div className='flex-1 border-t' />
        <small className='text-slate-400'>or</small>
        <div className='flex-1 border-t' />
      </div>
      <footer className='flex w-full justify-center'>
        <button
          className='flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white transition hover:opacity-80'
          onClick={props.onScanPress}
          type='button'>
          <ScanQrCodeIcon className='size-5' /> Scan QR to Download
        </button>
      </footer>
    </>
  )
}

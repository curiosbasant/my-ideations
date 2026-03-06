'use client'

import { useState, type ComponentProps } from 'react'

import { promptFile } from '@my/lib/utils'

import { cn } from '~/lib/utils'

type DropAreaProps = ComponentProps<'div'> & {
  activeClassName: string
  enablePromptFile?: boolean
  onFilesDrop: (files: File[]) => void
}

export function DropArea({
  className,
  activeClassName,
  enablePromptFile,
  onFilesDrop,
  ...props
}: DropAreaProps) {
  const [isOver, setIsOver] = useState(false)

  const handleDrop = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault()
    if (!ev.dataTransfer.items) {
      const fileList = ev.dataTransfer.files // fallback for older browsers
      fileList.length > 0 && onFilesDrop(Array.from(fileList))
    } else {
      const files = Array.from(ev.dataTransfer.items, (item) =>
        item.kind === 'file' ? item.getAsFile() : null,
      ).filter((v) => v !== null)

      files.length > 0 && onFilesDrop(files)
    }
    setIsOver(false)
  }

  return (
    <div
      className={cn('*:pointer-events-none', className, isOver && activeClassName)}
      data-drag-over={isOver ? '' : undefined}
      onDragEnter={(ev) => {
        setIsOver(ev.currentTarget.contains(ev.target as Node))
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={(ev) => {
        setIsOver(ev.currentTarget !== ev.target && ev.currentTarget.contains(ev.target as Node))
      }}
      onDrop={handleDrop}
      onClick={
        enablePromptFile ?
          async () => {
            const files = await promptFile()
            files.length > 0 && onFilesDrop(files)
          }
        : undefined
      }
      {...props}
    />
  )
}

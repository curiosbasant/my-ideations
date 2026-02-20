'use client'

import { useState, type ComponentProps } from 'react'

import { cn } from '~/lib/utils'

export function DropArea({
  className,
  activeClassName,
  onFilesDrop,
  ...props
}: ComponentProps<'div'> & { activeClassName: string; onFilesDrop: (files: File[]) => void }) {
  const [isOver, setIsOver] = useState(false)

  const handleDrop = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault()
    if (ev.dataTransfer.files) {
      onFilesDrop(Array.from(ev.dataTransfer.files))
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
      {...props}
    />
  )
}

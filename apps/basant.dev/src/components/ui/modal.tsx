'use client'

import { createContext, type PropsWithChildren } from 'react'
import { usePathname } from 'next/navigation'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'

export const ModalContext = createContext(false)

export type ModalProps = {
  path: string
  title?: string
  description?: string
  className?: string
  onClose?: () => void
}

export function Modal(props: PropsWithChildren<ModalProps>) {
  const pathname = usePathname()

  const isActive = pathname.startsWith(props.path)
  if (!isActive) return null

  return (
    <Dialog
      defaultOpen
      onOpenChange={(open) => {
        if (open) return
        props.onClose?.()
        window.history.back()
      }}>
      <DialogContent className={props.className}>
        {props.title && (
          <DialogHeader>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogDescription>{props.description}</DialogDescription>
          </DialogHeader>
        )}
        <ModalContext value={true}>{props.children}</ModalContext>
      </DialogContent>
    </Dialog>
  )
}

import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'

export const metadata: Metadata = {
  title: '404 Not Found',
  description: 'Page not found',
}

export const instant = false

export default function NotFoundPage() {
  notFound()
}

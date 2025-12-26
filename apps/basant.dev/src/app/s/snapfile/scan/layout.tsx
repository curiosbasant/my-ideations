import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scan QR',
  description: 'Download file by scanning the QR Code',
}

export default function SnapFileScanQrCodeLayout(props: LayoutProps<'/s/snapfile/scan'>) {
  return props.children
}

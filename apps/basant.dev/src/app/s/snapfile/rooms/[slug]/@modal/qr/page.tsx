import { Modal } from '~/components/ui/modal'
import { QrRoomFileUpload } from '~/features/snapfile/components/qr-room-file-upload'

export default async function QrRoomModal(props: PageProps<'/s/snapfile/rooms/[slug]/qr'>) {
  const { slug } = await props.params

  return (
    <Modal
      className='w-auto'
      path={`/rooms/${slug}/qr`}
      title='Scan Room QR'
      description='Use the qr to scan and upload file directly from another device'>
      <QrRoomFileUpload slug={slug} />
    </Modal>
  )
}

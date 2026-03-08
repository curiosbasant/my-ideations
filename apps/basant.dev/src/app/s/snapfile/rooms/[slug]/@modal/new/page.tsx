import { Modal } from '~/components/ui/modal'
import { FileUploaderRoom } from '~/features/snapfile/components/file-uploader-room'

export default async function RoomNewFileModal(props: PageProps<'/s/snapfile/rooms/[slug]/new'>) {
  const { slug } = await props.params

  return (
    <Modal
      path={`/rooms/${slug}/new`}
      title='Upload File'
      description='Remember the uploaded file is always public, never share any confidential file to anyone.'>
      <FileUploaderRoom slug={slug} />
    </Modal>
  )
}

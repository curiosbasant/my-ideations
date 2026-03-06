import { Button } from '~/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogProvider,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'

export default function UploadFileModalButtonLayout(props: LayoutProps<'/s/snapfile'>) {
  return (
    <DialogProvider>
      <DialogTrigger asChild>
        <Button className='ms-auto'>Upload Format</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload New Format</DialogTitle>
          <DialogDescription>
            Drag and drop your file here or click to select a file to upload.
          </DialogDescription>
        </DialogHeader>
        {props.children}
      </DialogContent>
    </DialogProvider>
  )
}

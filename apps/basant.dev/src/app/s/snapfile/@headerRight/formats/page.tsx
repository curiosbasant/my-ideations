import { Button } from '~/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogProvider,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { FileUploadModalViews } from './client'

export default function UploadFileModalButtonPage() {
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
        <FileUploadModalViews />
      </DialogContent>
    </DialogProvider>
  )
}

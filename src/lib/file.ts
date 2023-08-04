import Zip from 'jszip'

export async function zipFiles(files: File[]) {
  const zip = new Zip()
  for (const file of files) {
    zip.file(file.name, file)
  }

  const zipBlob = await zip.generateAsync({ type: 'blob', compressionOptions: { level: 6 } })
  return new File([zipBlob], `combined-${Date.now()}.zip`)
}

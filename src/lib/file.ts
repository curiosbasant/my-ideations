import Zip from 'jszip'

export async function zipFiles(files: File[]) {
  const zip = new Zip()
  for (const file of files) {
    zip.file(file.name, file)
  }

  const data = await zip.generateAsync({ type: 'blob', compressionOptions: { level: 6 } })
  return new File([data], `combined-${Date.now()}.zip`)
}

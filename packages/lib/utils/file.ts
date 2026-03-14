import * as xlsx from 'xlsx'

export async function extractDataFromSheet<T>(
  file: { arrayBuffer: () => Promise<ArrayBuffer> },
  sheetNameOrIndex?: string | number,
) {
  const buffer = await file.arrayBuffer()
  const workbook = xlsx.read(buffer, { type: 'array', raw: true })
  const sheetName =
    typeof sheetNameOrIndex === 'string' ? sheetNameOrIndex : (
      workbook.SheetNames[sheetNameOrIndex || 0]
    )
  const sheet = workbook.Sheets[sheetName]
  const data = xlsx.utils.sheet_to_json<T>(sheet, {
    defval: '', // prevents missing cells from becoming undefined
  })

  return data
}

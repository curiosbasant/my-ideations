import { prettifyText } from '~/lib/utils'

export type ResultInput = {
  board?: 'rj'
  year: string
  standard: string
  roll: string
}

export async function getResult(payload: ResultInput) {
  const data = await fetchResult(payload)
  if (!data || !data.ROLL_NO) return null

  const subjects = []
  for (let i = 1; i < 7; i++) {
    const subjectName = data[`SC${i}`] as string
    if (!subjectName) continue
    subjects.push({
      name: prettifyText(subjectName),
      theoryMarks: data[`SC${i}P1`] as string,
      sessionalMarks: data[`SC${i}P3`] as string,
      totalMarksText: data[`TOT${i}`] as string,
      totalMarks: Number.parseInt(data[`TOT${i}`]),
    })
  }

  return {
    roll: data.ROLL_NO as number,
    name: data.CAN_NAME as string,
    fName: data.FNAME as string,
    mName: data.MNAME as string,
    school: prettifyText(data.CENT_NAME as string),
    stream: data.GROUP as string,
    division: data.RESULT as string,
    percentage: Number.parseFloat(data.PER),
    percentageText: `${Number.parseFloat(data.PER).toFixed(2)}%`,
    marksObtained: Number.parseInt(data.TOT_MARKS),
    marksText: data.TOT_MARKS as string,
    subjects,
  }
}

async function fetchResult(payload: ResultInput) {
  const searchParams = new URLSearchParams({
    board: payload.board || 'rj',
    year: payload.year,
    std: payload.standard,
    roll_no: payload.roll,
  })
  return fetch(`https://boardresultapi${payload.standard}.amarujala.com/result?${searchParams}`, {
    cache: 'force-cache',
  }).then((res) => res.json())
}

export type ResultOutput = NonNullable<Awaited<ReturnType<typeof getResult>>>

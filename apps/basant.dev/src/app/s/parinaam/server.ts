import { prettifyText } from '~/lib/utils'

export type ResultInput = {
  board?: 'rj'
  year: string
  standard: string
  roll: string
}

export async function getResult(payload: ResultInput) {
  const data = await fetchResult(payload)
  if (!data?.['ROLL_NO']) return null

  const subjects = []
  for (let i = 1; i < 15; i++) {
    const subjectName = data[`SC${i}`]
    if (!subjectName) continue
    subjects.push({
      name: prettifyText(subjectName),
      theoryMarks: data[`SC${i}P1`],
      sessionalMarks: data[`SC${i}P3`],
      totalMarks: data[`TOT${i}`] ? Number.parseInt(data[`TOT${i}`]!) : 0,
    })
  }

  const percentage = data['PER'] ? Number.parseFloat(data['PER']) : 0
  return {
    roll: data['ROLL_NO'] as unknown as number,
    name: data['CAN_NAME'],
    fName: data['FNAME'],
    mName: data['MNAME'],
    school: data['CENT_NAME'] && prettifyText(data['CENT_NAME']),
    stream: data['GROUP'] || null,
    division: data['RESULT'] || '',
    percentage,
    percentageText: `${percentage.toFixed(2)}%`,
    marksObtained: data['TOT_MARKS'] ? Number.parseInt(data['TOT_MARKS']) : 0,
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
  }).then<Record<string, string>>((res) => res.json())
}

export type ResultOutput = NonNullable<Awaited<ReturnType<typeof getResult>>>

import { NextRequest, NextResponse } from 'next/server'
import { getResult, type ResultInput } from '../../server'

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const year = params.get('year')
  const standard = params.get('standard')
  const roll = params.get('roll')

  if (!standard || !roll) return NextResponse.json({ success: false })

  const iterator = makeIterator({ board: 'rj', year: year ?? '2025', standard, roll })
  const stream = iteratorToStream(iterator)

  return new Response(stream)
}

function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()
      if (done) {
        if (value === null) controller.error(new Error('Invalid data provided!'))
        controller.close()
      } else {
        controller.enqueue(JSON.stringify(value) + '<SPLIT>')
      }
    },
  })
}

async function* makeIterator(data: ResultInput) {
  const firstResult = await getResult(data)
  if (!firstResult) return null
  yield firstResult

  const resultSequence = generateResultSequence(data)

  for (;;) {
    for await (const result of take(resultSequence, 5)) {
      if (result && firstResult.school === result.school) {
        yield result
      } else {
        return
      }
    }
  }
}

function* generateResultSequence(data: ResultInput) {
  for (let currentRoll = Number.parseInt(data.roll) + 1; ; currentRoll++) {
    yield getResult({ ...data, roll: currentRoll.toString() })
  }
}

function* take<T>(iterator: Iterator<T>, limit: number) {
  while (limit--) {
    const { done, value } = iterator.next()
    if (done) return
    yield value
  }
}

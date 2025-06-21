'use client'

import { useMemo, useRef, useState } from 'react'
import { useToggle } from '@curiosbasant/react-compooks'

class Puzzle {
  moves = 0
  position: number[]
  status!: 'start' | 'complete'

  constructor(
    readonly rows = 4,
    readonly cols = rows,
  ) {
    this.position = Array.from(Array(rows * cols), (_, i) => i)
    this.restart()
  }
  slideTile(pos: number) {
    if (pos == this.empty || this.status == 'complete') return

    const locRC = this.toRC(pos),
      empRC = this.toRC(this.empty)

    let offset = 1
    if (locRC.r == empRC.r) {
    } else if (locRC.c == empRC.c) {
      offset = this.cols
    } else return

    const direction = offset * (pos < this.empty ? 1 : -1)
    for (let e = this.empty; e != pos; ) {
      e -= direction
      const t = this.position.indexOf(e)
      this.position[t] = this.empty
      this.empty = e
    }
    this.moves++
    if (this.checkCompleted()) {
      this.status = 'complete'
    }
  }
  _slideTile(index: number) {
    const loc = this.position[index]
    if (loc == this.empty) return

    const locRC = this.toRC(loc),
      empRC = this.toRC(this.empty)

    let offset = 1
    if (locRC.r == empRC.r) {
    } else if (locRC.c == empRC.c) {
      offset = this.cols
    } else return

    const direction = offset * (loc < this.empty ? 1 : -1)
    for (let t = index; this.position[t] != this.empty; ) {
      const tgt = this.position[t] + direction,
        pt = t
      t = this.position.indexOf(tgt)
      this.position[pt] = tgt
    }
    this.empty = loc
  }
  restart() {
    this.status = 'start'
  }
  checkCompleted() {
    return this.position.every((p, i) => p == i)
  }
  getRandomTile(vertical = false): number {
    const r = (Math.random() * (vertical ? this.rows : this.cols)) | 0
    const ec = this.toRC(this.empty)
    if (r == ec[vertical ? 'r' : 'c']) return this.getRandomTile(vertical)

    if (vertical) {
      return r * this.cols + ec.c
    } else {
      return ec.r * this.cols + r
    }
  }
  get empty() {
    return this.position.at(-1)!
  }
  set empty(value) {
    this.position[this.position.length - 1] = value
  }
  toRC(num: number) {
    return { r: (num / this.cols) | 0, c: num % this.cols } as const
  }
}

export default function PuzzleGamePage() {
  const [rows, setRows] = useState(4)
  const [cols, setCols] = useState(4)
  const puzzle = useMemo(() => new Puzzle(rows, cols), [rows, cols])
  const [image, setBackground] = useState({
    src: '',
    size: 1,
    x: 0,
    y: 0,
  })
  const { current: config } = useRef({ isVert: Math.random() < 0.5, isShuffling: 0 })
  const [, forceRerender] = useToggle()

  function onTileClick(position: number) {
    if (position == puzzle.empty) {
      puzzle.restart()
    } else {
      puzzle.slideTile(position)
      forceRerender()
    }
  }
  function handleShuffle() {
    if (config.isShuffling) {
      clearInterval(config.isShuffling)
      config.isShuffling = 0
    } else {
      config.isShuffling = setInterval(() => {
        const rt = puzzle.getRandomTile(config.isVert)
        onTileClick(rt)
        config.isVert = !config.isVert
      }, 100) as unknown as number
    }
  }
  function updateBackground<T extends keyof typeof image>(key: T, value: (typeof image)[T]) {
    setBackground((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <section className='mx-auto max-w-xl rounded-md bg-white p-4 shadow-lg shadow-sky-200'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-3xl font-bold'>Puzzle</h2>
        <button
          className='rounded bg-sky-500 px-4 py-1 text-white'
          onClick={handleShuffle}
          data-balloon-up='Shuffle the Puzzle Balloon'
          // data-tooltip-top="Shuffle the Puzzle Tooltip"
          type='button'>
          Shuffle
        </button>
      </div>
      <div
        className='grid rounded-md border bg-slate-50 p-px shadow-inner'
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {(puzzle.status == 'complete' ? puzzle.position : puzzle.position.slice(0, -1)).map(
          (p, i) => {
            const pc = puzzle.toRC(p),
              ic = puzzle.toRC(i)
            const coords = { r: pc.r - ic.r, c: pc.c - ic.c }

            return (
              <PuzzleTile
                coords={coords}
                ic={ic}
                bg={image}
                colCount={cols}
                onInteract={() => onTileClick(p)}
                key={i}
              />
            )
          },
        )}
      </div>
      <div className='mt-4 space-y-4'>
        <div className='flex gap-4'>
          <label className=''>
            Rows:{' '}
            <input
              className='rounded-md'
              value={rows}
              onChange={(ev) => {
                setRows(+ev.currentTarget.value)
              }}
              name='puzzleRows'
              type='number'
            />
          </label>
          <label className=''>
            Cols:{' '}
            <input
              className='rounded-md'
              value={cols}
              onChange={(ev) => {
                setCols(+ev.currentTarget.value)
              }}
              name='puzzleCols'
              type='number'
            />
          </label>
        </div>
        <label className='flex items-center gap-2'>
          Image Size:
          <input
            className='flex-1'
            onChange={(ev) => {
              updateBackground('size', +ev.currentTarget.value)
            }}
            name='imageSize'
            value={image.size}
            min='0.01'
            max='2'
            step='0.01'
            list='bg-size-values'
            type='range'
          />
        </label>
        <datalist id='bg-size-values'>
          <option value='0.5' />
          <option value='1' />
          <option value='1.5' />
        </datalist>
        <label className='inline-block cursor-pointer rounded-full bg-sky-500 px-4 py-2 text-sky-50'>
          Upload Image
          <input
            className='absolute -left-[9999px]'
            onChange={(ev) => {
              const file = ev.currentTarget.files?.[0]
              if (!file) return
              updateBackground('src', URL.createObjectURL(file))
            }}
            name='puzzleImage'
            accept='image/png, image/jpeg'
            type='file'
          />
        </label>
      </div>
    </section>
  )
}

function PuzzleTile({ coords, ic, bg, colCount = 1, onInteract }: any) {
  return (
    <div
      className='relative aspect-square p-px transition duration-300 ease-out'
      style={{ transform: `translate(${coords.c}00%, ${coords.r}00%)` }}>
      <button
        className='flex h-full w-full items-center justify-center rounded-md border bg-white text-5xl font-semibold transition-colors hover:bg-slate-100'
        style={{
          backgroundImage: `url(${bg.src || '/spiral.jpg'})`,
          backgroundPosition: `${-ic.c * 100 + bg.x}% ${-ic.r * 100 + bg.y}%`,
          backgroundSize: colCount * 100 * bg.size + '%',
        }}
        onClick={onInteract}
        type='button'>
        {/* {i + 1} */}
      </button>
    </div>
  )
}

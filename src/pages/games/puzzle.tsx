import { Page } from "@/components/Page"
import type { NextPage } from "next"
import Link from "next/link"
import { useMemo, useRef, useState } from "react"

class Puzzle {
  moves = 0
  position: number[]
  status!: "start" | "complete"

  constructor(readonly rows = 4, readonly cols = rows) {
    this.position = Array.from(Array(rows * cols), (_, i) => i)
    this.restart()
  }
  slideTile(pos: number) {
    if (pos == this.empty || this.status == "complete") return

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
      this.status = "complete"
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
    this.status = "start"
  }
  checkCompleted() {
    return this.position.every((p, i) => p == i)
  }
  getRandomTile(vertical = false): number {
    const r = (Math.random() * (vertical ? this.rows : this.cols)) | 0
    const ec = this.toRC(this.empty)
    if (r == ec[vertical ? "r" : "c"]) return this.getRandomTile(vertical)

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

const PuzzleGamePage: NextPage = () => {
  const puzzle = useMemo(() => new Puzzle(4), [])
  const [positions, setpositions] = useState(puzzle.position)
  const { current: config } = useRef({ isVert: Math.random() < 0.5, isShuffling: 0 })

  function onTileClick(position: number) {
    if (position == puzzle.empty) {
      puzzle.restart()
    } else {
      puzzle.slideTile(position)
      if (puzzle.status == "complete") {
        setpositions(puzzle.position)
      } else {
        setpositions(puzzle.position.slice(0, -1))
      }
    }
  }
  function handleShuffle() {
    if (config.isShuffling) {
      clearInterval(config.isShuffling)
      config.isShuffling = 0
    } else {
      config.isShuffling = setInterval(() => {
        console.log("first")
        const rt = puzzle.getRandomTile(config.isVert)
        onTileClick(rt)
        config.isVert = !config.isVert
      }, 100) as unknown as number
    }
  }

  return (
    <Page title="Puzzle Game">
      <div className="min-h-screen  bg-slate-50 py-20 text-slate-500">
        <section className="mx-auto max-w-xl rounded border bg-white p-4 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-4xl font-bold">Puzzle</h2>
            <button
              className=" rounded bg-blue-500 px-4 py-1 text-white"
              onClick={handleShuffle}
              data-balloon-up="Shuffle the Puzzle Balloon"
              // data-tooltip-top="Shuffle the Puzzle Tooltip"
              type="button">
              Shuffle
            </button>
          </div>
          <div
            className="grid rounded border bg-slate-50 p-px shadow-inner"
            style={{ gridTemplateColumns: `repeat(${puzzle.cols}, 1fr)` }}>
            {positions.map((p, i) => {
              const pc = puzzle.toRC(p),
                ic = puzzle.toRC(i)
              const coords = { r: pc.r - ic.r, c: pc.c - ic.c }

              return (
                <PuzzleTile coords={coords} ic={ic} onInteract={() => onTileClick(p)} key={i} />
              )
            })}
          </div>
        </section>
      </div>
    </Page>
  )
}

function PuzzleTile({ coords, ic, onInteract }) {
  return (
    <div
      className="relative aspect-square p-px transition duration-300 ease-out"
      style={{ transform: `translate(${coords.c}00%, ${coords.r}00%)` }}>
      <button
        className="flex h-full w-full items-center justify-center rounded border bg-white bg-[image:url(/lion-wallpaper.jpg)] bg-[percentage:750%] text-5xl font-semibold transition-colors hover:bg-slate-100"
        style={{
          backgroundPosition: `-${ic.c}00% -${ic.r}00%`,
        }}
        onClick={onInteract}
        type="button">
        {/* {i + 1} */}
      </button>
    </div>
  )
}

export default PuzzleGamePage

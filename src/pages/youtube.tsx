import Page from "components/Page"
import { NextPage } from "next"
import { useRef, useState } from "react"
import { useImmer } from "use-immer"

const YoutubePage: NextPage = () => {
  return (
    <Page title="Youtube">
      <div className="h-screen overflow-hidden bg-gray-700">
        <div className="sticky top-0">
          <header className="h-16 bg-gray-900/75"></header>
        </div>
        <div
          className={"grid h-full gap-6  overflow-y-auto p-6"}
          style={{ gridTemplateColumns: "1fr 26rem", gridTemplateRows: "auto 1fr" }}>
          <VideoDisplay />

          <div className="row-start-2 divide-y divide-gray-500">
            <section id="video-metada" className="pb-4">
              <div className="text-xs text-blue-500">#citiesSkylins #ilebay</div>
              <h1 className="text-lg text-white"></h1>
              <div className="">
                <span className="text-gray-400 ">42,923 views &bull; 16-Oct-2021</span>
              </div>
            </section>
            <section id="channel-metada" className="py-4 ">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-500 shadow-inner"></div>
                <div className="flex-1">
                  <p className="text-white">two dollars twenty</p>
                  <span className="text-sm text-gray-400">1.24 lakh subscribers</span>
                </div>
                <div className="">
                  <button className="rounded bg-red-600 px-4 py-2 uppercase text-white ">
                    Subscribe
                  </button>
                </div>
              </div>
              <div className="mt-4 ml-16 space-y-4">
                <p className="text-white">
                  My Website | www.twodollarstwenty.com Support the Channel by Becoming a Patron
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-gray-900"></div>
                  <div className="h-24 bg-gray-900"></div>
                </div>
                <button className="text-xs uppercase text-gray-400">Show More</button>
              </div>
            </section>
            <section id="video-comments" className="h-96 py-4"></section>
          </div>

          <aside id="related-videos" className="row-span-2">
            <div className="">
              <ul className="flex space-x-2 overflow-x-auto">
                <li className="">
                  <div className="truncate rounded-full bg-gray-50 px-4 py-1 text-gray-900">
                    All
                  </div>
                </li>
                {[...Array(10)].map((_, i) => (
                  <li className="" key={i}>
                    <div className="truncate rounded-full bg-gray-500/75 px-4 py-1 text-white">
                      kuch hibi
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <ul className="mt-4 space-y-2">
              {[...Array(10)].map((_, i) => (
                <li className="group flex space-x-2" key={i}>
                  <div
                    className="w-2/5 bg-gray-600 shadow-inner"
                    style={{ aspectRatio: "16/9" }}></div>
                  <div className="flex-1">
                    <h3 className="text-white">Support the Channel by Becoming a Patron</h3>
                    <span className="text-sm leading-none text-gray-400">
                      Fireship <span className="icon text-base">check_circle</span>
                    </span>
                    <br />
                    <span className="text-sm leading-none text-gray-400">
                      3.7 lakh views 3 months ago
                    </span>
                  </div>
                  <div className="">
                    <button className="icon hidden group-hover:inline-block">more_vert</button>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </Page>
  )
}

export default YoutubePage

function VideoDisplay() {
  const [state, setState] = useImmer({
    isCinemaMode: false,
    isMuted: false,

    volume: 1,
    time: 0,
    duration: 0,
    formattedDuration: "00",
  })
  const [isCinemaMode, setIsCinemaMode] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  console.log(videoRef.current?.duration)
  return (
    <main
      className={`relative ${
        isCinemaMode ? "col-span-2 -m-6 mb-0 aspect-[15/7]" : "aspect-video"
      } bg-black`}>
      <video
        ref={videoRef}
        className="mx-auto h-full"
        src="/assets/videos/discord_tut.mp4"
        // onPlay
        onVolumeChange={({ currentTarget: video }) => {
          console.log(`video.volume`, video.volume)
          setState((prev) => {
            prev.isMuted = video.muted
            prev.volume = video.volume
          })
        }}
        onTimeUpdate={({ currentTarget: video }) => {
          setState((prev) => {
            prev.time = video.currentTime
          })
        }}
        onPlaying={(ev) => {
          // console.log("object")
        }}
        onLoadedMetadata={({ currentTarget: video }) => {
          setState((prev) => {
            prev.duration = video.duration
            prev.formattedDuration = formatTime(video.duration)
          })
        }}></video>

      <div className="absolute inset-0 flex flex-col bg-gradient-to-b from-black/50 via-transparent to-black/50 px-4">
        <div className=""></div>
        <div className="flex-1"></div>
        <div className="">
          <div
            className="h-1 cursor-pointer bg-gray-50"
            onClick={({ currentTarget: seekBar, clientX }) => {
              if (videoRef.current) {
                const rect = seekBar.getBoundingClientRect()
                const x = clientX - rect.left
                videoRef.current.currentTime = (x * videoRef.current.duration) / seekBar.clientWidth
              }
            }}>
            <div
              className="pointer-events-none h-full bg-red-500"
              style={{ width: (state.time * 100) / state.duration + "%" }}></div>
          </div>
          <div className="flex items-center space-x-3 py-3 text-white">
            <button
              className="icon text-4xl leading-none"
              onClick={() => {
                const video = videoRef.current!
                video.paused ? video.play() : video.pause()
              }}>
              play_arrow
            </button>
            <div className="group contents">
              <button
                className="icon ml-3 group-hover:mr-2"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.muted = !videoRef.current.muted
                  }
                }}>
                {state.isMuted ? "volume_off" : "volume_up"}
              </button>
              <div
                className="h-5 w-0 bg-gray-400/75 bg-clip-content opacity-0 transition-all group-hover:w-20 group-hover:py-2 group-hover:opacity-100"
                onClick={({ currentTarget: volumeBar, clientX }) => {
                  if (videoRef.current) {
                    const rect = volumeBar.getBoundingClientRect()
                    const x = clientX - rect.left
                    videoRef.current.volume = x / volumeBar.clientWidth
                  }
                }}>
                <div
                  className="pointer-events-none relative h-full bg-white after:absolute after:top-1/2 after:right-0 after:translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-white after:p-1.5 after:shadow-sm"
                  style={{ width: state.volume * 100 + "%" }}></div>
              </div>
            </div>

            <div className="text-sm">
              {formatTime(state.time)} / {state.formattedDuration}
            </div>

            <span className="!ml-auto"></span>
            <button
              className="icon"
              onClick={() => {
                setIsCinemaMode(!isCinemaMode)
              }}>
              settings
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

function formatTime(secs: number | null) {
  if (secs == null) return "00"
  const time = new Date(secs * 1000)
  const hh = time.getUTCHours()
  const mm = time.getUTCMinutes()
  const ss = time.getUTCSeconds()
  return (hh > 0 ? hh + ":" : "") + `${mm}:${ss.toString().padStart(2, "0")}`
}

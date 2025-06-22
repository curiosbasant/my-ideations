'use client'

import { useRef, useState } from 'react'
import { PlayIcon, SettingsIcon, Volume2Icon, VolumeXIcon } from 'lucide-react'

export function VideoDisplay() {
  const [state, setState] = useState({
    isCinemaMode: false,
    isMuted: false,

    volume: 1,
    time: 0,
    duration: 0,
    formattedDuration: '00',
  })
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <main
      className={`relative ${
        state.isCinemaMode ? 'aspect-15/7 col-span-2 -m-6 mb-0' : 'aspect-video'
      } bg-black`}>
      <video
        ref={videoRef}
        className='mx-auto h-full'
        src='/assets/videos/discord_tut.mp4'
        // onPlay
        onVolumeChange={({ currentTarget: video }) => {
          console.log(`video.volume`, video.volume)
          setState((prev) => ({ ...prev, isMuted: video.muted, volume: video.volume }))
        }}
        onTimeUpdate={({ currentTarget: video }) => {
          setState((prev) => ({ ...prev, time: video.currentTime }))
        }}
        onPlaying={() => {
          // console.log("object")
        }}
        onLoadedMetadata={({ currentTarget: video }) => {
          setState((prev) => ({
            ...prev,
            duration: video.duration,
            formattedDuration: formatTime(video.duration),
          }))
        }}></video>

      <div className='absolute inset-0 flex flex-col bg-gradient-to-b from-black/50 via-transparent to-black/50 px-4'>
        <div className=''></div>
        <div className='flex-1'></div>
        <div className=''>
          <div
            className='h-1 cursor-pointer bg-gray-50'
            onClick={({ currentTarget: seekBar, clientX }) => {
              if (videoRef.current) {
                const rect = seekBar.getBoundingClientRect()
                const x = clientX - rect.left
                videoRef.current.currentTime = (x * videoRef.current.duration) / seekBar.clientWidth
              }
            }}>
            <div
              className='pointer-events-none h-full bg-red-500'
              style={{ width: (state.time * 100) / state.duration + '%' }}></div>
          </div>
          <div className='flex items-center gap-3 py-3 text-white'>
            <button
              onClick={() => {
                const video = videoRef.current!
                video.paused ? video.play() : video.pause()
              }}>
              <PlayIcon />
            </button>
            <div className='group contents'>
              <button
                className='ms-3 group-hover:me-2'
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.muted = !videoRef.current.muted
                  }
                }}>
                {state.isMuted ?
                  <VolumeXIcon />
                : <Volume2Icon />}
              </button>
              <div
                className='h-5 w-0 bg-gray-400/75 bg-clip-content opacity-0 transition-all group-hover:w-20 group-hover:py-2 group-hover:opacity-100'
                onClick={({ currentTarget: volumeBar, clientX }) => {
                  if (videoRef.current) {
                    const rect = volumeBar.getBoundingClientRect()
                    const x = clientX - rect.left
                    videoRef.current.volume = x / volumeBar.clientWidth
                  }
                }}>
                <div
                  className='pointer-events-none relative h-full bg-white after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:translate-x-1/2 after:rounded-full after:bg-white after:p-1.5 after:shadow-sm'
                  style={{ width: state.volume * 100 + '%' }}></div>
              </div>
            </div>

            <div className='text-sm'>
              {formatTime(state.time)} / {state.formattedDuration}
            </div>

            <span className='!ml-auto'></span>
            <button
              onClick={() => {
                setState((prev) => ({ ...prev, isCinemaMode: !prev.isCinemaMode }))
              }}>
              <SettingsIcon />
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

function formatTime(secs: number | null) {
  if (secs == null) return '00'
  const time = new Date(secs * 1000)
  const hh = time.getUTCHours()
  const mm = time.getUTCMinutes()
  const ss = time.getUTCSeconds()
  return (hh > 0 ? hh + ':' : '') + `${mm}:${ss.toString().padStart(2, '0')}`
}

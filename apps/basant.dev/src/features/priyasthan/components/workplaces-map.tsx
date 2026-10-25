'use client'

import 'maplibre-gl/dist/maplibre-gl.css'

import { startTransition, Suspense, useId, useOptimistic } from 'react'
import Map, { Marker } from '@vis.gl/react-maplibre'

import { Query } from '@my/core/trpc/query'

import { saveWorkplace } from '../actions'

type Location = {
  profileId: string
  addressId: string
  latitude: number
  longitude: number
  type: `${'current' | 'preferred'}-workplace`
}

export function WorkplacesMap(props: { userProfileId: string; locations: Location[] }) {
  const [optimisticMarkers, setOptimisticMarker] = useOptimistic(
    props.locations,
    (prev, payload: { lat: number; lng: number; index?: number }) => {
      if (typeof payload.index === 'number') {
        return prev.with(payload.index, {
          ...prev[payload.index]!,
          latitude: payload.lat,
          longitude: payload.lng,
        })
      }
      return prev.concat({
        profileId: props.userProfileId,
        addressId: '0',
        type: prev.length ? 'preferred-workplace' : 'current-workplace',
        latitude: payload.lat,
        longitude: payload.lng,
      })
    },
  )

  const setMarker: typeof setOptimisticMarker = (...args) => {
    const [{ lat, lng, index }] = args
    const addressId = typeof index === 'number' && optimisticMarkers[index]?.addressId

    startTransition(() => {
      setOptimisticMarker(...args)
      startTransition(async () => {
        await saveWorkplace(
          addressId ?
            {
              addressId,
              latitude: lat,
              longitude: lng,
            }
          : {
              latitude: lat,
              longitude: lng,
              type: optimisticMarkers.length ? 'preferred-workplace' : 'current-workplace',
            },
        )
      })
    })
  }
  const markerOffset: [number, number] = [0, 9]

  return (
    <Map
      initialViewState={{
        latitude: 26.5,
        longitude: 74.25,
        zoom: 6.25,
      }}
      mapStyle='https://tiles.openfreemap.org/styles/bright'
      onClick={(ev) => {
        setMarker(ev.lngLat)
      }}>
      {optimisticMarkers.map((loc, index) => (
        <Marker
          longitude={loc.longitude}
          latitude={loc.latitude}
          draggable
          anchor='bottom'
          offset={markerOffset}
          onDragEnd={(ev) => {
            setMarker({ lat: ev.lngLat.lat, lng: ev.lngLat.lng, index })
          }}
          key={`${loc.addressId} ${loc.profileId}`}>
          <MapMarker
            color={
              loc.type === 'current-workplace' ? 'red'
              : loc.type === 'preferred-workplace' ?
                'deepskyblue'
              : 'blueviolet'
            }
            profileId={loc.profileId}
          />
        </Marker>
      ))}
    </Map>
  )
}
function MapMarker(props: { color: string; profileId: string }) {
  const compId = useId()

  return (
    <svg className='size-16' display='block' height='41px' width='27px' viewBox='0 0 27 41'>
      <defs>
        <clipPath id={'circleView' + compId}>
          <circle cx='5.5' cy='5.5' r='10' />
        </clipPath>
      </defs>
      <g fillRule='nonzero'>
        <g transform='translate(3.0, 29.0)' fill='#000000'>
          <ellipse opacity='0.04' cx='10.5' cy='5.80029008' rx='10.5' ry='5.25002273'></ellipse>
          <ellipse opacity='0.04' cx='10.5' cy='5.80029008' rx='10.5' ry='5.25002273'></ellipse>
          <ellipse opacity='0.04' cx='10.5' cy='5.80029008' rx='9.5' ry='4.77275007'></ellipse>
          <ellipse opacity='0.04' cx='10.5' cy='5.80029008' rx='8.5' ry='4.29549936'></ellipse>
          <ellipse opacity='0.04' cx='10.5' cy='5.80029008' rx='7.5' ry='3.81822308'></ellipse>
          <ellipse opacity='0.04' cx='10.5' cy='5.80029008' rx='6.5' ry='3.34094679'></ellipse>
          <ellipse opacity='0.04' cx='10.5' cy='5.80029008' rx='5.5' ry='2.86367051'></ellipse>
          <ellipse opacity='0.04' cx='10.5' cy='5.80029008' rx='4.5' ry='2.38636864'></ellipse>
        </g>
        <g fill={props.color}>
          <path d='M27,13.5 C27,19.074644 20.250001,27.000002 14.75,34.500002 C14.016665,35.500004 12.983335,35.500004 12.25,34.500002 C6.7499993,27.000002 0,19.222562 0,13.5 C0,6.0441559 6.0441559,0 13.5,0 C20.955844,0 27,6.0441559 27,13.5 Z'></path>
        </g>
        <g fill='#000000' opacity='0.25'>
          <path d='M13.5,0 C6.0441559,0 0,6.0441559 0,13.5 C0,19.222562 6.7499993,27 12.25,34.5 C13,35.522727 14.016664,35.500004 14.75,34.5 C20.250001,27 27,19.074644 27,13.5 C27,6.0441559 20.955844,0 13.5,0 Z M13.5,1 C20.415404,1 26,6.584596 26,13.5 C26,15.898657 24.495584,19.181431 22.220703,22.738281 C19.945823,26.295132 16.705119,30.142167 13.943359,33.908203 C13.743445,34.180814 13.612715,34.322738 13.5,34.441406 C13.387285,34.322738 13.256555,34.180814 13.056641,33.908203 C10.284481,30.127985 7.4148684,26.314159 5.015625,22.773438 C2.6163816,19.232715 1,15.953538 1,13.5 C1,6.584596 6.584596,1 13.5,1 Z'></path>
        </g>
        <g transform='translate(8.0, 8.0)'>
          <circle fill='#000000' opacity='0.25' cx='5.5' cy='5.5' r='11' />
          <Suspense>
            <Query
              options={(api) => api.user.profile.get.queryOptions({ profileId: props.profileId })}>
              {(data) =>
                data.avatarUrl && (
                  <image
                    x='-4.5'
                    y='-4.5'
                    width='20'
                    height='20'
                    href={data.avatarUrl}
                    clipPath={`url(#circleView${compId})`}
                    preserveAspectRatio='xMidYMid slice'
                  />
                )
              }
            </Query>
          </Suspense>
        </g>
      </g>
    </svg>
  )
}

'use client'

import 'maplibre-gl/dist/maplibre-gl.css'

import { useState } from 'react'
import { Map, Marker } from '@vis.gl/react-maplibre'

export function RajMap(props: {
  locations: {
    id: string
    profileId: number
    latitude: number
    longitude: number
    type: 'current-workplace' | 'preferred-workplace'
  }[]
}) {
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(1)

  return (
    <Map
      initialViewState={{
        latitude: 27.391277,
        longitude: 73.432617,
        zoom: 6,
      }}
      mapStyle='https://tiles.openfreemap.org/styles/bright'>
      {props.locations.map((loc) => (
        <Marker
          longitude={loc.longitude}
          latitude={loc.latitude}
          color={loc.type === 'current-workplace' ? 'red' : 'skyblue'}
          opacity={loc.profileId === selectedProfileId ? '1' : '0.5'}
          scale={loc.profileId === selectedProfileId ? 1.5 : 1}
          onClick={() => {
            console.log(loc)
            loc.type === 'current-workplace' && setSelectedProfileId(loc.profileId)
          }}
          key={loc.id + loc.profileId + (loc.profileId === selectedProfileId)}
        />
      ))}
    </Map>
  )
}

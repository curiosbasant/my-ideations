'use client'

import 'maplibre-gl/dist/maplibre-gl.css'

import { startTransition, useOptimistic } from 'react'
import { Map, Marker } from '@vis.gl/react-maplibre'

import { saveWorkplace } from './server.action'

type Location = {
  profileId?: number
  addressId: number
  latitude: number
  longitude: number
  type: `${'current' | 'preferred'}-workplace`
}

export function MapWork(props: { locations: Location[] }) {
  const [optimisticMarkers, setOptimisticMarker] = useOptimistic(
    props.locations,
    (prev, payload: { lat: number; lng: number; index?: number }) => {
      if (typeof payload.index === 'number') {
        return prev.with(payload.index, {
          ...prev[payload.index],
          latitude: payload.lat,
          longitude: payload.lng,
        })
      }
      return prev.concat({
        addressId: 0,
        type: prev.length ? 'preferred-workplace' : 'current-workplace',
        latitude: payload.lat,
        longitude: payload.lng,
      })
    },
  )

  const setMarker: typeof setOptimisticMarker = (...args) => {
    startTransition(() => {
      setOptimisticMarker(...args)
      startTransition(async () => {
        await saveWorkplace(
          typeof args[0].index === 'number' ?
            {
              addressId: optimisticMarkers[args[0].index].addressId,
              latitude: args[0].lat,
              longitude: args[0].lng,
            }
          : {
              latitude: args[0].lat,
              longitude: args[0].lng,
              type: optimisticMarkers.length ? 'preferred-workplace' : 'current-workplace',
            },
        )
      })
    })
  }

  return (
    <Map
      initialViewState={{
        latitude: 27.391277,
        longitude: 73.432617,
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
          color={loc.type === 'current-workplace' ? 'red' : 'blue'}
          draggable
          onDragEnd={(ev) => {
            setMarker({ lat: ev.lngLat.lat, lng: ev.lngLat.lng, index })
          }}
          key={`${loc.addressId} ${loc.profileId}`}
        />
      ))}
    </Map>
  )
}

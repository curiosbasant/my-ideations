'use client'

import 'maplibre-gl/dist/maplibre-gl.css'

import { startTransition, use, useOptimistic, useRef, useState } from 'react'
import { Map, Marker, Popup } from '@vis.gl/react-maplibre'
import { Check, ChevronsUpDownIcon, LoaderCircleIcon } from 'lucide-react'

import { useAction } from '~/app/client'
import { Button } from '~/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { getDepartmentDesignations, saveWorkplace } from './server.action'

type Location = {
  profileId?: number
  addressId: number
  latitude: number
  longitude: number
  type: `${'current' | 'preferred'}-workplace`
}

export function MapWorkPlaces(props: { locations: Location[] }) {
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
  const c = {
    height: 35.5,
    width: 26,
    backgroundImage: 'url(/public/markers.png)',
    backgroundPositionX: '-35px',
  }
  const p = { height: 35.5, width: 26, backgroundImage: 'url(/public/markers.png)' }
  return (
    <Map
      initialViewState={{
        latitude: 26.5,
        longitude: 74.25,
        zoom: 6.25,
      }}
      mapStyle='https://tiles.openfreemap.org/styles/bright'
      onClick={(ev) => {
        // setMarker(ev.lngLat)
      }}>
      <Popup longitude={74} latitude={26}>
        Tooltip
      </Popup>
      <Marker longitude={75} latitude={25} draggable></Marker>
      {optimisticMarkers.map((loc, index) => (
        <Marker
          longitude={loc.longitude}
          latitude={loc.latitude}
          color={
            loc.type === 'current-workplace' ? 'red'
            : loc.type === 'preferred-workplace' ?
              'deepskyblue'
            : 'blueviolet'
          }
          draggable
          onDragEnd={(ev) => {
            setMarker({ lat: ev.lngLat.lat, lng: ev.lngLat.lng, index })
          }}
          key={`${loc.addressId} ${loc.profileId}`}>
          <div className='bg-cover opacity-50' style={loc.type === 'current-workplace' ? c : p} />
          <span className='text-lg'>{loc.profileId}</span>
        </Marker>
      ))}
    </Map>
  )
}

export function DepartmentDesignation(props: {
  departments: Promise<{ id: number; name: string }[]>
  defaultDepartmentId?: number
  defaultDesignation?: string
}) {
  const { isPending, state, actionTransition } = useAction({
    actionFn: getDepartmentDesignations,
  })

  return (
    <>
      <div className='space-y-2'>
        <Label>Department</Label>
        <SelectDepartment
          currentDepartment={props.defaultDepartmentId || 0}
          departments={props.departments}
          onSelect={(departmentId) => {
            actionTransition({ departmentId })
          }}
        />
      </div>
      <div className='space-y-2'>
        <Label>Designation</Label>
        {state?.data?.length ?
          <SelectDesignation
            defaultValue={props.defaultDesignation}
            loading={isPending}
            designations={state.data}
          />
        : <Input
            className='bg-background'
            name='designation'
            defaultValue={props.defaultDesignation}
          />
        }
      </div>
    </>
  )
}

function SelectDesignation(props: {
  defaultValue?: string
  loading: boolean
  designations: { id: number; name: string; count: number }[]
}) {
  const [value, setValue] = useState(props.defaultValue || '')
  const [open, setOpen] = useState(false)
  const searchDesignationRef = useRef<HTMLInputElement>(null)

  return (
    <Popover open={!props.loading && open} onOpenChange={setOpen}>
      <input name='designation' value={value} type='hidden' />
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={!props.loading && open}
          className='w-full justify-between text-start'>
          <span className='line-clamp-1 flex-1'>{value || 'Select your designation...'}</span>
          {props.loading ?
            <LoaderCircleIcon className='size-4 animate-spin opacity-50' />
          : <ChevronsUpDownIcon className='size-4 opacity-50' />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-(--radix-popper-anchor-width) min-w-xs p-0' align='start'>
        <Command>
          <CommandInput
            ref={searchDesignationRef}
            placeholder='Search for your designation...'
            className='h-9'
          />
          <CommandList>
            <CommandEmpty className='py-2 text-center'>
              <Button
                size='sm'
                onClick={() => {
                  searchDesignationRef.current && setValue(searchDesignationRef.current.value)
                  setOpen(false)
                }}
                type='button'>
                Add Designation
              </Button>
            </CommandEmpty>
            {props.designations.map((department) => (
              <CommandItem
                value={department.name}
                onSelect={() => {
                  setValue(department.name)
                  setOpen(false)
                }}
                key={department.id}>
                {department.name}
                {department.count > 0 && (
                  <div className={`bg-accent me-auto`}>{department.count}</div>
                )}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function SelectDepartment(props: {
  currentDepartment: number
  departments: Promise<{ id: number; name: string }[]>
  onSelect: (value: number) => void
}) {
  const departments = use(props.departments)
  const [open, setOpen] = useState(false)
  const [departmentId, setDepartmentId] = useState(props.currentDepartment)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <input name='department' value={departmentId} type='hidden' />
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between text-start'>
          <span className='line-clamp-1 w-0 flex-1'>
            {departmentId ?
              departments.find(({ id }) => id === departmentId)?.name
            : 'Select your department...'}
          </span>
          <ChevronsUpDownIcon className='size-4 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-(--radix-popper-anchor-width) min-w-xs p-0' align='start'>
        <Command>
          <CommandInput placeholder='Search for your department...' className='h-9' />
          <CommandList>
            <CommandEmpty>No department found.</CommandEmpty>
            <CommandGroup>
              {departments.map((department) => (
                <CommandItem
                  value={department.name}
                  onSelect={() => {
                    setDepartmentId(department.id)
                    props.onSelect(department.id)
                    setOpen(false)
                  }}
                  key={department.id}>
                  {department.name}
                  <Check
                    className={`me-auto ${departmentId === department.id ? 'opacity-100' : 'opacity-0'}`}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

const marker = (
  <svg display='block' height='41px' width='27px' viewBox='0 0 27 41'>
    <g fill-rule='nonzero'>
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
      <g fill='#3FB1CE'>
        <path d='M27,13.5 C27,19.074644 20.250001,27.000002 14.75,34.500002 C14.016665,35.500004 12.983335,35.500004 12.25,34.500002 C6.7499993,27.000002 0,19.222562 0,13.5 C0,6.0441559 6.0441559,0 13.5,0 C20.955844,0 27,6.0441559 27,13.5 Z'></path>
      </g>
      <g opacity='0.25' fill='#000000'>
        <path d='M13.5,0 C6.0441559,0 0,6.0441559 0,13.5 C0,19.222562 6.7499993,27 12.25,34.5 C13,35.522727 14.016664,35.500004 14.75,34.5 C20.250001,27 27,19.074644 27,13.5 C27,6.0441559 20.955844,0 13.5,0 Z M13.5,1 C20.415404,1 26,6.584596 26,13.5 C26,15.898657 24.495584,19.181431 22.220703,22.738281 C19.945823,26.295132 16.705119,30.142167 13.943359,33.908203 C13.743445,34.180814 13.612715,34.322738 13.5,34.441406 C13.387285,34.322738 13.256555,34.180814 13.056641,33.908203 C10.284481,30.127985 7.4148684,26.314159 5.015625,22.773438 C2.6163816,19.232715 1,15.953538 1,13.5 C1,6.584596 6.584596,1 13.5,1 Z'></path>
      </g>
      <g transform='translate(6.0, 7.0)' fill='#FFFFFF'></g>
      <g transform='translate(8.0, 8.0)'>
        <circle fill='#000000' opacity='0.25' cx='5.5' cy='5.5' r='5.4999962'></circle>
        <circle fill='#FFFFFF' cx='5.5' cy='5.5' r='5.4999962'></circle>
      </g>
    </g>
  </svg>
)

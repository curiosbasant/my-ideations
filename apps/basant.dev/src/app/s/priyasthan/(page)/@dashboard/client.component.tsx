'use client'

import 'maplibre-gl/dist/maplibre-gl.css'

import { startTransition, use, useOptimistic, useRef, useState } from 'react'
import { Map, Marker } from '@vis.gl/react-maplibre'
import { Check, ChevronsUpDownIcon, LoaderCircleIcon } from 'lucide-react'

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
import { useAction } from '~/lib/utils/helper-action/client'
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

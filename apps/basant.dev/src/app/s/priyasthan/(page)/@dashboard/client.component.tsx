'use client'

import { use, useRef, useState } from 'react'
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
import { getDepartmentDesignations } from './server.action'

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

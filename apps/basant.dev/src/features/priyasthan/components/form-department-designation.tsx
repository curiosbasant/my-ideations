'use client'

import { Suspense, use, useRef, useState } from 'react'
import { Check, ChevronsUpDownIcon, LoaderCircleIcon } from 'lucide-react'

import { FormSubmitButton } from '~/components/forms/client'
import { Button } from '~/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command'
import { FormControl } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { toast } from '~/components/ui/sonner'
import { getDepartmentDesignations, saveDesignation } from '~/features/user/actions'
import { useDalMutation } from '~/lib/dal/use-action'

export function DepartmentDesignationForm(props: {
  departmentsPromise: Promise<{ id: string; name: string }[]>
}) {
  const { actionTransition } = useDalMutation(saveDesignation, {
    onSuccess() {
      toast.success('Your designation is saved')
    },
  })

  return (
    <form
      className='mx-auto grid max-w-sm gap-8'
      action={(fd) => {
        const departmentId = fd.get('department') as string
        const designation = fd.get('designation') as string

        actionTransition({ departmentId, designation })
      }}>
      <DepartmentDesignation departmentsPromise={props.departmentsPromise} />
      <div className='col-span-full justify-self-end'>
        <FormSubmitButton>Save</FormSubmitButton>
      </div>
    </form>
  )
}

function DepartmentDesignation(props: {
  departmentsPromise: Promise<{ id: string; name: string }[]>
}) {
  const {
    isPending,
    data: designations,
    actionTransition,
  } = useDalMutation(getDepartmentDesignations)

  return (
    <>
      <FormControl className='**:[label>span]:hidden' label='Department'>
        <Suspense
          fallback={
            <Button
              variant='outline'
              aria-expanded={false}
              className='w-full justify-between text-start'
              disabled>
              <span className='line-clamp-1 flex-1'>Loading your departments...</span>
              <LoaderCircleIcon className='size-4 animate-spin opacity-50' />
            </Button>
          }>
          <SelectDepartment
            departmentsPromise={props.departmentsPromise}
            onSelect={(departmentId) => {
              actionTransition({ departmentId })
            }}
          />
        </Suspense>
      </FormControl>
      <FormControl className='**:[label>span]:hidden' label='Designation'>
        {isPending ?
          <Button
            variant='outline'
            aria-expanded={false}
            className='w-full justify-between text-start'
            disabled>
            <span className='line-clamp-1 flex-1'>Loading your designations...</span>
            <LoaderCircleIcon className='size-4 animate-spin opacity-50' />
          </Button>
        : designations?.length ?
          <SelectDesignation designations={designations} />
        : <Input
            className='bg-background'
            name='designation'
            placeholder='Enter your designation'
            required
            disabled={!designations}
          />
        }
      </FormControl>
    </>
  )
}

function SelectDepartment(props: {
  departmentsPromise: Promise<{ id: string; name: string }[]>
  onSelect: (value: string) => void
}) {
  const departments = use(props.departmentsPromise)
  const [open, setOpen] = useState(false)
  const [departmentId, setDepartmentId] = useState<string | null>(null)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <input name='department' value={departmentId ?? ''} type='hidden' />
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between text-start'>
          <span className='line-clamp-1 w-0 flex-1'>
            {(departmentId && departments.find(({ id }) => id === departmentId)?.name)
              || 'Select your department...'}
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

function SelectDesignation(props: {
  defaultValue?: string
  designations: { id: string; name: string; count: number }[]
}) {
  const [value, setValue] = useState(props.defaultValue || '')
  const [open, setOpen] = useState(false)
  const searchDesignationRef = useRef<HTMLInputElement>(null)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <input name='designation' value={value} type='hidden' />
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between text-start'>
          <span className='line-clamp-1 flex-1'>{value || 'Select your designation...'}</span>
          <ChevronsUpDownIcon className='size-4 opacity-50' />
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
            {props.designations.map((designation) => (
              <CommandItem
                value={designation.name}
                onSelect={() => {
                  setValue(designation.name)
                  setOpen(false)
                }}
                key={designation.id}>
                {designation.name}
                {designation.count > 0 && (
                  <div className='me-auto bg-accent'>{designation.count}</div>
                )}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

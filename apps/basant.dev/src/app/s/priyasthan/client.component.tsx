'use client'

import { useMemo, useState, type ChangeEvent, type PropsWithChildren } from 'react'
import { LoaderCircleIcon, MapPinIcon, MapPinPlusIcon, SearchIcon } from 'lucide-react'

import { debounce } from '@my/lib/utils'

import { useAction } from '~/app/client'
import { Spinner } from '~/components/elements/spinner'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { ScrollArea } from '~/components/ui/scroll-area'
import {
  autocompletePlacesAction,
  saveCurrentWorkplace,
  savePreferredWorkplace,
  signInWithProviderAction,
} from './server.action'

export function SignInWithGoogleButton() {
  const { isPending, actionTransition } = useAction({
    actionFn: signInWithProviderAction,
    onError(message) {
      console.log('Error: ' + message)
    },
  })

  return (
    <form action={() => actionTransition({})}>
      <Button disabled={isPending} type='submit'>
        {isPending ? 'Please wait...' : 'Login with Google'}
      </Button>
    </form>
  )
}

export function AutocompletePlaceSearch(props: {
  placeholder: string
  onPlaceSelect: (place: { placeId: string; text: string; secondaryText?: string | null }) => void
}) {
  const { isPending, state, actionTransition } = useAction({
    actionFn: autocompletePlacesAction,
    onError(message) {
      console.log('Error: ' + message)
    },
  })

  const handleChange = useMemo(() => {
    const debouncedSearch = debounce((value: string) => {
      actionTransition({ search: value })
    }, 0.5)

    return (ev: ChangeEvent<HTMLInputElement>) => {
      const value = ev.currentTarget.value
      if (value.length < 3) return
      debouncedSearch(value)
    }
  }, [])

  return (
    <div className='bg-background flex max-h-full flex-col divide-y rounded-lg border'>
      <div className='flex h-9 items-center gap-2 px-3'>
        {isPending ?
          <LoaderCircleIcon className='size-4 shrink-0 animate-spin opacity-50' />
        : <SearchIcon className='size-4 shrink-0 opacity-50' />}
        <input
          className='placeholder:text-muted-foreground outline-hidden flex h-10 w-full rounded-md bg-transparent py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50'
          onChange={handleChange}
          placeholder={props.placeholder}
          type='search'
        />
      </div>
      {state?.data && (
        <div className='flex h-0 flex-1'>
          <ScrollArea className='w-full'>
            <div
              className={`space-y-1 py-2 ${isPending ? 'animation-duration-800 pointer-events-none animate-pulse' : ''}`}>
              {state.data.length ?
                state.data.map((place) => (
                  <button
                    className='outline-hidden hover:bg-accent relative flex w-full cursor-default select-none items-start gap-2 px-2 py-1.5 text-start text-sm'
                    onClick={() => {
                      props.onPlaceSelect({
                        placeId: place.placeId,
                        text: place.mainText,
                        secondaryText: place.secondaryText,
                      })
                    }}
                    type='button'
                    key={place.placeId}>
                    <MapPinIcon className='pointer-events-none size-4 shrink-0' />
                    <div className='grid flex-1 gap-1'>
                      <span className='leading-none'>{place.mainText}</span>
                      {place.secondaryText && (
                        <span className='text-muted-foreground'>{place.secondaryText}</span>
                      )}
                    </div>
                  </button>
                ))
              : <p className='text-muted-foreground py-4 text-center text-sm'>No results found!</p>}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}

export function SetCurrentLocationDialog(props: PropsWithChildren<{}>) {
  const [open, setOpen] = useState(false)
  const { isPending, actionTransition } = useAction({
    actionFn: saveCurrentWorkplace,
    onSuccess: () => setOpen(false),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Current Location</DialogTitle>
        </DialogHeader>
        <div className='grid'>
          <div
            className={`col-start-1 row-start-1 h-80 ${isPending ? 'animate-pulse opacity-75' : ''}`}>
            <AutocompletePlaceSearch
              placeholder='Search for your current workplace...'
              onPlaceSelect={actionTransition}
            />
          </div>
          {isPending && (
            <div className='bg-secondary/75 pointer-events-none z-10 col-start-1 row-start-1 flex flex-col items-center justify-center gap-4 rounded-md border'>
              <Spinner />
              Please wait...
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function SetPreferredLocationDialog() {
  const [open, setOpen] = useState(false)
  const { isPending, actionTransition } = useAction({
    actionFn: savePreferredWorkplace,
    onSuccess: () => setOpen(false),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <MapPinPlusIcon /> Add New
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Preferred Location</DialogTitle>
        </DialogHeader>
        <div className='grid'>
          <div
            className={`col-start-1 row-start-1 h-80 ${isPending ? 'animate-pulse opacity-75' : ''}`}>
            <AutocompletePlaceSearch
              placeholder='Search for your preferred workplaces...'
              onPlaceSelect={actionTransition}
            />
          </div>
          {isPending && (
            <div className='bg-secondary/75 pointer-events-none z-10 col-start-1 row-start-1 flex flex-col items-center justify-center gap-4 rounded-md border'>
              <Spinner />
              Please wait...
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

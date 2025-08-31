'use client'

import { useMemo, type ChangeEvent } from 'react'
import { LoaderCircleIcon, MapPinIcon, SearchIcon } from 'lucide-react'

import { useToggle } from '@my/core/hooks'
import { debounce } from '@my/lib/utils'

import { useAction } from '~/app/client'
import { Button } from '~/components/ui/button'
import { ScrollArea } from '~/components/ui/scroll-area'
import {
  autocompletePlacesAction,
  saveCurrentWorkplace,
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
    <div className='bg-background rounded-lg border shadow-md md:max-w-sm'>
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
        <ScrollArea className='border-t' viewportClassName='max-h-80'>
          <div
            className={`space-y-1 p-2 ${isPending ? 'animation-duration-800 pointer-events-none animate-pulse' : ''}`}>
            {state.data.length ?
              state.data.map((place) => (
                <button
                  className='outline-hidden hover:bg-accent relative flex w-full cursor-default select-none items-start gap-2 rounded-sm px-2 py-1.5 text-start text-sm'
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
      )}
    </div>
  )
}

export function UserLocationDetails(props: {
  addressText: string
  addressSecondaryText: string | null
}) {
  const [isEditing, toggleEditing] = useToggle()

  if (isEditing) {
    return (
      <div className='space-y-2'>
        <AutocompletePlaceSearch
          placeholder='Search for your current workplace...'
          onPlaceSelect={saveCurrentWorkplace}
        />
        <div className='flex justify-end'>
          <Button variant='outline' onClick={toggleEditing}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-background flex space-y-1 rounded-md border p-4'>
      <div className='flex-1'>
        <div className='font-medium'>{props.addressText}</div>
        {props.addressSecondaryText && (
          <p className='text-muted-foreground text-sm'>{props.addressSecondaryText}</p>
        )}
      </div>
      <Button onClick={toggleEditing}>Edit</Button>
    </div>
  )
}

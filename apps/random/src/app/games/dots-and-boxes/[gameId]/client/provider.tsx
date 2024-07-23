'use client'

import { createContext, useContext, useRef, type ReactNode } from 'react'
import { useStore as useZustandStore, type StoreApi } from 'zustand'

import { createStore, type State, type Store } from './store'

const Context = createContext<StoreApi<Store> | null>(null)

export interface StoreProviderProps {
  children: ReactNode
  initialState: Partial<State>
}

export function StoreProvider(props: StoreProviderProps) {
  const storeRef = useRef<StoreApi<Store>>()
  storeRef.current ??= createStore(props.initialState)
  if (!storeRef.current) {
  }

  return <Context.Provider value={storeRef.current}>{props.children}</Context.Provider>
}

function useStore(): Store
function useStore<T>(selector: (draft: Store) => T): T
function useStore<T>(selector?: (draft: Store) => T) {
  const store = useContext(Context)
  if (!store) {
    throw new Error(`${useStore.name} must be use within ${StoreProvider.name}`)
  }

  return useZustandStore(store, selector!)
}
export { useStore }

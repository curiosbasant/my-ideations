import { useEffect, useSyncExternalStore } from 'react'

export function useLocalStorage<T extends string>(key: string, defaultValue?: T) {
  const store = useSyncExternalStore(
    localStorageSubscriber,
    () => getLocalStorageItem(key),
    () => defaultValue,
  )

  useEffect(() => {
    if (!getLocalStorageItem(key) && typeof defaultValue !== 'undefined') {
      setLocalStorageItem(key, defaultValue)
    }
  }, [key, defaultValue])

  return [
    store,
    (newValue: string | null) =>
      newValue ? setLocalStorageItem(key, newValue) : removeLocalStorageItem(key),
  ] as const
}

function getLocalStorageItem(key: string) {
  return window.localStorage.getItem(key)
}

function localStorageSubscriber(callback: (ev: StorageEvent) => any) {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

function setLocalStorageItem(key: string, value: string) {
  window.localStorage.setItem(key, value)
  dispatchStorageEvent(key, value)
}

function removeLocalStorageItem(key: string) {
  window.localStorage.removeItem(key)
  dispatchStorageEvent(key, null)
}

function dispatchStorageEvent(key: string, newValue: string | null) {
  window.dispatchEvent(new StorageEvent('storage', { key, newValue }))
}

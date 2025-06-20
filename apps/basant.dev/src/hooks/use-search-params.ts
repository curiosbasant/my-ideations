import { useSearchParams as useNextSearchParams, useRouter } from 'next/navigation'

/**
 * @link https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#using-the-native-history-api
 */
export const router = {
  push: (url: string | URL) => window.history.pushState(null, '', url),
  replace: (url: string | URL) => window.history.replaceState(null, '', url),
  setSearchParam(paramName: string, value: unknown) {
    const params = new URLSearchParams(window.location.search)
    if (value || value === 0) {
      params.set(paramName, String(value))
    } else {
      params.delete(paramName)
    }
    window.history.replaceState(null, '', '?' + params)
  },
}

function useNativeSearchParam(paramName: string): [string | null, (nv: string) => void]
function useNativeSearchParam(
  paramName: string,
  defaultValue: string,
): [string, (nv: string) => void]
function useNativeSearchParam(paramName: string, defaultValue?: string) {
  const searchParams = useNextSearchParams()
  const currentValue = searchParams.get(paramName) ?? defaultValue ?? null

  return [
    currentValue,
    (newValue: string) => {
      const params = new URLSearchParams(searchParams)
      if (newValue === defaultValue) {
        params.delete(paramName)
      } else {
        params.set(paramName, newValue)
      }
      router.replace('?' + params)
    },
  ]
}

function useSearchParam(paramName: string): [string | null, (nv: string) => void]
function useSearchParam(paramName: string, defaultValue: string): [string, (nv: string) => void]
function useSearchParam(paramName: string, defaultValue?: string) {
  const searchParams = useNextSearchParams()
  const router = useRouter()

  const currentValue = searchParams.get(paramName) ?? defaultValue ?? null

  return [
    currentValue,
    (newValue: string) => {
      const params = new URLSearchParams(searchParams)
      if (newValue === defaultValue) {
        params.delete(paramName)
      } else {
        params.set(paramName, newValue)
      }
      router.replace('?' + params)
    },
  ]
}

export { useNativeSearchParam, useSearchParam }

import AsyncStorage from '@react-native-async-storage/async-storage'

import { useMutation, useQuery, useQueryClient } from '@my/core/trpc'
import { safeParseJsonText } from '@my/lib/utils'

const keys = {
  storage: ['storage'],
  item(itemName: string) {
    return [...this.storage, itemName] as const
  },
} as const

export function useStorage<T extends string>(key: string): [T | null, (value: T | null) => void]
export function useStorage<T>(key: string, defaultValue: T): [T, (value: T | null) => void]
export function useStorage<T>(key: string, defaultValue?: T) {
  const queryKey = keys.item(key)

  const queryClient = useQueryClient()
  const { data } = useQuery({
    queryKey,
    async queryFn({ queryKey }) {
      const value = await AsyncStorage.getItem(queryKey[1])
      if (!value) return defaultValue ?? null

      return typeof defaultValue === 'undefined' ? value : safeParseJsonText(value) ?? value
    },
    initialData: defaultValue,
    staleTime: Infinity,
  })
  const { mutate } = useMutation({
    onMutate(value: T) {
      queryClient.setQueryData(queryKey, value)
    },
    async mutationFn(value) {
      if (value) {
        await AsyncStorage.setItem(key, JSON.stringify(value))
      } else {
        await AsyncStorage.removeItem(key)
      }
    },
  })

  return [data, mutate] as const
}

export { AsyncStorage }

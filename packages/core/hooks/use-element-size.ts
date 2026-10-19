import {
  startTransition,
  useCallback,
  useState,
  type RefCallback,
  type SetStateAction,
} from 'react'

export function useElementSize<T extends HTMLElement, V>(
  select?: (size: number) => SetStateAction<V>,
) {
  const [elementSize, setElementSize] = useState<V | number | null>(null)

  const ref = useCallback((elem: T | null) => {
    if (!elem) return

    const observer = new ResizeObserver(([element]) => {
      const inlineSize = element?.borderBoxSize[0]?.inlineSize
      if (typeof inlineSize !== 'number') return
      const size = select?.(inlineSize) ?? inlineSize
      // @ts-expect-error
      startTransition(() => setElementSize(size))
    })
    observer.observe(elem)
    return () => {
      observer.disconnect()
    }
  }, [])

  return [ref, elementSize] as [RefCallback<T>, NoInfer<V> | null]
}

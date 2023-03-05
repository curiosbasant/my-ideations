import { PropsWithChildren } from 'react'

/**
 * Used to autocomplete numbers and string types.
 *
 * ```ts
 *   // Here this variable `birds` could hold any value, but ts will always show intellisense for the provided union strings.
 *   const birds: AutoComplete<"sparrow" | "parrot"> = "";
 * ```
 */
export type AutoComplete<T extends string | number> = T | Omit<string | number, T>

export type PageProps<P = {}> = {
  params: P
  searchParams: {}
}

export type LayoutProps<P = {}> = PropsWithChildren<{ params: P }>

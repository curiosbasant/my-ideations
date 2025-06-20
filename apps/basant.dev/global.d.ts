import type { PropsWithChildren, ReactNode } from 'react'

type ParseParamKey<T extends string> = T extends `${infer P}[]`
  ? P extends `?${infer P}`
    ? P
    : P
  : T
type ParseParam<T extends string> = T extends `${infer K}[]`
  ? string[] | (K extends `?${string}` ? null : never)
  : string

declare global {
  type LayoutProps<T extends { params?: string; slots?: string } = {}> = PropsWithChildren<
    Record<T['slots'], ReactNode> & {
      params: Promise<{ [P in T['params'] as ParseParamKey<P>]: ParseParam<P> }>
    }
  >

  type PageProps<T extends { params?: string; searchParams?: string }> = {
    params: Promise<{ [P in T['params'] as ParseParamKey<P>]: ParseParam<P> }>
    searchParams: Promise<{ [P in T['searchParams'] as ParseParamKey<P>]?: ParseParam<P> }>
  }
}

declare module 'csstype' {
  interface Properties {
    [key: `--${string}`]: string | number
  }
}

export {}

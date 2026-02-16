import type { ReactNode } from 'react'
import {
  useSuspenseQuery,
  type DefaultError,
  type QueryKey,
  type UseSuspenseQueryOptions,
} from '@tanstack/react-query'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'

import type { AppRouter } from '@my/api'

import { useTrpc } from './client'

export function Query<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(props: {
  options: (
    trpc: TRPCOptionsProxy<AppRouter>,
  ) => UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
  children: (data: TData) => ReactNode
}) {
  const trpc = useTrpc()
  const { data } = useSuspenseQuery(props.options(trpc))
  return props.children(data)
}

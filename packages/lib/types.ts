export type Falsy = '' | null | undefined | 0 | false

export type Prettify<T> = {
  [P in keyof T]: T[P]
} & {}

export type RemoveNullable<T> = {
  [K in keyof T]: NonNullable<T[K]>
} & {}

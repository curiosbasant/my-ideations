export type Falsy = '' | null | undefined | 0 | false

export type Prettify<T> = {
  [P in keyof T]: T[P]
} & {}

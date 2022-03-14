/** Splits the provided array into two parts */
export function splitArray<T>(array: T[], callback: (n: T, i: number) => boolean): [T[], T[]] {
  const truthyArr: T[] = [],
    falsyArr: T[] = []
  for (let i = 0; i < array.length; i++) {
    ;(callback(array[i], i) ? truthyArr : falsyArr).push(array[i])
  }
  return [truthyArr, falsyArr]
}

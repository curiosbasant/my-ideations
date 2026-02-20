import type { ZodType } from 'zod'

import { ROOT_HOST, ROOT_ORIGIN } from './constants'
import type { Falsy } from './types'

/**
 * Pauses execution for a specified number of seconds.
 */
export const sleep = (secs: number) => new Promise((resolve) => setTimeout(resolve, secs * 1000))

/**
 * Checks if a user has signed in within the last 5 minutes.
 */
export function hasRecentlySignIn(signedInAt: string) {
  const elapsedTime = Date.now() - new Date(signedInAt).getTime()
  // true if has authenticated in last 5mins
  return elapsedTime < 5 * 60 * 1000
}

/**
 * Converts and normalizes the accent characters to normal text.
 */
export const removeAccents = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

/**
 * Converts any text to url friendly one.
 */
export const slugify = (text: string) => {
  return removeAccents(text)
    .replace(/([^\w]+|\s+)/g, '-') // Replace space and other characters by hyphen
    .replace(/\-\-+/g, '-') // Replaces multiple hyphens by one hyphen
    .replace(/(^-+|-+$)/g, '') // Remove extra hyphens from beginning or end of the string
    .toLowerCase()
}

export function removeUndefined<T extends Record<string, unknown>>(obj: T) {
  for (const key in obj) {
    if (typeof obj[key] === 'undefined') delete obj[key]
  }

  return Object.keys(obj).length > 0 ? obj : null
}

export function removeFalsy<const T extends Record<string, unknown>>(obj: T) {
  for (const key in obj) {
    if (!obj[key]) delete obj[key]
  }

  return Object.keys(obj).length > 0 ?
      (obj as { [P in keyof T as T[P] extends Falsy ? never : P]: Exclude<T[P], Falsy> })
    : null
}

export function removeUndefinedAndEmptyString<T extends Record<string, unknown>>(obj: T) {
  for (const key in obj) {
    // if (obj[key] === null || obj[key] === 0 || obj[key] === false) continue
    if (typeof obj[key] === 'undefined' || obj[key] === '') delete obj[key]
  }

  return obj
}

/**
 * Formatter for Indian currency.
 */
export const indianCurrencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
})

/**
 * Convert size in bytes to human readable format
 */
export function formatBytes(bytes: number | null, decimals = 2) {
  if (!bytes) return '0 Bytes'
  var k = 1024,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(decimals) + ' ' + sizes[i]
}

/**
 * Clamps a number to a specified range.
 */
export const clamp = (num: number, min: number, max: number) =>
  num < min ? min
  : num > max ? max
  : num

/**
 * Generates a random ID string.
 */
export const generateRandomId = (size = 8) =>
  Math.random()
    .toString()
    .slice(-clamp(size, 8, 16))

/**
 * Generates a random number between a range.
 */
export function getRandomNumberBetween(minOrMax: number, max?: number) {
  if (!max) {
    max = minOrMax
    minOrMax = 0
  }

  return (Math.random() * (max - minOrMax) + minOrMax) | 0
}

/**
 * Returns a pluralized form of a word based on the provided count.
 */
export const makePlural = (word: string, count: number) =>
  `${count} ${word}${count === 1 ? '' : 's'}`

/**
 * Safely parses a string into a specified Zod schema.
 */
export function safeParseText<T>(schema: ZodType<T>, value: unknown) {
  if (typeof value !== 'string') return null
  try {
    return schema.parse(JSON.parse(value))
  } catch (_) {
    return null
  }
}

/**
 * Safely parses a json string without errors
 */
export function safeParseJsonText(text: string) {
  try {
    return JSON.parse(text)
  } catch (_) {
    return null
  }
}

/**
 * Groups an array of objects by a specific key or callback logic
 */
export function groupBy<T extends Record<PropertyKey, any>, K extends keyof T>(
  array: T[],
  cbOrKey: K | ((arg: T, index: number) => K),
) {
  const callback = typeof cbOrKey === 'function' ? cbOrKey : () => cbOrKey
  return array.reduce<Partial<Record<K, T[]>>>((acc, item, index) => {
    const key = item[callback(item, index)]
    acc[key] ??= []
    acc[key].push(item)
    return acc
  }, {})
}

/**
 * Wraps a promise and waits for specified time before resolving
 */
export async function withArtificialDelay<T>(promise: Promise<T>, delay = 1) {
  const [result] = await Promise.allSettled([promise, sleep(delay)])
  if (result.status === 'rejected') throw result.reason
  return result.value
}

/**
 * This limits the rate at which the callback gets invoked.
 * @default 1s
 */
export function debounce<const T>(cb: (...param: T[]) => void, delay = 1) {
  let timeoutId = 0
  return (...param: T[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(cb, delay * 1e3, ...param) as unknown as number
  }
}

/**
 * Create a promise's tuple, like [error, data]
 */
function tuplifyPromise<T>(promise: Promise<T>): Promise<[null, T] | [Error, null]>
function tuplifyPromise<T, Args extends any[]>(
  promise: (...args: Args) => Promise<T>,
): (...args: Args) => Promise<[null, T] | [Error, null]>
function tuplifyPromise(promise: Promise<any> | ((...args: any[]) => Promise<any>)) {
  if (typeof promise === 'function') {
    return (...args: any[]) => tuplifyPromise(promise(...args))
  }
  return promise.then((data) => [null, data]).catch((error) => [error, null])
}
export { tuplifyPromise }

/**
 * Checks if a url is valid or not
 */
export function isValidUrl(url: string) {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Tries to create a @link {URL} of the provided url, if its valid
 */
export function getUrlFromString(link: string) {
  if (isValidUrl(link)) return link
  try {
    if (link.includes('.') && !link.includes(' ')) {
      return new URL(`https://${link}`).toString()
    }
    return null
  } catch (e) {
    return null
  }
}

/**
 * Checks if the provided hex or rgb color is dark or not
 */
export function isDarkColor(color: string) {
  let r = 0,
    g = 0,
    b = 0

  // Check the format of the color, HEX or RGB?
  if (color.startsWith('rgb')) {
    // if RGB, extract the rgb values
    const rgbValues = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)
    if (!rgbValues) throw new Error('Invalid rgb color value')

    r = +rgbValues[1]
    g = +rgbValues[2]
    b = +rgbValues[3]
  } else {
    // if hex, convert and get rgb values: http://gist.github.com/983661
    const numericalPart = color.replace('#', '')
    const hexValue = +(
      '0x' + (numericalPart.length < 4 ? numericalPart.replace(/./g, '$&$&') : numericalPart)
    )

    r = hexValue >> 16
    g = (hexValue >> 8) & 255
    b = hexValue & 255
  }

  // HSP equation from http://alienryderflex.com/hsp.html
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))

  // Using the HSP value, determine whether the color is light or dark
  return hsp < 145
}

function resolveStringParam(param: string | string[]): string
function resolveStringParam(param?: string | string[] | undefined): string | null
function resolveStringParam(param?: string | string[]) {
  return Array.isArray(param) ? param[0] : (param ?? null)
}
function resolveArrayParam(param: string | string[]): string[]
function resolveArrayParam(param?: string | string[] | undefined): string[] | null
function resolveArrayParam(param?: string | string[]) {
  if (typeof param === 'string') return [param]
  return Array.isArray(param) ? param : null
}
export { resolveStringParam, resolveArrayParam }

export function splitFullName(fullName: string): { firstName: string; lastName: string | null } {
  const parts = fullName.split(/ +/)
  if (parts.length === 1) return { firstName: fullName, lastName: null }
  if (parts.length === 2) return { firstName: parts[0], lastName: parts[1] }

  const lastName = parts.pop() ?? null
  return { firstName: parts.join(' '), lastName }
}

export function createOrigin(subdomain?: string) {
  return subdomain ?
      `${ROOT_HOST.includes('local') ? 'http' : 'https'}://${subdomain}.${ROOT_HOST}`
    : ROOT_ORIGIN
}

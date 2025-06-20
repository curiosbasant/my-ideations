import { cx, type CxOptions } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: CxOptions) {
  return twMerge(cx(inputs))
}

export function prettifyText(text: string) {
  return text.replace(/\b\(/g, ' (').replace(/(\.|\,)\b/g, '$1 ')
}

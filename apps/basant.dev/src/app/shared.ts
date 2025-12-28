import { Geist, Geist_Mono, Lato } from 'next/font/google'

export const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const latoFont = Lato({
  weight: ['100', '400', '700', '900'],
  variable: '--font-lato',
  subsets: ['latin'],
})

export type ThemePreference = 'light' | 'dark'
export const COOKIE_THEME_KEY = 'theme-preference'

import { Lato } from 'next/font/google'
import localFont from 'next/font/local'

export const latoFont = Lato({
  weight: ['100', '400', '700', '900'],
  variable: '--font-lato',
  subsets: ['latin'],
})
export const materialIcon = localFont({
  src: '../../public/fonts/material-icons.woff2',
  variable: '--material-icons',
})

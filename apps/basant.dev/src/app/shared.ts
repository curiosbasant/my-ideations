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

type ActionSuccessState<TData> = {
  success: true
  message?: string
  data: TData
}
type ActionFailedState = {
  success: false
  message: string
  data?: null
}
export type ActionState<TData> = ActionSuccessState<TData> | ActionFailedState | null
type ActionHandler<Payload, TData> = (payload: Payload, state: ActionState<TData>) => Promise<TData>

export function actionWrapper<Payload, TData>(action: ActionHandler<Payload, TData>) {
  return async (state: ActionState<TData>, payload: Payload): Promise<ActionState<TData>> => {
    try {
      const data = await action(payload, state)
      return { success: true, data }
    } catch (error) {
      return { success: false, message: String(error) }
    }
  }
}

import { RootSiblingParent } from 'react-native-root-siblings'
import NativeToast, { type ToastOptions, type ToastProps } from 'react-native-root-toast'

const defaultOptions: ToastOptions = {
  opacity: 0.75,
}

export function Toast(props: ToastProps) {
  return <NativeToast {...defaultOptions} {...props} />
}

Toast.show = (message: string, options?: ToastOptions) => {
  NativeToast.show(message, options ? { ...defaultOptions, ...options } : defaultOptions)
}

Toast.error = (message: string, options?: ToastOptions) => {
  NativeToast.show(message, {
    ...defaultOptions,
    duration: NativeToast.durations.LONG,
    ...options,
    backgroundColor: 'red',
  })
}

Toast.Provider = RootSiblingParent
Toast.displayName = 'ui/Toast'

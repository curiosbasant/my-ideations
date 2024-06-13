import { Alert } from 'react-native'
import { useMutation } from '@tanstack/react-query'

import { withThrowOnError } from '~/lib/supabase'
import { auth, AuthError, Session } from './service'

export function useLoginMutation() {
  const mutation = useMutation<Session, AuthError, { email: string; password: string }>({
    async mutationFn(params) {
      const data = await withThrowOnError(auth.signInWithPassword(params))
      return data.session
    },
    onSuccess() {
      Alert.alert("You've logged in successfully!")
    },
  })

  return mutation
}

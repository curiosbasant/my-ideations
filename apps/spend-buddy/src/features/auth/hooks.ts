import { router } from 'expo-router'

import { Toast } from '~/components/ui'
import { useMutation, useQuery, useQueryClient } from '~/lib/react-query'
import { withThrowOnError } from '~/lib/supabase'
import { withArtificialDelay } from '~/lib/utils'
import { auth, AuthError, Session } from './service'

const keys = {
  session: ['session'],
  login: ['login'],
} as const

export function useSession() {
  return useQuery({
    queryKey: keys.session,
    async queryFn() {
      const data = await withThrowOnError(
        auth.getSession() as Promise<
          | { data: { session: Session | null }; error: null }
          | { data: { session: null }; error: AuthError }
        >,
      )
      return data.session
    },
  })
}

export function useLoginMutation() {
  const client = useQueryClient()
  const mutation = useMutation<Session, AuthError, { email: string; password: string }>({
    mutationKey: keys.login,
    async mutationFn(params) {
      const data = await withArtificialDelay(withThrowOnError(auth.signInWithPassword(params)))
      return data.session
    },
    onSuccess(data) {
      client.setQueryData(keys.session, data)
      // Manually navigating back to home, to trigger auth handling
      router.navigate('/')
      Toast.show("You've logged in successfully!")
    },
  })

  return mutation
}

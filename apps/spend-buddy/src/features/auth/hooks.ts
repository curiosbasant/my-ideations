import { router } from 'expo-router'

import { Toast } from '~/components/ui'
import { api } from '~/lib/trpc'

export function useSession() {
  return api.auth.getSession.useQuery()
}

export function useLoginMutation() {
  const utils = api.useUtils()
  const mutation = api.auth.signIn.useMutation({
    onSuccess(result) {
      if (result.code === 'invalid_credentials') {
        Toast.show(result.message)
      } else if (result.code === 'verified') {
        utils.auth.getSession.setData(undefined, result.data.session)
        // Manually navigating back to home, to trigger auth handling
        router.navigate('/')
        Toast.show("You've logged in successfully!")
      }
    },
  })

  return mutation
}

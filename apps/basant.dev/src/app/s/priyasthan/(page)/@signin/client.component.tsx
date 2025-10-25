'use client'

import { useAction } from '~/app/client'
import { Button } from '~/components/ui/button'
import { signInWithProviderAction } from './server.action'

export function SignInWithGoogleButton() {
  const { isPending, actionTransition } = useAction({
    actionFn: signInWithProviderAction,
    onError(message) {
      console.log('Error: ' + message)
    },
  })

  return (
    <form action={() => actionTransition({})}>
      <Button disabled={isPending} type='submit'>
        {isPending ? 'Please wait...' : 'Login with Google'}
      </Button>
    </form>
  )
}

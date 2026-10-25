'use client'

import { Button } from '~/components/ui/button'
import { useDalMutation } from '~/lib/dal/use-action'
import { actionSignInWithProvider } from './action'

export function SignInWithGoogleButton() {
  const { isPending, actionTransition } = useDalMutation(actionSignInWithProvider, {
    onError(message) {
      console.log('Error: ' + message)
    },
  })

  return (
    <form action={() => actionTransition({ provider: 'google', continue: true })}>
      <Button disabled={isPending} type='submit'>
        {isPending ? 'Please wait...' : 'Login with Google'}
      </Button>
    </form>
  )
}

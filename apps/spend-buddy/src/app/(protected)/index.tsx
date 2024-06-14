import { Text } from 'react-native'

import { Screen } from '~/components/ui'

export default function HomeScreen() {
  return (
    <Screen className='gap-6'>
      <Text className='text-center text-3xl font-bold color-foreground'>Welcome!</Text>
    </Screen>
  )
}

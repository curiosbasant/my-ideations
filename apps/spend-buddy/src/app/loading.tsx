import { Text, View } from 'react-native'

import { Spinner } from '~/components/ui'

export default function LoadingScreen() {
  return (
    <View className='flex-1 items-center justify-center gap-4 bg-background/85'>
      <Spinner className='color-primary' size={64} />
      <Text className='color-foreground text-lg font-bold'>Please wait...</Text>
    </View>
  )
}

import { Text, View } from 'react-native'

import { Spinner } from '~/components/ui'

export default function LoadingScreen() {
  return (
    <View className='flex-1 items-center justify-center gap-4 bg-white/85'>
      <Spinner className='text-primary' size={64} />
      <Text className='text-lg font-bold'>Please wait...</Text>
    </View>
  )
}

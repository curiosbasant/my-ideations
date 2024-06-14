import { Text, View } from 'react-native'
import { Link, Stack } from 'expo-router'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className='flex-1 items-center justify-center p-6'>
        <Text className='text-3xl font-bold'>This screen doesn't exist.</Text>
        <Link href='/' className='text-base text-primary'>
          Go to home screen!
        </Link>
      </View>
    </>
  )
}

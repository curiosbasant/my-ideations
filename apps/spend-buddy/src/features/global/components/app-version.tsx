import { Platform, Text } from 'react-native'
import { manifest, updateId } from 'expo-updates'

import { useToggle } from '@my/core/hooks'

export function AppVersion() {
  const [showUpdateId, toggleShowUpdateId] = useToggle()

  if ('extra' in manifest && manifest.extra?.expoClient?.version) {
    return (
      <Text className='color-muted-foreground text-center text-sm' onPress={toggleShowUpdateId}>
        Version: {manifest.extra.expoClient.version}
        {Platform.OS === 'android'
          ? ':' + manifest.extra.expoClient.android?.versionCode
          : Platform.OS === 'ios'
            ? ':' + manifest.extra.expoClient.ios?.buildNumber
            : ''}
        {showUpdateId && '\n' + updateId}
      </Text>
    )
  }

  return null
}

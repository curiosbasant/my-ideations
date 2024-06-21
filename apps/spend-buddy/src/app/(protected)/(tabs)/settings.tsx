import { checkForUpdateAsync, fetchUpdateAsync, reloadAsync, useUpdates } from 'expo-updates'

import { tuplifyPromise } from '@my/lib/utils'

import { SettingItem } from '~/components/setting-item'
import { Screen, Toast } from '~/components/ui'
import { useLogout } from '~/features/auth'

export default function SettingsScreen() {
  return (
    <Screen className='gap-6 px-0' scrollable>
      <SettingItem iconName='palette' label='Change Theme' to='/settings/change-theme' />
      <AppUpdateButton />
      <LogoutButton />
    </Screen>
  )
}

function LogoutButton() {
  const { mutate } = useLogout()
  return <SettingItem iconName='sign-out-alt' label='Logout' onPress={() => mutate()} />
}

function AppUpdateButton() {
  const { isChecking, isDownloading, isUpdateAvailable, isUpdatePending } = useUpdates()

  return isChecking ? (
    <SettingItem iconName='download' label='Checking for updates...' disabled />
  ) : isUpdateAvailable ? (
    <SettingItem
      iconName='download'
      label='Download Update'
      onPress={async () => {
        const [error, result] = await tuplifyPromise(fetchUpdateAsync)()
        if (error) return Toast.error('Updates are not supported in the current environment.')
        if (result.isNew) Toast.show('Downloading the update!')
      }}
    />
  ) : isDownloading ? (
    <SettingItem iconName='download' label='Downloading new updates...' disabled />
  ) : isUpdatePending ? (
    <SettingItem iconName='download' label='Reload to update' onPress={reloadAsync} />
  ) : (
    <SettingItem
      iconName='download'
      label='Check for updates'
      onPress={async () => {
        const [error, result] = await tuplifyPromise(checkForUpdateAsync)()
        if (error) return Toast.error('Updates are not supported in the current environment.')
        if (!result.isAvailable) Toast.show('There are no new updates available!')
      }}
    />
  )
}

import { checkForUpdateAsync, fetchUpdateAsync, reloadAsync, useUpdates } from 'expo-updates'

import { tuplifyPromise } from '@my/lib/utils'

import { useLogout } from '~/features/auth'
import { AppVersion, SettingItem } from '~/features/global'
import { Screen, Toast } from '~/ui'

export default function SettingsScreen() {
  return (
    <Screen className='gap-6 py-8' scrollable>
      <SettingItem icon='palette' label='Change Theme' to='/settings/change-theme' />
      <AppUpdateButton />
      <LogoutButton />
      <AppVersion />
    </Screen>
  )
}

function LogoutButton() {
  const { mutate } = useLogout()
  return <SettingItem icon='logout' label='Logout' onPress={() => mutate()} />
}

function AppUpdateButton() {
  const { isChecking, isDownloading, isUpdateAvailable, isUpdatePending } = useUpdates()

  return isChecking ? (
    <SettingItem icon='update' label='Checking for updates...' disabled />
  ) : isUpdatePending ? (
    <SettingItem icon='reload' label='Reload to update' onPress={reloadAsync} />
  ) : isDownloading ? (
    <SettingItem icon='update' label='Downloading new updates...' disabled />
  ) : isUpdateAvailable ? (
    <SettingItem
      icon='download'
      label='Download Update'
      onPress={async () => {
        const [error, result] = await tuplifyPromise(fetchUpdateAsync())
        if (error) return Toast.error('Updates are not supported in the current environment.')
        if (result.isNew) Toast.show('Downloading the update!')
      }}
    />
  ) : (
    <SettingItem
      icon='update'
      label='Check for updates'
      onPress={async () => {
        const [error, result] = await tuplifyPromise(checkForUpdateAsync())
        if (error) return Toast.error('Updates are not supported in the current environment.')
        if (!result.isAvailable) Toast.show('There are no new updates available!')
      }}
    />
  )
}

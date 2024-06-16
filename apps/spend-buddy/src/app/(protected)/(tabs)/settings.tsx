import { SettingItem } from '~/components/setting-item'
import { Screen } from '~/components/ui'
import { useLogout } from '~/features/auth'

export default function SettingsScreen() {
  return (
    <Screen className='gap-6 px-0' scrollable>
      <SettingItem iconName='palette' label='Change Theme' to='/settings/change-theme' />
      <LogoutButton />
    </Screen>
  )
}

function LogoutButton() {
  const { mutate } = useLogout()
  return <SettingItem iconName='sign-out-alt' label='Logout' onPress={() => mutate()} />
}

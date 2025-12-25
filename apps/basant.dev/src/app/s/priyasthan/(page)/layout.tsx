import { getAuthUser } from '~/features/auth/dal'

export default async function PriyasthanLayoutPage(
  props: LayoutProps<{ slots: 'dashboard' | 'signin' }>,
) {
  const authUser = await getAuthUser()
  return authUser ? props.dashboard : props.signin
}

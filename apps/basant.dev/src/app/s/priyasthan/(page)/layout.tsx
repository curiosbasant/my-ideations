import { getAuthUser } from '~/features/auth/dal'

export default async function PriyasthanLayoutPage(props: LayoutProps<'/s/priyasthan'>) {
  const authUser = await getAuthUser()
  return authUser ? props.dashboard : props.signin
}

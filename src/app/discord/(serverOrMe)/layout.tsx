import { LayoutProps } from '~/types/utilities.type'

export const metadata = {
  title: 'Discord Clone',
}

export default function ServerOrMeLayout(props: LayoutProps) {
  return (
    <div className='flex flex-1 overflow-hidden rounded-t-xl bg-slate-800 only:rounded-none'>
      {props.children}
    </div>
  )
}

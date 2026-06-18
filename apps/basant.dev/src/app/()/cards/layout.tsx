import Link from 'next/link'

import { ScrollArea } from '~/components/ui/scroll-area'

export default function CardsLayout(props: LayoutProps<'/cards'>) {
  return (
    <div className='flex h-full flex-col bg-gray-200'>
      <header className='flex shrink-0 basis-8 flex-row items-center gap-4 bg-white px-6 text-xs font-medium text-gray-700 shadow-sm'>
        <Link href='/cards/student'>Student Card</Link>
        <Link href='/cards/teacher'>Teacher Card</Link>
      </header>
      <ScrollArea className='h-0 flex-1'>{props.children}</ScrollArea>
    </div>
  )
}

import Link from 'next/link'
import type { Metadata } from 'next/types'

import { Button } from '~/components/ui/button'
import { getRoom } from '~/features/snapfile/dal'

export async function generateMetadata(
  props: LayoutProps<'/s/snapfile/rooms/[slug]'>,
): Promise<Metadata> {
  const { slug } = await props.params
  const room = await getRoom({ slug })
  return {
    title: room.name,
  }
}

export default async function RoomPage(props: LayoutProps<'/s/snapfile/rooms/[slug]'>) {
  const { slug } = await props.params
  const room = await getRoom({ slug })

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>{room.name}</h1>
        <Button asChild>
          <Link href={`/rooms/${slug}/new`}>Share File</Link>
        </Button>
      </div>
      {props.children}
      {props.modal}
    </div>
  )
}

import type { ComponentType, ElementType, ReactNode } from 'react'
import type { LucideProps } from 'lucide-react'

import { styled } from '~/lib/utils'

export const H3 = styled('h3', 'self-center text-3xl font-bold text-sky-500')

export const AsideSection = styled(
  'section',
  'col-span-full row-span-2 grid grid-cols-subgrid grid-rows-subgrid gap-y-4',
)

export function AsideIcon(props: { Icon: ComponentType<LucideProps> }) {
  return (
    <div className='rounded-full bg-sky-500 p-2.5'>
      <props.Icon className='size-full text-white' />
    </div>
  )
}

export const MainSection = styled('section', 'space-y-6')

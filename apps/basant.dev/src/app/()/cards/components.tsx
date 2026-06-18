import { Fragment, type PropsWithChildren, type ReactNode } from 'react'

import { cn } from '~/lib/utils'

export function PvcCard(props: PropsWithChildren) {
  return (
    <div className='@container aspect-54/86 w-full max-w-sm'>
      <section className='relative isolate size-full overflow-clip rounded-[2cqi] bg-white shadow-lg'>
        {props.children}
      </section>
    </div>
  )
}

export function DataList(props: { data: Record<string, ReactNode>; className?: string }) {
  return (
    <dl
      className={cn(
        'grid gap-x-[1.5cqi] font-medium',
        'grid-cols-2 text-[3.75cqi]',
        props.className,
      )}>
      {Object.entries(props.data).map(([dt, dd]) => (
        <Fragment key={dt}>
          <dt className='text-end text-(--p)'>{dt} :</dt>
          <dd>{dd}</dd>
        </Fragment>
      ))}
    </dl>
  )
}

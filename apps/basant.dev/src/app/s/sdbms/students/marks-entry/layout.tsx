import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'

import { getUserRole } from '~/features/sdbms/dal'

export const metadata: Metadata = {
  title: 'Marks Entry',
}

export default async function StudentsMarksEntryLayout(
  props: LayoutProps<'/s/sdbms/students/marks-entry'>,
) {
  const role = await getUserRole()
  if (role !== 'teacher') notFound()

  return (
    <div className='space-y-8'>
      <h1 className='text-center text-2xl font-bold'>Student Exam Marks Entry</h1>
      {props.children}
    </div>
  )
}

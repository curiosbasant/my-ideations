import type { Metadata } from 'next/types'

export const metadata: Metadata = {
  title: 'Marks Entry',
}

export default function StudentsMarksEntryLayout(
  props: LayoutProps<'/s/sdbms/students/marks-entry'>,
) {
  return (
    <div className='space-y-8'>
      <h1 className='text-center text-2xl font-bold'>Student Exam Marks Entry</h1>
      {props.children}
    </div>
  )
}

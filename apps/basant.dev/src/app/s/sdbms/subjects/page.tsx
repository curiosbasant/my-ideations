import type { Metadata } from 'next/types'

import { getTeacherSubjects } from '~/features/sdbms/dal'
import { actionToggleSubject, FormAddSubject, SubjectTeacherMappingTable } from './client'

export const metadata: Metadata = {
  title: 'Subjects',
}

export default async function TeacherSubjectsPage() {
  const subjects = await getTeacherSubjects(2025)
  return (
    <div className='group space-y-8'>
      <h1 className='text-2xl font-bold'>Teacher Subject Mapping</h1>
      <FormAddSubject onAdd={actionToggleSubject} />
      <div className='overflow-clip rounded-md border'>
        <SubjectTeacherMappingTable subjects={subjects} />
      </div>
    </div>
  )
}

import { getTeacherSubjects } from '~/features/sdbms/dal'
import { SubjectList } from './client'

export default async function TeacherSubjectsPage() {
  const subjects = await getTeacherSubjects(2025)
  return (
    <div className='group space-y-8'>
      <h1 className='text-2xl font-bold'>Teacher Subject Mapping</h1>
      <SubjectList subjects={subjects} />
    </div>
  )
}

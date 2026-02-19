import { Suspense } from 'react'
import Form from 'next/form'

import { resolveStringParam } from '@my/lib/utils'

import { FormSubmitButton } from '~/components/forms/client'
import {
  FormFieldSelectClass,
  FormFieldSelectExam,
  FormFieldSelectSession,
  FormFieldSelectSubject,
} from '~/features/sdbms/components/form-fields'
import { getClassStudentsMark } from '~/features/sdbms/dal'
import { MarkInput } from './client'

export default async function StudentsMarksEntryPage(
  props: PageProps<'/s/sdbms/students/marks-entry'>,
) {
  const searchParams = await props.searchParams
  const session = resolveStringParam(searchParams.session)
  const exam = resolveStringParam(searchParams.exam)
  const standard = resolveStringParam(searchParams.class)
  const subject = resolveStringParam(searchParams.subject)

  return (
    <div className='@container mx-auto max-w-md'>
      <Form action='' className='@md:grid-cols-2 @2xl:grid-cols-4 grid gap-4'>
        <FormFieldSelectSession defaultValue={session} />
        <FormFieldSelectExam defaultValue={exam} />
        <FormFieldSelectClass defaultValue={standard} />
        <FormFieldSelectSubject defaultValue={subject} />

        <div className='col-span-full flex justify-end'>
          <FormSubmitButton>Submit</FormSubmitButton>
        </div>
      </Form>
      {session && exam && standard && subject && (
        <Suspense
          fallback={
            <div className='rounded-md border px-6 py-4'>
              <p className='text-muted-foreground text-center'>Please wait...</p>
            </div>
          }>
          <StudentsList
            studentsPromise={getClassStudentsMark(+session, +exam, +standard, +subject)}
          />
        </Suspense>
      )}
    </div>
  )
}

async function StudentsList(props: { studentsPromise: ReturnType<typeof getClassStudentsMark> }) {
  const students = await props.studentsPromise

  return students.length === 0 ?
      <div className='rounded-md border px-6 py-4'>
        <p className='text-muted-foreground text-center'>Sorry, no match found!</p>
      </div>
    : <ul className='grid grid-cols-[1fr_5rem] gap-2 gap-x-6 md:grid-cols-[1fr_6rem]'>
        {students.map((student) => (
          <li
            className='focus-within:border-primary col-span-full grid grid-cols-subgrid rounded-md border p-2 transition-colors'
            key={student.id}>
            <div className=''>
              <div className='flex items-center gap-3'>
                <span className='font-bold'>{student.admissionNo}</span>
                <span className=''>{student.fullName}</span>
              </div>
              <span className='text-muted-foreground text-sm'>{student.fName}</span>
            </div>
            <MarkInput
              classStudentId={student.class.studentId}
              className='placeholder:text-muted-foreground/50 size-full text-center text-xl font-bold tabular-nums leading-normal shadow-inner md:text-2xl'
              placeholder='0'
              name={`mark_${student.class.studentId}`}
              defaultValue={student.mark ?? undefined}
              type='text'
            />
          </li>
        ))}
      </ul>
}

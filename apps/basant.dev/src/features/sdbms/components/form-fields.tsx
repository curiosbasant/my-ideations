import { Suspense } from 'react'

import { FormField } from '~/components/forms/shared'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { getExams, getInstituteClasses, getInstitutes, getSessions, getSubjects } from '../dal'

export function FormFieldSelectClass(props: { defaultValue?: string | null }) {
  return (
    <FormField label='Class'>
      <Select name='class' defaultValue={props.defaultValue ?? undefined} required>
        <SelectTrigger className='backdrop-blur-2xs w-full'>
          <SelectValue placeholder='Select a class' />
        </SelectTrigger>
        <SelectContent>
          <Suspense
            fallback={
              <SelectItem value='0' disabled>
                Loading...
              </SelectItem>
            }>
            <OptionsClass />
          </Suspense>
        </SelectContent>
      </Select>
    </FormField>
  )
}
async function OptionsClass() {
  const classes = await getInstituteClasses()

  return (
    <>
      {classes.map((opt) => (
        <SelectItem value={String(opt.numeral)} key={opt.id}>
          {opt.name}
        </SelectItem>
      ))}
    </>
  )
}

export function FormFieldSelectExam(props: { defaultValue?: string | null }) {
  return (
    <FormField label='Exam'>
      <Select name='exam' defaultValue={props.defaultValue ?? undefined} required>
        <SelectTrigger className='backdrop-blur-2xs w-full'>
          <SelectValue placeholder='Select a exam' />
        </SelectTrigger>
        <SelectContent>
          <Suspense
            fallback={
              <SelectItem value='0' disabled>
                Loading...
              </SelectItem>
            }>
            <OptionsExam />
          </Suspense>
        </SelectContent>
      </Select>
    </FormField>
  )
}
async function OptionsExam() {
  const exams = await getExams()

  return (
    <>
      {exams.map((opt) => (
        <SelectItem value={String(opt.id)} key={opt.id}>
          {opt.name}
        </SelectItem>
      ))}
    </>
  )
}

export function FormFieldSelectInstitute() {
  return (
    <FormField className='col-span-full' label='School Name'>
      <Select name='school' required>
        <SelectTrigger className='backdrop-blur-2xs w-full'>
          <SelectValue placeholder='Select your school' />
        </SelectTrigger>
        <SelectContent>
          <Suspense
            fallback={
              <SelectItem value='0' disabled>
                Loading Schools...
              </SelectItem>
            }>
            <OptionsInstitute />
          </Suspense>
        </SelectContent>
      </Select>
    </FormField>
  )
}
async function OptionsInstitute() {
  const institutes = await getInstitutes()
  return (
    <>
      {institutes.map((institute) => (
        <SelectItem value={institute.id.toString()} key={institute.id}>
          {institute.name}
        </SelectItem>
      ))}
    </>
  )
}

export function FormFieldSelectSession(props: { defaultValue?: string | null }) {
  return (
    <FormField label='Session'>
      <Suspense>
        <OptionsSession defaultValue={props.defaultValue} />
      </Suspense>
    </FormField>
  )
}
async function OptionsSession(props: { defaultValue?: string | null }) {
  const sessions = await getSessions()
  const lastSessionId = props.defaultValue ?? Math.max(...sessions.map((s) => s.id))
  return (
    <Select name='session' required defaultValue={lastSessionId.toString()}>
      <SelectTrigger className='backdrop-blur-2xs w-full'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {sessions.map((opt) => (
          <SelectItem value={String(opt.id)} key={opt.id}>
            {opt.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function FormFieldSelectSubject(props: { defaultValue?: string | null }) {
  return (
    <FormField label='Subject'>
      <Select name='subject' defaultValue={props.defaultValue ?? undefined} required>
        <SelectTrigger className='backdrop-blur-2xs w-full'>
          <SelectValue placeholder='Select a class' />
        </SelectTrigger>
        <SelectContent>
          <Suspense
            fallback={
              <SelectItem value='0' disabled>
                Loading...
              </SelectItem>
            }>
            <OptionsSubject />
          </Suspense>
        </SelectContent>
      </Select>
    </FormField>
  )
}
async function OptionsSubject() {
  const subjects = await getSubjects()

  return (
    <>
      {subjects.map((opt) => (
        <SelectItem value={String(opt.id)} key={opt.id}>
          {opt.name}
        </SelectItem>
      ))}
    </>
  )
}

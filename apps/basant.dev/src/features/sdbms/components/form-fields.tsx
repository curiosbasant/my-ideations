import { Suspense } from 'react'

import { FormControl, FormSelect } from '~/components/ui/form'
import { SelectItem } from '~/components/ui/select'
import { getExams, getInstituteClasses, getInstitutes, getSessions, getSubjects } from '../dal'

export function FormFieldSelectClass(props: { defaultValue?: string | null }) {
  return (
    <FormControl labelClassName='text-lg font-bold' label='Class' fieldId='class'>
      <FormSelect
        name='class'
        defaultValue={props.defaultValue ?? undefined}
        placeholder='Select a class'
        fieldId='class'
        required>
        <Suspense
          fallback={
            <SelectItem value='0' disabled>
              Loading...
            </SelectItem>
          }>
          <OptionsClass />
        </Suspense>
      </FormSelect>
    </FormControl>
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
    <FormControl labelClassName='text-lg font-bold' label='Exam' fieldId='exam'>
      <FormSelect
        name='exam'
        defaultValue={props.defaultValue ?? undefined}
        placeholder='Select a exam'
        fieldId='exam'
        required>
        <Suspense
          fallback={
            <SelectItem value='0' disabled>
              Loading...
            </SelectItem>
          }>
          <OptionsExam />
        </Suspense>
      </FormSelect>
    </FormControl>
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
    <FormControl
      className='col-span-full'
      labelClassName='text-lg font-bold'
      label='School Name'
      fieldId='school'>
      <FormSelect name='school' placeholder='Select your school' fieldId='school' required>
        <Suspense
          fallback={
            <SelectItem value='0' disabled>
              Loading Schools...
            </SelectItem>
          }>
          <OptionsInstitute />
        </Suspense>
      </FormSelect>
    </FormControl>
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
    <FormControl labelClassName='text-lg font-bold' label='Session' fieldId='session'>
      <Suspense>
        <OptionsSession defaultValue={props.defaultValue} />
      </Suspense>
    </FormControl>
  )
}
async function OptionsSession(props: { defaultValue?: string | null }) {
  const sessions = await getSessions()
  const lastSessionId = props.defaultValue ?? Math.max(...sessions.map((s) => +s.id))
  return (
    <FormSelect
      name='session'
      defaultValue={lastSessionId.toString()}
      placeholder='Select a session'
      fieldId='session'
      required>
      {sessions.map((opt) => (
        <SelectItem value={String(opt.id)} key={opt.id}>
          {opt.name}
        </SelectItem>
      ))}
    </FormSelect>
  )
}

export function FormFieldSelectSubject(props: { defaultValue?: string | null }) {
  return (
    <FormControl labelClassName='text-lg font-bold' label='Subject' fieldId='subject'>
      <FormSelect
        name='subject'
        defaultValue={props.defaultValue ?? undefined}
        placeholder='Select a subject'
        fieldId='subject'
        required>
        <Suspense
          fallback={
            <SelectItem value='0' disabled>
              Loading...
            </SelectItem>
          }>
          <OptionsSubject />
        </Suspense>
      </FormSelect>
    </FormControl>
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

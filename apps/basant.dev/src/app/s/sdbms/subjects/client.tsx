'use client'

import { startTransition, Suspense, useOptimistic } from 'react'
import { useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'

import { useTrpc } from '@my/core/trpc/client'
import { z } from '@my/lib/zod'

import { FormSubmitButton } from '~/components/forms/client'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { toast } from '~/components/ui/sonner'
import { Table } from '~/components/ui/table'
import { actionTeacherAddSubject } from '~/features/sdbms/actions'
import { useAppForm } from '~/features/shared/form/hooks'
import { useAction } from '~/lib/utils/helper-action/client'

const helpers = createColumnHelper<{
  className: string
  sectionName: string
  subjectName: string
}>()
const columns = [
  helpers.accessor('className', {
    header: () => <div className='text-start text-base'>Class</div>,
  }),
  helpers.accessor('sectionName', {
    header: () => <div className='text-start text-base'>Section</div>,
  }),
  helpers.accessor('subjectName', {
    header: () => <div className='text-start text-base'>Subject</div>,
  }),
  helpers.display({ id: 'actions', cell: () => 'p' }),
]

export function SubjectList(props: {
  subjects: {
    className: string
    sectionName: string
    subjectName: string
  }[]
}) {
  const [optimisticSubjects, addSubject] = useOptimistic(
    props.subjects,
    (
      draft,
      payload: {
        className: string
        sectionName: string
        subjectName: string
      },
    ) => {
      return [...draft, payload]
    },
  )
  const { state, actionTransition } = useAction({
    actionFn: actionTeacherAddSubject,
    onSuccess: () => {
      toast.success('Teacher subject added')
    },
  })
  const trpc = useTrpc()
  const client = useQueryClient()

  return (
    <>
      <FormAddSubject
        onAdd={(data) => {
          const clas = client
            .getQueryData(trpc.sdbms.class.list.queryKey())
            ?.find((c) => c.id === data.classId)
          const section = client
            .getQueryData(trpc.sdbms.class.section.list.queryKey(data.classId))
            ?.find((c) => c.id === data.sectionId)
          const subject = client
            .getQueryData(trpc.sdbms.subject.list.queryKey())
            ?.find((c) => c.id === data.subjectId)

          if (clas || section || subject) {
            startTransition(() => {
              addSubject({
                className: clas?.name || '',
                sectionName: section?.name || '',
                subjectName: subject?.name || '',
              })
            })
          }
          actionTransition({
            sessionId: 2025,
            sectionId: data.sectionId,
            subjectId: data.subjectId,
          })
        }}
      />
      <div className='overflow-clip rounded-md border'>
        <Table rows={optimisticSubjects} columns={columns} />
      </div>
    </>
  )
}

const schemaAddSubject = z.object({
  classId: z.string().nonempty().transform(Number),
  sectionId: z.string().nonempty().transform(Number),
  subjectId: z.string().nonempty().transform(Number),
})
const defaultValues: z.input<typeof schemaAddSubject> = {
  classId: '',
  sectionId: '',
  subjectId: '',
}
type FormData = z.input<typeof schemaAddSubject>

function FormAddSubject(props: {
  onAdd: (data: { classId: number; sectionId: number; subjectId: number }) => void
}) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: schemaAddSubject,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
      const v = schemaAddSubject.parse(value)
      props.onAdd(v)
    },
  })

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault()
        form.handleSubmit()
      }}
      className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      <form.AppField
        name='classId'
        listeners={{
          onChange: ({ fieldApi }) => {
            fieldApi.form.setFieldValue('sectionId', '')
          },
        }}>
        {(field) => (
          <field.Select>
            <Suspense
              fallback={
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Loading Classes' />
                </SelectTrigger>
              }>
              <SelectClasses />
            </Suspense>
          </field.Select>
        )}
      </form.AppField>
      <form.Subscribe selector={(state) => state.values.classId}>
        {(classId) => (
          <form.AppField name='sectionId'>
            {(field) => (
              <field.Select disabled={!classId}>
                <SelectClassSection classId={Number.parseInt(classId)} />
              </field.Select>
            )}
          </form.AppField>
        )}
      </form.Subscribe>
      <form.AppField name='subjectId'>
        {(field) => (
          <field.Select>
            <Suspense
              fallback={
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Loading Subjects' />
                </SelectTrigger>
              }>
              <SelectSubjects />
            </Suspense>
          </field.Select>
        )}
      </form.AppField>
      <FormSubmitButton>Add Subject</FormSubmitButton>
    </form>
  )
}

function SelectClasses() {
  const trpc = useTrpc()
  const { data: classes } = useSuspenseQuery(trpc.sdbms.class.list.queryOptions())

  return (
    <>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Select Class' />
      </SelectTrigger>
      <SelectContent>
        {classes.map((c) => (
          <SelectItem value={c.numeral.toString()} key={c.id}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </>
  )
}

function SelectSubjects() {
  const trpc = useTrpc()
  const { data: subjects } = useSuspenseQuery(trpc.sdbms.subject.list.queryOptions())

  return (
    <>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Select Subject' />
      </SelectTrigger>
      <SelectContent>
        {subjects.map((c) => (
          <SelectItem value={c.id.toString()} key={c.id}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </>
  )
}

function SelectClassSection(props: { classId: number }) {
  const trpc = useTrpc()
  const {
    isLoading,
    isSuccess,
    data: sections,
  } = useQuery({
    ...trpc.sdbms.class.section.list.queryOptions(props.classId),
    enabled: !!props.classId,
  })

  if (isSuccess) {
    return (
      <>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Select Section' />
        </SelectTrigger>
        <SelectContent>
          {sections.map((c) => (
            <SelectItem value={c.id.toString()} key={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </>
    )
  }
  return (
    <SelectTrigger className='w-full'>
      <SelectValue placeholder={isLoading ? 'Loading Sections...' : 'Select a class first'} />
    </SelectTrigger>
  )
}

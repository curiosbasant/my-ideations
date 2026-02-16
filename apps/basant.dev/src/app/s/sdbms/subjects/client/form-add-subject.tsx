import { Suspense } from 'react'

import { Query } from '@my/core/trpc/query'
import { z } from '@my/lib/zod'

import { FormSubmitButton } from '~/components/forms/client'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { useAppForm } from '~/features/shared/form/hooks'

const schemaAddSubject = z.record(
  z.literal(['classId', 'sectionId', 'subjectId']),
  z.string().nonempty().transform(Number),
)
const defaultValues: z.input<typeof schemaAddSubject> = {
  classId: '',
  sectionId: '',
  subjectId: '',
}

export function FormAddSubject(props: {
  onAdd: (data: z.output<typeof schemaAddSubject>) => void
}) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: schemaAddSubject,
    },
    async onSubmit({ value }) {
      const parsedValue = schemaAddSubject.parse(value)
      props.onAdd(parsedValue)
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
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select Class' />
              </SelectTrigger>
              <Query options={(trpc) => trpc.sdbms.class.list.queryOptions()}>
                {(classes) => (
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem value={c.numeral.toString()} key={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                )}
              </Query>
            </Suspense>
          </field.Select>
        )}
      </form.AppField>
      <form.Subscribe selector={(state) => state.values.classId}>
        {(classId) => (
          <form.AppField name='sectionId'>
            {(field) =>
              classId ?
                <field.Select>
                  <Suspense
                    fallback={
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Loading Sections' />
                      </SelectTrigger>
                    }
                    // Without it, its making the dropdown open in the top-left corner
                    key={classId}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select Section' />
                    </SelectTrigger>
                    <Query
                      options={(trpc) =>
                        trpc.sdbms.class.section.list.queryOptions(Number.parseInt(classId))
                      }>
                      {(sections) => (
                        <SelectContent>
                          {sections.map((s) => (
                            <SelectItem value={s.id.toString()} key={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      )}
                    </Query>
                  </Suspense>
                </field.Select>
              : <field.Select disabled>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select a class first' />
                  </SelectTrigger>
                </field.Select>
            }
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
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select Subject' />
              </SelectTrigger>
              <Query options={(trpc) => trpc.sdbms.subject.list.queryOptions()}>
                {(subjects) => (
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem value={s.id.toString()} key={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                )}
              </Query>
            </Suspense>
          </field.Select>
        )}
      </form.AppField>
      <FormSubmitButton>Add Subject</FormSubmitButton>
    </form>
  )
}

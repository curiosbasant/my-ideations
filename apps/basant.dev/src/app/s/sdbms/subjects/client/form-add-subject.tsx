import { Suspense } from 'react'

import { Query } from '@my/core/trpc/query'
import { z } from '@my/lib/zod'

import { SelectItem } from '~/components/ui/select'
import { useAppForm } from '~/features/shared/form/hooks'

const schemaAddSubject = z.record(
  z.literal(['classId', 'sectionId', 'subjectId']),
  z.string().nonempty(),
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
      onMount: schemaAddSubject,
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
      <form.AppForm>
        <form.AppField
          name='classId'
          listeners={{
            onChange: ({ fieldApi }) => {
              fieldApi.form.setFieldValue('sectionId', '')
            },
          }}>
          {(field) => (
            <Suspense fallback={<field.Select placeholder='Loading Classes' disabled />}>
              <field.Select placeholder='Select Class'>
                <Query options={(trpc) => trpc.sdbms.class.list.queryOptions()}>
                  {(classes) =>
                    classes.map((c) => (
                      <SelectItem value={c.numeral.toString()} key={c.id}>
                        {c.name}
                      </SelectItem>
                    ))
                  }
                </Query>
              </field.Select>
            </Suspense>
          )}
        </form.AppField>
        <form.Subscribe selector={(state) => state.values.classId}>
          {(classId) => (
            <form.AppField name='sectionId'>
              {(field) =>
                classId ?
                  <Suspense fallback={<field.Select placeholder='Loading Sections' />}>
                    <field.Select placeholder='Select Section'>
                      <Query
                        options={(trpc) => trpc.sdbms.class.section.list.queryOptions(classId)}>
                        {(sections) =>
                          sections.map((s) => (
                            <SelectItem value={s.id.toString()} key={s.id}>
                              {s.name}
                            </SelectItem>
                          ))
                        }
                      </Query>
                    </field.Select>
                  </Suspense>
                : <field.Select placeholder='Select a class first' disabled />
              }
            </form.AppField>
          )}
        </form.Subscribe>
        <form.AppField name='subjectId'>
          {(field) => (
            <Suspense fallback={<field.Select placeholder='Loading Subjects' disabled />}>
              <field.Select placeholder='Select Subject'>
                <Query options={(trpc) => trpc.sdbms.subject.list.queryOptions()}>
                  {(subjects) =>
                    subjects.map((s) => (
                      <SelectItem value={s.id.toString()} key={s.id}>
                        {s.name}
                      </SelectItem>
                    ))
                  }
                </Query>
              </field.Select>
            </Suspense>
          )}
        </form.AppField>
        <form.SubmitButton>Add Subject</form.SubmitButton>
      </form.AppForm>
    </form>
  )
}

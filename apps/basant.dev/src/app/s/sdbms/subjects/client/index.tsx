'use client'

import { startTransition } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import { XIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { toast } from '~/components/ui/sonner'
import { Table } from '~/components/ui/table'
import { actionTeacherToggleSubject } from '~/features/sdbms/actions'

export * from './form-add-subject'

type SubjectMap = {
  classId: number
  sectionId: number
  subjectId: number
  className: string
  sectionName: string
  subjectName: string
}

export function actionToggleSubject(data: { sectionId: number; subjectId: number }) {
  startTransition(async () => {
    await actionTeacherToggleSubject({
      sessionId: 2025,
      sectionId: data.sectionId,
      subjectId: data.subjectId,
    })
    toast.success('Teacher subject added')
  })
}

const helpers = createColumnHelper<SubjectMap>()
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
  helpers.display({
    id: 'delete',
    cell: ({ row }) => (
      <div className='flex justify-end'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => {
            startTransition(async () => {
              await actionTeacherToggleSubject({
                sessionId: 2025,
                sectionId: row.original.sectionId,
                subjectId: row.original.subjectId,
              })
              toast.success('Teacher subject removed')
            })
          }}>
          <XIcon />
        </Button>
      </div>
    ),
  }),
]

export function SubjectTeacherMappingTable(props: { subjects: SubjectMap[] }) {
  return <Table columns={columns} rows={props.subjects} />
}

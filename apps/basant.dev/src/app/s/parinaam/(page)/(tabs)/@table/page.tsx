'use client'

import { createColumnHelper } from '@tanstack/react-table'

import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area'
import { Table } from '~/components/ui/table'
import { useFilteredResults } from '../../query'
import type { ResultQueryOutput } from '../../shared'

const helpers = createColumnHelper<ResultQueryOutput>()

export default function ResultTableSlot() {
  const results = useFilteredResults()

  const subjects = results[0]?.subjects ?? []
  const columns = [
    helpers.accessor('rank', { header: 'Class Rank' }),
    helpers.accessor('roll', { header: 'Roll Number' }),
    helpers.accessor('name', { header: 'Student Name' }),
    helpers.accessor('fName', { header: 'Father Name' }),
    helpers.accessor('mName', { header: 'Mother Name' }),
    ...subjects.map((sub, i) =>
      // @ts-expect-error
      helpers.accessor(`subjects.${i}.totalMarks`, { header: sub.name }),
    ),
    helpers.accessor('marksObtained', { header: 'Marks Obtained' }),
    helpers.accessor('percentageText', { header: 'Percentage' }),
    helpers.accessor('division', { header: () => <div className='min-w-16'>Result</div> }),
  ]

  return (
    <div className='-mx-(--page-padding) flex'>
      <div className='w-0 flex-1 xl:mask-x-from-transparent xl:mask-x-to-black xl:mask-x-to-(--page-padding)'>
        <ScrollArea className='-mb-3 pb-3'>
          <div className='px-(--page-padding)'>
            <div className='overflow-clip rounded-md border'>
              <Table rows={results} columns={columns} />
            </div>
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </div>
    </div>
  )
}

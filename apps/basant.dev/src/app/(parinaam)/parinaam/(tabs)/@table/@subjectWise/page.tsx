'use client'

import { createColumnHelper } from '@tanstack/react-table'

import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area'
import { Table } from '~/components/ui/table'
import { useFilteredResults } from '../../../query'

type RowType = {
  subjectName: string
  totalStudents: number
  distinctionCount: number
  firstDivisionCount: number
  secondDivisionCount: number
  thirdDivisionCount: number
  passCount: number
  failCount: number
}

const helpers = createColumnHelper<RowType>()

const columns = [
  helpers.accessor('subjectName', { header: 'Subject Name' }),
  helpers.accessor('totalStudents', { header: 'Total Students' }),
  helpers.accessor('passCount', { header: 'Pass' }),
  helpers.accessor('distinctionCount', { header: 'Distinction' }),
  helpers.accessor('firstDivisionCount', { header: 'First Division' }),
  helpers.accessor('secondDivisionCount', { header: 'Second Division' }),
  helpers.accessor('thirdDivisionCount', { header: 'Third Division' }),
  helpers.accessor('failCount', { header: 'Fail' }),
  helpers.display({
    header: 'Pass Percentage',
    cell: ({ row }) =>
      `${((row.original.passCount / row.original.totalStudents) * 100).toFixed(2)}%`,
  }),
]

export default function SubjectWiseTable() {
  const results = useFilteredResults()
  const rowsObj = results.reduce(
    (arr, row) => {
      for (const sub of row.subjects) {
        arr[sub.name] ??= {
          subjectName: sub.name,
          totalStudents: 0,
          passCount: 0,
          distinctionCount: 0,
          firstDivisionCount: 0,
          secondDivisionCount: 0,
          thirdDivisionCount: 0,
          failCount: 0,
        }
        arr[sub.name].totalStudents++

        if (sub.totalMarks < 33) arr[sub.name].failCount++
        else {
          arr[sub.name].passCount++
          if (sub.totalMarks < 40) {
          } else if (sub.totalMarks < 50) arr[sub.name].thirdDivisionCount++
          else if (sub.totalMarks < 60) arr[sub.name].secondDivisionCount++
          else {
            arr[sub.name].firstDivisionCount++
            if (sub.totalMarks >= 75) arr[sub.name].distinctionCount++
          }
        }
      }
      return arr
    },
    {} as Record<string, RowType>,
  )

  return (
    <div className='-mx-(--page-padding) flex'>
      <div className='w-0 flex-1'>
        <ScrollArea className='-mb-3 pb-3'>
          <div className='px-(--page-padding)'>
            <div className='overflow-clip rounded-md border'>
              <Table rows={Object.values(rowsObj)} columns={columns} />
            </div>
          </div>
          <ScrollBar orientation='horizontal' />{' '}
        </ScrollArea>
      </div>
    </div>
  )
}

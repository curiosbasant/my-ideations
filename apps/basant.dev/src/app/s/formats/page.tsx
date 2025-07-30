import Form from 'next/form'
import { DownloadIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { handleChange } from './client'

const formats = [
  {
    id: 1,
    name: 'Resume Template - Modern',
    description: 'Clean and professional resume template with modern design',
    url: 'https://example.com/resume-modern',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    name: 'Invoice Format - Business',
    description: 'Professional invoice template for small businesses',
    url: 'https://example.com/invoice-business',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 3,
    name: 'Cover Letter - Creative',
    description: 'Stand out with this creative cover letter template',
    url: 'https://example.com/cover-letter-creative',
    createdAt: new Date('2024-01-25'),
  },
  {
    id: 4,
    name: 'Project Proposal - Tech',
    description: 'Technical project proposal template with timeline',
    url: 'https://example.com/proposal-tech',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 5,
    name: 'Meeting Agenda - Corporate',
    description: 'Structured meeting agenda for corporate environments',
    url: 'https://example.com/agenda-corporate',
    createdAt: new Date('2024-02-05'),
  },
  {
    id: 6,
    name: 'Budget Spreadsheet - Personal',
    description: 'Personal finance tracking spreadsheet template',
    url: 'https://example.com/budget-personal',
    createdAt: new Date('2024-02-10'),
  },
  {
    id: 7,
    name: 'Event Planning Checklist',
    description: 'Comprehensive event planning checklist template',
    url: 'https://example.com/event-checklist',
    createdAt: new Date('2024-02-15'),
  },
  {
    id: 8,
    name: 'Content Calendar - Social Media',
    description: 'Monthly social media content planning calendar',
    url: 'https://example.com/content-calendar',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 9,
    name: 'Product Requirements Doc',
    description: 'Technical product requirements document template',
    url: 'https://example.com/prd-template',
    createdAt: new Date('2024-02-25'),
  },
  {
    id: 10,
    name: 'Weekly Report - Marketing',
    description: 'Marketing performance weekly report template',
    url: 'https://example.com/marketing-report',
    createdAt: new Date('2024-03-01'),
  },
  {
    id: 11,
    name: 'Employee Onboarding Checklist',
    description: 'Comprehensive new employee onboarding checklist',
    url: 'https://example.com/onboarding-checklist',
    createdAt: new Date('2024-03-05'),
  },
  {
    id: 12,
    name: 'Client Feedback Form',
    description: 'Professional client feedback collection form',
    url: 'https://example.com/feedback-form',
    createdAt: new Date('2024-03-10'),
  },
]

export default async function FormatsPage(props: PageProps<{ searchParams: 'query' }>) {
  const searchParams = await props.searchParams

  const filteredFormats =
    searchParams.query ?
      formats.filter((format) =>
        format.name.toLowerCase().includes(searchParams.query!.toLowerCase()),
      )
    : formats

  return (
    <div className='flex flex-1 flex-col gap-8'>
      {/* <SearchForm query={searchParams.query} /> */}
      <Form action='' onChange={handleChange}>
        <Input
          className='h-auto px-4 py-3 text-lg md:text-xl'
          name='query'
          defaultValue={searchParams.query ?? undefined}
          placeholder='Search for a format'
          type='search'
        />
      </Form>
      <h2 className='text-2xl font-bold'>Recent Formats</h2>
      <ul className='grid grid-cols-[1fr_auto] gap-4'>
        {filteredFormats.map((format) => (
          <FormatListItem format={format} key={format.id} />
        ))}
      </ul>
    </div>
  )
}

function FormatListItem(props: { format: (typeof formats)[number] }) {
  return (
    <li className='bg-background col-span-2 grid grid-flow-col grid-cols-subgrid grid-rows-2 rounded-md border p-4'>
      <h3 className='text-lg font-bold'>{props.format.name}</h3>
      <p className='text-sm text-gray-500'>{props.format.description}</p>
      <Button className='col-start-2 row-span-2' variant='secondary' size='icon'>
        <DownloadIcon className='size-4' />
      </Button>
    </li>
  )
}

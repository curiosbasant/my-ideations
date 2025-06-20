import type { HomeProps } from '../../shared'
import { ClassResultPieChart, ResponsiveClassToppersBarChart } from './client'

export default function ResultSummary(props: HomeProps) {
  return (
    <>
      <section className='flex flex-col gap-8'>
        <h2 className='text-center text-2xl font-bold'>🎯 Class Result 🍕</h2>
        <ClassResultPieChart />
      </section>
      <section className='space-y-8'>
        <h2 className='text-center text-2xl font-bold'>🥇🥈🥉 Class Toppers 🏆</h2>
        <ResponsiveClassToppersBarChart />
      </section>
    </>
  )
}

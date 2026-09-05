import { TabsContent } from '~/components/ui/tabs'
import { ClassResultPieChart, ResponsiveClassToppersBarChart } from './client'

export const instant = false

export default function ResultSummary() {
  return (
    <TabsContent value='summary' className='grid items-start gap-y-16 lg:grid-cols-[1fr_2fr]'>
      <section className='flex flex-col gap-8'>
        <h2 className='text-center text-2xl font-bold'>🎯 Class Result 🍕</h2>
        <ClassResultPieChart />
      </section>
      <section className='space-y-8'>
        <h2 className='text-center text-2xl font-bold'>🥇🥈🥉 Class Toppers 🏆</h2>
        <ResponsiveClassToppersBarChart />
      </section>
    </TabsContent>
  )
}

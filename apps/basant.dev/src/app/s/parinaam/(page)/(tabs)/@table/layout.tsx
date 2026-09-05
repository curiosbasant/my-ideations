import { TabsContent } from '~/components/ui/tabs'

export const instant = false

export default function ResultTableSlotLayout(props: LayoutProps<'/s/parinaam'>) {
  return (
    <TabsContent value='table'>
      {props.children}
      <h2 className='mt-16 mb-8 text-center text-2xl font-bold'>📚 Subject wise Result</h2>
      {props.subjectWise}
    </TabsContent>
  )
}

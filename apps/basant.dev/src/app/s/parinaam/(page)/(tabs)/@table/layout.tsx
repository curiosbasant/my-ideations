export default function ResultTableSlotLayout(props: LayoutProps<'/s/parinaam'>) {
  return (
    <div>
      {props.children}
      <h2 className='mb-8 mt-16 text-center text-2xl font-bold'>📚 Subject wise Result</h2>
      {props.subjectWise}
    </div>
  )
}

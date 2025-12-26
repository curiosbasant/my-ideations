export default function ParinaamPageLayout(props: LayoutProps<'/s/parinaam'>) {
  return (
    <div className='space-y-16'>
      {props.form}
      {props.prefetchResults}
      {props.children}
    </div>
  )
}

import Head from 'next/head'

function Page({ title, children }: React.PropsWithChildren<{ title: string }>) {
  return (
    <>
      <Head>
        <title>{title} — Ideation</title>
      </Head>
      {children}
    </>
  )
}
export default Page

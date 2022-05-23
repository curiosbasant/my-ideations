import Head from "next/head"

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
/* 
  <link
    rel="shortcut icon"
    href="https://www.inkcourse.com/wp-content/uploads/2021/08/favicon.png"
  />
*/

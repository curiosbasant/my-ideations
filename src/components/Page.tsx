import Head from "next/head"

const Page: React.FC<{ title: string }> = ({ title, children }) => {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
          rel="stylesheet"
        />

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

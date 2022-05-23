import { NextPage } from "next"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"

const ResumePage: NextPage = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-100 shadow-lg">
      <div className="mx-auto flex max-w-7xl overflow-y-auto border-r bg-white text-lg print:max-w-none">
        <div className="relative w-96 shrink-0 overflow-hidden border-x border-x-sky-200/75 bg-sky-100">
          <div className="absolute -m-16 h-48 w-64 rotate-[24deg] skew-x-[45deg] bg-sky-200"></div>
          <aside className="space-y-8 p-8 text-slate-500">
            <section className="py-8">
              <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-full border-8 border-sky-400 bg-slate-200 shadow-inner">
                <Image
                  src="/assets/passport_photo.jpg"
                  // contextMenu="hello"
                  objectFit="cover"
                  objectPosition="center -8px"
                  layout="fill"
                />
              </div>
            </section>

            <Asides icon="person" label="About Me">
              <p>
                I born in 1999, highly motivated and eager to learn new technologies. I like to give
                best results from the task given to me. I can work as an individual as well as in a
                team. I'm seeking for a great experience of the real world in the field of web
                development, where my professional skills can be used for the better growth and
                development of the organisation and myself.
              </p>
            </Asides>
            <Asides label="Contact">
              <div className="flex gap-8">
                <div className="-ml-20 w-12 space-y-4 rounded-full bg-sky-500 px-2.5 py-3 text-white">
                  <span className="icon text-3xl">phone</span>
                  <span className="icon text-3xl">mail</span>
                  <span className="icon text-3xl">home</span>
                </div>
                <div className="flex flex-col gap-y-4 pt-4">
                  <span className="block">+917023367365</span>
                  <span className="block">
                    <a href="mailto:basantbrpl@gmail.com">basantbrpl@gmail.com</a>
                  </span>
                  <span className="block">
                    Jodhpur, Rajasthan <small>(342027)</small>
                  </span>
                </div>
              </div>
            </Asides>
            <Asides icon="school" label="Education">
              <div className="space-y-6">
                <div className="space-y-2">
                  <strong className="text-base text-slate-400">2017 - 2020</strong>
                  <p className="leading-6">Bachelor of Computer Application</p>
                  <p className="leading-6">Maharaja Ganga Singh University, Bikaner</p>
                </div>
                <div className="space-y-2">
                  <strong className="text-base text-slate-400">2015 - 2017</strong>
                  <p className="leading-6">
                    Higher Secondary School: Physics, Chemistry, Maths and Computer Science
                  </p>
                  <p className="leading-6">Central Board of Secondary Education (KVS)</p>
                </div>
              </div>
            </Asides>
            <Asides icon="language" label="Languages">
              <ul className="space-y-2">
                <LanguageItem language="Hindi" level={5} />
                <LanguageItem language="English" level={4} />
                <LanguageItem language="Marwari" level={4} />
              </ul>
            </Asides>
            <Asides icon="share" label="Social Handles">
              <a
                href="https://github.com/CuriosBasant"
                className="inline-block h-8 w-8"
                target="_blank">
                <GithubLogo />
              </a>
              <a
                href="https://www.linkedin.com/in/basant-barupal"
                className="ml-4 inline-block h-8 w-8"
                target="_blank">
                <LinkedInLogo />
              </a>
            </Asides>
          </aside>
        </div>

        <div className="relative flex-1">
          <div
            className="absolute h-96 w-full"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0, 0, 0, 1.0) 50%, transparent 100%)",
            }}>
            <div
              className="h-full "
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23cbd5e1' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E\")",
              }}
            />
          </div>
          <main className="relative space-y-12 px-24 py-12 text-slate-600">
            <section className="flex items-center py-4">
              <div className="grow space-y-4">
                <h1 className="text-6xl text-slate-500">
                  <b className=" text-sky-500">Basant</b> Barupal
                </h1>
                <h2 className="text-5xl text-slate-400">Full-Stack Web Developer</h2>
              </div>
              <div className="-mr-16 h-64 w-12 rounded-full bg-sky-400 before:ml-auto before:mt-8 before:block before:h-10 before:w-4 before:bg-[image:repeating-linear-gradient(white,white_.5rem,transparent_.5rem,transparent_1rem)]"></div>
            </section>
            <section className="space-y-8">
              <h3 className="text-3xl font-bold text-sky-500">My Projects</h3>
              <p>
                There are many projects, I've created during my learning phase in last 4 years, but
                these are some of them which I want to showcase here.
              </p>
              <ProjectItem title="shadyantra" link="https://shadyantra.vercel.app/editor">
                A real indian ancient online multiplayer 10x10 chess board game, built using the
                tools - nextjs, tailwindcss, nodejs, typescript and firebase. <br />
                Test the board of shadyantra -{" "}
                <a href="https://shadyantra.vercel.app/editor" className="text-sky-500">
                  Shadyantra Board Editor
                </a>
              </ProjectItem>
              <ProjectItem title="inkcourse">
                An online social platform where people can create and join group of there interest,
                play quizzes, purchase courses, etc (still in alpha), built using the tools -
                nextjs, tailwindcss, nodejs, typescript and firebase
              </ProjectItem>
              <ProjectItem title="OwnlyOne" link="https://github.com/CuriosBasant/ownly-one">
                A discord bot built using nodejs and typescript
              </ProjectItem>
            </section>
            <section className="space-y-8">
              <h3 className="text-3xl font-bold text-sky-500">Professional Skills</h3>
              <p className="">
                I've a very good problem solving skill. I've already learnt the basics like Data
                Structures and Algorithms, Object Oriented Programming (OOP) Concepts and Paradigms.
              </p>
              <div className="">
                <ul className="space-y-8">
                  {[
                    { logo: "nextjs", label: "NextJS", value: 85 },
                    { logo: "react", label: "React", value: 85 },
                    { logo: "css", label: "HTML/CSS", value: 97 },
                    { logo: "tailwindcss", label: "TailwindCSS", value: 99 },
                    { logo: "typescript", label: "Typescript", value: 85 },
                    { logo: "javascript", label: "Javascript", value: 95 },
                    { logo: "nodejs", label: "NodeJS", value: 70 },
                    { logo: "firebase", label: "Firebase", value: 75 },
                    { logo: "mysql_full", label: "MySQL", value: 55 },
                    { logo: "mongodb", label: "MongoDB", value: 65 },
                    { logo: "git", label: "Git/Github", value: 60 },
                    { logo: "graphql", label: "GraphQL", value: 30 },
                    { logo: "wordpress", label: "Wordpress", value: 65 },
                    { logo: "c", label: "C/C++", value: 75 },
                    { logo: "python", label: "Python", value: 70 },
                    { logo: "discord", label: "Discord API", value: 85 },
                  ].map(({ logo, label, value }) => (
                    <li className="flex items-center gap-4" key={label}>
                      <div className="relative h-7 w-7 overflow-hidden rounded">
                        <Image src={`/assets/logos/${logo}.svg`} layout="fill" />
                      </div>
                      <div className="w-32 overflow-ellipsis text-xl font-medium">{label}</div>
                      <div className="grow">
                        <Range value={value} />
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-base">
                  I'm also quite familiar with
                  <span className="ml-1.5 rounded bg-slate-100 p-1">JAVA</span>,
                  <span className="ml-1.5 rounded bg-slate-100 p-1">PHP</span>,
                  <span className="ml-1.5 rounded bg-slate-100 p-1">Rust</span>,
                  <span className="ml-1.5 rounded bg-slate-100 p-1">React Native</span>,
                  <span className="ml-1.5 rounded bg-slate-100 p-1">Flutter</span>,
                  <span className="ml-1.5 rounded bg-slate-100 p-1">Unity</span>,
                  <span className="ml-1.5 rounded bg-slate-100 p-1">Blender</span>
                </p>
              </div>
            </section>
            <section className="space-y-8">
              <h3 className="text-3xl font-bold text-sky-500">Personal Interests</h3>
              <div className="">
                <ul className="flex flex-wrap gap-12 gap-y-6 text-xl font-semibold text-slate-400">
                  {[
                    "Programming",
                    "Reading",
                    "Gaming",
                    "Sketching",
                    "Art & Craft",
                    "Singing while Cooking",
                  ].map((label) => (
                    <li key={label}>{label}</li>
                  ))}
                </ul>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

export default ResumePage

function ProjectItem({
  title,
  link,
  children,
}: React.PropsWithChildren<{ title: string; link?: string }>) {
  return (
    <div className="space-y-2">
      {link ? (
        <a
          href={link}
          className="group inline-flex items-end gap-2 text-slate-500"
          rel="noreferrer"
          target="_blank">
          <h4 className="border-b border-dotted text-xl font-semibold tracking-wide">{title}</h4>
          <span className="icon opacity-20 transition-opacity group-hover:opacity-80 print:opacity-50">
            link
          </span>
        </a>
      ) : (
        <h4 className="text-xl font-semibold tracking-wide text-slate-500">{title}</h4>
      )}
      <p className="">{children}</p>
    </div>
  )
}

function Asides({
  icon,
  label,
  children,
}: React.PropsWithChildren<{ icon?: string; label: string }>) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-8">
        <div
          className={`aspect-square shrink-0 basis-12 rounded-full p-2 text-center text-white ${
            icon ? "bg-sky-500" : ""
          } `}>
          <span className="icon mt-px text-3xl">{icon}</span>
        </div>
        <h3 className="text-3xl font-bold text-sky-500">{label}</h3>
      </div>
      <div className="pl-20">{children}</div>
    </section>
  )
}

function Range({ value = "50" }: { value?: string | number }) {
  return (
    <div className="h-3 rounded-full bg-slate-100 shadow-inner">
      <div
        className="relative h-full rounded-full bg-sky-400 shadow shadow-sky-200"
        style={{ width: value + "%" }}>
        <span className="absolute right-0 top-1/2 h-5 w-5 translate-x-1/2 -translate-y-1/2 rounded-full border bg-white shadow"></span>
      </div>
    </div>
  )
}

function LanguageItem({ language, level = 5 }) {
  return (
    <li className="flex items-center justify-between">
      {language}
      <ul className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <li
            className={`rounded-full ${i < level ? "bg-sky-500" : "bg-slate-500/80"} p-1.5`}
            key={i}
          />
        ))}
      </ul>
    </li>
  )
}

const GithubLogo = () => (
  <svg viewBox="0 0 16 16">
    <path
      fillRule="evenodd"
      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
  </svg>
)

const LinkedInLogo = () => (
  <svg viewBox="0 0 65.326 65.326">
    <path
      d="M958.98,112.559h-9.6V97.525c0-3.585-.064-8.2-4.993-8.2-5,0-5.765,3.906-5.765,7.939v15.294h-9.6V81.642h9.216v4.225h.129a10.1,10.1,0,0,1,9.093-4.994c9.73,0,11.524,6.4,11.524,14.726ZM918.19,77.416a5.571,5.571,0,1,1,5.57-5.572,5.571,5.571,0,0,1-5.57,5.572m4.8,35.143h-9.61V81.642h9.61Zm40.776-55.2h-55.21a4.728,4.728,0,0,0-4.781,4.67v55.439a4.731,4.731,0,0,0,4.781,4.675h55.21a4.741,4.741,0,0,0,4.8-4.675V62.025a4.738,4.738,0,0,0-4.8-4.67"
      transform="translate(-903.776 -57.355)"
      fill="#0a66c2"
    />
  </svg>
)

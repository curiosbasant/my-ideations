import { PropsWithChildren } from 'react'
import Image from 'next/image'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'

export const metadata = {
  title: "Basant's Resume",
  keywords: ['basant resume', 'basant barupal', 'curiosbasant'],
}

const WORK_EXPERIENCE = [
  {
    name: 'HootBoard',
    position: 'Full Stack Developer',
    link: 'https://www.hootboard.com',
    joinedOn: new Date('06/06/2022'),
    leftOn: null as Date | null,
    skills: ['React', 'React Native', 'TypeScript', 'TailwindCSS', 'Redux', 'Nodejs', 'Express'],
    points: [
      'Created an entire production ready, mobile application from scratch in less than 6 months.',
      'Worked and developed RSS Feed Reader App from scratch.',
      'Developed a file uploading feature for board apps.',
      'Managed and developed share functionality to share any item on the platform onto various other platforms.',
      'Effectively working on both web and mobile react applications.',
    ],
  },
]

const PROFESSIONAL_SKILLS = [
  { logo: 'nextjs', label: 'NextJS', value: 85 },
  { logo: 'react', label: 'React', value: 88 },
  { logo: 'react', label: 'React Native', value: 75 },
  { logo: 'typescript', label: 'Typescript', value: 85 },
  { logo: 'javascript', label: 'Javascript', value: 95 },
  { logo: 'css', label: 'HTML/CSS', value: 97 },
  { logo: 'tailwindcss', label: 'TailwindCSS', value: 99 },
  { logo: 'nodejs', label: 'NodeJS', value: 70 },
  { logo: 'firebase', label: 'Firebase', value: 75 },
  { logo: 'mysql_full', label: 'MySQL', value: 55 },
  { logo: 'mongodb', label: 'MongoDB', value: 65 },
  { logo: 'git', label: 'Git/Github', value: 60 },
  { logo: 'python', label: 'Python', value: 70 },
  { logo: 'discord', label: 'Discord API', value: 85 },
  { logo: 'wordpress', label: 'Wordpress', value: 65 },
  { logo: 'c', label: 'C/C++', value: 75 },
]

export default function ResumePage() {
  return (
    <div className='min-h-screen overflow-y-auto bg-slate-100 shadow-lg'>
      <div className='flex h-full print:hidden lg:hidden'>
        <p className='m-auto text-center text-2xl text-slate-500'>Please view in Desktop Site</p>
      </div>
      <div className='mx-auto hidden max-w-7xl border-r bg-white text-lg print:flex print:max-w-none lg:flex'>
        <div className='relative w-96 shrink-0 overflow-hidden border-x border-x-sky-200/75 bg-sky-100'>
          <div className='absolute -m-16 h-48 w-64 rotate-[24deg] skew-x-[45deg] bg-sky-200'></div>
          <aside className='space-y-8 p-8 text-slate-500'>
            <section className='py-8'>
              <div className='relative mx-auto h-64 w-64 overflow-hidden rounded-full border-8 border-sky-400 bg-slate-200 shadow-inner'>
                <Image
                  className='object-cover object-[center_-8px]'
                  src='/assets/passport_photo.jpg'
                  alt="Basant's Picture"
                  fill
                />
              </div>
            </section>
            <Asides icon='person' label='About Me'>
              <p>
                I'm a Software Developer, continually enhancing my skills in the field of web and
                mobile app development. I'm highly motivated and eager to learn new technologies.
                I'm driven by curiosity and very proficient in react and typescript. I'v a very keen
                eye on writing better and readable code, using the best practices.
              </p>
            </Asides>
            <Asides label='Contact'>
              <div className='flex gap-8'>
                <div className='-ml-20 w-12 space-y-4 rounded-full bg-sky-500 px-2.5 py-3 text-white'>
                  <span className='font-icon text-3xl'>phone</span>
                  <span className='font-icon text-3xl'>mail</span>
                  <span className='font-icon text-3xl'>home</span>
                </div>
                <div className='flex flex-col gap-y-4 pt-4'>
                  <span className='block'>+917023367365</span>
                  <span className='block'>
                    <a href='mailto:basantbrpl@gmail.com'>basantbrpl@gmail.com</a>
                  </span>
                  <span className='block'>
                    Jodhpur, Rajasthan <small>(342027)</small>
                  </span>
                </div>
              </div>
            </Asides>
            <Asides icon='school' label='Education'>
              <ul className='space-y-6'>
                <li className='space-y-2'>
                  <strong className='text-base text-slate-400'>2017 - 2020</strong>
                  <p className='leading-6'>Bachelor of Computer Application</p>
                  <p className='leading-6'>Maharaja Ganga Singh University, Bikaner</p>
                </li>
                <li className='space-y-2'>
                  <strong className='text-base text-slate-400'>2015 - 2017</strong>
                  <p className='leading-6'>
                    Higher Secondary School: Physics, Chemistry, Maths and Computer Science
                  </p>
                  <p className='leading-6'>Central Board of Secondary Education (KVS)</p>
                </li>
              </ul>
            </Asides>
            <Asides icon='language' label='Languages'>
              <ul className='space-y-2'>
                <LanguageItem language='Hindi' level={5} />
                <LanguageItem language='English' level={4} />
                <LanguageItem language='Marwari' level={4} />
              </ul>
            </Asides>
            <Asides icon='share' label='Social Handles'>
              <a
                href='https://github.com/CuriosBasant'
                className='inline-block h-8 w-8'
                target='_blank'>
                <GithubLogo />
              </a>
              <a
                href='https://www.linkedin.com/in/basant-barupal'
                className='ml-4 inline-block h-8 w-8'
                target='_blank'>
                <LinkedInLogo />
              </a>
              <a
                href='https://angel.co/u/basant-barupal'
                className='ml-4 inline-block h-8 w-8'
                target='_blank'>
                <img
                  src='https://angel.co/assets/icons/angellist-e1decb2fb69dc221e2dd4ad5f749797e28b3e9e92957e0f161b8e64d5a8a74c8.ico'
                  alt='AngelList Icon'
                />
              </a>
            </Asides>
          </aside>
        </div>
        <div className='relative flex-1'>
          <div
            className='absolute h-96 w-full'
            style={{
              WebkitMaskImage:
                'linear-gradient(to bottom, rgba(0, 0, 0, 1.0) 50%, transparent 100%)',
            }}>
            <div
              className='h-full '
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23cbd5e1' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E\")",
              }}
            />
          </div>
          <main className='relative space-y-12 px-24 py-12 text-slate-600'>
            <section className='flex items-center py-4'>
              <div className='grow space-y-4'>
                <h1 className='text-6xl text-slate-500'>
                  <b className='text-sky-500'>Basant</b> Barupal
                </h1>
                <h2 className='text-5xl text-slate-400'>Full Stack Developer</h2>
              </div>
              <div className='-mr-16 h-64 w-12 rounded-full bg-sky-400 before:ml-auto before:mt-8 before:block before:h-10 before:w-4 before:bg-[image:repeating-linear-gradient(white,white_.5rem,transparent_.5rem,transparent_1rem)]'></div>
            </section>
            <section className='space-y-8'>
              <h3 className='text-3xl font-bold text-sky-500'>Work Experience</h3>

              <ul className='space-y-4'>
                {WORK_EXPERIENCE.map((company, i) => (
                  <li className='flex items-start gap-4' key={i}>
                    <div className='rounded-lg border p-1'>
                      <a
                        href={company.link}
                        className='block h-12 w-12 rounded-md bg-[#0067f9] fill-white'>
                        <HootBoardLogo />
                      </a>
                    </div>
                    <div className=''>
                      <a href={company.link} className='text-base text-slate-500'>
                        {company.name}
                      </a>
                      <div className=''>
                        <strong className=''>{company.position}</strong>
                        <small className='ml-4 text-slate-500'>
                          {company.joinedOn.getFullYear()} -{' '}
                          {company.leftOn?.getFullYear() ?? 'Present'} (
                          {formatDistanceStrict(company.joinedOn, company.leftOn ?? Date.now())})
                        </small>
                      </div>
                      <ul className='mt-2 flex flex-wrap gap-2'>
                        {company.skills.map((skill) => (
                          <li
                            className='rounded-full bg-sky-500 px-3 py-0.5 text-xs text-white'
                            key={skill}>
                            {skill}
                          </li>
                        ))}
                      </ul>
                      <ul className='mt-4 -ml-2'>
                        {company.points.map((point, i) => (
                          <li className='list-disc pl-2' key={i}>
                            <p className=''>{point}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
            <section className='space-y-8'>
              <h3 className='text-3xl font-bold text-sky-500'>My Projects</h3>
              <p>
                There are many projects, I've created during my learning phase in last 4 years, but
                these are some of them which I'd showcased here.
              </p>
              <ProjectItem title='shadyantra' link='https://shadyantra.vercel.app/editor'>
                A real indian ancient online multiplayer 10x10 chess board game, built using the
                tools - nextjs, tailwindcss, nodejs, typescript and firebase. <br />
                Test the board of shadyantra -{' '}
                <a href='https://shadyantra.vercel.app/editor' className='text-sky-500'>
                  Shadyantra Board Editor
                </a>
              </ProjectItem>
              <ProjectItem title='inkcourse'>
                An online social platform where people can create and join group of there interest,
                play quizzes, purchase courses, etc (still in alpha), built using the tools -
                nextjs, tailwindcss, nodejs, typescript and firebase
              </ProjectItem>
              <ProjectItem title='OwnlyOne' link='https://github.com/CuriosBasant/ownly-one'>
                A discord bot built using nodejs and typescript
              </ProjectItem>
            </section>
            <section className='space-y-8'>
              <h3 className='text-3xl font-bold text-sky-500'>Professional Skills</h3>
              <p className='hidden'>
                I've a great problem solving skills. I've already learnt the basics like Data
                Structures and Algorithms, Object Oriented Programming (OOP) Concepts and Paradigms.
              </p>
              <div className=''>
                <ul className='space-y-8'>
                  {PROFESSIONAL_SKILLS.map(({ logo, label, value }) => (
                    <li className='flex items-center gap-4' key={label}>
                      <Image
                        className='rounded'
                        src={`/assets/logos/${logo}.svg`}
                        alt={label + "'s logo"}
                        width='28'
                        height='28'
                      />
                      <h3 className='w-32 truncate text-xl font-medium'>{label}</h3>
                      <div className='flex-1'>
                        <Range value={value} />
                      </div>
                    </li>
                  ))}
                </ul>
                <p className='mt-8 text-base'>
                  I'm also quite familiar with
                  <span className='ml-1 rounded bg-slate-100 p-1'>JAVA</span>,{' '}
                  <span className='ml-1 rounded bg-slate-100 p-1'>PHP</span>,{' '}
                  <span className='ml-1 rounded bg-slate-100 p-1'>Rust</span>,{' '}
                  <span className='ml-1 rounded bg-slate-100 p-1'>Flutter</span>,{' '}
                  <span className='ml-1 rounded bg-slate-100 p-1'>Unity</span>,{' '}
                  <span className='ml-1 rounded bg-slate-100 p-1'>Blender</span>{' '}
                </p>
              </div>
            </section>
            <section className='hidden space-y-8'>
              <h3 className='text-3xl font-bold text-sky-500'>Personal Interests</h3>
              <div className=''>
                <ul className='flex flex-wrap gap-12 gap-y-6 text-xl font-semibold text-slate-400'>
                  {[
                    'Programming',
                    'Reading',
                    'Gaming',
                    'Sketching',
                    'Art & Craft',
                    'Singing while Cooking',
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

function ProjectItem(props: PropsWithChildren<{ title: string; link?: string }>) {
  return (
    <div className='space-y-2'>
      {props.link ? (
        <a
          href={props.link}
          className='group inline-flex items-end gap-2 text-slate-500'
          rel='noreferrer'
          target='_blank'>
          <h4 className='border-b border-dotted text-xl font-semibold tracking-wide'>
            {props.title}
          </h4>
          <span className='font-icon opacity-20 transition-opacity group-hover:opacity-80 print:opacity-50'>
            link
          </span>
        </a>
      ) : (
        <h4 className='text-xl font-semibold tracking-wide text-slate-500'>{props.title}</h4>
      )}
      <p className=''>{props.children}</p>
    </div>
  )
}

function Asides(props: PropsWithChildren<{ icon?: string; label: string }>) {
  return (
    <section className='space-y-4'>
      <div className='flex items-center gap-8'>
        <div
          className={`aspect-square shrink-0 basis-12 rounded-full p-2 text-center text-white ${
            props.icon ? 'bg-sky-500' : ''
          } `}>
          <span className='mt-px font-icon text-3xl'>{props.icon}</span>
        </div>
        <h3 className='text-3xl font-bold text-sky-500'>{props.label}</h3>
      </div>
      <div className='pl-20'>{props.children}</div>
    </section>
  )
}

function Range(props: { value?: string | number }) {
  return (
    <div className='h-3 rounded-full bg-slate-100 shadow-inner'>
      <div
        className='relative h-full rounded-full bg-sky-400 shadow shadow-sky-200'
        style={{ width: (props.value ?? 50) + '%' }}>
        <span className='absolute right-0 top-1/2 h-5 w-5 translate-x-1/2 -translate-y-1/2 rounded-full border bg-white shadow'></span>
      </div>
    </div>
  )
}

function LanguageItem({ language, level = 5 }: any) {
  return (
    <li className='flex items-center justify-between'>
      {language}
      <ul className='flex gap-2'>
        {[...Array(5)].map((_, i) => (
          <li
            className={`rounded-full ${i < level ? 'bg-sky-500' : 'bg-slate-400/75'} p-1.5`}
            key={i}
          />
        ))}
      </ul>
    </li>
  )
}

const GithubLogo = () => (
  <svg viewBox='0 0 16 16'>
    <path
      fillRule='evenodd'
      d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z'></path>
  </svg>
)

const LinkedInLogo = () => (
  <svg viewBox='0 0 65.326 65.326'>
    <path
      d='M958.98,112.559h-9.6V97.525c0-3.585-.064-8.2-4.993-8.2-5,0-5.765,3.906-5.765,7.939v15.294h-9.6V81.642h9.216v4.225h.129a10.1,10.1,0,0,1,9.093-4.994c9.73,0,11.524,6.4,11.524,14.726ZM918.19,77.416a5.571,5.571,0,1,1,5.57-5.572,5.571,5.571,0,0,1-5.57,5.572m4.8,35.143h-9.61V81.642h9.61Zm40.776-55.2h-55.21a4.728,4.728,0,0,0-4.781,4.67v55.439a4.731,4.731,0,0,0,4.781,4.675h55.21a4.741,4.741,0,0,0,4.8-4.675V62.025a4.738,4.738,0,0,0-4.8-4.67'
      transform='translate(-903.776 -57.355)'
      fill='#0a66c2'
    />
  </svg>
)

const HootBoardLogo = () => (
  <svg
    version='1.0'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 2085 2085'
    height='100%'
    width='100%'>
    <path d='M504.2 488.1c-10.9 1.8-24.3 11.1-29.9 20.7-1.4 2.3-3.4 7-4.4 10.3-1.8 5.8-1.9 11-1.9 111.7 0 114.6-.2 110.6 5.5 121.1 3.4 6.1 10.2 13.3 16 16.6 2.3 1.4 94.3 35.1 204.4 75 214.9 77.8 206.6 75 219.3 72.6 17.7-3.3 32.5-18 35.7-35.5 1.4-7.8 1.5-201.5.1-210.1-2-12.1-10-24.2-20.1-30.2-6.3-3.7-398.5-150-407.4-152-6.7-1.4-9.7-1.5-17.3-.2zM1170.5 488.1c-15.6 3.2-29 15.1-33.7 30.2-1.7 5.6-1.8 16.7-1.8 253.8 0 246.8 0 248 2 254 3.6 10.5 10.3 19.1 19.1 24.2 6 3.5 398.6 145.7 407.4 147.5 19.2 4.1 39.8-6.3 48.7-24.5l3.3-6.8.3-248.3c.2-247.7.2-248.2-1.8-254.3-3.8-11.3-11.4-20.3-21.3-25.2-4.4-2.2-377.5-141.6-396.9-148.3-8.1-2.7-18.4-3.7-25.3-2.3zM501.6 889.5c-15.3 3.9-28.1 16.6-32.2 32-1.1 4.1-1.4 48.5-1.4 248.5 0 261.1-.2 247.8 5 257.9 2.8 5.6 11 14.3 16.4 17.5 6.8 4 401.9 150.7 409.2 151.9 12.6 2.2 27.4-2.6 37.4-11.9 5.8-5.4 11.4-15.8 12.9-23.8 1.5-8.1 1.6-486.9.1-494.7-2.6-13.6-12.3-26.4-24.2-31.9-3.5-1.6-95.3-35.1-204.2-74.5-184.1-66.6-198.3-71.6-205.5-72-4.8-.3-9.7.1-13.5 1zM1168.5 1171.4c-12.7 3.2-23.7 12.2-29.6 24.1l-3.4 7-.3 106.1c-.2 101.2-.1 106.4 1.6 112.1 3.7 11.9 13 22.3 24.2 27.2 2.5 1 93.5 35 202.3 75.5 174 64.8 198.6 73.7 205 74.2 18.1 1.6 35.7-8.5 43.8-25.1l3.4-7v-221l-3.4-7c-4-8.2-11.6-16.2-18.8-19.9-5.8-2.9-398.2-145.1-404.6-146.6-5.6-1.3-14.1-1.1-20.2.4z'></path>
  </svg>
)

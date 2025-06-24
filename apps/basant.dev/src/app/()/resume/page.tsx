import type { PropsWithChildren } from 'react'
import Image from 'next/image'
import { formatDistanceStrict } from 'date-fns/formatDistanceStrict'
import {
  GlobeIcon,
  GraduationCapIcon,
  LinkIcon,
  MailIcon,
  MapPinHouseIcon,
  PhoneIcon,
  UserIcon,
  WaypointsIcon,
} from 'lucide-react'

import { ScrollArea } from '~/components/ui/scroll-area'
import { AsideIcon, AsideSection, H3, MainSection } from './elements'

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
    leftOn: new Date('04/20/2023'),
    skills: ['React', 'Expo', 'TypeScript', 'TailwindCSS', 'Redux', 'Nodejs', 'Express'],
    points: [
      'Created an entire production ready, mobile application from scratch.',
      'Worked and developed RSS Feed Reader App from scratch.',
      'Developed a file uploading feature for board apps.',
      'Managed and developed share functionality to share any item on the platform onto various other platforms.',
      'Effectively working on both web and mobile react applications.',
    ],
  },
]

const PROFESSIONAL_SKILLS = [
  { logo: 'nextjs', label: 'NextJS', value: 90 },
  { logo: 'react', label: 'React', value: 95 },
  { logo: 'expo', label: 'Expo/React Native', value: 75 },
  { logo: 'typescript', label: 'Typescript', value: 95 },
  { logo: 'css', label: 'HTML/CSS', value: 97 },
  { logo: 'tailwindcss', label: 'TailwindCSS', value: 99 },
  { logo: 'nodejs', label: 'NodeJS', value: 70 },
  { logo: 'supabase', label: 'Supabase', value: 70 },
  { logo: 'firebase', label: 'Firebase', value: 70 },
  { logo: 'mongodb', label: 'MongoDB', value: 65 },
  { logo: 'git', label: 'Git/Github', value: 75 },
  { logo: 'wordpress', label: 'Wordpress', value: 65 },
  { logo: 'cpp', label: 'C/C++', value: 75 },
  { logo: 'python', label: 'Python', value: 70 },
]

export default function ResumePage() {
  return (
    <ScrollArea className='h-full bg-slate-100' data-theme='light'>
      <div className='xl:pb-16 xl:pt-8 print:p-0'>
        <div className='not-print:max-w-7xl not-print:xl:rounded-2xl mx-auto size-full overflow-clip border-e bg-white text-lg text-slate-700 shadow-xl'>
          <div className='grid h-full grid-cols-1 gap-y-8 lg:auto-rows-[auto_1fr] lg:grid-cols-[minmax(25rem,3fr)_7fr]'>
            <aside className='row-span-2 grid grid-rows-subgrid border-x border-x-sky-200/75 bg-sky-100 pb-16'>
              <header className='relative isolate flex pb-10 pt-16'>
                <div className='rotate-24 skew-x-45 absolute -z-10 -m-20 h-48 w-64 bg-sky-200'></div>
                <div className='border-12 m-auto overflow-clip rounded-full border-sky-400 bg-slate-200 shadow-inner'>
                  <Image
                    className='size-64 object-cover object-center'
                    src='/assets/display-photo.jpeg'
                    alt="Basant's Picture"
                    height={898}
                    width={898}
                  />
                </div>
              </header>
              <div className='grid auto-rows-[2.5rem_auto] grid-cols-[3rem_1fr] content-start gap-8 gap-x-6 px-8'>
                <AsideSection>
                  <AsideIcon Icon={UserIcon} />
                  <H3>About Me</H3>
                  <p className='col-start-2'>
                    Passionate Software Developer with a strong focus on web and mobile app
                    development. Very proficient in Nextjs/React and TypeScript ecosystem, with a
                    keen eye for clean, readable code and best practices. Continuously learning and
                    driven by curiosity, I thrive in dynamic environments and embrace new
                    technologies with enthusiasm.
                  </p>
                </AsideSection>
                <AsideSection>
                  <H3 className='col-start-2 row-start-1'>Contact</H3>
                  <div className='col-span-full grid grid-cols-subgrid grid-rows-3'>
                    <div className='row-span-full grid grid-rows-subgrid items-center gap-3 rounded-full bg-sky-500 px-2.5 py-3 text-white'>
                      <PhoneIcon className='aspect-square w-full' />
                      <MailIcon className='aspect-square w-full' />
                      <MapPinHouseIcon className='aspect-square w-full' />
                    </div>
                    <div className='row-span-full grid grid-rows-subgrid items-center py-3'>
                      <p className='leading-none'>+917023367365</p>
                      <p className='leading-none'>
                        <a href='mailto:basantbrpl@gmail.com'>basantbrpl@gmail.com</a>
                      </p>
                      <p className='leading-none'>
                        Jodhpur, Rajasthan <small>(342027)</small>
                      </p>
                    </div>
                  </div>
                </AsideSection>
                <AsideSection>
                  <AsideIcon Icon={GraduationCapIcon} />
                  <H3>Education</H3>
                  <ul className='col-start-2 space-y-6'>
                    <li className='space-y-2'>
                      <strong className='text-base text-slate-400'>2024 - Present</strong>
                      <p className='leading-6'>MSc Computer Science</p>
                      <p className='leading-6'>VMOU, Kota</p>
                    </li>
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
                </AsideSection>
                <AsideSection>
                  <AsideIcon Icon={GlobeIcon} />
                  <H3>Languages</H3>
                  <ul className='col-start-2 space-y-2'>
                    <LanguageItem language='Hindi' level={5} />
                    <LanguageItem language='English' level={4} />
                    <LanguageItem language='Marwari' level={4} />
                  </ul>
                </AsideSection>
                <AsideSection>
                  <AsideIcon Icon={WaypointsIcon} />
                  <H3>Social Handles</H3>
                  <div className='col-start-2 flex flex-wrap items-center gap-4'>
                    <SocialHandleLink link='https://x.com/curiosbasant' logo='x' />
                    <SocialHandleLink link='https://github.com/curiosbasant' logo='github' />
                    <SocialHandleLink
                      link='https://www.linkedin.com/in/basant-barupal'
                      logo='linkedin'
                    />
                    <SocialHandleLink
                      link='https://wellfound.com/u/basant-barupal'
                      logo='wellfound'
                    />
                  </div>
                </AsideSection>
              </div>
            </aside>
            <main className='relative isolate row-span-2 grid grid-rows-subgrid px-4 pb-16 md:px-8 xl:px-24'>
              <div className='mask-b-to-90% absolute inset-0 -z-10 h-96 w-full'>
                <div
                  className='h-full'
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23cbd5e1' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E\")",
                  }}
                />
              </div>
              <header className='flex items-center self-center'>
                <div className='flex-1 space-y-4'>
                  <h1 className='text-6xl text-slate-500'>
                    <strong className='text-sky-500'>Basant</strong> Barupal
                  </h1>
                  <h2 className='text-5xl text-slate-400'>Full Stack Developer</h2>
                </div>
                <div className='h-64 w-12 rounded-full bg-sky-400 before:ms-auto before:mt-8 before:block before:h-10 before:w-4 before:bg-[image:repeating-linear-gradient(white,white_.5rem,transparent_.5rem,transparent_1rem)] xl:translate-x-full' />
              </header>
              <div className='space-y-12 pt-1.5'>
                <MainSection>
                  <H3>Work Experience</H3>
                  <ul className='space-y-4'>
                    {WORK_EXPERIENCE.map((company, i) => (
                      <li className='flex items-start gap-4' key={i}>
                        <div className='rounded-lg border p-1'>
                          <a
                            href={company.link}
                            className='block size-12 rounded-md bg-[#0067f9] fill-white'>
                            <img
                              className='aspect-square'
                              src='/assets/logos/hootboard.svg'
                              alt='HootBoard Logo'
                              width='48'
                              height='48'
                            />
                          </a>
                        </div>
                        <div className=''>
                          <a
                            href={company.link}
                            className='text-slate-500 transition hover:text-slate-700'>
                            {company.name}
                          </a>
                          <div className=''>
                            <strong className='text-base'>{company.position}</strong>
                            <small className='ms-4 text-slate-500'>
                              {company.joinedOn.getFullYear()} -{' '}
                              {company.leftOn?.getFullYear() ?? 'Present'} (
                              {formatDistanceStrict(company.joinedOn, company.leftOn ?? Date.now())}
                              )
                            </small>
                          </div>
                          <ul className='mt-2 flex flex-wrap gap-2'>
                            {company.skills.map((skill) => (
                              <li
                                className='rounded-full bg-sky-500 px-3 py-0.5 text-sm text-white'
                                key={skill}>
                                {skill}
                              </li>
                            ))}
                          </ul>
                          <ul className='-ms-2 mt-4 text-lg'>
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
                </MainSection>
                <MainSection>
                  <H3>My Projects</H3>
                  <p>
                    I've been teaching myself software development since 2017, consistently building
                    and refining my skills through hands-on projects, exploring various technologies
                    and frameworks. The showcased work of mine here highlights my focus on
                    usability, clean code, and practical problem-solving. Additional projects and
                    contributions can be found on my{' '}
                    <a href='https://github.com/curiosbasant' className='text-sky-500'>
                      GitHub
                    </a>{' '}
                    profile, reflecting the breadth of my learning and development journey.
                  </p>
                  <ProjectItem title='Pariksha Parinaam' link='https://parinaam.basant.dev'>
                    An online board result checking platform for the whole class in one go.
                  </ProjectItem>
                  <ProjectItem title='shadyantra' link='https://shadyantra.vercel.app/editor'>
                    A real indian ancient online multiplayer 10x10 chess board game, built using the
                    tools - nextjs, tailwindcss, nodejs, typescript and firebase. <br />
                    Test the board of shadyantra -{' '}
                    <a href='https://shadyantra.vercel.app/editor' className='text-sky-500'>
                      Shadyantra Board Editor
                    </a>
                  </ProjectItem>
                  <ProjectItem title='inkcourse'>
                    An online social platform where people can create and join group of there
                    interest, play quizzes, purchase courses, etc (still in alpha), built using the
                    tools - nextjs, tailwindcss, nodejs, typescript and firebase
                  </ProjectItem>
                  <ProjectItem title='OwnlyOne' link='https://github.com/curiosbasant/ownly-one'>
                    A discord bot built using nodejs and typescript
                  </ProjectItem>
                </MainSection>
                <MainSection>
                  <H3>Professional Skills</H3>
                  <ul className='grid grid-cols-[1.75rem_auto_1fr] gap-4 gap-y-7'>
                    {PROFESSIONAL_SKILLS.map(({ logo, label, value }) => (
                      <li className='col-span-full grid grid-cols-subgrid items-center' key={label}>
                        <img
                          className='aspect-square rounded'
                          src={`/assets/logos/${logo}.svg`}
                          alt={label + "'s logo"}
                          width='28'
                          height='28'
                        />
                        <h3 className='truncate text-xl font-medium'>{label}</h3>
                        <Range value={value} />
                      </li>
                    ))}
                  </ul>
                  <p className='mt-8 text-base'>
                    I'm also quite familiar with{' '}
                    <span className='rounded bg-slate-100 p-1 py-0.5 text-sm font-medium'>
                      JAVA
                    </span>
                    ,{' '}
                    <span className='rounded bg-slate-100 p-1 py-0.5 text-sm font-medium'>PHP</span>
                    ,{' '}
                    <span className='rounded bg-slate-100 p-1 py-0.5 text-sm font-medium'>
                      Flutter
                    </span>
                    ,{' '}
                    <span className='rounded bg-slate-100 p-1 py-0.5 text-sm font-medium'>
                      Unity
                    </span>
                    ,{' '}
                    <span className='rounded bg-slate-100 p-1 py-0.5 text-sm font-medium'>
                      Blender
                    </span>
                  </p>
                </MainSection>
              </div>
            </main>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

function SocialHandleLink(props: { link: string; logo: string }) {
  return (
    <a href={props.link} className='inline-block size-8' target='_blank'>
      <img
        className='size-full'
        src={`/assets/logos/${props.logo}.svg`}
        alt={`${props.logo} Logo`}
        title={props.logo}
        width='32'
        height='32'
      />
    </a>
  )
}

function ProjectItem(props: PropsWithChildren<{ title: string; link?: string }>) {
  return (
    <div className='space-y-2'>
      {props.link ?
        <a
          href={props.link}
          className='group inline-flex items-center gap-2 text-slate-500'
          target='_blank'>
          <h4 className='border-b border-dotted text-xl font-semibold tracking-wide'>
            {props.title}
          </h4>
          <LinkIcon className='size-5 opacity-20 transition-opacity group-hover:opacity-80 print:opacity-50'>
            link
          </LinkIcon>
        </a>
      : <h4 className='text-xl font-semibold tracking-wide text-slate-500'>{props.title}</h4>}
      <p className=''>{props.children}</p>
    </div>
  )
}

function Range(props: { value?: string | number }) {
  return (
    <div className='h-3 rounded-full bg-slate-100 shadow-inner'>
      <div
        className='relative h-full rounded-full bg-sky-400 shadow shadow-sky-200'
        style={{ width: (props.value ?? 50) + '%' }}>
        <span className='absolute right-0 top-1/2 size-5 -translate-y-1/2 translate-x-1/2 rounded-full border bg-white shadow'></span>
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

import './theme.css'

import Link from 'next/link'
import {
  CodeXmlIcon,
  DatabaseIcon,
  ExternalLinkIcon,
  GithubIcon,
  GlobeIcon,
  LinkedinIcon,
  MailIcon,
  MenuIcon,
  MonitorIcon,
  PaletteIcon,
  TwitterIcon,
  XIcon,
} from 'lucide-react'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { ScrollArea } from '~/components/ui/scroll-area'

const socialLinks = {
  email: 'basantbrpl@gmail.com',
  github: 'https://github.com/curiosbasant',
  linkedin: 'https://www.linkedin.com/in/basant-barupal',
  wellfound: 'https://www.wellfound.com/u/basant-barupal',
  x: 'https://x.com/curiosbasant',
}

const navLinks = [
  { url: '/resume', label: 'Resume' },
  { url: '#about', label: 'About' },
  { url: '#skills', label: 'Skills' },
  { url: '#projects', label: 'Projects' },
  { url: '#contact', label: 'Contact' },
]

export default function PortfolioPage() {
  return (
    <ScrollArea className='size-full scroll-smooth'>
      <div className='isolate flex min-h-full w-full flex-col divide-y [--page-padding:--spacing(4)] [--page-size:var(--container-7xl)] sm:[--page-padding:--spacing(6)] md:[--page-padding:--spacing(8)]'>
        <header className='bg-background/80 group sticky top-0 z-10 backdrop-blur-sm'>
          <div className='px-(--page-padding)'>
            <div className='max-w-(--page-size) mx-auto flex items-center justify-between gap-4 py-3'>
              <Link href='/' className='inline-flex items-center gap-3'>
                <CodeXmlIcon className='text-primary stroke-3 size-7' />
                <span className='@2xs:text-2xl text-xl font-extrabold'>basant.dev</span>
              </Link>
              <nav className='flex items-center max-sm:hidden'>
                {navLinks.map((link) => (
                  <Button className='cursor-pointer' variant='ghost' key={link.label}>
                    <Link href={link.url}>{link.label}</Link>
                  </Button>
                ))}
              </nav>
              <Button
                className='grid *:col-start-1 *:row-start-1 sm:hidden'
                variant='ghost'
                size='icon'
                aria-label='Toggle mobile menu'
                asChild>
                <label>
                  <XIcon className='opacity-0 transition group-has-[input:checked]:opacity-100' />
                  <MenuIcon className='transition group-has-[input:checked]:opacity-0' />
                  <input className='swoosh' type='checkbox' />
                </label>
              </Button>
            </div>
          </div>
          <div className='px-(--page-padding) not-sm:group-has-[input:checked]:block hidden border-t'>
            <div className='max-w-(--page-size) mx-auto'>
              <nav className='flex flex-col gap-2 py-4 text-sm font-medium'>
                {navLinks.map((link) => (
                  <Button className='cursor-pointer justify-start' variant='ghost' key={link.label}>
                    <Link href={link.url}>{link.label}</Link>
                  </Button>
                ))}
              </nav>
            </div>
          </div>
        </header>
        <main className='flex-1'>
          {/* Hero Section */}
          <section className='px-(--page-padding) py-24 md:py-32'>
            <div className='mx-auto flex w-full max-w-3xl flex-col items-center gap-8 text-center'>
              <div className='space-y-6'>
                <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl'>
                  Hi 👋, I'm{' '}
                  <span className='bg-linear-to-tr from-primary from-15% to-violet-800 bg-clip-text font-bold text-transparent'>
                    Basant Barupal
                  </span>
                </h1>
                <p className='text-muted-foreground text-balance text-lg md:text-xl'>
                  Full-Stack Developer passionate about creating beautiful, functional web and
                  mobile applications that solve real-world problems.
                </p>
              </div>
              <div className='flex gap-4'>
                <Button size='lg' asChild>
                  <Link href='#projects'>View My Work</Link>
                </Button>
                <Button variant='outline' size='lg' asChild>
                  <Link href='#contact'>Get In Touch</Link>
                </Button>
              </div>
              <div className='flex gap-4'>
                <Button variant='ghost' size='icon' asChild>
                  <Link href='https://github.com/curiosbasant' target='_blank'>
                    <GithubIcon />
                    <span className='sr-only'>GitHub</span>
                  </Link>
                </Button>
                <Button variant='ghost' size='icon' asChild>
                  <Link href='https://linkedin.com' target='_blank'>
                    <LinkedinIcon />
                    <span className='sr-only'>LinkedIn</span>
                  </Link>
                </Button>
                <Button variant='ghost' size='icon' asChild>
                  <Link href={socialLinks.x} target='_blank'>
                    <TwitterIcon className='size-4' />
                    <span className='sr-only'>X</span>
                  </Link>
                </Button>
                <Button variant='ghost' size='icon' asChild>
                  <Link href='mailto:basantbrpl@gmail.com'>
                    <MailIcon />
                    <span className='sr-only'>Email</span>
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id='about' className='bg-primary/5 px-(--page-padding) py-24'>
            <div className='mx-auto w-full max-w-3xl space-y-8 text-center'>
              <h2 className='text-3xl font-bold tracking-tighter md:text-4xl'>About Me</h2>
              <div className='text-muted-foreground space-y-6 text-balance text-lg'>
                <p>
                  I'm a passionate full-stack developer building web applications since 2018. I love
                  turning complex problems into simple, beautiful designs and bringing ideas to life
                  through code.
                </p>
                <p>
                  I'm very proficient in Nextjs/React and TypeScript ecosystem for web and
                  Expo/React Native for mobile, with a keen eye for clean, readable code and best
                  practices.
                </p>
                <p>
                  I thrive in dynamic environments and embrace new technologies with enthusiasm.
                </p>
              </div>
            </div>
          </section>

          <section id='skills' className='px-(--page-padding) py-24'>
            <div className='mx-auto w-full max-w-5xl space-y-12'>
              <div className='space-y-4 text-center'>
                <h2 className='text-3xl font-bold tracking-tighter md:text-4xl'>
                  Skills & Technologies
                </h2>
                <p className='text-muted-foreground text-balance text-lg'>
                  Here are some of the technologies I work with
                </p>
              </div>

              <div className='grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-8'>
                {[
                  {
                    title: 'Frontend',
                    icon: <MonitorIcon className='mx-auto size-12 text-blue-600' />,
                    skills: [
                      'React',
                      'Next.js',
                      'Expo',
                      'React Native',
                      'TypeScript',
                      'Tailwind CSS',
                    ],
                  },
                  {
                    title: 'Backend',
                    icon: <DatabaseIcon className='mx-auto size-12 text-green-600' />,
                    skills: ['TypeScript', 'Node.js', 'Supabase', 'PostgreSQL', 'Firebase'],
                  },
                  {
                    title: 'Cloud & DevOps',
                    icon: <GlobeIcon className='mx-auto size-12 text-purple-600' />,
                    skills: ['Vercel', 'Git', 'Github Actions', 'Docker'],
                  },
                  {
                    title: 'Design',
                    icon: <PaletteIcon className='mx-auto size-12 text-orange-600' />,
                    skills: ['Figma', 'UI/UX', 'Responsive', 'Gimp'],
                  },
                ].map((category) => (
                  <Card
                    className='row-span-2 grid grid-rows-subgrid items-start'
                    key={category.title}>
                    <CardHeader className='justify-center gap-4'>
                      {category.icon}
                      <CardTitle>{category.title}</CardTitle>
                    </CardHeader>
                    <CardContent className='flex flex-wrap gap-2'>
                      {category.skills.map((skill) => (
                        <Badge variant='secondary' key={skill}>
                          {skill}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section id='projects' className='bg-muted/50 px-(--page-padding) py-24'>
            <div className='max-w-(--page-size) mx-auto w-full space-y-12'>
              <div className='space-y-4 text-center'>
                <h2 className='text-3xl font-bold tracking-tighter md:text-4xl'>
                  Featured Projects
                </h2>
                <p className='text-muted-foreground text-balance text-lg'>
                  Some of my recent work that I'm proud of
                </p>
              </div>
              <div className='grid grid-cols-1 gap-8 sm:grid-cols-[repeat(auto-fill,minmax(24rem,1fr))]'>
                {[
                  {
                    name: 'Pariksha Parinaam',
                    description:
                      'Tool to fetch board class results in a interactive table with visual charts and performance analysis for all students.',
                    tech: [
                      'TypeScript',
                      'Nextjs',
                      'TailwindCSS',
                      'Tanstack Query',
                      'Tanstack Table',
                    ],
                    link: 'https://parinaam.basant.dev',
                    githubUrl: 'https://github.com/curiosbasant/my-ideations',
                  },
                  {
                    name: 'Snap File',
                    description:
                      'A tool to quickly share a file by generating short urls and sharing via QR Codes.',
                    tech: ['TypeScript', 'Nextjs', 'TailwindCSS', 'Supabase', 'QR Code'],
                    link: 'https://snapfile.basant.dev',
                    githubUrl: 'https://github.com/curiosbasant/my-ideations',
                  },
                  {
                    name: 'Shadyantra',
                    description:
                      'An online multi-player ancient indian chess game with 10x10 board, where players can take turns and make moves.',
                    tech: ['TypeScript', 'Nextjs', 'TailwindCSS', 'Firebase', 'trpc'],
                    link: 'https://shadyantra.vercel.app/editor',
                  },
                  {
                    name: 'Smart Notes',
                    description: 'An online course platform',
                    tech: [
                      'TypeScript',
                      'Nextjs',
                      'TailwindCSS',
                      'Supabase',
                      'trpc',
                      'Tanstack Query',
                      'Drizzle ORM',
                    ],
                    link: 'https://inkpreview.vercel.app',
                  },
                ].map((project) => (
                  <Card
                    className='row-span-4 grid grid-rows-subgrid items-start overflow-clip'
                    key={project.name}>
                    <CardHeader>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <div className='pointer-events-none relative aspect-video'>
                      <iframe
                        src={project.link}
                        className='size-full [zoom:0.25]'
                        loading='lazy' // load iframe when visible
                        sandbox='allow-same-origin' // only allow same-origin resources
                        allowFullScreen={false}
                      />
                    </div>
                    <CardContent className='row-span-2 grid grid-rows-subgrid items-start gap-4'>
                      <div className='flex flex-wrap gap-2'>
                        {project.tech.map((t) => (
                          <Badge variant='outline' key={t}>
                            {t}
                          </Badge>
                        ))}
                      </div>
                      <div className='flex gap-2'>
                        <Button size='sm' asChild>
                          <a href={project.link} target='_blank'>
                            <ExternalLinkIcon className='size-4' />
                            Live Demo
                          </a>
                        </Button>
                        {project.githubUrl && (
                          <Button variant='outline' size='sm' asChild>
                            <a href={project.githubUrl} target='_blank'>
                              <GithubIcon className='size-4' />
                              Code
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section id='contact' className='px-(--page-padding) py-24'>
            <div className='mx-auto w-full max-w-2xl space-y-8 text-center'>
              <div className='space-y-4'>
                <h2 className='text-3xl font-bold tracking-tighter md:text-4xl'>Get In Touch</h2>
                <p className='text-muted-foreground text-balance text-lg'>
                  I'm always interested in new opportunities and collaborations. Let's build
                  something amazing together!
                </p>
              </div>

              <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                <Button size='lg' asChild>
                  <Link href={`mailto:${socialLinks.email}`}>
                    <MailIcon />
                    Send Email
                  </Link>
                </Button>
                <Button size='lg' variant='outline' asChild>
                  <Link href={socialLinks.x} target='_blank'>
                    <TwitterIcon />
                    Connect on X
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
        <footer className='px-(--page-padding) bg-muted/50'>
          <div className='max-w-(--page-size) mx-auto w-full py-4'>
            <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
              <p className='text-muted-foreground text-sm'>© 2025 Basant. All rights reserved.</p>
              <div className='flex gap-4'>
                <Button variant='ghost' size='icon' asChild>
                  <Link href={socialLinks.github} target='_blank'>
                    <GithubIcon className='size-4' />
                    <span className='sr-only'>GitHub</span>
                  </Link>
                </Button>
                <Button variant='ghost' size='icon' asChild>
                  <Link href={socialLinks.linkedin} target='_blank'>
                    <LinkedinIcon className='size-4' />
                    <span className='sr-only'>LinkedIn</span>
                  </Link>
                </Button>
                <Button variant='ghost' size='icon' asChild>
                  <Link href={socialLinks.x} target='_blank'>
                    <TwitterIcon className='size-4' />
                    <span className='sr-only'>X</span>
                  </Link>
                </Button>
                <Button variant='ghost' size='icon' asChild>
                  <Link href={`mailto:${socialLinks.email}`}>
                    <MailIcon className='size-4' />
                    <span className='sr-only'>Email</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ScrollArea>
  )
}

import './theme.css'

import Link from 'next/link'
import {
  CodeXmlIcon,
  ExternalLinkIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  MenuIcon,
  TwitterIcon,
  XIcon,
} from 'lucide-react'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { ScrollArea } from '~/components/ui/scroll-area'
import { navLinks, projects, socialLinks, techStack } from './data'
import { Section, SectionTitle } from './shared.component'

export default function PortfolioPage() {
  return (
    <ScrollArea
      className='size-full'
      viewportClassName='scroll-smooth [--header-size:--spacing(15)] relative snap-y scroll-pt-(--header-size)'>
      <div className='isolate flex min-h-full w-full flex-col divide-y [--page-padding:--spacing(4)] [--page-size:var(--container-7xl)] sm:[--page-padding:--spacing(6)] md:[--page-padding:--spacing(8)]'>
        <header className='bg-background/80 group sticky top-0 z-10 backdrop-blur-sm'>
          <div className='px-(--page-padding)'>
            <div className='max-w-(--page-size) h-(--header-size) mx-auto flex items-center justify-between gap-4'>
              <Link href='/' className='inline-flex items-center gap-3'>
                <CodeXmlIcon className='text-primary stroke-3 size-7' />
                <span className='text-xl font-extrabold md:text-2xl'>basant.dev</span>
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
          {/* Mobile Nav */}
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
          <Section className='relative md:py-32'>
            <div className='mask-b-from-0 pointer-events-none absolute start-0 top-0 -z-10 h-full w-full opacity-25 mix-blend-color-burn'>
              <div
                className='h-full'
                style={{ background: 'url(/bg-polygon-pattern.jpg) top / 600px' }}></div>
            </div>
            <div className='mx-auto flex w-full max-w-3xl flex-col items-center gap-8 text-center'>
              <div className='space-y-6'>
                <h1 className='text-balance text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl'>
                  Hi 👋, I'm{' '}
                  <span className='bg-linear-to-tr to-primary from-violet-800 to-65% bg-clip-text font-bold text-transparent'>
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
                    <TwitterIcon />
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
          </Section>

          <Section id='about' className='bg-primary/5'>
            <div className='mx-auto w-full max-w-3xl space-y-8 text-center'>
              <SectionTitle>About Me</SectionTitle>
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
          </Section>

          <Section id='skills'>
            <div className='mx-auto w-full max-w-5xl space-y-12'>
              <div className='space-y-4 text-center'>
                <SectionTitle>Skills & Technologies</SectionTitle>
                <p className='text-muted-foreground text-balance text-lg'>
                  Here are some of the technologies I work with
                </p>
              </div>

              <div className='grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-8'>
                {techStack.map((category) => (
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
          </Section>

          <Section id='projects' className='bg-muted/50'>
            <div className='max-w-(--page-size) mx-auto w-full space-y-12'>
              <div className='space-y-4 text-center'>
                <SectionTitle>Featured Projects</SectionTitle>
                <p className='text-muted-foreground text-balance text-lg'>
                  Some of my recent work that I'm proud of
                </p>
              </div>
              <div className='grid grid-cols-1 gap-8 sm:grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]'>
                {projects.map((project) => (
                  <Card
                    className='row-span-4 grid grid-rows-subgrid items-start overflow-clip'
                    key={project.name}>
                    <CardHeader>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <div className='relative aspect-video'>
                      {project.link ?
                        <iframe
                          src={project.link}
                          className='pointer-events-none size-full [zoom:0.25]'
                          loading='lazy' // load iframe when visible
                          sandbox='allow-same-origin' // only allow same-origin resources
                          allowFullScreen={false}
                        />
                      : <img src='/placeholder.svg' className='size-full object-cover' />}
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
                        {project.link && (
                          <Button size='sm' asChild>
                            <a href={project.link} target='_blank'>
                              <ExternalLinkIcon className='size-4' /> Live Demo
                            </a>
                          </Button>
                        )}
                        {project.githubUrl && (
                          <Button variant='outline' size='sm' asChild>
                            <a href={project.githubUrl} target='_blank'>
                              <GithubIcon className='size-4' /> Code
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </Section>

          <Section id='contact' className='relative'>
            <div
              className='pointer-events-none absolute bottom-0 end-0 aspect-square h-full opacity-20 mix-blend-color-burn'
              style={{
                background: 'url(/illustration-neural-network.jpg) center / contain no-repeat',
              }}></div>
            <div className='mx-auto w-full max-w-2xl space-y-8 text-center'>
              <div className='space-y-4'>
                <SectionTitle>Get In Touch</SectionTitle>
                <p className='text-muted-foreground text-balance text-lg'>
                  I'm always interested in new opportunities and collaborations. Let's build
                  something amazing together!
                </p>
              </div>

              <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                <Button size='lg' asChild>
                  <Link href={`mailto:${socialLinks.email}`}>
                    <MailIcon /> Send Email
                  </Link>
                </Button>
                <Button size='lg' variant='outline' asChild>
                  <Link href={socialLinks.x} target='_blank'>
                    <TwitterIcon /> Connect on X
                  </Link>
                </Button>
              </div>
            </div>
          </Section>
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

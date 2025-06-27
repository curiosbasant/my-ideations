import {
  DatabaseIcon,
  GlobeIcon,
  MonitorIcon,
  PackageIcon,
  PaletteIcon,
  SquareFunctionIcon,
} from 'lucide-react'

export const socialLinks = {
  email: 'basantbrpl@gmail.com',
  github: 'https://github.com/curiosbasant',
  linkedin: 'https://linkedin.com/in/basant-barupal',
  wellfound: 'https://wellfound.com/u/basant-barupal',
  x: 'https://x.com/curiosbasant',
}

export const navLinks = [
  { url: '/resume', label: 'Resume' },
  { url: '#about', label: 'About' },
  { url: '#skills', label: 'Skills' },
  { url: '#projects', label: 'Projects' },
  { url: '#contact', label: 'Contact' },
]

export const techStack = [
  {
    title: 'Languages',
    icon: <SquareFunctionIcon className='mx-auto size-12 text-rose-600' />,
    skills: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'Yaml', 'SQL', 'C/C++', 'Python', 'Java'],
  },
  {
    title: 'Frontend',
    icon: <MonitorIcon className='mx-auto size-12 text-blue-600' />,
    skills: [
      'React',
      'Next.js',
      'React Native',
      'Expo',
      'Tanstack Router',
      'Vite',
      'WXT',
      'Web Extension',
    ],
  },
  {
    title: 'Backend',
    icon: <DatabaseIcon className='mx-auto size-12 text-green-600' />,
    skills: ['Node.js', 'Supabase', 'PostgreSQL', 'Firebase', 'TRPC', 'Drizzle ORM', 'API'],
  },
  {
    title: 'Design',
    icon: <PaletteIcon className='mx-auto size-12 text-orange-600' />,
    skills: [
      'UI/UX',
      'Tailwind CSS',
      'Animations',
      'Responsive',
      'Radix UI',
      'Lucide',
      'Figma',
      'Gimp',
    ],
  },
  {
    title: 'Libraries',
    icon: <PackageIcon className='mx-auto size-12 text-amber-800' />,
    skills: [
      'Zod',
      'Tanstack Query',
      'Tanstack Table',
      'Immer',
      'Dnd-Kit',
      'Tanstack Form',
      'Zustand',
      'Recharts',
      'Date-fns',
    ],
  },
  {
    title: 'Cloud & DevOps',
    icon: <GlobeIcon className='mx-auto size-12 text-purple-600' />,
    skills: ['Vercel', 'Git/Github', 'Github Actions', 'CI/CD', 'Docker'],
  },
]

export const projects = [
  {
    name: 'Pariksha Parinaam',
    description:
      'Tool to fetch board class results in a interactive table with visual charts and performance analysis for all students.',
    tech: ['TypeScript', 'Nextjs', 'TailwindCSS', 'Tanstack Query', 'Tanstack Table'],
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
    link: 'https://shadyantra.basant.dev/editor',
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
]

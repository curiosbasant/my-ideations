import { ROOT_DOMAIN } from '~/lib/env'

export function extractSubdomain(host: string | null) {
  if (!host) return null
  const [hostname] = host.split(':', 1)
  if (!hostname) return null

  // Local development environment
  if (hostname.endsWith('.localhost')) {
    return hostname.slice(0, -10)
  }

  if (hostname.endsWith('.vercel.app')) {
    // <project-name>-git-<branch-name>-<scope-slug>.vercel.app
    if (hostname.includes('-git-app-')) {
      // if a vercel branch url and the branch starts with `app`
      return process.env.VERCEL_GIT_COMMIT_REF?.slice(4) || null // remove the 'app/' from branch name
    }

    if (hostname.includes('---')) {
      // Handle preview deployment URLs (tenant---branch-name.vercel.app)
      return hostname.split('---', 1)[0]
    }
  }

  // Production environment
  const [rootDomainFormatted] = ROOT_DOMAIN.split(':', 1)

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted
    && hostname !== `www.${rootDomainFormatted}`
    && hostname.endsWith(`.${rootDomainFormatted}`)

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null
}

import type { NextRequest } from 'next/server'

import { ROOT_DOMAIN } from '~/lib/env'

export function extractSubdomain(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const hostname = host.split(':')[0]

  // Local development environment
  if (request.url.includes('localhost') || request.url.includes('127.0.0.1')) {
    // Try to extract subdomain from the full URL
    const fullUrlMatch = request.url.match(/http:\/\/([^.]+)\.localhost/)
    if (fullUrlMatch?.[1]) {
      return fullUrlMatch[1]
    }

    // Fallback to host header approach
    if (hostname.includes('.localhost')) {
      return hostname.split('.')[0]
    }

    return null
  }

  if (hostname.endsWith('.vercel.app')) {
    // <project-name>-git-<branch-name>-<scope-slug>.vercel.app
    if (hostname.includes('-git-app-')) {
      // if a vercel branch url and the branch starts with `app`
      return process.env.VERCEL_GIT_COMMIT_REF?.slice(4) || null // remove the 'app/' from branch name
    }

    if (hostname.includes('---')) {
      // Handle preview deployment URLs (tenant---branch-name.vercel.app)
      const parts = hostname.split('---')
      return parts.length > 0 ? parts[0] : null
    }
  }

  // Production environment
  const rootDomainFormatted = ROOT_DOMAIN.split(':')[0]

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted
    && hostname !== `www.${rootDomainFormatted}`
    && hostname.endsWith(`.${rootDomainFormatted}`)

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null
}

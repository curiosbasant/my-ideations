import type { NextConfig } from 'next'

const LOCAL_ROOT_HOSTNAME = process.env.NEXT_PUBLIC_LOCAL_ROOT_HOSTNAME

export default {
  allowedDevOrigins: getDevOrigins(),
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
} satisfies NextConfig

function getDevOrigins() {
  if (process.env.NODE_ENV === 'production') return void 0

  const allowedDevOrigins = []
  if (LOCAL_ROOT_HOSTNAME) allowedDevOrigins.push(LOCAL_ROOT_HOSTNAME, `*.${LOCAL_ROOT_HOSTNAME}`)
  if (process.env.DEV_ORIGIN) allowedDevOrigins.push(process.env.DEV_ORIGIN)

  return allowedDevOrigins
}

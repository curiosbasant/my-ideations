// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env/server.mjs'))

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['tailwindcss', 'postcss', 'firebase-admin'],
    // typedRoutes: true,
  },
  images: {
    domains: ['raw.githubusercontent.com', 'cdn.discordapp.com', 'i.pravatar.cc'],
    remotePatterns: [{ hostname: '*.cloudfront.net' }],
  },
  redirects: async () => [
    {
      source: '/discord',
      destination: '/discord/me',
      permanent: true,
    },
    {
      source: '/tos',
      destination: '/terms-of-service',
      permanent: true,
    },
  ],
}

export default config

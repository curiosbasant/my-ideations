// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
// import('./src/env/server.mjs')
// !process.env.SKIP_ENV_VALIDATION

/** @type {import("next").NextConfig} */
const config = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['raw.githubusercontent.com', 'cdn.discordapp.com', 'i.pravatar.cc', 'picsum.photos'],
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
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ['@my/api', '@my/core', '@my/lib', '@my/ui', '@my/tailwind-config'],
  /** We already do linting and typechecking as separate tasks in CI */
  typescript: { ignoreBuildErrors: true },
}

export default config

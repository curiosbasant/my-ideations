/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['tailwindcss', 'postcss', 'firebase-admin'],
    typedRoutes: true,
  },
}

export default nextConfig

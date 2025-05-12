/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable strict mode to avoid potential issues
  reactStrictMode: false,
  // Ignore ESLint and TypeScript errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable image optimization to avoid potential issues
  images: {
    unoptimized: true,
  },
  // Disable experimental features
  experimental: {},
  // Disable webpack customization
  webpack: undefined,
  // Ensure SWC is used
  swcMinify: true,
}

module.exports = nextConfig

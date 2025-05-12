/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true, // Removed as it's not recognized by your Next.js version
  images: {
    domains: ["thebookinglink.com", "v0-medical-booking.vercel.app"],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // No custom webpack config to avoid potential issues
}

module.exports = nextConfig

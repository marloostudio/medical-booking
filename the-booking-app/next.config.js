/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: "server",
  async redirects() {
    return [
      {
        source: "/dashboard/patients",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/dashboard/patients/:path*",
        destination: "/dashboard",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

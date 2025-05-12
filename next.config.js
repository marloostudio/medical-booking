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
    domains: ["thebookinglink.com", "v0-medical-booking.vercel.app"],
  },
  // Only apply allowedDevOrigins in development
  ...(process.env.NODE_ENV === "development"
    ? {
        experimental: {
          allowedDevOrigins: ["localhost:3000", "192.168.5.172:3000"],
        },
      }
    : {}),
  // Ensure SWC is used for compilation
  swcMinify: true,
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  // Simplified webpack config without crypto-browserify
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      path: false,
      zlib: false,
      http: false,
      https: false,
      os: false,
      buffer: false,
    }

    return config
  },
}

module.exports = nextConfig

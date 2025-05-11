/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Simplify configuration to reduce webpack errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Keep only essential image configuration
  images: {
    unoptimized: true,
  },

  // Simplify transpilation
  transpilePackages: ["lucide-react"],

  // Simplify webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Provide minimal fallbacks for Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }
    return config
  },

  // Minimal experimental options
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig

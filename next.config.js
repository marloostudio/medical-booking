/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add transpilation configuration
  transpilePackages: [
    "firebase",
    "@firebase/app",
    "@firebase/auth",
    "@firebase/firestore",
    "@firebase/storage",
    "@firebase/util",
    "@firebase/database",
    "@firebase/analytics",
    "@firebase/functions",
    "@firebase/remote-config",
    "@firebase/messaging",
  ],
  // Webpack configuration to handle Node.js polyfills and undici
  webpack: (config, { isServer }) => {
    // Add topLevelAwait support
    config.experiments = { ...config.experiments, topLevelAwait: true }

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
        util: false,
        undici: false,
      }
    }

    return config
  },
  // Exclude problematic packages from the client bundle
  experimental: {
    serverComponentsExternalPackages: ["undici", "firebase", "@firebase/auth"],
  },
}

module.exports = nextConfig

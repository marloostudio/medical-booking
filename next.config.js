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

  // Add transpilation configuration
  transpilePackages: ["lucide-react"],

  // Use serverRuntimeConfig for server-only configuration
  serverRuntimeConfig: {
    firebaseAdminConfig: {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    },
  },

  // Use publicRuntimeConfig for client and server configuration
  publicRuntimeConfig: {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  },

  // Add headers for security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0, must-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ]
  },

  // Webpack configuration to handle Node.js polyfills
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure these Node.js modules are not included in client-side bundles
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
      }
    }
    return config
  },

  // Update experimental options
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig

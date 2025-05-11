/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // External packages that should be transpiled
  transpilePackages: [
    "lucide-react"
  ],
  
  // Keep these commented out to avoid middleware-related errors
  // experimental: {
  //   serverComponentsExternalPackages: [
  //     "firebase",
  //     "@firebase/auth"
  //   ]
  // },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable image optimization for development
  images: {
    unoptimized: true,
  },
  
  // Add headers for security (replacing middleware functionality)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
}

export default nextConfig;

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
    domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com'],
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Prevent Firebase Admin and other server-only modules from being bundled on the client side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        crypto: false,
        stream: false,
        util: false,
        url: false,
        querystring: false,
      };
      
      // Externalize server-only dependencies
      config.externals = [
        ...(config.externals || []),
        {
          'firebase-admin': 'commonjs firebase-admin',
          'firebase-admin/app': 'commonjs firebase-admin/app',
          'firebase-admin/auth': 'commonjs firebase-admin/auth',
          'firebase-admin/firestore': 'commonjs firebase-admin/firestore',
          'twilio': 'commonjs twilio',
          '@sendgrid/mail': 'commonjs @sendgrid/mail',
          'fs': 'commonjs fs',
          'child_process': 'commonjs child_process',
          'crypto': 'commonjs crypto',
        }
      ];
    }
    
    return config;
  },
}

export default nextConfig;

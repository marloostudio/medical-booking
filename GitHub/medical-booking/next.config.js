/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
  // Enable SWC transformations explicitly (no need for swcMinify)
  experimental: {
    allowedDevOrigins: ["http://192.168.5.172:3000"], // Add your network IP here
  },
  // Add webpack configuration for environment variables
  webpack: (config, { isServer }) => {
    // Only expose certain environment variables to the client
    if (!isServer) {
      const webpack = require("webpack");
      config.plugins.push(
        new webpack.DefinePlugin({
          "process.env.NEXT_PUBLIC_FIREBASE_API_KEY": JSON.stringify(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
          "process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": JSON.stringify(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
          "process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID": JSON.stringify(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
          "process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET": JSON.stringify(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
          "process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": JSON.stringify(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
          "process.env.NEXT_PUBLIC_FIREBASE_APP_ID": JSON.stringify(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
          "process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID": JSON.stringify(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID),
          "process.env.NEXT_PUBLIC_SITE_URL": JSON.stringify(process.env.NEXT_PUBLIC_SITE_URL),
          "process.env.NEXT_PUBLIC_APP_ENV": JSON.stringify(process.env.NEXT_PUBLIC_APP_ENV),
          "process.env.NEXT_PUBLIC_DEFAULT_CLINIC_ID": JSON.stringify(process.env.NEXT_PUBLIC_DEFAULT_CLINIC_ID),
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig;

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
  webpack: (config) => {
    // Default fallbacks for Node.js core modules
    const fallback = {
      fs: false,
      net: false,
      tls: false,
    }

    // Try to resolve polyfills, but don't fail if they're not installed
    try {
      fallback.crypto = require.resolve("crypto-browserify")
    } catch (e) {
      console.warn("crypto-browserify not found, using fallback")
      fallback.crypto = false
    }

    try {
      fallback.stream = require.resolve("stream-browserify")
    } catch (e) {
      console.warn("stream-browserify not found, using fallback")
      fallback.stream = false
    }

    try {
      fallback.path = require.resolve("path-browserify")
    } catch (e) {
      console.warn("path-browserify not found, using fallback")
      fallback.path = false
    }

    try {
      fallback.zlib = require.resolve("browserify-zlib")
    } catch (e) {
      console.warn("browserify-zlib not found, using fallback")
      fallback.zlib = false
    }

    try {
      fallback.http = require.resolve("stream-http")
    } catch (e) {
      console.warn("stream-http not found, using fallback")
      fallback.http = false
    }

    try {
      fallback.https = require.resolve("https-browserify")
    } catch (e) {
      console.warn("https-browserify not found, using fallback")
      fallback.https = false
    }

    try {
      fallback.os = require.resolve("os-browserify")
    } catch (e) {
      console.warn("os-browserify not found, using fallback")
      fallback.os = false
    }

    try {
      fallback.buffer = require.resolve("buffer/")
    } catch (e) {
      console.warn("buffer not found, using fallback")
      fallback.buffer = false
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      ...fallback,
    }

    // Add Buffer polyfill only if buffer is available
    if (fallback.buffer !== false) {
      try {
        const webpack = require("webpack")
        config.plugins.push(
          new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"],
          }),
        )
      } catch (e) {
        console.warn("Failed to add Buffer polyfill:", e)
      }
    }

    return config
  },
}

module.exports = nextConfig

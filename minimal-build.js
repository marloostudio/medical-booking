const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("Starting minimal build process...")

// Create a temporary next.config.js backup
const nextConfigPath = path.join(__dirname, "next.config.js")
const nextConfigBackupPath = path.join(__dirname, "next.config.js.backup")

if (fs.existsSync(nextConfigPath)) {
  console.log("Backing up next.config.js...")
  fs.copyFileSync(nextConfigPath, nextConfigBackupPath)
}

// Create a minimal next.config.js for testing
const minimalConfig = `
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
}

module.exports = nextConfig
`

try {
  // Write minimal config
  fs.writeFileSync(nextConfigPath, minimalConfig)

  // Try building with minimal config
  console.log("Attempting build with minimal configuration...")
  execSync("next build", { stdio: "inherit" })
  console.log("Build succeeded with minimal configuration!")
} catch (error) {
  console.error("Build failed with minimal configuration.")
  process.exit(1)
} finally {
  // Restore original next.config.js
  if (fs.existsSync(nextConfigBackupPath)) {
    console.log("Restoring original next.config.js...")
    fs.copyFileSync(nextConfigBackupPath, nextConfigPath)
    fs.unlinkSync(nextConfigBackupPath)
  }
}

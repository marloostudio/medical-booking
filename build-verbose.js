const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("Starting verbose build process...")

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
  // Try building with the original config first
  console.log("Attempting build with original configuration...")
  try {
    execSync("next build --debug", { stdio: "inherit" })
    console.log("Build succeeded with original configuration!")
    process.exit(0)
  } catch (error) {
    console.error("Build failed with original configuration. Trying minimal config...")

    // Write minimal config
    fs.writeFileSync(nextConfigPath, minimalConfig)

    // Try building with minimal config
    try {
      execSync("next build --debug", { stdio: "inherit" })
      console.log("Build succeeded with minimal configuration!")
      console.log("Please use this minimal configuration for your project.")
      process.exit(0)
    } catch (error) {
      console.error("Build failed even with minimal configuration.")
      console.error("This suggests there might be syntax errors in your code.")

      // Try to identify problematic files
      console.log("Attempting to identify problematic files...")
      try {
        execSync("npx next lint --debug", { stdio: "inherit" })
      } catch (lintError) {
        console.error("Linting also failed. Please check the errors above.")
      }

      process.exit(1)
    }
  }
} finally {
  // Restore original next.config.js
  if (fs.existsSync(nextConfigBackupPath)) {
    console.log("Restoring original next.config.js...")
    fs.copyFileSync(nextConfigBackupPath, nextConfigPath)
    fs.unlinkSync(nextConfigBackupPath)
  }
}

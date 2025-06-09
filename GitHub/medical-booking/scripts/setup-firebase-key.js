#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

console.log("🔧 Setting up Firebase environment for Vercel deployment...")

try {
  // Get the Firebase private key from environment
  const privateKey = process.env.FIREBASE_PRIVATE_KEY

  if (!privateKey) {
    console.log("⚠️  No FIREBASE_PRIVATE_KEY found in environment variables")
    console.log("✅ Continuing with build process...")
    process.exit(0)
  }

  // Function to format the private key properly
  function formatPrivateKey(key) {
    if (!key) return ""

    // If the key is base64 encoded, decode it first
    let formattedKey = key

    try {
      // Check if it's base64 encoded
      if (!key.includes("-----BEGIN PRIVATE KEY-----")) {
        formattedKey = Buffer.from(key, "base64").toString("utf8")
      }
    } catch (e) {
      // If decoding fails, use the original key
      formattedKey = key
    }

    // Replace escaped newlines with actual newlines
    formattedKey = formattedKey.replace(/\\n/g, "\n")

    // Ensure proper PEM format
    if (!formattedKey.includes("-----BEGIN PRIVATE KEY-----")) {
      console.log("⚠️  Private key does not appear to be in PEM format")
      return formattedKey
    }

    return formattedKey
  }

  // Format the private key
  const formattedPrivateKey = formatPrivateKey(privateKey)

  // Create the environment content
  const envContent = `# Auto-generated Firebase environment for Vercel
FIREBASE_PRIVATE_KEY="${formattedPrivateKey.replace(/\n/g, "\\n")}"
FIREBASE_CLIENT_EMAIL="${process.env.FIREBASE_CLIENT_EMAIL || ""}"
GCLOUD_PROJECT="${process.env.GCLOUD_PROJECT || ""}"
`

  // Write to .env.production.local
  const envPath = path.join(process.cwd(), ".env.production.local")
  fs.writeFileSync(envPath, envContent)

  console.log("✅ Firebase environment setup complete")
  console.log("📝 Created .env.production.local with formatted Firebase key")
} catch (error) {
  console.error("❌ Error setting up Firebase environment:", error.message)
  console.log("⚠️  Continuing with build process...")
  // Don't fail the build, just continue
  process.exit(0)
}

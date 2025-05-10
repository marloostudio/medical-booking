#!/usr/bin/env node

/**
 * Vercel Environment Setup Script
 * Validates environment variables for Vercel deployment
 */

function setupVercelEnv() {
  console.log("🚀 Validating Vercel environment setup...")

  const requiredForProduction = [
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "FIREBASE_PRIVATE_KEY",
    "FIREBASE_CLIENT_EMAIL",
    "GCLOUD_PROJECT",
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "STRIPE_SECRET_KEY",
    "ENCRYPTION_KEY",
  ]

  const requiredForPublic = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  ]

  console.log("🔍 Checking server-side environment variables...")
  const missingServer = requiredForProduction.filter((varName) => !process.env[varName])

  console.log("🔍 Checking client-side environment variables...")
  const missingClient = requiredForPublic.filter((varName) => !process.env[varName])

  if (missingServer.length > 0) {
    console.error("❌ Missing server-side environment variables:")
    missingServer.forEach((varName) => console.error(`   - ${varName}`))
  }

  if (missingClient.length > 0) {
    console.error("❌ Missing client-side environment variables:")
    missingClient.forEach((varName) => console.error(`   - ${varName}`))
  }

  if (missingServer.length > 0 || missingClient.length > 0) {
    console.error("\n💡 Add these to your Vercel project environment variables")
    console.error("💡 Or add them to your .env.local for local development")
    process.exit(1)
  }

  console.log("✅ All required environment variables are present")
  console.log("🎉 Ready for Vercel deployment!")
}

setupVercelEnv()

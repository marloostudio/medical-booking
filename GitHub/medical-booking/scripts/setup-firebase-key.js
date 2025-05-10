#!/usr/bin/env node

/**
 * Firebase Key Setup Script
 * Validates and formats Firebase service account credentials
 */

const fs = require("fs")
const path = require("path")

function setupFirebaseKey() {
  console.log("🔑 Setting up Firebase service account...")

  const requiredEnvVars = ["FIREBASE_PRIVATE_KEY", "FIREBASE_CLIENT_EMAIL", "GCLOUD_PROJECT"]

  const missing = requiredEnvVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:")
    missing.forEach((varName) => console.error(`   - ${varName}`))
    console.error("\n💡 Make sure these are set in your .env.local file")
    process.exit(1)
  }

  // Validate private key format
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
  if (!privateKey.includes("BEGIN PRIVATE KEY")) {
    console.error("❌ FIREBASE_PRIVATE_KEY appears to be malformed")
    console.error("💡 Make sure it includes the full PEM format with headers")
    process.exit(1)
  }

  // Validate email format
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  if (!clientEmail.includes("@") || !clientEmail.includes(".iam.gserviceaccount.com")) {
    console.error("❌ FIREBASE_CLIENT_EMAIL appears to be malformed")
    console.error("💡 Should be in format: name@project.iam.gserviceaccount.com")
    process.exit(1)
  }

  console.log("✅ Firebase service account configuration is valid")
  console.log(`📧 Client Email: ${clientEmail}`)
  console.log(`🏗️  Project ID: ${process.env.GCLOUD_PROJECT}`)
  console.log("🔐 Private key format: OK")
}

setupFirebaseKey()

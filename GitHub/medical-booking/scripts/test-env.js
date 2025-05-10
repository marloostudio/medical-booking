#!/usr/bin/env node

/**
 * Environment Testing Script
 * Tests all environment variables and external service connections
 */

async function testEnvironment() {
  console.log("🧪 Testing environment configuration...")

  // Test 1: Environment Variables
  console.log("\n1️⃣ Testing environment variables...")
  const requiredVars = ["NEXTAUTH_SECRET", "FIREBASE_PRIVATE_KEY", "FIREBASE_CLIENT_EMAIL", "GCLOUD_PROJECT"]

  let envTestsPassed = 0
  for (const varName of requiredVars) {
    if (process.env[varName]) {
      console.log(`   ✅ ${varName}: Present`)
      envTestsPassed++
    } else {
      console.log(`   ❌ ${varName}: Missing`)
    }
  }

  // Test 2: Firebase Connection
  console.log("\n2️⃣ Testing Firebase connection...")
  try {
    const { initializeApp, cert } = require("firebase-admin/app")
    const { getFirestore } = require("firebase-admin/firestore")

    const serviceAccount = {
      type: "service_account",
      project_id: process.env.GCLOUD_PROJECT,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    }

    const app = initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.GCLOUD_PROJECT,
    })

    const db = getFirestore(app)

    // Test read access
    await db.collection("test").limit(1).get()
    console.log("   ✅ Firebase: Connection successful")
  } catch (error) {
    console.log("   ❌ Firebase: Connection failed")
    console.log(`      Error: ${error.message}`)
  }

  // Test 3: NextAuth Configuration
  console.log("\n3️⃣ Testing NextAuth configuration...")
  if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length >= 32) {
    console.log("   ✅ NEXTAUTH_SECRET: Valid length")
  } else {
    console.log("   ❌ NEXTAUTH_SECRET: Too short or missing")
  }

  // Summary
  console.log("\n📊 Test Summary:")
  console.log(`   Environment Variables: ${envTestsPassed}/${requiredVars.length} passed`)

  if (envTestsPassed === requiredVars.length) {
    console.log("🎉 Environment is ready for development!")
  } else {
    console.log("⚠️  Some tests failed. Check your .env.local file.")
    process.exit(1)
  }
}

testEnvironment().catch(console.error)

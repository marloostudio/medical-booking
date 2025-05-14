const fs = require("fs")
const path = require("path")

/**
 * Formats the Firebase private key to ensure it has proper PEM format
 * This is critical for Vercel deployment where environment variables can lose formatting
 */
function formatFirebasePrivateKey(key) {
  if (!key) {
    console.error("FIREBASE_PRIVATE_KEY is not defined in environment variables")
    return null
  }

  // If the key already contains actual newlines, it's already formatted correctly
  if (key.includes("\n") && key.startsWith("-----BEGIN PRIVATE KEY-----")) {
    return key
  }

  // If the key has escaped newlines (\n), replace them with actual newlines
  if (key.includes("\\n")) {
    const formattedKey = key.replace(/\\n/g, "\n")

    // Verify the key now has the correct format
    if (formattedKey.startsWith("-----BEGIN PRIVATE KEY-----")) {
      return formattedKey
    }
  }

  // If the key is a single line without proper PEM headers, try to format it
  if (!key.startsWith("-----BEGIN PRIVATE KEY-----")) {
    try {
      // Add PEM headers and footers if they're missing
      const formattedKey = `-----BEGIN PRIVATE KEY-----\n${key}\n-----END PRIVATE KEY-----`
      return formattedKey
    } catch (error) {
      console.error("Failed to format private key:", error)
      return null
    }
  }

  return key
}

/**
 * Creates a .env.production.local file with properly formatted Firebase credentials
 * This ensures Firebase Admin SDK works correctly in Vercel production environment
 */
function setupFirebaseEnvironment() {
  try {
    console.log("Setting up Firebase environment for Vercel deployment...")

    const privateKey = process.env.FIREBASE_PRIVATE_KEY
    const formattedKey = formatFirebasePrivateKey(privateKey)

    if (!formattedKey) {
      console.error("Could not format Firebase private key. Deployment may fail.")
      return
    }

    // Create .env.production.local with the formatted key
    let envContent = `FIREBASE_PRIVATE_KEY="${formattedKey}"\n`

    // Add other Firebase-related environment variables
    if (process.env.FIREBASE_CLIENT_EMAIL) {
      envContent += `FIREBASE_CLIENT_EMAIL="${process.env.FIREBASE_CLIENT_EMAIL}"\n`
    }

    if (process.env.GCLOUD_PROJECT) {
      envContent += `GCLOUD_PROJECT="${process.env.GCLOUD_PROJECT}"\n`
    }

    // Write the file
    fs.writeFileSync(path.join(process.cwd(), ".env.production.local"), envContent)
    console.log("Firebase environment setup complete. Private key properly formatted.")
  } catch (error) {
    console.error("Error setting up Firebase environment:", error)
  }
}

// Run the setup
setupFirebaseEnvironment()

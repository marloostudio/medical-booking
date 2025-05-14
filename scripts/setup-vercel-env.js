const fs = require("fs")
const path = require("path")

console.log("Setting up environment variables for Vercel deployment...")

// Function to properly format the Firebase private key for Vercel
function preparePrivateKeyForVercel() {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY

  if (!privateKey) {
    console.error("FIREBASE_PRIVATE_KEY is not defined in environment variables")
    process.exit(1)
  }

  // If the key contains literal newlines, replace them with escaped newlines for Vercel
  if (privateKey.includes("\n")) {
    return privateKey.replace(/\n/g, "\\n")
  }

  return privateKey
}

// Create a .env.production.local file with properly formatted variables
function createEnvFile() {
  try {
    const envPath = path.join(process.cwd(), ".env.production.local")

    // Format the private key
    const formattedPrivateKey = preparePrivateKeyForVercel()

    // Create the env file content
    const envContent = `
# Firebase Admin (properly formatted for Vercel)
FIREBASE_PRIVATE_KEY=${formattedPrivateKey}

# Other environment variables remain unchanged
`

    // Write the file
    fs.writeFileSync(envPath, envContent, "utf8")
    console.log(".env.production.local file created successfully with properly formatted private key")
  } catch (error) {
    console.error("Error creating .env file:", error)
    process.exit(1)
  }
}

// Run the setup
createEnvFile()
console.log("Environment setup complete!")

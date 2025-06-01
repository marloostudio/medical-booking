console.log("Testing environment variables...")

// Check if Firebase environment variables are set
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY
const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL
const gcloudProject = process.env.GCLOUD_PROJECT

console.log("FIREBASE_PRIVATE_KEY exists:", !!firebasePrivateKey)
console.log("FIREBASE_CLIENT_EMAIL exists:", !!firebaseClientEmail)
console.log("GCLOUD_PROJECT exists:", !!gcloudProject)

// Check if the private key is properly formatted
if (firebasePrivateKey) {
  console.log("Private key starts with:", firebasePrivateKey.substring(0, 30) + "...")
  console.log("Private key contains newlines:", firebasePrivateKey.includes("\n"))
}

console.log("Environment test complete.")

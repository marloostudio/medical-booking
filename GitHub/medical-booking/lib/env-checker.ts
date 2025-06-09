// Define categories of environment variables for better organization
type EnvVarCategory = {
  name: string
  variables: string[]
}

// Define all environment variables by category
const envVarCategories: EnvVarCategory[] = [
  {
    name: "Firebase Configuration",
    variables: [
      "NEXT_PUBLIC_FIREBASE_API_KEY",
      "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
      "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
      "NEXT_PUBLIC_FIREBASE_APP_ID",
      "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID",
    ],
  },
  {
    name: "Firebase Admin SDK",
    variables: ["FIREBASE_PRIVATE_KEY", "FIREBASE_CLIENT_EMAIL", "GCLOUD_PROJECT"],
  },
  {
    name: "Authentication",
    variables: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "NEXTAUTH_SECRET", "NEXTAUTH_URL"],
  },
  {
    name: "External Services",
    variables: [
      "TWILIO_ACCOUNT_SID",
      "TWILIO_AUTH_TOKEN",
      "TWILIO_PHONE_NUMBER",
      "SENDGRID_API_KEY",
      "STRIPE_SECRET_KEY",
      "STRIPE_PUBLISHABLE_KEY",
      "STRIPE_WEBHOOK_SECRET",
      "GOOGLE_MAPS_API_KEY",
    ],
  },
  {
    name: "Application Settings",
    variables: ["ENCRYPTION_KEY", "DEFAULT_CLINIC_ID", "BACKUP_SECRET_TOKEN", "API_BASE_URL"],
  },
  {
    name: "Next.js Configuration",
    variables: ["NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_SUPPORT_EMAIL", "NEXT_PUBLIC_GA_MEASUREMENT_ID"],
  },
]

// Export the function as a named export
export function validateCriticalEnvVars() {
  // In development mode, we'll just log warnings
  if (process.env.NODE_ENV === "development") {
    console.log("Running in development mode - skipping strict environment variable validation")
    return
  }

  // In production, we'll check for critical variables
  const criticalVars = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "FIREBASE_PRIVATE_KEY",
    "FIREBASE_CLIENT_EMAIL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
  ]

  const missingVars = criticalVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.error(`Missing critical environment variables: ${missingVars.join(", ")}`)
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Missing critical environment variables: ${missingVars.join(", ")}`)
    }
  }
}

// Add the missing export for checkEnvironmentVariables
export const checkEnvironmentVariables = () => {
  console.log("Checking environment variables...")

  // Check for critical environment variables
  const criticalVars = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "FIREBASE_PRIVATE_KEY",
    "FIREBASE_CLIENT_EMAIL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
  ]

  const missingVars = criticalVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.warn(`Missing critical environment variables: ${missingVars.join(", ")}`)
    return false
  }

  return true
}

// Also export as default for backward compatibility
export default validateCriticalEnvVars

// Export the categories for use in admin panels or documentation
export { envVarCategories }

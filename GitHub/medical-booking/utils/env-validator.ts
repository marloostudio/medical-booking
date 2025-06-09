/**
 * Environment variable validator
 * This file should only be imported in server components or API routes
 */

export const validateRequiredEnvVars = () => {
  const requiredVars = [
    // Firebase Client
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",

    // Firebase Admin
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_PRIVATE_KEY",

    // Auth
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",

    // API Keys (server-side only)
    "GOOGLE_MAPS_API_KEY",

    // Application Settings
    "ENCRYPTION_KEY",
    "DEFAULT_CLINIC_ID",
  ]

  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(", ")}`)
    return false
  }

  return true
}

export const validateOptionalEnvVars = () => {
  const optionalVars = [
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_PHONE_NUMBER",
    "SENDGRID_API_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_PUBLISHABLE_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "BACKUP_SECRET_TOKEN",
    "API_BASE_URL",
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_SUPPORT_EMAIL",
  ]

  const missingVars = optionalVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.warn(`Missing optional environment variables: ${missingVars.join(", ")}`)
  }

  return missingVars
}

export const validateAllEnvVars = () => {
  const requiredVarsValid = validateRequiredEnvVars()
  const missingOptionalVars = validateOptionalEnvVars()

  return {
    requiredVarsValid,
    missingOptionalVars,
    allValid: requiredVarsValid && missingOptionalVars.length === 0,
  }
}

import { NextResponse } from "next/server"

type EnvVarCategory = {
  name: string
  variables: string[]
}

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

export async function GET() {
  const missingVars: Record<string, string[]> = {}
  let allPresent = true

  envVarCategories.forEach((category) => {
    const missing = category.variables.filter((varName) => !process.env[varName])

    if (missing.length > 0) {
      missingVars[category.name] = missing
      allPresent = false
    }
  })

  return NextResponse.json({
    allPresent,
    missingVars,
  })
}

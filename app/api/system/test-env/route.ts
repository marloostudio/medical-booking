import { NextResponse } from "next/server"
import { encrypt, decrypt } from "@/lib/encryption"

export async function GET() {
  try {
    // Test encryption without exposing the key
    const testString = "This is a test string for encryption"
    let encryptionWorking = false

    try {
      // Test encryption/decryption
      const encrypted = await encrypt(testString)
      const decrypted = await decrypt(encrypted)
      encryptionWorking = decrypted === testString
    } catch (error) {
      console.error("Encryption test failed:", error)
    }

    // Return status of various environment variables and services
    return NextResponse.json({
      status: "success",
      services: {
        encryption: {
          configured: Boolean(process.env.ENCRYPTION_KEY),
          working: encryptionWorking,
        },
        google: {
          clientIdConfigured: Boolean(process.env.GOOGLE_CLIENT_ID),
          clientSecretConfigured: Boolean(process.env.GOOGLE_CLIENT_SECRET),
        },
        firebase: {
          configured: Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
        },
      },
    })
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

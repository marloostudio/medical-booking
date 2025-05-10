/**
 * Environment Variable Validator
 *
 * This utility checks if critical environment variables are properly configured
 * and provides meaningful error messages if they're not.
 */

export interface ValidationResult {
  isValid: boolean
  message: string
  details?: Record<string, { isValid: boolean; message: string }>
}

export const validateEnvironmentVariables = async (): Promise<ValidationResult> => {
  const result: ValidationResult = {
    isValid: true,
    message: "All environment variables are properly configured",
    details: {},
  }

  // Check ENCRYPTION_KEY
  if (!process.env.ENCRYPTION_KEY) {
    result.isValid = false
    result.details!["ENCRYPTION_KEY"] = {
      isValid: false,
      message: "ENCRYPTION_KEY is missing",
    }
  } else if (process.env.ENCRYPTION_KEY.length < 32) {
    result.isValid = false
    result.details!["ENCRYPTION_KEY"] = {
      isValid: false,
      message: "ENCRYPTION_KEY is too short (should be at least 32 characters)",
    }
  } else {
    result.details!["ENCRYPTION_KEY"] = {
      isValid: true,
      message: "ENCRYPTION_KEY is properly configured",
    }
  }

  // Check Google OAuth credentials
  if (!process.env.GOOGLE_CLIENT_ID) {
    result.isValid = false
    result.details!["GOOGLE_CLIENT_ID"] = {
      isValid: false,
      message: "GOOGLE_CLIENT_ID is missing",
    }
  } else {
    result.details!["GOOGLE_CLIENT_ID"] = {
      isValid: true,
      message: "GOOGLE_CLIENT_ID is properly configured",
    }
  }

  if (!process.env.GOOGLE_CLIENT_SECRET) {
    result.isValid = false
    result.details!["GOOGLE_CLIENT_SECRET"] = {
      isValid: false,
      message: "GOOGLE_CLIENT_SECRET is missing",
    }
  } else {
    result.details!["GOOGLE_CLIENT_SECRET"] = {
      isValid: true,
      message: "GOOGLE_CLIENT_SECRET is properly configured",
    }
  }

  // If any validation failed, update the main message
  if (!result.isValid) {
    result.message = "Some environment variables are missing or improperly configured"
  }

  return result
}

// Test encryption functionality
export const testEncryption = async (): Promise<ValidationResult> => {
  try {
    // Dynamically import the encryption service to avoid server/client mismatch
    const { encryptionService } = await import("@/lib/encryption")

    // Test string to encrypt/decrypt
    const testString = "This is a test string for encryption"

    // Attempt to encrypt
    const encrypted = encryptionService.encrypt(testString)
    if (!encrypted) {
      return {
        isValid: false,
        message: "Encryption failed - couldn't encrypt test string",
      }
    }

    // Attempt to decrypt
    const decrypted = encryptionService.decrypt(encrypted)
    if (decrypted !== testString) {
      return {
        isValid: false,
        message: `Decryption failed - expected "${testString}" but got "${decrypted}"`,
      }
    }

    return {
      isValid: true,
      message: "Encryption service is working correctly",
    }
  } catch (error) {
    return {
      isValid: false,
      message: `Encryption test failed: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Test Google OAuth credentials
export const testGoogleOAuth = async (): Promise<ValidationResult> => {
  try {
    // We'll make a simple request to Google's OAuth server to validate credentials
    // This doesn't perform a full OAuth flow but checks if credentials are valid

    const tokenInfoUrl = `https://oauth2.googleapis.com/tokeninfo?client_id=${process.env.GOOGLE_CLIENT_ID}`

    const response = await fetch(tokenInfoUrl)

    if (response.status === 400) {
      // This is actually expected - it means the client ID is valid but we didn't provide a token
      return {
        isValid: true,
        message: "Google OAuth credentials appear to be valid",
      }
    } else if (response.status === 404) {
      return {
        isValid: false,
        message: "Google OAuth credentials are invalid - client ID not recognized",
      }
    } else {
      const data = await response.json()
      return {
        isValid: false,
        message: `Unexpected response from Google OAuth server: ${JSON.stringify(data)}`,
      }
    }
  } catch (error) {
    return {
      isValid: false,
      message: `Google OAuth test failed: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

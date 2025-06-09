import { randomBytes, createCipheriv, createDecipheriv } from "crypto"

// Get the encryption key from environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ""

if (!ENCRYPTION_KEY) {
  console.warn("ENCRYPTION_KEY is not set. Sensitive data will not be properly encrypted.")
}

// Ensure the key is the correct length for AES-256
const getKey = () => {
  // If the key is not set, use a default key (not secure for production)
  if (!ENCRYPTION_KEY) {
    return Buffer.from("0123456789abcdef0123456789abcdef") // 32 bytes for AES-256
  }

  // If the key is not 32 bytes, hash it to get a 32-byte key
  if (Buffer.from(ENCRYPTION_KEY).length !== 32) {
    const crypto = require("crypto")
    return crypto.createHash("sha256").update(ENCRYPTION_KEY).digest()
  }

  return Buffer.from(ENCRYPTION_KEY)
}

/**
 * Encrypts a string using AES-256-CBC
 * @param text The text to encrypt
 * @returns The encrypted text as a base64 string with the IV prepended
 */
export const encrypt = (text: string): string => {
  try {
    const iv = randomBytes(16) // Generate a random initialization vector
    const key = getKey()
    const cipher = createCipheriv("aes-256-cbc", key, iv)

    let encrypted = cipher.update(text, "utf8", "base64")
    encrypted += cipher.final("base64")

    // Prepend the IV to the encrypted text (we'll need it for decryption)
    return iv.toString("hex") + ":" + encrypted
  } catch (error) {
    console.error("Encryption error:", error)
    return text // Return the original text if encryption fails
  }
}

/**
 * Decrypts a string that was encrypted using the encrypt function
 * @param encryptedText The encrypted text with the IV prepended
 * @returns The decrypted text
 */
export const decrypt = (encryptedText: string): string => {
  try {
    // Check if the text is actually encrypted (should have the IV prepended)
    if (!encryptedText.includes(":")) {
      return encryptedText
    }

    const [ivHex, encrypted] = encryptedText.split(":")
    const iv = Buffer.from(ivHex, "hex")
    const key = getKey()

    const decipher = createDecipheriv("aes-256-cbc", key, iv)

    let decrypted = decipher.update(encrypted, "base64", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  } catch (error) {
    console.error("Decryption error:", error)
    return encryptedText // Return the original text if decryption fails
  }
}

/**
 * Generates a secure random token
 * @param length The length of the token in bytes (will be twice this length as a hex string)
 * @returns A random token as a hex string
 */
export const generateSecureToken = (length = 32): string => {
  return randomBytes(length).toString("hex")
}

export const encryptionService = {
  encrypt,
  decrypt,
  generateSecureToken,
}

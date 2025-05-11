import CryptoJS from "crypto-js"

// Get the encryption key from environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default-fallback-key-for-development-only"

// Simple encryption using crypto-js instead of crypto-browserify
export const encrypt = (text: string): string => {
  try {
    if (!text) return ""
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString()
  } catch (error) {
    console.error("Encryption error:", error)
    return ""
  }
}

// Simple decryption using crypto-js instead of crypto-browserify
export const decrypt = (encryptedText: string): string => {
  try {
    if (!encryptedText) return ""
    const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error("Decryption error:", error)
    return ""
  }
}

import { createHash } from "crypto"

// Derive a key from the encryption key
const getKey = (salt: Buffer) => {
  return ENCRYPTION_KEY
}

// Create the encryptionService object that was previously exported
export const encryptionService = {
  // Encryption key should be stored in environment variables
  encryptionKey: ENCRYPTION_KEY,

  // Hash data (for passwords, etc.)
  hash(text: string): string {
    return createHash("sha256").update(text).digest("hex")
  },
}

// Hash data
export const hash = (text: string): string => {
  return encryptionService.hash(text)
}

// Encrypt an object
export const encryptObject = <T extends object>(obj: T): string => {
  return encrypt(JSON.stringify(obj))
}

// Decrypt an object
export const decryptObject = <T extends object>(encryptedText: string): T => {
  const decrypted = decrypt(encryptedText)
  return JSON.parse(decrypted) as T
}

// Check if a string is encrypted
export const isEncrypted = (text: string): boolean => {
  // Check if the text matches the pattern of encrypted data
  try {
    CryptoJS.AES.decrypt(text, ENCRYPTION_KEY)
    return true
  } catch (e) {
    return false
  }
}

// Export default object for compatibility
export default {
  encrypt,
  decrypt,
  encryptObject,
  decryptObject,
  isEncrypted,
  hash,
  encryptionService,
}

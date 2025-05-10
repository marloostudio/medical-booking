import { createCipheriv, createDecipheriv, randomBytes, scryptSync, createHash } from "crypto"

// Use environment variable for the encryption key
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ""

// Derive a key from the encryption key
const getKey = (salt: Buffer) => {
  return scryptSync(ENCRYPTION_KEY, salt, 32)
}

// Create the encryptionService object that was previously exported
export const encryptionService = {
  // Encryption key should be stored in environment variables
  encryptionKey: ENCRYPTION_KEY,

  // Encrypt data
  encrypt(text: string): string {
    if (!this.encryptionKey) {
      throw new Error("Encryption key is not set")
    }

    try {
      // Generate a random salt
      const salt = randomBytes(16)
      // Derive a key using the salt
      const key = getKey(salt)
      // Generate a random initialization vector
      const iv = randomBytes(16)
      // Create a cipher using the key and iv
      const cipher = createCipheriv("aes-256-cbc", key, iv)
      // Encrypt the text
      let encrypted = cipher.update(text, "utf8", "hex")
      encrypted += cipher.final("hex")
      // Return the encrypted text with the salt and iv prepended
      return `${salt.toString("hex")}:${iv.toString("hex")}:${encrypted}`
    } catch (error) {
      console.error("Encryption error:", error)
      throw new Error("Failed to encrypt data")
    }
  },

  // Decrypt data
  decrypt(encryptedText: string): string {
    if (!this.encryptionKey) {
      throw new Error("Encryption key is not set")
    }

    try {
      // Split the encrypted text into salt, iv, and encrypted parts
      const [saltHex, ivHex, encryptedHex] = encryptedText.split(":")
      // Convert the salt and iv from hex to Buffer
      const salt = Buffer.from(saltHex, "hex")
      const iv = Buffer.from(ivHex, "hex")
      // Derive the key using the salt
      const key = getKey(salt)
      // Create a decipher using the key and iv
      const decipher = createDecipheriv("aes-256-cbc", key, iv)
      // Decrypt the text
      let decrypted = decipher.update(encryptedHex, "hex", "utf8")
      decrypted += decipher.final("utf8")
      return decrypted
    } catch (error) {
      console.error("Decryption error:", error)
      throw new Error("Failed to decrypt data")
    }
  },

  // Hash data (for passwords, etc.)
  hash(text: string): string {
    return createHash("sha256").update(text).digest("hex")
  },
}

// Encrypt data
export const encrypt = (text: string): string => {
  return encryptionService.encrypt(text)
}

// Decrypt data
export const decrypt = (encryptedText: string): string => {
  return encryptionService.decrypt(encryptedText)
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
  const parts = text.split(":")
  return parts.length === 3 && parts[0].length === 32 && parts[1].length === 32
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

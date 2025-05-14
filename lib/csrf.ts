import { randomBytes } from "crypto"
import { cookies } from "next/headers"
import { encrypt, decrypt } from "./encryption"

const CSRF_COOKIE_NAME = "csrf_token"
const CSRF_HEADER_NAME = "X-CSRF-Token"
const CSRF_FIELD_NAME = "csrfToken"
const CSRF_TOKEN_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours

export const csrf = {
  // Generate a new CSRF token and store it in a cookie
  generate: async (): Promise<string> => {
    const token = randomBytes(32).toString("hex")
    const expires = Date.now() + CSRF_TOKEN_EXPIRY

    // Store token in an encrypted cookie
    const cookieStore = cookies()
    const encryptedValue = encrypt(JSON.stringify({ token, expires }))

    cookieStore.set(CSRF_COOKIE_NAME, encryptedValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: CSRF_TOKEN_EXPIRY / 1000, // Convert to seconds
    })

    return token
  },

  // Verify that the provided token matches the one in the cookie
  verify: async (token: string): Promise<boolean> => {
    try {
      const cookieStore = cookies()
      const csrfCookie = cookieStore.get(CSRF_COOKIE_NAME)

      if (!csrfCookie) {
        return false
      }

      const decrypted = decrypt(csrfCookie.value)
      const { token: storedToken, expires } = JSON.parse(decrypted)

      // Check if token has expired
      if (Date.now() > expires) {
        return false
      }

      // Verify token matches
      return token === storedToken
    } catch (error) {
      console.error("CSRF verification error:", error)
      return false
    }
  },

  // Get the CSRF token from the request
  getTokenFromRequest: (req: Request): string | null => {
    // Check header first
    const headerToken = req.headers.get(CSRF_HEADER_NAME)
    if (headerToken) {
      return headerToken
    }

    // If not in header, try to get from form data
    // This would require parsing the request body, which we can't do here
    // as it would consume the request stream
    return null
  },

  // Middleware to validate CSRF token
  middleware: async (req: Request): Promise<Response | null> => {
    // Skip CSRF check for GET, HEAD, OPTIONS requests
    const method = req.method.toUpperCase()
    if (["GET", "HEAD", "OPTIONS"].includes(method)) {
      return null
    }

    const token = csrf.getTokenFromRequest(req)

    if (!token) {
      return new Response(JSON.stringify({ error: "CSRF token missing" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    }

    const isValid = await csrf.verify(token)

    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid CSRF token" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    }

    return null
  },
}

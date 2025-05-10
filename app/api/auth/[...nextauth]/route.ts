import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { FirestoreAdapter } from "@next-auth/firebase-adapter"
import { adminAuth, adminDb } from "@/lib/firebase-admin"
import { auditService } from "@/services/audit-service"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/calendar",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Authenticate with Firebase
          const userCredential = await adminAuth.getUserByEmail(credentials.email)

          // Get user data from Firestore
          const userDoc = await adminDb.collection("users").doc(userCredential.uid).get()

          if (!userDoc.exists) {
            return null
          }

          const userData = userDoc.data()

          // Log successful login
          await auditService.logAction(userData.clinicId || "system", {
            userId: userCredential.uid,
            action: "login",
            resource: "auth",
            ipAddress: "0.0.0.0", // This would be replaced with actual IP in middleware
            userAgent: "Unknown", // This would be replaced with actual user agent in middleware
          })

          return {
            id: userCredential.uid,
            email: userCredential.email,
            name: userData.name,
            role: userData.role,
            clinicId: userData.clinicId,
            image: userData.photoURL,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      },
    }),
  ],
  adapter: FirestoreAdapter({
    db: adminDb,
  }),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Add user data to JWT token
      if (user) {
        token.uid = user.id
        token.role = user.role
        token.clinicId = user.clinicId
      }

      // Store the access token when using Google OAuth
      if (account && account.provider === "google") {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : Date.now() + 3600 * 1000
      }

      // Refresh the token if it's expired
      if (token.accessTokenExpires && Date.now() > token.accessTokenExpires) {
        try {
          const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID!,
              client_secret: process.env.GOOGLE_CLIENT_SECRET!,
              grant_type: "refresh_token",
              refresh_token: token.refreshToken as string,
            }),
          })

          const refreshedTokens = await response.json()

          if (!response.ok) {
            console.error("Failed to refresh token:", refreshedTokens)
            return { ...token, error: "RefreshAccessTokenError" }
          }

          return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
          }
        } catch (error) {
          console.error("Error refreshing access token", error)
          return { ...token, error: "RefreshAccessTokenError" }
        }
      }

      return token
    },
    async session({ session, token }) {
      // Add user data to session
      if (token) {
        session.user.id = token.uid
        session.user.role = token.role
        session.user.clinicId = token.clinicId
        session.accessToken = token.accessToken
        session.error = token.error
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

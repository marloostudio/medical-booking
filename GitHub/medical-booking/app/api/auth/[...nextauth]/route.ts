import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { adminAuth, adminDb } from "@/lib/firebase-admin"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Get user from Firebase Auth
          const userRecord = await adminAuth.getUserByEmail(credentials.email)

          // Get user data from Firestore
          const userDoc = await adminDb.collection("users").doc(userRecord.uid).get()

          if (!userDoc.exists) {
            return null
          }

          const userData = userDoc.data()

          // For demo purposes, we'll accept any password
          // In production, you'd verify the password properly
          return {
            id: userRecord.uid,
            email: userRecord.email,
            name: userRecord.displayName,
            role: userData?.role,
            clinicId: userData?.clinicId,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.clinicId = user.clinicId
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role
        session.user.clinicId = token.clinicId
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    signUp: "/signup",
  },
  session: {
    strategy: "jwt",
  },
})

export { handler as GET, handler as POST }

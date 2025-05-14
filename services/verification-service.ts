"use client"

import { auth, db } from "@/lib/firebase"
import { doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { sendEmailVerification, applyActionCode, checkActionCode } from "firebase/auth"
import { auditService } from "./audit-service"

export const verificationService = {
  /**
   * Send email verification to the currently logged in user
   */
  async sendEmailVerification(userId: string) {
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error("No user is currently logged in")
      }

      await sendEmailVerification(user)

      // Log the action
      const userDoc = await getDoc(doc(db, "users", userId))
      const userData = userDoc.data()

      await auditService.logAction(userData?.clinicId || "system", {
        userId,
        action: "send",
        resource: "email_verification",
        details: "Email verification sent",
        ipAddress: "0.0.0.0",
        userAgent: "VerificationService",
      })

      return { success: true, message: "Verification email sent successfully" }
    } catch (error: any) {
      console.error("Error sending verification email:", error)
      return { success: false, message: error.message || "Failed to send verification email" }
    }
  },

  /**
   * Verify email with action code
   */
  async verifyEmail(actionCode: string) {
    try {
      // Check the action code first
      const info = await checkActionCode(auth, actionCode)

      // Apply the action code to verify the email
      await applyActionCode(auth, actionCode)

      // If the user is logged in, update their profile
      const user = auth.currentUser
      if (user) {
        // Update user document to mark email as verified
        await updateDoc(doc(db, "users", user.uid), {
          isEmailVerified: true,
          emailVerifiedAt: serverTimestamp(),
        })

        // Log the action
        const userDoc = await getDoc(doc(db, "users", user.uid))
        const userData = userDoc.data()

        await auditService.logAction(userData?.clinicId || "system", {
          userId: user.uid,
          action: "verify",
          resource: "email",
          details: "Email verified successfully",
          ipAddress: "0.0.0.0",
          userAgent: "VerificationService",
        })
      }

      return { success: true, message: "Email verified successfully" }
    } catch (error: any) {
      console.error("Error verifying email:", error)
      return { success: false, message: error.message || "Failed to verify email" }
    }
  },

  /**
   * Check if the current user's email is verified
   */
  async checkEmailVerification() {
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error("No user is currently logged in")
      }

      // Reload the user to get the latest status
      await user.reload()

      return {
        success: true,
        verified: user.emailVerified,
        email: user.email,
      }
    } catch (error: any) {
      console.error("Error checking email verification:", error)
      return {
        success: false,
        verified: false,
        message: error.message || "Failed to check email verification",
      }
    }
  },
}

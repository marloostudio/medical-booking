"use client"

import { useState } from "react"
import { auth } from "@/lib/firebase"
import { sendEmailVerification } from "firebase/auth"
import { AlertTriangle, Check } from "lucide-react"

interface EmailVerificationAlertProps {
  isVerified: boolean
  email: string
}

export function EmailVerificationAlert({ isVerified, email }: EmailVerificationAlertProps) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  if (isVerified) return null

  const resendVerificationEmail = async () => {
    if (!auth.currentUser) return

    setSending(true)
    setError("")
    setSent(false)

    try {
      await sendEmailVerification(auth.currentUser)
      setSent(true)
    } catch (err: any) {
      setError(err.message || "Failed to send verification email")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mb-6 p-4 border border-yellow-300 bg-yellow-50 rounded-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">Email verification required</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Please verify your email address ({email}) to unlock all features. We've sent you a verification link.
            </p>
            {sent && (
              <div className="mt-2 flex items-center text-sm text-green-600">
                <Check className="h-4 w-4 mr-1" />
                Verification email sent! Check your inbox.
              </div>
            )}
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <div className="mt-3">
              <button
                onClick={resendVerificationEmail}
                disabled={sending}
                className="text-sm font-medium text-yellow-800 hover:text-yellow-900 underline focus:outline-none"
              >
                {sending ? "Sending..." : "Resend verification email"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

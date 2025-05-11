"use client"

import { useState } from "react"
import { AlertTriangle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface EmailVerificationAlertProps {
  email: string
}

export function EmailVerificationAlert({ email }: EmailVerificationAlertProps) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const resendVerificationEmail = async () => {
    setSending(true)
    setError("")
    setSent(false)

    try {
      // In a real app, this would be an API call to resend the verification email
      // For now, we'll simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSent(true)
    } catch (err: any) {
      setError(err.message || "Failed to send verification email")
    } finally {
      setSending(false)
    }
  }

  return (
    <Alert variant="warning" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Email verification required</AlertTitle>
      <AlertDescription>
        <div className="mt-2">
          <p>Please verify your email address ({email}) to unlock all features. We've sent you a verification link.</p>
          {sent && (
            <div className="mt-2 flex items-center text-sm text-green-600">
              <Check className="h-4 w-4 mr-1" />
              Verification email sent! Check your inbox.
            </div>
          )}
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={resendVerificationEmail}
              disabled={sending}
              className="text-sm"
            >
              {sending ? "Sending..." : "Resend verification email"}
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
}

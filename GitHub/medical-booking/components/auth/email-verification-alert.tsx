"use client"

import { useState, useEffect } from "react"
import { doc, getDoc } from "firebase/firestore"
import { sendEmailVerification } from "firebase/auth"
import { db, auth } from "@/lib/firebase"
import { AlertCircle, MailCheck } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function EmailVerificationAlert() {
  const [emailVerified, setEmailVerified] = useState(true) // Default to true to not show the alert initially
  const [sending, setSending] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    // Check localStorage first to avoid showing the alert if user has manually dismissed it
    const dismissedVerification = localStorage.getItem("dismissedVerification") === "true"
    if (dismissedVerification) {
      return
    }

    // Check if the current user's email is verified
    const checkEmailVerification = async () => {
      const user = auth.currentUser
      if (!user) return

      try {
        // For demo purposes, check localStorage to see if we've verified the email already
        const verifiedInDemo = localStorage.getItem("emailVerified") === "true"

        if (verifiedInDemo) {
          setEmailVerified(true)
          return
        }

        // In a real app, we'd check the user's emailVerified property and Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setEmailVerified(userData.emailVerified || false)
        } else {
          setEmailVerified(false)
        }
      } catch (error) {
        console.error("Error checking email verification:", error)
      }
    }

    checkEmailVerification()

    // Set up a cooldown timer if it exists in localStorage
    const lastSent = Number.parseInt(localStorage.getItem("lastVerificationSent") || "0", 10)
    if (lastSent > 0) {
      const timeElapsed = Math.floor((Date.now() - lastSent) / 1000)
      const remainingCooldown = Math.max(0, 60 - timeElapsed)
      if (remainingCooldown > 0) {
        setCooldown(remainingCooldown)
        const interval = setInterval(() => {
          setCooldown((prev) => {
            const newValue = prev - 1
            if (newValue <= 0) {
              clearInterval(interval)
            }
            return newValue
          })
        }, 1000)
        return () => clearInterval(interval)
      }
    }
  }, [])

  const handleResendVerification = async () => {
    if (cooldown > 0 || sending) return

    setSending(true)
    try {
      const user = auth.currentUser
      if (!user) throw new Error("User not signed in")

      // In a real app, this would send an actual verification email
      await sendEmailVerification(user)

      // Set cooldown
      localStorage.setItem("lastVerificationSent", Date.now().toString())
      setCooldown(60)
      const interval = setInterval(() => {
        setCooldown((prev) => {
          const newValue = prev - 1
          if (newValue <= 0) {
            clearInterval(interval)
          }
          return newValue
        })
      }, 1000)

      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox and click the verification link.",
      })
    } catch (error: any) {
      console.error("Error sending verification email:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send verification email.",
      })
    } finally {
      setSending(false)
    }
  }

  const handleDismiss = () => {
    // For demo purposes, mark as verified
    localStorage.setItem("emailVerified", "true")
    localStorage.setItem("dismissedVerification", "true")
    setEmailVerified(true)
  }

  if (emailVerified) {
    return null
  }

  return (
    <Alert variant="warning" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Email not verified</AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
        <span>Please verify your email address to access all features.</span>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <Button variant="outline" size="sm" onClick={handleResendVerification} disabled={cooldown > 0 || sending}>
            <MailCheck className="h-4 w-4 mr-1" />
            {cooldown > 0 ? `Resend in ${cooldown}s` : sending ? "Sending..." : "Resend Email"}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}

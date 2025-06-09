"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle, Mail } from "lucide-react"
import { auth } from "@/lib/firebase"
import { verificationService } from "@/services/verification-service"

export default function EmailVerificationStatus() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [verified, setVerified] = useState(false)
  const [email, setEmail] = useState("")
  const [sendingVerification, setSendingVerification] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const result = await verificationService.checkEmailVerification()

        if (result.success) {
          setVerified(result.verified)
          setEmail(result.email || "")
        }
      } catch (error) {
        console.error("Error checking verification:", error)
      } finally {
        setLoading(false)
      }
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        checkVerification()
      } else {
        setLoading(false)
        router.push("/login")
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleResendVerification = async () => {
    setMessage("")
    setSendingVerification(true)

    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error("No user is logged in")
      }

      const result = await verificationService.sendEmailVerification(user.uid)

      if (result.success) {
        setMessage("Verification email sent successfully. Please check your inbox.")
      } else {
        setMessage(`Failed to send verification email: ${result.message}`)
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setSendingVerification(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (verified) {
    return (
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">Your email has been verified.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">Email verification required</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Please verify your email address ({email}) to access all features. Check your inbox for a verification
              link.
            </p>
            {message && (
              <p
                className={`mt-2 ${message.includes("Error") || message.includes("Failed") ? "text-red-600" : "text-green-600"}`}
              >
                {message}
              </p>
            )}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={sendingVerification}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
              >
                <Mail className="mr-2 h-4 w-4" />
                {sendingVerification ? "Sending..." : "Resend verification email"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

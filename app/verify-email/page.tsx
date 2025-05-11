"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const oobCode = searchParams.get("oobCode")

        if (!oobCode) {
          setStatus("error")
          setMessage("Invalid verification link. Please try again.")
          return
        }

        // In a real app, this would call the Firebase API
        // For now, we'll simulate a successful verification after a delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setStatus("success")
        setMessage("Your email has been verified successfully!")
      } catch (error: any) {
        setStatus("error")
        setMessage(error.message || "Failed to verify email. Please try again.")
      }
    }

    verifyEmail()
  }, [searchParams])

  const handleContinue = () => {
    router.push("/dev/clinic-dashboard")
  }

  const handleTryAgain = () => {
    router.push("/signup")
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>Verifying your email address</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          {status === "loading" && (
            <>
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin mb-4" />
              <p className="text-center text-gray-600">Verifying your email address...</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <p className="text-center text-gray-600">{message}</p>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="h-16 w-16 text-red-500 mb-4" />
              <p className="text-center text-gray-600">{message}</p>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {status === "success" && <Button onClick={handleContinue}>Continue to Dashboard</Button>}

          {status === "error" && (
            <Button onClick={handleTryAgain} variant="outline">
              Try Again
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

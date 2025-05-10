"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Shield } from "lucide-react"

export function MFASetup() {
  const [loading, setLoading] = useState(false)
  const [setupStarted, setSetupStarted] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [token, setToken] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const startMFASetup = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/mfa/setup", {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to set up MFA")
      }

      const data = await response.json()
      setQrCode(data.qrCode)
      setSecret(data.secret)
      setSetupStarted(true)
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  const verifyToken = async () => {
    if (!token || token.length !== 6 || !/^\d+$/.test(token)) {
      setError("Please enter a valid 6-digit token")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/mfa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to verify token")
      }

      setSuccess(true)
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            MFA Setup Complete
          </CardTitle>
          <CardDescription>Multi-Factor Authentication has been successfully enabled for your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your account is now protected with Multi-Factor Authentication. You'll need to enter a verification code
              each time you log in.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Set Up Multi-Factor Authentication
        </CardTitle>
        <CardDescription>Enhance your account security by enabling Multi-Factor Authentication</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!setupStarted ? (
          <div className="space-y-4">
            <p>
              Multi-Factor Authentication adds an extra layer of security to your account by requiring a verification
              code in addition to your password when you log in.
            </p>
            <p>
              You'll need an authenticator app like Google Authenticator, Microsoft Authenticator, or Authy to complete
              this setup.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="font-medium">Step 1: Scan the QR code with your authenticator app</p>
              {qrCode && (
                <div className="flex justify-center p-4 bg-white rounded-lg border">
                  <img src={qrCode || "/placeholder.svg"} alt="MFA QR Code" className="max-w-full h-auto" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="font-medium">Step 2: Or manually enter this code in your app</p>
              {secret && <div className="p-3 bg-gray-100 rounded-md font-mono text-center break-all">{secret}</div>}
            </div>

            <div className="space-y-2">
              <p className="font-medium">Step 3: Enter the verification code from your app</p>
              <Input
                type="text"
                placeholder="6-digit code"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!setupStarted ? (
          <Button onClick={startMFASetup} disabled={loading} className="w-full">
            {loading ? "Starting Setup..." : "Start MFA Setup"}
          </Button>
        ) : (
          <Button onClick={verifyToken} disabled={loading} className="w-full">
            {loading ? "Verifying..." : "Verify and Enable MFA"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

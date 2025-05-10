"use client"

import { useState } from "react"
import { Phone, Send, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function TwilioVerificationTester() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [verificationId, setVerificationId] = useState<string | null>(null)
  const [logs, setLogs] = useState<Array<{ timestamp: Date; action: string; status: string; details?: string }>>([])

  const sendVerificationCode = async () => {
    if (!phoneNumber) {
      setStatus("error")
      setMessage("Please enter a valid phone number")
      return
    }

    setStatus("loading")
    setMessage("Sending verification code...")

    try {
      // Simulate API call to send verification code
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a random verification ID
      const newVerificationId = Math.random().toString(36).substring(2, 15)
      setVerificationId(newVerificationId)

      setStatus("success")
      setMessage("Verification code sent successfully!")

      // Add to logs
      setLogs((prevLogs) => [
        {
          timestamp: new Date(),
          action: "Send Verification",
          status: "Success",
          details: `Sent to ${phoneNumber}`,
        },
        ...prevLogs,
      ])
    } catch (error) {
      setStatus("error")
      setMessage("Failed to send verification code. Please try again.")

      // Add to logs
      setLogs((prevLogs) => [
        {
          timestamp: new Date(),
          action: "Send Verification",
          status: "Error",
          details: `Failed to send to ${phoneNumber}`,
        },
        ...prevLogs,
      ])
    }
  }

  const verifyCode = async () => {
    if (!verificationCode) {
      setStatus("error")
      setMessage("Please enter the verification code")
      return
    }

    setStatus("loading")
    setMessage("Verifying code...")

    try {
      // Simulate API call to verify code
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, any 6-digit code is considered valid
      const isValid = /^\d{6}$/.test(verificationCode)

      if (isValid) {
        setStatus("success")
        setMessage("Verification successful!")

        // Add to logs
        setLogs((prevLogs) => [
          {
            timestamp: new Date(),
            action: "Verify Code",
            status: "Success",
            details: `Code: ${verificationCode}`,
          },
          ...prevLogs,
        ])
      } else {
        setStatus("error")
        setMessage("Invalid verification code. Please try again.")

        // Add to logs
        setLogs((prevLogs) => [
          {
            timestamp: new Date(),
            action: "Verify Code",
            status: "Error",
            details: `Invalid code: ${verificationCode}`,
          },
          ...prevLogs,
        ])
      }
    } catch (error) {
      setStatus("error")
      setMessage("Failed to verify code. Please try again.")

      // Add to logs
      setLogs((prevLogs) => [
        {
          timestamp: new Date(),
          action: "Verify Code",
          status: "Error",
          details: "System error",
        },
        ...prevLogs,
      ])
    }
  }

  const resetForm = () => {
    setPhoneNumber("")
    setVerificationCode("")
    setVerificationId(null)
    setStatus("idle")
    setMessage("")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Twilio Verification Tester</CardTitle>
        <CardDescription>Test SMS verification codes using Twilio</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="send">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="send">Send Code</TabsTrigger>
            <TabsTrigger value="verify" disabled={!verificationId}>
              Verify Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="flex gap-2">
                <Input
                  id="phoneNumber"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Button onClick={sendVerificationCode} disabled={status === "loading" || !phoneNumber}>
                  {status === "loading" ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send
                </Button>
              </div>
            </div>

            {status !== "idle" && (
              <Alert variant={status === "error" ? "destructive" : status === "success" ? "default" : "default"}>
                <Phone className="h-4 w-4" />
                <AlertTitle>{status === "success" ? "Success" : status === "error" ? "Error" : "Sending"}</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="verify" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <div className="flex gap-2">
                <Input
                  id="verificationCode"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                <Button onClick={verifyCode} disabled={status === "loading" || !verificationCode}>
                  {status === "loading" ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Verify
                </Button>
              </div>
            </div>

            {status !== "idle" && (
              <Alert variant={status === "error" ? "destructive" : status === "success" ? "default" : "default"}>
                <Phone className="h-4 w-4" />
                <AlertTitle>{status === "success" ? "Success" : status === "error" ? "Error" : "Verifying"}</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Verification Logs</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-sm text-gray-500 text-center">
                      No logs yet
                    </td>
                  </tr>
                ) : (
                  logs.map((log, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-500">{log.timestamp.toLocaleTimeString()}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{log.action}</td>
                      <td className="px-4 py-2 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            log.status === "Success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">{log.details}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={resetForm}>
          Reset
        </Button>
        <Button variant="default" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </CardFooter>
    </Card>
  )
}

"use client"

import { Suspense } from "react"
import { VerifyEmailContent } from "./verify-email-content"

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Verify Your Email</h1>
          <p className="mt-2 text-gray-600">Please check your email for verification</p>
        </div>
        <Suspense fallback={<div className="text-center p-4">Loading verification status...</div>}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  )
}

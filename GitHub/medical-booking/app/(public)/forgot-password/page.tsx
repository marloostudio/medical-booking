"use client"

import { Suspense } from "react"
import { ForgotPasswordContent } from "./forgot-password-content"

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Reset Your Password</h1>
          <p className="mt-2 text-gray-600">We'll send you a link to reset your password</p>
        </div>
        <Suspense fallback={<div className="text-center p-4">Loading form...</div>}>
          <ForgotPasswordContent />
        </Suspense>
      </div>
    </div>
  )
}

import { Suspense } from "react"
import SignupContent from "./signup-content"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="mt-2 text-gray-600">Sign up to get started</p>
        </div>
        <Suspense fallback={<div className="text-center p-4">Loading signup form...</div>}>
          <SignupContent />
        </Suspense>
      </div>
    </div>
  )
}

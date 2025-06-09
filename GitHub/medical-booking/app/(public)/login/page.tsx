import { Suspense } from "react"
import { LoginContent } from "./login-content"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sign in to your account</h1>
          <p className="mt-2 text-gray-600">Or create a new account</p>
        </div>
        <Suspense fallback={<div className="text-center p-4">Loading login form...</div>}>
          <LoginContent />
        </Suspense>
      </div>
    </div>
  )
}

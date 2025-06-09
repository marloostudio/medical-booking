import { Suspense } from "react"
import SignupContent from "./signup-content"

// Set the runtime to nodejs to ensure Firebase Admin works correctly
export const runtime = "nodejs"

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupContent />
    </Suspense>
  )
}

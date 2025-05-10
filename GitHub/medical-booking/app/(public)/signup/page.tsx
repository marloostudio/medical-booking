import type { Metadata } from "next"
import { SignupContent } from "./signup-content"

export const metadata: Metadata = {
  title: "Sign Up - BookingLink",
  description: "Create your BookingLink account",
}

export default function SignupPage() {
  return <SignupContent />
}

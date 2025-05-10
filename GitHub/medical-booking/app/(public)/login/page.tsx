import type { Metadata } from "next"
import { LoginContent } from "./login-content"

export const metadata: Metadata = {
  title: "Login - BookingLink",
  description: "Sign in to your BookingLink account",
}

export default function LoginPage() {
  return <LoginContent />
}

import { Suspense } from "react"
import type { Metadata } from "next"
import LoginContent from "./login-content"

export const metadata: Metadata = {
  title: "Login | BookingLink",
  description: "Log in to your BookingLink account",
}

// This function ensures the page is not cached
export const dynamic = "force-dynamic"
export const revalidate = 0

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string }
}) {
  const redirect = searchParams.redirect || "/dashboard"

  return (
    <Suspense fallback={<div>Loading login...</div>}>
      <LoginContent redirect={redirect} />
    </Suspense>
  )
}

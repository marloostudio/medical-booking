"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Simulate authentication - replace with actual Firebase auth
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // For demo purposes, only allow specific credentials
  if (email === "test@example.com" && password === "password") {
    // Set a cookie to simulate authentication
    cookies().set("auth-token", "demo-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    // Redirect to dashboard
    redirect("/dashboard")
  }

  // Return error for invalid credentials
  return { success: false, error: "Invalid email or password" }
}

export async function logoutAction() {
  cookies().delete("auth-token")
  redirect("/login")
}

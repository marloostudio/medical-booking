import { redirect } from "next/navigation"

export async function GET() {
  // In a real app, this would sign out the user
  // For now, just redirect to the login page
  redirect("/login")
}

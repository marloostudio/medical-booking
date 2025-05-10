import { redirect } from "next/navigation"

// This is a placeholder page that redirects to the dashboard
// It's used to handle any deep links to the removed patients section
export default function PatientsPlaceholderPage() {
  redirect("/dashboard")
}

import { redirect } from "next/navigation"

export default function PatientsViewPage() {
  redirect("/dashboard")
  return null
}

import { redirect } from "next/navigation"

export default function PatientsLoading() {
  redirect("/dashboard")
  return null
}

import { redirect } from "next/navigation"

export default function PatientsNotFound() {
  redirect("/dashboard")
  return null
}

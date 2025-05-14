import { redirect } from "next/navigation"

export default function PatientsDefault() {
  redirect("/dashboard")
  return null
}

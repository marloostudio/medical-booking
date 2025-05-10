import { redirect } from "next/navigation"

export default function PatientsTemplate() {
  redirect("/dashboard")
  return null
}

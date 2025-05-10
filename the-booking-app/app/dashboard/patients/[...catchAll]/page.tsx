import { redirect } from "next/navigation"

export default function PatientsCatchAll() {
  redirect("/dashboard")
  return null
}

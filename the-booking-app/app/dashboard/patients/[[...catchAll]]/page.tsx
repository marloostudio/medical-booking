import { redirect } from "next/navigation"

export default function PatientsOptionalCatchAll() {
  redirect("/dashboard")
  return null
}

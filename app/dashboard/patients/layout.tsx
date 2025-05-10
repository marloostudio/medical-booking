import { redirect } from "next/navigation"

export default function PatientsLayout() {
  redirect("/dashboard")
  return null
}

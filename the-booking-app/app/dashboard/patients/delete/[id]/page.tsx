import { redirect } from "next/navigation"

export default function PatientsDeletePage() {
  redirect("/dashboard")
  return null
}

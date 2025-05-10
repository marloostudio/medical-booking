import { redirect } from "next/navigation"

export default function PatientsPage() {
  // Redirect to the patients placeholder page
  redirect("/dashboard/patients-placeholder")
}

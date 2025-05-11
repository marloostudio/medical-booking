import { PageTemplate } from "@/components/dashboard/page-template"
import { PatientSearch } from "@/components/dashboard/patient-search"

export default function PatientsPage() {
  return (
    <PageTemplate title="Patients" description="Search, view, and manage patient records">
      <PatientSearch />
    </PageTemplate>
  )
}

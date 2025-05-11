import { PageTemplate } from "@/components/dashboard/page-template"
import { AppointmentTypesManager } from "@/components/dashboard/appointment-types-manager"

export default function AppointmentTypesPage() {
  return (
    <PageTemplate title="Appointment Types" description="Configure the types of appointments your clinic offers">
      <AppointmentTypesManager />
    </PageTemplate>
  )
}

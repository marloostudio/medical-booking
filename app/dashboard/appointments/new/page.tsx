import { PageTemplate } from "@/components/dashboard/page-template"
import { AppointmentBookingForm } from "@/components/dashboard/appointment-booking-form"

export default function NewAppointmentPage() {
  return (
    <PageTemplate title="Book New Appointment" description="Schedule a new appointment for a patient">
      <AppointmentBookingForm />
    </PageTemplate>
  )
}

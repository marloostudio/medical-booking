// Convert to server component
import { Suspense } from "react"
import BookingFlow from "@/components/booking/booking-flow"

export function BookingPageContent({
  clinicId,
  appointmentTypeId,
  staffId,
  date,
}: {
  clinicId: string
  appointmentTypeId?: string
  staffId?: string
  date?: string
}) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Book an Appointment</h1>
      <Suspense fallback={<div>Loading booking options...</div>}>
        <BookingFlow
          clinicId={clinicId}
          initialAppointmentTypeId={appointmentTypeId}
          initialStaffId={staffId}
          initialDate={date}
        />
      </Suspense>
    </div>
  )
}

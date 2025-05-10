"use client"

import { BookingFlow } from "@/components/booking/booking-flow"

interface BookingContentProps {
  clinicId: string
  patientId: string
  appointmentType: string
  staffId: string
}

export function BookingContent({ clinicId, patientId, appointmentType, staffId }: BookingContentProps) {
  return (
    <div>
      {/* You can use the props here to initialize the booking flow */}
      <BookingFlow
        clinicId={clinicId}
        patientId={patientId}
        initialAppointmentType={appointmentType}
        initialStaffId={staffId}
      />
    </div>
  )
}

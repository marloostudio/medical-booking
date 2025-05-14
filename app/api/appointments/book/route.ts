import { NextResponse } from "next/server"
import { parseISO } from "date-fns"
import { appointmentService, type BookingRequest } from "@/services/appointment-service"
import { notificationService } from "@/services/notification-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { clinicId, patientId, staffId, appointmentTypeId, startTime, patientNotes } = body

    if (!clinicId || !patientId || !staffId || !appointmentTypeId || !startTime) {
      return NextResponse.json({ error: "Missing required booking information" }, { status: 400 })
    }

    const bookingRequest: BookingRequest = {
      clinicId,
      patientId,
      staffId,
      appointmentTypeId,
      startTime: parseISO(startTime),
      patientNotes,
    }

    const result = await appointmentService.createAppointment(bookingRequest)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    // Schedule reminders for the new appointment
    await notificationService.scheduleAppointmentReminders(result.appointment)

    return NextResponse.json({
      success: true,
      appointment: result.appointment,
    })
  } catch (error) {
    console.error("Error booking appointment:", error)
    return NextResponse.json({ error: "Failed to book appointment" }, { status: 500 })
  }
}

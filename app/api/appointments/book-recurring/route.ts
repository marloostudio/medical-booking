import { NextResponse } from "next/server"
import { parseISO } from "date-fns"
import { appointmentService, type BookingRequest } from "@/services/appointment-service"
import { notificationService } from "@/services/notification-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { clinicId, patientId, staffId, appointmentTypeId, startTime, patientNotes, recurrencePattern } = body

    if (!clinicId || !patientId || !staffId || !appointmentTypeId || !startTime || !recurrencePattern) {
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

    const result = await appointmentService.createRecurringAppointments(bookingRequest, {
      frequency: recurrencePattern.frequency as "weekly" | "biweekly" | "monthly",
      occurrences: recurrencePattern.occurrences,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    // Schedule reminders for each appointment
    for (const appointment of result.appointments) {
      await notificationService.scheduleAppointmentReminders(appointment)
    }

    return NextResponse.json({
      success: true,
      appointments: result.appointments,
    })
  } catch (error) {
    console.error("Error booking recurring appointments:", error)
    return NextResponse.json({ error: "Failed to book recurring appointments" }, { status: 500 })
  }
}

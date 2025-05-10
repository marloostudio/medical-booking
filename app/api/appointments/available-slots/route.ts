import { NextResponse } from "next/server"
import { parseISO } from "date-fns"
import { appointmentService } from "@/services/appointment-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clinicId = searchParams.get("clinicId")
    const staffId = searchParams.get("staffId")
    const appointmentTypeId = searchParams.get("appointmentTypeId")
    const dateString = searchParams.get("date")

    if (!clinicId || !staffId || !appointmentTypeId || !dateString) {
      return NextResponse.json(
        { error: "Clinic ID, staff ID, appointment type ID, and date are required" },
        { status: 400 },
      )
    }

    const date = parseISO(dateString)

    const timeSlots = await appointmentService.getAvailableTimeSlots(clinicId, staffId, date, appointmentTypeId)

    return NextResponse.json({ timeSlots })
  } catch (error) {
    console.error("Error fetching available time slots:", error)
    return NextResponse.json({ error: "Failed to fetch available time slots" }, { status: 500 })
  }
}

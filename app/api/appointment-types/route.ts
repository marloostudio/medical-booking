import { NextResponse } from "next/server"
import { appointmentTypeService } from "@/services/appointment-type-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clinicId = searchParams.get("clinicId")

    if (!clinicId) {
      return NextResponse.json({ error: "Clinic ID is required" }, { status: 400 })
    }

    const appointmentTypes = await appointmentTypeService.getAppointmentTypes(clinicId)

    return NextResponse.json({ appointmentTypes })
  } catch (error) {
    console.error("Error fetching appointment types:", error)
    return NextResponse.json({ error: "Failed to fetch appointment types" }, { status: 500 })
  }
}

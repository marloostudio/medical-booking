import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore"
import { v4 as uuidv4 } from "uuid"
import { availabilityService } from "./availability-service"
import { bookingRulesService } from "./booking-rules-service"
import { googleCalendarService } from "./google-calendar-service"
import { emailService } from "./email-service"
import { auditService } from "./audit-service"

export interface TimeSlot {
  start: number // timestamp in milliseconds
  end: number // timestamp in milliseconds
}

export interface BookingRequest {
  clinicId: string
  patientId: string
  staffId: string
  appointmentTypeId: string
  startTime: Date
  patientNotes?: string
  syncToGoogleCalendar?: boolean
}

export interface RecurringBookingRequest extends BookingRequest {
  frequency: "weekly" | "biweekly" | "monthly"
  occurrences: number
}

export const appointmentService = {
  async createAppointment(bookingRequest: BookingRequest) {
    try {
      const { clinicId, patientId, staffId, appointmentTypeId, startTime, patientNotes, syncToGoogleCalendar } =
        bookingRequest

      // Validate the appointment
      const isAvailable = await availabilityService.checkAvailability(clinicId, staffId, startTime, appointmentTypeId)

      if (!isAvailable) {
        return {
          success: false,
          message: "The selected time slot is not available.",
        }
      }

      // Check booking rules (e.g., advance notice, max bookings per day)
      const rulesCheck = await bookingRulesService.validateBookingRules(
        clinicId,
        patientId,
        staffId,
        appointmentTypeId,
        startTime,
      )

      if (!rulesCheck.isValid) {
        return {
          success: false,
          message: rulesCheck.message,
        }
      }

      // Get appointment type details
      const appointmentTypeRef = doc(db, `clinics/${clinicId}/appointmentTypes/${appointmentTypeId}`)
      const appointmentTypeSnap = await getDoc(appointmentTypeRef)

      if (!appointmentTypeSnap.exists()) {
        return {
          success: false,
          message: "Appointment type not found.",
        }
      }

      const appointmentType = appointmentTypeSnap.data()

      // Calculate end time based on duration
      const endTime = new Date(startTime.getTime() + appointmentType.duration * 60000)

      // Create appointment
      const appointmentId = uuidv4()
      const appointmentRef = doc(db, `clinics/${clinicId}/appointments/${appointmentId}`)

      const appointment = {
        id: appointmentId,
        clinicId,
        patientId,
        staffId,
        appointmentTypeId,
        appointmentType,
        startTime: Timestamp.fromDate(startTime),
        endTime: Timestamp.fromDate(endTime),
        status: "confirmed",
        patientNotes: patientNotes || "",
        staffNotes: "",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }

      await setDoc(appointmentRef, appointment)

      // Update staff availability
      await availabilityService.blockTimeSlot(clinicId, staffId, startTime, endTime)

      // Get patient and staff details for notifications
      const patientRef = doc(db, `clinics/${clinicId}/patients/${patientId}`)
      const patientSnap = await getDoc(patientRef)

      const staffRef = doc(db, `clinics/${clinicId}/staff/${staffId}`)
      const staffSnap = await getDoc(staffRef)

      const clinicRef = doc(db, `clinics/${clinicId}`)
      const clinicSnap = await getDoc(clinicRef)

      if (patientSnap.exists() && staffSnap.exists() && clinicSnap.exists()) {
        const patient = patientSnap.data()
        const staff = staffSnap.data()
        const clinic = clinicSnap.data()

        // Send email confirmation
        await emailService.sendAppointmentConfirmation(
          appointment,
          patient.email,
          `${patient.firstName} ${patient.lastName}`,
          clinic.name,
          staff.name,
          staffId,
          clinicId,
        )

        // Sync to Google Calendar if requested
        if (syncToGoogleCalendar) {
          try {
            await googleCalendarService.syncAppointmentToGoogleCalendar(
              {
                ...appointment,
                startTime: startTime,
                endTime: endTime,
                patientEmail: patient.email,
              },
              `${patient.firstName} ${patient.lastName}`,
              staff.name,
              clinic.name,
              clinic.address,
            )
          } catch (error) {
            console.error("Failed to sync appointment to Google Calendar:", error)
            // Don't fail the booking if calendar sync fails
          }
        }
      }

      // Log the booking
      await auditService.logAction(clinicId, {
        userId: staffId,
        action: "create",
        resource: "appointment",
        resourceId: appointmentId,
        details: `Appointment created for patient ${patientId} with ${staffId}`,
        ipAddress: "0.0.0.0",
        userAgent: "AppointmentService",
      })

      return {
        success: true,
        appointment,
      }
    } catch (error) {
      console.error("Error creating appointment:", error)
      return {
        success: false,
        message: "Failed to create appointment. Please try again.",
      }
    }
  },

  async createRecurringAppointments(
    bookingRequest: BookingRequest,
    recurrenceOptions: { frequency: "weekly" | "biweekly" | "monthly"; occurrences: number },
  ): Promise<{ success: boolean; message?: string; appointments?: any[] }> {
    try {
      const { frequency, occurrences } = recurrenceOptions
      const appointments = []

      const currentStartTime = new Date(bookingRequest.startTime)

      for (let i = 0; i < occurrences; i++) {
        const result = await this.createAppointment({
          ...bookingRequest,
          startTime: currentStartTime,
        })

        if (!result.success) {
          return {
            success: false,
            message: `Failed to create recurring appointment ${i + 1}: ${result.message}`,
          }
        }

        appointments.push(result.appointment)

        // Increment the start time based on the recurrence pattern
        if (frequency === "weekly") {
          currentStartTime.setDate(currentStartTime.getDate() + 7)
        } else if (frequency === "biweekly") {
          currentStartTime.setDate(currentStartTime.getDate() + 14)
        } else if (frequency === "monthly") {
          currentStartTime.setMonth(currentStartTime.getMonth() + 1)
        }
      }

      return {
        success: true,
        appointments,
      }
    } catch (error) {
      console.error("Error creating recurring appointments:", error)
      return {
        success: false,
        message: "Failed to create recurring appointments. Please try again.",
      }
    }
  },

  async getAvailableTimeSlots(
    clinicId: string,
    staffId: string,
    date: Date,
    appointmentTypeId: string,
  ): Promise<any[]> {
    // This would be replaced with actual logic to fetch available time slots
    // from the database, taking into account existing appointments, staff availability, etc.
    // For now, we'll simulate some time slots
    const startOfDay = new Date(date)
    startOfDay.setHours(8, 0, 0, 0) // Start at 8:00 AM

    const endOfDay = new Date(date)
    endOfDay.setHours(17, 0, 0, 0) // End at 5:00 PM

    const timeSlots = []
    const currentTime = new Date(startOfDay)

    while (currentTime < endOfDay) {
      timeSlots.push({
        startTime: new Date(currentTime.getTime()),
        endTime: new Date(currentTime.getTime() + 30 * 60000), // 30-minute slots
        available: true,
      })

      currentTime.setMinutes(currentTime.getMinutes() + 30)
    }

    return timeSlots
  },

  async validateBookingRules(
    clinicId: string,
    patientId: string,
    staffId: string,
    appointmentTypeId: string,
    startTime: Date,
  ): Promise<{ valid: boolean; message?: string }> {
    return bookingRulesService.validateBookingAgainstRules(clinicId, patientId, staffId, appointmentTypeId, startTime)
  },
}

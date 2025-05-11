import { db } from "@/lib/firebase"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  limit,
} from "firebase/firestore"
import { v4 as uuidv4 } from "uuid"
import { availabilityService } from "./availability-service"
import { bookingRulesService } from "./booking-rules-service"
import { googleCalendarService } from "./google-calendar-service"
import { emailService } from "./email-service"
import { auditService } from "./audit-service"
import { notificationService } from "./notification-service"

export interface TimeSlot {
  start: number // timestamp in milliseconds
  end: number // timestamp in milliseconds
}

export interface Appointment {
  id: string
  clinicId: string
  patientId: string
  staffId: string
  appointmentTypeId: string
  appointmentType: {
    name: string
    duration: number
    color: string
    price: number
  }
  startTime: Timestamp
  endTime: Timestamp
  status: "scheduled" | "confirmed" | "cancelled" | "completed" | "no-show"
  patientNotes: string
  staffNotes: string
  createdAt: Timestamp
  updatedAt: Timestamp
  cancelledAt?: Timestamp
  cancelledBy?: string
  cancelReason?: string
  reminderSent?: boolean
  followUpScheduled?: boolean
  paymentStatus?: "pending" | "paid" | "refunded" | "waived"
  paymentAmount?: number
  insuranceBilled?: boolean
  checkInTime?: Timestamp
  checkOutTime?: Timestamp
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

      const appointment: Appointment = {
        id: appointmentId,
        clinicId,
        patientId,
        staffId,
        appointmentTypeId,
        appointmentType: {
          name: appointmentType.name,
          duration: appointmentType.duration,
          color: appointmentType.color || "#4f46e5",
          price: appointmentType.price || 0,
        },
        startTime: Timestamp.fromDate(startTime),
        endTime: Timestamp.fromDate(endTime),
        status: "confirmed",
        patientNotes: patientNotes || "",
        staffNotes: "",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        reminderSent: false,
        followUpScheduled: false,
        paymentStatus: "pending",
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

        // Send SMS confirmation if patient has opted in
        if (patient.smsNotifications) {
          try {
            await notificationService.sendAppointmentConfirmationSMS(
              patient.phone,
              `${patient.firstName} ${patient.lastName}`,
              appointmentType.name,
              startTime,
              staff.name,
              clinic.name,
            )
          } catch (error) {
            console.error("Failed to send SMS confirmation:", error)
            // Don't fail the booking if SMS fails
          }
        }

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

  async getAppointment(clinicId: string, appointmentId: string): Promise<Appointment | null> {
    try {
      const appointmentRef = doc(db, `clinics/${clinicId}/appointments/${appointmentId}`)
      const appointmentSnap = await getDoc(appointmentRef)

      if (!appointmentSnap.exists()) {
        return null
      }

      return appointmentSnap.data() as Appointment
    } catch (error) {
      console.error("Error getting appointment:", error)
      return null
    }
  },

  async getAppointments(
    clinicId: string,
    filters: {
      patientId?: string
      staffId?: string
      status?: string
      startDate?: Date
      endDate?: Date
      limit?: number
    } = {},
  ): Promise<Appointment[]> {
    try {
      const appointmentsRef = collection(db, `clinics/${clinicId}/appointments`)

      // Start building the query
      let appointmentsQuery = query(appointmentsRef)

      // Add filters
      if (filters.patientId) {
        appointmentsQuery = query(appointmentsQuery, where("patientId", "==", filters.patientId))
      }

      if (filters.staffId) {
        appointmentsQuery = query(appointmentsQuery, where("staffId", "==", filters.staffId))
      }

      if (filters.status) {
        appointmentsQuery = query(appointmentsQuery, where("status", "==", filters.status))
      }

      if (filters.startDate) {
        appointmentsQuery = query(appointmentsQuery, where("startTime", ">=", Timestamp.fromDate(filters.startDate)))
      }

      if (filters.endDate) {
        appointmentsQuery = query(appointmentsQuery, where("startTime", "<=", Timestamp.fromDate(filters.endDate)))
      }

      // Always sort by startTime
      appointmentsQuery = query(appointmentsQuery, orderBy("startTime", "asc"))

      // Apply limit if specified
      if (filters.limit) {
        appointmentsQuery = query(appointmentsQuery, limit(filters.limit))
      }

      const snapshot = await getDocs(appointmentsQuery)

      const appointments: Appointment[] = []
      snapshot.forEach((doc) => {
        appointments.push(doc.data() as Appointment)
      })

      return appointments
    } catch (error) {
      console.error("Error getting appointments:", error)
      return []
    }
  },

  async updateAppointment(
    clinicId: string,
    appointmentId: string,
    data: Partial<Appointment>,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const appointmentRef = doc(db, `clinics/${clinicId}/appointments/${appointmentId}`)
      const appointmentSnap = await getDoc(appointmentRef)

      if (!appointmentSnap.exists()) {
        return {
          success: false,
          message: "Appointment not found.",
        }
      }

      // Update the appointment
      await updateDoc(appointmentRef, {
        ...data,
        updatedAt: Timestamp.now(),
      })

      // If status is changed to cancelled, update the cancellation details
      if (data.status === "cancelled" && !appointmentSnap.data().cancelledAt) {
        await updateDoc(appointmentRef, {
          cancelledAt: Timestamp.now(),
          cancelledBy: data.cancelledBy || "unknown",
          cancelReason: data.cancelReason || "No reason provided",
        })

        // Free up the time slot in staff availability
        const appointment = appointmentSnap.data() as Appointment
        await availabilityService.freeTimeSlot(
          clinicId,
          appointment.staffId,
          appointment.startTime.toDate(),
          appointment.endTime.toDate(),
        )

        // Notify the patient about cancellation
        const patientRef = doc(db, `clinics/${clinicId}/patients/${appointment.patientId}`)
        const patientSnap = await getDoc(patientRef)

        if (patientSnap.exists()) {
          const patient = patientSnap.data()

          // Send email notification
          await emailService.sendAppointmentCancellation(
            appointment,
            patient.email,
            `${patient.firstName} ${patient.lastName}`,
            data.cancelReason || "No reason provided",
          )

          // Send SMS notification if patient has opted in
          if (patient.smsNotifications) {
            try {
              await notificationService.sendAppointmentCancellationSMS(
                patient.phone,
                `${patient.firstName} ${patient.lastName}`,
                appointment.appointmentType.name,
                appointment.startTime.toDate(),
                data.cancelReason || "No reason provided",
              )
            } catch (error) {
              console.error("Failed to send SMS cancellation:", error)
              // Don't fail the update if SMS fails
            }
          }
        }
      }

      // If status is changed to completed, update the checkout time
      if (data.status === "completed" && !appointmentSnap.data().checkOutTime) {
        await updateDoc(appointmentRef, {
          checkOutTime: Timestamp.now(),
        })
      }

      return {
        success: true,
      }
    } catch (error) {
      console.error("Error updating appointment:", error)
      return {
        success: false,
        message: "Failed to update appointment. Please try again.",
      }
    }
  },

  async deleteAppointment(clinicId: string, appointmentId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const appointmentRef = doc(db, `clinics/${clinicId}/appointments/${appointmentId}`)
      const appointmentSnap = await getDoc(appointmentRef)

      if (!appointmentSnap.exists()) {
        return {
          success: false,
          message: "Appointment not found.",
        }
      }

      // In a production environment, we might want to archive appointments instead of deleting them
      await deleteDoc(appointmentRef)

      // Free up the time slot in staff availability
      const appointment = appointmentSnap.data() as Appointment
      await availabilityService.freeTimeSlot(
        clinicId,
        appointment.staffId,
        appointment.startTime.toDate(),
        appointment.endTime.toDate(),
      )

      return {
        success: true,
      }
    } catch (error) {
      console.error("Error deleting appointment:", error)
      return {
        success: false,
        message: "Failed to delete appointment. Please try again.",
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
    try {
      // Get the appointment type to determine duration
      const appointmentTypeRef = doc(db, `clinics/${clinicId}/appointmentTypes/${appointmentTypeId}`)
      const appointmentTypeSnap = await getDoc(appointmentTypeRef)

      if (!appointmentTypeSnap.exists()) {
        throw new Error("Appointment type not found")
      }

      const appointmentType = appointmentTypeSnap.data()
      const appointmentDuration = appointmentType.duration // in minutes

      // Get staff availability for the date
      const availability = await availabilityService.getStaffAvailability(clinicId, staffId, date)

      if (!availability || !availability.timeSlots || availability.timeSlots.length === 0) {
        return [] // No availability for this date
      }

      // Get existing appointments for the staff on this date
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)

      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      const existingAppointments = await this.getAppointments(clinicId, {
        staffId,
        startDate: startOfDay,
        endDate: endOfDay,
        status: "confirmed", // Only consider confirmed appointments
      })

      // Convert existing appointments to blocked time slots
      const blockedSlots = existingAppointments.map((appointment) => ({
        start: appointment.startTime.toDate().getTime(),
        end: appointment.endTime.toDate().getTime(),
      }))

      // Generate available time slots based on staff availability and existing appointments
      const availableSlots = []

      for (const slot of availability.timeSlots) {
        let currentTime = slot.start
        const slotEnd = slot.end

        while (currentTime + appointmentDuration * 60000 <= slotEnd) {
          const potentialSlotEnd = currentTime + appointmentDuration * 60000

          // Check if this potential slot overlaps with any existing appointment
          const isOverlapping = blockedSlots.some((blockedSlot) => {
            return (
              (currentTime >= blockedSlot.start && currentTime < blockedSlot.end) ||
              (potentialSlotEnd > blockedSlot.start && potentialSlotEnd <= blockedSlot.end) ||
              (currentTime <= blockedSlot.start && potentialSlotEnd >= blockedSlot.end)
            )
          })

          if (!isOverlapping) {
            availableSlots.push({
              startTime: new Date(currentTime),
              endTime: new Date(potentialSlotEnd),
              available: true,
            })
          }

          // Move to the next potential slot (typically in 15 or 30-minute increments)
          currentTime += 15 * 60000 // 15-minute increments
        }
      }

      return availableSlots.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    } catch (error) {
      console.error("Error getting available time slots:", error)
      return []
    }
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

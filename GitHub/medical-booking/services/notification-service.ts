import { Twilio } from "twilio"
import { auditService } from "./audit-service"
import { emailService } from "./email-service"

// Add these imports at the top
import { format, addHours, addDays, parseISO, isBefore } from "@/lib/date-utils"
import { db } from "@/lib/firebase"
import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs } from "firebase/firestore"
import { v4 as uuidv4 } from "uuid"

// Initialize Twilio client
const twilioClient =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null

// Maximum retry attempts for SMS
const MAX_SMS_RETRIES = 3

// Add these interfaces after the existing imports
interface ReminderPreference {
  enabled: boolean
  channels: {
    sms: boolean
    email: boolean
    push: boolean
  }
  timing: {
    days: number[]
    hours: number[]
  }
}

interface ReminderTemplate {
  id: string
  name: string
  type: "sms" | "email" | "push"
  subject?: string
  content: string
  variables: string[]
  createdAt: number
  updatedAt: number
}

interface ReminderLog {
  id: string
  appointmentId: string
  patientId: string
  clinicId: string
  type: "sms" | "email" | "push"
  status: "sent" | "delivered" | "failed" | "responded"
  response?: "confirm" | "cancel" | "reschedule" | "none"
  content: string
  sentAt: number
  deliveredAt?: number
  respondedAt?: number
}

export const notificationService = {
  async sendSMS(
    to: string,
    message: string,
    userId: string,
    clinicId: string,
    options: { retryCount?: number; fallbackToEmail?: boolean; fallbackEmail?: string } = {},
  ): Promise<{ success: boolean; error?: string; sid?: string }> {
    const retryCount = options.retryCount || 0

    if (!twilioClient) {
      console.error("Twilio client not initialized")
      return { success: false, error: "SMS service not configured" }
    }

    try {
      // Validate phone number format (basic E.164 check)
      if (!to.startsWith("+")) {
        to = `+${to.replace(/\D/g, "")}`
      }

      // Send SMS via Twilio
      const result = await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to,
      })

      // Log successful SMS
      await auditService.logAction(clinicId, {
        userId,
        action: "create",
        resource: "sms",
        details: `SMS sent to ${to}: ${message.substring(0, 50)}${message.length > 50 ? "..." : ""}`,
        ipAddress: "0.0.0.0",
        userAgent: "NotificationService",
      })

      return { success: true, sid: result.sid }
    } catch (error) {
      console.error("Error sending SMS:", error)

      // Log the error
      await auditService.logAction(clinicId, {
        userId,
        action: "error",
        resource: "sms",
        details: `Failed to send SMS to ${to}: ${error.message}`,
        ipAddress: "0.0.0.0",
        userAgent: "NotificationService",
      })

      // Retry logic
      if (retryCount < MAX_SMS_RETRIES) {
        console.log(`Retrying SMS to ${to} (attempt ${retryCount + 1})`)
        return this.sendSMS(to, message, userId, clinicId, {
          ...options,
          retryCount: retryCount + 1,
        })
      }

      // Fallback to email if SMS fails after retries
      if (options.fallbackToEmail && options.fallbackEmail) {
        try {
          await emailService.sendEmail(
            options.fallbackEmail,
            "Message from BookingLink",
            `<p>We tried to send you an SMS but were unable to reach your phone. Here's the message:</p><p>${message}</p>`,
            `We tried to send you an SMS but were unable to reach your phone. Here's the message:\n\n${message}`,
            "notifications@thebookinglink.com",
            userId,
            clinicId,
          )

          return {
            success: true,
            error: "SMS failed but email fallback succeeded",
          }
        } catch (emailError) {
          console.error("Email fallback also failed:", emailError)
          return {
            success: false,
            error: `SMS failed and email fallback also failed: ${emailError.message}`,
          }
        }
      }

      return {
        success: false,
        error: error.message,
      }
    }
  },

  async sendAppointmentConfirmation(appointment: any): Promise<void> {
    try {
      // Get patient and clinic details
      // This would be replaced with actual database queries
      const patientId = appointment.patientId
      const clinicId = appointment.clinicId

      // Get patient phone and email
      // This would be replaced with actual database queries
      const patientPhone = "+15551234567" // Example
      const patientEmail = "patient@example.com" // Example
      const patientName = "John Doe" // Example

      // Get clinic and staff details
      // This would be replaced with actual database queries
      const clinicName = "Example Clinic" // Example
      const staffName = "Dr. Smith" // Example

      // Format appointment date and time
      const appointmentDate = new Date(appointment.startTime).toLocaleDateString()
      const appointmentTime = new Date(appointment.startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })

      // Send SMS confirmation
      const smsMessage = `Your appointment with ${staffName} at ${clinicName} has been confirmed for ${appointmentDate} at ${appointmentTime}. Reply HELP for help or STOP to unsubscribe.`

      await this.sendSMS(patientPhone, smsMessage, appointment.staffId, clinicId, {
        fallbackToEmail: true,
        fallbackEmail: patientEmail,
      })

      // Send email confirmation as well
      await emailService.sendAppointmentConfirmation(
        appointment,
        patientEmail,
        patientName,
        clinicName,
        staffName,
        appointment.staffId,
        clinicId,
      )
    } catch (error) {
      console.error("Error sending appointment confirmation:", error)
      // Log the error but don't throw - we don't want to fail the appointment creation
      await auditService.logAction(appointment.clinicId, {
        userId: appointment.staffId,
        action: "error",
        resource: "notification",
        details: `Failed to send appointment confirmation: ${error.message}`,
        ipAddress: "0.0.0.0",
        userAgent: "NotificationService",
      })
    }
  },

  async sendAppointmentReminder(appointment: any): Promise<void> {
    try {
      // Get patient and clinic details
      // This would be replaced with actual database queries
      const patientId = appointment.patientId
      const clinicId = appointment.clinicId

      // Get patient phone and email
      // This would be replaced with actual database queries
      const patientPhone = "+15551234567" // Example
      const patientEmail = "patient@example.com" // Example
      const patientName = "John Doe" // Example

      // Get clinic and staff details
      // This would be replaced with actual database queries
      const clinicName = "Example Clinic" // Example
      const staffName = "Dr. Smith" // Example

      // Format appointment date and time
      const appointmentDate = new Date(appointment.startTime).toLocaleDateString()
      const appointmentTime = new Date(appointment.startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })

      // Send SMS reminder
      const smsMessage = `Reminder: You have an appointment with ${staffName} at ${clinicName} tomorrow at ${appointmentTime}. Reply C to confirm or R to reschedule.`

      await this.sendSMS(patientPhone, smsMessage, appointment.staffId, clinicId, {
        fallbackToEmail: true,
        fallbackEmail: patientEmail,
      })

      // Send email reminder as well
      await emailService.sendAppointmentReminder(
        appointment,
        patientEmail,
        patientName,
        clinicName,
        staffName,
        appointment.staffId,
        clinicId,
      )

      // Update appointment to mark reminder as sent
      // This would be replaced with actual database update
      // await updateAppointmentReminderStatus(appointment.id, true)
    } catch (error) {
      console.error("Error sending appointment reminder:", error)
      // Log the error but don't throw
      await auditService.logAction(appointment.clinicId, {
        userId: appointment.staffId,
        action: "error",
        resource: "notification",
        details: `Failed to send appointment reminder: ${error.message}`,
        ipAddress: "0.0.0.0",
        userAgent: "NotificationService",
      })
    }
  },

  async sendAppointmentCancellation(appointment: any): Promise<void> {
    try {
      // Implementation similar to confirmation and reminder
      // ...
    } catch (error) {
      console.error("Error sending appointment cancellation:", error)
      // Log the error
    }
  },

  async sendAppointmentRescheduled(appointment: any): Promise<void> {
    try {
      // Implementation similar to confirmation and reminder
      // ...
    } catch (error) {
      console.error("Error sending appointment rescheduled notification:", error)
      // Log the error
    }
  },

  // Add these methods to the notificationService object
  async getPatientReminderPreferences(clinicId: string, patientId: string): Promise<ReminderPreference> {
    try {
      const prefRef = doc(db, `clinics/${clinicId}/patients/${patientId}/preferences/reminders`)
      const prefDoc = await getDoc(prefRef)

      if (prefDoc.exists()) {
        return prefDoc.data() as ReminderPreference
      }

      // Return default preferences if none exist
      return {
        enabled: true,
        channels: {
          sms: true,
          email: true,
          push: false,
        },
        timing: {
          days: [1], // 1 day before
          hours: [24], // 24 hours before
        },
      }
    } catch (error) {
      console.error("Error getting patient reminder preferences:", error)
      throw error
    }
  },

  async updatePatientReminderPreferences(
    clinicId: string,
    patientId: string,
    preferences: ReminderPreference,
  ): Promise<void> {
    try {
      const prefRef = doc(db, `clinics/${clinicId}/patients/${patientId}/preferences/reminders`)
      await setDoc(prefRef, preferences, { merge: true })

      // Log the update
      await auditService.logAction(clinicId, {
        userId: patientId,
        action: "update",
        resource: "reminderPreferences",
        details: "Updated reminder preferences",
        ipAddress: "0.0.0.0",
        userAgent: "NotificationService",
      })
    } catch (error) {
      console.error("Error updating patient reminder preferences:", error)
      throw error
    }
  },

  async getClinicReminderTemplates(clinicId: string, type?: "sms" | "email" | "push"): Promise<ReminderTemplate[]> {
    try {
      const templatesRef = collection(db, `clinics/${clinicId}/templates`)
      let templatesQuery = query(templatesRef)

      if (type) {
        templatesQuery = query(templatesRef, where("type", "==", type))
      }

      const snapshot = await getDocs(templatesQuery)

      const templates: ReminderTemplate[] = []
      snapshot.forEach((doc) => {
        templates.push(doc.data() as ReminderTemplate)
      })

      return templates
    } catch (error) {
      console.error("Error getting clinic reminder templates:", error)
      throw error
    }
  },

  async createReminderTemplate(
    clinicId: string,
    template: Omit<ReminderTemplate, "id" | "createdAt" | "updatedAt">,
  ): Promise<ReminderTemplate> {
    try {
      const id = uuidv4()
      const timestamp = Date.now()

      const newTemplate: ReminderTemplate = {
        ...template,
        id,
        createdAt: timestamp,
        updatedAt: timestamp,
      }

      const templateRef = doc(db, `clinics/${clinicId}/templates/${id}`)
      await setDoc(templateRef, newTemplate)

      return newTemplate
    } catch (error) {
      console.error("Error creating reminder template:", error)
      throw error
    }
  },

  async updateReminderTemplate(
    clinicId: string,
    templateId: string,
    updates: Partial<Omit<ReminderTemplate, "id" | "createdAt" | "updatedAt">>,
  ): Promise<void> {
    try {
      const templateRef = doc(db, `clinics/${clinicId}/templates/${templateId}`)
      await updateDoc(templateRef, {
        ...updates,
        updatedAt: Date.now(),
      })
    } catch (error) {
      console.error("Error updating reminder template:", error)
      throw error
    }
  },

  async logReminderSent(
    clinicId: string,
    appointmentId: string,
    patientId: string,
    type: "sms" | "email" | "push",
    content: string,
  ): Promise<ReminderLog> {
    try {
      const id = uuidv4()
      const timestamp = Date.now()

      const reminderLog: ReminderLog = {
        id,
        appointmentId,
        patientId,
        clinicId,
        type,
        status: "sent",
        content,
        sentAt: timestamp,
      }

      const logRef = doc(db, `clinics/${clinicId}/reminderLogs/${id}`)
      await setDoc(logRef, reminderLog)

      return reminderLog
    } catch (error) {
      console.error("Error logging reminder:", error)
      throw error
    }
  },

  async updateReminderStatus(
    clinicId: string,
    reminderLogId: string,
    status: "delivered" | "failed" | "responded",
    response?: "confirm" | "cancel" | "reschedule" | "none",
  ): Promise<void> {
    try {
      const logRef = doc(db, `clinics/${clinicId}/reminderLogs/${reminderLogId}`)
      const updates: any = {
        status,
      }

      if (status === "delivered") {
        updates.deliveredAt = Date.now()
      } else if (status === "responded") {
        updates.respondedAt = Date.now()
        updates.response = response || "none"
      }

      await updateDoc(logRef, updates)
    } catch (error) {
      console.error("Error updating reminder status:", error)
      throw error
    }
  },

  async getReminderLogs(
    clinicId: string,
    filters?: {
      patientId?: string
      appointmentId?: string
      status?: "sent" | "delivered" | "failed" | "responded"
      startDate?: Date
      endDate?: Date
    },
  ): Promise<ReminderLog[]> {
    try {
      const logsRef = collection(db, `clinics/${clinicId}/reminderLogs`)
      let logsQuery = query(logsRef)

      // Apply filters if provided
      if (filters) {
        if (filters.patientId) {
          logsQuery = query(logsQuery, where("patientId", "==", filters.patientId))
        }
        if (filters.appointmentId) {
          logsQuery = query(logsQuery, where("appointmentId", "==", filters.appointmentId))
        }
        if (filters.status) {
          logsQuery = query(logsQuery, where("status", "==", filters.status))
        }
        // Date filters would require composite indexes in Firestore
      }

      const snapshot = await getDocs(logsQuery)

      const logs: ReminderLog[] = []
      snapshot.forEach((doc) => {
        const log = doc.data() as ReminderLog

        // Apply date filters client-side if provided
        if (filters?.startDate && log.sentAt < filters.startDate.getTime()) {
          return
        }
        if (filters?.endDate && log.sentAt > filters.endDate.getTime()) {
          return
        }

        logs.push(log)
      })

      return logs.sort((a, b) => b.sentAt - a.sentAt)
    } catch (error) {
      console.error("Error getting reminder logs:", error)
      throw error
    }
  },

  async renderTemplate(template: string, data: Record<string, any>): Promise<string> {
    // Simple template rendering function
    let rendered = template

    for (const [key, value] of Object.entries(data)) {
      const regex = new RegExp(`{{${key}}}`, "g")
      rendered = rendered.replace(regex, value)
    }

    return rendered
  },

  async scheduleAppointmentReminders(appointment: any): Promise<void> {
    try {
      const { clinicId, patientId, staffId, appointmentTypeId, startTime } = appointment

      // Get patient details
      const patientRef = doc(db, `clinics/${clinicId}/patients/${patientId}`)
      const patientDoc = await getDoc(patientRef)

      if (!patientDoc.exists()) {
        console.error("Patient not found for scheduling reminders")
        return
      }

      const patient = patientDoc.data()

      // Get patient reminder preferences
      const preferences = await this.getPatientReminderPreferences(clinicId, patientId)

      if (!preferences.enabled) {
        console.log("Reminders disabled for patient:", patientId)
        return
      }

      // Get appointment type details
      const appointmentTypeRef = doc(db, `clinics/${clinicId}/appointmentTypes/${appointmentTypeId}`)
      const appointmentTypeDoc = await getDoc(appointmentTypeRef)

      if (!appointmentTypeDoc.exists()) {
        console.error("Appointment type not found for scheduling reminders")
        return
      }

      const appointmentType = appointmentTypeDoc.data()

      // Get staff details
      const staffRef = doc(db, `clinics/${clinicId}/staff/${staffId}`)
      const staffDoc = await getDoc(staffRef)

      if (!staffDoc.exists()) {
        console.error("Staff not found for scheduling reminders")
        return
      }

      const staff = staffDoc.data()

      // Get clinic details
      const clinicRef = doc(db, `clinics/${clinicId}`)
      const clinicDoc = await getDoc(clinicRef)

      if (!clinicDoc.exists()) {
        console.error("Clinic not found for scheduling reminders")
        return
      }

      const clinic = clinicDoc.data()

      // Schedule reminders based on preferences
      const appointmentDate = typeof startTime === "string" ? parseISO(startTime) : new Date(startTime)

      // Schedule day-based reminders
      for (const days of preferences.timing.days) {
        const reminderDate = addDays(appointmentDate, -days)

        // Skip if reminder date is in the past
        if (isBefore(reminderDate, new Date())) {
          continue
        }

        // Schedule the reminder
        // In a production environment, you would use a task queue or scheduler
        // For this implementation, we'll just log the scheduled reminder
        console.log(`Scheduled reminder for ${days} days before appointment:`, {
          appointmentId: appointment.id,
          patientId,
          reminderDate,
        })

        // Create a document in the reminders collection to be processed by a scheduled function
        const reminderId = uuidv4()
        const reminderRef = doc(db, `clinics/${clinicId}/scheduledReminders/${reminderId}`)

        await setDoc(reminderRef, {
          id: reminderId,
          appointmentId: appointment.id,
          patientId,
          clinicId,
          scheduledFor: reminderDate.getTime(),
          channels: preferences.channels,
          created: Date.now(),
          processed: false,
        })
      }

      // Schedule hour-based reminders
      for (const hours of preferences.timing.hours) {
        const reminderDate = addHours(appointmentDate, -hours)

        // Skip if reminder date is in the past
        if (isBefore(reminderDate, new Date())) {
          continue
        }

        // Schedule the reminder
        console.log(`Scheduled reminder for ${hours} hours before appointment:`, {
          appointmentId: appointment.id,
          patientId,
          reminderDate,
        })

        // Create a document in the reminders collection
        const reminderId = uuidv4()
        const reminderRef = doc(db, `clinics/${clinicId}/scheduledReminders/${reminderId}`)

        await setDoc(reminderRef, {
          id: reminderId,
          appointmentId: appointment.id,
          patientId,
          clinicId,
          scheduledFor: reminderDate.getTime(),
          channels: preferences.channels,
          created: Date.now(),
          processed: false,
        })
      }
    } catch (error) {
      console.error("Error scheduling appointment reminders:", error)
      // Log the error but don't throw - we don't want to fail the appointment creation
      await auditService.logAction(appointment.clinicId, {
        userId: appointment.staffId || "system",
        action: "error",
        resource: "reminderScheduling",
        details: `Failed to schedule reminders: ${error.message}`,
        ipAddress: "0.0.0.0",
        userAgent: "NotificationService",
      })
    }
  },

  async processScheduledReminders(): Promise<void> {
    try {
      const now = Date.now()

      // Query for reminders that are due to be sent
      const remindersQuery = query(
        collection(db, "scheduledReminders"),
        where("processed", "==", false),
        where("scheduledFor", "<=", now),
      )

      const snapshot = await getDocs(remindersQuery)

      for (const reminderDoc of snapshot.docs) {
        const reminder = reminderDoc.data()

        // Get appointment details
        const appointmentRef = doc(db, `clinics/${reminder.clinicId}/appointments/${reminder.appointmentId}`)
        const appointmentDoc = await getDoc(appointmentRef)

        if (!appointmentDoc.exists()) {
          console.log("Appointment not found for reminder, marking as processed")
          await updateDoc(reminderDoc.ref, { processed: true })
          continue
        }

        const appointment = appointmentDoc.data()

        // Skip if appointment is cancelled
        if (appointment.status === "cancelled") {
          console.log("Appointment is cancelled, skipping reminder")
          await updateDoc(reminderDoc.ref, { processed: true })
          continue
        }

        // Send reminders based on channel preferences
        if (reminder.channels.sms) {
          await this.sendAppointmentReminder(appointment)
        }

        if (reminder.channels.email) {
          await emailService.sendAppointmentReminder(
            appointment,
            appointment.patientEmail,
            appointment.patientName,
            appointment.clinicName,
            appointment.staffName,
            appointment.staffId,
            reminder.clinicId,
          )
        }

        // Mark reminder as processed
        await updateDoc(reminderDoc.ref, { processed: true, processedAt: now })
      }
    } catch (error) {
      console.error("Error processing scheduled reminders:", error)
    }
  },

  async handleSmsResponse(
    from: string,
    body: string,
    clinicId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Normalize the message body
      const normalizedBody = body.trim().toLowerCase()

      // Find the patient by phone number
      const patientsRef = collection(db, `clinics/${clinicId}/patients`)
      const patientsQuery = query(patientsRef, where("phone", "==", from))
      const patientsSnapshot = await getDocs(patientsQuery)

      if (patientsSnapshot.empty) {
        return { success: false, message: "Patient not found for the given phone number" }
      }

      const patientDoc = patientsSnapshot.docs[0]
      const patient = patientDoc.data()

      // Find the patient's upcoming appointments
      const appointmentsRef = collection(db, `clinics/${clinicId}/appointments`)
      const appointmentsQuery = query(
        appointmentsRef,
        where("patientId", "==", patient.id),
        where("status", "in", ["scheduled", "confirmed"]),
      )
      const appointmentsSnapshot = await getDocs(appointmentsQuery)

      if (appointmentsSnapshot.empty) {
        return { success: false, message: "No upcoming appointments found for this patient" }
      }

      // Sort appointments by date (closest first)
      const appointments = appointmentsSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
          const dateA = typeof a.startTime === "string" ? parseISO(a.startTime) : new Date(a.startTime)
          const dateB = typeof b.startTime === "string" ? parseISO(b.startTime) : new Date(b.startTime)
          return dateA.getTime() - dateB.getTime()
        })

      // Get the next upcoming appointment
      const nextAppointment = appointments[0]

      // Process the response
      if (normalizedBody === "c" || normalizedBody === "confirm" || normalizedBody === "yes") {
        // Confirm the appointment
        const appointmentRef = doc(db, `clinics/${clinicId}/appointments/${nextAppointment.id}`)
        await updateDoc(appointmentRef, {
          status: "confirmed",
          updatedAt: Date.now(),
        })

        // Send confirmation message
        await this.sendSMS(
          from,
          `Your appointment on ${format(new Date(nextAppointment.startTime), "EEEE, MMMM d")} at ${format(new Date(nextAppointment.startTime), "h:mm a")} has been confirmed. Thank you!`,
          "system",
          clinicId,
        )

        return { success: true, message: "Appointment confirmed" }
      } else if (normalizedBody === "r" || normalizedBody === "reschedule") {
        // Mark appointment for rescheduling
        const appointmentRef = doc(db, `clinics/${clinicId}/appointments/${nextAppointment.id}`)
        await updateDoc(appointmentRef, {
          needsRescheduling: true,
          updatedAt: Date.now(),
        })

        // Send rescheduling message
        await this.sendSMS(
          from,
          `We've received your request to reschedule your appointment. Our staff will contact you shortly to find a new time.`,
          "system",
          clinicId,
        )

        return { success: true, message: "Appointment marked for rescheduling" }
      } else if (normalizedBody === "cancel" || normalizedBody === "x") {
        // Cancel the appointment
        const appointmentRef = doc(db, `clinics/${clinicId}/appointments/${nextAppointment.id}`)
        await updateDoc(appointmentRef, {
          status: "cancelled_by_patient",
          updatedAt: Date.now(),
        })

        // Send cancellation message
        await this.sendSMS(
          from,
          `Your appointment on ${format(new Date(nextAppointment.startTime), "EEEE, MMMM d")} at ${format(new Date(nextAppointment.startTime), "h:mm a")} has been cancelled.`,
          "system",
          clinicId,
        )

        return { success: true, message: "Appointment cancelled" }
      } else {
        // Unrecognized response
        await this.sendSMS(
          from,
          `Sorry, we didn't understand your response. Please reply with 'C' to confirm, 'R' to reschedule, or 'CANCEL' to cancel your appointment.`,
          "system",
          clinicId,
        )

        return { success: false, message: "Unrecognized response" }
      }
    } catch (error) {
      console.error("Error handling SMS response:", error)
      return { success: false, message: `Error: ${error.message}` }
    }
  },
}

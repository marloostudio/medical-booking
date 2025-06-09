import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { auditService } from "@/services/audit-service"

interface CalendarEvent {
  summary: string
  description?: string
  location?: string
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  attendees?: {
    email: string
    name?: string
  }[]
  reminders?: {
    useDefault: boolean
    overrides?: {
      method: "email" | "popup"
      minutes: number
    }[]
  }
}

export const googleCalendarService = {
  async createEvent(accessToken: string, calendarId: string, event: CalendarEvent, userId: string, clinicId: string) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to create calendar event: ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()

      // Log the action
      await auditService.logAction(clinicId, {
        userId,
        action: "create",
        resource: "google_calendar",
        details: `Created calendar event: ${event.summary}`,
        ipAddress: "0.0.0.0",
        userAgent: "GoogleCalendarService",
      })

      return data
    } catch (error) {
      console.error("Error creating Google Calendar event:", error)
      throw error
    }
  },

  async getUserCalendars(accessToken: string) {
    try {
      const response = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to fetch user calendars: ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      return data.items || []
    } catch (error) {
      console.error("Error fetching Google Calendars:", error)
      throw error
    }
  },

  async syncAppointmentToGoogleCalendar(
    appointment: any,
    patientName: string,
    staffName: string,
    clinicName: string,
    clinicAddress: string,
  ) {
    try {
      const session = await getServerSession(authOptions)

      if (!session?.accessToken) {
        throw new Error("No Google access token available")
      }

      // Format the appointment as a Google Calendar event
      const event: CalendarEvent = {
        summary: `${appointment.appointmentType.name} with ${patientName}`,
        description: `Appointment Notes: ${appointment.patientNotes || "None"}`,
        location: clinicAddress,
        start: {
          dateTime: new Date(appointment.startTime).toISOString(),
          timeZone: "America/Toronto", // Adjust based on clinic timezone
        },
        end: {
          dateTime: new Date(
            new Date(appointment.startTime).getTime() + appointment.appointmentType.duration * 60000,
          ).toISOString(),
          timeZone: "America/Toronto", // Adjust based on clinic timezone
        },
        attendees: [
          {
            email: appointment.patientEmail,
            name: patientName,
          },
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 24 * 60 }, // 1 day before
            { method: "popup", minutes: 30 }, // 30 minutes before
          ],
        },
      }

      // Use the primary calendar for simplicity
      const calendarId = "primary"

      return await this.createEvent(session.accessToken, calendarId, event, session.user.id, session.user.clinicId)
    } catch (error) {
      console.error("Error syncing appointment to Google Calendar:", error)
      throw error
    }
  },
}

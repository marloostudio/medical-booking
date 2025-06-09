import sgMail from "@sendgrid/mail"
import { auditService } from "./audit-service"

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "")

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  html: string
  text: string
}

export const emailService = {
  async sendEmail(
    to: string,
    subject: string,
    html: string,
    text: string,
    from = "noreply@thebookinglink.com",
    userId?: string,
    clinicId?: string,
  ): Promise<boolean> {
    try {
      const msg = {
        to,
        from,
        subject,
        text,
        html,
      }

      await sgMail.send(msg)

      // Log email sent
      if (userId && clinicId) {
        await auditService.logAction(clinicId, {
          userId,
          action: "create",
          resource: "email",
          details: `Email sent to ${to}: ${subject}`,
          ipAddress: "0.0.0.0",
          userAgent: "EmailService",
        })
      }

      return true
    } catch (error) {
      console.error("Error sending email:", error)
      return false
    }
  },

  async sendAppointmentConfirmation(
    appointment: any,
    patientEmail: string,
    patientName: string,
    clinicName: string,
    staffName: string,
    userId: string,
    clinicId: string,
  ): Promise<boolean> {
    const subject = `Appointment Confirmation - ${clinicName}`

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Appointment Confirmation</h2>
        <p>Hello ${patientName},</p>
        <p>Your appointment has been confirmed with the following details:</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Clinic:</strong> ${clinicName}</p>
          <p><strong>Provider:</strong> ${staffName}</p>
          <p><strong>Date:</strong> ${new Date(appointment.startTime).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${new Date(appointment.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
        </div>
        <p>If you need to reschedule or cancel your appointment, please contact us or visit our website.</p>
        <p>Thank you for choosing ${clinicName}.</p>
      </div>
    `

    const text = `
      Appointment Confirmation
      
      Hello ${patientName},
      
      Your appointment has been confirmed with the following details:
      
      Clinic: ${clinicName}
      Provider: ${staffName}
      Date: ${new Date(appointment.startTime).toLocaleDateString()}
      Time: ${new Date(appointment.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      
      If you need to reschedule or cancel your appointment, please contact us or visit our website.
      
      Thank you for choosing ${clinicName}.
    `

    return this.sendEmail(patientEmail, subject, html, text, "appointments@thebookinglink.com", userId, clinicId)
  },

  async sendAppointmentReminder(
    appointment: any,
    patientEmail: string,
    patientName: string,
    clinicName: string,
    staffName: string,
    userId: string,
    clinicId: string,
  ): Promise<boolean> {
    const subject = `Appointment Reminder - ${clinicName}`

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Appointment Reminder</h2>
        <p>Hello ${patientName},</p>
        <p>This is a reminder for your upcoming appointment:</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Clinic:</strong> ${clinicName}</p>
          <p><strong>Provider:</strong> ${staffName}</p>
          <p><strong>Date:</strong> ${new Date(appointment.startTime).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${new Date(appointment.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
        </div>
        <p>If you need to reschedule or cancel your appointment, please contact us at least 24 hours in advance.</p>
        <p>Thank you for choosing ${clinicName}.</p>
      </div>
    `

    const text = `
      Appointment Reminder
      
      Hello ${patientName},
      
      This is a reminder for your upcoming appointment:
      
      Clinic: ${clinicName}
      Provider: ${staffName}
      Date: ${new Date(appointment.startTime).toLocaleDateString()}
      Time: ${new Date(appointment.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      
      If you need to reschedule or cancel your appointment, please contact us at least 24 hours in advance.
      
      Thank you for choosing ${clinicName}.
    `

    return this.sendEmail(patientEmail, subject, html, text, "reminders@thebookinglink.com", userId, clinicId)
  },
}

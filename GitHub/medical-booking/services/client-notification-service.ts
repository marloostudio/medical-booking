"use client"

export const clientNotificationService = {
  async sendSMS(data: {
    to: string
    message: string
    clinicId?: string
  }) {
    const response = await fetch("/api/notifications/sms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to send SMS")
    }

    return response.json()
  },

  async sendEmail(data: {
    to: string
    subject: string
    html?: string
    text?: string
    from?: string
    clinicId?: string
  }) {
    const response = await fetch("/api/notifications/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to send email")
    }

    return response.json()
  },
}

"use client"

export interface Appointment {
  id: string
  patientId: string
  staffId: string
  appointmentTypeId: string
  startTime: string
  endTime: string
  status: string
  patientNotes?: string
  clinicId: string
  createdAt: string
  updatedAt: string
}

export const clientAppointmentService = {
  async getAppointments(
    params: {
      clinicId?: string
      staffId?: string
      patientId?: string
      startDate?: string
      endDate?: string
      status?: string
    } = {},
  ) {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        searchParams.append(key, value)
      }
    })

    const response = await fetch(`/api/appointments?${searchParams}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to fetch appointments")
    }

    return response.json()
  },

  async getAppointment(id: string, clinicId?: string) {
    const searchParams = new URLSearchParams()
    if (clinicId) {
      searchParams.append("clinicId", clinicId)
    }

    const response = await fetch(`/api/appointments/${id}?${searchParams}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to fetch appointment")
    }

    return response.json()
  },

  async createAppointment(appointmentData: Omit<Appointment, "id" | "createdAt" | "updatedAt">) {
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create appointment")
    }

    return response.json()
  },

  async updateAppointment(id: string, updateData: Partial<Appointment>) {
    const response = await fetch(`/api/appointments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to update appointment")
    }

    return response.json()
  },

  async deleteAppointment(id: string, clinicId?: string) {
    const searchParams = new URLSearchParams()
    if (clinicId) {
      searchParams.append("clinicId", clinicId)
    }

    const response = await fetch(`/api/appointments/${id}?${searchParams}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to delete appointment")
    }

    return response.json()
  },
}

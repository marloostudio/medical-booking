"use client"

export interface Patient {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  clinicId: string
  createdAt: string
  updatedAt: string
}

export const clientPatientService = {
  async getPatients(
    params: {
      clinicId?: string
      search?: string
      limit?: number
    } = {},
  ) {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        searchParams.append(key, value.toString())
      }
    })

    const response = await fetch(`/api/patients?${searchParams}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to fetch patients")
    }

    return response.json()
  },

  async getPatient(id: string, clinicId?: string) {
    const searchParams = new URLSearchParams()
    if (clinicId) {
      searchParams.append("clinicId", clinicId)
    }

    const response = await fetch(`/api/patients/${id}?${searchParams}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to fetch patient")
    }

    return response.json()
  },

  async createPatient(patientData: Omit<Patient, "id" | "createdAt" | "updatedAt">) {
    const response = await fetch("/api/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create patient")
    }

    return response.json()
  },

  async updatePatient(id: string, updateData: Partial<Patient>) {
    const response = await fetch(`/api/patients/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to update patient")
    }

    return response.json()
  },

  async deletePatient(id: string, clinicId?: string) {
    const searchParams = new URLSearchParams()
    if (clinicId) {
      searchParams.append("clinicId", clinicId)
    }

    const response = await fetch(`/api/patients/${id}?${searchParams}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to delete patient")
    }

    return response.json()
  },
}

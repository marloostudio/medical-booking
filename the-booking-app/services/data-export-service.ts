import { db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { encryptionService } from "@/lib/encryption"
import { auditService } from "./audit-service"

export interface ExportOptions {
  includePatients?: boolean
  includeAppointments?: boolean
  includeStaff?: boolean
  includeDocuments?: boolean
  startDate?: Date
  endDate?: Date
  patientIds?: string[]
  staffIds?: string[]
  format?: "json" | "csv"
  encryptOutput?: boolean
}

export const dataExportService = {
  async exportClinicData(clinicId: string, userId: string, options: ExportOptions = {}) {
    try {
      const exportData: any = {
        metadata: {
          exportDate: new Date().toISOString(),
          clinicId,
          exportedBy: userId,
          options,
        },
      }

      // Log the export action
      await auditService.logAction(clinicId, {
        userId,
        action: "export",
        resource: "clinic_data",
        details: `Data export initiated with options: ${JSON.stringify(options)}`,
        ipAddress: "0.0.0.0",
        userAgent: "DataExportService",
      })

      // Export patients if requested
      if (options.includePatients) {
        const patientsRef = collection(db, `clinics/${clinicId}/patients`)
        let patientsQuery = patientsRef

        // Filter by patient IDs if specified
        if (options.patientIds && options.patientIds.length > 0) {
          patientsQuery = query(patientsRef, where("id", "in", options.patientIds))
        }

        const patientsSnapshot = await getDocs(patientsQuery)
        const patients: any[] = []

        patientsSnapshot.forEach((doc) => {
          const patientData = doc.data()

          // Decrypt sensitive fields before export
          if (patientData.insuranceInfo) {
            patientData.insuranceInfo = {
              ...patientData.insuranceInfo,
              policyNumber: encryptionService.decrypt(patientData.insuranceInfo.policyNumber),
              groupNumber: patientData.insuranceInfo.groupNumber
                ? encryptionService.decrypt(patientData.insuranceInfo.groupNumber)
                : undefined,
            }
          }

          // Decrypt medical history if present
          if (patientData.medicalHistory) {
            patientData.medicalHistory = {
              ...patientData.medicalHistory,
              conditions: patientData.medicalHistory.conditions
                ? patientData.medicalHistory.conditions.map((c: string) => encryptionService.decrypt(c))
                : [],
              medications: patientData.medicalHistory.medications
                ? patientData.medicalHistory.medications.map((m: string) => encryptionService.decrypt(m))
                : [],
            }
          }

          patients.push(patientData)
        })

        exportData.patients = patients
      }

      // Export appointments if requested
      if (options.includeAppointments) {
        const appointmentsRef = collection(db, `clinics/${clinicId}/appointments`)
        const appointmentsSnapshot = await getDocs(appointmentsRef)
        const appointments: any[] = []

        appointmentsSnapshot.forEach((doc) => {
          const appointmentData = doc.data()

          // Filter by date range if specified
          if (options.startDate || options.endDate) {
            const appointmentDate = appointmentData.startTime.toDate()

            if (options.startDate && appointmentDate < options.startDate) {
              return
            }

            if (options.endDate && appointmentDate > options.endDate) {
              return
            }
          }

          // Filter by patient IDs if specified
          if (options.patientIds && options.patientIds.length > 0) {
            if (!options.patientIds.includes(appointmentData.patientId)) {
              return
            }
          }

          // Filter by staff IDs if specified
          if (options.staffIds && options.staffIds.length > 0) {
            if (!options.staffIds.includes(appointmentData.staffId)) {
              return
            }
          }

          appointments.push({
            ...appointmentData,
            startTime: appointmentData.startTime.toDate().toISOString(),
            endTime: appointmentData.endTime.toDate().toISOString(),
            createdAt: appointmentData.createdAt.toDate().toISOString(),
            updatedAt: appointmentData.updatedAt.toDate().toISOString(),
          })
        })

        exportData.appointments = appointments
      }

      // Export staff if requested
      if (options.includeStaff) {
        const staffRef = collection(db, `clinics/${clinicId}/staff`)
        let staffQuery = staffRef

        // Filter by staff IDs if specified
        if (options.staffIds && options.staffIds.length > 0) {
          staffQuery = query(staffRef, where("id", "in", options.staffIds))
        }

        const staffSnapshot = await getDocs(staffQuery)
        const staff: any[] = []

        staffSnapshot.forEach((doc) => {
          const staffData = doc.data()
          staff.push(staffData)
        })

        exportData.staff = staff
      }

      // Format the export data
      let formattedData: string

      if (options.format === "csv") {
        formattedData = this.convertToCSV(exportData)
      } else {
        // Default to JSON
        formattedData = JSON.stringify(exportData, null, 2)
      }

      // Encrypt the output if requested
      if (options.encryptOutput) {
        formattedData = encryptionService.encrypt(formattedData)
      }

      return {
        success: true,
        data: formattedData,
        format: options.format || "json",
        encrypted: options.encryptOutput || false,
      }
    } catch (error) {
      console.error("Error exporting clinic data:", error)
      return {
        success: false,
        error: `Failed to export data: ${error instanceof Error ? error.message : String(error)}`,
      }
    }
  },

  // Helper method to convert JSON to CSV
  convertToCSV(data: any): string {
    if (!data) return ""

    const csvData: { [key: string]: any }[] = []

    // Flatten the data structure
    if (data.patients) {
      data.patients.forEach((patient: any) => {
        csvData.push({
          type: "patient",
          id: patient.id,
          firstName: patient.firstName,
          lastName: patient.lastName,
          email: patient.email,
          phone: patient.phone,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender,
          // Add other fields as needed
        })
      })
    }

    if (data.appointments) {
      data.appointments.forEach((appointment: any) => {
        csvData.push({
          type: "appointment",
          id: appointment.id,
          patientId: appointment.patientId,
          staffId: appointment.staffId,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          status: appointment.status,
          // Add other fields as needed
        })
      })
    }

    if (data.staff) {
      data.staff.forEach((staffMember: any) => {
        csvData.push({
          type: "staff",
          id: staffMember.id,
          name: staffMember.name,
          role: staffMember.role,
          email: staffMember.email,
          // Add other fields as needed
        })
      })
    }

    if (csvData.length === 0) return ""

    // Get all possible headers
    const headers = Array.from(new Set(csvData.flatMap((item) => Object.keys(item))))

    // Create CSV header row
    let csv = headers.join(",") + "\n"

    // Add data rows
    csvData.forEach((item) => {
      const row = headers.map((header) => {
        const value = item[header] || ""
        // Escape commas and quotes
        return `"${String(value).replace(/"/g, '""')}"`
      })
      csv += row.join(",") + "\n"
    })

    return csv
  },
}

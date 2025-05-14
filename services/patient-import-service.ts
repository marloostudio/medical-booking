import { patientService, type Patient } from "@/services/patient-service"
import Papa from "papaparse"

export interface ImportResult {
  total: number
  successful: number
  failed: number
  errors: Array<{ row: number; message: string }>
}

export const patientImportService = {
  async validateCsvFile(file: File): Promise<{ valid: boolean; errors: string[] }> {
    return new Promise((resolve) => {
      const errors: string[] = []

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Check for required headers
          const requiredHeaders = ["firstName", "lastName", "email", "phone", "dateOfBirth", "gender"]
          const headers = results.meta.fields || []

          const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header))
          if (missingHeaders.length > 0) {
            errors.push(`Missing required headers: ${missingHeaders.join(", ")}`)
          }

          // Check for data validation
          results.data.forEach((row: any, index: number) => {
            // Check email format
            if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
              errors.push(`Row ${index + 2}: Invalid email format: ${row.email}`)
            }

            // Check date of birth format (YYYY-MM-DD)
            if (row.dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(row.dateOfBirth)) {
              errors.push(`Row ${index + 2}: Invalid date of birth format: ${row.dateOfBirth}. Use YYYY-MM-DD.`)
            }

            // Check for required fields
            requiredHeaders.forEach((header) => {
              if (!row[header]) {
                errors.push(`Row ${index + 2}: Missing required field: ${header}`)
              }
            })
          })

          resolve({
            valid: errors.length === 0,
            errors,
          })
        },
        error: (error) => {
          errors.push(`CSV parsing error: ${error.message}`)
          resolve({
            valid: false,
            errors,
          })
        },
      })
    })
  },

  async importPatients(clinicId: string, file: File, onProgress?: (progress: number) => void): Promise<ImportResult> {
    return new Promise((resolve) => {
      const result: ImportResult = {
        total: 0,
        successful: 0,
        failed: 0,
        errors: [],
      }

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          result.total = results.data.length

          // Process each row
          for (let i = 0; i < results.data.length; i++) {
            const row = results.data[i] as any

            try {
              // Convert row data to patient format
              const patientData: Omit<Patient, "id" | "clinicId" | "createdAt" | "updatedAt"> = {
                firstName: row.firstName,
                lastName: row.lastName,
                email: row.email,
                phone: row.phone,
                dateOfBirth: row.dateOfBirth,
                gender: row.gender,
                // Process address if provided
                address: row.street
                  ? {
                      street: row.street,
                      city: row.city || "",
                      state: row.state || "",
                      postalCode: row.postalCode || "",
                      country: row.country || "United States",
                    }
                  : undefined,
                // Process emergency contact if provided
                emergencyContact: row.emergencyContactName
                  ? {
                      name: row.emergencyContactName,
                      relationship: row.emergencyContactRelationship || "",
                      phone: row.emergencyContactPhone || "",
                    }
                  : undefined,
                // Process insurance info if provided
                insuranceInfo: row.insuranceProvider
                  ? {
                      provider: row.insuranceProvider,
                      policyNumber: row.insurancePolicyNumber || "",
                      groupNumber: row.insuranceGroupNumber,
                    }
                  : undefined,
                // Process medical history if provided
                medicalHistory: {
                  allergies: row.allergies ? row.allergies.split(",").map((a: string) => a.trim()) : [],
                  medications: row.medications ? row.medications.split(",").map((m: string) => m.trim()) : [],
                  conditions: row.conditions ? row.conditions.split(",").map((c: string) => c.trim()) : [],
                  surgeries: row.surgeries ? row.surgeries.split(",").map((s: string) => s.trim()) : [],
                  familyHistory: row.familyHistory ? row.familyHistory.split(",").map((f: string) => f.trim()) : [],
                },
                notes: row.notes,
              }

              // Create patient in database
              await patientService.createPatient(clinicId, patientData)
              result.successful++
            } catch (error) {
              console.error(`Error importing row ${i + 2}:`, error)
              result.failed++
              result.errors.push({
                row: i + 2,
                message: error instanceof Error ? error.message : "Unknown error",
              })
            }

            // Update progress
            if (onProgress) {
              onProgress(Math.round(((i + 1) / results.data.length) * 100))
            }
          }

          resolve(result)
        },
        error: (error) => {
          result.errors.push({
            row: 0,
            message: `CSV parsing error: ${error.message}`,
          })
          resolve(result)
        },
      })
    })
  },

  generateCsvTemplate(): string {
    const headers = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "dateOfBirth",
      "gender",
      "street",
      "city",
      "state",
      "postalCode",
      "country",
      "emergencyContactName",
      "emergencyContactRelationship",
      "emergencyContactPhone",
      "insuranceProvider",
      "insurancePolicyNumber",
      "insuranceGroupNumber",
      "allergies",
      "medications",
      "conditions",
      "surgeries",
      "familyHistory",
      "notes",
    ]

    const sampleData = [
      "John",
      "Doe",
      "john.doe@example.com",
      "555-123-4567",
      "1980-01-15",
      "male",
      "123 Main St",
      "Anytown",
      "CA",
      "12345",
      "United States",
      "Jane Doe",
      "Spouse",
      "555-987-6543",
      "Blue Cross",
      "BC123456789",
      "GRP987654",
      "Penicillin, Peanuts",
      "Lisinopril 10mg, Metformin 500mg",
      "Hypertension, Type 2 Diabetes",
      "Appendectomy 2010",
      "Father: Heart Disease, Mother: Breast Cancer",
      "Patient prefers morning appointments",
    ]

    // Create CSV content
    let csv = headers.join(",") + "\n"
    csv += sampleData.join(",")

    return csv
  },
}

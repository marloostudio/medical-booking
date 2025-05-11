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
  Timestamp,
} from "firebase/firestore"
import { v4 as uuidv4 } from "uuid"

export interface BookingRule {
  id: string
  clinicId: string
  name: string
  description?: string
  isActive: boolean
  ruleType: "time" | "patient" | "staff" | "appointmentType" | "custom"
  minAdvanceTime?: number // minutes
  maxAdvanceTime?: number // minutes
  appointmentTypeIds?: string[] // restrict to specific appointment types
  staffIds?: string[] // restrict to specific staff members
  newPatientsAllowed?: boolean
  maxAppointmentsPerDay?: number
  maxAppointmentsPerWeek?: number
  maxAppointmentsPerMonth?: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export const bookingRulesService = {
  async createRule(
    clinicId: string,
    data: Omit<BookingRule, "id" | "clinicId" | "createdAt" | "updatedAt">,
  ): Promise<BookingRule> {
    const id = uuidv4()
    const timestamp = Timestamp.now()

    // Determine rule type based on the data
    let ruleType: BookingRule["ruleType"] = "custom"
    if (data.minAdvanceTime || data.maxAdvanceTime) {
      ruleType = "time"
    } else if (data.newPatientsAllowed !== undefined) {
      ruleType = "patient"
    } else if (data.staffIds && data.staffIds.length > 0) {
      ruleType = "staff"
    } else if (data.appointmentTypeIds && data.appointmentTypeIds.length > 0) {
      ruleType = "appointmentType"
    }

    const rule: BookingRule = {
      id,
      clinicId,
      name: data.name,
      description: data.description,
      isActive: data.isActive !== false, // Default to true if not specified
      ruleType,
      minAdvanceTime: data.minAdvanceTime,
      maxAdvanceTime: data.maxAdvanceTime,
      appointmentTypeIds: data.appointmentTypeIds,
      staffIds: data.staffIds,
      newPatientsAllowed: data.newPatientsAllowed,
      maxAppointmentsPerDay: data.maxAppointmentsPerDay,
      maxAppointmentsPerWeek: data.maxAppointmentsPerWeek,
      maxAppointmentsPerMonth: data.maxAppointmentsPerMonth,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    const ruleRef = doc(db, `clinics/${clinicId}/bookingRules/${id}`)
    await setDoc(ruleRef, rule)

    return rule
  },

  async getRule(clinicId: string, ruleId: string): Promise<BookingRule | null> {
    const ruleRef = doc(db, `clinics/${clinicId}/bookingRules/${ruleId}`)
    const snapshot = await getDoc(ruleRef)

    if (!snapshot.exists()) {
      return null
    }

    return snapshot.data() as BookingRule
  },

  async getRules(clinicId: string): Promise<BookingRule[]> {
    const rulesRef = collection(db, `clinics/${clinicId}/bookingRules`)
    const snapshot = await getDocs(rulesRef)

    const rules: BookingRule[] = []
    snapshot.forEach((doc) => {
      rules.push(doc.data() as BookingRule)
    })

    return rules
  },

  async getActiveRules(clinicId: string): Promise<BookingRule[]> {
    const rulesRef = collection(db, `clinics/${clinicId}/bookingRules`)
    const rulesQuery = query(rulesRef, where("isActive", "==", true))
    const snapshot = await getDocs(rulesQuery)

    const rules: BookingRule[] = []
    snapshot.forEach((doc) => {
      rules.push(doc.data() as BookingRule)
    })

    return rules
  },

  async updateRule(
    clinicId: string,
    ruleId: string,
    data: Partial<Omit<BookingRule, "id" | "clinicId" | "createdAt" | "updatedAt">>,
  ): Promise<void> {
    const ruleRef = doc(db, `clinics/${clinicId}/bookingRules/${ruleId}`)
    const snapshot = await getDoc(ruleRef)

    if (!snapshot.exists()) {
      throw new Error("Booking rule not found")
    }

    // Determine rule type based on the data
    let ruleType: BookingRule["ruleType"] | undefined = undefined
    if (data.minAdvanceTime || data.maxAdvanceTime) {
      ruleType = "time"
    } else if (data.newPatientsAllowed !== undefined) {
      ruleType = "patient"
    } else if (data.staffIds && data.staffIds.length > 0) {
      ruleType = "staff"
    } else if (data.appointmentTypeIds && data.appointmentTypeIds.length > 0) {
      ruleType = "appointmentType"
    }

    await updateDoc(ruleRef, {
      ...data,
      ...(ruleType && { ruleType }),
      updatedAt: Timestamp.now(),
    })
  },

  async deleteRule(clinicId: string, ruleId: string): Promise<void> {
    const ruleRef = doc(db, `clinics/${clinicId}/bookingRules/${ruleId}`)
    await deleteDoc(ruleRef)
  },

  async validateBookingRules(
    clinicId: string,
    patientId: string,
    staffId: string,
    appointmentTypeId: string,
    startTime: Date,
  ): Promise<{ isValid: boolean; message?: string }> {
    try {
      // Get all active rules
      const rules = await this.getActiveRules(clinicId)

      // If no rules, booking is valid
      if (rules.length === 0) {
        return { isValid: true }
      }

      // Check each rule
      for (const rule of rules) {
        // Check staff restrictions
        if (rule.staffIds && rule.staffIds.length > 0 && !rule.staffIds.includes(staffId)) {
          continue // Rule doesn't apply to this staff member
        }

        // Check appointment type restrictions
        if (
          rule.appointmentTypeIds &&
          rule.appointmentTypeIds.length > 0 &&
          !rule.appointmentTypeIds.includes(appointmentTypeId)
        ) {
          continue // Rule doesn't apply to this appointment type
        }

        // Check time-based rules
        if (rule.minAdvanceTime) {
          const now = new Date()
          const minBookingTime = new Date(now.getTime() + rule.minAdvanceTime * 60000)

          if (startTime < minBookingTime) {
            return {
              isValid: false,
              message: `Appointments must be booked at least ${rule.minAdvanceTime} minutes in advance.`,
            }
          }
        }

        if (rule.maxAdvanceTime) {
          const now = new Date()
          const maxBookingTime = new Date(now.getTime() + rule.maxAdvanceTime * 60000)

          if (startTime > maxBookingTime) {
            return {
              isValid: false,
              message: `Appointments cannot be booked more than ${rule.maxAdvanceTime} minutes in advance.`,
            }
          }
        }

        // Check new patient restrictions
        if (rule.newPatientsAllowed === false) {
          // Check if this is a new patient
          const patientRef = doc(db, `clinics/${clinicId}/patients/${patientId}`)
          const patientSnap = await getDoc(patientRef)

          if (!patientSnap.exists()) {
            return {
              isValid: false,
              message: "New patients cannot book appointments online. Please contact the clinic directly.",
            }
          }
        }

        // Check appointment limits
        if (rule.maxAppointmentsPerDay || rule.maxAppointmentsPerWeek || rule.maxAppointmentsPerMonth) {
          const appointmentsRef = collection(db, `clinics/${clinicId}/appointments`)

          // Check daily limit
          if (rule.maxAppointmentsPerDay) {
            const startOfDay = new Date(startTime)
            startOfDay.setHours(0, 0, 0, 0)

            const endOfDay = new Date(startTime)
            endOfDay.setHours(23, 59, 59, 999)

            const dailyQuery = query(
              appointmentsRef,
              where("patientId", "==", patientId),
              where("startTime", ">=", Timestamp.fromDate(startOfDay)),
              where("startTime", "<=", Timestamp.fromDate(endOfDay)),
            )

            const dailySnapshot = await getDocs(dailyQuery)
            if (dailySnapshot.size >= rule.maxAppointmentsPerDay) {
              return {
                isValid: false,
                message: `You can only book ${rule.maxAppointmentsPerDay} appointment(s) per day.`,
              }
            }
          }

          // Check weekly limit
          if (rule.maxAppointmentsPerWeek) {
            const startOfWeek = new Date(startTime)
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()) // Start of week (Sunday)
            startOfWeek.setHours(0, 0, 0, 0)

            const endOfWeek = new Date(startOfWeek)
            endOfWeek.setDate(endOfWeek.getDate() + 6) // End of week (Saturday)
            endOfWeek.setHours(23, 59, 59, 999)

            const weeklyQuery = query(
              appointmentsRef,
              where("patientId", "==", patientId),
              where("startTime", ">=", Timestamp.fromDate(startOfWeek)),
              where("startTime", "<=", Timestamp.fromDate(endOfWeek)),
            )

            const weeklySnapshot = await getDocs(weeklyQuery)
            if (weeklySnapshot.size >= rule.maxAppointmentsPerWeek) {
              return {
                isValid: false,
                message: `You can only book ${rule.maxAppointmentsPerWeek} appointment(s) per week.`,
              }
            }
          }

          // Check monthly limit
          if (rule.maxAppointmentsPerMonth) {
            const startOfMonth = new Date(startTime.getFullYear(), startTime.getMonth(), 1)
            const endOfMonth = new Date(startTime.getFullYear(), startTime.getMonth() + 1, 0, 23, 59, 59, 999)

            const monthlyQuery = query(
              appointmentsRef,
              where("patientId", "==", patientId),
              where("startTime", ">=", Timestamp.fromDate(startOfMonth)),
              where("startTime", "<=", Timestamp.fromDate(endOfMonth)),
            )

            const monthlySnapshot = await getDocs(monthlyQuery)
            if (monthlySnapshot.size >= rule.maxAppointmentsPerMonth) {
              return {
                isValid: false,
                message: `You can only book ${rule.maxAppointmentsPerMonth} appointment(s) per month.`,
              }
            }
          }
        }
      }

      // All rules passed
      return { isValid: true }
    } catch (error) {
      console.error("Error validating booking rules:", error)
      return {
        isValid: false,
        message: "An error occurred while validating booking rules. Please try again.",
      }
    }
  },

  async validateBookingAgainstRules(
    clinicId: string,
    patientId: string,
    staffId: string,
    appointmentTypeId: string,
    startTime: Date,
  ): Promise<{ valid: boolean; message?: string }> {
    const result = await this.validateBookingRules(clinicId, patientId, staffId, appointmentTypeId, startTime)
    return { valid: result.isValid, message: result.message }
  },
}

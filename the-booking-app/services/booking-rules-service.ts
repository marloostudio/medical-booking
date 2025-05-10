import { db } from "@/lib/firebase"
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { v4 as uuidv4 } from "uuid"

export interface BookingRule {
  id: string
  name: string
  description?: string
  isActive: boolean

  // Time constraints
  minAdvanceTime?: number // minimum time in minutes before an appointment can be booked
  maxAdvanceTime?: number // maximum time in minutes before an appointment can be booked

  // Appointment type constraints
  appointmentTypeIds?: string[] // if specified, rule applies only to these appointment types

  // Staff constraints
  staffIds?: string[] // if specified, rule applies only to these staff members

  // Patient constraints
  newPatientsAllowed?: boolean // if false, only existing patients can book

  // Booking limits
  maxAppointmentsPerDay?: number // maximum appointments per day for a patient
  maxAppointmentsPerWeek?: number // maximum appointments per week for a patient
  maxAppointmentsPerMonth?: number // maximum appointments per month for a patient

  createdAt: number
  updatedAt: number
}

export const bookingRulesService = {
  async createRule(clinicId: string, data: Omit<BookingRule, "id" | "createdAt" | "updatedAt">): Promise<BookingRule> {
    const id = uuidv4()
    const timestamp = Date.now()

    const rule: BookingRule = {
      ...data,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    const ruleRef = doc(db, `clinics/${clinicId}/bookingRules/${id}`)
    await setDoc(ruleRef, rule)

    return rule
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
    const rules = await this.getRules(clinicId)
    return rules.filter((rule) => rule.isActive)
  },

  async getRule(clinicId: string, id: string): Promise<BookingRule | null> {
    const ruleRef = doc(db, `clinics/${clinicId}/bookingRules/${id}`)
    const snapshot = await getDoc(ruleRef)

    if (!snapshot.exists()) {
      return null
    }

    return snapshot.data() as BookingRule
  },

  async updateRule(
    clinicId: string,
    id: string,
    data: Partial<Omit<BookingRule, "id" | "createdAt" | "updatedAt">>,
  ): Promise<void> {
    const ruleRef = doc(db, `clinics/${clinicId}/bookingRules/${id}`)
    await updateDoc(ruleRef, {
      ...data,
      updatedAt: Date.now(),
    })
  },

  async deleteRule(clinicId: string, id: string): Promise<void> {
    const ruleRef = doc(db, `clinics/${clinicId}/bookingRules/${id}`)
    await deleteDoc(ruleRef)
  },

  // Rule validation methods
  async validateBookingAgainstRules(
    clinicId: string,
    patientId: string,
    staffId: string,
    appointmentTypeId: string,
    startTime: Date,
  ): Promise<{ valid: boolean; message?: string }> {
    const rules = await this.getActiveRules(clinicId)

    for (const rule of rules) {
      // Check if rule applies to this appointment type
      if (rule.appointmentTypeIds && rule.appointmentTypeIds.length > 0) {
        if (!rule.appointmentTypeIds.includes(appointmentTypeId)) {
          continue // Rule doesn't apply to this appointment type
        }
      }

      // Check if rule applies to this staff member
      if (rule.staffIds && rule.staffIds.length > 0) {
        if (!rule.staffIds.includes(staffId)) {
          continue // Rule doesn't apply to this staff member
        }
      }

      // Check advance booking time constraints
      const currentTime = new Date()
      const minutesUntilAppointment = (startTime.getTime() - currentTime.getTime()) / (1000 * 60)

      if (rule.minAdvanceTime !== undefined && minutesUntilAppointment < rule.minAdvanceTime) {
        return {
          valid: false,
          message: `Appointments must be booked at least ${rule.minAdvanceTime} minutes in advance.`,
        }
      }

      if (rule.maxAdvanceTime !== undefined && minutesUntilAppointment > rule.maxAdvanceTime) {
        return {
          valid: false,
          message: `Appointments cannot be booked more than ${rule.maxAdvanceTime} minutes in advance.`,
        }
      }

      // Check if new patients are allowed
      if (rule.newPatientsAllowed === false) {
        // Check if this is a new patient (would need to query patient database)
        // For now, we'll assume a simple check
        const isNewPatient = await this.isNewPatient(clinicId, patientId)
        if (isNewPatient) {
          return {
            valid: false,
            message: "New patients cannot book this appointment type online. Please call the clinic.",
          }
        }
      }

      // Check booking limits
      if (rule.maxAppointmentsPerDay !== undefined) {
        const appointmentsToday = await this.countPatientAppointmentsForDay(clinicId, patientId, startTime)
        if (appointmentsToday >= rule.maxAppointmentsPerDay) {
          return {
            valid: false,
            message: `You can only book ${rule.maxAppointmentsPerDay} appointment(s) per day.`,
          }
        }
      }

      if (rule.maxAppointmentsPerWeek !== undefined) {
        const appointmentsThisWeek = await this.countPatientAppointmentsForWeek(clinicId, patientId, startTime)
        if (appointmentsThisWeek >= rule.maxAppointmentsPerWeek) {
          return {
            valid: false,
            message: `You can only book ${rule.maxAppointmentsPerWeek} appointment(s) per week.`,
          }
        }
      }

      if (rule.maxAppointmentsPerMonth !== undefined) {
        const appointmentsThisMonth = await this.countPatientAppointmentsForMonth(clinicId, patientId, startTime)
        if (appointmentsThisMonth >= rule.maxAppointmentsPerMonth) {
          return {
            valid: false,
            message: `You can only book ${rule.maxAppointmentsPerMonth} appointment(s) per month.`,
          }
        }
      }
    }

    return { valid: true }
  },

  // Helper methods for rule validation
  async isNewPatient(clinicId: string, patientId: string): Promise<boolean> {
    // Check if patient exists in the clinic's patient database
    const patientRef = doc(db, `clinics/${clinicId}/patients/${patientId}`)
    const snapshot = await getDoc(patientRef)
    return !snapshot.exists()
  },

  async countPatientAppointmentsForDay(clinicId: string, patientId: string, date: Date): Promise<number> {
    // This would be implemented to count appointments for a specific day
    // For now, we'll return a placeholder value
    return 0
  },

  async countPatientAppointmentsForWeek(clinicId: string, patientId: string, date: Date): Promise<number> {
    // This would be implemented to count appointments for the week containing the date
    // For now, we'll return a placeholder value
    return 0
  },

  async countPatientAppointmentsForMonth(clinicId: string, patientId: string, date: Date): Promise<number> {
    // This would be implemented to count appointments for the month containing the date
    // For now, we'll return a placeholder value
    return 0
  },
}

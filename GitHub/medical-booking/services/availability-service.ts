import { db } from "@/lib/firebase-client"
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore"
import { v4 as uuidv4 } from "uuid"
import { addDays, format } from "@/lib/date-utils"

export interface TimeSlot {
  start: number // timestamp in milliseconds
  end: number // timestamp in milliseconds
}

export interface DailyAvailability {
  id: string
  staffId: string
  date: string // ISO date string YYYY-MM-DD
  timeSlots: TimeSlot[]
  createdAt: number
  updatedAt: number
}

export interface RecurringAvailability {
  id: string
  staffId: string
  dayOfWeek: number // 0-6, where 0 is Sunday
  timeSlots: TimeSlot[]
  isActive: boolean
  createdAt: number
  updatedAt: number
}

export const availabilityService = {
  // Daily availability methods
  async setDailyAvailability(
    clinicId: string,
    data: Omit<DailyAvailability, "id" | "createdAt" | "updatedAt">,
  ): Promise<DailyAvailability> {
    const id = `${data.staffId}_${data.date}`
    const timestamp = Date.now()

    const availability: DailyAvailability = {
      ...data,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    const availabilityRef = doc(db, `clinics/${clinicId}/availability/daily/${id}`)
    await setDoc(availabilityRef, availability)

    return availability
  },

  async getDailyAvailability(clinicId: string, staffId: string, date: string): Promise<DailyAvailability | null> {
    const id = `${staffId}_${date}`
    const availabilityRef = doc(db, `clinics/${clinicId}/availability/daily/${id}`)
    const snapshot = await getDoc(availabilityRef)

    if (!snapshot.exists()) {
      return null
    }

    return snapshot.data() as DailyAvailability
  },

  async getStaffAvailabilityForDateRange(
    clinicId: string,
    staffId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<DailyAvailability[]> {
    const availabilityRef = collection(db, `clinics/${clinicId}/availability/daily`)
    const availabilityQuery = query(
      availabilityRef,
      where("staffId", "==", staffId),
      where("date", ">=", format(startDate, "yyyy-MM-dd")),
      where("date", "<=", format(endDate, "yyyy-MM-dd")),
    )

    const snapshot = await getDocs(availabilityQuery)

    const availabilities: DailyAvailability[] = []
    snapshot.forEach((doc) => {
      availabilities.push(doc.data() as DailyAvailability)
    })

    return availabilities
  },

  async updateDailyAvailability(clinicId: string, id: string, timeSlots: TimeSlot[]): Promise<void> {
    const availabilityRef = doc(db, `clinics/${clinicId}/availability/daily/${id}`)
    await updateDoc(availabilityRef, {
      timeSlots,
      updatedAt: Date.now(),
    })
  },

  async deleteDailyAvailability(clinicId: string, id: string): Promise<void> {
    const availabilityRef = doc(db, `clinics/${clinicId}/availability/daily/${id}`)
    await deleteDoc(availabilityRef)
  },

  // Recurring availability methods
  async setRecurringAvailability(
    clinicId: string,
    data: Omit<RecurringAvailability, "id" | "createdAt" | "updatedAt">,
  ): Promise<RecurringAvailability> {
    const id = uuidv4()
    const timestamp = Date.now()

    const availability: RecurringAvailability = {
      ...data,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    const availabilityRef = doc(db, `clinics/${clinicId}/availability/recurring/${id}`)
    await setDoc(availabilityRef, availability)

    return availability
  },

  async getRecurringAvailability(clinicId: string, staffId: string): Promise<RecurringAvailability[]> {
    const availabilityRef = collection(db, `clinics/${clinicId}/availability/recurring`)
    const availabilityQuery = query(availabilityRef, where("staffId", "==", staffId), where("isActive", "==", true))

    const snapshot = await getDocs(availabilityQuery)

    const availabilities: RecurringAvailability[] = []
    snapshot.forEach((doc) => {
      availabilities.push(doc.data() as RecurringAvailability)
    })

    return availabilities
  },

  async updateRecurringAvailability(
    clinicId: string,
    id: string,
    data: Partial<Omit<RecurringAvailability, "id" | "staffId" | "createdAt" | "updatedAt">>,
  ): Promise<void> {
    const availabilityRef = doc(db, `clinics/${clinicId}/availability/recurring/${id}`)
    await updateDoc(availabilityRef, {
      ...data,
      updatedAt: Date.now(),
    })
  },

  async deleteRecurringAvailability(clinicId: string, id: string): Promise<void> {
    const availabilityRef = doc(db, `clinics/${clinicId}/availability/recurring/${id}`)
    await deleteDoc(availabilityRef)
  },

  // Helper methods
  async generateAvailabilityFromRecurring(
    clinicId: string,
    staffId: string,
    startDate: Date,
    daysToGenerate = 30,
  ): Promise<void> {
    // Get recurring availability patterns
    const recurringAvailability = await this.getRecurringAvailability(clinicId, staffId)

    if (recurringAvailability.length === 0) {
      return
    }

    // Generate daily availability for the specified range
    for (let i = 0; i < daysToGenerate; i++) {
      const currentDate = addDays(startDate, i)
      const dayOfWeek = currentDate.getDay() // 0-6, where 0 is Sunday

      // Find matching recurring pattern for this day of week
      const matchingPattern = recurringAvailability.find((pattern) => pattern.dayOfWeek === dayOfWeek)

      if (matchingPattern && matchingPattern.timeSlots.length > 0) {
        const dateString = format(currentDate, "yyyy-MM-dd")

        // Check if daily availability already exists
        const existingAvailability = await this.getDailyAvailability(clinicId, staffId, dateString)

        if (!existingAvailability) {
          // Create new daily availability based on the recurring pattern
          await this.setDailyAvailability(clinicId, {
            staffId,
            date: dateString,
            timeSlots: matchingPattern.timeSlots,
          })
        }
      }
    }
  },
}

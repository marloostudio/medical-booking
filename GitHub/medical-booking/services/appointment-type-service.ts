import { db } from "@/lib/firebase-client"
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore"
import { v4 as uuidv4 } from "uuid"

export interface AppointmentType {
  id: string
  name: string
  description: string
  duration: number // in minutes
  color: string
  price?: number
  isActive: boolean
  requiresApproval: boolean
  categoryId: string
  createdAt: number
  updatedAt: number
}

export interface AppointmentCategory {
  id: string
  name: string
  description?: string
  isActive: boolean
  order: number
  createdAt: number
  updatedAt: number
}

export const appointmentTypeService = {
  // Category methods
  async createCategory(
    clinicId: string,
    data: Omit<AppointmentCategory, "id" | "createdAt" | "updatedAt">,
  ): Promise<AppointmentCategory> {
    const id = uuidv4()
    const timestamp = Date.now()

    const category: AppointmentCategory = {
      ...data,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    const categoryRef = doc(db, `clinics/${clinicId}/appointmentCategories/${id}`)
    await setDoc(categoryRef, category)

    return category
  },

  async getCategories(clinicId: string): Promise<AppointmentCategory[]> {
    const categoriesRef = collection(db, `clinics/${clinicId}/appointmentCategories`)
    const snapshot = await getDocs(categoriesRef)

    const categories: AppointmentCategory[] = []
    snapshot.forEach((doc) => {
      categories.push(doc.data() as AppointmentCategory)
    })

    return categories.sort((a, b) => a.order - b.order)
  },

  async updateCategory(
    clinicId: string,
    id: string,
    data: Partial<Omit<AppointmentCategory, "id" | "createdAt" | "updatedAt">>,
  ): Promise<void> {
    const categoryRef = doc(db, `clinics/${clinicId}/appointmentCategories/${id}`)
    await updateDoc(categoryRef, {
      ...data,
      updatedAt: Date.now(),
    })
  },

  async deleteCategory(clinicId: string, id: string): Promise<void> {
    const categoryRef = doc(db, `clinics/${clinicId}/appointmentCategories/${id}`)
    await deleteDoc(categoryRef)
  },

  // Appointment Type methods
  async createAppointmentType(
    clinicId: string,
    data: Omit<AppointmentType, "id" | "createdAt" | "updatedAt">,
  ): Promise<AppointmentType> {
    const id = uuidv4()
    const timestamp = Date.now()

    const appointmentType: AppointmentType = {
      ...data,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    const typeRef = doc(db, `clinics/${clinicId}/appointmentTypes/${id}`)
    await setDoc(typeRef, appointmentType)

    return appointmentType
  },

  async getAppointmentTypes(clinicId: string, categoryId?: string): Promise<AppointmentType[]> {
    const typesRef = collection(db, `clinics/${clinicId}/appointmentTypes`)

    let typesQuery = typesRef
    if (categoryId) {
      typesQuery = query(typesRef, where("categoryId", "==", categoryId))
    }

    const snapshot = await getDocs(typesQuery)

    const types: AppointmentType[] = []
    snapshot.forEach((doc) => {
      types.push(doc.data() as AppointmentType)
    })

    return types
  },

  async getAppointmentType(clinicId: string, id: string): Promise<AppointmentType | null> {
    const typeRef = doc(db, `clinics/${clinicId}/appointmentTypes/${id}`)
    const snapshot = await getDoc(typeRef)

    if (!snapshot.exists()) {
      return null
    }

    return snapshot.data() as AppointmentType
  },

  async updateAppointmentType(
    clinicId: string,
    id: string,
    data: Partial<Omit<AppointmentType, "id" | "createdAt" | "updatedAt">>,
  ): Promise<void> {
    const typeRef = doc(db, `clinics/${clinicId}/appointmentTypes/${id}`)
    await updateDoc(typeRef, {
      ...data,
      updatedAt: Date.now(),
    })
  },

  async deleteAppointmentType(clinicId: string, id: string): Promise<void> {
    const typeRef = doc(db, `clinics/${clinicId}/appointmentTypes/${id}`)
    await deleteDoc(typeRef)
  },
}

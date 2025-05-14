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
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import { v4 as uuidv4 } from "uuid"

export interface StaffMember {
  id: string
  clinicId: string
  name: string
  role: "owner" | "admin" | "doctor" | "receptionist" | "nurse"
  email: string
  phoneNumber: string
  permissions: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export const staffService = {
  async createStaffMember(data: Omit<StaffMember, "id" | "createdAt" | "updatedAt">): Promise<StaffMember> {
    const id = uuidv4()
    const now = Timestamp.now()

    const staffMember: StaffMember = {
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    }

    // Create the staff document
    await setDoc(doc(db, "staff", id), staffMember)

    return staffMember
  },

  async getStaffMember(id: string): Promise<StaffMember | null> {
    const staffRef = doc(db, "staff", id)
    const staffSnap = await getDoc(staffRef)

    if (!staffSnap.exists()) {
      return null
    }

    return { id: staffSnap.id, ...staffSnap.data() } as StaffMember
  },

  async getStaffByEmail(email: string): Promise<StaffMember | null> {
    const staffRef = collection(db, "staff")
    const q = query(staffRef, where("email", "==", email), limit(1))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return null
    }

    const doc = querySnapshot.docs[0]
    return { id: doc.id, ...doc.data() } as StaffMember
  },

  async getClinicStaff(clinicId: string): Promise<StaffMember[]> {
    const staffRef = collection(db, "staff")
    const q = query(staffRef, where("clinicId", "==", clinicId), orderBy("name"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as StaffMember)
  },

  async updateStaffMember(
    id: string,
    data: Partial<Omit<StaffMember, "id" | "createdAt" | "updatedAt">>,
  ): Promise<void> {
    const staffRef = doc(db, "staff", id)

    await updateDoc(staffRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
  },

  async deleteStaffMember(id: string): Promise<void> {
    const staffRef = doc(db, "staff", id)
    await deleteDoc(staffRef)
  },
}

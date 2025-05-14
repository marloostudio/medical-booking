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
  limit,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import { v4 as uuidv4 } from "uuid"

export interface ClinicSubscription {
  plan: "free" | "basic" | "premium" | "enterprise"
  startDate: Timestamp
  endDate: Timestamp
  paymentMethod?: string
  trialPeriod: boolean
  autoRenew: boolean
  status: "active" | "inactive" | "trial" | "expired"
}

export interface ClinicBillingInfo {
  cardType?: string
  last4?: string
  billingAddress?: string
  billingName?: string
  billingEmail?: string
}

export interface Clinic {
  id: string
  name: string
  address: string
  phoneNumber: string
  email: string
  ownerId: string
  subscription: ClinicSubscription
  billingInfo?: ClinicBillingInfo
  createdAt: Timestamp
  updatedAt: Timestamp
}

export const clinicService = {
  async createClinic(ownerId: string, data: Partial<Omit<Clinic, "id" | "createdAt" | "updatedAt">>): Promise<Clinic> {
    const id = uuidv4()
    const now = Timestamp.now()

    // Set default values for required fields
    const clinic: Clinic = {
      id,
      name: data.name || "New Clinic",
      address: data.address || "",
      phoneNumber: data.phoneNumber || "",
      email: data.email || "",
      ownerId,
      subscription: data.subscription || {
        plan: "free",
        startDate: now,
        endDate: Timestamp.fromMillis(now.toMillis() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        trialPeriod: true,
        autoRenew: false,
        status: "trial",
      },
      billingInfo: data.billingInfo || {},
      createdAt: now,
      updatedAt: now,
    }

    // Create the clinic document
    await setDoc(doc(db, "clinics", id), clinic)

    return clinic
  },

  async getClinic(id: string): Promise<Clinic | null> {
    const clinicRef = doc(db, "clinics", id)
    const clinicSnap = await getDoc(clinicRef)

    if (!clinicSnap.exists()) {
      return null
    }

    return { id: clinicSnap.id, ...clinicSnap.data() } as Clinic
  },

  async getClinicByOwner(ownerId: string): Promise<Clinic | null> {
    const clinicsRef = collection(db, "clinics")
    const q = query(clinicsRef, where("ownerId", "==", ownerId), limit(1))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return null
    }

    const doc = querySnapshot.docs[0]
    return { id: doc.id, ...doc.data() } as Clinic
  },

  async updateClinic(id: string, data: Partial<Omit<Clinic, "id" | "createdAt" | "updatedAt">>): Promise<void> {
    const clinicRef = doc(db, "clinics", id)

    await updateDoc(clinicRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
  },

  async deleteClinic(id: string): Promise<void> {
    const clinicRef = doc(db, "clinics", id)
    await deleteDoc(clinicRef)
  },
}

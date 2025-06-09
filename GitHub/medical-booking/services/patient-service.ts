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

export interface Patient {
  id: string
  clinicId: string
  name: string
  dateOfBirth: string
  contactNumber: string
  email: string
  medicalHistory: string[]
  appointments: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export const patientService = {
  async createPatient(data: Omit<Patient, "id" | "createdAt" | "updatedAt">): Promise<Patient> {
    const id = uuidv4()
    const now = Timestamp.now()

    const patient: Patient = {
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    }

    // Create the patient document
    await setDoc(doc(db, "patients", id), patient)

    return patient
  },

  async getPatient(id: string): Promise<Patient | null> {
    const patientRef = doc(db, "patients", id)
    const patientSnap = await getDoc(patientRef)

    if (!patientSnap.exists()) {
      return null
    }

    return { id: patientSnap.id, ...patientSnap.data() } as Patient
  },

  async getPatientByEmail(email: string): Promise<Patient | null> {
    const patientsRef = collection(db, "patients")
    const q = query(patientsRef, where("email", "==", email), limit(1))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return null
    }

    const doc = querySnapshot.docs[0]
    return { id: doc.id, ...doc.data() } as Patient
  },

  async getClinicPatients(clinicId: string): Promise<Patient[]> {
    const patientsRef = collection(db, "patients")
    const q = query(patientsRef, where("clinicId", "==", clinicId), orderBy("name"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Patient)
  },

  async searchPatients(clinicId: string, searchTerm: string): Promise<Patient[]> {
    const patientsRef = collection(db, "patients")
    const searchLower = searchTerm.toLowerCase()

    // Search by name (starts with)
    const nameQuery = query(
      patientsRef,
      where("clinicId", "==", clinicId),
      where("name", ">=", searchLower),
      where("name", "<=", searchLower + "\uf8ff"),
      orderBy("name"),
      limit(20),
    )

    const nameSnapshot = await getDocs(nameQuery)

    // Search by email (starts with)
    const emailQuery = query(
      patientsRef,
      where("clinicId", "==", clinicId),
      where("email", ">=", searchLower),
      where("email", "<=", searchLower + "\uf8ff"),
      orderBy("email"),
      limit(20),
    )

    const emailSnapshot = await getDocs(emailQuery)

    // Combine results and remove duplicates
    const patientMap = new Map<string, Patient>()

    nameSnapshot.docs.forEach((doc) => {
      patientMap.set(doc.id, { id: doc.id, ...doc.data() } as Patient)
    })

    emailSnapshot.docs.forEach((doc) => {
      if (!patientMap.has(doc.id)) {
        patientMap.set(doc.id, { id: doc.id, ...doc.data() } as Patient)
      }
    })

    return Array.from(patientMap.values())
  },

  async updatePatient(id: string, data: Partial<Omit<Patient, "id" | "createdAt" | "updatedAt">>): Promise<void> {
    const patientRef = doc(db, "patients", id)

    await updateDoc(patientRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
  },

  async deletePatient(id: string): Promise<void> {
    const patientRef = doc(db, "patients", id)
    await deleteDoc(patientRef)
  },

  async addAppointmentToPatient(patientId: string, appointmentId: string): Promise<void> {
    const patientRef = doc(db, "patients", patientId)
    const patientSnap = await getDoc(patientRef)

    if (!patientSnap.exists()) {
      throw new Error("Patient not found")
    }

    const patient = patientSnap.data() as Patient
    const appointments = patient.appointments || []

    if (!appointments.includes(appointmentId)) {
      appointments.push(appointmentId)

      await updateDoc(patientRef, {
        appointments,
        updatedAt: serverTimestamp(),
      })
    }
  },

  async removeAppointmentFromPatient(patientId: string, appointmentId: string): Promise<void> {
    const patientRef = doc(db, "patients", patientId)
    const patientSnap = await getDoc(patientRef)

    if (!patientSnap.exists()) {
      throw new Error("Patient not found")
    }

    const patient = patientSnap.data() as Patient
    const appointments = patient.appointments || []

    const updatedAppointments = appointments.filter((id) => id !== appointmentId)

    await updateDoc(patientRef, {
      appointments: updatedAppointments,
      updatedAt: serverTimestamp(),
    })
  },
}

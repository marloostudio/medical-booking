import { db, storage } from "@/lib/firebase"
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
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { v4 as uuidv4 } from "uuid"
import { encrypt, decrypt } from "@/lib/encryption"

export interface PatientDocument {
  id: string
  patientId: string
  name: string
  type: string
  contentType: string
  size: number
  url: string
  uploadedBy: string
  createdAt: number
  updatedAt: number
}

export interface Patient {
  id: string
  clinicId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address?: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
  insuranceInfo?: {
    provider: string
    policyNumber: string
    groupNumber?: string
  }
  medicalHistory?: {
    allergies: string[]
    medications: string[]
    conditions: string[]
    surgeries: string[]
    familyHistory: string[]
  }
  notes?: string
  documents?: PatientDocument[]
  createdAt: number
  updatedAt: number
}

// Helper function to encrypt sensitive patient data
const encryptPatientData = (data: any) => {
  const encryptedData = { ...data }

  // Encrypt insurance info
  if (encryptedData.insuranceInfo) {
    encryptedData.insuranceInfo = {
      ...encryptedData.insuranceInfo,
      provider: encrypt(encryptedData.insuranceInfo.provider),
      policyNumber: encrypt(encryptedData.insuranceInfo.policyNumber),
      groupNumber: encryptedData.insuranceInfo.groupNumber
        ? encrypt(encryptedData.insuranceInfo.groupNumber)
        : undefined,
    }
  }

  // Encrypt address
  if (encryptedData.address) {
    encryptedData.address = {
      street: encrypt(encryptedData.address.street),
      city: encrypt(encryptedData.address.city),
      state: encrypt(encryptedData.address.state),
      postalCode: encrypt(encryptedData.address.postalCode),
      country: encrypt(encryptedData.address.country),
    }
  }

  // Encrypt emergency contact
  if (encryptedData.emergencyContact) {
    encryptedData.emergencyContact = {
      name: encrypt(encryptedData.emergencyContact.name),
      relationship: encrypt(encryptedData.emergencyContact.relationship),
      phone: encrypt(encryptedData.emergencyContact.phone),
    }
  }

  // Encrypt medical history
  if (encryptedData.medicalHistory) {
    encryptedData.medicalHistory = {
      allergies: encryptedData.medicalHistory.allergies
        ? encryptedData.medicalHistory.allergies.map((a: string) => encrypt(a))
        : [],
      medications: encryptedData.medicalHistory.medications
        ? encryptedData.medicalHistory.medications.map((m: string) => encrypt(m))
        : [],
      conditions: encryptedData.medicalHistory.conditions
        ? encryptedData.medicalHistory.conditions.map((c: string) => encrypt(c))
        : [],
      surgeries: encryptedData.medicalHistory.surgeries
        ? encryptedData.medicalHistory.surgeries.map((s: string) => encrypt(s))
        : [],
      familyHistory: encryptedData.medicalHistory.familyHistory
        ? encryptedData.medicalHistory.familyHistory.map((f: string) => encrypt(f))
        : [],
    }
  }

  // Encrypt notes
  if (encryptedData.notes) {
    encryptedData.notes = encrypt(encryptedData.notes)
  }

  return encryptedData
}

// Helper function to decrypt sensitive patient data
const decryptPatientData = (data: any) => {
  const decryptedData = { ...data }

  // Decrypt insurance info
  if (decryptedData.insuranceInfo) {
    decryptedData.insuranceInfo = {
      ...decryptedData.insuranceInfo,
      provider: decrypt(decryptedData.insuranceInfo.provider),
      policyNumber: decrypt(decryptedData.insuranceInfo.policyNumber),
      groupNumber: decryptedData.insuranceInfo.groupNumber
        ? decrypt(decryptedData.insuranceInfo.groupNumber)
        : undefined,
    }
  }

  // Decrypt address
  if (decryptedData.address) {
    decryptedData.address = {
      street: decrypt(decryptedData.address.street),
      city: decrypt(decryptedData.address.city),
      state: decrypt(decryptedData.address.state),
      postalCode: decrypt(decryptedData.address.postalCode),
      country: decrypt(decryptedData.address.country),
    }
  }

  // Decrypt emergency contact
  if (decryptedData.emergencyContact) {
    decryptedData.emergencyContact = {
      name: decrypt(decryptedData.emergencyContact.name),
      relationship: decrypt(decryptedData.emergencyContact.relationship),
      phone: decrypt(decryptedData.emergencyContact.phone),
    }
  }

  // Decrypt medical history
  if (decryptedData.medicalHistory) {
    decryptedData.medicalHistory = {
      allergies: decryptedData.medicalHistory.allergies
        ? decryptedData.medicalHistory.allergies.map((a: string) => decrypt(a))
        : [],
      medications: decryptedData.medicalHistory.medications
        ? decryptedData.medicalHistory.medications.map((m: string) => decrypt(m))
        : [],
      conditions: decryptedData.medicalHistory.conditions
        ? decryptedData.medicalHistory.conditions.map((c: string) => decrypt(c))
        : [],
      surgeries: decryptedData.medicalHistory.surgeries
        ? decryptedData.medicalHistory.surgeries.map((s: string) => decrypt(s))
        : [],
      familyHistory: decryptedData.medicalHistory.familyHistory
        ? decryptedData.medicalHistory.familyHistory.map((f: string) => decrypt(f))
        : [],
    }
  }

  // Decrypt notes
  if (decryptedData.notes) {
    decryptedData.notes = decrypt(decryptedData.notes)
  }

  return decryptedData
}

export const patientService = {
  async createPatient(
    clinicId: string,
    data: Omit<Patient, "id" | "clinicId" | "createdAt" | "updatedAt">,
  ): Promise<Patient> {
    const id = uuidv4()
    const timestamp = Date.now()

    // Encrypt sensitive fields
    const encryptedData = encryptPatientData(data)

    const patient: Patient = {
      ...encryptedData,
      id,
      clinicId,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    const patientRef = doc(db, `clinics/${clinicId}/patients/${id}`)
    await setDoc(patientRef, patient)

    // Return the decrypted patient data
    return {
      ...data,
      id,
      clinicId,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
  },

  async getPatient(clinicId: string, id: string): Promise<Patient | null> {
    const patientRef = doc(db, `clinics/${clinicId}/patients/${id}`)
    const snapshot = await getDoc(patientRef)

    if (!snapshot.exists()) {
      return null
    }

    const patient = snapshot.data() as Patient

    // Decrypt sensitive fields
    return decryptPatientData(patient)
  },

  async getPatients(clinicId: string): Promise<Patient[]> {
    const patientsRef = collection(db, `clinics/${clinicId}/patients`)
    const snapshot = await getDocs(patientsRef)

    const patients: Patient[] = []
    snapshot.forEach((doc) => {
      const patient = doc.data() as Patient
      // Only decrypt basic info for listing to improve performance
      patients.push({
        ...patient,
        // Only decrypt these fields for listing
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phone: patient.phone,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
      })
    })

    return patients.sort((a, b) => b.updatedAt - a.updatedAt)
  },

  async searchPatients(
    clinicId: string,
    searchTerm: string,
    options: { limit?: number; sortBy?: string; sortDirection?: "asc" | "desc" } = {},
  ): Promise<Patient[]> {
    // Create a searchable index in Firestore
    const patientsRef = collection(db, `clinics/${clinicId}/patients`)

    // Use a compound query for better performance
    // This assumes you've created a searchIndex field that combines firstName, lastName, email, phone
    // You would need to update your patient creation/update logic to maintain this field
    const searchLower = searchTerm.toLowerCase()

    // Query by firstName (starts with)
    const firstNameQuery = query(
      patientsRef,
      where("firstName", ">=", searchLower),
      where("firstName", "<=", searchLower + "\uf8ff"),
      orderBy("firstName"),
    )

    // Query by lastName (starts with)
    const lastNameQuery = query(
      patientsRef,
      where("lastName", ">=", searchLower),
      where("lastName", "<=", searchLower + "\uf8ff"),
      orderBy("lastName"),
    )

    // Query by email (starts with)
    const emailQuery = query(
      patientsRef,
      where("email", ">=", searchLower),
      where("email", "<=", searchLower + "\uf8ff"),
      orderBy("email"),
    )

    // Execute all queries
    const [firstNameSnapshot, lastNameSnapshot, emailSnapshot] = await Promise.all([
      getDocs(firstNameQuery),
      getDocs(lastNameQuery),
      getDocs(emailQuery),
    ])

    // Combine results and remove duplicates
    const patientMap = new Map<string, Patient>()

    const processSnapshot = (snapshot: any) => {
      snapshot.forEach((doc: any) => {
        const patient = doc.data() as Patient
        if (!patientMap.has(patient.id)) {
          patientMap.set(patient.id, patient)
        }
      })
    }

    processSnapshot(firstNameSnapshot)
    processSnapshot(lastNameSnapshot)
    processSnapshot(emailSnapshot)

    let patients = Array.from(patientMap.values())

    // Sort patients
    if (options.sortBy) {
      patients.sort((a: any, b: any) => {
        const aValue = a[options.sortBy!]
        const bValue = b[options.sortBy!]

        if (options.sortDirection === "desc") {
          return aValue > bValue ? -1 : 1
        }
        return aValue > bValue ? 1 : -1
      })
    }

    // Limit results
    if (options.limit) {
      patients = patients.slice(0, options.limit)
    }

    return patients
  },

  async updatePatient(
    clinicId: string,
    id: string,
    data: Partial<Omit<Patient, "id" | "clinicId" | "createdAt" | "updatedAt">>,
  ): Promise<void> {
    // Get current patient data
    const patientRef = doc(db, `clinics/${clinicId}/patients/${id}`)
    const snapshot = await getDoc(patientRef)

    if (!snapshot.exists()) {
      throw new Error("Patient not found")
    }

    const currentPatient = snapshot.data() as Patient

    // Only encrypt the fields that are being updated
    const encryptedData: any = {}

    // Process each field that's being updated
    Object.keys(data).forEach((key) => {
      const fieldKey = key as keyof typeof data

      if (fieldKey === "insuranceInfo" && data.insuranceInfo) {
        encryptedData.insuranceInfo = {
          provider: data.insuranceInfo.provider
            ? encrypt(data.insuranceInfo.provider)
            : currentPatient.insuranceInfo?.provider,
          policyNumber: data.insuranceInfo.policyNumber
            ? encrypt(data.insuranceInfo.policyNumber)
            : currentPatient.insuranceInfo?.policyNumber,
          groupNumber: data.insuranceInfo.groupNumber
            ? encrypt(data.insuranceInfo.groupNumber)
            : currentPatient.insuranceInfo?.groupNumber,
        }
      } else if (fieldKey === "address" && data.address) {
        encryptedData.address = {
          street: data.address.street ? encrypt(data.address.street) : currentPatient.address?.street,
          city: data.address.city ? encrypt(data.address.city) : currentPatient.address?.city,
          state: data.address.state ? encrypt(data.address.state) : currentPatient.address?.state,
          postalCode: data.address.postalCode ? encrypt(data.address.postalCode) : currentPatient.address?.postalCode,
          country: data.address.country ? encrypt(data.address.country) : currentPatient.address?.country,
        }
      } else if (fieldKey === "emergencyContact" && data.emergencyContact) {
        encryptedData.emergencyContact = {
          name: data.emergencyContact.name
            ? encrypt(data.emergencyContact.name)
            : currentPatient.emergencyContact?.name,
          relationship: data.emergencyContact.relationship
            ? encrypt(data.emergencyContact.relationship)
            : currentPatient.emergencyContact?.relationship,
          phone: data.emergencyContact.phone
            ? encrypt(data.emergencyContact.phone)
            : currentPatient.emergencyContact?.phone,
        }
      } else if (fieldKey === "medicalHistory" && data.medicalHistory) {
        encryptedData.medicalHistory = {
          allergies: data.medicalHistory.allergies
            ? data.medicalHistory.allergies.map((a) => encrypt(a))
            : currentPatient.medicalHistory?.allergies,
          medications: data.medicalHistory.medications
            ? data.medicalHistory.medications.map((m) => encrypt(m))
            : currentPatient.medicalHistory?.medications,
          conditions: data.medicalHistory.conditions
            ? data.medicalHistory.conditions.map((c) => encrypt(c))
            : currentPatient.medicalHistory?.conditions,
          surgeries: data.medicalHistory.surgeries
            ? data.medicalHistory.surgeries.map((s) => encrypt(s))
            : currentPatient.medicalHistory?.surgeries,
          familyHistory: data.medicalHistory.familyHistory
            ? data.medicalHistory.familyHistory.map((f) => encrypt(f))
            : currentPatient.medicalHistory?.familyHistory,
        }
      } else if (fieldKey === "notes" && data.notes) {
        encryptedData.notes = encrypt(data.notes)
      } else {
        // For non-sensitive fields, use the original value
        encryptedData[key] = data[fieldKey]
      }
    })

    await updateDoc(patientRef, {
      ...encryptedData,
      updatedAt: Date.now(),
    })
  },

  async deletePatient(clinicId: string, id: string): Promise<void> {
    // In a real implementation, we might want to archive patients instead of deleting them
    const patientRef = doc(db, `clinics/${clinicId}/patients/${id}`)
    await deleteDoc(patientRef)
  },

  // Document management
  async uploadPatientDocument(
    clinicId: string,
    patientId: string,
    file: File,
    documentName: string,
    documentType: string,
    uploadedBy: string,
  ): Promise<PatientDocument> {
    const id = uuidv4()
    const timestamp = Date.now()

    // Upload file to Firebase Storage
    const storageRef = ref(storage, `clinics/${clinicId}/patients/${patientId}/documents/${id}`)
    await uploadBytes(storageRef, file)

    // Get download URL
    const url = await getDownloadURL(storageRef)

    // Create document metadata
    const document: PatientDocument = {
      id,
      patientId,
      name: documentName,
      type: documentType,
      contentType: file.type,
      size: file.size,
      url,
      uploadedBy,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    // Save document metadata to Firestore
    const documentRef = doc(db, `clinics/${clinicId}/patients/${patientId}/documents/${id}`)
    await setDoc(documentRef, document)

    // Update patient record to include the document
    const patientRef = doc(db, `clinics/${clinicId}/patients/${patientId}`)
    const patientSnapshot = await getDoc(patientRef)

    if (patientSnapshot.exists()) {
      const patient = patientSnapshot.data() as Patient
      const documents = patient.documents || []

      await updateDoc(patientRef, {
        documents: [...documents, document],
        updatedAt: timestamp,
      })
    }

    return document
  },

  async getPatientDocuments(clinicId: string, patientId: string): Promise<PatientDocument[]> {
    const documentsRef = collection(db, `clinics/${clinicId}/patients/${patientId}/documents`)
    const snapshot = await getDocs(documentsRef)

    const documents: PatientDocument[] = []
    snapshot.forEach((doc) => {
      documents.push(doc.data() as PatientDocument)
    })

    return documents.sort((a, b) => b.createdAt - a.createdAt)
  },

  async deletePatientDocument(clinicId: string, patientId: string, documentId: string): Promise<void> {
    // Delete from Storage
    const storageRef = ref(storage, `clinics/${clinicId}/patients/${patientId}/documents/${documentId}`)
    await deleteObject(storageRef)

    // Delete metadata from Firestore
    const documentRef = doc(db, `clinics/${clinicId}/patients/${patientId}/documents/${documentId}`)
    await deleteDoc(documentRef)

    // Update patient record
    const patientRef = doc(db, `clinics/${clinicId}/patients/${patientId}`)
    const patientSnapshot = await getDoc(patientRef)

    if (patientSnapshot.exists()) {
      const patient = patientSnapshot.data() as Patient
      const documents = patient.documents || []

      await updateDoc(patientRef, {
        documents: documents.filter((doc) => doc.id !== documentId),
        updatedAt: Date.now(),
      })
    }
  },

  // Communication logs
  async addCommunicationLog(
    clinicId: string,
    patientId: string,
    data: {
      type: "email" | "sms" | "call" | "note"
      content: string
      sentBy: string
    },
  ): Promise<void> {
    const id = uuidv4()
    const timestamp = Date.now()

    // Encrypt the content
    const encryptedContent = encrypt(data.content)

    const logRef = doc(db, `clinics/${clinicId}/logs/${id}`)
    await setDoc(logRef, {
      id,
      clinicId,
      patientId,
      type: data.type,
      content: encryptedContent,
      sentBy: data.sentBy,
      createdAt: timestamp,
    })
  },

  async getPatientCommunicationLogs(clinicId: string, patientId: string): Promise<any[]> {
    const logsRef = collection(db, `clinics/${clinicId}/logs`)
    const logsQuery = query(logsRef, where("patientId", "==", patientId), orderBy("createdAt", "desc"))

    const snapshot = await getDocs(logsQuery)

    const logs: any[] = []
    snapshot.forEach((doc) => {
      const log = doc.data()
      // Decrypt the content
      logs.push({
        ...log,
        content: decrypt(log.content),
      })
    })

    return logs
  },
}

import { db } from "@/lib/firebase"
import { collection, doc, getDocs, setDoc, serverTimestamp, Timestamp, writeBatch } from "firebase/firestore"
import { v4 as uuidv4 } from "uuid"

/**
 * This script migrates data from the old database structure to the new one.
 * It should be run once to transfer existing data.
 */
export async function migrateDatabase() {
  try {
    console.log("Starting database migration...")

    // Get all existing clinics from the old structure
    const oldClinicsRef = collection(db, "clinics")
    const oldClinicsSnapshot = await getDocs(oldClinicsRef)

    console.log(`Found ${oldClinicsSnapshot.size} clinics to migrate`)

    for (const oldClinicDoc of oldClinicsSnapshot.docs) {
      const oldClinicId = oldClinicDoc.id
      const oldClinicData = oldClinicDoc.data()

      console.log(`Migrating clinic: ${oldClinicData.name} (${oldClinicId})`)

      // Create new clinic document
      const newClinicId = uuidv4()
      await setDoc(doc(db, "clinics", newClinicId), {
        id: newClinicId,
        name: oldClinicData.name || "Unnamed Clinic",
        address: oldClinicData.address?.street || "",
        phoneNumber: oldClinicData.phone || "",
        email: oldClinicData.email || "",
        ownerId: oldClinicData.owner || "",
        subscription: {
          plan: oldClinicData.subscription?.plan || "free",
          startDate: oldClinicData.subscription?.startDate || serverTimestamp(),
          endDate: oldClinicData.subscription?.endDate || Timestamp.fromMillis(Date.now() + 30 * 24 * 60 * 60 * 1000),
          paymentMethod: oldClinicData.subscription?.paymentMethod || "",
          trialPeriod: oldClinicData.subscription?.trialPeriod || true,
          autoRenew: oldClinicData.subscription?.autoRenew || false,
          status: oldClinicData.subscription?.status || "trial",
        },
        billingInfo: {
          cardType: "",
          last4: "",
          billingAddress: "",
        },
        createdAt: oldClinicData.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      console.log(`Created new clinic with ID: ${newClinicId}`)

      // Migrate staff members
      const oldStaffRef = collection(db, `clinics/${oldClinicId}/staff`)
      const oldStaffSnapshot = await getDocs(oldStaffRef)

      console.log(`Found ${oldStaffSnapshot.size} staff members to migrate`)

      const batch = writeBatch(db)

      for (const oldStaffDoc of oldStaffSnapshot.docs) {
        const oldStaffData = oldStaffDoc.data()
        const newStaffId = uuidv4()

        batch.set(doc(db, "staff", newStaffId), {
          id: newStaffId,
          clinicId: newClinicId,
          name: `${oldStaffData.firstName || ""} ${oldStaffData.lastName || ""}`.trim() || "Unknown Staff",
          role: oldStaffData.role || "staff",
          email: oldStaffData.email || "",
          phoneNumber: oldStaffData.phone || "",
          permissions: oldStaffData.permissions || [],
          createdAt: oldStaffData.createdAt || serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      }

      // Migrate patients
      const oldPatientsRef = collection(db, `clinics/${oldClinicId}/patients`)
      const oldPatientsSnapshot = await getDocs(oldPatientsRef)

      console.log(`Found ${oldPatientsSnapshot.size} patients to migrate`)

      for (const oldPatientDoc of oldPatientsSnapshot.docs) {
        const oldPatientData = oldPatientDoc.data()
        const newPatientId = uuidv4()

        batch.set(doc(db, "patients", newPatientId), {
          id: newPatientId,
          clinicId: newClinicId,
          name: `${oldPatientData.firstName || ""} ${oldPatientData.lastName || ""}`.trim() || "Unknown Patient",
          dateOfBirth: oldPatientData.dateOfBirth || "",
          contactNumber: oldPatientData.phone || "",
          email: oldPatientData.email || "",
          medicalHistory: [],
          appointments: [],
          createdAt: oldPatientData.createdAt || serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      }

      // Commit the batch
      await batch.commit()

      console.log(`Migration completed for clinic: ${oldClinicData.name}`)
    }

    console.log("Database migration completed successfully")
    return { success: true }
  } catch (error) {
    console.error("Error during database migration:", error)
    return { success: false, error }
  }
}

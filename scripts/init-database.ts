import { db } from "../lib/firebase-config"
import { doc, writeBatch } from "firebase/firestore"
import { COLLECTIONS } from "../lib/database-schema"

/**
 * Initialize the database with sample data
 * This script should be run once to set up the initial database structure
 */
export async function initializeDatabase() {
  try {
    const batch = writeBatch(db)

    // Create a sample clinic
    const clinicId = "sample-clinic-1"
    const clinicRef = doc(db, COLLECTIONS.CLINICS, clinicId)

    batch.set(clinicRef, {
      name: "BookingLink Medical Center",
      address: {
        street: "123 Healthcare Ave",
        city: "Toronto",
        state: "ON",
        postalCode: "M5V 2H1",
        country: "Canada",
      },
      phone: "+1 (416) 555-1234",
      email: "info@bookinglink-medical.com",
      logoURL: "/logo.png",
      website: "https://bookinglink-medical.com",
      subscription: {
        plan: "premium",
        startDate: Date.now(),
        endDate: Date.now() + 31536000000, // 1 year from now
        paymentMethod: "credit_card",
        trialPeriod: false,
        autoRenew: true,
        status: "active",
      },
      verificationStatus: "verified",
      businessHours: {
        monday: { open: "09:00", close: "17:00", closed: false },
        tuesday: { open: "09:00", close: "17:00", closed: false },
        wednesday: { open: "09:00", close: "17:00", closed: false },
        thursday: { open: "09:00", close: "17:00", closed: false },
        friday: { open: "09:00", close: "17:00", closed: false },
        saturday: { open: "10:00", close: "14:00", closed: false },
        sunday: { open: "00:00", close: "00:00", closed: true },
      },
      specialties: ["Family Medicine", "Pediatrics", "Internal Medicine"],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    // Create a clinic owner user
    const ownerId = "owner-1"
    const ownerRef = doc(db, COLLECTIONS.USERS, ownerId)

    batch.set(ownerRef, {
      email: "owner@bookinglink-medical.com",
      phone: "+1 (416) 555-5678",
      name: {
        first: "John",
        last: "Smith",
      },
      role: "clinic_owner",
      profilePictureURL: "/profile-owner.jpg",
      verificationStatus: "verified",
      clinicId: clinicId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    // Create a staff member
    const staffId = "staff-1"
    const staffRef = doc(db, COLLECTIONS.STAFF(clinicId), staffId)

    batch.set(staffRef, {
      clinicId: clinicId,
      name: {
        first: "Jane",
        last: "Doe",
      },
      role: "doctor",
      email: "jane.doe@bookinglink-medical.com",
      phone: "+1 (416) 555-9012",
      permissions: ["view_patients", "edit_patients", "view_appointments", "edit_appointments"],
      verificationStatus: "verified",
      profilePictureURL: "/profile-doctor.jpg",
      specialties: ["Pediatrics"],
      bio: "Dr. Jane Doe is a pediatrician with over 10 years of experience.",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    // Create a patient
    const patientId = "patient-1"
    const patientRef = doc(db, COLLECTIONS.PATIENTS(clinicId), patientId)

    batch.set(patientRef, {
      clinicId: clinicId,
      name: {
        first: "Michael",
        last: "Johnson",
      },
      dateOfBirth: "1985-06-15",
      gender: "male",
      phone: "+1 (416) 555-3456",
      email: "michael.johnson@example.com",
      address: {
        street: "456 Patient St",
        city: "Toronto",
        state: "ON",
        postalCode: "M6G 3A8",
        country: "Canada",
      },
      emergencyContact: {
        name: "Sarah Johnson",
        relationship: "Spouse",
        phone: "+1 (416) 555-7890",
      },
      insuranceInfo: {
        provider: "Canada Health Insurance",
        policyNumber: "CHI123456789",
        groupNumber: "G9876543",
      },
      medicalHistory: {
        allergies: ["Penicillin"],
        medications: ["Lisinopril 10mg"],
        conditions: ["Hypertension"],
        surgeries: ["Appendectomy (2010)"],
        familyHistory: ["Diabetes (Father)", "Heart Disease (Grandfather)"],
      },
      verificationStatus: "verified",
      notes: "Patient prefers afternoon appointments.",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    // Create an appointment
    const appointmentId = "appointment-1"
    const appointmentRef = doc(db, COLLECTIONS.APPOINTMENTS(clinicId), appointmentId)

    batch.set(appointmentRef, {
      clinicId: clinicId,
      patientId: patientId,
      staffId: staffId,
      appointmentTypeId: "checkup-1",
      appointmentType: {
        name: "Regular Checkup",
        duration: 30, // 30 minutes
        color: "#4f46e5",
        price: 100,
      },
      startTime: Date.now() + 86400000, // Tomorrow
      endTime: Date.now() + 86400000 + 1800000, // Tomorrow + 30 minutes
      status: "confirmed",
      paymentStatus: "pending",
      patientNotes: "Annual physical examination",
      staffNotes: "",
      followUpRequired: false,
      reminderSent: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    // Create a billing record
    const billingId = "billing-1"
    const billingRef = doc(db, COLLECTIONS.BILLING(clinicId), billingId)

    batch.set(billingRef, {
      clinicId: clinicId,
      patientId: patientId,
      appointmentId: appointmentId,
      amount: 100,
      currency: "CAD",
      description: "Regular Checkup",
      status: "pending",
      paymentMethod: "insurance",
      dueDate: Date.now() + 1209600000, // 2 weeks from now
      invoiceNumber: "INV-2023-001",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    // Create a notification
    const notificationId = "notification-1"
    const notificationRef = doc(db, COLLECTIONS.NOTIFICATIONS(clinicId), notificationId)

    batch.set(notificationRef, {
      clinicId: clinicId,
      userId: patientId,
      title: "Appointment Reminder",
      message: "You have an appointment tomorrow at 10:00 AM with Dr. Jane Doe.",
      type: "appointment_reminder",
      status: "sent",
      sentAt: Date.now(),
    })

    // Commit the batch
    await batch.commit()

    console.log("Database initialized successfully")
    return { success: true }
  } catch (error) {
    console.error("Error initializing database:", error)
    return { success: false, error }
  }
}

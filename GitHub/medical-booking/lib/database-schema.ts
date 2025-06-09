/**
 * BookingLink Firestore Database Schema
 *
 * This file documents the structure of our Firestore database.
 * It's not used in the application but serves as documentation.
 */

export interface Clinic {
  id: string
  name: string
  address: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  phone: string
  email: string
  logoURL?: string
  website?: string
  subscription: {
    plan: "free" | "basic" | "premium" | "enterprise"
    startDate: number // timestamp
    endDate: number // timestamp
    paymentMethod?: string
    trialPeriod: boolean
    autoRenew: boolean
    status: "active" | "inactive" | "trial" | "expired"
  }
  verificationStatus: "pending" | "verified" | "rejected"
  businessHours: {
    monday: { open: string; close: string; closed: boolean }
    tuesday: { open: string; close: string; closed: boolean }
    wednesday: { open: string; close: string; closed: boolean }
    thursday: { open: string; close: string; closed: boolean }
    friday: { open: string; close: string; closed: boolean }
    saturday: { open: string; close: string; closed: boolean }
    sunday: { open: string; close: string; closed: boolean }
  }
  specialties?: string[]
  createdAt: number // timestamp
  updatedAt: number // timestamp
}

export interface Staff {
  id: string
  clinicId: string
  name: {
    first: string
    last: string
  }
  role: "owner" | "admin" | "doctor" | "nurse" | "receptionist"
  email: string
  phone?: string
  permissions: string[] // Array of permission keys
  verificationStatus: "pending" | "verified" | "rejected"
  profilePictureURL?: string
  specialties?: string[]
  bio?: string
  createdAt: number // timestamp
  updatedAt: number // timestamp
}

export interface Patient {
  id: string
  clinicId: string
  name: {
    first: string
    last: string
  }
  dateOfBirth: string // YYYY-MM-DD
  gender: "male" | "female" | "other" | "prefer-not-to-say"
  phone: string
  email: string
  address: {
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
  verificationStatus: "pending" | "verified" | "rejected"
  notes?: string
  createdAt: number // timestamp
  updatedAt: number // timestamp
}

export interface Appointment {
  id: string
  clinicId: string
  patientId: string
  staffId: string
  appointmentTypeId: string
  appointmentType: {
    name: string
    duration: number // in minutes
    color: string
    price: number
  }
  startTime: number // timestamp
  endTime: number // timestamp
  status: "scheduled" | "confirmed" | "cancelled" | "completed" | "no-show"
  paymentStatus: "pending" | "paid" | "refunded" | "waived"
  paymentId?: string
  patientNotes?: string
  staffNotes?: string
  followUpRequired: boolean
  followUpCompleted?: boolean
  reminderSent: boolean
  cancelledReason?: string
  cancelledBy?: string
  createdAt: number // timestamp
  updatedAt: number // timestamp
}

export interface Billing {
  id: string
  clinicId: string
  patientId: string
  appointmentId?: string
  amount: number
  currency: string // USD, CAD, etc.
  description: string
  status: "pending" | "paid" | "failed" | "refunded"
  paymentMethod: string
  transactionId?: string
  paymentDate?: number // timestamp
  dueDate: number // timestamp
  invoiceNumber: string
  invoiceUrl?: string
  createdAt: number // timestamp
  updatedAt: number // timestamp
}

export interface Notification {
  id: string
  clinicId: string
  userId: string
  title: string
  message: string
  type:
    | "appointment_reminder"
    | "appointment_confirmation"
    | "appointment_cancellation"
    | "system_update"
    | "payment_reminder"
  status: "sent" | "delivered" | "read"
  sentAt: number // timestamp
  readAt?: number // timestamp
}

export interface User {
  id: string
  email: string
  phone?: string
  name: {
    first: string
    last: string
  }
  role: "super_admin" | "clinic_owner" | "staff" | "patient"
  profilePictureURL?: string
  verificationStatus: "pending" | "verified" | "rejected"
  clinicId?: string // For staff and patients
  createdAt: number // timestamp
  updatedAt: number // timestamp
}

export interface UserSubscription {
  id: string
  userId: string
  plan: "free" | "basic" | "premium" | "enterprise"
  startDate: number // timestamp
  endDate: number // timestamp
  autoRenew: boolean
  status: "active" | "inactive" | "trial" | "expired"
  paymentMethod?: string
  createdAt: number // timestamp
  updatedAt: number // timestamp
}

// Document paths in Firestore
export const COLLECTIONS = {
  CLINICS: "clinics",
  USERS: "users",
  STAFF: (clinicId: string) => `clinics/${clinicId}/staff`,
  PATIENTS: (clinicId: string) => `clinics/${clinicId}/patients`,
  APPOINTMENTS: (clinicId: string) => `clinics/${clinicId}/appointments`,
  BILLING: (clinicId: string) => `clinics/${clinicId}/billing`,
  NOTIFICATIONS: (clinicId: string) => `clinics/${clinicId}/notifications`,
  USER_SUBSCRIPTIONS: (userId: string) => `users/${userId}/subscriptions`,
}

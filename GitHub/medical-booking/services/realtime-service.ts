import { db } from "../lib/firebase-config"
import { collection, doc, onSnapshot, query, where, orderBy, limit, type Unsubscribe } from "firebase/firestore"
import { COLLECTIONS } from "../lib/database-schema"

/**
 * Service for setting up real-time listeners to Firestore
 */
export const realtimeService = {
  // Listen to a specific clinic's data
  listenToClinic: (clinicId: string, callback: (data: any) => void): Unsubscribe => {
    const clinicRef = doc(db, COLLECTIONS.CLINICS, clinicId)
    return onSnapshot(clinicRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() })
      } else {
        callback(null)
      }
    })
  },

  // Listen to a clinic's staff members
  listenToStaff: (clinicId: string, callback: (data: any[]) => void): Unsubscribe => {
    const staffRef = collection(db, COLLECTIONS.STAFF(clinicId))
    const staffQuery = query(staffRef, orderBy("name.last"))

    return onSnapshot(staffQuery, (snapshot) => {
      const staff: any[] = []
      snapshot.forEach((doc) => {
        staff.push({ id: doc.id, ...doc.data() })
      })
      callback(staff)
    })
  },

  // Listen to a clinic's patients
  listenToPatients: (clinicId: string, callback: (data: any[]) => void): Unsubscribe => {
    const patientsRef = collection(db, COLLECTIONS.PATIENTS(clinicId))
    const patientsQuery = query(patientsRef, orderBy("name.last"))

    return onSnapshot(patientsQuery, (snapshot) => {
      const patients: any[] = []
      snapshot.forEach((doc) => {
        patients.push({ id: doc.id, ...doc.data() })
      })
      callback(patients)
    })
  },

  // Listen to a specific patient's data
  listenToPatient: (clinicId: string, patientId: string, callback: (data: any) => void): Unsubscribe => {
    const patientRef = doc(db, COLLECTIONS.PATIENTS(clinicId), patientId)

    return onSnapshot(patientRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() })
      } else {
        callback(null)
      }
    })
  },

  // Listen to appointments for a specific date range
  listenToAppointments: (
    clinicId: string,
    startDate: Date,
    endDate: Date,
    callback: (data: any[]) => void,
  ): Unsubscribe => {
    const appointmentsRef = collection(db, COLLECTIONS.APPOINTMENTS(clinicId))
    const appointmentsQuery = query(
      appointmentsRef,
      where("startTime", ">=", startDate.getTime()),
      where("startTime", "<=", endDate.getTime()),
      orderBy("startTime"),
    )

    return onSnapshot(appointmentsQuery, (snapshot) => {
      const appointments: any[] = []
      snapshot.forEach((doc) => {
        appointments.push({ id: doc.id, ...doc.data() })
      })
      callback(appointments)
    })
  },

  // Listen to a specific staff member's appointments
  listenToStaffAppointments: (
    clinicId: string,
    staffId: string,
    startDate: Date,
    endDate: Date,
    callback: (data: any[]) => void,
  ): Unsubscribe => {
    const appointmentsRef = collection(db, COLLECTIONS.APPOINTMENTS(clinicId))
    const appointmentsQuery = query(
      appointmentsRef,
      where("staffId", "==", staffId),
      where("startTime", ">=", startDate.getTime()),
      where("startTime", "<=", endDate.getTime()),
      orderBy("startTime"),
    )

    return onSnapshot(appointmentsQuery, (snapshot) => {
      const appointments: any[] = []
      snapshot.forEach((doc) => {
        appointments.push({ id: doc.id, ...doc.data() })
      })
      callback(appointments)
    })
  },

  // Listen to a specific patient's appointments
  listenToPatientAppointments: (clinicId: string, patientId: string, callback: (data: any[]) => void): Unsubscribe => {
    const appointmentsRef = collection(db, COLLECTIONS.APPOINTMENTS(clinicId))
    const appointmentsQuery = query(
      appointmentsRef,
      where("patientId", "==", patientId),
      where("startTime", ">=", Date.now()), // Only future appointments
      orderBy("startTime"),
    )

    return onSnapshot(appointmentsQuery, (snapshot) => {
      const appointments: any[] = []
      snapshot.forEach((doc) => {
        appointments.push({ id: doc.id, ...doc.data() })
      })
      callback(appointments)
    })
  },

  // Listen to a user's notifications
  listenToNotifications: (clinicId: string, userId: string, callback: (data: any[]) => void): Unsubscribe => {
    const notificationsRef = collection(db, COLLECTIONS.NOTIFICATIONS(clinicId))
    const notificationsQuery = query(
      notificationsRef,
      where("userId", "==", userId),
      orderBy("sentAt", "desc"),
      limit(50), // Limit to the 50 most recent notifications
    )

    return onSnapshot(notificationsQuery, (snapshot) => {
      const notifications: any[] = []
      snapshot.forEach((doc) => {
        notifications.push({ id: doc.id, ...doc.data() })
      })
      callback(notifications)
    })
  },

  // Listen to unread notifications count
  listenToUnreadNotificationsCount: (
    clinicId: string,
    userId: string,
    callback: (count: number) => void,
  ): Unsubscribe => {
    const notificationsRef = collection(db, COLLECTIONS.NOTIFICATIONS(clinicId))
    const notificationsQuery = query(notificationsRef, where("userId", "==", userId), where("status", "!=", "read"))

    return onSnapshot(notificationsQuery, (snapshot) => {
      callback(snapshot.size)
    })
  },

  // Listen to billing records for a patient
  listenToPatientBilling: (clinicId: string, patientId: string, callback: (data: any[]) => void): Unsubscribe => {
    const billingRef = collection(db, COLLECTIONS.BILLING(clinicId))
    const billingQuery = query(billingRef, where("patientId", "==", patientId), orderBy("createdAt", "desc"))

    return onSnapshot(billingQuery, (snapshot) => {
      const billingRecords: any[] = []
      snapshot.forEach((doc) => {
        billingRecords.push({ id: doc.id, ...doc.data() })
      })
      callback(billingRecords)
    })
  },

  // Listen to pending payments
  listenToPendingPayments: (clinicId: string, callback: (data: any[]) => void): Unsubscribe => {
    const billingRef = collection(db, COLLECTIONS.BILLING(clinicId))
    const billingQuery = query(billingRef, where("status", "==", "pending"), orderBy("dueDate"))

    return onSnapshot(billingQuery, (snapshot) => {
      const pendingPayments: any[] = []
      snapshot.forEach((doc) => {
        pendingPayments.push({ id: doc.id, ...doc.data() })
      })
      callback(pendingPayments)
    })
  },
}

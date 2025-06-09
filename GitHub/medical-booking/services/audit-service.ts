import { adminDb } from "@/lib/firebase-admin"

interface AuditLogEntry {
  userId: string
  action: string
  resource: string
  ipAddress?: string
  userAgent?: string
  timestamp?: Date
  details?: Record<string, any>
}

class AuditService {
  async logAction(clinicId: string, entry: AuditLogEntry) {
    try {
      const logEntry = {
        ...entry,
        timestamp: entry.timestamp || new Date(),
        clinicId,
      }

      await adminDb.collection("clinics").doc(clinicId).collection("logs").add(logEntry)

      console.log("Audit log entry created:", logEntry)
    } catch (error) {
      console.error("Failed to create audit log entry:", error)
      // Don't throw error to prevent breaking the main flow
    }
  }

  async getAuditLogs(clinicId: string, limit = 100) {
    try {
      const snapshot = await adminDb
        .collection("clinics")
        .doc(clinicId)
        .collection("logs")
        .orderBy("timestamp", "desc")
        .limit(limit)
        .get()

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    } catch (error) {
      console.error("Failed to fetch audit logs:", error)
      return []
    }
  }
}

export const auditService = new AuditService()

"use client"

import { useState, useEffect } from "react"
import { realtimeService } from "../../services/realtime-service"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RealTimeAppointmentsProps {
  clinicId: string
}

export default function RealTimeAppointments({ clinicId }: RealTimeAppointmentsProps) {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get today's date at midnight
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get end of today
    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    // Set up real-time listener for today's appointments
    const unsubscribe = realtimeService.listenToAppointments(clinicId, today, endOfDay, (data) => {
      setAppointments(data)
      setLoading(false)
    })

    // Clean up listener on component unmount
    return () => {
      unsubscribe()
    }
  }, [clinicId])

  // Helper function to get badge color based on appointment status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      case "completed":
        return <Badge className="bg-blue-500">Completed</Badge>
      case "no-show":
        return <Badge className="bg-yellow-500">No Show</Badge>
      default:
        return <Badge className="bg-gray-500">Scheduled</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : appointments.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No appointments scheduled for today.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {format(new Date(appointment.startTime), "h:mm a")} -{" "}
                      {format(new Date(appointment.endTime), "h:mm a")}
                    </p>
                    <p className="text-sm text-gray-600">{appointment.appointmentType.name}</p>
                  </div>
                  <div>{getStatusBadge(appointment.status)}</div>
                </div>
                <div className="mt-2">
                  <p className="text-sm">
                    <span className="font-medium">Patient:</span> {appointment.patientName || "Loading..."}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Provider:</span> {appointment.staffName || "Loading..."}
                  </p>
                </div>
                {appointment.patientNotes && (
                  <div className="mt-2 text-sm">
                    <p className="font-medium">Notes:</p>
                    <p className="text-gray-600">{appointment.patientNotes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

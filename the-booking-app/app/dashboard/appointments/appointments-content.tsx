"use client"

import type React from "react"

import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User } from "lucide-react"
import Link from "next/link"

export function AppointmentsContent({ tab }: { tab: string }) {
  // Render the appropriate content based on the tab
  return (
    <>
      {tab === "upcoming" && <UpcomingAppointments />}
      {tab === "past" && <PastAppointments />}
      {tab === "cancelled" && <CancelledAppointments />}
    </>
  )
}

function UpcomingAppointments() {
  // This would fetch data from the server
  const appointments = [
    {
      id: "1",
      type: "Annual Check-up",
      provider: "Dr. Sarah Johnson",
      date: new Date(2025, 4, 15, 10, 30),
      duration: 30,
      status: "confirmed",
    },
    {
      id: "2",
      type: "Dental Cleaning",
      provider: "Dr. Michael Chen",
      date: new Date(2025, 4, 20, 14, 0),
      duration: 60,
      status: "scheduled",
    },
  ]

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-center text-gray-500 mb-4">You don't have any upcoming appointments.</p>
          <Button asChild>
            <Link href="/booking">Book an Appointment</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          actions={
            <>
              <Button variant="outline" asChild>
                <Link href={`/dashboard/appointments/${appointment.id}/reschedule`}>Reschedule</Link>
              </Button>
              <Button variant="destructive" asChild>
                <Link href={`/dashboard/appointments/${appointment.id}/cancel`}>Cancel</Link>
              </Button>
            </>
          }
        />
      ))}
    </div>
  )
}

function PastAppointments() {
  // This would fetch data from the server
  const appointments = [
    {
      id: "3",
      type: "Follow-up Visit",
      provider: "Dr. Sarah Johnson",
      date: new Date(2025, 3, 10, 11, 0),
      duration: 15,
      status: "completed",
    },
  ]

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-center text-gray-500">You don't have any past appointments.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          actions={
            <Button variant="outline" asChild>
              <Link href={`/dashboard/appointments/${appointment.id}`}>View Details</Link>
            </Button>
          }
        />
      ))}
    </div>
  )
}

function CancelledAppointments() {
  // This would fetch data from the server
  const appointments = [
    {
      id: "4",
      type: "Consultation",
      provider: "Dr. Michael Chen",
      date: new Date(2025, 4, 5, 9, 0),
      duration: 45,
      status: "cancelled_by_patient",
    },
  ]

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-center text-gray-500">You don't have any cancelled appointments.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          actions={
            <Button variant="outline" asChild>
              <Link href={`/booking`}>Book Again</Link>
            </Button>
          }
        />
      ))}
    </div>
  )
}

interface AppointmentCardProps {
  appointment: {
    id: string
    type: string
    provider: string
    date: Date
    duration: number
    status: string
  }
  actions: React.ReactNode
}

function AppointmentCard({ appointment, actions }: AppointmentCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{appointment.type}</CardTitle>
        <CardDescription>
          {appointment.status === "confirmed" && "Confirmed"}
          {appointment.status === "scheduled" && "Pending Confirmation"}
          {appointment.status === "completed" && "Completed"}
          {appointment.status === "cancelled_by_patient" && "Cancelled by You"}
          {appointment.status === "cancelled_by_clinic" && "Cancelled by Clinic"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">Date</p>
            <p className="text-gray-500">{format(appointment.date, "EEEE, MMMM d, yyyy")}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">Time</p>
            <p className="text-gray-500">
              {format(appointment.date, "h:mm a")} ({appointment.duration} minutes)
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">Provider</p>
            <p className="text-gray-500">{appointment.provider}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">{actions}</CardFooter>
    </Card>
  )
}

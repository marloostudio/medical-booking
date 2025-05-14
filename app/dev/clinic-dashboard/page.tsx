"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Calendar, Users, Bell, BarChart, PlusCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EmailVerificationAlert } from "@/components/auth/email-verification-alert"

// Sample data for testing
const initialAppointments = [
  {
    id: 1,
    patient: "John Doe",
    date: "2025-05-11",
    time: "09:00 AM",
    type: "Check-up",
    doctor: "Dr. Sarah Johnson",
    status: "Confirmed",
  },
  {
    id: 2,
    patient: "Jane Smith",
    date: "2025-05-11",
    time: "10:30 AM",
    type: "Follow-up",
    doctor: "Dr. Michael Chen",
    status: "Confirmed",
  },
  {
    id: 3,
    patient: "Robert Brown",
    date: "2025-05-11",
    time: "01:15 PM",
    type: "Consultation",
    doctor: "Dr. Sarah Johnson",
    status: "Pending",
  },
  {
    id: 4,
    patient: "Emily Wilson",
    date: "2025-05-12",
    time: "11:00 AM",
    type: "Check-up",
    doctor: "Dr. Michael Chen",
    status: "Confirmed",
  },
  {
    id: 5,
    patient: "David Lee",
    date: "2025-05-12",
    time: "02:45 PM",
    type: "Follow-up",
    doctor: "Dr. Sarah Johnson",
    status: "Cancelled",
  },
]

const initialPatients = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", phone: "(555) 123-4567", lastVisit: "2025-04-15" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com", phone: "(555) 987-6543", lastVisit: "2025-04-28" },
  { id: 3, name: "Robert Brown", email: "robert.brown@example.com", phone: "(555) 456-7890", lastVisit: "2025-05-02" },
  { id: 4, name: "Emily Wilson", email: "emily.wilson@example.com", phone: "(555) 789-0123", lastVisit: "2025-05-05" },
  { id: 5, name: "David Lee", email: "david.lee@example.com", phone: "(555) 234-5678", lastVisit: "2025-05-08" },
]

export default function DevClinicDashboard() {
  const searchParams = useSearchParams()
  const [appointments, setAppointments] = useState(initialAppointments)
  const [patients, setPatients] = useState(initialPatients)
  const [newAppointment, setNewAppointment] = useState({
    patient: "",
    date: "",
    time: "",
    type: "",
    doctor: "",
    status: "Pending",
  })
  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    phone: "",
    lastVisit: "",
  })
  const [showVerificationAlert, setShowVerificationAlert] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  // Check if this is a new signup
  useEffect(() => {
    if (searchParams) {
      if (searchParams.get("newSignup") === "true") {
        setShowVerificationAlert(true)
      }

      const email = searchParams.get("email")
      if (email) {
        setUserEmail(email)
      } else {
        setUserEmail("clinic.owner@example.com")
      }
    }
  }, [searchParams])

  // Add new appointment
  const handleAddAppointment = () => {
    const id = appointments.length > 0 ? Math.max(...appointments.map((a) => a.id)) + 1 : 1
    setAppointments([...appointments, { id, ...newAppointment }])
    setNewAppointment({
      patient: "",
      date: "",
      time: "",
      type: "",
      doctor: "",
      status: "Pending",
    })
  }

  // Add new patient
  const handleAddPatient = () => {
    const id = patients.length > 0 ? Math.max(...patients.map((p) => p.id)) + 1 : 1
    setPatients([...patients, { id, ...newPatient }])
    setNewPatient({
      name: "",
      email: "",
      phone: "",
      lastVisit: "",
    })
  }

  // Delete appointment
  const handleDeleteAppointment = (id: number) => {
    setAppointments(appointments.filter((appointment) => appointment.id !== id))
  }

  // Delete patient
  const handleDeletePatient = (id: number) => {
    setPatients(patients.filter((patient) => patient.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Clinic Dashboard (Dev Mode)</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
              Development Environment
            </span>
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="py-6 flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-8">
            {/* Email Verification Alert */}
            {showVerificationAlert && <EmailVerificationAlert email={userEmail} />}

            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Today's Appointments</p>
                      <p className="text-3xl font-bold">{appointments.filter((a) => a.date === "2025-05-11").length}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Patients</p>
                      <p className="text-3xl font-bold">{patients.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Pending Appointments</p>
                      <p className="text-3xl font-bold">{appointments.filter((a) => a.status === "Pending").length}</p>
                    </div>
                    <Bell className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                      <p className="text-3xl font-bold">87%</p>
                    </div>
                    <BarChart className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="appointments" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="patients">Patients</TabsTrigger>
              </TabsList>

              {/* Appointments Tab */}
              <TabsContent value="appointments" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Appointments</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Appointment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Appointment</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="patient">Patient Name</Label>
                          <Input
                            id="patient"
                            value={newAppointment.patient}
                            onChange={(e) => setNewAppointment({ ...newAppointment, patient: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={newAppointment.date}
                            onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="time">Time</Label>
                          <Input
                            id="time"
                            type="time"
                            value={newAppointment.time}
                            onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="type">Appointment Type</Label>
                          <Input
                            id="type"
                            value={newAppointment.type}
                            onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="doctor">Doctor</Label>
                          <Input
                            id="doctor"
                            value={newAppointment.doctor}
                            onChange={(e) => setNewAppointment({ ...newAppointment, doctor: e.target.value })}
                          />
                        </div>
                        <Button onClick={handleAddAppointment}>Add Appointment</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Patient</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Time</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Doctor</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments.map((appointment) => (
                            <tr key={appointment.id} className="border-b">
                              <td className="px-4 py-3 text-sm">{appointment.patient}</td>
                              <td className="px-4 py-3 text-sm">{appointment.date}</td>
                              <td className="px-4 py-3 text-sm">{appointment.time}</td>
                              <td className="px-4 py-3 text-sm">{appointment.type}</td>
                              <td className="px-4 py-3 text-sm">{appointment.doctor}</td>
                              <td className="px-4 py-3 text-sm">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    appointment.status === "Confirmed"
                                      ? "bg-green-100 text-green-800"
                                      : appointment.status === "Pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {appointment.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteAppointment(appointment.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Patients Tab */}
              <TabsContent value="patients" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Patients</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Patient
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Patient</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={newPatient.name}
                            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newPatient.email}
                            onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={newPatient.phone}
                            onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="lastVisit">Last Visit</Label>
                          <Input
                            id="lastVisit"
                            type="date"
                            value={newPatient.lastVisit}
                            onChange={(e) => setNewPatient({ ...newPatient, lastVisit: e.target.value })}
                          />
                        </div>
                        <Button onClick={handleAddPatient}>Add Patient</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Phone</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Last Visit</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {patients.map((patient) => (
                            <tr key={patient.id} className="border-b">
                              <td className="px-4 py-3 text-sm">{patient.name}</td>
                              <td className="px-4 py-3 text-sm">{patient.email}</td>
                              <td className="px-4 py-3 text-sm">{patient.phone}</td>
                              <td className="px-4 py-3 text-sm">{patient.lastVisit}</td>
                              <td className="px-4 py-3 text-sm">
                                <Button variant="ghost" size="sm" onClick={() => handleDeletePatient(patient.id)}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

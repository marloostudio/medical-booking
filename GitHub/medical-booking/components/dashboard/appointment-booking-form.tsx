"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where, addDoc } from "firebase/firestore"
import { format } from "date-fns"
import { CalendarIcon, Clock, User, Users, FileText, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type Patient = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

type Provider = {
  id: string
  name: string
  role: string
}

type AppointmentType = {
  id: string
  name: string
  duration: number
  color: string
}

type TimeSlot = {
  time: string
  available: boolean
}

export function AppointmentBookingForm() {
  const { toast } = useToast()
  const [patients, setPatients] = useState<Patient[]>([])
  const [providers, setProviders] = useState<Provider[]>([])
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const [selectedPatientId, setSelectedPatientId] = useState<string>("")
  const [selectedProviderId, setSelectedProviderId] = useState<string>("")
  const [selectedAppointmentTypeId, setSelectedAppointmentTypeId] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [notes, setNotes] = useState<string>("")
  const [patientSearch, setPatientSearch] = useState<string>("")

  // Temporary clinic ID for development
  const clinicId = "demo-clinic-123"

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedProviderId && selectedDate && selectedAppointmentTypeId) {
      fetchAvailableTimeSlots()
    }
  }, [selectedProviderId, selectedDate, selectedAppointmentTypeId])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch patients
      const patientsQuery = query(collection(db, "patients"), where("clinicId", "==", clinicId))
      const patientsSnapshot = await getDocs(patientsQuery)
      const patientsList: Patient[] = []
      patientsSnapshot.forEach((doc) => {
        const data = doc.data()
        patientsList.push({
          id: doc.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
        })
      })
      setPatients(patientsList)

      // Fetch providers
      const providersQuery = query(
        collection(db, "users"),
        where("clinicId", "==", clinicId),
        where("role", "in", ["MEDICAL_STAFF", "DOCTOR", "NURSE"]),
      )
      const providersSnapshot = await getDocs(providersQuery)
      const providersList: Provider[] = []
      providersSnapshot.forEach((doc) => {
        const data = doc.data()
        providersList.push({
          id: doc.id,
          name: `${data.firstName} ${data.lastName}`,
          role: data.role,
        })
      })
      setProviders(providersList)

      // Fetch appointment types
      const appointmentTypesQuery = query(
        collection(db, "appointmentTypes"),
        where("clinicId", "==", clinicId),
        where("isActive", "==", true),
      )
      const appointmentTypesSnapshot = await getDocs(appointmentTypesQuery)
      const appointmentTypesList: AppointmentType[] = []
      appointmentTypesSnapshot.forEach((doc) => {
        const data = doc.data()
        appointmentTypesList.push({
          id: doc.id,
          name: data.name,
          duration: data.duration,
          color: data.color,
        })
      })
      setAppointmentTypes(appointmentTypesList)
    } catch (err) {
      console.error("Error fetching data:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load data. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableTimeSlots = async () => {
    // In a real app, this would query the database for available slots
    // based on provider availability and existing appointments

    // For demo purposes, generate some time slots
    const slots: TimeSlot[] = []
    const startHour = 9
    const endHour = 17

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        // Randomly mark some slots as unavailable
        const available = Math.random() > 0.3
        slots.push({ time, available })
      }
    }

    setTimeSlots(slots)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPatientId || !selectedProviderId || !selectedAppointmentTypeId || !selectedDate || !selectedTime) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      })
      return
    }

    setSubmitting(true)
    try {
      // Get the selected appointment type for duration
      const appointmentType = appointmentTypes.find((type) => type.id === selectedAppointmentTypeId)
      if (!appointmentType) throw new Error("Invalid appointment type")

      // Parse the selected time
      const [hours, minutes] = selectedTime.split(":").map(Number)

      // Create a new date object with the selected date and time
      const appointmentDateTime = new Date(selectedDate!)
      appointmentDateTime.setHours(hours, minutes, 0, 0)

      // Calculate end time
      const endDateTime = new Date(appointmentDateTime)
      endDateTime.setMinutes(endDateTime.getMinutes() + appointmentType.duration)

      // Create the appointment
      await addDoc(collection(db, "appointments"), {
        patientId: selectedPatientId,
        providerId: selectedProviderId,
        appointmentTypeId: selectedAppointmentTypeId,
        clinicId,
        startTime: appointmentDateTime,
        endTime: endDateTime,
        status: "scheduled",
        notes,
        createdAt: new Date(),
      })

      toast({
        title: "Appointment booked",
        description: "The appointment has been successfully scheduled.",
      })

      setSuccess(true)
    } catch (err) {
      console.error("Error booking appointment:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to book appointment. Please try again.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setSelectedPatientId("")
    setSelectedProviderId("")
    setSelectedAppointmentTypeId("")
    setSelectedDate(new Date())
    setSelectedTime("")
    setNotes("")
    setSuccess(false)
  }

  const filteredPatients = patientSearch
    ? patients.filter(
        (patient) =>
          `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(patientSearch.toLowerCase()) ||
          patient.email.toLowerCase().includes(patientSearch.toLowerCase()) ||
          patient.phone.includes(patientSearch),
      )
    : patients

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-green-600">Appointment Booked Successfully</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <p className="text-lg">
            The appointment has been scheduled for {selectedDate && format(selectedDate, "MMMM d, yyyy")} at{" "}
            {selectedTime}.
          </p>
          <div className="mt-6">
            <Button onClick={resetForm}>Book Another Appointment</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book New Appointment</CardTitle>
        <CardDescription>Schedule an appointment for a patient with a provider</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="patient" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Patient
              </Label>
              <div className="mt-1 space-y-2">
                <Input
                  placeholder="Search patients by name, email, or phone"
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  className="mb-2"
                />
                <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                  <SelectTrigger id="patient">
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPatients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName} ({patient.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="provider" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Provider
              </Label>
              <Select value={selectedProviderId} onValueChange={setSelectedProviderId} className="mt-1">
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name} ({provider.role.replace("_", " ")})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="appointmentType" className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Appointment Type
              </Label>
              <Select value={selectedAppointmentTypeId} onValueChange={setSelectedAppointmentTypeId} className="mt-1">
                <SelectTrigger id="appointmentType">
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name} ({type.duration} min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full mt-1 justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="time">Time</Label>
                <Select
                  value={selectedTime}
                  onValueChange={setSelectedTime}
                  disabled={!selectedDate || !selectedProviderId || !selectedAppointmentTypeId}
                  className="mt-1"
                >
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot, index) => (
                      <SelectItem key={index} value={slot.time} disabled={!slot.available}>
                        {slot.time} {!slot.available && "(Unavailable)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this appointment"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={resetForm}>
              Reset
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Booking..." : "Book Appointment"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

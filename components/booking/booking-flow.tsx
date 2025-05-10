"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppointmentTypeSelector } from "./appointment-type-selector"
import { StaffSelector } from "./staff-selector"
import { DateTimeSelector } from "./date-time-selector"
import { BookingConfirmation } from "./booking-confirmation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import type { AppointmentType, AppointmentCategory } from "@/services/appointment-type-service"

// Import the analytics functions
import { event } from "@/lib/analytics"

interface BookingFlowProps {
  clinicId: string
  patientId: string
}

type StaffMember = {
  id: string
  name: string
  role: string
  specialties?: string[]
  imageUrl?: string
}

type BookingStep = "service" | "provider" | "datetime" | "confirmation" | "success"

export function BookingFlow({ clinicId, patientId }: BookingFlowProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<BookingStep>("service")
  const [progress, setProgress] = useState(25)

  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([])
  const [categories, setCategories] = useState<AppointmentCategory[]>([])
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])

  const [selectedAppointmentTypeId, setSelectedAppointmentTypeId] = useState<string>()
  const [selectedStaffId, setSelectedStaffId] = useState<string>()
  const [selectedDateTime, setSelectedDateTime] = useState<Date>()

  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch appointment types and categories
  useEffect(() => {
    const fetchAppointmentData = async () => {
      setIsLoading(true)
      try {
        // This would be replaced with actual API calls
        const typesResponse = await fetch(`/api/appointment-types?clinicId=${clinicId}`)
        const typesData = await typesResponse.json()
        setAppointmentTypes(typesData.appointmentTypes)

        const categoriesResponse = await fetch(`/api/appointment-categories?clinicId=${clinicId}`)
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData.categories)
      } catch (error) {
        console.error("Error fetching appointment data:", error)
        setError("Failed to load appointment types. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointmentData()
  }, [clinicId])

  // Fetch staff members when appointment type is selected
  useEffect(() => {
    if (selectedAppointmentTypeId) {
      const fetchStaffMembers = async () => {
        setIsLoading(true)
        try {
          // This would be replaced with an actual API call
          const response = await fetch(`/api/staff?clinicId=${clinicId}&appointmentTypeId=${selectedAppointmentTypeId}`)
          const data = await response.json()
          setStaffMembers(data.staffMembers)
        } catch (error) {
          console.error("Error fetching staff members:", error)
          setError("Failed to load providers. Please try again later.")
        } finally {
          setIsLoading(false)
        }
      }

      fetchStaffMembers()
    }
  }, [clinicId, selectedAppointmentTypeId])

  // Update progress based on current step
  useEffect(() => {
    switch (currentStep) {
      case "service":
        setProgress(25)
        break
      case "provider":
        setProgress(50)
        break
      case "datetime":
        setProgress(75)
        break
      case "confirmation":
      case "success":
        setProgress(100)
        break
    }
  }, [currentStep])

  // Track appointment type selection
  const handleAppointmentTypeSelect = (appointmentTypeId: string) => {
    setSelectedAppointmentTypeId(appointmentTypeId)
    setCurrentStep("provider")

    // Track event
    event({
      action: "select_appointment_type",
      category: "booking",
      label: appointmentTypeId,
    })
  }

  // Track staff selection
  const handleStaffSelect = (staffId: string) => {
    setSelectedStaffId(staffId)
    setCurrentStep("datetime")

    // Track event
    event({
      action: "select_staff",
      category: "booking",
      label: staffId,
    })
  }

  // Track date/time selection
  const handleDateTimeSelect = (startTime: Date) => {
    setSelectedDateTime(startTime)
    setCurrentStep("confirmation")

    // Track event
    event({
      action: "select_datetime",
      category: "booking",
      label: startTime.toISOString(),
    })
  }

  // Handle booking confirmation
  const handleConfirmBooking = async (
    notes: string,
    createRecurring: boolean,
    recurringOptions?: { frequency: string; occurrences: number },
  ) => {
    if (!selectedAppointmentTypeId || !selectedStaffId || !selectedDateTime) {
      setError("Missing required booking information. Please try again.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // This would be replaced with an actual API call
      const endpoint = createRecurring ? "/api/appointments/book-recurring" : "/api/appointments/book"

      const requestBody = {
        clinicId,
        patientId,
        appointmentTypeId: selectedAppointmentTypeId,
        staffId: selectedStaffId,
        startTime: selectedDateTime.toISOString(),
        patientNotes: notes,
        ...(createRecurring && recurringOptions
          ? {
              recurrencePattern: {
                frequency: recurringOptions.frequency,
                occurrences: recurringOptions.occurrences,
              },
            }
          : {}),
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to book appointment")
      }

      // Track successful booking with Google Analytics
      event({
        action: "complete_booking",
        category: "booking",
        label: createRecurring ? "recurring" : "single",
        value: createRecurring ? recurringOptions?.occurrences : 1,
      })

      // Success - show success step
      setCurrentStep("success")
    } catch (error) {
      console.error("Error booking appointment:", error)
      setError(error instanceof Error ? error.message : "Failed to book appointment. Please try again.")

      // Track failed booking
      event({
        action: "booking_error",
        category: "booking",
        label: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle navigation back
  const handleBack = () => {
    switch (currentStep) {
      case "provider":
        setCurrentStep("service")
        break
      case "datetime":
        setCurrentStep("provider")
        break
      case "confirmation":
        setCurrentStep("datetime")
        break
      default:
        break
    }
  }

  // Get the selected appointment type
  const selectedAppointmentType = appointmentTypes.find((type) => type.id === selectedAppointmentTypeId)

  // Get the selected staff member
  const selectedStaffMember = staffMembers.find((staff) => staff.id === selectedStaffId)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>Service</span>
          <span>Provider</span>
          <span>Date & Time</span>
          <span>Confirmation</span>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Booking steps */}
      {currentStep === "service" && (
        <AppointmentTypeSelector
          clinicId={clinicId}
          appointmentTypes={appointmentTypes}
          categories={categories}
          onSelect={handleAppointmentTypeSelect}
          selectedAppointmentTypeId={selectedAppointmentTypeId}
        />
      )}

      {currentStep === "provider" && (
        <div className="space-y-4">
          <StaffSelector
            staffMembers={staffMembers}
            onSelect={handleStaffSelect}
            selectedStaffId={selectedStaffId}
            appointmentTypeId={selectedAppointmentTypeId}
          />

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          </div>
        </div>
      )}

      {currentStep === "datetime" && (
        <div className="space-y-4">
          {selectedAppointmentTypeId && selectedStaffId && (
            <DateTimeSelector
              clinicId={clinicId}
              staffId={selectedStaffId}
              appointmentTypeId={selectedAppointmentTypeId}
              onSelect={handleDateTimeSelect}
              selectedDateTime={selectedDateTime}
            />
          )}

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          </div>
        </div>
      )}

      {currentStep === "confirmation" && selectedAppointmentType && selectedStaffMember && selectedDateTime && (
        <BookingConfirmation
          appointmentType={selectedAppointmentType}
          staffMember={selectedStaffMember}
          startTime={selectedDateTime}
          onConfirm={handleConfirmBooking}
          onBack={handleBack}
          isSubmitting={isSubmitting}
        />
      )}

      {currentStep === "success" && (
        <div className="text-center py-8">
          <div className="bg-green-100 rounded-full p-4 inline-block mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Appointment Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your appointment has been successfully booked. You will receive a confirmation email and SMS shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => router.push("/dashboard/appointments")}>View My Appointments</Button>
            <Button
              variant="outline"
              onClick={() => {
                // Reset the form and start over
                setSelectedAppointmentTypeId(undefined)
                setSelectedStaffId(undefined)
                setSelectedDateTime(undefined)
                setCurrentStep("service")
              }}
            >
              Book Another Appointment
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingFlow

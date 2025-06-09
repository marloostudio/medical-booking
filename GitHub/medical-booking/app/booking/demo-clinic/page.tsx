"use client"

// Force dynamic rendering to disable static generation
export const dynamic = "force-dynamic"

import { Suspense, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"

export default function DemoBookingPage() {
  return (
    <Suspense fallback={<BookingLoading />}>
      <BookingContent />
    </Suspense>
  )
}

function BookingContent() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isBooked, setIsBooked] = useState(false)

  const services = [
    { id: "checkup", name: "General Checkup", duration: "30 min", price: "$75" },
    { id: "consultation", name: "Specialist Consultation", duration: "45 min", price: "$120" },
    { id: "followup", name: "Follow-up Visit", duration: "20 min", price: "$60" },
  ]

  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
  ]

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      setIsBooked(true)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const isNextDisabled = () => {
    if (step === 1) return !selectedService
    if (step === 2) return !selectedDate
    if (step === 3) return !selectedTime
    return false
  }

  if (isBooked) {
    return (
      <div className="container py-10 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Booking Confirmed
            </CardTitle>
            <CardDescription>Your appointment has been scheduled</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                This is a demo booking. In a real implementation, this would be saved to the database and notifications
                would be sent.
              </AlertDescription>
            </Alert>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between">
                <span className="font-medium">Service:</span>
                <span>{services.find((s) => s.id === selectedService)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{selectedDate?.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Time:</span>
                <span>{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Duration:</span>
                <span>{services.find((s) => s.id === selectedService)?.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Price:</span>
                <span>{services.find((s) => s.id === selectedService)?.price}</span>
              </div>
            </div>

            <Button
              onClick={() => {
                setStep(1)
                setSelectedService(null)
                setSelectedDate(undefined)
                setSelectedTime(null)
                setIsBooked(false)
              }}
              className="w-full mt-4"
            >
              Book Another Appointment
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Book an Appointment</CardTitle>
          <CardDescription>Demo Clinic - Step {step} of 3</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div className="font-medium mb-2">Select a Service</div>
              <RadioGroup value={selectedService || ""} onValueChange={setSelectedService}>
                {services.map((service) => (
                  <div key={service.id} className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value={service.id} id={service.id} />
                    <Label htmlFor={service.id} className="flex-1 cursor-pointer">
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-gray-500">
                        {service.duration} • {service.price}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="font-medium mb-2">Select a Date</div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border mx-auto"
                disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="font-medium mb-2">Select a Time</div>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className="h-auto py-2"
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handleBack} disabled={step === 1}>
              Back
            </Button>
            <Button onClick={handleNext} disabled={isNextDisabled()}>
              {step === 3 ? "Confirm Booking" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function BookingLoading() {
  return (
    <div className="container py-10 max-w-md mx-auto">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4 w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded mb-8 w-1/3"></div>

        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <div className="h-10 bg-gray-200 rounded w-24"></div>
          <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  )
}

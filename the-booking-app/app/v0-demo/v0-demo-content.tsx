"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function V0DemoContent({ feature }: { feature: string }) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [appointmentType, setAppointmentType] = useState("checkup")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [booked, setBooked] = useState(false)

  const handleBook = () => {
    if (name && email && date) {
      setBooked(true)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
        <CardTitle className="text-2xl">BookingLink Demo</CardTitle>
        <CardDescription className="text-blue-50">
          Schedule your appointment {feature !== "default" ? `(${feature})` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {!booked ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Appointment Type</Label>
              <Select value={appointmentType} onValueChange={setAppointmentType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checkup">Regular Checkup</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="followup">Follow-up Visit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Date</Label>
              <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
            </div>
          </div>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900">Appointment Confirmed!</h3>
            <p className="text-gray-500">
              We've booked your {appointmentType} appointment for{" "}
              {date?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <p className="text-sm text-gray-400">A confirmation has been sent to {email}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!booked ? (
          <>
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleBook}>Book Appointment</Button>
          </>
        ) : (
          <Button className="w-full" variant="outline" onClick={() => setBooked(false)}>
            Book Another Appointment
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

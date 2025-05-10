"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { AppointmentType } from "@/services/appointment-type-service"
import { CalendarDays, Clock, User } from "lucide-react"

interface StaffMember {
  id: string
  name: string
  role: string
  imageUrl?: string
}

// Update the BookingConfirmationProps interface to include reminderPreferences
interface BookingConfirmationProps {
  appointmentType: AppointmentType
  staffMember: StaffMember
  startTime: Date
  onConfirm: (
    notes: string,
    createRecurring: boolean,
    recurringOptions?: { frequency: string; occurrences: number },
    syncToGoogleCalendar?: boolean,
    reminderPreferences?: {
      enabled: boolean
      channels: {
        sms: boolean
        email: boolean
      }
    },
  ) => void
  onBack: () => void
  isSubmitting: boolean
  showGoogleCalendarOption?: boolean
}

// Update the BookingConfirmation component to include reminder preferences
export function BookingConfirmation({
  appointmentType,
  staffMember,
  startTime,
  onConfirm,
  onBack,
  isSubmitting,
  showGoogleCalendarOption = false,
}: BookingConfirmationProps) {
  const [notes, setNotes] = useState("")
  const [createRecurring, setCreateRecurring] = useState(false)
  const [recurringFrequency, setRecurringFrequency] = useState("weekly")
  const [recurringOccurrences, setRecurringOccurrences] = useState(4)
  const [syncToGoogleCalendar, setSyncToGoogleCalendar] = useState(false)
  const [enableReminders, setEnableReminders] = useState(true)
  const [reminderSms, setReminderSms] = useState(true)
  const [reminderEmail, setReminderEmail] = useState(true)

  const handleSubmit = () => {
    onConfirm(
      notes,
      createRecurring,
      createRecurring ? { frequency: recurringFrequency, occurrences: recurringOccurrences } : undefined,
      syncToGoogleCalendar,
      {
        enabled: enableReminders,
        channels: {
          sms: reminderSms,
          email: reminderEmail,
        },
      },
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Confirm Your Appointment</h3>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
          <CardDescription>Please review your appointment details before confirming</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Date</p>
              <p className="text-gray-500">{format(startTime, "EEEE, MMMM d, yyyy")}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Time</p>
              <p className="text-gray-500">
                {format(startTime, "h:mm a")} ({appointmentType.duration} minutes)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Provider</p>
              <p className="text-gray-500">
                {staffMember.name} - {staffMember.role}
              </p>
            </div>
          </div>

          <div>
            <p className="font-medium mb-2">Appointment Type</p>
            <p className="text-gray-500">{appointmentType.name}</p>
            <p className="text-sm text-gray-500 mt-1">{appointmentType.description}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring"
                checked={createRecurring}
                onCheckedChange={(checked) => setCreateRecurring(checked as boolean)}
              />
              <Label htmlFor="recurring">Make this a recurring appointment</Label>
            </div>

            {createRecurring && (
              <div className="ml-6 space-y-4 mt-2 p-4 border rounded-md">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <select
                    id="frequency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={recurringFrequency}
                    onChange={(e) => setRecurringFrequency(e.target.value)}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Every 2 Weeks</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="occurrences">Number of Appointments</Label>
                  <select
                    id="occurrences"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={recurringOccurrences}
                    onChange={(e) => setRecurringOccurrences(Number.parseInt(e.target.value))}
                  >
                    <option value="2">2 appointments</option>
                    <option value="3">3 appointments</option>
                    <option value="4">4 appointments</option>
                    <option value="6">6 appointments</option>
                    <option value="8">8 appointments</option>
                    <option value="12">12 appointments</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Add reminder preferences section */}
          <div className="space-y-4 mt-2 p-4 border rounded-md">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-reminders" className="font-medium">
                Appointment Reminders
              </Label>
              <Checkbox
                id="enable-reminders"
                checked={enableReminders}
                onCheckedChange={(checked) => setEnableReminders(checked as boolean)}
              />
            </div>

            {enableReminders && (
              <div className="ml-6 space-y-2">
                <p className="text-sm text-muted-foreground mb-2">How would you like to receive reminders?</p>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reminder-sms"
                    checked={reminderSms}
                    onCheckedChange={(checked) => setReminderSms(checked as boolean)}
                  />
                  <Label htmlFor="reminder-sms">SMS Text Message</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reminder-email"
                    checked={reminderEmail}
                    onCheckedChange={(checked) => setReminderEmail(checked as boolean)}
                  />
                  <Label htmlFor="reminder-email">Email</Label>
                </div>
              </div>
            )}
          </div>

          {showGoogleCalendarOption && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="google-calendar"
                checked={syncToGoogleCalendar}
                onCheckedChange={(checked) => setSyncToGoogleCalendar(checked as boolean)}
              />
              <Label htmlFor="google-calendar">Add to my Google Calendar</Label>
            </div>
          )}

          <div>
            <p className="font-medium mb-2">Additional Notes (optional)</p>
            <Textarea
              placeholder="Add any notes or questions for your provider"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={onBack} disabled={isSubmitting} className="w-full sm:w-auto">
            Back
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Confirming..." : "Confirm Appointment"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Save } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"

interface ReminderPreference {
  enabled: boolean
  channels: {
    sms: boolean
    email: boolean
    push: boolean
  }
  timing: {
    days: number[]
    hours: number[]
  }
}

interface PatientReminderPreferencesProps {
  clinicId: string
  patientId: string
}

export function PatientReminderPreferences({ clinicId, patientId }: PatientReminderPreferencesProps) {
  const [preferences, setPreferences] = useState<ReminderPreference>({
    enabled: true,
    channels: {
      sms: true,
      email: true,
      push: false,
    },
    timing: {
      days: [1],
      hours: [24],
    },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPreferences()
  }, [patientId])

  const fetchPreferences = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/patients/${patientId}/reminder-preferences`)

      if (!response.ok) {
        throw new Error("Failed to fetch reminder preferences")
      }

      const data = await response.json()
      setPreferences(data)
    } catch (err) {
      console.error("Error fetching reminder preferences:", err)
      setError("Failed to load reminder preferences. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const savePreferences = async () => {
    try {
      setSaving(true)

      const response = await fetch(`/api/patients/${patientId}/reminder-preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      })

      if (!response.ok) {
        throw new Error("Failed to update reminder preferences")
      }

      toast({
        title: "Preferences Saved",
        description: "Reminder preferences have been updated successfully.",
      })
    } catch (err) {
      console.error("Error saving reminder preferences:", err)
      toast({
        title: "Error",
        description: "Failed to save reminder preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const toggleChannel = (channel: keyof typeof preferences.channels) => {
    setPreferences({
      ...preferences,
      channels: {
        ...preferences.channels,
        [channel]: !preferences.channels[channel],
      },
    })
  }

  const toggleDayReminder = (day: number) => {
    const days = preferences.timing.days.includes(day)
      ? preferences.timing.days.filter((d) => d !== day)
      : [...preferences.timing.days, day]

    setPreferences({
      ...preferences,
      timing: {
        ...preferences.timing,
        days,
      },
    })
  }

  const toggleHourReminder = (hour: number) => {
    const hours = preferences.timing.hours.includes(hour)
      ? preferences.timing.hours.filter((h) => h !== hour)
      : [...preferences.timing.hours, hour]

    setPreferences({
      ...preferences,
      timing: {
        ...preferences.timing,
        hours,
      },
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointment Reminder Preferences</CardTitle>
        <CardDescription>Customize how and when you receive appointment reminders</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="enable-reminders" className="text-base">
              Enable Appointment Reminders
            </Label>
            <p className="text-sm text-muted-foreground">Receive notifications about your upcoming appointments</p>
          </div>
          <Switch
            id="enable-reminders"
            checked={preferences.enabled}
            onCheckedChange={(checked) => setPreferences({ ...preferences, enabled: checked })}
          />
        </div>

        {preferences.enabled && (
          <>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notification Channels</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="channel-sms"
                    checked={preferences.channels.sms}
                    onCheckedChange={() => toggleChannel("sms")}
                  />
                  <Label htmlFor="channel-sms">SMS Text Messages</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="channel-email"
                    checked={preferences.channels.email}
                    onCheckedChange={() => toggleChannel("email")}
                  />
                  <Label htmlFor="channel-email">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="channel-push"
                    checked={preferences.channels.push}
                    onCheckedChange={() => toggleChannel("push")}
                  />
                  <Label htmlFor="channel-push">Push Notifications</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Reminder Timing</h3>

              <div>
                <h4 className="text-sm font-medium mb-2">Days Before Appointment</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[1, 2, 3, 7].map((day) => (
                    <div key={`day-${day}`} className="flex items-center space-x-2">
                      <Checkbox
                        id={`day-${day}`}
                        checked={preferences.timing.days.includes(day)}
                        onCheckedChange={() => toggleDayReminder(day)}
                      />
                      <Label htmlFor={`day-${day}`}>
                        {day} {day === 1 ? "day" : "days"} before
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Hours Before Appointment</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[1, 2, 4, 24, 48].map((hour) => (
                    <div key={`hour-${hour}`} className="flex items-center space-x-2">
                      <Checkbox
                        id={`hour-${hour}`}
                        checked={preferences.timing.hours.includes(hour)}
                        onCheckedChange={() => toggleHourReminder(hour)}
                      />
                      <Label htmlFor={`hour-${hour}`}>
                        {hour} {hour === 1 ? "hour" : "hours"} before
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={savePreferences} disabled={saving}>
          {saving ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Preferences
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

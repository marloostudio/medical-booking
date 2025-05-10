"use client"

import { useState, useEffect } from "react"
import { format, isSameDay } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { TimeSlot } from "@/services/appointment-service"
import { Clock } from "lucide-react"
import { timeZoneUtils } from "@/utils/time-zone"

interface DateTimeSelectorProps {
  clinicId: string
  staffId: string
  appointmentTypeId: string
  onSelect: (startTime: Date) => void
  selectedDateTime?: Date
  clinicTimeZone?: string // Add time zone prop
}

export function DateTimeSelector({
  clinicId,
  staffId,
  appointmentTypeId,
  onSelect,
  selectedDateTime,
  clinicTimeZone = "America/New_York", // Default to Eastern Time
}: DateTimeSelectorProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    selectedDateTime
      ? timeZoneUtils.utcToClinicTime(selectedDateTime, clinicTimeZone)
      : timeZoneUtils.getCurrentTimeInTimeZone(clinicTimeZone),
  )
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)

  // Function to fetch available time slots from the server
  const fetchAvailableTimeSlots = async (date: Date) => {
    if (!staffId || !appointmentTypeId) return

    setLoading(true)
    try {
      // Format date in clinic's time zone
      const formattedDate = timeZoneUtils.formatInTimeZone(date, clinicTimeZone, "yyyy-MM-dd")

      // This would be replaced with an actual API call
      // For now, we'll simulate some time slots
      const response = await fetch(
        `/api/appointments/available-slots?clinicId=${clinicId}&staffId=${staffId}&appointmentTypeId=${appointmentTypeId}&date=${formattedDate}&timeZone=${encodeURIComponent(clinicTimeZone)}`,
      )
      const data = await response.json()

      // Convert time slots to clinic's time zone for display
      const convertedTimeSlots = data.timeSlots.map((slot: TimeSlot) => ({
        ...slot,
        startTime: timeZoneUtils.utcToClinicTime(new Date(slot.startTime), clinicTimeZone),
        endTime: timeZoneUtils.utcToClinicTime(new Date(slot.endTime), clinicTimeZone),
      }))

      setAvailableTimeSlots(convertedTimeSlots)
    } catch (error) {
      console.error("Error fetching time slots:", error)
      setAvailableTimeSlots([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch time slots when date, staff, or appointment type changes
  useEffect(() => {
    if (selectedDate && staffId && appointmentTypeId) {
      fetchAvailableTimeSlots(selectedDate)
    }
  }, [selectedDate, staffId, appointmentTypeId, clinicTimeZone])

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
    }
  }

  // Handle time slot selection
  const handleTimeSelect = (timeSlot: TimeSlot) => {
    if (timeSlot.available) {
      // Convert back to UTC before passing to parent component
      const utcStartTime = timeZoneUtils.clinicTimeToUtc(timeSlot.startTime, clinicTimeZone)
      onSelect(utcStartTime)
    }
  }

  // Group time slots by morning, afternoon, evening
  const morningSlots = availableTimeSlots.filter(
    (slot) => slot.startTime.getHours() >= 0 && slot.startTime.getHours() < 12,
  )

  const afternoonSlots = availableTimeSlots.filter(
    (slot) => slot.startTime.getHours() >= 12 && slot.startTime.getHours() < 17,
  )

  const eveningSlots = availableTimeSlots.filter(
    (slot) => slot.startTime.getHours() >= 17 && slot.startTime.getHours() < 24,
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <h3 className="text-lg font-medium mb-4">Select a Date</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={{ before: new Date() }}
            className="rounded-md border"
          />
          <p className="text-sm text-gray-500 mt-2">All times shown in {clinicTimeZone.replace("_", " ")} time zone</p>
        </div>

        <div className="md:w-1/2">
          <h3 className="text-lg font-medium mb-4">Available Times</h3>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <div className="grid grid-cols-3 gap-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {morningSlots.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Morning</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {morningSlots.map((slot) => (
                      <Button
                        key={slot.startTime.toISOString()}
                        variant={
                          selectedDateTime &&
                          isSameDay(timeZoneUtils.utcToClinicTime(selectedDateTime, clinicTimeZone), slot.startTime) &&
                          timeZoneUtils.utcToClinicTime(selectedDateTime, clinicTimeZone).getHours() ===
                            slot.startTime.getHours() &&
                          timeZoneUtils.utcToClinicTime(selectedDateTime, clinicTimeZone).getMinutes() ===
                            slot.startTime.getMinutes()
                            ? "default"
                            : "outline"
                        }
                        disabled={!slot.available}
                        onClick={() => handleTimeSelect(slot)}
                        className="w-full"
                      >
                        {format(slot.startTime, "h:mm a")}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {afternoonSlots.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Afternoon</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {afternoonSlots.map((slot) => (
                      <Button
                        key={slot.startTime.toISOString()}
                        variant={
                          selectedDateTime &&
                          isSameDay(timeZoneUtils.utcToClinicTime(selectedDateTime, clinicTimeZone), slot.startTime) &&
                          timeZoneUtils.utcToClinicTime(selectedDateTime, clinicTimeZone).getHours() ===
                            slot.startTime.getHours() &&
                          timeZoneUtils.utcToClinicTime(selectedDateTime, clinicTimeZone).getMinutes() ===
                            slot.startTime.getMinutes()
                            ? "default"
                            : "outline"
                        }
                        disabled={!slot.available}
                        onClick={() => handleTimeSelect(slot)}
                        className="w-full"
                      >
                        {format(slot.startTime, "h:mm a")}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {eveningSlots.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Evening</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {eveningSlots.map((slot) => (
                      <Button
                        key={slot.startTime.toISOString()}
                        variant={
                          selectedDateTime &&
                          isSameDay(timeZoneUtils.utcToClinicTime(selectedDateTime, clinicTimeZone), slot.startTime) &&
                          timeZoneUtils.utcToClinicTime(selectedDateTime, clinicTimeZone).getHours() ===
                            slot.startTime.getHours() &&
                          timeZoneUtils.utcToClinicTime(selectedDateTime, clinicTimeZone).getMinutes() ===
                            slot.startTime.getMinutes()
                            ? "default"
                            : "outline"
                        }
                        disabled={!slot.available}
                        onClick={() => handleTimeSelect(slot)}
                        className="w-full"
                      >
                        {format(slot.startTime, "h:mm a")}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {availableTimeSlots.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-6">
                    <Clock className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-center text-gray-500">
                      No available time slots for this date. Please select another date.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

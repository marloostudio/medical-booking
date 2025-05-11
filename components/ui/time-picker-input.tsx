"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimePickerInputProps {
  id?: string
  value: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
}

export function TimePickerInput({ id, value, onChange, className, disabled }: TimePickerInputProps) {
  const [open, setOpen] = useState(false)
  const [hours, setHours] = useState<string>("09")
  const [minutes, setMinutes] = useState<string>("00")
  const [period, setPeriod] = useState<"AM" | "PM">("AM")

  // Parse the input value when it changes
  useEffect(() => {
    if (value) {
      const [hourStr, minuteStr] = value.split(":")
      const hour = Number.parseInt(hourStr, 10)

      if (hour >= 0 && hour <= 23) {
        if (hour === 0) {
          setHours("12")
          setPeriod("AM")
        } else if (hour < 12) {
          setHours(hour.toString().padStart(2, "0"))
          setPeriod("AM")
        } else if (hour === 12) {
          setHours("12")
          setPeriod("PM")
        } else {
          setHours((hour - 12).toString().padStart(2, "0"))
          setPeriod("PM")
        }
      }

      if (minuteStr) {
        setMinutes(minuteStr)
      }
    }
  }, [value])

  // Update the value when hours, minutes, or period changes
  const updateValue = () => {
    let hour = Number.parseInt(hours, 10)

    if (period === "PM" && hour < 12) {
      hour += 12
    } else if (period === "AM" && hour === 12) {
      hour = 0
    }

    const newValue = `${hour.toString().padStart(2, "0")}:${minutes}`
    onChange(newValue)
    setOpen(false)
  }

  // Generate time options
  const hourOptions = Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i).toString().padStart(2, "0"))
  const minuteOptions = Array.from({ length: 4 }, (_, i) => (i * 15).toString().padStart(2, "0"))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id={id}
          disabled={disabled}
          className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground", className)}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value || "Select time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 space-y-4">
          <div className="flex space-x-2">
            <div className="space-y-1">
              <label className="text-xs font-medium">Hour</label>
              <select
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {hourOptions.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Minute</label>
              <select
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {minuteOptions.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Period</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as "AM" | "PM")}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={updateValue}>
              Set Time
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

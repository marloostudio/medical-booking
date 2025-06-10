// Optimized date-fns imports - only import what we need
import { format } from "date-fns/format"
import { parseISO } from "date-fns/parseISO"
import { addDays } from "date-fns/addDays"
import { addHours } from "date-fns/addHours"
import { addMinutes } from "date-fns/addMinutes"
import { isBefore } from "date-fns/isBefore"
import { isAfter } from "date-fns/isAfter"
import { startOfDay } from "date-fns/startOfDay"
import { endOfDay } from "date-fns/endOfDay"
import { startOfWeek } from "date-fns/startOfWeek"
import { endOfWeek } from "date-fns/endOfWeek"
import { startOfMonth } from "date-fns/startOfMonth"
import { endOfMonth } from "date-fns/endOfMonth"
import { differenceInMinutes } from "date-fns/differenceInMinutes"
import { differenceInHours } from "date-fns/differenceInHours"
import { differenceInDays } from "date-fns/differenceInDays"

// Re-export only the functions we use
export {
  format,
  parseISO,
  addDays,
  addHours,
  addMinutes,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
}

// Common date formatting functions
export const formatDate = (date: Date | string) => {
  const dateObj = typeof date === "string" ? parseISO(date) : date
  return format(dateObj, "yyyy-MM-dd")
}

export const formatDateTime = (date: Date | string) => {
  const dateObj = typeof date === "string" ? parseISO(date) : date
  return format(dateObj, "yyyy-MM-dd HH:mm:ss")
}

export const formatTime = (date: Date | string) => {
  const dateObj = typeof date === "string" ? parseISO(date) : date
  return format(dateObj, "HH:mm")
}

export const formatDisplayDate = (date: Date | string) => {
  const dateObj = typeof date === "string" ? parseISO(date) : date
  return format(dateObj, "MMM d, yyyy")
}

export const formatDisplayDateTime = (date: Date | string) => {
  const dateObj = typeof date === "string" ? parseISO(date) : date
  return format(dateObj, "MMM d, yyyy h:mm a")
}

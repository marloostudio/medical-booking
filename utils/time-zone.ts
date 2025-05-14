import { formatInTimeZone } from "date-fns-tz"

export interface TimeZoneUtils {
  formatInTimeZone: (date: Date | number, timeZone: string, formatStr: string) => string
  utcToClinicTime: (utcDate: Date, clinicTimeZone: string) => Date
  clinicTimeToUtc: (localDate: Date, clinicTimeZone: string) => Date
  getCurrentTimeInTimeZone: (timeZone: string) => Date
}

export const timeZoneUtils: TimeZoneUtils = {
  formatInTimeZone: (date: Date | number, timeZone: string, formatStr: string): string => {
    return formatInTimeZone(date, timeZone, formatStr)
  },

  utcToClinicTime: (utcDate: Date, clinicTimeZone: string): Date => {
    // Manual conversion from UTC to clinic time zone
    const isoDate = utcDate.toISOString()
    const localDate = new Date(isoDate)

    // Adjust for time zone difference
    const targetTzOffset = getTimeZoneOffset(clinicTimeZone)
    const localTzOffset = new Date().getTimezoneOffset() * -1
    const offsetDiff = targetTzOffset - localTzOffset

    localDate.setMinutes(localDate.getMinutes() + offsetDiff)
    return localDate
  },

  clinicTimeToUtc: (localDate: Date, clinicTimeZone: string): Date => {
    // Manual conversion from clinic time to UTC
    const targetTzOffset = getTimeZoneOffset(clinicTimeZone)
    const localTzOffset = new Date().getTimezoneOffset() * -1
    const offsetDiff = localTzOffset - targetTzOffset

    const utcDate = new Date(localDate)
    utcDate.setMinutes(utcDate.getMinutes() + offsetDiff)
    return utcDate
  },

  getCurrentTimeInTimeZone: (timeZone: string): Date => {
    // Get current time in the specified time zone
    const now = new Date()
    const formatted = formatInTimeZone(now, timeZone, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    return new Date(formatted)
  },
}

// Helper function to get time zone offset in minutes
function getTimeZoneOffset(timeZone: string): number {
  try {
    // This is a simplified approach - in production, you'd want a more robust solution
    const date = new Date()
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeStyle: "long",
      hour12: false,
    })

    const formatted = formatter.format(date)
    const match = formatted.match(/GMT([+-]\d{2}):(\d{2})/)

    if (match) {
      const hours = Number.parseInt(match[1], 10)
      const minutes = Number.parseInt(match[2], 10)
      return hours * 60 + (hours >= 0 ? minutes : -minutes)
    }

    return 0
  } catch (error) {
    console.error(`Error getting time zone offset for ${timeZone}:`, error)
    return 0
  }
}

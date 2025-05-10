import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ReminderAnalytics } from "@/components/dashboard/reminder-analytics"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Reminder Analytics | BookingLink",
  description: "Track and analyze appointment reminder metrics",
}

export default async function ReminderAnalyticsPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login?callbackUrl=/dashboard/analytics/reminders")
  }

  // Check if user has appropriate permissions
  const userRole = session.user.role
  if (!["SUPER_ADMIN", "CLINIC_OWNER", "ADMIN"].includes(userRole)) {
    redirect("/dashboard")
  }

  const clinicId = session.user.clinicId

  if (!clinicId) {
    redirect("/dashboard")
  }

  return (
    <div className="container mx-auto py-8">
      <ReminderAnalytics clinicId={clinicId} />
    </div>
  )
}

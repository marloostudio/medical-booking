import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ReminderTemplates } from "@/components/dashboard/reminder-templates"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Reminder Templates | BookingLink",
  description: "Manage appointment reminder templates",
}

export default async function ReminderTemplatesPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login?callbackUrl=/dashboard/settings/reminder-templates")
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
      <ReminderTemplates clinicId={clinicId} />
    </div>
  )
}

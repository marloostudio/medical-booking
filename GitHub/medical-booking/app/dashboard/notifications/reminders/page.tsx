import { PageTemplate } from "@/components/dashboard/page-template"

export default function NotificationRemindersPage() {
  return (
    <PageTemplate title="Appointment Reminders" description="Configure automatic reminders for upcoming appointments">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Appointment Reminder Settings</h3>
          <p className="text-gray-500">
            This feature will allow you to configure automatic SMS and email reminders for upcoming appointments.
            <br />
            Coming soon in the next update.
          </p>
        </div>
      </div>
    </PageTemplate>
  )
}

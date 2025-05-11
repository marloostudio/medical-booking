import { PageTemplate } from "@/components/dashboard/page-template"

export default function NotificationTemplatesPage() {
  return (
    <PageTemplate title="Message Templates" description="Customize notification templates for different scenarios">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Message Templates</h3>
          <p className="text-gray-500">
            This feature will allow you to customize message templates for appointment reminders, confirmations, and
            other notifications.
            <br />
            Coming soon in the next update.
          </p>
        </div>
      </div>
    </PageTemplate>
  )
}

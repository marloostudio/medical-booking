import { PageTemplate } from "@/components/dashboard/page-template"

export default function AppointmentAnalyticsPage() {
  return (
    <PageTemplate title="Appointment Analytics" description="View detailed statistics about appointments">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Appointment Analytics</h3>
          <p className="text-gray-500">
            This feature will provide detailed analytics and reports about appointment trends, cancellations, and other
            metrics.
            <br />
            Coming soon in the next update.
          </p>
        </div>
      </div>
    </PageTemplate>
  )
}

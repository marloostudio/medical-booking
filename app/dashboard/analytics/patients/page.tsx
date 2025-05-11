import { PageTemplate } from "@/components/dashboard/page-template"

export default function PatientAnalyticsPage() {
  return (
    <PageTemplate title="Patient Analytics" description="View detailed statistics about your patient base">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Patient Analytics</h3>
          <p className="text-gray-500">
            This feature will provide detailed analytics and reports about patient demographics, visit frequency, and
            other metrics.
            <br />
            Coming soon in the next update.
          </p>
        </div>
      </div>
    </PageTemplate>
  )
}

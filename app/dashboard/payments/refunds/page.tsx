import { PageTemplate } from "@/components/dashboard/page-template"

export default function RefundsPage() {
  return (
    <PageTemplate title="Process Refunds" description="Manage and process refunds for patient payments">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Refund Processing</h3>
          <p className="text-gray-500">
            This feature will allow you to process refunds for patient payments.
            <br />
            Coming soon in the next update.
          </p>
        </div>
      </div>
    </PageTemplate>
  )
}

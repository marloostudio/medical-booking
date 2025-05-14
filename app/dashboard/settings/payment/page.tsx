import { PageTemplate } from "@/components/dashboard/page-template"

export default function PaymentSettingsPage() {
  return (
    <PageTemplate title="Payment Settings" description="Configure payment methods and billing settings">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Settings</h3>
          <p className="text-gray-500">
            This feature will allow you to configure payment methods, billing settings, and financial preferences.
            <br />
            Coming soon in the next update.
          </p>
        </div>
      </div>
    </PageTemplate>
  )
}

import { PageTemplate } from "@/components/dashboard/page-template"

export default function PlatformSettingsPage() {
  return (
    <PageTemplate title="Platform Settings" description="Configure global settings for your clinic platform">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Platform Settings</h3>
          <p className="text-gray-500">
            This feature will allow you to configure global settings like time zone, language, and other platform-wide
            preferences.
            <br />
            Coming soon in the next update.
          </p>
        </div>
      </div>
    </PageTemplate>
  )
}

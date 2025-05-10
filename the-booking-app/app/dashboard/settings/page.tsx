export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p>Update your account settings here.</p>

      <div className="mt-4">
        <a href="/dashboard" className="text-blue-600 hover:underline">
          &larr; Back to Dashboard
        </a>
      </div>
    </div>
  )
}

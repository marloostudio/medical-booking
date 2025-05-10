export const dynamic = "force-dynamic"
export const revalidate = 0

export default function PatientsRemovedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
      <h1 className="text-2xl font-bold mb-4">Patients Dashboard Temporarily Unavailable</h1>
      <p className="mb-6 max-w-md">
        The patients dashboard is currently undergoing maintenance and has been temporarily removed. Please check back
        later or contact support if you need immediate assistance.
      </p>
      <a href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
        Return to Dashboard
      </a>
    </div>
  )
}

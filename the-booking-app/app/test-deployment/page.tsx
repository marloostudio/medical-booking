export default function TestDeploymentPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-teal-600 mb-4">Deployment Test Page</h1>
        <p className="text-gray-600 mb-4">If you can see this page, your deployment is working correctly.</p>
        <div className="bg-teal-50 p-4 rounded-md border border-teal-200">
          <p className="text-sm text-gray-700">Deployment timestamp: {new Date().toISOString()}</p>
        </div>
      </div>
    </div>
  )
}

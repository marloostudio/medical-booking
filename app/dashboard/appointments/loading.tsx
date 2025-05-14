export function AppointmentsPageLoading() {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="h-10 w-64 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-10 w-40 bg-gray-200 animate-pulse rounded"></div>
      </div>

      <div className="mb-6">
        <div className="h-10 w-80 bg-gray-200 animate-pulse rounded"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border rounded-lg p-6 space-y-4">
            <div className="space-y-2">
              <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-start gap-3">
                  <div className="h-9 w-9 bg-gray-200 animate-pulse rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-5 w-1/4 bg-gray-200 animate-pulse rounded mb-1"></div>
                    <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-4">
              <div className="h-10 w-28 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-10 w-28 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Export as default for Next.js automatic loading file detection
export default AppointmentsPageLoading

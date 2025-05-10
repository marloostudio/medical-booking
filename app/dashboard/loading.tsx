export default function DashboardLoading() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="h-8 w-36 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-10 w-28 bg-gray-200 animate-pulse rounded"></div>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-md"></div>
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-md"></div>
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-md"></div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 shadow-sm">
              <div className="pb-2">
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="pt-2">
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="border rounded-lg p-4 shadow-sm col-span-4">
            <div className="pb-2">
              <div className="h-6 w-36 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="pt-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
                    <div>
                      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
                      <div className="h-3 w-16 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  </div>
                  <div>
                    <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-2"></div>
                    <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
              ))}
              <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>

          <div className="border rounded-lg p-4 shadow-sm col-span-3">
            <div className="pb-2">
              <div className="h-6 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-4 w-36 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="pt-2">
              <div className="h-64 w-full bg-gray-200 animate-pulse rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

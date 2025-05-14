export default function LoginLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="h-12 w-48 bg-gray-200 animate-pulse rounded mx-auto mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 animate-pulse rounded mx-auto"></div>
        </div>

        <div className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <div className="h-5 w-20 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div>
              <div className="h-5 w-20 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="flex items-center">
              <div className="h-5 w-5 bg-gray-200 animate-pulse rounded mr-2"></div>
              <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>

          <div>
            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>

          <div className="flex items-center justify-between">
            <div className="h-5 w-40 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

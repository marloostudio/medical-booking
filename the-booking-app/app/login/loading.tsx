export default function LoginLoading() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md animate-pulse">
        <div className="h-7 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>

        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>

          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>

          <div className="h-10 bg-gray-200 rounded mb-4"></div>

          <div className="flex items-center py-2">
            <div className="flex-1 h-px bg-gray-200"></div>
            <div className="px-3 h-4 bg-gray-200 rounded w-8"></div>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="h-10 bg-gray-200 rounded mb-4"></div>
        </div>

        <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mt-4"></div>
      </div>
    </div>
  )
}

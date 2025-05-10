import { Skeleton } from "@/components/ui/skeleton"

export function SystemCheckLoading() {
  return (
    <div className="container py-8">
      <Skeleton className="h-10 w-64 mb-2" />
      <Skeleton className="h-4 w-96 mb-8" />

      <div className="space-y-6">
        <div className="border rounded-lg p-4">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemCheckLoading

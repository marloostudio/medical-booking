import { Skeleton } from "@/components/ui/skeleton"

export function BookingLoading() {
  return (
    <div className="container py-8">
      <Skeleton className="h-10 w-64 mx-auto mb-2" />
      <Skeleton className="h-4 w-96 mx-auto mb-8" />

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-2 w-full mb-2" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function BookingFlowSkeleton() {
  return <BookingLoading />
}

export default BookingLoading

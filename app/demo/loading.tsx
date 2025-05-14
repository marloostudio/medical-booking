import { Skeleton } from "@/components/ui/skeleton"

export function DemoLoading() {
  return (
    <div className="container py-8">
      <Skeleton className="h-10 w-64 mx-auto mb-2" />
      <Skeleton className="h-4 w-96 mx-auto mb-8" />

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default DemoLoading

import { Skeleton } from "@/components/ui/skeleton"

export default function AllPatientsLoading() {
  return (
    <div className="container mx-auto p-6">
      <Skeleton className="w-full h-12 mb-4" />
      <Skeleton className="w-full h-[500px]" />
    </div>
  )
}

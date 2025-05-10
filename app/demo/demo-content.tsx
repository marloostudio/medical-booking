// Convert to server component
import { Suspense } from "react"
import { DemoClient } from "./demo-client"
import { DemoLoading } from "./loading"

export function DemoContent({ view }: { view: string }) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Demo Dashboard</h1>

      <Suspense fallback={<DemoLoading />}>
        <DemoClient initialView={view} />
      </Suspense>
    </div>
  )
}

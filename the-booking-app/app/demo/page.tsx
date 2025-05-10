import { Suspense } from "react"
import { DemoClient } from "./demo-client"

export default function DemoPage({
  searchParams,
}: {
  searchParams: { view?: string }
}) {
  const view = searchParams.view || "patient"

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Demo Dashboard</h1>

      <Suspense fallback={<div>Loading demo...</div>}>
        <DemoClient initialView={view} />
      </Suspense>
    </div>
  )
}

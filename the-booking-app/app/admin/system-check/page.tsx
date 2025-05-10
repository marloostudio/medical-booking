import { Suspense } from "react"
import { SystemCheckClient } from "./client"

export default function SystemCheckPage({
  searchParams,
}: {
  searchParams: { tab?: string; debug?: string }
}) {
  const tab = searchParams.tab || "environment"
  const debug = searchParams.debug === "true"

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">System Check</h1>

      <Suspense fallback={<div>Loading system check...</div>}>
        <SystemCheckClient initialTab={tab} debug={debug} />
      </Suspense>
    </div>
  )
}

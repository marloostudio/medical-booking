// Convert to server component
import { Suspense } from "react"
import { SystemCheckClient } from "./system-check-client"
import { SystemCheckLoading } from "./loading"

export function SystemCheckContent({ tab }: { tab: string }) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">System Check</h1>

      <Suspense fallback={<SystemCheckLoading />}>
        <SystemCheckClient initialTab={tab} />
      </Suspense>
    </div>
  )
}

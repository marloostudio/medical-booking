import { Suspense } from "react"
import { V0DemoContent } from "./v0-demo-content"
import { V0DemoLoading } from "./loading"

// This is a server component by default (no "use client" directive)
export default function V0DemoPage({
  searchParams,
}: {
  searchParams: { feature?: string }
}) {
  // Access searchParams directly as a prop (server-side)
  const feature = searchParams.feature || "default"

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Suspense fallback={<V0DemoLoading />}>
        <V0DemoContent feature={feature} />
      </Suspense>
    </div>
  )
}

// Convert to server component
import { Suspense } from "react"
import { NotFoundClient } from "./not-found-client"

export function NotFoundContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundClient />
    </Suspense>
  )
}

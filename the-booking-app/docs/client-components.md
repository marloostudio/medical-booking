# Client Components in Next.js

## Working with URL Parameters

When working with URL parameters in client components, you have several options:

### 1. Server-Side Parameter Handling (Recommended)

\`\`\`tsx
// page.tsx (Server Component)
export default function Page({ searchParams }) {
  // Handle parameters on the server
  const view = searchParams.view || "default"
  
  // Pass as props to client component
  return <ClientComponent initialView={view} />
}
\`\`\`

### 2. Client-Side Parameter Handling with Suspense

If you need to access URL parameters directly in a client component:

\`\`\`tsx
// page.tsx
import { Suspense } from "react"

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ClientComponentWithSearchParams />
    </Suspense>
  )
}

// client-component.tsx
"use client"
import { useSearchParams } from "next/navigation"

export function ClientComponentWithSearchParams() {
  const searchParams = useSearchParams()
  // Use searchParams here
}
\`\`\`

### 3. Client-Side Navigation

For updating URL parameters without a full page reload:

\`\`\`tsx
"use client"
import { useRouter, usePathname } from "next/navigation"

export function ClientNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  
  const navigate = (params) => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      searchParams.set(key, value)
    })
    router.push(`${pathname}?${searchParams.toString()}`)
  }
}

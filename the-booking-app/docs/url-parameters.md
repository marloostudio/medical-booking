# URL Parameters in Next.js

## Best Practices

### Server Components

In server components, access URL parameters directly from the `searchParams` prop:

\`\`\`tsx
export default function Page({ searchParams }: { searchParams: { view?: string } }) {
  const view = searchParams.view || "default"
  
  return <YourComponent view={view} />
}
\`\`\`

### Client Components

In client components, receive parameters as props from parent server components:

\`\`\`tsx
"use client"

export function ClientComponent({ view }: { view: string }) {
  // Use the view prop directly
  return <div>View: {view}</div>
}
\`\`\`

### Client-Side Navigation

For client-side navigation with URL parameters, use `useRouter` and `usePathname`:

\`\`\`tsx
"use client"
import { useRouter, usePathname } from "next/navigation"

export function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  
  const navigateWithParams = (view) => {
    router.push(`${pathname}?view=${view}`)
  }
  
  return (
    <button onClick={() => navigateWithParams("recent")}>
      Show Recent
    </button>
  )
}
\`\`\`

## What to Avoid

- Do not use `useSearchParams()` directly in client components
- Do not access URL parameters in client components without proper Suspense boundaries
- Do not mix server-side and client-side parameter handling

## Utility Functions

Use the utility functions in `utils/url-params.ts` for consistent parameter handling:

\`\`\`tsx
import { getParam, buildUrl } from "@/utils/url-params"

// In server components
export default function Page({ searchParams }) {
  const view = getParam(searchParams, "view", "default")
  const page = getParam(searchParams, "page", 1)
  
  return <YourComponent view={view} page={page} />
}
\`\`\`

For client-side navigation, use the `useUrlNavigation` hook:

\`\`\`tsx
import { useUrlNavigation } from "@/utils/client-navigation"

export function ClientNavigation() {
  const { navigateWithParams } = useUrlNavigation()
  
  return (
    <button onClick={() => navigateWithParams({ view: "recent", page: 1 })}>
      Show Recent
    </button>
  )
}

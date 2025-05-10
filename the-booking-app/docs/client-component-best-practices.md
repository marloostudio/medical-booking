# Client Component Best Practices

## URL Parameters in Client Components

When working with URL parameters in client components, follow these guidelines:

### ✅ DO: Use Server Components for Initial Parameter Handling

\`\`\`tsx
// page.tsx (Server Component)
export default function Page({ searchParams }) {
  const view = searchParams.view || "default"
  return <ClientComponent initialView={view} />
}
\`\`\`

### ✅ DO: Wrap Client Components Using useSearchParams in Suspense

\`\`\`tsx
// page.tsx
import { Suspense } from "react"

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ClientComponentUsingSearchParams />
    </Suspense>
  )
}
\`\`\`

### ❌ DON'T: Use useSearchParams Without Suspense

\`\`\`tsx
// This will cause deployment errors
export default function Page() {
  return <ClientComponentUsingSearchParams />
}
\`\`\`

### ✅ DO: Use usePathname and useRouter for Client-Side Navigation

\`\`\`tsx
"use client"
import { usePathname, useRouter } from "next/navigation"

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  
  const handleClick = (view) => {
    router.push(`${pathname}?view=${view}`)
  }
}

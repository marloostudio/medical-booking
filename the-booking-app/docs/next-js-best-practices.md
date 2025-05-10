# Next.js Best Practices

## URL Parameters and Client Components

### The Problem with useSearchParams()

In Next.js 15+, the `useSearchParams()` hook requires special handling:

1. It must be wrapped in a Suspense boundary
2. It can cause hydration errors and deployment failures
3. It adds unnecessary client-side JavaScript

### Best Practices

#### 1. Server Component Pattern (Preferred)

\`\`\`tsx
// In a Server Component (page.tsx)
export default function Page({ searchParams }) {
  // Access search params directly as props
  const view = searchParams.view || 'default'
  
  return <ClientComponent view={view} />
}
\`\`\`

#### 2. Dynamic Rendering

For pages that need to use client components with URL parameters, use dynamic rendering:

\`\`\`tsx
// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

export default function Page({ searchParams }) {
  // ...
}
\`\`\`

#### 3. Proper Suspense Boundaries

Always wrap client components using `useSearchParams()` in Suspense:

\`\`\`tsx
import { Suspense } from "react"

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ClientComponentWithSearchParams />
    </Suspense>
  )
}
\`\`\`

#### 4. Client-Side Navigation

For updating URL parameters without a full page reload:

\`\`\`tsx
"use client"
import { useRouter, usePathname } from "next/navigation"

export function ClientNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  
  const navigate = (params) => {
    router.push(`${pathname}?view=${params.view}`)
  }
}
\`\`\`

## Deployment Considerations

1. **Use Dynamic Rendering**: For pages with complex client components, use dynamic rendering.
2. **Avoid Static Generation**: For pages using `useSearchParams()`, disable static generation.
3. **Test Builds Locally**: Run `next build` locally before deploying to catch issues.
4. **Use Middleware**: Consider using middleware to redirect problematic routes.

## ESLint Rules

Add custom ESLint rules to catch potential issues:

\`\`\`js
// .eslintrc.js
module.exports = {
  rules: {
    "no-unsafe-usesearchparams": {
      create: (context) => ({
        CallExpression(node) {
          if (node.callee.name === "useSearchParams" && !isSuspenseBoundaryPresent(node)) {
            context.report({
              node,
              message: "useSearchParams() should be wrapped in a Suspense boundary",
            })
          }
        },
      }),
    },
  },
}

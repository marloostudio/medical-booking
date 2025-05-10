# Pre-Deployment Checklist for BookingLink

This document outlines the steps to check your code before deployment to avoid common deployment errors.

## Automated Checks

Run our pre-deployment script to automatically check for common issues:

\`\`\`bash
npm run pre-deploy
\`\`\`

This script checks for:
- TypeScript compilation errors
- ESLint errors and warnings
- Syntax errors in TypeScript files
- Unbalanced generic type parameters
- Usage of problematic hooks like `useSearchParams()`
- Missing exports in page files
- Client components using server-only features
- Test build errors

## Manual Checks

### 1. Check for `useSearchParams()` Usage

The `useSearchParams()` hook can cause deployment issues if not properly used:

- It should only be used in Client Components (with "use client" directive)
- It should be wrapped in a Suspense boundary
- Consider using server components with searchParams prop instead

### 2. Check Generic Type Parameters

Generic type parameters can cause syntax errors during deployment:

- Use `<T extends unknown>` instead of just `<T>`
- Add spaces in multi-parameter generics: `<T, K>` instead of `<T,K>`
- Run our utility to check for problematic generics:

\`\`\`bash
npm run check-generics
\`\`\`

To automatically fix common generic syntax issues:

\`\`\`bash
npm run fix-generics
\`\`\`

### 3. Verify Page Exports

Every page file must have a default export:

\`\`\`typescript
export default function Page() {
  // ...
}
\`\`\`

### 4. Check Client/Server Component Boundaries

- Client components should not use server-only features
- Server components should not use client-only hooks
- Use proper data passing between server and client components

### 5. Run a Local Build

Always run a local build before deploying:

\`\`\`bash
npm run build
\`\`\`

Fix any errors that occur during the build process.

## Common Deployment Errors

### 1. "T tags are not closed"

This usually indicates a problem with generic type parameters in TypeScript files. Fix by:
- Adding `extends unknown` to generic type parameters
- Using type aliases for complex generic types
- Running our fix-generics script

### 2. "useSearchParams() should be wrapped in a Suspense boundary"

Fix by:
- Wrapping components using useSearchParams in a Suspense boundary
- Converting to server components and using the searchParams prop
- Using our URL parameter utilities instead

### 3. "Module not found" errors

Check:
- Package dependencies are properly installed
- Import paths are correct (case-sensitive)
- The file exists at the specified path

## Client Components and Hooks

- [ ] Ensure all components using `useSearchParams()` are wrapped in Suspense boundaries
- [ ] Verify that server components pass URL parameters as props to client components
- [ ] Check that client-side navigation uses `useRouter()` and `usePathname()` correctly
- [ ] Confirm that all client components have proper error boundaries

## Server Components

- [ ] Verify that server components correctly handle `searchParams` props
- [ ] Ensure that default values are provided for all optional parameters
- [ ] Check that server components pass the correct props to client components

## Performance

- [ ] Minimize client-side JavaScript by using server components where possible
- [ ] Ensure that large dependencies are only imported in server components
- [ ] Verify that images are properly optimized
- [ ] Check that fonts are properly loaded and optimized

## Security

- [ ] Ensure that sensitive environment variables are not exposed to the client
- [ ] Verify that all API routes have proper authentication and authorization
- [ ] Check that forms have CSRF protection
- [ ] Confirm that user input is properly validated and sanitized

## Accessibility

- [ ] Verify that all interactive elements have proper ARIA attributes
- [ ] Ensure that all images have alt text
- [ ] Check that color contrast meets WCAG standards
- [ ] Confirm that keyboard navigation works correctly

## SEO

- [ ] Verify that all pages have proper meta tags
- [ ] Ensure that robots.txt and sitemap.xml are properly configured
- [ ] Check that canonical URLs are properly set
- [ ] Confirm that structured data is properly implemented

## Testing

- [ ] Run automated tests to ensure all functionality works as expected
- [ ] Test the application on different browsers and devices
- [ ] Verify that error handling works correctly
- [ ] Check that loading states are properly displayed

## Deployment

- [ ] Ensure that all environment variables are properly set in the deployment environment
- [ ] Verify that the build process completes successfully
- [ ] Check that the application starts correctly in the production environment
- [ ] Confirm that all routes work correctly in the production environment

## After Deployment

After successful deployment, verify:
- All pages load correctly
- Authentication works
- Forms submit properly
- Navigation works as expected
- No console errors appear

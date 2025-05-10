# Development Workflow

## Code Quality & Standards

### ESLint & Prettier

This project uses ESLint for code linting and Prettier for code formatting.

#### Running Linting

\`\`\`bash
# Check for linting errors
npm run lint

# Fix auto-fixable linting errors
npm run lint:fix

# Check code formatting
npm run format:check

# Format all files
npm run format
\`\`\`

#### Editor Integration

For the best development experience, install the following VS Code extensions:

- ESLint
- Prettier - Code formatter
- TypeScript Importer

### Pre-commit Hooks

We use Husky and lint-staged to ensure code quality:

- **Pre-commit**: Runs ESLint and Prettier on staged files
- **Commit-msg**: Validates commit message format
- **Pre-push**: Runs full linting, type checking, and build

#### Commit Message Format

We follow the Conventional Commits specification:

\`\`\`
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
\`\`\`

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to our CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files

**Examples:**
\`\`\`bash
git commit -m "feat(auth): add role-based access control"
git commit -m "fix(api): resolve user creation validation error"
git commit -m "docs: update API documentation"
\`\`\`

### Type Checking

\`\`\`bash
# Run TypeScript type checking
npm run type-check
\`\`\`

### Full Validation

\`\`\`bash
# Run all checks (type checking, linting, formatting)
npm run validate
\`\`\`

## Authentication Middleware

### Usage Examples

#### Basic Authentication

\`\`\`typescript
import { withAuthHandler } from '@/lib/auth-middleware'

export const GET = withAuthHandler(
  async (request, { user }) => {
    // Your route logic here
    return Response.json({ user: user.email })
  },
  {
    requireAuth: true,
  },
)
\`\`\`

#### Role-Based Access

\`\`\`typescript
export const POST = withAuthHandler(
  async (request, { user }) => {
    // Only admins can access this
    return Response.json({ message: 'Admin only' })
  },
  {
    requireAuth: true,
    requiredRoles: ['SUPER_ADMIN', 'CLINIC_OWNER'],
  },
)
\`\`\`

#### Permission-Based Access

\`\`\`typescript
export const PUT = withAuthHandler(
  async (request, { user }) => {
    // Check specific permissions
    return Response.json({ message: 'Permission granted' })
  },
  {
    requireAuth: true,
    requiredPermission: {
      action: 'update',
      resource: 'patients',
      scope: 'clinic',
    },
  },
)
\`\`\`

#### Clinic-Specific Access

\`\`\`typescript
import { withClinicAuth } from '@/lib/auth-middleware'

export const GET = withAuthHandler(
  async (request, context, params) => {
    const clinicAuthResult = await withClinicAuth(request, params.clinicId)
    
    if (!clinicAuthResult.success) {
      return clinicAuthResult.response
    }

    // User has access to this clinic
    return Response.json({ clinicId: params.clinicId })
  },
)
\`\`\`

### Error Codes

The auth middleware returns standardized error codes:

- `AUTH_REQUIRED`: User not authenticated
- `INSUFFICIENT_ROLE`: User role doesn't meet requirements
- `PERMISSION_DENIED`: User lacks specific permission
- `CLINIC_ACCESS_DENIED`: User doesn't belong to requested clinic
- `RATE_LIMIT_EXCEEDED`: Too many requests

## Development Scripts

\`\`\`bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Check linting
npm run lint:fix        # Fix linting issues
npm run format          # Format code
npm run format:check    # Check formatting
npm run type-check      # TypeScript type checking
npm run validate        # Run all checks

# Bundle Analysis
npm run analyze         # Analyze bundle size

# Git Hooks
npm run prepare         # Install Husky hooks
npm run pre-commit      # Run pre-commit checks manually
\`\`\`

## Best Practices

### File Organization

\`\`\`
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── (auth)/         # Auth-related pages
│   └── dashboard/      # Dashboard pages
├── components/         # React components
│   ├── ui/            # Base UI components
│   ├── auth/          # Auth components
│   └── dashboard/     # Dashboard components
├── lib/               # Utility libraries
├── services/          # Business logic services
├── hooks/             # Custom React hooks
└── types/             # TypeScript type definitions
\`\`\`

### Import Organization

ESLint will automatically organize imports in this order:

1. Node.js built-ins
2. External packages
3. Internal modules
4. Parent directory imports
5. Sibling imports
6. Index imports

### Component Guidelines

1. Use TypeScript for all components
2. Define prop interfaces
3. Use meaningful component and prop names
4. Keep components focused and single-purpose
5. Use custom hooks for complex logic

### API Route Guidelines

1. Use the auth middleware for all protected routes
2. Validate input data with Zod schemas
3. Return consistent error responses
4. Log important actions for auditing
5. Use proper HTTP status codes
\`\`\`

Finally, let me create a setup script to initialize the development environment:

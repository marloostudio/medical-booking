# Super Admin Setup Instructions

This document explains how to create a super admin user for the BookingLink platform.

## Prerequisites

- Access to Firebase project
- Node.js and npm installed
- Access to the project codebase

## Creating a Super Admin User

1. Set the following environment variables:
   \`\`\`
   ADMIN_EMAIL=your-admin-email@example.com
   ADMIN_PASSWORD=secure-password
   ADMIN_NAME="Admin Full Name"
   \`\`\`

2. Run the super admin creation script:
   \`\`\`
   npx ts-node scripts/create-super-admin.ts
   \`\`\`

3. The script will:
   - Create a new user in Firebase Auth (if it doesn't exist)
   - Set the user's role to SUPER_ADMIN
   - Create a user document in Firestore
   - Create an audit log entry

4. After creation, you can log in with the super admin credentials at `/login`

5. Super admin users have access to:
   - `/admin/dashboard`
   - All clinic management features
   - User management
   - System settings

## Troubleshooting

If you encounter issues:

1. Check Firebase Auth console to ensure the user was created
2. Verify the user document exists in Firestore
3. Check that custom claims were properly set
4. Review server logs for any errors during the creation process

For additional help, contact the development team.

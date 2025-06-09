import type { UserRole } from "./role-permissions"

// Define permission types
export type PermissionAction = "view" | "create" | "update" | "delete" | "manage"
export type ResourceType = "clinic" | "staff" | "patient" | "appointment" | "billing" | "settings" | "reports"

// Define permission structure
export interface Permission {
  action: PermissionAction
  resource: ResourceType
  scope?: "own" | "clinic" | "all" // own = only user's own data, clinic = clinic-wide, all = all clinics
}

// Define role-based permissions
export const rolePermissions: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    // Super admin can do everything across all clinics
    { action: "view", resource: "clinic", scope: "all" },
    { action: "create", resource: "clinic", scope: "all" },
    { action: "update", resource: "clinic", scope: "all" },
    { action: "delete", resource: "clinic", scope: "all" },
    { action: "manage", resource: "clinic", scope: "all" },

    { action: "view", resource: "staff", scope: "all" },
    { action: "create", resource: "staff", scope: "all" },
    { action: "update", resource: "staff", scope: "all" },
    { action: "delete", resource: "staff", scope: "all" },

    { action: "view", resource: "patient", scope: "all" },
    { action: "create", resource: "patient", scope: "all" },
    { action: "update", resource: "patient", scope: "all" },
    { action: "delete", resource: "patient", scope: "all" },

    { action: "view", resource: "appointment", scope: "all" },
    { action: "create", resource: "appointment", scope: "all" },
    { action: "update", resource: "appointment", scope: "all" },
    { action: "delete", resource: "appointment", scope: "all" },

    { action: "view", resource: "billing", scope: "all" },
    { action: "create", resource: "billing", scope: "all" },
    { action: "update", resource: "billing", scope: "all" },
    { action: "delete", resource: "billing", scope: "all" },

    { action: "view", resource: "settings", scope: "all" },
    { action: "update", resource: "settings", scope: "all" },

    { action: "view", resource: "reports", scope: "all" },
    { action: "create", resource: "reports", scope: "all" },
  ],

  CLINIC_OWNER: [
    // Clinic owner can manage their own clinic
    { action: "view", resource: "clinic", scope: "own" },
    { action: "update", resource: "clinic", scope: "own" },
    { action: "manage", resource: "clinic", scope: "own" },

    // Clinic owner can manage staff in their clinic
    { action: "view", resource: "staff", scope: "clinic" },
    { action: "create", resource: "staff", scope: "clinic" },
    { action: "update", resource: "staff", scope: "clinic" },
    { action: "delete", resource: "staff", scope: "clinic" },

    // Clinic owner can manage patients in their clinic
    { action: "view", resource: "patient", scope: "clinic" },
    { action: "create", resource: "patient", scope: "clinic" },
    { action: "update", resource: "patient", scope: "clinic" },
    { action: "delete", resource: "patient", scope: "clinic" },

    // Clinic owner can manage appointments in their clinic
    { action: "view", resource: "appointment", scope: "clinic" },
    { action: "create", resource: "appointment", scope: "clinic" },
    { action: "update", resource: "appointment", scope: "clinic" },
    { action: "delete", resource: "appointment", scope: "clinic" },

    // Clinic owner can manage billing in their clinic
    { action: "view", resource: "billing", scope: "clinic" },
    { action: "create", resource: "billing", scope: "clinic" },
    { action: "update", resource: "billing", scope: "clinic" },

    // Clinic owner can manage settings in their clinic
    { action: "view", resource: "settings", scope: "clinic" },
    { action: "update", resource: "settings", scope: "clinic" },

    // Clinic owner can view and create reports in their clinic
    { action: "view", resource: "reports", scope: "clinic" },
    { action: "create", resource: "reports", scope: "clinic" },
  ],

  ADMIN: [
    // Admin can view clinic info
    { action: "view", resource: "clinic", scope: "own" },

    // Admin can manage staff in their clinic (except delete)
    { action: "view", resource: "staff", scope: "clinic" },
    { action: "create", resource: "staff", scope: "clinic" },
    { action: "update", resource: "staff", scope: "clinic" },

    // Admin can manage patients in their clinic
    { action: "view", resource: "patient", scope: "clinic" },
    { action: "create", resource: "patient", scope: "clinic" },
    { action: "update", resource: "patient", scope: "clinic" },
    { action: "delete", resource: "patient", scope: "clinic" },

    // Admin can manage appointments in their clinic
    { action: "view", resource: "appointment", scope: "clinic" },
    { action: "create", resource: "appointment", scope: "clinic" },
    { action: "update", resource: "appointment", scope: "clinic" },
    { action: "delete", resource: "appointment", scope: "clinic" },

    // Admin can view and create billing in their clinic
    { action: "view", resource: "billing", scope: "clinic" },
    { action: "create", resource: "billing", scope: "clinic" },

    // Admin can view settings in their clinic
    { action: "view", resource: "settings", scope: "clinic" },
    { action: "update", resource: "settings", scope: "clinic" },

    // Admin can view and create reports in their clinic
    { action: "view", resource: "reports", scope: "clinic" },
    { action: "create", resource: "reports", scope: "clinic" },
  ],

  MEDICAL_STAFF: [
    // Medical staff can view clinic info
    { action: "view", resource: "clinic", scope: "own" },

    // Medical staff can view staff in their clinic
    { action: "view", resource: "staff", scope: "clinic" },

    // Medical staff can view and update patients in their clinic
    { action: "view", resource: "patient", scope: "clinic" },
    { action: "update", resource: "patient", scope: "clinic" },

    // Medical staff can view and manage their own appointments
    { action: "view", resource: "appointment", scope: "clinic" },
    { action: "create", resource: "appointment", scope: "clinic" },
    { action: "update", resource: "appointment", scope: "clinic" },

    // Medical staff can view reports in their clinic
    { action: "view", resource: "reports", scope: "clinic" },
  ],

  RECEPTIONIST: [
    // Receptionist can view clinic info
    { action: "view", resource: "clinic", scope: "own" },

    // Receptionist can view staff in their clinic
    { action: "view", resource: "staff", scope: "clinic" },

    // Receptionist can manage patients in their clinic (except delete)
    { action: "view", resource: "patient", scope: "clinic" },
    { action: "create", resource: "patient", scope: "clinic" },
    { action: "update", resource: "patient", scope: "clinic" },

    // Receptionist can manage appointments in their clinic
    { action: "view", resource: "appointment", scope: "clinic" },
    { action: "create", resource: "appointment", scope: "clinic" },
    { action: "update", resource: "appointment", scope: "clinic" },
    { action: "delete", resource: "appointment", scope: "clinic" },

    // Receptionist can view billing in their clinic
    { action: "view", resource: "billing", scope: "clinic" },
    { action: "create", resource: "billing", scope: "clinic" },
  ],
}

// Helper function to check if a user has a specific permission
export function hasPermission(
  userRole: UserRole | undefined,
  action: PermissionAction,
  resource: ResourceType,
  scope: "own" | "clinic" | "all" = "own",
): boolean {
  if (!userRole) return false

  const permissions = rolePermissions[userRole]
  if (!permissions) return false

  // Check for exact permission match
  const exactMatch = permissions.some(
    (p) => p.action === action && p.resource === resource && (!p.scope || p.scope === scope),
  )
  if (exactMatch) return true

  // Check for broader scope (if user has 'all' scope, they also have 'clinic' and 'own' scope)
  if (scope === "own" || scope === "clinic") {
    const broaderMatch = permissions.some((p) => p.action === action && p.resource === resource && p.scope === "all")
    if (broaderMatch) return true
  }

  // Check if 'own' scope is requested but user has 'clinic' scope
  if (scope === "own") {
    const clinicMatch = permissions.some((p) => p.action === action && p.resource === resource && p.scope === "clinic")
    if (clinicMatch) return true
  }

  // Check for manage permission (manage includes all other actions)
  const manageMatch = permissions.some(
    (p) =>
      p.action === "manage" &&
      p.resource === resource &&
      (!p.scope || p.scope === scope || p.scope === "all" || (scope === "own" && p.scope === "clinic")),
  )
  if (manageMatch) return true

  return false
}

// Helper function to get all permissions for a role
export function getRolePermissions(userRole: UserRole | undefined): Permission[] {
  if (!userRole) return []
  return rolePermissions[userRole] || []
}

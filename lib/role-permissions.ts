// Define role types
export type UserRole = "SUPER_ADMIN" | "CLINIC_OWNER" | "ADMIN" | "MEDICAL_STAFF" | "RECEPTIONIST"

// Define permissions for each resource
export interface ResourcePermissions {
  view: UserRole[]
  create: UserRole[]
  update: UserRole[]
  delete: UserRole[]
}

// Define all resources and their permissions
export const resourcePermissions: Record<string, ResourcePermissions> = {
  providers: {
    view: ["SUPER_ADMIN", "CLINIC_OWNER", "ADMIN", "MEDICAL_STAFF", "RECEPTIONIST"],
    create: ["SUPER_ADMIN", "CLINIC_OWNER", "ADMIN"],
    update: ["SUPER_ADMIN", "CLINIC_OWNER", "ADMIN"],
    delete: ["SUPER_ADMIN", "CLINIC_OWNER", "ADMIN"],
  },
  patients: {
    view: ["SUPER_ADMIN", "CLINIC_OWNER", "ADMIN", "MEDICAL_STAFF", "RECEPTIONIST"],
    create: ["SUPER_ADMIN", "CLINIC_OWNER", "ADMIN", "RECEPTIONIST"],
    update: ["SUPER_ADMIN", "CLINIC_OWNER", "ADMIN", "MEDICAL_STAFF", "RECEPTIONIST"],
    delete: ["SUPER_ADMIN", "CLINIC_OWNER", "ADMIN"],
  },
  appointments: {
    view: ["SUPER_ADMIN", "CLINIC_OWNER", "ADMIN", "MEDICAL_STAFF", "RECEPTIONIST"],
    create: ["SUPER_ADMIN", "CLINIC_OWNER", "ADMIN", "MEDICAL_STAFF", "RECEPTIONIST"],
    update: ["SUPER_ADMIN", "CLINIC_OWNER", "ADMIN", "MEDICAL_STAFF", "RECEPTIONIST"],
    delete: ["SUPER_ADMIN", "CLINIC_OWNER", "ADMIN", "RECEPTIONIST"],
  },
  clinicSettings: {
    view: ["SUPER_ADMIN", "CLINIC_OWNER", "ADMIN"],
    create: ["SUPER_ADMIN", "CLINIC_OWNER"],
    update: ["SUPER_ADMIN", "CLINIC_OWNER"],
    delete: ["SUPER_ADMIN", "CLINIC_OWNER"],
  },
  staff: {
    view: ["SUPER_ADMIN", "CLINIC_OWNER", "ADMIN"],
    create: ["SUPER_ADMIN", "CLINIC_OWNER"],
    update: ["SUPER_ADMIN", "CLINIC_OWNER"],
    delete: ["SUPER_ADMIN", "CLINIC_OWNER"],
  },
  billing: {
    view: ["SUPER_ADMIN", "CLINIC_OWNER", "ADMIN"],
    create: ["SUPER_ADMIN", "CLINIC_OWNER", "ADMIN"],
    update: ["SUPER_ADMIN", "CLINIC_OWNER", "ADMIN"],
    delete: ["SUPER_ADMIN", "CLINIC_OWNER"],
  },
  reports: {
    view: ["SUPER_ADMIN", "CLINIC_OWNER", "ADMIN"],
    create: ["SUPER_ADMIN", "CLINIC_OWNER", "ADMIN"],
    update: ["SUPER_ADMIN", "CLINIC_OWNER", "ADMIN"],
    delete: ["SUPER_ADMIN", "CLINIC_OWNER", "ADMIN"],
  },
}

// Helper function to check if a user has permission for a specific action on a resource
export function hasPermission(
  role: UserRole | undefined,
  resource: string,
  action: "view" | "create" | "update" | "delete",
): boolean {
  if (!role) return false

  const permissions = resourcePermissions[resource]
  if (!permissions) return false

  return permissions[action].includes(role)
}

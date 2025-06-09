import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Check, Edit, Plus, Shield, Users } from "lucide-react"

const roles = [
  {
    id: "SUPER_ADMIN",
    name: "Super Admin",
    description: "Complete access to all system features and settings",
    userCount: 1,
    isSystemRole: true,
    permissions: {
      patients: { view: true, create: true, update: true, delete: true },
      appointments: { view: true, create: true, update: true, delete: true },
      reports: { view: true, create: true, update: true, delete: true },
      settings: { view: true, create: true, update: true, delete: true },
      users: { view: true, create: true, update: true, delete: true },
      billing: { view: true, create: true, update: true, delete: true },
    },
  },
  {
    id: "CLINIC_OWNER",
    name: "Clinic Owner",
    description: "Full access to clinic settings and data",
    userCount: 2,
    isSystemRole: true,
    permissions: {
      patients: { view: true, create: true, update: true, delete: true },
      appointments: { view: true, create: true, update: true, delete: true },
      reports: { view: true, create: true, update: true, delete: true },
      settings: { view: true, create: true, update: true, delete: false },
      users: { view: true, create: true, update: true, delete: true },
      billing: { view: true, create: true, update: true, delete: false },
    },
  },
  {
    id: "ADMIN",
    name: "Administrator",
    description: "Manage clinic operations and basic settings",
    userCount: 3,
    isSystemRole: true,
    permissions: {
      patients: { view: true, create: true, update: true, delete: false },
      appointments: { view: true, create: true, update: true, delete: true },
      reports: { view: true, create: false, update: false, delete: false },
      settings: { view: true, create: false, update: true, delete: false },
      users: { view: true, create: true, update: true, delete: false },
      billing: { view: true, create: false, update: false, delete: false },
    },
  },
  {
    id: "MEDICAL_STAFF",
    name: "Medical Staff",
    description: "Manage patients and appointments",
    userCount: 8,
    isSystemRole: true,
    permissions: {
      patients: { view: true, create: true, update: true, delete: false },
      appointments: { view: true, create: true, update: true, delete: false },
      reports: { view: true, create: false, update: false, delete: false },
      settings: { view: false, create: false, update: false, delete: false },
      users: { view: false, create: false, update: false, delete: false },
      billing: { view: false, create: false, update: false, delete: false },
    },
  },
  {
    id: "RECEPTIONIST",
    name: "Receptionist",
    description: "Manage appointments and patient information",
    userCount: 5,
    isSystemRole: true,
    permissions: {
      patients: { view: true, create: true, update: false, delete: false },
      appointments: { view: true, create: true, update: true, delete: false },
      reports: { view: false, create: false, update: false, delete: false },
      settings: { view: false, create: false, update: false, delete: false },
      users: { view: false, create: false, update: false, delete: false },
      billing: { view: true, create: true, update: false, delete: false },
    },
  },
  {
    id: "CUSTOM_ROLE_1",
    name: "Billing Specialist",
    description: "Custom role for billing department",
    userCount: 2,
    isSystemRole: false,
    permissions: {
      patients: { view: true, create: false, update: false, delete: false },
      appointments: { view: true, create: false, update: false, delete: false },
      reports: { view: true, create: true, update: false, delete: false },
      settings: { view: false, create: false, update: false, delete: false },
      users: { view: false, create: false, update: false, delete: false },
      billing: { view: true, create: true, update: true, delete: false },
    },
  },
]

const resources = [
  { id: "patients", name: "Patients" },
  { id: "appointments", name: "Appointments" },
  { id: "reports", name: "Reports" },
  { id: "settings", name: "Settings" },
  { id: "users", name: "Users" },
  { id: "billing", name: "Billing" },
]

const actions = [
  { id: "view", name: "View" },
  { id: "create", name: "Create" },
  { id: "update", name: "Update" },
  { id: "delete", name: "Delete" },
]

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/dashboard/users" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Manage Roles</h1>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Roles</CardTitle>
              <CardDescription>Manage user roles and permissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Role
                </Button>

                <div className="text-sm font-medium text-gray-500 mt-4 mb-2">System Roles</div>
                {roles
                  .filter((role) => role.isSystemRole)
                  .map((role) => (
                    <div
                      key={role.id}
                      className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="flex items-center">
                        <Shield
                          className={`h-4 w-4 mr-2 ${role.id === "SUPER_ADMIN" ? "text-red-500" : "text-blue-500"}`}
                        />
                        <span>{role.name}</span>
                      </div>
                      <div className="text-xs text-gray-500">{role.userCount} users</div>
                    </div>
                  ))}

                <div className="text-sm font-medium text-gray-500 mt-4 mb-2">Custom Roles</div>
                {roles
                  .filter((role) => !role.isSystemRole)
                  .map((role) => (
                    <div
                      key={role.id}
                      className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-green-500" />
                        <span>{role.name}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="text-xs text-gray-500 mr-2">{role.userCount} users</div>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                  <span>System roles cannot be deleted, but their permissions can be adjusted.</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                  <span>Create custom roles for specialized job functions.</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                  <span>Changes to role permissions apply to all users with that role.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>Manage what each role can access and modify in the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Resource</TableHead>
                      {actions.map((action) => (
                        <TableHead key={action.id}>{action.name}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell className="font-medium">{resource.name}</TableCell>
                        {actions.map((action) => (
                          <TableCell key={`${resource.id}-${action.id}`}>
                            <Switch id={`${resource.id}-${action.id}`} defaultChecked={true} />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end mt-6">
                <Button variant="outline" className="mr-2">
                  Cancel
                </Button>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

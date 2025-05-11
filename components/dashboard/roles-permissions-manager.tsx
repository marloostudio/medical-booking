"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { db } from "@/lib/firebase"
import { collection, getDocs, doc, setDoc, query, where } from "firebase/firestore"
import { Shield, Save, User, Users, Calendar, Settings, CreditCard, Bell, FileText } from "lucide-react"

type Role = {
  id: string
  name: string
  description: string
  permissions: Record<string, boolean>
}

type StaffMember = {
  id: string
  name: string
  email: string
  role: string
}

const DEFAULT_ROLES: Role[] = [
  {
    id: "clinic_owner",
    name: "Clinic Owner",
    description: "Full access to all clinic features and settings",
    permissions: {
      manage_staff: true,
      manage_patients: true,
      manage_appointments: true,
      manage_settings: true,
      manage_billing: true,
      view_reports: true,
      send_notifications: true,
    },
  },
  {
    id: "admin",
    name: "Administrator",
    description: "Manage clinic operations and staff",
    permissions: {
      manage_staff: true,
      manage_patients: true,
      manage_appointments: true,
      manage_settings: true,
      manage_billing: false,
      view_reports: true,
      send_notifications: true,
    },
  },
  {
    id: "doctor",
    name: "Doctor",
    description: "Medical provider with patient management access",
    permissions: {
      manage_staff: false,
      manage_patients: true,
      manage_appointments: true,
      manage_settings: false,
      manage_billing: false,
      view_reports: true,
      send_notifications: true,
    },
  },
  {
    id: "nurse",
    name: "Nurse",
    description: "Medical staff with limited patient access",
    permissions: {
      manage_staff: false,
      manage_patients: true,
      manage_appointments: true,
      manage_settings: false,
      manage_billing: false,
      view_reports: false,
      send_notifications: true,
    },
  },
  {
    id: "receptionist",
    name: "Receptionist",
    description: "Front desk staff for scheduling and check-ins",
    permissions: {
      manage_staff: false,
      manage_patients: true,
      manage_appointments: true,
      manage_settings: false,
      manage_billing: false,
      view_reports: false,
      send_notifications: true,
    },
  },
]

const PERMISSIONS = [
  {
    id: "manage_staff",
    name: "Manage Staff",
    description: "Add, edit, and remove staff members",
    icon: <Users className="h-4 w-4 mr-2" />,
  },
  {
    id: "manage_patients",
    name: "Manage Patients",
    description: "Add, edit, and view patient records",
    icon: <User className="h-4 w-4 mr-2" />,
  },
  {
    id: "manage_appointments",
    name: "Manage Appointments",
    description: "Schedule, reschedule, and cancel appointments",
    icon: <Calendar className="h-4 w-4 mr-2" />,
  },
  {
    id: "manage_settings",
    name: "Manage Settings",
    description: "Configure clinic settings and preferences",
    icon: <Settings className="h-4 w-4 mr-2" />,
  },
  {
    id: "manage_billing",
    name: "Manage Billing",
    description: "Process payments and manage financial records",
    icon: <CreditCard className="h-4 w-4 mr-2" />,
  },
  {
    id: "view_reports",
    name: "View Reports",
    description: "Access analytics and reporting features",
    icon: <FileText className="h-4 w-4 mr-2" />,
  },
  {
    id: "send_notifications",
    name: "Send Notifications",
    description: "Send reminders and messages to patients",
    icon: <Bell className="h-4 w-4 mr-2" />,
  },
]

export function RolesPermissionsManager() {
  const { toast } = useToast()
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES)
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Temporary clinic ID for development
  const clinicId = "demo-clinic-123"

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch roles
      const rolesQuery = query(collection(db, "roles"), where("clinicId", "==", clinicId))
      const rolesSnapshot = await getDocs(rolesQuery)

      if (!rolesSnapshot.empty) {
        const rolesList: Role[] = []
        rolesSnapshot.forEach((doc) => {
          rolesList.push(doc.data() as Role)
        })
        setRoles(rolesList)
      } else {
        // If no roles exist yet, use defaults
        setRoles(DEFAULT_ROLES)
      }

      // Fetch staff members
      const staffQuery = query(collection(db, "users"), where("clinicId", "==", clinicId))
      const staffSnapshot = await getDocs(staffQuery)
      const staffList: StaffMember[] = []

      staffSnapshot.forEach((doc) => {
        const data = doc.data()
        staffList.push({
          id: doc.id,
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          role: data.role || "undefined",
        })
      })

      setStaffMembers(staffList)
    } catch (err) {
      console.error("Error fetching roles and staff:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load roles and permissions. Using defaults.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePermissionChange = (roleId: string, permissionId: string, checked: boolean) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) => {
        if (role.id === roleId) {
          return {
            ...role,
            permissions: {
              ...role.permissions,
              [permissionId]: checked,
            },
          }
        }
        return role
      }),
    )
  }

  const saveRoles = async () => {
    setSaving(true)
    try {
      // Save each role to Firestore
      for (const role of roles) {
        await setDoc(doc(db, "roles", role.id), {
          ...role,
          clinicId,
          updatedAt: new Date(),
        })
      }

      toast({
        title: "Roles saved",
        description: "Role permissions have been updated successfully.",
      })
    } catch (err) {
      console.error("Error saving roles:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save role permissions. Please try again.",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="roles" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="roles">Role Permissions</TabsTrigger>
          <TabsTrigger value="staff">Staff Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-600" />
                  Role Permissions
                </CardTitle>
                <CardDescription>Configure what each role can access and modify</CardDescription>
              </div>
              <Button onClick={saveRoles} disabled={saving}>
                {saving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading roles and permissions...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Permission</TableHead>
                      {roles.map((role) => (
                        <TableHead key={role.id} className="text-center">
                          {role.name}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PERMISSIONS.map((permission) => (
                      <TableRow key={permission.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {permission.icon}
                            <div>
                              <div>{permission.name}</div>
                              <div className="text-xs text-gray-500">{permission.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        {roles.map((role) => (
                          <TableCell key={`${role.id}-${permission.id}`} className="text-center">
                            <Checkbox
                              checked={role.permissions[permission.id] || false}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(role.id, permission.id, checked === true)
                              }
                              disabled={role.id === "clinic_owner"} // Clinic owner always has all permissions
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <p className="text-sm text-gray-500">
                Note: The Clinic Owner role always has full permissions and cannot be modified.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Staff Role Assignments
              </CardTitle>
              <CardDescription>View and manage which staff members have which roles</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading staff members...</div>
              ) : staffMembers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No staff members found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Current Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffMembers.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell className="font-medium">{staff.name}</TableCell>
                        <TableCell>{staff.email}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {staff.role.replace("_", " ")}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Change Role
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

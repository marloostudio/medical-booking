"use client"

import { useState } from "react"
import Link from "next/link"
import { Building, Users, CreditCard, Shield, PlusCircle, Trash2, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

// Sample data for testing
const initialClinics = [
  {
    id: 1,
    name: "City Medical Center",
    owner: "Dr. James Wilson",
    email: "info@citymedical.com",
    plan: "Premium",
    status: "Active",
    staff: 12,
    patients: 1450,
  },
  {
    id: 2,
    name: "Westside Health Clinic",
    owner: "Dr. Emily Chen",
    email: "contact@westsidehealth.com",
    plan: "Basic",
    status: "Active",
    staff: 5,
    patients: 780,
  },
  {
    id: 3,
    name: "North Valley Medical",
    owner: "Dr. Robert Johnson",
    email: "admin@northvalleymed.com",
    plan: "Premium",
    status: "Active",
    staff: 8,
    patients: 1120,
  },
  {
    id: 4,
    name: "Sunshine Pediatrics",
    owner: "Dr. Sarah Miller",
    email: "info@sunshinepediatrics.com",
    plan: "Basic",
    status: "Inactive",
    staff: 4,
    patients: 650,
  },
  {
    id: 5,
    name: "Downtown Family Practice",
    owner: "Dr. Michael Brown",
    email: "contact@downtownfamily.com",
    plan: "Premium",
    status: "Active",
    staff: 10,
    patients: 1320,
  },
]

const initialUsers = [
  {
    id: 1,
    name: "Dr. James Wilson",
    email: "james.wilson@citymedical.com",
    role: "CLINIC_OWNER",
    clinic: "City Medical Center",
    status: "Active",
  },
  {
    id: 2,
    name: "Dr. Emily Chen",
    email: "emily.chen@westsidehealth.com",
    role: "CLINIC_OWNER",
    clinic: "Westside Health Clinic",
    status: "Active",
  },
  {
    id: 3,
    name: "Dr. Robert Johnson",
    email: "robert.johnson@northvalleymed.com",
    role: "CLINIC_OWNER",
    clinic: "North Valley Medical",
    status: "Active",
  },
  {
    id: 4,
    name: "Dr. Sarah Miller",
    email: "sarah.miller@sunshinepediatrics.com",
    role: "CLINIC_OWNER",
    clinic: "Sunshine Pediatrics",
    status: "Inactive",
  },
  {
    id: 5,
    name: "Dr. Michael Brown",
    email: "michael.brown@downtownfamily.com",
    role: "CLINIC_OWNER",
    clinic: "Downtown Family Practice",
    status: "Active",
  },
  {
    id: 6,
    name: "John Smith",
    email: "john.smith@citymedical.com",
    role: "ADMIN",
    clinic: "City Medical Center",
    status: "Active",
  },
  {
    id: 7,
    name: "Lisa Johnson",
    email: "lisa.johnson@citymedical.com",
    role: "RECEPTIONIST",
    clinic: "City Medical Center",
    status: "Active",
  },
  {
    id: 8,
    name: "Mark Davis",
    email: "mark.davis@citymedical.com",
    role: "MEDICAL_STAFF",
    clinic: "City Medical Center",
    status: "Active",
  },
]

export default function DevAdminDashboard() {
  const [clinics, setClinics] = useState(initialClinics)
  const [users, setUsers] = useState(initialUsers)
  const [newClinic, setNewClinic] = useState({
    name: "",
    owner: "",
    email: "",
    plan: "Basic",
    status: "Active",
    staff: 0,
    patients: 0,
  })
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "CLINIC_OWNER",
    clinic: "",
    status: "Active",
  })

  // Add new clinic
  const handleAddClinic = () => {
    const id = clinics.length > 0 ? Math.max(...clinics.map((c) => c.id)) + 1 : 1
    setClinics([...clinics, { id, ...newClinic }])
    setNewClinic({
      name: "",
      owner: "",
      email: "",
      plan: "Basic",
      status: "Active",
      staff: 0,
      patients: 0,
    })
  }

  // Add new user
  const handleAddUser = () => {
    const id = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1
    setUsers([...users, { id, ...newUser }])
    setNewUser({
      name: "",
      email: "",
      role: "CLINIC_OWNER",
      clinic: "",
      status: "Active",
    })
  }

  // Delete clinic
  const handleDeleteClinic = (id: number) => {
    setClinics(clinics.filter((clinic) => clinic.id !== id))
  }

  // Delete user
  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  // Toggle clinic status
  const toggleClinicStatus = (id: number) => {
    setClinics(
      clinics.map((clinic) =>
        clinic.id === id ? { ...clinic, status: clinic.status === "Active" ? "Inactive" : "Active" } : clinic,
      ),
    )
  }

  // Toggle user status
  const toggleUserStatus = (id: number) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" } : user,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Super Admin Dashboard (Dev Mode)</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
                Development Environment
              </span>
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                Back to Home
              </Link>
            </div>
          </div>
        </header>

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col space-y-8">
              {/* Dashboard Overview */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Clinics</p>
                        <p className="text-3xl font-bold">{clinics.length}</p>
                      </div>
                      <Building className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Users</p>
                        <p className="text-3xl font-bold">{users.length}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Premium Clinics</p>
                        <p className="text-3xl font-bold">{clinics.filter((c) => c.plan === "Premium").length}</p>
                      </div>
                      <CreditCard className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Active Clinics</p>
                        <p className="text-3xl font-bold">{clinics.filter((c) => c.status === "Active").length}</p>
                      </div>
                      <Shield className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Tabs */}
              <Tabs defaultValue="clinics" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="clinics">Clinics</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="settings">Platform Settings</TabsTrigger>
                </TabsList>

                {/* Clinics Tab */}
                <TabsContent value="clinics" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Clinics</h2>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Clinic
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Clinic</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Clinic Name</Label>
                            <Input
                              id="name"
                              value={newClinic.name}
                              onChange={(e) => setNewClinic({ ...newClinic, name: e.target.value })}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="owner">Owner Name</Label>
                            <Input
                              id="owner"
                              value={newClinic.owner}
                              onChange={(e) => setNewClinic({ ...newClinic, owner: e.target.value })}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={newClinic.email}
                              onChange={(e) => setNewClinic({ ...newClinic, email: e.target.value })}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="plan">Subscription Plan</Label>
                            <Select
                              value={newClinic.plan}
                              onValueChange={(value) => setNewClinic({ ...newClinic, plan: value })}
                            >
                              <SelectTrigger id="plan">
                                <SelectValue placeholder="Select plan" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Basic">Basic</SelectItem>
                                <SelectItem value="Premium">Premium</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button onClick={handleAddClinic}>Add Clinic</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <Card>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Owner</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Plan</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Staff</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Patients</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {clinics.map((clinic) => (
                              <tr key={clinic.id} className="border-b">
                                <td className="px-4 py-3 text-sm">{clinic.name}</td>
                                <td className="px-4 py-3 text-sm">{clinic.owner}</td>
                                <td className="px-4 py-3 text-sm">{clinic.email}</td>
                                <td className="px-4 py-3 text-sm">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      clinic.plan === "Premium"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {clinic.plan}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      clinic.status === "Active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {clinic.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm">{clinic.staff}</td>
                                <td className="px-4 py-3 text-sm">{clinic.patients}</td>
                                <td className="px-4 py-3 text-sm">
                                  <div className="flex space-x-2">
                                    <Button variant="ghost" size="sm" onClick={() => toggleClinicStatus(clinic.id)}>
                                      {clinic.status === "Active" ? (
                                        <XCircle className="h-4 w-4 text-red-500" />
                                      ) : (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                      )}
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteClinic(clinic.id)}>
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Users Tab */}
                <TabsContent value="users" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Users</h2>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add User
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New User</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              value={newUser.name}
                              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={newUser.email}
                              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                              value={newUser.role}
                              onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                            >
                              <SelectTrigger id="role">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                                <SelectItem value="CLINIC_OWNER">Clinic Owner</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                                <SelectItem value="MEDICAL_STAFF">Medical Staff</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="clinic">Clinic</Label>
                            <Select
                              value={newUser.clinic}
                              onValueChange={(value) => setNewUser({ ...newUser, clinic: value })}
                            >
                              <SelectTrigger id="clinic">
                                <SelectValue placeholder="Select clinic" />
                              </SelectTrigger>
                              <SelectContent>
                                {clinics.map((clinic) => (
                                  <SelectItem key={clinic.id} value={clinic.name}>
                                    {clinic.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button onClick={handleAddUser}>Add User</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <Card>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Role</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Clinic</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.map((user) => (
                              <tr key={user.id} className="border-b">
                                <td className="px-4 py-3 text-sm">{user.name}</td>
                                <td className="px-4 py-3 text-sm">{user.email}</td>
                                <td className="px-4 py-3 text-sm">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      user.role === "SUPER_ADMIN"
                                        ? "bg-red-100 text-red-800"
                                        : user.role === "CLINIC_OWNER"
                                          ? "bg-purple-100 text-purple-800"
                                          : user.role === "ADMIN"
                                            ? "bg-blue-100 text-blue-800"
                                            : user.role === "RECEPTIONIST"
                                              ? "bg-green-100 text-green-800"
                                              : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {user.role.replace("_", " ")}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm">{user.clinic}</td>
                                <td className="px-4 py-3 text-sm">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      user.status === "Active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {user.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  <div className="flex space-x-2">
                                    <Button variant="ghost" size="sm" onClick={() => toggleUserStatus(user.id)}>
                                      {user.status === "Active" ? (
                                        <XCircle className="h-4 w-4 text-red-500" />
                                      ) : (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                      )}
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-4">
                  <h2 className="text-xl font-semibold">Platform Settings</h2>

                  <Card>
                    <CardHeader>
                      <CardTitle>General Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-medium">Maintenance Mode</h3>
                          <p className="text-sm text-gray-500">Put the platform in maintenance mode</p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-medium">New Registrations</h3>
                          <p className="text-sm text-gray-500">Allow new clinic registrations</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-medium">Email Notifications</h3>
                          <p className="text-sm text-gray-500">Send system notifications to admins</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="supportEmail">Support Email</Label>
                        <Input id="supportEmail" defaultValue="support@bookinglink.app" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxClinics">Maximum Clinics Per Owner</Label>
                        <Input id="maxClinics" type="number" defaultValue="3" />
                      </div>

                      <Button>Save Settings</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Subscription Plans</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-medium">Basic Plan</h3>
                          <div className="flex items-center space-x-2">
                            <Input className="w-24" type="number" defaultValue="49.99" />
                            <span>/month</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Up to 5 staff members</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">1,000 patient records</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Basic appointment scheduling</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Email reminders</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-medium">Premium Plan</h3>
                          <div className="flex items-center space-x-2">
                            <Input className="w-24" type="number" defaultValue="99.99" />
                            <span>/month</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Unlimited staff members</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Unlimited patient records</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Advanced scheduling with recurring appointments</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">SMS and email reminders</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Advanced analytics and reporting</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Priority support</span>
                          </div>
                        </div>
                      </div>

                      <Button>Update Plans</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

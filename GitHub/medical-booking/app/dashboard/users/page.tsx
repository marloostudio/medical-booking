import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Plus, UserSearch, Users, UserPlus } from "lucide-react"

// This would normally fetch data from the database
const UsersList = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Staff Members</h2>
        <Link href="/dashboard/users/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Dr. Sample User {i + 1}</div>
                  <div className="text-sm text-gray-500">{i % 2 === 0 ? "Medical Staff" : "Receptionist"}</div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Email: </span>
                  <span className="text-gray-500">user{i + 1}@example.com</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Status: </span>
                  <span className={`${i % 3 === 0 ? "text-amber-500" : "text-green-500"}`}>
                    {i % 3 === 0 ? "Pending" : "Active"}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

const UsersLoading = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-28" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage staff members, set permissions, and invite new users.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/users/add">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add New User
              </Button>
            </Link>
            <Link href="/dashboard/users/invite">
              <Button className="w-full justify-start" variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </Link>
            <Link href="/dashboard/users/roles">
              <Button className="w-full justify-start" variant="outline">
                <UserSearch className="h-4 w-4 mr-2" />
                Manage Roles
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <Suspense fallback={<UsersLoading />}>
              <UsersList />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

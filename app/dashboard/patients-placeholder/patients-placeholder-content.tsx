"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export default function PatientsPlaceholderContent() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Patients</h2>
      </div>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Patient Management Temporarily Unavailable</AlertTitle>
        <AlertDescription>
          The patient management section is currently being updated. We apologize for any inconvenience.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Patient Management</CardTitle>
          <CardDescription>This section is currently under maintenance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The patient management functionality is temporarily unavailable while we make improvements to the system.
            We're working to bring this feature back online as soon as possible.
          </p>

          <p>In the meantime, you can still access other parts of the dashboard:</p>

          <div className="flex flex-col space-y-2">
            <Link href="/dashboard">
              <Button variant="outline" className="w-full justify-start">
                Return to Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/appointments">
              <Button variant="outline" className="w-full justify-start">
                Manage Appointments
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="outline" className="w-full justify-start">
                Adjust Settings
              </Button>
            </Link>
          </div>

          <div className="rounded-md bg-blue-50 p-4 mt-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Coming Soon</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>We're working on an improved patient management system with enhanced features:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Streamlined patient records</li>
                    <li>Enhanced search capabilities</li>
                    <li>Improved appointment history</li>
                    <li>Better integration with appointment scheduling</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

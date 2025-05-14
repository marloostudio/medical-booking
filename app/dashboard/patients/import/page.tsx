"use client"
import { PageTemplate } from "@/components/dashboard/page-template"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileUp, Clock } from "lucide-react"
import Link from "next/link"

export default function ImportPatientsPage() {
  return (
    <PageTemplate title="Import Patients" description="Import patient records from external sources">
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Clock className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
            <p className="text-gray-500 mb-6">
              We're working on a feature to let you import patients from CSV and Excel files. This feature will be
              available in the next update.
            </p>
            <div className="flex gap-4">
              <Link href="/dashboard/patients/all">
                <Button variant="outline">View All Patients</Button>
              </Link>
              <Link href="/dashboard/patients/new">
                <Button>
                  <FileUp className="h-4 w-4 mr-2" />
                  Add Patient Manually
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  )
}

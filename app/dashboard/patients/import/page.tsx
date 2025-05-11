"use client"

import type React from "react"

import { useState, useRef } from "react"
import { PageTemplate } from "@/components/dashboard/page-template"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, AlertCircle, CheckCircle, Download, FileText } from "lucide-react"
import { patientImportService, type ImportResult } from "@/services/patient-import-service"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

export default function ImportPatientsPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [validating, setValidating] = useState(false)
  const [importing, setImporting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [progress, setProgress] = useState(0)
  const [clinicId, setClinicId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get clinic ID
  useState(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login")
        return
      }

      try {
        // Get user data to find clinic ID
        const userDoc = await getDoc(doc(db, "users", user.uid))

        if (!userDoc.exists()) {
          throw new Error("User profile not found")
        }

        const userData = userDoc.data()
        const userClinicId = userData.clinicId

        if (!userClinicId) {
          throw new Error("No clinic associated with this user")
        }

        setClinicId(userClinicId)
      } catch (error) {
        console.error("Error getting clinic ID:", error)
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setValidationErrors([])
    setImportResult(null)

    // Validate the file
    setValidating(true)
    try {
      const result = await patientImportService.validateCsvFile(selectedFile)
      if (!result.valid) {
        setValidationErrors(result.errors)
      }
    } catch (error) {
      console.error("Error validating file:", error)
      setValidationErrors(["An error occurred while validating the file."])
    } finally {
      setValidating(false)
    }
  }

  const handleImport = async () => {
    if (!file || !clinicId) return

    setImporting(true)
    setProgress(0)
    try {
      const result = await patientImportService.importPatients(clinicId, file, setProgress)
      setImportResult(result)
    } catch (error) {
      console.error("Error importing patients:", error)
      setValidationErrors(["An error occurred while importing patients."])
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = (format: "csv" | "excel") => {
    const template = patientImportService.generateCsvTemplate()
    const blob = new Blob([template], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = format === "csv" ? "patient-import-template.csv" : "patient-import-template.xlsx"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <PageTemplate title="Import Patients" description="Import patient records from external sources">
      <Card>
        <CardHeader>
          <CardTitle>Import Patient Records</CardTitle>
          <CardDescription>Upload a CSV or Excel file with patient data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Validation Errors</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {importResult && (
            <Alert
              className={importResult.failed === 0 ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}
            >
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Import Complete</AlertTitle>
              <AlertDescription>
                <p className="mt-2">
                  Total records: {importResult.total}
                  <br />
                  Successfully imported: {importResult.successful}
                  <br />
                  Failed: {importResult.failed}
                </p>
                {importResult.errors.length > 0 && (
                  <>
                    <p className="mt-2 font-medium">Errors:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {importResult.errors.slice(0, 5).map((error, index) => (
                        <li key={index}>
                          Row {error.row}: {error.message}
                        </li>
                      ))}
                      {importResult.errors.length > 5 && <li>...and {importResult.errors.length - 5} more errors</li>}
                    </ul>
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center">
            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Drag and drop your file here</h3>
            <p className="text-sm text-gray-500 mb-4">or</p>
            <div className="flex justify-center">
              <Label htmlFor="file-upload" className="cursor-pointer">
                <div className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                  Browse Files
                </div>
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </Label>
            </div>
            <p className="text-xs text-gray-500 mt-4">Supported formats: CSV, Excel (.xlsx, .xls)</p>
          </div>

          {file && (
            <div className="flex items-center space-x-2 p-4 border rounded-md">
              <FileText className="h-5 w-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFile(null)
                  setValidationErrors([])
                  setImportResult(null)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                  }
                }}
              >
                Remove
              </Button>
            </div>
          )}

          {importing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Importing patients...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium mb-4">Template and Instructions</h3>
            <p className="text-sm text-gray-600 mb-4">
              Download our template file to ensure your data is formatted correctly for import. The template includes
              all required fields and examples.
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" size="sm" onClick={() => downloadTemplate("csv")}>
                <Download className="h-4 w-4 mr-2" />
                Download CSV Template
              </Button>
              <Button variant="outline" size="sm" onClick={() => downloadTemplate("excel")}>
                <Download className="h-4 w-4 mr-2" />
                Download Excel Template
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Required Fields</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Required</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>Patient's first name</TableCell>
                  <TableCell>Yes</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Patient's last name</TableCell>
                  <TableCell>Yes</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Date of Birth</TableCell>
                  <TableCell>Format: YYYY-MM-DD</TableCell>
                  <TableCell>Yes</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Valid email address</TableCell>
                  <TableCell>Yes</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Phone</TableCell>
                  <TableCell>Primary contact number</TableCell>
                  <TableCell>Yes</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Gender</TableCell>
                  <TableCell>male, female, other</TableCell>
                  <TableCell>Yes</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Address</TableCell>
                  <TableCell>Street address</TableCell>
                  <TableCell>No</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleImport} disabled={!file || validationErrors.length > 0 || importing || validating}>
            {importing ? "Importing..." : "Import Patients"}
          </Button>
        </CardFooter>
      </Card>
    </PageTemplate>
  )
}

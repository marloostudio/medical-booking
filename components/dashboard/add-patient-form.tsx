"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { patientService } from "@/services/patient-service"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

// Define the form schema
const patientFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  emergencyContact: z.object({
    name: z.string().min(1, "Emergency contact name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
  }),
  insuranceInfo: z.object({
    provider: z.string().min(1, "Insurance provider is required"),
    policyNumber: z.string().min(1, "Policy number is required"),
    groupNumber: z.string().optional(),
  }),
  medicalHistory: z
    .object({
      allergies: z.array(z.string()).optional(),
      medications: z.array(z.string()).optional(),
      conditions: z.array(z.string()).optional(),
      surgeries: z.array(z.string()).optional(),
      familyHistory: z.array(z.string()).optional(),
    })
    .optional(),
  notes: z.string().optional(),
})

type PatientFormValues = z.infer<typeof patientFormSchema>

export function AddPatientForm({ clinicId }: { clinicId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Initialize the form with default values
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "United States",
      },
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
      insuranceInfo: {
        provider: "",
        policyNumber: "",
        groupNumber: "",
      },
      medicalHistory: {
        allergies: [],
        medications: [],
        conditions: [],
        surgeries: [],
        familyHistory: [],
      },
      notes: "",
    },
  })

  // Handle form submission
  const onSubmit = async (data: PatientFormValues) => {
    setIsSubmitting(true)
    try {
      // Convert string arrays to actual arrays if they're comma-separated strings
      const processedData = {
        ...data,
        medicalHistory: {
          allergies: processStringArrayField(data.medicalHistory?.allergies),
          medications: processStringArrayField(data.medicalHistory?.medications),
          conditions: processStringArrayField(data.medicalHistory?.conditions),
          surgeries: processStringArrayField(data.medicalHistory?.surgeries),
          familyHistory: processStringArrayField(data.medicalHistory?.familyHistory),
        },
      }

      // Create the patient in the database
      const patient = await patientService.createPatient(clinicId, processedData)

      toast({
        title: "Patient Added",
        description: `${patient.firstName} ${patient.lastName} has been added successfully.`,
      })

      // Redirect to the patient details page
      router.push(`/dashboard/patients/${patient.id}`)
    } catch (error) {
      console.error("Error adding patient:", error)
      toast({
        title: "Error",
        description: "Failed to add patient. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to process string array fields
  const processStringArrayField = (field: string[] | undefined) => {
    if (!field || field.length === 0) return []

    // If the first item is a comma-separated string, split it
    if (field.length === 1 && field[0].includes(",")) {
      return field[0]
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    }

    return field
  }

  // Handle adding items to array fields
  const [newAllergy, setNewAllergy] = useState("")
  const [newMedication, setNewMedication] = useState("")
  const [newCondition, setNewCondition] = useState("")
  const [newSurgery, setNewSurgery] = useState("")
  const [newFamilyHistory, setNewFamilyHistory] = useState("")

  const addToArrayField = (field: string, value: string, setter: (value: string) => void) => {
    if (!value.trim()) return

    const currentValues = form.getValues(`medicalHistory.${field}` as any) || []
    form.setValue(`medicalHistory.${field}` as any, [...currentValues, value.trim()])
    setter("")
  }

  const removeFromArrayField = (field: string, index: number) => {
    const currentValues = form.getValues(`medicalHistory.${field}` as any) || []
    const newValues = [...currentValues]
    newValues.splice(index, 1)
    form.setValue(`medicalHistory.${field}` as any, newValues)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add New Patient</CardTitle>
        <CardDescription>Enter the patient's information to create a new record.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="contact">Contact & Address</TabsTrigger>
                <TabsTrigger value="insurance">Insurance</TabsTrigger>
                <TabsTrigger value="medical">Medical History</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Contact & Address Tab */}
              <TabsContent value="contact" className="space-y-4">
                <FormField
                  control={form.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Anytown" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="CA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="address.postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="United States" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <h3 className="text-lg font-medium mt-6 mb-2">Emergency Contact</h3>

                <FormField
                  control={form.control}
                  name="emergencyContact.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="emergencyContact.relationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship</FormLabel>
                        <FormControl>
                          <Input placeholder="Spouse" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emergencyContact.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 987-6543" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Insurance Tab */}
              <TabsContent value="insurance" className="space-y-4">
                <FormField
                  control={form.control}
                  name="insuranceInfo.provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Provider</FormLabel>
                      <FormControl>
                        <Input placeholder="Blue Cross Blue Shield" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="insuranceInfo.policyNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Policy Number</FormLabel>
                        <FormControl>
                          <Input placeholder="XYZ123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="insuranceInfo.groupNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group Number (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="GRP987654" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Medical History Tab */}
              <TabsContent value="medical" className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Allergies</h3>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add allergy"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addToArrayField("allergies", newAllergy, setNewAllergy)
                        }
                      }}
                    />
                    <Button type="button" onClick={() => addToArrayField("allergies", newAllergy, setNewAllergy)}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch("medicalHistory.allergies")?.map((allergy, index) => (
                      <div key={index} className="bg-muted px-3 py-1 rounded-full flex items-center gap-2">
                        <span>{allergy}</span>
                        <button
                          type="button"
                          onClick={() => removeFromArrayField("allergies", index)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Medications</h3>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add medication"
                      value={newMedication}
                      onChange={(e) => setNewMedication(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addToArrayField("medications", newMedication, setNewMedication)
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => addToArrayField("medications", newMedication, setNewMedication)}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch("medicalHistory.medications")?.map((medication, index) => (
                      <div key={index} className="bg-muted px-3 py-1 rounded-full flex items-center gap-2">
                        <span>{medication}</span>
                        <button
                          type="button"
                          onClick={() => removeFromArrayField("medications", index)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Medical Conditions</h3>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add condition"
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addToArrayField("conditions", newCondition, setNewCondition)
                        }
                      }}
                    />
                    <Button type="button" onClick={() => addToArrayField("conditions", newCondition, setNewCondition)}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch("medicalHistory.conditions")?.map((condition, index) => (
                      <div key={index} className="bg-muted px-3 py-1 rounded-full flex items-center gap-2">
                        <span>{condition}</span>
                        <button
                          type="button"
                          onClick={() => removeFromArrayField("conditions", index)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Past Surgeries</h3>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add surgery"
                      value={newSurgery}
                      onChange={(e) => setNewSurgery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addToArrayField("surgeries", newSurgery, setNewSurgery)
                        }
                      }}
                    />
                    <Button type="button" onClick={() => addToArrayField("surgeries", newSurgery, setNewSurgery)}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch("medicalHistory.surgeries")?.map((surgery, index) => (
                      <div key={index} className="bg-muted px-3 py-1 rounded-full flex items-center gap-2">
                        <span>{surgery}</span>
                        <button
                          type="button"
                          onClick={() => removeFromArrayField("surgeries", index)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Family Medical History</h3>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add family history"
                      value={newFamilyHistory}
                      onChange={(e) => setNewFamilyHistory(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addToArrayField("familyHistory", newFamilyHistory, setNewFamilyHistory)
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => addToArrayField("familyHistory", newFamilyHistory, setNewFamilyHistory)}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch("medicalHistory.familyHistory")?.map((history, index) => (
                      <div key={index} className="bg-muted px-3 py-1 rounded-full flex items-center gap-2">
                        <span>{history}</span>
                        <button
                          type="button"
                          onClick={() => removeFromArrayField("familyHistory", index)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any additional notes about the patient's medical history"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <CardFooter className="flex justify-between px-0">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Patient"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

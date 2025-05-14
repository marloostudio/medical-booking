"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Edit, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { bookingRulesService, type BookingRule } from "@/services/booking-rules-service"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"

// Import the zod resolver directly
import { zodResolver } from "@hookform/resolvers/zod"

export function BookingRulesManager() {
  const router = useRouter()
  const [rules, setRules] = useState<BookingRule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [clinicId, setClinicId] = useState<string | null>(null)
  const [editingRule, setEditingRule] = useState<BookingRule | null>(null)
  const [appointmentTypes, setAppointmentTypes] = useState<any[]>([])
  const [staffMembers, setStaffMembers] = useState<any[]>([])

  // Form schema
  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
    minAdvanceTime: z.coerce.number().min(0).optional(),
    maxAdvanceTime: z.coerce.number().min(0).optional(),
    appointmentTypeIds: z.array(z.string()).optional(),
    staffIds: z.array(z.string()).optional(),
    newPatientsAllowed: z.boolean().optional(),
    maxAppointmentsPerDay: z.coerce.number().min(0).optional(),
    maxAppointmentsPerWeek: z.coerce.number().min(0).optional(),
    maxAppointmentsPerMonth: z.coerce.number().min(0).optional(),
  })

  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      minAdvanceTime: 0,
      maxAdvanceTime: 0,
      appointmentTypeIds: [],
      staffIds: [],
      newPatientsAllowed: true,
      maxAppointmentsPerDay: 0,
      maxAppointmentsPerWeek: 0,
      maxAppointmentsPerMonth: 0,
    },
  })

  // Load clinic ID and rules
  useEffect(() => {
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

        // Load rules
        const rulesData = await bookingRulesService.getRules(userClinicId)
        setRules(rulesData)

        // Load appointment types
        const appointmentTypesRef = await getDoc(doc(db, `clinics/${userClinicId}/settings/appointmentTypes`))
        if (appointmentTypesRef.exists()) {
          setAppointmentTypes(appointmentTypesRef.data()?.types || [])
        }

        // Load staff members
        const staffRef = await getDoc(doc(db, `clinics/${userClinicId}/settings/staff`))
        if (staffRef.exists()) {
          setStaffMembers(staffRef.data()?.members || [])
        }
      } catch (error: any) {
        console.error("Error loading booking rules:", error)
        setError(error.message || "Failed to load booking rules")
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!clinicId) {
      setError("Clinic ID not found")
      return
    }

    try {
      if (editingRule) {
        // Update existing rule
        await bookingRulesService.updateRule(clinicId, editingRule.id, data)
        setSuccess("Booking rule has been updated successfully")
      } else {
        // Create new rule
        await bookingRulesService.createRule(clinicId, data)
        setSuccess("New booking rule has been created successfully")
      }

      // Refresh rules list
      const rulesData = await bookingRulesService.getRules(clinicId)
      setRules(rulesData)

      // Reset form
      form.reset()
      setEditingRule(null)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (error: any) {
      console.error("Error saving booking rule:", error)
      setError(error.message || "Failed to save booking rule")
    }
  }

  // Handle edit rule
  const handleEditRule = (rule: BookingRule) => {
    setEditingRule(rule)
    form.reset({
      name: rule.name,
      description: rule.description || "",
      isActive: rule.isActive,
      minAdvanceTime: rule.minAdvanceTime || 0,
      maxAdvanceTime: rule.maxAdvanceTime || 0,
      appointmentTypeIds: rule.appointmentTypeIds || [],
      staffIds: rule.staffIds || [],
      newPatientsAllowed: rule.newPatientsAllowed !== false, // Default to true if undefined
      maxAppointmentsPerDay: rule.maxAppointmentsPerDay || 0,
      maxAppointmentsPerWeek: rule.maxAppointmentsPerWeek || 0,
      maxAppointmentsPerMonth: rule.maxAppointmentsPerMonth || 0,
    })
  }

  // Handle delete rule
  const handleDeleteRule = async (ruleId: string) => {
    if (!clinicId) {
      setError("Clinic ID not found")
      return
    }

    if (confirm("Are you sure you want to delete this rule?")) {
      try {
        await bookingRulesService.deleteRule(clinicId, ruleId)
        setSuccess("Booking rule has been deleted successfully")

        // Refresh rules list
        const rulesData = await bookingRulesService.getRules(clinicId)
        setRules(rulesData)

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null)
        }, 3000)
      } catch (error: any) {
        console.error("Error deleting booking rule:", error)
        setError(error.message || "Failed to delete booking rule")
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{editingRule ? "Edit Booking Rule" : "Create Booking Rule"}</CardTitle>
          <CardDescription>
            {editingRule
              ? "Update the settings for this booking rule"
              : "Define rules that control when and how appointments can be booked"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                  <TabsTrigger value="constraints">Constraints</TabsTrigger>
                  <TabsTrigger value="limits">Booking Limits</TabsTrigger>
                </TabsList>

                {/* Basic Settings Tab */}
                <TabsContent value="basic" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rule Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., No Same-Day Bookings" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Describe the purpose of this rule" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active</FormLabel>
                          <FormDescription>Enable or disable this booking rule</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Constraints Tab */}
                <TabsContent value="constraints" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="minAdvanceTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Advance Time (minutes)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>
                            Minimum time before an appointment can be booked (0 = no limit)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxAdvanceTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Advance Time (minutes)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum time before an appointment can be booked (0 = no limit)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="newPatientsAllowed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Allow New Patients</FormLabel>
                          <FormDescription>Can new patients book appointments online?</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Booking Limits Tab */}
                <TabsContent value="limits" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="maxAppointmentsPerDay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Appointments Per Day</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>0 = no limit</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxAppointmentsPerWeek"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Appointments Per Week</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>0 = no limit</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxAppointmentsPerMonth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Appointments Per Month</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>0 = no limit</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2">
                {editingRule && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingRule(null)
                      form.reset()
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit">{editingRule ? "Update Rule" : "Create Rule"}</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Booking Rules</CardTitle>
          <CardDescription>Manage your clinic's booking rules</CardDescription>
        </CardHeader>
        <CardContent>
          {rules.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No booking rules defined yet. Create your first rule above.
            </div>
          ) : (
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{rule.name}</h3>
                    {rule.description && <p className="text-sm text-muted-foreground">{rule.description}</p>}
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          rule.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {rule.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditRule(rule)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteRule(rule.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

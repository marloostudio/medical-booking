"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { TimePickerInput } from "@/components/ui/time-picker-input"
import { useToast } from "@/components/ui/use-toast"
import { db } from "@/lib/firebase"
import { collection, getDocs, doc, setDoc, query, where } from "firebase/firestore"
import { AlertCircle, Save, Clock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Provider = {
  id: string
  name: string
  role: string
  email: string
}

type DayAvailability = {
  enabled: boolean
  startTime: string
  endTime: string
  breakStart?: string
  breakEnd?: string
}

type ProviderAvailability = {
  providerId: string
  monday: DayAvailability
  tuesday: DayAvailability
  wednesday: DayAvailability
  thursday: DayAvailability
  friday: DayAvailability
  saturday: DayAvailability
  sunday: DayAvailability
}

const DEFAULT_AVAILABILITY: DayAvailability = {
  enabled: false,
  startTime: "09:00",
  endTime: "17:00",
}

const DAYS_OF_WEEK = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
]

export function ProviderAvailabilityManager() {
  const { toast } = useToast()
  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedProviderId, setSelectedProviderId] = useState<string>("")
  const [availability, setAvailability] = useState<ProviderAvailability | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Temporary clinic ID for development
  const clinicId = "demo-clinic-123"

  useEffect(() => {
    fetchProviders()
  }, [])

  useEffect(() => {
    if (selectedProviderId) {
      fetchProviderAvailability(selectedProviderId)
    }
  }, [selectedProviderId])

  const fetchProviders = async () => {
    setLoading(true)
    setError(null)
    try {
      // Query providers (staff with medical roles) for this clinic
      const q = query(
        collection(db, "users"),
        where("clinicId", "==", clinicId),
        where("role", "in", ["MEDICAL_STAFF", "DOCTOR", "NURSE"]),
      )
      const querySnapshot = await getDocs(q)
      const providersList: Provider[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        providersList.push({
          id: doc.id,
          name: `${data.firstName} ${data.lastName}`,
          role: data.role,
          email: data.email,
        })
      })
      setProviders(providersList)

      // Select the first provider by default if available
      if (providersList.length > 0 && !selectedProviderId) {
        setSelectedProviderId(providersList[0].id)
      }
    } catch (err) {
      console.error("Error fetching providers:", err)
      setError("Failed to load providers. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fetchProviderAvailability = async (providerId: string) => {
    setLoading(true)
    setError(null)
    try {
      // Try to get existing availability
      const availabilityRef = doc(db, "availability", providerId)
      const availabilityDoc = await getDocs(
        query(collection(db, "availability"), where("providerId", "==", providerId)),
      )

      if (!availabilityDoc.empty) {
        // Use existing availability
        const data = availabilityDoc.docs[0].data() as ProviderAvailability
        setAvailability(data)
      } else {
        // Create default availability
        const defaultAvailability: ProviderAvailability = {
          providerId,
          monday: { ...DEFAULT_AVAILABILITY, enabled: true },
          tuesday: { ...DEFAULT_AVAILABILITY, enabled: true },
          wednesday: { ...DEFAULT_AVAILABILITY, enabled: true },
          thursday: { ...DEFAULT_AVAILABILITY, enabled: true },
          friday: { ...DEFAULT_AVAILABILITY, enabled: true },
          saturday: { ...DEFAULT_AVAILABILITY, enabled: false },
          sunday: { ...DEFAULT_AVAILABILITY, enabled: false },
        }
        setAvailability(defaultAvailability)
      }
    } catch (err) {
      console.error("Error fetching provider availability:", err)
      setError("Failed to load provider availability. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDayToggle = (day: string, enabled: boolean) => {
    if (!availability) return

    setAvailability({
      ...availability,
      [day]: {
        ...(availability[day as keyof ProviderAvailability] as DayAvailability),
        enabled,
      },
    })
  }

  const handleTimeChange = (day: string, field: string, value: string) => {
    if (!availability) return

    setAvailability({
      ...availability,
      [day]: {
        ...(availability[day as keyof ProviderAvailability] as DayAvailability),
        [field]: value,
      },
    })
  }

  const saveAvailability = async () => {
    if (!availability || !selectedProviderId) return

    setSaving(true)
    try {
      // Save to Firestore
      await setDoc(doc(db, "availability", selectedProviderId), {
        ...availability,
        clinicId,
        updatedAt: new Date(),
      })

      toast({
        title: "Availability saved",
        description: "Provider's availability has been updated successfully.",
      })
    } catch (err) {
      console.error("Error saving availability:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save availability. Please try again.",
      })
    } finally {
      setSaving(false)
    }
  }

  const copyToAllWeekdays = () => {
    if (!availability) return

    const mondaySettings = availability.monday

    setAvailability({
      ...availability,
      tuesday: { ...mondaySettings },
      wednesday: { ...mondaySettings },
      thursday: { ...mondaySettings },
      friday: { ...mondaySettings },
    })

    toast({
      title: "Settings copied",
      description: "Monday's settings have been copied to all weekdays.",
    })
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

      <Card>
        <CardHeader>
          <CardTitle>Provider Availability</CardTitle>
          <CardDescription>Set working hours and availability for your providers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="provider-select">Select Provider</Label>
              <Select
                value={selectedProviderId}
                onValueChange={setSelectedProviderId}
                disabled={loading || providers.length === 0}
              >
                <SelectTrigger id="provider-select" className="w-full sm:w-[300px] mt-1">
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name} ({provider.role.replace("_", " ")})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="text-center py-4">Loading availability settings...</div>
            ) : providers.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No providers found</AlertTitle>
                <AlertDescription>You need to add medical staff members before setting availability.</AlertDescription>
              </Alert>
            ) : !availability ? (
              <div className="text-center py-4">Select a provider to manage their availability</div>
            ) : (
              <>
                <Tabs defaultValue="weekly" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
                    <TabsTrigger value="exceptions" disabled>
                      Exceptions & Time Off
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="weekly" className="space-y-4 pt-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Weekly Schedule</h3>
                      <Button variant="outline" size="sm" onClick={copyToAllWeekdays}>
                        Copy Monday to All Weekdays
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {DAYS_OF_WEEK.map((day) => {
                        const dayData = availability[day.id as keyof ProviderAvailability] as DayAvailability
                        return (
                          <div key={day.id} className="border rounded-md p-4">
                            <div className="flex justify-between items-center mb-4">
                              <div className="flex items-center">
                                <h4 className="font-medium">{day.label}</h4>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id={`${day.id}-toggle`}
                                  checked={dayData.enabled}
                                  onCheckedChange={(checked) => handleDayToggle(day.id, checked)}
                                />
                                <Label htmlFor={`${day.id}-toggle`}>
                                  {dayData.enabled ? "Available" : "Unavailable"}
                                </Label>
                              </div>
                            </div>

                            {dayData.enabled && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`${day.id}-start`} className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    Start Time
                                  </Label>
                                  <TimePickerInput
                                    id={`${day.id}-start`}
                                    value={dayData.startTime}
                                    onChange={(value) => handleTimeChange(day.id, "startTime", value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`${day.id}-end`} className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    End Time
                                  </Label>
                                  <TimePickerInput
                                    id={`${day.id}-end`}
                                    value={dayData.endTime}
                                    onChange={(value) => handleTimeChange(day.id, "endTime", value)}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex justify-end mt-6">
                      <Button onClick={saveAvailability} disabled={saving}>
                        {saving ? (
                          "Saving..."
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Availability
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Trash2, Edit, Plus, Clock, DollarSign, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore"

type AppointmentType = {
  id: string
  name: string
  duration: number
  price: number
  color: string
  description: string
  isActive: boolean
  requiresApproval: boolean
  clinicId: string
}

const COLORS = [
  { value: "blue", label: "Blue", class: "bg-blue-500" },
  { value: "green", label: "Green", class: "bg-green-500" },
  { value: "purple", label: "Purple", class: "bg-purple-500" },
  { value: "yellow", label: "Yellow", class: "bg-yellow-500" },
  { value: "red", label: "Red", class: "bg-red-500" },
  { value: "indigo", label: "Indigo", class: "bg-indigo-500" },
  { value: "pink", label: "Pink", class: "bg-pink-500" },
  { value: "teal", label: "Teal", class: "bg-teal-500" },
]

export function AppointmentTypesManager() {
  const { toast } = useToast()
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentAppointmentType, setCurrentAppointmentType] = useState<AppointmentType | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    duration: 30,
    price: 0,
    color: "blue",
    description: "",
    isActive: true,
    requiresApproval: false,
  })

  // Temporary clinic ID for development
  const clinicId = "demo-clinic-123"

  useEffect(() => {
    fetchAppointmentTypes()
  }, [])

  const fetchAppointmentTypes = async () => {
    setLoading(true)
    setError(null)
    try {
      const q = query(collection(db, "appointmentTypes"), where("clinicId", "==", clinicId))
      const querySnapshot = await getDocs(q)
      const types: AppointmentType[] = []
      querySnapshot.forEach((doc) => {
        types.push({ id: doc.id, ...doc.data() } as AppointmentType)
      })
      setAppointmentTypes(types)
    } catch (err) {
      console.error("Error fetching appointment types:", err)
      setError("Failed to load appointment types. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "number" ? Number.parseFloat(value) : value,
    })
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const resetForm = () => {
    setFormData({
      name: "",
      duration: 30,
      price: 0,
      color: "blue",
      description: "",
      isActive: true,
      requiresApproval: false,
    })
    setCurrentAppointmentType(null)
  }

  const openEditDialog = (appointmentType: AppointmentType) => {
    setCurrentAppointmentType(appointmentType)
    setFormData({
      name: appointmentType.name,
      duration: appointmentType.duration,
      price: appointmentType.price,
      color: appointmentType.color,
      description: appointmentType.description,
      isActive: appointmentType.isActive,
      requiresApproval: appointmentType.requiresApproval,
    })
    setIsDialogOpen(true)
  }

  const openDeleteDialog = (appointmentType: AppointmentType) => {
    setCurrentAppointmentType(appointmentType)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (currentAppointmentType) {
        // Update existing appointment type
        await updateDoc(doc(db, "appointmentTypes", currentAppointmentType.id), {
          ...formData,
          updatedAt: new Date(),
        })
        toast({
          title: "Appointment type updated",
          description: `${formData.name} has been updated successfully.`,
        })
      } else {
        // Create new appointment type
        await addDoc(collection(db, "appointmentTypes"), {
          ...formData,
          clinicId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        toast({
          title: "Appointment type created",
          description: `${formData.name} has been created successfully.`,
        })
      }

      setIsDialogOpen(false)
      resetForm()
      fetchAppointmentTypes()
    } catch (err) {
      console.error("Error saving appointment type:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save appointment type. Please try again.",
      })
    }
  }

  const handleDelete = async () => {
    if (!currentAppointmentType) return

    try {
      await deleteDoc(doc(db, "appointmentTypes", currentAppointmentType.id))
      toast({
        title: "Appointment type deleted",
        description: `${currentAppointmentType.name} has been deleted.`,
      })
      setIsDeleteDialogOpen(false)
      fetchAppointmentTypes()
    } catch (err) {
      console.error("Error deleting appointment type:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete appointment type. Please try again.",
      })
    }
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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Appointment Types</CardTitle>
            <CardDescription>Manage the types of appointments your clinic offers</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm()
                  setIsDialogOpen(true)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Appointment Type
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>{currentAppointmentType ? "Edit Appointment Type" : "Add Appointment Type"}</DialogTitle>
                <DialogDescription>
                  {currentAppointmentType
                    ? "Update the details of this appointment type"
                    : "Create a new type of appointment for your clinic"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="duration" className="text-right">
                      Duration (min)
                    </Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      min="5"
                      step="5"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Price ($)
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="color" className="text-right">
                      Color
                    </Label>
                    <Select value={formData.color} onValueChange={(value) => handleSelectChange("color", value)}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                      <SelectContent>
                        {COLORS.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center">
                              <div className={`w-4 h-4 rounded-full mr-2 ${color.class}`} />
                              {color.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="isActive" className="text-right">
                      Active
                    </Label>
                    <div className="flex items-center space-x-2 col-span-3">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
                      />
                      <Label htmlFor="isActive" className="text-sm text-gray-500">
                        {formData.isActive ? "Available for booking" : "Not available for booking"}
                      </Label>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="requiresApproval" className="text-right">
                      Requires Approval
                    </Label>
                    <div className="flex items-center space-x-2 col-span-3">
                      <Switch
                        id="requiresApproval"
                        checked={formData.requiresApproval}
                        onCheckedChange={(checked) => handleSwitchChange("requiresApproval", checked)}
                      />
                      <Label htmlFor="requiresApproval" className="text-sm text-gray-500">
                        {formData.requiresApproval
                          ? "Staff must approve before confirmation"
                          : "Auto-confirm appointments"}
                      </Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{currentAppointmentType ? "Update" : "Create"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading appointment types...</div>
          ) : appointmentTypes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No appointment types found</p>
              <Button
                onClick={() => {
                  resetForm()
                  setIsDialogOpen(true)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Appointment Type
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointmentTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-500" />
                        {type.duration} min
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                        {type.price.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          type.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {type.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full mr-2 bg-${type.color}-500`}
                          style={{ backgroundColor: `var(--${type.color}-500)` }}
                        />
                        {type.color.charAt(0).toUpperCase() + type.color.slice(1)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(type)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(type)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Appointment Type</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this appointment type? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {currentAppointmentType && (
              <div className="border rounded-md p-4">
                <p className="font-medium">{currentAppointmentType.name}</p>
                <p className="text-sm text-gray-500 mt-1">{currentAppointmentType.description}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

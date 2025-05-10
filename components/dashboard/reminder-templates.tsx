"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle, Edit, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

interface ReminderTemplate {
  id: string
  name: string
  type: "sms" | "email" | "push"
  subject?: string
  content: string
  variables: string[]
  createdAt: number
  updatedAt: number
}

interface ReminderTemplatesProps {
  clinicId: string
}

export function ReminderTemplates({ clinicId }: ReminderTemplatesProps) {
  const [activeTab, setActiveTab] = useState<"sms" | "email" | "push">("sms")
  const [templates, setTemplates] = useState<ReminderTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<ReminderTemplate | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "sms" as "sms" | "email" | "push",
    subject: "",
    content: "",
    variables: [] as string[],
  })
  const [variableInput, setVariableInput] = useState("")

  useEffect(() => {
    fetchTemplates()
  }, [activeTab])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/notifications/templates?type=${activeTab}`)

      if (!response.ok) {
        throw new Error("Failed to fetch templates")
      }

      const data = await response.json()
      setTemplates(data)
    } catch (err) {
      console.error("Error fetching templates:", err)
      setError("Failed to load templates. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTemplate = async () => {
    try {
      const response = await fetch("/api/notifications/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create template")
      }

      toast({
        title: "Template Created",
        description: "The reminder template has been created successfully.",
      })

      setIsCreateDialogOpen(false)
      resetForm()
      fetchTemplates()
    } catch (err) {
      console.error("Error creating template:", err)
      toast({
        title: "Error",
        description: "Failed to create template. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateTemplate = async () => {
    if (!selectedTemplate) return

    try {
      const response = await fetch(`/api/notifications/templates/${selectedTemplate.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update template")
      }

      toast({
        title: "Template Updated",
        description: "The reminder template has been updated successfully.",
      })

      setIsEditDialogOpen(false)
      setSelectedTemplate(null)
      resetForm()
      fetchTemplates()
    } catch (err) {
      console.error("Error updating template:", err)
      toast({
        title: "Error",
        description: "Failed to update template. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTemplate = async () => {
    if (!selectedTemplate) return

    try {
      const response = await fetch(`/api/notifications/templates/${selectedTemplate.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete template")
      }

      toast({
        title: "Template Deleted",
        description: "The reminder template has been deleted successfully.",
      })

      setIsDeleteDialogOpen(false)
      setSelectedTemplate(null)
      fetchTemplates()
    } catch (err) {
      console.error("Error deleting template:", err)
      toast({
        title: "Error",
        description: "Failed to delete template. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      type: "sms",
      subject: "",
      content: "",
      variables: [],
    })
    setVariableInput("")
  }

  const handleEditClick = (template: ReminderTemplate) => {
    setSelectedTemplate(template)
    setFormData({
      name: template.name,
      type: template.type,
      subject: template.subject || "",
      content: template.content,
      variables: template.variables || [],
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (template: ReminderTemplate) => {
    setSelectedTemplate(template)
    setIsDeleteDialogOpen(true)
  }

  const handleAddVariable = () => {
    if (variableInput.trim() && !formData.variables.includes(variableInput.trim())) {
      setFormData({
        ...formData,
        variables: [...formData.variables, variableInput.trim()],
      })
      setVariableInput("")
    }
  }

  const handleRemoveVariable = (variable: string) => {
    setFormData({
      ...formData,
      variables: formData.variables.filter((v) => v !== variable),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold">Reminder Templates</h2>

        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "sms" | "email" | "push")}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="sms">SMS Templates</TabsTrigger>
          <TabsTrigger value="email">Email Templates</TabsTrigger>
          <TabsTrigger value="push">Push Notification Templates</TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        ) : templates.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <p className="text-muted-foreground">No templates found for this channel.</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>Last updated: {new Date(template.updatedAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  {template.type === "email" && template.subject && (
                    <div className="mb-4">
                      <Label className="text-sm font-medium">Subject</Label>
                      <p className="mt-1 text-sm">{template.subject}</p>
                    </div>
                  )}

                  <div className="mb-4">
                    <Label className="text-sm font-medium">Content</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">{template.content}</div>
                  </div>

                  {template.variables && template.variables.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Variables</Label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {template.variables.map((variable) => (
                          <Badge key={variable} variant="secondary">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(template)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(template)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </Tabs>

      {/* Create Template Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Reminder Template</DialogTitle>
            <DialogDescription>Create a new template for sending reminders to patients.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as "sms" | "email" | "push" })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a channel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="push">Push Notification</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.type === "email" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Subject
                </Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="col-span-3"
                />
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="col-span-3"
                rows={6}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="variables" className="text-right">
                Variables
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="variables"
                    value={variableInput}
                    onChange={(e) => setVariableInput(e.target.value)}
                    placeholder="Add a variable (e.g., patientName)"
                  />
                  <Button type="button" onClick={handleAddVariable} variant="secondary">
                    Add
                  </Button>
                </div>

                {formData.variables.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.variables.map((variable) => (
                      <Badge key={variable} variant="secondary" className="flex items-center gap-1">
                        {variable}
                        <button
                          type="button"
                          onClick={() => handleRemoveVariable(variable)}
                          className="ml-1 rounded-full hover:bg-muted p-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate}>Create Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Reminder Template</DialogTitle>
            <DialogDescription>Update the template for sending reminders to patients.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
              />
            </div>

            {formData.type === "email" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-subject" className="text-right">
                  Subject
                </Label>
                <Input
                  id="edit-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="col-span-3"
                />
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-content" className="text-right">
                Content
              </Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="col-span-3"
                rows={6}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-variables" className="text-right">
                Variables
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="edit-variables"
                    value={variableInput}
                    onChange={(e) => setVariableInput(e.target.value)}
                    placeholder="Add a variable (e.g., patientName)"
                  />
                  <Button type="button" onClick={handleAddVariable} variant="secondary">
                    Add
                  </Button>
                </div>

                {formData.variables.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.variables.map((variable) => (
                      <Badge key={variable} variant="secondary" className="flex items-center gap-1">
                        {variable}
                        <button
                          type="button"
                          onClick={() => handleRemoveVariable(variable)}
                          className="ml-1 rounded-full hover:bg-muted p-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTemplate}>Update Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Template Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTemplate}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { AlertCircle, ArrowLeft, Check } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

const roles = [
  {
    id: "ADMIN",
    name: "Administrator",
  },
  {
    id: "MEDICAL_STAFF",
    name: "Medical Staff",
  },
  {
    id: "RECEPTIONIST",
    name: "Receptionist",
  },
]

// Form schema using Zod for validation
const formSchema = z.object({
  emails: z.string().min(1, { message: "Please enter at least one email address" }),
  role: z.string({ required_error: "Please select a role" }),
  expiresIn: z.string().default("7"),
  message: z.string().optional(),
})

export default function InviteUsersPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emails: "",
      role: "",
      expiresIn: "7",
      message: "",
    },
  })

  // Form submission handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError(null)

    try {
      // In a real application, this would be an API call
      console.log("Form values:", values)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccess(true)

      // Redirect after a delay
      setTimeout(() => {
        router.push("/dashboard/users")
      }, 2000)
    } catch (err) {
      console.error("Error sending invitations:", err)
      setError("An error occurred while sending invitations. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/dashboard/users" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Invite Users</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Send Invitations</CardTitle>
            <CardDescription>
              Invite new users to join your clinic. Enter multiple email addresses separated by commas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success</AlertTitle>
                <AlertDescription className="text-green-700">
                  Invitations have been sent successfully. You will be redirected shortly.
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="emails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Addresses</FormLabel>
                      <FormControl>
                        <Textarea placeholder="jane@example.com, john@example.com" className="min-h-24" {...field} />
                      </FormControl>
                      <FormDescription>Enter multiple email addresses separated by commas.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiresIn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invitation Expiry</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select expiry time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 day</SelectItem>
                          <SelectItem value="3">3 days</SelectItem>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>How long the invitation links will remain valid.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personal Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a personal message to include in the invitation email."
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Link href="/dashboard/users">
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Invitations"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invitation Process</CardTitle>
              <CardDescription>Learn how the invitation process works.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-600 flex items-center justify-center rounded-full w-8 h-8 mr-3">
                    1
                  </div>
                  <div className="font-medium">Send Invitation</div>
                </div>
                <div className="ml-11 text-sm text-gray-500">
                  An email is sent with a secure link to join your clinic.
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-600 flex items-center justify-center rounded-full w-8 h-8 mr-3">
                    2
                  </div>
                  <div className="font-medium">User Accepts</div>
                </div>
                <div className="ml-11 text-sm text-gray-500">
                  The recipient clicks the link and creates their account.
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-600 flex items-center justify-center rounded-full w-8 h-8 mr-3">
                    3
                  </div>
                  <div className="font-medium">Account Creation</div>
                </div>
                <div className="ml-11 text-sm text-gray-500">
                  They set up their password and complete their profile.
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-600 flex items-center justify-center rounded-full w-8 h-8 mr-3">
                    4
                  </div>
                  <div className="font-medium">Start Collaboration</div>
                </div>
                <div className="ml-11 text-sm text-gray-500">
                  They can now access your clinic with the assigned permissions.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Tips for Invitations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                  <span>Let users know in advance that they'll receive an invitation.</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                  <span>Include a personal message to make the invitation more welcoming.</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                  <span>Set an appropriate expiration time based on urgency.</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                  <span>Check spam folders if recipients don't receive the invitation.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

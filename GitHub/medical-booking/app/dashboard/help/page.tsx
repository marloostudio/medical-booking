import { PageTemplate } from "@/components/dashboard/page-template"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { HelpCircle, Mail, MessageSquare, FileText, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  return (
    <PageTemplate title="Help & Support" description="Get help with using the BookingLink platform">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="mr-2 h-5 w-5 text-blue-600" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I book a new appointment?</AccordionTrigger>
                <AccordionContent>
                  To book a new appointment, navigate to Appointments → Book Appointment in the sidebar. Select a
                  patient, provider, appointment type, date, and time, then click "Book Appointment".
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I add a new patient?</AccordionTrigger>
                <AccordionContent>
                  To add a new patient, go to Patients → Add Patient in the sidebar. Fill out the patient information
                  form and click "Save Patient".
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>How do I set up appointment reminders?</AccordionTrigger>
                <AccordionContent>
                  To set up appointment reminders, go to Notifications → Appointment Reminders. Configure when reminders
                  should be sent and what message they should contain.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>How do I manage staff availability?</AccordionTrigger>
                <AccordionContent>
                  To manage staff availability, navigate to Staff & Providers → Provider Availability. Select a provider
                  and set their working hours for each day of the week.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>How do I process a refund?</AccordionTrigger>
                <AccordionContent>
                  To process a refund, go to Payments → Process Refunds. Find the payment you want to refund, click
                  "Refund", and follow the prompts to complete the refund.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-blue-600" />
                Contact Support
              </CardTitle>
              <CardDescription>Get help from our support team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Our support team is available Monday through Friday, 9am to 5pm EST.</p>
              <div className="flex space-x-4">
                <Button className="flex-1">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Support
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Live Chat
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-600" />
                Documentation
              </CardTitle>
              <CardDescription>Detailed guides and tutorials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Explore our comprehensive documentation to learn how to use all features of the platform.</p>
              <div className="space-y-2">
                <Link href="#" className="flex items-center text-blue-600 hover:underline">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Getting Started Guide
                </Link>
                <Link href="#" className="flex items-center text-blue-600 hover:underline">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Appointment Management
                </Link>
                <Link href="#" className="flex items-center text-blue-600 hover:underline">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Patient Records
                </Link>
                <Link href="#" className="flex items-center text-blue-600 hover:underline">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Billing & Payments
                </Link>
              </div>
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                View All Documentation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTemplate>
  )
}

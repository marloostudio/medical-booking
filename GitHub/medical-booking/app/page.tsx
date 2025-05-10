import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Bell } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Trusted by 500+ Medical Practices
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Streamline Your Medical Practice with <span className="text-blue-600">BookingLink</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Complete appointment management solution designed for modern healthcare providers. Reduce no-shows, improve
            patient satisfaction, and grow your practice.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">Start Free Trial</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/demo">View Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Manage Your Practice</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Calendar className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Smart Scheduling</CardTitle>
                <CardDescription>
                  Intelligent appointment booking with conflict detection and automated reminders
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Patient Management</CardTitle>
                <CardDescription>Complete patient records, history tracking, and communication tools</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Bell className="h-10 w-10 text-orange-600 mb-2" />
                <CardTitle>Automated Reminders</CardTitle>
                <CardDescription>SMS and email reminders to reduce no-shows and improve attendance</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Practice?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of healthcare providers who trust BookingLink</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/signup">Get Started Today</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}

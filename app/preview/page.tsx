import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-blue-600">BookingLink</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Medical Appointment Booking Made Simple
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Streamline your clinic's scheduling with our comprehensive booking platform
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/demo">
                <Button size="lg" className="px-8">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>For Clinics</CardTitle>
                <CardDescription>Manage your practice efficiently</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>• Streamlined appointment scheduling</li>
                  <li>• Patient management system</li>
                  <li>• Automated reminders</li>
                  <li>• Staff availability tracking</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>For Medical Staff</CardTitle>
                <CardDescription>Focus on patient care</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>• Personalized schedules</li>
                  <li>• Patient history access</li>
                  <li>• Appointment notes</li>
                  <li>• Availability management</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>For Patients</CardTitle>
                <CardDescription>Book appointments with ease</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>• 24/7 online booking</li>
                  <li>• SMS & email reminders</li>
                  <li>• Appointment history</li>
                  <li>• Secure communication</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-16 bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Ready to transform your clinic's scheduling?
              </h3>
              <div className="mt-5">
                <Link href="/signup">
                  <Button>Sign Up for Free</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-500">&copy; 2025 BookingLink. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

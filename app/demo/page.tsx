import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                BookingLink
              </Link>
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
              BookingLink Demo
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Experience the power of our medical appointment booking platform
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Interactive Demo</CardTitle>
                <CardDescription>Try out the platform with our interactive demo</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Our interactive demo allows you to explore the platform as if you were a real user. You can:
                </p>
                <ul className="space-y-2 mb-4">
                  <li>• Navigate the dashboard</li>
                  <li>• View and manage appointments</li>
                  <li>• Explore patient records</li>
                  <li>• Test notification settings</li>
                  <li>• And much more!</li>
                </ul>
                <p>No sign-up required. Just click the button below to start exploring.</p>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard">
                  <Button className="w-full">Launch Interactive Demo</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guided Tour</CardTitle>
                <CardDescription>Take a guided tour of the platform's features</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Our guided tour walks you through the key features of the BookingLink platform:</p>
                <ul className="space-y-2 mb-4">
                  <li>• Appointment scheduling workflow</li>
                  <li>• Patient management system</li>
                  <li>• Staff availability tracking</li>
                  <li>• Automated reminders</li>
                  <li>• Reporting and analytics</li>
                </ul>
                <p>The tour takes approximately 10 minutes to complete.</p>
              </CardContent>
              <CardFooter>
                <Link href="/preview">
                  <Button variant="outline" className="w-full">
                    Start Guided Tour
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-16 bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Ready to get started with your own account?
              </h3>
              <div className="mt-5 flex space-x-4">
                <Link href="/signup">
                  <Button>Sign Up for Free</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline">Login</Button>
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

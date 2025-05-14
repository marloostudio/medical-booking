import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Clock, Users, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"

export default function SchedulingFeaturePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="container mx-auto px-4">
            <Link
              href="/features"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all features
            </Link>
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="md:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Smart Appointment Scheduling
                </h1>
                <p className="text-xl text-gray-600 max-w-lg">
                  Our intelligent scheduling system optimizes your clinic's calendar, reduces no-shows, and makes
                  booking appointments effortless for both staff and patients.
                </p>
              </div>
              <div className="md:w-1/2">
                <Image
                  src="/medical-appointment-calendar.png"
                  alt="Appointment Scheduling Interface"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Key Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
            <div className="max-w-4xl mx-auto">
              {howItWorks.map((step, index) => (
                <div key={index} className="flex flex-col md:flex-row items-start mb-12 last:mb-0">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold mb-4 md:mb-0 md:mr-6">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <Image
                        src={step.image || "/placeholder.svg"}
                        alt={step.title}
                        width={800}
                        height={400}
                        className="rounded-md"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Detail */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Scheduling Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {features.map((feature, index) => (
                <div key={index} className="flex">
                  <div className="mr-4 text-blue-500">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <svg
                className="w-12 h-12 mx-auto mb-6 text-blue-300"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
              </svg>
              <p className="text-xl md:text-2xl mb-6">
                BookingLink's scheduling system has transformed our clinic operations. We've reduced no-shows by 60% and
                saved countless hours on administrative tasks. The ability to customize appointment types and durations
                has been a game-changer for our multi-specialty practice.
              </p>
              <div>
                <p className="font-semibold text-lg">Dr. Sarah Johnson</p>
                <p className="text-blue-200">Family Physician, Johnson Family Practice</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to streamline your scheduling?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Start your 14-day free trial today and see how BookingLink can transform your clinic's scheduling.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/demo">See Demo</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

// Benefits data
const benefits = [
  {
    title: "Save Time",
    description: "Reduce administrative workload by up to 70% with automated scheduling and patient self-booking.",
    icon: <Clock className="h-6 w-6 text-blue-600" />,
  },
  {
    title: "Reduce No-Shows",
    description: "Decrease no-show rates by up to 60% with automated reminders and easy rescheduling options.",
    icon: <Calendar className="h-6 w-6 text-blue-600" />,
  },
  {
    title: "Optimize Resources",
    description: "Maximize staff utilization and room availability with intelligent scheduling algorithms.",
    icon: <Users className="h-6 w-6 text-blue-600" />,
  },
]

// How it works data
const howItWorks = [
  {
    title: "Set Up Your Schedule",
    description:
      "Define your clinic's working hours, appointment types, and provider availability. Our system allows for complex scheduling rules including breaks, recurring time off, and variable appointment lengths.",
    image: "/placeholder.svg?height=400&width=800&query=medical clinic schedule setup interface",
  },
  {
    title: "Enable Online Booking",
    description:
      "Activate your online booking portal where patients can see available slots and book appointments that fit their schedule. You control which appointment types are available online and which require staff scheduling.",
    image: "/placeholder.svg?height=400&width=800&query=medical online booking patient portal",
  },
  {
    title: "Manage Appointments",
    description:
      "View and manage all appointments from your dashboard. Easily reschedule, cancel, or add notes to appointments. The color-coded calendar makes it simple to see your day at a glance.",
    image: "/placeholder.svg?height=400&width=800&query=medical appointment management dashboard",
  },
]

// Features data
const features = [
  {
    title: "Smart Scheduling Algorithm",
    description:
      "Our intelligent algorithm optimizes appointment slots based on provider availability, room resources, and appointment types.",
  },
  {
    title: "Online Booking Portal",
    description:
      "Give patients the ability to book appointments online 24/7, reducing phone calls and administrative work.",
  },
  {
    title: "Customizable Appointment Types",
    description:
      "Create unlimited appointment types with different durations, preparation instructions, and follow-up protocols.",
  },
  {
    title: "Staff Availability Management",
    description: "Easily manage when providers are available for appointments, including regular hours and time off.",
  },
  {
    title: "Recurring Appointments",
    description:
      "Schedule recurring appointments for patients who need regular visits, with flexible recurrence patterns.",
  },
  {
    title: "Waitlist Management",
    description: "Automatically fill canceled appointments from your waitlist, maximizing your schedule efficiency.",
  },
  {
    title: "Multi-Location Support",
    description: "Manage schedules across multiple clinic locations from a single dashboard.",
  },
  {
    title: "Calendar Sync",
    description:
      "Sync with Google Calendar, Outlook, and other calendar systems to keep all your schedules in one place.",
  },
]

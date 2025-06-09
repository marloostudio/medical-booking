import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Bell, MessageSquare, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"

export default function RemindersFeaturePage() {
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
                  Automated Appointment Reminders
                </h1>
                <p className="text-xl text-gray-600 max-w-lg">
                  Reduce no-shows by up to 60% with automated SMS and email appointment reminders that keep your
                  patients informed and your schedule full.
                </p>
              </div>
              <div className="md:w-1/2">
                <Image
                  src="/placeholder.svg?height=400&width=600&query=medical appointment reminders sms notification"
                  alt="Appointment Reminders Interface"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg text-center">
                  <p className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</p>
                  <p className="text-lg text-gray-700">{stat.label}</p>
                </div>
              ))}
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
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Reminder Features</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">SMS Reminders</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Send automated text message reminders to patients' mobile phones, with customizable timing and
                  content.
                </p>
                <ul className="space-y-3">
                  {smsFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-3 mt-1 text-green-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <Image
                  src="/placeholder.svg?height=400&width=600&query=sms appointment reminder on smartphone"
                  alt="SMS Reminder Example"
                  width={600}
                  height={400}
                  className="rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
              <div className="order-2 md:order-1 bg-white p-4 rounded-lg shadow-md">
                <Image
                  src="/placeholder.svg?height=400&width=600&query=email appointment reminder template"
                  alt="Email Reminder Example"
                  width={600}
                  height={400}
                  className="rounded-md"
                />
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Email Notifications</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Send detailed email reminders with appointment information, preparation instructions, and clinic
                  details.
                </p>
                <ul className="space-y-3">
                  {emailFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-3 mt-1 text-green-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Customizable Templates</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Create and customize reminder templates for different appointment types and patient preferences.
                </p>
                <ul className="space-y-3">
                  {templateFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-3 mt-1 text-green-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <Image
                  src="/placeholder.svg?height=400&width=600&query=customizable reminder template editor"
                  alt="Template Editor Interface"
                  width={600}
                  height={400}
                  className="rounded-md"
                />
              </div>
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
                Since implementing BookingLink's reminder system, our no-show rate has dropped from 18% to just 5%. The
                automated reminders have saved our staff countless hours of phone calls, and patients love the
                convenience of text message reminders.
              </p>
              <div>
                <p className="font-semibold text-lg">Lisa Rodriguez</p>
                <p className="text-blue-200">Clinic Manager, Rodriguez Family Practice</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to reduce no-shows?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Start your 14-day free trial today and see how BookingLink's automated reminders can transform your
              practice.
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

// Stats data
const stats = [
  {
    value: "60%",
    label: "Reduction in no-show rates",
  },
  {
    value: "85%",
    label: "Patients prefer SMS reminders",
  },
  {
    value: "15+",
    label: "Hours saved per week on manual calls",
  },
]

// Benefits data
const benefits = [
  {
    title: "Reduce No-Shows",
    description: "Decrease missed appointments by up to 60% with timely, automated reminders.",
    icon: <Bell className="h-6 w-6 text-blue-600" />,
  },
  {
    title: "Save Staff Time",
    description: "Eliminate hours of manual phone calls with automated reminder workflows.",
    icon: <MessageSquare className="h-6 w-6 text-blue-600" />,
  },
  {
    title: "Improve Patient Experience",
    description: "Provide convenient reminders in patients' preferred communication channels.",
    icon: <Globe className="h-6 w-6 text-blue-600" />,
  },
]

// How it works data
const howItWorks = [
  {
    title: "Configure Reminder Settings",
    description:
      "Set up your reminder preferences, including timing (e.g., 48 hours, 24 hours, and 2 hours before appointments), channels (SMS, email), and default templates.",
    image: "/placeholder.svg?height=400&width=800&query=reminder settings configuration interface",
  },
  {
    title: "Customize Templates",
    description:
      "Create and customize reminder templates for different appointment types, including specific preparation instructions or required documents.",
    image: "/placeholder.svg?height=400&width=800&query=reminder template customization interface",
  },
  {
    title: "Automated Delivery",
    description:
      "Once configured, reminders are automatically sent according to your settings. Patients can confirm or request rescheduling directly from the reminder.",
    image: "/placeholder.svg?height=400&width=800&query=automated reminder delivery system",
  },
]

// SMS features
const smsFeatures = [
  "Automated SMS reminders at configurable intervals",
  "Two-way texting for appointment confirmations",
  "Quick rescheduling options via text",
  "Customizable message content",
  "Delivery and read receipts",
  "Compliance with telecommunications regulations",
]

// Email features
const emailFeatures = [
  "Branded email templates with your clinic's logo",
  "Detailed appointment information and instructions",
  "Calendar attachments (.ics files) for easy addition to digital calendars",
  "Embedded maps and directions to your clinic",
  "Links to complete pre-appointment forms",
  "Mobile-responsive design for all devices",
]

// Template features
const templateFeatures = [
  "Multiple reminder templates for different appointment types",
  "Dynamic content insertion (patient name, appointment details, etc.)",
  "Multi-language support for diverse patient populations",
  "A/B testing to optimize reminder effectiveness",
  "Seasonal and special occasion templates",
  "Template performance analytics",
]

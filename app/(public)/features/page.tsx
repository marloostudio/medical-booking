import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Users, Shield, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for Healthcare Providers
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              BookingLink offers a comprehensive suite of tools designed specifically for healthcare clinics to
              streamline operations and improve patient care.
            </p>
          </div>
        </section>

        {/* Features Overview */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Appointment Scheduling</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Our intelligent scheduling system optimizes your clinic's calendar, reduces no-shows, and makes
                  booking appointments effortless for both staff and patients.
                </p>
                <ul className="space-y-3 mb-8">
                  {schedulingFeatures.map((feature, index) => (
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
                <Button asChild>
                  <Link href="/features/scheduling">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <div className="aspect-video relative rounded-md overflow-hidden">
                  <Image
                    src="/medical-appointment-calendar.png"
                    alt="Appointment Scheduling Interface"
                    width={600}
                    height={400}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
              <div className="order-2 md:order-1 bg-gray-100 p-6 rounded-lg shadow-md">
                <div className="aspect-video relative rounded-md overflow-hidden">
                  <Image
                    src="/patient-management-system-medical-records.png"
                    alt="Patient Management Interface"
                    width={600}
                    height={400}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Patient Management</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Securely store and manage patient information with our HIPAA/PIPEDA-compliant system, making it easy
                  to access patient records when you need them.
                </p>
                <ul className="space-y-3 mb-8">
                  {patientFeatures.map((feature, index) => (
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
                <Button asChild>
                  <Link href="/features/patient-management">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Automated Reminders</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Reduce no-shows by up to 60% with automated SMS and email appointment reminders that keep your
                  patients informed and your schedule full.
                </p>
                <ul className="space-y-3 mb-8">
                  {reminderFeatures.map((feature, index) => (
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
                <Button asChild>
                  <Link href="/features/reminders">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <div className="aspect-video relative rounded-md overflow-hidden">
                  <Image
                    src="/medical-appointment-reminders.png"
                    alt="Automated Reminders Interface"
                    width={600}
                    height={400}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-gray-100 p-6 rounded-lg shadow-md">
                <div className="aspect-video relative rounded-md overflow-hidden">
                  <Image
                    src="/medical-clinic-analytics-dashboard.png"
                    alt="Reporting & Analytics Interface"
                    width={600}
                    height={400}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Reporting & Analytics</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Gain valuable insights into your clinic's performance with comprehensive reporting tools that help you
                  make data-driven decisions.
                </p>
                <ul className="space-y-3 mb-8">
                  {reportingFeatures.map((feature, index) => (
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
                <Button asChild>
                  <Link href="/features/reporting">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Additional Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {additionalFeatures.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your clinic management?</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Join thousands of healthcare providers who trust BookingLink to streamline their operations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-blue-700"
                asChild
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

// Feature lists
const schedulingFeatures = [
  "Smart scheduling algorithm to optimize appointment slots",
  "Online booking portal for patients",
  "Customizable appointment types and durations",
  "Staff availability management",
  "Recurring appointment scheduling",
]

const patientFeatures = [
  "Secure patient records with HIPAA/PIPEDA compliance",
  "Comprehensive patient profiles",
  "Medical history tracking",
  "Document upload and management",
  "Patient portal for self-service",
]

const reminderFeatures = [
  "Automated SMS appointment reminders",
  "Email notifications and confirmations",
  "Customizable reminder templates",
  "Multi-language support",
  "Two-way communication for confirmations",
]

const reportingFeatures = [
  "Real-time dashboard with key metrics",
  "Appointment analytics and no-show rates",
  "Revenue and financial reporting",
  "Staff performance metrics",
  "Custom report generation",
]

// Additional features
const additionalFeatures = [
  {
    title: "Staff Management",
    description: "Manage staff schedules, availability, and permissions with role-based access control.",
    icon: <Users className="h-6 w-6 text-blue-600" />,
  },
  {
    title: "Secure Communication",
    description: "HIPAA-compliant messaging system for secure communication with patients and staff.",
    icon: <MessageSquare className="h-6 w-6 text-blue-600" />,
  },
  {
    title: "Data Security",
    description: "Enterprise-grade security with encryption, audit logs, and compliance features.",
    icon: <Shield className="h-6 w-6 text-blue-600" />,
  },
]

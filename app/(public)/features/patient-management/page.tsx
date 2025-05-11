import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, FileText, Lock, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"

export default function PatientManagementFeaturePage() {
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
                  Comprehensive Patient Management
                </h1>
                <p className="text-xl text-gray-600 max-w-lg">
                  Securely store and manage patient information with our HIPAA/PIPEDA-compliant system, making it easy
                  to access patient records when you need them.
                </p>
              </div>
              <div className="md:w-1/2">
                <Image
                  src="/placeholder.svg?height=400&width=600&query=medical patient management system interface"
                  alt="Patient Management Interface"
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

        {/* Features Detail */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Patient Management Features</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Comprehensive Patient Profiles</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Store all relevant patient information in one place, including contact details, medical history,
                  insurance information, and appointment history.
                </p>
                <ul className="space-y-3">
                  {patientProfileFeatures.map((feature, index) => (
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
                  src="/placeholder.svg?height=400&width=600&query=medical patient profile interface"
                  alt="Patient Profile Interface"
                  width={600}
                  height={400}
                  className="rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
              <div className="order-2 md:order-1 bg-white p-4 rounded-lg shadow-md">
                <Image
                  src="/placeholder.svg?height=400&width=600&query=medical document management system"
                  alt="Document Management Interface"
                  width={600}
                  height={400}
                  className="rounded-md"
                />
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Document Management</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Securely store and manage patient documents, including medical records, test results, and consent
                  forms.
                </p>
                <ul className="space-y-3">
                  {documentFeatures.map((feature, index) => (
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
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Patient Portal</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Empower patients with self-service options through a secure patient portal.
                </p>
                <ul className="space-y-3">
                  {portalFeatures.map((feature, index) => (
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
                  src="/placeholder.svg?height=400&width=600&query=medical patient portal interface"
                  alt="Patient Portal Interface"
                  width={600}
                  height={400}
                  className="rounded-md"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Enterprise-Grade Security</h2>
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                  <Lock className="h-12 w-12 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">HIPAA & PIPEDA Compliant</h3>
                  <p className="text-lg text-gray-600">
                    Our platform is fully compliant with healthcare privacy regulations, ensuring your patient data is
                    protected at all times.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-3 mt-1 text-blue-500">
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
                    <div>
                      <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
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
                The patient management system is intuitive and secure. Our staff picked it up quickly, and the
                comprehensive patient profiles have improved our care coordination. The document management features
                have helped us go completely paperless.
              </p>
              <div>
                <p className="font-semibold text-lg">Dr. Michael Chen</p>
                <p className="text-blue-200">Dental Clinic Owner, Chen Dental Associates</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to improve your patient management?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Start your 14-day free trial today and see how BookingLink can transform your patient management.
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
    title: "Centralized Records",
    description: "Keep all patient information in one secure, easily accessible location.",
    icon: <FileText className="h-6 w-6 text-blue-600" />,
  },
  {
    title: "Enhanced Security",
    description: "Protect sensitive patient data with enterprise-grade security and compliance features.",
    icon: <Lock className="h-6 w-6 text-blue-600" />,
  },
  {
    title: "Improved Efficiency",
    description: "Find patient information quickly with powerful search and filtering capabilities.",
    icon: <Search className="h-6 w-6 text-blue-600" />,
  },
]

// Patient profile features
const patientProfileFeatures = [
  "Demographic information and contact details",
  "Medical history and conditions",
  "Medication lists and allergies",
  "Insurance information and billing details",
  "Appointment history and upcoming appointments",
  "Custom fields for specialty-specific information",
]

// Document features
const documentFeatures = [
  "Secure document upload and storage",
  "Document categorization and tagging",
  "Version control for updated documents",
  "Document sharing with patients via patient portal",
  "Automated document requests for missing information",
  "Integration with common document formats (PDF, DOCX, JPG)",
]

// Portal features
const portalFeatures = [
  "Online appointment booking and management",
  "Secure messaging with clinic staff",
  "Access to medical records and test results",
  "Online forms and questionnaires",
  "Prescription refill requests",
  "Bill payment and insurance information",
]

// Security features
const securityFeatures = [
  {
    title: "End-to-End Encryption",
    description: "All data is encrypted both in transit and at rest using industry-standard encryption.",
  },
  {
    title: "Role-Based Access Control",
    description: "Granular permissions ensure staff only access information they need for their role.",
  },
  {
    title: "Audit Logging",
    description: "Comprehensive audit trails track all access and changes to patient records.",
  },
  {
    title: "Two-Factor Authentication",
    description: "Additional security layer for accessing sensitive patient information.",
  },
  {
    title: "Automatic Backups",
    description: "Regular automated backups ensure your data is never lost.",
  },
  {
    title: "Data Retention Policies",
    description: "Configurable retention policies to comply with regulatory requirements.",
  },
]

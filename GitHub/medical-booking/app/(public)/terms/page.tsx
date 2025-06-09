import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-blue-600 text-white rounded-md w-8 h-8 flex items-center justify-center mr-2">
              <span className="font-bold">BL</span>
            </div>
            <span className="font-semibold text-lg">BookingLink</span>
          </div>
          <Link href="/" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms & Conditions</h1>

        <div className="mb-8">
          <p className="text-gray-600">
            <strong>Effective Date:</strong> May 2025
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">
            Welcome to BookingLink. By accessing or using our platform, you agree to comply with and be bound by these
            Terms and Conditions. If you do not agree, you may not use the platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Services Provided</h2>
          <p className="text-gray-700 mb-4">
            BookingLink is a clinic and medical appointment booking application. It facilitates the scheduling of
            medical consultations, patient management, and related healthcare services. The platform also provides
            features such as payment processing, patient record management, and analytics.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">3. User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Account Information:</strong> You must provide accurate and complete information during
              registration. You are responsible for maintaining the confidentiality of your login credentials.
            </li>
            <li>
              <strong>Compliance:</strong> You agree to comply with all local, provincial, and federal regulations
              related to healthcare and data protection, including PHIPA and PIPEDA.
            </li>
            <li>
              <strong>User Conduct:</strong> You must not misuse the platform by engaging in harmful or unlawful
              activities, including the unauthorized sharing of patient data.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">4. License and Access</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Usage License:</strong> BookingLink grants you a non-exclusive, non-transferable license to use
              the platform for managing clinic appointments and patient data.
            </li>
            <li>
              <strong>Restrictions:</strong> You may not modify, distribute, or reverse-engineer any part of the
              application without prior written consent.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Payment and Subscription</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Billing:</strong> Subscription fees are billed periodically based on your selected plan. Payments
              are processed via Stripe.
            </li>
            <li>
              <strong>Refunds:</strong> Refunds are handled on a case-by-case basis. Contact support for assistance.
            </li>
            <li>
              <strong>Non-Payment:</strong> Failure to pay subscription fees may result in suspension or termination of
              your account.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Data Protection</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Confidentiality:</strong> All patient data processed through BookingLink is treated as
              confidential and is encrypted at rest and in transit.
            </li>
            <li>
              <strong>Data Ownership:</strong> Clinics and healthcare providers retain ownership of patient data
              collected through the platform.
            </li>
            <li>
              <strong>Data Backup:</strong> Regular backups are maintained to ensure data availability.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">7. Intellectual Property</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Ownership:</strong> All content, features, and functionalities of the platform are owned by
              [Company Name] and protected by copyright laws.
            </li>
            <li>
              <strong>Trademarks:</strong> The BookingLink name and logo are trademarks of [Company Name].
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">8. Limitation of Liability</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Service Availability:</strong> BookingLink strives to maintain uninterrupted access but cannot
              guarantee uptime due to maintenance or technical issues.
            </li>
            <li>
              <strong>No Medical Advice:</strong> BookingLink does not provide medical advice. Clinics and healthcare
              providers are solely responsible for the content of their communications and consultations.
            </li>
            <li>
              <strong>Indirect Damages:</strong> BookingLink is not liable for any indirect or consequential damages
              arising from the use of the platform.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">9. Termination</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>User Termination:</strong> You may terminate your account at any time. Data will be retained as
              per legal requirements.
            </li>
            <li>
              <strong>Platform Termination:</strong> BookingLink reserves the right to suspend or terminate accounts
              that violate these terms.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">10. Governing Law</h2>
          <p className="text-gray-700 mb-4">
            These terms are governed by the laws of Ontario, Canada, without regard to its conflict of law principles.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">11. Changes to Terms</h2>
          <p className="text-gray-700 mb-4">
            We may update these Terms and Conditions from time to time. Users will be notified of significant changes
            through the application or via email.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">12. Contact Information</h2>
          <p className="text-gray-700 mb-4">If you have questions about these Terms, please contact us at:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:support@bookinglink.com" className="text-blue-600 hover:underline">
                support@bookinglink.com
              </a>
            </li>
            <li>
              <strong>Phone:</strong> (289) 800-5127
            </li>
            <li>
              <strong>Address:</strong> [Company Address]
            </li>
          </ul>
        </section>

        <div className="mt-8 pt-4 border-t border-gray-200">
          <p className="text-gray-700">
            By using BookingLink, you acknowledge that you have read, understood, and agreed to these Terms and
            Conditions.
          </p>
        </div>
      </main>
    </div>
  )
}

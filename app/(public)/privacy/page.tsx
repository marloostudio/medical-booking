import Link from "next/link"

export default function PrivacyPolicy() {
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>

        <div className="text-gray-700 mb-8">
          <p className="mb-2">
            <strong>Effective Date:</strong> May 2025
          </p>

          <p className="mb-6">
            BookingLink is committed to protecting your privacy and the confidentiality of your personal and medical
            information. This Privacy Policy explains how we collect, use, store, and share your data in accordance with
            HIPAA and PIPEDA regulations.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">What We Collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Personal details: name, email, phone number, clinic information</li>
            <li>Medical data: appointment details, provider associations, patient logs</li>
            <li>Technical data: IP address, browser information, usage logs</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To facilitate clinic bookings and manage appointments</li>
            <li>To send communications and reminders via SMS or email</li>
            <li>To improve our services and user experience</li>
            <li>To comply with legal and regulatory obligations</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Data Security</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>All data is encrypted in transit and at rest</li>
            <li>Access is restricted based on user roles</li>
            <li>Audit logs track all key user actions</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Sharing & Disclosure</h2>
          <p className="mb-2">We do not sell or rent your data. We may share your data with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Authorized clinic staff based on your appointment history</li>
            <li>Regulatory authorities when required by law</li>
            <li>Third-party services like Twilio and Stripe under strict data agreements</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Introduction and Scope</h2>
          <p className="mb-4">
            Welcome to BookingLink, a medical appointment scheduling and management platform developed by [Company
            Name]. We are committed to protecting the privacy and personal information of our users, including clinic
            owners, medical practitioners, staff, and patients. This Privacy Policy outlines how we collect, use, share,
            and protect your information. It also explains your rights and how you can manage your data.
          </p>
          <p className="mb-4">
            By accessing or using BookingLink, you agree to this Privacy Policy. If you do not agree, please discontinue
            using the service.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Information We Collect</h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">a. Personal Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Patient Information:</strong> Name, contact details, medical history, appointment records.
            </li>
            <li>
              <strong>Clinic and Practitioner Information:</strong> Name, professional details, contact information,
              availability.
            </li>
            <li>
              <strong>Account Information:</strong> Username, email address, password (encrypted).
            </li>
            <li>
              <strong>Billing Information:</strong> Payment details for subscription and services.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">b. Non-Personal Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Usage Data:</strong> Logs of user interactions, device information, and browser types.
            </li>
            <li>
              <strong>Cookies:</strong> Information collected via cookies to enhance user experience.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">c. Sensitive Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Health Data:</strong> Medical records and appointment history, collected and stored securely as
              required by PHIPA and PIPEDA.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and improve our booking and management services.</li>
            <li>To communicate important updates and notifications.</li>
            <li>For billing and subscription management.</li>
            <li>To comply with legal obligations, including healthcare regulations.</li>
            <li>For analytics and service improvement.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. How We Share Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>With Healthcare Providers:</strong> To manage appointments and patient care.
            </li>
            <li>
              <strong>With Third-Party Service Providers:</strong> For payment processing (Stripe), notifications
              (Twilio), and analytics (Google Analytics).
            </li>
            <li>
              <strong>Legal Compliance:</strong> When required by law, including data protection regulations.
            </li>
            <li>
              <strong>Data Processors:</strong> Authorized personnel only, strictly for service maintenance and support.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Data Retention and Security</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We retain personal data only as long as necessary to fulfill the purposes outlined.</li>
            <li>All data is encrypted using AES-256 and stored securely on Firebase Firestore.</li>
            <li>Backup data is stored on Google Cloud with strict access controls.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Your Rights and Choices</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Access and Update:</strong> You can access and update your personal information via the user
              portal.
            </li>
            <li>
              <strong>Data Deletion:</strong> You can request deletion of your data unless legally obligated to retain
              it.
            </li>
            <li>
              <strong>Opt-Out:</strong> You can choose not to receive marketing communications.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Children's Privacy</h2>
          <p className="mb-4">
            BookingLink is not intended for users under 18 without parental consent. We do not knowingly collect
            personal information from children without verified consent.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8. International Data Transfers</h2>
          <p className="mb-4">
            Data may be transferred and processed outside your jurisdiction in compliance with local data protection
            laws.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">9. Data Protection and Security Measures</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Multi-Factor Authentication (MFA) for user accounts.</li>
            <li>Role-Based Access Control (RBAC) to limit data access.</li>
            <li>Periodic security audits to ensure data integrity.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">10. Cookies and Tracking Technologies</h2>
          <p className="mb-4">
            We use cookies to track user sessions and improve the user experience. You may control cookies through your
            browser settings.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">11. Third-Party Services and Integrations</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Payment Processing:</strong> Stripe
            </li>
            <li>
              <strong>SMS Notifications:</strong> Twilio
            </li>
            <li>
              <strong>Analytics:</strong> Google Analytics
            </li>
          </ul>
          <p className="mt-2 mb-4">
            These third-party services have their own privacy policies. We ensure compliance through secure
            integrations.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">12. Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy to reflect changes in practices or legal requirements. Users will be
            notified of significant changes through the application or email.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">13. Contact Information</h2>
          <p className="mb-4">For any questions or concerns about this Privacy Policy, please contact us at:</p>
          <ul className="list-disc pl-6 space-y-2">
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

          <p className="mt-8 mb-4">
            By using BookingLink, you acknowledge that you have read and understood this Privacy Policy.
          </p>
        </div>
      </main>
    </div>
  )
}

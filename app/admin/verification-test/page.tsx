import { TwilioVerificationTester } from "@/components/admin/twilio-verification-tester"
import AdminNav from "@/components/admin/admin-nav"

export default function VerificationTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav currentPath="/admin/verification-test" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Verification Testing</h1>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <TwilioVerificationTester />
        </div>
      </div>
    </div>
  )
}

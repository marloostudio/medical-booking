import { MFASetup } from "@/components/auth/mfa-setup"

export default function MFASetupPage() {
  return (
    <div className="container py-10 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Account Security</h1>
      <MFASetup />
    </div>
  )
}

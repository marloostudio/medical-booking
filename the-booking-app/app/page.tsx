export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-primary-600 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">BookingLink Platform</h1>
          <p className="opacity-90">Your complete medical appointment solution</p>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold text-primary-700 mb-4">For Clinics</h2>
              <ul className="space-y-2">
                {["Manage appointments", "Staff scheduling", "Patient records", "Automated reminders"].map(
                  (feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary-500"></div>
                      <span>{feature}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-primary-700 mb-4">For Patients</h2>
              <ul className="space-y-2">
                {["Easy booking", "Appointment reminders", "Medical history", "Secure communication"].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary-500"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/login"
              className="bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 transition-colors text-center font-medium"
            >
              Log In
            </a>
            <a
              href="/signup"
              className="bg-white text-primary-600 border border-primary-600 py-3 px-6 rounded-md hover:bg-primary-50 transition-colors text-center font-medium"
            >
              Sign Up
            </a>
            <a href="/dashboard" className="text-primary-600 py-3 px-6 hover:underline text-center font-medium">
              Go to Dashboard
            </a>
          </div>
        </div>

        <div className="bg-gray-50 p-4 text-center text-sm text-gray-600 border-t">
          <p>
            © 2023 BookingLink. All rights reserved. |{" "}
            <a href="/terms" className="text-primary-600 hover:underline">
              Terms
            </a>{" "}
            |{" "}
            <a href="/privacy" className="text-primary-600 hover:underline">
              Privacy
            </a>
          </p>
          <p className="mt-1">Version 2.0 - Updated May 2023</p>
        </div>
      </div>
    </div>
  )
}

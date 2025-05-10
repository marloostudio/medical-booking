import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <nav className="flex space-x-4">
            <Link href="/dashboard" className="text-gray-900 hover:text-gray-700">
              Home
            </Link>
            <Link href="/dashboard/appointments" className="text-gray-900 hover:text-gray-700">
              Appointments
            </Link>
            <Link href="/dashboard/patients-placeholder" className="text-gray-900 hover:text-gray-700">
              Patients
            </Link>
            <Link href="/dashboard/settings" className="text-gray-900 hover:text-gray-700">
              Settings
            </Link>
          </nav>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Today's Appointments</h3>
                  <div className="mt-2 text-3xl font-semibold">12</div>
                  <div className="mt-1 text-sm text-gray-500">3 remaining for today</div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Total Patients</h3>
                  <div className="mt-2 text-3xl font-semibold">1,284</div>
                  <div className="mt-1 text-sm text-gray-500">12 new this week</div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Upcoming Appointments</h3>
                  <div className="mt-2 text-3xl font-semibold">42</div>
                  <div className="mt-1 text-sm text-gray-500">For the next 7 days</div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Latest updates from your clinic.</p>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <li key={item} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">Patient Check-in: John Doe</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completed
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">Dr. Sarah Johnson</p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>Today at 2:30 PM</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

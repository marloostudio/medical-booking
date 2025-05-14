import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-teal-500 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-teal-500/90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            About BookingLink
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl mx-auto">
            Transforming healthcare scheduling with innovative technology to connect patients and providers seamlessly.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Mission</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Simplifying Healthcare Access
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We're on a mission to make healthcare more accessible by removing the barriers between patients and
              providers through intuitive scheduling technology.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-md bg-blue-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-8 w-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Secure & Compliant</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Built with HIPAA compliance and data security as core principles, ensuring patient information is
                    always protected.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-md bg-blue-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-8 w-8"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Efficient & Reliable</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Our platform reduces no-shows by 30% through automated reminders and streamlined booking processes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Team</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Meet the People Behind BookingLink
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              A dedicated team of healthcare and technology experts committed to transforming the patient experience.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
              <div className="text-center">
                <div className="relative mx-auto h-40 w-40 rounded-full overflow-hidden">
                  <Image src="/woman-clinic-manager.png" alt="Sarah Johnson" fill className="object-cover" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Sarah Johnson</h3>
                  <p className="text-sm text-blue-600">CEO & Co-Founder</p>
                  <p className="mt-2 text-base text-gray-500">
                    Former healthcare administrator with 15+ years of experience in medical practice management.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="relative mx-auto h-40 w-40 rounded-full overflow-hidden">
                  <Image src="/man-doctor.png" alt="Dr. Michael Chen" fill className="object-cover" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Dr. Michael Chen</h3>
                  <p className="text-sm text-blue-600">Chief Medical Officer</p>
                  <p className="mt-2 text-base text-gray-500">
                    Board-certified physician passionate about improving healthcare accessibility through technology.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="relative mx-auto h-40 w-40 rounded-full overflow-hidden">
                  <Image src="/woman-doctor.png" alt="Emily Rodriguez" fill className="object-cover" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Emily Rodriguez</h3>
                  <p className="text-sm text-blue-600">CTO & Co-Founder</p>
                  <p className="mt-2 text-base text-gray-500">
                    Tech innovator with extensive experience building secure, scalable healthcare platforms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Values</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              What Drives Us
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800">Patient-Centered</h3>
                <p className="mt-2 text-base text-gray-600">
                  We design every feature with patients in mind, ensuring a seamless and stress-free booking experience.
                </p>
              </div>

              <div className="bg-teal-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-teal-800">Innovation</h3>
                <p className="mt-2 text-base text-gray-600">
                  We continuously evolve our platform to incorporate the latest technologies and best practices.
                </p>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-purple-800">Integrity</h3>
                <p className="mt-2 text-base text-gray-600">
                  We maintain the highest standards of data security and ethical business practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to transform your practice?</span>
            <span className="block text-blue-200">Start using BookingLink today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
              >
                Get started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

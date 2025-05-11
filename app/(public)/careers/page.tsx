import Link from "next/link"
import Image from "next/image"
import { Briefcase, MapPin, Clock, DollarSign, Users, Heart, Zap, BookOpen, Coffee } from "lucide-react"

export default function CareersPage() {
  const openPositions = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Boston, MA (Hybrid)",
      type: "Full-time",
      description:
        "Join our engineering team to build and enhance our healthcare scheduling platform using React, Node.js, and Firebase.",
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "Remote (US)",
      type: "Full-time",
      description:
        "Lead product development initiatives for our healthcare scheduling platform, working closely with engineering, design, and customer success teams.",
    },
    {
      id: 3,
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Boston, MA or Remote",
      type: "Full-time",
      description: "Help our healthcare clients implement and maximize the value of BookingLink in their practices.",
    },
    {
      id: 4,
      title: "UI/UX Designer",
      department: "Design",
      location: "Remote (US)",
      type: "Full-time",
      description:
        "Create intuitive, accessible, and beautiful user experiences for healthcare providers and patients.",
    },
    {
      id: 5,
      title: "Healthcare Integration Specialist",
      department: "Engineering",
      location: "Boston, MA (Hybrid)",
      type: "Full-time",
      description:
        "Develop and maintain integrations between BookingLink and various EHR/EMR systems used by healthcare providers.",
    },
  ]

  const benefits = [
    {
      icon: <Heart className="h-6 w-6 text-pink-500" />,
      title: "Comprehensive Health Benefits",
      description: "Medical, dental, and vision coverage for you and your dependents.",
    },
    {
      icon: <DollarSign className="h-6 w-6 text-green-500" />,
      title: "Competitive Compensation",
      description: "Salary, equity, and performance bonuses that reward your contributions.",
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-500" />,
      title: "Flexible Work Arrangements",
      description: "Remote-friendly culture with flexible hours to support work-life balance.",
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Professional Development",
      description: "Learning stipend and dedicated time for growth and skill development.",
    },
    {
      icon: <Coffee className="h-6 w-6 text-amber-500" />,
      title: "Paid Time Off",
      description: "Generous vacation policy, sick leave, and paid holidays.",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-indigo-500" />,
      title: "Parental Leave",
      description: "Supportive parental leave policy for growing families.",
    },
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-teal-500 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-teal-500/90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Join Our Team</h1>
          <p className="mt-6 text-xl text-white max-w-3xl mx-auto">
            Help us transform healthcare scheduling and improve access to care for patients everywhere.
          </p>
          <div className="mt-10">
            <a
              href="#open-positions"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
            >
              View Open Positions
            </a>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Mission</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Making Healthcare More Accessible
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              At BookingLink, we're on a mission to remove barriers between patients and healthcare providers through
              innovative scheduling technology. We're looking for passionate individuals who share our vision of
              improving healthcare access for all.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src="/medical-appointment-dashboard.png"
                  alt="Team collaboration"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-gray-900">Why Work With Us</h3>
                <p className="mt-4 text-lg text-gray-500">
                  Join a team that's passionate about using technology to solve real healthcare challenges. We value
                  innovation, collaboration, and making a positive impact on healthcare delivery.
                </p>
                <div className="mt-6">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-500">
                        Work on meaningful projects that directly impact healthcare delivery
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-500">
                        Collaborate with a diverse team of healthcare and technology experts
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-500">
                        Grow your career in a supportive environment that values continuous learning
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Values</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              What We Stand For
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our values guide everything we do, from how we build our product to how we interact with each other and
              our customers.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Patient-Centered</h3>
                <p className="mt-2 text-base text-gray-500">
                  We put patients at the center of everything we do, designing our platform to improve their healthcare
                  experience.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white mb-4">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Innovation</h3>
                <p className="mt-2 text-base text-gray-500">
                  We embrace creative solutions and continuously evolve our platform to meet the changing needs of
                  healthcare providers and patients.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mb-4">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Integrity</h3>
                <p className="mt-2 text-base text-gray-500">
                  We maintain the highest standards of data security, privacy, and ethical business practices in
                  everything we do.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Benefits & Perks</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Taking Care of Our Team
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We offer competitive benefits to support your health, wealth, and work-life balance.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    {benefit.icon}
                    <h3 className="ml-3 text-lg font-medium text-gray-900">{benefit.title}</h3>
                  </div>
                  <p className="text-base text-gray-500">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Open Positions Section */}
      <div id="open-positions" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Open Positions</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Join Our Growing Team
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Explore our current openings and find your next opportunity.
            </p>
          </div>

          <div className="mt-12">
            <div className="space-y-6">
              {openPositions.map((position) => (
                <div key={position.id} className="bg-white shadow overflow-hidden rounded-lg">
                  <div className="px-6 py-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{position.title}</h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Briefcase className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>{position.department}</span>
                        </div>
                      </div>
                      <Link
                        href={`/careers/${position.id}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Apply Now
                      </Link>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span>{position.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span>{position.type}</span>
                      </div>
                      <p className="mt-3 text-sm text-gray-600">{position.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-base text-gray-500">
                Don't see a position that matches your skills? We're always looking for talented individuals.
              </p>
              <Link href="/contact" className="mt-3 inline-flex items-center text-blue-600 hover:text-blue-800">
                Contact us about opportunities
                <svg
                  className="ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to join our team?</span>
            <span className="block text-blue-200">Explore our open positions today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="#open-positions"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
              >
                View Positions
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

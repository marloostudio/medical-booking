import Link from "next/link"
import { Check, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
              Choose the plan that works best for your clinic
            </p>
            <div className="flex justify-center items-center space-x-2 mb-10">
              <span className="text-gray-600">Monthly</span>
              <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-blue-600">
                <label
                  htmlFor="toggle"
                  className="absolute left-0 w-6 h-6 mb-2 transition duration-100 ease-in-out transform bg-white rounded-full cursor-pointer"
                  style={{ left: "25%" }}
                ></label>
                <input type="checkbox" id="toggle" name="toggle" className="hidden" />
              </div>
              <span className="text-gray-900 font-medium">Annual (Save 20%)</span>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`rounded-lg overflow-hidden shadow-lg ${
                    plan.popular ? "ring-2 ring-blue-500 scale-105" : ""
                  }`}
                >
                  <div className={`p-6 ${plan.popular ? "bg-blue-500 text-white" : "bg-white text-gray-900"}`}>
                    {plan.popular && (
                      <span className="inline-block px-3 py-1 text-xs font-semibold bg-white text-blue-500 rounded-full mb-4">
                        Most Popular
                      </span>
                    )}
                    <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                    <p className={plan.popular ? "text-blue-100" : "text-gray-500"}>{plan.description}</p>
                    <div className="mt-4 mb-6">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className={plan.popular ? "text-blue-100" : "text-gray-500"}>/month</span>
                    </div>
                  </div>
                  <div className="bg-white p-6">
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                      <Link href="/signup">{plan.buttonText}</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Feature Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-4 px-6 text-left text-gray-600 font-semibold">Feature</th>
                    <th className="py-4 px-6 text-center text-gray-600 font-semibold">Basic</th>
                    <th className="py-4 px-6 text-center text-blue-600 font-semibold">Professional</th>
                    <th className="py-4 px-6 text-center text-gray-600 font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {featureComparison.map((feature, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="py-4 px-6 border-t">
                        <div className="flex items-center">
                          <span>{feature.name}</span>
                          {feature.tooltip && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">{feature.tooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center border-t">{renderFeatureAvailability(feature.basic)}</td>
                      <td className="py-4 px-6 text-center border-t">
                        {renderFeatureAvailability(feature.professional)}
                      </td>
                      <td className="py-4 px-6 text-center border-t">
                        {renderFeatureAvailability(feature.enterprise)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Start your 14-day free trial today. No credit card required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-blue-700"
                asChild
              >
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

// Helper function to render feature availability
function renderFeatureAvailability(availability: boolean | string) {
  if (typeof availability === "boolean") {
    return availability ? (
      <Check className="h-5 w-5 text-green-500 mx-auto" />
    ) : (
      <span className="text-gray-300">—</span>
    )
  }
  return <span className="text-gray-700">{availability}</span>
}

// Pricing plans data
const pricingPlans = [
  {
    name: "Basic",
    description: "For small clinics",
    price: 49,
    features: [
      "Up to 2 staff members",
      "100 appointments/month",
      "Patient management",
      "Email reminders",
      "Basic reporting",
    ],
    buttonText: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    description: "For growing practices",
    price: 99,
    features: [
      "Up to 10 staff members",
      "500 appointments/month",
      "Patient management",
      "SMS & email reminders",
      "Advanced reporting",
      "Staff scheduling",
      "Custom branding",
    ],
    buttonText: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large clinics",
    price: 199,
    features: [
      "Unlimited staff members",
      "Unlimited appointments",
      "Patient management",
      "SMS & email reminders",
      "Advanced reporting",
      "Staff scheduling",
      "Custom branding",
      "API access",
      "Dedicated support",
    ],
    buttonText: "Contact Sales",
    popular: false,
  },
]

// Feature comparison data
const featureComparison = [
  {
    name: "Staff members",
    basic: "2",
    professional: "10",
    enterprise: "Unlimited",
  },
  {
    name: "Appointments per month",
    basic: "100",
    professional: "500",
    enterprise: "Unlimited",
  },
  {
    name: "Patient records",
    basic: "500",
    professional: "2,000",
    enterprise: "Unlimited",
  },
  {
    name: "Email reminders",
    basic: true,
    professional: true,
    enterprise: true,
  },
  {
    name: "SMS reminders",
    basic: false,
    professional: true,
    enterprise: true,
    tooltip: "Automated SMS reminders sent to patients before appointments",
  },
  {
    name: "Online booking",
    basic: true,
    professional: true,
    enterprise: true,
  },
  {
    name: "Custom branding",
    basic: false,
    professional: true,
    enterprise: true,
    tooltip: "Add your logo and customize colors to match your brand",
  },
  {
    name: "Advanced reporting",
    basic: false,
    professional: true,
    enterprise: true,
  },
  {
    name: "API access",
    basic: false,
    professional: false,
    enterprise: true,
    tooltip: "Access our API to integrate with your existing systems",
  },
  {
    name: "HIPAA compliance",
    basic: true,
    professional: true,
    enterprise: true,
  },
  {
    name: "Support",
    basic: "Email",
    professional: "Email & Chat",
    enterprise: "Priority Support",
  },
  {
    name: "Data export",
    basic: "CSV",
    professional: "CSV, Excel",
    enterprise: "CSV, Excel, API",
  },
]

// FAQ data
const faqs = [
  {
    question: "Can I upgrade or downgrade my plan at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. When upgrading, the new features will be immediately available, and we'll prorate the difference in price. When downgrading, the changes will take effect at the start of your next billing cycle.",
  },
  {
    question: "Is there a contract or commitment?",
    answer:
      "No, all our plans are month-to-month with no long-term contracts. You can cancel at any time. If you choose annual billing, you'll pay for 12 months upfront at a discounted rate.",
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "Yes, we offer a 14-day free trial on all our plans. No credit card is required to start your trial. You can explore all the features and decide which plan is right for your clinic.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards including Visa, Mastercard, American Express, and Discover. For Enterprise plans, we can also arrange alternative payment methods including ACH transfers and invoicing.",
  },
  {
    question: "Is my data secure and HIPAA compliant?",
    answer:
      "Yes, BookingLink is fully HIPAA compliant. We use industry-standard encryption for all data, both in transit and at rest. We also provide Business Associate Agreements (BAAs) for all paid plans.",
  },
]

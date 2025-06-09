"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowRight, CheckCircle2, XCircle } from "lucide-react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { auditService } from "@/services/audit-service"
import Link from "next/link"
import { AddressAutocomplete, type AddressDetails } from "@/components/ui/address-autocomplete"

// Password strength indicator component
const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  // Calculate password strength
  const getStrength = (pass: string) => {
    let score = 0
    if (!pass) return score

    // Award points for length
    if (pass.length >= 8) score += 20
    if (pass.length >= 12) score += 10

    // Award points for complexity
    if (/[A-Z]/.test(pass)) score += 15
    if (/[0-9]/.test(pass)) score += 15
    if (/[^A-Za-z0-9]/.test(pass)) score += 15

    // Award points for variety
    const hasLowercase = /[a-z]/.test(pass)
    const hasUppercase = /[A-Z]/.test(pass)
    const hasNumber = /[0-9]/.test(pass)
    const hasSpecial = /[^A-Za-z0-9]/.test(pass)

    const variety = (hasLowercase ? 1 : 0) + (hasUppercase ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecial ? 1 : 0)

    if (variety >= 3) score += 10
    if (variety >= 4) score += 10

    return Math.min(score, 100)
  }

  const strength = getStrength(password)
  const getColor = () => {
    if (strength < 40) return "bg-red-500"
    if (strength < 65) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getLabel = () => {
    if (strength < 40) return "Weak"
    if (strength < 65) return "Good"
    return "Strong"
  }

  const getWidth = () => {
    return `${strength}%`
  }

  const isStrengthSufficient = strength >= 65

  return (
    <div className="mt-1 space-y-1">
      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${getColor()}`} style={{ width: getWidth() }}></div>
      </div>
      <div className="flex justify-between text-xs">
        <span className={strength < 40 ? "text-red-500 font-medium" : "text-gray-500"}>Weak</span>
        <span className={strength >= 40 && strength < 65 ? "text-yellow-500 font-medium" : "text-gray-500"}>Good</span>
        <span className={strength >= 65 ? "text-green-500 font-medium" : "text-gray-500"}>Strong</span>
      </div>
      <div className="text-xs text-gray-600">
        {password && (
          <ul className="space-y-1 mt-1">
            <li className="flex items-center gap-1">
              {/[A-Z]/.test(password) ? (
                <CheckCircle2 className="h-3 w-3 text-green-500" />
              ) : (
                <XCircle className="h-3 w-3 text-gray-300" />
              )}
              <span>Contains uppercase letter</span>
            </li>
            <li className="flex items-center gap-1">
              {/[0-9]/.test(password) ? (
                <CheckCircle2 className="h-3 w-3 text-green-500" />
              ) : (
                <XCircle className="h-3 w-3 text-gray-300" />
              )}
              <span>Contains number</span>
            </li>
            <li className="flex items-center gap-1">
              {/[^A-Za-z0-9]/.test(password) ? (
                <CheckCircle2 className="h-3 w-3 text-green-500" />
              ) : (
                <XCircle className="h-3 w-3 text-gray-300" />
              )}
              <span>Contains special character</span>
            </li>
            <li className="flex items-center gap-1">
              {password.length >= 8 ? (
                <CheckCircle2 className="h-3 w-3 text-green-500" />
              ) : (
                <XCircle className="h-3 w-3 text-gray-300" />
              )}
              <span>At least 8 characters</span>
            </li>
            {!isStrengthSufficient && strength > 0 && (
              <li className="text-yellow-600 font-medium mt-1">Password strength must be at least 65%</li>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}

export function MultiStepSignup() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [addressDetails, setAddressDetails] = useState<AddressDetails | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    clinicName: "",
    clinicAddress: "",
    clinicPhone: "",
    employeeCount: "0-5",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateStep = (currentStep: number) => {
    setError("")

    if (currentStep === 1) {
      if (!formData.firstName) return "First name is required"
      if (!formData.lastName) return "Last name is required"
      if (!formData.clinicName) return "Clinic name is required"
      if (!formData.email) return "Email is required"
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) return "Invalid email format"
    }

    if (currentStep === 2) {
      if (!formData.clinicAddress) return "Clinic address is required"
      if (!formData.clinicPhone) return "Clinic phone is required"
      if (!/^\+?[0-9]{10,15}$/.test(formData.clinicPhone)) return "Invalid phone number format"
    }

    if (currentStep === 3) {
      if (!formData.password) return "Password is required"
      if (formData.password.length < 8) return "Password must be at least 8 characters"
      if (!/[A-Z]/.test(formData.password)) return "Password must contain an uppercase letter"
      if (!/[0-9]/.test(formData.password)) return "Password must contain a number"
      if (!/[^A-Za-z0-9]/.test(formData.password)) return "Password must contain a special character"

      // Calculate password strength
      let strength = 0
      if (formData.password.length >= 8) strength += 20
      if (formData.password.length >= 12) strength += 10
      if (/[A-Z]/.test(formData.password)) strength += 15
      if (/[0-9]/.test(formData.password)) strength += 15
      if (/[^A-Za-z0-9]/.test(formData.password)) strength += 15

      const hasLowercase = /[a-z]/.test(formData.password)
      const hasUppercase = /[A-Z]/.test(formData.password)
      const hasNumber = /[0-9]/.test(formData.password)
      const hasSpecial = /[^A-Za-z0-9]/.test(formData.password)

      const variety = (hasLowercase ? 1 : 0) + (hasUppercase ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecial ? 1 : 0)

      if (variety >= 3) strength += 10
      if (variety >= 4) strength += 10

      if (strength < 65) return "Password strength must be at least 65%"

      if (formData.password !== formData.confirmPassword) return "Passwords do not match"
      if (!acceptedTerms) return "You must accept the terms and conditions"
    }

    return null
  }

  const nextStep = () => {
    const error = validateStep(step)
    if (error) {
      setError(error)
      return
    }

    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const error = validateStep(step)
    if (error) {
      setError(error)
      return
    }

    setLoading(true)
    setError("")

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCredential.user

      // Wait for auth state to be fully updated
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate a unique clinic ID
      const clinicId = crypto.randomUUID()

      // Create the clinic document
      const clinicRef = doc(db, "clinics", clinicId)
      await setDoc(clinicRef, {
        name: formData.clinicName,
        address: addressDetails
          ? {
              full: addressDetails.fullAddress,
              street: addressDetails.street,
              city: addressDetails.city,
              state: addressDetails.state,
              postalCode: addressDetails.postalCode,
              country: addressDetails.country,
            }
          : formData.clinicAddress,
        phone: formData.clinicPhone,
        employeeCount: formData.employeeCount,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        isActive: true,
        verificationStatus: "pending",
      })

      // Create user document
      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: "CLINIC_OWNER",
        clinicId: clinicId,
        createdAt: serverTimestamp(),
        isEmailVerified: false,
        photoURL: "",
      })

      // Log the signup
      await auditService.logAction(clinicId, {
        userId: user.uid,
        action: "create",
        resource: "clinic",
        details: `Clinic created: ${formData.clinicName}`,
        ipAddress: "0.0.0.0", // Would normally come from the request
        userAgent: "MultiStepSignup", // Would normally come from the request
      })

      // Send verification email
      await user.sendEmailVerification()

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error during signup:", error)
      setError(error.message || "An error occurred during signup")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              1
            </div>
            <div className={`h-1 w-12 ${step > 1 ? "bg-green-500" : "bg-gray-200"}`}></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              2
            </div>
            <div className={`h-1 w-12 ${step > 2 ? "bg-green-500" : "bg-gray-200"}`}></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              3
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center">
          {step === 1 && "Create Your Account"}
          {step === 2 && "Clinic Information"}
          {step === 3 && "Set Your Password"}
        </h2>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700">
                Clinic Name
              </label>
              <input
                type="text"
                id="clinicName"
                name="clinicName"
                value={formData.clinicName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={nextStep}
                className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Clinic Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <AddressAutocomplete
                label="Clinic Address"
                onAddressSelect={(details) => {
                  setAddressDetails(details)
                  setFormData((prev) => ({
                    ...prev,
                    clinicAddress: details.fullAddress,
                  }))
                }}
                required
              />
            </div>

            <div>
              <label htmlFor="clinicPhone" className="block text-sm font-medium text-gray-700">
                Clinic Phone Number
              </label>
              <input
                type="tel"
                id="clinicPhone"
                name="clinicPhone"
                value={formData.clinicPhone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700">
                Number of Employees
              </label>
              <select
                id="employeeCount"
                name="employeeCount"
                value={formData.employeeCount}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="0-5">0 to 5</option>
                <option value="5-10">5 to 10</option>
                <option value="10-20">10 to 20</option>
                <option value="20-50">20 to 50</option>
                <option value="50-100">50 to 100</option>
                <option value="100+">More than 100</option>
              </select>
            </div>

            <div className="flex justify-between gap-4 pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="w-1/2 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="w-1/2 flex justify-center items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Password */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              <PasswordStrengthIndicator password={formData.password} />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">
                    I accept the{" "}
                    <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                      Terms and Conditions
                    </Link>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-4 pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="w-1/2 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400"
              >
                {loading ? "Creating Account..." : "Complete Registration"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

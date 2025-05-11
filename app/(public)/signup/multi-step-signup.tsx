"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { auth, db } from "@/lib/firebase"
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { AddressAutocomplete, type AddressDetails } from "@/components/ui/address-autocomplete"

type SignupFormData = {
  clinicName: string
  personName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  address: string
  city: string
  state: string
  zipCode: string
}

export default function MultiStepSignup() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [signupComplete, setSignupComplete] = useState(false)
  const [signupError, setSignupError] = useState<string | null>(null)
  const [formData, setFormData] = useState<SignupFormData>({
    clinicName: "",
    personName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })
  const [errors, setErrors] = useState<Partial<SignupFormData>>({})
  const [addressDetails, setAddressDetails] = useState<AddressDetails | null>(null)

  const updateFormData = (field: keyof SignupFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const validateStep = () => {
    const newErrors: Partial<SignupFormData> = {}

    if (step === 1) {
      if (!formData.clinicName.trim()) {
        newErrors.clinicName = "Clinic name is required"
      }
    } else if (step === 2) {
      if (!formData.personName.trim()) {
        newErrors.personName = "Your name is required"
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid"
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required"
      }
      if (!formData.password) {
        newErrors.password = "Password is required"
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters"
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    } else if (step === 3) {
      if (!formData.address.trim()) {
        newErrors.address = "Address is required"
      }
      if (!formData.city.trim()) {
        newErrors.city = "City is required"
      }
      if (!formData.state.trim()) {
        newErrors.state = "State is required"
      }
      if (!formData.zipCode.trim()) {
        newErrors.zipCode = "ZIP code is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const createClinic = async (userId: string) => {
    // Generate a unique clinic ID
    const clinicId = `clinic_${Date.now()}`

    // Create clinic document
    await setDoc(doc(db, "clinics", clinicId), {
      name: formData.clinicName,
      ownerId: userId,
      address: {
        street: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: "active",
      subscription: {
        plan: "basic",
        status: "trial",
        trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    })

    return clinicId
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep()) return

    setIsLoading(true)
    setSignupError(null)

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCredential.user

      // Wait for auth state to be fully updated
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate a unique clinic ID
      const clinicId = `clinic_${Date.now()}`

      // Create clinic document
      await setDoc(doc(db, "clinics", clinicId), {
        name: formData.clinicName,
        ownerId: user.uid,
        address: addressDetails
          ? {
              full: addressDetails.fullAddress,
              street: addressDetails.street,
              city: addressDetails.city,
              state: addressDetails.state,
              postalCode: addressDetails.postalCode,
              country: addressDetails.country,
            }
          : {
              street: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
            },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: "active",
        subscription: {
          plan: "basic",
          status: "trial",
          trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
      })

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: formData.personName,
        email: formData.email,
        phone: formData.phone,
        clinicId: clinicId,
        role: "CLINIC_OWNER",
        isEmailVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      // Send email verification
      await sendEmailVerification(user)

      // Show completion message
      setSignupComplete(true)

      // After 3 seconds, redirect to dashboard
      setTimeout(() => {
        router.push(`/dev/clinic-dashboard?newSignup=true&email=${encodeURIComponent(formData.email)}`)
      }, 3000)
    } catch (error: any) {
      console.error("Signup error:", error)
      setSignupError(error.message || "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (signupComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
              Account Created Successfully
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Your account has been created successfully. A verification email has been sent to {formData.email}.
              </AlertDescription>
            </Alert>
            <p className="text-center text-gray-600">Redirecting you to your dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Step {step} of 3: {step === 1 ? "Clinic Information" : step === 2 ? "Personal Information" : "Address"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
          <CardContent className="space-y-4">
            {signupError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{signupError}</AlertDescription>
              </Alert>
            )}

            {step === 1 && (
              <div className="space-y-2">
                <Label htmlFor="clinicName">Clinic Name</Label>
                <Input
                  id="clinicName"
                  value={formData.clinicName}
                  onChange={(e) => updateFormData("clinicName", e.target.value)}
                  placeholder="Enter your clinic's name"
                />
                {errors.clinicName && <p className="text-sm text-red-500">{errors.clinicName}</p>}
              </div>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="personName">Your Name</Label>
                  <Input
                    id="personName"
                    value={formData.personName}
                    onChange={(e) => updateFormData("personName", e.target.value)}
                    placeholder="Enter your full name"
                  />
                  {errors.personName && <p className="text-sm text-red-500">{errors.personName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    placeholder="(123) 456-7890"
                  />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                  />
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                  />
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="space-y-2">
                  <AddressAutocomplete
                    label="Address"
                    onAddressSelect={(details) => {
                      setAddressDetails(details)
                      setFormData((prev) => ({
                        ...prev,
                        address: details.street,
                        city: details.city,
                        state: details.state,
                        zipCode: details.postalCode,
                      }))
                    }}
                    required
                  />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
            ) : (
              <div></div>
            )}
            {step < 3 ? (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

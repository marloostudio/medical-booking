"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  country: string
}

// Canadian provinces and territories
const CANADIAN_PROVINCES = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
]

// US states
const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
]

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
    country: "USA", // Default country
  })
  const [errors, setErrors] = useState<Partial<SignupFormData>>({})
  const [addressDetails, setAddressDetails] = useState<AddressDetails | null>(null)
  const [manualAddress, setManualAddress] = useState(false)
  const [postalCodeInput, setPostalCodeInput] = useState("")

  // Refs for form elements to handle Enter key navigation
  const formRefs = {
    clinicName: useRef<HTMLInputElement>(null),
    personName: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
    confirmPassword: useRef<HTMLInputElement>(null),
    address: useRef<HTMLInputElement>(null),
    city: useRef<HTMLInputElement>(null),
    zipCode: useRef<HTMLInputElement>(null),
  }

  // Format Canadian postal code as user types
  const formatCanadianPostalCode = (input: string) => {
    // Remove all non-alphanumeric characters
    const cleaned = input.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()

    // Format as A1B 2C3
    if (cleaned.length <= 3) {
      return cleaned
    } else {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}`
    }
  }

  // Handle postal code input change
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value

    if (formData.country === "Canada") {
      // Format for Canadian postal code
      const formatted = formatCanadianPostalCode(input)
      setPostalCodeInput(formatted)
      updateFormData("zipCode", formatted)
    } else {
      // For US and other countries
      setPostalCodeInput(input)
      updateFormData("zipCode", input)
    }
  }

  // Update postal code format when country changes
  useEffect(() => {
    if (formData.country === "Canada") {
      // Format existing postal code as Canadian
      const formatted = formatCanadianPostalCode(formData.zipCode)
      setPostalCodeInput(formatted)
      updateFormData("zipCode", formatted)
    } else {
      // Keep as is for other countries
      setPostalCodeInput(formData.zipCode)
    }
  }, [formData.country])

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
      if (manualAddress) {
        if (!formData.address.trim()) {
          newErrors.address = "Address is required"
        }
        if (!formData.city.trim()) {
          newErrors.city = "City is required"
        }
        if (!formData.state.trim()) {
          newErrors.state = "State/Province is required"
        }
        if (!formData.zipCode.trim()) {
          newErrors.zipCode = "Postal/ZIP code is required"
        } else if (formData.country === "Canada" && !/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(formData.zipCode)) {
          newErrors.zipCode = "Please enter a valid Canadian postal code (A1B 2C3)"
        }
      } else if (!addressDetails && !formData.address) {
        // Only show error if neither addressDetails nor manual address is provided
        newErrors.address = "Please enter an address"
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

  const handleKeyDown = (e: React.KeyboardEvent, field: keyof typeof formRefs) => {
    if (e.key === "Enter") {
      e.preventDefault()

      // If we're on the last field of a step, try to go to next step
      if (
        (step === 1 && field === "clinicName") ||
        (step === 2 && field === "confirmPassword") ||
        (step === 3 && manualAddress && field === "zipCode")
      ) {
        handleNext()
      } else if (step === 2) {
        // Navigate to the next field in step 2
        const fields: (keyof typeof formRefs)[] = ["personName", "email", "phone", "password", "confirmPassword"]
        const currentIndex = fields.indexOf(field)
        if (currentIndex < fields.length - 1) {
          const nextField = fields[currentIndex + 1]
          formRefs[nextField]?.current?.focus()
        }
      } else if (step === 3 && manualAddress) {
        // Navigate to the next field in step 3 manual address
        const fields: (keyof typeof formRefs)[] = ["address", "city", "zipCode"]
        const currentIndex = fields.indexOf(field)
        if (currentIndex < fields.length - 1) {
          const nextField = fields[currentIndex + 1]
          formRefs[nextField]?.current?.focus()
        }
      }
    }
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

      // Prepare address data
      const addressData = addressDetails
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
            country: formData.country,
          }

      // Create clinic document
      await setDoc(doc(db, "clinics", clinicId), {
        name: formData.clinicName,
        ownerId: user.uid,
        address: addressData,
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
                  ref={formRefs.clinicName}
                  value={formData.clinicName}
                  onChange={(e) => updateFormData("clinicName", e.target.value)}
                  placeholder="Enter your clinic's name"
                  onKeyDown={(e) => handleKeyDown(e, "clinicName")}
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
                    ref={formRefs.personName}
                    value={formData.personName}
                    onChange={(e) => updateFormData("personName", e.target.value)}
                    placeholder="Enter your full name"
                    onKeyDown={(e) => handleKeyDown(e, "personName")}
                  />
                  {errors.personName && <p className="text-sm text-red-500">{errors.personName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    ref={formRefs.email}
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="your@email.com"
                    onKeyDown={(e) => handleKeyDown(e, "email")}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    ref={formRefs.phone}
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    placeholder="(123) 456-7890"
                    onKeyDown={(e) => handleKeyDown(e, "phone")}
                  />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    ref={formRefs.password}
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "password")}
                  />
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    ref={formRefs.confirmPassword}
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "confirmPassword")}
                  />
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                {!manualAddress ? (
                  <div className="space-y-4">
                    <AddressAutocomplete
                      label="Address"
                      placeholder="Start typing your address..."
                      onAddressSelect={(details) => {
                        setAddressDetails(details)
                        setFormData((prev) => ({
                          ...prev,
                          address: details.street,
                          city: details.city,
                          state: details.state,
                          zipCode: details.postalCode,
                          country: details.country || prev.country,
                        }))
                      }}
                      required
                      error={errors.address}
                    />

                    {addressDetails && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <p className="font-medium">Selected Address:</p>
                        <p>{addressDetails.street}</p>
                        <p>
                          {addressDetails.city}, {addressDetails.state} {addressDetails.postalCode}
                        </p>
                        <p>{addressDetails.country}</p>
                      </div>
                    )}

                    <Button type="button" variant="outline" className="w-full" onClick={() => setManualAddress(true)}>
                      Enter address manually instead
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select value={formData.country} onValueChange={(value) => updateFormData("country", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USA">United States</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        ref={formRefs.address}
                        value={formData.address}
                        onChange={(e) => updateFormData("address", e.target.value)}
                        placeholder="123 Main St"
                        onKeyDown={(e) => handleKeyDown(e, "address")}
                      />
                      {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        ref={formRefs.city}
                        value={formData.city}
                        onChange={(e) => updateFormData("city", e.target.value)}
                        placeholder="New York"
                        onKeyDown={(e) => handleKeyDown(e, "city")}
                      />
                      {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="state">{formData.country === "Canada" ? "Province" : "State"}</Label>
                        <Select value={formData.state} onValueChange={(value) => updateFormData("state", value)}>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={formData.country === "Canada" ? "Select province" : "Select state"}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {formData.country === "Canada"
                              ? CANADIAN_PROVINCES.map((province) => (
                                  <SelectItem key={province.value} value={province.value}>
                                    {province.label}
                                  </SelectItem>
                                ))
                              : US_STATES.map((state) => (
                                  <SelectItem key={state.value} value={state.value}>
                                    {state.label}
                                  </SelectItem>
                                ))}
                          </SelectContent>
                        </Select>
                        {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zipCode">{formData.country === "Canada" ? "Postal Code" : "ZIP Code"}</Label>
                        <Input
                          id="zipCode"
                          ref={formRefs.zipCode}
                          value={postalCodeInput}
                          onChange={handlePostalCodeChange}
                          placeholder={formData.country === "Canada" ? "A1B 2C3" : "10001"}
                          onKeyDown={(e) => handleKeyDown(e, "zipCode")}
                          maxLength={formData.country === "Canada" ? 7 : 10}
                        />
                        {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
                      </div>
                    </div>

                    <Button type="button" variant="outline" className="w-full" onClick={() => setManualAddress(false)}>
                      Use address autocomplete instead
                    </Button>
                  </div>
                )}
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

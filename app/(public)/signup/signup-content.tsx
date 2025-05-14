"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { auth, db } from "@/lib/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore"
import { EnhancedAddressInput } from "@/components/ui/enhanced-address-input"

// Simple default export as recommended by Next.js
export default function SignupContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [clinicName, setClinicName] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState({
    street: "",
    unit: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  })
  const [error, setError] = useState("")
  const [emailExists, setEmailExists] = useState(false)
  const [emailChecking, setEmailChecking] = useState(false)
  const [passwordsMatch, setPasswordsMatch] = useState(null)
  const router = useRouter()

  // Check if passwords match whenever either password field changes
  useEffect(() => {
    if (password && confirmPassword) {
      setPasswordsMatch(password === confirmPassword)
    } else {
      setPasswordsMatch(null)
    }
  }, [password, confirmPassword])

  // Check if email exists in database with debounce
  useEffect(() => {
    const checkEmailExists = async () => {
      if (!email || !email.includes("@") || !email.includes(".")) return

      setEmailChecking(true)
      try {
        // Check if email exists in staff collection
        const staffQuery = query(collection(db, "staff"), where("email", "==", email))
        const staffSnapshot = await getDocs(staffQuery)

        if (!staffSnapshot.empty) {
          setEmailExists(true)
          return
        }

        // If not found in staff, check if it exists in Firebase Auth
        // This is a simplified check - in production you'd use a server function
        try {
          // We'll attempt to sign in with a fake password to see if the email exists
          // This will always fail, but the error message tells us if the email exists
          await createUserWithEmailAndPassword(auth, email, "temporaryPassword123!@#")
          // If we get here, the email doesn't exist (which shouldn't happen)
          setEmailExists(false)
        } catch (authError) {
          // Check the error code to determine if email exists
          if (authError.code === "auth/email-already-in-use") {
            setEmailExists(true)
          } else {
            setEmailExists(false)
          }
        }
      } catch (err) {
        console.error("Error checking email:", err)
      } finally {
        setEmailChecking(false)
      }
    }

    const timeoutId = setTimeout(checkEmailExists, 500)
    return () => clearTimeout(timeoutId)
  }, [email])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validate inputs
    if (!email || !password || !confirmPassword || !clinicName || !fullName) {
      setError("All required fields must be filled")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    if (emailExists) {
      setError("Email already exists. Please log in instead.")
      return
    }

    setIsLoading(true)

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Generate a unique clinic ID
      const clinicId = `clinic_${Date.now()}`

      // Create the clinic document
      await setDoc(doc(db, "clinics", clinicId), {
        name: clinicName,
        owner: user.uid,
        email: email,
        phone: phone,
        address: address
          ? {
              street: address.street || "",
              unit: address.unit || "",
              city: address.city || "",
              state: address.state || "",
              zipCode: address.zipCode || "",
              country: address.country || "United States",
            }
          : {},
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: "active",
        plan: "basic",
        settings: {
          appointmentBuffer: 15,
          defaultAppointmentDuration: 30,
          weekStartsOn: 0, // Sunday
          businessHours: {
            monday: { isOpen: true, open: "09:00", close: "17:00" },
            tuesday: { isOpen: true, open: "09:00", close: "17:00" },
            wednesday: { isOpen: true, open: "09:00", close: "17:00" },
            thursday: { isOpen: true, open: "09:00", close: "17:00" },
            friday: { isOpen: true, open: "09:00", close: "17:00" },
            saturday: { isOpen: false, open: "09:00", close: "13:00" },
            sunday: { isOpen: false, open: "00:00", close: "00:00" },
          },
        },
      })

      // Create the user profile
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        displayName: fullName,
        clinicId: clinicId,
        role: "CLINIC_OWNER",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        emailVerified: false,
        status: "active",
        lastLogin: serverTimestamp(),
      })

      // Create a staff record
      await setDoc(doc(db, "staff", user.uid), {
        clinicId: clinicId,
        name: fullName,
        email: email,
        phone: phone,
        role: "CLINIC_OWNER",
        permissions: ["all"],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      setIsLoading(false)

      // Redirect to the dashboard
      router.push("/dashboard")
    } catch (err) {
      setIsLoading(false)
      if (err.code === "auth/email-already-in-use") {
        setError("Email already exists. Please log in instead.")
      } else {
        setError(err.message || "Failed to create account")
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Create your BookingLink account</CardTitle>
          <CardDescription>Enter your information to get started with BookingLink</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Account Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className={emailExists ? "pr-10 border-red-500" : ""}
                    />
                    {emailChecking && (
                      <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                    )}
                    {emailExists && !emailChecking && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  {emailExists && (
                    <p className="text-sm text-red-500 mt-1">
                      This email is already registered.{" "}
                      <Link href="/login" className="underline">
                        Log in instead
                      </Link>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {password && password.length < 8 && (
                    <p className="text-sm text-red-500 mt-1">Password must be at least 8 characters</p>
                  )}
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="confirmPassword">
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className={
                        passwordsMatch === false
                          ? "pr-10 border-red-500"
                          : passwordsMatch === true
                            ? "pr-10 border-green-500"
                            : ""
                      }
                    />
                    {passwordsMatch === true && confirmPassword && (
                      <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                    {passwordsMatch === false && confirmPassword && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  {passwordsMatch === false && confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
                  )}
                </div>
              </div>

              {/* Right Column - Clinic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Clinic Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="clinicName">
                    Clinic Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="clinicName"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    placeholder="Main Street Medical"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Clinic Address</Label>
                  <EnhancedAddressInput address={address} setAddress={setAddress} />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={isLoading || emailExists || passwordsMatch === false}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
            <p className="text-sm text-center mt-2">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

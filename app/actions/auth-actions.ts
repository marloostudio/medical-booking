"use server"

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { auditService } from "@/services/audit-service"
import { clinicService } from "@/services/clinic-service"
import { staffService } from "@/services/staff-service"

export async function createAccount(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const clinicName = (formData.get("clinicName") as string) || ""
  const fullName = (formData.get("fullName") as string) || ""

  try {
    // Create the user account in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Create a new clinic
    const clinic = await clinicService.createClinic(user.uid, {
      name: clinicName,
      email: email,
    })

    // Create a staff member record for the owner
    await staffService.createStaffMember({
      clinicId: clinic.id,
      name: fullName,
      role: "owner",
      email: email,
      phoneNumber: "",
      permissions: ["all"], // Owner has all permissions
    })

    // Log the account creation
    await auditService.logAction(clinic.id, {
      userId: user.uid,
      action: "create",
      resource: "clinic",
      details: "Clinic account created",
      ipAddress: "0.0.0.0", // This would be the actual IP in a real implementation
      userAgent: "Server Action", // This would be the actual user agent in a real implementation
    })

    return { success: true, userId: user.uid, clinicId: clinic.id }
  } catch (error: any) {
    console.error("Error creating account:", error)
    return { success: false, error: error.message || "Failed to create account" }
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    // Sign in the user
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Find the staff member record to get the clinic ID
    const staffMember = await staffService.getStaffByEmail(email)

    if (!staffMember) {
      throw new Error("Staff record not found. Please contact support.")
    }

    const clinicId = staffMember.clinicId

    // Log the login action
    await auditService.logAction(clinicId, {
      userId: user.uid,
      action: "login",
      resource: "user",
      details: "User logged in",
      ipAddress: "0.0.0.0", // This would be the actual IP in a real implementation
      userAgent: "Server Action", // This would be the actual user agent in a real implementation
    })

    return { success: true, userId: user.uid, clinicId, role: staffMember.role }
  } catch (error: any) {
    console.error("Error during login:", error)
    return { success: false, error: error.message || "Invalid email or password" }
  }
}

export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string

  try {
    // In a real implementation, this would send a password reset email
    // For demo purposes, we'll just simulate success
    console.log("Password reset requested for:", email)

    return { success: true, message: "Password reset instructions sent to your email" }
  } catch (error: any) {
    console.error("Error requesting password reset:", error)
    return { success: false, error: error.message || "Failed to request password reset" }
  }
}

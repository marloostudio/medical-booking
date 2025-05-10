import { z } from "zod"

// Common validation schemas
export const emailSchema = z.string().min(1, "Email is required").email("Invalid email address")

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")

export const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(/^\+?[0-9]{10,15}$/, "Phone number must be between 10-15 digits")

export const nameSchema = z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters")

// Patient schema
export const patientSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  address: z
    .object({
      street: z.string().min(1, "Street address is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      postalCode: z.string().min(1, "Postal code is required"),
      country: z.string().min(1, "Country is required"),
    })
    .optional(),
  emergencyContact: z
    .object({
      name: nameSchema,
      relationship: z.string().min(1, "Relationship is required"),
      phone: phoneSchema,
    })
    .optional(),
  insuranceInfo: z
    .object({
      provider: z.string().min(1, "Insurance provider is required"),
      policyNumber: z.string().min(1, "Policy number is required"),
      groupNumber: z.string().optional(),
    })
    .optional(),
})

// Appointment schema
export const appointmentSchema = z.object({
  clinicId: z.string().min(1, "Clinic ID is required"),
  patientId: z.string().min(1, "Patient ID is required"),
  staffId: z.string().min(1, "Staff ID is required"),
  appointmentTypeId: z.string().min(1, "Appointment type is required"),
  startTime: z.date(),
  patientNotes: z.string().optional(),
})

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

// Registration schema
export const registrationSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

// Clinic schema
export const clinicSchema = z.object({
  name: z.string().min(1, "Clinic name is required"),
  address: z.string().min(1, "Address is required"),
  phone: phoneSchema,
  email: emailSchema,
  website: z.string().url("Invalid website URL").optional(),
  description: z.string().optional(),
})

// Helper function to validate data against a schema
export function validateData<T>(
  schema: z.ZodType<T>,
  data: unknown,
): {
  success: boolean
  data?: T
  errors?: z.ZodFormattedError<T>
} {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.format() }
    }
    throw error
  }
}

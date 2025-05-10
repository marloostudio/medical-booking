"use client"

import React from "react"

import { useState, useTransition, type FormEvent } from "react"
import { z } from "zod"
import { AccessibleForm } from "./accessible-form"

interface ValidatedFormProps<T extends z.ZodType> {
  schema: T
  onSubmit: (data: z.infer<T>) => Promise<{ success: boolean; message?: string }>
  action: string
  method?: "post" | "put" | "delete"
  title?: string
  description?: string
  submitText?: string
  className?: string
  children: React.ReactNode
}

export function ValidatedForm<T extends z.ZodType>({
  schema,
  onSubmit,
  action,
  method = "post",
  title,
  description,
  submitText = "Submit",
  className,
  children,
}: ValidatedFormProps<T>) {
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Clear previous errors and messages
    setErrors({})
    setMessage(null)

    // Get form data
    const formData = new FormData(e.currentTarget)
    const formValues: Record<string, any> = {}

    // Convert FormData to object
    for (const [key, value] of formData.entries()) {
      formValues[key] = value
    }

    // Validate with Zod
    try {
      const validatedData = schema.parse(formValues)

      // Submit data
      startTransition(async () => {
        try {
          const result = await onSubmit(validatedData)

          if (result.success) {
            setMessage({ type: "success", text: result.message || "Form submitted successfully" })
            // Optionally reset form
            if (method !== "put") {
              e.currentTarget.reset()
            }
          } else {
            setMessage({ type: "error", text: result.message || "Form submission failed" })
          }
        } catch (error) {
          console.error("Form submission error:", error)
          setMessage({ type: "error", text: "An unexpected error occurred" })
        }
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to a more usable format
        const fieldErrors: Record<string, string[]> = {}

        error.errors.forEach((err) => {
          const field = err.path.join(".")
          if (!fieldErrors[field]) {
            fieldErrors[field] = []
          }
          fieldErrors[field].push(err.message)
        })

        setErrors(fieldErrors)
        setMessage({ type: "error", text: "Please fix the errors in the form" })
      } else {
        console.error("Validation error:", error)
        setMessage({ type: "error", text: "An unexpected error occurred" })
      }
    }
  }

  return (
    <AccessibleForm
      action={action}
      method={method}
      title={title}
      description={description}
      errorMessage={message?.type === "error" ? message.text : undefined}
      successMessage={message?.type === "success" ? message.text : undefined}
      className={className}
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        {/* Clone children and add error props */}
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.props.name) {
            return React.cloneElement(child, {
              error: errors[child.props.name]?.[0],
              "aria-invalid": errors[child.props.name] ? "true" : undefined,
              "aria-errormessage": errors[child.props.name] ? `${child.props.name}-error` : undefined,
            })
          }
          return child
        })}

        <button
          type="submit"
          disabled={isPending}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Submitting..." : submitText}
        </button>
      </div>
    </AccessibleForm>
  )
}

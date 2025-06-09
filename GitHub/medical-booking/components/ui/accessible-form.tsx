import { forwardRef, type FormHTMLAttributes, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { CSRFForm } from "@/components/csrf-form"

export interface AccessibleFormProps extends FormHTMLAttributes<HTMLFormElement> {
  action: string
  method?: "post" | "put" | "delete"
  title?: string
  description?: string
  errorMessage?: string
  successMessage?: string
  children: ReactNode
}

const AccessibleForm = forwardRef<HTMLFormElement, AccessibleFormProps>(
  (
    { className, children, action, method = "post", title, description, errorMessage, successMessage, ...props },
    ref,
  ) => {
    const formId = props.id || `form-${Math.random().toString(36).substring(2, 9)}`
    const descriptionId = `${formId}-description`
    const errorId = `${formId}-error`
    const successId = `${formId}-success`

    return (
      <div className={cn("space-y-4", className)}>
        {title && (
          <h2 id={`${formId}-title`} className="text-lg font-medium">
            {title}
          </h2>
        )}

        {description && (
          <p id={descriptionId} className="text-sm text-gray-500">
            {description}
          </p>
        )}

        {errorMessage && (
          <div
            id={errorId}
            role="alert"
            className="p-3 rounded-md bg-red-50 text-red-800 text-sm"
            aria-live="assertive"
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            id={successId}
            role="status"
            className="p-3 rounded-md bg-green-50 text-green-800 text-sm"
            aria-live="polite"
          >
            {successMessage}
          </div>
        )}

        <CSRFForm
          action={action}
          method={method}
          className="space-y-4"
          aria-labelledby={title ? `${formId}-title` : undefined}
          aria-describedby={
            [description ? descriptionId : null, errorMessage ? errorId : null, successMessage ? successId : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          {...props}
          ref={ref}
        >
          {children}
        </CSRFForm>
      </div>
    )
  },
)

AccessibleForm.displayName = "AccessibleForm"

export { AccessibleForm }

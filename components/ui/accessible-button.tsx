"use client"

import { forwardRef, type ButtonHTMLAttributes, type KeyboardEvent } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
  description?: string
  isPressed?: boolean
  isExpanded?: boolean
  controlsId?: string
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    { className, children, label, description, isPressed, isExpanded, controlsId, onClick, onKeyDown, ...props },
    ref,
  ) => {
    // Handle keyboard events for accessibility
    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onClick?.(e as any)
      }

      onKeyDown?.(e)
    }

    return (
      <Button
        className={cn(className)}
        ref={ref}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        aria-label={label}
        aria-describedby={description ? `${props.id}-desc` : undefined}
        aria-pressed={isPressed}
        aria-expanded={isExpanded}
        aria-controls={controlsId}
        {...props}
      >
        {children}
        {description && (
          <span id={`${props.id}-desc`} className="sr-only">
            {description}
          </span>
        )}
      </Button>
    )
  },
)

AccessibleButton.displayName = "AccessibleButton"

export { AccessibleButton }

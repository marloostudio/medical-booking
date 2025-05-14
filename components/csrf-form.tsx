"use client"

import { useEffect, useState, type FormEvent, type ReactNode } from "react"

interface CSRFFormProps {
  action: string
  method?: "post" | "put" | "delete"
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void
  children: ReactNode
  className?: string
}

export function CSRFForm({ action, method = "post", onSubmit, children, className }: CSRFFormProps) {
  const [csrfToken, setCsrfToken] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Fetch CSRF token when component mounts
    const fetchToken = async () => {
      try {
        const response = await fetch("/api/csrf/token")
        const data = await response.json()
        setCsrfToken(data.token)
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchToken()
  }, [])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (onSubmit) {
      onSubmit(e)
    }
  }

  if (isLoading) {
    return <div>Loading form...</div>
  }

  return (
    <form action={action} method={method} onSubmit={handleSubmit} className={className}>
      <input type="hidden" name="csrfToken" value={csrfToken} />
      {children}
    </form>
  )
}

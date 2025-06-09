import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PageTemplateProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function PageTemplate({ title, description, children }: PageTemplateProps) {
  return (
    <div className="w-full max-w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      <div className="w-full overflow-x-auto">
        {children || (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
            <p className="text-muted-foreground">This page is under construction.</p>
            <p className="text-muted-foreground">Content will be available soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Add the missing PageCard component
interface PageCardProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function PageCard({ title, description, children, className }: PageCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

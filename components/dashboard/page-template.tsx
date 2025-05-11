import type React from "react"

interface PageTemplateProps {
  title: string
  description?: string
  children: React.ReactNode
}

export function PageTemplate({ title, description, children }: PageTemplateProps) {
  return (
    <div className="w-full max-w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      <div className="w-full overflow-x-auto">{children}</div>
    </div>
  )
}

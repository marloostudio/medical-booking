"use client"

import { Suspense, type ReactNode } from "react"

interface SuspenseWrapperProps {
  children: ReactNode
  fallback?: ReactNode
}

export default function SuspenseWrapper({
  children,
  fallback = (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-pulse text-lg">Loading...</div>
    </div>
  ),
}: SuspenseWrapperProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>
}

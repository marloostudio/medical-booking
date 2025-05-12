"use client"

import type React from "react"
import { Tooltip as RechartsTooltip, type TooltipProps } from "recharts"

export function ChartTooltip({ content, ...props }: TooltipProps<any, any>) {
  return <RechartsTooltip content={content} {...props} />
}

export function ChartTooltipContent({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="font-medium">{label}</div>
      {payload.map((item: any, index: number) => (
        <div key={`item-${index}`} className="flex items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span>{item.name}</span>
          </div>
          <div>{item.value}</div>
        </div>
      ))}
    </div>
  )
}

export function ChartContainer({ children, config }: { children: React.ReactNode; config?: any }) {
  // Apply any configuration to the children
  return <>{children}</>
}

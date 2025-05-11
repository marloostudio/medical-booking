"use client"

import * as React from "react"
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip"

interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartContainerProps {
  children: React.ReactNode
  config: ChartConfig
}

export function ChartContainer({ children, config }: ChartContainerProps) {
  // Create CSS variables for chart colors
  const style = Object.entries(config).reduce(
    (acc, [key, value]) => {
      acc[`--color-${key}`] = value.color
      return acc
    },
    {} as Record<string, string>,
  )

  return <div style={style}>{children}</div>
}

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    dataKey: string
  }>
  label?: string
  config?: ChartConfig
}

export function ChartTooltipContent({ active, payload, label, config }: ChartTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <div className="font-medium">{label}</div>
        <div className="font-medium text-right"></div>
        {payload.map((entry) => (
          <React.Fragment key={entry.dataKey}>
            <div className="flex items-center gap-1">
              <div
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: config?.[entry.dataKey]?.color || "currentColor",
                }}
              />
              <div>{config?.[entry.dataKey]?.label || entry.name}</div>
            </div>
            <div className="text-right">{entry.value}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export function ChartTooltip(props: React.ComponentProps<typeof Tooltip>) {
  return (
    <TooltipProvider>
      <Tooltip {...props} />
    </TooltipProvider>
  )
}

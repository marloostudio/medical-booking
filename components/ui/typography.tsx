import { cn } from "@/lib/utils"
import type React from "react"

interface TypographyProps {
  children: React.ReactNode
  className?: string
}

export function DisplayXXL({ children, className }: TypographyProps) {
  return <h1 className={cn("text-5xl font-bold tracking-tight", className)}>{children}</h1>
}

export function DisplayXL({ children, className }: TypographyProps) {
  return <h1 className={cn("text-4xl font-bold tracking-tight", className)}>{children}</h1>
}

export function DisplayLG({ children, className }: TypographyProps) {
  return <h1 className={cn("text-3xl font-bold tracking-tight", className)}>{children}</h1>
}

export function DisplayMD({ children, className }: TypographyProps) {
  return <h1 className={cn("text-2xl font-bold tracking-tight", className)}>{children}</h1>
}

export function DisplaySM({ children, className }: TypographyProps) {
  return <h2 className={cn("text-xl font-bold tracking-tight", className)}>{children}</h2>
}

export function DisplayXS({ children, className }: TypographyProps) {
  return <h2 className={cn("text-lg font-bold tracking-tight", className)}>{children}</h2>
}

export function HeadingXXL({ children, className }: TypographyProps) {
  return <h1 className={cn("text-4xl font-bold", className)}>{children}</h1>
}

export function HeadingXL({ children, className }: TypographyProps) {
  return <h1 className={cn("text-3xl font-bold", className)}>{children}</h1>
}

export function HeadingLG({ children, className }: TypographyProps) {
  return <h2 className={cn("text-2xl font-semibold", className)}>{children}</h2>
}

export function HeadingMD({ children, className }: TypographyProps) {
  return <h3 className={cn("text-xl font-semibold", className)}>{children}</h3>
}

export function HeadingSM({ children, className }: TypographyProps) {
  return <h4 className={cn("text-lg font-semibold", className)}>{children}</h4>
}

export function HeadingXS({ children, className }: TypographyProps) {
  return <h5 className={cn("text-base font-semibold", className)}>{children}</h5>
}

export function TitleLG({ children, className }: TypographyProps) {
  return <h6 className={cn("text-lg font-medium", className)}>{children}</h6>
}

export function TitleMD({ children, className }: TypographyProps) {
  return <p className={cn("text-base font-medium", className)}>{children}</p>
}

export function TitleSM({ children, className }: TypographyProps) {
  return <p className={cn("text-sm font-medium", className)}>{children}</p>
}

export function TitleXS({ children, className }: TypographyProps) {
  return <p className={cn("text-xs font-medium", className)}>{children}</p>
}

export function BodyXL({ children, className }: TypographyProps) {
  return <p className={cn("text-xl", className)}>{children}</p>
}

export function BodyLG({ children, className }: TypographyProps) {
  return <p className={cn("text-lg", className)}>{children}</p>
}

export function BodyMD({ children, className }: TypographyProps) {
  return <p className={cn("text-base", className)}>{children}</p>
}

export function BodySM({ children, className }: TypographyProps) {
  return <p className={cn("text-sm", className)}>{children}</p>
}

export function BodyXS({ children, className }: TypographyProps) {
  return <p className={cn("text-xs", className)}>{children}</p>
}

export function LabelLG({ children, className }: TypographyProps) {
  return <p className={cn("text-lg font-medium uppercase tracking-wide", className)}>{children}</p>
}

export function LabelMD({ children, className }: TypographyProps) {
  return <p className={cn("text-base font-medium uppercase tracking-wide", className)}>{children}</p>
}

export function LabelSM({ children, className }: TypographyProps) {
  return <p className={cn("text-sm font-medium uppercase tracking-wide", className)}>{children}</p>
}

export function Lead({ children, className }: TypographyProps) {
  return <p className={cn("text-xl text-muted-foreground", className)}>{children}</p>
}

export function Small({ children, className }: TypographyProps) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
}

export function Caption({ children, className }: TypographyProps) {
  return <p className={cn("text-xs text-muted-foreground", className)}>{children}</p>
}

export function Overline({ children, className }: TypographyProps) {
  return <p className={cn("text-xs font-medium uppercase tracking-widest", className)}>{children}</p>
}

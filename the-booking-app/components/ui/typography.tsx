import { cn } from "@/lib/utils"
import type React from "react"

interface TypographyProps {
  children: React.ReactNode
  className?: string
}

export function DisplayXXL({ children, className }: TypographyProps) {
  return <h1 className={cn("display-2xl", className)}>{children}</h1>
}

export function DisplayXL({ children, className }: TypographyProps) {
  return <h1 className={cn("display-xl", className)}>{children}</h1>
}

export function DisplayLG({ children, className }: TypographyProps) {
  return <h1 className={cn("display-lg", className)}>{children}</h1>
}

export function DisplayMD({ children, className }: TypographyProps) {
  return <h1 className={cn("display-md", className)}>{children}</h1>
}

export function DisplaySM({ children, className }: TypographyProps) {
  return <h2 className={cn("display-sm", className)}>{children}</h2>
}

export function DisplayXS({ children, className }: TypographyProps) {
  return <h2 className={cn("display-xs", className)}>{children}</h2>
}

export function HeadingXXL({ children, className }: TypographyProps) {
  return <h1 className={cn("heading-2xl", className)}>{children}</h1>
}

export function HeadingXL({ children, className }: TypographyProps) {
  return <h1 className={cn("heading-xl", className)}>{children}</h1>
}

export function HeadingLG({ children, className }: TypographyProps) {
  return <h2 className={cn("heading-lg", className)}>{children}</h2>
}

export function HeadingMD({ children, className }: TypographyProps) {
  return <h3 className={cn("heading-md", className)}>{children}</h3>
}

export function HeadingSM({ children, className }: TypographyProps) {
  return <h4 className={cn("heading-sm", className)}>{children}</h4>
}

export function HeadingXS({ children, className }: TypographyProps) {
  return <h5 className={cn("heading-xs", className)}>{children}</h5>
}

export function TitleLG({ children, className }: TypographyProps) {
  return <h6 className={cn("title-lg", className)}>{children}</h6>
}

export function TitleMD({ children, className }: TypographyProps) {
  return <p className={cn("title-md", className)}>{children}</p>
}

export function TitleSM({ children, className }: TypographyProps) {
  return <p className={cn("title-sm", className)}>{children}</p>
}

export function TitleXS({ children, className }: TypographyProps) {
  return <p className={cn("title-xs", className)}>{children}</p>
}

export function BodyXL({ children, className }: TypographyProps) {
  return <p className={cn("body-xl", className)}>{children}</p>
}

export function BodyLG({ children, className }: TypographyProps) {
  return <p className={cn("body-lg", className)}>{children}</p>
}

export function BodyMD({ children, className }: TypographyProps) {
  return <p className={cn("body-md", className)}>{children}</p>
}

export function BodySM({ children, className }: TypographyProps) {
  return <p className={cn("body-sm", className)}>{children}</p>
}

export function BodyXS({ children, className }: TypographyProps) {
  return <p className={cn("body-xs", className)}>{children}</p>
}

export function LabelLG({ children, className }: TypographyProps) {
  return <p className={cn("label-lg", className)}>{children}</p>
}

export function LabelMD({ children, className }: TypographyProps) {
  return <p className={cn("label-md", className)}>{children}</p>
}

export function LabelSM({ children, className }: TypographyProps) {
  return <p className={cn("label-sm", className)}>{children}</p>
}

export function Lead({ children, className }: TypographyProps) {
  return <p className={cn("lead", className)}>{children}</p>
}

export function Small({ children, className }: TypographyProps) {
  return <p className={cn("small", className)}>{children}</p>
}

export function Caption({ children, className }: TypographyProps) {
  return <p className={cn("caption", className)}>{children}</p>
}

export function Overline({ children, className }: TypographyProps) {
  return <p className={cn("overline", className)}>{children}</p>
}

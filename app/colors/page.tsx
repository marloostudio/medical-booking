"use client"

import { cn } from "@/lib/utils"

export default function ColorsPage() {
  return (
    <div className="container py-12 space-y-12">
      <div>
        <h1 className="mb-6">Color System</h1>
        <p className="mb-8 text-lg">This page showcases the color system for the BookingLink platform.</p>
      </div>

      <section className="space-y-6">
        <h2>Primary Colors (Teal)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((weight) => (
            <ColorCard
              key={`primary-${weight}`}
              name={`primary-${weight}`}
              className={`bg-primary-${weight}`}
              textClass={weight > 400 ? "text-white" : "text-black"}
            />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2>Secondary Colors (Purple)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((weight) => (
            <ColorCard
              key={`secondary-${weight}`}
              name={`secondary-${weight}`}
              className={`bg-secondary-${weight}`}
              textClass={weight > 300 ? "text-white" : "text-black"}
            />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2>Accent Colors (Amber)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((weight) => (
            <ColorCard
              key={`accent-${weight}`}
              name={`accent-${weight}`}
              className={`bg-accent-${weight}`}
              textClass={weight > 700 ? "text-white" : "text-black"}
            />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2>Semantic Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ColorCard name="success" className="bg-success" textClass="text-white" />
          <ColorCard name="warning" className="bg-warning" textClass="text-black" />
          <ColorCard name="destructive" className="bg-destructive" textClass="text-white" />
          <ColorCard name="info" className="bg-info" textClass="text-white" />
          <ColorCard name="muted" className="bg-muted" textClass="text-black" />
        </div>
      </section>

      <section className="space-y-6">
        <h2>UI Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ColorCard name="background" className="bg-background border" textClass="text-foreground" />
          <ColorCard name="foreground" className="bg-foreground" textClass="text-background" />
          <ColorCard name="card" className="bg-card border" textClass="text-card-foreground" />
          <ColorCard name="card-foreground" className="bg-card-foreground" textClass="text-card" />
          <ColorCard name="popover" className="bg-popover border" textClass="text-popover-foreground" />
          <ColorCard name="popover-foreground" className="bg-popover-foreground" textClass="text-popover" />
          <ColorCard name="border" className="bg-border" textClass="text-foreground" />
          <ColorCard name="input" className="bg-input" textClass="text-foreground" />
          <ColorCard name="ring" className="bg-ring" textClass="text-white" />
        </div>
      </section>

      <section className="space-y-6">
        <h2>Chart Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ColorCard name="chart-1" className="bg-[hsl(var(--chart-1))]" textClass="text-white" />
          <ColorCard name="chart-2" className="bg-[hsl(var(--chart-2))]" textClass="text-white" />
          <ColorCard name="chart-3" className="bg-[hsl(var(--chart-3))]" textClass="text-black" />
          <ColorCard name="chart-4" className="bg-[hsl(var(--chart-4))]" textClass="text-white" />
          <ColorCard name="chart-5" className="bg-[hsl(var(--chart-5))]" textClass="text-white" />
        </div>
      </section>

      <section className="space-y-6">
        <h2>Dark Mode Toggle</h2>
        <div className="flex items-center space-x-4">
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            onClick={() => document.documentElement.classList.remove("dark")}
          >
            Light Mode
          </button>
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            onClick={() => document.documentElement.classList.add("dark")}
          >
            Dark Mode
          </button>
        </div>
      </section>
    </div>
  )
}

interface ColorCardProps {
  name: string
  className: string
  textClass: string
}

function ColorCard({ name, className, textClass }: ColorCardProps) {
  return (
    <div className={cn("p-6 rounded-lg shadow-sm", className)}>
      <div className={cn("font-medium", textClass)}>{name}</div>
      <div className={cn("text-sm opacity-80 mt-1", textClass)}>var(--{name})</div>
    </div>
  )
}

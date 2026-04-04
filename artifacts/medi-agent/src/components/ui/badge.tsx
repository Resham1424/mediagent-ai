import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "warning" | "success" | "glass"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-primary/20 text-primary border border-primary/30",
    secondary: "bg-secondary text-secondary-foreground border-transparent",
    destructive: "bg-destructive/20 text-destructive border border-destructive/30",
    warning: "bg-warning/20 text-warning border border-warning/30",
    success: "bg-success/20 text-success border border-success/30",
    outline: "text-foreground border-border",
    glass: "bg-white/5 border-white/10 text-white backdrop-blur-md"
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }

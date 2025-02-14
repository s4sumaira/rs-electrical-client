import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md",
          // Border and background
          "border dark:border-gray-700",
          "bg-background",
          // Text styling
          "text-base text-[hsl(var(--foreground))]",
          "placeholder:text-[hsl(var(--muted-foreground))]",
          // Padding and spacing
          "px-3 py-2",
          // Ring styling
          "ring-offset-[hsl(var(--background))]",
          // Focus states
          "focus-visible:outline-none",
          "focus-visible:ring-1",
          "focus-visible:ring-orange-400",
          "focus-visible:ring-offset-1",
          // File input styling
          "file:border-0",
          "file:bg-transparent",
          "file:text-sm",
          "file:font-medium",
          "file:text-[hsl(var(--foreground))]",
          // Disabled state
          "disabled:cursor-not-allowed",
          "disabled:opacity-50",
          // Responsive text size
          "md:text-sm",
          // Additional custom classes
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
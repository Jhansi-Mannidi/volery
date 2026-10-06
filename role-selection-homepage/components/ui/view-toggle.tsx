"use client"

import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface ViewToggleOption<T extends string = string> {
  value: T
  icon: LucideIcon
  label?: string
}

export interface ViewToggleProps<T extends string = string> {
  value: T
  onValueChange: (value: T) => void
  options: ViewToggleOption<T>[]
  /** Show text labels next to icons (e.g. Kanban, List, Table). Labels are hidden on small screens. */
  showLabels?: boolean
  className?: string
  "aria-label"?: string
}

/**
 * Standard view mode toggle: bordered container, primary (blue) selected state, ghost unselected.
 * Use for grid / list / table / kanban toggles across the app.
 */
export function ViewToggle<T extends string = string>({
  value,
  onValueChange,
  options,
  showLabels = false,
  className,
  "aria-label": ariaLabel = "View mode",
}: ViewToggleProps<T>) {
  return (
    <div
      className={cn(
        "flex items-center border border-border rounded-lg p-1 bg-muted/30",
        className
      )}
      role="tablist"
      aria-label={ariaLabel}
    >
      {options.map((opt) => (
        <Button
          key={opt.value}
          type="button"
          variant={value === opt.value ? "default" : "ghost"}
          size={showLabels ? "sm" : "icon"}
          className={
            showLabels
              ? "h-8 px-3 gap-1.5 rounded-md"
              : "h-8 w-8 shrink-0 rounded-md"
          }
          onClick={() => onValueChange(opt.value)}
          aria-pressed={value === opt.value}
          aria-label={opt.label ?? opt.value}
        >
          <opt.icon className="w-4 h-4 shrink-0" />
          {showLabels && opt.label != null && (
            <span className="hidden sm:inline">{opt.label}</span>
          )}
        </Button>
      ))}
    </div>
  )
}

"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Flame, Briefcase, DollarSign, TrendingUp } from "lucide-react"

interface QuickStat {
  label: string
  value: string
  sub: string
  subIcon?: LucideIcon
  icon: LucideIcon
  accent?: string
}

const stats: QuickStat[] = [
  {
    label: "New Deals",
    value: "3",
    sub: "Today",
    subIcon: Flame,
    icon: Flame,
    accent: "text-amber-600 dark:text-amber-400",
  },
  {
    label: "Portfolio",
    value: "20",
    sub: "Companies",
    icon: Briefcase,
  },
  {
    label: "Total Invested",
    value: "₹2.4 Cr",
    sub: "",
    icon: DollarSign,
  },
  {
    label: "Avg Return",
    value: "2.8x",
    sub: "",
    icon: TrendingUp,
  },
]

export function AngelQuickStats() {
  return (
    <div className="w-full overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible">
      <div className="flex gap-3 min-w-max md:min-w-0 md:grid md:grid-cols-4 md:gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          const SubIcon = s.subIcon
          return (
            <div
              key={s.label}
              className={cn(
                "flex-shrink-0 w-[140px] md:w-auto rounded-xl border border-border bg-card p-4 shadow-sm",
                "min-h-[88px] flex flex-col justify-between touch-manipulation"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {s.label}
                </span>
                <Icon
                  className={cn("h-4 w-4 text-muted-foreground", s.accent)}
                />
              </div>
              <p className="text-xl font-semibold text-foreground mt-1">
                {s.value}
              </p>
              {s.sub && (
                <p
                  className={cn(
                    "text-xs mt-0.5 flex items-center gap-1",
                    s.accent || "text-muted-foreground"
                  )}
                >
                  {SubIcon && <SubIcon className="h-3 w-3 shrink-0" />}
                  {s.sub}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

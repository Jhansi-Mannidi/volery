"use client"

import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    label: "Startups Tracked",
    value: "234",
    change: "+18",
    trend: "up",
    period: "this month",
  },
  {
    label: "Active Investors",
    value: "89",
    change: "+7",
    trend: "up",
    period: "this month",
  },
  {
    label: "Meetings Scheduled",
    value: "12",
    change: "-3",
    trend: "down",
    period: "this week",
  },
  {
    label: "Pending Tasks",
    value: "28",
    change: "+5",
    trend: "up",
    period: "action needed",
  },
]

export function QuickStats() {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h2 className="font-semibold text-card-foreground mb-4">Quick Stats</h2>
      <div className="space-y-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between py-2 border-b border-border last:border-0 last:pb-0"
          >
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-semibold text-card-foreground">{stat.value}</p>
            </div>
            <div className="text-right">
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium justify-end",
                stat.trend === "up" ? "text-emerald-500" : "text-red-500"
              )}>
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stat.change}
              </div>
              <p className="text-xs text-muted-foreground">{stat.period}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

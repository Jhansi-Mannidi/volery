"use client"

import { Building2, CheckSquare, Sparkles, FileText, TrendingUp, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

const metrics = [
  {
    icon: Building2,
    label: "Active Startups",
    value: "47",
    change: "+3 this week",
    trend: "up",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: CheckSquare,
    label: "Pending Tasks",
    value: "12",
    change: "3 due today",
    trend: "warning",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
  },
  {
    icon: Sparkles,
    label: "Matches Generated",
    value: "156",
    change: "+23 this week",
    trend: "up",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  {
    icon: FileText,
    label: "Docs Viewed",
    value: "89",
    change: "by investors this week",
    trend: "neutral",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
]

export function MetricsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="p-4 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors cursor-pointer group"
        >
          <div className="flex items-start gap-3">
            <div className={cn("p-2 rounded-lg", metric.iconBg)}>
              <metric.icon className={cn("w-5 h-5", metric.iconColor)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-2xl font-semibold text-card-foreground mt-0.5">{metric.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {metric.trend === "up" && (
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                )}
                {metric.trend === "warning" && (
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                )}
                <p className={cn(
                  "text-xs",
                  metric.trend === "up" ? "text-emerald-500" :
                  metric.trend === "warning" ? "text-amber-500" :
                  "text-muted-foreground"
                )}>
                  {metric.change}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

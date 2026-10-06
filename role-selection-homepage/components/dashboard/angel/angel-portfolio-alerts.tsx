"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart2 } from "lucide-react"
import { cn } from "@/lib/utils"

const alerts = [
  {
    id: "1",
    type: "success" as const,
    company: "FinSecure",
    message: "hit ₹10Cr ARR",
    detail: "Your investment: 3.2x",
    cta: "View Details",
    href: "/portfolio/1",
  },
  {
    id: "2",
    type: "warning" as const,
    company: "DataMesh",
    message: "raising Series B",
    detail: "Pro-rata opportunity: ₹25L",
    cta: "Review Opportunity",
    href: "/portfolio/2",
  },
  {
    id: "3",
    type: "danger" as const,
    company: "HealthBridge",
    message: "needs attention",
    detail: "Runway: 4 months",
    cta: "See Update",
    href: "/portfolio/3",
  },
]

const typeStyles = {
  success: "text-green-600 dark:text-green-400",
  warning: "text-amber-600 dark:text-amber-400",
  danger: "text-red-600 dark:text-red-400",
}

const typeBg = {
  success: "bg-green-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
}

export function AngelPortfolioAlerts() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <BarChart2 className="h-5 w-5 shrink-0" />
        Portfolio Updates
      </h2>
      <div className="space-y-3">
        {alerts.map((a) => (
          <div
            key={a.id}
            className="rounded-xl border border-border bg-card p-4 space-y-2"
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "inline-block w-2 h-2 rounded-full mt-1.5 shrink-0",
                  typeBg[a.type]
                )}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">
                  <span className={typeStyles[a.type]}>{a.company}</span>{" "}
                  {a.message}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {a.detail}
                </p>
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 mt-2 text-primary font-medium"
                  asChild
                >
                  <Link href={a.href}>{a.cta}</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

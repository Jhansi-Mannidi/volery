"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, TrendingUp, DollarSign, ArrowRight } from "lucide-react"
import Link from "next/link"

const alerts = [
  {
    id: 1,
    company: "TechFlow AI",
    type: "Metrics Update",
    message: "Revenue grew 45% MoM - Exceeding projections",
    priority: "high",
    icon: TrendingUp,
    iconColor: "text-green-600",
    badge: "Good News",
    badgeVariant: "default" as const,
  },
  {
    id: 2,
    company: "CloudSync Inc",
    type: "Follow-on Opportunity",
    message: "Series B round opening - Pro-rata rights available",
    priority: "critical",
    icon: DollarSign,
    iconColor: "text-blue-600",
    badge: "Action Required",
    badgeVariant: "destructive" as const,
  },
  {
    id: 3,
    company: "DataViz Solutions",
    type: "Needs Attention",
    message: "Burn rate increased - Runway discussion needed",
    priority: "medium",
    icon: AlertCircle,
    iconColor: "text-orange-600",
    badge: "Review",
    badgeVariant: "secondary" as const,
  },
]

export function PortfolioAlerts() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Portfolio Alerts
        </CardTitle>
        <Link href="/startups">
          <Button variant="ghost" size="sm" className="gap-1">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = alert.icon
            return (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="mt-0.5">
                  <Icon className={`h-5 w-5 ${alert.iconColor}`} />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm leading-none">{alert.company}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.type}</p>
                    </div>
                    <Badge variant={alert.badgeVariant} className="text-xs shrink-0">
                      {alert.badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {alert.message}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

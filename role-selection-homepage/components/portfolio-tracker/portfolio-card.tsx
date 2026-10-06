"use client"

import Link from "next/link"
import {
  Building2,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ChevronRight,
  Mail,
  Phone,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { PortfolioItem, PortfolioStatus } from "./types"

const STATUS_CONFIG: Record<
  PortfolioStatus,
  { label: string; className: string; icon: typeof TrendingUp }
> = {
  performing: {
    label: "Performing",
    className: "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30",
    icon: TrendingUp,
  },
  watch: {
    label: "Watch",
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    icon: AlertTriangle,
  },
  "at-risk": {
    label: "At Risk",
    className: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
    icon: TrendingDown,
  },
}

interface PortfolioCardProps {
  item: PortfolioItem
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  const config = STATUS_CONFIG[item.status]
  const StatusIcon = config.icon

  return (
    <article className="rounded-xl border border-border bg-card overflow-hidden shadow-sm flex flex-col">
      <div className="p-4 md:p-5 border-b border-border">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground">{item.name}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{item.tagline}</p>
            </div>
          </div>
          <Badge variant="outline" className={cn("shrink-0 text-xs", config.className)}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
        </div>
      </div>

      <div className="px-4 md:px-5 py-3 space-y-2 border-b border-border text-sm">
        <p className="flex items-center gap-2 text-muted-foreground">
          <IndianRupee className="h-4 w-4 shrink-0" />
          Invested: {item.invested}
        </p>
        <p className="flex items-center gap-2 text-foreground">
          {item.multiple >= 1 ? (
            <TrendingUp className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
          ) : (
            <TrendingDown className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
          )}
          Current Value: {item.currentValue}
        </p>
        <p className="flex items-center gap-2 text-foreground font-medium">
          <Zap className="h-4 w-4 shrink-0" />
          Multiple: {item.multiple}x
        </p>
      </div>

      {item.recentUpdate && (
        <div className="px-4 md:px-5 py-3 border-b border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Recent Update (2 days ago)
          </p>
          <p className="text-sm text-foreground">&ldquo;{item.recentUpdate}&rdquo;</p>
        </div>
      )}
      {item.watchReason && (
        <div className="px-4 md:px-5 py-3 border-b border-border">
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1 flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" />
            Watch Reason
          </p>
          <p className="text-sm text-foreground">{item.watchReason}</p>
        </div>
      )}
      {item.riskFactors && item.riskFactors.length > 0 && (
        <div className="px-4 md:px-5 py-3 border-b border-border">
          <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide mb-1 flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" />
            Risk Factors
          </p>
          <ul className="space-y-1 text-sm text-foreground">
            {item.riskFactors.map((f, i) => (
              <li key={i}>• {f}</li>
            ))}
          </ul>
        </div>
      )}
      {item.founderUpdate && (
        <div className="px-4 md:px-5 py-3 border-b border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Founder Update (1 week ago)
          </p>
          <p className="text-sm text-foreground italic">&ldquo;{item.founderUpdate}&rdquo;</p>
        </div>
      )}
      {item.nextStep && (
        <div className="px-4 md:px-5 py-3 border-b border-border">
          <p className="text-sm text-muted-foreground">
            Next: {item.nextStep}
          </p>
        </div>
      )}
      {item.followOnOpportunity && (
        <div className="px-4 md:px-5 py-3 border-b border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Follow-on Opportunity
          </p>
          <p className="text-sm text-foreground mb-2">{item.followOnOpportunity}</p>
          <Button size="sm" variant="secondary" className="h-8">
            Review Pro-rata
          </Button>
        </div>
      )}

      <div className="p-4 md:p-5 flex flex-wrap gap-2 mt-auto">
        <Button size="sm" variant="outline" asChild>
          <Link href={`/portfolio/${item.id}`}>
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
        {item.status === "performing" && (
          <Button size="sm" variant="outline">
            <Mail className="h-4 w-4 mr-1.5" />
            Contact Founder
          </Button>
        )}
        {item.status === "watch" && (
          <Button size="sm" variant="outline">
            <Mail className="h-4 w-4 mr-1.5" />
            Contact Founder
          </Button>
        )}
        {item.status === "at-risk" && (
          <Button size="sm" variant="outline">
            <Phone className="h-4 w-4 mr-1.5" />
            Schedule Call
          </Button>
        )}
      </div>
    </article>
  )
}

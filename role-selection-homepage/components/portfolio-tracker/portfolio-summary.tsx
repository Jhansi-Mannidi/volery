"use client"

import * as React from "react"
import { BarChart2, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { PortfolioSummaryData } from "./types"

interface PortfolioSummaryProps {
  data: PortfolioSummaryData
  className?: string
}

export function PortfolioSummary({ data, className }: PortfolioSummaryProps) {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full px-4 py-4 md:px-5 flex items-center justify-between gap-3 text-left hover:bg-muted/50 transition-colors"
      >
        <span className="flex items-center gap-2 font-semibold text-foreground">
          <BarChart2 className="h-5 w-5 text-muted-foreground" />
          Portfolio Summary
        </span>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
        )}
      </button>
      {expanded && (
        <div className="px-4 pb-4 md:px-5 md:pb-5 space-y-5 border-t border-border pt-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              By Stage
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground">
              {data.byStage.map((s) => (
                <span key={s.stage}>
                  {s.stage}: {s.count} ({s.amount})
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              By Sector
            </p>
            <div className="flex flex-wrap gap-2">
              {data.bySector.map((s) => (
                <span
                  key={s.sector}
                  className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted text-sm text-foreground"
                >
                  {s.sector} {s.pct}%
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              By Year
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground">
              {data.byYear.map((y) => (
                <span key={y.year}>
                  {y.year}: {y.count} investments
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Performance
            </p>
            <ul className="space-y-1 text-sm text-foreground">
              <li>Top performer: {data.topPerformer} ({data.topMultiple})</li>
              <li>Worst performer: {data.worstPerformer} ({data.worstMultiple})</li>
              <li>
                Realized exits: {data.realizedExits} ({data.realizedProfit} profit)
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

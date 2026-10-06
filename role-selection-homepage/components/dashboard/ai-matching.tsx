"use client"

import Link from "next/link"
import { ArrowRight, Building2, Users, ArrowRightLeft, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const matches = [
  {
    startup: { name: "TechCorp AI", initials: "TC" },
    investor: { name: "Andreessen Horowitz", initials: "AH" },
    score: 94,
  },
  {
    startup: { name: "FinApp Inc", initials: "FA" },
    investor: { name: "Sequoia Capital", initials: "SC" },
    score: 91,
  },
  {
    startup: { name: "CloudAI Systems", initials: "CA" },
    investor: { name: "Lightspeed Venture", initials: "LV" },
    score: 89,
  },
  {
    startup: { name: "HealthBridge", initials: "HB" },
    investor: { name: "General Catalyst", initials: "GC" },
    score: 87,
  },
  {
    startup: { name: "GreenCharge", initials: "GC" },
    investor: { name: "Breakthrough Energy", initials: "BE" },
    score: 85,
  },
]

export function AIMatching() {
  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-semibold text-card-foreground">Top Matches This Week</h2>
        <Link
          href="/matching"
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          View All Matches
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="divide-y divide-border">
        {matches.map((match, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors"
          >
            {/* Startup */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-primary">{match.startup.initials}</span>
              </div>
              <span className="text-sm font-medium text-card-foreground truncate">
                {match.startup.name}
              </span>
            </div>

            {/* Arrow */}
            <ArrowRightLeft className="w-4 h-4 text-muted-foreground shrink-0" />

            {/* Investor */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-muted-foreground">{match.investor.initials}</span>
              </div>
              <span className="text-sm font-medium text-card-foreground truncate">
                {match.investor.name}
              </span>
            </div>

            {/* Score */}
            <span
              className={cn(
                "px-2 py-1 rounded text-xs font-semibold shrink-0",
                match.score >= 90
                  ? "bg-emerald-500/10 text-emerald-500"
                  : match.score >= 85
                    ? "bg-blue-500/10 text-blue-500"
                    : "bg-amber-500/10 text-amber-500"
              )}
            >
              {match.score}%
            </span>

            {/* View Button */}
            <Button variant="ghost" size="sm" className="shrink-0 h-8 px-2">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

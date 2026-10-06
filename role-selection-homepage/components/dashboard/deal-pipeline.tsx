"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const stages = [
  { name: "Intake", count: 8, color: "bg-slate-500" },
  { name: "Screening", count: 12, color: "bg-blue-500" },
  { name: "DD", count: 15, color: "bg-amber-500" },
  { name: "Decision", count: 7, color: "bg-purple-500" },
  { name: "Term Sheet", count: 3, color: "bg-emerald-500" },
  { name: "Closed", count: 2, color: "bg-emerald-700" },
]

const totalCount = stages.reduce((acc, stage) => acc + stage.count, 0)

export function DealPipeline() {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-card-foreground">Pipeline Snapshot</h2>
          <p className="text-sm text-muted-foreground">{totalCount} startups across all stages</p>
        </div>
        <Link
          href="/pipeline"
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          View Pipeline
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="flex h-8 rounded-lg overflow-hidden mb-4">
        {stages.map((stage) => (
          <div
            key={stage.name}
            className={cn("h-full transition-all hover:opacity-80 cursor-pointer", stage.color)}
            style={{ width: `${(stage.count / totalCount) * 100}%` }}
            title={`${stage.name}: ${stage.count}`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {stages.map((stage) => (
          <div key={stage.name} className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-sm", stage.color)} />
            <span className="text-sm text-muted-foreground">{stage.name}</span>
            <span className="text-sm font-medium text-card-foreground">{stage.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

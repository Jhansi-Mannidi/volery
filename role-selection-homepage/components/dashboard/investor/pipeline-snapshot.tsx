"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Layers, ArrowRight } from "lucide-react"
import Link from "next/link"

const pipelineStages = [
  { name: "Screening", count: 12, color: "bg-blue-500" },
  { name: "Due Diligence", count: 8, color: "bg-purple-500" },
  { name: "IC Review", count: 5, color: "bg-orange-500" },
  { name: "Closed", count: 3, color: "bg-green-500" },
]

export function PipelineSnapshot() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          My Pipeline Snapshot
        </CardTitle>
        <Link href="/pipeline">
          <Button variant="ghost" size="sm" className="gap-1">
            View Full Pipeline
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stage Distribution */}
        <div className="space-y-3">
          {pipelineStages.map((stage) => (
            <div key={stage.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${stage.color}`} />
                  <span className="text-sm font-medium">{stage.name}</span>
                </div>
                <Badge variant="secondary">{stage.count}</Badge>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${stage.color}`}
                  style={{ width: `${(stage.count / 28) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Active Deals</p>
            <p className="text-lg font-bold">28</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

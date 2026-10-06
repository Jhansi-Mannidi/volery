"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, BarChart3 } from "lucide-react"
import Link from "next/link"

export function DealFlowSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          This Week's Deal Flow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">New Deals</p>
            <p className="text-2xl font-bold">23</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Matches</p>
            <p className="text-2xl font-bold">8</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Meetings</p>
            <p className="text-2xl font-bold">4</p>
          </div>
        </div>

        {/* Quality Score */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Quality Score</p>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">72%</span>
            </div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-green-600 w-[72%]" />
          </div>
          <p className="text-xs text-muted-foreground">
            ↑ from 65% last week — Higher quality deals this week
          </p>
        </div>

        {/* Action Button */}
        <Link href="/startups" className="block">
          <Button className="w-full">Review New Deals</Button>
        </Link>
      </CardContent>
    </Card>
  )
}

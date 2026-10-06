"use client"

import React from "react"

import Link from "next/link"
import { ArrowRight, ArrowRightLeft, MessageSquare, FileText, MoveRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Activity {
  id: number
  type: "stage_change" | "match" | "comment" | "document_view"
  content: React.ReactNode
  time: string
  avatar?: string
  initials?: string
}

const activities: Activity[] = [
  {
    id: 1,
    type: "stage_change",
    initials: "PS",
    content: (
      <span>
        <span className="font-medium text-card-foreground">@Priya</span> moved{" "}
        <span className="font-medium text-primary">TechCorp AI</span> to Due Diligence
      </span>
    ),
    time: "2 min ago",
  },
  {
    id: 2,
    type: "match",
    content: (
      <span>
        New match:{" "}
        <span className="font-medium text-primary">FinApp Inc</span>
        <ArrowRightLeft className="inline w-3 h-3 mx-1 text-muted-foreground" />
        <span className="font-medium text-primary">Sequoia Capital</span>
        <span className="ml-2 px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 text-xs rounded font-medium">
          87% match
        </span>
      </span>
    ),
    time: "15 min ago",
  },
  {
    id: 3,
    type: "comment",
    initials: "RS",
    content: (
      <span>
        <span className="font-medium text-card-foreground">@Rahul</span> commented on{" "}
        <span className="font-medium text-primary">CloudAI</span> profile
      </span>
    ),
    time: "1 hour ago",
  },
  {
    id: 4,
    type: "document_view",
    content: (
      <span>
        Investor <span className="font-medium text-card-foreground">ABC Fund</span> viewed{" "}
        <span className="font-medium text-primary">TechCorp deck</span>
        <span className="text-muted-foreground"> (4 min, 12 pages)</span>
      </span>
    ),
    time: "2 hours ago",
  },
  {
    id: 5,
    type: "stage_change",
    initials: "JD",
    content: (
      <span>
        <span className="font-medium text-card-foreground">@John</span> moved{" "}
        <span className="font-medium text-primary">HealthBridge</span> to Screening
      </span>
    ),
    time: "3 hours ago",
  },
]

const typeIcons = {
  stage_change: { icon: MoveRight, bg: "bg-blue-500/10", color: "text-blue-500" },
  match: { icon: ArrowRightLeft, bg: "bg-emerald-500/10", color: "text-emerald-500" },
  comment: { icon: MessageSquare, bg: "bg-amber-500/10", color: "text-amber-500" },
  document_view: { icon: FileText, bg: "bg-purple-500/10", color: "text-purple-500" },
}

export function ActivityFeed() {
  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h2 className="font-semibold text-card-foreground">Recent Activity</h2>
          <p className="text-sm text-muted-foreground">Latest updates from your team</p>
        </div>
        <Link
          href="/activity"
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          View All Activity
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="divide-y divide-border">
        {activities.map((activity) => {
          const typeConfig = typeIcons[activity.type]
          const Icon = typeConfig.icon

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-4 hover:bg-muted/30 transition-colors cursor-pointer"
            >
              {activity.initials ? (
                <div className="w-8 h-8 bg-gradient-to-br from-primary/80 to-primary rounded-full flex items-center justify-center shrink-0">
                  <span className="text-xs font-medium text-primary-foreground">{activity.initials}</span>
                </div>
              ) : (
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", typeConfig.bg)}>
                  <Icon className={cn("w-4 h-4", typeConfig.color)} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground leading-relaxed">{activity.content}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

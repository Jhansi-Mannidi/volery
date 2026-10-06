"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Clock, CheckCircle2, AlertCircle } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "analysis_completed",
    title: "Completed TechCorp AI analysis",
    description: "Market fit and competitive analysis",
    timestamp: "2 hours ago",
    status: "success",
  },
  {
    id: 2,
    type: "review_approved",
    title: "FinStart Labs memo approved",
    description: "Approved by Sarah Chen",
    timestamp: "5 hours ago",
    status: "success",
  },
  {
    id: 3,
    type: "report_shared",
    title: "Q1 Market Analysis shared",
    description: "Shared with 5 team members",
    timestamp: "1 day ago",
    status: "info",
  },
  {
    id: 4,
    type: "feedback_pending",
    title: "Pending feedback on HealthIO analysis",
    description: "Awaiting partner review",
    timestamp: "2 days ago",
    status: "warning",
  },
]

export default function ActivityPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Activity Feed" />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
            <div className="max-w-[900px] mx-auto space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-foreground">Activity Feed</h1>
                <p className="text-muted-foreground mt-1">Track your research progress</p>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <Card key={activity.id} className="relative">
                    {/* Timeline connector */}
                    {index !== activities.length - 1 && (
                      <div className="absolute -bottom-4 left-8 w-0.5 h-4 bg-border" />
                    )}
                    
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Icon */}
                        <div className="mt-1">
                          {activity.status === "success" && (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          )}
                          {activity.status === "warning" && (
                            <AlertCircle className="w-6 h-6 text-yellow-600" />
                          )}
                          {activity.status === "info" && (
                            <Activity className="w-6 h-6 text-cyan-600" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{activity.title}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {activity.type.replace(/_/g, ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {activity.timestamp}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

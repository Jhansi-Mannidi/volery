"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageSquare, Calendar } from "lucide-react"

const requests = [
  {
    id: 1,
    title: "Request review for TechCorp analysis",
    from: "Sarah Chen",
    date: "2 hours ago",
    status: "pending",
  },
  {
    id: 2,
    title: "Collaborate on FinTech report",
    from: "Michael Rodriguez",
    date: "1 day ago",
    status: "pending",
  },
  {
    id: 3,
    title: "Feedback on CleanTech insights",
    from: "Emma Thompson",
    date: "2 days ago",
    status: "responded",
  },
]

export default function RequestsPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Partner Requests" />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
            <div className="max-w-[900px] mx-auto space-y-6">
              <h1 className="text-3xl font-bold text-foreground">Partner Requests</h1>
              <div className="space-y-3">
                {requests.map((req) => (
                  <Card key={req.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{req.title}</h3>
                          <p className="text-sm text-muted-foreground">From {req.from}</p>
                          <p className="text-xs text-muted-foreground mt-1">{req.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={req.status === "pending" ? "default" : "secondary"}>
                            {req.status}
                          </Badge>
                          {req.status === "pending" && (
                            <Button variant="outline" size="sm">Respond</Button>
                          )}
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

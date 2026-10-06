"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Clock, AlertCircle, CheckCircle2 } from "lucide-react"

const tasks = [
  {
    id: 1,
    title: "Complete TechCorp AI analysis",
    company: "TechCorp AI",
    dueDate: "Today",
    priority: "High",
    completed: false,
    assignee: "You"
  },
  {
    id: 2,
    title: "Review FinStart Labs memo",
    company: "FinStart Labs",
    dueDate: "Tomorrow",
    priority: "High",
    completed: false,
    assignee: "You"
  },
  {
    id: 3,
    title: "Update market intelligence report",
    dueDate: "Mar 15",
    priority: "Medium",
    completed: false,
    assignee: "You"
  },
  {
    id: 4,
    title: "Competitive analysis for HealthIO",
    company: "HealthIO",
    dueDate: "Mar 12",
    priority: "Medium",
    completed: false,
    assignee: "Team"
  },
  {
    id: 5,
    title: "Submit quarterly sector trends",
    dueDate: "Mar 20",
    priority: "Low",
    completed: false,
    assignee: "You"
  },
]

export default function TasksPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="My Tasks" />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
            <div className="max-w-[1000px] mx-auto space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
                  <p className="text-muted-foreground mt-1">8 tasks pending</p>
                </div>
              </div>

              {/* Task Filters */}
              <div className="flex gap-2 flex-wrap">
                <Button variant="default" size="sm" className="bg-cyan-600 hover:bg-cyan-700">All (8)</Button>
                <Button variant="outline" size="sm">Today (2)</Button>
                <Button variant="outline" size="sm">Due Soon (4)</Button>
                <Button variant="outline" size="sm">High Priority (3)</Button>
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                {tasks.map((task) => (
                  <Card key={task.id} className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Checkbox className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-foreground">{task.title}</h3>
                            {task.company && (
                              <Badge variant="secondary" className="text-xs">{task.company}</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {task.dueDate}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {task.assignee}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`text-xs ${
                              task.priority === "High"
                                ? "bg-red-500/20 text-red-700"
                                : task.priority === "Medium"
                                ? "bg-yellow-500/20 text-yellow-700"
                                : "bg-green-500/20 text-green-700"
                            }`}
                          >
                            {task.priority}
                          </Badge>
                          <Button variant="ghost" size="sm">Open</Button>
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

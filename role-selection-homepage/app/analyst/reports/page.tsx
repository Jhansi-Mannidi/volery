"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Share2, Archive, Trash2, Eye } from "lucide-react"

const reports = [
  {
    id: 1,
    title: "Q1 2024 SaaS Market Analysis",
    type: "Market Report",
    date: "Mar 10, 2024",
    size: "2.4 MB",
    status: "Published",
    views: 145,
  },
  {
    id: 2,
    title: "TechCorp AI Investment Memo",
    type: "Investment Memo",
    date: "Mar 8, 2024",
    size: "1.2 MB",
    status: "Published",
    views: 89,
  },
  {
    id: 3,
    title: "FinTech Competitive Landscape",
    type: "Competitive Analysis",
    date: "Mar 5, 2024",
    size: "3.1 MB",
    status: "Draft",
    views: 0,
  },
  {
    id: 4,
    title: "HealthTech Sector Trends 2024",
    type: "Sector Report",
    date: "Feb 28, 2024",
    size: "2.8 MB",
    status: "Published",
    views: 234,
  },
]

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="My Reports" />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
            <div className="max-w-[1200px] mx-auto space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">My Reports</h1>
                  <p className="text-muted-foreground mt-1">12 reports created</p>
                </div>
                <Button className="bg-cyan-600 hover:bg-cyan-700 w-full md:w-auto">
                  Create Report
                </Button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2">
                <Button variant="default" size="sm" className="bg-cyan-600 hover:bg-cyan-700">All (12)</Button>
                <Button variant="outline" size="sm">Published (10)</Button>
                <Button variant="outline" size="sm">Drafts (2)</Button>
              </div>

              {/* Reports List */}
              <div className="grid gap-4">
                {reports.map((report) => (
                  <Card key={report.id} className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground truncate">{report.title}</h3>
                            <Badge 
                              className={`text-xs ${
                                report.status === "Published"
                                  ? "bg-green-500/20 text-green-700"
                                  : "bg-yellow-500/20 text-yellow-700"
                              }`}
                            >
                              {report.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                            <span>{report.type}</span>
                            <span>•</span>
                            <span>{report.date}</span>
                            <span>•</span>
                            <span>{report.size}</span>
                            {report.views > 0 && (
                              <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {report.views} views
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Archive className="w-4 h-4" />
                          </Button>
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

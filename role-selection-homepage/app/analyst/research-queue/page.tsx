"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  Grid3X3,
  LayoutList,
  Plus,
  Kanban,
  AlertCircle,
  AlertTriangle,
  TableIcon,
  FileText,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"

// Mock research queue data with consistent structure
const researchQueueData = [
  {
    id: "1",
    name: "TechCorp AI",
    description: "AI-powered financial document analysis",
    sector: "Fintech",
    stage: "Series A",
    raising: "₹25 Cr",
    priority: "high",
    status: "not-started",
    progress: 0,
    assignee: "Vikram Mehta",
    dueDate: "28 Jan 2026",
    researchType: "Full Research",
    isOverdue: true,
  },
  {
    id: "2",
    name: "DataMesh",
    description: "Enterprise data integration platform",
    sector: "SaaS",
    stage: "Series B",
    raising: "₹80 Cr",
    priority: "medium",
    status: "in-progress",
    progress: 45,
    assignee: "Priya Sharma",
    dueDate: "29 Jan 2026",
    researchType: "Full Research",
  },
  {
    id: "3",
    name: "GreenLeaf",
    description: "Renewable energy solutions for enterprises",
    sector: "CleanTech",
    stage: "Series A",
    raising: "₹35 Cr",
    priority: "normal",
    status: "in-progress",
    progress: 65,
    assignee: "Rahul Mehta",
    dueDate: "02 Feb 2026",
    researchType: "Quick Review",
  },
  {
    id: "4",
    name: "PayFlow",
    description: "Payment processing platform",
    sector: "Payments",
    stage: "Seed",
    raising: "₹8 Cr",
    priority: "high",
    status: "not-started",
    progress: 0,
    assignee: "Rajan Arora",
    dueDate: "29 Jan 2026",
    researchType: "Quick Review",
  },
  {
    id: "5",
    name: "HealthBridge",
    description: "Telemedicine platform for rural India",
    sector: "HealthTech",
    stage: "Series B",
    raising: "₹50 Cr",
    priority: "medium",
    status: "in-review",
    progress: 85,
    assignee: "Priya Sharma",
    dueDate: "30 Jan 2026",
    researchType: "Full Research",
  },
  {
    id: "6",
    name: "FinSecure",
    description: "Cybersecurity for fintech",
    sector: "Fintech",
    stage: "Series A",
    raising: "₹20 Cr",
    priority: "normal",
    status: "in-review",
    progress: 90,
    assignee: "Arjun Singh",
    dueDate: "30 Jan 2026",
    researchType: "Competitive Analysis",
  },
]

export default function ResearchQueuePage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"kanban" | "grid" | "list" | "table">("kanban")
  const [sortBy, setSortBy] = useState("priority")
  const [filterPriority, setFilterPriority] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter data
  const filteredData = researchQueueData.filter((item) => {
    if (filterPriority !== "all" && item.priority !== filterPriority) return false
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "priority":
        return ["high", "medium", "normal"].indexOf(a.priority) - ["high", "medium", "normal"].indexOf(b.priority)
      case "progress":
        return b.progress - a.progress
      case "duedate":
        return a.dueDate.localeCompare(b.dueDate)
      default:
        return 0
    }
  })

  // Calculate stats
  const totalInQueue = researchQueueData.length
  const highPriority = researchQueueData.filter((x) => x.priority === "high").length
  const overdue = researchQueueData.filter((x) => x.isOverdue).length

  // Status groups for Kanban
  const statusGroups = {
    "not-started": "Not Started",
    "in-progress": "In Progress",
    "in-review": "In Review",
    completed: "Completed",
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Research Queue" />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
            <div className="max-w-[1600px] mx-auto space-y-6">
              {/* Page Title */}
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-foreground">Research Queue</h1>
                <p className="text-sm text-muted-foreground">{filteredData.length} companies awaiting research</p>
              </div>

              {/* Header */}
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* View Toggle */}
                    <div className="flex items-center border border-border rounded-lg p-1 bg-muted/30">
                      <Button
                        variant={viewMode === "kanban" ? "default" : "ghost"}
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-md"
                        onClick={() => setViewMode("kanban")}
                        aria-label="Kanban view"
                      >
                        <Kanban className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-md"
                        onClick={() => setViewMode("grid")}
                        aria-label="Grid view"
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-md"
                        onClick={() => setViewMode("list")}
                        aria-label="List view"
                      >
                        <LayoutList className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === "table" ? "default" : "ghost"}
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-md"
                        onClick={() => setViewMode("table")}
                        aria-label="Table view"
                      >
                        <TableIcon className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Sort */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="priority">Sort: Priority</SelectItem>
                        <SelectItem value="progress">Sort: Progress</SelectItem>
                        <SelectItem value="duedate">Sort: Due Date</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Add Button */}
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Queue
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-semibold">{totalInQueue}</p>
                          <p className="text-sm text-muted-foreground">Total in Queue</p>
                        </div>
                        <FileText className="w-8 h-8 text-blue-500 opacity-50" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-semibold">{highPriority}</p>
                          <p className="text-sm text-muted-foreground">High Priority</p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-red-500 opacity-50" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-semibold">{overdue}</p>
                          <p className="text-sm text-muted-foreground">Overdue</p>
                        </div>
                        <AlertCircle className="w-8 h-8 text-orange-500 opacity-50" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Filters */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Input
                        placeholder="Search companies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                      />
                      <Select value={filterPriority} onValueChange={setFilterPriority}>
                        <SelectTrigger className="sm:w-40">
                          <SelectValue placeholder="All Priorities" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Priorities</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Kanban View */}
              {viewMode === "kanban" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {Object.entries(statusGroups).map(([statusKey, statusLabel]) => {
                    const statusItems = sortedData.filter((x) => x.status === statusKey)
                    return (
                      <Card key={statusKey} className="flex flex-col h-full bg-muted/30">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">
                            {statusLabel} ({statusItems.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-3 overflow-y-auto">
                          {statusItems.map((item) => (
                            <Card
                              key={item.id}
                              className="p-4 border-l-4 border-l-teal-500 cursor-pointer hover:shadow-md transition-shadow bg-background"
                              onClick={() => router.push(`/analyst/research/${item.id}`)}
                            >
                              <div className="space-y-2">
                                <h4 className="font-semibold text-sm">{item.name}</h4>
                                <p className="text-xs text-muted-foreground">{item.sector}</p>
                                <Badge variant="outline" className="text-xs">
                                  {item.stage}
                                </Badge>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span className="font-semibold">{item.progress}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div
                                    className="bg-teal-500 h-2 rounded-full transition-all"
                                    style={{ width: `${item.progress}%` }}
                                  />
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarFallback className="text-xs">
                                      {item.assignee
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs text-muted-foreground">{item.dueDate}</span>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}

              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedData.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">{item.name}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      </CardHeader>
                      <CardContent className="space-y-4 flex-1">
                        <div className="flex items-center justify-between text-sm">
                          <Badge variant="outline">{item.sector}</Badge>
                          <Badge className="bg-teal-100 text-teal-700">{item.stage}</Badge>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Research Progress</span>
                            <span className="font-semibold">{item.progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-teal-500 h-2.5 rounded-full transition-all"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-medium text-xs">{item.researchType}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Due:</span>
                            <span className={cn("font-medium text-xs", item.isOverdue && "text-red-600")}>
                              {item.dueDate}
                            </span>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs bg-transparent"
                          onClick={() => router.push(`/analyst/research/${item.id}`)}
                        >
                          Continue
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <div className="space-y-2">
                  {sortedData.map((item) => (
                    <Card key={item.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push(`/analyst/research/${item.id}`)}>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1 flex flex-col gap-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <Badge variant="outline" className="text-xs">
                            {item.researchType}
                          </Badge>
                          <span className="hidden sm:inline text-xs">{item.assignee.split(" ")[0]}</span>
                          <div className="w-20">
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-teal-500 h-2 rounded-full"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                          </div>
                          <span className={cn("w-20 text-right text-xs", item.isOverdue && "text-red-600 font-semibold")}>
                            {item.dueDate}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/analyst/research/${item.id}`)}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Table View */}
              {viewMode === "table" && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted border-b">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Company</th>
                          <th className="px-4 py-3 text-left font-semibold">Sector</th>
                          <th className="px-4 py-3 text-left font-semibold">Stage</th>
                          <th className="px-4 py-3 text-center font-semibold">Progress</th>
                          <th className="px-4 py-3 text-left font-semibold">Due Date</th>
                          <th className="px-4 py-3 text-right font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {sortedData.map((item) => (
                          <tr key={item.id} className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => router.push(`/analyst/research/${item.id}`)}>
                            <td className="px-4 py-3 font-medium">{item.name}</td>
                            <td className="px-4 py-3 text-xs">{item.sector}</td>
                            <td className="px-4 py-3 text-xs">{item.stage}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-12 bg-muted rounded-full h-2">
                                  <div
                                    className="bg-teal-500 h-2 rounded-full"
                                    style={{ width: `${item.progress}%` }}
                                  />
                                </div>
                                <span className="text-xs font-semibold">{item.progress}%</span>
                              </div>
                            </td>
                            <td className={cn("px-4 py-3 text-xs", item.isOverdue && "text-red-600 font-semibold")}>
                              {item.dueDate}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/analyst/research/${item.id}`)}
                              >
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

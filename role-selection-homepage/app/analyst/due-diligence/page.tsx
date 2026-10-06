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
  TableIcon,
  FileText,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
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

// Mock DD Checklist data
const ddChecklistsData = [
  {
    id: "1",
    companyName: "TechCorp AI",
    sector: "Fintech",
    stage: "Series A",
    status: "in-progress",
    progress: 78,
    completedItems: 47,
    totalItems: 60,
    flaggedItems: 8,
    dueDate: "30 Jan 2026",
    assignee: "Vikram Mehta",
    isOverdue: false,
  },
  {
    id: "2",
    companyName: "DataMesh",
    sector: "SaaS",
    stage: "Series B",
    status: "in-progress",
    progress: 65,
    completedItems: 39,
    totalItems: 60,
    flaggedItems: 5,
    dueDate: "31 Jan 2026",
    assignee: "Priya Sharma",
    isOverdue: false,
  },
  {
    id: "3",
    companyName: "GreenLeaf",
    sector: "CleanTech",
    stage: "Series A",
    status: "completed",
    progress: 100,
    completedItems: 60,
    totalItems: 60,
    flaggedItems: 0,
    dueDate: "28 Jan 2026",
    assignee: "Rahul Mehta",
    isOverdue: false,
  },
  {
    id: "4",
    companyName: "PayFlow",
    sector: "Payments",
    stage: "Seed",
    status: "not-started",
    progress: 0,
    completedItems: 0,
    totalItems: 60,
    flaggedItems: 0,
    dueDate: "02 Feb 2026",
    assignee: "Rajan Arora",
    isOverdue: false,
  },
  {
    id: "5",
    companyName: "HealthBridge",
    sector: "HealthTech",
    stage: "Series B",
    status: "in-progress",
    progress: 85,
    completedItems: 51,
    totalItems: 60,
    flaggedItems: 3,
    dueDate: "29 Jan 2026",
    assignee: "Priya Sharma",
    isOverdue: false,
  },
  {
    id: "6",
    companyName: "FinSecure",
    sector: "Fintech",
    stage: "Series A",
    status: "in-progress",
    progress: 55,
    completedItems: 33,
    totalItems: 60,
    flaggedItems: 12,
    dueDate: "27 Jan 2026",
    assignee: "Arjun Singh",
    isOverdue: true,
  },
]

export default function DueDiligencePage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"grid" | "list" | "table">("grid")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredData = ddChecklistsData.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) return false
    if (searchQuery && !item.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
      return false
    return true
  })

  const stats = {
    total: ddChecklistsData.length,
    inProgress: ddChecklistsData.filter((x) => x.status === "in-progress").length,
    completed: ddChecklistsData.filter((x) => x.status === "completed").length,
    overdue: ddChecklistsData.filter((x) => x.isOverdue).length,
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Due Diligence Checklists" />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto">
            <div className="p-4 md:p-6">
              <div className="max-w-[1600px] mx-auto space-y-6">
                {/* Page Title */}
                <div className="flex flex-col gap-1">
                  <h1 className="text-3xl font-bold text-foreground">Due Diligence Checklists</h1>
                  <p className="text-sm text-muted-foreground">{filteredData.length} checklists in queue</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-semibold">{stats.total}</p>
                          <p className="text-sm text-muted-foreground">Total Checklists</p>
                        </div>
                        <FileText className="w-8 h-8 text-blue-500 opacity-50" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-semibold">{stats.inProgress}</p>
                          <p className="text-sm text-muted-foreground">In Progress</p>
                        </div>
                        <Clock className="w-8 h-8 text-amber-500 opacity-50" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-semibold">{stats.completed}</p>
                          <p className="text-sm text-muted-foreground">Completed</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-semibold">{stats.overdue}</p>
                          <p className="text-sm text-muted-foreground">Overdue</p>
                        </div>
                        <AlertCircle className="w-8 h-8 text-red-500 opacity-50" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Controls */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Input
                          placeholder="Search checklists..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-1"
                        />
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="sm:w-40">
                            <SelectValue placeholder="All Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="not-started">Not Started</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="w-4 h-4 mr-2" />
                          New Checklist
                        </Button>
                      </div>

                      {/* View Toggle */}
                      <div className="flex items-center border border-border rounded-lg p-1 bg-muted/30 w-fit">
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
                    </div>
                  </CardContent>
                </Card>

                {/* Grid View */}
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredData.map((item) => (
                      <Card
                        key={item.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
                        onClick={() => router.push(`/analyst/dd-checklist/${item.id}`)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-sm">{item.companyName}</CardTitle>
                              <p className="text-xs text-muted-foreground mt-1">{item.sector}</p>
                            </div>
                            <Badge className="bg-cyan-100 text-cyan-700">{item.stage}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4 flex-1">
                          <div className="space-y-1">
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
                          </div>

                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Items:</span>
                              <span className="font-medium">
                                {item.completedItems}/{item.totalItems}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Flagged:</span>
                              <span className={cn("font-medium", item.flaggedItems > 0 && "text-red-600")}>
                                {item.flaggedItems}
                              </span>
                            </div>
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
                            <span className={cn("text-xs", item.isOverdue && "text-red-600")}>
                              {item.dueDate}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === "list" && (
                  <div className="space-y-2">
                    {filteredData.map((item) => (
                      <Card
                        key={item.id}
                        className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => router.push(`/analyst/dd-checklist/${item.id}`)}
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{item.companyName}</h4>
                            <p className="text-xs text-muted-foreground">{item.sector}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-4">
                            <Badge variant="outline" className="text-xs">
                              {item.stage}
                            </Badge>
                            <div className="w-24">
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-teal-500 h-2 rounded-full"
                                  style={{ width: `${item.progress}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-xs font-medium w-12 text-right">{item.progress}%</span>
                            <span
                              className={cn(
                                "text-xs w-24 text-right",
                                item.isOverdue && "text-red-600 font-semibold"
                              )}
                            >
                              {item.dueDate}
                            </span>
                            <Button variant="ghost" size="sm">
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
                            <th className="px-4 py-3 text-center font-semibold">Items</th>
                            <th className="px-4 py-3 text-center font-semibold">Flagged</th>
                            <th className="px-4 py-3 text-left font-semibold">Due Date</th>
                            <th className="px-4 py-3 text-right font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {filteredData.map((item) => (
                            <tr
                              key={item.id}
                              className="hover:bg-muted/50 transition-colors cursor-pointer"
                              onClick={() => router.push(`/analyst/dd-checklist/${item.id}`)}
                            >
                              <td className="px-4 py-3 font-medium">{item.companyName}</td>
                              <td className="px-4 py-3 text-xs">{item.sector}</td>
                              <td className="px-4 py-3 text-xs">{item.stage}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-16 bg-muted rounded-full h-2">
                                    <div
                                      className="bg-teal-500 h-2 rounded-full"
                                      style={{ width: `${item.progress}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-semibold w-8 text-right">
                                    {item.progress}%
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center text-xs font-medium">
                                {item.completedItems}/{item.totalItems}
                              </td>
                              <td className={cn("px-4 py-3 text-center text-xs font-medium", item.flaggedItems > 0 && "text-red-600")}>
                                {item.flaggedItems}
                              </td>
                              <td
                                className={cn(
                                  "px-4 py-3 text-xs",
                                  item.isOverdue && "text-red-600 font-semibold"
                                )}
                              >
                                {item.dueDate}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button variant="ghost" size="sm">
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
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

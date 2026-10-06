"use client"

import React from "react"
import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  Link2,
  Mail,
  TrendingUp,
  Users,
  MousePointer,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { ExportReportModal } from "@/components/analytics/export-report-modal"

// Mock data for views over time
const viewsOverTimeData = [
  { date: "Jan 1", views: 12, uniqueViewers: 8 },
  { date: "Jan 2", views: 18, uniqueViewers: 12 },
  { date: "Jan 3", views: 15, uniqueViewers: 10 },
  { date: "Jan 4", views: 25, uniqueViewers: 18 },
  { date: "Jan 5", views: 22, uniqueViewers: 15 },
  { date: "Jan 6", views: 30, uniqueViewers: 22 },
  { date: "Jan 7", views: 34, uniqueViewers: 25 },
]

// Mock data for top documents
const topDocuments = [
  {
    id: "1",
    name: "TechCorp Pitch Deck v2",
    type: "Pitch Deck",
    views: 45,
    uniqueViewers: 23,
    avgTime: "5.2 min",
    completionRate: 82,
    trend: "up",
    trendValue: 12,
  },
  {
    id: "2",
    name: "FinApp Financial Model",
    type: "Financial Model",
    views: 32,
    uniqueViewers: 18,
    avgTime: "8.4 min",
    completionRate: 64,
    trend: "up",
    trendValue: 8,
  },
  {
    id: "3",
    name: "CloudAI One-Pager",
    type: "One-Pager",
    views: 28,
    uniqueViewers: 15,
    avgTime: "1.2 min",
    completionRate: 95,
    trend: "down",
    trendValue: 3,
  },
  {
    id: "4",
    name: "HealthBridge Term Sheet",
    type: "Legal",
    views: 22,
    uniqueViewers: 12,
    avgTime: "4.8 min",
    completionRate: 78,
    trend: "up",
    trendValue: 5,
  },
  {
    id: "5",
    name: "EduSpark Due Diligence",
    type: "Due Diligence",
    views: 18,
    uniqueViewers: 10,
    avgTime: "12.3 min",
    completionRate: 45,
    trend: "down",
    trendValue: 2,
  },
]

// Mock data for page-level engagement
const pageEngagementData = [
  { page: 1, time: 45, engagement: "high" },
  { page: 2, time: 52, engagement: "high" },
  { page: 3, time: 48, engagement: "high" },
  { page: 4, time: 35, engagement: "medium" },
  { page: 5, time: 22, engagement: "low" },
  { page: 6, time: 20, engagement: "low" },
  { page: 7, time: 38, engagement: "medium" },
  { page: 8, time: 55, engagement: "high" },
  { page: 9, time: 60, engagement: "high" },
  { page: 10, time: 42, engagement: "high" },
]

// Mock data for viewer activity
const viewerActivity = [
  {
    id: "1",
    name: "John Smith",
    email: "john@sequoia.com",
    timeSpent: "8 min",
    pagesViewed: 15,
    totalPages: 15,
    date: "Jan 15, 2026",
    source: "Email",
    completed: true,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@accel.com",
    timeSpent: "4 min",
    pagesViewed: 10,
    totalPages: 15,
    date: "Jan 14, 2026",
    source: "Link",
    completed: false,
  },
  {
    id: "3",
    name: "Unknown",
    email: "anonymous",
    timeSpent: "2 min",
    pagesViewed: 5,
    totalPages: 15,
    date: "Jan 13, 2026",
    source: "Direct",
    completed: false,
    anonymousViews: 3,
  },
  {
    id: "4",
    name: "Mike Chen",
    email: "mike@vcpartners.com",
    timeSpent: "12 min",
    pagesViewed: 15,
    totalPages: 15,
    date: "Jan 12, 2026",
    source: "Email",
    completed: true,
  },
]

// Mock data for engagement funnel
const funnelData = [
  { stage: "Opened link", count: 50, percentage: 100 },
  { stage: "Viewed 1+ pages", count: 45, percentage: 90 },
  { stage: "Viewed 50%+ pages", count: 30, percentage: 60 },
  { stage: "Completed", count: 20, percentage: 40 },
  { stage: "Downloaded", count: 5, percentage: 10 },
]

export default function DocumentAnalyticsPage() {
  const [dateRange, setDateRange] = useState("7days")
  const [documentTypeFilter, setDocumentTypeFilter] = useState("all")
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const [chartType, setChartType] = useState<"views" | "uniqueViewers">("views")
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  // Filter documents based on document type
  const filteredDocuments = documentTypeFilter === "all"
    ? topDocuments
    : topDocuments.filter(doc => {
        if (documentTypeFilter === "pitch") return doc.type === "Pitch Deck"
        if (documentTypeFilter === "financial") return doc.type === "Financial Model"
        if (documentTypeFilter === "legal") return doc.type === "Legal"
        return true
      })

  // Calculate stats based on filtered documents
  const calculateStats = () => {
    // Date range multiplier (simulating different time periods)
    const rangeMultiplier = 
      dateRange === "7days" ? 1 : 
      dateRange === "30days" ? 4.2 : 
      dateRange === "90days" ? 12.8 : 1

    const totalViews = Math.round(filteredDocuments.reduce((sum, doc) => sum + doc.views, 0) * rangeMultiplier)
    const totalUniqueViewers = Math.round(filteredDocuments.reduce((sum, doc) => sum + doc.uniqueViewers, 0) * rangeMultiplier)
    const avgCompletionRate = filteredDocuments.length > 0
      ? Math.round(filteredDocuments.reduce((sum, doc) => sum + doc.completionRate, 0) / filteredDocuments.length)
      : 0

    // Calculate average time (weighted by views)
    const totalTimeMinutes = filteredDocuments.reduce((sum, doc) => {
      const minutes = parseFloat(doc.avgTime.replace(" min", ""))
      return sum + (minutes * doc.views)
    }, 0)
    const avgTime = filteredDocuments.length > 0
      ? (totalTimeMinutes / filteredDocuments.reduce((sum, doc) => sum + doc.views, 0)).toFixed(1)
      : "0.0"

    return {
      totalViews,
      totalUniqueViewers,
      avgTime: `${avgTime} min`,
      avgCompletionRate: `${avgCompletionRate}%`,
    }
  }

  const calculatedStats = calculateStats()

  // Views Over Time: number of points and labels match the selected date range (7 days = 7 bars, 30 days = 4 weeks, 90 days = 12 weeks)
  const documentTypeMultiplier =
    documentTypeFilter === "all" ? 1 :
    documentTypeFilter === "pitch" ? 0.8 :
    documentTypeFilter === "financial" ? 0.6 :
    documentTypeFilter === "legal" ? 0.4 : 1

  const viewsOverTimeChartData = (() => {
    const baseTotalViews = viewsOverTimeData.reduce((s, d) => s + d.views, 0)
    const baseTotalUnique = viewsOverTimeData.reduce((s, d) => s + d.uniqueViewers, 0)
    const applyDoc = (v: number) => Math.round(v * documentTypeMultiplier)

    if (dateRange === "7days") {
      return viewsOverTimeData.map((item) => ({
        date: item.date,
        views: applyDoc(item.views),
        uniqueViewers: applyDoc(item.uniqueViewers),
      }))
    }
    if (dateRange === "30days") {
      // 4 weeks: variable values (low → high → dip → peak) so bars look distinct
      const rangeMultiplier = 4.2
      const totalViews = baseTotalViews * rangeMultiplier
      const totalUnique = baseTotalUnique * rangeMultiplier
      const variation = [0.65, 1.1, 0.82, 1.43] // sums to 4.0; distinct per week
      return variation.map((v, i) => ({
        date: `Week ${i + 1}`,
        views: applyDoc(Math.round((totalViews * v) / 4)),
        uniqueViewers: applyDoc(Math.round((totalUnique * v) / 4)),
      }))
    }
    if (dateRange === "90days") {
      // 12 weeks: variable values (wave-like pattern) so bars look distinct
      const rangeMultiplier = 12.8
      const totalViews = baseTotalViews * rangeMultiplier
      const totalUnique = baseTotalUnique * rangeMultiplier
      const variation = [0.72, 0.95, 1.22, 0.78, 1.08, 1.18, 0.85, 1.02, 0.9, 1.12, 0.8, 1.18] // sum = 12
      const sumV = variation.reduce((a, b) => a + b, 0)
      return variation.map((v, i) => ({
        date: `W${i + 1}`,
        views: applyDoc(Math.round((totalViews * v) / sumV)),
        uniqueViewers: applyDoc(Math.round((totalUnique * v) / sumV)),
      }))
    }
    // custom or fallback: 7 days
    return viewsOverTimeData.map((item) => ({
      date: item.date,
      views: applyDoc(item.views),
      uniqueViewers: applyDoc(item.uniqueViewers),
    }))
  })()

  const stats = [
    {
      label: "Total Views",
      value: calculatedStats.totalViews.toString(),
      change: "+23%",
      changeType: "positive" as const,
      icon: Eye,
    },
    {
      label: "Unique Viewers",
      value: calculatedStats.totalUniqueViewers.toString(),
      change: "+15%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      label: "Avg Time",
      value: calculatedStats.avgTime,
      change: "+0.8m",
      changeType: "positive" as const,
      icon: Clock,
    },
    {
      label: "Completion",
      value: calculatedStats.avgCompletionRate,
      change: "+5%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader
        title="Document Analytics"
        subtitle="Track engagement and performance across all documents"
      />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-[1600px] mx-auto">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Link href="/role-selection" className="hover:text-foreground">
                    Home
                  </Link>
                  <ChevronRight className="w-4 h-4" />
                    Documents
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-foreground">Analytics</span>
                </div>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Document Analytics</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Track engagement and performance across all documents
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[160px]">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                      {documentTypeFilter !== "all" && (
                        <Badge variant="secondary" className="ml-2 h-4 px-1 text-[10px]">
                          1
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setDocumentTypeFilter("all")}>
                      All Documents
                      {documentTypeFilter === "all" && " ✓"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDocumentTypeFilter("pitch")}>
                      Pitch Decks
                      {documentTypeFilter === "pitch" && " ✓"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDocumentTypeFilter("financial")}>
                      Financial Models
                      {documentTypeFilter === "financial" && " ✓"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDocumentTypeFilter("legal")}>
                      Legal Documents
                      {documentTypeFilter === "legal" && " ✓"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" onClick={() => setIsExportModalOpen(true)}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                      <stat.icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-semibold text-foreground">{stat.value}</span>
                      <span
                        className={cn(
                          "flex items-center text-xs font-medium mb-1",
                          stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                        )}
                      >
                        {stat.changeType === "positive" ? (
                          <ArrowUp className="w-3 h-3 mr-0.5" />
                        ) : (
                          <ArrowDown className="w-3 h-3 mr-0.5" />
                        )}
                        {stat.change}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              {/* Views Over Time Chart */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">Views Over Time</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={chartType === "views" ? "secondary" : "ghost"}
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setChartType("views")}
                      >
                        Views
                      </Button>
                      <Button
                        variant={chartType === "uniqueViewers" ? "secondary" : "ghost"}
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setChartType("uniqueViewers")}
                      >
                        Unique
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full">
                    {/* Bar chart: heights scaled to max in dataset so variable values are visible */}
                    <div className="flex items-end justify-between h-full gap-2 pt-4">
                      {(() => {
                        const maxValue = Math.max(
                          ...viewsOverTimeChartData.map((item) =>
                            chartType === "views" ? item.views : item.uniqueViewers
                          ),
                          1
                        )
                        return viewsOverTimeChartData.map((item) => {
                          const value = chartType === "views" ? item.views : item.uniqueViewers
                          const barHeight = maxValue > 0 ? Math.round((value / maxValue) * 200) : 0
                          return (
                            <div key={item.date} className="flex-1 flex flex-col items-center gap-2">
                              <div
                                className="w-full bg-primary/80 rounded-t transition-all hover:bg-primary"
                                style={{
                                  height: `${barHeight}px`,
                                  minHeight: value > 0 ? "4px" : "0",
                                  maxHeight: "200px",
                                }}
                              />
                              <span className="text-[10px] text-muted-foreground truncate max-w-full">
                                {item.date.includes("Week") || item.date.startsWith("W") ? item.date : item.date.split(" ")[1] ?? item.date}
                              </span>
                            </div>
                          )
                        })
                      })()}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Funnel */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Engagement Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {funnelData.map((item, index) => {
                      // Apply date range multiplier to funnel data
                      const rangeMultiplier = 
                        dateRange === "7days" ? 1 : 
                        dateRange === "30days" ? 4.2 : 
                        dateRange === "90days" ? 12.8 : 1
                      
                      const adjustedCount = Math.round(item.count * rangeMultiplier)
                      
                      return (
                        <div key={item.stage}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">{item.stage}</span>
                            <span className="text-xs font-medium">{adjustedCount}</span>
                          </div>
                          <div className="relative">
                            <div className="h-6 bg-muted/50 rounded" />
                            <div
                              className={cn(
                                "absolute top-0 left-0 h-6 rounded flex items-center justify-end pr-2",
                                index === 0 && "bg-primary/80",
                                index === 1 && "bg-primary/60",
                                index === 2 && "bg-primary/40",
                                index === 3 && "bg-primary/30",
                                index === 4 && "bg-primary/20"
                              )}
                              style={{ width: `${item.percentage}%` }}
                            >
                              <span className="text-[10px] font-medium text-primary-foreground">
                                {item.percentage}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Documents Table */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Top Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Document</TableHead>
                      <TableHead className="text-center">Views</TableHead>
                      <TableHead className="text-center">Viewers</TableHead>
                      <TableHead className="text-center">Avg Time</TableHead>
                      <TableHead className="text-center">Completion</TableHead>
                      <TableHead className="text-center">Trend</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No documents found matching the selected filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDocuments.map((doc) => (
                      <React.Fragment key={doc.id}>
                        <TableRow
                          className={cn(
                            "cursor-pointer hover:bg-muted/50 transition-colors",
                            selectedDocument === doc.id && "bg-muted/50 border-b-0"
                          )}
                          onClick={() => setSelectedDocument(selectedDocument === doc.id ? null : doc.id)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-muted/50 border flex items-center justify-center">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{doc.name}</p>
                                <p className="text-xs text-muted-foreground">{doc.type}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-sm font-medium">{doc.views}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-sm">{doc.uniqueViewers}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-sm">{doc.avgTime}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Progress value={doc.completionRate} className="w-16 h-1.5" />
                              <span className="text-xs text-muted-foreground">{doc.completionRate}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={cn(
                                "flex items-center justify-center text-xs font-medium",
                                doc.trend === "up" ? "text-green-600" : "text-red-600"
                              )}
                            >
                              {doc.trend === "up" ? (
                                <ArrowUp className="w-3 h-3 mr-0.5" />
                              ) : (
                                <ArrowDown className="w-3 h-3 mr-0.5" />
                              )}
                              {doc.trendValue}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <ChevronRight
                              className={cn(
                                "w-4 h-4 text-muted-foreground transition-transform duration-200",
                                selectedDocument === doc.id && "rotate-90"
                              )}
                            />
                          </TableCell>
                        </TableRow>
                        {/* Expanded Row */}
                        {selectedDocument === doc.id && (
                          <TableRow key={`${doc.id}-expanded`} className="bg-muted/30 hover:bg-muted/30">
                            <TableCell colSpan={7} className="p-0">
                              <div className="p-4 border-t">
                                <Tabs defaultValue="pages" className="w-full">
                                  <TabsList className="mb-4">
                                    <TabsTrigger value="pages">Page Performance</TabsTrigger>
                                    <TabsTrigger value="viewers">Viewer Activity</TabsTrigger>
                                    <TabsTrigger value="journey">Viewer Journey</TabsTrigger>
                                  </TabsList>

                                  <TabsContent value="pages">
                                    {/* Page-Level Engagement */}
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="text-sm font-medium mb-3">Page Engagement Heat Map</h4>
                                        <div className="flex items-end gap-1.5 mb-2">
                                          {pageEngagementData.map((page) => (
                                            <div key={page.page} className="flex flex-col items-center flex-1">
                                              <div
                                                className={cn(
                                                  "w-full rounded-t transition-colors",
                                                  page.engagement === "high" && "bg-green-500",
                                                  page.engagement === "medium" && "bg-yellow-500",
                                                  page.engagement === "low" && "bg-red-400"
                                                )}
                                                style={{ height: `${(page.time / 60) * 80}px` }}
                                                title={`Page ${page.page}: ${page.time}s`}
                                              />
                                            </div>
                                          ))}
                                        </div>
                                        <div className="flex justify-between">
                                          {pageEngagementData.map((page) => (
                                            <span key={page.page} className="text-[10px] text-muted-foreground flex-1 text-center">
                                              {page.page}
                                            </span>
                                          ))}
                                        </div>
                                        <div className="flex items-center justify-center gap-4 mt-4">
                                          <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 rounded bg-green-500" />
                                            <span className="text-xs text-muted-foreground">High</span>
                                          </div>
                                          <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 rounded bg-yellow-500" />
                                            <span className="text-xs text-muted-foreground">Medium</span>
                                          </div>
                                          <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 rounded bg-red-400" />
                                            <span className="text-xs text-muted-foreground">Low</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </TabsContent>

                                  <TabsContent value="viewers">
                                    {/* Viewer Activity Table */}
                                    <div className="rounded-lg border">
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Viewer</TableHead>
                                            <TableHead className="text-center">Time</TableHead>
                                            <TableHead className="text-center">Pages</TableHead>
                                            <TableHead className="text-center">Date</TableHead>
                                            <TableHead className="text-center">Source</TableHead>
                                            <TableHead className="text-center">Status</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {viewerActivity.map((viewer) => (
                                            <TableRow key={viewer.id}>
                                              <TableCell>
                                                <div className="flex items-center gap-2">
                                                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-[10px] font-medium text-primary">
                                                      {viewer.name === "Unknown" ? "?" : viewer.name.split(" ").map((n) => n[0]).join("")}
                                                    </span>
                                                  </div>
                                                  <div>
                                                    <p className="text-sm font-medium">{viewer.name}</p>
                                                    <p className="text-xs text-muted-foreground">{viewer.email}</p>
                                                  </div>
                                                </div>
                                              </TableCell>
                                              <TableCell className="text-center text-sm">{viewer.timeSpent}</TableCell>
                                              <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                  <Progress
                                                    value={(viewer.pagesViewed / viewer.totalPages) * 100}
                                                    className="w-12 h-1.5"
                                                  />
                                                  <span className="text-xs text-muted-foreground">
                                                    {viewer.pagesViewed}/{viewer.totalPages}
                                                  </span>
                                                </div>
                                              </TableCell>
                                              <TableCell className="text-center text-xs text-muted-foreground">
                                                {viewer.date}
                                              </TableCell>
                                              <TableCell className="text-center">
                                                <Badge variant="outline" className="text-[10px]">
                                                  {viewer.source === "Email" && <Mail className="w-3 h-3 mr-1" />}
                                                  {viewer.source === "Link" && <Link2 className="w-3 h-3 mr-1" />}
                                                  {viewer.source === "Direct" && <MousePointer className="w-3 h-3 mr-1" />}
                                                  {viewer.source}
                                                </Badge>
                                              </TableCell>
                                              <TableCell className="text-center">
                                                <Badge
                                                  variant={viewer.completed ? "default" : "secondary"}
                                                  className={cn(
                                                    "text-[10px]",
                                                    viewer.completed && "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-400"
                                                  )}
                                                >
                                                  {viewer.completed ? "Completed" : "In Progress"}
                                                </Badge>
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  </TabsContent>

                                  <TabsContent value="journey">
                                    {/* Viewer Journey Timeline */}
                                    <div className="space-y-4">
                                      <h4 className="text-sm font-medium">Viewer Page Journey</h4>
                                      {viewerActivity.filter(v => v.name !== "Unknown").slice(0, 2).map((viewer) => (
                                        <div key={viewer.id} className="p-3 rounded-lg border bg-muted/20">
                                          <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-[9px] font-medium text-primary">
                                                  {viewer.name.split(" ").map((n) => n[0]).join("")}
                                                </span>
                                              </div>
                                              <span className="text-sm font-medium">{viewer.name}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{viewer.timeSpent} total</span>
                                          </div>
                                          <div className="flex gap-0.5">
                                            {Array.from({ length: viewer.totalPages }).map((_, idx) => (
                                              <div
                                                key={idx}
                                                className={cn(
                                                  "h-2 flex-1 rounded-sm transition-colors",
                                                  idx < viewer.pagesViewed
                                                    ? "bg-primary"
                                                    : "bg-muted"
                                                )}
                                                title={`Page ${idx + 1}`}
                                              />
                                            ))}
                                          </div>
                                          <div className="flex justify-between mt-1">
                                            <span className="text-[10px] text-muted-foreground">Page 1</span>
                                            <span className="text-[10px] text-muted-foreground">Page {viewer.totalPages}</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </TabsContent>
                                </Tabs>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        currentTab="document-analytics"
        filters={{
          dateRange: dateRange,
          sectors: [],
          stages: documentTypeFilter !== "all" ? [documentTypeFilter] : [],
        }}
      />
    </div>
  )
}

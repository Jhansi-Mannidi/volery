"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Calendar,
  Download,
  Eye,
  FileText,
  Filter,
  Lightbulb,
  Target,
  TrendingUp,
  Users,
  Zap,
  Sparkles,
  BarChart3,
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
import { DateRangeFilter } from "@/components/analytics/date-range-filter"
import { SectorFilter } from "@/components/analytics/sector-filter"
import { ExportReportModal } from "@/components/analytics/export-report-modal"
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb"

// Pipeline Funnel Data
const pipelineFunnelData = [
  { stage: "Intake", count: 100, percentage: 100, color: "bg-blue-500" },
  { stage: "Screening", count: 78, percentage: 78, color: "bg-blue-400" },
  { stage: "Due Diligence", count: 52, percentage: 52, color: "bg-primary" },
  { stage: "Decision", count: 35, percentage: 35, color: "bg-primary/80" },
  { stage: "Term Sheet", count: 20, percentage: 20, color: "bg-green-500" },
  { stage: "Closed Won", count: 15, percentage: 15, color: "bg-green-600" },
]

// Conversion Metrics Data
const conversionMetrics = [
  { from: "Intake", to: "Screening", count: 78, conversion: 78, avgDays: 3 },
  { from: "Screening", to: "DD", count: 52, conversion: 67, avgDays: 7 },
  { from: "DD", to: "Decision", count: 35, conversion: 67, avgDays: 14 },
  { from: "Decision", to: "Term Sheet", count: 20, conversion: 57, avgDays: 5 },
  { from: "Term Sheet", to: "Closed", count: 15, conversion: 75, avgDays: 10 },
]

// Pipeline Velocity Data (monthly)
const velocityData = [
  { month: "Jul", avgDays: 45, target: 40 },
  { month: "Aug", avgDays: 42, target: 40 },
  { month: "Sep", avgDays: 38, target: 40 },
  { month: "Oct", avgDays: 41, target: 40 },
  { month: "Nov", avgDays: 36, target: 40 },
  { month: "Dec", avgDays: 35, target: 40 },
  { month: "Jan", avgDays: 33, target: 40 },
]

// Match Performance Stats
const matchStats = [
  { label: "Matches Generated", value: "1,256", icon: Sparkles, trend: "+12%", trendUp: true },
  { label: "Contacted Rate", value: "45%", icon: Users, trend: "+5%", trendUp: true },
  { label: "Response Rate", value: "28%", icon: Target, trend: "-2%", trendUp: false },
  { label: "Meetings Set", value: "42", icon: Calendar, trend: "+8%", trendUp: true },
]

// Match Quality Distribution
const matchQualityData = [
  { range: "90-100", matches: 156, contacted: 142, responded: 89, meetings: 28 },
  { range: "80-89", matches: 324, contacted: 186, responded: 78, meetings: 12 },
  { range: "70-79", matches: 412, contacted: 124, responded: 42, meetings: 2 },
  { range: "60-69", matches: 264, contacted: 68, responded: 18, meetings: 0 },
  { range: "< 60", matches: 100, contacted: 12, responded: 2, meetings: 0 },
]

// Top Performing Match Factors
const matchFactors = [
  { factor: "Sector Match", weight: 35, successRate: 82 },
  { factor: "Stage Match", weight: 25, successRate: 78 },
  { factor: "Portfolio Fit", weight: 20, successRate: 71 },
  { factor: "Geography", weight: 12, successRate: 65 },
  { factor: "Check Size", weight: 8, successRate: 58 },
]

// Team Activity Data
const teamActivity = [
  { name: "Priya Sharma", startupsAdded: 45, investorsContacted: 128, matchesMade: 67 },
  { name: "Rahul Mehta", startupsAdded: 38, investorsContacted: 95, matchesMade: 52 },
  { name: "Amit Patel", startupsAdded: 32, investorsContacted: 87, matchesMade: 41 },
  { name: "Neha Gupta", startupsAdded: 28, investorsContacted: 76, matchesMade: 38 },
]

// Document Analytics Summary
const documentStats = {
  totalViews: 2456,
  mostViewed: "TechCorp_PitchDeck_v2.pdf",
  mostViewedViews: 245,
  avgEngagement: "4.2 min",
  trendingUp: true,
}

// AI Insights
const aiInsights = [
  {
    insight: "Fintech startups convert 23% faster than average",
    type: "positive",
  },
  {
    insight: "Sequoia responds 2x faster to intros via portfolio companies",
    type: "tip",
  },
  {
    insight: "Pitch decks under 15 pages have 40% higher completion rates",
    type: "positive",
  },
  {
    insight: "Response rates drop 35% after 48 hours without follow-up",
    type: "warning",
  },
]

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("last7days")
  const [selectedSectors, setSelectedSectors] = useState<string[]>(["all"])
  const [selectedStages, setSelectedStages] = useState<string[]>(["all"])
  const [activeTab, setActiveTab] = useState("pipeline")
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  
  // Derive pipeline filter from selected sectors (any sector selection affects data)
  const pipelineFilter = selectedSectors.includes("all") || selectedSectors.length === 0 
    ? "all" 
    : selectedSectors.includes("fintech") 
    ? "fintech" 
    : selectedSectors.includes("healthtech") 
    ? "healthtech" 
    : selectedSectors.includes("saas") 
    ? "saas" 
    : selectedSectors.includes("edtech") 
    ? "edtech" 
    : selectedSectors.includes("ecommerce") 
    ? "ecommerce" 
    : selectedSectors.includes("aiml") 
    ? "aiml" 
    : selectedSectors.includes("cleantech") 
    ? "cleantech" 
    : selectedSectors.includes("logistics") 
    ? "logistics" 
    : selectedSectors.includes("deeptech") 
    ? "deeptech" 
    : "all"

  // Date range multiplier for pipeline/conversion (so date filter visibly changes data)
  const dateRangeMultiplier: Record<string, number> = {
    today: 0.05,
    yesterday: 0.08,
    last7days: 0.25,
    last30days: 0.7,
    last90days: 1,
    thisMonth: 0.5,
    lastMonth: 0.9,
    thisQuarter: 0.85,
    thisYear: 1.1,
    custom: 0.8,
  }
  const dateMultiplier = dateRangeMultiplier[dateRange] ?? 1

  // Stage filter multiplier (so "All Filters" stage selection also changes data)
  const stageMultiplier =
    selectedStages.includes("all") || selectedStages.length === 0
      ? 1
      : 0.7 + 0.1 * selectedStages.length // e.g. 1 stage -> 0.8, 2 -> 0.9, 3+ -> 1+
  const effectiveStageMult = Math.min(1.2, stageMultiplier)

  // Filter match quality data based on pipeline filter (all sectors + date + stage affect data)
  const getFilteredMatchQuality = () => {
    const mult = (sectorMultiplier[pipelineFilter] ?? 1) * dateMultiplier * effectiveStageMult
    return matchQualityData.map(item => ({
      ...item,
      matches: Math.round(item.matches * mult),
      contacted: Math.round(item.contacted * mult),
      responded: Math.round(item.responded * mult),
      meetings: Math.round(item.meetings * mult),
    }))
  }

  // Filter match factors based on pipeline filter (all sectors + stage affect data)
  const getFilteredMatchFactors = () => {
    const sectorDelta = (sectorMultiplier[pipelineFilter] ?? 1) - 1
    const stageDelta = effectiveStageMult - 1
    const adjust = Math.round((sectorDelta + stageDelta) * 5)
    return matchFactors.map(factor => ({
      ...factor,
      successRate: Math.min(100, Math.max(50, factor.successRate + adjust)),
    }))
  }

  // Filter match stats based on filters (sector + date + stage)
  const getFilteredMatchStats = () => {
    const mult = (sectorMultiplier[pipelineFilter] ?? 1) * dateMultiplier * effectiveStageMult
    return matchStats.map((stat) => ({
      ...stat,
      value:
        stat.label === "Contacted Rate" || stat.label === "Response Rate"
          ? `${Math.min(99, Math.round(parseFloat(stat.value) * mult))}%`
          : stat.label === "Meetings Set"
            ? Math.round(parseFloat(stat.value) * mult).toString()
            : Math.round(parseFloat(stat.value.replace(",", "")) * mult)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    }))
  }

  // Sector multiplier for pipeline funnel / conversion (all sectors affect data)
  const sectorMultiplier: Record<string, number> = {
    all: 1,
    fintech: 1.25,
    healthtech: 0.8,
    saas: 0.95,
    edtech: 0.85,
    ecommerce: 0.9,
    aiml: 1.15,
    cleantech: 0.75,
    logistics: 0.88,
    deeptech: 0.82,
  }

  // Filter pipeline funnel: apply date + sector + stage, recompute percentages from first stage (100%)
  const getFilteredPipelineFunnelData = () => {
    const mult = (sectorMultiplier[pipelineFilter] ?? 1) * dateMultiplier * effectiveStageMult
    const withCounts = pipelineFunnelData.map((stage) => ({
      ...stage,
      count: Math.round(stage.count * mult),
    }))
    const topCount = withCounts[0]?.count ?? 1
    return withCounts.map((stage) => ({
      ...stage,
      percentage: Math.min(100, Math.round((stage.count / topCount) * 100)),
    }))
  }

  // Filter conversion metrics: apply date + sector + stage to count, conversion, avgDays
  const getFilteredConversionMetrics = () => {
    const mult = (sectorMultiplier[pipelineFilter] ?? 1) * dateMultiplier * effectiveStageMult
    return conversionMetrics.map((metric) => ({
      ...metric,
      count: Math.round(metric.count * mult),
      conversion: Math.min(100, Math.max(0, Math.round(metric.conversion * (0.85 + 0.15 * mult)))),
      avgDays: Math.max(1, Math.round(metric.avgDays * (0.9 + 0.1 * mult))),
    }))
  }

  // Filter velocity data based on date range (keys match DateRangeFilter ids)
  const getFilteredVelocityData = () => {
    const sliceMap: Record<string, number> = {
      today: 1,
      yesterday: 1,
      last7days: 1,
      last30days: 3,
      last90days: 7,
      thisMonth: 2,
      lastMonth: 2,
      thisQuarter: 3,
      thisYear: 7,
      custom: 4,
    }
    const sliceCount = sliceMap[dateRange] ?? 4
    const sliced = velocityData.slice(Math.max(0, velocityData.length - sliceCount))
    // Apply date + stage multiplier so changing filters visibly changes chart
    const filterMult = dateMultiplier * effectiveStageMult
    return sliced.map((item) => ({
      ...item,
      avgDays: Math.round(item.avgDays * (0.7 + 0.3 * filterMult)),
      target: item.target,
    }))
  }

  // Filter team activity based on pipeline filter (all sectors + date + stage)
  const getFilteredTeamActivity = () => {
    const mult = (sectorMultiplier[pipelineFilter] ?? 1) * dateMultiplier * effectiveStageMult
    return teamActivity.map(member => ({
      ...member,
      startupsAdded: Math.round(member.startupsAdded * mult),
      investorsContacted: Math.round(member.investorsContacted * mult),
      matchesMade: Math.round(member.matchesMade * mult),
    }))
  }

  // Filter document stats based on filters (sector + date + stage)
  const getFilteredDocumentStats = () => {
    const combined = (sectorMultiplier[pipelineFilter] ?? 1) * dateMultiplier * effectiveStageMult
    return {
      totalViews: Math.round(documentStats.totalViews * combined),
      mostViewed: documentStats.mostViewed,
      mostViewedViews: Math.round(documentStats.mostViewedViews * combined),
      avgEngagement: documentStats.avgEngagement,
      completionRate: Math.min(99, Math.round(67 * combined)),
      trendingUp: documentStats.trendingUp,
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader title="Analytics" />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {/* Breadcrumb */}
            <PageBreadcrumb segments={[{ label: "Analytics" }]} />
            
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Track pipeline performance, matching effectiveness, and team productivity
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <DateRangeFilter 
                  value={dateRange}
                  onChange={(rangeId) => setDateRange(rangeId)}
                />
                <SectorFilter
                  selectedSectors={selectedSectors}
                  selectedStages={selectedStages}
                  onSectorChange={setSelectedSectors}
                  onStageChange={setSelectedStages}
                />
                <Button 
                  variant="outline"
                  onClick={() => setIsExportModalOpen(true)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList>
                <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                <TabsTrigger value="matching">Matching</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              {/* Pipeline Analytics Tab */}
              <TabsContent value="pipeline" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Pipeline Funnel */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        Pipeline Funnel
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {getFilteredPipelineFunnelData().map((stage) => (
                          <div key={stage.stage} className="space-y-1.5">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">{stage.stage}</span>
                              <span className="text-muted-foreground">
                                {stage.count} ({stage.percentage}%)
                              </span>
                            </div>
                            <div className="h-8 bg-muted rounded-md overflow-hidden">
                              <div
                                className={cn("h-full rounded-md transition-all", stage.color)}
                                style={{ width: `${stage.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Conversion Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        Conversion Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Stage Transition</TableHead>
                            <TableHead className="text-center">Count</TableHead>
                            <TableHead className="text-center">Conversion</TableHead>
                            <TableHead className="text-center">Avg Days</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getFilteredConversionMetrics().map((metric) => (
                            <TableRow key={`${metric.from}-${metric.to}`}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-1.5 text-sm">
                                  {metric.from}
                                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                  {metric.to}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">{metric.count}</TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  variant="secondary"
                                  className={cn(
                                    metric.conversion >= 70
                                      ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                                      : metric.conversion >= 50
                                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                                        : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                                  )}
                                >
                                  {metric.conversion}%
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center text-muted-foreground">
                                {metric.avgDays} days
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>

                {/* Pipeline Velocity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      Pipeline Velocity
                      <span className="text-xs font-normal text-muted-foreground ml-2">
                        Average days in pipeline
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-end justify-between gap-3">
                      {getFilteredVelocityData().map((item) => (
                        <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                          <div className="relative w-full flex flex-col items-center">
                            {/* Target line indicator */}
                            <div
                              className="absolute w-full border-t-2 border-dashed border-muted-foreground/30"
                              style={{ bottom: `${(item.target / 50) * 160}px` }}
                            />
                            {/* Actual bar */}
                            <div
                              className={cn(
                                "w-full rounded-t transition-all",
                                item.avgDays <= item.target ? "bg-green-500" : "bg-primary"
                              )}
                              style={{ height: `${(item.avgDays / 50) * 160}px` }}
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-medium">{item.avgDays}d</p>
                            <p className="text-[10px] text-muted-foreground">{item.month}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-primary" />
                        <span className="text-xs text-muted-foreground">Actual</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-green-500" />
                        <span className="text-xs text-muted-foreground">Below Target</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 border-t-2 border-dashed border-muted-foreground/50" />
                        <span className="text-xs text-muted-foreground">Target (40 days)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Matching Analytics Tab */}
              <TabsContent value="matching" className="space-y-6">
                {/* Match Performance Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {getFilteredMatchStats().map((stat) => (
                    <Card key={stat.label}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <stat.icon className="w-4 h-4 text-primary" />
                          <span className="text-xs text-muted-foreground">{stat.label}</span>
                        </div>
                        <div className="flex items-end justify-between">
                          <span className="text-2xl font-semibold">{stat.value}</span>
                          <span
                            className={cn(
                              "text-xs flex items-center",
                              stat.trendUp ? "text-green-600" : "text-red-600"
                            )}
                          >
                            {stat.trendUp ? (
                              <ArrowUp className="w-3 h-3 mr-0.5" />
                            ) : (
                              <ArrowDown className="w-3 h-3 mr-0.5" />
                            )}
                            {stat.trend}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Match Quality Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        Match Quality Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Score Range</TableHead>
                            <TableHead className="text-center">Matches</TableHead>
                            <TableHead className="text-center">Contacted</TableHead>
                            <TableHead className="text-center">Responded</TableHead>
                            <TableHead className="text-center">Meetings</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getFilteredMatchQuality().map((item) => (
                            <TableRow key={item.range}>
                              <TableCell>
                                <Badge variant="outline" className="font-medium">
                                  {item.range}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">{item.matches}</TableCell>
                              <TableCell className="text-center">
                                <span className="text-muted-foreground">{item.contacted}</span>
                              </TableCell>
                              <TableCell className="text-center">
                                <span className="text-muted-foreground">{item.responded}</span>
                              </TableCell>
                              <TableCell className="text-center font-medium">{item.meetings}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* Top Performing Match Factors */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Top Performing Match Factors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {getFilteredMatchFactors().map((factor, index) => (
                          <div key={factor.factor} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                                  {index + 1}
                                </span>
                                <span className="text-sm font-medium">{factor.factor}</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm">
                                <span className="text-muted-foreground">{factor.weight}% weight</span>
                                <Badge
                                  variant="secondary"
                                  className={cn(
                                    factor.successRate >= 75
                                      ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                                      : factor.successRate >= 60
                                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                                        : ""
                                  )}
                                >
                                  {factor.successRate}% success
                                </Badge>
                              </div>
                            </div>
                            <Progress value={factor.successRate} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Team Analytics Tab */}
              <TabsContent value="team" className="space-y-6">
                {/* Activity by Team Member */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      Activity by Team Member
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {getFilteredTeamActivity().map((member) => {
                        const total = member.startupsAdded + member.investorsContacted + member.matchesMade
                        return (
                          <div key={member.name} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-xs font-medium text-primary">
                                    {member.name.split(" ").map((n) => n[0]).join("")}
                                  </span>
                                </div>
                                <span className="text-sm font-medium">{member.name}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">{total} total actions</span>
                            </div>
                            <div className="flex h-6 rounded-md overflow-hidden">
                              <div
                                className="bg-blue-500 transition-all"
                                style={{ width: `${(member.startupsAdded / total) * 100}%` }}
                                title={`Startups Added: ${member.startupsAdded}`}
                              />
                              <div
                                className="bg-green-500 transition-all"
                                style={{ width: `${(member.investorsContacted / total) * 100}%` }}
                                title={`Investors Contacted: ${member.investorsContacted}`}
                              />
                              <div
                                className="bg-primary transition-all"
                                style={{ width: `${(member.matchesMade / total) * 100}%` }}
                                title={`Matches Made: ${member.matchesMade}`}
                              />
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                Startups: {member.startupsAdded}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                Investors: {member.investorsContacted}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-primary" />
                                Matches: {member.matchesMade}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Productivity Trends */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Productivity Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {getFilteredTeamActivity().map((member) => (
                        <div key={member.name} className="p-4 rounded-lg border bg-muted/30">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-[10px] font-medium text-primary">
                                {member.name.split(" ").map((n) => n[0]).join("")}
                              </span>
                            </div>
                            <span className="text-sm font-medium truncate">{member.name.split(" ")[0]}</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">This week</span>
                              <span className="font-medium">{Math.round((member.startupsAdded + member.investorsContacted + member.matchesMade) / 4)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Last week</span>
                              <span className="font-medium">{Math.round((member.startupsAdded + member.investorsContacted + member.matchesMade) / 5)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Change</span>
                              <span className="text-green-600 font-medium">+25%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-6">
                {/* Document Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="w-4 h-4 text-primary" />
                        <span className="text-xs text-muted-foreground">Total Views</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-semibold">{getFilteredDocumentStats().totalViews.toLocaleString()}</span>
                        <span className="text-xs text-green-600 flex items-center">
                          <ArrowUp className="w-3 h-3 mr-0.5" />
                          +18%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-xs text-muted-foreground">Most Viewed</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium truncate">{getFilteredDocumentStats().mostViewed}</p>
                        <p className="text-xs text-muted-foreground">{getFilteredDocumentStats().mostViewedViews} views</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-xs text-muted-foreground">Avg Engagement</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-semibold">{getFilteredDocumentStats().avgEngagement}</span>
                        <span className="text-xs text-green-600 flex items-center">
                          <ArrowUp className="w-4 h-4 ml-2" />
                          +12%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        <span className="text-xs text-muted-foreground">Completion Rate</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-semibold">{getFilteredDocumentStats().completionRate}%</span>
                        <span className="text-xs text-green-600 flex items-center">
                          <ArrowUp className="w-4 h-4 ml-2" />
                          +5%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Link to detailed analytics */}
                <Card>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">View Detailed Document Analytics</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        See page-level engagement, viewer activity, and detailed tracking
                      </p>
                    </div>
                    <Button asChild>
                      <a href="/documents/analytics">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Quick Insights Panel - Always visible */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  AI-Powered Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {aiInsights.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-3 rounded-lg border bg-background",
                        item.type === "positive" && "border-green-200 dark:border-green-900",
                        item.type === "warning" && "border-yellow-200 dark:border-yellow-900",
                        item.type === "tip" && "border-blue-200 dark:border-blue-900"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={cn(
                            "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                            item.type === "positive" && "bg-green-500",
                            item.type === "warning" && "bg-yellow-500",
                            item.type === "tip" && "bg-blue-500"
                          )}
                        />
                        <p className="text-sm text-foreground">{item.insight}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Export Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        currentTab={activeTab}
        filters={{
          dateRange: dateRange,
          sectors: selectedSectors,
          stages: selectedStages,
        }}
      />
    </div>
  )
}

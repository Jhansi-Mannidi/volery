"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Target,
  Users,
  FileText,
  Download,
  Calendar,
  Filter,
  Plus,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Mail,
  ChevronRight,
  Zap,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Timer,
  Layers,
  PieChart,
  Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Deal Flow Analytics Data
const dealFlowData = {
  dealsReviewed: { current: 147, previous: 132, change: 11.4 },
  passRate: { current: 68, previous: 72, change: -5.6 },
  avgTimeToDecision: { current: 4.2, previous: 5.1, change: -17.6 },
  sourceConversion: { current: 23, previous: 19, change: 21.1 },
}

const passReasons = [
  { reason: "Outside thesis", count: 42, percentage: 42 },
  { reason: "Valuation concerns", count: 23, percentage: 23 },
  { reason: "Team concerns", count: 15, percentage: 15 },
  { reason: "Market size", count: 12, percentage: 12 },
  { reason: "Competitive landscape", count: 8, percentage: 8 },
]

const sourceEffectiveness = [
  { source: "Direct inbound", deals: 45, converted: 12, rate: 26.7 },
  { source: "VC referrals", deals: 38, converted: 14, rate: 36.8 },
  { source: "Founder referrals", deals: 32, converted: 8, rate: 25.0 },
  { source: "Conferences", deals: 18, converted: 3, rate: 16.7 },
  { source: "Cold outreach", deals: 14, converted: 1, rate: 7.1 },
]

// Pipeline Metrics Data
const pipelineFunnel = [
  { stage: "Inbound", count: 147, percentage: 100 },
  { stage: "Screening", count: 89, percentage: 60.5 },
  { stage: "First Meeting", count: 52, percentage: 35.4 },
  { stage: "Due Diligence", count: 28, percentage: 19.0 },
  { stage: "IC Review", count: 12, percentage: 8.2 },
  { stage: "Term Sheet", count: 6, percentage: 4.1 },
  { stage: "Closed", count: 4, percentage: 2.7 },
]

const stageTimeAnalysis = [
  { stage: "Screening", avgDays: 3.2, targetDays: 5, status: "on-track" },
  { stage: "First Meeting", avgDays: 7.5, targetDays: 7, status: "warning" },
  { stage: "Due Diligence", avgDays: 18.3, targetDays: 21, status: "on-track" },
  { stage: "IC Review", avgDays: 5.8, targetDays: 5, status: "warning" },
  { stage: "Term Sheet", avgDays: 12.1, targetDays: 14, status: "on-track" },
]

// Match Quality Data
const matchQualityMetrics = {
  accuracy: { current: 78, previous: 72, target: 85 },
  falsePositiveRate: { current: 12, previous: 18, target: 10 },
  truePositiveRate: { current: 85, previous: 79, target: 90 },
}

const calibrationSuggestions = [
  { 
    id: 1,
    type: "weight",
    title: "Increase Team Experience Weight",
    description: "Deals with experienced teams (10+ years) have 40% higher close rate",
    impact: "high",
    implemented: false,
  },
  { 
    id: 2,
    type: "threshold",
    title: "Lower ARR Threshold for B2B SaaS",
    description: "Current $1M threshold filters out 60% of eventually successful deals",
    impact: "medium",
    implemented: false,
  },
  { 
    id: 3,
    type: "criteria",
    title: "Add Remote-First as Positive Signal",
    description: "Remote-first companies show 25% better capital efficiency",
    impact: "low",
    implemented: true,
  },
]

const matchScoreDistribution = [
  { range: "90-100%", count: 8, closed: 3 },
  { range: "80-89%", count: 24, closed: 5 },
  { range: "70-79%", count: 45, closed: 2 },
  { range: "60-69%", count: 38, closed: 0 },
  { range: "Below 60%", count: 32, closed: 0 },
]

// Team Performance Data
const teamMembers = [
  { 
    id: 1,
    name: "Sarah Chen",
    role: "Partner",
    avatar: "/placeholder-user.jpg",
    dealsReviewed: 42,
    avgDecisionDays: 3.8,
    winRate: 8.3,
    activeDeals: 12,
  },
  { 
    id: 2,
    name: "Michael Park",
    role: "Principal",
    avatar: "/placeholder-user.jpg",
    dealsReviewed: 38,
    avgDecisionDays: 4.2,
    winRate: 5.2,
    activeDeals: 8,
  },
  { 
    id: 3,
    name: "Emily Rodriguez",
    role: "Associate",
    avatar: "/placeholder-user.jpg",
    dealsReviewed: 67,
    avgDecisionDays: 2.9,
    winRate: 4.5,
    activeDeals: 15,
  },
]

// Custom Reports Data
const savedReports = [
  { 
    id: 1,
    name: "Weekly Deal Flow Summary",
    description: "Overview of deals reviewed, passed, and advanced",
    schedule: "Weekly on Monday",
    lastRun: "2024-01-22",
    recipients: ["team@fund.com"],
  },
  { 
    id: 2,
    name: "Monthly LP Report",
    description: "Portfolio performance and pipeline activity",
    schedule: "Monthly on 1st",
    lastRun: "2024-01-01",
    recipients: ["lps@fund.com", "partners@fund.com"],
  },
  { 
    id: 3,
    name: "Quarterly Analytics Deep Dive",
    description: "Detailed analysis of match quality and team performance",
    schedule: "Quarterly",
    lastRun: "2024-01-01",
    recipients: ["partners@fund.com"],
  },
]

const reportMetrics = [
  { id: "deals_reviewed", label: "Deals Reviewed", category: "Deal Flow" },
  { id: "pass_rate", label: "Pass Rate", category: "Deal Flow" },
  { id: "conversion_rate", label: "Conversion Rate", category: "Pipeline" },
  { id: "avg_deal_velocity", label: "Avg Deal Velocity", category: "Pipeline" },
  { id: "match_accuracy", label: "Match Accuracy", category: "Match Quality" },
  { id: "team_performance", label: "Team Performance", category: "Team" },
  { id: "source_effectiveness", label: "Source Effectiveness", category: "Deal Flow" },
  { id: "stage_time", label: "Stage Time Analysis", category: "Pipeline" },
]

export default function InvestorAnalyticsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("deal-flow")
  const [timePeriod, setTimePeriod] = useState("30d")
  const [reportBuilderOpen, setReportBuilderOpen] = useState(false)
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [exportModalOpen, setExportModalOpen] = useState(false)

  const isInstitutionalInvestor = user?.activeRole === "institutional-investor"

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(m => m !== metricId)
        : [...prev, metricId]
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="Analytics & Reporting" />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Header with Time Period and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Analytics Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Track deal flow, pipeline metrics, and team performance
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Select value={timePeriod} onValueChange={setTimePeriod}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                    <SelectItem value="all">All time</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setExportModalOpen(true)}>
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                
                <Button className="gap-2" onClick={() => setReportBuilderOpen(true)}>
                  <Plus className="w-4 h-4" />
                  Create Report
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-muted/50">
                <TabsTrigger value="deal-flow" className="gap-2">
                  <Layers className="w-4 h-4" />
                  Deal Flow
                </TabsTrigger>
                <TabsTrigger value="pipeline" className="gap-2">
                  <Activity className="w-4 h-4" />
                  Pipeline
                </TabsTrigger>
                <TabsTrigger value="match-quality" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Match Quality
                </TabsTrigger>
                <TabsTrigger value="team" className="gap-2">
                  <Users className="w-4 h-4" />
                  Team
                </TabsTrigger>
                <TabsTrigger value="reports" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Reports
                </TabsTrigger>
              </TabsList>

              {/* Deal Flow Analytics Tab */}
              <TabsContent value="deal-flow" className="mt-6 space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Deals Reviewed</p>
                          <p className="text-3xl font-bold mt-1">{dealFlowData.dealsReviewed.current}</p>
                        </div>
                        <div className={cn(
                          "flex items-center gap-1 text-sm",
                          dealFlowData.dealsReviewed.change > 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {dealFlowData.dealsReviewed.change > 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {Math.abs(dealFlowData.dealsReviewed.change)}%
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        vs {dealFlowData.dealsReviewed.previous} previous period
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Pass Rate</p>
                          <p className="text-3xl font-bold mt-1">{dealFlowData.passRate.current}%</p>
                        </div>
                        <div className={cn(
                          "flex items-center gap-1 text-sm",
                          dealFlowData.passRate.change < 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {dealFlowData.passRate.change < 0 ? (
                            <TrendingDown className="w-4 h-4" />
                          ) : (
                            <TrendingUp className="w-4 h-4" />
                          )}
                          {Math.abs(dealFlowData.passRate.change)}%
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        vs {dealFlowData.passRate.previous}% previous period
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Time to Decision</p>
                          <p className="text-3xl font-bold mt-1">{dealFlowData.avgTimeToDecision.current}d</p>
                        </div>
                        <div className={cn(
                          "flex items-center gap-1 text-sm",
                          dealFlowData.avgTimeToDecision.change < 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {dealFlowData.avgTimeToDecision.change < 0 ? (
                            <TrendingDown className="w-4 h-4" />
                          ) : (
                            <TrendingUp className="w-4 h-4" />
                          )}
                          {Math.abs(dealFlowData.avgTimeToDecision.change)}%
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        vs {dealFlowData.avgTimeToDecision.previous}d previous period
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Source Conversion</p>
                          <p className="text-3xl font-bold mt-1">{dealFlowData.sourceConversion.current}%</p>
                        </div>
                        <div className={cn(
                          "flex items-center gap-1 text-sm",
                          dealFlowData.sourceConversion.change > 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {dealFlowData.sourceConversion.change > 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {Math.abs(dealFlowData.sourceConversion.change)}%
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        vs {dealFlowData.sourceConversion.previous}% previous period
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Pass Reasons */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Pass Reasons Distribution</CardTitle>
                      <CardDescription>Why deals were passed this period</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {passReasons.map((reason) => (
                          <div key={reason.reason} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>{reason.reason}</span>
                              <span className="text-muted-foreground">{reason.count} deals ({reason.percentage}%)</span>
                            </div>
                            <Progress value={reason.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Source Effectiveness */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Source Effectiveness</CardTitle>
                      <CardDescription>Deal sources ranked by conversion rate</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {sourceEffectiveness.map((source) => (
                          <div key={source.source} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div>
                              <p className="font-medium text-sm">{source.source}</p>
                              <p className="text-xs text-muted-foreground">
                                {source.deals} deals, {source.converted} converted
                              </p>
                            </div>
                            <Badge variant={source.rate > 25 ? "default" : source.rate > 15 ? "secondary" : "outline"}>
                              {source.rate.toFixed(1)}% conversion
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Pipeline Metrics Tab */}
              <TabsContent value="pipeline" className="mt-6 space-y-6">
                {/* Conversion Funnel */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Conversion Funnel</CardTitle>
                    <CardDescription>Deal progression through pipeline stages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pipelineFunnel.map((stage, index) => (
                        <div key={stage.stage} className="flex items-center gap-4">
                          <div className="w-32 text-sm font-medium">{stage.stage}</div>
                          <div className="flex-1 relative">
                            <div className="h-10 bg-muted rounded-lg overflow-hidden">
                              <div 
                                className="h-full bg-primary/80 rounded-lg flex items-center justify-end pr-3 transition-all"
                                style={{ width: `${stage.percentage}%` }}
                              >
                                <span className="text-sm font-medium text-primary-foreground">
                                  {stage.count}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="w-16 text-sm text-muted-foreground text-right">
                            {stage.percentage.toFixed(1)}%
                          </div>
                          {index < pipelineFunnel.length - 1 && (
                            <div className="w-20 text-xs text-muted-foreground">
                              <ChevronRight className="w-4 h-4 mx-auto" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Stage Time Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Stage Time Analysis</CardTitle>
                      <CardDescription>Average time spent in each stage vs target</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {stageTimeAnalysis.map((stage) => (
                          <div key={stage.stage} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                              {stage.status === "on-track" ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-yellow-600" />
                              )}
                              <div>
                                <p className="font-medium text-sm">{stage.stage}</p>
                                <p className="text-xs text-muted-foreground">
                                  Target: {stage.targetDays} days
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{stage.avgDays} days</p>
                              <p className={cn(
                                "text-xs",
                                stage.avgDays <= stage.targetDays ? "text-green-600" : "text-yellow-600"
                              )}>
                                {stage.avgDays <= stage.targetDays 
                                  ? `${(stage.targetDays - stage.avgDays).toFixed(1)}d under target`
                                  : `${(stage.avgDays - stage.targetDays).toFixed(1)}d over target`
                                }
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Deal Velocity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Deal Velocity Metrics</CardTitle>
                      <CardDescription>Speed and efficiency of deal processing</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                          <Timer className="w-8 h-8 mx-auto text-primary mb-2" />
                          <p className="text-2xl font-bold">42</p>
                          <p className="text-xs text-muted-foreground">Avg Days to Close</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                          <Zap className="w-8 h-8 mx-auto text-primary mb-2" />
                          <p className="text-2xl font-bold">3.5</p>
                          <p className="text-xs text-muted-foreground">Deals/Week Processed</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                          <Eye className="w-8 h-8 mx-auto text-primary mb-2" />
                          <p className="text-2xl font-bold">24h</p>
                          <p className="text-xs text-muted-foreground">Avg First Response</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                          <Target className="w-8 h-8 mx-auto text-primary mb-2" />
                          <p className="text-2xl font-bold">85%</p>
                          <p className="text-xs text-muted-foreground">SLA Compliance</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Match Quality Tab */}
              <TabsContent value="match-quality" className="mt-6 space-y-6">
                {/* Quality Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Match Accuracy</p>
                          <p className="text-3xl font-bold">{matchQualityMetrics.accuracy.current}%</p>
                        </div>
                        <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center">
                          <ThumbsUp className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <Progress value={matchQualityMetrics.accuracy.current} className="h-2 mb-2" />
                      <p className="text-xs text-muted-foreground">
                        Target: {matchQualityMetrics.accuracy.target}%
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">False Positive Rate</p>
                          <p className="text-3xl font-bold">{matchQualityMetrics.falsePositiveRate.current}%</p>
                        </div>
                        <div className="w-16 h-16 rounded-full border-4 border-yellow-500 flex items-center justify-center">
                          <ThumbsDown className="w-6 h-6 text-yellow-500" />
                        </div>
                      </div>
                      <Progress value={100 - matchQualityMetrics.falsePositiveRate.current} className="h-2 mb-2" />
                      <p className="text-xs text-muted-foreground">
                        Target: {"<"}{matchQualityMetrics.falsePositiveRate.target}%
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">True Positive Rate</p>
                          <p className="text-3xl font-bold">{matchQualityMetrics.truePositiveRate.current}%</p>
                        </div>
                        <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        </div>
                      </div>
                      <Progress value={matchQualityMetrics.truePositiveRate.current} className="h-2 mb-2" />
                      <p className="text-xs text-muted-foreground">
                        Target: {matchQualityMetrics.truePositiveRate.target}%
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Match Score Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Match Score Distribution</CardTitle>
                      <CardDescription>Deals by match score range and close rate</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {matchScoreDistribution.map((bucket) => (
                          <div key={bucket.range} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                            <div className="w-24 text-sm font-medium">{bucket.range}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
                                  <div 
                                    className="h-full bg-primary/60" 
                                    style={{ width: `${(bucket.count / 50) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm w-12">{bucket.count}</span>
                              </div>
                            </div>
                            <Badge variant={bucket.closed > 0 ? "default" : "secondary"}>
                              {bucket.closed} closed
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Calibration Suggestions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        AI Calibration Suggestions
                      </CardTitle>
                      <CardDescription>Recommended improvements to matching criteria</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {calibrationSuggestions.map((suggestion) => (
                          <div 
                            key={suggestion.id} 
                            className={cn(
                              "p-4 rounded-lg border",
                              suggestion.implemented ? "bg-muted/30 border-muted" : "bg-background"
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium text-sm">{suggestion.title}</p>
                                  <Badge 
                                    variant={
                                      suggestion.impact === "high" ? "default" : 
                                      suggestion.impact === "medium" ? "secondary" : "outline"
                                    }
                                    className="text-xs"
                                  >
                                    {suggestion.impact} impact
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {suggestion.description}
                                </p>
                              </div>
                              {suggestion.implemented ? (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Applied
                                </Badge>
                              ) : (
                                <Button size="sm" variant="outline" className="bg-transparent">
                                  Apply
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Team Performance Tab */}
              <TabsContent value="team" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {teamMembers.map((member) => (
                    <Card key={member.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-xl font-semibold">
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <p className="font-semibold">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 rounded-lg bg-muted/50">
                            <p className="text-2xl font-bold">{member.dealsReviewed}</p>
                            <p className="text-xs text-muted-foreground">Deals Reviewed</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-muted/50">
                            <p className="text-2xl font-bold">{member.avgDecisionDays}d</p>
                            <p className="text-xs text-muted-foreground">Avg Decision</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-muted/50">
                            <p className="text-2xl font-bold">{member.winRate}%</p>
                            <p className="text-xs text-muted-foreground">Win Rate</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-muted/50">
                            <p className="text-2xl font-bold">{member.activeDeals}</p>
                            <p className="text-xs text-muted-foreground">Active Deals</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Team Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Team Comparison</CardTitle>
                    <CardDescription>Performance metrics across team members</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium text-sm">Team Member</th>
                            <th className="text-center py-3 px-4 font-medium text-sm">Deals Reviewed</th>
                            <th className="text-center py-3 px-4 font-medium text-sm">Avg Decision Time</th>
                            <th className="text-center py-3 px-4 font-medium text-sm">Win Rate</th>
                            <th className="text-center py-3 px-4 font-medium text-sm">Active Pipeline</th>
                            <th className="text-center py-3 px-4 font-medium text-sm">Trend</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teamMembers.map((member) => (
                            <tr key={member.id} className="border-b last:border-0 hover:bg-muted/50">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                                    {member.name.split(" ").map(n => n[0]).join("")}
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{member.name}</p>
                                    <p className="text-xs text-muted-foreground">{member.role}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center text-sm">{member.dealsReviewed}</td>
                              <td className="py-3 px-4 text-center text-sm">{member.avgDecisionDays} days</td>
                              <td className="py-3 px-4 text-center text-sm">{member.winRate}%</td>
                              <td className="py-3 px-4 text-center text-sm">{member.activeDeals}</td>
                              <td className="py-3 px-4 text-center">
                                <TrendingUp className="w-4 h-4 text-green-600 mx-auto" />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Custom Reports Tab */}
              <TabsContent value="reports" className="mt-6 space-y-6">
                {/* Saved Reports */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Saved Reports</CardTitle>
                      <CardDescription>Your scheduled and custom reports</CardDescription>
                    </div>
                    <Button className="gap-2" onClick={() => setReportBuilderOpen(true)}>
                      <Plus className="w-4 h-4" />
                      New Report
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {savedReports.map((report) => (
                        <div key={report.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{report.name}</p>
                              <p className="text-sm text-muted-foreground">{report.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right text-sm">
                              <p className="flex items-center gap-1">
                                <RefreshCw className="w-3 h-3" />
                                {report.schedule}
                              </p>
                              <p className="text-muted-foreground">Last: {report.lastRun}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" className="bg-transparent">
                                <Mail className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="bg-transparent">
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="bg-transparent">
                                Run Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Report Builder Modal */}
      <Dialog open={reportBuilderOpen} onOpenChange={setReportBuilderOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Custom Report</DialogTitle>
            <DialogDescription>
              Build a report with the metrics you need
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Report Name</Label>
              <Input placeholder="e.g., Weekly Pipeline Summary" />
            </div>
            
            <div className="space-y-3">
              <Label>Select Metrics</Label>
              <div className="grid grid-cols-2 gap-3">
                {reportMetrics.map((metric) => (
                  <div
                    key={metric.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                      selectedMetrics.includes(metric.id) 
                        ? "border-primary bg-primary/5" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => toggleMetric(metric.id)}
                  >
                    <Checkbox 
                      checked={selectedMetrics.includes(metric.id)}
                      onCheckedChange={() => toggleMetric(metric.id)}
                    />
                    <div>
                      <p className="text-sm font-medium">{metric.label}</p>
                      <p className="text-xs text-muted-foreground">{metric.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Schedule</Label>
                <Select defaultValue="weekly">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">One-time</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Format</Label>
                <Select defaultValue="pdf">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Recipients</Label>
              <Input placeholder="email@example.com, email2@example.com" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportBuilderOpen(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button onClick={() => setReportBuilderOpen(false)}>
              Create Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Analytics</DialogTitle>
            <DialogDescription>
              Download current analytics data
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="csv">CSV Data</SelectItem>
                  <SelectItem value="ppt">PowerPoint</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Include Sections</Label>
              <div className="space-y-2">
                {["Deal Flow Analytics", "Pipeline Metrics", "Match Quality", "Team Performance"].map((section) => (
                  <div key={section} className="flex items-center gap-2">
                    <Checkbox id={section} defaultChecked />
                    <label htmlFor={section} className="text-sm">{section}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportModalOpen(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button onClick={() => setExportModalOpen(false)} className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

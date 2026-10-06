"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Sparkles,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  DollarSign,
  Target,
  BarChart3,
  LineChart,
  Activity,
  CheckCircle2,
  Clock,
  Settings,
  Download,
  RefreshCw,
  PlayCircle,
  Filter,
  Info,
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ExportReportModal } from "@/components/analytics/export-report-modal"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// Full 12-month pipeline data; values vary slightly by "timeframe" context (3/6/12 months) for visual difference
function getPipelineForecastData(timeframe: string) {
  const len = timeframe === "3-months" ? 3 : timeframe === "12-months" ? 12 : 6
  const base = [
    { expected: 3.2, best: 4.5, worst: 2.1, confidence: 82 },
    { expected: 4.1, best: 5.8, worst: 2.8, confidence: 78 },
    { expected: 5.3, best: 7.2, worst: 3.5, confidence: 75 },
    { expected: 6.8, best: 9.1, worst: 4.2, confidence: 71 },
    { expected: 5.9, best: 8.3, worst: 3.8, confidence: 73 },
    { expected: 7.2, best: 10.5, worst: 4.9, confidence: 68 },
    { expected: 6.5, best: 9.2, worst: 4.0, confidence: 70 },
    { expected: 8.1, best: 11.0, worst: 5.2, confidence: 72 },
    { expected: 7.4, best: 10.2, worst: 4.8, confidence: 69 },
    { expected: 9.0, best: 12.1, worst: 5.8, confidence: 74 },
    { expected: 8.2, best: 11.3, worst: 5.1, confidence: 71 },
    { expected: 9.5, best: 13.0, worst: 6.2, confidence: 76 },
  ]
  return base.slice(0, len).map((row, i) => ({
    month: MONTHS[i],
    ...row,
  }))
}

const dealPredictions = [
  {
    id: "1",
    name: "TechCorp AI",
    sector: "AI/ML",
    stage: "Due diligence",
    probability: 78,
    confidence: "High",
    positiveFactors: [
      "Strong investor engagement (4 meetings scheduled)",
      "Documents viewed multiple times by decision makers",
      "Deal velocity above average",
    ],
    riskFactors: ["Valuation negotiation pending", "One competing term sheet (unconfirmed)"],
    similarDealsRate: 72,
    similarDealsCount: 45,
    expectedClose: "2024-03-15",
    dealSize: 3.5,
  },
  {
    id: "2",
    name: "HealthTech Inc",
    sector: "Healthcare",
    stage: "Screening",
    probability: 65,
    confidence: "Medium",
    positiveFactors: [
      "Team has strong track record",
      "Market timing is favorable",
      "Multiple investor intros completed",
    ],
    riskFactors: [
      "Deal has been in pipeline for 90+ days",
      "Limited engagement from lead investor",
      "Regulatory concerns raised",
    ],
    similarDealsRate: 58,
    similarDealsCount: 32,
    expectedClose: "2024-04-20",
    dealSize: 2.8,
  },
  {
    id: "3",
    name: "FinTech Solutions",
    sector: "FinTech",
    stage: "Term sheet",
    probability: 89,
    confidence: "High",
    positiveFactors: [
      "Term sheet issued",
      "Due diligence 85% complete",
      "Legal docs in final review",
      "Strong syndicate commitment",
    ],
    riskFactors: ["Minor financial reconciliation items pending"],
    similarDealsRate: 91,
    similarDealsCount: 67,
    expectedClose: "2024-02-28",
    dealSize: 5.2,
  },
  {
    id: "4",
    name: "CleanEnergy Co",
    sector: "Climate",
    stage: "Screening",
    probability: 42,
    confidence: "Low",
    positiveFactors: ["Strong product metrics", "Experienced founding team"],
    riskFactors: [
      "No recent investor engagement",
      "Deal velocity slowing significantly",
      "Competing priorities from investors",
      "Market conditions deteriorating",
    ],
    similarDealsRate: 38,
    similarDealsCount: 28,
    expectedClose: "2024-05-30",
    dealSize: 1.9,
  },
]

const atRiskDeals = [
  {
    id: "1",
    name: "DataAnalytics Pro",
    riskLevel: "High",
    daysSinceActivity: 21,
    issues: ["No response to last 3 emails", "Investor went cold after second meeting"],
    recommendedActions: [
      "Schedule urgent check-in call",
      "Send updated metrics deck",
      "Engage warm intro connection",
    ],
    dealSize: 4.1,
  },
  {
    id: "2",
    name: "BioTech Innovations",
    riskLevel: "Medium",
    daysSinceActivity: 14,
    issues: ["Delayed regulatory approval", "Founder availability concerns"],
    recommendedActions: ["Request updated timeline", "Clarify team bandwidth", "Consider bridge financing"],
    dealSize: 3.3,
  },
  {
    id: "3",
    name: "EdTech Platform",
    riskLevel: "Medium",
    daysSinceActivity: 12,
    issues: ["Competitive term sheet received", "Valuation gap remains"],
    recommendedActions: ["Expedite decision timeline", "Re-evaluate valuation positioning", "Highlight unique value props"],
    dealSize: 2.7,
  },
]

export default function PredictiveAnalyticsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [timeframe, setTimeframe] = useState("6-months")
  const [confidenceLevel, setConfidenceLevel] = useState("medium")
  const [selectedScenario, setSelectedScenario] = useState("expected")
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  const [refreshConfirmOpen, setRefreshConfirmOpen] = useState(false)
  const [refreshLoading, setRefreshLoading] = useState(false)
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false)
  const [runPredictionOpen, setRunPredictionOpen] = useState(false)
  const [runPredictionLoading, setRunPredictionLoading] = useState(false)
  const [dealDetailOpen, setDealDetailOpen] = useState<typeof dealPredictions[0] | null>(null)
  const [runScenarioOpen, setRunScenarioOpen] = useState<{ deal: typeof dealPredictions[0] } | null>(null)
  const [scenarioCardOpen, setScenarioCardOpen] = useState<"add-deals" | "remove-at-risk" | "accelerate" | null>(null)
  const [createCustomScenarioOpen, setCreateCustomScenarioOpen] = useState(false)

  const [filterSector, setFilterSector] = useState("all")
  const [filterStage, setFilterStage] = useState("all")

  const displayedPipelineForecasts = getPipelineForecastData(timeframe)

  const pipelineSummary = (() => {
    const expectedTotal = displayedPipelineForecasts.reduce((s, m) => s + m.expected, 0)
    const bestTotal = displayedPipelineForecasts.reduce((s, m) => s + m.best, 0)
    const worstTotal = displayedPipelineForecasts.reduce((s, m) => s + m.worst, 0)
    const avgConfidence =
      displayedPipelineForecasts.length > 0
        ? Math.round(
            displayedPipelineForecasts.reduce((s, m) => s + m.confidence, 0) / displayedPipelineForecasts.length
          )
        : 0
    return { expectedTotal, bestTotal, worstTotal, avgConfidence }
  })()

  const confidenceLevelToLabel: Record<string, string> = {
    high: "High",
    medium: "Medium",
    low: "Low",
  }
  const filteredDealPredictions = dealPredictions.filter((deal) => {
    const matchConfidence = deal.confidence === confidenceLevelToLabel[confidenceLevel]
    const matchSector = filterSector === "all" || deal.sector === filterSector
    const matchStage = filterStage === "all" || deal.stage === filterStage
    return matchConfidence && matchSector && matchStage
  })

  const getRiskColor = (level: string) => {
    switch (level) {
      case "High":
        return "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/30"
      case "Medium":
        return "text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/30"
      case "Low":
        return "text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/30"
      default:
        return "text-muted-foreground bg-muted"
    }
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "High":
        return "text-green-600 dark:text-green-400"
      case "Medium":
        return "text-orange-600 dark:text-orange-400"
      case "Low":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Predictive Analytics" />

        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />

          <main className="flex-1 overflow-auto">
            <div className="min-h-full bg-background">
              {/* Header */}
              <div className="border-b bg-card">
                <div className="container mx-auto px-6 py-4">
                  {/* Breadcrumb */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Link href="/role-selection" className="hover:text-foreground transition-colors">
                      Home
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/ai-insights" className="hover:text-foreground">
                      AI Insights
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-foreground">Predictive Analytics</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <LineChart className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-foreground">Predictive Analytics</h1>
                        <p className="text-sm text-muted-foreground">
                          AI-powered forecasting for deal pipeline and outcomes
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" type="button" aria-label="Refresh predictive models" onClick={() => setRefreshConfirmOpen(true)}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Models
                      </Button>
                      <Button variant="outline" size="sm" type="button" aria-label="Predictive analytics settings" onClick={() => router.push("/settings")}>
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                      <Button size="sm" type="button" onClick={() => setIsExportModalOpen(true)} aria-label="Export report">
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="container mx-auto px-6 py-6">
                {/* Controls */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Timeframe:</span>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3-months">3 Months</SelectItem>
                        <SelectItem value="6-months">6 Months</SelectItem>
                        <SelectItem value="12-months">12 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Confidence Level:</span>
                    <Select value={confidenceLevel} onValueChange={setConfidenceLevel}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High (&gt;80%)</SelectItem>
                        <SelectItem value="medium">Medium (60-80%)</SelectItem>
                        <SelectItem value="low">Low (&lt;60%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="outline" size="sm" type="button" onClick={() => setMoreFiltersOpen(true)} aria-label="More filters">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </div>

                {/* Pipeline Forecast */}
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        <CardTitle>Pipeline Forecast</CardTitle>
                      </div>
                      <Tabs value={selectedScenario} onValueChange={setSelectedScenario}>
                        <TabsList>
                          <TabsTrigger value="expected">Expected</TabsTrigger>
                          <TabsTrigger value="best">Best Case</TabsTrigger>
                          <TabsTrigger value="worst">Worst Case</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Chart Area */}
                      <div className="h-64 flex items-end gap-4 px-4">
                        {displayedPipelineForecasts.map((month) => {
                          const value =
                            selectedScenario === "best"
                              ? month.best
                              : selectedScenario === "worst"
                                ? month.worst
                                : month.expected
                          const maxValue =
                            Math.max(
                              ...displayedPipelineForecasts.flatMap((m) => [m.expected, m.best, m.worst]),
                              11
                            ) * 1.05
                          const heightPercent = (value / maxValue) * 100

                          return (
                            <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                              <div className="w-full flex flex-col justify-end" style={{ height: "200px" }}>
                                <div
                                  className={`w-full rounded-t-lg transition-all ${
                                    selectedScenario === "best"
                                      ? "bg-green-500/20 border-2 border-green-500"
                                      : selectedScenario === "worst"
                                        ? "bg-red-500/20 border-2 border-red-500"
                                        : "bg-primary/20 border-2 border-primary"
                                  }`}
                                  style={{ height: `${heightPercent}%` }}
                                />
                              </div>
                              <div className="text-center">
                                <div className="text-sm font-semibold text-foreground">${value}M</div>
                                <div className="text-xs text-muted-foreground">{month.month}</div>
                                <div className="text-xs text-primary">{month.confidence}%</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Summary Stats */}
                      <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                        <div>
                          <p className="text-2xl font-bold text-primary">${pipelineSummary.expectedTotal.toFixed(1)}M</p>
                          <p className="text-xs text-muted-foreground">Expected Total</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">${pipelineSummary.bestTotal.toFixed(1)}M</p>
                          <p className="text-xs text-muted-foreground">Best Case</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-red-600 dark:text-red-400">${pipelineSummary.worstTotal.toFixed(1)}M</p>
                          <p className="text-xs text-muted-foreground">Worst Case</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">{pipelineSummary.avgConfidence}%</p>
                          <p className="text-xs text-muted-foreground">Avg Confidence</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Deal Success Predictions */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Deal Success Predictions
                    </h2>
                    <Button variant="outline" size="sm" type="button" onClick={() => setRunPredictionOpen(true)} aria-label="Run new prediction">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Run New Prediction
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {filteredDealPredictions.length === 0 ? (
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-sm text-muted-foreground text-center py-6">
                            No deals match the current filters. Try changing Confidence Level or clearing More Filters.
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                    filteredDealPredictions.map((deal) => (
                      <Card key={deal.id}>
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                              <div>
                                <Link href={`/startups/${deal.id}`} className="font-semibold text-foreground mb-1 hover:text-primary hover:underline block">
                                  {deal.name}
                                </Link>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Badge variant="outline" className="text-xs">
                                    {deal.sector}
                                  </Badge>
                                  <span>•</span>
                                  <span>${deal.dealSize}M</span>
                                  <span>•</span>
                                  <Calendar className="w-3 h-3" />
                                  <span>{deal.expectedClose}</span>
                                </div>
                              </div>
                              <Badge className={`${getConfidenceColor(deal.confidence)} bg-transparent border`}>
                                {deal.confidence} Confidence
                              </Badge>
                            </div>

                            {/* Probability */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-foreground">Probability of Close</span>
                                <span className="text-2xl font-bold text-primary">{deal.probability}%</span>
                              </div>
                              <Progress value={deal.probability} className="h-2" />
                            </div>

                            {/* Factors Grid */}
                            <div className="grid md:grid-cols-2 gap-4">
                              {/* Positive Factors */}
                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                  Positive Factors
                                </h4>
                                <ul className="space-y-1.5">
                                  {deal.positiveFactors.map((factor, idx) => (
                                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                                      <span>{factor}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Risk Factors */}
                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                  Risk Factors
                                </h4>
                                <ul className="space-y-1.5">
                                  {deal.riskFactors.map((factor, idx) => (
                                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                      <span className="text-orange-600 dark:text-orange-400 mt-0.5">⚠</span>
                                      <span>{factor}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t">
                              <div className="text-sm text-muted-foreground">
                                Similar deals closed at:{" "}
                                <span className="font-semibold text-foreground">{deal.similarDealsRate}%</span> rate
                                (n={deal.similarDealsCount})
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" type="button" onClick={() => setDealDetailOpen(deal)}>
                                  View Details
                                </Button>
                                <Button variant="outline" size="sm" type="button" onClick={() => setRunScenarioOpen({ deal })}>
                                  Run Scenario
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )))}
                  </div>
                </div>

                {/* Risk Analysis */}
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      <CardTitle>Deals at Risk</CardTitle>
                      <Badge variant="secondary">{atRiskDeals.length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {atRiskDeals.map((deal) => (
                        <div key={deal.id} className="p-4 rounded-lg border bg-card">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <Link href={`/startups/${deal.id}`} className="font-semibold text-foreground mb-1 hover:text-primary hover:underline block">
                                {deal.name}
                              </Link>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{deal.daysSinceActivity} days since last activity</span>
                                <span>•</span>
                                <DollarSign className="w-3 h-3" />
                                <span>${deal.dealSize}M</span>
                              </div>
                            </div>
                            <Badge className={getRiskColor(deal.riskLevel)}>{deal.riskLevel} Risk</Badge>
                          </div>

                          <div className="space-y-3">
                            {/* Issues */}
                            <div>
                              <p className="text-sm font-medium text-foreground mb-1">Early Warning Indicators:</p>
                              <ul className="space-y-1">
                                {deal.issues.map((issue, idx) => (
                                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <span className="text-orange-600 dark:text-orange-400 mt-0.5">•</span>
                                    <span>{issue}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Recommended Actions */}
                            <div>
                              <p className="text-sm font-medium text-foreground mb-1">Recommended Actions:</p>
                              <div className="flex flex-wrap gap-2">
                                {deal.recommendedActions.map((action, idx) => (
                                  <Badge key={idx} variant="outline" className="bg-primary/5">
                                    {action}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Scenario Planning */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      <CardTitle>Scenario Planning</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* What-if Analysis */}
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3">What-If Analysis</h4>
                        <div className="grid md:grid-cols-3 gap-4">
                            <button
                              type="button"
                              className="p-4 rounded-lg border bg-card hover:border-primary/50 transition-colors cursor-pointer text-left w-full"
                              onClick={() => setScenarioCardOpen("add-deals")}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                                <p className="font-medium text-foreground">Add 3 High-Probability Deals</p>
                              </div>
                              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">+$8.5M</p>
                              <p className="text-xs text-muted-foreground">Expected pipeline increase</p>
                            </button>

                            <button
                              type="button"
                              className="p-4 rounded-lg border bg-card hover:border-primary/50 transition-colors cursor-pointer text-left w-full"
                              onClick={() => setScenarioCardOpen("remove-at-risk")}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                                <p className="font-medium text-foreground">Remove At-Risk Deals</p>
                              </div>
                              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">-$10.1M</p>
                              <p className="text-xs text-muted-foreground">Pipeline impact if deals fall through</p>
                            </button>

                            <button
                              type="button"
                              className="p-4 rounded-lg border bg-card hover:border-primary/50 transition-colors cursor-pointer text-left w-full"
                              onClick={() => setScenarioCardOpen("accelerate")}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Activity className="w-4 h-4 text-primary" />
                                <p className="font-medium text-foreground">Accelerate Top 5 Deals</p>
                              </div>
                              <p className="text-2xl font-bold text-primary mb-1">-23 days</p>
                              <p className="text-xs text-muted-foreground">Average time to close reduction</p>
                            </button>
                        </div>
                      </div>

                      <Separator />

                      {/* Resource Planning */}
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3">Resource Planning</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                              <Info className="w-4 h-4 text-primary" />
                              <span className="text-sm text-foreground">
                                Based on current pipeline velocity, you'll need{" "}
                                <span className="font-semibold">2 additional team members</span> to handle expected Q2
                                deal flow
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                              <Info className="w-4 h-4 text-primary" />
                              <span className="text-sm text-foreground">
                                Recommended capital allocation:{" "}
                                <span className="font-semibold">$42M available</span> for deals in next 90 days
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                              <Info className="w-4 h-4 text-primary" />
                              <span className="text-sm text-foreground">
                                Peak activity expected in <span className="font-semibold">March-April</span> with 12
                                deals requiring due diligence
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button variant="outline" size="sm" type="button" onClick={() => setCreateCustomScenarioOpen(true)}>
                          Create Custom Scenario
                        </Button>
                        <Button size="sm" type="button" onClick={() => setIsExportModalOpen(true)}>
                          <Download className="w-4 h-4 mr-2" />
                          Export Analysis
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Refresh Models confirmation */}
      <Dialog open={refreshConfirmOpen} onOpenChange={setRefreshConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refresh predictive models?</DialogTitle>
            <DialogDescription>
              This will recalculate pipeline and deal success predictions using the latest data. It may take a few minutes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setRefreshConfirmOpen(false)}>Cancel</Button>
            <Button type="button" disabled={refreshLoading} onClick={() => { setRefreshLoading(true); setTimeout(() => { setRefreshLoading(false); setRefreshConfirmOpen(false); toast({ title: "Models refreshed", description: "Predictions have been updated." }); }, 2000); }}>
              {refreshLoading ? "Refreshing…" : "Refresh"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* More Filters */}
      <Dialog open={moreFiltersOpen} onOpenChange={setMoreFiltersOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Advanced filters</DialogTitle>
            <DialogDescription>Narrow pipeline forecast and predictions by sector, stage, or assignee.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Sector</Label>
              <Select value={filterSector} onValueChange={setFilterSector}>
                <SelectTrigger>
                  <SelectValue placeholder="All sectors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sectors</SelectItem>
                  <SelectItem value="AI/ML">AI/ML</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="FinTech">FinTech</SelectItem>
                  <SelectItem value="Climate">Climate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Stage</Label>
              <Select value={filterStage} onValueChange={setFilterStage}>
                <SelectTrigger>
                  <SelectValue placeholder="All stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All stages</SelectItem>
                  <SelectItem value="Screening">Screening</SelectItem>
                  <SelectItem value="Due diligence">Due diligence</SelectItem>
                  <SelectItem value="Term sheet">Term sheet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="All assignees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All assignees</SelectItem>
                  <SelectItem value="me">Me</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setMoreFiltersOpen(false)}>Cancel</Button>
            <Button type="button" onClick={() => { setMoreFiltersOpen(false); toast({ title: "Filters applied", description: "Forecast updated with selected filters." }); }}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Run New Prediction */}
      <Dialog open={runPredictionOpen} onOpenChange={setRunPredictionOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Run new prediction</DialogTitle>
            <DialogDescription>Select deals or pipeline scope to run a new success prediction.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Scope</Label>
              <Select defaultValue="pipeline">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pipeline">Entire pipeline</SelectItem>
                  <SelectItem value="stage">By stage</SelectItem>
                  <SelectItem value="custom">Select deals</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setRunPredictionOpen(false)}>Cancel</Button>
            <Button type="button" disabled={runPredictionLoading} onClick={() => { setRunPredictionLoading(true); setTimeout(() => { setRunPredictionLoading(false); setRunPredictionOpen(false); toast({ title: "Prediction complete", description: "Deal success predictions have been updated." }); }, 1500); }}>
              {runPredictionLoading ? "Running…" : "Run prediction"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deal detail */}
      <Dialog open={!!dealDetailOpen} onOpenChange={(open) => !open && setDealDetailOpen(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dealDetailOpen?.name}</DialogTitle>
            <DialogDescription>{dealDetailOpen?.sector} · ${dealDetailOpen?.dealSize}M · {dealDetailOpen?.expectedClose}</DialogDescription>
          </DialogHeader>
          {dealDetailOpen && (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm font-medium mb-1">Probability of close: {dealDetailOpen.probability}%</p>
                <Progress value={dealDetailOpen.probability} className="h-2" />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Positive factors</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {dealDetailOpen.positiveFactors.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Risk factors</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {dealDetailOpen.riskFactors.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">Similar deals closed at {dealDetailOpen.similarDealsRate}% rate (n={dealDetailOpen.similarDealsCount})</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setDealDetailOpen(null)}>Close</Button>
            <Button type="button" onClick={() => { if (dealDetailOpen) router.push(`/startups/${dealDetailOpen.id}`); setDealDetailOpen(null); }}>View full profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Run Scenario (per deal) */}
      <Dialog open={!!runScenarioOpen} onOpenChange={(open) => !open && setRunScenarioOpen(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Run scenario</DialogTitle>
            <DialogDescription>Simulate outcomes for {runScenarioOpen?.deal.name}. Change assumptions to see impact on probability.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Scenario type</Label>
              <Select defaultValue="valuation">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="valuation">Valuation change</SelectItem>
                  <SelectItem value="timeline">Close date shift</SelectItem>
                  <SelectItem value="competition">Competing term sheet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setRunScenarioOpen(null)}>Cancel</Button>
            <Button type="button" onClick={() => { const name = runScenarioOpen?.deal.name; setRunScenarioOpen(null); toast({ title: "Scenario run", description: name ? `Results for ${name} are ready.` : "Scenario complete." }); }}>Run</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* What-if scenario card detail */}
      <Dialog open={!!scenarioCardOpen} onOpenChange={(open) => !open && setScenarioCardOpen(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {scenarioCardOpen === "add-deals" && "Add 3 high-probability deals"}
              {scenarioCardOpen === "remove-at-risk" && "Remove at-risk deals"}
              {scenarioCardOpen === "accelerate" && "Accelerate top 5 deals"}
            </DialogTitle>
            <DialogDescription>
              {scenarioCardOpen === "add-deals" && "Adding 3 deals with >70% close probability would increase expected pipeline by $8.5M. Select deals from pipeline to include."}
              {scenarioCardOpen === "remove-at-risk" && "If current at-risk deals (DataAnalytics Pro, BioTech Innovations, EdTech Platform) fall through, pipeline would decrease by $10.1M."}
              {scenarioCardOpen === "accelerate" && "Accelerating due diligence and legal on top 5 deals could reduce average time to close by 23 days."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setScenarioCardOpen(null)}>Close</Button>
            <Button type="button" onClick={() => { setScenarioCardOpen(null); toast({ title: "Scenario applied", description: "Forecast updated with scenario." }); }}>Apply to forecast</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Custom Scenario */}
      <Dialog open={createCustomScenarioOpen} onOpenChange={setCreateCustomScenarioOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create custom scenario</DialogTitle>
            <DialogDescription>Define your own what-if assumptions (e.g. add/remove deals, change close dates) and see pipeline impact.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="scenario-name">Scenario name</Label>
              <Input id="scenario-name" placeholder="e.g. Q2 aggressive close" />
            </div>
            <div className="space-y-2">
              <Label>Assumptions</Label>
              <Select defaultValue="add">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add deals to pipeline</SelectItem>
                  <SelectItem value="remove">Remove deals</SelectItem>
                  <SelectItem value="shift">Shift close dates</SelectItem>
                  <SelectItem value="mix">Mix of above</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setCreateCustomScenarioOpen(false)}>Cancel</Button>
            <Button type="button" onClick={() => { setCreateCustomScenarioOpen(false); toast({ title: "Scenario created", description: "Custom scenario has been saved." }); }}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        currentTab="predictive-analytics"
        filters={{
          dateRange: timeframe,
          sectors: [],
          stages: [],
        }}
      />
    </ProtectedRoute>
  )
}

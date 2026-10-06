"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Sparkles,
  ChevronRight,
  Building2,
  Target,
  AlertCircle,
  CheckCircle2,
  Clock,
  BarChart3,
  PieChart,
  Zap,
  ExternalLink,
  Download,
  Settings,
  Calendar,
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ExportReportModal } from "@/components/analytics/export-report-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

const portfolioCompanies = [
  {
    id: "1",
    name: "TechCorp AI",
    logo: "TC",
    tier: "outperform",
    score: 9.2,
    mrr: "$245K",
    growth: "+42%",
    runway: "18 months",
    nextMilestone: "Series B (6 months)",
    kpis: { revenue: 42, userGrowth: 38, retention: 95 },
    alerts: [],
  },
  {
    id: "2",
    name: "DataFlow Systems",
    logo: "DF",
    tier: "on-track",
    score: 7.8,
    mrr: "$180K",
    growth: "+28%",
    runway: "14 months",
    nextMilestone: "Break-even (Q3)",
    kpis: { revenue: 28, userGrowth: 25, retention: 88 },
    alerts: [],
  },
  {
    id: "3",
    name: "CloudScale",
    logo: "CS",
    tier: "needs-help",
    score: 6.1,
    mrr: "$95K",
    growth: "+8%",
    runway: "9 months",
    nextMilestone: "Product pivot",
    kpis: { revenue: 8, userGrowth: 5, retention: 72 },
    alerts: ["Low growth", "Runway concern"],
  },
  {
    id: "4",
    name: "FinTech Pro",
    logo: "FP",
    tier: "at-risk",
    score: 4.8,
    mrr: "$62K",
    growth: "-5%",
    runway: "6 months",
    nextMilestone: "Bridge round needed",
    kpis: { revenue: -5, userGrowth: -2, retention: 65 },
    alerts: ["Negative growth", "Critical runway", "Churn increasing"],
  },
]

const exitOpportunities = [
  {
    company: "TechCorp AI",
    companyId: "1",
    readiness: 85,
    timing: "12-18 months",
    valuation: "$45M - $60M",
    acquirers: ["Google", "Microsoft", "Salesforce"],
    recommendation: "Strong exit candidate. Begin positioning now.",
  },
  {
    company: "DataFlow Systems",
    companyId: "2",
    readiness: 62,
    timing: "18-24 months",
    valuation: "$25M - $35M",
    acquirers: ["Oracle", "SAP", "Adobe"],
    recommendation: "Build stronger metrics before positioning.",
  },
]

function getPortfolioDataByTimeRange(timeRange: string) {
  switch (timeRange) {
    case "3m":
      return { score: 7.8, sectorDiversity: 65, stageMix: 78, checkSize: 42 }
    case "6m":
      return { score: 8.0, sectorDiversity: 72, stageMix: 82, checkSize: 44 }
    case "12m":
      return { score: 8.2, sectorDiversity: 75, stageMix: 85, checkSize: 45 }
    default:
      return { score: 8.4, sectorDiversity: 78, stageMix: 88, checkSize: 48 }
  }
}

export default function PortfolioInsightsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [timeRange, setTimeRange] = useState("12m")
  const [performanceFilter, setPerformanceFilter] = useState<string>("all")
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [configureAlertsOpen, setConfigureAlertsOpen] = useState(false)

  const portfolioDataByTime = getPortfolioDataByTimeRange(timeRange)
  const portfolioScore = portfolioDataByTime.score
  const portfolioStats = {
    outperform: 4,
    onTrack: 8,
    needsHelp: 2,
    atRisk: 1,
  }
  const filteredCompanies = portfolioCompanies.filter(
    (c) => performanceFilter === "all" || c.tier === performanceFilter
  )

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "outperform":
        return "text-green-600 dark:text-green-400"
      case "on-track":
        return "text-yellow-600 dark:text-yellow-400"
      case "needs-help":
        return "text-orange-600 dark:text-orange-400"
      case "at-risk":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-muted-foreground"
    }
  }

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "outperform":
        return "bg-green-500/10 text-green-600 dark:text-green-400"
      case "on-track":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
      case "needs-help":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400"
      case "at-risk":
        return "bg-red-500/10 text-red-600 dark:text-red-400"
      default:
        return "bg-muted"
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Portfolio Insights" />

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
                    <Link href="/ai-insights" className="hover:text-primary transition-colors">
                      AI Insights
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-foreground">Portfolio Insights</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-primary" />
                        Portfolio Insights
                      </h1>
                      <p className="text-muted-foreground mt-1">
                        AI-powered analysis of your portfolio companies
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3m">Last 3 months</SelectItem>
                          <SelectItem value="6m">Last 6 months</SelectItem>
                          <SelectItem value="12m">Last 12 months</SelectItem>
                          <SelectItem value="all">All time</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" type="button" onClick={() => setIsExportModalOpen(true)} aria-label="Export report">
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                      </Button>
                      <Button
                        size="sm"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setConfigureAlertsOpen(true)
                        }}
                        aria-label="Configure portfolio alerts"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Configure Alerts
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="container mx-auto px-6 py-6">
                <div className="grid grid-cols-12 gap-6">
                  {/* Left Column - Main Content */}
                  <div className="col-span-12 lg:col-span-8 space-y-6">
                    {/* Portfolio Health Score */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-primary" />
                          <CardTitle>Portfolio Health Score</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col items-center justify-center py-6">
                          <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-4xl font-bold text-primary">{portfolioScore}</div>
                                <div className="text-sm text-muted-foreground">/10</div>
                              </div>
                            </div>
                            <Sparkles className="w-6 h-6 text-primary absolute -top-2 -right-2" />
                          </div>
                          <p className="text-sm text-muted-foreground mt-4">Overall Portfolio Score</p>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mt-6">
                          <button
                            type="button"
                            onClick={() => setPerformanceFilter("outperform")}
                            className="text-center p-4 rounded-lg bg-green-500/5 border border-green-500/20 hover:bg-green-500/10 transition-colors cursor-pointer"
                          >
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {portfolioStats.outperform}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">Outperform</div>
                            <div className="text-xl mt-2">🟢</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPerformanceFilter("on-track")}
                            className="text-center p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20 hover:bg-yellow-500/10 transition-colors cursor-pointer"
                          >
                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                              {portfolioStats.onTrack}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">On Track</div>
                            <div className="text-xl mt-2">🟡</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPerformanceFilter("needs-help")}
                            className="text-center p-4 rounded-lg bg-orange-500/5 border border-orange-500/20 hover:bg-orange-500/10 transition-colors cursor-pointer"
                          >
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                              {portfolioStats.needsHelp}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">Needs Help</div>
                            <div className="text-xl mt-2">🟠</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPerformanceFilter("at-risk")}
                            className="text-center p-4 rounded-lg bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-colors cursor-pointer"
                          >
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                              {portfolioStats.atRisk}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">At Risk</div>
                            <div className="text-xl mt-2">🔴</div>
                          </button>
                        </div>

                        <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                          <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-foreground">AI Insight</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                3 companies showing acceleration. Consider follow-on investment for{" "}
                                <Link href="/startups/1" className="text-primary font-medium hover:underline">
                                  TechCorp AI
                                </Link>{" "}
                                (raising Series B in 6 months).
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Company Performance */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-primary" />
                            <CardTitle>Company Performance</CardTitle>
                          </div>
                          <Select
                            value={performanceFilter}
                            onValueChange={(value) => setPerformanceFilter(value)}
                          >
                            <SelectTrigger className="w-[140px]" aria-label="Filter company performance by tier">
                              <SelectValue placeholder="All Companies" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Companies</SelectItem>
                              <SelectItem value="outperform">Outperform</SelectItem>
                              <SelectItem value="on-track">On Track</SelectItem>
                              <SelectItem value="needs-help">Needs Help</SelectItem>
                              <SelectItem value="at-risk">At Risk</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4" key={performanceFilter}>
                          {filteredCompanies.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                              No companies match the selected filter. Choose &quot;All Companies&quot; or a different tier.
                            </p>
                          ) : (
                          filteredCompanies.map((company) => (
                            <div
                              key={company.id}
                              className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                            >
                              <div className="flex items-start gap-4">
                                <Avatar className="w-12 h-12">
                                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                    {company.logo}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <Link href={`/startups/${company.id}`} className="font-semibold text-foreground hover:text-primary hover:underline">
                                          {company.name}
                                        </Link>
                                        <Badge className={getTierBadge(company.tier)}>
                                          {company.tier.replace("-", " ")}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        Score: {company.score}/10
                                      </p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      type="button"
                                      aria-label={`View ${company.name} profile`}
                                      onClick={() => router.push(`/startups/${company.id}`)}
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                    </Button>
                                  </div>

                                  <div className="grid grid-cols-4 gap-4 mb-3">
                                    <div>
                                      <p className="text-xs text-muted-foreground">MRR</p>
                                      <p className="text-sm font-semibold text-foreground">{company.mrr}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Growth</p>
                                      <p
                                        className={`text-sm font-semibold ${
                                          company.growth.startsWith("+")
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-red-600 dark:text-red-400"
                                        }`}
                                      >
                                        {company.growth}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Runway</p>
                                      <p className="text-sm font-semibold text-foreground">{company.runway}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Next Milestone</p>
                                      <p className="text-sm font-semibold text-foreground">
                                        {company.nextMilestone}
                                      </p>
                                    </div>
                                  </div>

                                  {/* KPI Progress Bars */}
                                  <div className="space-y-2">
                                    <div>
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-muted-foreground">Revenue Growth</span>
                                        <span
                                          className={`text-xs font-medium ${
                                            company.kpis.revenue > 0
                                              ? "text-green-600 dark:text-green-400"
                                              : "text-red-600 dark:text-red-400"
                                          }`}
                                        >
                                          {company.kpis.revenue > 0 ? "+" : ""}
                                          {company.kpis.revenue}%
                                        </span>
                                      </div>
                                      <Progress
                                        value={Math.abs(company.kpis.revenue)}
                                        className="h-1.5"
                                      />
                                    </div>
                                    <div>
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-muted-foreground">User Growth</span>
                                        <span
                                          className={`text-xs font-medium ${
                                            company.kpis.userGrowth > 0
                                              ? "text-green-600 dark:text-green-400"
                                              : "text-red-600 dark:text-red-400"
                                          }`}
                                        >
                                          {company.kpis.userGrowth > 0 ? "+" : ""}
                                          {company.kpis.userGrowth}%
                                        </span>
                                      </div>
                                      <Progress
                                        value={Math.abs(company.kpis.userGrowth)}
                                        className="h-1.5"
                                      />
                                    </div>
                                    <div>
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-muted-foreground">Retention</span>
                                        <span className="text-xs font-medium text-foreground">
                                          {company.kpis.retention}%
                                        </span>
                                      </div>
                                      <Progress value={company.kpis.retention} className="h-1.5" />
                                    </div>
                                  </div>

                                  {/* Alerts */}
                                  {company.alerts.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                      {company.alerts.map((alert, idx) => (
                                        <Badge
                                          key={idx}
                                          variant="outline"
                                          className="text-orange-600 dark:text-orange-400 border-orange-500/30"
                                        >
                                          <AlertCircle className="w-3 h-3 mr-1" />
                                          {alert}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Exit Readiness */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-primary" />
                          <CardTitle>Exit Readiness Analysis</CardTitle>
                        </div>
                        <CardDescription>AI-powered exit timing and valuation scenarios</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {exitOpportunities.map((exit, idx) => (
                            <Link
                              key={idx}
                              href={`/startups/${exit.companyId}`}
                              className="block p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className="font-semibold text-foreground hover:text-primary">{exit.company}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Exit Readiness: {exit.readiness}%
                                  </p>
                                </div>
                                <Badge
                                  className={
                                    exit.readiness >= 80
                                      ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                      : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                                  }
                                >
                                  {exit.readiness >= 80 ? "Strong" : "Moderate"}
                                </Badge>
                              </div>

                              <Progress value={exit.readiness} className="mb-4" />

                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Recommended Timing</p>
                                  <p className="text-sm font-medium text-foreground">{exit.timing}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">
                                    Estimated Valuation
                                  </p>
                                  <p className="text-sm font-medium text-foreground">{exit.valuation}</p>
                                </div>
                              </div>

                              <div className="mb-3">
                                <p className="text-xs text-muted-foreground mb-2">Potential Acquirers</p>
                                <div className="flex flex-wrap gap-2">
                                  {exit.acquirers.map((acquirer, i) => (
                                    <Badge key={i} variant="outline">
                                      {acquirer}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                                <div className="flex items-start gap-2">
                                  <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                  <p className="text-sm text-muted-foreground">{exit.recommendation}</p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - Sidebar */}
                  <div className="col-span-12 lg:col-span-4 space-y-6">
                    {/* Portfolio Optimization */}
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <PieChart className="w-5 h-5 text-primary" />
                          <CardTitle className="text-base">Portfolio Optimization</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-muted-foreground">Sector Diversity</span>
                              <span className="text-sm font-semibold text-foreground">
                                {portfolioDataByTime.sectorDiversity >= 75 ? "Good" : portfolioDataByTime.sectorDiversity >= 60 ? "Fair" : "Concentrated"}
                              </span>
                            </div>
                            <Progress value={portfolioDataByTime.sectorDiversity} className="mb-1" />
                            <p className="text-xs text-muted-foreground">
                              Well-balanced across sectors
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-muted-foreground">Stage Mix</span>
                              <span className="text-sm font-semibold text-foreground">
                                {portfolioDataByTime.stageMix >= 80 ? "Optimal" : portfolioDataByTime.stageMix >= 70 ? "Good" : "Fair"}
                              </span>
                            </div>
                            <Progress value={portfolioDataByTime.stageMix} className="mb-1" />
                            <p className="text-xs text-muted-foreground">Good early/growth balance</p>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-muted-foreground">Check Size</span>
                              <span className="text-sm font-semibold text-foreground">
                                {portfolioDataByTime.checkSize >= 60 ? "Diversified" : portfolioDataByTime.checkSize >= 45 ? "Concentrated" : "Highly concentrated"}
                              </span>
                            </div>
                            <Progress value={portfolioDataByTime.checkSize} className="mb-1" />
                            <p className="text-xs text-muted-foreground">Consider smaller bets</p>
                          </div>
                        </div>

                        <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                          <div className="flex items-start gap-2">
                            <Zap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-foreground">Rebalancing Tip</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Add 2-3 more healthcare companies to improve sector diversity
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Alerts & Action Items */}
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-primary" />
                          <CardTitle className="text-base">Action Required</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <Link href="/startups/4" className="block p-3 rounded-lg bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-colors">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-foreground">Critical: FinTech Pro</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  6 months runway. Schedule bridge discussion ASAP.
                                </p>
                              </div>
                            </div>
                          </Link>

                          <Link href="/startups/1" className="block p-3 rounded-lg bg-orange-500/5 border border-orange-500/20 hover:bg-orange-500/10 transition-colors">
                            <div className="flex items-start gap-2">
                              <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-foreground">Follow-on: TechCorp AI</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Series B in 6 months. Reserve pro-rata allocation.
                                </p>
                              </div>
                            </div>
                          </Link>

                          <Link href="/startups/2" className="block p-3 rounded-lg bg-green-500/5 border border-green-500/20 hover:bg-green-500/10 transition-colors">
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  Strong: DataFlow Systems
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Hitting all milestones. Consider case study.
                                </p>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Updates */}
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          <CardTitle className="text-base">Recent Updates</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          <Link href="/startups/1" className="flex gap-3 hover:opacity-80 transition-opacity">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <div>
                              <p className="text-foreground">TechCorp AI closed partnership with Google</p>
                              <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                            </div>
                          </Link>
                          <Link href="/startups/2" className="flex gap-3 hover:opacity-80 transition-opacity">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <div>
                              <p className="text-foreground">DataFlow hit $200K MRR milestone</p>
                              <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                            </div>
                          </Link>
                          <Link href="/startups/3" className="flex gap-3 hover:opacity-80 transition-opacity">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <div>
                              <p className="text-foreground">CloudScale launched v2.0 product</p>
                              <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                            </div>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Configure Alerts */}
      <Dialog open={configureAlertsOpen} onOpenChange={setConfigureAlertsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configure portfolio alerts</DialogTitle>
            <DialogDescription>
              Choose which portfolio events you want to be notified about.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <Checkbox id="alert-runway" defaultChecked />
              <Label htmlFor="alert-runway" className="text-sm cursor-pointer">Runway below 12 months</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="alert-followon" defaultChecked />
              <Label htmlFor="alert-followon" className="text-sm cursor-pointer">Follow-on round (pro-rata)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="alert-milestone" defaultChecked />
              <Label htmlFor="alert-milestone" className="text-sm cursor-pointer">Key milestones (MRR, partnerships)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="alert-tier" />
              <Label htmlFor="alert-tier" className="text-sm cursor-pointer">Tier change (e.g. to At Risk)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setConfigureAlertsOpen(false)}>Cancel</Button>
            <Button type="button" onClick={() => { setConfigureAlertsOpen(false); toast({ title: "Alerts updated", description: "Portfolio alert preferences have been saved." }); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        currentTab="portfolio-insights"
        filters={{
          dateRange: timeRange,
          sectors: [],
          stages: [],
        }}
      />
    </ProtectedRoute>
  )
}

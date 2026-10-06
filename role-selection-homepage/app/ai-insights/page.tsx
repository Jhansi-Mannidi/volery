"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Sparkles,
  Settings,
  TrendingUp,
  TrendingDown,
  Building2,
  Target,
  FileText,
  Globe,
  LineChart,
  MessageSquare,
  ChevronRight,
  Upload,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  ArrowRight,
  Send,
  Eye,
  Lightbulb,
  BookOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Quick Insights Data
const quickInsights = [
  {
    id: "matches",
    icon: Sparkles,
    label: "New Matches",
    value: "12",
    subtitle: "Found today",
    change: "+4 from yesterday",
    trend: "up",
    href: "/ai-insights/investor-matching",
  },
  {
    id: "scores",
    icon: Target,
    label: "Deal Scores",
    value: "8.2/10",
    subtitle: "Avg pipeline score",
    change: "+0.5 vs last week",
    trend: "up",
    href: "/ai-insights/deal-intelligence",
  },
  {
    id: "docs",
    icon: FileText,
    label: "Docs Analyzed",
    value: "45",
    subtitle: "This week",
    change: "+15 from last wk",
    trend: "up",
    href: "/ai-insights/document-analysis",
  },
  {
    id: "predictions",
    icon: LineChart,
    label: "Predictions",
    value: "85%",
    subtitle: "Close rate confidence",
    change: "+5% improvement",
    trend: "up",
    href: "/ai-insights/predictive-analytics",
  },
]

// Deal Intelligence Insights
const dealInsights = [
  {
    id: 1,
    company: "TechCorp AI",
    score: 8.5,
    status: "hot",
    highlight: "Strong fundamentals",
    metrics: "Revenue growth 180% YoY, NRR 115%",
    redFlags: 2,
  },
  {
    id: 2,
    company: "GreenEnergy",
    score: 6.2,
    status: "warning",
    highlight: "Needs attention",
    metrics: "Burn rate increased 40% MoM",
    redFlags: 0,
  },
]

// Investor Matches
const investorMatches = [
  {
    startup: "TechCorp AI",
    investor: "Sequoia Capital",
    matchScore: 94,
    factors: ["Sector", "Stage", "Check Size", "Geography"],
  },
  {
    startup: "GreenEnergy",
    investor: "Lightspeed Venture",
    matchScore: 87,
    factors: ["Sector", "Stage", "Check Size"],
    note: "Warm Intro Available",
  },
  {
    startup: "HealthX",
    investor: "Matrix Partners",
    matchScore: 82,
    factors: ["Sector", "Stage"],
    note: "Check Size slightly above",
  },
]

// Document Analyses
const documentAnalyses = [
  {
    id: 1,
    name: "TechCorp_Pitch_Deck_v3.pdf",
    type: "pitch_deck",
    status: "complete",
    dataPoints: 45,
    redFlags: 3,
    highlights: 8,
    confidence: 94,
  },
  {
    id: 2,
    name: "GreenEnergy_Financial_Model.xlsx",
    type: "financial",
    status: "complete",
    dataPoints: 32,
    redFlags: 1,
    highlights: 5,
    confidence: 88,
    warning: "Aggressive assumptions detected",
  },
  {
    id: 3,
    name: "HealthX_CapTable.pdf",
    type: "cap_table",
    status: "processing",
    progress: 60,
  },
]

// Trending Sectors
const trendingSectors = [
  { name: "AI/ML Infrastructure", icon: "🚀", change: 23, trend: "up" },
  { name: "Climate Tech", icon: "💚", change: 18, trend: "up" },
  { name: "Digital Health", icon: "🏥", change: 12, trend: "up" },
  { name: "Embedded Finance", icon: "🏦", change: 0, trend: "stable" },
  { name: "Gaming", icon: "🎮", change: -8, trend: "down" },
]

// Predictive Analytics Data
const predictiveData = {
  expectedCloses: "₹45 Cr",
  confidence: 85,
  dealsAtRisk: 3,
  hotOpportunities: 5,
}

// AI Activity Feed
const aiActivities = [
  {
    id: 1,
    time: "10:45 AM",
    type: "match",
    icon: Sparkles,
    title: "New match found: TechCorp AI ↔ Peak XV Partners (91%)",
    actions: ["View Match", "Send Intro Request"],
  },
  {
    id: 2,
    time: "10:30 AM",
    type: "document",
    icon: FileText,
    title: "Document analysis complete: GreenEnergy_Financials.xlsx",
    subtitle: "Found: 3 concerns, 5 highlights. Review recommended.",
    actions: ["View Analysis"],
  },
  {
    id: 3,
    time: "10:15 AM",
    type: "risk",
    icon: AlertTriangle,
    title: "Risk alert: HealthX deal velocity slowing",
    subtitle: "No activity for 8 days. Suggest: Follow up with founder.",
    actions: ["View Deal", "Send Reminder"],
  },
  {
    id: 4,
    time: "9:45 AM",
    type: "memo",
    icon: FileText,
    title: "Investment memo generated for FinSecure",
    subtitle: "15 pages, 80% complete. Needs human review.",
    actions: ["Review Memo", "Edit"],
  },
  {
    id: 5,
    time: "Yesterday",
    type: "batch",
    icon: Target,
    title: "Match engine updated: 23 new investor-deal matches",
    subtitle: "5 high-priority (>90% match score)",
    actions: ["View All Matches"],
  },
]

// AI Usage Data
const aiUsage = {
  documentAnalyses: { used: 45, total: 100 },
  matchQueries: { used: 156, total: 500 },
  chatMessages: { used: 89, total: 200 },
  memoGenerations: { used: 8, total: 20 },
}

// AI Recommendations
const aiRecommendations = [
  { id: 1, text: "Run matching for 3 deals without investors", action: "Run Matching" },
  { id: 2, text: "Analyze 5 pending pitch decks", action: "Analyze Batch" },
  { id: 3, text: "Generate weekly pipeline report", action: "Generate Report" },
]

// Quick Questions
const quickQuestions = [
  "Who are the best investors for TechCorp AI?",
  "What's the average Series A valuation in Fintech?",
  "Compare our pipeline to last quarter",
  "Generate an investment memo for HealthX",
]

export default function AIInsightsDashboardPage() {
  const [chatInput, setChatInput] = useState("")
  const [aiSettingsOpen, setAiSettingsOpen] = useState(false)
  const { toast } = useToast()

  // AI Settings form state (persisted in dialog only; in production would sync to API)
  const [primaryModel, setPrimaryModel] = useState("gpt-4-turbo")
  const [embeddingModel, setEmbeddingModel] = useState("embedding-v3")
  const [matchEngineVersion, setMatchEngineVersion] = useState("v2.1")
  const [autoAnalyzeDocs, setAutoAnalyzeDocs] = useState(true)
  const [notifyOnNewMatches, setNotifyOnNewMatches] = useState(true)
  const [includeRedFlagsInSummary, setIncludeRedFlagsInSummary] = useState(true)

  const handleSaveAiSettings = () => {
    setAiSettingsOpen(false)
    toast({
      title: "AI settings saved",
      description: "Your AI preferences have been updated.",
    })
  }

  return (
    <ProtectedRoute>
    <div className="flex flex-col h-screen bg-background">
    <DashboardHeader title="AI Insights" />
    
    <div className="flex flex-1 overflow-hidden">
    <DashboardSidebar />
    
    <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
            <div className="max-w-[1600px] mx-auto space-y-6">
              {/* Breadcrumb */}
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/role-selection">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>AI Insights</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-foreground">AI Insights Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Your AI-powered command center</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="gap-2 bg-transparent"
                  onClick={() => setAiSettingsOpen(true)}
                  type="button"
                  aria-label="Open AI settings"
                >
                  <Settings className="w-4 h-4" />
                  AI Settings
                </Button>
              </div>

              {/* AI Status Banner */}
              <Card className="border-green-500/30 bg-green-500/5">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                      <span className="font-medium text-foreground">AI Systems Online</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span>Last analysis: 5 minutes ago</span>
                      <span className="hidden sm:inline">•</span>
                      <span>156 insights generated today</span>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">GPT-4 Turbo</Badge>
                    <Badge variant="secondary" className="text-xs">Embedding v3</Badge>
                    <Badge variant="secondary" className="text-xs">Match Engine v2.1</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Insights Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickInsights.map((insight) => (
                  <Card key={insight.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <insight.icon className="w-5 h-5 text-primary" />
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            insight.trend === "up"
                              ? "text-green-600 border-green-500/30"
                              : "text-red-600 border-red-500/30"
                          )}
                        >
                          {insight.trend === "up" ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {insight.change}
                        </Badge>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground">{insight.label}</p>
                        <p className="text-2xl font-bold mt-1">{insight.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{insight.subtitle}</p>
                      </div>
                      <Link
                        href={insight.href}
                        className="mt-3 flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - 2 Columns Wide */}
                <div className="lg:col-span-2 space-y-6">
                  {/* AI Feature Cards - 2x3 Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Deal Intelligence Card */}
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-primary" />
                            <CardTitle className="text-lg">Deal Intelligence</CardTitle>
                          </div>
                          <Link href="/ai-insights/deal-intelligence">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                        <CardDescription>AI-powered analysis of your pipeline deals</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {dealInsights.map((deal) => (
                          <div
                            key={deal.id}
                            className="p-3 rounded-lg bg-muted/50 border border-border"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                {deal.status === "hot" ? (
                                  <span className="text-lg">🔥</span>
                                ) : (
                                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                                )}
                                <span className="font-medium text-sm">{deal.company}</span>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs",
                                    deal.status === "hot"
                                      ? "text-green-600 border-green-500/30"
                                      : "text-amber-600 border-amber-500/30"
                                  )}
                                >
                                  {deal.score}/10
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-foreground mt-1">{deal.highlight}</p>
                            <p className="text-xs text-muted-foreground mt-1">{deal.metrics}</p>
                            {deal.redFlags > 0 && (
                              <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                {deal.redFlags} red flags detected
                              </p>
                            )}
                          </div>
                        ))}
                        <div className="pt-2">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Pipeline Health</span>
                            <span className="font-medium">72% above threshold</span>
                          </div>
                          <Progress value={72} className="h-2" />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            Analyze New Deal
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            View All Scores
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Investor Matching Card */}
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary" />
                            <CardTitle className="text-lg">Investor Matching</CardTitle>
                          </div>
                          <Link href="/ai-insights/investor-matching">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                        <CardDescription>AI finds the perfect investors for your deals</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {investorMatches.map((match, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">
                                {match.startup} ↔ {match.investor}
                              </span>
                            </div>
                            <Progress value={match.matchScore} className="h-2" />
                            <div className="flex flex-wrap items-center gap-1">
                              {match.factors.map((factor) => (
                                <Badge key={factor} variant="outline" className="text-[10px] px-1.5 py-0">
                                  ✓ {factor}
                                </Badge>
                              ))}
                              {match.note && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                  ○ {match.note}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            Find Matches
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            View All
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Document Analysis Card */}
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            <CardTitle className="text-lg">Document Analysis</CardTitle>
                          </div>
                          <Link href="/ai-insights/document-analysis">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                        <CardDescription>
                          AI extracts insights from pitch decks & financials
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {documentAnalyses.map((doc) => (
                          <div key={doc.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium truncate max-w-[180px]">
                                  {doc.name}
                                </span>
                              </div>
                              {doc.status === "complete" ? (
                                <Badge variant="outline" className="text-xs text-green-600 border-green-500/30">
                                  ✓ Complete
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs text-amber-600 border-amber-500/30">
                                  ⏳ Processing
                                </Badge>
                              )}
                            </div>
                            {doc.status === "complete" ? (
                              <>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Extracted: {doc.dataPoints} data points • {doc.redFlags} red flags •{" "}
                                  {doc.highlights} highlights
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Confidence: {doc.confidence}%
                                </p>
                                {doc.warning && (
                                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    {doc.warning}
                                  </p>
                                )}
                              </>
                            ) : (
                              <div className="mt-2">
                                <Progress value={doc.progress} className="h-1.5" />
                                <p className="text-xs text-muted-foreground mt-1">{doc.progress}%</p>
                              </div>
                            )}
                          </div>
                        ))}
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1 gap-2 bg-transparent">
                            <Upload className="w-4 h-4" />
                            Upload Document
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            View History
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Market Intelligence Card */}
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Globe className="w-5 h-5 text-primary" />
                            <CardTitle className="text-lg">Market Intelligence</CardTitle>
                          </div>
                          <Link href="/ai-insights/market-intelligence">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                        <CardDescription>AI-powered market and competitive analysis</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm font-medium text-foreground">Trending Sectors This Week</p>
                        <div className="space-y-2">
                          {trendingSectors.map((sector, index) => (
                            <div
                              key={sector.name}
                              className="flex items-center justify-between text-sm"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-5 text-center">{index + 1}.</span>
                                <span>{sector.icon}</span>
                                <span>{sector.name}</span>
                              </div>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  sector.trend === "up"
                                    ? "text-green-600 border-green-500/30"
                                    : sector.trend === "down"
                                    ? "text-red-600 border-red-500/30"
                                    : "text-muted-foreground"
                                )}
                              >
                                {sector.trend === "up" && "↑ "}
                                {sector.trend === "down" && "↓ "}
                                {sector.trend === "stable" ? "Stable" : `${Math.abs(sector.change)}% deal flow`}
                              </Badge>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 mt-3">
                          <div className="flex items-start gap-2">
                            <Zap className="w-4 h-4 text-amber-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Market Alert</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                3 new competitors entered TechCorp AI's market segment this month.
                                Competitive analysis available.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            View Market Report
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            Competitor Analysis
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Predictive Analytics Card */}
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <LineChart className="w-5 h-5 text-primary" />
                            <CardTitle className="text-lg">Predictive Analytics</CardTitle>
                          </div>
                          <Link href="/ai-insights/predictive-analytics">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                        <CardDescription>
                          AI predicts deal outcomes and pipeline performance
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm font-medium text-foreground">
                          Pipeline Forecast (Next 90 Days)
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg bg-muted/50 border border-border">
                            <p className="text-xs text-muted-foreground">Expected Closes</p>
                            <p className="text-xl font-bold mt-1">{predictiveData.expectedCloses}</p>
                            <p className="text-xs text-muted-foreground">
                              {predictiveData.confidence}% confidence
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50 border border-border">
                            <p className="text-xs text-muted-foreground">Deals at Risk</p>
                            <p className="text-xl font-bold mt-1 text-amber-600">
                              {predictiveData.dealsAtRisk}
                            </p>
                            <p className="text-xs text-muted-foreground">May stall</p>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <p className="text-sm font-medium text-foreground">
                              {predictiveData.hotOpportunities} deals likely to accelerate
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            View Full Forecast
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            Scenario Planning
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                  {/* AI Usage Card */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <CardTitle className="text-base">AI Usage This Month</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1.5">
                            <span className="text-muted-foreground">Document Analyses</span>
                            <span className="font-medium">
                              {aiUsage.documentAnalyses.used} / {aiUsage.documentAnalyses.total}
                            </span>
                          </div>
                          <Progress
                            value={(aiUsage.documentAnalyses.used / aiUsage.documentAnalyses.total) * 100}
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1.5">
                            <span className="text-muted-foreground">Match Queries</span>
                            <span className="font-medium">
                              {aiUsage.matchQueries.used} / {aiUsage.matchQueries.total}
                            </span>
                          </div>
                          <Progress
                            value={(aiUsage.matchQueries.used / aiUsage.matchQueries.total) * 100}
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1.5">
                            <span className="text-muted-foreground">AI Chat Messages</span>
                            <span className="font-medium">
                              {aiUsage.chatMessages.used} / {aiUsage.chatMessages.total}
                            </span>
                          </div>
                          <Progress
                            value={(aiUsage.chatMessages.used / aiUsage.chatMessages.total) * 100}
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1.5">
                            <span className="text-muted-foreground">Memo Generations</span>
                            <span className="font-medium">
                              {aiUsage.memoGenerations.used} / {aiUsage.memoGenerations.total}
                            </span>
                          </div>
                          <Progress
                            value={(aiUsage.memoGenerations.used / aiUsage.memoGenerations.total) * 100}
                            className="h-2"
                          />
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                        <ArrowRight className="w-4 h-4" />
                        Upgrade for More
                      </Button>
                    </CardContent>
                  </Card>

                  {/* AI Recommendations Card */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-primary" />
                        <CardTitle className="text-base">AI Recommendations</CardTitle>
                      </div>
                      <CardDescription>Based on your activity</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {aiRecommendations.map((rec, index) => (
                        <div
                          key={rec.id}
                          className="p-3 rounded-lg bg-muted/50 border border-border"
                        >
                          <p className="text-sm text-foreground">
                            {index + 1}. {rec.text}
                          </p>
                          <Button size="sm" variant="link" className="h-auto p-0 mt-1 text-primary">
                            {rec.action} →
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Learning & Tips Card */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <CardTitle className="text-base">AI Tips</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground">Did you know?</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              AI matching accuracy improves when you add more investor criteria. Try
                              adding check size ranges.
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button variant="link" size="sm" className="mt-3 h-auto p-0 text-primary">
                        Learn More About AI Features →
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* AI Settings Dialog */}
      <Dialog open={aiSettingsOpen} onOpenChange={setAiSettingsOpen}>
        <DialogContent className="max-w-lg sm:max-w-xl" onCloseAutoFocus={(e) => e?.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              AI Settings
            </DialogTitle>
            <DialogDescription>
              Configure AI models and preferences for insights, matching, and document analysis.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Model selection */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-foreground">Models</p>
              <div className="grid gap-4 sm:grid-cols-1">
                <div className="space-y-2">
                  <Label htmlFor="primary-model">Primary language model</Label>
                  <Select value={primaryModel} onValueChange={setPrimaryModel}>
                    <SelectTrigger id="primary-model" className="bg-transparent">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Used for deal analysis, memos, and chat.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="embedding-model">Embedding model</Label>
                  <Select value={embeddingModel} onValueChange={setEmbeddingModel}>
                    <SelectTrigger id="embedding-model" className="bg-transparent">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="embedding-v3">Embedding v3</SelectItem>
                      <SelectItem value="embedding-v2">Embedding v2</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Used for semantic search and matching.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="match-engine">Match engine</Label>
                  <Select value={matchEngineVersion} onValueChange={setMatchEngineVersion}>
                    <SelectTrigger id="match-engine" className="bg-transparent">
                      <SelectValue placeholder="Select version" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="v2.1">Match Engine v2.1</SelectItem>
                      <SelectItem value="v2.0">Match Engine v2.0</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Investor–deal matching algorithm version.
                  </p>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-4 border-t pt-4">
              <p className="text-sm font-medium text-foreground">Preferences</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-analyze" className="text-sm font-normal cursor-pointer">
                      Auto-analyze new documents
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Run AI analysis when new documents are uploaded.
                    </p>
                  </div>
                  <Switch
                    id="auto-analyze"
                    checked={autoAnalyzeDocs}
                    onCheckedChange={setAutoAnalyzeDocs}
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="notify-matches" className="text-sm font-normal cursor-pointer">
                      Notify on new matches
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Get notified when high-confidence investor matches are found.
                    </p>
                  </div>
                  <Switch
                    id="notify-matches"
                    checked={notifyOnNewMatches}
                    onCheckedChange={setNotifyOnNewMatches}
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="red-flags-summary" className="text-sm font-normal cursor-pointer">
                      Include red flags in summaries
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Show risk highlights in deal and document summaries.
                    </p>
                  </div>
                  <Switch
                    id="red-flags-summary"
                    checked={includeRedFlagsInSummary}
                    onCheckedChange={setIncludeRedFlagsInSummary}
                  />
                </div>
              </div>
            </div>

            {/* Usage note */}
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Usage this month</p>
              <p>
                Document analyses: {aiUsage.documentAnalyses.used}/{aiUsage.documentAnalyses.total} · Match queries: {aiUsage.matchQueries.used}/{aiUsage.matchQueries.total} · Memos: {aiUsage.memoGenerations.used}/{aiUsage.memoGenerations.total}
              </p>
              <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-primary">
                Upgrade for more
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAiSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAiSettings}>
              Save settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </ProtectedRoute>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  Edit3,
  ExternalLink,
  FileText,
  HelpCircle,
  Lightbulb,
  RefreshCw,
  Settings,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ExportReportModal } from "@/components/analytics/export-report-modal"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

type HighlightItem = { title: string; description: string; benchmark?: string }

// Mock data
const dealData = {
  id: "1",
  name: "TechCorp AI",
  tagline: "AI-powered financial document analysis",
  score: 8.5,
  scoreBreakdown: {
    traction: { score: 9.0, label: "Traction" },
    team: { score: 8.5, label: "Team" },
    market: { score: 8.0, label: "Market" },
    financials: { score: 8.5, label: "Financials" },
    product: { score: 8.5, label: "Product" },
  },
  confidence: 94,
  lastAnalyzed: "2 hours ago",
  basedOn: ["Pitch deck", "Financials"],
  status: "strong",
  statusText: "Strong Investment Candidate",
  percentile: "Top 15%",
  highlights: [
    {
      category: "Strong Metrics",
      items: [
        {
          title: "Revenue Growth: 180% YoY",
          description: "Exceptional growth rate, top 10% for sector",
          benchmark: "Median Series A Fintech = 120% YoY",
        },
        {
          title: "Net Revenue Retention: 115%",
          description: "Indicates strong product-market fit",
          benchmark: "Best-in-class SaaS = 120%+",
        },
        {
          title: "CAC Payback: 9 months",
          description: "Capital efficient customer acquisition",
          benchmark: "Good = <12 months",
        },
      ],
    },
    {
      category: "Team Strength",
      items: [
        {
          title: "Founder background: Ex-Flipkart PM, IIT alumni",
          description: "Strong operator experience in relevant domain",
        },
        {
          title: "Technical team: 60% engineers, strong ML expertise",
          description: "Well-suited for AI-focused product",
        },
      ],
    },
    {
      category: "Market Position",
      items: [
        {
          title: "TAM: $4.2B growing at 25% CAGR",
          description: "Large and expanding market opportunity",
        },
        {
          title: "Early mover in AI-native document processing",
          description: "Timing advantage in emerging category",
        },
      ],
    },
  ],
  redFlags: [
    {
      severity: "critical",
      title: "Customer Concentration Risk",
      subtitle: "Top 3 customers = 45% of revenue",
      why: "High dependency on few customers creates revenue risk if any churn. Industry standard is <25% concentration.",
      mitigation: [
        "Ask about pipeline diversity",
        "Request customer acquisition roadmap",
        "Understand contracts and renewal terms",
      ],
    },
    {
      severity: "critical",
      title: "Burn Rate Increasing",
      subtitle: "Monthly burn up 40% in last quarter",
      why: "Runway reduced to 7 months. May need to raise sooner than planned or cut costs.",
      mitigation: [
        "Review hiring plan vs. revenue growth",
        "Ask about path to profitability",
        "Understand use of funds allocation",
      ],
    },
  ],
  questions: [
    {
      category: "Customer Concentration",
      question: "What's your plan to diversify revenue across more customers? What does your sales pipeline look like?",
    },
    {
      category: "Burn Management",
      question: "Walk me through your hiring plan for the next 12 months and how it ties to revenue milestones.",
    },
    {
      category: "Competitive Moat",
      question: "How defensible is your AI technology? What's stopping a larger player from replicating your approach?",
    },
    {
      category: "Unit Economics Sustainability",
      question: "How do you expect CAC to change as you move upmarket to enterprise customers?",
    },
    {
      category: "Technology Roadmap",
      question: "What's on your product roadmap for the next 18 months? How does it tie to customer feedback?",
    },
    {
      category: "Exit Potential",
      question: "Who are the likely acquirers in your space? Have you had any inbound interest?",
    },
  ],
  benchmarks: [
    { metric: "ARR Growth (YoY)", company: "180%", median: "120%", percentile: "85th", status: "good" },
    { metric: "Net Revenue Retention", company: "115%", median: "110%", percentile: "70th", status: "good" },
    { metric: "Gross Margin", company: "72%", median: "68%", percentile: "65th", status: "good" },
    { metric: "CAC Payback", company: "9 mo", median: "12 mo", percentile: "75th", status: "good" },
    { metric: "Burn Multiple", company: "1.8x", median: "2.5x", percentile: "70th", status: "good" },
    { metric: "Team Size", company: "22", median: "18", percentile: "60th", status: "neutral" },
    { metric: "Runway", company: "7 mo", median: "12 mo", percentile: "35th", status: "bad" },
  ],
  extractedData: {
    companyInfo: [
      { field: "Company Name", value: "TechCorp AI", confidence: 99 },
      { field: "Founded", value: "2021", confidence: 98 },
      { field: "Headquarters", value: "Bangalore, India", confidence: 99 },
      { field: "Sector", value: "Fintech / AI", confidence: 95 },
      { field: "Stage", value: "Series A", confidence: 99 },
    ],
    tractionMetrics: [
      { field: "ARR", value: "₹1.2 Cr", confidence: 98 },
      { field: "MRR", value: "₹10 L", confidence: 97 },
      { field: "MoM Growth", value: "15%", confidence: 92 },
      { field: "Customers", value: "85", confidence: 99 },
      { field: "NRR", value: "115%", confidence: 88 },
    ],
    fundraising: [
      { field: "Raising", value: "₹15 Cr", confidence: 99 },
      { field: "Pre-money", value: "₹60 Cr", confidence: 94 },
      { field: "Use of Funds", value: "Team (40%), Product (30%)...", confidence: 85 },
    ],
  },
  summary: {
    overview: "TechCorp AI is a B2B SaaS platform providing AI-powered financial document analysis to enterprises. The company has achieved ₹1.2 Cr ARR with exceptional 180% YoY growth and serves 85 customers including notable enterprises.",
    thesis: "Strong product-market fit demonstrated by 115% NRR and efficient customer acquisition (9-month CAC payback). The founding team brings relevant experience from Flipkart and strong technical credentials (IIT/IIM). Market timing is favorable with enterprises increasingly adopting AI solutions.",
    risks: "Customer concentration (top 3 = 45% revenue) and increasing burn rate warrant attention. Competitive dynamics with incumbents and well-funded startups need monitoring.",
    recommendation: "Proceed to detailed due diligence. Address concentration and burn concerns in founder discussions.",
  },
}

const allDeals = [
  { id: "1", name: "TechCorp AI", score: 8.5 },
  { id: "2", name: "FinanceFlow", score: 7.8 },
  { id: "3", name: "DataSync Pro", score: 8.2 },
  { id: "4", name: "CloudMetrics", score: 7.5 },
]

export default function DealIntelligencePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedDeal, setSelectedDeal] = useState(dealData.id)
  const [expandedHighlight, setExpandedHighlight] = useState<string | null>("Strong Metrics")
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [analyzeNewDealOpen, setAnalyzeNewDealOpen] = useState(false)
  const [batchAnalysisOpen, setBatchAnalysisOpen] = useState(false)
  const [compareDealsOpen, setCompareDealsOpen] = useState(false)
  const [compareDealIds, setCompareDealIds] = useState<string[]>([])
  const [reanalyzeConfirmOpen, setReanalyzeConfirmOpen] = useState(false)
  const [addToNotesOpen, setAddToNotesOpen] = useState(false)
  const [addToNotesContent, setAddToNotesContent] = useState("")
  const [addToNotesSource, setAddToNotesSource] = useState<"questions" | "summary" | null>(null)
  const [editExtractedOpen, setEditExtractedOpen] = useState(false)
  const [verifyConfirmOpen, setVerifyConfirmOpen] = useState(false)
  const [editSummaryOpen, setEditSummaryOpen] = useState(false)
  const [generateMemoOpen, setGenerateMemoOpen] = useState(false)
  const [isReanalyzing, setIsReanalyzing] = useState(false)
  const [isGeneratingMemo, setIsGeneratingMemo] = useState(false)

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return "text-green-600 dark:text-green-400"
    if (score >= 7.5) return "text-blue-600 dark:text-blue-400"
    if (score >= 6.5) return "text-amber-600 dark:text-amber-400"
    return "text-red-600 dark:text-red-400"
  }

  const getScoreBg = (score: number) => {
    if (score >= 8.5) return "bg-green-50 dark:bg-green-950/30"
    if (score >= 7.5) return "bg-blue-50 dark:bg-blue-950/30"
    if (score >= 6.5) return "bg-amber-50 dark:bg-amber-950/30"
    return "bg-red-50 dark:bg-red-950/30"
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Deal Intelligence" />
        
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          
          <main className="flex-1 overflow-auto">
            <div className="px-4 md:px-6 py-6 max-w-[1600px] mx-auto space-y-6">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/role-selection" className="hover:text-foreground transition-colors">
                  Home
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/ai-insights" className="hover:text-foreground transition-colors">
                  AI Insights
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground">Deal Intelligence</span>
              </div>

              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="w-7 h-7 text-primary" />
                    Deal Intelligence
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    AI-powered analysis of your pipeline deals
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setAnalyzeNewDealOpen(true)} type="button">
                    <FileText className="w-4 h-4 mr-2" />
                    Analyze New Deal
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setBatchAnalysisOpen(true)} type="button">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Batch Analysis
                  </Button>
                </div>
              </div>

              {/* Deal Selection */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Select Deal:
                      </label>
                      <Select value={selectedDeal} onValueChange={setSelectedDeal}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {allDeals.map((deal) => (
                            <SelectItem key={deal.id} value={deal.id}>
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                {deal.name}
                                <span className="text-muted-foreground ml-2">
                                  (Score: {deal.score}/10)
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2 md:mt-6">
                      <span className="text-sm text-muted-foreground">Or:</span>
                      <Button variant="outline" size="sm" onClick={() => { router.push("/pipeline"); toast({ title: "Opening pipeline", description: "Viewing all deals with scores." }); }} type="button">
                        View All Deals with Scores
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setCompareDealsOpen(true)} type="button">
                        Compare Deals
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Deal Score Overview */}
              <Card className={cn("border-2", getScoreBg(dealData.score))}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-semibold text-foreground">{dealData.name}</h2>
                      </div>
                      <p className="text-muted-foreground text-sm">{dealData.tagline}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">AI Score</div>
                      <div className={cn("text-3xl font-bold", getScoreColor(dealData.score))}>
                        {dealData.score}/10
                      </div>
                    </div>
                  </div>

                  {/* Score Circle */}
                  <div className="flex flex-col items-center py-8 mb-6 bg-background/50 rounded-lg">
                    <div className="relative w-48 h-48 mb-4">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="96"
                          cy="96"
                          r="88"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-muted/20"
                        />
                        <circle
                          cx="96"
                          cy="96"
                          r="88"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${(dealData.score / 10) * 552.9} 552.9`}
                          className="text-primary transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-5xl font-bold text-foreground">{dealData.score}</div>
                        <div className="text-muted-foreground flex items-center gap-1">
                          /10 <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="mb-1 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {dealData.statusText}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{dealData.percentile} of deals analyzed this quarter</p>
                  </div>

                  {/* Score Breakdown */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-foreground mb-4">Score Breakdown:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {Object.entries(dealData.scoreBreakdown).map(([key, data]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{data.label}</span>
                            <span className="text-sm font-medium text-foreground">{data.score}</span>
                          </div>
                          <Progress value={data.score * 10} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span>Confidence: {dealData.confidence}% (High)</span>
                      </div>
                      <span>•</span>
                      <span>Last analyzed: {dealData.lastAnalyzed}</span>
                      <span>•</span>
                      <span>Based on: {dealData.basedOn.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setReanalyzeConfirmOpen(true)} type="button" disabled={isReanalyzing}>
                        <RefreshCw className={cn("w-4 h-4 mr-2", isReanalyzing && "animate-spin")} />
                        Re-analyze
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => { router.push("/activity"); toast({ title: "Opening history", description: "Viewing analysis history for this deal." }); }} type="button">
                        View History
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setIsExportModalOpen(true)} type="button">
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Insights - 3 Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Highlights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                      <CheckCircle2 className="w-5 h-5" />
                      Highlights ({dealData.highlights.reduce((acc, cat) => acc + cat.items.length, 0)})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {dealData.highlights.map((category) => (
                      <div key={category.category}>
                        <button
                          onClick={() =>
                            setExpandedHighlight(
                              expandedHighlight === category.category ? null : category.category
                            )
                          }
                          className="flex items-center justify-between w-full text-left mb-2"
                        >
                          <h4 className="font-medium text-foreground">{category.category}</h4>
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 text-muted-foreground transition-transform",
                              expandedHighlight === category.category && "rotate-180"
                            )}
                          />
                        </button>
                        {expandedHighlight === category.category && (
                          <div className="space-y-3 pl-3 border-l-2 border-green-200 dark:border-green-800">
                            {category.items.map((item: HighlightItem, idx) => (
                              <div key={idx} className="space-y-1">
                                <div className="flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                                    <p className="text-xs text-muted-foreground italic mt-0.5">
                                      "{item.description}"
                                    </p>
                                    {item.benchmark && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Benchmark: {item.benchmark}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Red Flags */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                      <AlertCircle className="w-5 h-5" />
                      Red Flags ({dealData.redFlags.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      {dealData.redFlags.map((flag, idx) => (
                        <div key={idx} className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                          <div className="flex items-start gap-2 mb-2">
                            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                            <div className="min-w-0">
                              <h4 className="font-medium text-foreground">{flag.title}</h4>
                              <p className="text-sm text-muted-foreground italic mt-0.5">
                                "{flag.subtitle}"
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 space-y-2">
                            <div>
                              <p className="text-xs font-medium text-foreground mb-1">Why it matters:</p>
                              <p className="text-xs text-muted-foreground">{flag.why}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-foreground mb-1">Mitigation suggestion:</p>
                              <ul className="text-xs text-muted-foreground space-y-0.5">
                                {flag.mitigation.map((item, i) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <span className="text-muted-foreground/50 mt-0.5">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Questions to Ask */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-primary" />
                      Suggested Questions ({dealData.questions.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Based on AI analysis, ask the founders:</p>
                    <div className="space-y-4">
                      {dealData.questions.map((q, idx) => (
                        <div key={idx} className="pb-4 border-b last:border-b-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="text-sm font-medium text-foreground">
                              {idx + 1}. {q.category}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-1 text-primary hover:text-primary/80"
                              onClick={() => {
                                navigator.clipboard.writeText(q.question)
                                toast({ title: "Copied", description: "Question copied to clipboard." })
                              }}
                              type="button"
                              aria-label="Copy question"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">"{q.question}"</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => {
                          const text = dealData.questions.map((q, i) => `${i + 1}. [${q.category}] ${q.question}`).join("\n\n")
                          navigator.clipboard.writeText(text)
                          toast({ title: "Exported", description: "All questions copied to clipboard." })
                        }}
                        type="button"
                      >
                        Export All Questions
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => {
                          setAddToNotesContent(dealData.questions.map((q) => `• ${q.category}: ${q.question}`).join("\n"))
                          setAddToNotesSource("questions")
                          setAddToNotesOpen(true)
                        }}
                        type="button"
                      >
                        Add to Deal Notes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Benchmark Comparison */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        Benchmark Comparison
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        How {dealData.name} compares to similar companies
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast({ title: "Download started", description: "Benchmark comparison report is being generated." })}
                      type="button"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Compared to: Series A Fintech/SaaS companies (n=847)
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Metric</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">{dealData.name}</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Median</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Percentile</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dealData.benchmarks.map((item, idx) => (
                          <tr key={idx} className="border-b last:border-b-0">
                            <td className="py-3 px-4 text-sm text-foreground">{item.metric}</td>
                            <td className="text-right py-3 px-4 text-sm font-medium text-foreground">{item.company}</td>
                            <td className="text-right py-3 px-4 text-sm text-muted-foreground">{item.median}</td>
                            <td className="text-right py-3 px-4">
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-sm text-foreground">{item.percentile}</span>
                                {item.status === "good" && (
                                  <Badge variant="secondary" className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                                    🟢
                                  </Badge>
                                )}
                                {item.status === "neutral" && (
                                  <Badge variant="secondary" className="bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                                    🟡
                                  </Badge>
                                )}
                                {item.status === "bad" && (
                                  <Badge variant="secondary" className="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800">
                                    🔴
                                  </Badge>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 pt-4 border-t flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      🟢 Above median
                    </span>
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      🟡 At median
                    </span>
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      🔴 Below median
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Extracted Data */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Extracted Data
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Source: TechCorp_Pitch_Deck_v3.pdf (analyzed {dealData.lastAnalyzed})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Confidence: {dealData.confidence}% overall
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setEditExtractedOpen(true)} type="button">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Company Info */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3 flex items-center justify-between">
                      <span>Company Info</span>
                      <span className="text-xs text-muted-foreground">Confidence</span>
                    </h4>
                    <div className="space-y-2">
                      {dealData.extractedData.companyInfo.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground min-w-[120px]">{item.field}:</span>
                            <span className="text-foreground font-medium">{item.value}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={item.confidence} className="w-20 h-1.5" />
                            <span className="text-xs text-muted-foreground min-w-[35px] text-right">
                              {item.confidence}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Traction Metrics */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3 flex items-center justify-between">
                      <span>Traction Metrics</span>
                      <span className="text-xs text-muted-foreground">Confidence</span>
                    </h4>
                    <div className="space-y-2">
                      {dealData.extractedData.tractionMetrics.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground min-w-[120px]">{item.field}:</span>
                            <span className="text-foreground font-medium">{item.value}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={item.confidence} className="w-20 h-1.5" />
                            <span className="text-xs text-muted-foreground min-w-[35px] text-right">
                              {item.confidence}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fundraising */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3 flex items-center justify-between">
                      <span>Fundraising</span>
                      <span className="text-xs text-muted-foreground">Confidence</span>
                    </h4>
                    <div className="space-y-2">
                      {dealData.extractedData.fundraising.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground min-w-[120px]">{item.field}:</span>
                            <span className="text-foreground font-medium">{item.value}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={item.confidence} className="w-20 h-1.5" />
                            <span className="text-xs text-muted-foreground min-w-[35px] text-right">
                              {item.confidence}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm text-foreground">
                        3 fields need verification (yellow confidence)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Button variant="outline" size="sm" onClick={() => setVerifyConfirmOpen(true)} type="button">
                        Verify & Confirm
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast({ title: "Re-analysis requested", description: "AI will re-analyze extracted data. You'll be notified when complete." })}
                        type="button"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Request Re-analysis
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI-Generated Summary */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      AI-Generated Executive Summary
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setEditSummaryOpen(true)} type="button">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-foreground leading-relaxed">{dealData.summary.overview}</p>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Investment Thesis:</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {dealData.summary.thesis}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Key Risks:</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {dealData.summary.risks}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Recommendation:</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {dealData.summary.recommendation}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const fullSummary = [dealData.summary.overview, dealData.summary.thesis, dealData.summary.risks, dealData.summary.recommendation].join("\n\n")
                        navigator.clipboard.writeText(fullSummary)
                        toast({ title: "Copied", description: "Executive summary copied to clipboard." })
                      }}
                      type="button"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Summary
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAddToNotesContent([dealData.summary.overview, dealData.summary.thesis, dealData.summary.risks, dealData.summary.recommendation].join("\n\n"))
                        setAddToNotesSource("summary")
                        setAddToNotesOpen(true)
                      }}
                      type="button"
                    >
                      Add to Deal Notes
                    </Button>
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => setGenerateMemoOpen(true)}
                      type="button"
                      disabled={isGeneratingMemo}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Full Memo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
      
      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        currentTab="deal-intelligence"
        filters={{
          dateRange: "current",
          sectors: [],
          stages: [],
        }}
      />

      {/* Analyze New Deal */}
      <Dialog open={analyzeNewDealOpen} onOpenChange={setAnalyzeNewDealOpen}>
        <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Analyze new deal</DialogTitle>
            <DialogDescription>
              Add a deal to analyze. You can link an existing startup from the pipeline or upload documents.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-deal-name">Deal / startup name</Label>
              <Input id="new-deal-name" placeholder="e.g. TechCorp AI" className="bg-transparent" />
            </div>
            <div className="space-y-2">
              <Label>Source</Label>
              <Select defaultValue="pipeline">
                <SelectTrigger className="bg-transparent">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pipeline">From pipeline</SelectItem>
                  <SelectItem value="upload">Upload documents</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAnalyzeNewDealOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAnalyzeNewDealOpen(false); toast({ title: "Analysis started", description: "AI will analyze the deal. You'll be notified when complete." }); }}>Start analysis</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch Analysis */}
      <Dialog open={batchAnalysisOpen} onOpenChange={setBatchAnalysisOpen}>
        <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Batch analysis</DialogTitle>
            <DialogDescription>
              Run AI analysis on multiple deals at once. Select deals from your pipeline.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Deals to analyze</Label>
              <Select>
                <SelectTrigger className="bg-transparent">
                  <SelectValue placeholder="Select deals" />
                </SelectTrigger>
                <SelectContent>
                  {allDeals.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">You can select multiple. Analysis may take a few minutes.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBatchAnalysisOpen(false)}>Cancel</Button>
            <Button onClick={() => { setBatchAnalysisOpen(false); toast({ title: "Batch analysis started", description: "AI is analyzing selected deals. You'll be notified when complete." }); }}>Run batch analysis</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Compare Deals */}
      <Dialog open={compareDealsOpen} onOpenChange={(open) => { setCompareDealsOpen(open); if (!open) setCompareDealIds([]); }}>
        <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Compare deals</DialogTitle>
            <DialogDescription>
              Select two or more deals to view a side-by-side comparison of scores and metrics.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Deal 1</Label>
              <Select value={compareDealIds[0] ?? ""} onValueChange={(v) => setCompareDealIds((prev) => [v, prev[1] ?? ""].filter(Boolean))}>
                <SelectTrigger className="bg-transparent">
                  <SelectValue placeholder="Select deal" />
                </SelectTrigger>
                <SelectContent>
                  {allDeals.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name} ({d.score}/10)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Deal 2</Label>
              <Select value={compareDealIds[1] ?? ""} onValueChange={(v) => setCompareDealIds((prev) => [prev[0] ?? "", v].filter(Boolean))}>
                <SelectTrigger className="bg-transparent">
                  <SelectValue placeholder="Select deal" />
                </SelectTrigger>
                <SelectContent>
                  {allDeals.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name} ({d.score}/10)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompareDealsOpen(false)}>Cancel</Button>
            <Button
              disabled={!compareDealIds[0] || !compareDealIds[1]}
              onClick={() => {
                setCompareDealsOpen(false)
                toast({ title: "Comparison opened", description: "Viewing side-by-side comparison. (Full comparison view would open here.)" })
                setCompareDealIds([])
              }}
            >
              Compare
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Re-analyze confirmation */}
      <Dialog open={reanalyzeConfirmOpen} onOpenChange={setReanalyzeConfirmOpen}>
        <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Re-analyze deal?</DialogTitle>
            <DialogDescription>
              This will run the AI analysis again for {dealData.name} using the latest documents and criteria. Existing report will be updated. This may take a few minutes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReanalyzeConfirmOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                setReanalyzeConfirmOpen(false)
                setIsReanalyzing(true)
                setTimeout(() => {
                  setIsReanalyzing(false)
                  toast({ title: "Re-analysis complete", description: `${dealData.name} has been re-analyzed.` })
                }, 2000)
              }}
            >
              Re-analyze
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add to Deal Notes */}
      <Dialog open={addToNotesOpen} onOpenChange={(open) => { setAddToNotesOpen(open); if (!open) { setAddToNotesContent(""); setAddToNotesSource(null); } }}>
        <DialogContent className="max-w-lg" onCloseAutoFocus={(e) => e?.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Add to deal notes</DialogTitle>
            <DialogDescription>
              {addToNotesSource === "questions" ? "Suggested questions will be added to deal notes for " : "Executive summary will be added to deal notes for "}{dealData.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="deal-notes-content">Content</Label>
            <Textarea
              id="deal-notes-content"
              value={addToNotesContent}
              onChange={(e) => setAddToNotesContent(e.target.value)}
              rows={8}
              className="mt-2 resize-none bg-transparent"
              placeholder="Notes content..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setAddToNotesOpen(false); setAddToNotesContent(""); setAddToNotesSource(null); }}>Cancel</Button>
            <Button onClick={() => { setAddToNotesOpen(false); setAddToNotesContent(""); setAddToNotesSource(null); toast({ title: "Saved", description: "Content added to deal notes." }); }}>Save to notes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Extracted Data */}
      <Dialog open={editExtractedOpen} onOpenChange={setEditExtractedOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" onCloseAutoFocus={(e) => e?.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Edit extracted data</DialogTitle>
            <DialogDescription>
              Review and correct fields extracted from documents for {dealData.name}. Changes will be saved to the deal.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Company info, traction metrics, and fundraising fields can be edited here. In production, each field would be editable.
            </p>
            <div className="rounded-lg border p-4 bg-muted/30 text-sm text-muted-foreground">
              Editable fields: Company Name, Founded, Headquarters, Sector, Stage, ARR, MRR, MoM Growth, Customers, NRR, Raising, Pre-money, Use of Funds.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditExtractedOpen(false)}>Cancel</Button>
            <Button onClick={() => { setEditExtractedOpen(false); toast({ title: "Saved", description: "Extracted data updated." }); }}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verify & Confirm */}
      <Dialog open={verifyConfirmOpen} onOpenChange={setVerifyConfirmOpen}>
        <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Verify & confirm extracted data?</DialogTitle>
            <DialogDescription>
              Mark the current extracted data as verified for {dealData.name}. This will update the deal record and clear verification flags.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVerifyConfirmOpen(false)}>Cancel</Button>
            <Button onClick={() => { setVerifyConfirmOpen(false); toast({ title: "Verified", description: "Extracted data confirmed and saved." }); }}>Verify & confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Summary */}
      <Dialog open={editSummaryOpen} onOpenChange={setEditSummaryOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onCloseAutoFocus={(e) => e?.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Edit executive summary</DialogTitle>
            <DialogDescription>
              Refine the AI-generated summary for {dealData.name}. Your edits will be saved to the deal.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="summary-overview">Overview</Label>
              <Textarea id="summary-overview" defaultValue={dealData.summary.overview} rows={3} className="resize-none bg-transparent" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary-thesis">Investment thesis</Label>
              <Textarea id="summary-thesis" defaultValue={dealData.summary.thesis} rows={3} className="resize-none bg-transparent" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary-risks">Key risks</Label>
              <Textarea id="summary-risks" defaultValue={dealData.summary.risks} rows={2} className="resize-none bg-transparent" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary-recommendation">Recommendation</Label>
              <Textarea id="summary-recommendation" defaultValue={dealData.summary.recommendation} rows={2} className="resize-none bg-transparent" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSummaryOpen(false)}>Cancel</Button>
            <Button onClick={() => { setEditSummaryOpen(false); toast({ title: "Saved", description: "Executive summary updated." }); }}>Save summary</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Full Memo */}
      <Dialog open={generateMemoOpen} onOpenChange={setGenerateMemoOpen}>
        <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Generate full investment memo</DialogTitle>
            <DialogDescription>
              Create a full investment memo for {dealData.name} using the AI-generated summary and analysis. This may take a minute.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateMemoOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                setGenerateMemoOpen(false)
                setIsGeneratingMemo(true)
                setTimeout(() => {
                  setIsGeneratingMemo(false)
                  toast({ title: "Memo generated", description: "Investment memo is ready. Open from documents or activity." })
                }, 2500)
              }}
            >
              Generate memo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </ProtectedRoute>
  )
}

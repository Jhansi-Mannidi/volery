"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Sparkles,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Download,
  Settings,
  FileText,
  Bell,
  Target,
  Building2,
  DollarSign,
  BarChart3,
  Activity,
  Users,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
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

const trendingSectors = [
  {
    rank: 1,
    emoji: "🥇",
    sector: "AI/ML Infrastructure",
    dealFlow: "+34%",
    avgValuation: "₹85 Cr",
    stage: "Seed",
    trend: "hot",
    flames: 3,
  },
  {
    rank: 2,
    emoji: "🥈",
    sector: "Climate Tech",
    dealFlow: "+28%",
    avgValuation: "₹45 Cr",
    stage: "Seed",
    trend: "hot",
    flames: 2,
  },
  {
    rank: 3,
    emoji: "🥉",
    sector: "Digital Health",
    dealFlow: "+22%",
    avgValuation: "₹60 Cr",
    stage: "Seed",
    trend: "hot",
    flames: 2,
  },
  {
    rank: 4,
    emoji: "4",
    sector: "Embedded Finance",
    dealFlow: "+15%",
    avgValuation: "₹70 Cr",
    stage: "Seed",
    trend: "up",
    flames: 1,
  },
  {
    rank: 5,
    emoji: "5",
    sector: "D2C Brands",
    dealFlow: "+8%",
    avgValuation: "₹35 Cr",
    stage: "Seed",
    trend: "up",
    flames: 0,
  },
  {
    rank: 6,
    emoji: "6",
    sector: "EdTech",
    dealFlow: "-12%",
    avgValuation: "₹40 Cr",
    stage: "Seed",
    trend: "down",
    flames: 0,
  },
  {
    rank: 7,
    emoji: "7",
    sector: "Gaming",
    dealFlow: "-18%",
    avgValuation: "₹55 Cr",
    stage: "Seed",
    trend: "down",
    flames: 0,
  },
]

const valuationBenchmarks = [
  {
    stage: "Pre-Seed",
    medianVal: "₹8 Cr",
    arrMultiple: "N/A",
    changeQoQ: "+5%",
    positive: true,
  },
  {
    stage: "Seed",
    medianVal: "₹25 Cr",
    arrMultiple: "15-25x",
    changeQoQ: "-8%",
    positive: false,
  },
  {
    stage: "Series A",
    medianVal: "₹80 Cr",
    arrMultiple: "12-18x",
    changeQoQ: "-12%",
    positive: false,
  },
  {
    stage: "Series B",
    medianVal: "₹250 Cr",
    arrMultiple: "10-15x",
    changeQoQ: "-15%",
    positive: false,
  },
  {
    stage: "Series C+",
    medianVal: "₹600 Cr",
    arrMultiple: "8-12x",
    changeQoQ: "-18%",
    positive: false,
  },
]

const directCompetitors = [
  {
    name: "DocuAI",
    stage: "Series B",
    valuation: "₹450 Cr",
    customers: "200",
    threatLevel: "High",
    threatColor: "red",
    strength: "Enterprise sales, brand recognition",
    weakness: "Legacy tech, slow product iteration",
  },
  {
    name: "SmartDocs",
    stage: "Series A",
    valuation: "₹120 Cr",
    customers: "150",
    threatLevel: "Medium",
    threatColor: "yellow",
    strength: "Similar AI approach, aggressive pricing",
    weakness: "Smaller team, limited geography",
  },
]

const activeInvestors = [
  {
    rank: 1,
    name: "Sequoia Capital",
    deals: 12,
    sectors: "Fintech, SaaS",
    avgCheck: "₹35 Cr",
  },
  {
    rank: 2,
    name: "Accel Partners",
    deals: 10,
    sectors: "Consumer, Fintech",
    avgCheck: "₹28 Cr",
  },
  {
    rank: 3,
    name: "Peak XV",
    deals: 9,
    sectors: "SaaS, Healthcare",
    avgCheck: "₹40 Cr",
  },
  {
    rank: 4,
    name: "Lightspeed",
    deals: 8,
    sectors: "D2C, Fintech",
    avgCheck: "₹25 Cr",
  },
  {
    rank: 5,
    name: "Matrix Partners",
    deals: 7,
    sectors: "Fintech, Enterprise",
    avgCheck: "₹30 Cr",
  },
]

const marketAlerts = [
  {
    id: 1,
    title: "3 competitors raised funding this week",
    description: "DocuAI ($25M Series B), SmartDocs ($8M Series A)...",
    time: "2 hours ago",
    type: "competitor",
  },
  {
    id: 2,
    title: "Fintech valuations dropped 15% this month",
    description: "Based on 23 deals tracked. May affect TechCorp valuation.",
    time: "Yesterday",
    type: "valuation",
  },
  {
    id: 3,
    title: "New investor entered your sector: Tiger Global",
    description: "Made 2 investments in AI/Document processing.",
    time: "3 days ago",
    type: "investor",
  },
]

const alertSettings = [
  { id: 1, label: "Competitor funding rounds", checked: true },
  { id: 2, label: "Sector valuation changes (>10%)", checked: true },
  { id: 3, label: "New investors in tracked sectors", checked: true },
  { id: 4, label: "M&A activity in sector", checked: false },
]

export default function MarketIntelligencePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedTimeframe, setSelectedTimeframe] = useState("30")
  const [alerts, setAlerts] = useState(alertSettings)

  const [generateReportOpen, setGenerateReportOpen] = useState(false)
  const [generateReportScope, setGenerateReportScope] = useState("sectors")
  const [generateReportLoading, setGenerateReportLoading] = useState(false)
  const [setAlertsOpen, setSetAlertsOpen] = useState(false)
  const [sectorReportsOpen, setSectorReportsOpen] = useState(false)
  const [historicalTrendsOpen, setHistoricalTrendsOpen] = useState(false)
  const [downloadReportOpen, setDownloadReportOpen] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState("pdf")
  const [allCompetitorsOpen, setAllCompetitorsOpen] = useState(false)
  const [indirectAnalysisOpen, setIndirectAnalysisOpen] = useState(false)
  const [competitorReportOpen, setCompetitorReportOpen] = useState(false)
  const [competitorAlertsOpen, setCompetitorAlertsOpen] = useState(false)
  const [investorDeepDivesOpen, setInvestorDeepDivesOpen] = useState(false)
  const [newAlertOpen, setNewAlertOpen] = useState(false)
  const [alertDetailOpen, setAlertDetailOpen] = useState<typeof marketAlerts[0] | null>(null)
  const [manageAlertsOpen, setManageAlertsOpen] = useState(false)

  const handleAlertToggle = (id: number) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, checked: !alert.checked } : alert)))
  }


  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Market Intelligence" />

        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />

          <main className="flex-1 overflow-auto">
            <div className="min-h-full bg-background">
              {/* Header */}
              <div className="border-b bg-card">
                <div className="container mx-auto px-6 py-6">
                  {/* Breadcrumb */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Link href="/role-selection" className="hover:text-foreground transition-colors">
                      Home
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/ai-insights" className="hover:text-foreground transition-colors">
                      AI Insights
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-foreground">Market Intelligence</span>
                  </div>

                  {/* Title and Actions */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-6 h-6 text-primary" />
                        <h1 className="text-3xl font-bold text-foreground">Market Intelligence</h1>
                      </div>
                      <p className="text-muted-foreground">AI-powered market and competitive analysis</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" type="button" aria-label="Generate market report" onClick={() => setGenerateReportOpen(true)}>
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Report
                      </Button>
                      <Button variant="outline" size="sm" type="button" aria-label="Set market alerts" onClick={() => setSetAlertsOpen(true)}>
                        <Bell className="w-4 h-4 mr-2" />
                        Set Alerts
                      </Button>
                      <Button variant="outline" size="sm" type="button" aria-label="Market intelligence settings" onClick={() => router.push("/settings")}>
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="container mx-auto px-6 py-8">
                <div className="space-y-8">
                  {/* Market Overview Dashboard */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Trending Sectors */}
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            <CardTitle>Trending Sectors (Last {selectedTimeframe} Days)</CardTitle>
                          </div>
                          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="7">7 Days</SelectItem>
                              <SelectItem value="30">30 Days</SelectItem>
                              <SelectItem value="90">90 Days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left text-sm font-medium text-muted-foreground py-3 px-2">
                                  Rank
                                </th>
                                <th className="text-left text-sm font-medium text-muted-foreground py-3 px-2">
                                  Sector
                                </th>
                                <th className="text-left text-sm font-medium text-muted-foreground py-3 px-2">
                                  Deal Flow
                                </th>
                                <th className="text-left text-sm font-medium text-muted-foreground py-3 px-2">
                                  Avg Valuation
                                </th>
                                <th className="text-left text-sm font-medium text-muted-foreground py-3 px-2">
                                  Trend
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {trendingSectors.map((sector) => (
                                <tr key={sector.rank} className="border-b last:border-0">
                                  <td className="py-4 px-2">
                                    <span className="text-lg">{sector.emoji}</span>
                                  </td>
                                  <td className="py-4 px-2">
                                    <div className="font-medium text-foreground">{sector.sector}</div>
                                  </td>
                                  <td className="py-4 px-2">
                                    <div
                                      className={`font-medium ${
                                        sector.dealFlow.startsWith("+")
                                          ? "text-green-600 dark:text-green-400"
                                          : "text-red-600 dark:text-red-400"
                                      }`}
                                    >
                                      {sector.dealFlow}
                                    </div>
                                  </td>
                                  <td className="py-4 px-2">
                                    <div className="text-sm">
                                      <div className="font-medium text-foreground">{sector.avgValuation}</div>
                                      <div className="text-muted-foreground">({sector.stage})</div>
                                    </div>
                                  </td>
                                  <td className="py-4 px-2">
                                    <div className="flex items-center gap-1">
                                      {sector.trend === "hot" && (
                                        <>
                                          {Array.from({ length: sector.flames }).map((_, i) => (
                                            <Flame key={i} className="w-4 h-4 text-orange-500 fill-orange-500" />
                                          ))}
                                        </>
                                      )}
                                      {sector.trend === "up" && (
                                        <ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                                      )}
                                      {sector.trend === "down" && (
                                        <ArrowDownRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <Separator className="my-4" />
                        <Button variant="outline" className="w-full bg-transparent" type="button" onClick={() => setSectorReportsOpen(true)}>
                          View Detailed Sector Reports
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Valuation Benchmarks */}
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-primary" />
                          <CardTitle>Valuation Benchmarks by Stage</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left text-sm font-medium text-muted-foreground py-3 px-2">
                                  Stage
                                </th>
                                <th className="text-left text-sm font-medium text-muted-foreground py-3 px-2">
                                  Median Val
                                </th>
                                <th className="text-left text-sm font-medium text-muted-foreground py-3 px-2">
                                  ARR Multiple
                                </th>
                                <th className="text-left text-sm font-medium text-muted-foreground py-3 px-2">
                                  Change (QoQ)
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {valuationBenchmarks.map((benchmark, index) => (
                                <tr key={index} className="border-b last:border-0">
                                  <td className="py-4 px-2">
                                    <div className="font-medium text-foreground">{benchmark.stage}</div>
                                  </td>
                                  <td className="py-4 px-2">
                                    <div className="font-medium text-foreground">{benchmark.medianVal}</div>
                                  </td>
                                  <td className="py-4 px-2">
                                    <div className="text-sm text-muted-foreground">{benchmark.arrMultiple}</div>
                                  </td>
                                  <td className="py-4 px-2">
                                    <div
                                      className={`font-medium ${
                                        benchmark.positive
                                          ? "text-green-600 dark:text-green-400"
                                          : "text-red-600 dark:text-red-400"
                                      }`}
                                    >
                                      {benchmark.changeQoQ}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                          <div className="flex items-start gap-3">
                            <BarChart3 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-foreground mb-1">Market Insight</p>
                              <p className="text-sm text-muted-foreground">
                                Valuations have compressed 12% on average since Q3 2025. Series A and beyond seeing
                                steeper corrections.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" className="flex-1 bg-transparent" type="button" onClick={() => setHistoricalTrendsOpen(true)}>
                            View Historical Trends
                          </Button>
                          <Button variant="outline" className="flex-1 bg-transparent" type="button" onClick={() => setDownloadReportOpen(true)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download Report
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Competitive Analysis */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        <CardTitle>Competitive Analysis: TechCorp AI</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        AI identified 8 competitors in the document processing space:
                      </p>

                      {/* Direct Competitors */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-foreground">Direct Competitors ({directCompetitors.length})</h3>
                        {directCompetitors.map((competitor, index) => (
                          <Card key={index}>
                            <CardContent className="pt-6">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <Building2 className="w-10 h-10 text-primary" />
                                  <div>
                                    <h4 className="font-semibold text-foreground">{competitor.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {competitor.stage} • {competitor.valuation} val • {competitor.customers} customers
                                    </p>
                                  </div>
                                </div>
                                <Badge
                                  className={
                                    competitor.threatColor === "red"
                                      ? "bg-red-500/10 text-red-600 dark:text-red-400"
                                      : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                                  }
                                >
                                  Threat Level: {competitor.threatLevel}{" "}
                                  {competitor.threatColor === "red" ? "🔴" : "🟡"}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Strength</p>
                                  <p className="text-sm text-foreground">{competitor.strength}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Weakness</p>
                                  <p className="text-sm text-foreground">{competitor.weakness}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        <Button variant="outline" className="w-full bg-transparent" type="button" onClick={() => setAllCompetitorsOpen(true)}>
                          View All {directCompetitors.length} Direct Competitors
                        </Button>
                      </div>

                      {/* Indirect Competitors */}
                      <Card>
                        <CardContent className="pt-6">
                          <h3 className="font-semibold text-foreground mb-3">Indirect Competitors (4)</h3>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Traditional document management (DocuSign, Adobe)</li>
                            <li>• Horizontal AI platforms (OpenAI, Google)</li>
                          </ul>
                          <Button variant="outline" size="sm" className="mt-3 bg-transparent" type="button" onClick={() => setIndirectAnalysisOpen(true)}>
                            View Analysis
                          </Button>
                        </CardContent>
                      </Card>

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" className="flex-1 bg-transparent" type="button" onClick={() => setCompetitorReportOpen(true)}>
                          Generate Competitive Report
                        </Button>
                        <Button variant="outline" className="flex-1 bg-transparent" type="button" onClick={() => setCompetitorAlertsOpen(true)}>
                          <Bell className="w-4 h-4 mr-2" />
                          Set Competitor Alerts
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Investor Activity Insights */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        <CardTitle>Most Active Investors (Last 90 Days)</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left text-sm font-medium text-muted-foreground py-3 px-2">
                                Investor
                              </th>
                              <th className="text-left text-sm font-medium text-muted-foreground py-3 px-2">Deals</th>
                              <th className="text-left text-sm font-medium text-muted-foreground py-3 px-2">
                                Sectors
                              </th>
                              <th className="text-left text-sm font-medium text-muted-foreground py-3 px-2">
                                Avg Check
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeInvestors.map((investor) => (
                              <tr key={investor.rank} className="border-b last:border-0">
                                <td className="py-4 px-2">
                                    <Link href="/investors" className="font-medium text-foreground hover:text-primary hover:underline">
                                      {investor.rank}. {investor.name}
                                    </Link>
                                </td>
                                <td className="py-4 px-2">
                                    <div className="font-medium text-foreground">{investor.deals}</div>
                                </td>
                                <td className="py-4 px-2">
                                    <div className="text-sm text-muted-foreground">{investor.sectors}</div>
                                </td>
                                <td className="py-4 px-2">
                                  <div className="font-medium text-foreground">{investor.avgCheck}</div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-start gap-3">
                          <Activity className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-foreground mb-1">AI Insight</p>
                            <p className="text-sm text-muted-foreground">
                              Sequoia and Accel are actively deploying. Peak XV is being selective (only 2 new
                              investments vs 9 follow-ons).
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full mt-4 bg-transparent" type="button" onClick={() => setInvestorDeepDivesOpen(true)}>
                        View Investor Deal Flows
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Market Alerts */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="w-5 h-5 text-primary" />
                          <CardTitle>Market Alerts</CardTitle>
                        </div>
                        <Button size="sm" type="button" onClick={() => setNewAlertOpen(true)} aria-label="Create new alert">
                          <Plus className="w-4 h-4 mr-2" />
                          New Alert
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Recent Alerts */}
                      <div className="space-y-3">
                        {marketAlerts.map((alert) => (
                          <Card key={alert.id}>
                            <CardContent className="pt-6">
                              <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-foreground mb-1">{alert.title}</h4>
                                  <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                                  <div className="flex items-center justify-between">
                                    <Button variant="link" className="h-auto p-0 text-primary" type="button" onClick={() => setAlertDetailOpen(alert)}>
                                      View Details
                                    </Button>
                                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <Separator />

                      {/* Alert Settings */}
                      <div>
                        <h3 className="font-semibold text-foreground mb-3">Your Active Alerts:</h3>
                        <div className="space-y-3">
                          {alerts.map((alert) => (
                            <div key={alert.id} className="flex items-center gap-2">
                              <Checkbox
                                checked={alert.checked}
                                onCheckedChange={() => handleAlertToggle(alert.id)}
                                id={`alert-${alert.id}`}
                              />
                              <label
                                htmlFor={`alert-${alert.id}`}
                                className="text-sm text-foreground cursor-pointer"
                              >
                                {alert.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button variant="outline" className="w-full mt-4 bg-transparent" type="button" onClick={() => setManageAlertsOpen(true)}>
                        Manage Alerts
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Generate Report */}
      <Dialog open={generateReportOpen} onOpenChange={setGenerateReportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Market Report</DialogTitle>
            <DialogDescription>Choose scope and generate an AI-powered market intelligence report.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Report scope</Label>
              <Select value={generateReportScope} onValueChange={setGenerateReportScope}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sectors">Trending sectors only</SelectItem>
                  <SelectItem value="valuation">Valuation benchmarks only</SelectItem>
                  <SelectItem value="competition">Competition analysis only</SelectItem>
                  <SelectItem value="full">Full market report</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setGenerateReportOpen(false)}>Cancel</Button>
            <Button type="button" disabled={generateReportLoading} onClick={() => { setGenerateReportLoading(true); setTimeout(() => { setGenerateReportLoading(false); setGenerateReportOpen(false); toast({ title: "Report generated", description: "Your market report is ready." }); }, 1500); }}>
              {generateReportLoading ? "Generating…" : "Generate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Set Alerts */}
      <Dialog open={setAlertsOpen} onOpenChange={setSetAlertsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Set Market Alerts</DialogTitle>
            <DialogDescription>Choose which market events you want to be notified about.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center gap-2">
                <Checkbox checked={alert.checked} onCheckedChange={() => handleAlertToggle(alert.id)} id={`set-alert-${alert.id}`} />
                <label htmlFor={`set-alert-${alert.id}`} className="text-sm cursor-pointer">{alert.label}</label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setSetAlertsOpen(false)}>Cancel</Button>
            <Button type="button" onClick={() => { setSetAlertsOpen(false); toast({ title: "Alerts updated", description: "Your market alert preferences have been saved." }); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Detailed Sector Reports */}
      <Dialog open={sectorReportsOpen} onOpenChange={setSectorReportsOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detailed Sector Reports</DialogTitle>
            <DialogDescription>Select a sector to view its full report for the last {selectedTimeframe} days.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            {trendingSectors.map((s) => (
              <Button key={s.rank} variant="outline" className="w-full justify-start" type="button" onClick={() => { setSectorReportsOpen(false); toast({ title: s.sector, description: `Report for ${s.sector} (${s.dealFlow} deal flow, ${s.avgValuation} avg valuation).` }); }}>
                {s.emoji} {s.sector} — {s.dealFlow} · {s.avgValuation}
              </Button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setSectorReportsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Historical Trends */}
      <Dialog open={historicalTrendsOpen} onOpenChange={setHistoricalTrendsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Valuation Historical Trends</DialogTitle>
            <DialogDescription>View how median valuations and multiples have changed over time by stage.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2 text-sm text-muted-foreground">
            <p>Pre-Seed: ₹6 Cr → ₹8 Cr (last 4 quarters)</p>
            <p>Seed: ₹22 Cr → ₹25 Cr</p>
            <p>Series A: ₹75 Cr → ₹80 Cr</p>
            <p>Series B: ₹260 Cr → ₹250 Cr</p>
            <p>Series C+: ₹620 Cr → ₹600 Cr</p>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setHistoricalTrendsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Download Report */}
      <Dialog open={downloadReportOpen} onOpenChange={setDownloadReportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Download Report</DialogTitle>
            <DialogDescription>Choose format and download the valuation benchmarks report.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Format</Label>
              <Select value={downloadFormat} onValueChange={setDownloadFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setDownloadReportOpen(false)}>Cancel</Button>
            <Button type="button" onClick={() => { setDownloadReportOpen(false); toast({ title: "Download started", description: `Valuation report (${downloadFormat.toUpperCase()}) is downloading.` }); }}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* All Direct Competitors */}
      <Dialog open={allCompetitorsOpen} onOpenChange={setAllCompetitorsOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Direct Competitors</DialogTitle>
            <DialogDescription>All direct competitors for TechCorp AI in the document processing space.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {directCompetitors.map((c, i) => (
              <div key={i} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{c.name}</h4>
                  <Badge className={c.threatColor === "red" ? "bg-red-500/10 text-red-600" : "bg-yellow-500/10 text-yellow-600"}>{c.threatLevel}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{c.stage} · {c.valuation} · {c.customers} customers</p>
                <p className="text-xs mt-2"><span className="text-muted-foreground">Strength:</span> {c.strength}</p>
                <p className="text-xs"><span className="text-muted-foreground">Weakness:</span> {c.weakness}</p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setAllCompetitorsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Indirect Competitors Analysis */}
      <Dialog open={indirectAnalysisOpen} onOpenChange={setIndirectAnalysisOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Indirect Competitors Analysis</DialogTitle>
            <DialogDescription>Traditional document management and horizontal AI platforms.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3 text-sm">
            <p><strong>DocuSign, Adobe:</strong> Strong in signatures and PDF workflows; less focus on AI extraction.</p>
            <p><strong>OpenAI, Google:</strong> General-purpose AI; document-specific features are emerging.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setIndirectAnalysisOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Competitive Report */}
      <Dialog open={competitorReportOpen} onOpenChange={setCompetitorReportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Competitive Report</DialogTitle>
            <DialogDescription>Create a full competitive analysis report for TechCorp AI.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setCompetitorReportOpen(false)}>Cancel</Button>
            <Button type="button" onClick={() => { setCompetitorReportOpen(false); toast({ title: "Report generated", description: "Competitive report is ready." }); }}>Generate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Set Competitor Alerts */}
      <Dialog open={competitorAlertsOpen} onOpenChange={setCompetitorAlertsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Set Competitor Alerts</DialogTitle>
            <DialogDescription>Get notified when competitors raise funding, launch products, or show up in news.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label className="text-sm">Tracked competitors</Label>
            <p className="text-sm text-muted-foreground">DocuAI, SmartDocs — alerts are on for funding and product launches.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setCompetitorAlertsOpen(false)}>Cancel</Button>
            <Button type="button" onClick={() => { setCompetitorAlertsOpen(false); toast({ title: "Alerts saved", description: "Competitor alerts updated." }); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Investor Deal Flows / Deep Dives */}
      <Dialog open={investorDeepDivesOpen} onOpenChange={setInvestorDeepDivesOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Investor Deal Flows</DialogTitle>
            <DialogDescription>View deal activity and sectors for each active investor.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {activeInvestors.map((inv) => (
              <div key={inv.rank} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Link href="/investors" className="font-medium text-primary hover:underline">{inv.name}</Link>
                  <p className="text-sm text-muted-foreground">{inv.deals} deals · {inv.sectors}</p>
                </div>
                <span className="text-sm font-medium">{inv.avgCheck}</span>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setInvestorDeepDivesOpen(false)}>Close</Button>
            <Button type="button" onClick={() => { setInvestorDeepDivesOpen(false); router.push("/investors"); }}>View All Investors</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Alert */}
      <Dialog open={newAlertOpen} onOpenChange={setNewAlertOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Alert</DialogTitle>
            <DialogDescription>Set a custom market alert (sector, valuation change, or new investor).</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="alert-type">Alert type</Label>
              <Select defaultValue="sector">
                <SelectTrigger id="alert-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sector">Sector deal flow</SelectItem>
                  <SelectItem value="valuation">Valuation change</SelectItem>
                  <SelectItem value="investor">New investor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alert-threshold">Threshold / keyword</Label>
              <Input id="alert-threshold" placeholder="e.g. Fintech, 10%, Tiger Global" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setNewAlertOpen(false)}>Cancel</Button>
            <Button type="button" onClick={() => { setNewAlertOpen(false); toast({ title: "Alert created", description: "You will be notified when the criteria are met." }); }}>Create Alert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Detail */}
      <Dialog open={!!alertDetailOpen} onOpenChange={(open) => !open && setAlertDetailOpen(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{alertDetailOpen?.title}</DialogTitle>
            <DialogDescription>{alertDetailOpen?.time}</DialogDescription>
          </DialogHeader>
          {alertDetailOpen && (
            <div className="py-4">
              <p className="text-sm text-muted-foreground">{alertDetailOpen.description}</p>
              <p className="text-xs text-muted-foreground mt-2">Type: {alertDetailOpen.type}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setAlertDetailOpen(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Alerts */}
      <Dialog open={manageAlertsOpen} onOpenChange={setManageAlertsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Alerts</DialogTitle>
            <DialogDescription>Turn alerts on or off and set notification channels.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center gap-2">
                <Checkbox checked={alert.checked} onCheckedChange={() => handleAlertToggle(alert.id)} id={`manage-alert-${alert.id}`} />
                <label htmlFor={`manage-alert-${alert.id}`} className="text-sm cursor-pointer">{alert.label}</label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setManageAlertsOpen(false)}>Cancel</Button>
            <Button type="button" onClick={() => { setManageAlertsOpen(false); toast({ title: "Alerts updated", description: "Your alert preferences have been saved." }); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  )
}

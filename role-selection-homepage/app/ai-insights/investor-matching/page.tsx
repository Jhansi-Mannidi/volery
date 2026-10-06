"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Sparkles,
  ChevronRight,
  Settings,
  Download,
  TrendingUp,
  MapPin,
  DollarSign,
  Target,
  Building2,
  Users,
  Briefcase,
  Mail,
  ExternalLink,
  Check,
  AlertCircle,
  Filter,
  SlidersHorizontal,
  Network,
  Clock,
  Star,
  Send,
  FileText,
  BarChart3,
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"

const defaultWeights = {
  sector: 40,
  stage: 30,
  checkSize: 15,
  geography: 10,
  historical: 5,
}

export default function InvestorMatchingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedDeal, setSelectedDeal] = useState("techcorp")
  const [viewFilter, setViewFilter] = useState("all")
  const [sortBy, setSortBy] = useState("match")
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showOutreachModal, setShowOutreachModal] = useState(false)
  const [showNetworkModal, setShowNetworkModal] = useState(false)
  const [selectedInvestors, setSelectedInvestors] = useState<string[]>([])
  const [expandedCard, setExpandedCard] = useState<string | null>("sequoia")
  const [skippedInvestors, setSkippedInvestors] = useState<string[]>([])
  const [runMatchLoading, setRunMatchLoading] = useState(false)
  const [requestIntroInvestorId, setRequestIntroInvestorId] = useState<string | null>(null)
  const [skipConfirmInvestorId, setSkipConfirmInvestorId] = useState<string | null>(null)
  const [scheduleRefreshOpen, setScheduleRefreshOpen] = useState(false)
  const [compareManualOpen, setCompareManualOpen] = useState(false)

  // Match criteria weights
  const [weights, setWeights] = useState(defaultWeights)

  const deals = [
    { id: "techcorp", name: "TechCorp AI - Series A - ₹15 Cr" },
    { id: "finstart", name: "FinStart - Seed Round - ₹3 Cr" },
    { id: "healthtech", name: "HealthTech Plus - Series B - ₹50 Cr" },
  ]

  const matchSummary = {
    total: 47,
    excellent: 8,
    strong: 15,
    good: 18,
    fair: 6,
    warmIntros: 12,
  }

  const investors = [
    {
      id: "sequoia",
      name: "Sequoia Capital India",
      type: "Venture Capital",
      location: "Bangalore",
      matchScore: 94,
      matchTier: "excellent",
      avatar: "SC",
      matchBreakdown: {
        sector: { label: "Fintech, AI/ML", points: 40, matched: true },
        stage: { label: "Series A focus", points: 30, matched: true },
        checkSize: { label: "₹10-50 Cr range", points: 15, matched: true },
        geography: { label: "India-focused", points: 9, matched: true },
      },
      profile: {
        checkSize: "₹10 Cr - ₹100 Cr",
        sweetSpot: "₹25 Cr",
        focus: "Fintech, SaaS, Consumer Tech",
        recentDeals: ["Razorpay", "CRED", "Groww"],
        decisionMaker: "Rajan Anandan (Managing Director)",
        avgTimeline: "6 weeks",
      },
      whyMatch:
        "Sequoia has invested in 5 similar companies (AI+Fintech) in the last 18 months. Active in Series A. Quick decision maker (avg 6 weeks).",
      warmIntro: {
        available: true,
        path: "You → Priya Sharma (2 deals together) → Rajan Anandan",
      },
    },
    {
      id: "accel",
      name: "Accel Partners",
      type: "Venture Capital",
      location: "Bangalore",
      matchScore: 89,
      matchTier: "strong",
      avatar: "AP",
      matchBreakdown: {
        sector: { label: "Fintech, B2B SaaS", points: 40, matched: true },
        stage: { label: "Seed to Series B", points: 30, matched: true },
        checkSize: { label: "Slightly above range", points: 10, matched: false },
        geography: { label: "India + SEA", points: 9, matched: true },
      },
      profile: {
        recentDeals: ["Swiggy", "Flipkart", "Freshworks"],
        avgTimeline: "4-8 weeks",
      },
      note: "Currently selective (deploying final 20% of fund)",
      warmIntro: { available: false },
    },
    {
      id: "matrix",
      name: "Matrix Partners India",
      type: "Venture Capital",
      location: "Mumbai",
      matchScore: 85,
      matchTier: "strong",
      avatar: "MP",
      matchBreakdown: {
        sector: { label: "Fintech", points: 35, matched: true },
        stage: { label: "Series A specialist", points: 30, matched: true },
        checkSize: { label: "₹15-40 Cr", points: 15, matched: true },
        geography: { label: "Prefers Mumbai HQ", points: 5, matched: false },
      },
      profile: {
        recentDeals: ["Razorpay", "Ola", "Practo"],
      },
      warmIntro: {
        available: true,
        path: "Rahul Mehta (portfolio founder)",
      },
    },
    {
      id: "blume",
      name: "Blume Ventures",
      type: "Venture Capital",
      location: "Bangalore",
      matchScore: 78,
      matchTier: "good",
      avatar: "BV",
      matchBreakdown: {
        sector: { label: "Fintech, SaaS", points: 35, matched: true },
        stage: { label: "Prefers Seed/Pre-A", points: 20, matched: false },
        checkSize: { label: "Below typical range", points: 8, matched: false },
        geography: { label: "India focus", points: 15, matched: true },
      },
      note: "Usually invests earlier but has done Series A follow-ons",
      warmIntro: { available: false },
    },
  ]

  const toggleInvestorSelection = (id: string) => {
    setSelectedInvestors((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  // Criteria filters (Sector, Stage, Check Size, Geography) - optional narrow-down
  const [sectorFilter, setSectorFilter] = useState<string>("all")
  const [stageFilter, setStageFilter] = useState<string>("all")
  const [checkSizeFilter, setCheckSizeFilter] = useState<string>("all")
  const [geographyFilter, setGeographyFilter] = useState<string>("all")

  // Unique values for criteria dropdowns (from current investors' matchBreakdown)
  const criteriaOptions = useMemo(() => {
    const sector = new Set(investors.map((i) => i.matchBreakdown.sector.label))
    const stage = new Set(investors.map((i) => i.matchBreakdown.stage.label))
    const checkSize = new Set(investors.map((i) => i.matchBreakdown.checkSize.label))
    const geography = new Set(investors.map((i) => i.matchBreakdown.geography.label))
    return {
      sector: Array.from(sector).sort(),
      stage: Array.from(stage).sort(),
      checkSize: Array.from(checkSize).sort(),
      geography: Array.from(geography).sort(),
    }
  }, [investors])

  // Filter and sort the investor list
  const filteredAndSortedInvestors = useMemo(() => {
    let list = investors.filter((inv) => !skippedInvestors.includes(inv.id))

    // View filter (tier or warm intro)
    if (viewFilter === "excellent") list = list.filter((inv) => inv.matchTier === "excellent")
    else if (viewFilter === "strong") list = list.filter((inv) => inv.matchTier === "strong")
    else if (viewFilter === "good") list = list.filter((inv) => inv.matchTier === "good")
    else if (viewFilter === "fair") list = list.filter((inv) => inv.matchTier === "fair")
    else if (viewFilter === "warm") list = list.filter((inv) => inv.warmIntro?.available === true)

    // Criteria filters
    if (sectorFilter !== "all") list = list.filter((inv) => inv.matchBreakdown.sector.label === sectorFilter)
    if (stageFilter !== "all") list = list.filter((inv) => inv.matchBreakdown.stage.label === stageFilter)
    if (checkSizeFilter !== "all") list = list.filter((inv) => inv.matchBreakdown.checkSize.label === checkSizeFilter)
    if (geographyFilter !== "all") list = list.filter((inv) => inv.matchBreakdown.geography.label === geographyFilter)

    // Sort
    list = [...list].sort((a, b) => {
      if (sortBy === "match") return b.matchScore - a.matchScore
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "checksize") return (b.matchBreakdown.checkSize?.points ?? 0) - (a.matchBreakdown.checkSize?.points ?? 0)
      if (sortBy === "activity") return b.matchScore - a.matchScore
      return 0
    })

    return list
  }, [investors, skippedInvestors, viewFilter, sortBy, sectorFilter, stageFilter, checkSizeFilter, geographyFilter])

  const getMatchColor = (tier: string) => {
    switch (tier) {
      case "excellent":
        return "text-primary"
      case "strong":
        return "text-green-600 dark:text-green-400"
      case "good":
        return "text-yellow-600 dark:text-yellow-400"
      default:
        return "text-muted-foreground"
    }
  }

  const getMatchBadgeVariant = (tier: string) => {
    switch (tier) {
      case "excellent":
        return "default"
      case "strong":
        return "secondary"
      case "good":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        {/* Header */}
        <DashboardHeader title="Investor Matching" />

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <DashboardSidebar />

          {/* Content */}
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
                    <span className="text-foreground">Investor Matching</span>
                  </div>

                  {/* Title & Actions */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
                        <Sparkles className="w-8 h-8 text-primary" />
                        Investor Matching
                      </h1>
                      <p className="text-muted-foreground">
                        AI finds the perfect investors for your deals
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setRunMatchLoading(true)
                          setTimeout(() => {
                            setRunMatchLoading(false)
                            toast({ title: "Match complete", description: "New investor matches have been generated." })
                          }, 2000)
                        }}
                        disabled={runMatchLoading}
                        type="button"
                      >
                        <Target className={cn("w-4 h-4 mr-2", runMatchLoading && "animate-spin")} />
                        Run New Match
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSettingsModal(true)}
                        type="button"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Match Settings
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast({ title: "Export started", description: "Match results are being exported. You'll receive the file shortly." })}
                        type="button"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Results
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Deal Selection */}
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <Label htmlFor="deal-select" className="text-sm font-medium">
                            Find investors for:
                          </Label>
                          <Select value={selectedDeal} onValueChange={setSelectedDeal}>
                            <SelectTrigger id="deal-select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {deals.map((deal) => (
                                <SelectItem key={deal.id} value={deal.id}>
                                  <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    {deal.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              <span>Match Settings:</span>
                              <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-secondary/80" onClick={() => setShowSettingsModal(true)} role="button" tabIndex={0}>
                                <Check className="w-3 h-3" />
                                Sector
                              </Badge>
                              <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-secondary/80" onClick={() => setShowSettingsModal(true)} role="button" tabIndex={0}>
                                <Check className="w-3 h-3" />
                                Stage
                              </Badge>
                              <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-secondary/80" onClick={() => setShowSettingsModal(true)} role="button" tabIndex={0}>
                                <Check className="w-3 h-3" />
                                Check Size
                              </Badge>
                              <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-secondary/80" onClick={() => setShowSettingsModal(true)} role="button" tabIndex={0}>
                                <Check className="w-3 h-3" />
                                Geography
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs text-muted-foreground">Filter by:</span>
                              <Select value={sectorFilter} onValueChange={setSectorFilter}>
                                <SelectTrigger className="w-[160px] h-8 text-xs bg-transparent">
                                  <SelectValue placeholder="Sector" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All sectors</SelectItem>
                                  {criteriaOptions.sector.map((s) => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select value={stageFilter} onValueChange={setStageFilter}>
                                <SelectTrigger className="w-[160px] h-8 text-xs bg-transparent">
                                  <SelectValue placeholder="Stage" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All stages</SelectItem>
                                  {criteriaOptions.stage.map((s) => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select value={checkSizeFilter} onValueChange={setCheckSizeFilter}>
                                <SelectTrigger className="w-[160px] h-8 text-xs bg-transparent">
                                  <SelectValue placeholder="Check size" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All check sizes</SelectItem>
                                  {criteriaOptions.checkSize.map((s) => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select value={geographyFilter} onValueChange={setGeographyFilter}>
                                <SelectTrigger className="w-[160px] h-8 text-xs bg-transparent">
                                  <SelectValue placeholder="Geography" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All geographies</SelectItem>
                                  {criteriaOptions.geography.map((s) => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {(sectorFilter !== "all" || stageFilter !== "all" || checkSizeFilter !== "all" || geographyFilter !== "all") && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-xs"
                                  onClick={() => {
                                    setSectorFilter("all")
                                    setStageFilter("all")
                                    setCheckSizeFilter("all")
                                    setGeographyFilter("all")
                                  }}
                                  type="button"
                                >
                                  Clear filters
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Match Results Overview */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-primary" />
                          <CardTitle>Match Results for TechCorp AI</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            {filteredAndSortedInvestors.length === investors.filter((i) => !skippedInvestors.includes(i.id)).length
                              ? `Found ${filteredAndSortedInvestors.length} matching investors`
                              : `Showing ${filteredAndSortedInvestors.length} of ${investors.filter((i) => !skippedInvestors.includes(i.id)).length} investors`}
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                              <div className="text-2xl font-bold text-primary mb-1">
                                {matchSummary.excellent}
                              </div>
                              <div className="text-xs font-medium text-muted-foreground mb-1">
                                Excellent
                              </div>
                              <div className="text-xs text-muted-foreground">90%+</div>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                                {matchSummary.strong}
                              </div>
                              <div className="text-xs font-medium text-muted-foreground mb-1">
                                Strong
                              </div>
                              <div className="text-xs text-muted-foreground">80-89%</div>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                                {matchSummary.good}
                              </div>
                              <div className="text-xs font-medium text-muted-foreground mb-1">Good</div>
                              <div className="text-xs text-muted-foreground">70-79%</div>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-muted/50 border">
                              <div className="text-2xl font-bold text-muted-foreground mb-1">
                                {matchSummary.fair}
                              </div>
                              <div className="text-xs font-medium text-muted-foreground mb-1">Fair</div>
                              <div className="text-xs text-muted-foreground">60-69%</div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2">
                            <Button
                              variant={viewFilter === "all" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setViewFilter("all")}
                              type="button"
                            >
                              All ({matchSummary.total})
                            </Button>
                            <Button
                              variant={viewFilter === "excellent" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setViewFilter("excellent")}
                              type="button"
                            >
                              Excellent ({matchSummary.excellent})
                            </Button>
                            <Button
                              variant={viewFilter === "strong" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setViewFilter("strong")}
                              type="button"
                            >
                              Strong ({matchSummary.strong})
                            </Button>
                            <Button
                              variant={viewFilter === "good" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setViewFilter("good")}
                              type="button"
                            >
                              Good ({matchSummary.good})
                            </Button>
                            <Button
                              variant={viewFilter === "fair" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setViewFilter("fair")}
                              type="button"
                            >
                              Fair ({matchSummary.fair})
                            </Button>
                            <Button
                              variant={viewFilter === "warm" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setViewFilter("warm")}
                              type="button"
                            >
                              With Warm Intro ({matchSummary.warmIntros})
                            </Button>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                            <span className="text-sm text-muted-foreground">Sort by:</span>
                            <Select value={sortBy} onValueChange={setSortBy}>
                              <SelectTrigger className="w-[180px] h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="match">Match Score</SelectItem>
                                <SelectItem value="checksize">Check Size</SelectItem>
                                <SelectItem value="activity">Recent Activity</SelectItem>
                                <SelectItem value="name">Name</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Selected Investors Bar */}
                    {selectedInvestors.length > 0 && (
                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-medium">
                            {selectedInvestors.length} investor{selectedInvestors.length !== 1 ? "s" : ""}{" "}
                            selected
                          </span>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowOutreachModal(true)}
                              type="button"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Add to Outreach List
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setShowOutreachModal(true)} type="button">
                              <Mail className="w-4 h-4 mr-2" />
                              Send Deck
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toast({ title: "Export started", description: "Selected investors export started." })}
                              type="button"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Export
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedInvestors([])}
                              type="button"
                            >
                              Clear
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Investor Match Cards */}
                    <div className="space-y-4">
                      {filteredAndSortedInvestors.map((investor) => {
                        const isExpanded = expandedCard === investor.id
                        const isSelected = selectedInvestors.includes(investor.id)

                        return (
                          <Card
                            key={investor.id}
                            className={isSelected ? "border-primary shadow-sm" : ""}
                          >
                            <CardContent className="pt-6">
                              <div className="space-y-4">
                                {/* Header */}
                                <div className="flex items-start gap-4">
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() => toggleInvestorSelection(investor.id)}
                                  />
                                  <Avatar className="w-12 h-12 bg-primary/10">
                                    <AvatarFallback className="text-primary font-semibold">
                                      {investor.avatar}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4 mb-1">
                                      <div>
                                        <h3 className="font-semibold text-lg">{investor.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                          <span>{investor.type}</span>
                                          <span>•</span>
                                          <span className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {investor.location}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="text-right shrink-0">
                                        <div className="text-2xl font-bold mb-1 ${getMatchColor(investor.matchTier)}">
                                          {investor.matchScore}%
                                        </div>
                                        <Badge variant={getMatchBadgeVariant(investor.matchTier)}>
                                          {investor.matchTier.charAt(0).toUpperCase() +
                                            investor.matchTier.slice(1)}
                                        </Badge>
                                      </div>
                                    </div>
                                    <Progress value={investor.matchScore} className="h-2 mt-2" />
                                  </div>
                                </div>

                                {/* Expandable Details */}
                                {isExpanded && (
                                  <div className="space-y-4 pt-4 border-t">
                                    {/* Match Breakdown */}
                                    <div>
                                      <h4 className="font-medium text-sm mb-3">Match Breakdown:</h4>
                                      <div className="space-y-2">
                                        {Object.entries(investor.matchBreakdown).map(([key, value]) => (
                                          <div
                                            key={key}
                                            className="flex items-center justify-between text-sm"
                                          >
                                            <div className="flex items-center gap-2">
                                              {value.matched ? (
                                                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                                              ) : (
                                                <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                                              )}
                                              <span className="capitalize">
                                                {key.replace(/([A-Z])/g, " $1").trim()}
                                              </span>
                                              <span className="text-muted-foreground">{value.label}</span>
                                            </div>
                                            <span className="text-muted-foreground">+{value.points} pts</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Investor Profile */}
                                    {investor.profile && (
                                      <div>
                                        <h4 className="font-medium text-sm mb-3">Investor Profile:</h4>
                                        <div className="space-y-2 text-sm text-muted-foreground">
                                          {investor.profile.checkSize && (
                                            <div className="flex items-start gap-2">
                                              <DollarSign className="w-4 h-4 mt-0.5" />
                                              <span>
                                                Check Size: {investor.profile.checkSize}
                                                {investor.profile.sweetSpot &&
                                                  ` (Sweet spot: ${investor.profile.sweetSpot})`}
                                              </span>
                                            </div>
                                          )}
                                          {investor.profile.focus && (
                                            <div className="flex items-start gap-2">
                                              <Target className="w-4 h-4 mt-0.5" />
                                              <span>Focus: {investor.profile.focus}</span>
                                            </div>
                                          )}
                                          {investor.profile.recentDeals && (
                                            <div className="flex items-start gap-2">
                                              <Briefcase className="w-4 h-4 mt-0.5" />
                                              <span>
                                                Recent Deals: {investor.profile.recentDeals.join(", ")}
                                              </span>
                                            </div>
                                          )}
                                          {investor.profile.decisionMaker && (
                                            <div className="flex items-start gap-2">
                                              <Users className="w-4 h-4 mt-0.5" />
                                              <span>Decision Maker: {investor.profile.decisionMaker}</span>
                                            </div>
                                          )}
                                          {investor.profile.avgTimeline && (
                                            <div className="flex items-start gap-2">
                                              <Clock className="w-4 h-4 mt-0.5" />
                                              <span>Decision Timeline: {investor.profile.avgTimeline}</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Why This Match */}
                                    {investor.whyMatch && (
                                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                                        <div className="flex items-start gap-2">
                                          <Star className="w-4 h-4 text-primary mt-0.5" />
                                          <div>
                                            <p className="text-sm font-medium text-foreground mb-1">
                                              Why This Match:
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                              {investor.whyMatch}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Note */}
                                    {investor.note && (
                                      <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                                        <div className="flex items-start gap-2">
                                          <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                                          <p className="text-sm text-muted-foreground">{investor.note}</p>
                                        </div>
                                      </div>
                                    )}

                                    {/* Warm Intro */}
                                    {investor.warmIntro?.available && (
                                      <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                                        <div className="flex items-start justify-between gap-4">
                                          <div className="flex items-start gap-2">
                                            <Network className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
                                            <div>
                                              <p className="text-sm font-medium text-foreground mb-1">
                                                Warm Intro Path Available:
                                              </p>
                                              <p className="text-sm text-muted-foreground">
                                                {investor.warmIntro.path}
                                              </p>
                                            </div>
                                          </div>
                                          <Button size="sm" variant="outline" onClick={() => setRequestIntroInvestorId(investor.id)} type="button">
                                            Request Intro
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Actions */}
                                <div className="flex flex-wrap gap-2 pt-4 border-t">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setExpandedCard(isExpanded ? null : investor.id)}
                                    type="button"
                                  >
                                    {isExpanded ? "Show Less" : "View Full Profile"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      if (!selectedInvestors.includes(investor.id)) {
                                        setSelectedInvestors((prev) => [...prev, investor.id])
                                      }
                                      setShowOutreachModal(true)
                                    }}
                                    type="button"
                                  >
                                    <Send className="w-4 h-4 mr-2" />
                                    Add to Outreach
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedInvestors([investor.id])
                                      setShowOutreachModal(true)
                                    }}
                                    type="button"
                                  >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Send Deck
                                  </Button>
                                  {!isExpanded && (
                                    <Button size="sm" variant="ghost" onClick={() => setSkipConfirmInvestorId(investor.id)} type="button">
                                      Skip
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>

                  {/* Right Sidebar */}
                  <div className="space-y-6">
                    {/* Match Statistics */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Match Statistics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Total investors matched</span>
                            <span className="font-semibold">{matchSummary.total}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Excellent matches (90%+)</span>
                            <span className="font-semibold text-primary">{matchSummary.excellent}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">With warm intros</span>
                            <span className="font-semibold">{matchSummary.warmIntros}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Already contacted</span>
                            <span className="font-semibold">3</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Warm Intro Network */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Network className="w-5 h-5 text-primary" />
                          <CardTitle className="text-base">Warm Intro Network</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Your network can connect you to {matchSummary.warmIntros} matched investors
                          </p>
                          <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                            <div className="text-center">
                              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-2">
                                JD
                              </div>
                              <p className="text-xs font-medium">You</p>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {["Priya S.", "Rahul M.", "Amit P."].map((name) => (
                                <div key={name} className="text-center">
                                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs font-medium mb-1">
                                    {name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </div>
                                  <p className="text-xs text-muted-foreground">{name}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full bg-transparent"
                          onClick={() => setShowNetworkModal(true)}
                        >
                          View Full Network Map
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Similar Deals */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Similar Deals</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            Companies like TechCorp AI that successfully raised
                          </p>
                          <div className="space-y-2">
                            {[
                              { name: "FinAI Solutions", raised: "₹18 Cr", investors: "Sequoia, Accel" },
                              { name: "PayTech Pro", raised: "₹12 Cr", investors: "Matrix, Blume" },
                            ].map((deal) => (
                              <div
                                key={deal.name}
                                className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-sm">{deal.name}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {deal.raised}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{deal.investors}</p>
                              </div>
                            ))}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => { router.push("/pipeline"); toast({ title: "Opening pipeline", description: "View similar deals that successfully raised." }); }}
                            type="button"
                          >
                            Learn from Successful Matches
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full justify-start bg-transparent"
                            onClick={() => toast({ title: "Export started", description: "Match list CSV is being generated." })}
                            type="button"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Export match list (CSV)
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full justify-start bg-transparent"
                            onClick={() => setScheduleRefreshOpen(true)}
                            type="button"
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            Schedule matching refresh
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full justify-start bg-transparent"
                            onClick={() => setCompareManualOpen(true)}
                            type="button"
                          >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Compare with manual list
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Match Settings Modal */}
              <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onCloseAutoFocus={(e) => e?.preventDefault()}>
                  <DialogHeader>
                    <DialogTitle>Customize Match Criteria</DialogTitle>
                    <DialogDescription>Adjust how AI weights different matching criteria for this deal.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <p className="text-sm text-muted-foreground">
                      Adjust how AI weights different matching criteria:
                    </p>

                    <div className="space-y-6">
                      {Object.entries(weights).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()} Alignment
                            </Label>
                            <span className="text-sm font-semibold">{value}%</span>
                          </div>
                          <Slider
                            value={[value]}
                            onValueChange={([newValue]) =>
                              setWeights((prev) => ({ ...prev, [key]: newValue }))
                            }
                            min={0}
                            max={50}
                            step={5}
                            className="py-2"
                          />
                          <p className="text-xs text-muted-foreground">
                            {key === "sector" && "Higher = stricter sector matching"}
                            {key === "stage" && "Higher = only exact stage matches"}
                            {key === "checkSize" && "Higher = stricter check size matching"}
                            {key === "geography" && "Higher = only local investors"}
                            {key === "historical" && "Factor in investor's track record"}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <Label>Additional Filters:</Label>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="active-funds" defaultChecked />
                          <label
                            htmlFor="active-funds"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Include only actively deploying funds
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="warm-intro" defaultChecked />
                          <label
                            htmlFor="warm-intro"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Prioritize investors with warm intro paths
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="international" />
                          <label
                            htmlFor="international"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Include international investors
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="corporate" />
                          <label
                            htmlFor="corporate"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Include corporate VCs
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="family" />
                          <label
                            htmlFor="family"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Include family offices
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                      <Label htmlFor="min-score">Minimum Match Score: 70%</Label>
                      <Slider id="min-score" defaultValue={[70]} min={50} max={90} step={5} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowSettingsModal(false)} type="button">
                      Cancel
                    </Button>
                    <Button variant="outline" onClick={() => setWeights(defaultWeights)} type="button">
                      Reset to Default
                    </Button>
                    <Button
                      onClick={() => {
                        setShowSettingsModal(false)
                        toast({ title: "Criteria applied", description: "Re-running match with new criteria." })
                      }}
                      type="button"
                    >
                      Apply & Re-match
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Outreach Modal */}
              <Dialog open={showOutreachModal} onOpenChange={setShowOutreachModal}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onCloseAutoFocus={(e) => e?.preventDefault()}>
                  <DialogHeader>
                    <DialogTitle>Send Deck to Selected Investors</DialogTitle>
                    <DialogDescription>Compose and send your pitch deck to the selected investors.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Sending to: {selectedInvestors.length} investors
                      </Label>
                      <div className="space-y-1">
                        {selectedInvestors.map((id) => {
                          const investor = investors.find((inv) => inv.id === id)
                          return (
                            <div key={id} className="text-sm text-muted-foreground">
                              • {investor?.name}
                              {investor?.profile?.decisionMaker &&
                                ` (${investor.profile.decisionMaker.split("(")[0].trim()})`}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                      <Label>Email Template:</Label>
                      <Select defaultValue="ai-suggested">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ai-suggested">AI-Suggested Template</SelectItem>
                          <SelectItem value="formal">Formal Template</SelectItem>
                          <SelectItem value="casual">Casual Template</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-subject">Subject:</Label>
                      <input
                        id="email-subject"
                        type="text"
                        defaultValue="TechCorp AI - Series A Opportunity"
                        className="w-full px-3 py-2 rounded-md border bg-background text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-body">Message:</Label>
                      <Textarea
                        id="email-body"
                        rows={8}
                        defaultValue={`Hi {investor_name},\n\nI wanted to share an exciting Series A opportunity that matches your investment focus in Fintech and AI...\n\nBest regards,`}
                        className="resize-none"
                      />
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <Label>Attachments:</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="pitch-deck" defaultChecked />
                          <label
                            htmlFor="pitch-deck"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            TechCorp_AI_Pitch_Deck.pdf
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="financial" />
                          <label
                            htmlFor="financial"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            TechCorp_AI_Financial_Model.xlsx
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="one-pager" />
                          <label
                            htmlFor="one-pager"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            TechCorp_AI_One_Pager.pdf
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="tracking" defaultChecked />
                        <label
                          htmlFor="tracking"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Enable email tracking (opens, clicks)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="personalize" defaultChecked />
                        <label
                          htmlFor="personalize"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Personalize greeting for each investor
                        </label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowOutreachModal(false)} type="button">
                      Cancel
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => toast({ title: "Preview", description: "Email preview would open in a new tab." })}
                      type="button"
                    >
                      Preview Email
                    </Button>
                    <Button
                      onClick={() => {
                        setShowOutreachModal(false)
                        toast({ title: "Sent", description: `Deck sent to ${selectedInvestors.length} investor${selectedInvestors.length !== 1 ? "s" : ""}.` })
                      }}
                      type="button"
                    >
                      Send to {selectedInvestors.length} Investor
                      {selectedInvestors.length !== 1 ? "s" : ""}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Network Map Modal */}
              <Dialog open={showNetworkModal} onOpenChange={setShowNetworkModal}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" onCloseAutoFocus={(e) => e?.preventDefault()}>
                  <DialogHeader>
                    <DialogTitle>Network Map - Warm Introduction Paths</DialogTitle>
                    <DialogDescription>View and request introductions through your network.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-sm text-muted-foreground">
                        This network map shows potential warm introduction paths to target investors through your existing connections.
                      </p>
                    </div>

                    {/* Network Visualization */}
                    <div className="space-y-4">
                      {investors
                        .filter((inv) => inv.warmIntro?.available)
                        .map((investor) => (
                          <Card key={investor.id}>
                            <CardContent className="pt-6">
                              <div className="flex items-start gap-4">
                                <Avatar className="w-12 h-12">
                                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                    {investor.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-foreground">{investor.name}</h3>
                                    <Badge className="bg-primary/10 text-primary">
                                      {investor.matchScore}% Match
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-3">{investor.type}</p>

                                  {/* Introduction Path */}
                                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                                    <Network className="w-4 h-4 text-primary flex-shrink-0" />
                                    <div className="flex items-center gap-2 text-sm flex-wrap">
                                      <span className="font-medium text-foreground">You</span>
                                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                      <span className="text-muted-foreground">
                                        {investor.warmIntro?.path?.split(" → ")[1] || "Your Connection"}
                                      </span>
                                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                      <span className="font-medium text-primary">
                                        {investor.warmIntro?.path?.split(" → ")[2] || investor.name}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex gap-2 mt-3">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="bg-transparent"
                                      onClick={() => { setShowNetworkModal(false); setRequestIntroInvestorId(investor.id); }}
                                      type="button"
                                    >
                                      <Mail className="w-4 h-4 mr-2" />
                                      Request Intro
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="bg-transparent"
                                      onClick={() => { setShowNetworkModal(false); router.push("/investors"); }}
                                      type="button"
                                    >
                                      <ExternalLink className="w-4 h-4 mr-2" />
                                      View Profile
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">
                          {investors.filter((inv) => inv.warmIntro?.available).length}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Warm Paths Available</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">2.1</p>
                        <p className="text-xs text-muted-foreground mt-1">Avg. Degrees of Separation</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">15</p>
                        <p className="text-xs text-muted-foreground mt-1">Your Total Connections</p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowNetworkModal(false)} type="button">
                      Close
                    </Button>
                    <Button
                      onClick={() => { setShowNetworkModal(false); toast({ title: "Export started", description: "Network data export started." }); }}
                      type="button"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Network Data
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Skip confirmation */}
              <Dialog open={!!skipConfirmInvestorId} onOpenChange={(open) => !open && setSkipConfirmInvestorId(null)}>
                <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
                  <DialogHeader>
                    <DialogTitle>Skip this investor?</DialogTitle>
                    <DialogDescription>
                      {investors.find((i) => i.id === skipConfirmInvestorId)?.name ?? "This investor"} will be removed from this match list. You can run a new match later to see them again.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setSkipConfirmInvestorId(null)} type="button">Cancel</Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (skipConfirmInvestorId) {
                          setSkippedInvestors((prev) => [...prev, skipConfirmInvestorId])
                          setExpandedCard((prev) => (prev === skipConfirmInvestorId ? null : prev))
                          setSelectedInvestors((prev) => prev.filter((id) => id !== skipConfirmInvestorId))
                          setSkipConfirmInvestorId(null)
                          toast({ title: "Skipped", description: "Investor removed from this match list.", variant: "destructive" })
                        }
                      }}
                      type="button"
                    >
                      Skip
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Request Intro modal */}
              <Dialog open={!!requestIntroInvestorId} onOpenChange={(open) => !open && setRequestIntroInvestorId(null)}>
                <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
                  <DialogHeader>
                    <DialogTitle>Request introduction</DialogTitle>
                    <DialogDescription>
                      Send a request to your connection to introduce you to {investors.find((i) => i.id === requestIntroInvestorId)?.name ?? "this investor"}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="intro-message" className="text-sm font-medium">
                      Message (optional)
                    </Label>
                    <Textarea
                      id="intro-message"
                      placeholder="Add a short note for your connection..."
                      rows={3}
                      className="mt-2 resize-none bg-transparent"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setRequestIntroInvestorId(null)} type="button">Cancel</Button>
                    <Button
                      onClick={() => {
                        setRequestIntroInvestorId(null)
                        toast({ title: "Request sent", description: "Introduction request sent to your connection." })
                      }}
                      type="button"
                    >
                      Request intro
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Schedule matching refresh */}
              <Dialog open={scheduleRefreshOpen} onOpenChange={setScheduleRefreshOpen}>
                <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
                  <DialogHeader>
                    <DialogTitle>Schedule matching refresh</DialogTitle>
                    <DialogDescription>
                      Run investor matching automatically on a schedule for {deals.find((d) => d.id === selectedDeal)?.name ?? "selected deal"}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Select defaultValue="weekly">
                        <SelectTrigger className="bg-transparent">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setScheduleRefreshOpen(false)} type="button">Cancel</Button>
                    <Button
                      onClick={() => {
                        setScheduleRefreshOpen(false)
                        toast({ title: "Schedule saved", description: "Matching refresh has been scheduled." })
                      }}
                      type="button"
                    >
                      Save schedule
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Compare with manual list */}
              <Dialog open={compareManualOpen} onOpenChange={setCompareManualOpen}>
                <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
                  <DialogHeader>
                    <DialogTitle>Compare with manual list</DialogTitle>
                    <DialogDescription>
                      Upload or paste a list of investor names to compare with AI match results. Overlaps and gaps will be highlighted.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="manual-list" className="text-sm font-medium">
                      Investor names (one per line)
                    </Label>
                    <Textarea
                      id="manual-list"
                      placeholder="Sequoia Capital\nAccel Partners\n..."
                      rows={6}
                      className="mt-2 resize-none bg-transparent"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCompareManualOpen(false)} type="button">Cancel</Button>
                    <Button
                      onClick={() => {
                        setCompareManualOpen(false)
                        toast({ title: "Comparison complete", description: "Overlap report would open. (Demo: no file uploaded.)" })
                      }}
                      type="button"
                    >
                      Compare
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Toaster />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

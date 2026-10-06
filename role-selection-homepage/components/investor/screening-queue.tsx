"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  Filter,
  Keyboard,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  X,
  XCircle,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Mock screening deals data for institutional investors
const screeningDeals = [
  {
    id: "1",
    name: "TalentFlow",
    tagline: "AI-powered talent acquisition platform",
    sector: "HR SaaS",
    stage: "Series A",
    seeking: "15 Cr",
    source: "Warm Referral",
    sourceDetail: "via Sequoia",
    matchScore: 92,
    dateAdded: "2024-01-20",
    daysInQueue: 5,
    checklist: {
      thesisFit: true,
      deckReviewed: true,
      deckTime: 8,
      metricsValidated: false,
      teamBackgroundCheck: false,
      initialCallScheduled: false,
    },
    aiRecommendation: "ADVANCE",
    aiConfidence: 85,
    aiReason: "Strong metrics, fits thesis, warm referral from trusted source",
    metrics: {
      arr: "4.2 Cr",
      growth: "25% MoM",
      nrr: "125%",
    },
    team: {
      founders: 2,
      employees: 45,
      background: "Ex-Google, Ex-Microsoft",
    },
  },
  {
    id: "2",
    name: "CloudSecure",
    tagline: "Enterprise security automation",
    sector: "Cybersecurity",
    stage: "Series A",
    seeking: "20 Cr",
    source: "AI Matched",
    sourceDetail: "95% fit score",
    matchScore: 95,
    dateAdded: "2024-01-18",
    daysInQueue: 7,
    checklist: {
      thesisFit: true,
      deckReviewed: true,
      deckTime: 12,
      metricsValidated: true,
      teamBackgroundCheck: false,
      initialCallScheduled: false,
    },
    aiRecommendation: "ADVANCE",
    aiConfidence: 92,
    aiReason: "Exceptional product-market fit, enterprise traction, strong founder background",
    metrics: {
      arr: "8.5 Cr",
      growth: "30% MoM",
      nrr: "140%",
    },
    team: {
      founders: 3,
      employees: 72,
      background: "Ex-Palo Alto, Ex-CrowdStrike",
    },
  },
  {
    id: "3",
    name: "GreenLogistics",
    tagline: "Sustainable last-mile delivery",
    sector: "Logistics",
    stage: "Seed",
    seeking: "8 Cr",
    source: "Cold Inbound",
    sourceDetail: "Applied via website",
    matchScore: 68,
    dateAdded: "2024-01-22",
    daysInQueue: 3,
    checklist: {
      thesisFit: false,
      deckReviewed: true,
      deckTime: 5,
      metricsValidated: false,
      teamBackgroundCheck: false,
      initialCallScheduled: false,
    },
    aiRecommendation: "PASS",
    aiConfidence: 72,
    aiReason: "Outside core thesis, early stage for fund mandate, limited differentiation",
    metrics: {
      arr: "45 L",
      growth: "15% MoM",
      nrr: "95%",
    },
    team: {
      founders: 2,
      employees: 18,
      background: "First-time founders",
    },
  },
  {
    id: "4",
    name: "FinanceAI",
    tagline: "AI-powered financial planning",
    sector: "Fintech",
    stage: "Series A",
    seeking: "12 Cr",
    source: "Warm Referral",
    sourceDetail: "via Accel",
    matchScore: 88,
    dateAdded: "2024-01-19",
    daysInQueue: 6,
    checklist: {
      thesisFit: true,
      deckReviewed: true,
      deckTime: 10,
      metricsValidated: true,
      teamBackgroundCheck: true,
      initialCallScheduled: false,
    },
    aiRecommendation: "ADVANCE",
    aiConfidence: 88,
    aiReason: "Strong unit economics, experienced team, clear path to profitability",
    metrics: {
      arr: "6.2 Cr",
      growth: "22% MoM",
      nrr: "118%",
    },
    team: {
      founders: 2,
      employees: 55,
      background: "Ex-Razorpay, Ex-Paytm",
    },
  },
  {
    id: "5",
    name: "HealthTrack",
    tagline: "Remote patient monitoring platform",
    sector: "Healthcare",
    stage: "Seed",
    seeking: "6 Cr",
    source: "AI Matched",
    sourceDetail: "82% fit score",
    matchScore: 82,
    dateAdded: "2024-01-21",
    daysInQueue: 4,
    checklist: {
      thesisFit: true,
      deckReviewed: false,
      deckTime: 0,
      metricsValidated: false,
      teamBackgroundCheck: false,
      initialCallScheduled: false,
    },
    aiRecommendation: "REVIEW",
    aiConfidence: 65,
    aiReason: "Interesting space, needs deeper metrics review before decision",
    metrics: {
      arr: "1.8 Cr",
      growth: "18% MoM",
      nrr: "105%",
    },
    team: {
      founders: 3,
      employees: 25,
      background: "Ex-Practo, Medical backgrounds",
    },
  },
  {
    id: "6",
    name: "EduNext",
    tagline: "B2B corporate learning platform",
    sector: "EdTech",
    stage: "Series A",
    seeking: "18 Cr",
    source: "Cold Inbound",
    sourceDetail: "LinkedIn outreach",
    matchScore: 75,
    dateAdded: "2024-01-17",
    daysInQueue: 8,
    checklist: {
      thesisFit: true,
      deckReviewed: true,
      deckTime: 7,
      metricsValidated: false,
      teamBackgroundCheck: false,
      initialCallScheduled: false,
    },
    aiRecommendation: "REQUEST_INFO",
    aiConfidence: 58,
    aiReason: "Good traction but need updated financials and customer references",
    metrics: {
      arr: "5.5 Cr",
      growth: "12% MoM",
      nrr: "110%",
    },
    team: {
      founders: 2,
      employees: 40,
      background: "Ex-Coursera, Ex-Udemy",
    },
  },
]

const passReasons = [
  { value: "thesis", label: "Outside investment thesis" },
  { value: "stage", label: "Stage mismatch" },
  { value: "metrics", label: "Insufficient traction/metrics" },
  { value: "market", label: "Market size concerns" },
  { value: "competition", label: "Competitive landscape" },
  { value: "team", label: "Team concerns" },
  { value: "timing", label: "Bad timing" },
  { value: "other", label: "Other" },
]

type SortBy = "date" | "match" | "source"
type FilterSector = "all" | "fintech" | "saas" | "healthcare" | "edtech" | "logistics" | "cybersecurity"
type FilterStage = "all" | "seed" | "series-a"
type FilterSource = "all" | "ai-matched" | "referral" | "cold"

export function InvestorScreeningQueue() {
  const router = useRouter()
  const [sortBy, setSortBy] = useState<SortBy>("match")
  const [filterSector, setFilterSector] = useState<FilterSector>("all")
  const [filterStage, setFilterStage] = useState<FilterStage>("all")
  const [filterSource, setFilterSource] = useState<FilterSource>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDeals, setSelectedDeals] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [batchMode, setBatchMode] = useState(false)
  const [passModalOpen, setPassModalOpen] = useState(false)
  const [passReason, setPassReason] = useState("")
  const [passFeedback, setPassFeedback] = useState("")
  const [dealToPass, setDealToPass] = useState<string | null>(null)
  const [showShortcuts, setShowShortcuts] = useState(false)

  // Filter and sort deals
  const filteredDeals = screeningDeals
    .filter((deal) => {
      if (searchQuery && !deal.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      if (filterSector !== "all" && !deal.sector.toLowerCase().includes(filterSector)) {
        return false
      }
      if (filterStage !== "all") {
        const stageMap: Record<string, string> = { seed: "Seed", "series-a": "Series A" }
        if (deal.stage !== stageMap[filterStage]) return false
      }
      if (filterSource !== "all") {
        const sourceMap: Record<string, string> = {
          "ai-matched": "AI Matched",
          referral: "Warm Referral",
          cold: "Cold Inbound",
        }
        if (deal.source !== sourceMap[filterSource]) return false
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === "match") return b.matchScore - a.matchScore
      if (sortBy === "date") return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      return a.source.localeCompare(b.source)
    })

  // Keyboard shortcuts for batch screening
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!batchMode || filteredDeals.length === 0) return

      const currentDeal = filteredDeals[currentIndex]
      if (!currentDeal) return

      if (e.key === "y" || e.key === "Y") {
        // Advance
        console.log("[v0] Advancing deal:", currentDeal.name)
        if (currentIndex < filteredDeals.length - 1) {
          setCurrentIndex((prev) => prev + 1)
        }
      } else if (e.key === "n" || e.key === "N") {
        // Pass
        setDealToPass(currentDeal.id)
        setPassModalOpen(true)
      } else if (e.key === "s" || e.key === "S") {
        // Skip
        if (currentIndex < filteredDeals.length - 1) {
          setCurrentIndex((prev) => prev + 1)
        }
      } else if (e.key === "Escape") {
        setBatchMode(false)
      }
    },
    [batchMode, currentIndex, filteredDeals]
  )

  useEffect(() => {
    if (batchMode) {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [batchMode, handleKeyDown])

  const toggleDealSelection = (id: string) => {
    setSelectedDeals((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    )
  }

  const handlePass = (dealId: string) => {
    setDealToPass(dealId)
    setPassModalOpen(true)
  }

  const confirmPass = () => {
    console.log("[v0] Passing deal:", dealToPass, "Reason:", passReason, "Feedback:", passFeedback)
    setPassModalOpen(false)
    setPassReason("")
    setPassFeedback("")
    setDealToPass(null)
    if (batchMode && currentIndex < filteredDeals.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const getChecklistProgress = (checklist: typeof screeningDeals[0]["checklist"]) => {
    const total = 5
    const completed = [
      checklist.thesisFit,
      checklist.deckReviewed,
      checklist.metricsValidated,
      checklist.teamBackgroundCheck,
      checklist.initialCallScheduled,
    ].filter(Boolean).length
    return { completed, total, percentage: (completed / total) * 100 }
  }

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "ADVANCE":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "PASS":
        return "bg-red-500/10 text-red-600 border-red-500/20"
      case "REVIEW":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      case "REQUEST_INFO":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Screening Queue</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredDeals.length} deals awaiting review
          </p>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("gap-2 bg-transparent", batchMode && "bg-primary text-primary-foreground")}
                  onClick={() => {
                    setBatchMode(!batchMode)
                    setCurrentIndex(0)
                  }}
                >
                  <Keyboard className="w-4 h-4" />
                  {batchMode ? "Exit Batch Mode" : "Batch Review"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Use keyboard shortcuts: Y (Advance), N (Pass), S (Skip)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowShortcuts(true)}
          >
            <Keyboard className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Batch Mode Progress */}
      {batchMode && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  Batch Mode Active
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Reviewing: <span className="font-medium text-foreground">{filteredDeals[currentIndex]?.name}</span>
                </span>
              </div>
              <span className="text-sm font-medium">
                {currentIndex + 1} / {filteredDeals.length}
              </span>
            </div>
            <Progress value={((currentIndex + 1) / filteredDeals.length) * 100} className="h-2" />
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Y</kbd> Advance
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">N</kbd> Pass
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">S</kbd> Skip
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Esc</kbd> Exit
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search deals..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">Match Score</SelectItem>
              <SelectItem value="date">Date Added</SelectItem>
              <SelectItem value="source">Source</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterSector} onValueChange={(v) => setFilterSector(v as FilterSector)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              <SelectItem value="fintech">Fintech</SelectItem>
              <SelectItem value="saas">SaaS</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="edtech">EdTech</SelectItem>
              <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStage} onValueChange={(v) => setFilterStage(v as FilterStage)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="seed">Seed</SelectItem>
              <SelectItem value="series-a">Series A</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterSource} onValueChange={(v) => setFilterSource(v as FilterSource)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="ai-matched">AI Matched</SelectItem>
              <SelectItem value="referral">Referrals</SelectItem>
              <SelectItem value="cold">Cold Inbound</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Deal Cards */}
      <div className="space-y-4">
        {filteredDeals.map((deal, index) => {
          const progress = getChecklistProgress(deal.checklist)
          const isHighlighted = batchMode && index === currentIndex

          return (
            <Card
              key={deal.id}
              className={cn(
                "transition-all",
                isHighlighted && "ring-2 ring-primary shadow-lg",
                selectedDeals.includes(deal.id) && "bg-muted/30"
              )}
            >
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left: Company Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedDeals.includes(deal.id)}
                        onCheckedChange={() => toggleDealSelection(deal.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg">{deal.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {deal.sector}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {deal.stage}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{deal.tagline}</p>

                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <span className="flex items-center gap-1.5">
                            <TrendingUp className="w-4 h-4 text-muted-foreground" />
                            {deal.metrics.arr} ARR
                          </span>
                          <span className="flex items-center gap-1.5 text-green-600">
                            +{deal.metrics.growth}
                          </span>
                          <span className="text-muted-foreground">
                            Seeking: {deal.seeking}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              deal.source === "AI Matched"
                                ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                                : deal.source === "Warm Referral"
                                ? "bg-green-500/10 text-green-600 border-green-500/20"
                                : "bg-muted"
                            )}
                          >
                            {deal.source === "AI Matched" && <Sparkles className="w-3 h-3 mr-1" />}
                            {deal.source}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{deal.sourceDetail}</span>
                          <span className="text-xs text-muted-foreground">
                            {deal.daysInQueue} days in queue
                          </span>
                        </div>
                      </div>

                      {/* Match Score */}
                      <div className="text-center">
                        <div
                          className={cn(
                            "w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold",
                            deal.matchScore >= 90
                              ? "bg-green-500/10 text-green-600"
                              : deal.matchScore >= 75
                              ? "bg-yellow-500/10 text-yellow-600"
                              : "bg-red-500/10 text-red-600"
                          )}
                        >
                          {deal.matchScore}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Match</p>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Screening Checklist */}
                  <div className="lg:w-64 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium">Screening Checklist</h4>
                      <span className="text-xs text-muted-foreground">
                        {progress.completed}/{progress.total}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        {deal.checklist.thesisFit ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                        )}
                        <span className={deal.checklist.thesisFit ? "text-foreground" : "text-muted-foreground"}>
                          Thesis fit verified
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {deal.checklist.deckReviewed ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                        )}
                        <span className={deal.checklist.deckReviewed ? "text-foreground" : "text-muted-foreground"}>
                          Deck reviewed {deal.checklist.deckTime > 0 && `(${deal.checklist.deckTime} min)`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {deal.checklist.metricsValidated ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                        )}
                        <span className={deal.checklist.metricsValidated ? "text-foreground" : "text-muted-foreground"}>
                          Metrics validated
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {deal.checklist.teamBackgroundCheck ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                        )}
                        <span className={deal.checklist.teamBackgroundCheck ? "text-foreground" : "text-muted-foreground"}>
                          Team background check
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {deal.checklist.initialCallScheduled ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                        )}
                        <span className={deal.checklist.initialCallScheduled ? "text-foreground" : "text-muted-foreground"}>
                          Initial call scheduled
                        </span>
                      </div>
                    </div>
                    <Progress value={progress.percentage} className="h-1.5 mt-3" />
                  </div>

                  {/* Right: AI Recommendation & Actions */}
                  <div className="lg:w-72 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-6">
                    {/* AI Recommendation */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium">AI Recommendation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRecommendationColor(deal.aiRecommendation)}>
                          {deal.aiRecommendation.replace("_", " ")}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          ({deal.aiConfidence}% confidence)
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        "{deal.aiReason}"
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={() => handlePass(deal.id)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Pass
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        Request Info
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Schedule Call
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => router.push(`/deals/${deal.id}`)}
                      >
                        <ArrowRight className="w-4 h-4 mr-1" />
                        Advance
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pass Modal */}
      <Dialog open={passModalOpen} onOpenChange={setPassModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pass on Deal</DialogTitle>
            <DialogDescription>
              Please select a reason for passing on this deal. This helps improve our matching.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Reason for passing *</Label>
              <Select value={passReason} onValueChange={setPassReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {passReasons.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Feedback for founder (optional)</Label>
              <Textarea
                placeholder="Add constructive feedback that can help the founder..."
                value={passFeedback}
                onChange={(e) => setPassFeedback(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                This feedback will be shared with the founder if they request it.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPassModalOpen(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button onClick={confirmPass} disabled={!passReason}>
              Confirm Pass
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Keyboard Shortcuts Modal */}
      <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogDescription>
              Use these shortcuts in Batch Mode for faster screening
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div className="flex items-center justify-between">
              <span>Advance deal to next stage</span>
              <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Y</kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Pass on deal</span>
              <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">N</kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Skip to next deal</span>
              <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">S</kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Exit batch mode</span>
              <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Esc</kbd>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowShortcuts(false)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Loading from "./loading" // Import the loading component
import {
  Sparkles,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Send,
  Calendar,
  Bookmark,
  MoreHorizontal,
  Building2,
  Users,
  ArrowRightLeft,
  Filter,
  Search,
  Clock,
  TrendingUp,
  Target,
  MapPin,
  DollarSign,
  Briefcase,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Eye,
  Mail,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { DealsForMeFeed } from "@/components/deals-for-me/deals-for-me-feed"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Toaster } from "@/components/ui/toaster"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { exportToCsv } from "@/lib/export-utils"

// Types
type MatchStatus =
  | "not_contacted"
  | "contacted"
  | "responded_interested"
  | "responded_passed"
  | "meeting_scheduled"
  | "in_discussion"

interface MatchFactor {
  name: string
  score: number
  matched: boolean
}

interface InvestorMatch {
  id: string
  name: string
  type: string
  stages: string
  checkSize: string
  location: string
  score: number
  factors: MatchFactor[]
  reasoning: string
  status: MatchStatus
  lastContact?: string
}

interface StartupWithMatches {
  id: string
  name: string
  sector: string
  stage: string
  raising: string
  matches: InvestorMatch[]
  totalMatches: number
}

// Status configuration
const statusConfig: Record<
  MatchStatus,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  not_contacted: {
    label: "Not Contacted",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    borderColor: "border-muted",
  },
  contacted: {
    label: "Contacted",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  responded_interested: {
    label: "Interested",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
  },
  responded_passed: {
    label: "Passed",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
  },
  meeting_scheduled: {
    label: "Meeting Scheduled",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
  in_discussion: {
    label: "In Discussion",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
  },
}

// Mock data
const mockStartupsWithMatches: StartupWithMatches[] = [
  {
    id: "1",
    name: "TechCorp AI",
    sector: "Fintech",
    stage: "Seed",
    raising: "$2M",
    totalMatches: 12,
    matches: [
      {
        id: "inv1",
        name: "Sequoia Capital",
        type: "VC",
        stages: "Series A-C",
        checkSize: "$5M-$50M",
        location: "San Francisco, CA",
        score: 92,
        factors: [
          { name: "Stage Match", score: 100, matched: true },
          { name: "Sector Match", score: 95, matched: true },
          { name: "Check Size", score: 90, matched: true },
          { name: "Geography", score: 85, matched: true },
          { name: "Thesis Alignment", score: 88, matched: true },
          { name: "Portfolio Fit", score: 75, matched: false },
        ],
        reasoning:
          "Sequoia has invested in 3 similar fintech companies and recently announced focus on AI-powered financial tools. Their portfolio includes complementary companies that could provide synergies.",
        status: "not_contacted",
      },
      {
        id: "inv2",
        name: "Accel Partners",
        type: "VC",
        stages: "Seed-Series B",
        checkSize: "$2M-$20M",
        location: "Palo Alto, CA",
        score: 87,
        factors: [
          { name: "Stage Match", score: 95, matched: true },
          { name: "Sector Match", score: 90, matched: true },
          { name: "Check Size", score: 85, matched: true },
          { name: "Geography", score: 80, matched: true },
          { name: "Thesis Alignment", score: 82, matched: true },
          { name: "Portfolio Fit", score: 70, matched: false },
        ],
        reasoning:
          "Accel has a strong fintech practice and has been actively investing in AI startups. Their recent fund has a specific allocation for seed-stage fintech.",
        status: "contacted",
        lastContact: "2024-01-15",
      },
      {
        id: "inv3",
        name: "Andreessen Horowitz",
        type: "VC",
        stages: "Seed-Growth",
        checkSize: "$1M-$100M",
        location: "Menlo Park, CA",
        score: 85,
        factors: [
          { name: "Stage Match", score: 90, matched: true },
          { name: "Sector Match", score: 88, matched: true },
          { name: "Check Size", score: 95, matched: true },
          { name: "Geography", score: 82, matched: true },
          { name: "Thesis Alignment", score: 78, matched: false },
          { name: "Portfolio Fit", score: 72, matched: false },
        ],
        reasoning:
          "a16z has made several investments in the AI/ML space and has dedicated crypto and fintech funds. Strong platform support for portfolio companies.",
        status: "responded_interested",
        lastContact: "2024-01-18",
      },
      {
        id: "inv4",
        name: "Y Combinator",
        type: "Accelerator",
        stages: "Pre-Seed/Seed",
        checkSize: "$500K",
        location: "Mountain View, CA",
        score: 82,
        factors: [
          { name: "Stage Match", score: 100, matched: true },
          { name: "Sector Match", score: 85, matched: true },
          { name: "Check Size", score: 70, matched: false },
          { name: "Geography", score: 90, matched: true },
          { name: "Thesis Alignment", score: 80, matched: true },
          { name: "Portfolio Fit", score: 68, matched: false },
        ],
        reasoning:
          "YC has a strong track record with fintech companies and provides excellent network access. Batch timing aligns well with company timeline.",
        status: "meeting_scheduled",
        lastContact: "2024-01-20",
      },
      {
        id: "inv5",
        name: "Index Ventures",
        type: "VC",
        stages: "Seed-Series B",
        checkSize: "$3M-$25M",
        location: "London, UK",
        score: 79,
        factors: [
          { name: "Stage Match", score: 88, matched: true },
          { name: "Sector Match", score: 82, matched: true },
          { name: "Check Size", score: 85, matched: true },
          { name: "Geography", score: 65, matched: false },
          { name: "Thesis Alignment", score: 76, matched: false },
          { name: "Portfolio Fit", score: 78, matched: false },
        ],
        reasoning:
          "Index has expanded their US presence and has a strong fintech portfolio in Europe. Could provide strategic value for international expansion.",
        status: "responded_passed",
        lastContact: "2024-01-10",
      },
    ],
  },
  {
    id: "2",
    name: "HealthBridge",
    sector: "HealthTech",
    stage: "Series A",
    raising: "$8M",
    totalMatches: 8,
    matches: [
      {
        id: "inv6",
        name: "General Catalyst",
        type: "VC",
        stages: "Seed-Growth",
        checkSize: "$5M-$100M",
        location: "Boston, MA",
        score: 94,
        factors: [
          { name: "Stage Match", score: 98, matched: true },
          { name: "Sector Match", score: 96, matched: true },
          { name: "Check Size", score: 92, matched: true },
          { name: "Geography", score: 88, matched: true },
          { name: "Thesis Alignment", score: 90, matched: true },
          { name: "Portfolio Fit", score: 82, matched: true },
        ],
        reasoning:
          "General Catalyst has a dedicated health practice with deep expertise in digital health. Their Health Assurance initiative aligns perfectly with HealthBridge mission.",
        status: "in_discussion",
        lastContact: "2024-01-19",
      },
      {
        id: "inv7",
        name: "Khosla Ventures",
        type: "VC",
        stages: "Seed-Series B",
        checkSize: "$2M-$30M",
        location: "Menlo Park, CA",
        score: 88,
        factors: [
          { name: "Stage Match", score: 92, matched: true },
          { name: "Sector Match", score: 90, matched: true },
          { name: "Check Size", score: 88, matched: true },
          { name: "Geography", score: 85, matched: true },
          { name: "Thesis Alignment", score: 85, matched: true },
          { name: "Portfolio Fit", score: 78, matched: false },
        ],
        reasoning:
          "Khosla has been aggressive in digital health investing. Partner network includes healthcare executives who could provide strategic guidance.",
        status: "contacted",
        lastContact: "2024-01-16",
      },
    ],
  },
  {
    id: "3",
    name: "GreenCharge",
    sector: "CleanTech",
    stage: "Pre-Seed",
    raising: "$1.5M",
    totalMatches: 6,
    matches: [
      {
        id: "inv8",
        name: "Breakthrough Energy Ventures",
        type: "VC",
        stages: "Seed-Growth",
        checkSize: "$5M-$50M",
        location: "Boston, MA",
        score: 91,
        factors: [
          { name: "Stage Match", score: 85, matched: true },
          { name: "Sector Match", score: 98, matched: true },
          { name: "Check Size", score: 80, matched: true },
          { name: "Geography", score: 88, matched: true },
          { name: "Thesis Alignment", score: 95, matched: true },
          { name: "Portfolio Fit", score: 90, matched: true },
        ],
        reasoning:
          "BEV focuses exclusively on climate tech and has deep expertise in energy storage. Their technical advisory board could provide invaluable guidance.",
        status: "not_contacted",
      },
      {
        id: "inv9",
        name: "Lowercarbon Capital",
        type: "VC",
        stages: "Pre-Seed-Series A",
        checkSize: "$500K-$10M",
        location: "San Francisco, CA",
        score: 89,
        factors: [
          { name: "Stage Match", score: 95, matched: true },
          { name: "Sector Match", score: 96, matched: true },
          { name: "Check Size", score: 90, matched: true },
          { name: "Geography", score: 85, matched: true },
          { name: "Thesis Alignment", score: 88, matched: true },
          { name: "Portfolio Fit", score: 80, matched: true },
        ],
        reasoning:
          "Lowercarbon specifically targets climate tech at early stages. Their portfolio has several EV infrastructure companies that could be strategic partners.",
        status: "not_contacted",
      },
    ],
  },
]

// Components
function MatchScoreBadge({ score }: { score: number }) {
  const getScoreStyle = (score: number) => {
    if (score >= 90) return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
    if (score >= 80) return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
    if (score >= 70) return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
    return "bg-muted text-muted-foreground border-muted"
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center w-14 h-14 rounded-xl border-2 font-bold text-lg",
        getScoreStyle(score)
      )}
    >
      {score}%
    </div>
  )
}

function MatchFactorBar({ factor }: { factor: MatchFactor }) {
  const getBarColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500"
    if (score >= 60) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div className="flex items-center gap-2">
      {factor.matched ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
      ) : (
        <XCircle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      )}
      <span className="text-xs text-muted-foreground w-24 shrink-0">{factor.name}</span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", getBarColor(factor.score))}
          style={{ width: `${factor.score}%` }}
        />
      </div>
      <span className="text-xs font-medium w-8 text-right">{factor.score}%</span>
    </div>
  )
}

function StatusBadge({ status }: { status: MatchStatus }) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border",
        config.bgColor,
        config.color,
        config.borderColor
      )}
    >
      {config.label}
    </span>
  )
}

// Similar Past Deals data
const similarPastDeals = [
  {
    id: "spd1",
    startup: "PayFlow",
    investor: "Sequoia Capital",
    amount: "$12M",
    stage: "Series A",
    sector: "Fintech",
    outcome: "successful",
    notes: "Led to successful Series B within 18 months",
  },
  {
    id: "spd2",
    startup: "LendAI",
    investor: "Accel Partners",
    amount: "$5M",
    stage: "Seed",
    sector: "Fintech",
    outcome: "successful",
    notes: "Strong board support, pivoted to B2B successfully",
  },
  {
    id: "spd3",
    startup: "CryptoBank",
    investor: "a16z",
    amount: "$8M",
    stage: "Series A",
    sector: "Fintech",
    outcome: "in_progress",
    notes: "Currently scaling in APAC markets",
  },
]

// Match Detail Modal Component
function MatchDetailModal({
  match,
  startup,
  isOpen,
  onClose,
  onSaveMatch,
  onStartOutreach,
  isSaved = false,
}: {
  match: InvestorMatch | null
  startup: StartupWithMatches | null
  isOpen: boolean
  onClose: () => void
  onSaveMatch?: (match: InvestorMatch) => void
  onStartOutreach?: (match: InvestorMatch, startup: StartupWithMatches) => void
  isSaved?: boolean
}) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"comparison" | "factors" | "talking_points" | "similar_deals">("comparison")

  if (!match || !startup) return null

  const talkingPoints = [
    {
      category: "Investment Thesis Alignment",
      points: [
        `${match.name} has invested in ${Math.floor(Math.random() * 5) + 3} similar ${startup.sector} companies`,
        `Their portfolio companies have seen average 3.2x growth in this sector`,
        `Recent fund allocation shows increased focus on ${startup.sector.toLowerCase()} startups`,
      ],
    },
    {
      category: "Team & Traction",
      points: [
        `Highlight the founding team's ${Math.floor(Math.random() * 10) + 5}+ years of industry experience`,
        `Emphasize the ${Math.floor(Math.random() * 50) + 20}% MoM growth rate`,
        `Mention key partnerships and pilot programs with enterprise clients`,
      ],
    },
    {
      category: "Market Opportunity",
      points: [
        `TAM of $${Math.floor(Math.random() * 50) + 10}B with strong tailwinds`,
        `Regulatory changes creating new opportunities in this space`,
        `Competitive moat through proprietary technology/data`,
      ],
    },
    {
      category: "Ask & Use of Funds",
      points: [
        `${startup.raising} round to achieve 18-month runway`,
        `Primary allocation: 60% engineering, 25% sales, 15% ops`,
        `Target milestones: Series A readiness within 12 months`,
      ],
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <button onClick={() => onClose()} className="focus:outline-none">
                <MatchScoreBadge score={match.score} />
              </button>
              <div>
                <DialogTitle className="text-xl">
                  {startup.name} + {match.name}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Full match analysis and recommendations
                </DialogDescription>
              </div>
            </div>
            <StatusBadge status={match.status} />
          </div>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b py-2">
          <button
            onClick={() => setActiveTab("comparison")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              activeTab === "comparison"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <ArrowRightLeft className="w-4 h-4 inline mr-1.5" />
            Comparison
          </button>
          <button
            onClick={() => setActiveTab("factors")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              activeTab === "factors"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Target className="w-4 h-4 inline mr-1.5" />
            Match Factors
          </button>
          <button
            onClick={() => setActiveTab("talking_points")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              activeTab === "talking_points"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <MessageCircle className="w-4 h-4 inline mr-1.5" />
            Talking Points
          </button>
          <button
            onClick={() => setActiveTab("similar_deals")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              activeTab === "similar_deals"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Briefcase className="w-4 h-4 inline mr-1.5" />
            Similar Deals
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* Comparison Tab */}
          {activeTab === "comparison" && (
            <div className="grid grid-cols-2 gap-6">
              {/* Startup Side */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{startup.name}</h3>
                    <p className="text-sm text-muted-foreground">Startup</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-dashed">
                    <span className="text-sm text-muted-foreground">Sector</span>
                    <Badge variant="secondary">{startup.sector}</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dashed">
                    <span className="text-sm text-muted-foreground">Stage</span>
                    <span className="text-sm font-medium">{startup.stage}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dashed">
                    <span className="text-sm text-muted-foreground">Raising</span>
                    <span className="text-sm font-medium">{startup.raising}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dashed">
                    <span className="text-sm text-muted-foreground">Location</span>
                    <span className="text-sm font-medium">San Francisco, CA</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dashed">
                    <span className="text-sm text-muted-foreground">Founded</span>
                    <span className="text-sm font-medium">2022</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dashed">
                    <span className="text-sm text-muted-foreground">Team Size</span>
                    <span className="text-sm font-medium">12 employees</span>
                  </div>
                </div>
              </div>

              {/* Investor Side */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{match.name}</h3>
                    <p className="text-sm text-muted-foreground">{match.type}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-dashed">
                    <span className="text-sm text-muted-foreground">Focus Sectors</span>
                    <Badge variant="secondary">{startup.sector}</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dashed">
                    <span className="text-sm text-muted-foreground">Target Stages</span>
                    <span className="text-sm font-medium">{match.stages}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dashed">
                    <span className="text-sm text-muted-foreground">Check Size</span>
                    <span className="text-sm font-medium">{match.checkSize}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dashed">
                    <span className="text-sm text-muted-foreground">Location</span>
                    <span className="text-sm font-medium">{match.location}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dashed">
                    <span className="text-sm text-muted-foreground">Portfolio Size</span>
                    <span className="text-sm font-medium">150+ companies</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dashed">
                    <span className="text-sm text-muted-foreground">Active Partners</span>
                    <span className="text-sm font-medium">8 partners</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Match Factors Tab */}
          {activeTab === "factors" && (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="bg-muted/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Overall Match Score</h3>
                  <div className={cn(
                    "text-3xl font-bold",
                    match.score >= 90 ? "text-emerald-500" :
                    match.score >= 80 ? "text-blue-500" :
                    match.score >= 70 ? "text-amber-500" : "text-muted-foreground"
                  )}>
                    {match.score}%
                  </div>
                </div>
                <Progress value={match.score} className="h-3" />
              </div>

              {/* Individual Factors */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Factor Breakdown</h3>
                <div className="space-y-3">
                  {match.factors.map((factor) => (
                    <div key={factor.name} className="bg-card border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {factor.matched ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-muted-foreground" />
                          )}
                          <span className="font-medium text-foreground">{factor.name}</span>
                        </div>
                        <span className={cn(
                          "text-lg font-bold",
                          factor.score >= 80 ? "text-emerald-500" :
                          factor.score >= 60 ? "text-amber-500" : "text-red-500"
                        )}>
                          {factor.score}%
                        </span>
                      </div>
                      <Progress value={factor.score} className="h-2" />
                      <p className="text-sm text-muted-foreground mt-2">
                        {factor.matched 
                          ? `Strong alignment on ${factor.name.toLowerCase()}`
                          : `Partial match - some differences in ${factor.name.toLowerCase()} requirements`
                        }
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Reasoning */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">AI Analysis</h3>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                    <p className="text-sm text-foreground leading-relaxed">
                      {match.reasoning}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Talking Points Tab */}
          {activeTab === "talking_points" && (
            <div className="space-y-6">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">AI-Generated Talking Points</h4>
                    <p className="text-sm text-muted-foreground">
                      Customized discussion points based on investor preferences and startup strengths
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {talkingPoints.map((section) => (
                  <div key={section.category} className="bg-card border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      {section.category}
                    </h4>
                    <ul className="space-y-2">
                      {section.points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  variant="outline"
                  className="bg-transparent"
                  onClick={() => {
                    const text = talkingPoints
                      .map(
                        (s) =>
                          `${s.category}\n${s.points.map((p) => `• ${p}`).join("\n")}`
                      )
                      .join("\n\n")
                    navigator.clipboard.writeText(text)
                    toast({ title: "Copied", description: "Talking points copied to clipboard." })
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-1.5" />
                  Export Talking Points
                </Button>
              </div>
            </div>
          )}

          {/* Similar Deals Tab */}
          {activeTab === "similar_deals" && (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Past deals with similar characteristics to help inform your approach
              </p>

              <div className="space-y-3">
                {similarPastDeals.map((deal) => (
                  <div key={deal.id} className="bg-card border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground">{deal.startup}</h4>
                            <span className="text-muted-foreground">+</span>
                            <span className="text-sm text-muted-foreground">{deal.investor}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">{deal.sector}</Badge>
                            <Badge variant="outline" className="text-xs">{deal.stage}</Badge>
                            <span className="text-xs text-muted-foreground">{deal.amount}</span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          "text-xs",
                          deal.outcome === "successful"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                            : "bg-blue-500/10 text-blue-600 border-blue-500/30"
                        )}
                      >
                        {deal.outcome === "successful" ? "Successful" : "In Progress"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 pl-13">
                      {deal.notes}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">Key Insights from Similar Deals</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    Average deal velocity: 45 days from intro to term sheet
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    85% of similar matches resulted in follow-on discussions
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    Key success factor: Strong founder-partner relationship
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={onClose} className="bg-transparent">
            Close
          </Button>
          <Button
            variant="outline"
            className={cn("bg-transparent", isSaved && "border-amber-500/50 text-amber-600")}
            onClick={() => match && onSaveMatch?.(match)}
          >
            <Bookmark className={cn("w-4 h-4 mr-1.5", isSaved && "fill-amber-500 text-amber-500")} />
            {isSaved ? "Saved" : "Save Match"}
          </Button>
          <Button onClick={() => match && startup && onStartOutreach?.(match, startup)}>
            <Send className="w-4 h-4 mr-1.5" />
            Start Outreach
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function InvestorMatchCard({
  match,
  startup,
  isExpanded,
  onToggle,
  isSelected,
  onSelect,
  onViewDetails,
  onDismiss,
  isSaved,
  onToggleSave,
  openOutreachTrigger,
}: {
  match: InvestorMatch
  startup: StartupWithMatches
  isExpanded: boolean
  onToggle: () => void
  isSelected: boolean
  onSelect: (checked: boolean) => void
  onViewDetails: () => void
  onDismiss: (reason: string) => void
  isSaved: boolean
  onToggleSave: () => void
  openOutreachTrigger?: boolean
}) {
  const [showDismissDialog, setShowDismissDialog] = useState(false)
  const [showOutreachDialog, setShowOutreachDialog] = useState(false)
  const [showMeetingDialog, setShowMeetingDialog] = useState(false)
  const [dismissReason, setDismissReason] = useState("")
  const [meetingDate, setMeetingDate] = useState("")
  const [meetingTime, setMeetingTime] = useState("")
  const [meetingNotes, setMeetingNotes] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [meetingScheduled, setMeetingScheduled] = useState(false)

  useEffect(() => {
    if (openOutreachTrigger) setShowOutreachDialog(true)
  }, [openOutreachTrigger])

  return (
    <>
      <div
        className={cn(
          "border rounded-lg bg-card transition-all",
          isExpanded ? "ring-1 ring-primary/20" : "hover:border-primary/30"
        )}
      >
        {/* Collapsed Header */}
        <div className="flex items-center gap-4 p-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            className="shrink-0"
            onClick={(e) => e.stopPropagation()}
          />

          <MatchScoreBadge score={match.score} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-foreground">{match.name}</h4>
              <StatusBadge status={match.status} />
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {match.type} · {match.stages} · {match.checkSize}
            </p>
            {match.lastContact && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last contact: {new Date(match.lastContact).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent" asChild>
              <Link href={`/investors/${match.id}`}>
                <Eye className="w-4 h-4 mr-1.5" />
                View
              </Link>
            </Button>
            <Button size="sm" onClick={() => setShowOutreachDialog(true)}>
              <Send className="w-4 h-4 mr-1.5" />
              Outreach
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onToggle}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t px-4 pb-4 pt-3 space-y-4">
            {/* Match Factors */}
            <div>
              <h5 className="text-sm font-medium text-foreground mb-3">Match Factors</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {match.factors.map((factor) => (
                  <MatchFactorBar key={factor.name} factor={factor} />
                ))}
              </div>
            </div>

            {/* Why This Match */}
            <div>
              <h5 className="text-sm font-medium text-foreground mb-2">Why this match</h5>
              <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 italic">
                "{match.reasoning}"
              </p>
            </div>

            {/* Investor Details */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {match.location}
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                {match.checkSize}
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Briefcase className="w-4 h-4" />
                {match.stages}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" className="bg-transparent" asChild>
                <Link href={`/investors/${match.id}`}>
                  <Eye className="w-4 h-4 mr-1.5" />
                  View Profile
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent" onClick={() => setShowOutreachDialog(true)}>
                <Mail className="w-4 h-4 mr-1.5" />
                Start Outreach
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={cn("bg-transparent", meetingScheduled && "border-purple-500/50 text-purple-600")}
                onClick={() => setShowMeetingDialog(true)}
              >
                <Calendar className={cn("w-4 h-4 mr-1.5", meetingScheduled && "text-purple-500")} />
                {meetingScheduled ? "Meeting Set" : "Schedule Meeting"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={cn("bg-transparent", isSaved && "border-amber-500/50 text-amber-600")}
                onClick={onToggleSave}
              >
                <Bookmark className={cn("w-4 h-4 mr-1.5", isSaved && "fill-amber-500 text-amber-500")} />
                {isSaved ? "Saved" : "Save"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowDismissDialog(true)}>
                    <X className="w-4 h-4 mr-2" />
                    Dismiss Match
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      window.open(
                        `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(match.name)}`,
                        "_blank"
                      )
                    }
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on LinkedIn
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>

      {/* Dismiss Dialog */}
      <Dialog open={showDismissDialog} onOpenChange={setShowDismissDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dismiss Match</DialogTitle>
            <DialogDescription>
              Why are you dismissing {match.name} as a match for {startup.name}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label>Reason (optional)</Label>
            <Textarea 
              placeholder="e.g., Not investing in this sector anymore, Already in discussions with competitor..."
              value={dismissReason}
              onChange={(e) => setDismissReason(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              {["Not investing in this space", "Check size mismatch", "Already connected", "No response history", "Portfolio conflict"].map((reason) => (
                <Button
                  key={reason}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="bg-transparent text-xs"
                  onClick={() => setDismissReason(reason)}
                >
                  {reason}
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDismissDialog(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                onDismiss(dismissReason)
                setShowDismissDialog(false)
                setDismissReason("")
              }}
            >
              Dismiss Match
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Outreach Dialog */}
      <Dialog open={showOutreachDialog} onOpenChange={setShowOutreachDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Start Outreach to {match.name}</DialogTitle>
            <DialogDescription>
              Send an introduction email for {startup.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input defaultValue={`Investment Opportunity: ${startup.name} - ${startup.sector} ${startup.stage}`} />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                className="min-h-[200px]"
                defaultValue={`Hi,

I wanted to introduce you to ${startup.name}, an exciting ${startup.sector} company currently raising their ${startup.stage} round (${startup.raising}).

Based on your investment thesis and portfolio, I believe this could be a strong fit. Key highlights:

• [Highlight 1]
• [Highlight 2]
• [Highlight 3]

Would you be open to a 30-minute call to learn more?

Best regards`}
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowOutreachDialog(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button 
              variant="outline" 
              className="bg-transparent"
              onClick={() => {
                // Open in email client
                const subject = encodeURIComponent(`Investment Opportunity: ${startup.name} - ${startup.sector} ${startup.stage}`)
                const body = encodeURIComponent(`Hi,\n\nI wanted to introduce you to ${startup.name}, an exciting ${startup.sector} company currently raising their ${startup.stage} round (${startup.raising}).\n\nBased on your investment thesis and portfolio, I believe this could be a strong fit.\n\nWould you be open to a 30-minute call to learn more?\n\nBest regards`)
                window.open(`mailto:?subject=${subject}&body=${body}`, "_blank")
              }}
            >
              <ExternalLink className="w-4 h-4 mr-1.5" />
              Open in Email Client
            </Button>
            <Button onClick={() => {
              setEmailSent(true)
              setShowOutreachDialog(false)
            }}>
              <Send className="w-4 h-4 mr-1.5" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Meeting Dialog */}
      <Dialog open={showMeetingDialog} onOpenChange={setShowMeetingDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule Meeting with {match.name}</DialogTitle>
            <DialogDescription>
              Set up a meeting to discuss {startup.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input 
                  type="date" 
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Select value={meetingTime} onValueChange={setMeetingTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                    <SelectItem value="09:30">9:30 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="10:30">10:30 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="11:30">11:30 AM</SelectItem>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                    <SelectItem value="12:30">12:30 PM</SelectItem>
                    <SelectItem value="13:00">1:00 PM</SelectItem>
                    <SelectItem value="13:30">1:30 PM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                    <SelectItem value="14:30">2:30 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM</SelectItem>
                    <SelectItem value="15:30">3:30 PM</SelectItem>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                    <SelectItem value="16:30">4:30 PM</SelectItem>
                    <SelectItem value="17:00">5:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Meeting Type</Label>
              <Select defaultValue="video">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video Call (Zoom/Meet)</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="in_person">In Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Select defaultValue="30">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea 
                placeholder="Agenda items, topics to discuss..."
                value={meetingNotes}
                onChange={(e) => setMeetingNotes(e.target.value)}
              />
            </div>
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <p className="text-sm font-medium text-foreground">Quick Actions</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="bg-transparent text-xs"
                  onClick={() => {
                    // Open Google Calendar
                    const title = encodeURIComponent(`Meeting: ${startup.name} x ${match.name}`)
                    const details = encodeURIComponent(`Discussion about ${startup.name} investment opportunity`)
                    const date = meetingDate.replace(/-/g, "")
                    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${date}/${date}`, "_blank")
                  }}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Add to Google Calendar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="bg-transparent text-xs"
                  onClick={() => {
                    // Generate ICS file
                    const event = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Meeting: ${startup.name} x ${match.name}
DTSTART:${meetingDate.replace(/-/g, "")}T${meetingTime.replace(":", "")}00
DTEND:${meetingDate.replace(/-/g, "")}T${meetingTime.replace(":", "")}00
DESCRIPTION:Discussion about ${startup.name} investment opportunity
END:VEVENT
END:VCALENDAR`
                    const blob = new Blob([event], { type: "text/calendar" })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = `meeting-${startup.name}-${match.name}.ics`
                    a.click()
                  }}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Download .ics
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMeetingDialog(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button 
              onClick={() => {
                setMeetingScheduled(true)
                setShowMeetingDialog(false)
              }}
              disabled={!meetingDate || !meetingTime}
            >
              <Calendar className="w-4 h-4 mr-1.5" />
              Schedule Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function StartupMatchCard({
  startup,
  onExportSelected,
  onContactSelected,
}: {
  startup: StartupWithMatches
  onExportSelected?: (matches: InvestorMatch[]) => void
  onContactSelected?: () => void
}) {
  const [expandedMatches, setExpandedMatches] = useState<string[]>([])
  const [selectedMatches, setSelectedMatches] = useState<string[]>([])
  const [showAllMatches, setShowAllMatches] = useState(false)
  const [selectedMatchForDetail, setSelectedMatchForDetail] = useState<InvestorMatch | null>(null)
  const [savedMatches, setSavedMatches] = useState<string[]>([])
  const [dismissedMatches, setDismissedMatches] = useState<string[]>([])
  const [openOutreachMatchId, setOpenOutreachMatchId] = useState<string | null>(null)

  const activeMatches = startup.matches.filter((m) => !dismissedMatches.includes(m.id))
  const visibleMatches = showAllMatches ? activeMatches : activeMatches.slice(0, 3)
  const hiddenCount = activeMatches.length - 3
  const selectedMatchList = activeMatches.filter((m) => selectedMatches.includes(m.id))

  const toggleExpand = (matchId: string) => {
    setExpandedMatches((prev) =>
      prev.includes(matchId) ? prev.filter((id) => id !== matchId) : [...prev, matchId]
    )
  }

  const toggleSelect = (matchId: string, checked: boolean) => {
    setSelectedMatches((prev) =>
      checked ? [...prev, matchId] : prev.filter((id) => id !== matchId)
    )
  }

  const selectAll = () => {
    if (selectedMatches.length === startup.matches.length) {
      setSelectedMatches([])
    } else {
      setSelectedMatches(startup.matches.map((m) => m.id))
    }
  }

  return (
    <>
      <MatchDetailModal
        match={selectedMatchForDetail}
        startup={startup}
        isOpen={!!selectedMatchForDetail}
        onClose={() => setSelectedMatchForDetail(null)}
        onSaveMatch={(match) => {
          setSavedMatches((prev) =>
            prev.includes(match.id) ? prev.filter((id) => id !== match.id) : [...prev, match.id]
          )
        }}
        onStartOutreach={(match) => {
          setSelectedMatchForDetail(null)
          setOpenOutreachMatchId(match.id)
        }}
        isSaved={selectedMatchForDetail ? savedMatches.includes(selectedMatchForDetail.id) : false}
      />
      <div className="border rounded-xl bg-card">
        {/* Startup Header */}
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/startups/${startup.id}`}
                    className="font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {startup.name}
                  </Link>
                  <Badge variant="secondary" className="text-xs">
                    {startup.sector}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {startup.stage}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Currently Raising {startup.raising} · {startup.totalMatches} investor matches found
                </p>
              </div>
            </div>

            {selectedMatches.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedMatches.length} selected
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-transparent"
                  onClick={() => {
                    // In a real app would open composer with selected recipients
                    if (typeof window !== "undefined" && (window as unknown as { toast?: { title: string; description: string } }).toast) return
                  }}
                >
                  <Mail className="w-4 h-4 mr-1.5" />
                  Contact Selected
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setDismissedMatches((prev) => [...prev, ...selectedMatches])
                        setSelectedMatches([])
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Dismiss Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        if (selectedMatchList.length > 0 && onExportSelected) {
                          onExportSelected(selectedMatchList)
                        }
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Export Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Select All */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
            <Checkbox
              checked={selectedMatches.length === startup.matches.length && startup.matches.length > 0}
              onCheckedChange={selectAll}
            />
            <span className="text-sm text-muted-foreground">Select all matches</span>
          </div>
        </div>

        {/* Matches */}
        <div className="p-4 space-y-3">
          <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Top Matches
          </h5>
          <div className="space-y-3">
            {visibleMatches.map((match) => (
              <InvestorMatchCard
                key={match.id}
                match={match}
                startup={startup}
                isExpanded={expandedMatches.includes(match.id)}
                onToggle={() => toggleExpand(match.id)}
                isSelected={selectedMatches.includes(match.id)}
                onSelect={(checked) => toggleSelect(match.id, checked)}
                onViewDetails={() => setSelectedMatchForDetail(match)}
                onDismiss={(reason) => {
                  setDismissedMatches((prev) => [...prev, match.id])
                }}
                isSaved={savedMatches.includes(match.id)}
                onToggleSave={() => {
                  setSavedMatches((prev) =>
                    prev.includes(match.id)
                      ? prev.filter((id) => id !== match.id)
                      : [...prev, match.id]
                  )
                }}
                openOutreachTrigger={openOutreachMatchId === match.id}
              />
            ))}
          </div>

          {hiddenCount > 0 && !showAllMatches && (
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setShowAllMatches(true)}
            >
              Show {hiddenCount} more matches...
            </Button>
          )}

          {showAllMatches && hiddenCount > 0 && (
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setShowAllMatches(false)}
            >
              Show less
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

// Main Page Component
export default function MatchingPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [viewMode, setViewMode] = useState<"by_startup" | "by_investor">("by_startup")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [minScore, setMinScore] = useState<string>("0")

  const minScoreNum = parseInt(minScore, 10) || 0

  const filteredStartupsBySearch = mockStartupsWithMatches.filter((startup) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        startup.name.toLowerCase().includes(query) ||
        startup.sector.toLowerCase().includes(query)
      )
    }
    return true
  })

  const filteredStartups = filteredStartupsBySearch
    .map((startup) => ({
      ...startup,
      matches: startup.matches.filter(
        (m) =>
          (statusFilter === "all" || m.status === statusFilter) &&
          m.score >= minScoreNum
      ),
    }))
    .filter((startup) => startup.matches.length > 0)

  const totalMatches = mockStartupsWithMatches.reduce((acc, s) => acc + s.totalMatches, 0)
  const highScoreMatches = mockStartupsWithMatches.reduce(
    (acc, s) => acc + s.matches.filter((m) => m.score >= 90).length,
    0
  )
  const contactedMatches = mockStartupsWithMatches.reduce(
    (acc, s) => acc + s.matches.filter((m) => m.status !== "not_contacted").length,
    0
  )

  const handleRefreshMatches = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  const handleExportSelected = (matches: InvestorMatch[]) => {
    const headers = ["Investor", "Type", "Stages", "Check Size", "Score", "Status", "Location"]
    const rows = matches.map((m) => [
      m.name,
      m.type,
      m.stages,
      m.checkSize,
      String(m.score),
      statusConfig[m.status].label,
      m.location,
    ])
    exportToCsv({ headers, rows, filename: "match-results-selected.csv" })
    toast({ title: "Export complete", description: "Selected matches downloaded as CSV." })
  }

  const handleContactSelected = () => {
    toast({
      title: "Contact selected",
      description: "Opening composer for selected recipients...",
    })
  }

  if (user?.activeRole === "angel-investor") {
    return (
      <Suspense fallback={<Loading />}>
        <ProtectedRoute>
          <div className="flex flex-col h-screen bg-background">
            <DashboardHeader title="Deals For Me" />
            <div className="flex flex-1 overflow-hidden">
              <DashboardSidebar />
              <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <DealsForMeFeed />
              </main>
            </div>
          </div>
        </ProtectedRoute>
        <Toaster />
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<Loading />}>
      <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Match Results" />

        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-[1600px] mx-auto space-y-4">
              {/* Breadcrumb */}
              <PageBreadcrumb segments={[{ label: "Investor Matching" }]} />
              
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Match Results</h1>
                  <p className="text-muted-foreground mt-1">
                    AI-powered investor matches for your pipeline
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    Updated 2 hours ago
                  </span>
                  <Button
                    variant="outline"
                    className="bg-transparent"
                    onClick={handleRefreshMatches}
                    disabled={isRefreshing}
                  >
                    <RefreshCw
                      className={cn("w-4 h-4 mr-1.5", isRefreshing && "animate-spin")}
                    />
                    {isRefreshing ? "Refreshing..." : "Refresh Matches"}
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-card border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{totalMatches}</p>
                      <p className="text-sm text-muted-foreground">Total Matches</p>
                    </div>
                  </div>
                </div>
                <div className="bg-card border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{highScoreMatches}</p>
                      <p className="text-sm text-muted-foreground">High Score (90%+)</p>
                    </div>
                  </div>
                </div>
                <div className="bg-card border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Send className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{contactedMatches}</p>
                      <p className="text-sm text-muted-foreground">Contacted</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters & View Toggle */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-card border rounded-lg p-3">
                <div className="flex items-center gap-3 flex-wrap">
                  {/* View Mode Tabs - profile styling */}
                  <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "by_startup" | "by_investor")}>
                    <TabsList className="justify-start rounded-lg border border-border bg-muted/50 h-auto p-1">
                      <TabsTrigger
                        value="by_startup"
                        className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground px-4 py-2 transition-colors"
                      >
                        <Building2 className="w-4 h-4 inline mr-1.5" />
                        By Startup
                      </TabsTrigger>
                      <TabsTrigger
                        value="by_investor"
                        className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground px-4 py-2 transition-colors"
                      >
                        <Users className="w-4 h-4 inline mr-1.5" />
                        By Investor
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search startups..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-[200px]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="not_contacted">Not Contacted</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="responded_interested">Interested</SelectItem>
                      <SelectItem value="responded_passed">Passed</SelectItem>
                      <SelectItem value="meeting_scheduled">Meeting Scheduled</SelectItem>
                      <SelectItem value="in_discussion">In Discussion</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Min Score Filter */}
                  <Select value={minScore} onValueChange={setMinScore}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Min Score" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">All Scores</SelectItem>
                      <SelectItem value="90">90%+ Only</SelectItem>
                      <SelectItem value="80">80%+ Only</SelectItem>
                      <SelectItem value="70">70%+ Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Status Legend */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-muted-foreground">Status:</span>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <span
                    key={key}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs",
                      config.bgColor,
                      config.color,
                      config.borderColor
                    )}
                  >
                    {config.label}
                  </span>
                ))}
              </div>

              {/* Results - By Startup view */}
              {viewMode === "by_startup" && (
              <div className="space-y-3">
                {filteredStartups.map((startup) => (
                  <StartupMatchCard
                    key={startup.id}
                    startup={startup}
                    onExportSelected={handleExportSelected}
                    onContactSelected={handleContactSelected}
                  />
                ))}

                {filteredStartups.length === 0 && (
                  <div className="text-center py-12 border rounded-xl bg-card">
                    <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No matches found
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Try adjusting your search or filters to find investor matches.
                    </p>
                  </div>
                )}
              </div>
              )}

              {/* Results - By Investor view */}
              {viewMode === "by_investor" && (
              <div className="space-y-3">
                {(() => {
                  const investorMap = new Map<string, { match: InvestorMatch; startups: StartupWithMatches[] }>()
                  filteredStartups.forEach((startup) => {
                    startup.matches.forEach((match) => {
                      const existing = investorMap.get(match.id)
                      if (existing) {
                        if (!existing.startups.some((s) => s.id === startup.id)) {
                          existing.startups.push(startup)
                        }
                      } else {
                        investorMap.set(match.id, { match, startups: [startup] })
                      }
                    })
                  })
                  const investorList = Array.from(investorMap.values())
                  return investorList.map(({ match, startups }) => (
                    <div key={match.id} className="border rounded-xl bg-card overflow-hidden">
                      <div className="p-4 border-b bg-muted/30 flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                          <MatchScoreBadge score={match.score} />
                          <div>
                            <h3 className="font-semibold text-foreground">{match.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {match.type} · {match.stages} · {match.checkSize} · {match.location}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={match.status} />
                        <div className="flex items-center gap-2 ml-auto">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/investors/${match.id}`}>
                              <Eye className="w-4 h-4 mr-1.5" />
                              View Profile
                            </Link>
                          </Button>
                          <Button size="sm" asChild>
                            <Link href="/outreach">
                              <Send className="w-4 h-4 mr-1.5" />
                              Start Outreach
                            </Link>
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                          Matched startups ({startups.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {startups.map((s) => (
                            <Link
                              key={s.id}
                              href={`/startups/${s.id}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-background hover:bg-muted/50 text-sm"
                            >
                              <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                              {s.name}
                              <Badge variant="secondary" className="text-[10px]">
                                {s.sector}
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                })()}
                {filteredStartups.length === 0 && (
                  <div className="text-center py-12 border rounded-xl bg-card">
                    <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No matches found</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Try adjusting your search or filters.
                    </p>
                  </div>
                )}
              </div>
              )}

            </div>
          </main>
        </div>
      </div>
      </ProtectedRoute>
      <Toaster />
    </Suspense>
  )
}

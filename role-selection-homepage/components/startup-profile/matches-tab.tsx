"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowRightLeft,
  Bookmark,
  BookmarkCheck,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
  ExternalLink,
  Filter,
  Landmark,
  Mail,
  MapPin,
  MoreHorizontal,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/toaster"

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
  type: "VC" | "Angel" | "Family Office" | "Corporate"
  stages: string
  checkSize: string
  location: string
  score: number
  factors: MatchFactor[]
  reasoning: string
  status: MatchStatus
  lastContact?: string
  saved: boolean
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
    label: "Meeting",
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

// Mock matches data for startup
const matchesData: InvestorMatch[] = [
  {
    id: "1",
    name: "Sequoia Capital India",
    type: "VC",
    stages: "Seed - Series B",
    checkSize: "$500K - $10M",
    location: "Bengaluru",
    score: 94,
    factors: [
      { name: "Stage Match", score: 100, matched: true },
      { name: "Sector Match", score: 95, matched: true },
      { name: "Check Size", score: 92, matched: true },
      { name: "Geography", score: 90, matched: true },
      { name: "Thesis Alignment", score: 88, matched: true },
      { name: "Portfolio Fit", score: 82, matched: true },
    ],
    reasoning:
      "Strong fintech focus with 3 similar investments. Recently announced AI-first thesis aligns well with company direction.",
    status: "not_contacted",
    saved: true,
  },
  {
    id: "2",
    name: "Accel Partners",
    type: "VC",
    stages: "Pre-Seed - Series A",
    checkSize: "$250K - $5M",
    location: "Bengaluru",
    score: 91,
    factors: [
      { name: "Stage Match", score: 98, matched: true },
      { name: "Sector Match", score: 92, matched: true },
      { name: "Check Size", score: 88, matched: true },
      { name: "Geography", score: 95, matched: true },
      { name: "Thesis Alignment", score: 85, matched: true },
      { name: "Portfolio Fit", score: 78, matched: false },
    ],
    reasoning:
      "Active in fintech space with strong operator network. Partner Prashanth has relevant background.",
    status: "contacted",
    lastContact: "Jan 18, 2026",
    saved: true,
  },
  {
    id: "3",
    name: "Lightspeed Ventures",
    type: "VC",
    stages: "Seed - Series C",
    checkSize: "$1M - $20M",
    location: "Mumbai",
    score: 87,
    factors: [
      { name: "Stage Match", score: 95, matched: true },
      { name: "Sector Match", score: 88, matched: true },
      { name: "Check Size", score: 85, matched: true },
      { name: "Geography", score: 82, matched: true },
      { name: "Thesis Alignment", score: 80, matched: true },
      { name: "Portfolio Fit", score: 72, matched: false },
    ],
    reasoning:
      "Strong B2B SaaS portfolio. May have portfolio conflict with similar company but different target market.",
    status: "responded_interested",
    lastContact: "Jan 20, 2026",
    saved: false,
  },
  {
    id: "4",
    name: "Blume Ventures",
    type: "VC",
    stages: "Pre-Seed - Seed",
    checkSize: "$100K - $2M",
    location: "Mumbai",
    score: 85,
    factors: [
      { name: "Stage Match", score: 100, matched: true },
      { name: "Sector Match", score: 85, matched: true },
      { name: "Check Size", score: 90, matched: true },
      { name: "Geography", score: 88, matched: true },
      { name: "Thesis Alignment", score: 78, matched: false },
      { name: "Portfolio Fit", score: 70, matched: false },
    ],
    reasoning:
      "Early-stage focused with good founder support. Previous investments in similar space show sector interest.",
    status: "meeting_scheduled",
    lastContact: "Jan 22, 2026",
    saved: true,
  },
  {
    id: "5",
    name: "Kunal Shah",
    type: "Angel",
    stages: "Pre-Seed - Seed",
    checkSize: "$50K - $200K",
    location: "Mumbai",
    score: 82,
    factors: [
      { name: "Stage Match", score: 100, matched: true },
      { name: "Sector Match", score: 90, matched: true },
      { name: "Check Size", score: 75, matched: false },
      { name: "Geography", score: 95, matched: true },
      { name: "Thesis Alignment", score: 82, matched: true },
      { name: "Portfolio Fit", score: 68, matched: false },
    ],
    reasoning:
      "CRED founder with deep fintech expertise. Can provide strategic guidance on consumer fintech.",
    status: "in_discussion",
    lastContact: "Jan 21, 2026",
    saved: false,
  },
  {
    id: "6",
    name: "Matrix Partners",
    type: "VC",
    stages: "Seed - Series B",
    checkSize: "$500K - $8M",
    location: "Bengaluru",
    score: 79,
    factors: [
      { name: "Stage Match", score: 92, matched: true },
      { name: "Sector Match", score: 78, matched: false },
      { name: "Check Size", score: 85, matched: true },
      { name: "Geography", score: 88, matched: true },
      { name: "Thesis Alignment", score: 72, matched: false },
      { name: "Portfolio Fit", score: 65, matched: false },
    ],
    reasoning:
      "Strong consumer brand investments. Less active in fintech but exploring adjacent spaces.",
    status: "responded_passed",
    lastContact: "Jan 15, 2026",
    saved: false,
  },
]

// Summary stats
const matchSummary = {
  totalMatches: 24,
  highConfidence: 8,
  contacted: 12,
  interested: 4,
  avgScore: 84,
}

function getInvestorTypeIcon(type: InvestorMatch["type"]) {
  switch (type) {
    case "VC":
      return Landmark
    case "Angel":
      return Users
    case "Family Office":
      return Building2
    case "Corporate":
      return Building2
    default:
      return Landmark
  }
}

const initialMatchesData: InvestorMatch[] = [...matchesData]

export function MatchesTab() {
  const router = useRouter()
  const { toast } = useToast()
  const [matchesList, setMatchesList] = useState<InvestorMatch[]>(initialMatchesData)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null)
  const [savedMatches, setSavedMatches] = useState<Set<string>>(
    () => new Set(initialMatchesData.filter((m) => m.saved).map((m) => m.id))
  )
  const [contactInvestorId, setContactInvestorId] = useState<string | null>(null)
  const [scheduleInvestorId, setScheduleInvestorId] = useState<string | null>(null)
  const [sendDeckInvestorId, setSendDeckInvestorId] = useState<string | null>(null)
  const [editCriteriaOpen, setEditCriteriaOpen] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  const toggleSaved = (id: string) => {
    setSavedMatches((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleRemoveMatch = (id: string) => {
    setMatchesList((prev) => prev.filter((m) => m.id !== id))
    setSavedMatches((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    setExpandedMatch((prev) => (prev === id ? null : prev))
    toast({ title: "Match removed", description: "Investor removed from matches." })
  }

  const handleViewProfile = (match: InvestorMatch) => {
    router.push("/investors")
  }

  const handleRegenerate = () => {
    setRegenerating(true)
    setTimeout(() => {
      setRegenerating(false)
      toast({
        title: "Matches regenerated",
        description: "New potential investors have been found based on latest criteria.",
      })
    }, 1500)
  }

  const filteredMatches = useMemo(
    () =>
      matchesList.filter((match) => {
        const matchesSearch =
          match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.location.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === "all" || match.status === statusFilter
        const matchesType = typeFilter === "all" || match.type === typeFilter
        return matchesSearch && matchesStatus && matchesType
      }),
    [matchesList, searchQuery, statusFilter, typeFilter]
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      {/* Main Content */}
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-semibold">{matchSummary.totalMatches}</p>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">High Conf.</p>
                <p className="text-lg font-semibold">{matchSummary.highConfidence}</p>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Send className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Contacted</p>
                <p className="text-lg font-semibold">{matchSummary.contacted}</p>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Interested</p>
                <p className="text-lg font-semibold">{matchSummary.interested}</p>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Score</p>
                <p className="text-lg font-semibold">{matchSummary.avgScore}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search investors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="not_contacted">Not Contacted</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="responded_interested">Interested</SelectItem>
              <SelectItem value="meeting_scheduled">Meeting</SelectItem>
              <SelectItem value="in_discussion">In Discussion</SelectItem>
              <SelectItem value="responded_passed">Passed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="VC">VC</SelectItem>
              <SelectItem value="Angel">Angel</SelectItem>
              <SelectItem value="Family Office">Family Office</SelectItem>
              <SelectItem value="Corporate">Corporate</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 bg-transparent"
            onClick={() => toast({ title: "Filters refreshed", description: "Match list updated." })}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Matches List */}
        <div className="space-y-3">
          {filteredMatches.map((match) => {
            const isExpanded = expandedMatch === match.id
            const TypeIcon = getInvestorTypeIcon(match.type)
            const statusConf = statusConfig[match.status]

            return (
              <Card
                key={match.id}
                className={cn(
                  "transition-all",
                  isExpanded && "ring-1 ring-primary/20"
                )}
              >
                <CardContent className="p-4">
                  {/* Main Row */}
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => setExpandedMatch(isExpanded ? null : match.id)}
                      className="mt-1 text-muted-foreground hover:text-foreground"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <TypeIcon className="w-5 h-5 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">{match.name}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {match.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              {match.checkSize}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {match.location}
                            </span>
                            <span>{match.stages}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Match Score */}
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-primary" />
                              <span
                                className={cn(
                                  "text-lg font-bold",
                                  match.score >= 90
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : match.score >= 80
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                )}
                              >
                                {match.score}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status & Actions Row */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              statusConf.bgColor,
                              statusConf.color,
                              statusConf.borderColor
                            )}
                          >
                            {statusConf.label}
                          </Badge>
                          {match.lastContact && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {match.lastContact}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleSaved(match.id)}
                          >
                            {savedMatches.has(match.id) ? (
                              <BookmarkCheck className="w-4 h-4 text-primary" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => setContactInvestorId(match.id)}
                          >
                            <Mail className="w-3 h-3 mr-1" />
                            Contact
                          </Button>
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="z-[100]">
                              <DropdownMenuItem onClick={() => handleViewProfile(match)}>
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setScheduleInvestorId(match.id)}>
                                <Calendar className="w-4 h-4 mr-2" />
                                Schedule Meeting
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setSendDeckInvestorId(match.id)}>
                                <Send className="w-4 h-4 mr-2" />
                                Send Deck
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleRemoveMatch(match.id)}
                              >
                                <X className="w-4 h-4 mr-2" />
                                Remove Match
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      {/* AI Reasoning */}
                      <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-primary mb-1">AI Analysis</p>
                            <p className="text-sm text-muted-foreground">{match.reasoning}</p>
                          </div>
                        </div>
                      </div>

                      {/* Match Factors */}
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Match Factors</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {match.factors.map((factor) => (
                            <div
                              key={factor.name}
                              className={cn(
                                "p-2 rounded-lg border text-xs",
                                factor.matched
                                  ? "bg-emerald-500/5 border-emerald-500/20"
                                  : "bg-muted/50 border-border"
                              )}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-muted-foreground">{factor.name}</span>
                                {factor.matched ? (
                                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                  <X className="w-3 h-3 text-muted-foreground" />
                                )}
                              </div>
                              <Progress
                                value={factor.score}
                                className={cn(
                                  "h-1",
                                  factor.matched
                                    ? "[&>div]:bg-emerald-500"
                                    : "[&>div]:bg-muted-foreground"
                                )}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredMatches.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No matches found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Regenerate Matches */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              AI Matching
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Last updated 2 hours ago. Regenerate to find new potential investors based on latest criteria.
            </p>
            <Button
              className="w-full"
              size="sm"
              disabled={regenerating}
              onClick={handleRegenerate}
            >
              <RefreshCw
                className={cn("w-4 h-4 mr-2", regenerating && "animate-spin")}
              />
              {regenerating ? "Regenerating…" : "Regenerate Matches"}
            </Button>
          </CardContent>
        </Card>

        {/* Saved Matches */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              Saved Matches
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {matchesList
              .filter((m) => savedMatches.has(m.id))
              .slice(0, 4)
              .map((match) => (
                <button
                  type="button"
                  key={match.id}
                  onClick={() => setExpandedMatch((prev) => (prev === match.id ? null : match.id))}
                  className="flex w-full items-center justify-between p-2 rounded-lg hover:bg-muted/50 text-left"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                      {match.type === "VC" ? (
                        <Landmark className="w-3 h-3 text-primary" />
                      ) : (
                        <Users className="w-3 h-3 text-primary" />
                      )}
                    </div>
                    <span className="text-sm font-medium truncate max-w-[140px]">{match.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {match.score}%
                  </Badge>
                </button>
              ))}
            {savedMatches.size === 0 && (
              <p className="text-xs text-muted-foreground text-center py-2">
                No saved matches yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Match Criteria */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Match Criteria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stage</span>
                <span className="font-medium">Seed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sector</span>
                <span className="font-medium">Fintech</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Raising</span>
                <span className="font-medium">$2M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Geography</span>
                <span className="font-medium">India</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-transparent"
              onClick={() => setEditCriteriaOpen(true)}
            >
              Edit Criteria
            </Button>
          </CardContent>
        </Card>

        {/* Outreach Stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4" />
              Outreach Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Response Rate</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">42%</span>
              </div>
              <Progress value={42} className="h-1.5 [&>div]:bg-emerald-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Interest Rate</span>
                <span className="font-medium text-primary">28%</span>
              </div>
              <Progress value={28} className="h-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-lg font-semibold">5</p>
                <p className="text-xs text-muted-foreground">Meetings</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-lg font-semibold">2</p>
                <p className="text-xs text-muted-foreground">Term Sheets</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ContactModal
        investorId={contactInvestorId}
        investor={matchesList.find((m) => m.id === contactInvestorId)}
        onClose={() => setContactInvestorId(null)}
        onSubmit={() => {
          setContactInvestorId(null)
          toast({ title: "Message sent", description: "Your introduction has been sent to the investor." })
        }}
      />
      <ScheduleMeetingModal
        investorId={scheduleInvestorId}
        investor={matchesList.find((m) => m.id === scheduleInvestorId)}
        onClose={() => setScheduleInvestorId(null)}
        onSubmit={() => {
          setScheduleInvestorId(null)
          toast({ title: "Meeting scheduled", description: "Calendar invite will be sent." })
        }}
      />
      <SendDeckModal
        investorId={sendDeckInvestorId}
        investor={matchesList.find((m) => m.id === sendDeckInvestorId)}
        onClose={() => setSendDeckInvestorId(null)}
        onSubmit={() => {
          setSendDeckInvestorId(null)
          toast({ title: "Deck sent", description: "Pitch deck has been shared with the investor." })
        }}
      />
      <EditCriteriaModal
        open={editCriteriaOpen}
        onOpenChange={setEditCriteriaOpen}
        onSave={() => {
          setEditCriteriaOpen(false)
          toast({ title: "Criteria updated", description: "Match criteria saved. Regenerate matches to apply." })
        }}
      />
      <Toaster />
    </div>
  )
}

// Contact / Send Introduction modal
function ContactModal({
  investorId,
  investor,
  onClose,
  onSubmit,
}: {
  investorId: string | null
  investor: InvestorMatch | undefined
  onClose: () => void
  onSubmit: () => void
}) {
  const [message, setMessage] = useState("")
  return (
    <Dialog open={!!investorId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Contact {investor?.name ?? "Investor"}</DialogTitle>
          <DialogDescription>Send an introduction or follow-up message.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="contact-message">Message</Label>
            <Textarea
              id="contact-message"
              placeholder="Introduce your startup and why you're reaching out..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit}>Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Schedule Meeting modal
function ScheduleMeetingModal({
  investorId,
  investor,
  onClose,
  onSubmit,
}: {
  investorId: string | null
  investor: InvestorMatch | undefined
  onClose: () => void
  onSubmit: () => void
}) {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")
  return (
    <Dialog open={!!investorId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Schedule meeting with {investor?.name ?? "Investor"}</DialogTitle>
          <DialogDescription>Propose a time for a call or meeting.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="schedule-date">Date</Label>
              <Input
                id="schedule-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-time">Time</Label>
              <Input
                id="schedule-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="schedule-notes">Notes (optional)</Label>
            <Textarea
              id="schedule-notes"
              placeholder="Agenda or talking points..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit}>Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Send Deck modal
function SendDeckModal({
  investorId,
  investor,
  onClose,
  onSubmit,
}: {
  investorId: string | null
  investor: InvestorMatch | undefined
  onClose: () => void
  onSubmit: () => void
}) {
  const [message, setMessage] = useState("")
  return (
    <Dialog open={!!investorId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Send deck to {investor?.name ?? "Investor"}</DialogTitle>
          <DialogDescription>Share your pitch deck with a short note.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="deck-message">Note (optional)</Label>
            <Textarea
              id="deck-message"
              placeholder="Add a brief note with the deck..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit}>Send Deck</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Edit Match Criteria modal
function EditCriteriaModal({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
}) {
  const [stage, setStage] = useState("Seed")
  const [sector, setSector] = useState("Fintech")
  const [raising, setRaising] = useState("$2M")
  const [geography, setGeography] = useState("India")
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Edit match criteria</DialogTitle>
          <DialogDescription>Update the criteria used to find investor matches.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Stage</Label>
            <Input value={stage} onChange={(e) => setStage(e.target.value)} placeholder="e.g. Seed" />
          </div>
          <div className="space-y-2">
            <Label>Sector</Label>
            <Input value={sector} onChange={(e) => setSector(e.target.value)} placeholder="e.g. Fintech" />
          </div>
          <div className="space-y-2">
            <Label>Raising</Label>
            <Input value={raising} onChange={(e) => setRaising(e.target.value)} placeholder="e.g. $2M" />
          </div>
          <div className="space-y-2">
            <Label>Geography</Label>
            <Input value={geography} onChange={(e) => setGeography(e.target.value)} placeholder="e.g. India" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSave}>Save criteria</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

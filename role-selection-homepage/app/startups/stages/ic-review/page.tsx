"use client"

import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import {
  Building2,
  ChevronRight,
  LayoutGrid,
  List,
  Table2,
  Filter,
  Search,
  MoreHorizontal,
  Calendar,
  Clock,
  Users,
  FileText,
  Star,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Pause,
  Scale,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Download,
  Send,
  Plus,
  AlertTriangle,
  Flame,
  MessageSquare,
  Vote,
  Gavel,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Toaster } from "@/components/ui/toaster"
import { QuickAddModal } from "@/components/startup/quick-add-modal"

// Types
interface ICStartup {
  id: string
  name: string
  tagline: string
  sector: string
  recommendation: "strong-yes" | "yes" | "maybe" | "no" | "not-ready"
  icMemoStatus: "complete" | "draft" | "pending"
  icDate: string | null
  icTime: string | null
  daysInIC: number
  lead: string
  leadAvatar: string
  investment: string
  equity: string
  preMoney: string
  postMoney: string
  leadInvestor: string
  leadAmount: string
  coInvestors: string
  icMembers: { name: string; avatar: string; voted?: "yes" | "no" | "abstain" }[]
  decision: "pending" | "approved" | "approved-conditions" | "deferred" | "rejected"
  highlights: string[]
  concerns: string[]
  icStatus: "scheduled" | "awaiting-date" | "in-meeting" | "decision-pending" | "approved" | "rejected" | "deferred"
}

// Initial data (stateful for Defer / decisions)
const initialICStartups: ICStartup[] = [
  {
    id: "1",
    name: "TechCorp AI",
    tagline: "AI-powered financial document analysis",
    sector: "Fintech",
    recommendation: "strong-yes",
    icMemoStatus: "complete",
    icDate: "Jan 28, 2026",
    icTime: "2:00 PM",
    daysInIC: 5,
    lead: "Priya Sharma",
    leadAvatar: "/placeholder.svg?height=32&width=32",
    investment: "₹5.25 Cr",
    equity: "20%",
    preMoney: "₹21 Cr",
    postMoney: "₹26.25 Cr",
    leadInvestor: "Anthill",
    leadAmount: "₹3.5 Cr",
    coInvestors: "₹1.75 Cr",
    icMembers: [
      { name: "Partner A", avatar: "/placeholder.svg?height=24&width=24" },
      { name: "Partner B", avatar: "/placeholder.svg?height=24&width=24" },
      { name: "Partner C", avatar: "/placeholder.svg?height=24&width=24" },
    ],
    decision: "pending",
    highlights: [
      "Strong team with domain expertise",
      "50K+ active users, 25% MoM growth",
      "Clear path to profitability",
    ],
    concerns: [],
    icStatus: "scheduled",
  },
  {
    id: "2",
    name: "HealthBridge",
    tagline: "Rural healthcare connectivity platform",
    sector: "HealthTech",
    recommendation: "yes",
    icMemoStatus: "complete",
    icDate: null,
    icTime: null,
    daysInIC: 12,
    lead: "Amit Kumar",
    leadAvatar: "/placeholder.svg?height=32&width=32",
    investment: "₹12 Cr",
    equity: "15%",
    preMoney: "₹68 Cr",
    postMoney: "₹80 Cr",
    leadInvestor: "Anthill",
    leadAmount: "₹8 Cr",
    coInvestors: "₹4 Cr",
    icMembers: [],
    decision: "pending",
    highlights: [
      "Strong traction in tier-2/3 cities",
      "Proven revenue model",
      "Government partnerships",
    ],
    concerns: [],
    icStatus: "awaiting-date",
  },
  {
    id: "3",
    name: "PayFlow",
    tagline: "Embedded payments for SMBs",
    sector: "Fintech",
    recommendation: "maybe",
    icMemoStatus: "complete",
    icDate: "Tomorrow",
    icTime: "10:00 AM",
    daysInIC: 8,
    lead: "Rahul Verma",
    leadAvatar: "/placeholder.svg?height=32&width=32",
    investment: "₹8 Cr",
    equity: "18%",
    preMoney: "₹36 Cr",
    postMoney: "₹44 Cr",
    leadInvestor: "Anthill",
    leadAmount: "₹5 Cr",
    coInvestors: "₹3 Cr",
    icMembers: [
      { name: "Partner A", avatar: "/placeholder.svg?height=24&width=24" },
      { name: "Partner B", avatar: "/placeholder.svg?height=24&width=24" },
      { name: "Partner C", avatar: "/placeholder.svg?height=24&width=24" },
      { name: "Partner D", avatar: "/placeholder.svg?height=24&width=24" },
      { name: "Partner E", avatar: "/placeholder.svg?height=24&width=24" },
    ],
    decision: "pending",
    highlights: [],
    concerns: [
      "High burn rate",
      "Competitive market",
      "Team retention risk",
    ],
    icStatus: "scheduled",
  },
  {
    id: "4",
    name: "CloudAI",
    tagline: "AI infrastructure for enterprises",
    sector: "Enterprise SaaS",
    recommendation: "strong-yes",
    icMemoStatus: "complete",
    icDate: "Tomorrow",
    icTime: "3:00 PM",
    daysInIC: 6,
    lead: "Priya Sharma",
    leadAvatar: "/placeholder.svg?height=32&width=32",
    investment: "₹15 Cr",
    equity: "12%",
    preMoney: "₹110 Cr",
    postMoney: "₹125 Cr",
    leadInvestor: "Anthill",
    leadAmount: "₹10 Cr",
    coInvestors: "₹5 Cr",
    icMembers: [
      { name: "Partner A", avatar: "/placeholder.svg?height=24&width=24" },
      { name: "Partner B", avatar: "/placeholder.svg?height=24&width=24" },
    ],
    decision: "pending",
    highlights: [
      "Enterprise customers including Fortune 500",
      "95% gross margins",
      "Strong technical moat",
    ],
    concerns: [],
    icStatus: "scheduled",
  },
  {
    id: "5",
    name: "GreenLeaf",
    tagline: "Sustainable packaging solutions",
    sector: "CleanTech",
    recommendation: "yes",
    icMemoStatus: "complete",
    icDate: "Jan 28, 2026",
    icTime: "4:00 PM",
    daysInIC: 10,
    lead: "Amit Kumar",
    leadAvatar: "/placeholder.svg?height=32&width=32",
    investment: "₹6 Cr",
    equity: "22%",
    preMoney: "₹21.3 Cr",
    postMoney: "₹27.3 Cr",
    leadInvestor: "Anthill",
    leadAmount: "₹4 Cr",
    coInvestors: "₹2 Cr",
    icMembers: [
      { name: "Partner A", avatar: "/placeholder.svg?height=24&width=24" },
      { name: "Partner C", avatar: "/placeholder.svg?height=24&width=24" },
    ],
    decision: "pending",
    highlights: [
      "Growing market demand",
      "Cost-competitive with plastic",
      "Strong IP portfolio",
    ],
    concerns: [],
    icStatus: "scheduled",
  },
  {
    id: "6",
    name: "FinFlow",
    tagline: "Automated financial reconciliation",
    sector: "Fintech",
    recommendation: "yes",
    icMemoStatus: "complete",
    icDate: "Jan 30, 2026",
    icTime: "11:00 AM",
    daysInIC: 4,
    lead: "Rahul Verma",
    leadAvatar: "/placeholder.svg?height=32&width=32",
    investment: "₹4 Cr",
    equity: "25%",
    preMoney: "₹12 Cr",
    postMoney: "₹16 Cr",
    leadInvestor: "Anthill",
    leadAmount: "₹3 Cr",
    coInvestors: "₹1 Cr",
    icMembers: [
      { name: "Partner B", avatar: "/placeholder.svg?height=24&width=24" },
      { name: "Partner D", avatar: "/placeholder.svg?height=24&width=24" },
    ],
    decision: "pending",
    highlights: [
      "Strong product-market fit",
      "Low CAC, high retention",
      "Scalable tech platform",
    ],
    concerns: [],
    icStatus: "scheduled",
  },
  {
    id: "7",
    name: "EduSpark",
    tagline: "Personalized learning platform",
    sector: "EdTech",
    recommendation: "not-ready",
    icMemoStatus: "draft",
    icDate: null,
    icTime: null,
    daysInIC: 3,
    lead: "Priya Sharma",
    leadAvatar: "/placeholder.svg?height=32&width=32",
    investment: "₹7 Cr",
    equity: "20%",
    preMoney: "₹28 Cr",
    postMoney: "₹35 Cr",
    leadInvestor: "Anthill",
    leadAmount: "₹5 Cr",
    coInvestors: "₹2 Cr",
    icMembers: [],
    decision: "pending",
    highlights: [],
    concerns: [
      "IC memo incomplete",
      "Need financial projections",
    ],
    icStatus: "awaiting-date",
  },
]

// Helper Functions
function getRecommendationBadge(rec: ICStartup["recommendation"]) {
  switch (rec) {
    case "strong-yes":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
          <Star className="w-3 h-3 mr-1 fill-current" />
          Strong Yes
        </Badge>
      )
    case "yes":
      return (
        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Yes
        </Badge>
      )
    case "maybe":
      return (
        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
          <HelpCircle className="w-3 h-3 mr-1" />
          Maybe
        </Badge>
      )
    case "no":
      return (
        <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
          <XCircle className="w-3 h-3 mr-1" />
          No
        </Badge>
      )
    case "not-ready":
      return (
        <Badge className="bg-gray-500/10 text-gray-600 border-gray-500/20">
          <Pause className="w-3 h-3 mr-1" />
          Not Ready
        </Badge>
      )
  }
}

function getICDateDisplay(startup: ICStartup) {
  if (!startup.icDate) {
    return (
      <div className="flex items-center gap-1 text-amber-600">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">Not scheduled</span>
      </div>
    )
  }
  
  if (startup.icDate === "Tomorrow") {
    return (
      <div className="flex items-center gap-1 text-red-600">
        <Flame className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">Tomorrow {startup.icTime}</span>
      </div>
    )
  }
  
  // Parse days until IC
  const daysMatch = startup.icDate.match(/(\d+)\s*days?/)
  if (daysMatch) {
    const days = parseInt(daysMatch[1])
    const color = days <= 3 ? "text-amber-600" : "text-emerald-600"
    return (
      <div className={`flex items-center gap-1 ${color}`}>
        <Calendar className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">{startup.icDate} {startup.icTime}</span>
      </div>
    )
  }
  
  return (
    <div className="flex items-center gap-1 text-emerald-600">
      <Calendar className="w-3.5 h-3.5" />
      <span className="text-xs font-medium">{startup.icDate} {startup.icTime}</span>
    </div>
  )
}

function getICStatusBadge(status: ICStartup["icStatus"]) {
  switch (status) {
    case "scheduled":
      return <Badge variant="outline" className="text-xs">Scheduled</Badge>
    case "awaiting-date":
      return <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">Awaiting Date</Badge>
    case "in-meeting":
      return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-xs">In Meeting</Badge>
    case "decision-pending":
      return <Badge variant="outline" className="text-xs text-amber-600">Decision Pending</Badge>
    case "approved":
      return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">Approved</Badge>
    case "rejected":
      return <Badge className="bg-red-500/10 text-red-600 border-red-500/20 text-xs">Rejected</Badge>
    case "deferred":
      return <Badge className="bg-gray-500/10 text-gray-600 border-gray-500/20 text-xs">Deferred</Badge>
  }
}

// Components
interface ICCardProps {
  startup: ICStartup
  onViewMemo: (startup: ICStartup) => void
  onScheduleIC: (startup: ICStartup) => void
  onUpdateStatus: (startup: ICStartup) => void
  onDefer?: (startup: ICStartup) => void
  selected?: boolean
  onToggleSelect?: (id: string) => void
}

function ICCard({ startup, onViewMemo, onScheduleIC, onUpdateStatus, onDefer, selected, onToggleSelect }: ICCardProps) {
  return (
    <Card className="group hover:shadow-md transition-all overflow-hidden">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          {onToggleSelect && (
            <Checkbox
              checked={selected}
              onCheckedChange={() => onToggleSelect(startup.id)}
              className="mt-1 shrink-0"
            />
          )}
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <Link
                href={`/startups/${startup.id}`}
                className="font-medium text-foreground truncate hover:text-primary transition-colors"
              >
                {startup.name}
              </Link>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    type="button"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="z-[100]">
                  <DropdownMenuItem onClick={() => onViewMemo(startup)}>
                    <FileText className="w-4 h-4 mr-2" />
                    View IC Memo
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onScheduleIC(startup)}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule IC
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-amber-600" onClick={() => onDefer?.(startup)}>
                    <Pause className="w-4 h-4 mr-2" />
                    Defer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-xs text-muted-foreground truncate">{startup.tagline}</p>
          </div>
        </div>

        {/* Recommendation Badge */}
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          {getRecommendationBadge(startup.recommendation)}
          {getICStatusBadge(startup.icStatus)}
        </div>

        {/* Sector & Stage */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {startup.sector}
          </Badge>
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
            <Scale className="w-3 h-3 mr-1" />
            IC Review
          </Badge>
        </div>

        {/* IC Memo Status */}
        <div className="mt-3 flex items-center gap-2 text-sm">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">IC Memo:</span>
          {startup.icMemoStatus === "complete" ? (
            <span className="text-emerald-600 flex items-center gap-1">
              Complete <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          ) : startup.icMemoStatus === "draft" ? (
            <span className="text-amber-600">Draft</span>
          ) : (
            <span className="text-gray-500">Pending</span>
          )}
        </div>

        {/* Lead */}
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Lead:</span>
          <div className="flex items-center gap-1.5">
            <Avatar className="h-5 w-5">
              <AvatarImage src={startup.leadAvatar || "/placeholder.svg"} />
              <AvatarFallback className="text-[10px]">{startup.lead.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <span className="text-foreground">@{startup.lead}</span>
          </div>
        </div>

        {/* Deal Terms */}
        <div className="mt-3 p-2.5 bg-muted/50 rounded-lg space-y-1.5">
          <div className="flex items-center gap-1 text-sm font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
            Deal Terms
          </div>
          <div className="text-xs text-muted-foreground">
            <span className="text-foreground font-medium">{startup.investment}</span> for {startup.equity} equity
          </div>
          <div className="text-xs text-muted-foreground">
            Pre: {startup.preMoney} • Post: {startup.postMoney}
          </div>
          <div className="text-xs text-muted-foreground">
            Lead: {startup.leadInvestor} ({startup.leadAmount}) + Co-inv ({startup.coInvestors})
          </div>
        </div>

        {/* IC Meeting Info */}
        <div className="mt-3 flex items-center justify-between">
          {getICDateDisplay(startup)}
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">{startup.daysInIC}d in IC</span>
          </div>
        </div>

        {/* IC Members */}
        {startup.icMembers.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">IC:</span>
            <div className="flex -space-x-1.5">
              {startup.icMembers.slice(0, 4).map((member, i) => (
                <Avatar key={i} className="h-5 w-5 border-2 border-background">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-[8px]">{member.name.split(" ")[1]?.[0] || member.name[0]}</AvatarFallback>
                </Avatar>
              ))}
              {startup.icMembers.length > 4 && (
                <div className="h-5 w-5 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[8px] font-medium">
                  +{startup.icMembers.length - 4}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Highlights or Concerns */}
        {(startup.highlights.length > 0 || startup.concerns.length > 0) && (
          <div className="mt-3 space-y-1">
            {startup.highlights.length > 0 && (
              <>
                <div className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Key Highlights
                </div>
                <ul className="text-xs text-muted-foreground space-y-0.5 pl-4">
                  {startup.highlights.slice(0, 2).map((h, i) => (
                    <li key={i} className="list-disc">{h}</li>
                  ))}
                </ul>
              </>
            )}
            {startup.concerns.length > 0 && (
              <>
                <div className="text-xs font-medium text-amber-600 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Key Concerns
                </div>
                <ul className="text-xs text-muted-foreground space-y-0.5 pl-4">
                  {startup.concerns.slice(0, 2).map((c, i) => (
                    <li key={i} className="list-disc">{c}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 pt-3 border-t flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent" onClick={() => onViewMemo(startup)}>
            <FileText className="w-3.5 h-3.5 mr-1" />
            View Memo
          </Button>
          {startup.icDate ? (
            <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent" onClick={() => onUpdateStatus(startup)}>
              <Vote className="w-3.5 h-3.5 mr-1" />
              Update Status
            </Button>
          ) : (
            <Button size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={() => onScheduleIC(startup)}>
              <Calendar className="w-3.5 h-3.5 mr-1" />
              Schedule IC
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Main Page Component
export default function ICReviewStagePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [startups, setStartups] = useState<ICStartup[]>(initialICStartups)
  const [viewMode, setViewMode] = useState<"grid" | "list" | "table">("grid")
  const [sortBy, setSortBy] = useState("ic-date")
  const [searchQuery, setSearchQuery] = useState("")
  const [icStatusFilter, setICStatusFilter] = useState("all")
  const [recommendationFilter, setRecommendationFilter] = useState("all")
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [selectedStartups, setSelectedStartups] = useState<string[]>([])
  const [viewMemoStartup, setViewMemoStartup] = useState<ICStartup | null>(null)
  const [scheduleICStartup, setScheduleICStartup] = useState<ICStartup | null>(null)
  const [updateStatusStartup, setUpdateStatusStartup] = useState<ICStartup | null>(null)
  const [deferStartup, setDeferStartup] = useState<ICStartup | null>(null)
  const [memoSection, setMemoSection] = useState("summary")
  const [memoComment, setMemoComment] = useState("")
  const [quickActionDialog, setQuickActionDialog] = useState<"schedule" | "memo" | "export" | null>(null)
  const lastExportRef = useRef(0)
  const lastCommentRef = useRef(0)

  const handleExportMemoPdf = useCallback(() => {
    if (Date.now() - lastExportRef.current < 400) return
    lastExportRef.current = Date.now()
    toast({ title: "Export started", description: `IC Memo for ${viewMemoStartup?.name ?? "deal"} is being exported as PDF.` })
    setTimeout(() => window.print(), 300)
  }, [viewMemoStartup?.name, toast])

  const handleAddMemoComment = useCallback(() => {
    if (Date.now() - lastCommentRef.current < 400) return
    lastCommentRef.current = Date.now()
    const trimmed = memoComment.trim()
    if (!trimmed) {
      toast({ title: "Comment required", description: "Please enter a comment before adding." })
      return
    }
    toast({ title: "Comment added", description: "Your comment has been added to the IC discussion." })
    setMemoComment("")
  }, [memoComment, toast])

  useEffect(() => {
    if (!viewMemoStartup) setMemoComment("")
  }, [viewMemoStartup])

  const activeFilterCount = [icStatusFilter !== "all", recommendationFilter !== "all"].filter(Boolean).length

  const filteredAndSortedStartups = useMemo(() => {
    let list = startups.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tagline.toLowerCase().includes(searchQuery.toLowerCase())
      if (!matchesSearch) return false
      if (icStatusFilter !== "all" && s.icStatus !== icStatusFilter) return false
      if (recommendationFilter !== "all" && s.recommendation !== recommendationFilter) return false
      return true
    })
    const sorted = [...list].sort((a, b) => {
      switch (sortBy) {
        case "ic-date":
          if (!a.icDate && !b.icDate) return b.daysInIC - a.daysInIC
          if (!a.icDate) return 1
          if (!b.icDate) return -1
          if (a.icDate === "Tomorrow" && b.icDate !== "Tomorrow") return -1
          if (b.icDate === "Tomorrow" && a.icDate !== "Tomorrow") return 1
          return 0
        case "deal-size": {
          const numA = parseFloat(a.investment.replace(/[^\d.]/g, "")) || 0
          const numB = parseFloat(b.investment.replace(/[^\d.]/g, "")) || 0
          return numB - numA
        }
        case "recommendation": {
          const order = ["strong-yes", "yes", "maybe", "no", "not-ready"]
          return order.indexOf(a.recommendation) - order.indexOf(b.recommendation)
        }
        case "added-date":
        default:
          return b.daysInIC - a.daysInIC
      }
    })
    return sorted
  }, [startups, searchQuery, icStatusFilter, recommendationFilter, sortBy])

  const handleDefer = useCallback((startup: ICStartup) => setDeferStartup(startup), [])
  const handleDeferConfirm = useCallback(() => {
    if (!deferStartup) return
    setStartups((prev) => prev.filter((s) => s.id !== deferStartup.id))
    setDeferStartup(null)
    toast({ title: "Deal deferred", description: `${deferStartup.name} has been deferred from IC Review.` })
  }, [deferStartup, toast])

  const handleScheduleICConfirm = useCallback(() => {
    if (scheduleICStartup) {
      toast({ title: "IC meeting scheduled", description: `${scheduleICStartup.name} - IC meeting has been scheduled.` })
      setScheduleICStartup(null)
    }
  }, [scheduleICStartup, toast])

  const handleUpdateStatusConfirm = useCallback(() => {
    if (updateStatusStartup) {
      toast({ title: "Decision saved", description: `IC decision for ${updateStatusStartup.name} has been recorded.` })
      setUpdateStatusStartup(null)
    }
  }, [updateStatusStartup, toast])

  const toggleSelectStartup = (id: string) => {
    setSelectedStartups(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    if (selectedStartups.length === filteredAndSortedStartups.length) {
      setSelectedStartups([])
    } else {
      setSelectedStartups(filteredAndSortedStartups.map(s => s.id))
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader title="IC Review" />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/role-selection" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/pipeline" className="hover:text-foreground transition-colors">Pipeline</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/startups" className="hover:text-foreground transition-colors">By Stage</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">IC Review</span>
          </nav>

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-foreground">IC Review</h1>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  <Scale className="w-3.5 h-3.5 mr-1" />
                  IC Review
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">{startups.length} startups awaiting investment committee decision</p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center border border-border rounded-lg p-1 bg-muted/30">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-md"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-md"
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-md"
                  onClick={() => setViewMode("table")}
                  aria-label="Table view"
                >
                  <Table2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ic-date">IC Date</SelectItem>
                  <SelectItem value="added-date">Added Date</SelectItem>
                  <SelectItem value="deal-size">Deal Size</SelectItem>
                  <SelectItem value="recommendation">Recommendation</SelectItem>
                </SelectContent>
              </Select>



              {/* Add Startup */}
              <Button size="sm" className="h-9" onClick={() => setQuickAddOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Startup
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">In IC Review</p>
                    <p className="text-2xl font-semibold">{startups.length}</p>
                  </div>
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Scale className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Pending decision</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Next IC</p>
                    <p className="text-2xl font-semibold">Tomorrow</p>
                  </div>
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">2 startups scheduled</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Approved</p>
                    <p className="text-2xl font-semibold">5/12</p>
                  </div>
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Approval Rate</p>
                    <p className="text-2xl font-semibold">68%</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-emerald-600 mt-2">+5% vs last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-3 mb-6 p-3 bg-muted/30 rounded-lg border">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search startups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            <Select value={icStatusFilter} onValueChange={setICStatusFilter}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="IC Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="awaiting-date">Awaiting IC Date</SelectItem>
                <SelectItem value="in-meeting">In IC Meeting</SelectItem>
                <SelectItem value="decision-pending">Decision Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="deferred">Deferred</SelectItem>
              </SelectContent>
            </Select>

            <Select value={recommendationFilter} onValueChange={setRecommendationFilter}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Recommendation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Recommendations</SelectItem>
                <SelectItem value="strong-yes">Strong Yes</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="maybe">Maybe/Discuss</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="not-ready">Not Ready</SelectItem>
              </SelectContent>
            </Select>

          </div>

          {/* Bulk Actions */}
          {selectedStartups.length > 0 && (
            <div className="flex items-center gap-3 mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <Checkbox
                checked={selectedStartups.length === filteredAndSortedStartups.length}
                onCheckedChange={selectAll}
              />
              <span className="text-sm font-medium">{selectedStartups.length} selected</span>
              <div className="flex items-center gap-2 ml-auto">
                <Button variant="outline" size="sm" onClick={() => toast({ title: "Schedule IC", description: `Scheduling IC for ${selectedStartups.length} startup(s).` })}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule IC
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast({ title: "Export started", description: "Memos export has been started." })}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Memos
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast({ title: "Reminders sent", description: `Reminders sent to ${selectedStartups.length} deal lead(s).` })}>
                  <Send className="w-4 h-4 mr-2" />
                  Send Reminders
                </Button>
              </div>
            </div>
          )}

          {/* Content Grid */}
          <div className="flex gap-6">
            {/* Main Grid */}
            <div className="flex-1">
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredAndSortedStartups.map((startup) => (
                    <ICCard
                      key={startup.id}
                      startup={startup}
                      onViewMemo={setViewMemoStartup}
                      onScheduleIC={setScheduleICStartup}
                      onUpdateStatus={setUpdateStatusStartup}
                      onDefer={handleDefer}
                      selected={selectedStartups.includes(startup.id)}
                      onToggleSelect={toggleSelectStartup}
                    />
                  ))}
                </div>
              )}

              {viewMode === "list" && (
                <div className="space-y-3">
                  {filteredAndSortedStartups.map((startup) => (
                    <Card key={startup.id} className="hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Checkbox
                            checked={selectedStartups.includes(startup.id)}
                            onCheckedChange={() => toggleSelectStartup(startup.id)}
                          />
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Link href={`/startups/${startup.id}`} className="font-medium hover:text-primary">
                                {startup.name}
                              </Link>
                              {getRecommendationBadge(startup.recommendation)}
                              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">IC Review</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{startup.tagline}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{startup.investment}</div>
                            <div className="text-sm text-muted-foreground">{startup.equity} equity</div>
                          </div>
                          <div className="text-right min-w-[120px]">
                            {getICDateDisplay(startup)}
                            <div className="text-xs text-muted-foreground mt-1">{startup.daysInIC}d in IC</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setViewMemoStartup(startup)}>
                              View Memo
                            </Button>
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" type="button">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="z-[100]">
                                <DropdownMenuItem onClick={() => setScheduleICStartup(startup)}>Schedule IC</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setUpdateStatusStartup(startup)}>Update Status</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-amber-600" onClick={() => handleDefer(startup)}>Defer</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {viewMode === "table" && (
                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-3 text-left">
                            <Checkbox
                              checked={selectedStartups.length === filteredAndSortedStartups.length}
                              onCheckedChange={selectAll}
                            />
                          </th>
                          <th className="p-3 text-left text-sm font-medium">Startup</th>
                          <th className="p-3 text-left text-sm font-medium">Recommendation</th>
                          <th className="p-3 text-left text-sm font-medium">IC Memo</th>
                          <th className="p-3 text-left text-sm font-medium">Deal Size</th>
                          <th className="p-3 text-left text-sm font-medium">IC Date</th>
                          <th className="p-3 text-left text-sm font-medium">Lead</th>
                          <th className="p-3 text-left text-sm font-medium">Days in IC</th>
                          <th className="p-3 text-left text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAndSortedStartups.map((startup) => (
                          <tr key={startup.id} className="border-b hover:bg-muted/30">
                            <td className="p-3">
                              <Checkbox
                                checked={selectedStartups.includes(startup.id)}
                                onCheckedChange={() => toggleSelectStartup(startup.id)}
                              />
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border flex items-center justify-center">
                                  <Building2 className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div>
                                  <Link href={`/startups/${startup.id}`} className="font-medium hover:text-primary">
                                    {startup.name}
                                  </Link>
                                  <p className="text-xs text-muted-foreground">{startup.sector}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">{getRecommendationBadge(startup.recommendation)}</td>
                            <td className="p-3">
                              {startup.icMemoStatus === "complete" ? (
                                <span className="text-emerald-600 flex items-center gap-1 text-sm">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                                </span>
                              ) : (
                                <span className="text-amber-600 text-sm">{startup.icMemoStatus}</span>
                              )}
                            </td>
                            <td className="p-3">
                              <div className="font-medium">{startup.investment}</div>
                              <div className="text-xs text-muted-foreground">{startup.equity}</div>
                            </td>
                            <td className="p-3">{getICDateDisplay(startup)}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-1.5">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={startup.leadAvatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-[10px]">{startup.lead[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{startup.lead}</span>
                              </div>
                            </td>
                            <td className="p-3 text-sm">{startup.daysInIC}d</td>
                            <td className="p-3">
                              <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" type="button">
                                    Actions <ChevronDown className="w-4 h-4 ml-1" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="z-[100]">
                                  <DropdownMenuItem onClick={() => setViewMemoStartup(startup)}>View Memo</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setScheduleICStartup(startup)}>Schedule IC</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setUpdateStatusStartup(startup)}>Update Status</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-amber-600" onClick={() => handleDefer(startup)}>Defer</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {filteredAndSortedStartups.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Scale className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-1">No startups in IC Review</h3>
                  <p className="text-sm text-muted-foreground mb-4">Startups move here after completing due diligence</p>
                  <Button variant="outline" asChild>
                    <Link href="/startups/stages/due-diligence">View Due Diligence</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="w-80 shrink-0 space-y-4">
              {/* Upcoming IC Meetings */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Upcoming IC Meetings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                    <div>
                      <div className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5" />
                        Tomorrow
                      </div>
                      <div className="text-xs text-muted-foreground">PayFlow, CloudAI</div>
                    </div>
                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">2</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium">Jan 28</div>
                      <div className="text-xs text-muted-foreground">TechCorp AI, GreenLeaf</div>
                    </div>
                    <Badge variant="secondary">2</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium">Jan 30</div>
                      <div className="text-xs text-muted-foreground">FinFlow</div>
                    </div>
                    <Badge variant="secondary">1</Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => router.push("/analytics")}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    View IC Calendar
                  </Button>
                </CardContent>
              </Card>

              {/* IC Performance */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    IC Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">IC meetings this month</span>
                    <span className="font-medium">4</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Deals reviewed</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-emerald-600">Approved</span>
                    <span className="font-medium text-emerald-600">8 (67%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-600">Rejected</span>
                    <span className="font-medium text-red-600">3 (25%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-amber-600">Deferred</span>
                    <span className="font-medium text-amber-600">1 (8%)</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              {/* Action Items */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Action Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/50">
                    <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100">2 IC memos need review</p>
                      <p className="text-xs text-amber-700/80 dark:text-amber-300/70">EduSpark, HealthBridge</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/50">
                    <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100">3 meetings need scheduling</p>
                      <p className="text-xs text-amber-700/80 dark:text-amber-300/70">HealthBridge, EduSpark +1</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg">
                    <Gavel className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">1 decision pending documentation</p>
                      <p className="text-xs text-muted-foreground">DataSync (approved Jan 20)</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => { setICStatusFilter("awaiting-date"); setRecommendationFilter("all"); }}
                  >
                    View All Items
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => setQuickActionDialog("schedule")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule IC Meeting
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => setQuickActionDialog("memo")}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Create IC Memo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => setQuickActionDialog("export")}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export All Memos
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <QuickAddModal open={quickAddOpen} onOpenChange={setQuickAddOpen} />

      {/* Defer confirmation */}
      <Dialog open={!!deferStartup} onOpenChange={() => setDeferStartup(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Defer {deferStartup?.name} from IC Review?</DialogTitle>
            <DialogDescription>
              This deal will be deferred and removed from the current IC queue. You can bring it back to IC Review later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeferStartup(null)}>Cancel</Button>
            <Button variant="secondary" onClick={handleDeferConfirm}>
              <Pause className="w-4 h-4 mr-2" />
              Defer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
      

      {/* Quick Actions dialog (right panel) */}
      <Dialog open={quickActionDialog != null} onOpenChange={(open) => !open && setQuickActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {quickActionDialog === "schedule" && "Schedule IC Meeting"}
              {quickActionDialog === "memo" && "Create IC Memo"}
              {quickActionDialog === "export" && "Export All Memos"}
            </DialogTitle>
            <DialogDescription>
              {quickActionDialog === "schedule" && "Schedule a new investment committee meeting. You can add deals from the list or schedule for multiple startups."}
              {quickActionDialog === "memo" && "Create a new IC memo for a deal. Select a startup from the list to start."}
              {quickActionDialog === "export" && "Export all IC memos as PDF or add to a report."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuickActionDialog(null)}>Cancel</Button>
            <Button
              onClick={() => {
                setQuickActionDialog(null)
                toast({ title: quickActionDialog === "export" ? "Export started" : "Action started", description: "Your request has been submitted." })
              }}
            >
              {quickActionDialog === "export" ? "Export" : "Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View IC Memo Sheet */}
      <Sheet open={!!viewMemoStartup} onOpenChange={() => setViewMemoStartup(null)}>
        <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto p-8">
          {viewMemoStartup && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  IC Memo - {viewMemoStartup.name}
                </SheetTitle>
                <SheetDescription>
                  Investment committee presentation document
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getRecommendationBadge(viewMemoStartup.recommendation)}
                    <Badge variant="outline">
                      {viewMemoStartup.icMemoStatus === "complete" ? "Complete" : "Draft"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onPointerDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleExportMemoPdf()
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleExportMemoPdf()
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </div>

                <Tabs value={memoSection} onValueChange={setMemoSection}>
                  <TabsList className="w-full grid grid-cols-4">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    <TabsTrigger value="financials">Financials</TabsTrigger>
                    <TabsTrigger value="recommendation">Rec.</TabsTrigger>
                  </TabsList>
                  <TabsContent value="summary" className="mt-4 space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Executive Summary</h4>
                      <p className="text-sm text-muted-foreground">
                        {viewMemoStartup.name} is a {viewMemoStartup.sector} startup focused on {viewMemoStartup.tagline.toLowerCase()}.
                        The company has demonstrated strong traction and is seeking {viewMemoStartup.investment} for {viewMemoStartup.equity} equity.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Investment Thesis</h4>
                      <p className="text-sm text-muted-foreground">
                        Strong market opportunity in the {viewMemoStartup.sector} space with experienced founding team.
                        Clear path to market leadership with defensible technology moat.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Deal Terms</h4>
                      <div className="p-3 bg-muted/50 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Investment Amount</span>
                          <span className="font-medium">{viewMemoStartup.investment}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Equity</span>
                          <span className="font-medium">{viewMemoStartup.equity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pre-money Valuation</span>
                          <span className="font-medium">{viewMemoStartup.preMoney}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Post-money Valuation</span>
                          <span className="font-medium">{viewMemoStartup.postMoney}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="analysis" className="mt-4 space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Market Opportunity</h4>
                      <p className="text-sm text-muted-foreground">
                        Large addressable market with significant growth potential. 
                        Current market size estimated at $XX billion with XX% CAGR.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Competitive Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        Key competitors include established players and emerging startups.
                        Differentiation through technology and go-to-market strategy.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Team Assessment</h4>
                      <p className="text-sm text-muted-foreground">
                        Experienced founding team with relevant domain expertise.
                        Strong track record of execution and ability to attract talent.
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="financials" className="mt-4 space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Financial Projections</h4>
                      <div className="p-3 bg-muted/50 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Revenue (Current)</span>
                          <span className="font-medium">₹2.5 Cr ARR</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Revenue (Year 1)</span>
                          <span className="font-medium">₹8 Cr</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Revenue (Year 3)</span>
                          <span className="font-medium">₹50 Cr</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gross Margin</span>
                          <span className="font-medium">75%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Use of Funds</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "50%" }}></div>
                          </div>
                          <span className="text-xs text-muted-foreground w-20">50% Product</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                          </div>
                          <span className="text-xs text-muted-foreground w-20">30% Sales</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-amber-500 h-2 rounded-full" style={{ width: "20%" }}></div>
                          </div>
                          <span className="text-xs text-muted-foreground w-20">20% Ops</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="recommendation" className="mt-4 space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Investment Recommendation</h4>
                      <div className="flex items-center gap-2 mb-3">
                        {getRecommendationBadge(viewMemoStartup.recommendation)}
                        <span className="text-sm text-muted-foreground">by @{viewMemoStartup.lead}</span>
                      </div>
                      {viewMemoStartup.highlights.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-emerald-600 mb-2">Key Highlights</h5>
                          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                            {viewMemoStartup.highlights.map((h, i) => (
                              <li key={i}>{h}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {viewMemoStartup.concerns.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-amber-600 mb-2">Key Concerns</h5>
                          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                            {viewMemoStartup.concerns.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Risk Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        Key risks include market competition, execution challenges, and regulatory considerations.
                        Mitigating factors include strong team and technology differentiation.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-medium mb-3">IC Discussion</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>PA</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">Partner A</span>
                        <span className="text-xs text-muted-foreground">2 days ago</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Strong team and clear market opportunity. Would like to discuss burn rate during IC.
                      </p>
                    </div>
                    <Textarea
                      placeholder="Add a comment..."
                      className="min-h-[80px]"
                      value={memoComment}
                      onChange={(e) => setMemoComment(e.target.value)}
                    />
                    <Button
                      size="sm"
                      type="button"
                      onPointerDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleAddMemoComment()
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleAddMemoComment()
                      }}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Add Comment
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Schedule IC Modal */}
      <Dialog open={!!scheduleICStartup} onOpenChange={() => setScheduleICStartup(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule IC Meeting</DialogTitle>
            <DialogDescription>
              {scheduleICStartup?.name} - Set up the investment committee meeting
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input type="time" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Select defaultValue="60">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>IC Members (required)</Label>
              <div className="space-y-2 p-3 border rounded-lg">
                {["Partner A", "Partner B", "Partner C", "Partner D"].map((partner) => (
                  <div key={partner} className="flex items-center gap-2">
                    <Checkbox id={partner} defaultChecked={partner !== "Partner D"} />
                    <Label htmlFor={partner} className="text-sm font-normal">{partner}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Presenter</Label>
              <Select defaultValue={scheduleICStartup?.lead}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Priya Sharma">@Priya Sharma</SelectItem>
                  <SelectItem value="Amit Kumar">@Amit Kumar</SelectItem>
                  <SelectItem value="Rahul Verma">@Rahul Verma</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Meeting Platform</Label>
              <Select defaultValue="zoom">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="teams">Microsoft Teams</SelectItem>
                  <SelectItem value="meet">Google Meet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Send calendar invites</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox id="inv-ic" defaultChecked />
                  <Label htmlFor="inv-ic" className="text-sm font-normal">IC Members</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="inv-presenter" defaultChecked />
                  <Label htmlFor="inv-presenter" className="text-sm font-normal">Presenter</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="inv-analyst" />
                  <Label htmlFor="inv-analyst" className="text-sm font-normal">Analyst team</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleICStartup(null)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleScheduleICConfirm}>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Modal */}
      <Dialog open={!!updateStatusStartup} onOpenChange={() => setUpdateStatusStartup(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>IC Decision</DialogTitle>
            <DialogDescription>
              {updateStatusStartup?.name} - Record the investment committee decision
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Decision</Label>
              <RadioGroup defaultValue="approved">
                <div className="flex items-center space-x-2 p-2 border rounded-lg">
                  <RadioGroupItem value="approved" id="approved" />
                  <Label htmlFor="approved" className="flex-1 cursor-pointer">
                    <span className="font-medium text-emerald-600">Approved</span>
                    <span className="text-sm text-muted-foreground block">Proceed to term sheet</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 border rounded-lg">
                  <RadioGroupItem value="approved-conditions" id="approved-conditions" />
                  <Label htmlFor="approved-conditions" className="flex-1 cursor-pointer">
                    <span className="font-medium text-amber-600">Approved with conditions</span>
                    <span className="text-sm text-muted-foreground block">Requires additional steps</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 border rounded-lg">
                  <RadioGroupItem value="deferred" id="deferred" />
                  <Label htmlFor="deferred" className="flex-1 cursor-pointer">
                    <span className="font-medium text-gray-600">Deferred</span>
                    <span className="text-sm text-muted-foreground block">Need more information</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 border rounded-lg">
                  <RadioGroupItem value="rejected" id="rejected" />
                  <Label htmlFor="rejected" className="flex-1 cursor-pointer">
                    <span className="font-medium text-red-600">Rejected</span>
                    <span className="text-sm text-muted-foreground block">Pass on this opportunity</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label>Vote Results</Label>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-2 border rounded-lg text-center">
                  <div className="text-lg font-semibold text-emerald-600">3</div>
                  <div className="text-xs text-muted-foreground">Yes</div>
                </div>
                <div className="p-2 border rounded-lg text-center">
                  <div className="text-lg font-semibold text-red-600">0</div>
                  <div className="text-xs text-muted-foreground">No</div>
                </div>
                <div className="p-2 border rounded-lg text-center">
                  <div className="text-lg font-semibold text-gray-600">0</div>
                  <div className="text-xs text-muted-foreground">Abstain</div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Conditions (if applicable)</Label>
              <Textarea placeholder="Enter any conditions for approval..." />
            </div>
            <div className="space-y-2">
              <Label>Next Steps</Label>
              <Textarea placeholder="Describe the next steps..." />
            </div>
            <div className="space-y-2">
              <Label>Internal Notes</Label>
              <Textarea placeholder="Any additional notes from the IC..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateStatusStartup(null)}>Cancel</Button>
            <Button onClick={handleUpdateStatusConfirm}>
              <Gavel className="w-4 h-4 mr-2" />
              Save Decision
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}

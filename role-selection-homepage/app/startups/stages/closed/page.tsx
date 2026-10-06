"use client"

import { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Table,
  ChevronDown,
  MoreHorizontal,
  Building2,
  Calendar,
  Clock,
  User,
  Target,
  CheckCircle2,
  XCircle,
  TrendingUp,
  FileText,
  Archive,
  RotateCcw,
  MessageSquare,
  Briefcase,
  Trophy,
  ThumbsDown,
  PartyPopper,
  AlertCircle,
  ChevronRight,
  Banknote,
  Users,
  BarChart3,
  CalendarClock,
  ExternalLink,
  Download,
  Bell,
  X,
  Check,
  ArrowRight,
  Home,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Toaster } from "@/components/ui/toaster"

// Types
interface ClosedStartup {
  id: string
  name: string
  tagline: string
  sector: string
  status: "won" | "lost"
  closedDate: string
  daysAgo: number
  pipelineDuration: number
  dealLead: {
    name: string
    avatar?: string
  }
  // Won specific
  investment?: {
    amount: string
    equity: string
    preValuation: string
    postValuation: string
    round: string
  }
  postInvestment?: {
    boardSeat: boolean
    nextUpdate: string
    portfolioStatus: string
    fundsDeployed?: boolean
    coInvestors?: string[]
  }
  // Lost specific
  passReason?: {
    category: string
    details: string[]
  }
  exitedAt?: string
  founderFeedback?: boolean
  reEvaluate?: string
}

// Sample data
const closedStartups: ClosedStartup[] = [
  {
    id: "1",
    name: "TechCorp AI",
    tagline: "AI-powered financial document analysis",
    sector: "Fintech",
    status: "won",
    closedDate: "Jan 15, 2026",
    daysAgo: 9,
    pipelineDuration: 45,
    dealLead: { name: "Priya Sharma", avatar: "/placeholder.svg" },
    investment: {
      amount: "₹5.25 Cr",
      equity: "20%",
      preValuation: "₹21 Cr",
      postValuation: "₹26.25 Cr",
      round: "Seed",
    },
    postInvestment: {
      boardSeat: true,
      nextUpdate: "Feb 15, 2026",
      portfolioStatus: "Active monitoring",
    },
  },
  {
    id: "2",
    name: "HealthBridge",
    tagline: "Digital health platform for rural India",
    sector: "HealthTech",
    status: "won",
    closedDate: "Dec 28, 2025",
    daysAgo: 27,
    pipelineDuration: 62,
    dealLead: { name: "Amit Patel", avatar: "/placeholder.svg" },
    investment: {
      amount: "₹12 Cr",
      equity: "15%",
      preValuation: "₹68 Cr",
      postValuation: "₹80 Cr",
      round: "Series A",
    },
    postInvestment: {
      boardSeat: false,
      nextUpdate: "Feb 1, 2026",
      portfolioStatus: "Active monitoring",
      fundsDeployed: true,
      coInvestors: ["Sequoia", "Matrix"],
    },
  },
  {
    id: "3",
    name: "CloudFlow Systems",
    tagline: "Cloud infrastructure automation platform",
    sector: "SaaS",
    status: "lost",
    closedDate: "Jan 10, 2026",
    daysAgo: 14,
    pipelineDuration: 38,
    dealLead: { name: "Rahul Mehta", avatar: "/placeholder.svg" },
    passReason: {
      category: "Market timing concerns",
      details: [
        "Too early stage for our mandate",
        "Strong competition from incumbents",
        "Team inexperience in go-to-market",
      ],
    },
    exitedAt: "IC Review",
    founderFeedback: true,
    reEvaluate: "Jan 2027",
  },
  {
    id: "4",
    name: "PayFlow",
    tagline: "Next-gen payment infrastructure",
    sector: "Fintech",
    status: "lost",
    closedDate: "Jan 5, 2026",
    daysAgo: 19,
    pipelineDuration: 28,
    dealLead: { name: "Priya Sharma", avatar: "/placeholder.svg" },
    passReason: {
      category: "Founder chose different investor",
      details: [
        "Received better terms from competitor",
        "Timing mismatch (we needed more DD)",
        "Amicable separation",
      ],
    },
    exitedAt: "Due Diligence",
    founderFeedback: true,
    reEvaluate: "Keep warm for next round",
  },
  {
    id: "5",
    name: "EduSpark",
    tagline: "Personalized learning platform for K-12",
    sector: "EdTech",
    status: "won",
    closedDate: "Dec 20, 2025",
    daysAgo: 35,
    pipelineDuration: 55,
    dealLead: { name: "Neha Gupta", avatar: "/placeholder.svg" },
    investment: {
      amount: "₹8 Cr",
      equity: "18%",
      preValuation: "₹36.5 Cr",
      postValuation: "₹44.5 Cr",
      round: "Seed",
    },
    postInvestment: {
      boardSeat: true,
      nextUpdate: "Feb 20, 2026",
      portfolioStatus: "Active monitoring",
      fundsDeployed: true,
    },
  },
  {
    id: "6",
    name: "DataStream",
    tagline: "Real-time data analytics platform",
    sector: "Enterprise",
    status: "lost",
    closedDate: "Dec 15, 2025",
    daysAgo: 40,
    pipelineDuration: 22,
    dealLead: { name: "Vikram Singh", avatar: "/placeholder.svg" },
    passReason: {
      category: "Valuation concerns",
      details: [
        "Asking valuation too high for stage",
        "Revenue multiple not justified",
        "Better opportunities in pipeline",
      ],
    },
    exitedAt: "Screening",
    founderFeedback: false,
    reEvaluate: "6 months",
  },
]

// Owner id to name for filtering
const ownerIdToName: Record<string, string> = {
  priya: "Priya Sharma",
  amit: "Amit Patel",
  rahul: "Rahul Mehta",
  neha: "Neha Gupta",
  vikram: "Vikram Singh",
}

// Component
export default function ClosedStagePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [startups, setStartups] = useState<ClosedStartup[]>(closedStartups)
  const [view, setView] = useState<"grid" | "list" | "table">("grid")
  const [statusFilter, setStatusFilter] = useState<"all" | "won" | "lost">("all")
  const [sectorFilter, setSectorFilter] = useState<string>("all")
  const [ownerFilter, setOwnerFilter] = useState<string>("all")
  const [timeRangeFilter, setTimeRangeFilter] = useState<string>("30")
  const [sortBy, setSortBy] = useState<string>("date")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStartups, setSelectedStartups] = useState<string[]>([])
  const [showViewDeal, setShowViewDeal] = useState(false)
  const [showViewHistory, setShowViewHistory] = useState(false)
  const [selectedStartup, setSelectedStartup] = useState<ClosedStartup | null>(null)
  const [showReopenModal, setShowReopenModal] = useState(false)
  const [showArchiveModal, setShowArchiveModal] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [bulkArchiveTarget, setBulkArchiveTarget] = useState<"selected" | null>(null)

  const filteredAndSortedStartups = useMemo(() => {
    let list = startups.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false
      if (sectorFilter !== "all" && s.sector.toLowerCase() !== sectorFilter.toLowerCase()) return false
      if (ownerFilter !== "all") {
        const ownerName = ownerIdToName[ownerFilter]
        if (!ownerName || s.dealLead.name !== ownerName) return false
      }
      if (timeRangeFilter !== "all") {
        const n = parseInt(timeRangeFilter, 10)
        if (!Number.isNaN(n) && s.daysAgo > n) return false
        if (timeRangeFilter === "quarter" && s.daysAgo > 90) return false
        if (timeRangeFilter === "year" && s.daysAgo > 365) return false
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!s.name.toLowerCase().includes(q) && !s.sector.toLowerCase().includes(q) && !s.tagline.toLowerCase().includes(q)) return false
      }
      return true
    })
    const sorted = [...list].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return b.daysAgo - a.daysAgo
        case "size":
          const amtA = a.status === "won" && a.investment ? parseFloat(a.investment.amount.replace(/[^0-9.]/g, "")) : 0
          const amtB = b.status === "won" && b.investment ? parseFloat(b.investment.amount.replace(/[^0-9.]/g, "")) : 0
          return amtB - amtA
        case "status":
          return (a.status === "won" ? 1 : 0) - (b.status === "won" ? 1 : 0)
        case "sector":
          return a.sector.localeCompare(b.sector)
        default:
          return 0
      }
    })
    return sorted
  }, [startups, statusFilter, sectorFilter, ownerFilter, timeRangeFilter, searchQuery, sortBy])

  const activeFilterCount = [
    statusFilter !== "all",
    sectorFilter !== "all",
    ownerFilter !== "all",
    timeRangeFilter !== "30" && timeRangeFilter !== "all",
  ].filter(Boolean).length

  const toggleSelectStartup = (id: string) => {
    setSelectedStartups((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const selectAllFiltered = useCallback(() => {
    if (selectedStartups.length === filteredAndSortedStartups.length) {
      setSelectedStartups([])
    } else {
      setSelectedStartups(filteredAndSortedStartups.map((s) => s.id))
    }
  }, [filteredAndSortedStartups, selectedStartups.length])

  const handleViewDeal = useCallback((startup: ClosedStartup) => {
    setSelectedStartup(startup)
    if (startup.status === "won") {
      setShowViewDeal(true)
    } else {
      setShowViewHistory(true)
    }
  }, [])

  const handleReopenConfirm = useCallback(() => {
    if (selectedStartup) {
      toast({ title: "Deal reopened", description: `${selectedStartup.name} has been moved back to the pipeline.` })
      setShowReopenModal(false)
      setSelectedStartup(null)
    }
  }, [selectedStartup, toast])

  const handleArchiveConfirm = useCallback(() => {
    if (bulkArchiveTarget === "selected" && selectedStartups.length > 0) {
      toast({ title: "Deals archived", description: `${selectedStartups.length} deal(s) archived. They can be restored from Archives.` })
      setStartups((prev) => prev.filter((s) => !selectedStartups.includes(s.id)))
      setSelectedStartups([])
      setBulkArchiveTarget(null)
      setShowArchiveModal(false)
    } else if (selectedStartup) {
      toast({ title: "Deal archived", description: `${selectedStartup.name} has been archived.` })
      setStartups((prev) => prev.filter((s) => s.id !== selectedStartup.id))
      setSelectedStartup(null)
      setShowArchiveModal(false)
    }
  }, [selectedStartup, selectedStartups.length, bulkArchiveTarget, toast])

  const handleBulkArchive = useCallback(() => {
    setSelectedStartup(null)
    setBulkArchiveTarget("selected")
    setShowArchiveModal(true)
  }, [])

  const stats = useMemo(() => {
    const won = startups.filter((s) => s.status === "won").length
    const lost = startups.filter((s) => s.status === "lost").length
    return {
      totalClosed: startups.length,
      closedWon: won,
      closedLost: lost,
      winRate: startups.length ? Math.round((won / startups.length) * 100) : 0,
    }
  }, [startups])

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader title="Closed Deals" />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/role-selection" className="hover:text-foreground flex items-center gap-1">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/pipeline" className="hover:text-foreground">
              Pipeline
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/startups" className="hover:text-foreground">
              By Stage
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Closed</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Column */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold text-foreground">Closed Deals</h1>
                    <Badge className="bg-gray-500 text-white">
                      <Target className="w-3 h-3 mr-1" />
                      Closed
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-1">
                    {stats.totalClosed} deals closed ({stats.closedWon} won, {stats.closedLost} lost)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  

                  {/* View Toggle */}
                  <div className="flex items-center border border-border rounded-lg p-1 bg-muted/30">
                    <Button
                      variant={view === "grid" ? "default" : "ghost"}
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-md"
                      onClick={() => setView("grid")}
                      aria-label="Grid view"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={view === "list" ? "default" : "ghost"}
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-md"
                      onClick={() => setView("list")}
                      aria-label="List view"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={view === "table" ? "default" : "ghost"}
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-md"
                      onClick={() => setView("table")}
                      aria-label="Table view"
                    >
                      <Table className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Close Date</SelectItem>
                      <SelectItem value="size">Deal Size</SelectItem>
                      <SelectItem value="status">Win/Loss</SelectItem>
                      <SelectItem value="sector">Sector</SelectItem>
                    </SelectContent>
                  </Select>

                  
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                        <Target className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stats.totalClosed}</p>
                        <p className="text-xs text-muted-foreground">Total Closed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stats.closedWon}</p>
                        <p className="text-xs text-muted-foreground">Closed Won</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stats.closedLost}</p>
                        <p className="text-xs text-muted-foreground">Closed Lost</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stats.winRate}%</p>
                        <p className="text-xs text-muted-foreground">Win Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filter Bar */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search closed deals..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | "won" | "lost")}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="won">Closed Won</SelectItem>
                          <SelectItem value="lost">Closed Lost</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={sectorFilter} onValueChange={setSectorFilter}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Sector" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Sectors</SelectItem>
                          <SelectItem value="fintech">Fintech</SelectItem>
                          <SelectItem value="healthtech">HealthTech</SelectItem>
                          <SelectItem value="saas">SaaS</SelectItem>
                          <SelectItem value="edtech">EdTech</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Owner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Owners</SelectItem>
                          <SelectItem value="priya">Priya Sharma</SelectItem>
                          <SelectItem value="amit">Amit Patel</SelectItem>
                          <SelectItem value="rahul">Rahul Mehta</SelectItem>
                          <SelectItem value="neha">Neha Gupta</SelectItem>
                          <SelectItem value="vikram">Vikram Singh</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={timeRangeFilter} onValueChange={setTimeRangeFilter}>
                        <SelectTrigger className="w-[140px]">
                          <Calendar className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Time Range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">Last 7 days</SelectItem>
                          <SelectItem value="30">Last 30</SelectItem>
                          <SelectItem value="90">Last 90 days</SelectItem>
                          <SelectItem value="quarter">This Quarter</SelectItem>
                          <SelectItem value="year">This Year</SelectItem>
                          <SelectItem value="all">All Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bulk Actions */}
              {selectedStartups.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg mb-4">
                  <span className="text-sm font-medium">
                    {selectedStartups.length} deal(s) selected
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({ title: "Export started", description: `Exporting report for ${selectedStartups.length} selected deal(s).` })
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleBulkArchive}>
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedStartups([])}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Content Grid */}
              {view === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredAndSortedStartups.map((startup) => (
                    <ClosedCard
                      key={startup.id}
                      startup={startup}
                      selected={selectedStartups.includes(startup.id)}
                      onToggleSelect={toggleSelectStartup}
                      onViewDeal={() => handleViewDeal(startup)}
                      onPortfolioProfile={() => router.push(`/startups/${startup.id}`)}
                      onReopen={() => {
                        setSelectedStartup(startup)
                        setShowReopenModal(true)
                      }}
                      onArchive={() => {
                        setSelectedStartup(startup)
                        setBulkArchiveTarget(null)
                        setShowArchiveModal(true)
                      }}
                    />
                  ))}
                </div>
              )}

              {view === "list" && (
                <div className="space-y-3">
                  {filteredAndSortedStartups.map((startup) => (
                    <ClosedListItem
                      key={startup.id}
                      startup={startup}
                      selected={selectedStartups.includes(startup.id)}
                      onToggleSelect={toggleSelectStartup}
                      onViewDeal={() => handleViewDeal(startup)}
                      onPortfolioProfile={() => router.push(`/startups/${startup.id}`)}
                      onReopen={() => {
                        setSelectedStartup(startup)
                        setShowReopenModal(true)
                      }}
                      onArchive={() => {
                        setSelectedStartup(startup)
                        setBulkArchiveTarget(null)
                        setShowArchiveModal(true)
                      }}
                    />
                  ))}
                </div>
              )}

              {view === "table" && (
                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-3 text-left w-10">
                            <Checkbox
                              checked={filteredAndSortedStartups.length > 0 && selectedStartups.length === filteredAndSortedStartups.length}
                              onCheckedChange={selectAllFiltered}
                            />
                          </th>
                          <th className="p-3 text-left text-sm font-medium">Startup</th>
                          <th className="p-3 text-left text-sm font-medium">Sector</th>
                          <th className="p-3 text-left text-sm font-medium">Status</th>
                          <th className="p-3 text-left text-sm font-medium">Deal/Reason</th>
                          <th className="p-3 text-left text-sm font-medium">Closed Date</th>
                          <th className="p-3 text-left text-sm font-medium">Duration</th>
                          <th className="p-3 text-left text-sm font-medium">Deal Lead</th>
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
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  startup.status === "won"
                                    ? "bg-green-100 dark:bg-green-900/30"
                                    : "bg-gray-100 dark:bg-gray-800"
                                }`}>
                                  <Building2 className={`w-4 h-4 ${
                                    startup.status === "won"
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-gray-600 dark:text-gray-400"
                                  }`} />
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">{startup.name}</p>
                                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                    {startup.tagline}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <Badge variant="secondary">{startup.sector}</Badge>
                            </td>
                            <td className="p-3">
                              <Badge className={
                                startup.status === "won"
                                  ? "bg-green-500 text-white"
                                  : "bg-red-500 text-white"
                              }>
                                {startup.status === "won" ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Closed Won
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Closed Lost
                                  </>
                                )}
                              </Badge>
                            </td>
                            <td className="p-3">
                              {startup.status === "won" ? (
                                <span className="text-sm text-foreground">{startup.investment?.amount}</span>
                              ) : (
                                <span className="text-sm text-muted-foreground">{startup.passReason?.category}</span>
                              )}
                            </td>
                            <td className="p-3">
                              <span className="text-sm text-foreground">{startup.closedDate}</span>
                            </td>
                            <td className="p-3">
                              <span className="text-sm text-muted-foreground">{startup.pipelineDuration} days</span>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={startup.dealLead.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>{startup.dealLead.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{startup.dealLead.name}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDeal(startup)}
                              >
                                {startup.status === "won" ? "View Deal" : "View History"}
                              </Button>
                              {startup.status === "lost" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="ml-1"
                                  onClick={() => {
                                    setSelectedStartup(startup)
                                    setShowReopenModal(true)
                                  }}
                                >
                                  Reopen
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-80 space-y-4">
              {/* Closed Deals Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    Closed Deals Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">This month</span>
                    <span className="font-medium text-foreground">6 deals (4 won, 2 lost)</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total invested</span>
                    <span className="font-medium text-foreground">₹23.5 Cr</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avg deal size</span>
                    <span className="font-medium text-foreground">₹5.88 Cr</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avg pipeline time</span>
                    <span className="font-medium text-foreground">48 days</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 bg-transparent"
                    onClick={() => {
                      router.push("/analytics")
                      toast({ title: "Opening report", description: "Loading closed deals report." })
                    }}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Full Report
                  </Button>
                </CardContent>
              </Card>

              {/* Win/Loss Analysis */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    Win/Loss Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Won</span>
                      <span className="font-medium text-green-600 dark:text-green-400">67% (16/24)</span>
                    </div>
                    <Progress value={67} className="h-2 bg-muted [&>div]:bg-green-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Lost</span>
                      <span className="font-medium text-red-600 dark:text-red-400">33% (8/24)</span>
                    </div>
                    <Progress value={33} className="h-2 bg-muted [&>div]:bg-red-500" />
                  </div>
                  <div className="pt-2 border-t space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Top pass reason</span>
                      <span className="text-foreground">Market timing (3)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Avg time to close</span>
                      <span className="text-foreground">52 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Avg time to pass</span>
                      <span className="text-foreground">31 days</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 bg-transparent"
                    onClick={() => router.push("/investor/analytics")}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              {/* Portfolio Updates */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary" />
                    Portfolio Updates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/50">
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100">TechCorp AI</p>
                      <p className="text-xs text-amber-700/80 dark:text-amber-300/70">Update due in 5 days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800/50">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">HealthBridge</p>
                      <p className="text-xs text-blue-700/80 dark:text-blue-300/70">Board meeting Feb 1</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg">
                    <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">FinFlow</p>
                      <p className="text-xs text-muted-foreground">Quarterly report ready</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => {
                      router.push("/portfolio")
                      toast({ title: "Portfolio updates", description: "Viewing portfolio updates." })
                    }}
                  >
                    View All Updates
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Re-evaluation Queue */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-primary" />
                    Re-evaluation Queue
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">CloudFlow</span>
                    </div>
                    <span className="text-xs text-muted-foreground">In 12 months</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">DataStream</span>
                    </div>
                    <span className="text-xs text-muted-foreground">In 6 months</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">AILabs</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Keep warm for Series B</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => {
                      setStatusFilter("lost")
                      toast({ title: "Re-evaluation queue", description: "Showing deals in re-evaluation queue." })
                    }}
                  >
                    Manage Queue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* View Deal Sheet (Won) */}
      <Sheet open={showViewDeal} onOpenChange={setShowViewDeal}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              {selectedStartup?.name} - Deal Summary
            </SheetTitle>
            <SheetDescription>Complete investment details and portfolio status</SheetDescription>
          </SheetHeader>

          {selectedStartup?.status === "won" && (
            <div className="mt-6 space-y-6">
              {/* Investment Details */}
              <div className="space-y-3">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <Banknote className="w-4 h-4" />
                  Investment Details
                </h3>
                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800/50 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700 dark:text-green-300">Investment Amount</span>
                    <span className="font-semibold text-green-900 dark:text-green-100">{selectedStartup.investment?.amount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700 dark:text-green-300">Equity</span>
                    <span className="font-medium text-green-900 dark:text-green-100">{selectedStartup.investment?.equity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700 dark:text-green-300">Pre-Money Valuation</span>
                    <span className="font-medium text-green-900 dark:text-green-100">{selectedStartup.investment?.preValuation}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700 dark:text-green-300">Post-Money Valuation</span>
                    <span className="font-medium text-green-900 dark:text-green-100">{selectedStartup.investment?.postValuation}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700 dark:text-green-300">Round</span>
                    <span className="font-medium text-green-900 dark:text-green-100">{selectedStartup.investment?.round}</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-3">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Pipeline Timeline
                </h3>
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Closed Date</span>
                    <span className="text-foreground">{selectedStartup.closedDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pipeline Duration</span>
                    <span className="text-foreground">{selectedStartup.pipelineDuration} days</span>
                  </div>
                </div>
              </div>

              {/* Post Investment */}
              <div className="space-y-3">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Post-Investment Status
                </h3>
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Board Seat</span>
                    <span className="text-foreground">{selectedStartup.postInvestment?.boardSeat ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Next Update</span>
                    <span className="text-foreground">{selectedStartup.postInvestment?.nextUpdate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Portfolio Status</span>
                    <span className="text-foreground">{selectedStartup.postInvestment?.portfolioStatus}</span>
                  </div>
                  {selectedStartup.postInvestment?.coInvestors && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Co-investors</span>
                      <span className="text-foreground">{selectedStartup.postInvestment.coInvestors.join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Portfolio Profile
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* View History Sheet (Lost) */}
      <Sheet open={showViewHistory} onOpenChange={setShowViewHistory}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              {selectedStartup?.name} - Deal History
            </SheetTitle>
            <SheetDescription>Full timeline and pass decision details</SheetDescription>
          </SheetHeader>

          {selectedStartup?.status === "lost" && (
            <div className="mt-6 space-y-6">
              {/* Pass Reason */}
              <div className="space-y-3">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <ThumbsDown className="w-4 h-4" />
                  Pass Reason
                </h3>
                <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800/50 space-y-3">
                  <p className="font-medium text-red-900 dark:text-red-100">{selectedStartup.passReason?.category}</p>
                  <ul className="space-y-1">
                    {selectedStartup.passReason?.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-red-500 shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-3">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Timeline
                </h3>
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Closed Date</span>
                    <span className="text-foreground">{selectedStartup.closedDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pipeline Duration</span>
                    <span className="text-foreground">{selectedStartup.pipelineDuration} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Exited At</span>
                    <span className="text-foreground">{selectedStartup.exitedAt} stage</span>
                  </div>
                </div>
              </div>

              {/* Follow-up */}
              <div className="space-y-3">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Follow-up
                </h3>
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Founder Feedback</span>
                    <span className="text-foreground">{selectedStartup.founderFeedback ? "Provided" : "Pending"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Re-evaluate</span>
                    <span className="text-foreground">{selectedStartup.reEvaluate}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reopen Discussion
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Feedback
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Reopen Modal */}
      <Dialog open={showReopenModal} onOpenChange={setShowReopenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reopen Discussion</DialogTitle>
            <DialogDescription>
              This will move {selectedStartup?.name} back to the pipeline for re-evaluation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Target Stage</Label>
              <Select defaultValue="screening">
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="screening">Screening</SelectItem>
                  <SelectItem value="dd">Due Diligence</SelectItem>
                  <SelectItem value="ic">IC Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reason for Reopening</Label>
              <Textarea placeholder="Why are we re-evaluating this deal?" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReopenModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowReopenModal(false)}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reopen Deal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Modal */}
      <Dialog open={showArchiveModal} onOpenChange={setShowArchiveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Deal</DialogTitle>
            <DialogDescription>
              This will archive {selectedStartup?.name} and remove it from regular views.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/50">
              <p className="text-sm text-amber-900 dark:text-amber-100">
                Archived deals can be restored at any time from the Archives section.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowArchiveModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setShowArchiveModal(false)}>
              <Archive className="w-4 h-4 mr-2" />
              Archive Deal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}

// Closed Card Component
interface ClosedCardProps {
  startup: ClosedStartup
  selected: boolean
  onToggleSelect: (id: string) => void
  onViewDeal: () => void
  onPortfolioProfile?: () => void
  onReopen: () => void
  onArchive: () => void
}

function ClosedCard({ startup, selected, onToggleSelect, onViewDeal, onPortfolioProfile, onReopen, onArchive }: ClosedCardProps) {
  const isWon = startup.status === "won"

  return (
    <Card className={`group hover:shadow-md transition-all overflow-hidden ${
      isWon ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"
    }`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Checkbox
            checked={selected}
            onCheckedChange={() => onToggleSelect(startup.id)}
            className="mt-1 shrink-0"
          />
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            isWon
              ? "bg-green-100 dark:bg-green-900/30"
              : "bg-gray-100 dark:bg-gray-800"
          }`}>
            <Building2 className={`w-5 h-5 ${
              isWon ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"
            }`} />
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
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="z-[100]">
                  <DropdownMenuItem onClick={onViewDeal}>
                    {isWon ? "View Deal" : "View History"}
                  </DropdownMenuItem>
                  {!isWon && (
                    <DropdownMenuItem onClick={onReopen}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reopen Discussion
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onArchive} className="text-destructive">
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-xs text-muted-foreground truncate">{startup.tagline}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <Badge variant="secondary">{startup.sector}</Badge>
          <Badge className={isWon ? "bg-green-500 text-white" : "bg-red-500 text-white"}>
            {isWon ? (
              <>
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Closed Won
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 mr-1" />
                Closed Lost
              </>
            )}
          </Badge>
        </div>

        {/* Content based on status */}
        {isWon ? (
          <>
            {/* Deal Details */}
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-100 dark:border-green-900/50">
              <div className="flex items-center gap-2 mb-2">
                <Banknote className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-900 dark:text-green-100">Deal Closed</span>
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-green-800 dark:text-green-200">
                  <span className="font-medium">{startup.investment?.amount}</span> for {startup.investment?.equity} equity
                </p>
                <p className="text-green-700 dark:text-green-300 text-xs">
                  {startup.investment?.preValuation} pre, {startup.investment?.postValuation} post
                </p>
                <p className="text-green-700 dark:text-green-300 text-xs">
                  Round: {startup.investment?.round}
                </p>
              </div>
            </div>

            {/* Post Investment */}
            <div className="mt-3 space-y-1.5 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Board seat: {startup.postInvestment?.boardSeat ? "Yes" : "No"}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>Next update: {startup.postInvestment?.nextUpdate}</span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Pass Reason */}
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/50">
              <div className="flex items-center gap-2 mb-2">
                <ThumbsDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-red-900 dark:text-red-100">Pass Reason</span>
              </div>
              <p className="text-sm text-red-800 dark:text-red-200 font-medium">{startup.passReason?.category}</p>
              <ul className="mt-1.5 space-y-0.5">
                {startup.passReason?.details.slice(0, 2).map((detail, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-red-700 dark:text-red-300">
                    <span className="mt-1 w-1 h-1 rounded-full bg-red-500 shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {/* Exit Details */}
            <div className="mt-3 space-y-1.5 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Exited at: {startup.exitedAt} stage</span>
              </div>
              {startup.reEvaluate && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-evaluate: {startup.reEvaluate}</span>
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={startup.dealLead.avatar || "/placeholder.svg"} />
              <AvatarFallback>{startup.dealLead.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{startup.dealLead.name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {startup.daysAgo} days ago
          </div>
        </div>

        {/* Actions */}
        <div className="mt-3 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={onViewDeal}>
            {isWon ? "View Deal" : "View History"}
          </Button>
          {isWon ? (
            <Button size="sm" className="flex-1" onClick={onPortfolioProfile}>
              Portfolio Profile
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={onReopen}>
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reopen
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Closed List Item Component
interface ClosedListItemProps {
  startup: ClosedStartup
  selected: boolean
  onToggleSelect: (id: string) => void
  onViewDeal: () => void
  onPortfolioProfile?: () => void
  onReopen: () => void
  onArchive: () => void
}

function ClosedListItem({ startup, selected, onToggleSelect, onViewDeal, onPortfolioProfile, onReopen, onArchive }: ClosedListItemProps) {
  const isWon = startup.status === "won"

  return (
    <Card className={`hover:shadow-md transition-all ${
      isWon ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Checkbox
            checked={selected}
            onCheckedChange={() => onToggleSelect(startup.id)}
          />
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            isWon
              ? "bg-green-100 dark:bg-green-900/30"
              : "bg-gray-100 dark:bg-gray-800"
          }`}>
            <Building2 className={`w-5 h-5 ${
              isWon ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link
                href={`/startups/${startup.id}`}
                className="font-medium text-foreground hover:text-primary"
              >
                {startup.name}
              </Link>
              <Badge variant="secondary">{startup.sector}</Badge>
              <Badge className={isWon ? "bg-green-500 text-white" : "bg-red-500 text-white"}>
                {isWon ? "Closed Won" : "Closed Lost"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate">{startup.tagline}</p>
          </div>
          <div className="text-right shrink-0">
            {isWon ? (
              <p className="font-medium text-green-600 dark:text-green-400">{startup.investment?.amount}</p>
            ) : (
              <p className="text-sm text-muted-foreground">{startup.passReason?.category}</p>
            )}
            <p className="text-xs text-muted-foreground">{startup.closedDate}</p>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={startup.dealLead.avatar || "/placeholder.svg"} />
              <AvatarFallback>{startup.dealLead.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <Button variant="outline" size="sm" onClick={onViewDeal}>
            {isWon ? "View Deal" : "View History"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

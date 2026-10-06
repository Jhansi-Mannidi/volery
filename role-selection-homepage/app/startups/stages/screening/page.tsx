"use client"

import { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { InvestorScreeningQueue } from "@/components/investor/screening-queue"
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Filter,
  Grid3X3,
  LayoutList,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Table,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { QuickAddModal } from "@/components/startup/quick-add-modal"

// Initial screening startups data (stateful copy used for Pass/Archive/Move to DD)
const initialScreeningStartups = [
  {
    id: "1",
    name: "TechCorp AI",
    tagline: "AI-powered financial document analysis",
    sector: "Fintech",
    fundingStage: "Seed",
    seeking: "5.25 Cr",
    traction: ["Pre-revenue, MVP launched", "50 beta users, 15% MoM growth"],
    daysInStage: 5,
    avgDays: 8,
    nextAction: "Initial screening call - Jan 26",
    lastActivity: "2 hours ago",
    assignee: { name: "Priya Sharma", initials: "PS" },
    priority: "hot",
  },
  {
    id: "2",
    name: "GreenLeaf Energy",
    tagline: "Sustainable energy solutions for enterprises",
    sector: "CleanTech",
    fundingStage: "Series A",
    seeking: "15 Cr",
    traction: ["25L MRR", "12 enterprise clients"],
    daysInStage: 8,
    avgDays: 8,
    nextAction: "Founder call tomorrow",
    lastActivity: "5 hours ago",
    assignee: { name: "Rahul Mehta", initials: "RM" },
    priority: "normal",
  },
  {
    id: "3",
    name: "HealthBridge",
    tagline: "Telemedicine platform connecting rural India",
    sector: "Healthcare",
    fundingStage: "Seed",
    seeking: "8 Cr",
    traction: ["5K active users", "8L MRR"],
    daysInStage: 12,
    avgDays: 8,
    nextAction: "Follow up required",
    lastActivity: "1 day ago",
    assignee: { name: "Amit Patel", initials: "AP" },
    priority: "attention",
  },
  {
    id: "4",
    name: "EduSpark",
    tagline: "Gamified learning for K-12 students",
    sector: "EdTech",
    fundingStage: "Pre-Seed",
    seeking: "3 Cr",
    traction: ["Beta product ready", "200 pilot users"],
    daysInStage: 3,
    avgDays: 8,
    nextAction: "Deck review scheduled",
    lastActivity: "1 hour ago",
    assignee: { name: "Priya Sharma", initials: "PS" },
    priority: "normal",
  },
  {
    id: "5",
    name: "LogiFlow",
    tagline: "AI-driven supply chain optimization",
    sector: "Logistics",
    fundingStage: "Seed",
    seeking: "6 Cr",
    traction: ["10L MRR", "5 enterprise pilots"],
    daysInStage: 6,
    avgDays: 8,
    nextAction: "Team call - Jan 28",
    lastActivity: "4 hours ago",
    assignee: { name: "Rahul Mehta", initials: "RM" },
    priority: "normal",
  },
  {
    id: "6",
    name: "PayFlow",
    tagline: "Instant B2B payment infrastructure",
    sector: "Fintech",
    fundingStage: "Seed",
    seeking: "7 Cr",
    traction: ["Live product", "1Cr TPV"],
    daysInStage: 11,
    avgDays: 8,
    nextAction: "Pending team intro",
    lastActivity: "2 days ago",
    assignee: { name: "Amit Patel", initials: "AP" },
    priority: "attention",
  },
  {
    id: "7",
    name: "CloudAI",
    tagline: "Cloud infrastructure automation platform",
    sector: "Enterprise",
    fundingStage: "Seed",
    seeking: "10 Cr",
    traction: ["3 enterprise POCs", "Strong team"],
    daysInStage: 10,
    avgDays: 8,
    nextAction: "Technical deep dive",
    lastActivity: "6 hours ago",
    assignee: { name: "Priya Sharma", initials: "PS" },
    priority: "normal",
  },
  {
    id: "8",
    name: "AgriTech Pro",
    tagline: "Smart farming solutions for Indian agriculture",
    sector: "AgriTech",
    fundingStage: "Pre-Seed",
    seeking: "2 Cr",
    traction: ["Pilot with 50 farmers", "Early traction"],
    daysInStage: 4,
    avgDays: 8,
    nextAction: "Initial call scheduled",
    lastActivity: "3 hours ago",
    assignee: { name: "Rahul Mehta", initials: "RM" },
    priority: "normal",
  },
  {
    id: "9",
    name: "RetailX",
    tagline: "AI-powered retail analytics",
    sector: "Retail",
    fundingStage: "Seed",
    seeking: "4 Cr",
    traction: ["5L MRR", "8 retail chains"],
    daysInStage: 7,
    avgDays: 8,
    nextAction: "Metrics review",
    lastActivity: "8 hours ago",
    assignee: { name: "Amit Patel", initials: "AP" },
    priority: "normal",
  },
  {
    id: "10",
    name: "InsureTech",
    tagline: "Digital insurance distribution platform",
    sector: "Insurance",
    fundingStage: "Series A",
    seeking: "20 Cr",
    traction: ["50L GWP", "Growing 20% MoM"],
    daysInStage: 2,
    avgDays: 8,
    nextAction: "Deep dive call - Jan 25",
    lastActivity: "30 mins ago",
    assignee: { name: "Priya Sharma", initials: "PS" },
    priority: "hot",
  },
  {
    id: "11",
    name: "DevTools Inc",
    tagline: "Developer productivity tools",
    sector: "Developer Tools",
    fundingStage: "Seed",
    seeking: "5 Cr",
    traction: ["1000 developers", "Strong community"],
    daysInStage: 9,
    avgDays: 8,
    nextAction: "Product demo",
    lastActivity: "1 day ago",
    assignee: { name: "Rahul Mehta", initials: "RM" },
    priority: "normal",
  },
  {
    id: "12",
    name: "MedSupply",
    tagline: "Healthcare supply chain platform",
    sector: "Healthcare",
    fundingStage: "Seed",
    seeking: "6 Cr",
    traction: ["15 hospital partnerships", "20L MRR"],
    daysInStage: 5,
    avgDays: 8,
    nextAction: "Reference calls",
    lastActivity: "2 hours ago",
    assignee: { name: "Amit Patel", initials: "AP" },
    priority: "normal",
  },
]

type ViewMode = "grid" | "list" | "table"
type ActiveFilter = { type: string; value: string }
type SortOption = "added" | "activity" | "name" | "size"

function getTimeIndicatorColor(days: number) {
  if (days <= 5) return { bg: "bg-green-500", text: "text-green-500", label: "Ahead" }
  if (days <= 10) return { bg: "bg-yellow-500", text: "text-yellow-500", label: "On track" }
  if (days <= 15) return { bg: "bg-orange-500", text: "text-orange-500", label: "Needs attention" }
  return { bg: "bg-red-500", text: "text-red-500", label: "Stale" }
}

function getPriorityBadge(priority: string) {
  if (priority === "hot") {
    return (
      <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">
        <TrendingUp className="w-3 h-3 mr-1" />
        Hot
      </Badge>
    )
  }
  if (priority === "attention") {
    return (
      <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
        <AlertCircle className="w-3 h-3 mr-1" />
        Needs Attention
      </Badge>
    )
  }
  return null
}

export type ScreeningStartup = (typeof initialScreeningStartups)[0]

const SECTOR_OPTIONS = [
  { value: "all", label: "All Sectors" },
  { value: "Fintech", label: "Fintech" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "EdTech", label: "EdTech" },
  { value: "CleanTech", label: "CleanTech" },
  { value: "Logistics", label: "Logistics" },
  { value: "Enterprise", label: "Enterprise" },
  { value: "AgriTech", label: "AgriTech" },
  { value: "Retail", label: "Retail" },
  { value: "Insurance", label: "Insurance" },
  { value: "Developer Tools", label: "Developer Tools" },
] as const

const OWNER_OPTIONS = [
  { value: "all", label: "All Owners" },
  { value: "Priya Sharma", label: "Priya Sharma" },
  { value: "Rahul Mehta", label: "Rahul Mehta" },
  { value: "Amit Patel", label: "Amit Patel" },
] as const

export default function ScreeningStagePage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [startups, setStartups] = useState<ScreeningStartup[]>(initialScreeningStartups)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [sectorFilter, setSectorFilter] = useState("all")
  const [ownerFilter, setOwnerFilter] = useState("all")
  const [timeInStageFilter, setTimeInStageFilter] = useState("all")
  const [sortBy, setSortBy] = useState<SortOption>("added")
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [quickScreenOpen, setQuickScreenOpen] = useState(false)
  const [selectedStartup, setSelectedStartup] = useState<ScreeningStartup | null>(null)
  const [moveToDDOpen, setMoveToDDOpen] = useState(false)
  const [passDialogOpen, setPassDialogOpen] = useState(false)
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false)
  const [scheduleCallOpen, setScheduleCallOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])
  const [selectedStartups, setSelectedStartups] = useState<string[]>([])
  const [bulkMoveDDOpen, setBulkMoveDDOpen] = useState(false)
  const [bulkPassOpen, setBulkPassOpen] = useState(false)
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false)
  const [bulkScheduleOpen, setBulkScheduleOpen] = useState(false)
  const [quickActionDialog, setQuickActionDialog] = useState<"batch" | "schedule" | "updates" | "export" | null>(null)

  const isInstitutionalInvestor = user?.activeRole === "institutional-investor"

  const filteredAndSortedStartups = useMemo(() => {
    let list = startups.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tagline.toLowerCase().includes(searchQuery.toLowerCase())
    )
    if (sectorFilter !== "all") list = list.filter((s) => s.sector === sectorFilter)
    if (ownerFilter !== "all") list = list.filter((s) => s.assignee.name === ownerFilter)
    if (timeInStageFilter === "lt7") list = list.filter((s) => s.daysInStage < 7)
    if (timeInStageFilter === "gt7") list = list.filter((s) => s.daysInStage > 7)
    if (timeInStageFilter === "gt14") list = list.filter((s) => s.daysInStage > 14)

    const sorted = [...list].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "activity":
          return a.lastActivity.localeCompare(b.lastActivity)
        case "size": {
          const numA = parseFloat(a.seeking.replace(/[^\d.]/g, "")) || 0
          const numB = parseFloat(b.seeking.replace(/[^\d.]/g, "")) || 0
          return numA - numB
        }
        case "added":
        default:
          return 0
      }
    })
    return sorted
  }, [startups, searchQuery, sectorFilter, ownerFilter, timeInStageFilter, sortBy])

  const handleQuickScreen = useCallback((startup: ScreeningStartup) => {
    setSelectedStartup(startup)
    setQuickScreenOpen(true)
  }, [])

  const handleMoveToDDClick = useCallback((startup: ScreeningStartup) => {
    setSelectedStartup(startup)
    setMoveToDDOpen(true)
  }, [])

  const handleMoveToDDConfirm = useCallback(() => {
    if (!selectedStartup) return
    setStartups((prev) => prev.filter((s) => s.id !== selectedStartup.id))
    setMoveToDDOpen(false)
    setSelectedStartup(null)
    toast({ title: "Moved to Due Diligence", description: `${selectedStartup.name} has been moved to Due Diligence.` })
  }, [selectedStartup, toast])

  const handlePassClick = useCallback((startup: ScreeningStartup) => {
    setSelectedStartup(startup)
    setPassDialogOpen(true)
  }, [])

  const handlePassConfirm = useCallback(() => {
    if (!selectedStartup) return
    setStartups((prev) => prev.filter((s) => s.id !== selectedStartup.id))
    setPassDialogOpen(false)
    setSelectedStartup(null)
    toast({ title: "Startup passed", description: `${selectedStartup.name} has been passed from screening.` })
  }, [selectedStartup, toast])

  const handleArchiveClick = useCallback((startup: ScreeningStartup) => {
    setSelectedStartup(startup)
    setArchiveDialogOpen(true)
  }, [])

  const handleArchiveConfirm = useCallback(() => {
    if (!selectedStartup) return
    setStartups((prev) => prev.filter((s) => s.id !== selectedStartup.id))
    setArchiveDialogOpen(false)
    setSelectedStartup(null)
    toast({ title: "Startup archived", description: `${selectedStartup.name} has been archived.` })
  }, [selectedStartup, toast])

  const handleFindMatches = useCallback((startup: ScreeningStartup) => {
    router.push(`/ai-insights/investor-matching?startup=${startup.id}`)
  }, [router])

  const handleEdit = useCallback((startup: ScreeningStartup) => {
    router.push(`/startups/${startup.id}`)
  }, [router])

  const handleScheduleCallClick = useCallback((startup: ScreeningStartup) => {
    setSelectedStartup(startup)
    setScheduleCallOpen(true)
  }, [])

  const removeFilter = (filter: ActiveFilter) => {
    setActiveFilters((prev) => prev.filter((f) => f.type !== filter.type || f.value !== filter.value))
    if (filter.type === "sector") setSectorFilter("all")
    if (filter.type === "owner") setOwnerFilter("all")
    if (filter.type === "time") setTimeInStageFilter("all")
  }

  const applyAdvancedFilters = useCallback(() => {
    const next: ActiveFilter[] = []
    if (sectorFilter !== "all") next.push({ type: "sector", value: sectorFilter })
    if (ownerFilter !== "all") next.push({ type: "owner", value: ownerFilter })
    if (timeInStageFilter === "lt7") next.push({ type: "time", value: "Less than 7 days" })
    if (timeInStageFilter === "gt7") next.push({ type: "time", value: "More than 7 days" })
    if (timeInStageFilter === "gt14") next.push({ type: "time", value: "More than 14 days" })
    setActiveFilters(next)
    setAdvancedFiltersOpen(false)
  }, [sectorFilter, ownerFilter, timeInStageFilter])

  const toggleStartupSelection = (id: string) => {
    setSelectedStartups((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleBulkMoveToDD = useCallback(() => {
    if (selectedStartups.length === 0) return
    setBulkMoveDDOpen(true)
  }, [selectedStartups.length])

  const handleBulkMoveToDDConfirm = useCallback(() => {
    setStartups((prev) => prev.filter((s) => !selectedStartups.includes(s.id)))
    setSelectedStartups([])
    setBulkMoveDDOpen(false)
    toast({ title: "Moved to Due Diligence", description: `${selectedStartups.length} startup(s) moved to Due Diligence.` })
  }, [selectedStartups, toast])

  const handleBulkPass = useCallback(() => {
    if (selectedStartups.length === 0) return
    setBulkPassOpen(true)
  }, [selectedStartups.length])

  const handleBulkPassConfirm = useCallback(() => {
    setStartups((prev) => prev.filter((s) => !selectedStartups.includes(s.id)))
    setSelectedStartups([])
    setBulkPassOpen(false)
    toast({ title: "Passed", description: `${selectedStartups.length} startup(s) passed from screening.` })
  }, [selectedStartups, toast])

  // Stats calculations (from current startups list)
  const totalInScreening = startups.length
  const avgTime = totalInScreening > 0 ? Math.round(startups.reduce((acc, s) => acc + s.daysInStage, 0) / totalInScreening) : 0
  const needsAttention = startups.filter((s) => s.daysInStage > 10)

  // Render investor-specific screening queue
  if (isInstitutionalInvestor) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Screening Queue" />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto">
            <InvestorScreeningQueue />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader title="Screening" />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        
        <main className="flex-1 overflow-auto">
          {/* Breadcrumb */}
          <div className="px-4 md:px-6 pt-4">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/role-selection" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/pipeline" className="hover:text-foreground transition-colors">Pipeline</Link>
              <ChevronRight className="w-4 h-4" />
              <span>By Stage</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">Screening</span>
            </nav>
          </div>

          {/* Page Header */}
          <div className="border-b bg-card px-4 md:px-6 py-4 mt-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold text-foreground">Screening</h1>
                    <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                      <Search className="w-3 h-3 mr-1" />
                      Screening
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {totalInScreening} startups in screening stage
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* View Toggle */}
                <div className="flex items-center border border-border rounded-lg p-1 bg-muted/30">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-md"
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-md"
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                  >
                    <LayoutList className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-md"
                    onClick={() => setViewMode("table")}
                    aria-label="Table view"
                  >
                    <Table className="w-4 h-4" />
                  </Button>
                </div>

                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="added">Added Date</SelectItem>
                    <SelectItem value="activity">Last Activity</SelectItem>
                    <SelectItem value="name">Company Name</SelectItem>
                    <SelectItem value="size">Deal Size</SelectItem>
                  </SelectContent>
                </Select>


                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => setQuickAddOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Startup
                </Button>
              </div>
            </div>

            {/* Stage Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Search className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-foreground">{totalInScreening}</p>
                      <p className="text-xs text-muted-foreground">In Screening</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-foreground">{avgTime} days</p>
                      <p className="text-xs text-muted-foreground">Avg Time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-foreground">65%</p>
                      <p className="text-xs text-muted-foreground">Move to DD</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-foreground">35%</p>
                      <p className="text-xs text-muted-foreground">Pass Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 mt-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search startups..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Select value={sectorFilter} onValueChange={setSectorFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTOR_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {OWNER_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={timeInStageFilter} onValueChange={setTimeInStageFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Time in stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="lt7">Less than 7 days</SelectItem>
                    <SelectItem value="gt7">More than 7 days</SelectItem>
                    <SelectItem value="gt14">More than 14 days</SelectItem>
                  </SelectContent>
                </Select>

                
              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {activeFilters.map((filter, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-purple-500/10 text-purple-500 border-purple-500/20 gap-1 pl-2"
                  >
                    {filter.value}
                    <button
                      onClick={() => removeFilter(filter)}
                      className="ml-1 hover:bg-purple-500/20 rounded p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground h-6 px-2"
                  onClick={() => setActiveFilters([])}
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex gap-6 p-4 md:p-6">
            {/* Startup Cards */}
            <div className="flex-1">
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredAndSortedStartups.map((startup) => (
                    <ScreeningCard
                      key={startup.id}
                      startup={startup}
                      onQuickScreen={handleQuickScreen}
                      onMoveToDD={handleMoveToDDClick}
                      onPass={handlePassClick}
                      onArchive={handleArchiveClick}
                      onFindMatches={handleFindMatches}
                      onEdit={handleEdit}
                      onScheduleCall={handleScheduleCallClick}
                      selected={selectedStartups.includes(startup.id)}
                      onToggleSelect={toggleStartupSelection}
                    />
                  ))}
                </div>
              )}

              {viewMode === "list" && (
                <div className="space-y-3">
                  {filteredAndSortedStartups.map((startup) => (
                    <ScreeningListItem
                      key={startup.id}
                      startup={startup}
                      onQuickScreen={handleQuickScreen}
                      onMoveToDD={handleMoveToDDClick}
                      onPass={handlePassClick}
                      onArchive={handleArchiveClick}
                      onFindMatches={handleFindMatches}
                      onEdit={handleEdit}
                      onScheduleCall={handleScheduleCallClick}
                    />
                  ))}
                </div>
              )}

              {viewMode === "table" && (
                <div className="rounded-lg border bg-card overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="text-left">
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Company</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Sector</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Seeking</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Time in Stage</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Owner</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Next Action</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredAndSortedStartups.map((startup) => (
                        <ScreeningTableRow
                          key={startup.id}
                          startup={startup}
                          onQuickScreen={handleQuickScreen}
                          onMoveToDD={handleMoveToDDClick}
                          onPass={handlePassClick}
                          onArchive={handleArchiveClick}
                          onFindMatches={handleFindMatches}
                          onEdit={handleEdit}
                          onScheduleCall={handleScheduleCallClick}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {filteredAndSortedStartups.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Search className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-1">No startups in screening</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Startups move here from Intake after initial review
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/pipeline">View All Stages</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="hidden lg:block w-[300px] shrink-0 space-y-4">
              {/* Screening Performance */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Screening Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Screened this month</span>
                    <span className="font-medium text-foreground">45</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Moved to DD</span>
                    <span className="font-medium text-green-500">29 (65%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Passed</span>
                    <span className="font-medium text-red-500">16 (35%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg screening time</span>
                    <span className="font-medium text-foreground">8 days</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 bg-transparent"
                    onClick={() => router.push("/analytics")}
                  >
                    View Full Report
                  </Button>
                </CardContent>
              </Card>

              {/* Oldest in Stage */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Oldest in Stage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {needsAttention.slice(0, 3).map((startup) => (
                    <Link
                      key={startup.id}
                      href={`/startups/${startup.id}`}
                      className="flex items-center justify-between py-2 hover:bg-muted/50 rounded px-2 -mx-2 transition-colors"
                    >
                      <span className="text-sm text-foreground">{startup.name}</span>
                      <span className="text-sm text-orange-500 font-medium">{startup.daysInStage} days</span>
                    </Link>
                  ))}
                  <p className="text-xs text-amber-500 mt-2">
                    {needsAttention.length} startups need attention
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 bg-transparent"
                    onClick={() => setTimeInStageFilter("gt7")}
                  >
                    Review All
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
                    className="w-full justify-start gap-2 bg-transparent"
                    onClick={() => setQuickActionDialog("batch")}
                  >
                    <Users className="w-4 h-4" />
                    Batch screening
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 bg-transparent"
                    onClick={() => setQuickActionDialog("schedule")}
                  >
                    <Phone className="w-4 h-4" />
                    Schedule screening calls
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 bg-transparent"
                    onClick={() => setQuickActionDialog("updates")}
                  >
                    <Sparkles className="w-4 h-4" />
                    Send founder updates
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 bg-transparent"
                    onClick={() => setQuickActionDialog("export")}
                  >
                    <Download className="w-4 h-4" />
                    Export screening list
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedStartups.length > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-card border shadow-lg rounded-lg px-4 py-3 flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">
                {selectedStartups.length} selected
              </span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleBulkMoveToDD}>
                  Move to DD
                </Button>
                <Button size="sm" variant="outline" onClick={() => setBulkScheduleOpen(true)}>
                  Schedule Calls
                </Button>
                <Button size="sm" variant="outline" onClick={handleBulkPass}>
                  Pass
                </Button>
                <Button size="sm" variant="outline" onClick={() => setBulkAssignOpen(true)}>
                  Assign
                </Button>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedStartups([])}
              >
                Cancel
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* Quick Add Modal */}
      <QuickAddModal open={quickAddOpen} onOpenChange={setQuickAddOpen} />

      {/* Quick Screen Panel */}
      <Sheet open={quickScreenOpen} onOpenChange={setQuickScreenOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] p-8">
          <SheetHeader>
            <SheetTitle>Quick Screen - {selectedStartup?.name}</SheetTitle>
            <SheetDescription>
              Complete the screening checklist for this startup
            </SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-6">
            {/* Screening Checklist */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Screening Checklist</Label>
              <div className="space-y-2">
                {[
                  "Team background reviewed",
                  "Market size validated",
                  "Product differentiation clear",
                  "Financial projections reviewed",
                  "References checked",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Checkbox id={`check-${i}`} />
                    <label htmlFor={`check-${i}`} className="text-sm text-foreground">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Quick Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add your screening notes here..."
                className="min-h-[100px]"
              />
            </div>

            {/* Recommendation */}
            <div className="space-y-3">
              <Label>Recommendation</Label>
              <RadioGroup defaultValue="advance">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advance" id="advance" />
                  <Label htmlFor="advance" className="font-normal">
                    Advance to Due Diligence
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="followup" id="followup" />
                  <Label htmlFor="followup" className="font-normal">
                    Schedule follow-up call
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pass" id="pass" />
                  <Label htmlFor="pass" className="font-normal">
                    Pass (with reason)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setQuickScreenOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setQuickScreenOpen(false)
                toast({ title: "Screening saved", description: `Quick screen for ${selectedStartup?.name} has been saved.` })
              }}
            >
              Save & Close
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Move to DD Confirmation Modal */}
      <Dialog open={moveToDDOpen} onOpenChange={setMoveToDDOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move {selectedStartup?.name} to Due Diligence?</DialogTitle>
            <DialogDescription>This action will initiate the due diligence process.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
              <p className="font-medium text-foreground">This will:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Create DD checklist
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Assign DD team
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Send notification to founder
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Update probability to 40%
                </li>
              </ul>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="transition-notes">Transition notes</Label>
              <Textarea
                id="transition-notes"
                placeholder="Add any notes for the DD team..."
                className="min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveToDDOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMoveToDDConfirm}>
              <ArrowRight className="w-4 h-4 mr-2" />
              Move to Due Diligence
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pass confirmation */}
      <Dialog open={passDialogOpen} onOpenChange={setPassDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pass {selectedStartup?.name} from screening?</DialogTitle>
            <DialogDescription>
              This startup will be marked as passed and removed from the screening stage. You can add a reason below.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="pass-reason">Reason (optional)</Label>
            <Textarea id="pass-reason" placeholder="e.g. Outside thesis, stage mismatch" className="mt-2 min-h-[80px]" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPassDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handlePassConfirm}>Pass</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive confirmation */}
      <Dialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive {selectedStartup?.name}?</DialogTitle>
            <DialogDescription>
              This startup will be archived and removed from the screening list. You can restore it later from the archive.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArchiveDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleArchiveConfirm}>Archive</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Call */}
      <Dialog open={scheduleCallOpen} onOpenChange={setScheduleCallOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule call – {selectedStartup?.name}</DialogTitle>
            <DialogDescription>Choose a date and add notes for the screening call.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Date & time</Label>
              <Input type="datetime-local" className="mt-2" />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea placeholder="Agenda or talking points" className="mt-2 min-h-[80px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleCallOpen(false)}>Cancel</Button>
            <Button onClick={() => { setScheduleCallOpen(false); toast({ title: "Call scheduled", description: `Screening call for ${selectedStartup?.name} has been scheduled.` }); }}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Move to DD */}
      <Dialog open={bulkMoveDDOpen} onOpenChange={setBulkMoveDDOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move {selectedStartups.length} startup(s) to Due Diligence?</DialogTitle>
            <DialogDescription>This will create DD checklists and notify founders for all selected startups.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkMoveDDOpen(false)}>Cancel</Button>
            <Button onClick={handleBulkMoveToDDConfirm}>Move to DD</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Pass */}
      <Dialog open={bulkPassOpen} onOpenChange={setBulkPassOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pass {selectedStartups.length} startup(s) from screening?</DialogTitle>
            <DialogDescription>Selected startups will be marked as passed and removed from this stage.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkPassOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleBulkPassConfirm}>Pass</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Assign & Schedule placeholders */}
      <Dialog open={bulkAssignOpen} onOpenChange={setBulkAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign {selectedStartups.length} startup(s)</DialogTitle>
            <DialogDescription>Assign selected startups to a team member.</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label>Assign to</Label>
            <Select>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select owner" />
              </SelectTrigger>
              <SelectContent>
                {OWNER_OPTIONS.filter((o) => o.value !== "all").map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkAssignOpen(false)}>Cancel</Button>
            <Button onClick={() => { setBulkAssignOpen(false); toast({ title: "Assigned", description: `${selectedStartups.length} startup(s) assigned.` }); }}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkScheduleOpen} onOpenChange={setBulkScheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule calls for {selectedStartups.length} startup(s)</DialogTitle>
            <DialogDescription>Create screening call slots for selected startups.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkScheduleOpen(false)}>Cancel</Button>
            <Button onClick={() => { setBulkScheduleOpen(false); toast({ title: "Calls scheduled", description: `Screening calls scheduled for ${selectedStartups.length} startup(s).` }); }}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Actions (right panel) dialog */}
      <Dialog open={quickActionDialog != null} onOpenChange={(open) => !open && setQuickActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {quickActionDialog === "batch" && "Batch screening"}
              {quickActionDialog === "schedule" && "Schedule screening calls"}
              {quickActionDialog === "updates" && "Send founder updates"}
              {quickActionDialog === "export" && "Export screening list"}
            </DialogTitle>
            <DialogDescription>
              {quickActionDialog === "batch" && "Run screening checklist for multiple startups at once. Select startups from the list and use the bulk bar to start batch screening."}
              {quickActionDialog === "schedule" && "Schedule screening calls for startups in this stage. You can pick dates and send calendar invites to founders."}
              {quickActionDialog === "updates" && "Send a bulk update email to founders of startups currently in screening (e.g. status update or next steps)."}
              {quickActionDialog === "export" && "Download the current screening list as CSV or add to a report."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuickActionDialog(null)}>Cancel</Button>
            <Button
              onClick={() => {
                setQuickActionDialog(null)
                toast({
                  title: quickActionDialog === "export" ? "Export started" : "Action started",
                  description:
                    quickActionDialog === "export"
                      ? "Screening list export has been started. You will receive the file shortly."
                      : "Your request has been submitted.",
                })
              }}
            >
              {quickActionDialog === "export" ? "Export" : "Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

interface ScreeningCardProps {
  startup: ScreeningStartup
  onQuickScreen: (startup: ScreeningStartup) => void
  onMoveToDD: (startup: ScreeningStartup) => void
  onPass?: (startup: ScreeningStartup) => void
  onArchive?: (startup: ScreeningStartup) => void
  onFindMatches?: (startup: ScreeningStartup) => void
  onEdit?: (startup: ScreeningStartup) => void
  onScheduleCall?: (startup: ScreeningStartup) => void
  selected?: boolean
  onToggleSelect?: (id: string) => void
}

function ScreeningCard({
  startup,
  onQuickScreen,
  onMoveToDD,
  onPass,
  onArchive,
  onFindMatches,
  onEdit,
  onScheduleCall,
  selected,
  onToggleSelect,
}: ScreeningCardProps) {
  const timeIndicator = getTimeIndicatorColor(startup.daysInStage)

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
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-primary" />
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
                  <DropdownMenuItem onClick={() => onFindMatches?.(startup)}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Find Matches
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit?.(startup)}>Edit</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={() => onArchive?.(startup)}>
                    Archive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-xs text-muted-foreground truncate">{startup.tagline}</p>
          </div>
        </div>

        {/* Priority Badge */}
        {startup.priority !== "normal" && (
          <div className="mt-2">
            {getPriorityBadge(startup.priority)}
          </div>
        )}

        {/* Badges */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <Badge variant="outline" className="text-xs font-normal">
            {startup.sector}
          </Badge>
          <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-xs font-medium">
            Screening
          </Badge>
        </div>

        {/* Traction */}
        <div className="mt-3 space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Traction:</p>
          {startup.traction.map((t, i) => (
            <p key={i} className="text-xs text-foreground">
              • {t}
            </p>
          ))}
        </div>

        {/* Details */}
        <div className="mt-3 space-y-1.5 text-xs">
          <div className="flex items-center gap-2 text-foreground">
            <span className="font-medium">Seeking:</span>
            {startup.fundingStage} • {startup.seeking}
          </div>
          <div className={cn("flex items-center gap-2", timeIndicator.text)}>
            <Clock className="w-3 h-3" />
            In Screening: {startup.daysInStage} days (avg: {startup.avgDays} days)
            {startup.daysInStage > startup.avgDays && (
              <AlertCircle className="w-3 h-3" />
            )}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-3 h-3" />
            Next: {startup.nextAction}
          </div>
        </div>

        {/* Owner & Activity */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                {startup.assignee.initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{startup.assignee.name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {startup.lastActivity}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs bg-transparent"
            onClick={() => onQuickScreen(startup)}
          >
            Quick Screen
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs bg-transparent"
            onClick={() => onMoveToDD(startup)}
          >
            Move to DD
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-transparent"
            onClick={() => onScheduleCall?.(startup)}
          >
            <Phone className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs text-destructive hover:text-destructive bg-transparent"
            onClick={() => onPass?.(startup)}
          >
            Pass
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ScreeningListItem({
  startup,
  onQuickScreen,
  onMoveToDD,
  onPass,
  onArchive,
  onFindMatches,
  onEdit,
  onScheduleCall,
}: Omit<ScreeningCardProps, "selected" | "onToggleSelect">) {
  const timeIndicator = getTimeIndicatorColor(startup.daysInStage)

  return (
    <div className="group flex items-center gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-all">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border flex items-center justify-center shrink-0">
        <Building2 className="w-6 h-6 text-primary" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Link
            href={`/startups/${startup.id}`}
            className="font-medium text-foreground hover:text-primary transition-colors"
          >
            {startup.name}
          </Link>
          {getPriorityBadge(startup.priority)}
        </div>
        <p className="text-sm text-muted-foreground truncate">{startup.tagline}</p>
      </div>

      <div className="hidden md:flex items-center gap-3">
        <Badge variant="outline" className="font-normal">
          {startup.sector}
        </Badge>
        <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 font-medium">
          Screening
        </Badge>
      </div>

      <div className="hidden lg:block text-sm font-medium text-foreground">
        {startup.seeking}
      </div>

      <div className={cn("hidden lg:flex items-center gap-1 text-sm", timeIndicator.text)}>
        <Clock className="w-4 h-4" />
        {startup.daysInStage} days
      </div>

      <div className="flex items-center gap-2">
        <Avatar className="w-7 h-7">
          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
            {startup.assignee.initials}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onQuickScreen(startup)}>
          Screen
        </Button>
        <Button variant="outline" size="sm" onClick={() => onMoveToDD(startup)}>
          Move to DD
        </Button>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" type="button">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-[100]">
            <DropdownMenuItem onClick={() => onScheduleCall?.(startup)}>
              <Phone className="w-4 h-4 mr-2" />
              Schedule Call
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFindMatches?.(startup)}>
              <Sparkles className="w-4 h-4 mr-2" />
              Find Matches
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => onPass?.(startup)}>
              Pass
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

function ScreeningTableRow({
  startup,
  onQuickScreen,
  onMoveToDD,
  onPass,
  onArchive,
  onFindMatches,
  onEdit,
  onScheduleCall,
}: Omit<ScreeningCardProps, "selected" | "onToggleSelect">) {
  const timeIndicator = getTimeIndicatorColor(startup.daysInStage)

  return (
    <tr className="group hover:bg-muted/50 transition-colors">
      <td className="px-4 py-3">
        <Link href={`/startups/${startup.id}`} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary/20 to-primary/5 border flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                {startup.name}
              </p>
              {getPriorityBadge(startup.priority)}
            </div>
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
              {startup.tagline}
            </p>
          </div>
        </Link>
      </td>
      <td className="px-4 py-3">
        <Badge variant="outline" className="font-normal">
          {startup.sector}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm">
          <p className="font-medium text-foreground">{startup.seeking}</p>
          <p className="text-xs text-muted-foreground">{startup.fundingStage}</p>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className={cn("flex items-center gap-1 text-sm", timeIndicator.text)}>
          <div className={cn("w-2 h-2 rounded-full", timeIndicator.bg)} />
          {startup.daysInStage} days
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
              {startup.assignee.initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{startup.assignee.name}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-muted-foreground truncate max-w-[150px]">
          {startup.nextAction}
        </p>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={() => onQuickScreen(startup)}>
            Screen
          </Button>
          <Button variant="outline" size="sm" onClick={() => onMoveToDD(startup)}>
            DD
          </Button>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" type="button">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[100]">
              <DropdownMenuItem onClick={() => onScheduleCall?.(startup)}>Schedule Call</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFindMatches?.(startup)}>Find Matches</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(startup)}>Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => onPass?.(startup)}>Pass</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  )
}

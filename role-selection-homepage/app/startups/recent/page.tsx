"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  AlertTriangle,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Flame,
  FolderOpen,
  Grid3X3,
  LayoutList,
  MessageSquare,
  MoreHorizontal,
  Pin,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Timer,
  Trash2,
  TrendingUp,
  User,
  Users,
  X,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Mock recently viewed data
const recentlyViewed = [
  {
    id: "1",
    name: "TechCorp AI",
    tagline: "AI-powered financial document analysis",
    sector: "Fintech",
    stage: "Due Diligence",
    stageColor: "amber",
    fundingStage: "Seed",
    tags: ["AI", "B2B"],
    viewedAt: "2 hours ago",
    viewedAtFull: "Today, 2:30 PM",
    viewCount: 5,
    timeSpent: "23 min",
    assignee: { name: "Priya Sharma", initials: "PS" },
    isHot: true,
    isPinned: true,
    hasNotes: true,
    period: "today",
    iconColor: "from-blue-500 to-blue-600",
  },
  {
    id: "2",
    name: "GreenEnergy",
    tagline: "Sustainable energy solutions for enterprises",
    sector: "CleanTech",
    stage: "Screening",
    stageColor: "purple",
    fundingStage: "Series A",
    tags: ["Impact"],
    viewedAt: "5 hours ago",
    viewedAtFull: "Today, 11:15 AM",
    viewCount: 2,
    timeSpent: "12 min",
    assignee: { name: "Amit Patel", initials: "AP" },
    period: "today",
    iconColor: "from-teal-500 to-teal-600",
  },
  {
    id: "3",
    name: "HealthX",
    tagline: "Healthcare platform for rural India",
    sector: "Healthcare",
    stage: "Intake",
    stageColor: "slate",
    fundingStage: "Pre-Seed",
    tags: ["SaaS"],
    viewedAt: "Yesterday",
    viewedAtFull: "Yesterday, 4:30 PM",
    viewCount: 1,
    timeSpent: "8 min",
    assignee: { name: "Rahul Mehta", initials: "RM" },
    notesPending: true,
    period: "yesterday",
    iconColor: "from-green-500 to-green-600",
  },
  {
    id: "4",
    name: "FinSecure",
    tagline: "Cybersecurity for financial institutions",
    sector: "Fintech",
    stage: "IC Review",
    stageColor: "green",
    fundingStage: "Series A",
    tags: ["Security", "B2B"],
    viewedAt: "3 days ago",
    viewedAtFull: "Jan 21, 2026, 10:30 AM",
    viewCount: 3,
    timeSpent: "45 min",
    assignee: { name: "Priya Sharma", initials: "PS" },
    hasNotes: true,
    period: "week",
    iconColor: "from-purple-500 to-purple-600",
  },
  {
    id: "5",
    name: "EduLearn",
    tagline: "Gamified learning for K-12 students",
    sector: "EdTech",
    stage: "Screening",
    stageColor: "purple",
    fundingStage: "Seed",
    tags: [],
    viewedAt: "1 week ago",
    viewedAtFull: "Jan 17, 2026, 3:00 PM",
    viewCount: 1,
    timeSpent: "3 min",
    assignee: { name: "Priya Sharma", initials: "PS" },
    period: "month",
    iconColor: "from-orange-500 to-orange-600",
  },
  {
    id: "6",
    name: "LogiFlow",
    tagline: "AI-driven supply chain optimization",
    sector: "Logistics",
    stage: "Closed Won",
    stageColor: "green",
    fundingStage: "Seed",
    tags: ["AI"],
    viewedAt: "2 weeks ago",
    viewedAtFull: "Jan 10, 2026, 11:00 AM",
    viewCount: 8,
    timeSpent: "1h 15min",
    assignee: { name: "Rahul Mehta", initials: "RM" },
    deepDive: true,
    period: "month",
    iconColor: "from-navy-500 to-navy-600",
  },
]

// Timeline data
const timelineData = [
  {
    date: "Today - January 24, 2026",
    events: [
      {
        time: "2:30 PM",
        startup: "TechCorp AI",
        duration: "8 minutes",
        stage: "Due Diligence",
        owner: "@Priya",
        notes: null,
      },
      {
        time: "11:15 AM",
        startup: "GreenEnergy",
        duration: "5 minutes",
        stage: "Screening",
        owner: "@Amit",
        notes: null,
      },
      {
        time: "9:00 AM",
        startup: "TechCorp AI",
        duration: "15 minutes",
        stage: "Due Diligence",
        owner: "@Priya",
        notes: "Added 2 notes during this session",
      },
    ],
  },
  {
    date: "Yesterday - January 23, 2026",
    events: [
      {
        time: "4:30 PM",
        startup: "HealthX",
        duration: "8 minutes",
        stage: "Intake",
        owner: "@Rahul",
        notes: null,
      },
      {
        time: "2:00 PM",
        startup: "FinSecure",
        duration: "20 minutes",
        stage: "IC Review",
        owner: "@Priya",
        notes: "Viewed IC Memo",
      },
    ],
  },
  {
    date: "January 21, 2026",
    events: [
      {
        time: "10:30 AM",
        startup: "FinSecure",
        duration: "25 minutes",
        stage: "IC Review",
        owner: "@Priya",
        notes: "Reviewed financials, Left 3 comments",
      },
    ],
  },
]

const stageColors: Record<string, { bg: string; text: string }> = {
  slate: { bg: "bg-muted/50", text: "text-muted-foreground" },
  blue: { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-600 dark:text-blue-400" },
  amber: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-600 dark:text-amber-400" },
  purple: { bg: "bg-purple-50 dark:bg-purple-950/30", text: "text-purple-600 dark:text-purple-400" },
  teal: { bg: "bg-teal-50 dark:bg-teal-950/30", text: "text-teal-600 dark:text-teal-400" },
  green: { bg: "bg-green-50 dark:bg-green-950/30", text: "text-green-600 dark:text-green-400" },
  red: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-600 dark:text-red-400" },
}

type ViewMode = "grid" | "list" | "timeline"
type TimePeriod = "today" | "yesterday" | "week" | "month" | "all"
type RecentlyViewedItem = (typeof recentlyViewed)[0]

export default function RecentlyViewedPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [stageFilter, setStageFilter] = useState("all")
  const [sectorFilter, setSectorFilter] = useState("all")
  const [viewedByFilter, setViewedByFilter] = useState("me")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [clearHistoryOpen, setClearHistoryOpen] = useState(false)
  const [items, setItems] = useState<RecentlyViewedItem[]>(recentlyViewed)
  const [notesModalStartup, setNotesModalStartup] = useState<RecentlyViewedItem | null>(null)
  const [notesContent, setNotesContent] = useState("")
  const [documentsModalStartup, setDocumentsModalStartup] = useState<RecentlyViewedItem | null>(null)
  const [sendToInvestorModalStartup, setSendToInvestorModalStartup] = useState<RecentlyViewedItem | null>(null)
  const [sendToInvestorSelected, setSendToInvestorSelected] = useState("")
  const [sendToInvestorNote, setSendToInvestorNote] = useState("")
  const [moveToStageModalStartup, setMoveToStageModalStartup] = useState<RecentlyViewedItem | null>(null)
  const [moveToStageSelected, setMoveToStageSelected] = useState("")
  const [reassignOwnerModalStartup, setReassignOwnerModalStartup] = useState<RecentlyViewedItem | null>(null)
  const [reassignOwnerSelected, setReassignOwnerSelected] = useState("")

  const filteredStartups = useMemo(() => {
    return items.filter((s) => {
      const matchesSearch =
        !searchQuery.trim() ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tagline.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesPeriod =
        timePeriod === "all" ||
        (timePeriod === "today" && s.period === "today") ||
        (timePeriod === "yesterday" && s.period === "yesterday") ||
        (timePeriod === "week" && ["today", "yesterday", "week"].includes(s.period)) ||
        (timePeriod === "month" && s.period !== "all")

      const stageSlug = s.stage.toLowerCase().replace(/\s+/g, "-")
      const matchesStage = stageFilter === "all" || stageSlug === stageFilter || stageSlug.startsWith(stageFilter)
      const matchesSector = sectorFilter === "all" || s.sector.toLowerCase() === sectorFilter
      const matchesViewedBy =
        viewedByFilter === "all" ||
        viewedByFilter === "me" ||
        s.assignee.name.toLowerCase().replace(/\s+/g, "-").startsWith(viewedByFilter)

      return matchesSearch && matchesPeriod && matchesStage && matchesSector && matchesViewedBy
    })
  }, [items, searchQuery, timePeriod, stageFilter, sectorFilter, viewedByFilter])

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const todayCount = items.filter((s) => s.period === "today").length
  const yesterdayCount = items.filter((s) => s.period === "yesterday").length
  const weekCount = items.filter((s) => ["today", "yesterday", "week"].includes(s.period)).length
  const monthCount = items.length

  const removeFromHistory = (id: string) => {
    setItems((prev) => prev.filter((s) => s.id !== id))
    setSelectedItems((prev) => prev.filter((i) => i !== id))
    toast({ title: "Removed from history", description: "Item removed from recently viewed." })
  }
  const togglePin = (id: string) => {
    setItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isPinned: !s.isPinned } : s))
    )
    toast({ title: "Pinned", description: "Item pinned to top." })
  }
  const handleClearHistory = () => {
    setItems([])
    setSelectedItems([])
    setClearHistoryOpen(false)
    toast({ title: "History cleared", description: "Viewing history has been cleared." })
  }
  const handleBulkRemove = () => {
    setItems((prev) => prev.filter((s) => !selectedItems.includes(s.id)))
    setSelectedItems([])
    toast({ title: "Removed from history", description: "Selected items removed." })
  }
  const handleBulkPin = () => {
    setItems((prev) =>
      prev.map((s) => (selectedItems.includes(s.id) ? { ...s, isPinned: true } : s))
    )
    setSelectedItems([])
    toast({ title: "Pinned", description: "Selected items pinned." })
  }
  const handleExportList = () => {
    const headers = ["Name", "Sector", "Stage", "Views", "Time Spent", "Viewed At"]
    const rows = items
      .filter((s) => selectedItems.includes(s.id))
      .map((s) => [s.name, s.sector, s.stage, String(s.viewCount), s.timeSpent, s.viewedAt])
    if (rows.length === 0) {
      toast({ title: "Export", description: "Select items to export." })
      return
    }
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "recently-viewed.csv"
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: "Export", description: "CSV downloaded." })
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader title="Recently Viewed" />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 overflow-auto">
          {/* Page Header */}
          <div className="border-b bg-card px-4 md:px-6 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link href="/role-selection" className="hover:text-foreground">Home</Link>
              <ChevronRight className="w-4 h-4"/>
              <Link href="/pipeline" className="hover:text-foreground">Pipeline</Link>
              <ChevronRight className="w-4 h-4"/>
              <span className="text-foreground">Recently Viewed</span>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Recently Viewed</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {monthCount} startups viewed in the last 30 days
                </p>
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
                    variant={viewMode === "timeline" ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-md"
                    onClick={() => setViewMode("timeline")}
                    aria-label="Timeline view"
                  >
                    <Calendar className="w-4 h-4" />
                  </Button>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => setClearHistoryOpen(true)}
                >
                  Clear History
                </Button>
              </div>
            </div>

            {/* Time Period Tabs */}
            <div className="flex items-center gap-1 mt-4 border-b -mb-4 -mx-4 md:-mx-6 px-4 md:px-6">
              {[
                { key: "today", label: "Today", count: todayCount },
                { key: "yesterday", label: "Yesterday", count: yesterdayCount },
                { key: "week", label: "This Week", count: weekCount },
                { key: "month", label: "This Month", count: monthCount },
                { key: "all", label: "All Time", count: null },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setTimePeriod(tab.key as TimePeriod)}
                  className={cn(
                    "px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                    timePeriod === tab.key
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className={cn(
                      "ml-1.5 px-1.5 py-0.5 text-xs rounded-full",
                      timePeriod === tab.key
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex">
            {/* Main Content */}
            <div className="flex-1 p-4 md:p-6">
              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                        <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-foreground">{todayCount}</p>
                        <p className="text-xs text-muted-foreground">Viewed Today</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-foreground">{weekCount}</p>
                        <p className="text-xs text-muted-foreground">Viewed This Week</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
                        <Flame className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-foreground">TechCorp AI</p>
                        <p className="text-xs text-muted-foreground">Most Visited</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-950/30 flex items-center justify-center">
                        <Timer className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-foreground">8.5 min</p>
                        <p className="text-xs text-muted-foreground">Avg Time Spent</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filter Bar */}
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search recently viewed..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Select value={stageFilter} onValueChange={setStageFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stages</SelectItem>
                      <SelectItem value="intake">Intake</SelectItem>
                      <SelectItem value="screening">Screening</SelectItem>
                      <SelectItem value="due-diligence">Due Diligence</SelectItem>
                      <SelectItem value="ic-review">IC Review</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sectorFilter} onValueChange={setSectorFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sectors</SelectItem>
                      <SelectItem value="fintech">Fintech</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="edtech">EdTech</SelectItem>
                      <SelectItem value="cleantech">CleanTech</SelectItem>
                      <SelectItem value="logistics">Logistics</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={viewedByFilter} onValueChange={setViewedByFilter}>
                    <SelectTrigger className="w-[120px]">
                      <User className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Viewed by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="me">Me</SelectItem>
                      <SelectItem value="all">All Team</SelectItem>
                      <SelectItem value="priya">Priya Sharma</SelectItem>
                      <SelectItem value="rahul">Rahul Mehta</SelectItem>
                      <SelectItem value="amit">Amit Patel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Content Area */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStartups.map((startup) => (
                    <RecentlyViewedCard
                      key={startup.id}
                      startup={startup}
                      isSelected={selectedItems.includes(startup.id)}
                      onSelect={() => toggleSelect(startup.id)}
                      onRemoveFromHistory={() => removeFromHistory(startup.id)}
                      onTogglePin={() => togglePin(startup.id)}
                      onViewNotes={() => { setNotesModalStartup(startup); setNotesContent(""); }}
                      onOpenDocuments={(s) => setDocumentsModalStartup(s)}
                      onSendToInvestor={(s) => { setSendToInvestorModalStartup(s); setSendToInvestorSelected(""); setSendToInvestorNote(""); }}
                      onMoveToStage={(s) => { setMoveToStageModalStartup(s); setMoveToStageSelected(s.stage); }}
                      onReassignOwner={(s) => { setReassignOwnerModalStartup(s); setReassignOwnerSelected(s.assignee.name); }}
                    />
                  ))}
                </div>
              )}

              {viewMode === "list" && (
                <div className="rounded-lg border bg-card overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="text-left">
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Startup</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Stage</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Sector</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Views</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Time Spent</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Last Viewed</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredStartups.map((startup) => (
                        <RecentlyViewedListRow
                          key={startup.id}
                          startup={startup}
                          onRemoveFromHistory={() => removeFromHistory(startup.id)}
                          onViewNotes={() => { setNotesModalStartup(startup); setNotesContent(""); }}
                          onOpenDocuments={() => setDocumentsModalStartup(startup)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {viewMode === "timeline" && (
                <div className="space-y-6">
                  {timelineData.map((day) => (
                    <div key={day.date}>
                      <h3 className="text-sm font-medium text-foreground mb-4 pb-2 border-b">
                        {day.date}
                      </h3>
                      <div className="space-y-4 ml-4 border-l-2 border-border pl-6">
                        {day.events.map((event, index) => (
                          <div key={index} className="relative">
                            <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                            <div className="flex items-start gap-4">
                              <span className="text-sm font-medium text-muted-foreground w-16">
                                {event.time}
                              </span>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary/20 to-primary/5 border flex items-center justify-center">
                                    <Building2 className="w-4 h-4 text-primary" />
                                  </div>
                                  <div>
                                    <Link 
                                      href={`/startups/${event.startup.toLowerCase().replace(/\s+/g, '-')}`}
                                      className="font-medium text-foreground hover:text-primary"
                                    >
                                      {event.startup}
                                    </Link>
                                    <p className="text-sm text-muted-foreground">
                                      Viewed for {event.duration} · {event.stage} · {event.owner}
                                    </p>
                                    {event.notes && (
                                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                        <FileText className="w-3 h-3" />
                                        {event.notes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                                    <Link href={`/startups/${event.startup.toLowerCase().replace(/\s+/g, "-")}`}>
                                      Open
                                    </Link>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={() => toast({ title: "View Notes", description: `Opening notes for ${event.startup}.` })}
                                  >
                                    View Notes
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => toast({ title: "Load More", description: "Loading more history." })}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Load More History
                    </Button>
                  </div>
                </div>
              )}

              {filteredStartups.length === 0 && viewMode !== "timeline" && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Clock className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-1">No recently viewed startups</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start exploring your pipeline to build your history
                  </p>
                  <Button asChild>
                    <Link href="/startups">Browse All Startups</Link>
                  </Button>
                </div>
              )}

              {/* Bulk Actions Bar */}
              {selectedItems.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-card border rounded-lg shadow-lg px-4 py-3 flex items-center gap-4 z-50">
                  <span className="text-sm font-medium text-foreground">
                    {selectedItems.length} items selected
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleBulkRemove}>
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      Remove from History
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportList}>
                      <Download className="w-4 h-4 mr-1.5" />
                      Export List
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleBulkPin}>
                      <Pin className="w-4 h-4 mr-1.5" />
                      Pin All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedItems([])}
                    >
                      Clear Selection
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="hidden xl:block w-80 border-l bg-card p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-64px)] sticky top-16">
              {/* Viewing Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Your Viewing Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground">This Week</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Startups viewed:</span>
                      <span className="font-medium text-foreground">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total time spent:</span>
                      <span className="font-medium text-foreground">2h 45min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Notes added:</span>
                      <span className="font-medium text-foreground">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stage changes:</span>
                      <span className="font-medium text-foreground">3</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Most Active Day: <span className="text-foreground font-medium">Tuesday (5 startups)</span>
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={() => router.push("/analytics")}>
                    View Full Activity Report
                  </Button>
                </CardContent>
              </Card>

              {/* Most Viewed */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    Most Viewed This Month
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { name: "TechCorp AI", views: 12, time: "1h 45m" },
                    { name: "FinSecure", views: 8, time: "1h 15m" },
                    { name: "GreenEnergy", views: 6, time: "45m" },
                    { name: "HealthX", views: 4, time: "32m" },
                    { name: "LogiFlow", views: 4, time: "28m" },
                  ].map((item, index) => (
                    <div key={item.name} className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground w-4">{index + 1}.</span>
                      <span className="flex-1 font-medium text-foreground truncate">{item.name}</span>
                      <span className="text-muted-foreground">{item.views} views</span>
                      <span className="text-muted-foreground text-xs">{item.time}</span>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => toast({ title: "View All Stats", description: "Opening full stats." })}>
                    View All Stats
                  </Button>
                </CardContent>
              </Card>

              {/* Team Activity */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Team Viewing Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground">Today</p>
                  <div className="space-y-2">
                    {[
                      { user: "Priya", action: "viewed TechCorp AI", time: "2 hours ago" },
                      { user: "Amit", action: "viewed GreenEnergy", time: "5 hours ago" },
                      { user: "Rahul", action: "viewed DataMesh", time: "6 hours ago" },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Avatar className="w-5 h-5">
                          <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
                            {activity.user[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground">
                          {activity.user} {activity.action}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      TechCorp AI is being viewed by 3 team members
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => toast({ title: "Team Activity", description: "Opening team activity view." })}>
                    See Team Activity
                  </Button>
                </CardContent>
              </Card>

              {/* Notes from Recent Views */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    Notes from Recent Views
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-foreground">TechCorp AI - 2 hours ago</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        "Strong technical team, need to verify revenue claims..."
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">FinSecure - 3 days ago</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        "IC meeting scheduled for Jan 28. Prepare memo by..."
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => toast({ title: "View All Notes", description: "Opening notes list." })}>
                    View All Notes
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Access */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Quick Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <Pin className="w-3 h-3" />
                      Pinned Startups
                    </p>
                    <div className="space-y-1">
                      <Link href="/startups/1" className="text-sm text-foreground hover:text-primary block">
                        • TechCorp AI <span className="text-xs text-muted-foreground">(pinned Jan 20)</span>
                      </Link>
                      <Link href="/startups/4" className="text-sm text-foreground hover:text-primary block">
                        • FinSecure <span className="text-xs text-muted-foreground">(pinned Jan 18)</span>
                      </Link>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" />
                      Continue Where You Left Off
                    </p>
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium text-foreground">TechCorp AI</p>
                      <p className="text-xs text-muted-foreground">Financial Analysis section</p>
                      <Button variant="link" size="sm" className="px-0 h-auto text-xs" asChild>
                        <Link href="/startups/1">Resume →</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <Toaster />

      {/* Notes Modal */}
      <Dialog open={!!notesModalStartup} onOpenChange={(open) => { if (!open) setNotesModalStartup(null); setNotesContent(""); }}>
        <DialogContent className="max-w-lg" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>{notesModalStartup?.hasNotes ? "View / Edit Notes" : "Add Notes"}</DialogTitle>
            <DialogDescription>Notes for {notesModalStartup?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Notes</Label>
            <Textarea
              placeholder="Add or edit notes..."
              value={notesContent}
              onChange={(e) => setNotesContent(e.target.value)}
              rows={6}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotesModalStartup(null)}>Cancel</Button>
            <Button onClick={() => { setNotesModalStartup(null); setNotesContent(""); toast({ title: "Notes saved", description: `Notes saved for ${notesModalStartup?.name}.` }); }}>Save Notes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Documents Modal */}
      <Dialog open={!!documentsModalStartup} onOpenChange={(open) => { if (!open) setDocumentsModalStartup(null); }}>
        <DialogContent className="max-w-lg" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Documents</DialogTitle>
            <DialogDescription>Documents for {documentsModalStartup?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            {["Pitch Deck", "Financial Model", "Data Room"].map((doc) => (
              <div key={doc} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">{doc}</span>
                <Button variant="ghost" size="sm" onClick={() => { setDocumentsModalStartup(null); router.push("/documents"); }}>View</Button>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDocumentsModalStartup(null)}>Close</Button>
            <Button onClick={() => { setDocumentsModalStartup(null); router.push("/documents"); }}>View All Documents</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send to Investor Modal */}
      <Dialog open={!!sendToInvestorModalStartup} onOpenChange={(open) => { if (!open) setSendToInvestorModalStartup(null); setSendToInvestorSelected(""); setSendToInvestorNote(""); }}>
        <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Send to Investor</DialogTitle>
            <DialogDescription>Send {sendToInvestorModalStartup?.name} to an investor</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Investor</Label>
              <Select value={sendToInvestorSelected} onValueChange={setSendToInvestorSelected}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose investor..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sequoia">Sequoia Capital</SelectItem>
                  <SelectItem value="accel">Accel Partners</SelectItem>
                  <SelectItem value="matrix">Matrix Partners India</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Introduction Note (optional)</Label>
              <Textarea placeholder="Add a note..." value={sendToInvestorNote} onChange={(e) => setSendToInvestorNote(e.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendToInvestorModalStartup(null)}>Cancel</Button>
            <Button disabled={!sendToInvestorSelected} onClick={() => { setSendToInvestorModalStartup(null); setSendToInvestorSelected(""); setSendToInvestorNote(""); toast({ title: "Sent", description: `${sendToInvestorModalStartup?.name} shared with investor.` }); }}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move to Stage Modal */}
      <Dialog open={!!moveToStageModalStartup} onOpenChange={(open) => { if (!open) setMoveToStageModalStartup(null); }}>
        <DialogContent className="max-w-sm" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Move to Stage</DialogTitle>
            <DialogDescription>Change pipeline stage for {moveToStageModalStartup?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Stage</Label>
            <Select value={moveToStageSelected} onValueChange={setMoveToStageSelected}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Intake">Intake</SelectItem>
                <SelectItem value="Screening">Screening</SelectItem>
                <SelectItem value="Due Diligence">Due Diligence</SelectItem>
                <SelectItem value="IC Review">IC Review</SelectItem>
                <SelectItem value="Closed Won">Closed Won</SelectItem>
                <SelectItem value="Closed Lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveToStageModalStartup(null)}>Cancel</Button>
            <Button onClick={() => { setItems((prev) => prev.map((s) => s.id === moveToStageModalStartup?.id ? { ...s, stage: moveToStageSelected } : s)); setMoveToStageModalStartup(null); toast({ title: "Stage updated", description: `${moveToStageModalStartup?.name} moved to ${moveToStageSelected}.` }); }}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reassign Owner Modal */}
      <Dialog open={!!reassignOwnerModalStartup} onOpenChange={(open) => { if (!open) setReassignOwnerModalStartup(null); }}>
        <DialogContent className="max-w-sm" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Reassign Owner</DialogTitle>
            <DialogDescription>Change owner for {reassignOwnerModalStartup?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Owner</Label>
            <Select value={reassignOwnerSelected} onValueChange={setReassignOwnerSelected}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Priya Sharma">Priya Sharma</SelectItem>
                <SelectItem value="Rahul Mehta">Rahul Mehta</SelectItem>
                <SelectItem value="Amit Patel">Amit Patel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReassignOwnerModalStartup(null)}>Cancel</Button>
            <Button onClick={() => { setItems((prev) => prev.map((s) => s.id === reassignOwnerModalStartup?.id ? { ...s, assignee: { name: reassignOwnerSelected, initials: reassignOwnerSelected.split(" ").map((n) => n[0]).join("") } } : s)); setReassignOwnerModalStartup(null); toast({ title: "Owner updated", description: `${reassignOwnerModalStartup?.name} reassigned to ${reassignOwnerSelected}.` }); }}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear History Confirmation Modal */}
      <Dialog open={clearHistoryOpen} onOpenChange={setClearHistoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Viewing History?</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear your viewing history?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>This will:</span>
              </p>
              <ul className="text-sm text-amber-700 dark:text-amber-300 mt-2 ml-6 space-y-1">
                <li>• Remove all items from Recently Viewed</li>
                <li>• Clear your viewing statistics</li>
                <li>• Cannot be undone</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Your pinned items will not be affected.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClearHistoryOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearHistory}>
              Clear History
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface RecentlyViewedCardProps {
  startup: RecentlyViewedItem
  isSelected: boolean
  onSelect: () => void
  onRemoveFromHistory: () => void
  onTogglePin: () => void
  onViewNotes: () => void
  onOpenDocuments: (startup: RecentlyViewedItem) => void
  onSendToInvestor: (startup: RecentlyViewedItem) => void
  onMoveToStage: (startup: RecentlyViewedItem) => void
  onReassignOwner: (startup: RecentlyViewedItem) => void
}

function RecentlyViewedCard({
  startup,
  isSelected,
  onSelect,
  onRemoveFromHistory,
  onTogglePin,
  onViewNotes,
  onOpenDocuments,
  onSendToInvestor,
  onMoveToStage,
  onReassignOwner,
}: RecentlyViewedCardProps) {
  const router = useRouter()
  const colors = stageColors[startup.stageColor]

  return (
    <Card className="group hover:shadow-md transition-all">
      <CardContent className="p-0">
        {/* Time Badge Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onSelect}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span className={cn(
                startup.period === "month" && "opacity-60"
              )}>
                Viewed {startup.viewedAt}
              </span>
            </div>
          </div>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[100]">
              <DropdownMenuItem onClick={() => router.push(`/startups/${startup.id}`)}>
                <FolderOpen className="w-4 h-4 mr-2" />
                Open Startup Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onViewNotes}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Add/View Notes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onOpenDocuments(startup)}>
                <FileText className="w-4 h-4 mr-2" />
                View Documents
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/documents/analytics")}>
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSendToInvestor(startup)}>
                <Send className="w-4 h-4 mr-2" />
                Send to Investor
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onMoveToStage(startup)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Move to Stage...
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onReassignOwner(startup)}>
                <User className="w-4 h-4 mr-2" />
                Reassign Owner
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={onRemoveFromHistory}>
                <Trash2 className="w-4 h-4 mr-2" />
                Remove from History
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onTogglePin}>
                <Pin className="w-4 h-4 mr-2" />
                Pin to Top
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Card Content */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg bg-gradient-to-br border flex items-center justify-center shrink-0",
              startup.iconColor || "from-primary/20 to-primary/5"
            )}>
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Link 
                  href={`/startups/${startup.id}`}
                  className="font-medium text-foreground hover:text-primary transition-colors truncate"
                >
                  {startup.name}
                </Link>
                {startup.isHot && <Flame className="w-4 h-4 text-orange-500 shrink-0" />}
                {startup.isPinned && <Pin className="w-3 h-3 text-amber-500 shrink-0" />}
                {startup.notesPending && <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground truncate">{startup.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-muted-foreground">{startup.sector} · {startup.fundingStage}</span>
            <Badge className={cn("text-xs font-medium ml-auto", colors.bg, colors.text)}>
              {startup.stage}
            </Badge>
          </div>

          {startup.tags.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              {startup.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs font-normal px-1.5 py-0">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Viewed {startup.viewCount} {startup.viewCount === 1 ? "time" : "times"} this week
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <Timer className="w-3 h-3" />
            Total time: {startup.timeSpent}
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                  {startup.assignee.initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                @{startup.assignee.name.split(" ")[0]}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Last: {startup.viewedAt}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
              <Link href={`/startups/${startup.id}`}>Open</Link>
            </Button>
            <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={onViewNotes}>
              {startup.hasNotes ? "View Notes" : "Add Notes"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface RecentlyViewedListRowProps {
  startup: RecentlyViewedItem
  onRemoveFromHistory: () => void
  onViewNotes: () => void
  onOpenDocuments: () => void
}

function RecentlyViewedListRow({ startup, onRemoveFromHistory, onViewNotes, onOpenDocuments }: RecentlyViewedListRowProps) {
  const router = useRouter()
  const colors = stageColors[startup.stageColor]

  return (
    <tr className="group hover:bg-muted/50 transition-colors">
      <td className="px-4 py-3">
        <Link href={`/startups/${startup.id}`} className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-md bg-gradient-to-br border flex items-center justify-center shrink-0",
            startup.iconColor || "from-primary/20 to-primary/5"
          )}>
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                {startup.name}
              </p>
              {startup.isHot && <Flame className="w-3 h-3 text-orange-500" />}
              {startup.notesPending && <AlertTriangle className="w-3 h-3 text-amber-500" />}
            </div>
            <p className="text-xs text-muted-foreground">@{startup.assignee.name.split(" ")[0]}</p>
          </div>
        </Link>
      </td>
      <td className="px-4 py-3">
        <Badge className={cn("font-medium", colors.bg, colors.text)}>
          {startup.stage}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div>
          <Badge variant="outline" className="font-normal">{startup.sector}</Badge>
          {startup.tags.length > 0 && (
            <span className="text-xs text-muted-foreground ml-2">
              {startup.tags.join(", ")}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-foreground">
        {startup.viewCount}
      </td>
      <td className="px-4 py-3 text-sm text-foreground">
        {startup.timeSpent}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {startup.viewedAt}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
            <Link href={`/startups/${startup.id}`}>Open</Link>
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onViewNotes}>
            Notes
          </Button>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[100]">
              <DropdownMenuItem onClick={() => router.push("/matching")}>
                <Sparkles className="w-4 h-4 mr-2" />
                Find Matches
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onOpenDocuments}>
                View Documents
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={onRemoveFromHistory}>
                Remove from History
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  )
}

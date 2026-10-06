"use client"

export const dynamic = "force-dynamic"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Building2,
  ChevronDown,
  Clock,
  Filter,
  Grid3X3,
  LayoutList,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Table,
  TrendingUp,
  Users,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
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
import { Label } from "@/components/ui/label"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { QuickAddModal } from "@/components/startup/quick-add-modal"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Loading from "./loading"
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb"

// Mock startups data
const startups = [
  {
    id: "1",
    name: "TechCorp AI",
    tagline: "AI-powered financial document analysis",
    sector: "Fintech",
    stage: "Due Diligence",
    stageColor: "amber",
    fundingStage: "Seed",
    raised: "$1.2M",
    location: "Mumbai, India",
    employees: 15,
    lastActivity: "2 hours ago",
    assignee: { name: "Priya Sharma", initials: "PS" },
    tags: ["AI/ML", "B2B"],
    isHot: true,
  },
  {
    id: "2",
    name: "GreenLeaf Energy",
    tagline: "Sustainable energy solutions for enterprises",
    sector: "CleanTech",
    stage: "Screening",
    stageColor: "blue",
    fundingStage: "Pre-Seed",
    raised: "$500K",
    location: "Bangalore, India",
    employees: 8,
    lastActivity: "5 hours ago",
    assignee: { name: "Rahul Mehta", initials: "RM" },
    tags: ["Sustainability"],
  },
  {
    id: "3",
    name: "HealthBridge",
    tagline: "Telemedicine platform connecting rural India",
    sector: "Healthcare",
    stage: "IC Review",
    stageColor: "purple",
    fundingStage: "Series A",
    raised: "$4M",
    location: "Delhi, India",
    employees: 45,
    lastActivity: "1 day ago",
    assignee: { name: "Amit Patel", initials: "AP" },
    tags: ["HealthTech", "Rural"],
    isHot: true,
  },
  {
    id: "4",
    name: "EduSpark",
    tagline: "Gamified learning for K-12 students",
    sector: "EdTech",
    stage: "Intake",
    stageColor: "slate",
    fundingStage: "Seed",
    raised: "$800K",
    location: "Pune, India",
    employees: 12,
    lastActivity: "3 days ago",
    assignee: { name: "Priya Sharma", initials: "PS" },
    tags: ["EdTech", "B2C"],
  },
  {
    id: "5",
    name: "LogiFlow",
    tagline: "AI-driven supply chain optimization",
    sector: "Logistics",
    stage: "Term Sheet",
    stageColor: "teal",
    fundingStage: "Series A",
    raised: "$5M",
    location: "Chennai, India",
    employees: 32,
    lastActivity: "6 hours ago",
    assignee: { name: "Rahul Mehta", initials: "RM" },
    tags: ["AI/ML", "B2B"],
  },
  {
    id: "6",
    name: "PayFlow",
    tagline: "Instant B2B payment infrastructure",
    sector: "Fintech",
    stage: "Closed Won",
    stageColor: "green",
    fundingStage: "Series A",
    raised: "$8M",
    location: "Hyderabad, India",
    employees: 55,
    lastActivity: "1 week ago",
    assignee: { name: "Amit Patel", initials: "AP" },
    tags: ["Payments"],
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

type ViewMode = "grid" | "list" | "table"

const stageToSlug = (stage: string) => stage.toLowerCase().replace(/\s+/g, "-")

export default function StartupsPageWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <StartupsPage />
    </Suspense>
  )
}

function StartupsPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [stageFilter, setStageFilter] = useState<string>("all")
  const [sectorFilter, setSectorFilter] = useState<string>("all")
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
  const [archiveConfirmId, setArchiveConfirmId] = useState<string | null>(null)
  const [startupsList, setStartupsList] = useState(startups)
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all")
  const [fundingFilter, setFundingFilter] = useState<string>("all")
  const searchParams = useSearchParams()

  const filteredStartups = useMemo(() => {
    return startupsList.filter((s) => {
      const matchesSearch =
        !searchQuery.trim() ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tagline.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStage =
        stageFilter === "all" || stageToSlug(s.stage) === stageFilter
      const matchesSector =
        sectorFilter === "all" ||
        s.sector.toLowerCase().replace(/\s+/g, "-") === sectorFilter
      const matchesAssignee =
        assigneeFilter === "all" || s.assignee.name === assigneeFilter
      const matchesFunding =
        fundingFilter === "all" ||
        s.fundingStage.toLowerCase().replace(/\s+/g, "-") === fundingFilter
      return matchesSearch && matchesStage && matchesSector && matchesAssignee && matchesFunding
    })
  }, [startupsList, searchQuery, stageFilter, sectorFilter, assigneeFilter, fundingFilter])

  const assignees = useMemo(
    () => Array.from(new Set(startupsList.map((s) => s.assignee.name))).sort(),
    [startupsList]
  )

  const handleArchive = (id: string) => {
    setStartupsList((prev) => prev.filter((s) => s.id !== id))
    setArchiveConfirmId(null)
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="All Startups" />

        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />

          <main className="flex-1 overflow-auto">
            {/* Breadcrumb */}
            <div className="px-4 md:px-6 pt-4">
              <PageBreadcrumb segments={[{ label: "All Startups" }]} />
            </div>
            
            {/* Page Header */}
            <div className="border-b bg-card px-4 md:px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground">All Startups</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {filteredStartups.length === startupsList.length
                      ? `${startupsList.length} startups in your pipeline`
                      : `Showing ${filteredStartups.length} of ${startupsList.length} startups`}
                  </p>
                </div>

<div className="flex items-center gap-2">
  <Button
    size="sm"
    className="bg-primary text-primary-foreground hover:bg-primary/90"
    onClick={() => setQuickAddOpen(true)}
    type="button"
  >
  <Plus className="w-4 h-4 mr-1.5" />
  Add Startup
  </Button>
  </div>
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
                      <SelectItem value="term-sheet">Term Sheet</SelectItem>
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

                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-transparent"
                    onClick={() => setAdvancedFiltersOpen(true)}
                    type="button"
                    aria-label="Advanced filters"
                  >
                    <Filter className="w-4 h-4" />
                  </Button>

                  {/* View Toggle */}
                  <div className="flex items-center border border-border rounded-lg p-1 bg-muted/30">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-md"
                      onClick={() => setViewMode("grid")}
                      type="button"
                      aria-label="Grid view"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-md"
                      onClick={() => setViewMode("list")}
                      type="button"
                      aria-label="List view"
                    >
                      <LayoutList className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "table" ? "default" : "ghost"}
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-md"
                      onClick={() => setViewMode("table")}
                      type="button"
                      aria-label="Table view"
                    >
                      <Table className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-4 md:p-6">
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredStartups.map((startup) => (
                    <StartupCard
                      key={startup.id}
                      startup={startup}
                      onFindMatches={() => router.push("/ai-insights/investor-matching")}
                      onEdit={() => router.push(`/startups/${startup.id}`)}
                      onArchive={() => setArchiveConfirmId(startup.id)}
                    />
                  ))}
                </div>
              )}

              {viewMode === "list" && (
                <div className="space-y-3">
                  {filteredStartups.map((startup) => (
                    <StartupListItem
                      key={startup.id}
                      startup={startup}
                      onFindMatches={() => router.push("/ai-insights/investor-matching")}
                      onEdit={() => router.push(`/startups/${startup.id}`)}
                      onArchive={() => setArchiveConfirmId(startup.id)}
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
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Stage</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Funding</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Owner</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Last Activity</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredStartups.map((startup) => (
                        <StartupTableRow
                          key={startup.id}
                          startup={startup}
                          onFindMatches={() => router.push("/ai-insights/investor-matching")}
                          onEdit={() => router.push(`/startups/${startup.id}`)}
                          onArchive={() => setArchiveConfirmId(startup.id)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {filteredStartups.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Building2 className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-1">No startups found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Quick Add Startup Modal */}
      <QuickAddModal open={quickAddOpen} onOpenChange={setQuickAddOpen} />

      {/* Advanced Filters */}
      <Dialog open={advancedFiltersOpen} onOpenChange={setAdvancedFiltersOpen}>
        <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Advanced filters</DialogTitle>
            <DialogDescription>
              Filter by assignee and funding stage. Clear to show all.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                <SelectTrigger className="bg-transparent">
                  <SelectValue placeholder="All assignees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All assignees</SelectItem>
                  {assignees.map((name) => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Funding stage</Label>
              <Select value={fundingFilter} onValueChange={setFundingFilter}>
                <SelectTrigger className="bg-transparent">
                  <SelectValue placeholder="All stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All funding stages</SelectItem>
                  <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                  <SelectItem value="seed">Seed</SelectItem>
                  <SelectItem value="series-a">Series A</SelectItem>
                  <SelectItem value="series-b">Series B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAssigneeFilter("all")
                setFundingFilter("all")
                setAdvancedFiltersOpen(false)
              }}
              type="button"
            >
              Clear
            </Button>
            <Button onClick={() => setAdvancedFiltersOpen(false)} type="button">
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive confirmation */}
      <Dialog open={!!archiveConfirmId} onOpenChange={(open) => !open && setArchiveConfirmId(null)}>
        <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Archive startup?</DialogTitle>
            <DialogDescription>
              {startupsList.find((s) => s.id === archiveConfirmId)?.name ?? "This startup"} will be moved to the archive. You can restore it later from pipeline settings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArchiveConfirmId(null)} type="button">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => archiveConfirmId && handleArchive(archiveConfirmId)}
              type="button"
            >
              Archive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Suspense>
  )
}

interface StartupProps {
  startup: (typeof startups)[0]
  onFindMatches?: () => void
  onEdit?: () => void
  onArchive?: () => void
}

function StartupCard({ startup, onFindMatches, onEdit, onArchive }: StartupProps) {
  const colors = stageColors[startup.stageColor]

  return (
    <Card className="group hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/startups/${startup.id}`} className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {startup.name}
                </h3>
                {startup.isHot && (
                  <TrendingUp className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{startup.tagline}</p>
            </div>
          </Link>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" type="button" aria-label="Actions">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[100]">
              <DropdownMenuItem onClick={onFindMatches}>
                <Sparkles className="w-4 h-4 mr-2" />
                Find Matches
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={onArchive}>
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

          <Link href={`/startups/${startup.id}`} className="block mt-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-normal">
                {startup.sector}
              </Badge>
              <Badge className={cn("text-xs font-medium", colors.bg, colors.text)}>
                {startup.stage}
              </Badge>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                    {startup.assignee.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  {startup.assignee.name}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {startup.lastActivity}
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>
  )
}

function StartupListItem({ startup, onFindMatches, onEdit, onArchive }: StartupProps) {
  const colors = stageColors[startup.stageColor]

  return (
    <div className="group flex items-center gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-all">
      <Link href={`/startups/${startup.id}`} className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border flex items-center justify-center shrink-0">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
              {startup.name}
            </h3>
            {startup.isHot && (
              <TrendingUp className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">{startup.tagline}</p>
        </div>
      </Link>
      <div className="hidden md:flex items-center gap-3">
        <Badge variant="outline" className="font-normal">
          {startup.sector}
        </Badge>
        <Badge className={cn("font-medium", colors.bg, colors.text)}>
          {startup.stage}
        </Badge>
      </div>
      <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="w-4 h-4" />
        {startup.employees}
      </div>
      <div className="hidden lg:block text-sm font-medium text-foreground">
        {startup.raised}
      </div>
      <div className="flex items-center gap-2">
        <Avatar className="w-7 h-7">
          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
            {startup.assignee.initials}
          </AvatarFallback>
        </Avatar>
      </div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" type="button" aria-label="Actions">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="z-[100]">
          <DropdownMenuItem onClick={onFindMatches}>
            <Sparkles className="w-4 h-4 mr-2" />
            Find Matches
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive" onClick={onArchive}>
            Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function StartupTableRow({ startup, onFindMatches, onEdit, onArchive }: StartupProps) {
  const colors = stageColors[startup.stageColor]

  return (
    <tr className="group hover:bg-muted/50 transition-colors">
      <td className="px-4 py-3">
        <Link href={`/startups/${startup.id}`} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary/20 to-primary/5 border flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground group-hover:text-primary transition-colors">
              {startup.name}
            </p>
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
        <Badge className={cn("font-medium", colors.bg, colors.text)}>
          {startup.stage}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm">
          <p className="font-medium text-foreground">{startup.raised}</p>
          <p className="text-xs text-muted-foreground">{startup.fundingStage}</p>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
              {startup.assignee.initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {startup.assignee.name.split(" ")[0]}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {startup.lastActivity}
      </td>
      <td className="px-4 py-3">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" type="button" aria-label="Actions">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-[100]">
            <DropdownMenuItem onClick={onFindMatches}>
              <Sparkles className="w-4 h-4 mr-2" />
              Find Matches
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={onArchive}>
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  )
}

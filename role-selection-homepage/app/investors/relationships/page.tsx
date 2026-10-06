"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  ArrowUpDown,
  Briefcase,
  Calendar,
  CalendarDays,
  Check,
  ChevronRight,
  Coffee,
  Download,
  Eye,
  FileText,
  Filter,
  Globe,
  Handshake,
  Import,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Paperclip,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Star,
  TrendingUp,
  Trash2,
  Upload,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { exportToCsv } from "@/lib/export-utils"

// Relationship data
const relationships = [
  {
    id: "1",
    name: "Sequoia Capital",
    initials: "SQ",
    avatarColor: "bg-blue-500",
    type: "VC",
    stages: "Series A-C",
    checkSize: "$5M-$50M",
    location: "Menlo Park, CA",
    strength: "strong",
    relationshipOwner: "You",
    lastContact: "2 days ago",
    lastContactDate: "Jan 22",
    daysSinceContact: 2,
    totalInteractions: 24,
    recentActivity: [
      { action: "Introduced TechCorp AI", time: "5 days ago" },
      { action: "Coffee meeting", time: "2 weeks ago" },
      { action: "Email exchange", time: "3 weeks ago" },
    ],
    tags: ["SaaS", "Fintech", "Bangalore"],
  },
  {
    id: "2",
    name: "Matrix Partners",
    initials: "MP",
    avatarColor: "bg-purple-500",
    type: "VC",
    stages: "Seed-Series B",
    checkSize: "$2M-$10M",
    location: "San Francisco, CA",
    strength: "medium",
    relationshipOwner: "You",
    lastContact: "3 weeks ago",
    lastContactDate: "Jan 5",
    daysSinceContact: 21,
    totalInteractions: 12,
    recentActivity: [
      { action: "Declined HealthBridge", time: "1 month ago" },
      { action: "Partner meeting", time: "2 months ago" },
    ],
    tags: ["Healthcare", "Deep Tech", "Mumbai"],
  },
  {
    id: "3",
    name: "Ramesh Sharma",
    initials: "RS",
    avatarColor: "bg-emerald-500",
    hasImage: true,
    type: "Angel",
    stages: "Pre-Seed-Seed",
    checkSize: "$50K-$500K",
    location: "Delhi, India",
    strength: "weak",
    relationshipOwner: "You",
    lastContact: "6 months ago",
    lastContactDate: "Jul 22",
    daysSinceContact: 180,
    totalInteractions: 4,
    recentActivity: [
      { action: "Initial intro call", time: "6 months ago" },
      { action: "LinkedIn connection", time: "8 months ago" },
    ],
    tags: ["Angel", "First Check", "Delhi"],
    note: "Needs re-engagement",
  },
  {
    id: "4",
    name: "Accel Partners",
    initials: "AP",
    avatarColor: "bg-orange-500",
    type: "VC",
    stages: "Series A-B",
    checkSize: "$5M-$25M",
    location: "Palo Alto, CA",
    strength: "strong",
    relationshipOwner: "You",
    lastContact: "1 week ago",
    lastContactDate: "Jan 17",
    daysSinceContact: 7,
    totalInteractions: 18,
    recentActivity: [
      { action: "Intro call for CloudAI", time: "1 week ago" },
      { action: "Portfolio review meeting", time: "3 weeks ago" },
      { action: "Lunch meeting", time: "1 month ago" },
    ],
    tags: ["SaaS", "Enterprise", "Consumer"],
  },
  {
    id: "5",
    name: "Lightspeed Venture Partners",
    initials: "LV",
    avatarColor: "bg-cyan-500",
    type: "VC",
    stages: "Seed-Series C",
    checkSize: "$1M-$100M",
    location: "Menlo Park, CA",
    strength: "new",
    relationshipOwner: "You",
    lastContact: "1 day ago",
    lastContactDate: "Jan 23",
    daysSinceContact: 1,
    totalInteractions: 2,
    recentActivity: [
      { action: "Intro meeting", time: "1 day ago" },
    ],
    tags: ["Enterprise", "Fintech", "Consumer"],
  },
  {
    id: "6",
    name: "Sharma Family Office",
    initials: "SF",
    avatarColor: "bg-rose-500",
    type: "Family Office",
    stages: "Series A-B",
    checkSize: "$2M-$10M",
    location: "Mumbai, India",
    strength: "medium",
    relationshipOwner: "You",
    lastContact: "2 months ago",
    lastContactDate: "Nov 24",
    daysSinceContact: 60,
    totalInteractions: 8,
    recentActivity: [
      { action: "Portfolio company intro", time: "2 months ago" },
      { action: "Coffee meeting", time: "3 months ago" },
    ],
    tags: ["Healthcare", "Fintech", "India"],
  },
]

const strengthConfig = {
  strong: { label: "Strong", icon: Star, color: "text-green-600 dark:text-green-400", bgColor: "bg-green-50 dark:bg-green-950", borderColor: "border-green-200 dark:border-green-800" },
  medium: { label: "Medium", icon: Zap, color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-950", borderColor: "border-amber-200 dark:border-amber-800" },
  weak: { label: "Weak", icon: MessageSquare, color: "text-gray-500 dark:text-gray-400", bgColor: "bg-gray-50 dark:bg-gray-900", borderColor: "border-gray-200 dark:border-gray-700" },
  new: { label: "New", icon: Sparkles, color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-950", borderColor: "border-blue-200 dark:border-blue-800" },
}

const startups = [
  { id: "1", name: "TechCorp AI", stage: "Series A", sector: "AI/ML" },
  { id: "2", name: "HealthBridge", stage: "Seed", sector: "Healthcare" },
  { id: "3", name: "CloudAI", stage: "Series A", sector: "Enterprise" },
  { id: "4", name: "FinanceFlow", stage: "Series B", sector: "Fintech" },
]

export default function MyRelationshipsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [relationshipsList, setRelationshipsList] = useState(relationships)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("last-contact")
  const [filterStrength, setFilterStrength] = useState("all")
  const [activeFilter, setActiveFilter] = useState("all")
  const [logContactOpen, setLogContactOpen] = useState(false)
  const [introduceStartupOpen, setIntroduceStartupOpen] = useState(false)
  const [addRelationshipOpen, setAddRelationshipOpen] = useState(false)
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
  const [selectedInvestor, setSelectedInvestor] = useState(null)
  const [introduceStep, setIntroduceStep] = useState(1)
  const [bulkSelectMode, setBulkSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [advancedLastContact, setAdvancedLastContact] = useState("")
  const [advancedStage, setAdvancedStage] = useState("")
  const [advancedInteractionMin, setAdvancedInteractionMin] = useState("")
  const [advancedInteractionMax, setAdvancedInteractionMax] = useState("")
  const [advancedSectors, setAdvancedSectors] = useState("")
  const [advancedLocation, setAdvancedLocation] = useState("")

  const typeCounts = useMemo(() => {
    const all = relationshipsList.length
    const vcs = relationshipsList.filter((r) => r.type === "VC").length
    const familyOffices = relationshipsList.filter((r) => r.type === "Family Office").length
    const angels = relationshipsList.filter((r) => r.type === "Angel").length
    const corporate = relationshipsList.filter((r) => r.type === "Corporate").length
    return { all, vcs, familyOffices, angels, corporate }
  }, [relationshipsList])

  const filteredRelationships = useMemo(() => {
    let list = relationshipsList.filter((rel) => {
      if (searchQuery && !rel.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (filterStrength !== "all" && rel.strength !== filterStrength) return false
      if (activeFilter !== "all") {
        if (activeFilter === "vcs" && rel.type !== "VC") return false
        if (activeFilter === "family-offices" && rel.type !== "Family Office") return false
        if (activeFilter === "angels" && rel.type !== "Angel") return false
        if (activeFilter === "corporate" && rel.type !== "Corporate") return false
      }
      if (advancedLastContact) {
        const days = (rel as { daysSinceContact?: number }).daysSinceContact ?? 999
        if (advancedLastContact === "7d" && days > 7) return false
        if (advancedLastContact === "30d" && days > 30) return false
        if (advancedLastContact === "90d" && days > 90) return false
        if (advancedLastContact === "90d+" && days <= 90) return false
      }
      if (advancedStage && !rel.stages.toLowerCase().includes(advancedStage.replace("-", " "))) return false
      const minInt = parseInt(advancedInteractionMin, 10)
      const maxInt = parseInt(advancedInteractionMax, 10)
      if (!isNaN(minInt) && rel.totalInteractions < minInt) return false
      if (!isNaN(maxInt) && rel.totalInteractions > maxInt) return false
      if (advancedSectors.trim()) {
        const terms = advancedSectors.toLowerCase().split(",").map((s) => s.trim())
        if (!terms.some((t) => rel.tags.some((tag) => tag.toLowerCase().includes(t)))) return false
      }
      if (advancedLocation.trim() && !rel.location.toLowerCase().includes(advancedLocation.toLowerCase())) return false
      return true
    })
    if (sortBy === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    else if (sortBy === "strength") {
      const order = { strong: 0, medium: 1, weak: 2, new: 3 }
      list = [...list].sort((a, b) => (order[a.strength] ?? 4) - (order[b.strength] ?? 4))
    } else list = [...list].sort((a, b) => new Date(b.lastContactDate).getTime() - new Date(a.lastContactDate).getTime())
    return list
  }, [relationshipsList, searchQuery, filterStrength, activeFilter, sortBy, advancedLastContact, advancedStage, advancedInteractionMin, advancedInteractionMax, advancedSectors, advancedLocation])

  const stats = useMemo(() => {
    const total = relationshipsList.length
    const strong = relationshipsList.filter((r) => r.strength === "strong").length
    const contactedThisMonth = 18
    const responseRate = "85%"
    return { total, strong, contactedThisMonth, responseRate }
  }, [relationshipsList])

  const handleLogContact = (investor) => {
    setSelectedInvestor(investor)
    setLogContactOpen(true)
  }

  const handleIntroduceStartup = (investor) => {
    setSelectedInvestor(investor)
    setIntroduceStep(1)
    setIntroduceStartupOpen(true)
  }

  const removeRelationship = (id) => {
    setRelationshipsList((prev) => prev.filter((r) => r.id !== id))
    setSelectedIds((prev) => prev.filter((i) => i !== id))
    toast({ title: "Relationship removed", description: "The investor has been removed from your relationships." })
  }

  const handleBulkRemove = () => {
    if (selectedIds.length === 0) return
    setRelationshipsList((prev) => prev.filter((r) => !selectedIds.includes(r.id)))
    setSelectedIds([])
    setBulkSelectMode(false)
    toast({ title: "Relationships removed", description: `${selectedIds.length} relationship(s) removed.` })
  }

  const handleBulkExport = () => {
    const rows = filteredRelationships.filter((r) => selectedIds.includes(r.id)).map((r) => [r.name, r.type, r.strength, r.lastContact, r.totalInteractions])
    exportToCsv({ headers: ["Name", "Type", "Strength", "Last Contact", "Interactions"], rows, filename: "relationships-export.csv" })
    toast({ title: "Export started", description: "Your selection has been exported." })
  }

  const handleBulkEmail = () => {
    toast({ title: "Email", description: `Opening composer for ${selectedIds.length} selected relationship(s).` })
  }

  const handleExportList = () => {
    const rows = filteredRelationships.map((r) => [r.name, r.type, r.strength, r.lastContact, r.totalInteractions, r.location])
    exportToCsv({ headers: ["Name", "Type", "Strength", "Last Contact", "Interactions", "Location"], rows, filename: "relationships-list.csv" })
    toast({ title: "Export started", description: "Relationship list exported." })
  }

  const handleClearAdvancedFilters = () => {
    setAdvancedLastContact("")
    setAdvancedStage("")
    setAdvancedInteractionMin("")
    setAdvancedInteractionMax("")
    setAdvancedSectors("")
    setAdvancedLocation("")
    setAdvancedFiltersOpen(false)
    toast({ title: "Filters cleared", description: "All advanced filters have been reset." })
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Toaster />
      <DashboardHeader />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="max-w-[1600px] mx-auto p-4 md:p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/role-selection" className="hover:text-foreground">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/investors" className="hover:text-foreground">Investors</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">My Relationships</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-foreground">My Relationships</h1>
                <p className="text-muted-foreground mt-1">Investors you have personal relationships with</p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px]">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-contact">Last Contact</SelectItem>
                    <SelectItem value="strength">Relationship Strength</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStrength} onValueChange={setFilterStrength}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Strength</SelectItem>
                    <SelectItem value="strong">Strong</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="weak">Weak</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant={bulkSelectMode ? "default" : "outline"} 
                  onClick={() => {
                    setBulkSelectMode(!bulkSelectMode)
                    if (bulkSelectMode) setSelectedIds([])
                  }}
                >
                  <Check className="w-4 h-4 mr-2" />
                  {bulkSelectMode ? `Selected (${selectedIds.length})` : "Select"}
                </Button>
                <Button variant="outline" onClick={() => setAdvancedFiltersOpen(true)}>
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <Button onClick={() => setAddRelationshipOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Relationship
                </Button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{stats.total}</p>
                      <p className="text-xs text-muted-foreground">Total Relationships</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center">
                      <Star className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{stats.strong}</p>
                      <p className="text-xs text-muted-foreground">Strong Relationships</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{stats.contactedThisMonth}</p>
                      <p className="text-xs text-muted-foreground">Contacted This Month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                      <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{stats.responseRate}</p>
                      <p className="text-xs text-muted-foreground">Response Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search & Filter Pills */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by investor name, type, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full">
                  <TabsList className="justify-start rounded-lg border border-border bg-muted/50 h-auto p-1 flex-wrap">
                    <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground px-4 py-2 transition-colors whitespace-nowrap">
                      All ({typeCounts.all})
                    </TabsTrigger>
                    <TabsTrigger value="vcs" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground px-4 py-2 transition-colors whitespace-nowrap">
                      VCs ({typeCounts.vcs})
                    </TabsTrigger>
                    <TabsTrigger value="family-offices" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground px-4 py-2 transition-colors whitespace-nowrap">
                      Family Offices ({typeCounts.familyOffices})
                    </TabsTrigger>
                    <TabsTrigger value="angels" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground px-4 py-2 transition-colors whitespace-nowrap">
                      Angels ({typeCounts.angels})
                    </TabsTrigger>
                    <TabsTrigger value="corporate" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground px-4 py-2 transition-colors whitespace-nowrap">
                      Corporate ({typeCounts.corporate})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Bulk Actions Bar */}
            {bulkSelectMode && selectedIds.length > 0 && (
              <Card className="mb-4 p-3 bg-primary/5 border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{selectedIds.length} selected</span>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedIds(filteredRelationships.map((r) => r.id))}>
                      Select All
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])}>
                      Clear Selection
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleBulkEmail(); }}>
                      <Mail className="w-4 h-4 mr-2" />
                      Email All
                    </Button>
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleBulkExport(); }}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive bg-transparent" onClick={(e) => { e.stopPropagation(); handleBulkRemove(); }}>
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Main Content */}
            <div className="flex gap-6">
              {/* Investor Cards Grid */}
              <div className="flex-1">
                {/* Empty State */}
                {filteredRelationships.length === 0 && (
                  <Card className="p-12 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Handshake className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No relationships yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                      Add your first investor relationship to start tracking interactions and building your network.
                    </p>
                    <Button onClick={() => setAddRelationshipOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Relationship
                    </Button>
                  </Card>
                )}

                {filteredRelationships.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredRelationships.map((investor) => {
                      const strength = strengthConfig[investor.strength]
                      const StrengthIcon = strength.icon

                      const isSelected = selectedIds.includes(investor.id)

                      return (
                        <Card 
                          key={investor.id} 
                          className={cn(
                            "group hover:shadow-md transition-shadow cursor-pointer relative",
                            isSelected && "ring-2 ring-primary"
                          )}
                          onClick={() => {
                            if (bulkSelectMode) {
                              setSelectedIds(prev => 
                                isSelected 
                                  ? prev.filter(id => id !== investor.id)
                                  : [...prev, investor.id]
                              )
                            }
                          }}
                        >
                          <CardContent className="p-4">
                            {/* Bulk Select Checkbox */}
                            {bulkSelectMode && (
                              <div className="absolute top-3 left-3">
                                <Checkbox 
                                  checked={isSelected}
                                  onCheckedChange={(checked) => {
                                    setSelectedIds(prev => 
                                      checked 
                                        ? [...prev, investor.id]
                                        : prev.filter(id => id !== investor.id)
                                    )
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            )}
                            
                            {/* Header */}
                            <div className={cn("flex items-start justify-between mb-3", bulkSelectMode && "pl-7")}>
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  {investor.hasImage ? (
                                    <AvatarImage src="/placeholder-avatar.jpg" />
                                  ) : null}
                                  <AvatarFallback className={cn("text-white font-medium", investor.avatarColor)}>
                                    {investor.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <Link 
                                    href={`/investors/${investor.id}`}
                                    className="font-medium text-foreground hover:text-primary hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {investor.name}
                                  </Link>
                                  <p className="text-sm text-muted-foreground">
                                    {investor.type} • {investor.stages} • {investor.checkSize}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="outline" className={cn("gap-1", strength.color, strength.bgColor, strength.borderColor)}>
                                <StrengthIcon className="w-3 h-3" />
                                {strength.label}
                              </Badge>
                            </div>

                            {/* Details */}
                            <div className="space-y-2 mb-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Relationship Owner:</span>
                                <span className="font-medium">{investor.relationshipOwner}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Last Contact:</span>
                                <span className="font-medium">{investor.lastContact} ({investor.lastContactDate})</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Total Interactions:</span>
                                <span className="font-medium">{investor.totalInteractions}</span>
                              </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="mb-3">
                              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Recent Activity:
                              </p>
                              <div className="space-y-1">
                                {investor.recentActivity.slice(0, 3).map((activity, idx) => (
                                  <div key={idx} className="flex items-center text-sm">
                                    <span className="text-muted-foreground mr-2">•</span>
                                    <span className="flex-1 truncate">{activity.action}</span>
                                    <span className="text-xs text-muted-foreground ml-2">{activity.time}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Note if weak */}
                            {investor.note && (
                              <div className="mb-3 px-2 py-1.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded text-xs text-amber-700 dark:text-amber-300">
                                {investor.note}
                              </div>
                            )}

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {investor.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs font-normal">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            {/* Actions - icon-only with tooltips */}
                            <div className="flex items-center justify-between pt-3 border-t gap-2">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon" className="h-8 w-8 shrink-0 border-border bg-muted/50 hover:bg-muted" asChild>
                                      <Link href={`/investors/${investor.id}`} onClick={(e) => e.stopPropagation()}>
                                        <Eye className="w-4 h-4" />
                                      </Link>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">View profile</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon" className="h-8 w-8 shrink-0 border-border bg-muted/50 hover:bg-muted" onClick={(e) => { e.stopPropagation(); handleLogContact(investor); }}>
                                      <Phone className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">Log contact</TooltipContent>
                                </Tooltip>
                                {investor.strength === "weak" ? (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="outline" size="icon" className="h-8 w-8 shrink-0 border-border bg-muted/50 hover:bg-muted" onClick={(e) => { e.stopPropagation(); handleIntroduceStartup(investor); }}>
                                        <RefreshCw className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Reconnect</TooltipContent>
                                  </Tooltip>
                                ) : (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="outline" size="icon" className="h-8 w-8 shrink-0 border-border bg-muted/50 hover:bg-muted" onClick={(e) => { e.stopPropagation(); handleIntroduceStartup(investor); }}>
                                        <Sparkles className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Introduce startup</TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="outline" size="icon" className="h-8 w-8 shrink-0 border-border text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={(e) => { e.stopPropagation(); removeRelationship(investor.id); }}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">Remove relationship</TooltipContent>
                              </Tooltip>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Right Sidebar */}
              <div className="hidden xl:block w-80 space-y-4">
                {/* Relationship Insights */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Relationship Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Avg. interactions/investor</span>
                      <span className="font-medium">14</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Most active investor</span>
                      <span className="font-medium text-primary">Sequoia Capital (24)</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Needs attention</span>
                      <span className="font-medium text-amber-600 dark:text-amber-400">5 investors</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent" onClick={() => router.push("/analytics")}>
                      View Full Report
                    </Button>
                  </CardContent>
                </Card>

                {/* Upcoming Interactions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-primary" />
                      Upcoming Interactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center shrink-0">
                        <Coffee className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Coffee with Accel Partners</p>
                        <p className="text-xs text-muted-foreground">Tomorrow, 10:00 AM</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Follow up with Lightspeed</p>
                        <p className="text-xs text-muted-foreground">Jan 26, 2:00 PM</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center shrink-0">
                        <Video className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Intro call with new VC</p>
                        <p className="text-xs text-muted-foreground">Jan 28, 11:00 AM</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent" onClick={() => toast({ title: "Calendar", description: "Opening calendar view." })}>
                      <Calendar className="w-4 h-4 mr-2" />
                      View Calendar
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" onClick={() => toast({ title: "Log bulk contacts", description: "Select relationships and use bulk actions to log multiple contacts." })}>
                      <Upload className="w-4 h-4 mr-2" />
                      Log bulk contacts
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" onClick={handleExportList}>
                      <Download className="w-4 h-4 mr-2" />
                      Export relationship list
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" onClick={() => toast({ title: "Import from LinkedIn", description: "Connect your LinkedIn account to import contacts." })}>
                      <Linkedin className="w-4 h-4 mr-2" />
                      Import from LinkedIn
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" onClick={() => toast({ title: "Schedule review", description: "Set a reminder to review your relationships." })}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Schedule relationship review
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Log Contact Modal */}
      <Dialog open={logContactOpen} onOpenChange={setLogContactOpen}>
        <DialogContent className="sm:max-w-[600px]" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Log Contact with {selectedInvestor?.name ?? "Investor"}</DialogTitle>
            <DialogDescription>
              Record your interaction to keep your relationship history up to date.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Interaction Type</Label>
                <Select defaultValue="call">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </div>
                    </SelectItem>
                    <SelectItem value="meeting">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        Meeting
                      </div>
                    </SelectItem>
                    <SelectItem value="email">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </div>
                    </SelectItem>
                    <SelectItem value="introduction">
                      <div className="flex items-center">
                        <Handshake className="w-4 h-4 mr-2" />
                        Introduction
                      </div>
                    </SelectItem>
                    <SelectItem value="event">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Event
                      </div>
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date & Time</Label>
                <Input type="datetime-local" defaultValue="2026-01-24T10:00" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Input type="number" placeholder="30" />
              </div>
              <div className="space-y-2">
                <Label>Related Startup</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select startup (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {startups.map((startup) => (
                      <SelectItem key={startup.id} value={startup.id}>
                        {startup.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="What did you discuss? Any key takeaways?" rows={3} />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="followup" />
                <Label htmlFor="followup" className="text-sm font-normal">Follow-up required?</Label>
              </div>
              <div className="flex-1">
                <Input type="date" placeholder="Next action date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Attachments</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 cursor-pointer">
                <Paperclip className="w-5 h-5 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Drop files here or click to upload</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogContactOpen(false)}>Cancel</Button>
            <Button onClick={() => { setLogContactOpen(false); toast({ title: "Contact logged", description: "Interaction recorded successfully." }); }}>Log Interaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Introduce Startup Modal */}
      <Dialog open={introduceStartupOpen} onOpenChange={setIntroduceStartupOpen}>
        <DialogContent className="sm:max-w-[700px]" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Introduce Startup to {selectedInvestor?.name}</DialogTitle>
            <DialogDescription>
              Step {introduceStep} of 4: {introduceStep === 1 ? "Select Startup" : introduceStep === 2 ? "Review Match" : introduceStep === 3 ? "Compose Message" : "Add Attachments"}
            </DialogDescription>
          </DialogHeader>

          {introduceStep === 1 && (
            <div className="space-y-4 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search startups..." className="pl-10" />
              </div>
              <div className="space-y-2 max-h-[300px] overflow-auto">
                {startups.map((startup) => (
                  <Card key={startup.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {startup.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{startup.name}</p>
                          <p className="text-sm text-muted-foreground">{startup.stage} • {startup.sector}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {introduceStep === 2 && (
            <div className="space-y-4 py-4">
              <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">87%</p>
                      <p className="text-sm text-muted-foreground">Match Score</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Stage match: Series A (investor prefers Series A-C)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Sector match: AI/ML (in investor thesis)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Check size: $8M ask fits $5M-$50M range</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {introduceStep === 3 && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Template</Label>
                <Select defaultValue="warm-intro">
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warm-intro">Warm Introduction</SelectItem>
                    <SelectItem value="formal">Formal Introduction</SelectItem>
                    <SelectItem value="brief">Brief Introduction</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  rows={6}
                  defaultValue={`Hi {{investor_name}},

I wanted to introduce you to {{startup_name}}, an exciting company in the AI/ML space that I think would be a great fit for Sequoia's portfolio.

They're currently raising their Series A and have impressive traction with enterprise customers.

Would you be open to a quick intro call?

Best regards`}
                />
              </div>
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Preview</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>Hi Sequoia Capital,</p>
                  <p className="mt-2">I wanted to introduce you to TechCorp AI, an exciting company in the AI/ML space...</p>
                </CardContent>
              </Card>
            </div>
          )}

          {introduceStep === 4 && (
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-medium text-sm">Pitch Deck</p>
                      <p className="text-xs text-muted-foreground">Required</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium text-sm">Financial Model</p>
                      <p className="text-xs text-muted-foreground">Optional</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">One-Pager</p>
                      <p className="text-xs text-muted-foreground">Optional</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {introduceStep > 1 && (
              <Button variant="outline" onClick={() => setIntroduceStep(introduceStep - 1)}>
                Back
              </Button>
            )}
            <Button variant="outline" onClick={() => setIntroduceStartupOpen(false)}>
              Cancel
            </Button>
            {introduceStep < 4 ? (
              <Button onClick={() => setIntroduceStep(introduceStep + 1)}>
                Continue
              </Button>
            ) : (
              <Button onClick={() => setIntroduceStartupOpen(false)}>
                <Send className="w-4 h-4 mr-2" />
                Send Introduction
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Relationship Modal */}
      <Dialog open={addRelationshipOpen} onOpenChange={setAddRelationshipOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Relationship</DialogTitle>
            <DialogDescription>
              Add an investor to your personal relationship network.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Search Existing Investors</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search by name, firm, or email..." className="pl-10" />
              </div>
            </div>
            <div className="text-center py-4 border-t border-b">
              <p className="text-sm text-muted-foreground">Or add a new investor</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Investor/Firm Name</Label>
                <Input placeholder="e.g., Sequoia Capital" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vc">VC</SelectItem>
                    <SelectItem value="angel">Angel Investor</SelectItem>
                    <SelectItem value="family-office">Family Office</SelectItem>
                    <SelectItem value="corporate">Corporate VC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <Input type="email" placeholder="contact@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="e.g., San Francisco, CA" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Investment Stages</Label>
                <Input placeholder="e.g., Series A-C" />
              </div>
              <div className="space-y-2">
                <Label>Check Size</Label>
                <Input placeholder="e.g., $5M-$50M" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>How do you know them?</Label>
              <Textarea placeholder="Describe your relationship..." rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Initial Relationship Strength</Label>
              <Select defaultValue="new">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strong">Strong - Close, regular contact</SelectItem>
                  <SelectItem value="medium">Medium - Occasional contact</SelectItem>
                  <SelectItem value="weak">Weak - Minimal contact</SelectItem>
                  <SelectItem value="new">New - Just connected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddRelationshipOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAddRelationshipOpen(false); toast({ title: "Relationship added", description: "Investor added to your relationships." }); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Relationship
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Advanced Filters - no duplicate strength/type (use header + tabs) */}
      <Dialog open={advancedFiltersOpen} onOpenChange={setAdvancedFiltersOpen}>
        <DialogContent className="sm:max-w-[400px]" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Advanced Filters</DialogTitle>
            <DialogDescription>
              Filter by last contact, stage, interactions, sectors, and location.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Last Contact</Label>
              <Select value={advancedLastContact} onValueChange={setAdvancedLastContact}>
                <SelectTrigger>
                  <SelectValue placeholder="Any time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="90d+">More than 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Investment Stage</Label>
              <Select value={advancedStage} onValueChange={setAdvancedStage}>
                <SelectTrigger>
                  <SelectValue placeholder="Any stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                  <SelectItem value="seed">Seed</SelectItem>
                  <SelectItem value="series-a">Series A</SelectItem>
                  <SelectItem value="series-b">Series B</SelectItem>
                  <SelectItem value="series-c+">Series C+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Interaction Count</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input type="number" placeholder="Min" value={advancedInteractionMin} onChange={(e) => setAdvancedInteractionMin(e.target.value)} />
                <Input type="number" placeholder="Max" value={advancedInteractionMax} onChange={(e) => setAdvancedInteractionMax(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sectors (comma-separated)</Label>
              <Input placeholder="e.g., SaaS, Fintech, Healthcare" value={advancedSectors} onChange={(e) => setAdvancedSectors(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input placeholder="e.g., San Francisco, India" value={advancedLocation} onChange={(e) => setAdvancedLocation(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClearAdvancedFilters}>Clear All</Button>
            <Button onClick={() => { setAdvancedFiltersOpen(false); toast({ title: "Filters applied", description: "Advanced filters are active." }); }}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

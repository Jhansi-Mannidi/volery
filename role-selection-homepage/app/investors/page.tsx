"use client"

export const dynamic = "force-dynamic"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Building,
  Building2,
  ChevronDown,
  Clock,
  Filter,
  Globe,
  Grid3X3,
  LayoutList,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Star,
  Table,
  TrendingUp,
  Users,
  X,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { AddEditInvestorModal } from "@/components/investor/add-edit-investor-modal"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Mock investors data
const investors = [
  {
    id: "1",
    name: "Sequoia Capital",
    type: "Venture Capital",
    location: "Menlo Park, CA",
    checkSizeMin: 5000000,
    checkSizeMax: 50000000,
    stages: ["Series A", "Series B", "Series C"],
    sectors: ["Fintech", "SaaS", "Enterprise", "AI/ML", "Consumer", "Healthcare"],
    relationship: "Champion",
    relationshipColor: "amber",
    primaryContact: { name: "John Smith", role: "Partner" },
    lastContact: "2 weeks ago",
    owner: { name: "Priya Sharma", initials: "PS" },
    portfolioMatches: 5,
    portfolioCompanies: ["Stripe", "Square", "Nubank"],
    totalPortfolio: 50,
    activityStatus: "Active",
  },
  {
    id: "2",
    name: "Accel Partners",
    type: "Venture Capital",
    location: "Palo Alto, CA",
    checkSizeMin: 2000000,
    checkSizeMax: 25000000,
    stages: ["Seed", "Series A", "Series B"],
    sectors: ["SaaS", "Fintech", "Consumer"],
    relationship: "Strong",
    relationshipColor: "green",
    primaryContact: { name: "Sarah Chen", role: "Principal" },
    lastContact: "3 days ago",
    owner: { name: "Rahul Mehta", initials: "RM" },
    portfolioMatches: 3,
    portfolioCompanies: ["Slack", "Dropbox", "Spotify"],
    totalPortfolio: 45,
    activityStatus: "Active",
  },
  {
    id: "3",
    name: "Matrix Partners India",
    type: "Venture Capital",
    location: "Mumbai, India",
    checkSizeMin: 1000000,
    checkSizeMax: 15000000,
    stages: ["Seed", "Series A"],
    sectors: ["Fintech", "EdTech", "Healthcare", "B2B"],
    relationship: "Warm",
    relationshipColor: "blue",
    primaryContact: { name: "Vikram Vaidya", role: "Managing Director" },
    lastContact: "1 week ago",
    owner: { name: "Amit Patel", initials: "AP" },
    portfolioMatches: 8,
    portfolioCompanies: ["Razorpay", "Ola", "Quikr"],
    totalPortfolio: 35,
    activityStatus: "Active",
  },
  {
    id: "4",
    name: "Rajan Anandan",
    type: "Angel",
    location: "Bangalore, India",
    checkSizeMin: 100000,
    checkSizeMax: 500000,
    stages: ["Pre-Seed", "Seed"],
    sectors: ["AI/ML", "SaaS", "Deep Tech"],
    relationship: "Champion",
    relationshipColor: "amber",
    primaryContact: { name: "Rajan Anandan", role: "Angel Investor" },
    lastContact: "5 days ago",
    owner: { name: "Priya Sharma", initials: "PS" },
    portfolioMatches: 12,
    portfolioCompanies: ["Unacademy", "Dunzo", "Khatabook"],
    totalPortfolio: 80,
    activityStatus: "Active",
  },
  {
    id: "5",
    name: "Sharma Family Office",
    type: "Family Office",
    location: "Delhi, India",
    checkSizeMin: 500000,
    checkSizeMax: 3000000,
    stages: ["Seed", "Series A"],
    sectors: ["Healthcare", "Real Estate Tech", "Consumer"],
    relationship: "New",
    relationshipColor: "slate",
    primaryContact: { name: "Neha Sharma", role: "Investment Director" },
    lastContact: "1 month ago",
    owner: { name: "Rahul Mehta", initials: "RM" },
    portfolioMatches: 2,
    portfolioCompanies: ["NoBroker", "Pharmeasy"],
    totalPortfolio: 15,
    activityStatus: "Active",
  },
  {
    id: "6",
    name: "Google Ventures",
    type: "Corporate VC",
    location: "Mountain View, CA",
    checkSizeMin: 5000000,
    checkSizeMax: 100000000,
    stages: ["Series A", "Series B", "Series C+"],
    sectors: ["AI/ML", "Enterprise", "Healthcare", "Consumer"],
    relationship: "Warm",
    relationshipColor: "blue",
    primaryContact: { name: "David Krane", role: "General Partner" },
    lastContact: "2 weeks ago",
    owner: { name: "Amit Patel", initials: "AP" },
    portfolioMatches: 4,
    portfolioCompanies: ["Uber", "Slack", "Stripe"],
    totalPortfolio: 300,
    activityStatus: "Active",
  },
  {
    id: "7",
    name: "Blume Ventures",
    type: "Venture Capital",
    location: "Mumbai, India",
    checkSizeMin: 500000,
    checkSizeMax: 5000000,
    stages: ["Pre-Seed", "Seed", "Series A"],
    sectors: ["Fintech", "SaaS", "Consumer", "Healthcare"],
    relationship: "Strong",
    relationshipColor: "green",
    primaryContact: { name: "Karthik Reddy", role: "Managing Partner" },
    lastContact: "4 days ago",
    owner: { name: "Priya Sharma", initials: "PS" },
    portfolioMatches: 6,
    portfolioCompanies: ["Unacademy", "Slice", "GreyOrange"],
    totalPortfolio: 40,
    activityStatus: "Active",
  },
  {
    id: "8",
    name: "Y Combinator",
    type: "Accelerator",
    location: "San Francisco, CA",
    checkSizeMin: 125000,
    checkSizeMax: 500000,
    stages: ["Pre-Seed", "Seed"],
    sectors: ["SaaS", "Fintech", "AI/ML", "Consumer", "Healthcare", "Enterprise"],
    relationship: "Warm",
    relationshipColor: "blue",
    primaryContact: { name: "Garry Tan", role: "President" },
    lastContact: "3 weeks ago",
    owner: { name: "Rahul Mehta", initials: "RM" },
    portfolioMatches: 15,
    portfolioCompanies: ["Airbnb", "Stripe", "Coinbase"],
    totalPortfolio: 4000,
    activityStatus: "Active",
  },
]

const relationshipColors: Record<string, { bg: string; text: string; icon: string }> = {
  slate: { bg: "bg-muted/50", text: "text-muted-foreground", icon: "text-muted-foreground" },
  blue: { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-600 dark:text-blue-400", icon: "text-blue-500" },
  green: { bg: "bg-green-50 dark:bg-green-950/30", text: "text-green-600 dark:text-green-400", icon: "text-green-500" },
  amber: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-600 dark:text-amber-400", icon: "text-amber-500" },
}

const investorTypes = ["VC", "Angel", "Family Office", "Corporate VC", "PE", "Accelerator"]
const investmentStages = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C+"]
const sectors = ["Fintech", "SaaS", "AI/ML", "Healthcare", "EdTech", "Consumer", "Enterprise", "CleanTech", "Logistics", "Deep Tech"]
const geographies = ["India", "USA", "Southeast Asia", "Europe", "Middle East"]
const relationshipStatuses = ["New", "Warm", "Strong", "Champion"]

const filterTypeToData: Record<string, string> = {
  VC: "Venture Capital",
  Angel: "Angel",
  "Family Office": "Family Office",
  "Corporate VC": "Corporate VC",
  PE: "Private Equity",
  Accelerator: "Accelerator",
}

type ViewMode = "cards" | "table"
type InvestorItem = (typeof investors)[0]

function formatCheckSize(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(0)}M`
  }
  return `$${(amount / 1000).toFixed(0)}K`
}

const Loading = () => null

export default function InvestorsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<ViewMode>("cards")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filterOpen, setFilterOpen] = useState(false)
  const [investorsList, setInvestorsList] = useState<InvestorItem[]>(investors)
  const [addInvestorModalOpen, setAddInvestorModalOpen] = useState(false)
  const [editInvestorModalOpen, setEditInvestorModalOpen] = useState(false)
  const [editingInvestor, setEditingInvestor] = useState<InvestorItem | null>(null)
  const [logInteractionModalOpen, setLogInteractionModalOpen] = useState(false)
  const [investorForLog, setInvestorForLog] = useState<InvestorItem | null>(null)
  const [importCsvModalOpen, setImportCsvModalOpen] = useState(false)
  const [logInteractionType, setLogInteractionType] = useState("call")
  const [logInteractionNotes, setLogInteractionNotes] = useState("")

  // Filter states
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedStages, setSelectedStages] = useState<string[]>([])
  const [selectedSectors, setSelectedSectors] = useState<string[]>([])
  const [selectedGeographies, setSelectedGeographies] = useState<string[]>([])
  const [selectedRelationships, setSelectedRelationships] = useState<string[]>([])
  const [checkSizeRange, setCheckSizeRange] = useState([0, 100])

  const filteredInvestors = investorsList.filter((investor) => {
    const matchesSearch =
      !searchQuery.trim() ||
      investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.sectors.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      investor.primaryContact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.portfolioCompanies.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))

    const typeMatch =
      selectedTypes.length === 0 ||
      selectedTypes.some((t) => filterTypeToData[t] === investor.type)

    const stageMatch =
      selectedStages.length === 0 ||
      selectedStages.some((s) => investor.stages.includes(s))

    const sectorMatch =
      selectedSectors.length === 0 ||
      selectedSectors.some((s) => investor.sectors.includes(s))

    const geoMatch =
      selectedGeographies.length === 0 ||
      selectedGeographies.some((g) => investor.location.includes(g))

    const relationshipMatch =
      selectedRelationships.length === 0 ||
      selectedRelationships.includes(investor.relationship)

    const checkSizeMinM = checkSizeRange[0] === 0 ? 0.1 : checkSizeRange[0]
    const checkSizeMaxM = checkSizeRange[1]
    const investorMinM = investor.checkSizeMin / 1e6
    const investorMaxM = investor.checkSizeMax / 1e6
    const checkSizeMatch = investorMaxM >= checkSizeMinM && investorMinM <= checkSizeMaxM

    return matchesSearch && typeMatch && stageMatch && sectorMatch && geoMatch && relationshipMatch && checkSizeMatch
  })

  const sortedInvestors = useMemo(() => {
    const list = [...filteredInvestors]
    switch (sortBy) {
      case "name":
        return list.sort((a, b) => a.name.localeCompare(b.name))
      case "lastContact":
        return list.sort((a, b) => 0)
      case "checkSize":
        return list.sort((a, b) => b.checkSizeMax - a.checkSizeMax)
      case "matchScore":
        return list.sort((a, b) => b.portfolioMatches - a.portfolioMatches)
      default:
        return list
    }
  }, [filteredInvestors, sortBy])

  const activeFiltersCount = 
    selectedTypes.length + 
    selectedStages.length + 
    selectedSectors.length + 
    selectedGeographies.length + 
    selectedRelationships.length

  const clearAllFilters = () => {
    setSelectedTypes([])
    setSelectedStages([])
    setSelectedSectors([])
    setSelectedGeographies([])
    setSelectedRelationships([])
    setCheckSizeRange([0, 100])
  }

  // Stats
  const totalInvestors = investorsList.length
  const activeRelationships = investorsList.filter((i) => i.relationship !== "New").length
  const newThisMonth = 2

  const handleFindStartups = () => router.push("/matching")
  const handleLogInteraction = (inv: InvestorItem) => {
    setInvestorForLog(inv)
    setLogInteractionNotes("")
    setLogInteractionModalOpen(true)
  }
  const handleLogInteractionSubmit = () => {
    setLogInteractionModalOpen(false)
    setInvestorForLog(null)
    setLogInteractionNotes("")
    toast({ title: "Interaction logged", description: `Logged ${logInteractionType} for ${investorForLog?.name}.` })
  }
  const handleEdit = (inv: InvestorItem) => {
    setEditingInvestor(inv)
    setEditInvestorModalOpen(true)
  }
  const handleArchive = (inv: InvestorItem) => {
    setInvestorsList((prev) => prev.filter((i) => i.id !== inv.id))
    setEditInvestorModalOpen(false)
    setEditingInvestor(null)
    toast({ title: "Archived", description: `${inv.name} has been archived.` })
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Investors" />

        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />

          <main className="flex-1 overflow-auto">
            {/* Breadcrumb & Stats Bar */}
            <div className="border-b bg-card px-4 md:px-6 py-3 space-y-3">
              <PageBreadcrumb segments={[{ label: "Investors" }]} />
              <div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm text-muted-foreground">Total Investors:</span>
                    <span className="text-sm font-semibold text-foreground">{totalInvestors}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm text-muted-foreground">Active Relationships:</span>
                    <span className="text-sm font-semibold text-foreground">{activeRelationships}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-sm text-muted-foreground">New This Month:</span>
                    <span className="text-sm font-semibold text-foreground">{newThisMonth}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Page Header */}
            <div className="border-b bg-card px-4 md:px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground">Investors</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage your investor relationships and find matches
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => setAddInvestorModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Add Investor
                  </Button>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="flex flex-col md:flex-row md:items-center gap-3 mt-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, sector, or portfolio..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="lastContact">Last Contact</SelectItem>
                      <SelectItem value="checkSize">Check Size</SelectItem>
                      <SelectItem value="matchScore">Match Score</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Filters Sheet */}
                  <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="bg-transparent relative">
                        <Filter className="w-4 h-4 mr-1.5" />
                        Filters
                        {activeFiltersCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                            {activeFiltersCount}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px] overflow-y-auto p-8">
                      <SheetHeader>
                        <div className="flex items-center justify-between">
                          <SheetTitle>Filters</SheetTitle>
                          {activeFiltersCount > 0 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={clearAllFilters}
                              className="text-muted-foreground"
                            >
                              Clear all
                            </Button>
                          )}
                        </div>
                      </SheetHeader>

                      <div className="mt-6 space-y-6">
                        {/* Investor Type */}
                        <div>
                          <Label className="text-sm font-medium mb-3 block">Investor Type</Label>
                          <div className="space-y-2">
                            {investorTypes.map((type) => (
                              <div key={type} className="flex items-center gap-2">
                                <Checkbox 
                                  id={`type-${type}`}
                                  checked={selectedTypes.includes(type)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedTypes([...selectedTypes, type])
                                    } else {
                                      setSelectedTypes(selectedTypes.filter(t => t !== type))
                                    }
                                  }}
                                />
                                <Label htmlFor={`type-${type}`} className="text-sm font-normal cursor-pointer">
                                  {type}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Investment Stages */}
                        <div>
                          <Label className="text-sm font-medium mb-3 block">Investment Stages</Label>
                          <div className="space-y-2">
                            {investmentStages.map((stage) => (
                              <div key={stage} className="flex items-center gap-2">
                                <Checkbox 
                                  id={`stage-${stage}`}
                                  checked={selectedStages.includes(stage)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedStages([...selectedStages, stage])
                                    } else {
                                      setSelectedStages(selectedStages.filter(s => s !== stage))
                                    }
                                  }}
                                />
                                <Label htmlFor={`stage-${stage}`} className="text-sm font-normal cursor-pointer">
                                  {stage}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Sectors */}
                        <div>
                          <Label className="text-sm font-medium mb-3 block">Sectors</Label>
                          <div className="flex flex-wrap gap-2">
                            {sectors.map((sector) => (
                              <Badge 
                                key={sector}
                                variant={selectedSectors.includes(sector) ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => {
                                  if (selectedSectors.includes(sector)) {
                                    setSelectedSectors(selectedSectors.filter(s => s !== sector))
                                  } else {
                                    setSelectedSectors([...selectedSectors, sector])
                                  }
                                }}
                              >
                                {sector}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Check Size Range */}
                        <div>
                          <Label className="text-sm font-medium mb-3 block">
                            Check Size Range: ${checkSizeRange[0] === 0 ? "100K" : `${checkSizeRange[0]}M`} - ${checkSizeRange[1]}M
                          </Label>
                          <Slider
                            value={checkSizeRange}
                            onValueChange={setCheckSizeRange}
                            min={0}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        {/* Geography */}
                        <div>
                          <Label className="text-sm font-medium mb-3 block">Geography</Label>
                          <div className="space-y-2">
                            {geographies.map((geo) => (
                              <div key={geo} className="flex items-center gap-2">
                                <Checkbox 
                                  id={`geo-${geo}`}
                                  checked={selectedGeographies.includes(geo)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedGeographies([...selectedGeographies, geo])
                                    } else {
                                      setSelectedGeographies(selectedGeographies.filter(g => g !== geo))
                                    }
                                  }}
                                />
                                <Label htmlFor={`geo-${geo}`} className="text-sm font-normal cursor-pointer">
                                  {geo}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Relationship Status */}
                        <div>
                          <Label className="text-sm font-medium mb-3 block">Relationship Status</Label>
                          <div className="space-y-2">
                            {relationshipStatuses.map((status) => (
                              <div key={status} className="flex items-center gap-2">
                                <Checkbox 
                                  id={`rel-${status}`}
                                  checked={selectedRelationships.includes(status)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedRelationships([...selectedRelationships, status])
                                    } else {
                                      setSelectedRelationships(selectedRelationships.filter(r => r !== status))
                                    }
                                  }}
                                />
                                <Label htmlFor={`rel-${status}`} className="text-sm font-normal cursor-pointer">
                                  {status}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t">
                        <Button className="w-full" onClick={() => setFilterOpen(false)}>
                          Apply Filters
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* View Toggle */}
                  <div className="flex items-center border border-border rounded-lg p-1 bg-muted/30">
                    <Button
                      variant={viewMode === "cards" ? "default" : "ghost"}
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-md"
                      onClick={() => setViewMode("cards")}
                      aria-label="Cards view"
                    >
                      <Grid3X3 className="w-4 h-4" />
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
                </div>
              </div>

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="text-xs text-muted-foreground">Active filters:</span>
                  {selectedTypes.map((type) => (
                    <Badge key={type} variant="secondary" className="text-xs gap-1">
                      {type}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => setSelectedTypes(selectedTypes.filter(t => t !== type))}
                      />
                    </Badge>
                  ))}
                  {selectedStages.map((stage) => (
                    <Badge key={stage} variant="secondary" className="text-xs gap-1">
                      {stage}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => setSelectedStages(selectedStages.filter(s => s !== stage))}
                      />
                    </Badge>
                  ))}
                  {selectedSectors.map((sector) => (
                    <Badge key={sector} variant="secondary" className="text-xs gap-1">
                      {sector}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => setSelectedSectors(selectedSectors.filter(s => s !== sector))}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="p-4 md:p-6">
              {viewMode === "cards" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sortedInvestors.map((investor) => (
                    <InvestorCard
                      key={investor.id}
                      investor={investor}
                      onFindStartups={handleFindStartups}
                      onLogInteraction={(inv) => handleLogInteraction(inv)}
                      onEdit={handleEdit}
                      onArchive={handleArchive}
                    />
                  ))}
                </div>
              )}

              {viewMode === "table" && (
                <div className="rounded-lg border bg-card overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="text-left">
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Name</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Type</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Check Size</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Stages</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Sectors</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Relationship</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Owner</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Last Contact</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {sortedInvestors.map((investor) => (
                        <InvestorTableRow
                          key={investor.id}
                          investor={investor}
                          onFindStartups={handleFindStartups}
                          onLogInteraction={(inv) => handleLogInteraction(inv)}
                          onEdit={handleEdit}
                          onArchive={handleArchive}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {sortedInvestors.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Users className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-1">No investors match your filters</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting filters or{" "}
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => setImportCsvModalOpen(true)}
                    >
                      import investors from CSV
                    </button>
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      <Toaster />
      <AddEditInvestorModal
        open={addInvestorModalOpen}
        onOpenChange={setAddInvestorModalOpen}
        mode="add"
      />
      {editingInvestor && (
        <AddEditInvestorModal
          open={editInvestorModalOpen}
          onOpenChange={(open) => {
            setEditInvestorModalOpen(open)
            if (!open) setEditingInvestor(null)
          }}
          mode="edit"
          investor={{
            id: editingInvestor.id,
            name: editingInvestor.name,
            type: editingInvestor.type,
            website: "",
            linkedin: "",
            crunchbase: "",
            city: editingInvestor.location.split(",")[0]?.trim() ?? "",
            country: editingInvestor.location.split(",").slice(1).join(",").trim() || "",
            address: "",
            description: "",
            yearFounded: "",
            aum: "",
            currentFundSize: "",
            relationshipOwner: editingInvestor.owner.name,
            relationshipStrength: editingInvestor.relationship.toLowerCase() as "new" | "warm" | "strong" | "champion",
            source: "",
            tags: [],
            checkSizeMin: editingInvestor.checkSizeMin,
            checkSizeMax: editingInvestor.checkSizeMax,
            currency: "USD",
            investmentStages: editingInvestor.stages,
            sectors: editingInvestor.sectors,
            geographies: [],
            businessModels: [],
            exclusions: "",
            contacts: [
              {
                id: "1",
                name: editingInvestor.primaryContact.name,
                email: "",
                phone: "",
                role: editingInvestor.primaryContact.role,
                linkedin: "",
                isPrimary: true,
                notes: "",
              },
            ],
            internalNotes: "",
            thesisNotes: "",
            meetingNotes: "",
            redFlags: "",
          }}
        />
      )}

      {/* Log Interaction Modal */}
      <Dialog open={logInteractionModalOpen} onOpenChange={(open) => { setLogInteractionModalOpen(open); if (!open) setInvestorForLog(null); setLogInteractionNotes(""); }}>
        <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Log Interaction</DialogTitle>
            <DialogDescription>
              Record an interaction with {investorForLog?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={logInteractionType} onValueChange={setLogInteractionType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="note">Note</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes / Summary</Label>
              <Textarea
                placeholder="What was discussed?"
                value={logInteractionNotes}
                onChange={(e) => setLogInteractionNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogInteractionModalOpen(false)}>Cancel</Button>
            <Button onClick={handleLogInteractionSubmit}>Log Interaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import CSV Modal */}
      <Dialog open={importCsvModalOpen} onOpenChange={setImportCsvModalOpen}>
        <DialogContent className="max-w-lg" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Import Investors from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file with columns: Name, Type, Location, Check Size Min, Check Size Max, Stages, Sectors, Contact Name, Contact Role
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>CSV File</Label>
              <Input type="file" accept=".csv" className="cursor-pointer" />
            </div>
            <p className="text-xs text-muted-foreground">
              Or paste CSV data below:
            </p>
            <Textarea placeholder="Paste CSV content here..." rows={6} className="font-mono text-xs" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportCsvModalOpen(false)}>Cancel</Button>
            <Button onClick={() => { setImportCsvModalOpen(false); toast({ title: "Import started", description: "Investors will be added once the file is processed." }); }}>
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Suspense>
  )
}

interface InvestorProps {
  investor: InvestorItem
  onFindStartups?: () => void
  onLogInteraction?: (investor: InvestorItem) => void
  onEdit?: (investor: InvestorItem) => void
  onArchive?: (investor: InvestorItem) => void
}

function InvestorCard({ investor, onFindStartups, onLogInteraction, onEdit, onArchive }: InvestorProps) {
  const colors = relationshipColors[investor.relationshipColor]

  return (
    <Card className="group hover:shadow-md transition-all">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border flex items-center justify-center shrink-0">
              {investor.type === "Angel" ? (
                <Star className="w-5 h-5 text-primary" />
              ) : investor.type === "Corporate VC" ? (
                <Building className="w-5 h-5 text-primary" />
              ) : (
                <Building2 className="w-5 h-5 text-primary" />
              )}
            </div>
            <div className="min-w-0">
              <Link href={`/investors/${investor.id}`}>
                <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {investor.name}
                </h3>
              </Link>
              <p className="text-xs text-muted-foreground truncate">
                {investor.type} · {investor.location}
              </p>
            </div>
          </div>

          <Badge className={cn("shrink-0 text-xs font-medium gap-1", colors.bg, colors.text)}>
            <Star className={cn("w-3 h-3", colors.icon)} />
            {investor.relationship}
          </Badge>
        </div>

        {/* Investment Info */}
        <div className="mt-3 pt-3 border-t space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Check Size:</span>
            <span className="font-medium text-foreground">
              {formatCheckSize(investor.checkSizeMin)} - {formatCheckSize(investor.checkSizeMax)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Stages:</span>
            <span className="text-foreground truncate max-w-[150px]">
              {investor.stages.join(", ")}
            </span>
          </div>
        </div>

        {/* Sectors */}
        <div className="mt-3 flex flex-wrap gap-1">
          {investor.sectors.slice(0, 3).map((sector) => (
            <Badge key={sector} variant="outline" className="text-xs font-normal">
              {sector}
            </Badge>
          ))}
          {investor.sectors.length > 3 && (
            <Badge variant="outline" className="text-xs font-normal">
              +{investor.sectors.length - 3}
            </Badge>
          )}
        </div>

        {/* Portfolio Matches */}
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Portfolio ({investor.portfolioMatches} matches):</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            {investor.portfolioCompanies.map((company) => (
              <span key={company} className="text-xs text-muted-foreground flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {company}
              </span>
            ))}
            <span className="text-xs text-muted-foreground">+{investor.totalPortfolio - 3} more</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-3 pt-3 border-t">
          <div className="text-sm">
            <span className="text-muted-foreground">Primary Contact:</span>
            <span className="ml-1 text-foreground">{investor.primaryContact.name}</span>
            <span className="text-muted-foreground"> ({investor.primaryContact.role})</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {investor.lastContact}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>@{investor.owner.name.split(" ")[0]}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-3 pt-3 border-t flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent" asChild>
            <Link href={`/investors/${investor.id}`}>
              View Profile
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent" onClick={onFindStartups}>
            <Sparkles className="w-3 h-3 mr-1" />
            Find Startups
          </Button>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[100]">
              <DropdownMenuItem onClick={() => onLogInteraction?.(investor)}>Log Interaction</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(investor)}>Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => onArchive?.(investor)}>
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}

function InvestorTableRow({
  investor,
  onFindStartups,
  onLogInteraction,
  onEdit,
  onArchive,
}: InvestorProps) {
  const colors = relationshipColors[investor.relationshipColor]

  return (
    <tr className="group hover:bg-muted/50 transition-colors cursor-pointer">
      <td className="px-4 py-3">
        <Link href={`/investors/${investor.id}`} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary/20 to-primary/5 border flex items-center justify-center shrink-0">
            {investor.type === "Angel" ? (
              <Star className="w-4 h-4 text-primary" />
            ) : investor.type === "Corporate VC" ? (
              <Building className="w-4 h-4 text-primary" />
            ) : (
              <Building2 className="w-4 h-4 text-primary" />
            )}
          </div>
          <div>
            <p className="font-medium text-foreground group-hover:text-primary transition-colors">
              {investor.name}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {investor.location}
            </p>
          </div>
        </Link>
      </td>
      <td className="px-4 py-3">
        <Badge variant="outline" className="font-normal">
          {investor.type}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm font-medium text-foreground">
          {formatCheckSize(investor.checkSizeMin)} - {formatCheckSize(investor.checkSizeMax)}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-muted-foreground">
          {investor.stages.slice(0, 2).join(", ")}
          {investor.stages.length > 2 && "..."}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-1">
          {investor.sectors.slice(0, 2).map((sector) => (
            <Badge key={sector} variant="outline" className="text-xs font-normal">
              {sector}
            </Badge>
          ))}
          {investor.sectors.length > 2 && (
            <span className="text-xs text-muted-foreground">+{investor.sectors.length - 2}</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge className={cn("text-xs font-medium gap-1", colors.bg, colors.text)}>
          <Star className={cn("w-3 h-3", colors.icon)} />
          {investor.relationship}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
              {investor.owner.initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {investor.owner.name.split(" ")[0]}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-muted-foreground">{investor.lastContact}</span>
      </td>
      <td className="px-4 py-3">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-[100]">
            <DropdownMenuItem onClick={onFindStartups}>
              <Sparkles className="w-4 h-4 mr-2" />
              Find Startups
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onLogInteraction?.(investor)}>Log Interaction</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(investor)}>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => onArchive?.(investor)}>
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  )
}

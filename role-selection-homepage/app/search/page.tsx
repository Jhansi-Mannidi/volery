"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Building2,
  Users,
  FileText,
  User,
  Search,
  Filter,
  X,
  ChevronDown,
  TrendingUp,
  MapPin,
  Briefcase,
  Calendar,
  Eye,
  Clock,
  ArrowRight,
  Save,
  ChevronLeft,
  DollarSign,
  Target,
  Globe,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { cn } from "@/lib/utils"
import { useAuth, type UserRole } from "@/lib/auth-context"

// Mock data for all result types
const mockStartups = [
  {
    id: "s1",
    name: "TechCorp AI",
    logo: "🤖",
    tagline: "AI-powered financial document analysis",
    sector: "Fintech",
    stage: "Seed",
    location: "Mumbai, India",
    raised: "$1.2M",
    employees: 15,
    metrics: { revenue: "$200K/mo", growth: "45%/mo" },
  },
  {
    id: "s2",
    name: "CloudAI Systems",
    logo: "☁️",
    tagline: "Enterprise AI infrastructure platform",
    sector: "AI/ML",
    stage: "Series A",
    location: "San Francisco, CA",
    raised: "$8M",
    employees: 32,
    metrics: { revenue: "$1.2M/mo", growth: "60%/mo" },
  },
  {
    id: "s3",
    name: "HealthBridge",
    logo: "🏥",
    tagline: "Telemedicine for rural communities",
    sector: "HealthTech",
    stage: "Series A",
    location: "Delhi, India",
    raised: "$4M",
    employees: 45,
    metrics: { users: "150K", growth: "80%/mo" },
  },
  {
    id: "s4",
    name: "FinApp Inc",
    logo: "💳",
    tagline: "Personal finance management app",
    sector: "Fintech",
    stage: "Seed",
    location: "Bangalore, India",
    raised: "$2M",
    employees: 12,
    metrics: { users: "50K", growth: "35%/mo" },
  },
]

const mockInvestors = [
  {
    id: "i1",
    name: "Sequoia Capital",
    logo: "🏛️",
    type: "Venture Capital",
    location: "Menlo Park, CA",
    checkSize: "$5M - $50M",
    stages: ["Series A", "Series B", "Series C"],
    sectors: ["Fintech", "SaaS", "AI/ML"],
    focus: "Enterprise & AI",
    portfolioSize: 50,
  },
  {
    id: "i2",
    name: "Tiger Global",
    logo: "🐯",
    type: "Growth Equity",
    location: "New York, NY",
    checkSize: "$10M - $200M",
    stages: ["Series B+"],
    sectors: ["SaaS", "Fintech", "Consumer"],
    focus: "Global Growth",
    portfolioSize: 45,
  },
  {
    id: "i3",
    name: "Accel Partners",
    logo: "⚡",
    type: "Venture Capital",
    location: "Palo Alto, CA",
    checkSize: "$2M - $25M",
    stages: ["Seed", "Series A", "Series B"],
    sectors: ["SaaS", "Consumer", "Enterprise"],
    focus: "Early Stage",
    portfolioSize: 35,
  },
]

const mockDocuments = [
  {
    id: "d1",
    name: "TechCorp_PitchDeck_v2.pdf",
    type: "PDF",
    relatedTo: "TechCorp AI",
    snippet: "AI-powered analysis of financial documents with 95% accuracy...",
    views: 23,
    modified: "2 days ago",
  },
  {
    id: "d2",
    name: "CloudAI_Financials_Q4.xlsx",
    type: "Spreadsheet",
    relatedTo: "CloudAI Systems",
    snippet: "$1.2M monthly revenue, 60% YoY growth, 32 employees",
    views: 45,
    modified: "5 days ago",
  },
  {
    id: "d3",
    name: "HealthBridge_DueDiligence.pdf",
    type: "PDF",
    relatedTo: "HealthBridge",
    snippet: "Comprehensive DD report covering market, team, financials...",
    views: 12,
    modified: "1 week ago",
  },
]

const mockPeople = [
  {
    id: "p1",
    name: "Priya Sharma",
    title: "Founder & CEO",
    organization: "TechCorp AI",
    avatar: "PS",
    location: "Mumbai, India",
    role: "startup-founder",
    connected: false,
  },
  {
    id: "p2",
    name: "Rahul Mehta",
    title: "Partner",
    organization: "Sequoia Capital",
    avatar: "RM",
    location: "Menlo Park, CA",
    role: "institutional-investor",
    connected: true,
  },
  {
    id: "p3",
    name: "Sarah Chen",
    title: "Investment Manager",
    organization: "Tiger Global",
    avatar: "SC",
    location: "New York, NY",
    role: "institutional-investor",
    connected: false,
  },
]

export default function SearchPage() {
  const router = useRouter()
  const { user } = useAuth()
  const currentRole = user?.activeRole || "investment-banker"

  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // Filters
  const [filters, setFilters] = useState({
    stage: [] as string[],
    sector: [] as string[],
    location: "",
    checkSizeMin: 0,
    checkSizeMax: 100,
    investorType: [] as string[],
    documentType: [] as string[],
    dateRange: "all",
  })

  const [savedFilters, setSavedFilters] = useState<string[]>([])

  // Filter functions
  const filterStartups = (startups: typeof mockStartups) => {
    return startups.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tagline.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStage = filters.stage.length === 0 || filters.stage.includes(s.stage)
      const matchesSector = filters.sector.length === 0 || filters.sector.includes(s.sector)
      const matchesLocation = !filters.location || s.location.toLowerCase().includes(filters.location.toLowerCase())
      return matchesSearch && matchesStage && matchesSector && matchesLocation
    })
  }

  const filterInvestors = (investors: typeof mockInvestors) => {
    return investors.filter((i) => {
      const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.focus.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = filters.investorType.length === 0 || filters.investorType.includes(i.type)
      const matchesLocation = !filters.location || i.location.toLowerCase().includes(filters.location.toLowerCase())
      return matchesSearch && matchesType && matchesLocation
    })
  }

  const filterDocuments = (docs: typeof mockDocuments) => {
    return docs.filter((d) => {
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.snippet.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = filters.documentType.length === 0 || filters.documentType.includes(d.type)
      return matchesSearch && matchesType
    })
  }

  const filterPeople = (people: typeof mockPeople) => {
    return people.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLocation = !filters.location || p.location.toLowerCase().includes(filters.location.toLowerCase())
      return matchesSearch && matchesLocation
    })
  }

  const filteredStartups = useMemo(() => filterStartups(mockStartups), [searchQuery, filters])
  const filteredInvestors = useMemo(() => filterInvestors(mockInvestors), [searchQuery, filters])
  const filteredDocuments = useMemo(() => filterDocuments(mockDocuments), [searchQuery, filters])
  const filteredPeople = useMemo(() => filterPeople(mockPeople), [searchQuery, filters])

  const totalResults = filteredStartups.length + filteredInvestors.length + filteredDocuments.length + filteredPeople.length

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Search Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                  className="mr-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h1 className="text-3xl font-bold text-foreground">Search Results</h1>
              </div>

              {/* Search Bar */}
              <div className="flex gap-3 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search startups, investors, documents, people..."
                    className="pl-10 h-11 text-base"
                  />
                </div>
                <Sheet open={showFilters} onOpenChange={setShowFilters}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="h-11 w-11 bg-transparent">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:w-96 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Advanced Filters</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-6 py-4">
                      {/* Location Filter */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">Location</Label>
                        <Input
                          placeholder="Search by location..."
                          value={filters.location}
                          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        />
                      </div>

                      {/* Startup Filters */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">Funding Stage</Label>
                        {["Pre-Seed", "Seed", "Series A", "Series B", "Series C"].map((stage) => (
                          <div key={stage} className="flex items-center gap-2">
                            <Checkbox
                              checked={filters.stage.includes(stage)}
                              onCheckedChange={(checked) => {
                                setFilters({
                                  ...filters,
                                  stage: checked
                                    ? [...filters.stage, stage]
                                    : filters.stage.filter((s) => s !== stage),
                                })
                              }}
                            />
                            <Label className="text-sm cursor-pointer">{stage}</Label>
                          </div>
                        ))}
                      </div>

                      {/* Sector Filter */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">Sector</Label>
                        {["Fintech", "AI/ML", "HealthTech", "SaaS", "Enterprise"].map((sector) => (
                          <div key={sector} className="flex items-center gap-2">
                            <Checkbox
                              checked={filters.sector.includes(sector)}
                              onCheckedChange={(checked) => {
                                setFilters({
                                  ...filters,
                                  sector: checked
                                    ? [...filters.sector, sector]
                                    : filters.sector.filter((s) => s !== sector),
                                })
                              }}
                            />
                            <Label className="text-sm cursor-pointer">{sector}</Label>
                          </div>
                        ))}
                      </div>

                      {/* Investor Type Filter */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">Investor Type</Label>
                        {["Venture Capital", "Growth Equity", "Angel", "Family Office"].map((type) => (
                          <div key={type} className="flex items-center gap-2">
                            <Checkbox
                              checked={filters.investorType.includes(type)}
                              onCheckedChange={(checked) => {
                                setFilters({
                                  ...filters,
                                  investorType: checked
                                    ? [...filters.investorType, type]
                                    : filters.investorType.filter((t) => t !== type),
                                })
                              }}
                            />
                            <Label className="text-sm cursor-pointer">{type}</Label>
                          </div>
                        ))}
                      </div>

                      {/* Document Type Filter */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">Document Type</Label>
                        {["PDF", "Spreadsheet", "Presentation"].map((type) => (
                          <div key={type} className="flex items-center gap-2">
                            <Checkbox
                              checked={filters.documentType.includes(type)}
                              onCheckedChange={(checked) => {
                                setFilters({
                                  ...filters,
                                  documentType: checked
                                    ? [...filters.documentType, type]
                                    : filters.documentType.filter((t) => t !== type),
                                })
                              }}
                            />
                            <Label className="text-sm cursor-pointer">{type}</Label>
                          </div>
                        ))}
                      </div>

                      {/* Save Filter Preset */}
                      <div className="pt-4 border-t">
                        <Button className="w-full" size="sm">
                          <Save className="w-4 h-4 mr-2" />
                          Save as Preset
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Results Count */}
              <div className="text-sm text-muted-foreground">
                {totalResults > 0 ? (
                  <>
                    Showing <span className="font-semibold text-foreground">{totalResults}</span> result
                    {totalResults !== 1 ? "s" : ""}
                  </>
                ) : (
                  <>No results found for "{searchQuery}"</>
                )}
              </div>
            </div>

            {/* Tabs */}
            {totalResults > 0 && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="all" className="flex items-center gap-2">
                    <span>All</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded ml-1">{totalResults}</span>
                  </TabsTrigger>
                  <TabsTrigger value="startups" className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>Startups</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded">{filteredStartups.length}</span>
                  </TabsTrigger>
                  <TabsTrigger value="investors" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Investors</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded">{filteredInvestors.length}</span>
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Documents</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded">{filteredDocuments.length}</span>
                  </TabsTrigger>
                  <TabsTrigger value="people" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>People</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded">{filteredPeople.length}</span>
                  </TabsTrigger>
                </TabsList>

                {/* Startup Results */}
                <TabsContent value="startups" className="space-y-3 mt-6">
                  {filteredStartups.length > 0 ? (
                    filteredStartups.map((startup) => (
                      <Card key={startup.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-2xl">
                              {startup.logo}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div>
                                  <h3 className="text-lg font-semibold text-foreground hover:text-primary truncate">
                                    {startup.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground truncate">{startup.tagline}</p>
                                </div>
                                <Badge variant="outline">{startup.stage}</Badge>
                              </div>
                              <div className="flex flex-wrap gap-2 mb-3">
                                <Badge variant="secondary" className="text-xs">{startup.sector}</Badge>
                                <Badge variant="secondary" className="text-xs">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {startup.location}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  <DollarSign className="w-3 h-3 mr-1" />
                                  {startup.raised}
                                </Badge>
                              </div>
                              <div className="flex gap-4 text-xs text-muted-foreground">
                                <span>{startup.employees} employees</span>
                                {startup.metrics.revenue && <span>Revenue: {startup.metrics.revenue}</span>}
                                {startup.metrics.growth && <span>Growth: {startup.metrics.growth}</span>}
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="p-8">
                      <p className="text-center text-muted-foreground">No startups found</p>
                    </Card>
                  )}
                </TabsContent>

                {/* Investor Results */}
                <TabsContent value="investors" className="space-y-3 mt-6">
                  {filteredInvestors.length > 0 ? (
                    filteredInvestors.map((investor) => (
                      <Card key={investor.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-2xl">
                              {investor.logo}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div>
                                  <h3 className="text-lg font-semibold text-foreground hover:text-primary truncate">
                                    {investor.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">{investor.type}</p>
                                </div>
                                <Badge variant="outline">{investor.checkSize}</Badge>
                              </div>
                              <div className="flex flex-wrap gap-2 mb-3">
                                <Badge variant="secondary" className="text-xs">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {investor.location}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  <Target className="w-3 h-3 mr-1" />
                                  {investor.focus}
                                </Badge>
                              </div>
                              <div className="flex gap-2">
                                {investor.stages.map((stage) => (
                                  <Badge key={stage} variant="outline" className="text-xs">
                                    {stage}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="p-8">
                      <p className="text-center text-muted-foreground">No investors found</p>
                    </Card>
                  )}
                </TabsContent>

                {/* Document Results */}
                <TabsContent value="documents" className="space-y-3 mt-6">
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                      <Card key={doc.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              <FileText className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div>
                                  <h3 className="text-base font-semibold text-foreground hover:text-primary truncate">
                                    {doc.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground italic line-clamp-2">{doc.snippet}</p>
                                </div>
                                <Badge variant="outline" className="text-xs shrink-0">{doc.type}</Badge>
                              </div>
                              <div className="flex gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Briefcase className="w-3 h-3" />
                                  {doc.relatedTo}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {doc.views} views
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {doc.modified}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="p-8">
                      <p className="text-center text-muted-foreground">No documents found</p>
                    </Card>
                  )}
                </TabsContent>

                {/* People Results */}
                <TabsContent value="people" className="space-y-3 mt-6">
                  {filteredPeople.length > 0 ? (
                    filteredPeople.map((person) => (
                      <Card key={person.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex gap-4 items-start">
                            <Avatar className="w-12 h-12 shrink-0">
                              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                                {person.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h3 className="text-base font-semibold text-foreground hover:text-primary truncate">
                                    {person.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">{person.title}</p>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                    <Briefcase className="w-3 h-3" />
                                    {person.organization}
                                  </p>
                                </div>
                                <Badge variant={person.connected ? "default" : "outline"} className="text-xs shrink-0">
                                  {person.connected ? "Connected" : "Connect"}
                                </Badge>
                              </div>
                              <div className="flex gap-2 mt-3 text-xs text-muted-foreground">
                                <Badge variant="secondary" className="text-xs">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {person.location}
                                </Badge>
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="p-8">
                      <p className="text-center text-muted-foreground">No people found</p>
                    </Card>
                  )}
                </TabsContent>

                {/* All Results Tab */}
                <TabsContent value="all" className="space-y-6 mt-6">
                  {filteredStartups.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                        Startups
                      </h3>
                      <div className="space-y-3">
                        {filteredStartups.slice(0, 2).map((startup) => (
                          <Card key={startup.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex gap-4">
                                <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-2xl">
                                  {startup.logo}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-base font-semibold text-foreground hover:text-primary truncate">
                                    {startup.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground truncate mb-2">{startup.tagline}</p>
                                  <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="text-xs">{startup.sector}</Badge>
                                    <Badge variant="outline">{startup.stage}</Badge>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredInvestors.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                        Investors
                      </h3>
                      <div className="space-y-3">
                        {filteredInvestors.slice(0, 2).map((investor) => (
                          <Card key={investor.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex gap-4">
                                <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-2xl">
                                  {investor.logo}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-base font-semibold text-foreground hover:text-primary truncate">
                                    {investor.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground mb-2">{investor.type}</p>
                                  <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="text-xs">{investor.checkSize}</Badge>
                                    <Badge variant="outline" className="text-xs">{investor.focus}</Badge>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredDocuments.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                        Documents
                      </h3>
                      <div className="space-y-3">
                        {filteredDocuments.slice(0, 2).map((doc) => (
                          <Card key={doc.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                  <FileText className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-base font-semibold text-foreground hover:text-primary truncate">
                                    {doc.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground line-clamp-1">{doc.snippet}</p>
                                  <div className="flex gap-2 mt-2">
                                    <Badge variant="secondary" className="text-xs">{doc.type}</Badge>
                                    <Badge variant="outline" className="text-xs">{doc.relatedTo}</Badge>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}

            {/* Empty State */}
            {totalResults === 0 && searchQuery && (
              <Card className="p-12 text-center">
                <div className="mb-4">
                  <Search className="w-16 h-16 text-muted-foreground mx-auto opacity-20" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search terms or use the filters to narrow down your results.
                </p>
                <Button onClick={() => setShowFilters(true)} variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Open Filters
                </Button>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

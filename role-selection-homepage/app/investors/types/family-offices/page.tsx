"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Building2,
  ChevronRight,
  Filter,
  Grid3X3,
  LayoutList,
  List,
  MapPin,
  PauseCircle,
  Pencil,
  Plus,
  Search,
  TrendingUp,
  Users,
  Target,
  Clock,
  Calendar,
  Mail,
  Phone,
  FileText,
  Eye,
  Send,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Handshake,
  BarChart3,
  Download,
  Upload,
  RefreshCw,
  X,
  Landmark,
  CircleDollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

// Types
interface FamilyOffice {
  id: string
  name: string
  principal: string
  bio: string
  sectors: string[]
  aum: string
  aumValue: number
  checkSize: string
  stageFocus: string
  portfolio: number
  status: "active_mandate" | "evaluating" | "building" | "on_hold"
  currentMandate?: string
  mandateExpiry?: string
  currentInterest?: string
  note?: string
  pauseReason?: string
  decisionTimeline: string
  keyContact: string
  keyContactRole: string
  relationshipOwner: string
  relationshipOwnerInitials: string
  relationshipStrength: "strong" | "warm" | "new" | "inactive"
  lastContact: string
  lastContactDays: number
  location: string
  coInvestment: boolean
  boardSeat: boolean
}

// Sample data
const familyOffices: FamilyOffice[] = [
  {
    id: "1",
    name: "Rajan Family Office",
    principal: "Suresh Rajan",
    bio: "Multi-generational wealth, 3rd generation",
    sectors: ["Diversified", "Fintech"],
    aum: "₹850 Cr",
    aumValue: 850,
    checkSize: "₹5Cr - ₹25Cr",
    stageFocus: "Series A to Series C",
    portfolio: 8,
    status: "active_mandate",
    currentMandate: "Fintech, B2B SaaS",
    mandateExpiry: "Mar 2026",
    decisionTimeline: "6-8 weeks",
    keyContact: "Vikram Rajan",
    keyContactRole: "CIO",
    relationshipOwner: "Rahul Mehta",
    relationshipOwnerInitials: "RM",
    relationshipStrength: "strong",
    lastContact: "1 week ago",
    lastContactDays: 7,
    location: "Mumbai, India",
    coInvestment: true,
    boardSeat: false,
  },
  {
    id: "2",
    name: "Sharma Holdings",
    principal: "Priya Sharma",
    bio: "First-generation wealth, Tech background",
    sectors: ["Technology", "Healthcare"],
    aum: "₹450 Cr",
    aumValue: 450,
    checkSize: "₹3Cr - ₹15Cr",
    stageFocus: "Seed to Series A",
    portfolio: 5,
    status: "evaluating",
    currentInterest: "Looking at 2 deals from us",
    decisionTimeline: "4-6 weeks",
    keyContact: "Raj Sharma",
    keyContactRole: "Investment Head",
    relationshipOwner: "Priya Sharma",
    relationshipOwnerInitials: "PS",
    relationshipStrength: "warm",
    lastContact: "2 weeks ago",
    lastContactDays: 14,
    location: "Bangalore, India",
    coInvestment: true,
    boardSeat: true,
  },
  {
    id: "3",
    name: "Mittal Capital",
    principal: "Anil Mittal",
    bio: "Industrial conglomerate family office",
    sectors: ["Industrial", "Manufacturing", "CleanTech"],
    aum: "₹1,200 Cr",
    aumValue: 1200,
    checkSize: "₹10Cr - ₹50Cr",
    stageFocus: "Growth stage only",
    portfolio: 12,
    status: "building",
    note: "New relationship, exploring direct deals",
    decisionTimeline: "10-12 weeks (thorough DD)",
    keyContact: "Sanjay Mittal",
    keyContactRole: "Next Gen",
    relationshipOwner: "Amit Patel",
    relationshipOwnerInitials: "AP",
    relationshipStrength: "new",
    lastContact: "1 month ago",
    lastContactDays: 30,
    location: "Delhi, India",
    coInvestment: false,
    boardSeat: true,
  },
  {
    id: "4",
    name: "Gupta Family Trust",
    principal: "Ramesh Gupta",
    bio: "Real estate family diversifying",
    sectors: ["Real Estate", "Fintech"],
    aum: "₹600 Cr",
    aumValue: 600,
    checkSize: "₹2Cr - ₹10Cr",
    stageFocus: "Series A+",
    portfolio: 3,
    status: "on_hold",
    note: "Paused new investments until Q3 2026",
    pauseReason: "Focus on existing portfolio",
    decisionTimeline: "N/A",
    keyContact: "Meera Gupta",
    keyContactRole: "Family Office Head",
    relationshipOwner: "Rahul Mehta",
    relationshipOwnerInitials: "RM",
    relationshipStrength: "warm",
    lastContact: "2 months ago",
    lastContactDays: 60,
    location: "Chennai, India",
    coInvestment: true,
    boardSeat: false,
  },
  {
    id: "5",
    name: "Kapoor Ventures",
    principal: "Rajiv Kapoor",
    bio: "Media & entertainment family office",
    sectors: ["Media", "Consumer", "D2C"],
    aum: "₹380 Cr",
    aumValue: 380,
    checkSize: "₹2Cr - ₹8Cr",
    stageFocus: "Seed to Series A",
    portfolio: 6,
    status: "active_mandate",
    currentMandate: "D2C, Content Tech",
    mandateExpiry: "Apr 2026",
    decisionTimeline: "3-4 weeks",
    keyContact: "Ananya Kapoor",
    keyContactRole: "Investment Director",
    relationshipOwner: "Priya Sharma",
    relationshipOwnerInitials: "PS",
    relationshipStrength: "strong",
    lastContact: "3 days ago",
    lastContactDays: 3,
    location: "Mumbai, India",
    coInvestment: true,
    boardSeat: false,
  },
  {
    id: "6",
    name: "Reddy Family Office",
    principal: "Dr. Venkat Reddy",
    bio: "Pharma family transitioning to tech",
    sectors: ["Healthcare", "Biotech", "MedTech"],
    aum: "₹920 Cr",
    aumValue: 920,
    checkSize: "₹5Cr - ₹20Cr",
    stageFocus: "Series A to B",
    portfolio: 7,
    status: "evaluating",
    currentInterest: "Deep diving on HealthBridge",
    decisionTimeline: "8-10 weeks",
    keyContact: "Kiran Reddy",
    keyContactRole: "CIO",
    relationshipOwner: "Amit Patel",
    relationshipOwnerInitials: "AP",
    relationshipStrength: "warm",
    lastContact: "1 week ago",
    lastContactDays: 7,
    location: "Hyderabad, India",
    coInvestment: true,
    boardSeat: true,
  },
]

// Helper functions
function getStatusBadge(status: FamilyOffice["status"]) {
  switch (status) {
    case "active_mandate":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
          <Target className="w-3 h-3 mr-1" />
          Active Mandate
        </Badge>
      )
    case "evaluating":
      return (
        <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
          <BarChart3 className="w-3 h-3 mr-1" />
          Evaluating
        </Badge>
      )
    case "building":
      return (
        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
          <Handshake className="w-3 h-3 mr-1" />
          Building Relationship
        </Badge>
      )
    case "on_hold":
      return (
        <Badge className="bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20">
          <PauseCircle className="w-3 h-3 mr-1" />
          On Hold
        </Badge>
      )
  }
}

function getRelationshipBadge(strength: FamilyOffice["relationshipStrength"]) {
  switch (strength) {
    case "strong":
      return (
        <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
          Strong
        </Badge>
      )
    case "warm":
      return (
        <Badge variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10">
          Warm
        </Badge>
      )
    case "new":
      return (
        <Badge variant="outline" className="text-blue-600 dark:text-blue-400 border-blue-500/30 bg-blue-500/10">
          New
        </Badge>
      )
    case "inactive":
      return (
        <Badge variant="outline" className="text-gray-600 dark:text-gray-400 border-gray-500/30 bg-gray-500/10">
          Inactive
        </Badge>
      )
  }
}

function getAUMIndicator(aumValue: number) {
  if (aumValue >= 1000) {
    return { color: "bg-emerald-500", label: "Large", tooltip: "More capacity" }
  } else if (aumValue >= 500) {
    return { color: "bg-amber-500", label: "Medium", tooltip: "Selective" }
  } else {
    return { color: "bg-orange-500", label: "Small", tooltip: "Limited capacity" }
  }
}

function getStatusBorderColor(status: FamilyOffice["status"]) {
  switch (status) {
    case "active_mandate":
      return "border-l-emerald-500"
    case "evaluating":
      return "border-l-blue-500"
    case "building":
      return "border-l-amber-500"
    case "on_hold":
      return "border-l-gray-500"
  }
}

// Card component
interface FamilyOfficeCardProps {
  office: FamilyOffice
  selected?: boolean
  onToggleSelect?: (id: string) => void
  onViewProfile: (office: FamilyOffice) => void
  onSendDeck?: (office: FamilyOffice) => void
  onScheduleMeeting?: (office: FamilyOffice) => void
  onEdit?: (office: FamilyOffice) => void
  onSendEmail?: (office: FamilyOffice) => void
}

function FamilyOfficeCard({ office, selected, onToggleSelect, onViewProfile, onSendDeck, onScheduleMeeting, onEdit, onSendEmail }: FamilyOfficeCardProps) {
  const aumIndicator = getAUMIndicator(office.aumValue)

  return (
    <Card className={`group hover:shadow-md transition-all overflow-hidden border-l-4 ${getStatusBorderColor(office.status)}`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          {onToggleSelect && (
            <Checkbox
              checked={selected}
              onCheckedChange={() => onToggleSelect(office.id)}
              className="mt-1 shrink-0"
            />
          )}
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Landmark className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <Link
                href={`/investors/${office.id}`}
                className="font-medium text-foreground truncate hover:text-primary transition-colors"
              >
                {office.name}
              </Link>
              <div className="flex items-center gap-1 shrink-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onSendEmail?.(office)}>
                      <Mail className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Send email</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onScheduleMeeting?.(office)}>
                      <Calendar className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Schedule meeting</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit?.(office)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Edit</TooltipContent>
                </Tooltip>
              </div>
            </div>
            <p className="text-xs text-muted-foreground truncate">Principal: {office.principal}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          {getStatusBadge(office.status)}
          {getRelationshipBadge(office.relationshipStrength)}
        </div>

        {/* Sectors */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {office.sectors.slice(0, 2).map((sector) => (
            <Badge key={sector} variant="secondary" className="text-xs">
              {sector}
            </Badge>
          ))}
          {office.sectors.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{office.sectors.length - 2}
            </Badge>
          )}
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
            Family Office
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="mt-3 space-y-1.5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="w-3.5 h-3.5" />
            <span>AUM: <span className="text-foreground font-medium">{office.aum}</span></span>
            <span className={`w-2 h-2 rounded-full ${aumIndicator.color}`} title={aumIndicator.tooltip} />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CircleDollarSign className="w-3.5 h-3.5" />
            <span>Check Size: <span className="text-foreground">{office.checkSize}</span></span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Target className="w-3.5 h-3.5" />
            <span>Focus: <span className="text-foreground">{office.stageFocus}</span></span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Portfolio: <span className="text-foreground">{office.portfolio} direct investments</span></span>
          </div>
        </div>

        {/* Mandate/Interest/Note */}
        <div className="mt-3 p-2 bg-muted/50 rounded-lg">
          {office.status === "active_mandate" && office.currentMandate && (
            <div className="text-sm">
              <span className="text-muted-foreground">Current Mandate:</span>
              <span className="text-foreground ml-1 font-medium">{office.currentMandate}</span>
              {office.mandateExpiry && (
                <span className="text-muted-foreground ml-1">(expires {office.mandateExpiry})</span>
              )}
            </div>
          )}
          {office.status === "evaluating" && office.currentInterest && (
            <div className="text-sm">
              <span className="text-muted-foreground">Interest:</span>
              <span className="text-foreground ml-1">{office.currentInterest}</span>
            </div>
          )}
          {(office.status === "building" || office.status === "on_hold") && office.note && (
            <div className="text-sm">
              <span className="text-muted-foreground">Note:</span>
              <span className="text-foreground ml-1">{office.note}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <Clock className="w-3 h-3" />
            <span>Decision Timeline: {office.decisionTimeline}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" />
          <span>{office.location}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Relationship:</span>
            {getRelationshipBadge(office.relationshipStrength)}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {office.lastContact}
            {office.lastContactDays >= 30 && (
              <AlertCircle className="w-3 h-3 text-amber-500 ml-1" />
            )}
          </div>
        </div>

        {/* Relationship Owner & Key Contact */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {office.relationshipOwnerInitials}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{office.relationshipOwner}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {office.keyContact} ({office.keyContactRole})
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => onViewProfile(office)}>
            <Eye className="w-3.5 h-3.5 mr-1" />
            View Profile
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => onSendDeck?.(office)}>
            <Send className="w-3.5 h-3.5 mr-1" />
            Send Deck
          </Button>
          {office.status === "active_mandate" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="bg-transparent" onClick={() => onViewProfile(office)}>
                  <FileText className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">View mandate</TooltipContent>
            </Tooltip>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function FamilyOfficesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<"grid" | "list" | "table">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSector, setSelectedSector] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedAUM, setSelectedAUM] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [selectedOffice, setSelectedOffice] = useState<FamilyOffice | null>(null)
  const [showProfileSheet, setShowProfileSheet] = useState(false)

  const handleSendDeck = (office: FamilyOffice) => {
    toast({ title: "Send deck", description: `Opening composer for ${office.name}.` })
  }

  const handleScheduleMeeting = (office: FamilyOffice) => {
    toast({ title: "Schedule meeting", description: `Scheduling with ${office.name}.` })
  }

  const handleEdit = (office: FamilyOffice) => {
    toast({ title: "Edit", description: `Edit ${office.name} (open edit modal in production).` })
  }

  const handleSendEmail = (office: FamilyOffice) => {
    toast({ title: "Send email", description: `Opening composer for ${office.name}.` })
  }

  const clearAllFilters = () => {
    setSelectedSector("all")
    setSelectedStatus("all")
    setSelectedAUM("all")
    setFilterSheetOpen(false)
  }

  // Filter logic
  const filteredOffices = useMemo(() => familyOffices.filter((office) => {
    const matchesSearch =
      office.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      office.principal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      office.sectors.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesSector = selectedSector === "all" || office.sectors.includes(selectedSector)
    const matchesStatus = selectedStatus === "all" || office.status === selectedStatus
    const matchesAUM =
      selectedAUM === "all" ||
      (selectedAUM === "small" && office.aumValue < 500) ||
      (selectedAUM === "medium" && office.aumValue >= 500 && office.aumValue < 1000) ||
      (selectedAUM === "large" && office.aumValue >= 1000)
    return matchesSearch && matchesSector && matchesStatus && matchesAUM
  }), [searchQuery, selectedSector, selectedStatus, selectedAUM])

  // Sort logic
  const sortedOffices = useMemo(() => [...filteredOffices].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "aum":
        return b.aumValue - a.aumValue
      case "lastContact":
        return a.lastContactDays - b.lastContactDays
      case "activity":
        return a.lastContactDays - b.lastContactDays
      default:
        return 0
    }
  }), [filteredOffices, sortBy])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleViewProfile = (office: FamilyOffice) => {
    setSelectedOffice(office)
    setShowProfileSheet(true)
  }

  const activeFilters = [
    selectedSector !== "all" && { key: "sector", label: selectedSector },
    selectedStatus !== "all" && { key: "status", label: selectedStatus.replace("_", " ") },
    selectedAUM !== "all" && { key: "aum", label: `AUM: ${selectedAUM}` },
  ].filter(Boolean) as { key: string; label: string }[]

  return (
    <div className="flex flex-col h-screen bg-background">
      <Toaster />
      <DashboardHeader title="Family Offices" />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto p-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/role-selection" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/investors" className="hover:text-foreground transition-colors">
              Investors
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>By Type</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Family Offices</span>
          </nav>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Family Offices</h1>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                  <Landmark className="w-3.5 h-3.5 mr-1" />
                  Family Office
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                {filteredOffices.length} family offices in your network
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
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-md"
                  onClick={() => setViewMode("table")}
                  aria-label="Table view"
                >
                  <LayoutList className="w-4 h-4" />
                </Button>
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="aum">AUM</SelectItem>
                  <SelectItem value="lastContact">Last Contact</SelectItem>
                  <SelectItem value="activity">Activity</SelectItem>
                </SelectContent>
              </Select>

              {/* Filters - opens sheet (single entry, no duplicate dropdowns) */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterSheetOpen(true)}
                className="relative bg-transparent"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFilters.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </Button>

              {/* Add Button */}
              <Button onClick={() => toast({ title: "Add Family Office", description: "Opening add family office form." })}>
                <Plus className="w-4 h-4 mr-2" />
                Add Family Office
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Landmark className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">18</p>
                    <p className="text-sm text-muted-foreground">Family Offices</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">₹4,200 Cr</p>
                    <p className="text-sm text-muted-foreground">Total AUM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <CircleDollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">₹8.5 Cr</p>
                    <p className="text-sm text-muted-foreground">Avg Check Size</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">12</p>
                    <p className="text-sm text-muted-foreground">Active Mandates</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Bar - single entry: Search + Filters (sheet) */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search family offices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Active Filters */}
              {activeFilters.length > 0 && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t flex-wrap">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {activeFilters.map((filter) => (
                    <Badge
                      key={filter.key}
                      variant="secondary"
                      className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    >
                      {filter.label}
                      <button
                        onClick={() => {
                          if (filter.key === "sector") setSelectedSector("all")
                          if (filter.key === "status") setSelectedStatus("all")
                          if (filter.key === "aum") setSelectedAUM("all")
                        }}
                        className="ml-1 hover:text-emerald-800 dark:hover:text-emerald-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-muted-foreground">
                    Clear all
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Filters Sheet - single source for sector/status/AUM */}
          <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
            <SheetContent className="w-[400px] overflow-y-auto">
              <SheetHeader>
                <div className="flex items-center justify-between w-full">
                  <SheetTitle>Filters</SheetTitle>
                  {activeFilters.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-muted-foreground">
                      Clear all
                    </Button>
                  )}
                </div>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Sectors</Label>
                  <Select value={selectedSector} onValueChange={setSelectedSector}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Sectors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sectors</SelectItem>
                      <SelectItem value="Diversified">Diversified</SelectItem>
                      <SelectItem value="Fintech">Fintech</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Real Estate">Real Estate</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                      <SelectItem value="Consumer">Consumer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active_mandate">Active Mandate</SelectItem>
                      <SelectItem value="evaluating">Evaluating</SelectItem>
                      <SelectItem value="building">Building Relationship</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">AUM Range</Label>
                  <Select value={selectedAUM} onValueChange={setSelectedAUM}>
                    <SelectTrigger>
                      <SelectValue placeholder="All AUM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All AUM</SelectItem>
                      <SelectItem value="small">{"<₹500Cr"}</SelectItem>
                      <SelectItem value="medium">₹500-1000Cr</SelectItem>
                      <SelectItem value="large">₹1000Cr+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={() => { setFilterSheetOpen(false); toast({ title: "Filters applied", description: "Filters updated." }); }}>
                  Apply Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <Card className="mb-6 border-emerald-500/50 bg-emerald-500/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedIds.length === sortedOffices.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedIds(sortedOffices.map((o) => o.id))
                        } else {
                          setSelectedIds([])
                        }
                      }}
                    />
                    <span className="text-sm font-medium">
                      {selectedIds.length} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-transparent" onClick={() => toast({ title: "Send batch deck", description: `Opening composer for ${selectedIds.length} selected.` })}>
                      <Send className="w-4 h-4 mr-2" />
                      Send Batch Deck
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent" onClick={() => toast({ title: "Update status", description: "Opening bulk status update." })}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Update Status
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent" onClick={() => { const rows = sortedOffices.filter((o) => selectedIds.includes(o.id)).map((o) => [o.name, o.principal, o.aum, o.checkSize, o.status, o.location]); exportToCsv({ headers: ["Name", "Principal", "AUM", "Check Size", "Status", "Location"], rows, filename: "family-offices-export.csv" }); toast({ title: "Export started", description: "Selected family offices exported." }); }}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Content Area */}
          <div className="flex gap-6">
            {/* Cards Grid */}
            <div className="flex-1">
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedOffices.map((office) => (
                      <FamilyOfficeCard
                        key={office.id}
                        office={office}
                        selected={selectedIds.includes(office.id)}
                        onToggleSelect={toggleSelect}
                        onViewProfile={handleViewProfile}
                        onSendDeck={handleSendDeck}
                        onScheduleMeeting={handleScheduleMeeting}
                        onEdit={handleEdit}
                        onSendEmail={handleSendEmail}
                      />
                    ))}
                </div>
              )}

              {viewMode === "list" && (
                <div className="space-y-4">
                  {sortedOffices.map((office) => (
                    <Card key={office.id} className={`border-l-4 ${getStatusBorderColor(office.status)}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Checkbox
                            checked={selectedIds.includes(office.id)}
                            onCheckedChange={() => toggleSelect(office.id)}
                          />
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border flex items-center justify-center shrink-0">
                            <Landmark className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/investors/${office.id}`}
                                className="font-medium hover:text-primary transition-colors"
                              >
                                {office.name}
                              </Link>
                              {getStatusBadge(office.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {office.principal} · {office.location}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{office.aum}</p>
                            <p className="text-sm text-muted-foreground">{office.checkSize}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">{office.portfolio} investments</p>
                            <p className="text-sm text-muted-foreground">{office.lastContact}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="bg-transparent" onClick={() => handleViewProfile(office)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="bg-transparent" onClick={() => handleSendDeck(office)}>
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {viewMode === "table" && (
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedIds.length === sortedOffices.length}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedIds(sortedOffices.map((o) => o.id))
                              } else {
                                setSelectedIds([])
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Family Office</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>AUM</TableHead>
                        <TableHead>Check Size</TableHead>
                        <TableHead>Portfolio</TableHead>
                        <TableHead>Mandate</TableHead>
                        <TableHead>Last Contact</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedOffices.map((office) => (
                        <TableRow key={office.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedIds.includes(office.id)}
                              onCheckedChange={() => toggleSelect(office.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border flex items-center justify-center">
                                <Landmark className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <div>
                                <Link
                                  href={`/investors/${office.id}`}
                                  className="font-medium hover:text-primary transition-colors"
                                >
                                  {office.name}
                                </Link>
                                <p className="text-xs text-muted-foreground">{office.principal}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(office.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {office.aum}
                              <span className={`w-2 h-2 rounded-full ${getAUMIndicator(office.aumValue).color}`} />
                            </div>
                          </TableCell>
                          <TableCell>{office.checkSize}</TableCell>
                          <TableCell>{office.portfolio}</TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {office.currentMandate || office.currentInterest || office.note || "-"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {office.lastContact}
                              {office.lastContactDays >= 30 && (
                                <AlertCircle className="w-3 h-3 text-amber-500" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewProfile(office)}>
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">View profile</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleSendDeck(office)}>
                                    <Send className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">Send deck</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleScheduleMeeting(office)}>
                                    <Calendar className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">Schedule meeting</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(office)}>
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">Edit</TooltipContent>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="hidden xl:block w-80 space-y-6">
              {/* Family Office Overview */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Family Office Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total family offices</span>
                    <span className="font-medium">18</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Combined AUM</span>
                    <span className="font-medium">₹4,200 Cr</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active mandates</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg ticket size</span>
                    <span className="font-medium">₹8.5 Cr</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full bg-transparent mt-2" onClick={() => router.push("/analytics")}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              {/* Active Mandates */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Active Mandates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Rajan FO</p>
                        <p className="text-xs text-muted-foreground">Fintech, SaaS</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">Mar</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Sharma Holdings</p>
                        <p className="text-xs text-muted-foreground">Healthcare</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">Apr</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Patel Family</p>
                        <p className="text-xs text-muted-foreground">CleanTech</p>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">New</Badge>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/50">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-900 dark:text-amber-100">2 mandates expiring soon</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={() => toast({ title: "View All Mandates", description: "Opening mandates view." })}>
                    View All Mandates
                  </Button>
                </CardContent>
              </Card>

              {/* Pipeline with Family Offices */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Pipeline with Family Offices
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">In Discussion</span>
                      <span className="font-medium">4 deals</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Under Evaluation</span>
                      <span className="font-medium">3 deals</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Term Sheet</span>
                      <span className="font-medium">1 deal</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total potential</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">₹45 Cr</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={() => toast({ title: "View Pipeline", description: "Opening pipeline view." })}>
                    View Pipeline
                  </Button>
                </CardContent>
              </Card>

              {/* Relationship Insights */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Handshake className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    Relationship Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Avg tenure</span>
                      <span className="font-medium">2.3 years</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Meeting frequency</span>
                      <span className="font-medium">Monthly</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Response rate</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Deal conversion</span>
                      <span className="font-medium">23%</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={() => toast({ title: "Improve Engagement", description: "Opening engagement insights." })}>
                    Improve Engagement
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" onClick={() => toast({ title: "Import Contacts", description: "Connect your CRM to import contacts." })}>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Contacts
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" onClick={() => toast({ title: "Sync CRM", description: "Syncing with CRM." })}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync CRM
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" onClick={() => toast({ title: "Bulk Update", description: "Opening bulk update for selected." })}>
                    <Users className="w-4 h-4 mr-2" />
                    Bulk Update
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" onClick={() => { const rows = sortedOffices.map((o) => [o.name, o.principal, o.aum, o.checkSize, o.status, o.location]); exportToCsv({ headers: ["Name", "Principal", "AUM", "Check Size", "Status", "Location"], rows, filename: "family-offices-list.csv" }); toast({ title: "Export started", description: "Family offices list exported." }); }}>
                    <Download className="w-4 h-4 mr-2" />
                    Export List
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Profile Sheet */}
      <Sheet open={showProfileSheet} onOpenChange={setShowProfileSheet}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-8">
          {selectedOffice && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border flex items-center justify-center">
                    <Landmark className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <SheetTitle>{selectedOffice.name}</SheetTitle>
                    <p className="text-sm text-muted-foreground">Principal: {selectedOffice.principal}</p>
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Status & Type */}
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedOffice.status)}
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                    Family Office
                  </Badge>
                  {getRelationshipBadge(selectedOffice.relationshipStrength)}
                </div>

                {/* Bio */}
                <div>
                  <h4 className="text-sm font-medium mb-2">About</h4>
                  <p className="text-sm text-muted-foreground">{selectedOffice.bio}</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">AUM</p>
                    <p className="text-lg font-semibold">{selectedOffice.aum}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Check Size</p>
                    <p className="text-lg font-semibold">{selectedOffice.checkSize}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Stage Focus</p>
                    <p className="text-sm font-medium">{selectedOffice.stageFocus}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Portfolio</p>
                    <p className="text-lg font-semibold">{selectedOffice.portfolio} investments</p>
                  </div>
                </div>

                {/* Sectors */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Sectors</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedOffice.sectors.map((sector) => (
                      <Badge key={sector} variant="secondary">
                        {sector}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Investment Preferences */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Investment Preferences</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <span className="text-sm">Co-investment</span>
                      {selectedOffice.coInvestment ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <span className="text-sm">Board seat required</span>
                      {selectedOffice.boardSeat ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <span className="text-sm">Decision timeline</span>
                      <span className="text-sm font-medium">{selectedOffice.decisionTimeline}</span>
                    </div>
                  </div>
                </div>

                {/* Mandate/Interest (mandate sheet block with p-8) */}
                {(selectedOffice.currentMandate || selectedOffice.currentInterest || selectedOffice.note) && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      {selectedOffice.status === "active_mandate" ? "Current Mandate" : "Current Status"}
                    </h4>
                    <div className="p-8 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                      <p className="text-sm text-emerald-900 dark:text-emerald-100">
                        {selectedOffice.currentMandate || selectedOffice.currentInterest || selectedOffice.note}
                      </p>
                      {selectedOffice.mandateExpiry && (
                        <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                          Expires: {selectedOffice.mandateExpiry}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Key Contact</h4>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{selectedOffice.keyContact}</p>
                        <p className="text-sm text-muted-foreground">{selectedOffice.keyContactRole}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({ title: "Send email", description: `Opening composer for ${selectedOffice.keyContact}.` })}>
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({ title: "Call", description: `Calling ${selectedOffice.keyContact}.` })}>
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Relationship Owner */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Relationship Owner</h4>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {selectedOffice.relationshipOwnerInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedOffice.relationshipOwner}</p>
                      <p className="text-xs text-muted-foreground">Last contact: {selectedOffice.lastContact}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button className="flex-1" onClick={() => { handleSendDeck(selectedOffice); setShowProfileSheet(false); }}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Deck
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => { handleScheduleMeeting(selectedOffice); setShowProfileSheet(false); }}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

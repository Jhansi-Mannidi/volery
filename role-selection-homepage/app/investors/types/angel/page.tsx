"use client"

import { useState, useMemo, Suspense } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Download,
  Eye,
  Filter,
  Flame,
  Globe,
  Grid3X3,
  LayoutList,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Pencil,
  Plus,
  Search,
  Send,
  Sparkles,
  Star,
  Table,
  Target,
  TrendingUp,
  User,
  Users,
  Wallet,
  X,
  Zap,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  SheetTrigger,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import {
  Table as UITable,
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
import { AddEditInvestorModal } from "@/components/investor/add-edit-investor-modal"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { exportToCsv } from "@/lib/export-utils"

// Types
interface AngelInvestor {
  id: string
  name: string
  initials: string
  avatarColor: string
  bio: string
  location: string
  checkSizeMin: number
  checkSizeMax: number
  stageFocus: string[]
  sectors: string[]
  relationship: "Champion" | "Strong" | "Warm" | "New" | "Inactive" | "Do Not Contact"
  portfolioCount: number
  recentActivity: string
  lastContact: string
  needsFollowUp: boolean
  owner: { name: string; initials: string }
  syndicateLead: boolean
  syndicateName?: string
  investmentVelocity: "Active" | "Moderate" | "Slow"
  linkedIn?: string
  email?: string
  phone?: string
}

// Mock data for Angel Investors
const angelInvestors: AngelInvestor[] = [
  {
    id: "1",
    name: "Vikram Mehta",
    initials: "VM",
    avatarColor: "bg-blue-500",
    bio: "Founder at PayEase (Exited), Serial Entrepreneur",
    location: "Mumbai, India",
    checkSizeMin: 5000000,
    checkSizeMax: 15000000,
    stageFocus: ["Pre-Seed", "Seed"],
    sectors: ["Fintech", "SaaS"],
    relationship: "Champion",
    portfolioCount: 12,
    recentActivity: "Invested in TechFlow (2 weeks ago)",
    lastContact: "3 days ago",
    needsFollowUp: false,
    owner: { name: "Priya Sharma", initials: "PS" },
    syndicateLead: true,
    syndicateName: "Mumbai Angels",
    investmentVelocity: "Active",
    linkedIn: "linkedin.com/in/vikrammehta",
    email: "vikram@example.com",
  },
  {
    id: "2",
    name: "Anita Desai",
    initials: "AD",
    avatarColor: "bg-green-500",
    bio: "Ex-CTO Flipkart, Technical Advisor",
    location: "Bangalore, India",
    checkSizeMin: 2500000,
    checkSizeMax: 7500000,
    stageFocus: ["Pre-Seed"],
    sectors: ["DeepTech", "AI/ML", "SaaS"],
    relationship: "Strong",
    portfolioCount: 8,
    recentActivity: "Evaluating 2 startups",
    lastContact: "1 week ago",
    needsFollowUp: false,
    owner: { name: "Rahul Mehta", initials: "RM" },
    syndicateLead: false,
    investmentVelocity: "Active",
    linkedIn: "linkedin.com/in/anitadesai",
    email: "anita@example.com",
  },
  {
    id: "3",
    name: "Rajesh Gupta",
    initials: "RG",
    avatarColor: "bg-purple-500",
    bio: "Angel Network Lead, TiE Chennai",
    location: "Chennai, India",
    checkSizeMin: 1500000,
    checkSizeMax: 5000000,
    stageFocus: ["Seed"],
    sectors: ["Healthcare", "Consumer"],
    relationship: "New",
    portfolioCount: 22,
    recentActivity: "New to network",
    lastContact: "Never",
    needsFollowUp: true,
    owner: { name: "Amit Patel", initials: "AP" },
    syndicateLead: true,
    syndicateName: "TiE Angels Chennai",
    investmentVelocity: "Moderate",
  },
  {
    id: "4",
    name: "Meera Krishnamurthy",
    initials: "MK",
    avatarColor: "bg-teal-500",
    bio: "Former Partner at Blume Ventures",
    location: "Hyderabad, India",
    checkSizeMin: 10000000,
    checkSizeMax: 20000000,
    stageFocus: ["Seed", "Series A"],
    sectors: ["B2B SaaS", "Fintech"],
    relationship: "Warm",
    portfolioCount: 15,
    recentActivity: "Last invested 6 months ago",
    lastContact: "3 weeks ago",
    needsFollowUp: true,
    owner: { name: "Priya Sharma", initials: "PS" },
    syndicateLead: false,
    investmentVelocity: "Slow",
    email: "meera@example.com",
  },
  {
    id: "5",
    name: "Sanjay Reddy",
    initials: "SR",
    avatarColor: "bg-orange-500",
    bio: "Ex-Founder CleanTech Solutions, Climate Investor",
    location: "Delhi, India",
    checkSizeMin: 3000000,
    checkSizeMax: 10000000,
    stageFocus: ["Pre-Seed", "Seed"],
    sectors: ["CleanTech", "Sustainability", "AgriTech"],
    relationship: "Strong",
    portfolioCount: 18,
    recentActivity: "Committed to EcoVenture (yesterday)",
    lastContact: "1 day ago",
    needsFollowUp: false,
    owner: { name: "Rahul Mehta", initials: "RM" },
    syndicateLead: true,
    syndicateName: "Climate Angels India",
    investmentVelocity: "Active",
    linkedIn: "linkedin.com/in/sanjayreddy",
    email: "sanjay@example.com",
    phone: "+91 98765 43210",
  },
  {
    id: "6",
    name: "Priya Menon",
    initials: "PM",
    avatarColor: "bg-pink-500",
    bio: "Serial Entrepreneur, 2 Exits",
    location: "Pune, India",
    checkSizeMin: 2000000,
    checkSizeMax: 5000000,
    stageFocus: ["Pre-Seed"],
    sectors: ["EdTech", "Consumer", "D2C"],
    relationship: "Champion",
    portfolioCount: 10,
    recentActivity: "Referred 3 startups this month",
    lastContact: "2 days ago",
    needsFollowUp: false,
    owner: { name: "Priya Sharma", initials: "PS" },
    syndicateLead: false,
    investmentVelocity: "Active",
    linkedIn: "linkedin.com/in/priyamenon",
    email: "priya.menon@example.com",
  },
  {
    id: "7",
    name: "Arun Sharma",
    initials: "AS",
    avatarColor: "bg-indigo-500",
    bio: "Ex-VP Engineering at Swiggy",
    location: "Bangalore, India",
    checkSizeMin: 1000000,
    checkSizeMax: 3000000,
    stageFocus: ["Pre-Seed"],
    sectors: ["Consumer Tech", "Logistics", "SaaS"],
    relationship: "Warm",
    portfolioCount: 5,
    recentActivity: "Met at TiE Conference",
    lastContact: "2 weeks ago",
    needsFollowUp: false,
    owner: { name: "Amit Patel", initials: "AP" },
    syndicateLead: false,
    investmentVelocity: "Moderate",
    email: "arun.sharma@example.com",
  },
  {
    id: "8",
    name: "Kavita Jain",
    initials: "KJ",
    avatarColor: "bg-cyan-500",
    bio: "Healthcare Industry Veteran, 25+ years",
    location: "Mumbai, India",
    checkSizeMin: 5000000,
    checkSizeMax: 12000000,
    stageFocus: ["Seed", "Series A"],
    sectors: ["Healthcare", "HealthTech", "BioTech"],
    relationship: "Inactive",
    portfolioCount: 7,
    recentActivity: "No recent activity",
    lastContact: "3 months ago",
    needsFollowUp: true,
    owner: { name: "Rahul Mehta", initials: "RM" },
    syndicateLead: false,
    investmentVelocity: "Slow",
  },
  {
    id: "9",
    name: "Nikhil Bansal",
    initials: "NB",
    avatarColor: "bg-red-500",
    bio: "Co-founder at Snapdeal (Exited)",
    location: "Gurgaon, India",
    checkSizeMin: 10000000,
    checkSizeMax: 25000000,
    stageFocus: ["Seed", "Series A"],
    sectors: ["E-commerce", "Consumer", "Fintech"],
    relationship: "Champion",
    portfolioCount: 30,
    recentActivity: "Leading round for QuickMart",
    lastContact: "1 week ago",
    needsFollowUp: false,
    owner: { name: "Priya Sharma", initials: "PS" },
    syndicateLead: true,
    syndicateName: "Titan Angels",
    investmentVelocity: "Active",
    linkedIn: "linkedin.com/in/nikhilbansal",
    email: "nikhil@example.com",
    phone: "+91 99887 76655",
  },
]

// Helper functions
function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(0)}L`
  }
  return `₹${amount.toLocaleString("en-IN")}`
}

function getRelationshipBadge(relationship: AngelInvestor["relationship"]) {
  const config = {
    Champion: { bg: "bg-amber-100 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-300", icon: Star },
    Strong: { bg: "bg-blue-100 dark:bg-blue-950/40", text: "text-blue-700 dark:text-blue-300", icon: null },
    Warm: { bg: "bg-yellow-100 dark:bg-yellow-950/40", text: "text-yellow-700 dark:text-yellow-300", icon: null },
    New: { bg: "bg-green-100 dark:bg-green-950/40", text: "text-green-700 dark:text-green-300", icon: Zap },
    Inactive: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400", icon: null },
    "Do Not Contact": { bg: "bg-red-100 dark:bg-red-950/40", text: "text-red-700 dark:text-red-300", icon: null },
  }
  const c = config[relationship]
  return (
    <Badge variant="secondary" className={cn("gap-1", c.bg, c.text)}>
      {c.icon && <c.icon className="w-3 h-3" />}
      {relationship}
    </Badge>
  )
}

function getVelocityIndicator(velocity: AngelInvestor["investmentVelocity"]) {
  const config = {
    Active: { icon: Flame, text: "Active", color: "text-orange-500" },
    Moderate: { icon: TrendingUp, text: "Moderate", color: "text-blue-500" },
    Slow: { icon: Clock, text: "Slow", color: "text-gray-500" },
  }
  const c = config[velocity]
  return (
    <span className={cn("flex items-center gap-1 text-xs", c.color)}>
      <c.icon className="w-3 h-3" />
      {c.text}
    </span>
  )
}

type ViewMode = "grid" | "list" | "table"

const Loading = () => null

// Angel Investor Card Component
function AngelInvestorCard({
  investor,
  selected,
  onToggleSelect,
  onMatch,
  onSendIntro,
  onLogActivity,
  onSendEmail,
  onEdit,
}: {
  investor: AngelInvestor
  selected?: boolean
  onToggleSelect?: (id: string) => void
  onMatch?: (investor: AngelInvestor) => void
  onSendIntro?: (investor: AngelInvestor) => void
  onLogActivity?: (investor: AngelInvestor) => void
  onSendEmail?: (investor: AngelInvestor) => void
  onEdit?: (investor: AngelInvestor) => void
}) {
  return (
    <Card className="group hover:shadow-md transition-all overflow-hidden">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          {onToggleSelect && (
            <Checkbox
              checked={selected}
              onCheckedChange={() => onToggleSelect(investor.id)}
              className="mt-1 shrink-0"
            />
          )}
          <Avatar className={cn("w-10 h-10 shrink-0", investor.avatarColor)}>
            <AvatarFallback className="text-white font-medium text-sm">
              {investor.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <Link
                href={`/investors/${investor.id}`}
                className="font-semibold text-foreground truncate hover:text-primary transition-colors"
              >
                {investor.name}
              </Link>
              <div className="flex items-center gap-1 shrink-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onSendEmail?.(investor)}>
                      <Mail className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Send email</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onLogActivity?.(investor)}>
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Log activity</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit?.(investor)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Edit</TooltipContent>
                </Tooltip>
              </div>
            </div>
            <p className="text-xs text-muted-foreground truncate">{investor.bio}</p>
          </div>
        </div>

        {/* Relationship Badge */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {getRelationshipBadge(investor.relationship)}
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <User className="w-3 h-3 mr-1" />
            Angel
          </Badge>
          {investor.syndicateLead && (
            <Badge variant="outline" className="text-xs">
              Syndicate Lead
            </Badge>
          )}
        </div>

        {/* Sectors */}
        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
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

        {/* Investment Info */}
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wallet className="w-4 h-4 shrink-0" />
            <span>Check Size: {formatCurrency(investor.checkSizeMin)} - {formatCurrency(investor.checkSizeMax)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Target className="w-4 h-4 shrink-0" />
            <span>Focus: {investor.stageFocus.join(", ")}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="w-4 h-4 shrink-0" />
            <span>Portfolio: {investor.portfolioCount} companies</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-3 p-2 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            {getVelocityIndicator(investor.investmentVelocity)}
            <span className="text-xs text-muted-foreground truncate">{investor.recentActivity}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          {investor.location}
        </div>

        {/* Relationship & Owner */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Relationship:</span>
            <span className={cn(
              "text-xs font-medium",
              investor.relationship === "Champion" && "text-amber-600 dark:text-amber-400",
              investor.relationship === "Strong" && "text-blue-600 dark:text-blue-400",
              investor.relationship === "Warm" && "text-yellow-600 dark:text-yellow-400",
              investor.relationship === "New" && "text-green-600 dark:text-green-400",
            )}>
              {investor.relationship}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span className={investor.needsFollowUp ? "text-amber-600 dark:text-amber-400 font-medium" : ""}>
              {investor.lastContact}
              {investor.needsFollowUp && " ⚠️"}
            </span>
          </div>
        </div>

        {/* Owner */}
        <div className="flex items-center gap-2 mt-2">
          <Avatar className="w-5 h-5">
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
              {investor.owner.initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{investor.owner.name}</span>
        </div>

        {/* Actions - View Profile (single primary), Send Intro, Match */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent text-xs" asChild>
            <Link href={`/investors/${investor.id}`}>View Profile</Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-transparent text-xs" onClick={() => onSendIntro?.(investor)}>
            Send Intro
          </Button>
          <Button
            size="sm"
            className="flex-1 text-xs"
            onClick={() => onMatch?.(investor)}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Match
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AngelInvestorsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filterOpen, setFilterOpen] = useState(false)
  const [matchPanelOpen, setMatchPanelOpen] = useState(false)
  const [selectedInvestor, setSelectedInvestor] = useState<AngelInvestor | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [addInvestorModalOpen, setAddInvestorModalOpen] = useState(false)
  const [editInvestor, setEditInvestor] = useState<AngelInvestor | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  // Filter states (single source: Filters sheet)
  const [selectedSectors, setSelectedSectors] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [checkSizeRange, setCheckSizeRange] = useState([0, 200])

  const handleMatchClick = (investor: AngelInvestor) => {
    setSelectedInvestor(investor)
    setMatchPanelOpen(true)
  }

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleSendIntro = (investor: AngelInvestor) => {
    toast({ title: "Send intro", description: `Opening composer for ${investor.name}.` })
  }

  const handleLogActivity = (investor: AngelInvestor) => {
    toast({ title: "Log activity", description: `Log activity for ${investor.name}.` })
  }

  const handleSendEmail = (investor: AngelInvestor) => {
    toast({ title: "Send email", description: `Opening composer for ${investor.name}.` })
  }

  const handleEdit = (investor: AngelInvestor) => {
    setEditInvestor(investor)
    setEditModalOpen(true)
  }

  const activeFilters = useMemo(() => {
    const labels: string[] = []
    selectedSectors.forEach((s) => labels.push(`Sector: ${s}`))
    selectedStatus.forEach((s) => labels.push(`Status: ${s}`))
    if (checkSizeRange[0] > 0 || checkSizeRange[1] < 200) {
      labels.push(`Check: ₹${checkSizeRange[0]}L–₹${checkSizeRange[1]}L`)
    }
    return labels
  }, [selectedSectors, selectedStatus, checkSizeRange])

  const filteredInvestors = useMemo(() => {
    return angelInvestors.filter((investor) => {
      const matchesSearch =
        !searchQuery ||
        investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        investor.sectors.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        investor.bio.toLowerCase().includes(searchQuery.toLowerCase())
      if (!matchesSearch) return false
      if (selectedSectors.length > 0 && !investor.sectors.some((s) => selectedSectors.includes(s))) return false
      if (selectedStatus.length > 0 && !selectedStatus.includes(investor.relationship)) return false
      if (checkSizeRange[0] > 0 || checkSizeRange[1] < 200) {
        const avgCheck = (investor.checkSizeMin + investor.checkSizeMax) / 2
        const minRupees = checkSizeRange[0] * 100000
        const maxRupees = checkSizeRange[1] >= 200 ? Infinity : checkSizeRange[1] * 100000
        if (avgCheck < minRupees || avgCheck > maxRupees) return false
      }
      return true
    })
  }, [searchQuery, selectedSectors, selectedStatus, checkSizeRange])

  const sortedInvestors = useMemo(() => [...filteredInvestors].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "lastContact":
        return 0
      case "checkSize":
        return b.checkSizeMax - a.checkSizeMax
      case "matchScore":
        return b.portfolioCount - a.portfolioCount
      case "activity":
        const velocityOrder = { Active: 0, Moderate: 1, Slow: 2 }
        return velocityOrder[a.investmentVelocity] - velocityOrder[b.investmentVelocity]
      default:
        return 0
    }
  }), [filteredInvestors, sortBy])

  // Stats
  const totalAngels = angelInvestors.length
  const avgCheckSize = Math.round(
    angelInvestors.reduce((sum, i) => sum + (i.checkSizeMin + i.checkSizeMax) / 2, 0) / totalAngels
  )
  const activeInvestors = angelInvestors.filter(
    (i) => i.investmentVelocity === "Active" || i.investmentVelocity === "Moderate"
  ).length
  const champions = angelInvestors.filter((i) => i.relationship === "Champion").length

  const clearFilter = (filter: string) => {
    if (filter.startsWith("Sector: ")) setSelectedSectors((prev) => prev.filter((s) => `Sector: ${s}` !== filter))
    else if (filter.startsWith("Status: ")) setSelectedStatus((prev) => prev.filter((s) => `Status: ${s}` !== filter))
    else if (filter.startsWith("Check:")) setCheckSizeRange([0, 100])
  }

  const clearAllFilters = () => {
    setSelectedSectors([])
    setSelectedStatus([])
    setCheckSizeRange([0, 200])
  }

  const editInvestorData = editInvestor
    ? {
        id: editInvestor.id,
        name: editInvestor.name,
        type: "Angel Investor",
        description: editInvestor.bio,
        city: editInvestor.location.split(",")[0]?.trim() ?? "",
        country: editInvestor.location.split(",")[1]?.trim() ?? "India",
        checkSizeMin: editInvestor.checkSizeMin,
        checkSizeMax: editInvestor.checkSizeMax,
        sectors: editInvestor.sectors,
        investmentStages: editInvestor.stageFocus,
        relationshipStrength: editInvestor.relationship.toLowerCase(),
        linkedin: editInvestor.linkedIn ?? "",
        tags: editInvestor.sectors,
        website: "",
        crunchbase: "",
        address: "",
        yearFounded: "",
        aum: "",
        currentFundSize: "",
        relationshipOwner: editInvestor.owner.name,
        source: "",
        geographies: [editInvestor.location],
        businessModels: [],
        exclusions: "",
        contacts: [],
        redFlags: "",
        internalNotes: "",
        thesisNotes: "",
        meetingNotes: "",
        currency: "INR",
      }
    : null

  return (
    <Suspense fallback={<Loading />}>
      <Toaster />
      <AddEditInvestorModal
        open={addInvestorModalOpen}
        onOpenChange={setAddInvestorModalOpen}
        mode="add"
      />
      {editInvestorData && (
        <AddEditInvestorModal
          open={editModalOpen}
          onOpenChange={(open) => { setEditModalOpen(open); if (!open) setEditInvestor(null); }}
          investor={editInvestorData}
          mode="edit"
        />
      )}

      {/* Match to Deals Panel */}
      <Sheet open={matchPanelOpen} onOpenChange={setMatchPanelOpen}>
        <SheetContent className="w-[400px] overflow-y-auto p-8">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Match to Deals
            </SheetTitle>
          </SheetHeader>
          {selectedInvestor && (
            <div className="mt-6 space-y-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className={cn("w-10 h-10", selectedInvestor.avatarColor)}>
                    <AvatarFallback className="text-white font-medium">
                      {selectedInvestor.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedInvestor.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(selectedInvestor.checkSizeMin)} - {formatCurrency(selectedInvestor.checkSizeMax)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Top Matching Startups</h4>
                <div className="space-y-2">
                  {[
                    { name: "TechFlow AI", match: 94, sector: "AI/ML", stage: "Seed" },
                    { name: "PaySecure", match: 89, sector: "Fintech", stage: "Pre-Seed" },
                    { name: "DataSync Pro", match: 85, sector: "SaaS", stage: "Seed" },
                    { name: "HealthBridge", match: 78, sector: "Healthcare", stage: "Seed" },
                    { name: "EduSpark", match: 72, sector: "EdTech", stage: "Pre-Seed" },
                  ].map((startup) => (
                    <div
                      key={startup.name}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{startup.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {startup.sector} · {startup.stage}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={cn(
                            startup.match >= 90 && "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300",
                            startup.match >= 80 && startup.match < 90 && "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300",
                            startup.match < 80 && "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                          )}
                        >
                          {startup.match}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => toast({ title: "Added to target list", description: `${selectedInvestor.name} added.` })}>
                  Add to Target List
                </Button>
                <Button className="flex-1" onClick={() => toast({ title: "Send intro", description: "Opening composer for selected startups." })}>
                  <Send className="w-4 h-4 mr-1.5" />
                  Send Intro
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Angel Investors" />
        
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          
          <main className="flex-1 overflow-auto">
            {/* Breadcrumb */}
            <div className="border-b bg-card px-4 md:px-6 py-2">
              <div className="flex items-center gap-2 text-sm">
                <Link href="/role-selection" className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <Link href="/investors" className="text-muted-foreground hover:text-foreground">
                  Investors
                </Link>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">By Type</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground font-medium">Angel Investors</span>
              </div>
            </div>

            {/* Page Header */}
            <div className="border-b bg-card px-4 md:px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Link
                    href="/investors"
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-semibold text-foreground">Angel Investors</h1>
                      <Badge className="bg-amber-500 text-white hover:bg-amber-600">
                        <User className="w-3 h-3 mr-1" />
                        Angel
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {totalAngels} angel investors in your network
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

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="lastContact">Last Contact</SelectItem>
                      <SelectItem value="checkSize">Check Size</SelectItem>
                      <SelectItem value="matchScore">Match Score</SelectItem>
                      <SelectItem value="activity">Activity</SelectItem>
                    </SelectContent>
                  </Select>

                  <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="bg-transparent relative">
                        <Filter className="w-4 h-4 mr-1.5" />
                        Filters
                        {activeFilters.length > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center">
                            {activeFilters.length}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px] overflow-y-auto">
                      <SheetHeader>
                        <div className="flex items-center justify-between">
                          <SheetTitle>Filters</SheetTitle>
                          {activeFilters.length > 0 && (
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
                        {/* Sectors */}
                        <div>
                          <Label className="text-sm font-medium mb-3 block">Sectors</Label>
                          <div className="flex flex-wrap gap-2">
                            {["Fintech", "SaaS", "Healthcare", "EdTech", "CleanTech", "Consumer", "DeepTech", "AI/ML", "B2B"].map((sector) => (
                              <Badge
                                key={sector}
                                variant={selectedSectors.includes(sector) ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => {
                                  if (selectedSectors.includes(sector)) {
                                    setSelectedSectors(selectedSectors.filter((s) => s !== sector))
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

                        {/* Status */}
                        <div>
                          <Label className="text-sm font-medium mb-3 block">Relationship Status</Label>
                          <div className="space-y-2">
                            {["Champion", "Strong", "Warm", "New", "Inactive", "Do Not Contact"].map((status) => (
                              <div key={status} className="flex items-center gap-2">
                                <Checkbox
                                  id={`status-${status}`}
                                  checked={selectedStatus.includes(status)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedStatus([...selectedStatus, status])
                                    } else {
                                      setSelectedStatus(selectedStatus.filter((s) => s !== status))
                                    }
                                  }}
                                />
                                <Label htmlFor={`status-${status}`} className="text-sm font-normal cursor-pointer">
                                  {status}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Check Size */}
                        <div>
                          <Label className="text-sm font-medium mb-3 block">
                            Check Size: {checkSizeRange[0] === 0 ? "<₹25L" : `₹${checkSizeRange[0]}L`} - ₹{checkSizeRange[1]}L+
                          </Label>
                          <Slider
                            value={checkSizeRange}
                            onValueChange={setCheckSizeRange}
                            min={0}
                            max={200}
                            step={25}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => setAddInvestorModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Add Investor
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="border-b bg-card px-4 md:px-6 py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center">
                        <User className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{totalAngels}</p>
                        <p className="text-xs text-muted-foreground">Angel Investors</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-950/40 flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{formatCurrency(avgCheckSize)}</p>
                        <p className="text-xs text-muted-foreground">Avg Check Size</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center">
                        <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{activeInvestors}</p>
                        <p className="text-xs text-muted-foreground">Active (30d)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center">
                        <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{champions}</p>
                        <p className="text-xs text-muted-foreground">Champions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Filter Bar - single entry: Search + Filters (sheet) */}
            <div className="border-b bg-card px-4 md:px-6 py-3">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search investors..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Active Filters */}
              {activeFilters.length > 0 && (
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {activeFilters.map((filter) => (
                    <Badge
                      key={filter}
                      variant="secondary"
                      className="bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 gap-1"
                    >
                      {filter}
                      <button onClick={() => clearFilter(filter)}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground"
                    onClick={clearAllFilters}
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="flex">
              {/* Investor Cards Grid */}
              <div className="flex-1 p-4 md:p-6">
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {sortedInvestors.map((investor) => (
                      <AngelInvestorCard
                        key={investor.id}
                        investor={investor}
                        selected={selectedIds.includes(investor.id)}
                        onToggleSelect={handleToggleSelect}
                        onMatch={handleMatchClick}
                        onSendIntro={handleSendIntro}
                        onLogActivity={handleLogActivity}
                        onSendEmail={handleSendEmail}
                        onEdit={handleEdit}
                      />
                    ))}
                  </div>
                )}

                {viewMode === "list" && (
                  <div className="space-y-3">
                    {sortedInvestors.map((investor) => (
                      <Card key={investor.id} className="hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <Checkbox
                              checked={selectedIds.includes(investor.id)}
                              onCheckedChange={() => handleToggleSelect(investor.id)}
                            />
                            <Avatar className={cn("w-12 h-12", investor.avatarColor)}>
                              <AvatarFallback className="text-white font-medium">
                                {investor.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/investors/${investor.id}`}
                                  className="font-semibold hover:text-primary"
                                >
                                  {investor.name}
                                </Link>
                                {getRelationshipBadge(investor.relationship)}
                                <Badge className="bg-amber-500 text-white text-xs">Angel</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{investor.bio}</p>
                            </div>
                            <div className="text-right hidden md:block">
                              <p className="text-sm font-medium">
                                {formatCurrency(investor.checkSizeMin)} - {formatCurrency(investor.checkSizeMax)}
                              </p>
                              <p className="text-xs text-muted-foreground">{investor.stageFocus.join(", ")}</p>
                            </div>
                            <div className="text-right hidden lg:block">
                              <p className="text-sm">{investor.portfolioCount} companies</p>
                              <p className="text-xs text-muted-foreground">{investor.location}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" className="bg-transparent" asChild>
                                <Link href={`/investors/${investor.id}`}>View</Link>
                              </Button>
                              <Button size="sm" onClick={() => handleMatchClick(investor)}>
                                <Sparkles className="w-3 h-3 mr-1" />
                                Match
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
                    <UITable>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox />
                          </TableHead>
                          <TableHead>Investor</TableHead>
                          <TableHead>Relationship</TableHead>
                          <TableHead>Check Size</TableHead>
                          <TableHead>Stage Focus</TableHead>
                          <TableHead>Portfolio</TableHead>
                          <TableHead>Last Contact</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedInvestors.map((investor) => (
                          <TableRow key={investor.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedIds.includes(investor.id)}
                                onCheckedChange={() => handleToggleSelect(investor.id)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className={cn("w-8 h-8", investor.avatarColor)}>
                                  <AvatarFallback className="text-white text-xs">
                                    {investor.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <Link
                                    href={`/investors/${investor.id}`}
                                    className="font-medium hover:text-primary"
                                  >
                                    {investor.name}
                                  </Link>
                                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                    {investor.bio}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getRelationshipBadge(investor.relationship)}</TableCell>
                            <TableCell>
                              <span className="text-sm">
                                {formatCurrency(investor.checkSizeMin)} - {formatCurrency(investor.checkSizeMax)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">
                                {investor.stageFocus.join(", ")}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">{investor.portfolioCount}</span>
                            </TableCell>
                            <TableCell>
                              <span
                                className={cn(
                                  "text-sm",
                                  investor.needsFollowUp && "text-amber-600 dark:text-amber-400 font-medium"
                                )}
                              >
                                {investor.lastContact}
                                {investor.needsFollowUp && " ⚠️"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                <Avatar className="w-5 h-5">
                                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                    {investor.owner.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs">{investor.owner.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={`/investors/${investor.id}`}>View</Link>
                                </Button>
                                <Button size="sm" onClick={() => handleMatchClick(investor)}>
                                  <Sparkles className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </UITable>
                  </Card>
                )}
              </div>

              {/* Right Sidebar */}
              <aside className="hidden xl:block w-[300px] border-l p-4 space-y-4">
                {/* Angel Network Overview */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Angel Network Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total angels</span>
                      <span className="font-medium">{totalAngels}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active this month</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {activeInvestors} (65%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Champions</span>
                      <span className="font-medium text-amber-600 dark:text-amber-400">
                        {champions} (35%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">New this month</span>
                      <span className="font-medium">5</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full bg-transparent mt-2" onClick={() => router.push("/analytics")}>
                      <BarChart3 className="w-4 h-4 mr-1.5" />
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>

                {/* Top Angels by Activity */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Top Angels by Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: "Vikram Mehta", activity: "3 deals evaluated" },
                      { name: "Anita Desai", activity: "2 intros made" },
                      { name: "Rajesh Gupta", activity: "5 referrals" },
                    ].map((angel, i) => (
                      <div key={angel.name} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{angel.name}</p>
                          <p className="text-xs text-muted-foreground">{angel.activity}</p>
                        </div>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => toast({ title: "Leaderboard", description: "Opening full angel leaderboard." })}>
                      See Full Leaderboard
                    </Button>
                  </CardContent>
                </Card>

                {/* Relationship Health */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Relationship Health</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: "Champions", count: champions, percent: 35, color: "bg-amber-500" },
                      { label: "Strong", count: 3, percent: 30, color: "bg-blue-500" },
                      { label: "Warm", count: 2, percent: 24, color: "bg-yellow-500" },
                      { label: "New", count: 1, percent: 11, color: "bg-green-500" },
                    ].map((item) => (
                      <div key={item.label} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="font-medium">{item.percent}%</span>
                        </div>
                        <Progress value={item.percent} className="h-2" />
                      </div>
                    ))}
                    <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/50 mt-3">
                      <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span className="text-xs text-amber-900 dark:text-amber-100">
                        3 need follow-up
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => toast({ title: "Review inactive", description: "Filtering to inactive relationships." })}>
                      Review Inactive
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" onClick={() => toast({ title: "Import from LinkedIn", description: "Connect your LinkedIn to import angels." })}>
                      <Linkedin className="w-4 h-4 mr-2" />
                      Import from LinkedIn
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" onClick={() => toast({ title: "Sync AngelList", description: "Syncing with AngelList." })}>
                      <Globe className="w-4 h-4 mr-2" />
                      Sync AngelList
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" onClick={() => toast({ title: "Bulk update", description: "Opening bulk update for selected angels." })}>
                      <Users className="w-4 h-4 mr-2" />
                      Bulk update relationships
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" onClick={() => { const rows = sortedInvestors.map((i) => [i.name, i.bio, i.location, formatCurrency(i.checkSizeMin), formatCurrency(i.checkSizeMax), i.relationship, i.portfolioCount]); exportToCsv({ headers: ["Name", "Bio", "Location", "Check Min", "Check Max", "Relationship", "Portfolio"], rows, filename: "angel-investors.csv" }); toast({ title: "Export started", description: "Angel list exported." }); }}>
                      <Download className="w-4 h-4 mr-2" />
                      Export angel list
                    </Button>
                  </CardContent>
                </Card>
              </aside>
            </div>

            {/* Bulk Actions Bar */}
            {selectedIds.length > 0 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                <Card className="shadow-lg border-2">
                  <CardContent className="flex items-center gap-4 p-3">
                    <span className="text-sm font-medium">
                      {selectedIds.length} selected
                    </span>
                    <div className="h-4 w-px bg-border" />
                    <Button variant="outline" size="sm" className="bg-transparent" onClick={() => toast({ title: "Send batch intro", description: `Opening composer for ${selectedIds.length} selected.` })}>
                      <Send className="w-4 h-4 mr-1.5" />
                      Send Batch Intro
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent" onClick={() => toast({ title: "Update status", description: "Opening bulk status update." })}>
                      <Users className="w-4 h-4 mr-1.5" />
                      Update Status
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent" onClick={() => { const selected = sortedInvestors.filter((i) => selectedIds.includes(i.id)); const rows = selected.map((i) => [i.name, i.bio, i.location, formatCurrency(i.checkSizeMin), formatCurrency(i.checkSizeMax), i.relationship]); exportToCsv({ headers: ["Name", "Bio", "Location", "Check Min", "Check Max", "Relationship"], rows, filename: "angel-investors-export.csv" }); toast({ title: "Export started", description: "Selected angels exported." }); }}>
                      <Download className="w-4 h-4 mr-1.5" />
                      Export
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedIds([])}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </Suspense>
  )
}

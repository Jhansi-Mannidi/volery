"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Building2,
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  Table,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  TrendingUp,
  Send,
  Eye,
  Briefcase,
  Calendar,
  Target,
  Flame,
  Star,
  ArrowUpRight,
  X,
  Download,
  Upload,
  RefreshCw,
  Wallet,
  PieChart,
  Handshake,
  UserPlus,
  Mail,
  Linkedin,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Landmark,
  Pencil,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
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
interface VCFirm {
  id: string
  name: string
  description: string
  tier: "tier1" | "tier2" | "emerging"
  activityLevel: "very-active" | "active" | "moderate" | "slow"
  fundStatus: "deploying" | "selective" | "limited" | "raising"
  sectors: string[]
  currentFund: string
  fundSize: string
  checkSize: string
  stagePreference: string
  portfolioCount: number
  recentInvestment?: {
    company: string
    amount: string
    round: string
    timeAgo: string
  }
  keyPartners: string[]
  ourContacts: {
    partners: number
    associates: number
  }
  primaryRelationship: {
    owner: string
    ownerInitials: string
    contact: string
  }
  lastInteraction: string
  interactionWarning?: boolean
  offices: string[]
  dealsPace: number
}

// Mock data
const vcFirms: VCFirm[] = [
  {
    id: "1",
    name: "Sequoia Capital India",
    description: "Leading early-stage VC in India, Consumer & Enterprise focus",
    tier: "tier1",
    activityLevel: "very-active",
    fundStatus: "deploying",
    sectors: ["Fintech", "SaaS", "Consumer"],
    currentFund: "Surge + India Fund VII",
    fundSize: "₹3,500 Cr",
    checkSize: "₹5-50 Cr",
    stagePreference: "Seed to Series B",
    portfolioCount: 180,
    recentInvestment: {
      company: "TechFlow",
      amount: "₹35Cr",
      round: "Series A",
      timeAgo: "2 weeks ago",
    },
    keyPartners: ["Shailendra Singh", "Rajan Anandan"],
    ourContacts: { partners: 3, associates: 2 },
    primaryRelationship: {
      owner: "Priya Sharma",
      ownerInitials: "PS",
      contact: "Rajan A.",
    },
    lastInteraction: "5 days ago",
    offices: ["Bangalore", "Mumbai", "Singapore"],
    dealsPace: 5,
  },
  {
    id: "2",
    name: "Accel India",
    description: "First institutional check, Consumer Tech & SaaS",
    tier: "tier1",
    activityLevel: "active",
    fundStatus: "deploying",
    sectors: ["Consumer", "SaaS", "Fintech"],
    currentFund: "Accel India VII",
    fundSize: "₹2,800 Cr",
    checkSize: "₹3-25 Cr",
    stagePreference: "Seed to Series A",
    portfolioCount: 120,
    recentInvestment: {
      company: "HealthFlow",
      amount: "₹8Cr",
      round: "Seed",
      timeAgo: "1 month ago",
    },
    keyPartners: ["Prashanth Prakash", "Barath Subramanian"],
    ourContacts: { partners: 2, associates: 1 },
    primaryRelationship: {
      owner: "Rahul Mehta",
      ownerInitials: "RM",
      contact: "Prashanth P.",
    },
    lastInteraction: "2 weeks ago",
    offices: ["Bangalore"],
    dealsPace: 4,
  },
  {
    id: "3",
    name: "Blume Ventures",
    description: "Early-stage, founder-first approach",
    tier: "tier2",
    activityLevel: "active",
    fundStatus: "selective",
    sectors: ["DeepTech", "SaaS", "Healthcare"],
    currentFund: "Blume Fund IV",
    fundSize: "₹800 Cr",
    checkSize: "₹1-10 Cr",
    stagePreference: "Pre-Seed to Seed",
    portfolioCount: 90,
    recentInvestment: {
      company: "DeepAI Labs",
      amount: "₹2.5Cr",
      round: "Pre-Seed",
      timeAgo: "3 weeks ago",
    },
    keyPartners: ["Karthik Reddy", "Sanjay Nath"],
    ourContacts: { partners: 1, associates: 2 },
    primaryRelationship: {
      owner: "Amit Patel",
      ownerInitials: "AP",
      contact: "Karthik R.",
    },
    lastInteraction: "1 month ago",
    interactionWarning: true,
    offices: ["Bangalore", "Mumbai"],
    dealsPace: 3,
  },
  {
    id: "4",
    name: "Matrix Partners India",
    description: "Growth stage, proven business models",
    tier: "tier1",
    activityLevel: "moderate",
    fundStatus: "selective",
    sectors: ["Fintech", "Consumer", "Enterprise"],
    currentFund: "Matrix India V",
    fundSize: "₹2,200 Cr",
    checkSize: "₹15-75 Cr",
    stagePreference: "Series A to Series C",
    portfolioCount: 70,
    recentInvestment: {
      company: "PayTech",
      amount: "₹65Cr",
      round: "Series B",
      timeAgo: "2 months ago",
    },
    keyPartners: ["Tarun Davda", "Vikram Vaidyanathan"],
    ourContacts: { partners: 1, associates: 0 },
    primaryRelationship: {
      owner: "Priya Sharma",
      ownerInitials: "PS",
      contact: "Tarun D.",
    },
    lastInteraction: "3 weeks ago",
    offices: ["Bangalore", "Mumbai"],
    dealsPace: 2,
  },
  {
    id: "5",
    name: "Lightspeed India",
    description: "Consumer internet and enterprise software",
    tier: "tier1",
    activityLevel: "active",
    fundStatus: "deploying",
    sectors: ["Consumer", "Enterprise", "SaaS"],
    currentFund: "Lightspeed India Partners IV",
    fundSize: "₹2,500 Cr",
    checkSize: "₹5-40 Cr",
    stagePreference: "Seed to Series B",
    portfolioCount: 85,
    recentInvestment: {
      company: "RetailTech",
      amount: "₹25Cr",
      round: "Series A",
      timeAgo: "1 week ago",
    },
    keyPartners: ["Dev Khare", "Bejul Somaia"],
    ourContacts: { partners: 2, associates: 1 },
    primaryRelationship: {
      owner: "Rahul Mehta",
      ownerInitials: "RM",
      contact: "Dev K.",
    },
    lastInteraction: "1 week ago",
    offices: ["Bangalore", "Delhi"],
    dealsPace: 3,
  },
  {
    id: "6",
    name: "Nexus Venture Partners",
    description: "Early-stage technology investments",
    tier: "tier2",
    activityLevel: "moderate",
    fundStatus: "raising",
    sectors: ["Enterprise", "Fintech", "Healthcare"],
    currentFund: "Nexus VI",
    fundSize: "₹1,500 Cr",
    checkSize: "₹3-20 Cr",
    stagePreference: "Seed to Series A",
    portfolioCount: 95,
    keyPartners: ["Jishnu Bhattacharjee", "Sameer Brij Verma"],
    ourContacts: { partners: 1, associates: 1 },
    primaryRelationship: {
      owner: "Amit Patel",
      ownerInitials: "AP",
      contact: "Jishnu B.",
    },
    lastInteraction: "2 weeks ago",
    offices: ["Bangalore", "Mumbai"],
    dealsPace: 2,
  },
  {
    id: "7",
    name: "Kalaari Capital",
    description: "Early-stage technology and consumer investments",
    tier: "tier2",
    activityLevel: "active",
    fundStatus: "deploying",
    sectors: ["Consumer", "DeepTech", "EdTech"],
    currentFund: "Kalaari V",
    fundSize: "₹1,200 Cr",
    checkSize: "₹2-15 Cr",
    stagePreference: "Seed to Series A",
    portfolioCount: 75,
    recentInvestment: {
      company: "EdFlow",
      amount: "₹10Cr",
      round: "Seed",
      timeAgo: "2 weeks ago",
    },
    keyPartners: ["Vani Kola", "Rajesh Raju"],
    ourContacts: { partners: 1, associates: 2 },
    primaryRelationship: {
      owner: "Priya Sharma",
      ownerInitials: "PS",
      contact: "Vani K.",
    },
    lastInteraction: "10 days ago",
    offices: ["Bangalore"],
    dealsPace: 3,
  },
  {
    id: "8",
    name: "3one4 Capital",
    description: "Emerging manager with founder-friendly approach",
    tier: "emerging",
    activityLevel: "active",
    fundStatus: "deploying",
    sectors: ["SaaS", "Fintech", "Consumer"],
    currentFund: "3one4 Fund III",
    fundSize: "₹600 Cr",
    checkSize: "₹1-8 Cr",
    stagePreference: "Pre-Seed to Seed",
    portfolioCount: 55,
    recentInvestment: {
      company: "CloudOps",
      amount: "₹5Cr",
      round: "Seed",
      timeAgo: "1 week ago",
    },
    keyPartners: ["Pranav Pai", "Siddarth Pai"],
    ourContacts: { partners: 2, associates: 0 },
    primaryRelationship: {
      owner: "Rahul Mehta",
      ownerInitials: "RM",
      contact: "Pranav P.",
    },
    lastInteraction: "3 days ago",
    offices: ["Bangalore"],
    dealsPace: 4,
  },
]

// Helper functions
function getActivityBadge(level: VCFirm["activityLevel"]) {
  switch (level) {
    case "very-active":
      return (
        <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400 border-orange-200 dark:border-orange-800">
          <Flame className="w-3 h-3 mr-1" />
          Very Active
        </Badge>
      )
    case "active":
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400 border-green-200 dark:border-green-800">
          <TrendingUp className="w-3 h-3 mr-1" />
          Active
        </Badge>
      )
    case "moderate":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Moderate
        </Badge>
      )
    case "slow":
      return (
        <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700">
          <Clock className="w-3 h-3 mr-1" />
          Slow
        </Badge>
      )
  }
}

function getFundStatusBadge(status: VCFirm["fundStatus"]) {
  switch (status) {
    case "deploying":
      return (
        <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Deploying
        </span>
      )
    case "selective":
      return (
        <span className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          Selective
        </span>
      )
    case "limited":
      return (
        <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          Limited
        </span>
      )
    case "raising":
      return (
        <span className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          Raising
        </span>
      )
  }
}

function getTierStars(tier: VCFirm["tier"]) {
  switch (tier) {
    case "tier1":
      return (
        <div className="flex items-center gap-0.5">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
        </div>
      )
    case "tier2":
      return (
        <div className="flex items-center gap-0.5">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <Star className="w-3 h-3 text-muted-foreground" />
        </div>
      )
    case "emerging":
      return (
        <div className="flex items-center gap-0.5">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <Star className="w-3 h-3 text-muted-foreground" />
          <Star className="w-3 h-3 text-muted-foreground" />
        </div>
      )
  }
}

function getTierBorderColor(tier: VCFirm["tier"]) {
  switch (tier) {
    case "tier1":
      return "border-l-amber-500"
    case "tier2":
      return "border-l-primary"
    case "emerging":
      return "border-l-muted-foreground"
  }
}

// Card Component
interface VCCardProps {
  vc: VCFirm
  onViewProfile: (vc: VCFirm) => void
  onSendDeal: (vc: VCFirm) => void
  onPortfolio?: (vc: VCFirm) => void
  onCoInvestors?: (vc: VCFirm) => void
  onEdit?: (vc: VCFirm) => void
  selected?: boolean
  onToggleSelect?: (id: string) => void
}

function VCCard({ vc, onViewProfile, onSendDeal, onPortfolio, onCoInvestors, onEdit, selected, onToggleSelect }: VCCardProps) {
  return (
    <Card className={`group hover:shadow-md transition-all overflow-hidden border-l-4 ${getTierBorderColor(vc.tier)}`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          {onToggleSelect && (
            <Checkbox
              checked={selected}
              onCheckedChange={() => onToggleSelect(vc.id)}
              className="mt-1 shrink-0"
            />
          )}
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Landmark className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <Link
                href={`/investors/${vc.id}`}
                className="font-medium text-foreground truncate hover:text-primary transition-colors"
              >
                {vc.name}
              </Link>
              <div className="flex items-center gap-1 shrink-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onPortfolio?.(vc)}>
                      <PieChart className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">View portfolio</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onCoInvestors?.(vc)}>
                      <Handshake className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">See co-investors</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit?.(vc)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Edit</TooltipContent>
                </Tooltip>
              </div>
            </div>
            <p className="text-xs text-muted-foreground truncate">{vc.description}</p>
          </div>
        </div>

        {/* Activity & Tier */}
        <div className="flex items-center justify-between gap-2 mt-3">
          <div className="flex items-center gap-2">
            {getActivityBadge(vc.activityLevel)}
            {getTierStars(vc.tier)}
          </div>
          {getFundStatusBadge(vc.fundStatus)}
        </div>

        {/* Sectors */}
        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          {vc.sectors.map((sector) => (
            <Badge key={sector} variant="secondary" className="text-xs font-normal">
              {sector}
            </Badge>
          ))}
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
            VC
          </Badge>
        </div>

        {/* Fund Info */}
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="w-4 h-4 shrink-0" />
            <span className="truncate">Fund: {vc.currentFund}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wallet className="w-4 h-4 shrink-0" />
            <span>Fund Size: {vc.fundSize} | Check: {vc.checkSize}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Target className="w-4 h-4 shrink-0" />
            <span>Stage: {vc.stagePreference}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <PieChart className="w-4 h-4 shrink-0" />
            <span>Portfolio: {vc.portfolioCount}+ companies</span>
          </div>
        </div>

        {/* Recent Investment */}
        {vc.recentInvestment && (
          <div className="mt-3 p-2 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-1.5 text-xs">
              <Flame className="w-3 h-3 text-orange-500" />
              <span className="text-muted-foreground">Recent:</span>
              <span className="font-medium text-foreground">
                Led {vc.recentInvestment.company} {vc.recentInvestment.round} ({vc.recentInvestment.amount})
              </span>
              <span className="text-muted-foreground">- {vc.recentInvestment.timeAgo}</span>
            </div>
          </div>
        )}

        {/* Key Partners */}
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4 shrink-0" />
          <span className="truncate">Key Partners: {vc.keyPartners.join(", ")}</span>
        </div>

        {/* Offices */}
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="truncate">Offices: {vc.offices.join(", ")}</span>
        </div>

        {/* Our Contacts & Last Interaction */}
        <div className="mt-4 pt-3 border-t flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Our Contacts:</span>
            <span className="font-medium">{vc.ourContacts.partners} partners</span>
            {vc.ourContacts.associates > 0 && (
              <span className="text-muted-foreground">+ {vc.ourContacts.associates} assoc.</span>
            )}
          </div>
          <div className={`flex items-center gap-1 text-xs ${vc.interactionWarning ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}>
            <Clock className="w-3 h-3" />
            {vc.lastInteraction}
            {vc.interactionWarning && <AlertCircle className="w-3 h-3" />}
          </div>
        </div>

        {/* Primary Relationship */}
        <div className="mt-2 flex items-center gap-2 text-sm">
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
              {vc.primaryRelationship.ownerInitials}
            </AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground">Primary:</span>
          <span className="font-medium">{vc.primaryRelationship.owner}</span>
          <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
          <span className="text-muted-foreground">{vc.primaryRelationship.contact}</span>
        </div>

        {/* Actions - only Send Deal (View Profile / Portfolio / Co-Investors are in header as icon buttons) */}
        <div className="mt-4 pt-3 border-t flex items-center gap-2">
          <Button size="sm" className="flex-1" onClick={() => onSendDeal(vc)}>
            <Send className="w-3 h-3 mr-1" />
            Send Deal
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Parse fund size string to number (Cr)
function parseFundSizeCr(s: string): number {
  const match = s.match(/₹?([\d,]+)\s*Cr/i)
  if (!match) return 0
  return parseInt(match[1].replace(/,/g, ""), 10) || 0
}

export default function VCsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<"grid" | "list" | "table">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStage, setSelectedStage] = useState("all")
  const [selectedSector, setSelectedSector] = useState("all")
  const [selectedFundSize, setSelectedFundSize] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [selectedVCs, setSelectedVCs] = useState<string[]>([])
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedVC, setSelectedVC] = useState<VCFirm | null>(null)
  const [showProfileSheet, setShowProfileSheet] = useState(false)
  const [showSendDealModal, setShowSendDealModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editVC, setEditVC] = useState<VCFirm | null>(null)

  const toggleVCSelection = (id: string) => {
    setSelectedVCs((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    )
  }

  const handleViewProfile = (vc: VCFirm) => {
    setSelectedVC(vc)
    setShowProfileSheet(true)
  }

  const handleSendDeal = (vc: VCFirm) => {
    setSelectedVC(vc)
    setShowSendDealModal(true)
  }

  const handlePortfolio = (vc: VCFirm) => {
    toast({ title: "View portfolio", description: `Opening portfolio for ${vc.name}.` })
  }

  const handleCoInvestors = (vc: VCFirm) => {
    toast({ title: "Co-investors", description: `Opening co-investors for ${vc.name}.` })
  }

  const handleEdit = (vc: VCFirm) => {
    setEditVC(vc)
    setShowEditModal(true)
  }

  const filteredVCs = useMemo(() => {
    return vcFirms.filter((vc) => {
      const matchesSearch =
        !searchQuery ||
        vc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vc.sectors.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      if (!matchesSearch) return false
      if (selectedStage !== "all") {
        const stageLower = selectedStage.replace("-", " ").toLowerCase()
        if (!vc.stagePreference.toLowerCase().includes(stageLower)) return false
      }
      if (selectedSector !== "all") {
        if (!vc.sectors.some((s) => s.toLowerCase().includes(selectedSector.toLowerCase()))) return false
      }
      if (selectedFundSize !== "all") {
        const cr = parseFundSizeCr(vc.fundSize)
        if (selectedFundSize === "micro" && cr >= 100) return false
        if (selectedFundSize === "early" && (cr < 100 || cr >= 500)) return false
        if (selectedFundSize === "mid" && (cr < 500 || cr >= 1500)) return false
        if (selectedFundSize === "large" && cr < 1500) return false
      }
      return true
    })
  }, [searchQuery, selectedStage, selectedSector, selectedFundSize])

  const sortedVCs = useMemo(() => {
    return [...filteredVCs].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "fundSize":
          return parseFundSizeCr(b.fundSize) - parseFundSizeCr(a.fundSize)
        case "lastContact":
        case "activity":
          return 0
        case "deals":
          return b.dealsPace - a.dealsPace
        default:
          return 0
      }
    })
  }, [filteredVCs, sortBy])

  // Stats from filtered list
  const totalVCs = filteredVCs.length
  const activeFunds = 35
  const dryPowder = "₹2,800 Cr"
  const dealsYTD = 45

  return (
    <div className="flex flex-col h-screen bg-background">
      <Toaster />
      <DashboardHeader title="VCs" />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/role-selection" className="hover:text-foreground">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/investors" className="hover:text-foreground">Investors</Link>
            <ChevronRight className="w-4 h-4" />
            <span>By Type</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">VCs</span>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold text-foreground">Venture Capital</h1>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    <Landmark className="w-3 h-3 mr-1" />
                    VC
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {totalVCs} VC firms in your network
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
                  <Table className="w-4 h-4" />
                </Button>
              </div>
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="fundSize">Fund Size</SelectItem>
                  <SelectItem value="lastContact">Last Contact</SelectItem>
                  <SelectItem value="activity">Recent Activity</SelectItem>
                  <SelectItem value="deals">Deals Pace</SelectItem>
                </SelectContent>
              </Select>
              {/* Filter */}
              <Button variant="outline" size="sm" onClick={() => setShowAdvancedFilters(true)}>
                <Filter className="w-4 h-4 mr-1" />
                Filters
              </Button>
              {/* Add VC */}
              <Button size="sm" className="bg-primary text-primary-foreground" onClick={() => toast({ title: "Add VC", description: "Opening add VC form." })}>
                <Plus className="w-4 h-4 mr-1" />
                Add VC
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">VC Firms</p>
                    <p className="text-2xl font-bold">{totalVCs}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Landmark className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Funds</p>
                    <p className="text-2xl font-bold">{activeFunds}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Dry Powder</p>
                    <p className="text-2xl font-bold">{dryPowder}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-950/50 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Deals YTD</p>
                    <p className="text-2xl font-bold">{dealsYTD}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Bar - single entry: Search + Filters (sheet) */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search VCs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedVCs.length > 0 && (
            <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {selectedVCs.length} VC{selectedVCs.length > 1 ? "s" : ""} selected
              </span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="bg-transparent" onClick={() => toast({ title: "Send batch intro", description: `Opening composer for ${selectedVCs.length} selected.` })}>
                  <Send className="w-3 h-3 mr-1" />
                  Send Batch Intro
                </Button>
                <Button size="sm" variant="outline" className="bg-transparent" onClick={() => { const rows = sortedVCs.filter((v) => selectedVCs.includes(v.id)).map((v) => [v.name, v.fundSize, v.checkSize, v.stagePreference, v.portfolioCount]); exportToCsv({ headers: ["Name", "Fund Size", "Check Size", "Stage", "Portfolio"], rows, filename: "vc-export.csv" }); toast({ title: "Export started", description: "Selected VCs exported." }); }}>
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelectedVCs([])}>
                  <X className="w-3 h-3 mr-1" />
                  Clear
                </Button>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex gap-6">
            {/* Cards Grid */}
            <div className="flex-1">
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {sortedVCs.map((vc) => (
                    <VCCard
                      key={vc.id}
                      vc={vc}
                      onViewProfile={handleViewProfile}
                      onSendDeal={handleSendDeal}
                      onPortfolio={handlePortfolio}
                      onCoInvestors={handleCoInvestors}
                      onEdit={handleEdit}
                      selected={selectedVCs.includes(vc.id)}
                      onToggleSelect={toggleVCSelection}
                    />
                  ))}
                </div>
              )}

              {viewMode === "list" && (
                <div className="space-y-3">
                  {sortedVCs.map((vc) => (
                    <Card key={vc.id} className={`hover:shadow-md transition-all overflow-hidden border-l-4 ${getTierBorderColor(vc.tier)}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Checkbox
                            checked={selectedVCs.includes(vc.id)}
                            onCheckedChange={() => toggleVCSelection(vc.id)}
                          />
                          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                            <Landmark className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Link href={`/investors/${vc.id}`} className="font-medium hover:text-primary">
                                {vc.name}
                              </Link>
                              {getActivityBadge(vc.activityLevel)}
                              {getTierStars(vc.tier)}
                              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                                VC
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{vc.description}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-medium">{vc.fundSize}</p>
                            <p className="text-xs text-muted-foreground">Check: {vc.checkSize}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm">{vc.portfolioCount}+ companies</p>
                            {getFundStatusBadge(vc.fundStatus)}
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm text-muted-foreground">{vc.lastInteraction}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewProfile(vc)}>
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" onClick={() => handleSendDeal(vc)}>
                              <Send className="w-3 h-3" />
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
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b bg-muted/50">
                        <tr>
                          <th className="p-3 text-left w-8">
                            <Checkbox
                              checked={selectedVCs.length === sortedVCs.length}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedVCs(sortedVCs.map((v) => v.id))
                                } else {
                                  setSelectedVCs([])
                                }
                              }}
                            />
                          </th>
                          <th className="p-3 text-left text-sm font-medium text-muted-foreground">VC Firm</th>
                          <th className="p-3 text-left text-sm font-medium text-muted-foreground">Tier</th>
                          <th className="p-3 text-left text-sm font-medium text-muted-foreground">Activity</th>
                          <th className="p-3 text-left text-sm font-medium text-muted-foreground">Fund Size</th>
                          <th className="p-3 text-left text-sm font-medium text-muted-foreground">Check Size</th>
                          <th className="p-3 text-left text-sm font-medium text-muted-foreground">Stage</th>
                          <th className="p-3 text-left text-sm font-medium text-muted-foreground">Portfolio</th>
                          <th className="p-3 text-left text-sm font-medium text-muted-foreground">Last Contact</th>
                          <th className="p-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedVCs.map((vc) => (
                          <tr key={vc.id} className="border-b hover:bg-muted/30">
                            <td className="p-3">
                              <Checkbox
                                checked={selectedVCs.includes(vc.id)}
                                onCheckedChange={() => toggleVCSelection(vc.id)}
                              />
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                                  <Landmark className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                  <Link href={`/investors/${vc.id}`} className="font-medium hover:text-primary">
                                    {vc.name}
                                  </Link>
                                  <p className="text-xs text-muted-foreground">{vc.sectors.join(", ")}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">{getTierStars(vc.tier)}</td>
                            <td className="p-3">{getActivityBadge(vc.activityLevel)}</td>
                            <td className="p-3 text-sm">{vc.fundSize}</td>
                            <td className="p-3 text-sm">{vc.checkSize}</td>
                            <td className="p-3 text-sm">{vc.stagePreference}</td>
                            <td className="p-3 text-sm">{vc.portfolioCount}+</td>
                            <td className="p-3 text-sm">
                              <span className={vc.interactionWarning ? "text-amber-600" : ""}>
                                {vc.lastInteraction}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1">
                                <Button size="sm" variant="ghost" onClick={() => handleViewProfile(vc)}>
                                  <Eye className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleSendDeal(vc)}>
                                  <Send className="w-3 h-3" />
                                </Button>
                              </div>
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
            <div className="hidden xl:block w-80 shrink-0 space-y-4">
              {/* VC Network Overview */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">VC Network Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total VC firms</span>
                    <span className="font-medium">{totalVCs}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active funds</span>
                    <span className="font-medium">{activeFunds}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Combined dry powder</span>
                    <span className="font-medium">{dryPowder}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg deal pace</span>
                    <span className="font-medium">3.2/quarter</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent" onClick={() => router.push("/analytics")}>
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              {/* Top Active VCs */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Top Active VCs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                        <Landmark className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm">Sequoia</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">5 deals</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                        <Landmark className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm">Accel</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">4 deals</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                        <Landmark className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm">Lightspeed</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">3 deals</Badge>
                  </div>
                  <Button variant="link" size="sm" className="w-full p-0 h-auto text-primary" onClick={() => toast({ title: "See Full Activity", description: "Opening full VC activity view." })}>
                    See Full Activity
                  </Button>
                </CardContent>
              </Card>

              {/* Our Deal Activity */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Our Deal Activity with VCs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Intros sent</span>
                    <span className="font-medium">12 this month</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Meetings set</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">In Due Diligence</span>
                    <span className="font-medium">4</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Term sheets</span>
                    <span className="font-medium text-green-600">1</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent" onClick={() => router.push("/pipeline")}>
                    View Pipeline
                  </Button>
                </CardContent>
              </Card>

              {/* Fund Updates */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Fund Updates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/50">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Blume: Fund IV fully deployed</p>
                      <p className="text-xs text-amber-700/80 dark:text-amber-300/70">Very selective now</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800/50">
                    <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Nexus: Raising Fund VI</p>
                      <p className="text-xs text-blue-700/80 dark:text-blue-300/70">New fund expected Q2</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg">
                    <UserPlus className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Peak XV: New partner joined</p>
                      <p className="text-xs text-muted-foreground">Shailesh Rao from Google</p>
                    </div>
                  </div>
                  <Button variant="link" size="sm" className="w-full p-0 h-auto" onClick={() => toast({ title: "View All Updates", description: "Opening fund updates." })}>
                    View All Updates
                  </Button>
                </CardContent>
              </Card>

              {/* Co-Investment Insights */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Co-Investment Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground">Most frequent co-investors:</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Sequoia + Accel</span>
                      <Badge variant="secondary" className="text-xs">12 deals</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Matrix + Lightspeed</span>
                      <Badge variant="secondary" className="text-xs">8 deals</Badge>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Our success rate</span>
                      <span className="font-medium text-green-600">28%</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent" onClick={() => toast({ title: "View Co-Invest Map", description: "Opening co-invest map." })}>
                    View Co-Invest Map
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" onClick={() => toast({ title: "Import from Crunchbase", description: "Connecting to Crunchbase." })}>
                    <Upload className="w-4 h-4 mr-2" />
                    Import from Crunchbase
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" onClick={() => toast({ title: "Sync Fund Data", description: "Syncing fund data." })}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Fund Data
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" onClick={() => { const rows = sortedVCs.map((v) => [v.name, v.fundSize, v.checkSize, v.stagePreference, v.sectors.join(", ")]); exportToCsv({ headers: ["Name", "Fund Size", "Check Size", "Stage", "Sectors"], rows, filename: "vc-list.csv" }); toast({ title: "Export started", description: "VC list exported." }); }}>
                    <Download className="w-4 h-4 mr-2" />
                    Export VC List
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* View Profile Sheet */}
      <Sheet open={showProfileSheet} onOpenChange={setShowProfileSheet}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-8">
          {selectedVC && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Landmark className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <SheetTitle>{selectedVC.name}</SheetTitle>
                    <SheetDescription>{selectedVC.description}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <Tabs defaultValue="overview" className="mt-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4 space-y-4">
                  <div className="flex items-center gap-2">
                    {getActivityBadge(selectedVC.activityLevel)}
                    {getTierStars(selectedVC.tier)}
                    {getFundStatusBadge(selectedVC.fundStatus)}
                  </div>

                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <h4 className="font-medium">Fund Details</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Current Fund</p>
                          <p className="font-medium">{selectedVC.currentFund}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Fund Size</p>
                          <p className="font-medium">{selectedVC.fundSize}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Check Size</p>
                          <p className="font-medium">{selectedVC.checkSize}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Stage Focus</p>
                          <p className="font-medium">{selectedVC.stagePreference}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <h4 className="font-medium">Sectors</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedVC.sectors.map((sector) => (
                          <Badge key={sector} variant="secondary">{sector}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <h4 className="font-medium">Offices</h4>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        {selectedVC.offices.join(", ")}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="portfolio" className="mt-4 space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Portfolio Companies</h4>
                        <Badge variant="secondary">{selectedVC.portfolioCount}+ companies</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        View full portfolio to see overlap with your pipeline and identify potential conflicts.
                      </p>
                      <Button variant="outline" className="w-full mt-4 bg-transparent" onClick={() => toast({ title: "View Full Portfolio", description: `Opening portfolio for ${selectedVC.name}.` })}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Full Portfolio
                      </Button>
                    </CardContent>
                  </Card>

                  {selectedVC.recentInvestment && (
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-3">Recent Investment</h4>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-950/50 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{selectedVC.recentInvestment.company}</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedVC.recentInvestment.round} - {selectedVC.recentInvestment.amount}
                            </p>
                          </div>
                          <span className="ml-auto text-xs text-muted-foreground">
                            {selectedVC.recentInvestment.timeAgo}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="team" className="mt-4 space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">Key Partners</h4>
                      <div className="space-y-3">
                        {selectedVC.keyPartners.map((partner) => (
                          <div key={partner} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{partner.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{partner}</p>
                                <p className="text-xs text-muted-foreground">Partner</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({ title: "LinkedIn", description: `Opening LinkedIn for ${partner}.` })}>
                                <Linkedin className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({ title: "Send email", description: `Opening composer for ${partner}.` })}>
                                <Mail className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">Our Contacts</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Partners</span>
                        <span className="font-medium">{selectedVC.ourContacts.partners}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-muted-foreground">Associates</span>
                        <span className="font-medium">{selectedVC.ourContacts.associates}</span>
                      </div>
                      <div className="mt-4 pt-3 border-t">
                        <p className="text-sm text-muted-foreground">Primary Relationship</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{selectedVC.primaryRelationship.ownerInitials}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{selectedVC.primaryRelationship.owner}</span>
                          <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{selectedVC.primaryRelationship.contact}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity" className="mt-4 space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">Recent Activity</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-2 bg-muted/50 rounded-lg">
                          <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm">Last interaction: {selectedVC.lastInteraction}</p>
                            {selectedVC.interactionWarning && (
                              <p className="text-xs text-amber-600">Follow-up recommended</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-2 bg-muted/50 rounded-lg">
                          <TrendingUp className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm">Deal pace: {selectedVC.dealsPace} deals/quarter</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex gap-3">
                <Button className="flex-1" onClick={() => {
                  setShowProfileSheet(false)
                  handleSendDeal(selectedVC)
                }}>
                  <Send className="w-4 h-4 mr-2" />
                  Send Deal
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Send Deal Modal */}
      <Dialog open={showSendDealModal} onOpenChange={setShowSendDealModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Deal to {selectedVC?.name}</DialogTitle>
            <DialogDescription>
              Select a startup from your pipeline to send for consideration
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Startup</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a startup..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="techflow">TechFlow - Series A</SelectItem>
                  <SelectItem value="healthbridge">HealthBridge - Seed</SelectItem>
                  <SelectItem value="eduspark">EduSpark - Pre-Seed</SelectItem>
                  <SelectItem value="finwise">FinWise - Series A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact at {selectedVC?.name}</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select contact..." />
                </SelectTrigger>
                <SelectContent>
                  {selectedVC?.keyPartners.map((partner) => (
                    <SelectItem key={partner} value={partner.toLowerCase().replace(" ", "-")}>
                      {partner}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message (optional)</label>
              <textarea
                className="w-full min-h-[100px] p-3 border rounded-lg bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Add a personal note..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendDealModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => { setShowSendDealModal(false); toast({ title: "Deal sent", description: `Introduction sent to ${selectedVC?.name}.` }); }}>
              <Send className="w-4 h-4 mr-2" />
              Send Introduction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit VC Modal */}
      <Dialog open={showEditModal} onOpenChange={(open) => { setShowEditModal(open); if (!open) setEditVC(null); }}>
        <DialogContent className="sm:max-w-lg" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Edit VC</DialogTitle>
            <DialogDescription>
              Update details for {editVC?.name}. Changes will be saved to your investor database.
            </DialogDescription>
          </DialogHeader>
          {editVC && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-vc-name">Firm name</Label>
                <Input id="edit-vc-name" defaultValue={editVC.name} className="w-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-vc-desc">Description</Label>
                <Input id="edit-vc-desc" defaultValue={editVC.description} className="w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-vc-fund">Fund size</Label>
                  <Input id="edit-vc-fund" defaultValue={editVC.fundSize} className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-vc-check">Check size</Label>
                  <Input id="edit-vc-check" defaultValue={editVC.checkSize} className="w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-vc-stage">Stage preference</Label>
                <Input id="edit-vc-stage" defaultValue={editVC.stagePreference} className="w-full" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowEditModal(false); setEditVC(null); }}>
              Cancel
            </Button>
            <Button onClick={() => { setShowEditModal(false); setEditVC(null); toast({ title: "VC updated", description: `${editVC?.name} has been updated.` }); }}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filters Sheet - single source for Stage, Sector, Fund Size + advanced */}
      <Sheet open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto p-8">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Filter VCs by stage, sector, fund size and more</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Stage</Label>
              <Select value={selectedStage} onValueChange={setSelectedStage}>
                <SelectTrigger>
                  <SelectValue placeholder="All Stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                  <SelectItem value="seed">Seed</SelectItem>
                  <SelectItem value="series-a">Series A</SelectItem>
                  <SelectItem value="series-b">Series B</SelectItem>
                  <SelectItem value="growth">Growth</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Sector</Label>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger>
                  <SelectValue placeholder="All Sectors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  <SelectItem value="generalist">Generalist</SelectItem>
                  <SelectItem value="fintech">Fintech</SelectItem>
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="consumer">Consumer</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="deeptech">DeepTech</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Fund Size</Label>
              <Select value={selectedFundSize} onValueChange={setSelectedFundSize}>
                <SelectTrigger>
                  <SelectValue placeholder="All Sizes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="micro">Micro (&lt;₹100Cr)</SelectItem>
                  <SelectItem value="early">Early (₹100-500Cr)</SelectItem>
                  <SelectItem value="mid">Mid (₹500-1500Cr)</SelectItem>
                  <SelectItem value="large">Large (₹1500Cr+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="border-t pt-4 space-y-2">
              <Label className="text-sm font-medium">Geographic Focus</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select region..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="sea">SEA</SelectItem>
                  <SelectItem value="global">Global</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Investment Pace</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select pace..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="slow">Slow</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Lead/Follow Preference</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select preference..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Leads Only</SelectItem>
                  <SelectItem value="follow">Follows Only</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Fund Vintage</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select vintage..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023+">2023+</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="older">Older</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">VC Tier</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <Checkbox />
                  <span className="text-sm">Tier 1</span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox />
                  <span className="text-sm">Tier 2</span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox />
                  <span className="text-sm">Emerging</span>
                </label>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => { setSelectedStage("all"); setSelectedSector("all"); setSelectedFundSize("all"); setShowAdvancedFilters(false); toast({ title: "Filters cleared", description: "All filters reset." }); }}>
              Clear All
            </Button>
            <Button className="flex-1" onClick={() => { setShowAdvancedFilters(false); toast({ title: "Filters applied", description: "Filters updated." }); }}>
              Apply Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

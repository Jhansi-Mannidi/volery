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
  MapPin,
  Calendar,
  Clock,
  Users,
  TrendingUp,
  Target,
  Briefcase,
  Phone,
  Mail,
  Linkedin,
  ExternalLink,
  Star,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  Factory,
  Handshake,
  FileText,
  BarChart3,
  X,
  ChevronDown,
  Shield,
  Zap,
  Globe,
  Gift,
  Building,
  IndianRupee,
  Layers,
  Network,
  CalendarDays,
  Timer,
  Pencil,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
interface CorporateInvestor {
  id: string
  name: string
  description: string
  logo?: string
  parentCompany: string
  parentMetrics: string
  industry: string[]
  investmentType: "cvc" | "strategic" | "partnership" | "ma"
  status: "active_cvc" | "strategic_only" | "ma_focus" | "paused"
  cvcFundSize?: string
  checkSizeMin: number
  checkSizeMax: number
  stageFocus: string[]
  strategicFocus: string[]
  portfolio: number
  valueAdd: string[]
  investmentProcess: string
  currentInterest: string
  keyContact: {
    name: string
    title: string
    email?: string
    linkedin?: string
  }
  relationshipOwner: {
    name: string
    initials: string
    avatar?: string
  }
  lastContact: string
  lastContactDays: number
  location: string
  riskLevel: "low" | "medium" | "high"
}

// Mock data
const corporateInvestors: CorporateInvestor[] = [
  {
    id: "1",
    name: "HDFC Bank Ventures",
    description: "Strategic investments in Fintech by India's largest private bank",
    parentCompany: "HDFC Bank",
    parentMetrics: "₹18 Lakh Cr market cap, 6,500+ branches",
    industry: ["Banking", "Fintech", "Payments"],
    investmentType: "cvc",
    status: "active_cvc",
    cvcFundSize: "₹500 Cr",
    checkSizeMin: 10,
    checkSizeMax: 50,
    stageFocus: ["Series A", "Series B", "Series C"],
    strategicFocus: ["Payments", "Lending Tech", "Wealth Tech"],
    portfolio: 8,
    valueAdd: ["API Integration", "Distribution access", "Regulatory expertise"],
    investmentProcess: "12-16 weeks, requires Board approval",
    currentInterest: "Looking for LendingTech startups",
    keyContact: {
      name: "Sanjay Verma",
      title: "VP Strategy",
      email: "sanjay.v@hdfcbank.com",
      linkedin: "sanjayverma",
    },
    relationshipOwner: {
      name: "Rahul Mehta",
      initials: "RM",
    },
    lastContact: "2 weeks ago",
    lastContactDays: 14,
    location: "Mumbai, India",
    riskLevel: "low",
  },
  {
    id: "2",
    name: "Reliance Jio Ventures",
    description: "Strategic investments in digital ecosystem companies",
    parentCompany: "Reliance Jio",
    parentMetrics: "450M subscribers, ₹2.5 Lakh Cr revenue",
    industry: ["Telecom", "Digital Services", "Content"],
    investmentType: "strategic",
    status: "active_cvc",
    cvcFundSize: "₹2,000 Cr+",
    checkSizeMin: 50,
    checkSizeMax: 500,
    stageFocus: ["Series B", "Series C", "Growth"],
    strategicFocus: ["5G applications", "IoT", "Content", "Gaming"],
    portfolio: 15,
    valueAdd: ["Distribution (450M users)", "Telecom infra", "Cross-sell"],
    investmentProcess: "8-12 weeks, fast for strategic fits",
    currentInterest: "5G enterprise solutions",
    keyContact: {
      name: "Akash Ambani",
      title: "Chairman, Jio",
      linkedin: "akashambani",
    },
    relationshipOwner: {
      name: "Priya Sharma",
      initials: "PS",
    },
    lastContact: "1 month ago",
    lastContactDays: 30,
    location: "Mumbai, India",
    riskLevel: "medium",
  },
  {
    id: "3",
    name: "Infosys Innovation Fund",
    description: "CVC arm investing in enterprise technology startups",
    parentCompany: "Infosys Ltd",
    parentMetrics: "$18B revenue, 350K employees",
    industry: ["IT Services", "Consulting", "Technology"],
    investmentType: "cvc",
    status: "active_cvc",
    cvcFundSize: "₹1,250 Cr ($150M)",
    checkSizeMin: 5,
    checkSizeMax: 25,
    stageFocus: ["Seed", "Series A", "Series B"],
    strategicFocus: ["AI/ML", "Cloud", "Enterprise SaaS", "Cybersecurity"],
    portfolio: 25,
    valueAdd: ["Enterprise sales channel", "Technology expertise", "POC opportunities"],
    investmentProcess: "10-14 weeks, tech validation required",
    currentInterest: "AI/ML tools for enterprise",
    keyContact: {
      name: "Pradeep Kumar",
      title: "VP Innovation",
      email: "pradeep.k@infosys.com",
    },
    relationshipOwner: {
      name: "Amit Patel",
      initials: "AP",
    },
    lastContact: "3 weeks ago",
    lastContactDays: 21,
    location: "Bangalore, India",
    riskLevel: "low",
  },
  {
    id: "4",
    name: "Tata Digital",
    description: "Strategic investments for Tata's digital transformation",
    parentCompany: "Tata Group",
    parentMetrics: "$150B group revenue, multiple sectors",
    industry: ["Conglomerate", "Digital Commerce", "Consumer"],
    investmentType: "strategic",
    status: "strategic_only",
    checkSizeMin: 100,
    checkSizeMax: 1000,
    stageFocus: ["Series C", "Growth", "Pre-IPO"],
    strategicFocus: ["Super app ecosystem", "Digital commerce", "Health", "EdTech"],
    portfolio: 12,
    valueAdd: ["Group synergies", "Brand credibility", "Distribution"],
    investmentProcess: "16-24 weeks (extensive DD)",
    currentInterest: "Digital health, EdTech platforms",
    keyContact: {
      name: "Pratik Pal",
      title: "CEO, Tata Digital",
      linkedin: "pratikpal",
    },
    relationshipOwner: {
      name: "Priya Sharma",
      initials: "PS",
    },
    lastContact: "6 weeks ago",
    lastContactDays: 42,
    location: "Mumbai, India",
    riskLevel: "high",
  },
  {
    id: "5",
    name: "Mahindra Partners",
    description: "Strategic venture arm of Mahindra Group",
    parentCompany: "Mahindra & Mahindra",
    parentMetrics: "₹1.2 Lakh Cr revenue, auto & farm equipment leader",
    industry: ["Automotive", "Farm Equipment", "Technology"],
    investmentType: "cvc",
    status: "active_cvc",
    cvcFundSize: "₹800 Cr",
    checkSizeMin: 15,
    checkSizeMax: 75,
    stageFocus: ["Series A", "Series B"],
    strategicFocus: ["EV Tech", "AgriTech", "Logistics", "Clean Energy"],
    portfolio: 18,
    valueAdd: ["Manufacturing expertise", "Rural distribution", "Testing facilities"],
    investmentProcess: "10-14 weeks",
    currentInterest: "EV charging infrastructure",
    keyContact: {
      name: "Rajesh Gupta",
      title: "Head of Ventures",
      email: "rajesh.gupta@mahindra.com",
    },
    relationshipOwner: {
      name: "Amit Patel",
      initials: "AP",
    },
    lastContact: "1 week ago",
    lastContactDays: 7,
    location: "Mumbai, India",
    riskLevel: "low",
  },
  {
    id: "6",
    name: "Airtel Startup Accelerator",
    description: "Strategic investments and partnerships in telecom adjacencies",
    parentCompany: "Bharti Airtel",
    parentMetrics: "350M subscribers, ₹1.4 Lakh Cr revenue",
    industry: ["Telecom", "Digital Services", "Enterprise"],
    investmentType: "partnership",
    status: "active_cvc",
    cvcFundSize: "₹400 Cr",
    checkSizeMin: 5,
    checkSizeMax: 40,
    stageFocus: ["Seed", "Series A", "Series B"],
    strategicFocus: ["Enterprise solutions", "Cybersecurity", "Cloud", "IoT"],
    portfolio: 10,
    valueAdd: ["Enterprise customers", "Network infrastructure", "Go-to-market"],
    investmentProcess: "8-12 weeks",
    currentInterest: "Enterprise security solutions",
    keyContact: {
      name: "Harmeen Mehta",
      title: "CTO & Head of Digital",
      linkedin: "harmeenmehta",
    },
    relationshipOwner: {
      name: "Rahul Mehta",
      initials: "RM",
    },
    lastContact: "2 weeks ago",
    lastContactDays: 14,
    location: "New Delhi, India",
    riskLevel: "low",
  },
  {
    id: "7",
    name: "Godrej Consumer Ventures",
    description: "Strategic investments in D2C and consumer tech",
    parentCompany: "Godrej Consumer Products",
    parentMetrics: "₹14,000 Cr revenue, leading FMCG company",
    industry: ["FMCG", "Consumer", "D2C"],
    investmentType: "strategic",
    status: "ma_focus",
    checkSizeMin: 25,
    checkSizeMax: 150,
    stageFocus: ["Series B", "Series C"],
    strategicFocus: ["D2C brands", "Personal care", "Home care", "E-commerce"],
    portfolio: 6,
    valueAdd: ["Manufacturing", "Distribution", "Brand building", "R&D"],
    investmentProcess: "14-18 weeks, M&A team involved",
    currentInterest: "Premium D2C personal care brands",
    keyContact: {
      name: "Nisaba Godrej",
      title: "Executive Chairperson",
      linkedin: "nisabagodrej",
    },
    relationshipOwner: {
      name: "Priya Sharma",
      initials: "PS",
    },
    lastContact: "4 weeks ago",
    lastContactDays: 28,
    location: "Mumbai, India",
    riskLevel: "medium",
  },
]

// Helper functions
function getStatusBadge(status: CorporateInvestor["status"]) {
  switch (status) {
    case "active_cvc":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
          <Target className="w-3 h-3 mr-1" />
          Active CVC
        </Badge>
      )
    case "strategic_only":
      return (
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0">
          <BarChart3 className="w-3 h-3 mr-1" />
          Strategic Only
        </Badge>
      )
    case "ma_focus":
      return (
        <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-0">
          <Building2 className="w-3 h-3 mr-1" />
          M&A Focus
        </Badge>
      )
    case "paused":
      return (
        <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-0">
          <Clock className="w-3 h-3 mr-1" />
          Paused
        </Badge>
      )
  }
}

function getInvestmentTypeBadge(type: CorporateInvestor["investmentType"]) {
  switch (type) {
    case "cvc":
      return (
        <Badge variant="outline" className="text-xs border-primary/30 text-primary">
          <Target className="w-3 h-3 mr-1" />
          CVC
        </Badge>
      )
    case "strategic":
      return (
        <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-600 dark:text-blue-400">
          <BarChart3 className="w-3 h-3 mr-1" />
          Strategic
        </Badge>
      )
    case "partnership":
      return (
        <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-600 dark:text-amber-400">
          <Handshake className="w-3 h-3 mr-1" />
          Partnership
        </Badge>
      )
    case "ma":
      return (
        <Badge variant="outline" className="text-xs border-muted-foreground/30 text-muted-foreground">
          <Building className="w-3 h-3 mr-1" />
          M&A
        </Badge>
      )
  }
}

function getRiskIndicator(risk: CorporateInvestor["riskLevel"]) {
  switch (risk) {
    case "low":
      return (
        <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          Fast & Founder-friendly
        </div>
      )
    case "medium":
      return (
        <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          Standard process
        </div>
      )
    case "high":
      return (
        <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          Complex terms
        </div>
      )
  }
}

function getContactWarning(days: number) {
  if (days > 30) {
    return (
      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
        <AlertCircle className="w-3 h-3" />
        {days > 7 ? `${Math.floor(days / 7)} weeks ago` : `${days} days ago`}
      </span>
    )
  }
  return <span className="text-muted-foreground">{days > 7 ? `${Math.floor(days / 7)} weeks ago` : `${days} days ago`}</span>
}

// Card Component
interface CorporateCardProps {
  corporate: CorporateInvestor
  onViewProfile: (corporate: CorporateInvestor) => void
  onSendStartup: (corporate: CorporateInvestor) => void
  onStrategicFit: (corporate: CorporateInvestor) => void
  onEdit: (corporate: CorporateInvestor) => void
  onSendEmail: (corporate: CorporateInvestor) => void
  selected?: boolean
  onToggleSelect?: (id: string) => void
}

function CorporateCard({ corporate, onViewProfile, onSendStartup, onStrategicFit, onEdit, onSendEmail, selected, onToggleSelect }: CorporateCardProps) {
  return (
    <Card className="group hover:shadow-md transition-all overflow-hidden border-l-4 border-l-primary">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          {onToggleSelect && (
            <Checkbox
              checked={selected}
              onCheckedChange={() => onToggleSelect(corporate.id)}
              className="mt-1 shrink-0"
            />
          )}
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Factory className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <Link
                href={`/investors/${corporate.id}`}
                className="font-medium text-foreground truncate hover:text-primary transition-colors"
              >
                {corporate.name}
              </Link>
              <div className="flex items-center gap-0.5 shrink-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onSendEmail(corporate)}>
                      <Mail className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Send Email</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onStrategicFit(corporate)}>
                      <Target className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Strategic Fit Analysis</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(corporate)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit</TooltipContent>
                </Tooltip>
              </div>
            </div>
            <p className="text-xs text-muted-foreground truncate">{corporate.description}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {getStatusBadge(corporate.status)}
          {getInvestmentTypeBadge(corporate.investmentType)}
        </div>

        {/* Industry Badges */}
        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          {corporate.industry.slice(0, 3).map((ind) => (
            <Badge key={ind} variant="secondary" className="text-xs">
              {ind}
            </Badge>
          ))}
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
            Corporate
          </Badge>
        </div>

        {/* Parent Company */}
        <div className="mt-3 p-2 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <Building className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="font-medium truncate">{corporate.parentCompany}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 truncate">{corporate.parentMetrics}</p>
        </div>

        {/* Investment Details */}
        <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Check Size</p>
            <p className="font-medium">₹{corporate.checkSizeMin}-{corporate.checkSizeMax} Cr</p>
          </div>
          {corporate.cvcFundSize && (
            <div>
              <p className="text-xs text-muted-foreground">Fund Size</p>
              <p className="font-medium truncate">{corporate.cvcFundSize}</p>
            </div>
          )}
        </div>

        {/* Strategic Focus */}
        <div className="mt-3">
          <p className="text-xs text-muted-foreground mb-1">Strategic Focus</p>
          <div className="flex flex-wrap gap-1">
            {corporate.strategicFocus.slice(0, 3).map((focus) => (
              <Badge key={focus} variant="outline" className="text-xs">
                {focus}
              </Badge>
            ))}
            {corporate.strategicFocus.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{corporate.strategicFocus.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Value Add */}
        <div className="mt-3">
          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <Gift className="w-3 h-3" />
            Value-Add
          </p>
          <p className="text-xs text-foreground truncate">{corporate.valueAdd.join(", ")}</p>
        </div>

        {/* Current Interest */}
        <div className="mt-3 p-2 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-xs text-primary flex items-center gap-1">
            <Target className="w-3 h-3" />
            {corporate.currentInterest}
          </p>
        </div>

        {/* Process & Risk */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Timer className="w-3 h-3" />
            <span className="truncate">{corporate.investmentProcess.split(",")[0]}</span>
          </div>
          {getRiskIndicator(corporate.riskLevel)}
        </div>

        <Separator className="my-3" />

        {/* Contact Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="h-6 w-6 shrink-0">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {corporate.relationshipOwner.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">
                {corporate.relationshipOwner.name} → {corporate.keyContact.name}
              </p>
            </div>
          </div>
          <div className="text-xs shrink-0">
            {getContactWarning(corporate.lastContactDays)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
          <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent" onClick={() => onViewProfile(corporate)}>
            View Profile
          </Button>
          <Button size="sm" className="flex-1 text-xs" onClick={() => onSendStartup(corporate)}>
            Send Startup
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Main Component
export default function CorporateInvestorsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list" | "table">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [strategicFilter, setStrategicFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [selectedCorporates, setSelectedCorporates] = useState<string[]>([])
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedCorporate, setSelectedCorporate] = useState<CorporateInvestor | null>(null)
  const [showProfileSheet, setShowProfileSheet] = useState(false)
  const [showSendStartupModal, setShowSendStartupModal] = useState(false)
  const [showStrategicFitSheet, setShowStrategicFitSheet] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [corporates, setCorporates] = useState<CorporateInvestor[]>(corporateInvestors)
  const router = useRouter()
  const { toast } = useToast()

  const filteredCorporates = corporates.filter((corporate) => {
    if (searchQuery && !corporate.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (industryFilter !== "all" && !corporate.industry.some(i => i.toLowerCase().includes(industryFilter.toLowerCase()))) {
      return false
    }
    if (statusFilter !== "all" && corporate.status !== statusFilter) {
      return false
    }
    if (strategicFilter !== "all" && !corporate.strategicFocus.some(f => f.toLowerCase().includes(strategicFilter.toLowerCase()))) {
      return false
    }
    return true
  })

  const sortedCorporates = useMemo(() => {
    const list = [...filteredCorporates]
    switch (sortBy) {
      case "name":
        return list.sort((a, b) => a.name.localeCompare(b.name))
      case "parent_size":
        return list.sort((a, b) => (b.cvcFundSize ? 1 : 0) - (a.cvcFundSize ? 1 : 0))
      case "last_contact":
        return list.sort((a, b) => a.lastContactDays - b.lastContactDays)
      case "strategic_fit":
      case "activity":
        return list
      default:
        return list
    }
  }, [filteredCorporates, sortBy])

  const toggleSelect = (id: string) => {
    setSelectedCorporates((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleViewProfile = (corporate: CorporateInvestor) => {
    setSelectedCorporate(corporate)
    setShowProfileSheet(true)
  }

  const handleSendStartup = (corporate: CorporateInvestor) => {
    setSelectedCorporate(corporate)
    setShowSendStartupModal(true)
  }

  const handleStrategicFit = (corporate: CorporateInvestor) => {
    setSelectedCorporate(corporate)
    setShowStrategicFitSheet(true)
  }

  const handleEdit = (corporate: CorporateInvestor) => {
    setSelectedCorporate(corporate)
    setShowEditModal(true)
  }

  const handleSendEmail = (corporate: CorporateInvestor) => {
    toast({ title: "Send Email", description: `Opening email to ${corporate.keyContact.name}.` })
  }

  const initialAddForm = {
    name: "",
    description: "",
    parentCompany: "",
    parentMetrics: "",
    industry: "",
    investmentType: "cvc" as CorporateInvestor["investmentType"],
    status: "active_cvc" as CorporateInvestor["status"],
    checkSizeMin: 0,
    checkSizeMax: 0,
    cvcFundSize: "",
    currentInterest: "",
    keyContactName: "",
    keyContactTitle: "",
    keyContactEmail: "",
    location: "",
  }
  const [addForm, setAddForm] = useState(initialAddForm)

  const handleAddCorporateSubmit = () => {
    const id = String(Date.now())
    const industries = addForm.industry ? addForm.industry.split(",").map((s) => s.trim()).filter(Boolean) : ["Corporate"]
    const newCorporate: CorporateInvestor = {
      id,
      name: addForm.name || "New Corporate",
      description: addForm.description || "",
      parentCompany: addForm.parentCompany || "",
      parentMetrics: addForm.parentMetrics || "",
      industry: industries,
      investmentType: addForm.investmentType,
      status: addForm.status,
      cvcFundSize: addForm.cvcFundSize || undefined,
      checkSizeMin: addForm.checkSizeMin || 0,
      checkSizeMax: addForm.checkSizeMax || 0,
      stageFocus: ["Series A", "Series B"],
      strategicFocus: addForm.currentInterest ? [addForm.currentInterest] : [],
      portfolio: 0,
      valueAdd: [],
      investmentProcess: "12-16 weeks",
      currentInterest: addForm.currentInterest || "",
      keyContact: {
        name: addForm.keyContactName || "TBD",
        title: addForm.keyContactTitle || "",
        email: addForm.keyContactEmail || undefined,
      },
      relationshipOwner: { name: "You", initials: "Y" },
      lastContact: "Just added",
      lastContactDays: 0,
      location: addForm.location || "",
      riskLevel: "medium",
    }
    setCorporates((prev) => [...prev, newCorporate])
    setAddForm(initialAddForm)
    setShowAddModal(false)
    toast({ title: "Corporate added", description: `${newCorporate.name} has been added to your network.` })
  }

  const openAddModal = () => {
    setAddForm(initialAddForm)
    setShowAddModal(true)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader title="Corporate Investors" />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/role-selection" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/investors" className="hover:text-foreground">
              Investors
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>By Type</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Corporate</span>
          </div>

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">Corporate Investors</h1>
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <Factory className="w-3 h-3 mr-1" />
                  Corporate
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                {filteredCorporates.length} corporate investors in your network
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
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="parent_size">Parent Size</SelectItem>
                  <SelectItem value="last_contact">Last Contact</SelectItem>
                  <SelectItem value="strategic_fit">Strategic Fit</SelectItem>
                  <SelectItem value="activity">Activity</SelectItem>
                </SelectContent>
              </Select>

              {/* Filter Button */}
              <Button variant="outline" onClick={() => setShowAdvancedFilters(true)}>
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {(industryFilter !== "all" || statusFilter !== "all" || strategicFilter !== "all") && (
                  <Badge className="ml-2 bg-rose-600 text-white">
                    {[industryFilter, statusFilter, strategicFilter].filter(f => f !== "all").length}
                  </Badge>
                )}
              </Button>

              {/* Add Button */}
              <Button className="bg-primary" onClick={openAddModal}>
                <Plus className="w-4 h-4 mr-2" />
                Add Corporate
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Corporate CVCs</p>
                    <p className="text-2xl font-bold">7</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                    <Factory className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Combined Revenue</p>
                    <p className="text-2xl font-bold">₹85,000 Cr</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <IndianRupee className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Mandates</p>
                    <p className="text-2xl font-bold">5</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Strategic Fits</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Handshake className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Bar - single search; Filters opened from header */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search corporates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              {(industryFilter !== "all" || statusFilter !== "all" || strategicFilter !== "all") && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                  <span className="text-sm text-muted-foreground">Active:</span>
                  {industryFilter !== "all" && (
                    <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                      {industryFilter}
                      <button onClick={() => setIndustryFilter("all")} className="ml-1" type="button" aria-label="Clear industry">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {statusFilter !== "all" && (
                    <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                      {statusFilter.replace("_", " ")}
                      <button onClick={() => setStatusFilter("all")} className="ml-1" type="button" aria-label="Clear status">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {strategicFilter !== "all" && (
                    <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                      {strategicFilter}
                      <button onClick={() => setStrategicFilter("all")} className="ml-1" type="button" aria-label="Clear focus">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => { setIndustryFilter("all"); setStatusFilter("all"); setStrategicFilter("all"); }}>
                    Clear all
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedCorporates.length > 0 && (
            <Card className="mb-6 border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedCorporates.length === sortedCorporates.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCorporates(sortedCorporates.map((c) => c.id))
                        } else {
                          setSelectedCorporates([])
                        }
                      }}
                    />
                    <span className="font-medium text-rose-900 dark:text-rose-100">
                      {selectedCorporates.length} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => toast({ title: "Send Updates", description: "Sending updates to selected corporates." })}>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Updates
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { exportToCsv({ headers: ["Name", "Parent", "Status", "Check Size", "Current Interest"], rows: sortedCorporates.filter(c => selectedCorporates.includes(c.id)).map(c => [c.name, c.parentCompany, c.status, `₹${c.checkSizeMin}-${c.checkSizeMax} Cr`, c.currentInterest]), filename: "corporate-investors.csv" }); toast({ title: "Export", description: "CSV downloaded." }); }}>
                      <FileText className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm" className="bg-rose-600 hover:bg-rose-700" onClick={() => toast({ title: "Batch Send Startups", description: "Opening batch send for selected corporates." })}>
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Batch Send Startups
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Content */}
          <div className="flex gap-6">
            {/* Cards Grid */}
            <div className="flex-1">
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedCorporates.map((corporate) => (
                    <CorporateCard
                      key={corporate.id}
                      corporate={corporate}
                      onViewProfile={handleViewProfile}
                      onSendStartup={handleSendStartup}
                      onStrategicFit={handleStrategicFit}
                      onEdit={handleEdit}
                      onSendEmail={handleSendEmail}
                      selected={selectedCorporates.includes(corporate.id)}
                      onToggleSelect={toggleSelect}
                    />
                  ))}
                </div>
              )}

              {viewMode === "list" && (
                <div className="space-y-4">
                  {sortedCorporates.map((corporate) => (
                    <Card key={corporate.id} className="hover:shadow-md transition-all border-l-4 border-l-rose-500">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Checkbox
                            checked={selectedCorporates.includes(corporate.id)}
                            onCheckedChange={() => toggleSelect(corporate.id)}
                          />
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-rose-100 to-rose-50 dark:from-rose-900/30 dark:to-rose-800/20 border flex items-center justify-center shrink-0">
                            <Factory className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Link href={`/investors/${corporate.id}`} className="font-medium hover:text-primary">
                                {corporate.name}
                              </Link>
                              {getStatusBadge(corporate.status)}
                              {getInvestmentTypeBadge(corporate.investmentType)}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{corporate.parentCompany} - {corporate.parentMetrics}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">₹{corporate.checkSizeMin}-{corporate.checkSizeMax} Cr</p>
                            <p className="text-xs text-muted-foreground">{corporate.portfolio} investments</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium truncate max-w-[200px]">{corporate.currentInterest}</p>
                            <p className="text-xs text-muted-foreground">{corporate.lastContact}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewProfile(corporate)}>
                              View
                            </Button>
                            <Button size="sm" className="bg-rose-600 hover:bg-rose-700" onClick={() => handleSendStartup(corporate)}>
                              Send Startup
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
                  <CardContent className="p-0">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="p-3 text-left w-10">
                            <Checkbox
                              checked={selectedCorporates.length === sortedCorporates.length}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedCorporates(sortedCorporates.map((c) => c.id))
                                } else {
                                  setSelectedCorporates([])
                                }
                              }}
                            />
                          </th>
                          <th className="p-3 text-left text-sm font-medium text-muted-foreground">Corporate</th>
                          <th className="p-3 text-left text-sm font-medium text-muted-foreground">Parent Company</th>
                          <th className="p-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                          <th className="p-3 text-left text-sm font-medium text-muted-foreground">Check Size</th>
                          <th className="p-3 text-left text-sm font-medium text-muted-foreground">Current Interest</th>
                          <th className="p-3 text-left text-sm font-medium text-muted-foreground">Last Contact</th>
                          <th className="p-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedCorporates.map((corporate) => (
                          <tr key={corporate.id} className="border-b hover:bg-muted/50">
                            <td className="p-3">
                              <Checkbox
                                checked={selectedCorporates.includes(corporate.id)}
                                onCheckedChange={() => toggleSelect(corporate.id)}
                              />
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                                  <Factory className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                                </div>
                                <span className="font-medium">{corporate.name}</span>
                              </div>
                            </td>
                            <td className="p-3 text-sm">{corporate.parentCompany}</td>
                            <td className="p-3">{getStatusBadge(corporate.status)}</td>
                            <td className="p-3 text-sm">₹{corporate.checkSizeMin}-{corporate.checkSizeMax} Cr</td>
                            <td className="p-3 text-sm max-w-[200px] truncate">{corporate.currentInterest}</td>
                            <td className="p-3 text-sm">{getContactWarning(corporate.lastContactDays)}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" onClick={() => handleViewProfile(corporate)}>
                                  <FileText className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleSendStartup(corporate)}>
                                  <ArrowUpRight className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleStrategicFit(corporate)}>
                                  <Target className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="w-[300px] space-y-4 hidden xl:block">
              {/* Corporate Network Overview */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Network className="w-4 h-4 text-rose-600" />
                    Corporate Network
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total corporates</span>
                    <span className="font-medium">7</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active CVC programs</span>
                    <span className="font-medium text-emerald-600">5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Strategic investors</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Investment capacity</span>
                    <span className="font-medium">₹5,000 Cr</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent" onClick={() => router.push("/analytics")}>
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              {/* Active Opportunities */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-600" />
                    Active Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="p-2 bg-rose-50 dark:bg-rose-950/30 rounded-lg border border-rose-200 dark:border-rose-800/50">
                    <p className="text-sm font-medium text-rose-900 dark:text-rose-100">HDFC</p>
                    <p className="text-xs text-rose-700 dark:text-rose-300">Looking for LendingTech</p>
                  </div>
                  <div className="p-2 bg-rose-50 dark:bg-rose-950/30 rounded-lg border border-rose-200 dark:border-rose-800/50">
                    <p className="text-sm font-medium text-rose-900 dark:text-rose-100">Jio</p>
                    <p className="text-xs text-rose-700 dark:text-rose-300">5G solutions wanted</p>
                  </div>
                  <div className="p-2 bg-rose-50 dark:bg-rose-950/30 rounded-lg border border-rose-200 dark:border-rose-800/50">
                    <p className="text-sm font-medium text-rose-900 dark:text-rose-100">Infosys</p>
                    <p className="text-xs text-rose-700 dark:text-rose-300">AI/ML tools</p>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/50">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-300">3 mandates expire in 60 days</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent" onClick={() => toast({ title: "View All Mandates", description: "Opening mandates view." })}>
                    View All Mandates
                  </Button>
                </CardContent>
              </Card>

              {/* Strategic Pipeline */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    Strategic Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Startups matched</span>
                    <Badge variant="secondary">12</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">In discussions</span>
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">4</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">POC stage</span>
                    <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">2</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Term sheet</span>
                    <Badge variant="outline">0</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent" onClick={() => router.push("/pipeline")}>
                    View Pipeline
                  </Button>
                </CardContent>
              </Card>

              {/* Corporate Events */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-purple-600" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50">
                    <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex flex-col items-center justify-center">
                      <span className="text-xs font-bold text-rose-700 dark:text-rose-300">Feb</span>
                      <span className="text-sm font-bold text-rose-700 dark:text-rose-300">15</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">HDFC Demo Day</p>
                      <p className="text-xs text-muted-foreground">Fintech showcase</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex flex-col items-center justify-center">
                      <span className="text-xs font-bold text-blue-700 dark:text-blue-300">Mar</span>
                      <span className="text-sm font-bold text-blue-700 dark:text-blue-300">5</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Jio Partner Summit</p>
                      <p className="text-xs text-muted-foreground">5G & IoT focus</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex flex-col items-center justify-center">
                      <span className="text-xs font-bold text-purple-700 dark:text-purple-300">Mar</span>
                      <span className="text-sm font-bold text-purple-700 dark:text-purple-300">20</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Infosys Innovation Week</p>
                      <p className="text-xs text-muted-foreground">Enterprise tech</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                    View All Events
                  </Button>
                </CardContent>
              </Card>

              {/* Deal Velocity */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-600" />
                    Deal Velocity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg time to term sheet</span>
                    <span className="font-medium">14 weeks</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fastest close</span>
                    <span className="font-medium text-emerald-600">8 weeks (Infosys)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Slowest</span>
                    <span className="font-medium text-amber-600">22 weeks (Tata)</span>
                  </div>
                  <div className="p-2 bg-muted/50 rounded-lg mt-2">
                    <p className="text-xs text-muted-foreground">Key bottleneck</p>
                    <p className="text-sm font-medium">Legal review & compliance</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent" onClick={() => router.push("/analytics")}>
                    View Insights
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <Toaster />

      {/* View Profile Sheet */}
      <Sheet open={showProfileSheet} onOpenChange={setShowProfileSheet}>
        <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto p-8">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                <Factory className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              {selectedCorporate?.name}
            </SheetTitle>
            <SheetDescription>{selectedCorporate?.description}</SheetDescription>
          </SheetHeader>

          {selectedCorporate && (
            <div className="mt-6 space-y-6">
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="contacts">Contacts</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4 mt-4">
                  {/* Parent Company */}
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Parent Company</p>
                    <p className="font-medium">{selectedCorporate.parentCompany}</p>
                    <p className="text-sm text-muted-foreground">{selectedCorporate.parentMetrics}</p>
                  </div>

                  {/* Investment Details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Check Size</p>
                      <p className="font-medium">₹{selectedCorporate.checkSizeMin}-{selectedCorporate.checkSizeMax} Cr</p>
                    </div>
                    {selectedCorporate.cvcFundSize && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Fund Size</p>
                        <p className="font-medium">{selectedCorporate.cvcFundSize}</p>
                      </div>
                    )}
                  </div>

                  {/* Stage Focus */}
                  <div>
                    <p className="text-sm font-medium mb-2">Stage Focus</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCorporate.stageFocus.map((stage) => (
                        <Badge key={stage} variant="secondary">{stage}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Strategic Focus */}
                  <div>
                    <p className="text-sm font-medium mb-2">Strategic Focus</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCorporate.strategicFocus.map((focus) => (
                        <Badge key={focus} variant="outline">{focus}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Value Add */}
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Gift className="w-4 h-4" />
                      Value-Add
                    </p>
                    <div className="space-y-2">
                      {selectedCorporate.valueAdd.map((value) => (
                        <div key={value} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          {value}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Investment Process */}
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Investment Process</p>
                    <p className="text-sm">{selectedCorporate.investmentProcess}</p>
                    <div className="mt-2">{getRiskIndicator(selectedCorporate.riskLevel)}</div>
                  </div>
                </TabsContent>

                <TabsContent value="portfolio" className="space-y-4 mt-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>{selectedCorporate.portfolio} strategic investments</p>
                    <p className="text-sm">View full portfolio details</p>
                  </div>
                </TabsContent>

                <TabsContent value="contacts" className="space-y-4 mt-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{selectedCorporate.keyContact.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedCorporate.keyContact.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedCorporate.keyContact.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {selectedCorporate.keyContact.email && (
                        <Button variant="outline" size="sm" onClick={() => toast({ title: "Email", description: `Opening email to ${selectedCorporate.keyContact.name}.` })}>
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </Button>
                      )}
                      {selectedCorporate.keyContact.linkedin && (
                        <Button variant="outline" size="sm" onClick={() => toast({ title: "LinkedIn", description: `Opening LinkedIn profile.` })}>
                          <Linkedin className="w-4 h-4 mr-2" />
                          LinkedIn
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Relationship Owner</p>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{selectedCorporate.relationshipOwner.initials}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{selectedCorporate.relationshipOwner.name}</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 pt-4 border-t">
                <Button className="flex-1 bg-rose-600 hover:bg-rose-700" onClick={() => {
                  setShowProfileSheet(false)
                  handleSendStartup(selectedCorporate)
                }}>
                  Send Startup
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => {
                  setShowProfileSheet(false)
                  handleStrategicFit(selectedCorporate)
                }}>
                  Strategic Fit
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Send Startup Modal */}
      <Dialog open={showSendStartupModal} onOpenChange={setShowSendStartupModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Startup to {selectedCorporate?.name}</DialogTitle>
            <DialogDescription>
              Select a startup to introduce to this corporate investor
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Startup</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a startup..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="finpay">FinPay - Payments infrastructure</SelectItem>
                  <SelectItem value="lendtech">LendTech AI - Lending platform</SelectItem>
                  <SelectItem value="cloudai">CloudAI - Enterprise AI</SelectItem>
                  <SelectItem value="evcharge">EVCharge - EV infrastructure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Introduction Note</Label>
              <Textarea placeholder="Add a personalized note for this introduction..." rows={4} />
            </div>
            <div className="space-y-2">
              <Label>Strategic Alignment</Label>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-900">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Strong strategic fit detected</span>
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  Matches current interest: {selectedCorporate?.currentInterest}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendStartupModal(false)}>
              Cancel
            </Button>
            <Button className="bg-rose-600 hover:bg-rose-700" onClick={() => { setShowSendStartupModal(false); toast({ title: "Introduction sent", description: `Startup introduction sent to ${selectedCorporate?.name}.` }); }}>
              Send Introduction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Strategic Fit Analysis Sheet */}
      <Sheet open={showStrategicFitSheet} onOpenChange={setShowStrategicFitSheet}>
        <SheetContent className="w-[450px] sm:max-w-[450px] overflow-y-auto p-8">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-600" />
              Strategic Fit Analysis
            </SheetTitle>
            <SheetDescription>
              Analyzing fit for {selectedCorporate?.name}
            </SheetDescription>
          </SheetHeader>

          {selectedCorporate && (
            <div className="mt-6 space-y-6">
              {/* Overall Score */}
              <div className="text-center p-6 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-900">
                <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">85%</p>
                <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">Strong Strategic Fit</p>
              </div>

              {/* Breakdown */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Technology Synergies</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Market Overlap</span>
                    <span className="font-medium">70%</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Integration Complexity</span>
                    <span className="font-medium">Medium</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Value-Add Potential</span>
                    <span className="font-medium">High</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-900">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-emerald-700 dark:text-emerald-300">Recommended: Proceed with Introduction</span>
                </div>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  This corporate's current mandate aligns well with your portfolio companies in the fintech space.
                </p>
              </div>

              {/* Matching Startups */}
              <div>
                <p className="font-medium mb-3">Top Matching Startups</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">LendTech AI</span>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700">92% match</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">FinPay</span>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700">88% match</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">WealthStack</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">76% match</Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button className="flex-1 bg-rose-600 hover:bg-rose-700" onClick={() => {
                  setShowStrategicFitSheet(false)
                  handleSendStartup(selectedCorporate)
                }}>
                  Send Top Match
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => toast({ title: "Export Report", description: "Strategic fit report downloaded." })}>
                  Export Report
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Filters Sheet */}
      <Sheet open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto p-8">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Filter corporates by industry, status and strategic focus</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label>Industry</Label>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="banking">Banking/Finance</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="telecom">Telecom</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="consumer">Consumer</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active_cvc">Active CVC</SelectItem>
                  <SelectItem value="strategic_only">Strategic Only</SelectItem>
                  <SelectItem value="ma_focus">M&A Focus</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Strategic Focus</Label>
              <Select value={strategicFilter} onValueChange={setStrategicFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Focus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Focus</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="distribution">Distribution</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="talent">Talent</SelectItem>
                  <SelectItem value="market">Market Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => { setIndustryFilter("all"); setStatusFilter("all"); setStrategicFilter("all"); setShowAdvancedFilters(false); toast({ title: "Filters cleared", description: "All filters reset." }); }}>
              Clear All
            </Button>
            <Button className="flex-1" onClick={() => { setShowAdvancedFilters(false); toast({ title: "Filters applied", description: "Filters updated." }); }}>
              Apply Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Corporate Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Edit Corporate</DialogTitle>
            <DialogDescription>Update corporate investor details</DialogDescription>
          </DialogHeader>
          {selectedCorporate && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input defaultValue={selectedCorporate.name} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea defaultValue={selectedCorporate.description} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Parent Company</Label>
                <Input defaultValue={selectedCorporate.parentCompany} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Check Size Min (Cr)</Label>
                  <Input type="number" defaultValue={selectedCorporate.checkSizeMin} />
                </div>
                <div className="space-y-2">
                  <Label>Check Size Max (Cr)</Label>
                  <Input type="number" defaultValue={selectedCorporate.checkSizeMax} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Current Interest</Label>
                <Input defaultValue={selectedCorporate.currentInterest} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button className="bg-rose-600 hover:bg-rose-700" onClick={() => { setShowEditModal(false); toast({ title: "Corporate updated", description: `${selectedCorporate?.name} details saved.` }); }}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Corporate Modal */}
      <Dialog open={showAddModal} onOpenChange={(open) => { setShowAddModal(open); if (!open) setAddForm(initialAddForm); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Add Corporate Investor</DialogTitle>
            <DialogDescription>Add a new corporate investor to your network</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                placeholder="e.g. HDFC Bank Ventures"
                value={addForm.name}
                onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Brief description of the corporate arm"
                value={addForm.description}
                onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Parent Company *</Label>
                <Input
                  placeholder="e.g. HDFC Bank"
                  value={addForm.parentCompany}
                  onChange={(e) => setAddForm((f) => ({ ...f, parentCompany: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Parent Metrics</Label>
                <Input
                  placeholder="e.g. ₹18 Lakh Cr market cap"
                  value={addForm.parentMetrics}
                  onChange={(e) => setAddForm((f) => ({ ...f, parentMetrics: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Industry (comma-separated)</Label>
              <Input
                placeholder="e.g. Banking, Fintech, Payments"
                value={addForm.industry}
                onChange={(e) => setAddForm((f) => ({ ...f, industry: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Investment Type</Label>
                <Select value={addForm.investmentType} onValueChange={(v: CorporateInvestor["investmentType"]) => setAddForm((f) => ({ ...f, investmentType: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cvc">CVC</SelectItem>
                    <SelectItem value="strategic">Strategic</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="ma">M&A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={addForm.status} onValueChange={(v: CorporateInvestor["status"]) => setAddForm((f) => ({ ...f, status: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active_cvc">Active CVC</SelectItem>
                    <SelectItem value="strategic_only">Strategic Only</SelectItem>
                    <SelectItem value="ma_focus">M&A Focus</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Check Size Min (Cr)</Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={addForm.checkSizeMin || ""}
                  onChange={(e) => setAddForm((f) => ({ ...f, checkSizeMin: Number(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Check Size Max (Cr)</Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={addForm.checkSizeMax || ""}
                  onChange={(e) => setAddForm((f) => ({ ...f, checkSizeMax: Number(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Fund Size (optional)</Label>
                <Input
                  placeholder="e.g. ₹500 Cr"
                  value={addForm.cvcFundSize}
                  onChange={(e) => setAddForm((f) => ({ ...f, cvcFundSize: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Current Interest</Label>
              <Input
                placeholder="e.g. Looking for LendingTech startups"
                value={addForm.currentInterest}
                onChange={(e) => setAddForm((f) => ({ ...f, currentInterest: e.target.value }))}
              />
            </div>
            <Separator />
            <p className="text-sm font-medium">Key Contact</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Contact Name</Label>
                <Input
                  placeholder="e.g. Sanjay Verma"
                  value={addForm.keyContactName}
                  onChange={(e) => setAddForm((f) => ({ ...f, keyContactName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="e.g. VP Strategy"
                  value={addForm.keyContactTitle}
                  onChange={(e) => setAddForm((f) => ({ ...f, keyContactTitle: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="contact@company.com"
                value={addForm.keyContactEmail}
                onChange={(e) => setAddForm((f) => ({ ...f, keyContactEmail: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="e.g. Mumbai, India"
                value={addForm.location}
                onChange={(e) => setAddForm((f) => ({ ...f, location: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddModal(false); setAddForm(initialAddForm); }}>
              Cancel
            </Button>
            <Button
              className="bg-rose-600 hover:bg-rose-700"
              onClick={handleAddCorporateSubmit}
              disabled={!addForm.name.trim() || !addForm.parentCompany.trim()}
            >
              Add Corporate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

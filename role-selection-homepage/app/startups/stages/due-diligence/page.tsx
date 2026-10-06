"use client"

import { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  ClipboardList,
  Download,
  Filter,
  Grid3X3,
  LayoutList,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Table,
  TrendingUp,
  Users,
  X,
  FileText,
  Scale,
  UserCheck,
  Code,
  MessageSquare,
  BarChart3,
  Shield,
  AlertTriangle,
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { QuickAddModal } from "@/components/startup/quick-add-modal"

// DD Checklist Items
const ddChecklistItems = [
  { id: "financial", label: "Financial Review", icon: FileText },
  { id: "legal", label: "Legal Documents", icon: Scale },
  { id: "references", label: "Reference Checks", icon: UserCheck },
  { id: "technical", label: "Technical Audit", icon: Code },
  { id: "team", label: "Team Interviews", icon: Users },
  { id: "market", label: "Market Analysis", icon: BarChart3 },
  { id: "product", label: "Product Demo & Testing", icon: Sparkles },
  { id: "customers", label: "Customer Interviews", icon: MessageSquare },
  { id: "partners", label: "Partner Verification", icon: UserCheck },
  { id: "compliance", label: "Compliance Review", icon: Shield },
  { id: "risk", label: "Risk Assessment", icon: AlertTriangle },
  { id: "memo", label: "IC Memo", icon: ClipboardList },
]

// Initial DD startups data (stateful for Move to IC / Pass)
const initialDdStartups = [
  {
    id: "1",
    name: "TechCorp AI",
    tagline: "AI-powered financial document analysis",
    sector: "Fintech",
    fundingStage: "Seed",
    seeking: "5.25 Cr",
    preMoneyValuation: "21 Cr",
    daysInStage: 18,
    avgDays: 22,
    ddProgress: 72,
    completedItems: ["financial", "legal", "references", "team", "product", "customers", "partners", "compliance", "risk"],
    pendingItems: [
      { id: "technical", label: "Technical audit", dueDate: "Jan 28", status: "scheduled" },
      { id: "market", label: "Market analysis", dueDate: "Jan 30", status: "in-progress" },
      { id: "memo", label: "IC Memo", dueDate: "Feb 2", status: "not-started" },
    ],
    team: [
      { name: "Priya Sharma", initials: "PS" },
      { name: "Rahul Mehta", initials: "RM" },
      { name: "Amit Patel", initials: "AP" },
    ],
    nextMilestone: "Technical audit - Jan 28",
    lastActivity: "2 hours ago",
    priority: "high",
  },
  {
    id: "2",
    name: "HealthBridge",
    tagline: "Telemedicine platform connecting rural India",
    sector: "Healthcare",
    fundingStage: "Series A",
    seeking: "12 Cr",
    preMoneyValuation: "48 Cr",
    daysInStage: 25,
    avgDays: 22,
    ddProgress: 45,
    completedItems: ["team", "product", "customers", "partners", "compliance"],
    pendingItems: [
      { id: "financial", label: "Financial review", dueDate: "Jan 22", status: "overdue" },
      { id: "legal", label: "Legal documents", dueDate: "Jan 30", status: "in-progress" },
      { id: "references", label: "Reference checks", dueDate: "Feb 1", status: "not-started" },
      { id: "technical", label: "Technical audit", dueDate: "Feb 3", status: "not-started" },
      { id: "market", label: "Market analysis", dueDate: "Feb 5", status: "not-started" },
      { id: "risk", label: "Risk assessment", dueDate: "Feb 7", status: "not-started" },
      { id: "memo", label: "IC Memo", dueDate: "Feb 10", status: "not-started" },
    ],
    team: [
      { name: "Amit Patel", initials: "AP" },
      { name: "Priya Sharma", initials: "PS" },
    ],
    nextMilestone: "Financial review (overdue)",
    lastActivity: "1 day ago",
    priority: "attention",
  },
  {
    id: "3",
    name: "PayFlow",
    tagline: "Instant B2B payment infrastructure",
    sector: "Fintech",
    fundingStage: "Seed",
    seeking: "8 Cr",
    preMoneyValuation: "32 Cr",
    daysInStage: 3,
    avgDays: 22,
    ddProgress: 15,
    completedItems: ["team"],
    pendingItems: [
      { id: "financial", label: "Financial review", dueDate: "Tomorrow", status: "scheduled" },
      { id: "legal", label: "Legal documents", dueDate: "Jan 28", status: "not-started" },
      { id: "references", label: "Reference checks", dueDate: "Jan 30", status: "not-started" },
      { id: "technical", label: "Technical audit", dueDate: "Feb 1", status: "not-started" },
      { id: "product", label: "Product demo", dueDate: "Feb 3", status: "not-started" },
      { id: "customers", label: "Customer interviews", dueDate: "Feb 5", status: "not-started" },
      { id: "partners", label: "Partner verification", dueDate: "Feb 7", status: "not-started" },
      { id: "market", label: "Market analysis", dueDate: "Feb 8", status: "not-started" },
      { id: "compliance", label: "Compliance review", dueDate: "Feb 10", status: "not-started" },
      { id: "risk", label: "Risk assessment", dueDate: "Feb 12", status: "not-started" },
      { id: "memo", label: "IC Memo", dueDate: "Feb 15", status: "not-started" },
    ],
    team: [{ name: "Rahul Mehta", initials: "RM" }],
    nextMilestone: "Financial review - Tomorrow",
    lastActivity: "30 mins ago",
    priority: "normal",
  },
  {
    id: "4",
    name: "GreenLeaf Energy",
    tagline: "Sustainable energy solutions for enterprises",
    sector: "CleanTech",
    fundingStage: "Series A",
    seeking: "15 Cr",
    preMoneyValuation: "60 Cr",
    daysInStage: 15,
    avgDays: 22,
    ddProgress: 58,
    completedItems: ["financial", "legal", "team", "product", "customers", "compliance", "risk"],
    pendingItems: [
      { id: "references", label: "Reference checks", dueDate: "Jan 27", status: "in-progress" },
      { id: "technical", label: "Technical audit", dueDate: "Jan 29", status: "scheduled" },
      { id: "partners", label: "Partner verification", dueDate: "Feb 1", status: "not-started" },
      { id: "market", label: "Market analysis", dueDate: "Feb 3", status: "not-started" },
      { id: "memo", label: "IC Memo", dueDate: "Feb 6", status: "not-started" },
    ],
    team: [
      { name: "Priya Sharma", initials: "PS" },
      { name: "Rahul Mehta", initials: "RM" },
    ],
    nextMilestone: "Reference checks - Jan 27",
    lastActivity: "4 hours ago",
    priority: "normal",
  },
  {
    id: "5",
    name: "CloudAI",
    tagline: "Cloud infrastructure automation platform",
    sector: "Enterprise",
    fundingStage: "Seed",
    seeking: "10 Cr",
    preMoneyValuation: "40 Cr",
    daysInStage: 20,
    avgDays: 22,
    ddProgress: 85,
    completedItems: ["financial", "legal", "references", "technical", "team", "product", "customers", "partners", "market", "compliance"],
    pendingItems: [
      { id: "risk", label: "Risk assessment", dueDate: "Jan 26", status: "in-progress" },
      { id: "memo", label: "IC Memo", dueDate: "Jan 28", status: "not-started" },
    ],
    team: [
      { name: "Priya Sharma", initials: "PS" },
      { name: "Amit Patel", initials: "AP" },
    ],
    nextMilestone: "Risk assessment - Jan 26",
    lastActivity: "1 hour ago",
    priority: "high",
  },
  {
    id: "6",
    name: "EduSpark",
    tagline: "Gamified learning for K-12 students",
    sector: "EdTech",
    fundingStage: "Pre-Seed",
    seeking: "3 Cr",
    preMoneyValuation: "12 Cr",
    daysInStage: 10,
    avgDays: 22,
    ddProgress: 33,
    completedItems: ["team", "product", "customers", "partners"],
    pendingItems: [
      { id: "financial", label: "Financial review", dueDate: "Jan 27", status: "scheduled" },
      { id: "legal", label: "Legal documents", dueDate: "Jan 29", status: "not-started" },
      { id: "references", label: "Reference checks", dueDate: "Feb 1", status: "not-started" },
      { id: "technical", label: "Technical audit", dueDate: "Feb 3", status: "not-started" },
      { id: "market", label: "Market analysis", dueDate: "Feb 5", status: "not-started" },
      { id: "compliance", label: "Compliance review", dueDate: "Feb 7", status: "not-started" },
      { id: "risk", label: "Risk assessment", dueDate: "Feb 9", status: "not-started" },
      { id: "memo", label: "IC Memo", dueDate: "Feb 12", status: "not-started" },
    ],
    team: [{ name: "Amit Patel", initials: "AP" }],
    nextMilestone: "Financial review - Jan 27",
    lastActivity: "3 hours ago",
    priority: "normal",
  },
  {
    id: "7",
    name: "LogiFlow",
    tagline: "AI-driven supply chain optimization",
    sector: "Logistics",
    fundingStage: "Seed",
    seeking: "6 Cr",
    preMoneyValuation: "24 Cr",
    daysInStage: 28,
    avgDays: 22,
    ddProgress: 92,
    completedItems: ["financial", "legal", "references", "technical", "team", "product", "customers", "partners", "market", "compliance", "risk"],
    pendingItems: [
      { id: "memo", label: "IC Memo", dueDate: "Jan 25", status: "in-progress" },
    ],
    team: [
      { name: "Rahul Mehta", initials: "RM" },
      { name: "Priya Sharma", initials: "PS" },
      { name: "Amit Patel", initials: "AP" },
    ],
    nextMilestone: "IC Memo - Jan 25",
    lastActivity: "2 hours ago",
    priority: "high",
  },
  {
    id: "8",
    name: "RetailX",
    tagline: "AI-powered retail analytics",
    sector: "Retail",
    fundingStage: "Seed",
    seeking: "4 Cr",
    preMoneyValuation: "16 Cr",
    daysInStage: 12,
    avgDays: 22,
    ddProgress: 50,
    completedItems: ["financial", "team", "product", "customers", "partners", "compliance"],
    pendingItems: [
      { id: "legal", label: "Legal documents", dueDate: "Jan 26", status: "in-progress" },
      { id: "references", label: "Reference checks", dueDate: "Jan 28", status: "scheduled" },
      { id: "technical", label: "Technical audit", dueDate: "Jan 30", status: "not-started" },
      { id: "market", label: "Market analysis", dueDate: "Feb 1", status: "not-started" },
      { id: "risk", label: "Risk assessment", dueDate: "Feb 3", status: "not-started" },
      { id: "memo", label: "IC Memo", dueDate: "Feb 6", status: "not-started" },
    ],
    team: [
      { name: "Amit Patel", initials: "AP" },
      { name: "Rahul Mehta", initials: "RM" },
    ],
    nextMilestone: "Legal documents - Jan 26",
    lastActivity: "5 hours ago",
    priority: "normal",
  },
  {
    id: "9",
    name: "InsureTech",
    tagline: "Digital insurance distribution platform",
    sector: "Insurance",
    fundingStage: "Series A",
    seeking: "20 Cr",
    preMoneyValuation: "80 Cr",
    daysInStage: 8,
    avgDays: 22,
    ddProgress: 25,
    completedItems: ["team", "product", "customers"],
    pendingItems: [
      { id: "financial", label: "Financial review", dueDate: "Jan 28", status: "scheduled" },
      { id: "legal", label: "Legal documents", dueDate: "Jan 30", status: "not-started" },
      { id: "references", label: "Reference checks", dueDate: "Feb 1", status: "not-started" },
      { id: "technical", label: "Technical audit", dueDate: "Feb 3", status: "not-started" },
      { id: "partners", label: "Partner verification", dueDate: "Feb 5", status: "not-started" },
      { id: "market", label: "Market analysis", dueDate: "Feb 7", status: "not-started" },
      { id: "compliance", label: "Compliance review", dueDate: "Feb 9", status: "not-started" },
      { id: "risk", label: "Risk assessment", dueDate: "Feb 11", status: "not-started" },
      { id: "memo", label: "IC Memo", dueDate: "Feb 14", status: "not-started" },
    ],
    team: [
      { name: "Priya Sharma", initials: "PS" },
      { name: "Amit Patel", initials: "AP" },
    ],
    nextMilestone: "Financial review - Jan 28",
    lastActivity: "6 hours ago",
    priority: "normal",
  },
  {
    id: "10",
    name: "DevTools Inc",
    tagline: "Developer productivity tools",
    sector: "Developer Tools",
    fundingStage: "Seed",
    seeking: "5 Cr",
    preMoneyValuation: "20 Cr",
    daysInStage: 22,
    avgDays: 22,
    ddProgress: 67,
    completedItems: ["financial", "legal", "references", "technical", "team", "product", "customers", "partners"],
    pendingItems: [
      { id: "market", label: "Market analysis", dueDate: "Jan 25", status: "overdue" },
      { id: "compliance", label: "Compliance review", dueDate: "Jan 27", status: "scheduled" },
      { id: "risk", label: "Risk assessment", dueDate: "Jan 29", status: "not-started" },
      { id: "memo", label: "IC Memo", dueDate: "Feb 1", status: "not-started" },
    ],
    team: [
      { name: "Rahul Mehta", initials: "RM" },
      { name: "Priya Sharma", initials: "PS" },
    ],
    nextMilestone: "Market analysis (overdue)",
    lastActivity: "1 day ago",
    priority: "attention",
  },
  {
    id: "11",
    name: "AgriTech Pro",
    tagline: "Smart farming solutions for Indian agriculture",
    sector: "AgriTech",
    fundingStage: "Pre-Seed",
    seeking: "2 Cr",
    preMoneyValuation: "8 Cr",
    daysInStage: 5,
    avgDays: 22,
    ddProgress: 8,
    completedItems: ["team"],
    pendingItems: [
      { id: "financial", label: "Financial review", dueDate: "Jan 29", status: "scheduled" },
      { id: "legal", label: "Legal documents", dueDate: "Jan 31", status: "not-started" },
      { id: "references", label: "Reference checks", dueDate: "Feb 2", status: "not-started" },
      { id: "technical", label: "Technical audit", dueDate: "Feb 4", status: "not-started" },
      { id: "product", label: "Product demo", dueDate: "Feb 6", status: "not-started" },
      { id: "customers", label: "Customer interviews", dueDate: "Feb 8", status: "not-started" },
      { id: "partners", label: "Partner verification", dueDate: "Feb 10", status: "not-started" },
      { id: "market", label: "Market analysis", dueDate: "Feb 12", status: "not-started" },
      { id: "compliance", label: "Compliance review", dueDate: "Feb 14", status: "not-started" },
      { id: "risk", label: "Risk assessment", dueDate: "Feb 16", status: "not-started" },
      { id: "memo", label: "IC Memo", dueDate: "Feb 19", status: "not-started" },
    ],
    team: [{ name: "Amit Patel", initials: "AP" }],
    nextMilestone: "Financial review - Jan 29",
    lastActivity: "2 hours ago",
    priority: "normal",
  },
  {
    id: "12",
    name: "MedSupply",
    tagline: "Healthcare supply chain platform",
    sector: "Healthcare",
    fundingStage: "Seed",
    seeking: "6 Cr",
    preMoneyValuation: "24 Cr",
    daysInStage: 16,
    avgDays: 22,
    ddProgress: 75,
    completedItems: ["financial", "legal", "references", "technical", "team", "product", "customers", "partners", "market"],
    pendingItems: [
      { id: "compliance", label: "Compliance review", dueDate: "Jan 26", status: "in-progress" },
      { id: "risk", label: "Risk assessment", dueDate: "Jan 28", status: "scheduled" },
      { id: "memo", label: "IC Memo", dueDate: "Jan 31", status: "not-started" },
    ],
    team: [
      { name: "Priya Sharma", initials: "PS" },
      { name: "Rahul Mehta", initials: "RM" },
    ],
    nextMilestone: "Compliance review - Jan 26",
    lastActivity: "4 hours ago",
    priority: "normal",
  },
  {
    id: "13",
    name: "FinanceAI",
    tagline: "AI-powered accounting automation",
    sector: "Fintech",
    fundingStage: "Seed",
    seeking: "7 Cr",
    preMoneyValuation: "28 Cr",
    daysInStage: 30,
    avgDays: 22,
    ddProgress: 100,
    completedItems: ["financial", "legal", "references", "technical", "team", "product", "customers", "partners", "market", "compliance", "risk", "memo"],
    pendingItems: [],
    team: [
      { name: "Priya Sharma", initials: "PS" },
      { name: "Amit Patel", initials: "AP" },
      { name: "Rahul Mehta", initials: "RM" },
    ],
    nextMilestone: "Ready for IC",
    lastActivity: "1 hour ago",
    priority: "high",
  },
  {
    id: "14",
    name: "SecureNet",
    tagline: "Enterprise cybersecurity solutions",
    sector: "Security",
    fundingStage: "Series A",
    seeking: "18 Cr",
    preMoneyValuation: "72 Cr",
    daysInStage: 14,
    avgDays: 22,
    ddProgress: 42,
    completedItems: ["team", "product", "customers", "partners", "market"],
    pendingItems: [
      { id: "financial", label: "Financial review", dueDate: "Jan 27", status: "in-progress" },
      { id: "legal", label: "Legal documents", dueDate: "Jan 29", status: "scheduled" },
      { id: "references", label: "Reference checks", dueDate: "Jan 31", status: "not-started" },
      { id: "technical", label: "Technical audit", dueDate: "Feb 2", status: "not-started" },
      { id: "compliance", label: "Compliance review", dueDate: "Feb 4", status: "not-started" },
      { id: "risk", label: "Risk assessment", dueDate: "Feb 6", status: "not-started" },
      { id: "memo", label: "IC Memo", dueDate: "Feb 9", status: "not-started" },
    ],
    team: [
      { name: "Rahul Mehta", initials: "RM" },
      { name: "Amit Patel", initials: "AP" },
    ],
    nextMilestone: "Financial review - Jan 27",
    lastActivity: "3 hours ago",
    priority: "normal",
  },
  {
    id: "15",
    name: "FoodTech Hub",
    tagline: "Cloud kitchen management platform",
    sector: "FoodTech",
    fundingStage: "Seed",
    seeking: "4.5 Cr",
    preMoneyValuation: "18 Cr",
    daysInStage: 19,
    avgDays: 22,
    ddProgress: 58,
    completedItems: ["financial", "legal", "team", "product", "customers", "partners", "compliance"],
    pendingItems: [
      { id: "references", label: "Reference checks", dueDate: "Jan 26", status: "in-progress" },
      { id: "technical", label: "Technical audit", dueDate: "Jan 28", status: "scheduled" },
      { id: "market", label: "Market analysis", dueDate: "Jan 30", status: "not-started" },
      { id: "risk", label: "Risk assessment", dueDate: "Feb 1", status: "not-started" },
      { id: "memo", label: "IC Memo", dueDate: "Feb 4", status: "not-started" },
    ],
    team: [
      { name: "Priya Sharma", initials: "PS" },
      { name: "Amit Patel", initials: "AP" },
    ],
    nextMilestone: "Reference checks - Jan 26",
    lastActivity: "5 hours ago",
    priority: "normal",
  },
]

type ViewMode = "grid" | "list" | "table"
type ActiveFilter = { type: string; value: string }
type SortOption = "progress" | "added" | "size" | "team"

export type DDStartup = (typeof initialDdStartups)[0]

function getTimeIndicatorColor(days: number, avgDays: number) {
  const ratio = days / avgDays
  if (ratio < 0.5) return { bg: "bg-green-500", text: "text-green-500", label: "Ahead" }
  if (ratio <= 1) return { bg: "bg-yellow-500", text: "text-yellow-500", label: "On track" }
  if (ratio <= 1.3) return { bg: "bg-orange-500", text: "text-orange-500", label: "Needs attention" }
  return { bg: "bg-red-500", text: "text-red-500", label: "Overdue" }
}

function getProgressColor(progress: number) {
  if (progress < 25) return "bg-red-500"
  if (progress < 50) return "bg-orange-500"
  if (progress < 75) return "bg-yellow-500"
  return "bg-green-500"
}

function getPriorityBadge(priority: string) {
  if (priority === "high") {
    return (
      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
        <TrendingUp className="w-3 h-3 mr-1" />
        High Priority
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

function getStatusBadge(status: string) {
  if (status === "overdue") {
    return <span className="text-red-500 text-xs font-medium">(Overdue)</span>
  }
  if (status === "in-progress") {
    return <span className="text-blue-500 text-xs font-medium">(In progress)</span>
  }
  if (status === "scheduled") {
    return <span className="text-amber-500 text-xs font-medium">(Scheduled)</span>
  }
  return <span className="text-muted-foreground text-xs">(Not started)</span>
}

const SECTOR_OPTIONS = [
  { value: "all", label: "All Sectors" },
  { value: "Fintech", label: "Fintech" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "EdTech", label: "EdTech" },
  { value: "CleanTech", label: "CleanTech" },
  { value: "Enterprise", label: "Enterprise" },
] as const

export default function DueDiligenceStagePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [startups, setStartups] = useState<DDStartup[]>(initialDdStartups)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [sectorFilter, setSectorFilter] = useState("all")
  const [ddProgressFilter, setDdProgressFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState<SortOption>("progress")
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [updateProgressOpen, setUpdateProgressOpen] = useState(false)
  const [selectedStartup, setSelectedStartup] = useState<DDStartup | null>(null)
  const [moveToICOpen, setMoveToICOpen] = useState(false)
  const [viewDDOpen, setViewDDOpen] = useState(false)
  const [passDialogOpen, setPassDialogOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])
  const [selectedStartups, setSelectedStartups] = useState<string[]>([])
  const [quickActionDialog, setQuickActionDialog] = useState<"assign" | "schedule" | "reports" | "export" | "balance" | null>(null)

  const filteredAndSortedStartups = useMemo(() => {
    let list = startups.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tagline.toLowerCase().includes(searchQuery.toLowerCase())
      if (!matchesSearch) return false

      if (sectorFilter !== "all" && s.sector !== sectorFilter) return false

      let matchesProgress = true
      if (ddProgressFilter === "just-started") matchesProgress = s.ddProgress <= 25
      else if (ddProgressFilter === "in-progress") matchesProgress = s.ddProgress > 25 && s.ddProgress <= 75
      else if (ddProgressFilter === "nearly-complete") matchesProgress = s.ddProgress > 75 && s.ddProgress < 100
      else if (ddProgressFilter === "complete") matchesProgress = s.ddProgress === 100
      if (!matchesProgress) return false

      const hasOverdue = s.pendingItems.some((i) => i.status === "overdue")
      if (statusFilter === "on-track" && hasOverdue) return false
      if (statusFilter === "overdue" && !hasOverdue) return false
      if (statusFilter === "blocked") return false // no blocked flag in data; show none for now

      return true
    })

    const sorted = [...list].sort((a, b) => {
      switch (sortBy) {
        case "progress":
          return b.ddProgress - a.ddProgress
        case "size": {
          const numA = parseFloat(a.seeking.replace(/[^\d.]/g, "")) || 0
          const numB = parseFloat(b.seeking.replace(/[^\d.]/g, "")) || 0
          return numB - numA
        }
        case "team":
          return b.team.length - a.team.length
        case "added":
        default:
          return 0
      }
    })
    return sorted
  }, [startups, searchQuery, sectorFilter, ddProgressFilter, statusFilter, sortBy])

  const handleUpdateProgress = useCallback((startup: DDStartup) => {
    setSelectedStartup(startup)
    setUpdateProgressOpen(true)
  }, [])

  const handleMoveToICClick = useCallback((startup: DDStartup) => {
    setSelectedStartup(startup)
    setMoveToICOpen(true)
  }, [])

  const handleMoveToICConfirm = useCallback(() => {
    if (!selectedStartup) return
    setStartups((prev) => prev.filter((s) => s.id !== selectedStartup.id))
    setMoveToICOpen(false)
    setSelectedStartup(null)
    toast({ title: "Moved to IC", description: `${selectedStartup.name} has been moved to Investment Committee.` })
  }, [selectedStartup, toast])

  const handleViewDD = useCallback((startup: DDStartup) => {
    setSelectedStartup(startup)
    setViewDDOpen(true)
  }, [])

  const handlePassClick = useCallback((startup: DDStartup) => {
    setSelectedStartup(startup)
    setPassDialogOpen(true)
  }, [])

  const handlePassConfirm = useCallback(() => {
    if (!selectedStartup) return
    setStartups((prev) => prev.filter((s) => s.id !== selectedStartup.id))
    setPassDialogOpen(false)
    setSelectedStartup(null)
    toast({ title: "Startup passed", description: `${selectedStartup.name} has been passed from due diligence.` })
  }, [selectedStartup, toast])

  const handleFindMatches = useCallback((startup: DDStartup) => {
    router.push(`/ai-insights/investor-matching?startup=${startup.id}`)
  }, [router])

  const handleEdit = useCallback((startup: DDStartup) => {
    router.push(`/startups/${startup.id}`)
  }, [router])

  const applyAdvancedFilters = useCallback(() => {
    const next: ActiveFilter[] = []
    if (sectorFilter !== "all") next.push({ type: "sector", value: sectorFilter })
    if (ddProgressFilter !== "all") {
      const labels: Record<string, string> = {
        "just-started": "Just started (0-25%)",
        "in-progress": "In progress (26-75%)",
        "nearly-complete": "Nearly complete (76-99%)",
        complete: "Complete (100%)",
      }
      next.push({ type: "progress", value: labels[ddProgressFilter] ?? ddProgressFilter })
    }
    if (statusFilter !== "all") {
      const labels: Record<string, string> = { "on-track": "On Track", overdue: "Has Overdue", blocked: "Blocked" }
      next.push({ type: "status", value: labels[statusFilter] ?? statusFilter })
    }
    setActiveFilters(next)
    setAdvancedFiltersOpen(false)
  }, [sectorFilter, ddProgressFilter, statusFilter])

  const removeFilter = (filter: ActiveFilter) => {
    setActiveFilters((prev) => prev.filter((f) => f.type !== filter.type || f.value !== filter.value))
    if (filter.type === "sector") setSectorFilter("all")
    if (filter.type === "progress") setDdProgressFilter("all")
    if (filter.type === "status") setStatusFilter("all")
  }

  const clearAllFilters = useCallback(() => {
    setActiveFilters([])
    setSectorFilter("all")
    setDdProgressFilter("all")
    setStatusFilter("all")
  }, [])

  const toggleStartupSelection = (id: string) => {
    setSelectedStartups((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  // Stats calculations (from current startups)
  const totalInDD = startups.length
  const avgTime = totalInDD > 0 ? Math.round(startups.reduce((acc, s) => acc + s.daysInStage, 0) / totalInDD) : 0
  const ddComplete = startups.filter((s) => s.ddProgress === 100).length
  const ddCompletePercent = totalInDD > 0 ? Math.round((ddComplete / totalInDD) * 100) : 0
  const movedToIC = 9
  const moveToICPercent = 60

  const overdueItems = startups
    .flatMap((s) =>
      s.pendingItems.filter((i) => i.status === "overdue").map((i) => ({ startupId: s.id, startup: s.name, item: i.label, dueDate: i.dueDate }))
    )
    .slice(0, 3)

  const teamWorkload = [
    { name: "Priya Sharma", initials: "PS", count: startups.filter((s) => s.team.some((t) => t.initials === "PS")).length },
    { name: "Rahul Mehta", initials: "RM", count: startups.filter((s) => s.team.some((t) => t.initials === "RM")).length },
    { name: "Amit Patel", initials: "AP", count: startups.filter((s) => s.team.some((t) => t.initials === "AP")).length },
  ]

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader title="Due Diligence" />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        
        <main className="flex-1 overflow-auto">
          {/* Breadcrumb */}
          <div className="px-4 md:px-6 pt-4">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/role-selection" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/pipeline" className="hover:text-foreground transition-colors">
                Pipeline
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span>By Stage</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">Due Diligence</span>
            </nav>
          </div>

          {/* Page Header */}
          <div className="border-b bg-card px-4 md:px-6 py-4 mt-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold text-foreground">Due Diligence</h1>
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                      <ClipboardList className="w-3 h-3 mr-1" />
                      Due Diligence
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{totalInDD} startups in due diligence stage</p>
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
                    <SelectItem value="progress">DD Progress</SelectItem>
                    <SelectItem value="added">Added Date</SelectItem>
                    <SelectItem value="size">Deal Size</SelectItem>
                    <SelectItem value="team">Team Assigned</SelectItem>
                  </SelectContent>
                </Select>

                

                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setQuickAddOpen(true)}>
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
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-foreground">{totalInDD}</p>
                      <p className="text-xs text-muted-foreground">In DD</p>
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
                      <p className="text-xs text-muted-foreground">Avg DD Time</p>
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
                      <p className="text-2xl font-semibold text-foreground">{ddCompletePercent}%</p>
                      <p className="text-xs text-muted-foreground">DD Complete</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-foreground">{moveToICPercent}%</p>
                      <p className="text-xs text-muted-foreground">Move to IC</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 mt-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search startups..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Select value={sectorFilter} onValueChange={setSectorFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTOR_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={ddProgressFilter} onValueChange={setDdProgressFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="DD Progress" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Progress</SelectItem>
                    <SelectItem value="just-started">Just started (0-25%)</SelectItem>
                    <SelectItem value="in-progress">In progress (26-75%)</SelectItem>
                    <SelectItem value="nearly-complete">Nearly complete (76-99%)</SelectItem>
                    <SelectItem value="complete">Complete (100%)</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="DD Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="on-track">On Track</SelectItem>
                    <SelectItem value="overdue">Has Overdue</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>

              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {activeFilters.map((filter, i) => (
                  <Badge key={i} variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20 gap-1 pl-2">
                    {filter.value}
                    <button type="button" onClick={() => removeFilter(filter)} className="ml-1 hover:bg-amber-500/20 rounded p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                <Button variant="ghost" size="sm" className="text-muted-foreground h-6 px-2" onClick={() => setActiveFilters([])}>
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
                    <DDCard
                      key={startup.id}
                      startup={startup}
                      onViewDD={handleViewDD}
                      onUpdateProgress={handleUpdateProgress}
                      onMoveToIC={handleMoveToICClick}
                      onPass={handlePassClick}
                      onFindMatches={handleFindMatches}
                      onEdit={handleEdit}
                      selected={selectedStartups.includes(startup.id)}
                      onToggleSelect={toggleStartupSelection}
                    />
                  ))}
                </div>
              )}

              {viewMode === "list" && (
                <div className="space-y-3">
                  {filteredAndSortedStartups.map((startup) => (
                    <DDListItem
                      key={startup.id}
                      startup={startup}
                      onViewDD={handleViewDD}
                      onUpdateProgress={handleUpdateProgress}
                      onMoveToIC={handleMoveToICClick}
                      onPass={handlePassClick}
                      onFindMatches={handleFindMatches}
                      onEdit={handleEdit}
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
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">DD Progress</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Deal Size</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Time in DD</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Team</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Next Milestone</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredAndSortedStartups.map((startup) => (
                        <DDTableRow
                          key={startup.id}
                          startup={startup}
                          onViewDD={handleViewDD}
                          onUpdateProgress={handleUpdateProgress}
                          onMoveToIC={handleMoveToICClick}
                          onPass={handlePassClick}
                          onFindMatches={handleFindMatches}
                          onEdit={handleEdit}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {filteredAndSortedStartups.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ClipboardList className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-1">No startups in due diligence</h3>
                  <p className="text-sm text-muted-foreground mb-4">Startups move here after passing screening</p>
                  <Button variant="outline" asChild>
                    <Link href="/startups/stages/screening">View Screening Stage</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="hidden lg:block w-[300px] shrink-0 space-y-4">
              {/* DD Performance */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">DD Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active DD</span>
                    <span className="font-medium text-foreground">{totalInDD} startups</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg completion time</span>
                    <span className="font-medium text-foreground">{avgTime} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">DD complete rate</span>
                    <span className="font-medium text-green-500">{ddCompletePercent}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Moved to IC (month)</span>
                    <span className="font-medium text-foreground">{movedToIC}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              {/* Overdue Items */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Overdue Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {overdueItems.length > 0 ? (
                    <>
                      {overdueItems.map((item, i) => (
                        <Link
                          key={i}
                          href={`/startups/${item.startupId}`}
                          className="flex items-center justify-between py-2 hover:bg-muted/50 rounded px-2 -mx-2 transition-colors"
                        >
                          <div>
                            <span className="text-sm text-foreground">{item.startup}</span>
                            <p className="text-xs text-red-500">{item.item}</p>
                          </div>
                          <span className="text-xs text-red-500 font-medium">{item.dueDate}</span>
                        </Link>
                      ))}
                      <p className="text-xs text-red-500 mt-2">{overdueItems.length} items need immediate attention</p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No overdue items</p>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 bg-transparent"
                    onClick={() => setStatusFilter("overdue")}
                  >
                    Review All Overdue
                  </Button>
                </CardContent>
              </Card>

              {/* Team Workload */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Team Workload</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {teamWorkload.map((member, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{member.initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-foreground">{member.name}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{member.count} active DDs</span>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 bg-transparent"
                    onClick={() => setQuickActionDialog("balance")}
                  >
                    Balance Workload
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
                    onClick={() => setQuickActionDialog("assign")}
                  >
                    <Users className="w-4 h-4" />
                    Assign DD team
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 bg-transparent"
                    onClick={() => setQuickActionDialog("schedule")}
                  >
                    <Calendar className="w-4 h-4" />
                    Schedule DD reviews
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 bg-transparent"
                    onClick={() => setQuickActionDialog("reports")}
                  >
                    <FileText className="w-4 h-4" />
                    Generate DD reports
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 bg-transparent"
                    onClick={() => setQuickActionDialog("export")}
                  >
                    <Download className="w-4 h-4" />
                    Export DD list
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedStartups.length > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-card border shadow-lg rounded-lg px-4 py-3 flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">{selectedStartups.length} selected</span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  Update Progress
                </Button>
                <Button size="sm" variant="outline">
                  Assign Team
                </Button>
                <Button size="sm" variant="outline">
                  Schedule Review
                </Button>
                <Button size="sm" variant="outline">
                  Generate Report
                </Button>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setSelectedStartups([])}>
                Cancel
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* Quick Add Modal */}
      <QuickAddModal open={quickAddOpen} onOpenChange={setQuickAddOpen} />

      {/* View DD Panel */}
      <Sheet open={viewDDOpen} onOpenChange={setViewDDOpen}>
        <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto p-8">
          <SheetHeader>
            <SheetTitle>DD Dashboard - {selectedStartup?.name}</SheetTitle>
            <SheetDescription>Complete due diligence checklist and progress</SheetDescription>
          </SheetHeader>

          {selectedStartup && (
            <div className="py-6 space-y-6">
              {/* Progress Overview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Overall Progress</Label>
                  <span className="text-sm font-semibold text-foreground">{selectedStartup.ddProgress}%</span>
                </div>
                <Progress value={selectedStartup.ddProgress} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  {selectedStartup.completedItems.length} of {ddChecklistItems.length} items complete
                </p>
              </div>

              {/* DD Checklist */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">DD Checklist</Label>
                <div className="space-y-2">
                  {ddChecklistItems.map((item) => {
                    const isComplete = selectedStartup.completedItems.includes(item.id)
                    const pending = selectedStartup.pendingItems.find((p) => p.id === item.id)
                    const Icon = item.icon

                    return (
                      <div key={item.id} className={cn("flex items-center gap-3 p-3 rounded-lg border", isComplete ? "bg-green-500/5 border-green-500/20" : "bg-muted/30")}>
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", isComplete ? "bg-green-500/10" : "bg-muted")}>
                          <Icon className={cn("w-4 h-4", isComplete ? "text-green-500" : "text-muted-foreground")} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={cn("text-sm", isComplete ? "text-green-600 dark:text-green-400" : "text-foreground")}>{item.label}</span>
                            {isComplete && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                          </div>
                          {pending && <p className="text-xs text-muted-foreground">Due: {pending.dueDate} {getStatusBadge(pending.status)}</p>}
                        </div>
                        {!isComplete && (
                          <Checkbox checked={isComplete} />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Team */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">DD Team</Label>
                <div className="flex items-center gap-2">
                  {selectedStartup.team.map((member, i) => (
                    <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5">
                      <Avatar className="w-5 h-5">
                        <AvatarFallback className="text-[9px] bg-primary/10 text-primary">{member.initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-foreground">{member.name}</span>
                    </div>
                  ))}   
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="dd-notes">Notes</Label>
                <Textarea id="dd-notes" placeholder="Add DD notes here..." className="min-h-[100px]" />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setViewDDOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setViewDDOpen(false)
                toast({ title: "Changes saved", description: `DD view for ${selectedStartup?.name} has been updated.` })
              }}
            >
              Save Changes
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Pass confirmation */}
      <Dialog open={passDialogOpen} onOpenChange={setPassDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pass {selectedStartup?.name} from due diligence?</DialogTitle>
            <DialogDescription>
              This startup will be marked as passed and removed from the DD stage. You can add a reason below.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="pass-reason">Reason (optional)</Label>
            <Textarea id="pass-reason" placeholder="e.g. Fit, valuation, risk" className="mt-2 min-h-[80px]" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPassDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handlePassConfirm}>Pass</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Progress Modal */}
      <Dialog open={updateProgressOpen} onOpenChange={setUpdateProgressOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update DD Progress - {selectedStartup?.name}</DialogTitle>
            <DialogDescription>Select completed items to update progress</DialogDescription>
          </DialogHeader>

          {selectedStartup && (
            <div className="py-4 max-h-[400px] overflow-y-auto">
              <div className="space-y-2">
                {ddChecklistItems.map((item) => {
                  const isComplete = selectedStartup.completedItems.includes(item.id)
                  return (
                    <div key={item.id} className="flex items-center gap-3 p-2">
                      <Checkbox id={`update-${item.id}`} checked={isComplete} />
                      <label htmlFor={`update-${item.id}`} className="text-sm text-foreground flex-1">
                        {item.label}
                      </label>
                      {isComplete && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 space-y-2">
                <Label>Overall progress: {selectedStartup.ddProgress}%</Label>
                <Progress value={selectedStartup.ddProgress} className="h-2" />
              </div>

              <div className="mt-4 space-y-2">
                <Label htmlFor="progress-notes">Add notes</Label>
                <Textarea id="progress-notes" placeholder="Add any notes about this update..." className="min-h-[80px]" />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateProgressOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setUpdateProgressOpen(false)
                toast({ title: "Progress saved", description: `DD progress for ${selectedStartup?.name} has been updated.` })
              }}
            >
              Save Progress
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move to IC Confirmation Modal */}
      <Dialog open={moveToICOpen} onOpenChange={setMoveToICOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move {selectedStartup?.name} to Investment Committee?</DialogTitle>
            <DialogDescription>This action will schedule the startup for IC review.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
              <p className="font-medium text-foreground">This will:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Schedule IC presentation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Finalize DD memo
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Notify IC members
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Update probability to 60%
                </li>
              </ul>
            </div>

            {selectedStartup && selectedStartup.ddProgress < 100 && (
              <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 text-amber-500 text-sm font-medium">
                  <AlertTriangle className="w-4 h-4" />
                  DD not complete ({selectedStartup.ddProgress}%)
                </div>
                <p className="text-xs text-muted-foreground mt-1">Consider completing all DD items before moving to IC.</p>
              </div>
            )}

            <div className="mt-4 space-y-2">
              <Label htmlFor="ic-notes">Notes for IC</Label>
              <Textarea id="ic-notes" placeholder="Add any notes for the IC presentation..." className="min-h-[80px]" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveToICOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMoveToICConfirm}>
              <ArrowRight className="w-4 h-4 mr-2" />
              Move to IC
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Advanced Filters Sheet */}
      <Sheet open={advancedFiltersOpen} onOpenChange={setAdvancedFiltersOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Advanced Filters</SheetTitle>
            <SheetDescription>Filter DD startups by sector, progress, and status.</SheetDescription>
          </SheetHeader>
          <div className="space-y-6 py-6">
            <div>
              <Label>Sector</Label>
              <Select value={sectorFilter} onValueChange={setSectorFilter}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SECTOR_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>DD Progress</Label>
              <Select value={ddProgressFilter} onValueChange={setDdProgressFilter}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Progress</SelectItem>
                  <SelectItem value="just-started">Just started (0-25%)</SelectItem>
                  <SelectItem value="in-progress">In progress (26-75%)</SelectItem>
                  <SelectItem value="nearly-complete">Nearly complete (76-99%)</SelectItem>
                  <SelectItem value="complete">Complete (100%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>DD Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="on-track">On Track</SelectItem>
                  <SelectItem value="overdue">Has Overdue</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={applyAdvancedFilters}>
              Apply Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Quick Actions (right panel) dialog */}
      <Dialog open={quickActionDialog != null} onOpenChange={(open) => !open && setQuickActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {quickActionDialog === "assign" && "Assign DD team"}
              {quickActionDialog === "schedule" && "Schedule DD reviews"}
              {quickActionDialog === "reports" && "Generate DD reports"}
              {quickActionDialog === "export" && "Export DD list"}
              {quickActionDialog === "balance" && "Balance workload"}
            </DialogTitle>
            <DialogDescription>
              {quickActionDialog === "assign" && "Assign team members to due diligence startups. You can reassign from the card or list view."}
              {quickActionDialog === "schedule" && "Schedule DD review meetings for startups in this stage."}
              {quickActionDialog === "reports" && "Generate due diligence reports for selected startups or the full list."}
              {quickActionDialog === "export" && "Download the current DD list as CSV or add to a report."}
              {quickActionDialog === "balance" && "View team workload and redistribute DD assignments."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuickActionDialog(null)}>Cancel</Button>
            <Button
              onClick={() => {
                setQuickActionDialog(null)
                toast({ title: "Action started", description: "Your request has been submitted." })
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface DDCardProps {
  startup: DDStartup
  onViewDD: (startup: DDStartup) => void
  onUpdateProgress: (startup: DDStartup) => void
  onMoveToIC: (startup: DDStartup) => void
  onPass?: (startup: DDStartup) => void
  onFindMatches?: (startup: DDStartup) => void
  onEdit?: (startup: DDStartup) => void
  selected?: boolean
  onToggleSelect?: (id: string) => void
}

function DDCard({ startup, onViewDD, onUpdateProgress, onMoveToIC, onPass, onFindMatches, onEdit, selected, onToggleSelect }: DDCardProps) {
  const timeIndicator = getTimeIndicatorColor(startup.daysInStage, startup.avgDays)
  const hasOverdue = startup.pendingItems.some((i) => i.status === "overdue")

  return (
    <Card className="group hover:shadow-md transition-all overflow-hidden">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          {onToggleSelect && <Checkbox checked={selected} onCheckedChange={() => onToggleSelect(startup.id)} className="mt-1 shrink-0" />}
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/5 border flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/startups/${startup.id}`} className="font-medium text-foreground truncate hover:text-primary transition-colors">
                {startup.name}
              </Link>
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-foreground">{startup.ddProgress}%</span>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" type="button">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="z-[100]">
                    <DropdownMenuItem onClick={() => onViewDD(startup)}>
                      <ClipboardList className="w-4 h-4 mr-2" />
                      View DD Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onFindMatches?.(startup)}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Find Matches
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit?.(startup)}>Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => onPass?.(startup)}>Pass</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <p className="text-xs text-muted-foreground truncate">{startup.tagline}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <Badge variant="outline" className="text-xs font-normal">
            {startup.sector}
          </Badge>
          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs font-medium">Due Diligence</Badge>
        </div>

        {/* Priority Badge */}
        {startup.priority !== "normal" && <div className="mt-2">{getPriorityBadge(startup.priority)}</div>}

        {/* DD Progress */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">DD Progress: {startup.ddProgress}% ({startup.completedItems.length}/{ddChecklistItems.length} items)</span>
          </div>
          <Progress value={startup.ddProgress} className="h-2" />
        </div>

        {/* Completed & Pending */}
        <div className="mt-3 space-y-2">
          {startup.completedItems.length > 0 && (
            <div>
              <p className="text-xs font-medium text-green-500 mb-1">Completed:</p>
              <div className="flex flex-wrap gap-1">
                {startup.completedItems.slice(0, 3).map((id) => {
                  const item = ddChecklistItems.find((i) => i.id === id)
                  return (
                    <span key={id} className="text-xs text-muted-foreground">
                      {item?.label} <CheckCircle2 className="w-3 h-3 inline text-green-500" />
                      {startup.completedItems.indexOf(id) < Math.min(2, startup.completedItems.length - 1) && ", "}
                    </span>
                  )
                })}
                {startup.completedItems.length > 3 && <span className="text-xs text-muted-foreground">+{startup.completedItems.length - 3} more</span>}
              </div>
            </div>
          )}

          {startup.pendingItems.length > 0 && (
            <div>
              <p className="text-xs font-medium text-amber-500 mb-1">Pending:</p>
              <div className="space-y-0.5">
                {startup.pendingItems.slice(0, 2).map((item) => (
                  <p key={item.id} className={cn("text-xs", item.status === "overdue" ? "text-red-500" : "text-muted-foreground")}>
                    {item.label} ({item.dueDate}) {item.status === "overdue" && <AlertCircle className="w-3 h-3 inline" />}
                  </p>
                ))}
                {startup.pendingItems.length > 2 && <p className="text-xs text-muted-foreground">+{startup.pendingItems.length - 2} more items</p>}
              </div>
            </div>
          )}
        </div>

        {/* Deal Info */}
        <div className="mt-3 space-y-1.5 text-xs">
          <div className="flex items-center gap-2 text-foreground">
            <span className="font-medium">Deal:</span>
            {startup.fundingStage} - {startup.seeking} - Pre: {startup.preMoneyValuation}
          </div>
          <div className={cn("flex items-center gap-2", timeIndicator.text)}>
            <Clock className="w-3 h-3" />
            In DD: {startup.daysInStage} days (avg: {startup.avgDays} days)
            {startup.daysInStage > startup.avgDays && <AlertCircle className="w-3 h-3" />}
          </div>
        </div>

        {/* Team & Next Milestone */}
        <div className="mt-3 space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">DD Team:</span>
            <div className="flex -space-x-1">
              {startup.team.map((member, i) => (
                <Avatar key={i} className="w-5 h-5 border-2 border-background">
                  <AvatarFallback className="text-[8px] bg-primary/10 text-primary">{member.initials}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
          <div className={cn("flex items-center gap-2", hasOverdue ? "text-red-500" : "text-muted-foreground")}>
            <Calendar className="w-3 h-3" />
            Next: {startup.nextMilestone}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t">
          <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent" onClick={() => onViewDD(startup)}>
            View DD
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent" onClick={() => onUpdateProgress(startup)}>
            Update
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn("flex-1 text-xs bg-transparent", startup.ddProgress === 100 && "border-green-500/50 text-green-500 hover:bg-green-500/10")}
            onClick={() => onMoveToIC(startup)}
          >
            Move to IC
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

interface DDListItemProps {
  startup: DDStartup
  onViewDD: (startup: DDStartup) => void
  onUpdateProgress: (startup: DDStartup) => void
  onMoveToIC: (startup: DDStartup) => void
  onPass?: (startup: DDStartup) => void
  onFindMatches?: (startup: DDStartup) => void
  onEdit?: (startup: DDStartup) => void
}

function DDListItem({ startup, onViewDD, onUpdateProgress, onMoveToIC, onPass, onFindMatches, onEdit }: DDListItemProps) {
  const timeIndicator = getTimeIndicatorColor(startup.daysInStage, startup.avgDays)
  const hasOverdue = startup.pendingItems.some((i) => i.status === "overdue")

  return (
    <Card className="group hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Icon & Name */}
          <div className="flex items-center gap-3 min-w-[200px]">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/5 border flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-amber-500" />
            </div>
            <div className="min-w-0">
              <Link href={`/startups/${startup.id}`} className="font-medium text-foreground truncate hover:text-primary transition-colors block">
                {startup.name}
              </Link>
              <p className="text-xs text-muted-foreground truncate">{startup.sector}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex-1 max-w-[200px]">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">DD Progress</span>
              <span className="font-medium text-foreground">{startup.ddProgress}%</span>
            </div>
            <Progress value={startup.ddProgress} className="h-2" />
          </div>

          {/* Deal Size */}
          <div className="w-[120px]">
            <p className="text-xs text-muted-foreground">Deal</p>
            <p className="text-sm font-medium text-foreground">{startup.seeking}</p>
          </div>

          {/* Time in DD */}
          <div className="w-[100px]">
            <p className="text-xs text-muted-foreground">In DD</p>
            <p className={cn("text-sm font-medium", timeIndicator.text)}>{startup.daysInStage} days</p>
          </div>

          {/* Team */}
          <div className="w-[100px]">
            <div className="flex -space-x-1">
              {startup.team.slice(0, 3).map((member, i) => (
                <Avatar key={i} className="w-6 h-6 border-2 border-background">
                  <AvatarFallback className="text-[9px] bg-primary/10 text-primary">{member.initials}</AvatarFallback>
                </Avatar>
              ))}
              {startup.team.length > 3 && <span className="text-xs text-muted-foreground ml-1">+{startup.team.length - 3}</span>}
            </div>
          </div>

          {/* Next Milestone */}
          <div className="flex-1 min-w-[150px]">
            <p className="text-xs text-muted-foreground">Next</p>
            <p className={cn("text-sm truncate", hasOverdue ? "text-red-500" : "text-foreground")}>{startup.nextMilestone}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs bg-transparent" onClick={() => onViewDD(startup)}>
              View DD
            </Button>
            <Button variant="outline" size="sm" className="text-xs bg-transparent" onClick={() => onUpdateProgress(startup)}>
              Update
            </Button>
            <Button variant="outline" size="sm" className="text-xs bg-transparent" onClick={() => onMoveToIC(startup)}>
              IC
            </Button>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" type="button">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-[100]">
                <DropdownMenuItem onClick={() => onEdit?.(startup)}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFindMatches?.(startup)}>Find Matches</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => onPass?.(startup)}>Pass</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface DDTableRowProps {
  startup: DDStartup
  onViewDD: (startup: DDStartup) => void
  onUpdateProgress: (startup: DDStartup) => void
  onMoveToIC: (startup: DDStartup) => void
  onPass?: (startup: DDStartup) => void
  onFindMatches?: (startup: DDStartup) => void
  onEdit?: (startup: DDStartup) => void
}

function DDTableRow({ startup, onViewDD, onUpdateProgress, onMoveToIC, onPass, onFindMatches, onEdit }: DDTableRowProps) {
  const timeIndicator = getTimeIndicatorColor(startup.daysInStage, startup.avgDays)
  const hasOverdue = startup.pendingItems.some((i) => i.status === "overdue")

  return (
    <tr className="hover:bg-muted/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/5 border flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <Link href={`/startups/${startup.id}`} className="font-medium text-foreground hover:text-primary transition-colors text-sm">
              {startup.name}
            </Link>
            <p className="text-xs text-muted-foreground truncate max-w-[150px]">{startup.tagline}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge variant="outline" className="text-xs font-normal">
          {startup.sector}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div className="w-[100px]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-foreground">{startup.ddProgress}%</span>
          </div>
          <Progress value={startup.ddProgress} className="h-1.5" />
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-foreground">
        {startup.fundingStage} - {startup.seeking}
      </td>
      <td className="px-4 py-3">
        <span className={cn("text-sm font-medium", timeIndicator.text)}>{startup.daysInStage} days</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex -space-x-1">
          {startup.team.slice(0, 3).map((member, i) => (
            <Avatar key={i} className="w-6 h-6 border-2 border-background">
              <AvatarFallback className="text-[9px] bg-primary/10 text-primary">{member.initials}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={cn("text-sm truncate block max-w-[150px]", hasOverdue ? "text-red-500" : "text-foreground")}>{startup.nextMilestone}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => onViewDD(startup)}>
            View
          </Button>
          <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => onUpdateProgress(startup)}>
            Update
          </Button>
          <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => onMoveToIC(startup)}>
            IC
          </Button>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" type="button">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[100]">
              <DropdownMenuItem onClick={() => onEdit?.(startup)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFindMatches?.(startup)}>Find Matches</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => onPass?.(startup)}>Pass</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  )
}

"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { ExportReportModal } from "@/components/analytics/export-report-modal"
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  DollarSign,
  Download,
  Edit2,
  Eye,
  FileText,
  Mail,
  MessageSquare,
  MoreVertical,
  Search,
  Send,
  Settings,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Mock campaign data
const campaignData = {
  id: 1,
  name: "Series A Fundraising",
  roundType: "Series A",
  targetAmount: 10000000,
  raisedAmount: 3200000,
  minTicketSize: 250000,
  valuation: "35-40M pre-money",
  launchDate: "Jan 15, 2026",
  targetCloseDate: "May 31, 2026",
  status: "active",
  investorInterest: 47,
  meetings: 12,
  commitments: 8,
  pipelineValue: 6200000,
}

const interestedInvestors = [
  {
    id: 1,
    name: "Sarah Chen",
    firm: "Venture Capital Partners",
    type: "VC",
    status: "interested",
    matchScore: 95,
    lastActivity: "Viewed deck 2 days ago",
    ticketSize: "500K-1M",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 2,
    name: "Michael Roberts",
    firm: "Tech Growth Fund",
    type: "VC",
    status: "meeting_scheduled",
    matchScore: 88,
    lastActivity: "Meeting on Feb 10",
    ticketSize: "250K-500K",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 3,
    name: "Priya Sharma",
    firm: "Angel Investor",
    type: "Angel",
    status: "commitment",
    matchScore: 92,
    lastActivity: "Soft commitment made",
    ticketSize: "250K",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 4,
    name: "David Thompson",
    firm: "Strategic Ventures",
    type: "Corporate",
    status: "due_diligence",
    matchScore: 85,
    lastActivity: "Reviewing financials",
    ticketSize: "1M-2M",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    firm: "Growth Equity LLC",
    type: "VC",
    status: "interested",
    matchScore: 78,
    lastActivity: "Requested intro call",
    ticketSize: "500K-750K",
    avatar: "/placeholder-user.jpg",
  },
]

const upcomingMeetings = [
  {
    id: 1,
    investor: "Michael Roberts",
    firm: "Tech Growth Fund",
    date: "Feb 10, 2026",
    time: "2:00 PM",
    type: "Initial Meeting",
    location: "Zoom",
  },
  {
    id: 2,
    investor: "Sarah Chen",
    firm: "Venture Capital Partners",
    date: "Feb 12, 2026",
    time: "10:30 AM",
    type: "Follow-up",
    location: "In-person",
  },
  {
    id: 3,
    investor: "David Thompson",
    firm: "Strategic Ventures",
    date: "Feb 15, 2026",
    time: "3:00 PM",
    type: "Due Diligence",
    location: "Zoom",
  },
]

const recentActivity = [
  {
    id: 1,
    type: "view",
    investor: "Sarah Chen",
    action: "viewed your pitch deck",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "interest",
    investor: "John Williams",
    action: "expressed interest in your campaign",
    time: "5 hours ago",
  },
  {
    id: 3,
    type: "message",
    investor: "Priya Sharma",
    action: "sent you a message",
    time: "1 day ago",
  },
  {
    id: 4,
    type: "meeting",
    investor: "Michael Roberts",
    action: "scheduled a meeting",
    time: "2 days ago",
  },
]

const formatCurrency = (amount: number) => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`
  }
  return `$${amount}`
}

const statusConfig = {
  interested: {
    label: "Interested",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  meeting_scheduled: {
    label: "Meeting Scheduled",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  commitment: {
    label: "Soft Commitment",
    color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  },
  due_diligence: {
    label: "Due Diligence",
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  },
}

export default function ManageCampaignPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null)
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  const [messageContent, setMessageContent] = useState("")
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  const progressPercentage = (campaignData.raisedAmount / campaignData.targetAmount) * 100
  const pipelinePercentage = (campaignData.pipelineValue / campaignData.targetAmount) * 100

  const filteredInvestors = interestedInvestors.filter(
    (investor) =>
      investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.firm.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = () => {
    console.log("[v0] Sending message:", messageContent)
    setIsMessageDialogOpen(false)
    setMessageContent("")
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full bg-background">
            {/* Header */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="bg-transparent">
                      <Link href="/founder/profile?tab=funding">
                        <ArrowLeft className="w-5 h-5" />
                      </Link>
                    </Button>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">{campaignData.name}</h1>
                      <p className="text-sm text-muted-foreground">
                        Launched {campaignData.launchDate} · Target close: {campaignData.targetCloseDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="bg-transparent" asChild>
                      <Link href="/founder/campaign/progress">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        View Progress
                      </Link>
                    </Button>
                    <Button variant="outline" className="bg-transparent" onClick={() => setIsExportModalOpen(true)}>
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                    <Button variant="outline" className="bg-transparent">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Export Report Modal */}
            <ExportReportModal
              isOpen={isExportModalOpen}
              onClose={() => setIsExportModalOpen(false)}
              currentTab="campaign-manage"
              filters={{
                dateRange: "current",
                sectors: [],
                stages: [],
              }}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

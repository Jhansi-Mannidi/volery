"use client"

export const dynamic = "force-dynamic"

import React from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

import { useState, useCallback, useRef } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Send,
  Mail,
  MailOpen,
  MessageSquare,
  Calendar,
  XCircle,
  Plus,
  Filter,
  MoreHorizontal,
  GripVertical,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
  ExternalLink,
  FileText,
  Link2,
  Sparkles,
  RefreshCw,
  Search,
  Bell,
  ArrowUpRight,
  Copy,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  MousePointer,
  Building2,
  User,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Types
type OutreachStatus = "draft" | "sent" | "opened" | "responded" | "meeting_set" | "passed"

interface OutreachItem {
  id: string
  startup: {
    id: string
    name: string
    sector: string
  }
  investor: {
    id: string
    name: string
    firm: string
    email: string
  }
  subject: string
  sentAt: string | null
  channel: "email" | "linkedin" | "phone"
  status: OutreachStatus
  openCount: number
  lastOpenedAt: string | null
  linkClicks: number
  responseAt: string | null
  attachments: {
    name: string
    type: string
    views: number
  }[]
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  category: string
  usageCount: number
}

interface FollowUpReminder {
  id: string
  outreach: OutreachItem
  daysSinceContact: number
  suggestedAction: string
}

// Status configuration
const statusConfig: Record<OutreachStatus, { label: string; color: string; bgColor: string; borderColor: string; countBadgeClass: string; icon: React.ElementType }> = {
  draft: {
    label: "Draft",
    color: "text-muted-foreground",
    bgColor: "bg-muted/50 dark:bg-muted/30",
    borderColor: "border-muted-foreground/30",
    countBadgeClass: "bg-muted-foreground/20 text-muted-foreground",
    icon: FileText,
  },
  sent: {
    label: "Sent",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/40",
    borderColor: "border-blue-300 dark:border-blue-700",
    countBadgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-800/50 dark:text-blue-300",
    icon: Send,
  },
  opened: {
    label: "Opened",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/40",
    borderColor: "border-amber-300 dark:border-amber-700",
    countBadgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-800/50 dark:text-amber-300",
    icon: MailOpen,
  },
  responded: {
    label: "Responded",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/40",
    borderColor: "border-purple-300 dark:border-purple-700",
    countBadgeClass: "bg-purple-100 text-purple-700 dark:bg-purple-800/50 dark:text-purple-300",
    icon: MessageSquare,
  },
  meeting_set: {
    label: "Meeting Set",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/40",
    borderColor: "border-emerald-300 dark:border-emerald-700",
    countBadgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-800/50 dark:text-emerald-300",
    icon: Calendar,
  },
  passed: {
    label: "Passed",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/40",
    borderColor: "border-red-300 dark:border-red-700",
    countBadgeClass: "bg-red-100 text-red-700 dark:bg-red-800/50 dark:text-red-300",
    icon: XCircle,
  },
}

// Sample data
const sampleOutreach: OutreachItem[] = [
  {
    id: "o1",
    startup: { id: "s1", name: "TechCorp AI", sector: "Fintech" },
    investor: { id: "i1", name: "John Smith", firm: "Sequoia Capital", email: "john@sequoia.com" },
    subject: "AI Fintech Opportunity - TechCorp",
    sentAt: "2026-01-15T10:00:00",
    channel: "email",
    status: "opened",
    openCount: 3,
    lastOpenedAt: "2026-01-15T14:30:00",
    linkClicks: 1,
    responseAt: null,
    attachments: [{ name: "Pitch Deck.pdf", type: "pdf", views: 2 }],
  },
  {
    id: "o2",
    startup: { id: "s2", name: "HealthX", sector: "Healthcare" },
    investor: { id: "i2", name: "Sarah Chen", firm: "a16z", email: "sarah@a16z.com" },
    subject: "Healthcare AI Revolution - HealthX Series A",
    sentAt: "2026-01-14T09:00:00",
    channel: "email",
    status: "responded",
    openCount: 5,
    lastOpenedAt: "2026-01-16T11:00:00",
    linkClicks: 3,
    responseAt: "2026-01-16T14:00:00",
    attachments: [
      { name: "Pitch Deck.pdf", type: "pdf", views: 4 },
      { name: "Financial Model.xlsx", type: "excel", views: 2 },
    ],
  },
  {
    id: "o3",
    startup: { id: "s3", name: "GreenEnergy", sector: "CleanTech" },
    investor: { id: "i3", name: "Mike Johnson", firm: "Accel", email: "mike@accel.com" },
    subject: "CleanTech Investment Opportunity",
    sentAt: "2026-01-13T14:00:00",
    channel: "email",
    status: "meeting_set",
    openCount: 8,
    lastOpenedAt: "2026-01-17T09:00:00",
    linkClicks: 5,
    responseAt: "2026-01-15T10:00:00",
    attachments: [{ name: "Pitch Deck.pdf", type: "pdf", views: 6 }],
  },
  {
    id: "o4",
    startup: { id: "s1", name: "TechCorp AI", sector: "Fintech" },
    investor: { id: "i4", name: "Lisa Wong", firm: "Lightspeed", email: "lisa@lsvp.com" },
    subject: "TechCorp AI - Disrupting B2B Payments",
    sentAt: "2026-01-16T11:00:00",
    channel: "email",
    status: "sent",
    openCount: 0,
    lastOpenedAt: null,
    linkClicks: 0,
    responseAt: null,
    attachments: [{ name: "One Pager.pdf", type: "pdf", views: 0 }],
  },
  {
    id: "o5",
    startup: { id: "s4", name: "DataMesh", sector: "Data" },
    investor: { id: "i5", name: "David Kim", firm: "Index Ventures", email: "david@indexventures.com" },
    subject: "Data Infrastructure Investment",
    sentAt: null,
    channel: "email",
    status: "draft",
    openCount: 0,
    lastOpenedAt: null,
    linkClicks: 0,
    responseAt: null,
    attachments: [],
  },
  {
    id: "o6",
    startup: { id: "s5", name: "LogiFlow", sector: "Logistics" },
    investor: { id: "i6", name: "Emma Davis", firm: "Greylock", email: "emma@greylock.com" },
    subject: "Supply Chain AI - LogiFlow Seed Round",
    sentAt: "2026-01-10T10:00:00",
    channel: "email",
    status: "passed",
    openCount: 2,
    lastOpenedAt: "2026-01-11T15:00:00",
    linkClicks: 1,
    responseAt: "2026-01-12T09:00:00",
    attachments: [{ name: "Pitch Deck.pdf", type: "pdf", views: 1 }],
  },
  {
    id: "o7",
    startup: { id: "s2", name: "HealthX", sector: "Healthcare" },
    investor: { id: "i7", name: "Tom Brown", firm: "NEA", email: "tom@nea.com" },
    subject: "HealthX - AI-Powered Diagnostics",
    sentAt: "2026-01-17T08:00:00",
    channel: "email",
    status: "opened",
    openCount: 1,
    lastOpenedAt: "2026-01-17T12:00:00",
    linkClicks: 0,
    responseAt: null,
    attachments: [{ name: "Pitch Deck.pdf", type: "pdf", views: 1 }],
  },
  {
    id: "o8",
    startup: { id: "s3", name: "GreenEnergy", sector: "CleanTech" },
    investor: { id: "i8", name: "Rachel Green", firm: "Khosla Ventures", email: "rachel@khosla.com" },
    subject: "Sustainable Energy Investment",
    sentAt: "2026-01-12T16:00:00",
    channel: "email",
    status: "sent",
    openCount: 0,
    lastOpenedAt: null,
    linkClicks: 0,
    responseAt: null,
    attachments: [{ name: "Pitch Deck.pdf", type: "pdf", views: 0 }],
  },
]

const emailTemplates: EmailTemplate[] = [
  {
    id: "t1",
    name: "Initial Outreach",
    subject: "Investment Opportunity: {startup_name} - {sector}",
    body: "Hi {investor_name},\n\nI wanted to introduce you to {startup_name}, an exciting {sector} company...",
    category: "Introduction",
    usageCount: 45,
  },
  {
    id: "t2",
    name: "Follow-up (No Response)",
    subject: "Following up: {startup_name}",
    body: "Hi {investor_name},\n\nI wanted to follow up on my previous email about {startup_name}...",
    category: "Follow-up",
    usageCount: 32,
  },
  {
    id: "t3",
    name: "Meeting Request",
    subject: "Meeting Request: {startup_name} Discussion",
    body: "Hi {investor_name},\n\nThank you for your interest in {startup_name}. Would you be available for a 30-minute call...",
    category: "Meeting",
    usageCount: 28,
  },
]

const followUpReminders: FollowUpReminder[] = [
  {
    id: "r1",
    outreach: sampleOutreach[3],
    daysSinceContact: 2,
    suggestedAction: "Send follow-up email",
  },
  {
    id: "r2",
    outreach: sampleOutreach[7],
    daysSinceContact: 5,
    suggestedAction: "Try LinkedIn message",
  },
]

// Group outreach by status for kanban view
function groupByStatus(outreach: OutreachItem[]): Record<OutreachStatus, OutreachItem[]> {
  const grouped: Record<OutreachStatus, OutreachItem[]> = {
    draft: [],
    sent: [],
    opened: [],
    responded: [],
    meeting_set: [],
    passed: [],
  }
  
  outreach.forEach((item) => {
    grouped[item.status].push(item)
  })
  
  return grouped
}

// Components
function StatusBadge({ status }: { status: OutreachStatus }) {
  const config = statusConfig[status]
  const Icon = config.icon
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border",
        config.bgColor,
        config.color,
        config.borderColor
      )}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  )
}

function OutreachCard({ 
  outreach, 
  onViewDetails,
  onSendFollowUp,
  onLogResponse,
  onDelete,
}: { 
  outreach: OutreachItem
  onViewDetails: () => void
  onSendFollowUp: () => void
  onLogResponse: () => void
  onDelete: () => void
}) {
  const [isDragging, setIsDragging] = useState(false)
  const justDraggedRef = useRef(false)

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  }

  const getTimeAgo = (dateString: string | null) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    if (diffHours < 1) return "Just now"
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  const handleDragStart = (e: React.DragEvent) => {
    justDraggedRef.current = true
    setIsDragging(true)
    e.dataTransfer.setData("application/json", JSON.stringify({ id: outreach.id }))
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", outreach.id)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    setTimeout(() => { justDraggedRef.current = false }, 0)
  }

  const handleCardClick = () => {
    if (justDraggedRef.current) return
    onViewDetails()
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        "group relative bg-background border rounded-lg p-3 transition-all hover:shadow-md cursor-grab active:cursor-grabbing overflow-hidden",
        isDragging && "opacity-50 ring-2 ring-primary"
      )}
      onClick={handleCardClick}
    >
      {/* Drag Handle */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing pointer-events-none">
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="pl-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex items-center gap-1.5 text-sm min-w-0">
              <span className="font-medium text-foreground truncate max-w-[80px]">{outreach.startup.name}</span>
              <ArrowUpRight className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground truncate">{outreach.investor.firm}</span>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {outreach.investor.name}
            </p>
          </div>
        </div>

        {/* Subject */}
        <p className="text-xs text-muted-foreground mb-2 truncate">
          {outreach.subject}
        </p>

        {/* Sent date & channel */}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-2 flex-wrap">
          {outreach.sentAt ? (
            <>
              <span className="whitespace-nowrap">Sent: {formatDate(outreach.sentAt)}</span>
              <span>·</span>
              <span className="whitespace-nowrap">via {outreach.channel}</span>
            </>
          ) : (
            <span className="text-amber-600">Not sent yet</span>
          )}
        </div>

        {/* Engagement stats */}
        {outreach.status !== "draft" && (
          <div className="flex items-center gap-2 text-[10px] flex-wrap">
            {outreach.openCount > 0 && (
              <span className="flex items-center gap-1 text-amber-600 whitespace-nowrap">
                <MailOpen className="w-3 h-3 shrink-0" />
                {outreach.openCount}x opened
              </span>
            )}
            {outreach.lastOpenedAt && (
              <span className="text-muted-foreground whitespace-nowrap">
                Last: {getTimeAgo(outreach.lastOpenedAt)}
              </span>
            )}
            {outreach.linkClicks > 0 && (
              <span className="flex items-center gap-1 text-blue-600 whitespace-nowrap">
                <MousePointer className="w-3 h-3 shrink-0" />
                {outreach.linkClicks} clicks
              </span>
            )}
          </div>
        )}

        {/* Actions - icon-only with tooltips */}
        <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-border">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 border-border bg-muted/50 hover:bg-muted"
                onClick={(e) => { e.stopPropagation(); onViewDetails(); }}
              >
                <Eye className="w-4 h-4 shrink-0" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">View</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 border-border bg-muted/50 hover:bg-muted"
                onClick={(e) => { e.stopPropagation(); onSendFollowUp(); }}
              >
                <Send className="w-4 h-4 shrink-0" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Follow-up</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 border-border bg-muted/50 hover:bg-muted"
                onClick={(e) => { e.stopPropagation(); onLogResponse(); }}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Log response</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 border-border text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
              >
                <Trash2 className="w-4 h-4 shrink-0" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Delete</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

function OutreachDetailModal({
  outreach,
  isOpen,
  onClose,
  onCopyEmail,
  onSendFollowUp,
}: {
  outreach: OutreachItem | null
  isOpen: boolean
  onClose: () => void
  onCopyEmail?: (outreach: OutreachItem) => void
  onSendFollowUp?: (outreach: OutreachItem) => void
}) {
  if (!outreach) return null

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  // Sample engagement timeline
  const engagementTimeline = [
    { action: "Sent", time: outreach.sentAt, icon: Send },
    ...(outreach.openCount > 0
      ? [{ action: "Opened", time: outreach.lastOpenedAt, icon: MailOpen, count: outreach.openCount }]
      : []),
    ...(outreach.linkClicks > 0
      ? [{ action: "Link clicked (Pitch Deck)", time: outreach.lastOpenedAt, icon: MousePointer }]
      : []),
    ...(outreach.responseAt
      ? [{ action: "Response received", time: outreach.responseAt, icon: MessageSquare }]
      : []),
  ].filter((e) => e.time)

  const emailBody = `Hi ${outreach.investor.name.split(" ")[0]},\n\nI wanted to introduce you to ${outreach.startup.name}, an exciting ${outreach.startup.sector} company that I believe aligns well with your investment thesis.\n\nThe company is building next-generation solutions in the ${outreach.startup.sector.toLowerCase()} space, with strong early traction and a world-class founding team.\n\nWould you be open to a 30-minute call to learn more?\n\nBest regards,\nInvestment Team\nAnthill Ventures`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-lg">
                {outreach.startup.name} → {outreach.investor.firm}
              </DialogTitle>
              <DialogDescription>
                {outreach.investor.name} · {outreach.investor.email}
              </DialogDescription>
            </div>
            <StatusBadge status={outreach.status} />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-4">
          {/* Email Preview */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Subject</Label>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium">{outreach.subject}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Email Body</Label>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {emailBody.trim()}
              </p>
            </div>
          </div>

          {/* Engagement Timeline */}
          <div className="space-y-3">
            <Label className="text-xs text-muted-foreground">Engagement Timeline</Label>
            <div className="space-y-2">
              {engagementTimeline.map((event, idx) => {
                const Icon = event.icon
                return (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{event.action}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(event.time)}</p>
                    </div>
                    {"count" in event && event.count && (
                      <Badge variant="secondary" className="text-xs">
                        {event.count}x
                      </Badge>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Attachments */}
          {outreach.attachments.length > 0 && (
            <div className="space-y-3">
              <Label className="text-xs text-muted-foreground">Attachments</Label>
              <div className="space-y-2">
                {outreach.attachments.map((attachment, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{attachment.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {attachment.views > 0 ? `Viewed ${attachment.views} times` : "Not viewed yet"}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={onClose} className="bg-transparent">
            Close
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent"
            onClick={() => onCopyEmail?.(outreach)}
          >
            <Copy className="w-4 h-4 mr-1.5" />
            Copy Email
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSendFollowUp?.(outreach)}
          >
            <Send className="w-4 h-4 mr-1.5" />
            Send Follow-up
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function OutreachComposerModal({
  isOpen,
  onClose,
  onSaveDraft,
  onSend,
}: {
  isOpen: boolean
  onClose: () => void
  onSaveDraft?: () => void
  onSend?: (scheduled: boolean) => void
}) {
  const [selectedStartup, setSelectedStartup] = useState("")
  const [selectedInvestor, setSelectedInvestor] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [trackOpens, setTrackOpens] = useState(true)
  const [trackClicks, setTrackClicks] = useState(true)
  const [scheduleSend, setScheduleSend] = useState(false)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")

  const handleTemplateSelect = (templateId: string) => {
    const template = emailTemplates.find((t) => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setSubject(template.subject)
      setBody(template.body)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col" onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>New Outreach</DialogTitle>
          <DialogDescription>
            Compose and send outreach to investors
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Startup Selection */}
            <div className="space-y-2">
              <Label>Startup</Label>
              <Select value={selectedStartup} onValueChange={setSelectedStartup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select startup" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="s1">TechCorp AI</SelectItem>
                  <SelectItem value="s2">HealthX</SelectItem>
                  <SelectItem value="s3">GreenEnergy</SelectItem>
                  <SelectItem value="s4">DataMesh</SelectItem>
                  <SelectItem value="s5">LogiFlow</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Investor Selection */}
            <div className="space-y-2">
              <Label>Investor Contact</Label>
              <Select value={selectedInvestor} onValueChange={setSelectedInvestor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select investor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="i1">John Smith (Sequoia)</SelectItem>
                  <SelectItem value="i2">Sarah Chen (a16z)</SelectItem>
                  <SelectItem value="i3">Mike Johnson (Accel)</SelectItem>
                  <SelectItem value="i4">Lisa Wong (Lightspeed)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Template Selection */}
          <div className="space-y-2">
            <Label>Email Template</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a template or start fresh" />
              </SelectTrigger>
              <SelectContent>
                {emailTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center gap-2">
                      <span>{template.name}</span>
                      <Badge variant="secondary" className="text-[10px]">
                        {template.category}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label>Subject Line</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject line"
            />
            <p className="text-xs text-muted-foreground">
              Use merge fields: {"{startup_name}"}, {"{investor_name}"}, {"{sector}"}
            </p>
          </div>

          {/* Body */}
          <div className="space-y-2">
            <Label>Email Body</Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Compose your email..."
              className="min-h-[200px]"
            />
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <Link2 className="w-6 h-6 mx-auto text-muted-foreground mb-2 block" />
              <p className="text-sm text-muted-foreground">
                Drag files here or{" "}
                <label className="text-primary hover:underline cursor-pointer">
                  browse
                  <input type="file" className="hidden" multiple accept=".pdf,.doc,.docx,.xlsx" onChange={() => {}} />
                </label>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Link to existing documents in the document library
              </p>
            </div>
          </div>

          {/* Tracking Options */}
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <Label className="text-sm font-medium">Tracking Options</Label>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Track email opens</span>
              </div>
              <Switch checked={trackOpens} onCheckedChange={setTrackOpens} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MousePointer className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Track link clicks</span>
              </div>
              <Switch checked={trackClicks} onCheckedChange={setTrackClicks} />
            </div>
          </div>

          {/* Schedule Send */}
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Schedule send</span>
              </div>
              <Switch checked={scheduleSend} onCheckedChange={setScheduleSend} />
            </div>
            {scheduleSend && (
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="space-y-2">
                  <Label className="text-xs">Date</Label>
                  <Input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Time</Label>
                  <Select value={scheduleTime} onValueChange={setScheduleTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={onClose} className="bg-transparent">
            Cancel
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent"
            onClick={() => onSaveDraft?.()}
          >
            <FileText className="w-4 h-4 mr-1.5" />
            Save as Draft
          </Button>
          <Button
            onClick={() => onSend?.(scheduleSend)}
          >
            <Send className="w-4 h-4 mr-1.5" />
            {scheduleSend ? "Schedule Send" : "Send Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function TemplatesSheet({
  open,
  onOpenChange,
  templates,
  onTemplatePreview,
  onTemplateEdit,
  onTemplateDuplicate,
  onTemplateDelete,
  onCreateNew,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  templates: EmailTemplate[]
  onTemplatePreview?: (t: EmailTemplate) => void
  onTemplateEdit?: (t: EmailTemplate) => void
  onTemplateDuplicate?: (t: EmailTemplate) => void
  onTemplateDelete?: (t: EmailTemplate) => void
  onCreateNew?: () => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-8" onCloseAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle>Email Templates</SheetTitle>
          <SheetDescription>
            Manage your outreach email templates
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <Button className="w-full" onClick={() => onCreateNew?.()}>
            <Plus className="w-4 h-4 mr-1.5" />
            Create New Template
          </Button>

          <div className="space-y-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className="p-4 border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      <Badge variant="secondary" className="text-[10px]">
                        {template.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {template.subject}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Used {template.usageCount} times
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onTemplatePreview?.(template)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onTemplateEdit?.(template)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onTemplateDuplicate?.(template)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onClick={() => onTemplateDelete?.(template)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function FollowUpRemindersPanel({
  reminders,
  onFollowUp,
  onDismiss,
}: {
  reminders: FollowUpReminder[]
  onFollowUp: (reminder: FollowUpReminder) => void
  onDismiss: (reminderId: string) => void
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "border-l bg-card hidden xl:flex flex-col transition-[width] duration-200 shrink-0",
        collapsed ? "w-12" : "w-80"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b shrink-0 min-h-[52px]">
        {collapsed ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => setCollapsed(false)}
            title="Expand Follow-up Reminders"
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </Button>
        ) : (
          <>
            <h3 className="font-semibold text-sm flex items-center gap-2 min-w-0">
              <Bell className="w-4 h-4 text-primary shrink-0" />
              <span className="truncate">Follow-up Reminders</span>
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <Badge variant="secondary" className="text-xs">
                {reminders.length}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCollapsed(true)}
                title="Collapse Follow-up Reminders"
              >
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          </>
        )}
      </div>

      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="p-3 border rounded-lg bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {reminder.outreach.investor.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {reminder.outreach.startup.name} · {reminder.daysSinceContact} days ago
                  </p>
                  <p className="text-xs text-primary mt-1">
                    {reminder.suggestedAction}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button size="sm" className="h-7 text-xs" onClick={() => onFollowUp(reminder)}>
                      <Send className="w-3 h-3 mr-1" />
                      Follow-up
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onDismiss(reminder.id)}>
                      <X className="w-3 h-3 mr-1" />
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {reminders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
              <p className="text-sm">All caught up!</p>
              <p className="text-xs">No pending follow-ups</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Loading() {
  return null
}

export default function OutreachTrackerPage() {
  const { toast } = useToast()
  const [outreachItems, setOutreachItems] = useState<OutreachItem[]>(() => [...sampleOutreach])
  const [remindersList, setRemindersList] = useState<FollowUpReminder[]>(() => [...followUpReminders])
  const [templatesList, setTemplatesList] = useState<EmailTemplate[]>(() => [...emailTemplates])
  const [templatesSheetOpen, setTemplatesSheetOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"all" | "by_startup" | "by_investor">("all")
  const [dateRange, setDateRange] = useState("30")
  const [statusFilter, setStatusFilter] = useState<OutreachStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOutreach, setSelectedOutreach] = useState<OutreachItem | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showComposer, setShowComposer] = useState(false)
  const [collapsedColumns, setCollapsedColumns] = useState<OutreachStatus[]>([])
  const [dragOverColumn, setDragOverColumn] = useState<OutreachStatus | null>(null)
  const [selectedStartupId, setSelectedStartupId] = useState<string>("")
  const [selectedInvestorId, setSelectedInvestorId] = useState<string>("")

  // Unique startups and investors for tab filters
  const uniqueStartups = outreachItems.reduce(
    (acc, item) => {
      if (!acc.some((s) => s.id === item.startup.id)) acc.push(item.startup)
      return acc
    },
    [] as { id: string; name: string; sector: string }[]
  )
  const uniqueInvestors = outreachItems.reduce(
    (acc, item) => {
      const inv = item.investor
      if (!acc.some((i) => i.id === inv.id)) acc.push(inv)
      return acc
    },
    [] as { id: string; name: string; firm: string; email: string }[]
  )

  // Filter outreach (status, search, and tab filters)
  const filteredOutreach = outreachItems.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) return false
    if (viewMode === "by_startup" && uniqueStartups.length > 0) {
      const startupId = selectedStartupId || uniqueStartups[0].id
      if (item.startup.id !== startupId) return false
    }
    if (viewMode === "by_investor" && uniqueInvestors.length > 0) {
      const investorId = selectedInvestorId || uniqueInvestors[0].id
      if (item.investor.id !== investorId) return false
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        item.startup.name.toLowerCase().includes(query) ||
        item.investor.name.toLowerCase().includes(query) ||
        item.investor.firm.toLowerCase().includes(query) ||
        item.subject.toLowerCase().includes(query)
      )
    }
    return true
  })

  // Group by status for kanban
  const groupedOutreach = groupByStatus(filteredOutreach)

  // Calculate stats
  const totalSent = outreachItems.filter((o) => o.status !== "draft").length
  const totalOpened = outreachItems.filter((o) => o.openCount > 0).length
  const totalResponded = outreachItems.filter((o) => o.responseAt).length
  const totalMeetings = outreachItems.filter((o) => o.status === "meeting_set").length

  const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0
  const responseRate = totalSent > 0 ? Math.round((totalResponded / totalSent) * 100) : 0

  const toggleColumnCollapse = (status: OutreachStatus) => {
    setCollapsedColumns((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  const handleViewDetails = (outreach: OutreachItem) => {
    setSelectedOutreach(outreach)
    setShowDetailModal(true)
  }

  const handleCopyEmail = (outreach: OutreachItem) => {
    const body = `Hi ${outreach.investor.name.split(" ")[0]},\n\nI wanted to introduce you to ${outreach.startup.name}, an exciting ${outreach.startup.sector} company that I believe aligns well with your investment thesis.\n\nThe company is building next-generation solutions in the ${outreach.startup.sector.toLowerCase()} space, with strong early traction and a world-class founding team.\n\nWould you be open to a 30-minute call to learn more?\n\nBest regards,\nInvestment Team\nAnthill Ventures`
    const text = `Subject: ${outreach.subject}\n\n${body}`
    navigator.clipboard.writeText(text)
    toast({ title: "Copied to clipboard", description: "Email content copied." })
  }

  const handleSendFollowUpFromDetail = (outreach: OutreachItem) => {
    setShowDetailModal(false)
    setSelectedOutreach(outreach)
    setTimeout(() => setShowComposer(true), 0)
  }

  const handleDeleteOutreach = (outreach: OutreachItem) => {
    setOutreachItems((prev) => prev.filter((o) => o.id !== outreach.id))
    setRemindersList((prev) => prev.filter((r) => r.outreach.id !== outreach.id))
    toast({ title: "Outreach removed", description: "The outreach entry has been deleted.", variant: "destructive" })
  }

  const handleSaveDraft = () => {
    setShowComposer(false)
    toast({ title: "Draft saved", description: "Outreach saved as draft." })
  }

  const handleSendOutreach = (scheduled: boolean) => {
    setShowComposer(false)
    toast({
      title: scheduled ? "Send scheduled" : "Outreach sent",
      description: scheduled ? "Email will be sent at the scheduled time." : "Your outreach has been sent.",
    })
  }

  const handleStatusChange = (outreachId: string, newStatus: OutreachStatus) => {
    setOutreachItems((prev) =>
      prev.map((o) => (o.id === outreachId ? { ...o, status: newStatus } : o))
    )
    toast({ title: "Status updated", description: `Outreach moved to ${statusConfig[newStatus].label}.` })
  }

  const handleDismissReminder = (reminderId: string) => {
    setRemindersList((prev) => prev.filter((r) => r.id !== reminderId))
    toast({ title: "Reminder dismissed", description: "Follow-up reminder removed." })
  }

  const handleFollowUpFromReminder = (reminder: FollowUpReminder) => {
    setSelectedOutreach(reminder.outreach)
    setShowComposer(true)
    setRemindersList((prev) => prev.filter((r) => r.id !== reminder.id))
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader title="Outreach Tracker" />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col min-w-0">
            {/* Page Header */}
            <div className="px-4 md:px-6 py-4 border-b bg-card">
              <div className="flex flex-col gap-4">
                {/* Breadcrumb */}
                <PageBreadcrumb segments={[{ label: "Outreach" }]} />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                      <Send className="w-6 h-6 text-primary" />
                      Outreach Tracker
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Track and manage investor outreach communications
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="bg-transparent" onClick={() => setTemplatesSheetOpen(true)}>
                      <FileText className="w-4 h-4 mr-1.5" />
                      Templates
                    </Button>
                    <Button onClick={() => setShowComposer(true)}>
                      <Plus className="w-4 h-4 mr-1.5" />
                      New Outreach
                    </Button>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-4 gap-4">
                  <Card className="p-3 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setStatusFilter(statusFilter === "sent" ? "all" : "sent")}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Sent</p>
                        <p className="text-2xl font-bold text-foreground">{totalSent}</p>
                      </div>
                      <Send className="w-8 h-8 text-blue-600/30 dark:text-blue-400/30" />
                    </div>
                  </Card>
                  <Card className="p-3 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setStatusFilter(statusFilter === "opened" ? "all" : "opened")}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Opened</p>
                        <p className="text-2xl font-bold text-foreground">
                          {totalOpened}{" "}
                          <span className="text-sm font-normal text-emerald-600 dark:text-emerald-400">({openRate}%)</span>
                        </p>
                      </div>
                      <MailOpen className="w-8 h-8 text-amber-600/30 dark:text-amber-400/30" />
                    </div>
                  </Card>
                  <Card className="p-3 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setStatusFilter(statusFilter === "responded" ? "all" : "responded")}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Responded</p>
                        <p className="text-2xl font-bold text-foreground">
                          {totalResponded}{" "}
                          <span className="text-sm font-normal text-emerald-600 dark:text-emerald-400">({responseRate}%)</span>
                        </p>
                      </div>
                      <MessageSquare className="w-8 h-8 text-purple-600/30 dark:text-purple-400/30" />
                    </div>
                  </Card>
                  <Card className="p-3 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setStatusFilter(statusFilter === "meeting_set" ? "all" : "meeting_set")}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Meetings</p>
                        <p className="text-2xl font-bold text-foreground">{totalMeetings}</p>
                      </div>
                      <Calendar className="w-8 h-8 text-emerald-600/30 dark:text-emerald-400/30" />
                    </div>
                  </Card>
                </div>

                {/* Filters */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
                      <TabsList className="justify-start rounded-lg border border-border bg-muted/50 h-auto p-1">
                        <TabsTrigger
                          value="all"
                          className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground px-4 py-2 transition-colors"
                        >
                          All Outreach
                        </TabsTrigger>
                        <TabsTrigger
                          value="by_startup"
                          className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground px-4 py-2 transition-colors"
                        >
                          By Startup
                        </TabsTrigger>
                        <TabsTrigger
                          value="by_investor"
                          className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground px-4 py-2 transition-colors"
                        >
                          By Investor
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                    {viewMode === "by_startup" && uniqueStartups.length > 0 && (
                      <Select
                        value={selectedStartupId || uniqueStartups[0]?.id || ""}
                        onValueChange={setSelectedStartupId}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select startup" />
                        </SelectTrigger>
                        <SelectContent>
                          {uniqueStartups.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {viewMode === "by_investor" && uniqueInvestors.length > 0 && (
                      <Select
                        value={selectedInvestorId || uniqueInvestors[0]?.id || ""}
                        onValueChange={setSelectedInvestorId}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select investor" />
                        </SelectTrigger>
                        <SelectContent>
                          {uniqueInvestors.map((i) => (
                            <SelectItem key={i.id} value={i.id}>
                              {i.name} ({i.firm})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search outreach..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>

                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="90">Last 90 days</SelectItem>
                        <SelectItem value="custom">Custom range</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={statusFilter}
                      onValueChange={(v) => setStatusFilter(v as OutreachStatus | "all")}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="opened">Opened</SelectItem>
                        <SelectItem value="responded">Responded</SelectItem>
                        <SelectItem value="meeting_set">Meeting Set</SelectItem>
                        <SelectItem value="passed">Passed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto px-4 md:px-6 py-4">
              <div className="flex gap-4 h-full">
                {(Object.keys(statusConfig) as OutreachStatus[]).map((status) => {
                  const config = statusConfig[status]
                  const items = groupedOutreach[status]
                  const isCollapsed = collapsedColumns.includes(status)

                  return (
                    <div
                      key={status}
                      className={cn(
                        "flex flex-col rounded-xl border bg-card transition-all shrink-0",
                        isCollapsed ? "w-12" : "w-72"
                      )}
                    >
                      {/* Column Header */}
                      <div className={cn("flex items-center gap-2 p-3 border-b", config.bgColor)}>
                        <button
                          onClick={() => toggleColumnCollapse(status)}
                          className="p-0.5 hover:bg-background/50 rounded transition-colors"
                        >
                          {isCollapsed ? (
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>

                        {isCollapsed ? (
                          <div className="flex-1 flex flex-col items-center gap-2 py-2">
                            <span
                              className={cn(
                                "text-xs font-semibold tracking-wider",
                                config.color,
                                "[writing-mode:vertical-rl] rotate-180"
                              )}
                            >
{config.label.toUpperCase()}
  </span>
  <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-md", config.countBadgeClass)}>
  {items.length}
  </span>
  </div>
  ) : (
  <>
  <config.icon className={cn("w-4 h-4", config.color)} />
  <span className={cn("text-xs font-semibold tracking-wider flex-1", config.color)}>
  {config.label.toUpperCase()}
  </span>
  <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-md", config.countBadgeClass)}>
  {items.length}
  </span>
  </>
  )}
                      </div>

                      {/* Cards Container - drop zone */}
                      {!isCollapsed && (
                        <div
                          className={cn(
                            "flex-1 overflow-y-auto p-2 space-y-2 min-h-[120px] rounded-b-xl transition-colors",
                            dragOverColumn === status && "bg-primary/5 ring-2 ring-primary/30 ring-inset"
                          )}
                          onDragOver={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            e.dataTransfer.dropEffect = "move"
                            setDragOverColumn(status)
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault()
                            if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverColumn(null)
                          }}
                          onDrop={(e) => {
                            e.preventDefault()
                            setDragOverColumn(null)
                            const raw = e.dataTransfer.getData("application/json")
                            if (!raw) return
                            try {
                              const { id } = JSON.parse(raw) as { id: string }
                              handleStatusChange(id, status)
                            } catch {
                              const id = e.dataTransfer.getData("text/plain")
                              if (id) handleStatusChange(id, status)
                            }
                          }}
                        >
                          {items.map((item) => (
                            <OutreachCard
                              key={item.id}
                              outreach={item}
                              onViewDetails={() => handleViewDetails(item)}
                              onSendFollowUp={() => {
                                setSelectedOutreach(item)
                                setShowComposer(true)
                              }}
                              onLogResponse={() => handleViewDetails(item)}
                              onDelete={() => handleDeleteOutreach(item)}
                            />
                          ))}

                          {items.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                              <p className="text-sm">No outreach</p>
                              <p className="text-xs">Drop cards here</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Follow-up Reminders Panel */}
          <FollowUpRemindersPanel
            reminders={remindersList}
            onFollowUp={handleFollowUpFromReminder}
            onDismiss={handleDismissReminder}
          />
        </main>
      </div>

      {/* Modals */}
      <OutreachDetailModal
        outreach={selectedOutreach}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedOutreach(null)
        }}
        onCopyEmail={handleCopyEmail}
        onSendFollowUp={handleSendFollowUpFromDetail}
      />

      <OutreachComposerModal
        isOpen={showComposer}
        onClose={() => setShowComposer(false)}
        onSaveDraft={handleSaveDraft}
        onSend={handleSendOutreach}
      />

      <TemplatesSheet
        open={templatesSheetOpen}
        onOpenChange={setTemplatesSheetOpen}
        templates={templatesList}
        onCreateNew={() => {
          toast({ title: "New template", description: "Create template form would open here." })
        }}
        onTemplatePreview={() => toast({ title: "Preview", description: "Template preview would open here." })}
        onTemplateEdit={() => toast({ title: "Edit template", description: "Edit form would open here." })}
        onTemplateDuplicate={(t) => {
          setTemplatesList((prev) => [
            ...prev,
            { ...t, id: `t-${Date.now()}`, name: `${t.name} (copy)`, usageCount: 0 },
          ])
          toast({ title: "Template duplicated", description: `"${t.name}" has been duplicated.` })
        }}
        onTemplateDelete={(t) => {
          setTemplatesList((prev) => prev.filter((x) => x.id !== t.id))
          toast({ title: "Template deleted", description: `"${t.name}" has been removed.`, variant: "destructive" })
        }}
      />

      <Toaster />
    </div>
  )
}

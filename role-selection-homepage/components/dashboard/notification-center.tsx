"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import {
  Bell,
  Settings,
  AtSign,
  Sparkles,
  Eye,
  Clock,
  ArrowRightLeft,
  CheckCircle2,
  X,
  ArrowRight,
  Rocket,
  Users,
  TrendingUp,
  MessageSquare,
  Calendar,
  FileText,
  Target,
  Trophy,
  Mail,
  Smartphone,
  BellRing,
  Moon,
  Sun,
  AlarmClock,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useAuth, type UserRole } from "@/lib/auth-context"

type NotificationType = 
  | "mention" 
  | "match" 
  | "document" 
  | "task" 
  | "pipeline" 
  | "investor" 
  | "startup" 
  | "deal"
  | "profile-view"
  | "meeting-request"
  | "campaign-milestone"
  | "metrics-update"
  | "portfolio-update"

interface Notification {
  id: string
  type: NotificationType
  title: string
  description: string
  detail?: string
  time: string
  timestamp: Date
  read: boolean
  dismissed?: boolean
  snoozedUntil?: Date
  // Which roles should see this notification
  forRoles?: UserRole[]
  // Priority for sorting
  priority?: "high" | "normal" | "low"
  actionButton?: {
    label: string
    href?: string
    onClick?: () => void
  }
  secondaryButton?: {
    label: string
    onClick?: () => void
  }
}

// Notification categories by role (from requirements)
type NotificationCategory = 
  | "profile-view" 
  | "investor-match" 
  | "meeting-request" 
  | "document-comment" 
  | "campaign-milestone"
  | "deal-match"
  | "metrics-update"
  | "portfolio-update"
  | "meeting-scheduled"
  | "document-shared"
  | "deal-status"
  | "investor-response"
  | "client-document"
  | "task-assigned"
  | "match-ready"
  | "mention"

// Role-specific notification tabs
const getRoleTabs = (role: UserRole | null) => {
  switch (role) {
    case "startup-founder":
      return [
        { id: "all", label: "All" },
        { id: "investors", label: "Investors" },
        { id: "documents", label: "Documents" },
        { id: "milestones", label: "Milestones" },
      ]
    case "institutional-investor":
      return [
        { id: "all", label: "All" },
        { id: "deals", label: "New Deals" },
        { id: "portfolio", label: "Portfolio" },
        { id: "documents", label: "Documents" },
      ]
    case "angel-investor":
      return [
        { id: "all", label: "All" },
        { id: "deals", label: "Deals" },
        { id: "matches", label: "Matches" },
        { id: "meetings", label: "Meetings" },
      ]
    case "research-analyst":
      return [
        { id: "all", label: "All" },
        { id: "mentions", label: "Mentions" },
        { id: "documents", label: "Reports" },
        { id: "tasks", label: "Tasks" },
      ]
    case "investment-banker":
    case "corporate-development":
      return [
        { id: "all", label: "All" },
        { id: "deals", label: "Deals" },
        { id: "matches", label: "Matches" },
        { id: "tasks", label: "Tasks" },
      ]
    default:
      return [
        { id: "all", label: "All" },
        { id: "mentions", label: "Mentions" },
        { id: "matches", label: "Matches" },
        { id: "documents", label: "Documents" },
      ]
  }
}

// Role-specific mock notifications
const mockNotifications: Notification[] = [
  // FOUNDER notifications
  {
    id: "f1",
    type: "profile-view",
    title: "Investor viewed your profile",
    description: "Sarah Chen from Sequoia Capital",
    detail: "Viewed your pitch deck for 8 minutes",
    time: "5 min ago",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    priority: "high",
    forRoles: ["startup-founder"],
    actionButton: { label: "View Profile", href: "/investors/sequoia" },
  },
  {
    id: "f2",
    type: "match",
    title: "New investor match (92%)",
    description: "Tiger Global matches your criteria",
    detail: "Series A, $5-15M check size, SaaS focus",
    time: "15 min ago",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
    priority: "high",
    forRoles: ["startup-founder"],
    actionButton: { label: "View Match", href: "/matching" },
  },
  {
    id: "f3",
    type: "meeting-request",
    title: "Meeting request received",
    description: "John Park from a]16z wants to meet",
    detail: "Intro call - 30 minutes",
    time: "1 hour ago",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    read: false,
    priority: "high",
    forRoles: ["startup-founder"],
    actionButton: { label: "Accept", onClick: () => {} },
    secondaryButton: { label: "Decline", onClick: () => {} },
  },
  {
    id: "f4",
    type: "document",
    title: "New comment on your deck",
    description: "Mike Lee commented on slide 5",
    detail: '"Love the market sizing - can you share the source?"',
    time: "2 hours ago",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    forRoles: ["startup-founder"],
    actionButton: { label: "Reply", href: "/documents" },
  },
  {
    id: "f5",
    type: "campaign-milestone",
    title: "Campaign milestone reached",
    description: "Series A campaign: 50% of target raised",
    detail: "$2.5M committed of $5M target",
    time: "3 hours ago",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: false,
    priority: "high",
    forRoles: ["startup-founder"],
    actionButton: { label: "View Campaign", href: "/raises" },
  },

  // INVESTOR notifications
  {
    id: "i1",
    type: "deal",
    title: "New deal matching your criteria",
    description: "CloudAI Systems - Series A",
    detail: "AI/ML, $8M raise, 3x YoY growth",
    time: "10 min ago",
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    read: false,
    priority: "high",
    forRoles: ["institutional-investor", "angel-investor"],
    actionButton: { label: "Review Deal", href: "/startups/cloudai" },
  },
  {
    id: "i2",
    type: "metrics-update",
    title: "Startup updated metrics",
    description: "FinApp Inc shared Q4 numbers",
    detail: "Revenue up 45%, added 12 enterprise clients",
    time: "30 min ago",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    forRoles: ["institutional-investor", "angel-investor"],
    actionButton: { label: "View Metrics", href: "/startups/finapp" },
  },
  {
    id: "i3",
    type: "portfolio-update",
    title: "Portfolio company update",
    description: "TechCorp AI raised bridge round",
    detail: "$1.5M from existing investors",
    time: "1 hour ago",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    read: true,
    forRoles: ["institutional-investor"],
    actionButton: { label: "View Details", href: "/portfolio/techcorp" },
  },
  {
    id: "i4",
    type: "meeting-request",
    title: "Meeting scheduled",
    description: "Founder call with HealthBridge CEO",
    detail: "Tomorrow at 2:00 PM PST",
    time: "2 hours ago",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
    forRoles: ["institutional-investor", "angel-investor"],
  },
  {
    id: "i5",
    type: "document",
    title: "Document shared with you",
    description: "DataFlow Inc shared their data room",
    detail: "Financial model, cap table, and projections",
    time: "3 hours ago",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: false,
    forRoles: ["institutional-investor", "angel-investor"],
    actionButton: { label: "Open Data Room", href: "/documents" },
  },

  // BANKER notifications
  {
    id: "b1",
    type: "pipeline",
    title: "Deal status changed",
    description: "TechCorp AI moved to Due Diligence",
    detail: "Updated by Rahul Shah",
    time: "5 min ago",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    priority: "high",
    forRoles: ["investment-banker", "corporate-development"],
    actionButton: { label: "View Deal", href: "/pipeline" },
  },
  {
    id: "b2",
    type: "investor",
    title: "Investor responded",
    description: "Sequoia passed on FinApp deal",
    detail: '"Not a fit for our current thesis"',
    time: "20 min ago",
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    read: false,
    forRoles: ["investment-banker"],
    actionButton: { label: "View Response", href: "/outreach" },
  },
  {
    id: "b3",
    type: "document",
    title: "Client uploaded document",
    description: "CloudAI added updated financials",
    detail: "Q4 2024 Financial Model.xlsx",
    time: "1 hour ago",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    read: false,
    forRoles: ["investment-banker", "corporate-development"],
    actionButton: { label: "Review Document", href: "/documents" },
  },
  {
    id: "b4",
    type: "task",
    title: "Task assigned to you",
    description: "Review HealthBridge term sheet",
    detail: "Due in 2 hours - High Priority",
    time: "1.5 hours ago",
    timestamp: new Date(Date.now() - 90 * 60 * 1000),
    read: false,
    priority: "high",
    forRoles: ["investment-banker", "research-analyst", "corporate-development"],
    actionButton: { label: "Start Review", href: "/tasks" },
    secondaryButton: { label: "Snooze", onClick: () => {} },
  },
  {
    id: "b5",
    type: "match",
    title: "Match results ready",
    description: "8 new matches for DataFlow Inc",
    detail: "Including 3 high-quality matches (85%+)",
    time: "2 hours ago",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    forRoles: ["investment-banker"],
    actionButton: { label: "View Matches", href: "/matching" },
  },

  // ANALYST notifications
  {
    id: "a1",
    type: "mention",
    title: "@Priya mentioned you",
    description: "on TechCorp AI analysis",
    detail: '"Can you review the competitive landscape section?"',
    time: "10 min ago",
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    read: false,
    forRoles: ["research-analyst"],
    actionButton: { label: "View Comment", href: "/startups/techcorp" },
  },
  {
    id: "a2",
    type: "task",
    title: "Task due soon",
    description: "Complete DD report for CloudAI",
    detail: "Due in 3 hours",
    time: "30 min ago",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    priority: "high",
    forRoles: ["research-analyst"],
    actionButton: { label: "Open Report", href: "/reports" },
    secondaryButton: { label: "Request Extension", onClick: () => {} },
  },
]

const typeConfig: Record<
  NotificationType,
  { icon: typeof Bell; bg: string; color: string }
> = {
  mention: { icon: AtSign, bg: "bg-blue-500/10", color: "text-blue-500" },
  match: { icon: Sparkles, bg: "bg-emerald-500/10", color: "text-emerald-500" },
  document: { icon: FileText, bg: "bg-purple-500/10", color: "text-purple-500" },
  task: { icon: Clock, bg: "bg-amber-500/10", color: "text-amber-500" },
  pipeline: { icon: ArrowRightLeft, bg: "bg-primary/10", color: "text-primary" },
  investor: { icon: Users, bg: "bg-teal-500/10", color: "text-teal-500" },
  startup: { icon: Rocket, bg: "bg-orange-500/10", color: "text-orange-500" },
  deal: { icon: TrendingUp, bg: "bg-rose-500/10", color: "text-rose-500" },
  "profile-view": { icon: Eye, bg: "bg-cyan-500/10", color: "text-cyan-500" },
  "meeting-request": { icon: Calendar, bg: "bg-indigo-500/10", color: "text-indigo-500" },
  "campaign-milestone": { icon: Trophy, bg: "bg-yellow-500/10", color: "text-yellow-500" },
  "metrics-update": { icon: TrendingUp, bg: "bg-green-500/10", color: "text-green-500" },
  "portfolio-update": { icon: Target, bg: "bg-pink-500/10", color: "text-pink-500" },
}

// Category configuration for preferences
type PreferenceCategory = 
  | "profile-views"
  | "investor-matches"
  | "meeting-requests"
  | "document-activity"
  | "campaign-milestones"
  | "deal-updates"
  | "metrics-updates"
  | "portfolio-updates"
  | "task-assignments"
  | "mentions"

interface CategoryPreference {
  email: boolean
  push: boolean
  inApp: boolean
  digest: boolean // Whether to bundle into daily digest
}

interface NotificationPreferences {
  categories: Record<PreferenceCategory, CategoryPreference>
  digestTime: string // e.g., "09:00"
  quietHoursEnabled: boolean
  quietHoursStart: string // e.g., "22:00"
  quietHoursEnd: string // e.g., "08:00"
}

// Role-specific default preferences
const getRoleDefaultPreferences = (role: UserRole | null): NotificationPreferences => {
  const basePreferences: NotificationPreferences = {
    categories: {
      "profile-views": { email: false, push: true, inApp: true, digest: false },
      "investor-matches": { email: true, push: true, inApp: true, digest: false },
      "meeting-requests": { email: true, push: true, inApp: true, digest: false },
      "document-activity": { email: false, push: true, inApp: true, digest: true },
      "campaign-milestones": { email: true, push: true, inApp: true, digest: false },
      "deal-updates": { email: true, push: true, inApp: true, digest: false },
      "metrics-updates": { email: false, push: false, inApp: true, digest: true },
      "portfolio-updates": { email: true, push: true, inApp: true, digest: false },
      "task-assignments": { email: true, push: true, inApp: true, digest: false },
      "mentions": { email: true, push: true, inApp: true, digest: false },
    },
    digestTime: "09:00",
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
  }

  // Customize based on role
  switch (role) {
    case "startup-founder":
      // Founders want immediate notification of investor activity
      basePreferences.categories["profile-views"].push = true
      basePreferences.categories["investor-matches"].digest = false
      break
    case "institutional-investor":
      // Institutional investors prefer daily digests for new deals
      basePreferences.categories["deal-updates"].digest = true
      break
    case "angel-investor":
      // Angels want real-time deal notifications
      basePreferences.categories["deal-updates"].digest = false
      break
    case "investment-banker":
      // Bankers need immediate task and deal notifications
      basePreferences.categories["task-assignments"].push = true
      basePreferences.categories["deal-updates"].push = true
      break
  }

  return basePreferences
}

// Get preference categories relevant to each role
const getRolePreferenceCategories = (role: UserRole | null): { key: PreferenceCategory; label: string }[] => {
  switch (role) {
    case "startup-founder":
      return [
        { key: "profile-views", label: "Profile/Deck Views" },
        { key: "investor-matches", label: "Investor Matches (85%+)" },
        { key: "meeting-requests", label: "Meeting Requests" },
        { key: "document-activity", label: "Document Comments" },
        { key: "campaign-milestones", label: "Campaign Milestones" },
      ]
    case "institutional-investor":
    case "angel-investor":
      return [
        { key: "deal-updates", label: "New Deals Matching Criteria" },
        { key: "metrics-updates", label: "Startup Metrics Updates" },
        { key: "portfolio-updates", label: "Portfolio Company Updates" },
        { key: "meeting-requests", label: "Meeting Scheduled" },
        { key: "document-activity", label: "Documents Shared" },
      ]
    case "investment-banker":
    case "corporate-development":
      return [
        { key: "deal-updates", label: "Deal Status Changes" },
        { key: "investor-matches", label: "Investor Responses" },
        { key: "document-activity", label: "Client Documents" },
        { key: "task-assignments", label: "Tasks Assigned/Due" },
        { key: "mentions", label: "Match Results Ready" },
      ]
    case "research-analyst":
      return [
        { key: "mentions", label: "Mentions" },
        { key: "task-assignments", label: "Tasks Assigned/Due" },
        { key: "document-activity", label: "Report Updates" },
      ]
    default:
      return [
        { key: "mentions", label: "Mentions" },
        { key: "investor-matches", label: "Matches" },
        { key: "document-activity", label: "Documents" },
        { key: "task-assignments", label: "Tasks" },
      ]
  }
}

const defaultPreferences: NotificationPreferences = {
  categories: {
    "profile-views": { email: false, push: true, inApp: true, digest: false },
    "investor-matches": { email: true, push: true, inApp: true, digest: false },
    "meeting-requests": { email: true, push: true, inApp: true, digest: false },
    "document-activity": { email: false, push: true, inApp: true, digest: true },
    "campaign-milestones": { email: true, push: true, inApp: true, digest: false },
    "deal-updates": { email: true, push: true, inApp: true, digest: false },
    "metrics-updates": { email: false, push: false, inApp: true, digest: true },
    "portfolio-updates": { email: true, push: true, inApp: true, digest: false },
    "task-assignments": { email: true, push: true, inApp: true, digest: false },
    "mentions": { email: true, push: true, inApp: true, digest: false },
  },
  digestTime: "09:00",
  quietHoursEnabled: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "08:00",
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [notifications, setNotifications] = useState(mockNotifications)
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences)
  const { user } = useAuth()

  // Get role-specific tabs
  const currentRole = user?.activeRole || null
  const tabs = getRoleTabs(currentRole)

  // Filter notifications by role first, then by tab
  const roleFilteredNotifications = notifications.filter((n) => {
    // If no forRoles specified, show to everyone
    if (!n.forRoles) return true
    // If user has no role, show generic notifications
    if (!currentRole) return !n.forRoles || n.forRoles.length === 0
    // Check if notification is for user's role
    return n.forRoles.includes(currentRole)
  })

  const unreadCount = roleFilteredNotifications.filter((n) => !n.read).length

  // Filter notifications - exclude dismissed and snoozed
  const activeNotifications = roleFilteredNotifications.filter((n) => {
    if (n.dismissed) return false
    if (n.snoozedUntil && new Date() < n.snoozedUntil) return false
    return true
  })

  const filteredNotifications = activeNotifications.filter((n) => {
    if (activeTab === "all") return true
    if (activeTab === "mentions") return n.type === "mention"
    if (activeTab === "matches") return n.type === "match"
    if (activeTab === "documents") return n.type === "document"
    if (activeTab === "investors") return n.type === "investor" || n.type === "match" || n.type === "profile-view"
    if (activeTab === "deals") return n.type === "deal" || n.type === "pipeline" || n.type === "metrics-update"
    if (activeTab === "tasks") return n.type === "task"
    if (activeTab === "milestones") return n.type === "campaign-milestone"
    if (activeTab === "portfolio") return n.type === "portfolio-update" || n.type === "metrics-update"
    if (activeTab === "meetings") return n.type === "meeting-request"
    return true
  })

  // Sort by priority and time
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    // Unread first
    if (a.read !== b.read) return a.read ? 1 : -1
    // Then by priority
    const priorityOrder = { high: 0, normal: 1, low: 2 }
    const aPriority = priorityOrder[a.priority || "normal"]
    const bPriority = priorityOrder[b.priority || "normal"]
    if (aPriority !== bPriority) return aPriority - bPriority
    // Then by time
    return b.timestamp.getTime() - a.timestamp.getTime()
  })

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const dismissNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, dismissed: true } : n))
    )
  }

  const snoozeNotification = (id: string, minutes: number = 60) => {
    const snoozedUntil = new Date(Date.now() + minutes * 60 * 1000)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, snoozedUntil } : n))
    )
  }

  const updateCategoryPreference = (
    category: PreferenceCategory,
    channel: "email" | "push" | "inApp" | "digest",
    value: boolean
  ) => {
    setPreferences((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: {
          ...prev.categories[category],
          [channel]: value,
        },
      },
    }))
  }

  const updateGeneralPreference = <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const updatePreference = (
    category: PreferenceCategory,
    channel: "email" | "push" | "inApp" | "digest",
    value: boolean
  ) => {
    setPreferences((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: {
          ...prev.categories[category],
          [channel]: value,
        },
      },
    }))
  }

  // Get preference categories for current role
  const preferenceCategories = getRolePreferenceCategories(currentRole)

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-8 w-8">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-[10px] font-medium text-destructive-foreground rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-[min(380px,calc(100vw-1rem))] p-0"
          sideOffset={8}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-foreground">Notifications</h3>
              {currentRole && (
                <p className="text-xs text-muted-foreground">
                  Filtered for your role
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary hover:underline"
                >
                  Mark all as read
                </button>
              )}
              <button
                onClick={() => {
                  setOpen(false)
                  setPreferencesOpen(true)
                }}
                className="p-1 rounded hover:bg-muted transition-colors"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 px-3 py-2 text-xs font-medium transition-colors relative",
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="max-h-[400px] overflow-y-auto">
            {sortedNotifications.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="divide-y divide-border">
                {sortedNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRead={() => markAsRead(notification.id)}
                    onDismiss={() => dismissNotification(notification.id)}
                    onSnooze={(minutes) => snoozeNotification(notification.id, minutes)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-border">
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1 text-sm text-primary hover:underline"
            >
              View all notifications
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </PopoverContent>
      </Popover>

      {/* Enhanced Preferences Modal */}
      <Dialog open={preferencesOpen} onOpenChange={setPreferencesOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Notification Preferences</DialogTitle>
            <DialogDescription>
              Customize how and when you receive notifications.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="categories" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="delivery">Delivery</TabsTrigger>
            </TabsList>
            
            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-4 mt-4">
              {/* Header Row */}
              <div className="grid grid-cols-5 gap-2 text-xs font-medium text-muted-foreground">
                <div className="col-span-1" />
                <div className="text-center flex flex-col items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </div>
                <div className="text-center flex flex-col items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Push</span>
                </div>
                <div className="text-center flex flex-col items-center gap-1">
                  <BellRing className="w-3.5 h-3.5" />
                  <span>In-App</span>
                </div>
                <div className="text-center flex flex-col items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Digest</span>
                </div>
              </div>

              {/* Role-specific preference rows */}
              <div className="space-y-3">
                {preferenceCategories.map(({ key, label }) => (
                  <div key={key} className="grid grid-cols-5 gap-2 items-center py-2 border-b border-border/50 last:border-0">
                    <div className="text-sm text-foreground col-span-1 pr-2">{label}</div>
                    <div className="flex justify-center">
                      <Checkbox
                        checked={preferences.categories[key]?.email ?? false}
                        onCheckedChange={(checked) =>
                          updateCategoryPreference(key, "email", checked as boolean)
                        }
                      />
                    </div>
                    <div className="flex justify-center">
                      <Checkbox
                        checked={preferences.categories[key]?.push ?? false}
                        onCheckedChange={(checked) =>
                          updateCategoryPreference(key, "push", checked as boolean)
                        }
                      />
                    </div>
                    <div className="flex justify-center">
                      <Checkbox
                        checked={preferences.categories[key]?.inApp ?? true}
                        onCheckedChange={(checked) =>
                          updateCategoryPreference(key, "inApp", checked as boolean)
                        }
                      />
                    </div>
                    <div className="flex justify-center">
                      <Checkbox
                        checked={preferences.categories[key]?.digest ?? false}
                        onCheckedChange={(checked) =>
                          updateCategoryPreference(key, "digest", checked as boolean)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Delivery Tab */}
            <TabsContent value="delivery" className="space-y-6 mt-4">
              {/* Daily Digest Setting */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium">Daily Digest</h4>
                </div>
                <p className="text-xs text-muted-foreground">
                  Receive a summary of digest-enabled notifications at a specific time.
                </p>
                <div className="flex items-center gap-3">
                  <Label htmlFor="digest-time" className="text-sm">Send at:</Label>
                  <Select
                    value={preferences.digestTime}
                    onValueChange={(value) => updateGeneralPreference("digestTime", value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="07:00">7:00 AM</SelectItem>
                      <SelectItem value="08:00">8:00 AM</SelectItem>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="18:00">6:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Quiet Hours Setting */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-muted-foreground" />
                    <h4 className="text-sm font-medium">Quiet Hours</h4>
                  </div>
                  <Switch
                    checked={preferences.quietHoursEnabled}
                    onCheckedChange={(checked) => updateGeneralPreference("quietHoursEnabled", checked)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Pause push notifications during specific hours.
                </p>
                
                {preferences.quietHoursEnabled && (
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-2">
                      <Moon className="w-3.5 h-3.5 text-muted-foreground" />
                      <Select
                        value={preferences.quietHoursStart}
                        onValueChange={(value) => updateGeneralPreference("quietHoursStart", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="20:00">8:00 PM</SelectItem>
                          <SelectItem value="21:00">9:00 PM</SelectItem>
                          <SelectItem value="22:00">10:00 PM</SelectItem>
                          <SelectItem value="23:00">11:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <span className="text-xs text-muted-foreground">to</span>
                    <div className="flex items-center gap-2">
                      <Sun className="w-3.5 h-3.5 text-muted-foreground" />
                      <Select
                        value={preferences.quietHoursEnd}
                        onValueChange={(value) => updateGeneralPreference("quietHoursEnd", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="06:00">6:00 AM</SelectItem>
                          <SelectItem value="07:00">7:00 AM</SelectItem>
                          <SelectItem value="08:00">8:00 AM</SelectItem>
                          <SelectItem value="09:00">9:00 AM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setPreferencesOpen(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button onClick={() => setPreferencesOpen(false)}>Save Preferences</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function NotificationItem({
  notification,
  onRead,
  onDismiss,
  onSnooze,
}: {
  notification: Notification
  onRead: () => void
  onDismiss: () => void
  onSnooze: (minutes: number) => void
}) {
  const config = typeConfig[notification.type]
  const Icon = config.icon

  return (
    <div
      className={cn(
        "relative flex gap-3 p-3 hover:bg-muted/50 transition-colors cursor-pointer group",
        !notification.read && "bg-primary/5",
        !notification.read && "border-l-2 border-l-primary",
        notification.priority === "high" && !notification.read && "border-l-destructive"
      )}
      onClick={onRead}
    >
      {/* Icon */}
      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5", config.bg)}>
        <Icon className={cn("w-4 h-4", config.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 overflow-hidden">
        {/* Title row with priority indicator */}
        <div className="flex items-center gap-2">
          <p className={cn(
            "text-sm text-foreground truncate flex-1",
            !notification.read && "font-medium"
          )}>
            {notification.title}
          </p>
          {notification.priority === "high" && !notification.read && (
            <span className="shrink-0 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground truncate">{notification.description}</p>
        
        {/* Detail (if exists) */}
        {notification.detail && (
          <p className="text-xs text-muted-foreground mt-1 italic truncate bg-muted/50 rounded px-2 py-1">
            {notification.detail}
          </p>
        )}
        
        {/* Action buttons row */}
        {(notification.actionButton || notification.secondaryButton) && (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {notification.actionButton && (
              notification.actionButton.href ? (
                <Link href={notification.actionButton.href} onClick={(e) => e.stopPropagation()}>
                  <Button size="sm" className="h-6 text-xs px-2">
                    {notification.actionButton.label}
                    <ChevronRight className="w-3 h-3 ml-0.5" />
                  </Button>
                </Link>
              ) : (
                <Button
                  size="sm"
                  className="h-6 text-xs px-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    notification.actionButton?.onClick?.()
                  }}
                >
                  {notification.actionButton.label}
                </Button>
              )
            )}
            {notification.secondaryButton && (
              <Button
                size="sm"
                variant="outline"
                className="h-6 text-xs px-2 bg-transparent"
                onClick={(e) => {
                  e.stopPropagation()
                  notification.secondaryButton?.onClick?.()
                }}
              >
                {notification.secondaryButton.label}
              </Button>
            )}
          </div>
        )}

        {/* Timestamp */}
        <p className="text-[11px] text-muted-foreground mt-1.5">{notification.time}</p>
      </div>

      {/* Quick action buttons - top right, visible on hover */}
      <div className="absolute top-2 right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm rounded-md p-0.5">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onSnooze(60)
          }}
          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Snooze 1hr"
        >
          <AlarmClock className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDismiss()
          }}
          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mb-4">
        <CheckCircle2 className="w-8 h-8 text-primary" />
      </div>
      <h4 className="font-medium text-foreground mb-1">You&apos;re all caught up!</h4>
      <p className="text-sm text-muted-foreground text-center max-w-[200px]">
        No new notifications. We&apos;ll let you know when something needs your attention.
      </p>
    </div>
  )
}

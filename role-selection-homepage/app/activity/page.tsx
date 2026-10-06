"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import {
  ArrowRightLeft,
  AtSign,
  Check,
  CheckCircle2,
  ChevronRight,
  Eye,
  FileText,
  Filter,
  LayoutList,
  MessageSquare,
  MoreHorizontal,
  MoveRight,
  Reply,
  Share2,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { useToast } from "@/hooks/use-toast"
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb"

interface Activity {
  id: string
  type: "match" | "stage_change" | "comment" | "document_view" | "task_completed" | "mention"
  user?: {
    name: string
    initials: string
    avatar?: string
  }
  content: {
    action: string
    target?: string
    targetLink?: string
    secondary?: string
    preview?: string
    matchScore?: number
    from?: string
    to?: string
    readTime?: string
    pagesViewed?: number
  }
  timestamp: string
  isRead: boolean
  isMention?: boolean
}

const activities: Activity[] = [
  {
    id: "1",
    type: "match",
    content: {
      action: "New match created",
      target: "FinApp Inc",
      targetLink: "/startups/finapp",
      secondary: "Sequoia Capital",
      matchScore: 87,
    },
    timestamp: "15 min ago",
    isRead: false,
  },
  {
    id: "2",
    type: "stage_change",
    user: { name: "Priya Sharma", initials: "PS" },
    content: {
      action: "moved",
      target: "TechCorp AI",
      targetLink: "/startups/techcorp",
      from: "Screening",
      to: "Due Diligence",
    },
    timestamp: "2 min ago",
    isRead: false,
  },
  {
    id: "3",
    type: "comment",
    user: { name: "Rahul Singh", initials: "RS" },
    content: {
      action: "commented on",
      target: "CloudAI",
      targetLink: "/startups/cloudai",
      preview: "We need to review their unit economics before moving forward with the next stage...",
    },
    timestamp: "1 hour ago",
    isRead: true,
  },
  {
    id: "4",
    type: "document_view",
    content: {
      action: "viewed",
      target: "TechCorp deck",
      targetLink: "/documents/techcorp-deck",
      secondary: "ABC Fund",
      readTime: "4 min",
      pagesViewed: 12,
    },
    timestamp: "2 hours ago",
    isRead: true,
  },
  {
    id: "5",
    type: "task_completed",
    user: { name: "Amit Kumar", initials: "AK" },
    content: {
      action: "completed",
      target: "Review FinApp financials",
      secondary: "Assigned to Due Diligence team",
    },
    timestamp: "3 hours ago",
    isRead: true,
  },
  {
    id: "6",
    type: "mention",
    user: { name: "Priya Sharma", initials: "PS" },
    content: {
      action: "mentioned you in",
      target: "CloudAI discussion",
      targetLink: "/startups/cloudai",
      preview: "Hey @John, can you review this startup's traction metrics?",
    },
    timestamp: "5 hours ago",
    isRead: false,
    isMention: true,
  },
  {
    id: "7",
    type: "match",
    content: {
      action: "New match created",
      target: "HealthBridge",
      targetLink: "/startups/healthbridge",
      secondary: "Lightspeed Ventures",
      matchScore: 92,
    },
    timestamp: "6 hours ago",
    isRead: true,
  },
  {
    id: "8",
    type: "stage_change",
    user: { name: "John Doe", initials: "JD" },
    content: {
      action: "moved",
      target: "DataSync Pro",
      targetLink: "/startups/datasync",
      from: "IC Review",
      to: "Closed Won",
    },
    timestamp: "Yesterday",
    isRead: true,
  },
  {
    id: "9",
    type: "comment",
    user: { name: "Sarah Chen", initials: "SC" },
    content: {
      action: "commented on",
      target: "FinApp Inc",
      targetLink: "/startups/finapp",
      preview: "The team has strong experience in fintech. I think we should prioritize this one.",
    },
    timestamp: "Yesterday",
    isRead: true,
  },
  {
    id: "10",
    type: "document_view",
    content: {
      action: "viewed",
      target: "HealthBridge pitch deck",
      targetLink: "/documents/healthbridge-deck",
      secondary: "Andreessen Horowitz",
      readTime: "8 min",
      pagesViewed: 18,
    },
    timestamp: "Yesterday",
    isRead: true,
  },
]

const typeConfig = {
  match: {
    icon: Sparkles,
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    color: "text-emerald-600 dark:text-emerald-400",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
  stage_change: {
    icon: MoveRight,
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    color: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  comment: {
    icon: MessageSquare,
    bg: "bg-purple-500/10 dark:bg-purple-500/20",
    color: "text-purple-600 dark:text-purple-400",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  document_view: {
    icon: Eye,
    bg: "bg-gray-500/10 dark:bg-gray-500/20",
    color: "text-gray-600 dark:text-gray-400",
    borderColor: "border-gray-200 dark:border-gray-700",
  },
  task_completed: {
    icon: CheckCircle2,
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    color: "text-emerald-600 dark:text-emerald-400",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
  mention: {
    icon: AtSign,
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
    color: "text-amber-600 dark:text-amber-400",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
}

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Matches", value: "match" },
  { label: "Stage Changes", value: "stage_change" },
  { label: "Documents", value: "document_view" },
  { label: "Comments", value: "comment" },
  { label: "Mentions", value: "mention" },
  { label: "System", value: "task_completed" },
]

function ActivityItem({ activity, handleMarkAsRead, copiedActivityId, handleCopyLink, handleMuteNotifications }: { activity: Activity, handleMarkAsRead: (activityId: string) => void, copiedActivityId: string | null, handleCopyLink: (activityId: string) => void, handleMuteNotifications: (activityId: string) => void }) {
  const config = typeConfig[activity.type]
  const Icon = config.icon

  const renderContent = () => {
    switch (activity.type) {
      case "match":
        return (
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm">
                  <span className="font-medium text-foreground">{activity.content.action}: </span>
                  <Link href={activity.content.targetLink || "#"} className="font-medium text-primary hover:underline">
                    {activity.content.target}
                  </Link>
                  <ArrowRightLeft className="inline w-3 h-3 mx-1.5 text-muted-foreground" />
                  <span className="font-medium text-foreground">{activity.content.secondary}</span>
                </p>
                {activity.content.matchScore && (
                  <Badge variant="outline" className="mt-2 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800">
                    {activity.content.matchScore}% match
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.timestamp}</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs bg-transparent"
                onClick={() => {
                  window.location.href = activity.content.targetLink || "#"
                }}
              >
                View Startup
              </Button>
            </div>
          </div>
        )

      case "stage_change":
        return (
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm">
                  <span className="font-medium text-foreground">@{activity.user?.name}</span>
                  <span className="text-muted-foreground"> {activity.content.action} </span>
                  <Link href={activity.content.targetLink || "#"} className="font-medium text-primary hover:underline">
                    {activity.content.target}
                  </Link>
                  <span className="text-muted-foreground"> to {activity.content.to}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  From: {activity.content.from} → To: {activity.content.to}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.timestamp}</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs bg-transparent"
                onClick={() => {
                  window.location.href = activity.content.targetLink || "#"
                }}
              >
                View Startup
              </Button>
            </div>
          </div>
        )

      case "comment":
        return (
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm">
                  <span className="font-medium text-foreground">@{activity.user?.name}</span>
                  <span className="text-muted-foreground"> {activity.content.action} </span>
                  <Link href={activity.content.targetLink || "#"} className="font-medium text-primary hover:underline">
                    {activity.content.target}
                  </Link>
                  <span className="text-muted-foreground"> profile</span>
                </p>
                {activity.content.preview && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2 italic">
                    "{activity.content.preview}"
                  </p>
                )}
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.timestamp}</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs bg-transparent"
                onClick={() => {
                  window.location.href = activity.content.targetLink || "#"
                }}
              >
                View Match
              </Button>
            </div>
          </div>
        )

      case "document_view":
        return (
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm">
                  <span className="text-muted-foreground">Investor </span>
                  <span className="font-medium text-foreground">{activity.content.secondary}</span>
                  <span className="text-muted-foreground"> {activity.content.action} </span>
                  <Link href={activity.content.targetLink || "#"} className="font-medium text-primary hover:underline">
                    {activity.content.target}
                  </Link>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.content.readTime} read time, {activity.content.pagesViewed} pages viewed
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.timestamp}</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs bg-transparent"
                onClick={() => {
                  console.log("[v0] Opening document analytics")
                }}
              >
                View Analytics
              </Button>
            </div>
          </div>
        )

      case "task_completed":
        return (
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm">
                  <span className="font-medium text-foreground">@{activity.user?.name}</span>
                  <span className="text-muted-foreground"> {activity.content.action} </span>
                  <span className="font-medium text-foreground">'{activity.content.target}'</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">{activity.content.secondary}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.timestamp}</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs bg-transparent"
                onClick={() => {
                  console.log("[v0] Viewing task for activity:", activity.id)
                }}
              >
                View Task
              </Button>
            </div>
          </div>
        )

      case "mention":
        return (
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm">
                  <span className="font-medium text-foreground">@{activity.user?.name}</span>
                  <span className="text-muted-foreground"> {activity.content.action} </span>
                  <Link href={activity.content.targetLink || "#"} className="font-medium text-primary hover:underline">
                    {activity.content.target}
                  </Link>
                </p>
                {activity.content.preview && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2 italic">
                    "{activity.content.preview}"
                  </p>
                )}
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.timestamp}</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs bg-transparent"
                onClick={() => {
                  window.location.href = activity.content.targetLink || "#"
                }}
              >
                View Task
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs"
                onClick={() => handleMarkAsRead(activity.id)}
              >
                <Check className="w-3 h-3 mr-1" />
                Mark Read
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        "relative flex gap-4 p-4 rounded-lg transition-colors",
        !activity.isRead && "bg-primary/5 dark:bg-primary/10",
        activity.isMention && "ring-1 ring-amber-200 dark:ring-amber-800"
      )}
    >
      {/* Avatar or Icon */}
      {activity.user ? (
        <div className="w-10 h-10 bg-gradient-to-br from-primary/80 to-primary rounded-full flex items-center justify-center shrink-0">
          <span className="text-xs font-medium text-primary-foreground">{activity.user.initials}</span>
        </div>
      ) : (
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", config.bg)}>
          <Icon className={cn("w-5 h-5", config.color)} />
        </div>
      )}

      {/* Icon Badge */}
      {activity.user && (
        <div className={cn("absolute left-12 top-11 w-5 h-5 rounded-full flex items-center justify-center border-2 border-background", config.bg)}>
          <Icon className={cn("w-3 h-3", config.color)} />
        </div>
      )}

      {renderContent()}

      {/* More Options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleMarkAsRead(activity.id)}>
            Mark as {activity.isRead ? "unread" : "read"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMuteNotifications(activity.id)}>
            Mute notifications
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default function ActivityPage() {
  const { toast } = useToast()
  const [activeFilter, setActiveFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"timeline" | "grouped">("timeline")
  const [allActivities, setAllActivities] = useState<Activity[]>(activities)
  const [copiedActivityId, setCopiedActivityId] = useState<string | null>(null) // Declare copiedActivityId
  const [mutedActivities, setMutedActivities] = useState<string[]>([]) // Declare mutedActivities

  // Dialog states
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [viewTaskOpen, setViewTaskOpen] = useState(false)
  
  // Form states
  const [shareTeams, setShareTeams] = useState<string[]>([])
  const [shareMessage, setShareMessage] = useState("")
  const [commentText, setCommentText] = useState("")
  const [replyText, setReplyText] = useState("")

  const filteredActivities = activeFilter === "all" 
    ? allActivities 
    : allActivities.filter(a => a.type === activeFilter)

  // Group activities by date for grouped view
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = activity.timestamp.includes("ago") || activity.timestamp === "Yesterday" 
      ? activity.timestamp.includes("Yesterday") ? "Yesterday" : "Today"
      : activity.timestamp
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(activity)
    return groups
  }, {} as Record<string, Activity[]>)

  const unreadCount = allActivities.filter(a => !a.isRead).length

  const handleMarkAsRead = (activityId: string) => {
    setAllActivities(allActivities.map(activity =>
      activity.id === activityId ? { ...activity, isRead: true } : activity
    ))
  }

  const handleMarkAllAsRead = () => {
    setAllActivities(allActivities.map(activity => ({ ...activity, isRead: true })))
  }

  const handleFilterChange = (filterValue: string) => {
    setActiveFilter(filterValue)
  }

  // Action handlers
  const handleShareWithTeam = () => {
    if (selectedActivity && shareTeams.length > 0) {
      handleMarkAsRead(selectedActivity.id)
      console.log("[v0] Shared activity with teams:", shareTeams, "Message:", shareMessage)
      setShareDialogOpen(false)
      setShareTeams([])
      setShareMessage("")
      setSelectedActivity(null)
    }
  }

  const handleAddComment = () => {
    if (selectedActivity && commentText.trim()) {
      handleMarkAsRead(selectedActivity.id)
      console.log("[v0] Comment added:", commentText)
      setCommentDialogOpen(false)
      setCommentText("")
      setSelectedActivity(null)
    }
  }

  const handleReply = () => {
    if (selectedActivity && replyText.trim()) {
      handleMarkAsRead(selectedActivity.id)
      console.log("[v0] Reply sent:", replyText)
      setReplyDialogOpen(false)
      setReplyText("")
      setSelectedActivity(null)
    }
  }

  const handleCopyLink = (activityId: string) => {
    const linkToCopy = `${window.location.href.split("?")[0]}?activityId=${activityId}`
    navigator.clipboard.writeText(linkToCopy).then(() => {
      console.log("[v0] Link copied to clipboard:", linkToCopy)
      toast({
        title: "Link Copied!",
        description: "Activity link has been copied to your clipboard.",
        duration: 3000,
      })
    }).catch((err) => {
      console.error("[v0] Failed to copy link:", err)
      toast({
        title: "Failed to Copy",
        description: "Could not copy the link to clipboard.",
        variant: "destructive",
        duration: 3000,
      })
    })
  }

  const handleMuteNotifications = (activityId: string) => {
    setMutedActivities([...mutedActivities, activityId])
    toast({
      title: "Notifications Muted",
      description: "You won't see notifications from this activity anymore.",
      duration: 3000,
    })
  }

  const handleViewTask = () => {
    if (selectedActivity) {
      handleMarkAsRead(selectedActivity.id)
      console.log("[v0] Viewing task for activity:", selectedActivity.id)
      setViewTaskOpen(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 overflow-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/role-selection" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Activity Feed</span>
          </div>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Activity Feed</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Stay updated with all the latest activities across your workspace
              </p>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    {activeFilter === "all" ? "All Activity" : filterOptions.find(f => f.value === activeFilter)?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {filterOptions.map((filter) => (
                    <DropdownMenuItem 
                      key={filter.value}
                      onClick={() => handleFilterChange(filter.value)}
                      className={activeFilter === filter.value ? "bg-muted" : ""}
                    >
                      <Check className="w-4 h-4 mr-2" style={{ visibility: activeFilter === filter.value ? "visible" : "hidden" }} />
                      {filter.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center border border-border rounded-lg p-1 bg-muted/30">
                <Button
                  variant={viewMode === "timeline" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-3 rounded-md"
                  onClick={() => setViewMode("timeline")}
                  aria-label="Timeline view"
                >
                  Timeline
                </Button>
                <Button
                  variant={viewMode === "grouped" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-3 rounded-md gap-1.5"
                  onClick={() => setViewMode("grouped")}
                  aria-label="Grouped view"
                >
                  <LayoutList className="w-4 h-4 shrink-0" />
                  Grouped
                </Button>
              </div>

              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark all as read
              </Button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {filterOptions.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors",
                  activeFilter === filter.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {filter.label}
                {filter.value === "all" && unreadCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-primary-foreground/20 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Activity List */}
          <Card>
            <CardContent className="p-0">
              {viewMode === "timeline" ? (
                <div className="divide-y divide-border">
                  {filteredActivities.map((activity, index) => (
                    <div key={activity.id} className="relative">
                      {/* Timeline connector */}
                      {index < filteredActivities.length - 1 && (
                        <div className="absolute left-[35px] top-14 bottom-0 w-px bg-border" />
                      )}
                      <ActivityItem activity={activity} handleMarkAsRead={handleMarkAsRead} copiedActivityId={copiedActivityId} handleCopyLink={handleCopyLink} handleMuteNotifications={handleMuteNotifications} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {Object.entries(groupedActivities).map(([date, dateActivities]) => (
                    <div key={date}>
                      <div className="px-4 py-3 bg-muted/50 sticky top-0">
                        <h3 className="text-sm font-medium text-foreground">{date}</h3>
                        <p className="text-xs text-muted-foreground">{dateActivities.length} activities</p>
                      </div>
                      <div className="divide-y divide-border">
                        {dateActivities.map((activity) => (
                          <ActivityItem key={activity.id} activity={activity} handleMarkAsRead={handleMarkAsRead} copiedActivityId={copiedActivityId} handleCopyLink={handleCopyLink} handleMuteNotifications={handleMuteNotifications} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Load More */}
          <div className="flex justify-center mt-6">
            <Button variant="outline">Load More Activities</Button>
          </div>
        </main>
      </div>
    </div>
  )
}

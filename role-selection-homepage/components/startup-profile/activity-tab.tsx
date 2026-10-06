"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  ArrowRightLeft,
  AtSign,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  MessageSquare,
  MoreHorizontal,
  MoveRight,
  Plus,
  Reply,
  Send,
  Share2,
  Sparkles,
  User,
  Users,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Types
interface Activity {
  id: string
  type: "match" | "stage_change" | "comment" | "document_view" | "document_share" | "task" | "meeting" | "note" | "email"
  user?: {
    name: string
    initials: string
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
  date: string
  isNew: boolean
}

// Activity type configuration
const typeConfig = {
  match: {
    icon: Sparkles,
    bg: "bg-emerald-500/10",
    color: "text-emerald-600 dark:text-emerald-400",
    label: "Match",
  },
  stage_change: {
    icon: MoveRight,
    bg: "bg-blue-500/10",
    color: "text-blue-600 dark:text-blue-400",
    label: "Stage Change",
  },
  comment: {
    icon: MessageSquare,
    bg: "bg-purple-500/10",
    color: "text-purple-600 dark:text-purple-400",
    label: "Comment",
  },
  document_view: {
    icon: Eye,
    bg: "bg-muted",
    color: "text-muted-foreground",
    label: "Document View",
  },
  document_share: {
    icon: Share2,
    bg: "bg-primary/10",
    color: "text-primary",
    label: "Document Share",
  },
  task: {
    icon: CheckCircle2,
    bg: "bg-emerald-500/10",
    color: "text-emerald-600 dark:text-emerald-400",
    label: "Task",
  },
  meeting: {
    icon: Calendar,
    bg: "bg-amber-500/10",
    color: "text-amber-600 dark:text-amber-400",
    label: "Meeting",
  },
  note: {
    icon: FileText,
    bg: "bg-muted",
    color: "text-muted-foreground",
    label: "Note",
  },
  email: {
    icon: Send,
    bg: "bg-blue-500/10",
    color: "text-blue-600 dark:text-blue-400",
    label: "Email",
  },
}

// Mock activity data for startup
const activitiesData: Activity[] = [
  {
    id: "1",
    type: "match",
    content: {
      action: "New investor match",
      target: "Sequoia Capital India",
      secondary: "94% match score",
      matchScore: 94,
    },
    timestamp: "10 min ago",
    date: "Today",
    isNew: true,
  },
  {
    id: "2",
    type: "document_view",
    content: {
      action: "viewed",
      target: "Pitch Deck v3",
      secondary: "Accel Partners",
      readTime: "4 min 32s",
      pagesViewed: 12,
    },
    timestamp: "25 min ago",
    date: "Today",
    isNew: true,
  },
  {
    id: "3",
    type: "stage_change",
    user: { name: "Priya Sharma", initials: "PS" },
    content: {
      action: "moved startup",
      from: "Screening",
      to: "Due Diligence",
    },
    timestamp: "1 hour ago",
    date: "Today",
    isNew: true,
  },
  {
    id: "4",
    type: "comment",
    user: { name: "Rahul Singh", initials: "RS" },
    content: {
      action: "added a comment",
      preview: "Great traction metrics. The MoM growth of 32% is impressive. We should prioritize the DD process.",
    },
    timestamp: "2 hours ago",
    date: "Today",
    isNew: false,
  },
  {
    id: "5",
    type: "meeting",
    user: { name: "Amit Kumar", initials: "AK" },
    content: {
      action: "scheduled meeting",
      target: "Founder call with Blume Ventures",
      secondary: "Jan 25, 2026 at 3:00 PM",
    },
    timestamp: "3 hours ago",
    date: "Today",
    isNew: false,
  },
  {
    id: "6",
    type: "document_share",
    user: { name: "Priya Sharma", initials: "PS" },
    content: {
      action: "shared",
      target: "Financial Model",
      secondary: "with Lightspeed Ventures",
    },
    timestamp: "5 hours ago",
    date: "Today",
    isNew: false,
  },
  {
    id: "7",
    type: "email",
    user: { name: "Rahul Singh", initials: "RS" },
    content: {
      action: "sent intro email",
      target: "Kunal Shah",
      preview: "Introduction to TechCorp AI - Series Seed opportunity",
    },
    timestamp: "Yesterday",
    date: "Yesterday",
    isNew: false,
  },
  {
    id: "8",
    type: "task",
    user: { name: "Amit Kumar", initials: "AK" },
    content: {
      action: "completed task",
      target: "Review cap table",
    },
    timestamp: "Yesterday",
    date: "Yesterday",
    isNew: false,
  },
  {
    id: "9",
    type: "document_view",
    content: {
      action: "viewed",
      target: "Financial Model 2026",
      secondary: "Matrix Partners",
      readTime: "8 min 15s",
      pagesViewed: 8,
    },
    timestamp: "Yesterday",
    date: "Yesterday",
    isNew: false,
  },
  {
    id: "10",
    type: "note",
    user: { name: "Priya Sharma", initials: "PS" },
    content: {
      action: "added note",
      preview: "Follow up with founders on customer references. Need 3-4 enterprise customers for DD.",
    },
    timestamp: "Jan 20, 2026",
    date: "Jan 20, 2026",
    isNew: false,
  },
  {
    id: "11",
    type: "match",
    content: {
      action: "New investor match",
      target: "Blume Ventures",
      secondary: "85% match score",
      matchScore: 85,
    },
    timestamp: "Jan 19, 2026",
    date: "Jan 19, 2026",
    isNew: false,
  },
  {
    id: "12",
    type: "stage_change",
    user: { name: "John Doe", initials: "JD" },
    content: {
      action: "moved startup",
      from: "New Lead",
      to: "Screening",
    },
    timestamp: "Jan 18, 2026",
    date: "Jan 18, 2026",
    isNew: false,
  },
]

// Summary stats
const activitySummary = {
  totalActivities: 47,
  thisWeek: 18,
  investorViews: 12,
  teamActions: 24,
}

// Filter options
const filterOptions = [
  { label: "All Activity", value: "all" },
  { label: "Matches", value: "match" },
  { label: "Stage Changes", value: "stage_change" },
  { label: "Documents", value: "document" },
  { label: "Comments", value: "comment" },
  { label: "Meetings", value: "meeting" },
  { label: "Tasks", value: "task" },
]

function ActivityItem({ activity }: { activity: Activity }) {
  const config = typeConfig[activity.type]
  const Icon = config.icon

  const renderContent = () => {
    switch (activity.type) {
      case "match":
        return (
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-medium text-foreground">{activity.content.action}: </span>
              <span className="font-medium text-primary">{activity.content.target}</span>
            </p>
            {activity.content.matchScore && (
              <Badge variant="outline" className="mt-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                {activity.content.matchScore}% match
              </Badge>
            )}
          </div>
        )

      case "stage_change":
        return (
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-medium text-foreground">{activity.user?.name}</span>
              <span className="text-muted-foreground"> {activity.content.action} to </span>
              <span className="font-medium text-foreground">{activity.content.to}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              From: {activity.content.from} → To: {activity.content.to}
            </p>
          </div>
        )

      case "document_view":
        return (
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-medium text-foreground">{activity.content.secondary}</span>
              <span className="text-muted-foreground"> {activity.content.action} </span>
              <span className="font-medium text-primary">{activity.content.target}</span>
            </p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {activity.content.readTime}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {activity.content.pagesViewed} pages
              </span>
            </div>
          </div>
        )

      case "document_share":
        return (
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-medium text-foreground">{activity.user?.name}</span>
              <span className="text-muted-foreground"> {activity.content.action} </span>
              <span className="font-medium text-primary">{activity.content.target}</span>
              <span className="text-muted-foreground"> {activity.content.secondary}</span>
            </p>
          </div>
        )

      case "comment":
      case "note":
        return (
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-medium text-foreground">{activity.user?.name}</span>
              <span className="text-muted-foreground"> {activity.content.action}</span>
            </p>
            {activity.content.preview && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2 bg-muted/50 p-2 rounded-md">
                {activity.content.preview}
              </p>
            )}
          </div>
        )

      case "meeting":
        return (
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-medium text-foreground">{activity.user?.name}</span>
              <span className="text-muted-foreground"> {activity.content.action}: </span>
              <span className="font-medium text-foreground">{activity.content.target}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {activity.content.secondary}
            </p>
          </div>
        )

      case "task":
        return (
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-medium text-foreground">{activity.user?.name}</span>
              <span className="text-muted-foreground"> {activity.content.action}: </span>
              <span className="font-medium text-foreground">{activity.content.target}</span>
            </p>
          </div>
        )

      case "email":
        return (
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-medium text-foreground">{activity.user?.name}</span>
              <span className="text-muted-foreground"> {activity.content.action} to </span>
              <span className="font-medium text-foreground">{activity.content.target}</span>
            </p>
            {activity.content.preview && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                Subject: {activity.content.preview}
              </p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={cn(
      "flex gap-3 p-3 rounded-lg transition-colors",
      activity.isNew && "bg-primary/5"
    )}>
      {/* Icon */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
        config.bg
      )}>
        <Icon className={cn("w-4 h-4", config.color)} />
      </div>

      {/* Content */}
      {renderContent()}

      {/* Timestamp & Actions */}
      <div className="flex items-start gap-2">
        <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.timestamp}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Copy Link</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export function ActivityTab() {
  const [filter, setFilter] = useState("all")
  const [comment, setComment] = useState("")

  const filteredActivities = activitiesData.filter((activity) => {
    if (filter === "all") return true
    if (filter === "document") return activity.type === "document_view" || activity.type === "document_share"
    return activity.type === filter
  })

  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = activity.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(activity)
    return groups
  }, {} as Record<string, Activity[]>)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      {/* Main Content */}
      <div className="space-y-6">
        {/* Quick Add Comment */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Add a comment or note..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[60px] resize-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
                      <AtSign className="w-3 h-3 mr-1" />
                      Mention
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
                      <FileText className="w-3 h-3 mr-1" />
                      Attach
                    </Button>
                  </div>
                  <Button size="sm" disabled={!comment.trim()}>
                    <Send className="w-3 h-3 mr-1" />
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter */}
        <div className="flex items-center justify-between">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter activity" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {filteredActivities.length} activities
          </p>
        </div>

        {/* Activity Timeline */}
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([date, activities]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-medium text-muted-foreground px-2">{date}</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="space-y-1">
                {activities.map((activity) => (
                  <div key={activity.id} className="group">
                    <ActivityItem activity={activity} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No activity found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your filter
            </p>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Activity Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">{activitySummary.totalActivities}</p>
                <p className="text-xs text-muted-foreground">Total Activities</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">{activitySummary.thisWeek}</p>
                <p className="text-xs text-muted-foreground">This Week</p>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Investor Views
                </span>
                <span className="font-medium">{activitySummary.investorViews}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Team Actions
                </span>
                <span className="font-medium">{activitySummary.teamActions}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Team Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4" />
              Team Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Priya Sharma", initials: "PS", actions: 8, lastActive: "2 hours ago" },
              { name: "Rahul Singh", initials: "RS", actions: 5, lastActive: "3 hours ago" },
              { name: "Amit Kumar", initials: "AK", actions: 4, lastActive: "Yesterday" },
            ].map((member) => (
              <div key={member.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.lastActive}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">{member.actions}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
              <MessageSquare className="w-4 h-4 mr-2" />
              Add Comment
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Create Task
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
              <Share2 className="w-4 h-4 mr-2" />
              Share Document
            </Button>
          </CardContent>
        </Card>

        {/* Export */}
        <Card>
          <CardContent className="p-4">
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export Activity Log
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import React from "react"
import { Eye } from "lucide-react"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/lib/auth-context"
import {
  TrendingUp,
  Users,
  MessageSquare,
  FileText,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Target,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FundraiseRound {
  id: string
  name: string
  target: number
  committed: number
  status: "active" | "paused" | "closed"
  runway: number
  daysActive: number
  currency: string
}

interface QuickStat {
  label: string
  value: number
  icon: React.ReactNode
  color: string
}

interface InvestorActivity {
  id: number
  type: "view" | "match" | "update" | "response"
  message: string
  time: string
  investor?: string
}

interface ActionItem {
  id: number
  title: string
  priority: "high" | "medium" | "low"
  dueDate: string
  status: "pending" | "in-progress" | "completed"
}

interface InvestorMatch {
  id: number
  name: string
  type: string
  matchScore: number
  checkSize: string
  focus: string[]
  avatar?: string
}

// Mock data
const mockFundraiseRound: FundraiseRound = {
  id: "1",
  name: "Series A",
  target: 1500,
  committed: 800,
  status: "active",
  runway: 7,
  daysActive: 45,
  currency: "₹",
}

const mockQuickStats: QuickStat[] = [
  {
    label: "Investors Contacted",
    value: 45,
    icon: <Users className="w-5 h-5" />,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    label: "Responses",
    value: 18,
    icon: <MessageSquare className="w-5 h-5" />,
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    label: "Meetings Held",
    value: 12,
    icon: <Users className="w-5 h-5" />,
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    label: "Term Sheets",
    value: 1,
    icon: <FileText className="w-5 h-5" />,
    color: "bg-purple-500/10 text-purple-600",
  },
]

const mockInvestorActivity: InvestorActivity[] = [
  {
    id: 1,
    type: "view",
    message: "3 investors viewed your deck today",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "update",
    message: "Sequoia spent 8 min on your financials",
    time: "4 hours ago",
    investor: "Sequoia Capital",
  },
  {
    id: 3,
    type: "match",
    message: "New match: Accel (92% match)",
    time: "6 hours ago",
    investor: "Accel",
  },
  {
    id: 4,
    type: "response",
    message: "Bessemer Venture Partners replied to your message",
    time: "1 day ago",
    investor: "BVP",
  },
]

const mockActionItems: ActionItem[] = [
  {
    id: 1,
    title: "Update financial projections",
    priority: "high",
    dueDate: "Today",
    status: "pending",
  },
  {
    id: 2,
    title: "Schedule meeting with Index Ventures",
    priority: "high",
    dueDate: "Tomorrow",
    status: "pending",
  },
  {
    id: 3,
    title: "Review term sheet from Sequoia",
    priority: "high",
    dueDate: "In 2 days",
    status: "pending",
  },
  {
    id: 4,
    title: "Submit updated cap table",
    priority: "medium",
    dueDate: "In 3 days",
    status: "in-progress",
  },
]

const mockInvestorMatches: InvestorMatch[] = [
  {
    id: 1,
    name: "Accel",
    type: "VC Firm",
    matchScore: 92,
    checkSize: "$500K - $5M",
    focus: ["SaaS", "FinTech", "B2B"],
  },
  {
    id: 2,
    name: "Sequoia Capital",
    type: "VC Firm",
    matchScore: 88,
    checkSize: "$1M - $10M",
    focus: ["Enterprise", "AI/ML", "DevTools"],
  },
  {
    id: 3,
    name: "Index Ventures",
    type: "VC Firm",
    matchScore: 85,
    checkSize: "$250K - $2M",
    focus: ["B2B", "FinTech", "Marketplace"],
  },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

function getCurrentDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function FundraiseHealthCard() {
  const progressPercent = (mockFundraiseRound.committed / mockFundraiseRound.target) * 100

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/0 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-primary" />
              <CardTitle>{mockFundraiseRound.name} Fundraise</CardTitle>
            </div>
            <CardDescription>Track your fundraising progress</CardDescription>
          </div>
          <Badge variant={mockFundraiseRound.status === "active" ? "default" : "outline"}>
            {mockFundraiseRound.status.charAt(0).toUpperCase() + mockFundraiseRound.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Funding Goals */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Target: {mockFundraiseRound.currency}
              {mockFundraiseRound.target} Cr
            </span>
            <span className="text-sm font-medium text-primary">
              Committed: {mockFundraiseRound.currency}
              {mockFundraiseRound.committed} Cr ({Math.round(progressPercent)}%)
            </span>
          </div>
          <Progress value={progressPercent} className="h-2.5" />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Runway</p>
            <p className="text-lg font-semibold text-foreground">{mockFundraiseRound.runway} months</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Days Active</p>
            <p className="text-lg font-semibold text-foreground">{mockFundraiseRound.daysActive}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Status</p>
            <p className="text-lg font-semibold text-emerald-600">On Track</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Progress</p>
            <p className="text-lg font-semibold text-foreground">{Math.round(progressPercent)}%</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button asChild>
            <Link href="/founder/campaign/manage">View Campaign</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/founder/profile?tab=funding">Update Status</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function QuickStatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {mockQuickStats.map((stat) => (
        <Card key={stat.label} className="hover:border-primary/30 transition-colors cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                {stat.label === "Responses" && (
                  <p className="text-xs text-muted-foreground mt-1">40% response rate</p>
                )}
                {stat.label === "Meetings Held" && (
                  <p className="text-xs text-muted-foreground mt-1">+2 this week</p>
                )}
              </div>
              <div className={cn("p-3 rounded-lg", stat.color)}>{stat.icon}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function InvestorActivitySection() {
  const activityIcons: Record<string, React.ReactNode> = {
    view: <Eye className="w-4 h-4" />,
    match: <Sparkles className="w-4 h-4" />,
    update: <TrendingUp className="w-4 h-4" />,
    response: <MessageSquare className="w-4 h-4" />,
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Investor Activity</CardTitle>
            <CardDescription>What's happening with your fundraise</CardDescription>
          </div>
          <Link href="/founder/matches">
            <Button variant="ghost" size="sm">
              See All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockInvestorActivity.map((activity) => (
          <div key={activity.id} className="flex gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
            <div className="flex-shrink-0 pt-1">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <Zap className={cn("w-4 h-4", activity.type === "match" ? "text-emerald-600" : "text-primary")} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{activity.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function ActionItemsSection() {
  const priorityColors: Record<string, string> = {
    high: "border-destructive/30 bg-destructive/5",
    medium: "border-amber-300/30 bg-amber-50/5",
    low: "border-blue-300/30 bg-blue-50/5",
  }

  const priorityBadgeColors: Record<string, string> = {
    high: "bg-destructive/10 text-destructive",
    medium: "bg-amber-500/10 text-amber-600",
    low: "bg-blue-500/10 text-blue-600",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Action Items</CardTitle>
        <CardDescription>Tasks that need your attention</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {mockActionItems.map((item) => (
          <div key={item.id} className={cn("p-3 rounded-lg border", priorityColors[item.priority])}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {item.status === "completed" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  )}
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{item.dueDate}</p>
              </div>
              <Badge className={priorityBadgeColors[item.priority]} variant="secondary">
                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function RecentMatchesSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent Matches</CardTitle>
            <CardDescription>Top investor matches for your round</CardDescription>
          </div>
          <Link href="/founder/matches">
            <Button variant="ghost" size="sm">
              Find More
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockInvestorMatches.map((match) => (
          <div key={match.id} className="p-3 border border-border rounded-lg hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-sm text-foreground">{match.name}</p>
                <p className="text-xs text-muted-foreground">{match.type}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <span className="text-sm font-bold text-primary">{match.matchScore}%</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-2">Check Size: {match.checkSize}</p>
            <div className="flex flex-wrap gap-1">
              {match.focus.map((focus) => (
                <Badge key={focus} variant="outline" className="text-xs">
                  {focus}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default function FounderDashboardPage() {
  const greeting = getGreeting()
  const currentDate = getCurrentDate()
  const { user } = useAuth()
  const userName = user?.name?.split(" ")[0] || "there"

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Founder Dashboard" />
        
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />

          <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
            <div className="max-w-[1600px] mx-auto space-y-6">
              {/* Greeting Section */}
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  {greeting}, {userName}
                </h1>
                <p className="text-muted-foreground mt-1">{currentDate}</p>
              </div>

              {/* Fundraising Health Card - Prominent */}
              <FundraiseHealthCard />

              {/* Quick Stats Row */}
              <QuickStatsCards />

              {/* Main Content - 2 Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6">
                {/* Left Column (65%) */}
                <div className="space-y-6">
                  {/* Investor Activity */}
                  <InvestorActivitySection />

                  {/* Action Items */}
                  <ActionItemsSection />
                </div>

                {/* Right Column (35%) */}
                <div className="space-y-6">
                  {/* Recent Matches */}
                  <RecentMatchesSection />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

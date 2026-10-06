"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Bell, 
  Plus, 
  TrendingUp, 
  Calendar, 
  Users, 
  Eye,
  FileText,
  BarChart3,
  MessageSquare,
  Video,
  Send,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export default function FounderMobileHomePage() {
  const [fabOpen, setFabOpen] = useState(false)

  const quickStats = [
    { label: "Committed", value: "₹8 Cr", change: "+15%", changeType: "positive" as const },
    { label: "Meetings", value: "4", change: "This week", changeType: "neutral" as const },
    { label: "Matches", value: "23", change: "+3 new", changeType: "positive" as const },
    { label: "Views", value: "56", change: "Today", changeType: "neutral" as const },
  ]

  const activities = [
    {
      id: 1,
      message: "Sequoia viewed your deck",
      time: "Just now",
      type: "hot",
      investor: "Sequoia Capital",
    },
    {
      id: 2,
      message: "New match - Accel (89%)",
      time: "2h ago",
      type: "match",
      investor: "Accel",
    },
    {
      id: 3,
      message: "Meeting with Matrix at 3pm",
      time: "Today",
      type: "meeting",
      investor: "Matrix Partners",
    },
    {
      id: 4,
      message: "Lightspeed requested financials",
      time: "5h ago",
      type: "request",
      investor: "Lightspeed",
    },
  ]

  const todayFocus = {
    meetings: [
      { time: "3:00 PM", investor: "Matrix Partners", type: "Partner Call" },
      { time: "5:30 PM", investor: "Sequoia Capital", type: "Follow-up" },
    ],
    followUps: [
      { investor: "Accel", action: "Send updated deck" },
      { investor: "Lightspeed", action: "Share financial model" },
    ],
    responses: [
      { investor: "Index Ventures", status: "Awaiting term sheet" },
    ],
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Mobile Header */}
      <div className="sticky top-0 z-30 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/placeholder-logo.png" alt="Company" />
              <AvatarFallback>TC</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">TechCorp</span>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs w-fit">
                <TrendingUp className="w-3 h-3 mr-1" />
                Raising
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full" />
          </Button>
        </div>
      </div>

      {/* Quick Stats - Horizontal Scroll */}
      <div className="px-4 py-4 overflow-x-auto">
        <div className="flex gap-3 min-w-max">
          {quickStats.map((stat) => (
            <Card key={stat.label} className="flex-shrink-0 w-32 p-3">
              <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
              <div className="text-xl font-bold">{stat.value}</div>
              <div className={cn(
                "text-xs mt-1",
                stat.changeType === "positive" && "text-emerald-600",
                stat.changeType === "neutral" && "text-muted-foreground"
              )}>
                {stat.change}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Hot Activity Feed */}
      <div className="px-4 py-2">
        <h2 className="text-sm font-semibold mb-3">Hot Activity</h2>
        <div className="space-y-2">
          {activities.map((activity) => (
            <Card key={activity.id} className="p-3">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                  activity.type === "hot" && "bg-destructive animate-pulse",
                  activity.type === "match" && "bg-emerald-500",
                  activity.type === "meeting" && "bg-blue-500",
                  activity.type === "request" && "bg-amber-500"
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Today's Focus */}
      <div className="px-4 py-4">
        <h2 className="text-sm font-semibold mb-3">Today's Focus</h2>
        
        {/* Meetings Scheduled */}
        {todayFocus.meetings.length > 0 && (
          <Card className="p-3 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Meetings ({todayFocus.meetings.length})</span>
            </div>
            <div className="space-y-2">
              {todayFocus.meetings.map((meeting, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm pl-6">
                  <div>
                    <p className="font-medium">{meeting.time}</p>
                    <p className="text-xs text-muted-foreground">{meeting.investor}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{meeting.type}</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Follow-ups Due */}
        {todayFocus.followUps.length > 0 && (
          <Card className="p-3 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium">Follow-ups ({todayFocus.followUps.length})</span>
            </div>
            <div className="space-y-2">
              {todayFocus.followUps.map((followup, idx) => (
                <div key={idx} className="text-sm pl-6">
                  <p className="font-medium">{followup.investor}</p>
                  <p className="text-xs text-muted-foreground">{followup.action}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Investor Responses */}
        {todayFocus.responses.length > 0 && (
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium">Responses ({todayFocus.responses.length})</span>
            </div>
            <div className="space-y-2">
              {todayFocus.responses.map((response, idx) => (
                <div key={idx} className="text-sm pl-6">
                  <p className="font-medium">{response.investor}</p>
                  <p className="text-xs text-muted-foreground">{response.status}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Floating Action Button */}
      <Sheet open={fabOpen} onOpenChange={setFabOpen}>
        <SheetTrigger asChild>
          <Button 
            size="lg"
            className="fixed bottom-20 right-4 md:bottom-6 w-14 h-14 rounded-full shadow-lg z-40"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-auto rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Quick Actions</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 bg-transparent"
              asChild
            >
              <Link href="/founder/profile?tab=metrics">
                <BarChart3 className="w-5 h-5" />
                <span className="text-sm">Update Metrics</span>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 bg-transparent"
              asChild
            >
              <Link href="/founder/investors/1">
                <FileText className="w-5 h-5" />
                <span className="text-sm">Add Note</span>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 bg-transparent"
              asChild
            >
              <Link href="/founder/profile?tab=documents">
                <Send className="w-5 h-5" />
                <span className="text-sm">Share Deck</span>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 bg-transparent"
              asChild
            >
              <Link href="/founder/meetings">
                <Video className="w-5 h-5" />
                <span className="text-sm">Schedule Call</span>
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

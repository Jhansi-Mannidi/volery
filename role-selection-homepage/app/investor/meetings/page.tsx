"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  X,
  FileText,
  MessageSquare,
  Star,
  MoreHorizontal,
  ExternalLink,
  Users,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle2,
  Building2,
  Briefcase,
  ArrowRight,
  RefreshCw,
  Send,
} from "lucide-react"

// Meeting types
type MeetingType = "intro" | "dd" | "ic" | "follow-up" | "board"

const meetingTypeConfig: Record<MeetingType, { label: string; color: string }> = {
  intro: { label: "Intro Call", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  dd: { label: "Due Diligence", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  ic: { label: "IC Meeting", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  "follow-up": { label: "Follow-up", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  board: { label: "Board Meeting", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
}

// Mock data
const upcomingMeetings = [
  {
    id: "1",
    company: "NeuralPath AI",
    logo: "/placeholder.svg",
    type: "dd" as MeetingType,
    title: "Deep Dive: Technical Architecture",
    date: "2024-01-15",
    time: "10:00 AM",
    duration: "60 min",
    location: "video",
    attendees: ["Sarah Chen (CEO)", "Mike Liu (CTO)", "You", "James Wilson"],
    prepMaterials: ["Technical Deck", "Architecture Diagram", "Security Audit"],
    notes: "Focus on scalability and data privacy compliance",
  },
  {
    id: "2",
    company: "FinanceFlow",
    logo: "/placeholder.svg",
    type: "intro" as MeetingType,
    title: "Introduction Call",
    date: "2024-01-15",
    time: "2:00 PM",
    duration: "30 min",
    location: "video",
    attendees: ["Alex Rivera (CEO)", "You"],
    prepMaterials: ["Pitch Deck", "One-Pager"],
    notes: "Referred by Sequoia, B2B payments focus",
  },
  {
    id: "3",
    company: "GreenTech Solutions",
    logo: "/placeholder.svg",
    type: "ic" as MeetingType,
    title: "IC Presentation",
    date: "2024-01-16",
    time: "9:00 AM",
    duration: "90 min",
    location: "in-person",
    attendees: ["Full IC Committee", "Emily Watson (CEO)"],
    prepMaterials: ["IC Memo", "Financial Model", "Term Sheet Draft"],
    notes: "Final decision meeting, $5M Series A",
  },
  {
    id: "4",
    company: "DataSync Pro",
    logo: "/placeholder.svg",
    type: "follow-up" as MeetingType,
    title: "Reference Check Discussion",
    date: "2024-01-17",
    time: "11:00 AM",
    duration: "30 min",
    location: "phone",
    attendees: ["You", "Previous Customer (Stripe)"],
    prepMaterials: ["Reference Questions"],
    notes: "Key customer reference for DD",
  },
]

const pendingRequests = [
  {
    id: "r1",
    company: "CloudSecure",
    logo: "/placeholder.svg",
    requestedBy: "Tom Harris (CEO)",
    type: "intro" as MeetingType,
    proposedTimes: ["Jan 18, 10:00 AM", "Jan 18, 2:00 PM", "Jan 19, 11:00 AM"],
    message: "Would love to discuss our Series A round. We're building enterprise security tools.",
    source: "Warm Intro via Accel",
    matchScore: 87,
    receivedAt: "2 hours ago",
  },
  {
    id: "r2",
    company: "HealthAI",
    logo: "/placeholder.svg",
    requestedBy: "Dr. Lisa Park (CEO)",
    type: "dd" as MeetingType,
    proposedTimes: ["Jan 19, 9:00 AM", "Jan 20, 3:00 PM"],
    message: "Following up on our intro call - ready to dive deeper into our clinical validation data.",
    source: "Pipeline - DD Stage",
    matchScore: 92,
    receivedAt: "1 day ago",
  },
  {
    id: "r3",
    company: "LogiChain",
    logo: "/placeholder.svg",
    requestedBy: "Mark Stevens (CEO)",
    type: "intro" as MeetingType,
    proposedTimes: ["Jan 22, 10:00 AM", "Jan 22, 4:00 PM"],
    message: "Supply chain optimization platform, $2M ARR, looking for Series A lead.",
    source: "Cold Inbound",
    matchScore: 74,
    receivedAt: "3 days ago",
  },
]

const meetingPrepData = {
  company: {
    name: "NeuralPath AI",
    logo: "/placeholder.svg",
    stage: "Series A",
    sector: "AI/ML",
    founded: "2022",
    location: "San Francisco, CA",
    employees: 28,
    raised: "$4.2M",
  },
  metrics: {
    arr: "$1.8M",
    growth: "+180% YoY",
    customers: 45,
    nrr: "135%",
  },
  keyQuestions: [
    "How does the model architecture handle edge cases in enterprise data?",
    "What's the timeline for SOC 2 Type II certification?",
    "How do you see the competitive landscape evolving with OpenAI's enterprise push?",
    "Walk me through your largest customer implementation",
    "What's driving the high NRR - expansion or pricing?",
  ],
  previousNotes: [
    {
      date: "Jan 5, 2024",
      type: "Intro Call",
      summary: "Strong technical team, impressive early traction. CEO has deep domain expertise from Google AI.",
      rating: "Strong",
    },
    {
      date: "Dec 20, 2023",
      type: "Email",
      summary: "Initial outreach, sent deck. Promising AI infrastructure play.",
      rating: null,
    },
  ],
  documents: [
    { name: "Technical Architecture Deck", type: "PDF", size: "4.2 MB" },
    { name: "Security & Compliance Overview", type: "PDF", size: "1.8 MB" },
    { name: "Customer Case Studies", type: "PDF", size: "2.5 MB" },
    { name: "Financial Model", type: "XLSX", size: "890 KB" },
  ],
}

const analyticsData = {
  thisWeek: 12,
  lastWeek: 9,
  thisMonth: 48,
  avgPerWeek: 10.5,
  byType: [
    { type: "Intro Calls", count: 24, percentage: 50 },
    { type: "Due Diligence", count: 14, percentage: 29 },
    { type: "IC Meetings", count: 4, percentage: 8 },
    { type: "Follow-ups", count: 6, percentage: 13 },
  ],
  conversionRates: [
    { stage: "Intro → DD", rate: 35, trend: "+5%" },
    { stage: "DD → IC", rate: 42, trend: "+8%" },
    { stage: "IC → Term Sheet", rate: 28, trend: "-2%" },
  ],
  timeAllocation: [
    { category: "New Deal Sourcing", hours: 8, color: "bg-blue-500" },
    { category: "Active DD", hours: 12, color: "bg-purple-500" },
    { category: "Portfolio Support", hours: 6, color: "bg-green-500" },
    { category: "IC Prep", hours: 4, color: "bg-amber-500" },
  ],
}

export default function InvestorMeetingsPage() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [selectedMeeting, setSelectedMeeting] = useState<typeof upcomingMeetings[0] | null>(null)
  const [prepModalOpen, setPrepModalOpen] = useState(false)
  const [notesModalOpen, setNotesModalOpen] = useState(false)
  const [requestModalOpen, setRequestModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<typeof pendingRequests[0] | null>(null)
  const [proposeTimeModalOpen, setProposeTimeModalOpen] = useState(false)
  
  // Post-meeting notes state
  const [meetingRating, setMeetingRating] = useState<string>("")
  const [meetingSummary, setMeetingSummary] = useState("")
  const [nextSteps, setNextSteps] = useState<string[]>(["", "", ""])
  const [actionItems, setActionItems] = useState<{task: string; owner: string; due: string}[]>([
    { task: "", owner: "", due: "" }
  ])

  // Calendar state
  const [currentWeek, setCurrentWeek] = useState(new Date())

  const getWeekDays = (date: Date) => {
    const start = new Date(date)
    start.setDate(start.getDate() - start.getDay() + 1) // Monday
    return Array.from({ length: 5 }, (_, i) => {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      return day
    })
  }

  const weekDays = getWeekDays(currentWeek)
  const hours = Array.from({ length: 10 }, (_, i) => i + 8) // 8 AM to 5 PM

  const handleAcceptRequest = (request: typeof pendingRequests[0]) => {
    setSelectedRequest(request)
    setRequestModalOpen(true)
  }

  const handleProposeTime = (request: typeof pendingRequests[0]) => {
    setSelectedRequest(request)
    setProposeTimeModalOpen(true)
  }

  const openPrepView = (meeting: typeof upcomingMeetings[0]) => {
    setSelectedMeeting(meeting)
    setPrepModalOpen(true)
  }

  const openNotesModal = (meeting: typeof upcomingMeetings[0]) => {
    setSelectedMeeting(meeting)
    setNotesModalOpen(true)
  }

  const addActionItem = () => {
    setActionItems([...actionItems, { task: "", owner: "", due: "" }])
  }

  const updateActionItem = (index: number, field: string, value: string) => {
    const updated = [...actionItems]
    updated[index] = { ...updated[index], [field]: value }
    setActionItems(updated)
  }

  const LocationIcon = ({ location }: { location: string }) => {
    switch (location) {
      case "video":
        return <Video className="w-4 h-4" />
      case "phone":
        return <Phone className="w-4 h-4" />
      case "in-person":
        return <MapPin className="w-4 h-4" />
      default:
        return <Video className="w-4 h-4" />
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="Meetings" breadcrumbs={[{ label: "Meetings" }]} />
        
        <main className="flex-1 overflow-auto p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Week</p>
                    <p className="text-2xl font-bold">{analyticsData.thisWeek}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="text-green-600">+{analyticsData.thisWeek - analyticsData.lastWeek}</span> from last week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Requests</p>
                    <p className="text-2xl font-bold">{pendingRequests.length}</p>
                  </div>
                  <div className="p-3 bg-amber-500/10 rounded-full">
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Awaiting response</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Intro → DD Rate</p>
                    <p className="text-2xl font-bold">{analyticsData.conversionRates[0].rate}%</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-full">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">{analyticsData.conversionRates[0].trend} this month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Today</p>
                    <p className="text-2xl font-bold">2</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-full">
                    <Video className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Next: 10:00 AM</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="requests">
                Requests
                {pendingRequests.length > 0 && (
                  <Badge variant="secondary" className="ml-2">{pendingRequests.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Upcoming Meetings Tab */}
            <TabsContent value="upcoming" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Upcoming Meetings</h2>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
              </div>
              
              <div className="space-y-3">
                {upcomingMeetings.map((meeting) => (
                  <Card key={meeting.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={meeting.logo || "/placeholder.svg"} alt={meeting.company} />
                          <AvatarFallback>{meeting.company[0]}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{meeting.company}</h3>
                                <Badge className={cn("text-xs", meetingTypeConfig[meeting.type].color)}>
                                  {meetingTypeConfig[meeting.type].label}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{meeting.title}</p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openPrepView(meeting)}
                              >
                                <FileText className="w-4 h-4 mr-1.5" />
                                Prep
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openNotesModal(meeting)}
                              >
                                <MessageSquare className="w-4 h-4 mr-1.5" />
                                Notes
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Reschedule</DropdownMenuItem>
                                  <DropdownMenuItem>Add to Calendar</DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {new Date(meeting.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              {meeting.time} ({meeting.duration})
                            </div>
                            <div className="flex items-center gap-1.5">
                              <LocationIcon location={meeting.location} />
                              {meeting.location === "video" ? "Video Call" : meeting.location === "phone" ? "Phone" : "In-Person"}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <div className="flex -space-x-2">
                              {meeting.attendees.slice(0, 3).map((attendee, i) => (
                                <Avatar key={i} className="w-6 h-6 border-2 border-background">
                                  <AvatarFallback className="text-xs">{attendee[0]}</AvatarFallback>
                                </Avatar>
                              ))}
                              {meeting.attendees.length > 3 && (
                                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                                  +{meeting.attendees.length - 3}
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">{meeting.attendees.length} attendees</span>
                          </div>
                          
                          {meeting.prepMaterials.length > 0 && (
                            <div className="flex items-center gap-2 mt-3">
                              <span className="text-xs text-muted-foreground">Prep:</span>
                              {meeting.prepMaterials.map((material, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {material}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Meeting Requests Tab */}
            <TabsContent value="requests" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Pending Meeting Requests</h2>
                <p className="text-sm text-muted-foreground">{pendingRequests.length} awaiting response</p>
              </div>
              
              <div className="space-y-3">
                {pendingRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={request.logo || "/placeholder.svg"} alt={request.company} />
                          <AvatarFallback>{request.company[0]}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{request.company}</h3>
                                <Badge className={cn("text-xs", meetingTypeConfig[request.type].color)}>
                                  {meetingTypeConfig[request.type].label}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {request.matchScore}% Match
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{request.requestedBy}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">{request.receivedAt}</span>
                          </div>
                          
                          <p className="text-sm mt-2">{request.message}</p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">{request.source}</Badge>
                          </div>
                          
                          <div className="mt-3">
                            <p className="text-xs text-muted-foreground mb-2">Proposed Times:</p>
                            <div className="flex flex-wrap gap-2">
                              {request.proposedTimes.map((time, i) => (
                                <Button 
                                  key={i} 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-xs bg-transparent"
                                  onClick={() => handleAcceptRequest(request)}
                                >
                                  {time}
                                </Button>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-4">
                            <Button size="sm" onClick={() => handleAcceptRequest(request)}>
                              <Check className="w-4 h-4 mr-1.5" />
                              Accept
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleProposeTime(request)}>
                              <RefreshCw className="w-4 h-4 mr-1.5" />
                              Propose Time
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <X className="w-4 h-4 mr-1.5" />
                              Decline
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Calendar Tab */}
            <TabsContent value="calendar" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" onClick={() => {
                    const newDate = new Date(currentWeek)
                    newDate.setDate(newDate.getDate() - 7)
                    setCurrentWeek(newDate)
                  }}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h2 className="text-lg font-semibold">
                    {weekDays[0].toLocaleDateString("en-US", { month: "long", day: "numeric" })} - {weekDays[4].toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </h2>
                  <Button variant="outline" size="icon" onClick={() => {
                    const newDate = new Date(currentWeek)
                    newDate.setDate(newDate.getDate() + 7)
                    setCurrentWeek(newDate)
                  }}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={() => setCurrentWeek(new Date())}>
                  Today
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <div className="grid grid-cols-6 border-b">
                    <div className="p-3 border-r" />
                    {weekDays.map((day, i) => (
                      <div key={i} className={cn(
                        "p-3 text-center border-r last:border-r-0",
                        day.toDateString() === new Date().toDateString() && "bg-primary/5"
                      )}>
                        <p className="text-xs text-muted-foreground">
                          {day.toLocaleDateString("en-US", { weekday: "short" })}
                        </p>
                        <p className={cn(
                          "text-lg font-semibold",
                          day.toDateString() === new Date().toDateString() && "text-primary"
                        )}>
                          {day.getDate()}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <ScrollArea className="h-[500px]">
                    <div className="grid grid-cols-6">
                      {hours.map((hour) => (
                        <div key={hour} className="contents">
                          <div className="p-2 border-r border-b text-xs text-muted-foreground text-right pr-3">
                            {hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? "PM" : "AM"}
                          </div>
                          {weekDays.map((day, dayIndex) => (
                            <div key={dayIndex} className="border-r border-b last:border-r-0 min-h-[60px] p-1 relative">
                              {/* Sample meeting blocks */}
                              {hour === 10 && dayIndex === 0 && (
                                <div className="absolute inset-x-1 top-1 bg-purple-100 dark:bg-purple-900/30 rounded p-1.5 border-l-2 border-purple-500">
                                  <p className="text-xs font-medium truncate">NeuralPath AI</p>
                                  <p className="text-xs text-muted-foreground">DD Call</p>
                                </div>
                              )}
                              {hour === 14 && dayIndex === 0 && (
                                <div className="absolute inset-x-1 top-1 bg-blue-100 dark:bg-blue-900/30 rounded p-1.5 border-l-2 border-blue-500">
                                  <p className="text-xs font-medium truncate">FinanceFlow</p>
                                  <p className="text-xs text-muted-foreground">Intro</p>
                                </div>
                              )}
                              {hour === 9 && dayIndex === 1 && (
                                <div className="absolute inset-x-1 top-1 bg-amber-100 dark:bg-amber-900/30 rounded p-1.5 border-l-2 border-amber-500 h-[90px]">
                                  <p className="text-xs font-medium truncate">GreenTech</p>
                                  <p className="text-xs text-muted-foreground">IC Meeting</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Meeting Volume */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Meeting Volume</CardTitle>
                    <CardDescription>Meetings by type this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.byType.map((item) => (
                        <div key={item.type}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">{item.type}</span>
                            <span className="text-sm font-medium">{item.count}</span>
                          </div>
                          <Progress value={item.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total this month</span>
                      <span className="font-semibold">{analyticsData.thisMonth} meetings</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Conversion Rates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Conversion Rates</CardTitle>
                    <CardDescription>Meeting to stage progression</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.conversionRates.map((item) => (
                        <div key={item.stage} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{item.stage}</p>
                            <p className={cn(
                              "text-xs",
                              item.trend.startsWith("+") ? "text-green-600" : "text-red-600"
                            )}>{item.trend} vs last month</p>
                          </div>
                          <div className="text-2xl font-bold">{item.rate}%</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Time Allocation */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">Time Allocation</CardTitle>
                    <CardDescription>Hours spent by activity this week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 h-8 rounded-lg overflow-hidden">
                      {analyticsData.timeAllocation.map((item) => (
                        <div 
                          key={item.category}
                          className={cn("h-full", item.color)}
                          style={{ width: `${(item.hours / 30) * 100}%` }}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {analyticsData.timeAllocation.map((item) => (
                        <div key={item.category} className="flex items-center gap-2">
                          <div className={cn("w-3 h-3 rounded-full", item.color)} />
                          <div>
                            <p className="text-sm font-medium">{item.hours}h</p>
                            <p className="text-xs text-muted-foreground">{item.category}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Meeting Prep Modal */}
      <Dialog open={prepModalOpen} onOpenChange={setPrepModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{meetingPrepData.company.name[0]}</AvatarFallback>
              </Avatar>
              Meeting Prep: {meetingPrepData.company.name}
            </DialogTitle>
            <DialogDescription>
              {selectedMeeting?.title} - {selectedMeeting?.date} at {selectedMeeting?.time}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="space-y-6 pb-4">
              {/* Company Summary */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Company Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Stage</p>
                    <p className="font-medium">{meetingPrepData.company.stage}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Sector</p>
                    <p className="font-medium">{meetingPrepData.company.sector}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">ARR</p>
                    <p className="font-medium">{meetingPrepData.metrics.arr}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Growth</p>
                    <p className="font-medium text-green-600">{meetingPrepData.metrics.growth}</p>
                  </div>
                </div>
              </div>

              {/* Key Questions */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Key Questions to Ask
                </h4>
                <div className="space-y-2">
                  {meetingPrepData.keyQuestions.map((question, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Checkbox id={`q-${i}`} />
                      <label htmlFor={`q-${i}`} className="text-sm cursor-pointer">{question}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Previous Notes */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Previous Interaction Notes
                </h4>
                <div className="space-y-3">
                  {meetingPrepData.previousNotes.map((note, i) => (
                    <div key={i} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{note.type}</Badge>
                          <span className="text-xs text-muted-foreground">{note.date}</span>
                        </div>
                        {note.rating && (
                          <Badge className={cn(
                            note.rating === "Strong" 
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          )}>
                            {note.rating}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm">{note.summary}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Documents to Review
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {meetingPrepData.documents.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.type} - {doc.size}</p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPrepModalOpen(false)}>Close</Button>
            <Button>
              <Video className="w-4 h-4 mr-2" />
              Join Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Post-Meeting Notes Modal */}
      <Dialog open={notesModalOpen} onOpenChange={setNotesModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Post-Meeting Notes</DialogTitle>
            <DialogDescription>
              {selectedMeeting?.company} - {selectedMeeting?.title}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="space-y-6 pb-4">
              {/* Rating */}
              <div>
                <Label className="text-sm font-semibold">Meeting Rating</Label>
                <RadioGroup value={meetingRating} onValueChange={setMeetingRating} className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="strong" id="strong" />
                    <Label htmlFor="strong" className="flex items-center gap-1.5 cursor-pointer">
                      <Star className="w-4 h-4 text-green-500 fill-green-500" />
                      Strong
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="good" />
                    <Label htmlFor="good" className="flex items-center gap-1.5 cursor-pointer">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      Good
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pass" id="pass" />
                    <Label htmlFor="pass" className="flex items-center gap-1.5 cursor-pointer">
                      <X className="w-4 h-4 text-red-500" />
                      Pass
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Summary */}
              <div>
                <Label htmlFor="summary" className="text-sm font-semibold">Meeting Summary</Label>
                <Textarea 
                  id="summary"
                  placeholder="Key takeaways from the meeting..."
                  value={meetingSummary}
                  onChange={(e) => setMeetingSummary(e.target.value)}
                  className="mt-2 min-h-[100px]"
                />
              </div>

              {/* Next Steps */}
              <div>
                <Label className="text-sm font-semibold">Next Steps</Label>
                <div className="space-y-2 mt-2">
                  {nextSteps.map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground w-4">{i + 1}.</span>
                      <Input 
                        placeholder={`Next step ${i + 1}`}
                        value={step}
                        onChange={(e) => {
                          const updated = [...nextSteps]
                          updated[i] = e.target.value
                          setNextSteps(updated)
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Items */}
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Action Items</Label>
                  <Button variant="ghost" size="sm" onClick={addActionItem}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-3 mt-2">
                  {actionItems.map((item, i) => (
                    <div key={i} className="grid grid-cols-3 gap-2">
                      <Input 
                        placeholder="Task"
                        value={item.task}
                        onChange={(e) => updateActionItem(i, "task", e.target.value)}
                        className="col-span-1"
                      />
                      <Input 
                        placeholder="Owner"
                        value={item.owner}
                        onChange={(e) => updateActionItem(i, "owner", e.target.value)}
                      />
                      <Input 
                        placeholder="Due date"
                        type="date"
                        value={item.due}
                        onChange={(e) => updateActionItem(i, "due", e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotesModalOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              setNotesModalOpen(false)
              // Reset form
              setMeetingRating("")
              setMeetingSummary("")
              setNextSteps(["", "", ""])
              setActionItems([{ task: "", owner: "", due: "" }])
            }}>
              Save Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Accept Request Modal */}
      <Dialog open={requestModalOpen} onOpenChange={setRequestModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Meeting Request</DialogTitle>
            <DialogDescription>
              Confirm meeting with {selectedRequest?.company}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Select Time</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {selectedRequest?.proposedTimes.map((time, i) => (
                  <Button key={i} variant="outline" className="justify-start bg-transparent">
                    <Calendar className="w-4 h-4 mr-2" />
                    {time}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="message">Add a message (optional)</Label>
              <Textarea id="message" placeholder="Looking forward to our conversation..." className="mt-2" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setRequestModalOpen(false)}>
              <Send className="w-4 h-4 mr-2" />
              Confirm & Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Propose Alternative Time Modal */}
      <Dialog open={proposeTimeModalOpen} onOpenChange={setProposeTimeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Propose Alternative Time</DialogTitle>
            <DialogDescription>
              Suggest new times for {selectedRequest?.company}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Propose Times</Label>
              <div className="space-y-2 mt-2">
                <Input type="datetime-local" />
                <Input type="datetime-local" />
                <Input type="datetime-local" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="reason">Message</Label>
              <Textarea id="reason" placeholder="I'm not available at those times, but these work better..." className="mt-2" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setProposeTimeModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setProposeTimeModalOpen(false)}>
              <Send className="w-4 h-4 mr-2" />
              Send Proposal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

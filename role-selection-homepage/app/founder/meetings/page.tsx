"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  User,
  Building2,
  Check,
  X,
  CalendarClock,
  FileText,
  ExternalLink,
  Settings,
  Copy,
  Plus,
  ChevronLeft,
  ChevronRight,
  Linkedin,
  Mail,
  Lightbulb,
  ClipboardList,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

interface MeetingRequest {
  id: string
  investor: {
    name: string
    firm: string
    title: string
    avatar: string
  }
  type: string
  duration: number
  proposedDate: string
  proposedTime: string
  note: string
  status: "pending" | "accepted" | "declined"
}

interface ScheduledMeeting {
  id: string
  investor: {
    name: string
    firm: string
    avatar: string
  }
  type: string
  date: string
  time: string
  location: string
  prepared: boolean
}

const meetingRequests: MeetingRequest[] = [
  {
    id: "req1",
    investor: {
      name: "Priya Mehta",
      firm: "Sequoia Capital",
      title: "Partner",
      avatar: "/placeholder-user.jpg",
    },
    type: "Intro Call",
    duration: 30,
    proposedDate: "Jan 20, 2026",
    proposedTime: "2:00 PM IST",
    note: "Looking forward to learning more about TalentFlow's traction in the HR tech space.",
    status: "pending",
  },
  {
    id: "req2",
    investor: {
      name: "David Chen",
      firm: "Lightspeed Ventures",
      title: "Senior Associate",
      avatar: "/placeholder-user.jpg",
    },
    type: "Deep Dive",
    duration: 60,
    proposedDate: "Jan 22, 2026",
    proposedTime: "11:00 AM IST",
    note: "Want to dive deeper into your unit economics and customer acquisition strategy.",
    status: "pending",
  },
]

const upcomingMeetings: ScheduledMeeting[] = [
  {
    id: "meet1",
    investor: {
      name: "Sarah Johnson",
      firm: "Accel Partners",
      avatar: "/placeholder-user.jpg",
    },
    type: "Follow-up Call",
    date: "Jan 18, 2026",
    time: "3:00 PM IST",
    location: "Google Meet",
    prepared: true,
  },
  {
    id: "meet2",
    investor: {
      name: "Michael Brown",
      firm: "Tiger Global",
      avatar: "/placeholder-user.jpg",
    },
    type: "Partner Meeting",
    date: "Jan 19, 2026",
    time: "10:30 AM IST",
    location: "Zoom",
    prepared: false,
  },
]

export default function MeetingsPage() {
  const [selectedTab, setSelectedTab] = useState("requests")
  const [calendarSynced, setCalendarSynced] = useState(true)
  const [proposeTimeOpen, setProposeTimeOpen] = useState(false)
  const [prepMeetingOpen, setPrepMeetingOpen] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<ScheduledMeeting | null>(null)

  const handleAcceptRequest = (requestId: string) => {
    toast.success("Meeting accepted and added to your calendar")
  }

  const handleDeclineRequest = (requestId: string) => {
    toast.success("Meeting request declined")
  }

  const copySchedulingLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/schedule/your-startup`)
    toast.success("Scheduling link copied to clipboard!")
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Meeting Scheduler</h1>
                <p className="text-muted-foreground mt-1">
                  Manage investor meetings and calendar availability
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2 bg-transparent" onClick={copySchedulingLink}>
                  <Copy className="w-4 h-4" />
                  Copy Scheduling Link
                </Button>
                <Button className="gap-2" asChild>
                  <Link href="/founder/meetings/settings">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </Button>
              </div>
            </div>

            {/* Calendar Sync Status */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Google Calendar</p>
                      <p className="text-sm text-muted-foreground">
                        {calendarSynced ? "Synced • Last updated 5 min ago" : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <Button variant={calendarSynced ? "outline" : "default"}>
                    {calendarSynced ? "Reconnect" : "Connect Calendar"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Main Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="requests" className="gap-2">
                  <CalendarClock className="w-4 h-4" />
                  Requests
                  <Badge variant="default" className="ml-1">
                    {meetingRequests.filter((r) => r.status === "pending").length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Upcoming
                </TabsTrigger>
                <TabsTrigger value="availability" className="gap-2">
                  <Clock className="w-4 h-4" />
                  Availability
                </TabsTrigger>
              </TabsList>

              {/* Meeting Requests Tab */}
              <TabsContent value="requests" className="space-y-4">
                {meetingRequests
                  .filter((req) => req.status === "pending")
                  .map((request) => (
                    <Card key={request.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={request.investor.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{request.investor.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{request.investor.name}</CardTitle>
                              <CardDescription>
                                {request.investor.title} • {request.investor.firm}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant="secondary">{request.type}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>{request.proposedDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {request.proposedTime} ({request.duration} min)
                            </span>
                          </div>
                        </div>

                        {request.note && (
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-sm text-muted-foreground italic">"{request.note}"</p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            className="flex-1 gap-2"
                            onClick={() => handleAcceptRequest(request.id)}
                          >
                            <Check className="w-4 h-4" />
                            Accept
                          </Button>
                          <Dialog open={proposeTimeOpen} onOpenChange={setProposeTimeOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="flex-1 bg-transparent">
                                Propose New Time
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Propose Alternative Time</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 pt-4">
                                <div className="space-y-2">
                                  <Label>Date</Label>
                                  <Input type="date" />
                                </div>
                                <div className="space-y-2">
                                  <Label>Time</Label>
                                  <Input type="time" />
                                </div>
                                <div className="space-y-2">
                                  <Label>Optional Message</Label>
                                  <Textarea placeholder="Let them know why you're proposing a different time..." />
                                </div>
                                <div className="flex gap-2">
                                  <Button className="flex-1">Send Proposal</Button>
                                  <Button variant="outline" onClick={() => setProposeTimeOpen(false)}>
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeclineRequest(request.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>

              {/* Upcoming Meetings Tab */}
              <TabsContent value="upcoming" className="space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <Card key={meeting.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={meeting.investor.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{meeting.investor.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{meeting.investor.name}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {meeting.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {meeting.investor.firm}
                            </p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span>{meeting.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span>{meeting.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Video className="w-4 h-4 text-muted-foreground" />
                                <span>{meeting.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {meeting.prepared ? (
                                  <>
                                    <Check className="w-4 h-4 text-green-600" />
                                    <span className="text-green-600">Prepared</span>
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="w-4 h-4 text-amber-600" />
                                    <span className="text-amber-600">Needs Prep</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedMeeting(meeting)
                              setPrepMeetingOpen(true)
                            }}
                          >
                            {meeting.prepared ? "Review Prep" : "Prepare"}
                          </Button>
                          <Button size="sm" className="gap-2" asChild>
                            <a href="#">
                              <ExternalLink className="w-4 h-4" />
                              Join
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Availability Tab */}
              <TabsContent value="availability" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Availability</CardTitle>
                    <CardDescription>Set your preferred meeting times for each day</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                      <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Switch defaultChecked />
                          <span className="font-medium">{day}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input type="time" defaultValue="09:00" className="w-32" />
                          <span className="text-muted-foreground">to</span>
                          <Input type="time" defaultValue="17:00" className="w-32" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Buffer Time</CardTitle>
                    <CardDescription>Add buffer between meetings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Select defaultValue="15">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No buffer</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Meeting Prep Dialog */}
      <Dialog open={prepMeetingOpen} onOpenChange={setPrepMeetingOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Meeting Preparation</DialogTitle>
          </DialogHeader>
          {selectedMeeting && (
            <div className="space-y-6 pt-4">
              {/* Investor Research */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Investor Research
                </h3>
                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={selectedMeeting.investor.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{selectedMeeting.investor.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{selectedMeeting.investor.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedMeeting.investor.firm}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <a href="#" target="_blank">
                            <Linkedin className="w-4 h-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Key Insights:</p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Focus on SaaS companies in HR and enterprise software</li>
                        <li>Previously invested in 3 HR tech startups</li>
                        <li>Interested in AI-powered solutions</li>
                        <li>Typically leads Series A rounds ($5-15M)</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Suggested Talking Points */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Suggested Talking Points
                </h3>
                <Card>
                  <CardContent className="pt-6">
                    <ul className="space-y-2">
                      {[
                        "Highlight 150% YoY growth in enterprise segment",
                        "Discuss AI-powered matching algorithm improvements",
                        "Mention recent partnership with Fortune 500 company",
                        "Address Series A timeline and use of funds",
                      ].map((point, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Documents to Share */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Documents to Share
                </h3>
                <div className="space-y-2">
                  {["Pitch Deck v3.pdf", "Financial Model Q4 2025.xlsx", "Product Demo Link"].map(
                    (doc) => (
                      <div
                        key={doc}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{doc}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          Share
                        </Button>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Post-Meeting Notes */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" />
                  Post-Meeting Notes Template
                </h3>
                <Textarea
                  placeholder="Key discussion points:&#10;- &#10;&#10;Action items:&#10;- &#10;&#10;Next steps:&#10;- &#10;&#10;Overall impression:&#10;- "
                  className="min-h-32"
                />
              </div>

              <Button className="w-full" onClick={() => setPrepMeetingOpen(false)}>
                Mark as Prepared
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Add missing import
import { AlertCircle } from "lucide-react"

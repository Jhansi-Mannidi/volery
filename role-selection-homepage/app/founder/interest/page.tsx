"use client"

import { useState } from "react"
import { 
  Eye, 
  Clock, 
  FileText, 
  TrendingUp, 
  Users, 
  Globe, 
  Bell,
  Download,
  Star,
  Filter,
  MapPin,
  ChevronDown,
  ChevronRight,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

interface ViewActivity {
  investor: string
  investorFirm: string
  content: string
  duration: string
  timestamp: string
  avatar?: string
}

interface HotLead {
  investor: string
  firm: string
  engagement: string
  score: number
  signals: string[]
  avatar?: string
}

const getFilteredData = (filter: string) => {
  // This would typically come from an API based on the time filter
  // For now, returning mock data that varies by filter
  const dataByFilter: Record<string, { views: number; viewsChange: number; docViews: number; docChange: number; uniqueInvestors: number; investorChange: number; avgTime: number; timeChange: number; recentViews: ViewActivity[]; hotLeads: HotLead[] }> = {
    day: {
      views: 45,
      viewsChange: 12,
      docViews: 28,
      docChange: 8,
      uniqueInvestors: 12,
      investorChange: 3,
      avgTime: 7.2,
      timeChange: 1.5,
      recentViews: [
        {
          investor: "Priya Sharma",
          investorFirm: "Sequoia Capital",
          content: "Pitch Deck",
          duration: "12 min",
          timestamp: "2 hrs ago",
        },
        {
          investor: "Rajesh Kumar",
          investorFirm: "Accel Partners",
          content: "Financial Model",
          duration: "8 min",
          timestamp: "5 hrs ago",
        },
      ],
      hotLeads: [
        {
          investor: "Priya Sharma",
          firm: "Sequoia Capital",
          engagement: "Very High",
          score: 95,
          signals: ["Viewed deck 4x", "Downloaded model", "Spent 18+ min total"],
        },
        {
          investor: "Rajesh Kumar",
          firm: "Accel Partners",
          engagement: "High",
          score: 82,
          signals: ["Spent 15+ min total", "Viewed team page", "Opened 3 documents"],
        },
      ],
    },
    week: {
      views: 324,
      viewsChange: 23,
      docViews: 156,
      docChange: 15,
      uniqueInvestors: 42,
      investorChange: 8,
      avgTime: 6.4,
      timeChange: 1.2,
      recentViews: [
        {
          investor: "Priya Sharma",
          investorFirm: "Sequoia Capital",
          content: "Pitch Deck",
          duration: "12 min",
          timestamp: "2 hrs ago",
        },
        {
          investor: "Rajesh Kumar",
          investorFirm: "Accel Partners",
          content: "Financial Model",
          duration: "8 min",
          timestamp: "5 hrs ago",
        },
        {
          investor: "Sarah Chen",
          investorFirm: "Matrix Partners",
          content: "Company Profile",
          duration: "3 min",
          timestamp: "1 day ago",
        },
        {
          investor: "Michael Roberts",
          investorFirm: "Lightspeed Venture",
          content: "Team Page",
          duration: "6 min",
          timestamp: "1 day ago",
        },
        {
          investor: "Anita Patel",
          investorFirm: "Tiger Global",
          content: "Cap Table",
          duration: "15 min",
          timestamp: "2 days ago",
        },
      ],
      hotLeads: [
        {
          investor: "Priya Sharma",
          firm: "Sequoia Capital",
          engagement: "Very High",
          score: 95,
          signals: ["Viewed deck 4x", "Downloaded model", "Spent 18+ min total"],
        },
        {
          investor: "Rajesh Kumar",
          firm: "Accel Partners",
          engagement: "High",
          score: 82,
          signals: ["Spent 15+ min total", "Viewed team page", "Opened 3 documents"],
        },
        {
          investor: "Anita Patel",
          firm: "Tiger Global",
          engagement: "High",
          score: 78,
          signals: ["Downloaded cap table", "Viewed metrics 2x", "Spent 12+ min"],
        },
      ],
    },
    month: {
      views: 892,
      viewsChange: 45,
      docViews: 534,
      docChange: 38,
      uniqueInvestors: 108,
      investorChange: 28,
      avgTime: 5.8,
      timeChange: 0.8,
      recentViews: [
        {
          investor: "Priya Sharma",
          investorFirm: "Sequoia Capital",
          content: "Pitch Deck",
          duration: "12 min",
          timestamp: "2 hrs ago",
        },
        {
          investor: "Rajesh Kumar",
          investorFirm: "Accel Partners",
          content: "Financial Model",
          duration: "8 min",
          timestamp: "5 hrs ago",
        },
        {
          investor: "Sarah Chen",
          investorFirm: "Matrix Partners",
          content: "Company Profile",
          duration: "3 min",
          timestamp: "1 day ago",
        },
        {
          investor: "Michael Roberts",
          investorFirm: "Lightspeed Venture",
          content: "Team Page",
          duration: "6 min",
          timestamp: "1 day ago",
        },
        {
          investor: "Anita Patel",
          investorFirm: "Tiger Global",
          content: "Cap Table",
          duration: "15 min",
          timestamp: "2 days ago",
        },
      ],
      hotLeads: [
        {
          investor: "Priya Sharma",
          firm: "Sequoia Capital",
          engagement: "Very High",
          score: 95,
          signals: ["Viewed deck 4x", "Downloaded model", "Spent 18+ min total"],
        },
        {
          investor: "Rajesh Kumar",
          investorFirm: "Accel Partners",
          engagement: "High",
          score: 82,
          signals: ["Spent 15+ min total", "Viewed team page", "Opened 3 documents"],
        },
        {
          investor: "Anita Patel",
          firm: "Tiger Global",
          engagement: "High",
          score: 78,
          signals: ["Downloaded cap table", "Viewed metrics 2x", "Spent 12+ min"],
        },
      ],
    },
    all: {
      views: 2145,
      viewsChange: 82,
      docViews: 1289,
      docChange: 72,
      uniqueInvestors: 256,
      investorChange: 64,
      avgTime: 5.2,
      timeChange: 0.3,
      recentViews: [
        {
          investor: "Priya Sharma",
          investorFirm: "Sequoia Capital",
          content: "Pitch Deck",
          duration: "12 min",
          timestamp: "2 hrs ago",
        },
        {
          investor: "Rajesh Kumar",
          investorFirm: "Accel Partners",
          content: "Financial Model",
          duration: "8 min",
          timestamp: "5 hrs ago",
        },
        {
          investor: "Sarah Chen",
          investorFirm: "Matrix Partners",
          content: "Company Profile",
          duration: "3 min",
          timestamp: "1 day ago",
        },
        {
          investor: "Michael Roberts",
          investorFirm: "Lightspeed Venture",
          content: "Team Page",
          duration: "6 min",
          timestamp: "1 day ago",
        },
        {
          investor: "Anita Patel",
          investorFirm: "Tiger Global",
          content: "Cap Table",
          duration: "15 min",
          timestamp: "2 days ago",
        },
      ],
      hotLeads: [
        {
          investor: "Priya Sharma",
          firm: "Sequoia Capital",
          engagement: "Very High",
          score: 95,
          signals: ["Viewed deck 4x", "Downloaded model", "Spent 18+ min total"],
        },
        {
          investor: "Rajesh Kumar",
          investorFirm: "Accel Partners",
          engagement: "High",
          score: 82,
          signals: ["Spent 15+ min total", "Viewed team page", "Opened 3 documents"],
        },
        {
          investor: "Anita Patel",
          investorFirm: "Tiger Global",
          engagement: "High",
          score: 78,
          signals: ["Downloaded cap table", "Viewed metrics 2x", "Spent 12+ min"],
        },
      ],
    },
  }

  return dataByFilter[filter] || dataByFilter.week
}

const geographicData = [
  { region: "North America", views: 145, percentage: 45 },
  { region: "Europe", views: 98, percentage: 30 },
  { region: "Asia Pacific", views: 65, percentage: 20 },
  { region: "Others", views: 16, percentage: 5 },
]

export default function InvestorInterestPage() {
  const [timeFilter, setTimeFilter] = useState("week")
  const [notifyProfileView, setNotifyProfileView] = useState(true)
  const [notifyDeckOpen, setNotifyDeckOpen] = useState(true)
  const [notifyDownload, setNotifyDownload] = useState(true)
  const [minDuration, setMinDuration] = useState("5")

  const filteredData = getFilteredData(timeFilter)
  const { recentViews, hotLeads } = getFilteredData(timeFilter)

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Investor Interest Tracker</h1>
                <p className="text-muted-foreground mt-1">
                  Monitor who's viewing your startup profile and content
                </p>
              </div>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{filteredData.views}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">+{filteredData.viewsChange}%</span> vs last period
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Document Views</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{filteredData.docViews}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">+{filteredData.docChange}%</span> vs last period
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unique Investors</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{filteredData.uniqueInvestors}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">+{filteredData.investorChange}</span> new
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Time Spent</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{filteredData.avgTime} min</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">+{filteredData.timeChange} min</span> vs last period
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Recent Views */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Recent Views</CardTitle>
                        <CardDescription>Real-time investor engagement activity</CardDescription>
                      </div>
                      <Badge variant="secondary" className="gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Live
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Investor</TableHead>
                          <TableHead>What They Viewed</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>When</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.recentViews.map((view, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs">
                                    {view.investor.split(" ").map(n => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm">{view.investor}</p>
                                  <p className="text-xs text-muted-foreground">{view.investorFirm}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{view.content}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{view.duration}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {view.timestamp}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* Hot Leads */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-amber-500" />
                      Hot Leads
                    </CardTitle>
                    <CardDescription>Algorithm-identified high-engagement investors</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {filteredData.hotLeads.map((lead, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {lead.investor.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{lead.investor}</p>
                              <p className="text-xs text-muted-foreground">{lead.firm}</p>
                            </div>
                          </div>
                          <Badge 
                            variant={lead.score >= 90 ? "default" : "secondary"}
                            className="shrink-0"
                          >
                            {lead.score}%
                          </Badge>
                        </div>
                        <div className="space-y-1.5 ml-13">
                          {lead.signals.map((signal, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="w-1 h-1 rounded-full bg-green-500" />
                              {signal}
                            </div>
                          ))}
                        </div>
                        {index < filteredData.hotLeads.length - 1 && <Separator />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Engagement Analytics & Alerts */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Geographic Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Geographic Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {geographicData.map((data, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{data.region}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{data.views} views</span>
                          <span className="font-medium">{data.percentage}%</span>
                        </div>
                      </div>
                      <Progress value={data.percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Alert Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Alert Configuration
                  </CardTitle>
                  <CardDescription>Get notified about investor engagement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-profile">Profile Views</Label>
                        <p className="text-xs text-muted-foreground">
                          When an investor views your profile
                        </p>
                      </div>
                      <Switch
                        id="notify-profile"
                        checked={notifyProfileView}
                        onCheckedChange={setNotifyProfileView}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-deck">Pitch Deck Opens</Label>
                        <p className="text-xs text-muted-foreground">
                          When your pitch deck is opened
                        </p>
                      </div>
                      <Switch
                        id="notify-deck"
                        checked={notifyDeckOpen}
                        onCheckedChange={setNotifyDeckOpen}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-download">Document Downloads</Label>
                        <p className="text-xs text-muted-foreground">
                          When documents are downloaded
                        </p>
                      </div>
                      <Switch
                        id="notify-download"
                        checked={notifyDownload}
                        onCheckedChange={setNotifyDownload}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="min-duration">Minimum Duration Threshold</Label>
                      <p className="text-xs text-muted-foreground mb-2">
                        Only notify if viewing time exceeds:
                      </p>
                      <Select value={minDuration} onValueChange={setMinDuration}>
                        <SelectTrigger id="min-duration">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 minute</SelectItem>
                          <SelectItem value="3">3 minutes</SelectItem>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="10">10 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Smart Alerts Enabled</p>
                      <p className="text-xs text-muted-foreground">
                        We'll group multiple views from the same investor and only send high-priority notifications
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Send,
  Mail,
  MailOpen,
  MessageSquare,
  Calendar,
  FileText,
  Eye,
  Clock,
  TrendingUp,
  MoreHorizontal,
  Paperclip,
  Zap,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type OutreachStatus = "draft" | "sent" | "opened" | "responded" | "meeting" | "term_sheet"

interface OutreachCard {
  id: string
  investor: {
    name: string
    firm: string
  }
  status: OutreachStatus
  subject: string
  sentDate?: string
  openCount?: number
  lastOpened?: string
  responseDate?: string
  attachments: string[]
  template: string
}

const statusColumns: { status: OutreachStatus; label: string; icon: typeof Mail }[] = [
  { status: "draft", label: "Draft", icon: FileText },
  { status: "sent", label: "Sent", icon: Send },
  { status: "opened", label: "Opened", icon: MailOpen },
  { status: "responded", label: "Responded", icon: MessageSquare },
  { status: "meeting", label: "Meeting", icon: Calendar },
  { status: "term_sheet", label: "Term Sheet", icon: CheckCircle2 },
]

const emailTemplates = [
  { id: "cold", name: "Cold Outreach", description: "First contact with an investor" },
  { id: "warm", name: "Warm Intro Request", description: "Request introduction through connection" },
  { id: "followup", name: "Follow-up", description: "Follow up on previous email" },
  { id: "meeting", name: "Meeting Request", description: "Request a meeting or call" },
]

const mockOutreach: OutreachCard[] = [
  {
    id: "1",
    investor: { name: "Priya Mehta", firm: "Sequoia Capital" },
    status: "opened",
    subject: "Disrupting B2B SaaS with AI",
    sentDate: "Jan 15, 2026",
    openCount: 5,
    lastOpened: "2 hours ago",
    attachments: ["Pitch Deck", "Financial Model"],
    template: "cold",
  },
  {
    id: "2",
    investor: { name: "John Chen", firm: "Accel" },
    status: "meeting",
    subject: "Follow-up: Partnership Opportunity",
    sentDate: "Jan 12, 2026",
    openCount: 3,
    responseDate: "Jan 13, 2026",
    attachments: ["Pitch Deck"],
    template: "followup",
  },
  {
    id: "3",
    investor: { name: "Sarah Williams", firm: "Greylock" },
    status: "sent",
    subject: "Introduction to TechCorp AI",
    sentDate: "Jan 16, 2026",
    attachments: ["Pitch Deck", "One-Pager"],
    template: "warm",
  },
  {
    id: "4",
    investor: { name: "Alex Thompson", firm: "Lightspeed" },
    status: "draft",
    subject: "Seed Round Opportunity",
    attachments: [],
    template: "cold",
  },
]

export default function FounderOutreachPage() {
  const [outreachCards, setOutreachCards] = useState<OutreachCard[]>(mockOutreach)
  const [showCompose, setShowCompose] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [viewFilter, setViewFilter] = useState<OutreachStatus | "all">("all")

  const filteredCards = viewFilter === "all" 
    ? outreachCards 
    : outreachCards.filter((card) => card.status === viewFilter)

  const getColumnCards = (status: OutreachStatus) => {
    return outreachCards.filter((card) => card.status === status)
  }

  const metrics = {
    sent: outreachCards.filter((c) => ["sent", "opened", "responded", "meeting", "term_sheet"].includes(c.status)).length,
    openRate: Math.round((outreachCards.filter((c) => c.openCount).length / Math.max(outreachCards.filter((c) => ["sent", "opened", "responded", "meeting", "term_sheet"].includes(c.status)).length, 1)) * 100),
    responseRate: Math.round((outreachCards.filter((c) => c.responseDate).length / Math.max(outreachCards.filter((c) => ["sent", "opened", "responded", "meeting", "term_sheet"].includes(c.status)).length, 1)) * 100),
    avgResponseTime: "2.3 days",
  }

  const handleSendEmail = () => {
    toast.success("Email sent successfully!")
    setShowCompose(false)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Outreach Tracker</h1>
                <p className="text-muted-foreground">
                  Manage and track all investor communications
                </p>
              </div>
              <Dialog open={showCompose} onOpenChange={setShowCompose}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Compose Email
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Compose Outreach Email</DialogTitle>
                    <DialogDescription>
                      Select a template and customize your message
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Email Template</Label>
                      <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a template" />
                        </SelectTrigger>
                        <SelectContent>
                          {emailTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              <div>
                                <div className="font-medium">{template.name}</div>
                                <div className="text-xs text-muted-foreground">{template.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>To</Label>
                      <Input placeholder="Investor name or email" />
                    </div>
                    <div>
                      <Label>Subject</Label>
                      <Input placeholder="Email subject" />
                    </div>
                    <div>
                      <Label>Message</Label>
                      <Textarea
                        rows={8}
                        placeholder="Compose your message..."
                        defaultValue={
                          selectedTemplate === "cold"
                            ? "Hi [Name],\n\nI'm reaching out because I believe [Your Company] aligns perfectly with your investment thesis in [sector].\n\nWe're building [brief value proposition]...\n\nBest regards"
                            : ""
                        }
                      />
                    </div>
                    <div>
                      <Label>Attachments</Label>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                          <Paperclip className="w-4 h-4" />
                          Pitch Deck
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                          <Paperclip className="w-4 h-4" />
                          Financial Model
                        </Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCompose(false)}>
                      Save as Draft
                    </Button>
                    <Button onClick={handleSendEmail} className="gap-2">
                      <Send className="w-4 h-4" />
                      Send Email
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Emails Sent</p>
                    <p className="text-2xl font-bold">{metrics.sent}</p>
                  </div>
                  <Send className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Open Rate</p>
                    <p className="text-2xl font-bold">{metrics.openRate}%</p>
                  </div>
                  <Eye className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Response Rate</p>
                    <p className="text-2xl font-bold">{metrics.responseRate}%</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                    <p className="text-2xl font-bold">{metrics.avgResponseTime}</p>
                  </div>
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* View Filter */}
          <Tabs value={viewFilter} onValueChange={(v) => setViewFilter(v as OutreachStatus | "all")} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              {statusColumns.map((col) => (
                <TabsTrigger key={col.status} value={col.status}>
                  {col.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Kanban Board */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {statusColumns.map((column) => {
                const columnCards = getColumnCards(column.status)
                const ColumnIcon = column.icon
                return (
                  <div key={column.status} className="w-80 flex-shrink-0">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ColumnIcon className="w-4 h-4 text-muted-foreground" />
                        <h3 className="font-semibold">{column.label}</h3>
                        <Badge variant="secondary">{columnCards.length}</Badge>
                      </div>
                    </div>
                    <div className="space-y-3 min-h-[400px] bg-secondary/20 rounded-lg p-3">
                      {columnCards.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                          No emails
                        </div>
                      ) : (
                        columnCards.map((card) => (
                          <Card key={card.id} className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardHeader className="p-4 pb-2">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <Avatar className="w-8 h-8 flex-shrink-0">
                                    <AvatarFallback className="text-xs">
                                      {card.investor.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="min-w-0 flex-1">
                                    <div className="font-medium text-sm truncate">{card.investor.name}</div>
                                    <div className="text-xs text-muted-foreground truncate">{card.investor.firm}</div>
                                  </div>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Thread
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Send className="w-4 h-4 mr-2" />
                                      Follow Up
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <ExternalLink className="w-4 h-4 mr-2" />
                                      View Profile
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-2 space-y-2">
                              <p className="text-sm font-medium line-clamp-2">{card.subject}</p>

                              {card.sentDate && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  <span>Sent: {card.sentDate}</span>
                                </div>
                              )}

                              {card.openCount !== undefined && card.openCount > 0 && (
                                <div className="flex items-center gap-1 text-xs text-blue-600">
                                  <Eye className="w-3 h-3" />
                                  <span>Opened {card.openCount} times</span>
                                </div>
                              )}

                              {card.lastOpened && (
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                  <Zap className="w-3 h-3" />
                                  <span>Last opened: {card.lastOpened}</span>
                                </div>
                              )}

                              {card.responseDate && (
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Responded: {card.responseDate}</span>
                                </div>
                              )}

                              {card.attachments.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {card.attachments.map((att) => (
                                    <Badge key={att} variant="outline" className="text-xs">
                                      <Paperclip className="w-3 h-3 mr-1" />
                                      {att}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              <div className="flex gap-2 pt-2">
                                <Button size="sm" variant="outline" className="flex-1 text-xs bg-transparent">
                                  View Thread
                                </Button>
                                {card.status !== "term_sheet" && (
                                  <Button size="sm" className="flex-1 text-xs">
                                    Follow Up
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Best Performing Templates */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Template Performance</CardTitle>
              <CardDescription>See which email templates are performing best</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emailTemplates.slice(0, 3).map((template, index) => {
                  const rate = [72, 68, 45][index]
                  return (
                    <div key={template.id} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{template.name}</span>
                          <span className="text-sm text-muted-foreground">{rate}% open rate</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full transition-all",
                              rate > 65 ? "bg-green-500" : rate > 50 ? "bg-yellow-500" : "bg-red-500"
                            )}
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Use Template
                      </Button>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

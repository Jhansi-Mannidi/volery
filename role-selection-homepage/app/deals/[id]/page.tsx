"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Edit3,
  ExternalLink,
  FileText,
  Globe,
  Linkedin,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Plus,
  Save,
  Send,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

// Mock deal data
const dealData = {
  id: "1",
  name: "TalentFlow",
  tagline: "HR Analytics SaaS",
  description: "TalentFlow is an AI-powered HR analytics platform that helps enterprises optimize their workforce through predictive analytics, employee engagement insights, and talent management tools.",
  stage: "Series A",
  pipelineStage: "Deep Dive",
  checkSize: "₹15 Cr",
  valuation: "₹75 Cr",
  matchScore: 88,
  sector: "HR Tech",
  location: "Bangalore, India",
  founded: "2021",
  employees: "45-50",
  website: "www.talentflow.io",
  
  // Team assignment
  assignedTo: {
    name: "Priya Sharma",
    avatar: "/placeholder-user.jpg",
    role: "Investment Associate",
  },
  collaborators: [
    { name: "Rahul Verma", avatar: "/placeholder-user.jpg", role: "Partner" },
    { name: "Amit Kumar", avatar: "/placeholder-user.jpg", role: "Analyst" },
  ],
  
  // Metrics
  metrics: {
    arr: "₹1.2 Cr",
    mrr: "₹10 L",
    growth: "180%",
    customers: 85,
    nrr: "115%",
    cacPayback: "8 months",
    ltv: "₹4.5 L",
    cac: "₹50,000",
    grossMargin: "78%",
    burnRate: "₹25 L/month",
    runway: "18 months",
  },
  
  // Financial data for charts (simplified)
  financialData: [
    { month: "Jul", revenue: 700000, customers: 60 },
    { month: "Aug", revenue: 800000, customers: 65 },
    { month: "Sep", revenue: 920000, customers: 72 },
    { month: "Oct", revenue: 1000000, customers: 78 },
    { month: "Nov", revenue: 1100000, customers: 82 },
    { month: "Dec", revenue: 1200000, customers: 85 },
  ],
  
  // Team
  founders: [
    {
      name: "Vikram Desai",
      role: "CEO & Co-founder",
      avatar: "/placeholder-user.jpg",
      linkedin: "linkedin.com/in/vikramdesai",
      background: "Ex-Google, IIT Delhi",
      experience: "12 years in HR Tech",
    },
    {
      name: "Sneha Reddy",
      role: "CTO & Co-founder",
      avatar: "/placeholder-user.jpg",
      linkedin: "linkedin.com/in/snehareddy",
      background: "Ex-Microsoft, IIT Bombay",
      experience: "10 years in AI/ML",
    },
  ],
  
  // Documents
  documents: [
    { name: "Pitch Deck", type: "PDF", date: "2 days ago", views: 5 },
    { name: "Financial Model", type: "Excel", date: "2 days ago", views: 3 },
    { name: "Product Demo", type: "Video", date: "1 week ago", views: 2 },
    { name: "Customer References", type: "PDF", date: "3 days ago", views: 1 },
  ],
  
  // Activity
  activities: [
    { type: "note", user: "Priya Sharma", action: "Added notes from founder call", time: "2 hours ago" },
    { type: "document", user: "System", action: "Financial model was viewed", time: "5 hours ago" },
    { type: "stage", user: "Rahul Verma", action: "Moved to Deep Dive stage", time: "1 day ago" },
    { type: "meeting", user: "Priya Sharma", action: "Scheduled intro call", time: "2 days ago" },
  ],
}

const dueDiligenceItems = [
  { id: "deck", label: "Reviewed pitch deck", completed: true },
  { id: "financials", label: "Financial model analysis", completed: true },
  { id: "customers", label: "Customer reference calls", completed: false },
  { id: "background", label: "Team background checks", completed: false },
  { id: "market", label: "Market research", completed: false },
  { id: "competitive", label: "Competitive analysis", completed: false },
  { id: "legal", label: "Legal due diligence", completed: false },
  { id: "tech", label: "Technical assessment", completed: false },
]

const passReasons = [
  { value: "outside-thesis", label: "Outside thesis" },
  { value: "stage-mismatch", label: "Stage mismatch" },
  { value: "valuation-concerns", label: "Valuation concerns" },
  { value: "team-concerns", label: "Team concerns" },
  { value: "market-concerns", label: "Market concerns" },
  { value: "competitor", label: "Already invested in competitor" },
]

export default function DealDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [checklist, setChecklist] = useState(dueDiligenceItems)
  const [passModalOpen, setPassModalOpen] = useState(false)
  const [selectedPassReason, setSelectedPassReason] = useState("")
  const [passNotes, setPassNotes] = useState("")
  
  // Investment thesis state
  const [isEditingThesis, setIsEditingThesis] = useState(false)
  const [thesis, setThesis] = useState({
    whyInvest: "Strong product-market fit in growing HR Tech market. Experienced founding team with deep domain expertise. Impressive growth metrics and unit economics.",
    keyRisks: "Competitive market with large players. Customer concentration risk. Dependency on enterprise sales cycle.",
    mitigation: "Focus on mid-market expansion. Diversify customer base across industries. Build self-serve acquisition channel.",
  })

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    )
  }

  const completedItems = checklist.filter((item) => item.completed).length
  const progressPercent = (completedItems / checklist.length) * 100

  const handlePass = () => {
    console.log("[v0] Passing deal with reason:", selectedPassReason, passNotes)
    setPassModalOpen(false)
    router.push("/deals/incoming")
  }

  const handleAdvance = () => {
    console.log("[v0] Advancing deal to next stage")
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader title="Deal Details" />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 overflow-auto">
          {/* Back Navigation */}
          <div className="border-b bg-card px-4 md:px-6 py-3">
            <Link
              href="/deals/incoming"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Deal Flow
            </Link>
          </div>

          {/* Deal Header */}
          <div className="border-b bg-card px-4 md:px-6 py-4">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              {/* Left: Company Info */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border flex items-center justify-center shrink-0">
                  <Building2 className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-semibold text-foreground">{dealData.name}</h1>
                    <Badge variant="secondary">{dealData.stage}</Badge>
                    <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">{dealData.matchScore}%</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-2">{dealData.tagline}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{dealData.sector}</span>
                    <span>·</span>
                    <span>{dealData.location}</span>
                    <span>·</span>
                    <span>Founded {dealData.founded}</span>
                    <span>·</span>
                    <a href={`https://${dealData.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" />
                      Website
                    </a>
                  </div>
                </div>
              </div>

              {/* Right: Pipeline Status & Actions */}
              <div className="flex flex-col items-start lg:items-end gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Pipeline:</span>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                    {dealData.pipelineStage}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 mr-2">
                    <Avatar className="w-7 h-7 border-2 border-background">
                      <AvatarImage src={dealData.assignedTo.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{dealData.assignedTo.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{dealData.assignedTo.name}</span>
                  </div>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    Schedule Meeting
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent" onClick={() => setPassModalOpen(true)}>
                    <X className="w-4 h-4 mr-1.5" />
                    Pass
                  </Button>
                  <Button size="sm" onClick={handleAdvance}>
                    <ChevronRight className="w-4 h-4 mr-1.5" />
                    Advance
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
              {/* Left Column - Tabs */}
              <div>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full justify-start mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="metrics">Metrics</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Executive Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">{dealData.description}</p>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Problem & Solution</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium text-foreground mb-1">Problem</h4>
                            <p className="text-sm text-muted-foreground">
                              Enterprises struggle with employee retention and lack visibility into workforce trends, leading to high attrition costs and productivity losses.
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-foreground mb-1">Solution</h4>
                            <p className="text-sm text-muted-foreground">
                              AI-powered analytics platform that predicts attrition risk, identifies engagement drivers, and provides actionable insights for HR teams.
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Market Opportunity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">TAM</span>
                            <span className="text-sm font-medium">$15B (Global)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">SAM</span>
                            <span className="text-sm font-medium">$2B (India + SEA)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">SOM</span>
                            <span className="text-sm font-medium">$200M (Target)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Growth Rate</span>
                            <span className="text-sm font-medium text-green-600">18% CAGR</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Business Model</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          SaaS subscription model with per-seat pricing. Three tiers: Starter (₹500/user/month), Growth (₹800/user/month), Enterprise (custom).
                        </p>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-lg font-semibold">65%</p>
                            <p className="text-xs text-muted-foreground">Enterprise Mix</p>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-lg font-semibold">₹1.4L</p>
                            <p className="text-xs text-muted-foreground">Avg. ACV</p>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-lg font-semibold">24 mo</p>
                            <p className="text-xs text-muted-foreground">Avg. Contract</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Competitive Landscape</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">Darwinbox</p>
                              <p className="text-xs text-muted-foreground">Full-stack HRMS</p>
                            </div>
                            <Badge variant="outline">Indirect</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">Peoplebox</p>
                              <p className="text-xs text-muted-foreground">OKR + Performance</p>
                            </div>
                            <Badge variant="outline">Direct</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">Culture Amp</p>
                              <p className="text-xs text-muted-foreground">Employee Experience</p>
                            </div>
                            <Badge variant="outline">Direct</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3">
                          <strong>Differentiation:</strong> Deep AI/ML focus on predictive analytics vs. survey-based approaches. Stronger India market positioning.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Metrics Tab */}
                  <TabsContent value="metrics" className="space-y-6">
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="pt-4">
                          <p className="text-sm text-muted-foreground">ARR</p>
                          <p className="text-2xl font-semibold">{dealData.metrics.arr}</p>
                          <p className="text-xs text-green-600">+{dealData.metrics.growth} YoY</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <p className="text-sm text-muted-foreground">MRR</p>
                          <p className="text-2xl font-semibold">{dealData.metrics.mrr}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <p className="text-sm text-muted-foreground">Customers</p>
                          <p className="text-2xl font-semibold">{dealData.metrics.customers}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <p className="text-sm text-muted-foreground">NRR</p>
                          <p className="text-2xl font-semibold">{dealData.metrics.nrr}</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Revenue Trend */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Revenue Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-6 gap-2">
                            {dealData.financialData.map((data) => (
                              <div key={data.month} className="text-center">
                                <div className="h-24 bg-muted rounded-t flex items-end justify-center pb-1">
                                  <div
                                    className="w-8 bg-primary rounded-t"
                                    style={{ height: `${(data.revenue / 1200000) * 100}%` }}
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{data.month}</p>
                                <p className="text-xs font-medium">₹{(data.revenue / 100000).toFixed(1)}L</p>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-green-600 text-center">+71% growth over 6 months</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Unit Economics */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Unit Economics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">LTV</p>
                            <p className="text-lg font-semibold">{dealData.metrics.ltv}</p>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">CAC</p>
                            <p className="text-lg font-semibold">{dealData.metrics.cac}</p>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">LTV:CAC</p>
                            <p className="text-lg font-semibold text-green-600">9:1</p>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">CAC Payback</p>
                            <p className="text-lg font-semibold">{dealData.metrics.cacPayback}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Burn & Runway */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Burn & Runway</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">Gross Margin</p>
                            <p className="text-lg font-semibold">{dealData.metrics.grossMargin}</p>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">Monthly Burn</p>
                            <p className="text-lg font-semibold">{dealData.metrics.burnRate}</p>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">Runway</p>
                            <p className="text-lg font-semibold">{dealData.metrics.runway}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Team Tab */}
                  <TabsContent value="team" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Founding Team</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {dealData.founders.map((founder, index) => (
                          <div key={index} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                            <Avatar className="w-14 h-14">
                              <AvatarImage src={founder.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{founder.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{founder.name}</h4>
                                <a href={`https://${founder.linkedin}`} target="_blank" rel="noopener noreferrer">
                                  <Linkedin className="w-4 h-4 text-muted-foreground hover:text-primary" />
                                </a>
                              </div>
                              <p className="text-sm text-primary mb-1">{founder.role}</p>
                              <p className="text-sm text-muted-foreground">{founder.background}</p>
                              <p className="text-sm text-muted-foreground">{founder.experience}</p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Team Composition</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-2xl font-semibold">48</p>
                            <p className="text-xs text-muted-foreground">Total Employees</p>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-2xl font-semibold">22</p>
                            <p className="text-xs text-muted-foreground">Engineering</p>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-2xl font-semibold">12</p>
                            <p className="text-xs text-muted-foreground">Sales & CS</p>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-2xl font-semibold">8</p>
                            <p className="text-xs text-muted-foreground">Product</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Documents Tab */}
                  <TabsContent value="documents" className="space-y-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Deal Room Documents</CardTitle>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Plus className="w-4 h-4 mr-1.5" />
                          Request Document
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {dealData.documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{doc.name}</p>
                                  <p className="text-xs text-muted-foreground">{doc.type} · Uploaded {doc.date}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground">{doc.views} views</span>
                                <Button variant="ghost" size="sm">
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Notes Tab */}
                  <TabsContent value="notes" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Add Note</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea placeholder="Write your notes here..." className="mb-3" rows={4} />
                        <div className="flex justify-end">
                          <Button size="sm">
                            <Send className="w-4 h-4 mr-1.5" />
                            Save Note
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Previous Notes</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback>PS</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">Priya Sharma</span>
                            <span className="text-xs text-muted-foreground">· 2 hours ago</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Had a great call with the founders. Strong product vision and clear understanding of the market. 
                            They mentioned plans to expand to SEA in Q3. Need to dig deeper into their enterprise sales motion.
                          </p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback>RV</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">Rahul Verma</span>
                            <span className="text-xs text-muted-foreground">· 1 day ago</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Initial review complete. Metrics look strong. Key question: can they maintain this growth rate with current burn?
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Activity Tab */}
                  <TabsContent value="activity" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {dealData.activities.map((activity, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                {activity.type === "note" && <MessageSquare className="w-4 h-4 text-muted-foreground" />}
                                {activity.type === "document" && <FileText className="w-4 h-4 text-muted-foreground" />}
                                {activity.type === "stage" && <TrendingUp className="w-4 h-4 text-muted-foreground" />}
                                {activity.type === "meeting" && <Calendar className="w-4 h-4 text-muted-foreground" />}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm">
                                  <span className="font-medium">{activity.user}</span>{" "}
                                  <span className="text-muted-foreground">{activity.action}</span>
                                </p>
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Due Diligence Checklist */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Due Diligence</CardTitle>
                      <span className="text-sm text-muted-foreground">{completedItems}/{checklist.length}</span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {checklist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => toggleChecklistItem(item.id)}
                      >
                        <Checkbox checked={item.completed} />
                        <span className={cn("text-sm", item.completed && "line-through text-muted-foreground")}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Investment Thesis */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Investment Thesis</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingThesis(!isEditingThesis)}
                      >
                        {isEditingThesis ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-1.5">Why Invest</h4>
                      {isEditingThesis ? (
                        <Textarea
                          value={thesis.whyInvest}
                          onChange={(e) => setThesis({ ...thesis, whyInvest: e.target.value })}
                          className="text-sm"
                          rows={3}
                        />
                      ) : (
                        <p className="text-sm text-foreground">{thesis.whyInvest}</p>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-1.5">Key Risks</h4>
                      {isEditingThesis ? (
                        <Textarea
                          value={thesis.keyRisks}
                          onChange={(e) => setThesis({ ...thesis, keyRisks: e.target.value })}
                          className="text-sm"
                          rows={3}
                        />
                      ) : (
                        <p className="text-sm text-foreground">{thesis.keyRisks}</p>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-1.5">Mitigation Strategies</h4>
                      {isEditingThesis ? (
                        <Textarea
                          value={thesis.mitigation}
                          onChange={(e) => setThesis({ ...thesis, mitigation: e.target.value })}
                          className="text-sm"
                          rows={3}
                        />
                      ) : (
                        <p className="text-sm text-foreground">{thesis.mitigation}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Deal Terms */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Deal Terms</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Check Size</span>
                      <span className="text-sm font-medium">{dealData.checkSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Valuation</span>
                      <span className="text-sm font-medium">{dealData.valuation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Round Type</span>
                      <span className="text-sm font-medium">{dealData.stage}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Pass Modal */}
      <Dialog open={passModalOpen} onOpenChange={setPassModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Pass on {dealData.name}</DialogTitle>
            <DialogDescription>
              Please select a reason for passing on this deal
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label>Reason for passing (required)</Label>
              <RadioGroup value={selectedPassReason} onValueChange={setSelectedPassReason}>
                {passReasons.map((reason) => (
                  <div key={reason.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={reason.value} id={`pass-${reason.value}`} />
                    <Label htmlFor={`pass-${reason.value}`} className="font-normal cursor-pointer">
                      {reason.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pass-notes">Additional notes (optional)</Label>
              <Textarea
                id="pass-notes"
                placeholder="Add any additional context..."
                value={passNotes}
                onChange={(e) => setPassNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPassModalOpen(false)
                setSelectedPassReason("")
                setPassNotes("")
              }}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button onClick={handlePass} disabled={!selectedPassReason}>
              Confirm Pass
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

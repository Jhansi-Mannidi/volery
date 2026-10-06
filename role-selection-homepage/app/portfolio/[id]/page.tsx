"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  MessageSquare,
  Bell,
  ExternalLink,
  Download,
  MoreHorizontal,
  Mail,
  Phone,
  Linkedin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  PieChart,
  Flame,
  Target,
  Briefcase,
  BarChart3,
  Globe,
  Newspaper,
  UserPlus,
  UserMinus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock portfolio company data
const portfolioCompanyData: Record<string, {
  id: string
  name: string
  logo: string
  sector: string
  stage: string
  website: string
  location: string
  description: string
  investmentDate: string
  ownership: number
  boardSeat: { name: string; role: string; avatar: string } | null
  investment: {
    amountInvested: number
    currentValuation: number
    entryValuation: number
    multiple: number
    unrealizedValue: number
    rounds: { name: string; date: string; amount: number; valuation: number }[]
  }
  coInvestors: { name: string; logo: string }[]
  metrics: {
    arr: number
    arrGrowth: number
    mrr: number
    mrrGrowth: number
    burnRate: number
    runway: number
    customers: number
    nrr: number
    ltv: number
    cac: number
  }
  metricsHistory: { month: string; arr: number; mrr: number; burn: number }[]
  team: { name: string; role: string; avatar: string; linkedin?: string }[]
  updates: { id: string; type: "report" | "news" | "team"; title: string; date: string; summary: string }[]
  boardMaterials: { id: string; type: "minutes" | "financial" | "strategic"; title: string; date: string; status: string }[]
  followOn: {
    proRataRights: boolean
    proRataAmount: number
    nextRoundEstimate: { timing: string; valuation: string; amount: string }
    recommendedAllocation: number
    recommendation: "strong" | "moderate" | "hold"
  }
  health: "on-track" | "monitor" | "at-risk"
}> = {
  "1": {
    id: "1",
    name: "TechFlow AI",
    logo: "/placeholder-logo.png",
    sector: "Enterprise SaaS",
    stage: "Series A",
    website: "techflow.ai",
    location: "San Francisco, CA",
    description: "AI-powered workflow automation platform for enterprise teams. TechFlow helps companies automate repetitive tasks and improve operational efficiency.",
    investmentDate: "Mar 2023",
    ownership: 12.5,
    boardSeat: { name: "Sarah Chen", role: "Partner", avatar: "/placeholder-user.jpg" },
    investment: {
      amountInvested: 2500000,
      currentValuation: 45000000,
      entryValuation: 20000000,
      multiple: 2.25,
      unrealizedValue: 5625000,
      rounds: [
        { name: "Seed", date: "Sep 2022", amount: 500000, valuation: 8000000 },
        { name: "Series A", date: "Mar 2023", amount: 2000000, valuation: 20000000 },
      ],
    },
    coInvestors: [
      { name: "Sequoia Capital", logo: "/placeholder-logo.png" },
      { name: "a16z", logo: "/placeholder-logo.png" },
      { name: "Founders Fund", logo: "/placeholder-logo.png" },
    ],
    metrics: {
      arr: 4200000,
      arrGrowth: 180,
      mrr: 350000,
      mrrGrowth: 12,
      burnRate: 280000,
      runway: 18,
      customers: 85,
      nrr: 125,
      ltv: 48000,
      cac: 12000,
    },
    metricsHistory: [
      { month: "Jul", arr: 2100000, mrr: 175000, burn: 250000 },
      { month: "Aug", arr: 2500000, mrr: 208000, burn: 260000 },
      { month: "Sep", arr: 2900000, mrr: 242000, burn: 265000 },
      { month: "Oct", arr: 3400000, mrr: 283000, burn: 270000 },
      { month: "Nov", arr: 3800000, mrr: 317000, burn: 275000 },
      { month: "Dec", arr: 4200000, mrr: 350000, burn: 280000 },
    ],
    team: [
      { name: "Alex Rivera", role: "CEO & Co-founder", avatar: "/placeholder-user.jpg", linkedin: "linkedin.com/in/alexrivera" },
      { name: "Jordan Lee", role: "CTO & Co-founder", avatar: "/placeholder-user.jpg", linkedin: "linkedin.com/in/jordanlee" },
      { name: "Maria Santos", role: "VP Engineering", avatar: "/placeholder-user.jpg" },
      { name: "David Kim", role: "VP Sales", avatar: "/placeholder-user.jpg" },
    ],
    updates: [
      { id: "1", type: "report", title: "December 2024 Monthly Report", date: "Jan 5, 2025", summary: "ARR reached $4.2M, up 15% MoM. Closed 12 new enterprise deals including Fortune 500 company." },
      { id: "2", type: "news", title: "Featured in TechCrunch", date: "Dec 20, 2024", summary: "TechFlow AI recognized as top 10 AI startups to watch in 2025." },
      { id: "3", type: "team", title: "New VP of Sales Hired", date: "Dec 1, 2024", summary: "David Kim joins from Salesforce to lead enterprise sales expansion." },
      { id: "4", type: "report", title: "November 2024 Monthly Report", date: "Dec 3, 2024", summary: "Strong Q4 performance with 18% MoM growth. Pipeline at all-time high." },
      { id: "5", type: "news", title: "Partnership with Microsoft", date: "Nov 15, 2024", summary: "Strategic partnership announced for Azure marketplace integration." },
    ],
    boardMaterials: [
      { id: "1", type: "minutes", title: "Q4 2024 Board Meeting Minutes", date: "Dec 15, 2024", status: "Final" },
      { id: "2", type: "financial", title: "2024 Financial Summary", date: "Jan 10, 2025", status: "Draft" },
      { id: "3", type: "strategic", title: "2025 Strategic Plan", date: "Dec 20, 2024", status: "Final" },
      { id: "4", type: "minutes", title: "Q3 2024 Board Meeting Minutes", date: "Sep 20, 2024", status: "Final" },
      { id: "5", type: "financial", title: "Q3 2024 Financial Report", date: "Oct 5, 2024", status: "Final" },
    ],
    followOn: {
      proRataRights: true,
      proRataAmount: 1500000,
      nextRoundEstimate: { timing: "Q2 2025", valuation: "$80-100M", amount: "$15-20M" },
      recommendedAllocation: 2000000,
      recommendation: "strong",
    },
    health: "on-track",
  },
}

// Default fallback for unknown IDs
const defaultCompany = portfolioCompanyData["1"]

export default function PortfolioCompanyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  
  const company = portfolioCompanyData[params.id as string] || defaultCompany

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value}`
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case "on-track": return "bg-green-500/10 text-green-600 border-green-500/20"
      case "monitor": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      case "at-risk": return "bg-red-500/10 text-red-600 border-red-500/20"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case "report": return <FileText className="w-4 h-4 text-blue-500" />
      case "news": return <Newspaper className="w-4 h-4 text-purple-500" />
      case "team": return <Users className="w-4 h-4 text-green-500" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case "minutes": return <FileText className="w-4 h-4 text-blue-500" />
      case "financial": return <BarChart3 className="w-4 h-4 text-green-500" />
      case "strategic": return <Target className="w-4 h-4 text-purple-500" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader 
          title={company.name}
          breadcrumbs={[
            { label: "Portfolio", href: "/portfolio" },
            { label: company.name }
          ]}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Back Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push("/portfolio")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </Button>

            {/* Company Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Left: Company Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold">{company.name}</h1>
                        <Badge className={cn("capitalize", getHealthColor(company.health))}>
                          {company.health === "on-track" ? "On Track" : company.health === "monitor" ? "Monitor" : "At Risk"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{company.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {company.sector}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {company.stage}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          {company.location}
                        </span>
                        <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                          <ExternalLink className="w-4 h-4" />
                          {company.website}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Right: Key Stats */}
                  <div className="flex flex-wrap gap-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Investment Date</p>
                      <p className="font-semibold">{company.investmentDate}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Ownership</p>
                      <p className="font-semibold text-primary">{company.ownership}%</p>
                    </div>
                    {company.boardSeat && (
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Board Seat</p>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={company.boardSeat.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{company.boardSeat.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <span className="font-semibold">{company.boardSeat.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Investment Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Amount Invested</span>
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold">{formatCurrency(company.investment.amountInvested)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Entry @ {formatCurrency(company.investment.entryValuation)} valuation
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Current Valuation</span>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold">{formatCurrency(company.investment.currentValuation)}</p>
                  <p className="text-xs text-green-600 mt-1">
                    +{((company.investment.currentValuation / company.investment.entryValuation - 1) * 100).toFixed(0)}% from entry
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Multiple</span>
                    <BarChart3 className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-primary">{company.investment.multiple.toFixed(2)}x</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Unrealized: {formatCurrency(company.investment.unrealizedValue)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Co-Investors</span>
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex -space-x-2 mb-1">
                    {company.coInvestors.slice(0, 3).map((investor, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                        {investor.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                    ))}
                    {company.coInvestors.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                        +{company.coInvestors.length - 3}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{company.coInvestors.map(c => c.name).join(", ")}</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
                <TabsTrigger value="board">Board Materials</TabsTrigger>
                <TabsTrigger value="followon">Follow-on</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Investment Rounds */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Investment History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {company.investment.rounds.map((round, i) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{round.name}</p>
                                <p className="text-sm text-muted-foreground">{round.date}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatCurrency(round.amount)}</p>
                              <p className="text-sm text-muted-foreground">@ {formatCurrency(round.valuation)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Team */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Leadership Team</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {company.team.map((member, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={member.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{member.name}</p>
                                <p className="text-xs text-muted-foreground">{member.role}</p>
                              </div>
                            </div>
                            {member.linkedin && (
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Linkedin className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Metrics Tab */}
              <TabsContent value="metrics" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Key Metrics */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Key Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground mb-1">ARR</p>
                          <p className="text-xl font-bold">{formatCurrency(company.metrics.arr)}</p>
                          <p className="text-xs text-green-600 flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" />
                            {company.metrics.arrGrowth}% YoY
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground mb-1">MRR</p>
                          <p className="text-xl font-bold">{formatCurrency(company.metrics.mrr)}</p>
                          <p className="text-xs text-green-600 flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" />
                            {company.metrics.mrrGrowth}% MoM
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground mb-1">Customers</p>
                          <p className="text-xl font-bold">{company.metrics.customers}</p>
                          <p className="text-xs text-muted-foreground">Enterprise accounts</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground mb-1">NRR</p>
                          <p className="text-xl font-bold text-green-600">{company.metrics.nrr}%</p>
                          <p className="text-xs text-muted-foreground">Net Revenue Retention</p>
                        </div>
                      </div>

                      {/* ARR Trend */}
                      <div className="mt-6">
                        <h4 className="text-sm font-medium mb-4">ARR Trend (Last 6 Months)</h4>
                        <div className="grid grid-cols-6 gap-2">
                          {company.metricsHistory.map((data, i) => (
                            <div key={i} className="text-center">
                              <div className="h-24 bg-muted rounded relative mb-2">
                                <div 
                                  className="absolute bottom-0 left-0 right-0 bg-primary/80 rounded"
                                  style={{ height: `${(data.arr / 4500000) * 100}%` }}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">{data.month}</p>
                              <p className="text-xs font-medium">{formatCurrency(data.arr)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Burn & Runway */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Burn & Runway</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Monthly Burn</span>
                          <Flame className="w-4 h-4 text-orange-500" />
                        </div>
                        <p className="text-2xl font-bold">{formatCurrency(company.metrics.burnRate)}</p>
                      </div>

                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Runway</span>
                          <Clock className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="text-2xl font-bold">{company.metrics.runway} months</p>
                        <Progress value={(company.metrics.runway / 24) * 100} className="mt-2" />
                      </div>

                      <Separator />

                      <div>
                        <h4 className="text-sm font-medium mb-3">Unit Economics</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">LTV</span>
                            <span className="font-medium">{formatCurrency(company.metrics.ltv)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">CAC</span>
                            <span className="font-medium">{formatCurrency(company.metrics.cac)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">LTV:CAC</span>
                            <span className="font-medium text-green-600">{(company.metrics.ltv / company.metrics.cac).toFixed(1)}x</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Updates Tab */}
              <TabsContent value="updates" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Updates Feed</CardTitle>
                    <CardDescription>Monthly reports, news mentions, and team changes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-4">
                        {company.updates.map((update) => (
                          <div key={update.id} className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="mt-1">{getUpdateIcon(update.type)}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-medium">{update.title}</h4>
                                  <Badge variant="outline" className="capitalize text-xs">
                                    {update.type}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{update.summary}</p>
                                <p className="text-xs text-muted-foreground">{update.date}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Board Materials Tab */}
              <TabsContent value="board" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Board Materials</CardTitle>
                        <CardDescription>Meeting minutes, financial reports, and strategic plans</CardDescription>
                      </div>
                      <Button size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Upload Document
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {company.boardMaterials.map((material) => (
                        <div key={material.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            {getMaterialIcon(material.type)}
                            <div>
                              <p className="font-medium">{material.title}</p>
                              <p className="text-sm text-muted-foreground">{material.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={material.status === "Final" ? "default" : "secondary"}>
                              {material.status}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Open
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Follow-on Tab */}
              <TabsContent value="followon" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Pro-rata Rights */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Pro-rata Rights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <span className="text-muted-foreground">Pro-rata Rights</span>
                        <Badge variant={company.followOn.proRataRights ? "default" : "secondary"}>
                          {company.followOn.proRataRights ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <span className="text-muted-foreground">Pro-rata Amount</span>
                        <span className="font-semibold">{formatCurrency(company.followOn.proRataAmount)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Next Round Estimate */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Next Round Estimate</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <span className="text-muted-foreground">Expected Timing</span>
                        <span className="font-semibold">{company.followOn.nextRoundEstimate.timing}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <span className="text-muted-foreground">Expected Valuation</span>
                        <span className="font-semibold">{company.followOn.nextRoundEstimate.valuation}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <span className="text-muted-foreground">Round Size</span>
                        <span className="font-semibold">{company.followOn.nextRoundEstimate.amount}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommended Allocation */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Investment Recommendation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Recommended Allocation</p>
                          <p className="text-3xl font-bold text-primary">{formatCurrency(company.followOn.recommendedAllocation)}</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                          <Badge 
                            className={cn(
                              "text-lg px-4 py-2",
                              company.followOn.recommendation === "strong" && "bg-green-500/10 text-green-600 border-green-500/20",
                              company.followOn.recommendation === "moderate" && "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
                              company.followOn.recommendation === "hold" && "bg-muted text-muted-foreground"
                            )}
                          >
                            {company.followOn.recommendation === "strong" && "Strong Buy"}
                            {company.followOn.recommendation === "moderate" && "Moderate"}
                            {company.followOn.recommendation === "hold" && "Hold"}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4 p-4 rounded-lg bg-muted/50">
                        <h4 className="font-medium mb-2">Recommendation Rationale</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>- Strong ARR growth of {company.metrics.arrGrowth}% YoY indicates product-market fit</li>
                          <li>- Healthy unit economics with {(company.metrics.ltv / company.metrics.cac).toFixed(1)}x LTV:CAC ratio</li>
                          <li>- {company.metrics.runway} months runway provides flexibility for next raise</li>
                          <li>- Co-investors include tier-1 firms with follow-on capacity</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

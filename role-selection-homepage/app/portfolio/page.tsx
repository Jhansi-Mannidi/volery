"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" // Import router
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { PortfolioTrackerFeed } from "@/components/portfolio-tracker/portfolio-tracker-feed"
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Building2,
  IndianRupee,
  Percent,
  Briefcase,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  ExternalLink,
  Bell,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  PieChart,
  BarChart3,
  LineChart,
  Target,
  Users,
  Mail,
  Phone,
} from "lucide-react"

// Portfolio companies data
const portfolioCompanies = [
  {
    id: "1",
    name: "TechCo AI",
    logo: "/placeholder-logo.png",
    sector: "AI/ML",
    stage: "Series B",
    investedAmount: 50000000, // ₹5 Cr
    currentValue: 120000000, // ₹12 Cr
    multiple: 2.4,
    ownership: 8.5,
    lastUpdate: "2026-01-15",
    health: "on-track" as const,
    growth: 45,
    arrCurrent: 180000000,
    arrPrevious: 120000000,
    runway: 18,
    nextRound: true,
    proRataAmount: 25000000,
    investmentDate: "2023-06-15",
    leadPartner: "Rahul Sharma",
    boardSeat: true,
  },
  {
    id: "2",
    name: "FinApp Solutions",
    logo: "/placeholder-logo.png",
    sector: "FinTech",
    stage: "Series A",
    investedAmount: 80000000, // ₹8 Cr
    currentValue: 150000000, // ₹15 Cr
    multiple: 1.9,
    ownership: 12.0,
    lastUpdate: "2026-01-10",
    health: "on-track" as const,
    growth: 38,
    arrCurrent: 95000000,
    arrPrevious: 68000000,
    runway: 14,
    nextRound: true,
    proRataAmount: 40000000,
    investmentDate: "2024-02-20",
    leadPartner: "Priya Patel",
    boardSeat: true,
  },
  {
    id: "3",
    name: "HealthFirst",
    logo: "/placeholder-logo.png",
    sector: "HealthTech",
    stage: "Series B",
    investedAmount: 100000000, // ₹10 Cr
    currentValue: 220000000, // ₹22 Cr
    multiple: 2.2,
    ownership: 6.5,
    lastUpdate: "2026-01-12",
    health: "on-track" as const,
    growth: 52,
    arrCurrent: 250000000,
    arrPrevious: 165000000,
    runway: 24,
    nextRound: false,
    proRataAmount: 0,
    investmentDate: "2023-09-10",
    leadPartner: "Amit Kumar",
    boardSeat: true,
  },
  {
    id: "4",
    name: "EduLearn Platform",
    logo: "/placeholder-logo.png",
    sector: "EdTech",
    stage: "Series A",
    investedAmount: 60000000, // ₹6 Cr
    currentValue: 85000000, // ₹8.5 Cr
    multiple: 1.4,
    ownership: 10.0,
    lastUpdate: "2026-01-08",
    health: "monitor" as const,
    growth: 15,
    arrCurrent: 45000000,
    arrPrevious: 39000000,
    runway: 10,
    nextRound: false,
    proRataAmount: 0,
    investmentDate: "2024-05-15",
    leadPartner: "Rahul Sharma",
    boardSeat: false,
  },
  {
    id: "5",
    name: "LogiChain",
    logo: "/placeholder-logo.png",
    sector: "Logistics",
    stage: "Series B",
    investedAmount: 120000000, // ₹12 Cr
    currentValue: 280000000, // ₹28 Cr
    multiple: 2.3,
    ownership: 7.2,
    lastUpdate: "2026-01-14",
    health: "on-track" as const,
    growth: 62,
    arrCurrent: 320000000,
    arrPrevious: 198000000,
    runway: 20,
    nextRound: true,
    proRataAmount: 60000000,
    investmentDate: "2023-03-22",
    leadPartner: "Priya Patel",
    boardSeat: true,
  },
  {
    id: "6",
    name: "RetailMax",
    logo: "/placeholder-logo.png",
    sector: "Retail Tech",
    stage: "Series A",
    investedAmount: 45000000, // ₹4.5 Cr
    currentValue: 38000000, // ₹3.8 Cr
    multiple: 0.84,
    ownership: 9.0,
    lastUpdate: "2026-01-05",
    health: "at-risk" as const,
    growth: -12,
    arrCurrent: 22000000,
    arrPrevious: 25000000,
    runway: 6,
    nextRound: false,
    proRataAmount: 0,
    investmentDate: "2024-08-10",
    leadPartner: "Amit Kumar",
    boardSeat: false,
  },
  {
    id: "7",
    name: "GreenEnergy",
    logo: "/placeholder-logo.png",
    sector: "CleanTech",
    stage: "Series B",
    investedAmount: 150000000, // ₹15 Cr
    currentValue: 420000000, // ₹42 Cr
    multiple: 2.8,
    ownership: 5.8,
    lastUpdate: "2026-01-16",
    health: "on-track" as const,
    growth: 78,
    arrCurrent: 480000000,
    arrPrevious: 270000000,
    runway: 30,
    nextRound: false,
    proRataAmount: 0,
    investmentDate: "2022-11-05",
    leadPartner: "Rahul Sharma",
    boardSeat: true,
  },
  {
    id: "8",
    name: "CloudSecure",
    logo: "/placeholder-logo.png",
    sector: "Cybersecurity",
    stage: "Series A",
    investedAmount: 70000000, // ₹7 Cr
    currentValue: 95000000, // ₹9.5 Cr
    multiple: 1.36,
    ownership: 11.5,
    lastUpdate: "2026-01-11",
    health: "monitor" as const,
    growth: 18,
    arrCurrent: 62000000,
    arrPrevious: 52000000,
    runway: 12,
    nextRound: false,
    proRataAmount: 0,
    investmentDate: "2024-04-18",
    leadPartner: "Priya Patel",
    boardSeat: false,
  },
]

// Format currency in Indian format (Cr/L)
function formatIndianCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)} Cr`
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} L`
  }
  return `₹${amount.toLocaleString("en-IN")}`
}

// Calculate portfolio totals
const totalInvested = portfolioCompanies.reduce((acc, c) => acc + c.investedAmount, 0)
const totalCurrentValue = portfolioCompanies.reduce((acc, c) => acc + c.currentValue, 0)
const portfolioMultiple = totalCurrentValue / totalInvested
const portfolioIRR = 24 // Simplified - would be calculated from cash flows

// Sector distribution
const sectorDistribution = portfolioCompanies.reduce((acc, c) => {
  acc[c.sector] = (acc[c.sector] || 0) + c.currentValue
  return acc
}, {} as Record<string, number>)

// Stage distribution
const stageDistribution = portfolioCompanies.reduce((acc, c) => {
  acc[c.stage] = (acc[c.stage] || 0) + c.currentValue
  return acc
}, {} as Record<string, number>)

// Health status counts
const healthCounts = {
  "on-track": portfolioCompanies.filter((c) => c.health === "on-track").length,
  monitor: portfolioCompanies.filter((c) => c.health === "monitor").length,
  "at-risk": portfolioCompanies.filter((c) => c.health === "at-risk").length,
}

// Follow-on opportunities
const followOnOpportunities = portfolioCompanies.filter((c) => c.nextRound)

export default function PortfolioPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [healthFilter, setHealthFilter] = useState<string>("all")
  const [sectorFilter, setSectorFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("value")
  const router = useRouter() // Declare router

  const isInstitutionalInvestor = user?.activeRole === "institutional-investor"

  // Filter and sort companies
  const filteredCompanies = portfolioCompanies
    .filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.sector.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesHealth = healthFilter === "all" || c.health === healthFilter
      const matchesSector = sectorFilter === "all" || c.sector === sectorFilter
      return matchesSearch && matchesHealth && matchesSector
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "value":
          return b.currentValue - a.currentValue
        case "multiple":
          return b.multiple - a.multiple
        case "growth":
          return b.growth - a.growth
        case "invested":
          return b.investedAmount - a.investedAmount
        default:
          return 0
      }
    })

  const sectors = [...new Set(portfolioCompanies.map((c) => c.sector))]

  const isAngelInvestor = user?.activeRole === "angel-investor"

  if (isAngelInvestor) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="My Investments" breadcrumbs={[{ label: "My Investments" }]} />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <PortfolioTrackerFeed />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader title="Portfolio" breadcrumbs={[{ label: "Portfolio" }]} />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 space-y-6">
            {/* Portfolio Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IndianRupee className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Invested</p>
                      <p className="text-xl font-bold">{formatIndianCurrency(totalInvested)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Current Value</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xl font-bold">{formatIndianCurrency(totalCurrentValue)}</p>
                        <Badge variant="secondary" className="text-green-600 bg-green-500/10">
                          {portfolioMultiple.toFixed(2)}x
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Percent className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Portfolio IRR</p>
                      <p className="text-xl font-bold">{portfolioIRR}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <Briefcase className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Companies</p>
                      <p className="text-xl font-bold">{portfolioCompanies.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Health Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-green-500/30 bg-green-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-green-700 dark:text-green-400">On Track</p>
                        <p className="text-xs text-muted-foreground">{">"}20% growth</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{healthCounts["on-track"]}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-yellow-500/30 bg-yellow-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="font-medium text-yellow-700 dark:text-yellow-400">Monitor</p>
                        <p className="text-xs text-muted-foreground">10-20% growth</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">{healthCounts["monitor"]}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-500/30 bg-red-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium text-red-700 dark:text-red-400">At Risk</p>
                        <p className="text-xs text-muted-foreground">{"<"}10% or declining</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{healthCounts["at-risk"]}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="companies" className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <TabsList>
                  <TabsTrigger value="companies">Companies</TabsTrigger>
                  <TabsTrigger value="follow-on">Follow-on Opportunities</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search companies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-[200px]"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Companies Tab */}
              <TabsContent value="companies" className="space-y-4">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  <Select value={healthFilter} onValueChange={setHealthFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Health" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Health</SelectItem>
                      <SelectItem value="on-track">On Track</SelectItem>
                      <SelectItem value="monitor">Monitor</SelectItem>
                      <SelectItem value="at-risk">At Risk</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sectorFilter} onValueChange={setSectorFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sectors</SelectItem>
                      {sectors.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="value">Current Value</SelectItem>
                      <SelectItem value="multiple">Multiple</SelectItem>
                      <SelectItem value="growth">Growth</SelectItem>
                      <SelectItem value="invested">Amount Invested</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Portfolio Table */}
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead className="text-right">Invested</TableHead>
                        <TableHead className="text-right">Current Value</TableHead>
                        <TableHead className="text-right">Multiple</TableHead>
                        <TableHead className="text-right">Growth</TableHead>
                        <TableHead>Health</TableHead>
                        <TableHead className="text-right">Runway</TableHead>
                        <TableHead>Last Update</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCompanies.map((company) => (
                        <TableRow 
                          key={company.id} 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => router.push(`/portfolio/${company.id}`)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src={company.logo || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {company.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{company.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {company.sector} · {company.stage}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatIndianCurrency(company.investedAmount)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatIndianCurrency(company.currentValue)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="secondary"
                              className={cn(
                                company.multiple >= 2
                                  ? "bg-green-500/10 text-green-600"
                                  : company.multiple >= 1
                                    ? "bg-blue-500/10 text-blue-600"
                                    : "bg-red-500/10 text-red-600"
                              )}
                            >
                              {company.multiple.toFixed(2)}x
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {company.growth > 0 ? (
                                <ArrowUpRight className="w-4 h-4 text-green-500" />
                              ) : (
                                <ArrowDownRight className="w-4 h-4 text-red-500" />
                              )}
                              <span
                                className={cn(
                                  "font-medium",
                                  company.growth > 0 ? "text-green-600" : "text-red-600"
                                )}
                              >
                                {company.growth > 0 ? "+" : ""}
                                {company.growth}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={cn(
                                company.health === "on-track" &&
                                  "bg-green-500/10 text-green-600",
                                company.health === "monitor" &&
                                  "bg-yellow-500/10 text-yellow-600",
                                company.health === "at-risk" && "bg-red-500/10 text-red-600"
                              )}
                            >
                              {company.health === "on-track" && "On Track"}
                              {company.health === "monitor" && "Monitor"}
                              {company.health === "at-risk" && "At Risk"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <span
                              className={cn(
                                "font-medium",
                                company.runway <= 6 && "text-red-600",
                                company.runway > 6 &&
                                  company.runway <= 12 &&
                                  "text-yellow-600",
                                company.runway > 12 && "text-green-600"
                              )}
                            >
                              {company.runway} mo
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {new Date(company.lastUpdate).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                            })}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="w-4 h-4 mr-2" />
                                  Contact Founder
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Calendar className="w-4 h-4 mr-2" />
                                  Schedule Update
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Bell className="w-4 h-4 mr-2" />
                                  Set Alert
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              {/* Follow-on Opportunities Tab */}
              <TabsContent value="follow-on" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {followOnOpportunities.map((company) => (
                    <Card key={company.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={company.logo || "/placeholder.svg"} />
                              <AvatarFallback>
                                {company.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{company.name}</CardTitle>
                              <CardDescription>
                                {company.sector} · {company.stage}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                            Raising
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Current Ownership</p>
                            <p className="font-semibold">{company.ownership}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Pro-rata Amount</p>
                            <p className="font-semibold">
                              {formatIndianCurrency(company.proRataAmount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Current Multiple</p>
                            <p className="font-semibold text-green-600">{company.multiple}x</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">ARR Growth</p>
                            <p className="font-semibold text-green-600">+{company.growth}%</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">
                            RECOMMENDED ACTION
                          </p>
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-green-700 dark:text-green-400">
                              Exercise Pro-rata Rights
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            Review Deal
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            Schedule Call
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {followOnOpportunities.length === 0 && (
                  <Card className="p-12 text-center">
                    <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No Follow-on Opportunities</h3>
                    <p className="text-muted-foreground">
                      None of your portfolio companies are currently raising.
                    </p>
                  </Card>
                )}
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sector Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <PieChart className="w-4 h-4" />
                        Sector Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {Object.entries(sectorDistribution)
                        .sort((a, b) => b[1] - a[1])
                        .map(([sector, value]) => {
                          const percentage = (value / totalCurrentValue) * 100
                          return (
                            <div key={sector} className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span>{sector}</span>
                                <span className="font-medium">
                                  {formatIndianCurrency(value)} ({percentage.toFixed(1)}%)
                                </span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </div>
                          )
                        })}
                    </CardContent>
                  </Card>

                  {/* Stage Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Stage Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {Object.entries(stageDistribution)
                        .sort((a, b) => b[1] - a[1])
                        .map(([stage, value]) => {
                          const percentage = (value / totalCurrentValue) * 100
                          return (
                            <div key={stage} className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span>{stage}</span>
                                <span className="font-medium">
                                  {formatIndianCurrency(value)} ({percentage.toFixed(1)}%)
                                </span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </div>
                          )
                        })}
                    </CardContent>
                  </Card>

                  {/* Vintage Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <LineChart className="w-4 h-4" />
                        Vintage Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {["2022", "2023", "2024"].map((year) => {
                          const yearCompanies = portfolioCompanies.filter((c) =>
                            c.investmentDate.startsWith(year)
                          )
                          const yearInvested = yearCompanies.reduce(
                            (acc, c) => acc + c.investedAmount,
                            0
                          )
                          const yearValue = yearCompanies.reduce(
                            (acc, c) => acc + c.currentValue,
                            0
                          )
                          const yearMultiple = yearInvested > 0 ? yearValue / yearInvested : 0

                          return (
                            <div
                              key={year}
                              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                            >
                              <div>
                                <p className="font-medium">{year} Vintage</p>
                                <p className="text-sm text-muted-foreground">
                                  {yearCompanies.length} companies
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">
                                  {formatIndianCurrency(yearValue)}
                                </p>
                                <Badge
                                  variant="secondary"
                                  className={cn(
                                    yearMultiple >= 2
                                      ? "bg-green-500/10 text-green-600"
                                      : "bg-blue-500/10 text-blue-600"
                                  )}
                                >
                                  {yearMultiple.toFixed(2)}x
                                </Badge>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Benchmark Comparison */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Benchmark Comparison
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <div>
                            <p className="font-medium">Your Portfolio IRR</p>
                            <p className="text-2xl font-bold text-green-600">{portfolioIRR}%</p>
                          </div>
                          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                            Top Quartile
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Industry Median</span>
                            <span className="font-medium">18%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Top Quartile Threshold</span>
                            <span className="font-medium">22%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Top Decile Threshold</span>
                            <span className="font-medium">28%</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t">
                          <p className="text-xs text-muted-foreground">
                            Based on Cambridge Associates India VC Benchmark Q3 2025
                          </p>
                        </div>
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

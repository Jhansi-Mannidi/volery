"use client"

import { useState } from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import {
  Sparkles,
  RefreshCw,
  Filter,
  Search,
  Clock,
  TrendingUp,
  Target,
  MapPin,
  DollarSign,
  Briefcase,
  CheckCircle2,
  XCircle,
  Eye,
  Send,
  Bookmark,
  Users,
  Building2,
  ChevronDown,
  ExternalLink,
  UserPlus,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

// Mock data
const investorMatches = [
  {
    id: "1",
    name: "Sequoia Capital India",
    logo: "/placeholder-logo.png",
    type: "VC",
    checkSize: "$5M - $50M",
    stageFocus: "Series A",
    matchScore: 92,
    location: "Bengaluru, India",
    recentActivity: "Invested in PayTech (2 weeks ago)",
    whyGreatMatch: [
      "Invests in HR SaaS (3 portfolio companies)",
      "Series A specialist",
      "India-focused",
      "Warm intro available via Rajesh Kumar",
    ],
    scoreBreakdown: {
      criteriaMatch: 95,
      historicalFit: 88,
      activityLevel: 90,
      connectionStrength: 85,
    },
    warmIntro: {
      available: true,
      connection: "Rajesh Kumar",
      connectionStrength: "Strong",
    },
  },
  {
    id: "2",
    name: "Accel Partners",
    logo: "/placeholder-logo.png",
    type: "VC",
    checkSize: "$2M - $20M",
    stageFocus: "Seed-Series B",
    matchScore: 88,
    location: "Palo Alto, CA",
    recentActivity: "Announced new $500M fund",
    whyGreatMatch: [
      "Active in SaaS infrastructure",
      "Strong network in Silicon Valley",
      "Platform support for scaling",
      "2nd degree connection via LinkedIn",
    ],
    scoreBreakdown: {
      criteriaMatch: 90,
      historicalFit: 85,
      activityLevel: 92,
      connectionStrength: 75,
    },
    warmIntro: {
      available: true,
      connection: "Sarah Chen",
      connectionStrength: "Medium",
    },
  },
  {
    id: "3",
    name: "Lightspeed Venture Partners",
    logo: "/placeholder-logo.png",
    type: "VC",
    checkSize: "$3M - $25M",
    stageFocus: "Series A-B",
    matchScore: 85,
    location: "Menlo Park, CA",
    recentActivity: "Portfolio company IPO last month",
    whyGreatMatch: [
      "Enterprise SaaS focus",
      "Global expansion support",
      "Strong LP network",
    ],
    scoreBreakdown: {
      criteriaMatch: 88,
      historicalFit: 82,
      activityLevel: 85,
      connectionStrength: 80,
    },
    warmIntro: {
      available: false,
      connection: null,
      connectionStrength: null,
    },
  },
  {
    id: "4",
    name: "Matrix Partners India",
    logo: "/placeholder-logo.png",
    type: "VC",
    checkSize: "$1M - $15M",
    stageFocus: "Seed-Series A",
    matchScore: 82,
    location: "Bengaluru, India",
    recentActivity: "Led 3 rounds in Q1 2024",
    whyGreatMatch: [
      "B2B SaaS expertise",
      "India market knowledge",
      "Fast decision-making",
      "Warm intro via portfolio founder",
    ],
    scoreBreakdown: {
      criteriaMatch: 85,
      historicalFit: 80,
      activityLevel: 88,
      connectionStrength: 70,
    },
    warmIntro: {
      available: true,
      connection: "Priya Sharma",
      connectionStrength: "Strong",
    },
  },
]

export default function FounderMatchesPage() {
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [investorType, setInvestorType] = useState("all")
  const [checkSize, setCheckSize] = useState("all")
  const [sector, setSector] = useState("all")
  const [geography, setGeography] = useState("all")
  const [minMatchScore, setMinMatchScore] = useState("0")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  const filteredMatches = investorMatches.filter((match) => {
    const matchesSearch =
      searchQuery === "" || match.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesScore = Number.parseInt(minMatchScore) === 0 || match.matchScore >= Number.parseInt(minMatchScore)
    return matchesSearch && matchesScore
  })

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      <DashboardHeader role="startup-founder" />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar role="startup-founder" />
        <main className="flex-1 overflow-auto p-6 md:p-8 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Investor Matches</h1>
              <p className="text-muted-foreground mt-1">
                AI-powered investor recommendations for your startup
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Updated 5 min ago</span>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Match Controls */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                  <Label htmlFor="auto-refresh" className="text-sm text-muted-foreground cursor-pointer">
                    Auto-refresh matches
                  </Label>
                </div>
                <Badge variant="secondary" className="text-sm">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {filteredMatches.length} matches found
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Filter Bar */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search investors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={investorType} onValueChange={setInvestorType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Investor Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="vc">VC</SelectItem>
                    <SelectItem value="angel">Angel</SelectItem>
                    <SelectItem value="corporate">Corporate VC</SelectItem>
                    <SelectItem value="family-office">Family Office</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={checkSize} onValueChange={setCheckSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Check Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    <SelectItem value="small">{'<$1M'}</SelectItem>
                    <SelectItem value="medium">$1M - $10M</SelectItem>
                    <SelectItem value="large">{'> $10M'}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={geography} onValueChange={setGeography}>
                  <SelectTrigger>
                    <SelectValue placeholder="Geography" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="india">India</SelectItem>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="asia">Asia Pacific</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={minMatchScore} onValueChange={setMinMatchScore}>
                  <SelectTrigger>
                    <SelectValue placeholder="Min Match Score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Scores</SelectItem>
                    <SelectItem value="90">90%+</SelectItem>
                    <SelectItem value="80">80%+</SelectItem>
                    <SelectItem value="70">70%+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Match Results Grid */}
          <div className="grid gap-6">
            {filteredMatches.map((match) => (
              <Card key={match.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Match Score */}
                    <div className="flex flex-col items-center gap-2 lg:w-24 shrink-0">
                      <div
                        className={cn(
                          "flex items-center justify-center w-20 h-20 rounded-xl border-2 font-bold text-2xl",
                          match.matchScore >= 90
                            ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                            : match.matchScore >= 80
                              ? "bg-blue-500/15 text-blue-600 border-blue-500/30"
                              : "bg-amber-500/15 text-amber-600 border-amber-500/30"
                        )}
                      >
                        {match.matchScore}%
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-3 h-3",
                              i < Math.floor(match.matchScore / 20)
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted"
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Middle: Investor Details */}
                    <div className="flex-1 space-y-4">
                      {/* Header Row */}
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12 rounded-lg">
                          <AvatarImage src={match.logo || "/placeholder.svg"} alt={match.name} />
                          <AvatarFallback className="rounded-lg">{match.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">{match.name}</h3>
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <Badge variant="secondary">{match.type}</Badge>
                                <span>·</span>
                                <DollarSign className="w-3 h-3" />
                                <span>{match.checkSize}</span>
                                <span>·</span>
                                <span>{match.stageFocus} Focus</span>
                              </div>
                            </div>
                            {match.warmIntro.available && (
                              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                                <UserPlus className="w-3 h-3 mr-1" />
                                Warm Intro
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Why Great Match */}
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Why Great Match:</p>
                        <ul className="space-y-1.5">
                          {match.whyGreatMatch.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Recent Activity */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-medium">Recent Activity:</span>
                        <span>{match.recentActivity}</span>
                      </div>

                      {/* Score Breakdown (Collapsible) */}
                      <Collapsible open={expandedCard === match.id} onOpenChange={(open) => setExpandedCard(open ? match.id : null)}>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <Target className="w-4 h-4 mr-1" />
                            View Match Score Breakdown
                            <ChevronDown className={cn("w-4 h-4 ml-1 transition-transform", expandedCard === match.id && "rotate-180")} />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-4 pt-4 border-t space-y-3">
                          {Object.entries(match.scoreBreakdown).map(([key, value]) => (
                            <div key={key} className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                                <span className="font-medium">{value}%</span>
                              </div>
                              <Progress value={value} className="h-2" />
                            </div>
                          ))}
                          
                          {/* Warm Intro Path */}
                          {match.warmIntro.available && (
                            <div className="mt-4 pt-4 border-t">
                              <p className="text-sm font-medium text-foreground mb-2">Warm Introduction Path:</p>
                              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs">{match.warmIntro.connection?.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{match.warmIntro.connection}</p>
                                  <p className="text-xs text-muted-foreground">Connection Strength: {match.warmIntro.connectionStrength}</p>
                                </div>
                                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                                  {match.warmIntro.connectionStrength}
                                </Badge>
                              </div>
                            </div>
                          )}
                        </CollapsibleContent>
                      </Collapsible>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button variant="default" size="sm" asChild>
                          <Link href={`/founder/investors/${match.id}`}>
                            <Eye className="w-4 h-4 mr-1.5" />
                            View Profile
                          </Link>
                        </Button>
                        {match.warmIntro.available && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              toast.success(`Introduction request sent to ${match.warmIntro.connection}`)
                            }}
                          >
                            <Send className="w-4 h-4 mr-1.5" />
                            Request Intro
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            toast.success(`${match.name} added to your target list`)
                          }}
                          asChild
                        >
                          <Link href="/founder/lists">
                            <Bookmark className="w-4 h-4 mr-1.5" />
                            Add to List
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4 mr-1.5" />
                          LinkedIn
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredMatches.length === 0 && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No matches found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-4">
                    Try adjusting your filters or search criteria to find more investor matches.
                  </p>
                  <Button variant="outline" onClick={() => {
                    setSearchQuery("")
                    setMinMatchScore("0")
                    setInvestorType("all")
                    setCheckSize("all")
                    setGeography("all")
                  }}>
                    Clear All Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}

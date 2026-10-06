"use client"

import Link from "next/link"
import {
  Users,
  Building2,
  Briefcase,
  Factory,
  ChevronRight,
  TrendingUp,
  Target,
  IndianRupee,
  Star,
  ArrowUpRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

// Investor type data
const investorTypes = [
  {
    id: "angel",
    name: "Angel Investors",
    description: "High-net-worth individuals investing personal capital in early-stage startups",
    icon: Users,
    color: "primary",
    bgColor: "bg-primary/10",
    iconColor: "text-primary",
    borderColor: "border-l-primary",
    href: "/investors/types/angel",
    count: 9,
    stats: {
      avgCheckSize: "₹75L",
      active30d: 7,
      champions: 3,
    },
    highlights: ["Quick decisions", "Flexible terms", "Personal mentorship"],
  },
  {
    id: "family-offices",
    name: "Family Offices",
    description: "Private wealth management firms investing on behalf of high-net-worth families",
    icon: Building2,
    color: "primary",
    bgColor: "bg-primary/10",
    iconColor: "text-primary",
    borderColor: "border-l-primary",
    href: "/investors/types/family-offices",
    count: 18,
    stats: {
      totalAUM: "₹4,200 Cr",
      avgCheckSize: "₹8.5 Cr",
      activeMandates: 12,
    },
    highlights: ["Patient capital", "Multi-stage support", "Co-investment ready"],
  },
  {
    id: "vcs",
    name: "Venture Capital",
    description: "Professional investment firms managing pooled funds to invest in high-growth startups",
    icon: Briefcase,
    color: "primary",
    bgColor: "bg-primary/10",
    iconColor: "text-primary",
    borderColor: "border-l-primary",
    href: "/investors/types/vcs",
    count: 28,
    stats: {
      activeFunds: 35,
      dryPowder: "₹2,800 Cr",
      dealsYTD: 45,
    },
    highlights: ["Follow-on capacity", "Network effects", "Operational support"],
  },
  {
    id: "corporate",
    name: "Corporate Investors",
    description: "Strategic investors from large corporations seeking innovation and market adjacencies",
    icon: Factory,
    color: "primary",
    bgColor: "bg-primary/10",
    iconColor: "text-primary",
    borderColor: "border-l-primary",
    href: "/investors/types/corporate",
    count: 7,
    stats: {
      combinedRevenue: "₹85,000 Cr",
      activeMandates: 5,
      strategicFits: 12,
    },
    highlights: ["Distribution access", "Strategic partnerships", "M&A potential"],
  },
]

// Summary stats
const summaryStats = [
  { label: "Total Investors", value: "87", icon: Users, change: "+12 this quarter" },
  { label: "Active Relationships", value: "64", icon: TrendingUp, change: "74% of total" },
  { label: "Avg Response Rate", value: "68%", icon: Target, change: "+5% vs last month" },
  { label: "Total Deployed", value: "₹847 Cr", icon: IndianRupee, change: "Via our intros" },
]

export default function InvestorsByTypePage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader title="Investors by Type" />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link href="/investors" className="hover:text-foreground transition-colors">
                Investors
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">By Type</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Browse by Investor Type</h1>
                <p className="text-muted-foreground mt-1">
                  Explore your investor network organized by type for targeted outreach
                </p>
              </div>
              <Button asChild>
                <Link href="/investors">
                  <Users className="w-4 h-4 mr-2" />
                  View All Investors
                </Link>
              </Button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {summaryStats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Investor Type Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {investorTypes.map((type) => (
              <Link key={type.id} href={type.href} className="group">
                <Card className={`h-full transition-all hover:shadow-lg border-l-4 ${type.borderColor}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl ${type.bgColor} flex items-center justify-center shrink-0`}>
                        <type.icon className={`w-7 h-7 ${type.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                            {type.name}
                          </h3>
                          <Badge variant="secondary" className="shrink-0">
                            {type.count} investors
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{type.description}</p>

                        {/* Key Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-4 p-3 bg-muted/50 rounded-lg">
                          {Object.entries(type.stats).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <p className="text-sm font-semibold text-foreground">{value}</p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Highlights */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {type.highlights.map((highlight) => (
                            <Badge key={highlight} variant="outline" className="text-xs">
                              <Star className="w-3 h-3 mr-1 text-amber-500" />
                              {highlight}
                            </Badge>
                          ))}
                        </div>

                        {/* CTA */}
                        <div className="flex items-center justify-end mt-4">
                          <span className="text-sm text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                            Explore {type.name}
                            <ArrowUpRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Network Health */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Network Health by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investorTypes.map((type) => {
                  const healthPercent = Math.floor(Math.random() * 30) + 60
                  return (
                    <div key={type.id} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg ${type.bgColor} flex items-center justify-center shrink-0`}>
                        <type.icon className={`w-4 h-4 ${type.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{type.name}</span>
                          <span className="text-sm text-muted-foreground">{healthPercent}% active</span>
                        </div>
                        <Progress value={healthPercent} className="h-2" />
                      </div>
                      <Link
                        href={type.href}
                        className="text-xs text-primary hover:underline shrink-0"
                      >
                        View all
                      </Link>
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

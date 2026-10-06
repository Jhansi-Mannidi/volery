"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import {
  ArrowUpRight,
  ChevronDown,
  DollarSign,
  Edit2,
  ExternalLink,
  FileText,
  PieChart,
  Plus,
  Target,
  TrendingUp,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// Mock funding data
const fundingData = {
  summary: {
    totalRaised: 2500000,
    lastRound: {
      type: "Seed",
      amount: 1500000,
      date: "October 2024",
    },
    nextTarget: {
      type: "Series A",
      range: "$8-10M",
    },
  },
  rounds: [
    {
      id: 1,
      type: "Seed Round",
      date: "October 2024",
      amount: 1500000,
      preMoney: 6000000,
      postMoney: 7500000,
      status: "closed",
      investors: [
        { name: "Anthill Ventures", role: "Lead", amount: 500000, percentage: 6.67 },
        { name: "Angel Investor A", role: "Participant", amount: 300000, percentage: 4.0 },
        { name: "Angel Investor B", role: "Participant", amount: 200000, percentage: 2.67 },
        { name: "Others", role: "Participant", amount: 500000, percentage: 6.66 },
      ],
      documents: [
        { name: "Term Sheet", type: "term-sheet" },
        { name: "SHA", type: "sha" },
        { name: "Cap Table", type: "cap-table" },
      ],
    },
    {
      id: 2,
      type: "Pre-Seed Round",
      date: "March 2023",
      amount: 500000,
      preMoney: 2000000,
      postMoney: 2500000,
      status: "closed",
      investors: [
        { name: "Founder Self-funded", role: "Founder", amount: 200000, percentage: 8.0 },
        { name: "Friends & Family", role: "F&F", amount: 300000, percentage: 12.0 },
      ],
      documents: [],
    },
  ],
  activeCampaign: {
    id: 1,
    active: true,
    target: 10000000,
    raised: 3200000,
    type: "Series A",
    valuationExpectation: "$35-40M pre-money",
    investorInterest: 47,
    meetings: 12,
    pipeline: "$6.2M",
    timeline: "Q2 2026",
    useOfFunds: [
      { category: "Sales & Marketing", percentage: 40 },
      { category: "Product Development", percentage: 30 },
      { category: "Operations", percentage: 20 },
      { category: "Working Capital", percentage: 10 },
    ],
  },
  capTable: {
    shareholders: [
      { name: "Rajesh Kumar (Founder)", shares: 4000000, percentage: 40, type: "Common" },
      { name: "Priya Patel (Co-Founder)", shares: 2500000, percentage: 25, type: "Common" },
      { name: "ESOP Pool", shares: 1000000, percentage: 10, type: "Reserved" },
      { name: "Anthill Ventures", shares: 667000, percentage: 6.67, type: "Preferred" },
      { name: "Angel Investor A", shares: 400000, percentage: 4, type: "Preferred" },
      { name: "Others", shares: 1433000, percentage: 14.33, type: "Preferred" },
    ],
    totalShares: 10000000,
  },
}

const formatCurrency = (amount: number) => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`
  }
  return `$${amount}`
}

export function FundingTab() {
  const [expandedRounds, setExpandedRounds] = useState<number[]>([1])

  const toggleRound = (id: number) => {
    setExpandedRounds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    )
  }

  const progressPercentage = (fundingData.activeCampaign.raised / fundingData.activeCampaign.target) * 100

  return (
    <div className="space-y-6">
      {/* Active Campaign Banner */}
      {fundingData.activeCampaign.active && (
        <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg font-semibold mb-1">Active Fundraising Campaign</CardTitle>
                <CardDescription>
                  {fundingData.activeCampaign.type} • Target: {formatCurrency(fundingData.activeCampaign.target)}
                </CardDescription>
              </div>
              <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-bold text-primary">
                  {formatCurrency(fundingData.activeCampaign.raised)} raised ({progressPercentage.toFixed(0)}%)
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2.5" />
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="bg-background/60 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Investor Interest</p>
                <p className="text-xl font-bold">{fundingData.activeCampaign.investorInterest}</p>
              </div>
              <div className="bg-background/60 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Meetings Scheduled</p>
                <p className="text-xl font-bold">{fundingData.activeCampaign.meetings}</p>
              </div>
              <div className="bg-background/60 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Pipeline Value</p>
                <p className="text-xl font-bold">{fundingData.activeCampaign.pipeline}</p>
              </div>
              <div className="bg-background/60 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Target Close</p>
                <p className="text-xl font-bold">{fundingData.activeCampaign.timeline}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button size="sm" asChild>
                <Link href="/founder/campaign/manage">
                  <Target className="w-4 h-4 mr-1.5" />
                  Manage Campaign
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="bg-background/60">
                <ExternalLink className="w-4 h-4 mr-1.5" />
                View Data Room
              </Button>
              <Button variant="outline" size="sm" className="bg-background/60">
                <TrendingUp className="w-4 h-4 mr-1.5" />
                Track Progress
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Active Campaign - CTA */}
      {!fundingData.activeCampaign.active && (
        <Card className="border-dashed border-2 border-primary/30">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Start Your Fundraising Campaign</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              Launch a fundraising campaign to connect with the right investors and close your round faster
            </p>
            <Button size="lg" asChild>
              <Link href="/founder/campaign/new">
                <Plus className="w-4 h-4 mr-2" />
                Launch Fundraising Campaign
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Funding Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Funding Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Raised</p>
                  <p className="text-3xl font-bold text-foreground">
                    {formatCurrency(fundingData.summary.totalRaised)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Last Round</p>
                  <p className="text-lg font-semibold text-foreground">
                    {fundingData.summary.lastRound.type}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(fundingData.summary.lastRound.amount)} · {fundingData.summary.lastRound.date}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Next Target</p>
                  <p className="text-lg font-semibold text-foreground">
                    {fundingData.summary.nextTarget.type}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {fundingData.summary.nextTarget.range}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funding Rounds Timeline */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold">Funding History</CardTitle>
              <Button variant="outline" size="sm" className="bg-transparent">
                <Plus className="w-4 h-4 mr-1.5" />
                Add Round
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {fundingData.rounds.map((round, index) => (
                <div key={round.id} className="relative">
                  {/* Timeline connector */}
                  {index < fundingData.rounds.length - 1 && (
                    <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-border" />
                  )}

                  <div className="flex gap-4">
                    {/* Timeline dot */}
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1",
                        index === 0 ? "border-primary bg-primary/10" : "border-muted-foreground/30 bg-background"
                      )}
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          index === 0 ? "bg-primary" : "bg-muted-foreground/30"
                        )}
                      />
                    </div>

                    {/* Round Card */}
                    <div className="flex-1 border rounded-lg overflow-hidden">
                      {/* Round Header */}
                      <button
                        onClick={() => toggleRound(round.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-foreground">{round.type}</h4>
                              <Badge variant="outline" className="text-xs">
                                {round.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {round.date} · {formatCurrency(round.amount)}
                              {round.preMoney > 0 && (
                                <span>
                                  {" "}
                                  · Pre: {formatCurrency(round.preMoney)} · Post:{" "}
                                  {formatCurrency(round.postMoney)}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <ChevronDown
                          className={cn(
                            "w-5 h-5 text-muted-foreground transition-transform",
                            expandedRounds.includes(round.id) && "rotate-180"
                          )}
                        />
                      </button>

                      {/* Round Details (Expanded) */}
                      {expandedRounds.includes(round.id) && (
                        <div className="border-t px-4 py-4 bg-muted/20">
                          {/* Investors */}
                          <div className="mb-4">
                            <p className="text-xs font-medium text-muted-foreground mb-2">Investors</p>
                            <div className="space-y-2">
                              {round.investors.map((investor, i) => (
                                <div key={i} className="flex items-center justify-between py-1.5">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="w-6 h-6">
                                      <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
                                        {investor.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")
                                          .slice(0, 2)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium">{investor.name}</span>
                                    {investor.role === "Lead" && (
                                      <Badge className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-0">
                                        Lead
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <span className="text-sm font-medium">{formatCurrency(investor.amount)}</span>
                                    <span className="text-xs text-muted-foreground ml-2">
                                      ({investor.percentage}%)
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Documents */}
                          {round.documents.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-2">Documents</p>
                              <div className="flex flex-wrap gap-2">
                                {round.documents.map((doc, i) => (
                                  <Button key={i} variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                                    <FileText className="w-3 h-3 mr-1" />
                                    {doc.name}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Cap Table Summary */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold">Cap Table</CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Visual Representation */}
              <div className="flex items-center justify-center py-2">
                <div className="relative w-32 h-32">
                  <PieChart className="w-full h-full text-muted-foreground opacity-20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{fundingData.capTable.shareholders.length}</p>
                      <p className="text-xs text-muted-foreground">Shareholders</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shareholders List */}
              <div className="space-y-2">
                {fundingData.capTable.shareholders.map((shareholder, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b last:border-0">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{
                          backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4"][
                            i % 6
                          ],
                        }}
                      />
                      <span className="text-sm truncate">{shareholder.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-medium">{shareholder.percentage}%</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {shareholder.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-2 bg-transparent">
                <FileText className="w-4 h-4 mr-2" />
                View Full Cap Table
              </Button>
            </CardContent>
          </Card>

          {/* Use of Funds */}
          {fundingData.activeCampaign.active && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Use of Funds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {fundingData.activeCampaign.useOfFunds.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium">{item.category}</span>
                      <span className="text-muted-foreground">{item.percentage}%</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

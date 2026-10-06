"use client"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  FileCheck,
  Download,
  Filter,
  Calendar,
  Target,
  Users,
  DollarSign,
} from "lucide-react"

const commitments = [
  {
    id: 1,
    investor: "Sequoia Capital",
    amount: "₹5 Cr",
    status: "Committed",
    docsSigned: true,
    expectedClose: "Feb 15, 2026",
    type: "Lead",
  },
  {
    id: 2,
    investor: "Accel Partners",
    amount: "₹2 Cr",
    status: "Verbal",
    docsSigned: false,
    expectedClose: "Feb 28, 2026",
    type: "Co-investor",
  },
  {
    id: 3,
    investor: "Angel Investor - Kunal Shah",
    amount: "₹1 Cr",
    status: "Committed",
    docsSigned: true,
    expectedClose: "Feb 15, 2026",
    type: "Angel",
  },
  {
    id: 4,
    investor: "Lightspeed Venture",
    amount: "₹3 Cr",
    status: "In Discussion",
    docsSigned: false,
    expectedClose: "Mar 10, 2026",
    type: "Co-investor",
  },
  {
    id: 5,
    investor: "Matrix Partners",
    amount: "₹2 Cr",
    status: "Term Sheet",
    docsSigned: false,
    expectedClose: "Mar 5, 2026",
    type: "Co-investor",
  },
]

const milestones = [
  { name: "Kick-off", date: "Jan 1", status: "completed", progress: 100 },
  { name: "First Meetings", date: "Jan 15", status: "completed", progress: 100 },
  { name: "Term Sheets", date: "Feb 1", status: "in-progress", progress: 60 },
  { name: "Due Diligence", date: "Feb 15", status: "upcoming", progress: 20 },
  { name: "Closing", date: "Mar 1", status: "upcoming", progress: 0 },
]

const funnelData = [
  { stage: "Contacted", count: 45, conversion: 100, benchmark: 100 },
  { stage: "Responded", count: 28, conversion: 62, benchmark: 55 },
  { stage: "Meeting", count: 18, conversion: 40, benchmark: 35 },
  { stage: "Term Sheet", count: 5, conversion: 11, benchmark: 8 },
  { stage: "Closed", count: 2, conversion: 4, benchmark: 3 },
]

export default function CampaignProgressPage() {
  const totalTarget = 15
  const committed = 8
  const percentage = Math.round((committed / totalTarget) * 100)

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Series A Fundraise Progress</h1>
                <p className="text-muted-foreground mt-1">Track your round commitments and timeline</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Download className="w-4 h-4" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Overview</CardTitle>
                <CardDescription>Current status of Series A fundraise</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-foreground">
                      ₹{committed} Cr / ₹{totalTarget} Cr committed
                    </span>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {percentage}%
                    </Badge>
                  </div>
                  <Progress value={percentage} className="h-3" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Lead Investor</p>
                    <p className="text-lg font-semibold text-foreground">Sequoia Capital</p>
                    <p className="text-sm text-primary">₹5 Cr committed</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Other Commitments</p>
                    <p className="text-lg font-semibold text-foreground">2 investors</p>
                    <p className="text-sm text-primary">₹3 Cr total</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">In Discussion</p>
                    <p className="text-lg font-semibold text-foreground">4 investors</p>
                    <p className="text-sm text-muted-foreground">₹6 Cr potential</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Target Amount</p>
                      <p className="text-2xl font-bold text-foreground">₹{totalTarget} Cr</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Committed</p>
                      <p className="text-2xl font-bold text-foreground">₹{committed} Cr</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Investors</p>
                      <p className="text-2xl font-bold text-foreground">5</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Est. Close</p>
                      <p className="text-2xl font-bold text-foreground">Mar 10</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Commitment Tracker */}
            <Card>
              <CardHeader>
                <CardTitle>Commitment Tracker</CardTitle>
                <CardDescription>Detailed breakdown of investor commitments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Investor</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Docs Signed</TableHead>
                      <TableHead>Expected Close</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commitments.map((commitment) => (
                      <TableRow key={commitment.id}>
                        <TableCell className="font-medium">{commitment.investor}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{commitment.type}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">{commitment.amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              commitment.status === "Committed"
                                ? "default"
                                : commitment.status === "Verbal"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {commitment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {commitment.docsSigned ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <Clock className="w-5 h-5 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell>{commitment.expectedClose}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Timeline View */}
              <Card>
                <CardHeader>
                  <CardTitle>Timeline & Milestones</CardTitle>
                  <CardDescription>Track your fundraising progress over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {milestones.map((milestone, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              milestone.status === "completed"
                                ? "bg-green-500"
                                : milestone.status === "in-progress"
                                  ? "bg-amber-500"
                                  : "bg-muted"
                            }`}
                          >
                            {milestone.status === "completed" && (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            )}
                            {milestone.status === "in-progress" && (
                              <Clock className="w-4 h-4 text-white" />
                            )}
                          </div>
                          {index < milestones.length - 1 && (
                            <div className="w-0.5 h-12 bg-border mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-foreground">{milestone.name}</p>
                            <span className="text-sm text-muted-foreground">{milestone.date}</span>
                          </div>
                          <Progress value={milestone.progress} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Funnel Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle>Funnel Analytics</CardTitle>
                  <CardDescription>Conversion rates vs industry benchmarks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {funnelData.map((stage, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-foreground">{stage.stage}</span>
                            <Badge variant="secondary">{stage.count}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">
                              {stage.conversion}%
                            </span>
                            <span className="text-xs text-muted-foreground">
                              (Benchmark: {stage.benchmark}%)
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Progress value={stage.conversion} className="h-2" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Progress
                              value={stage.benchmark}
                              className="h-1 opacity-40"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
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

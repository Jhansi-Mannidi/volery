"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  ChevronDown,
  ChevronRight,
  DollarSign,
  Edit2,
  ExternalLink,
  FileText,
  PieChart,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Toaster } from "@/components/ui/toaster"
import { JSX } from "react"

type RoundItem = (typeof fundingData.rounds)[number]

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
    {
      id: 3,
      type: "Bootstrapped",
      date: "January 2023",
      amount: 100000,
      preMoney: 0,
      postMoney: 0,
      status: "closed",
      investors: [
        { name: "Founder Investment", role: "Founder", amount: 100000, percentage: 100 },
      ],
      documents: [],
    },
  ],
  capTable: {
    shareholders: [
      { name: "Rajesh Kumar (Founder)", shares: 4000000, percentage: 40, type: "Common" },
      { name: "Priya Patel (Founder)", shares: 2500000, percentage: 25, type: "Common" },
      { name: "ESOP Pool", shares: 1000000, percentage: 10, type: "Reserved" },
      { name: "Anthill Ventures", shares: 667000, percentage: 6.67, type: "Preferred" },
      { name: "Angel Investor A", shares: 400000, percentage: 4, type: "Preferred" },
      { name: "Angel Investor B", shares: 267000, percentage: 2.67, type: "Preferred" },
      { name: "Others", shares: 666000, percentage: 6.66, type: "Preferred" },
      { name: "Friends & Family", shares: 500000, percentage: 5, type: "Common" },
    ],
    totalShares: 10000000,
  },
  currentFundraise: {
    active: true,
    target: "$8-10M",
    type: "Series A",
    valuationExpectation: "$35-40M pre-money",
    useOfFunds: [
      { category: "Sales & Marketing", percentage: 40 },
      { category: "Product Development", percentage: 30 },
      { category: "Operations", percentage: 30 },
    ],
    timeline: "Q2 2026",
    status: "Active fundraise",
    dataRoomUrl: "#",
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
  const router = useRouter()
  const { toast } = useToast()
  const [expandedRounds, setExpandedRounds] = useState<number[]>([1])
  const [roundsList, setRoundsList] = useState<RoundItem[]>(fundingData.rounds)
  const [addRoundOpen, setAddRoundOpen] = useState(false)
  const [editCapTableOpen, setEditCapTableOpen] = useState(false)
  const [showAllShareholders, setShowAllShareholders] = useState(false)

  const toggleRound = (id: number) => {
    setExpandedRounds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    )
  }

  const handleViewDocument = (roundType: string, docName: string) => {
    toast({
      title: "Open document",
      description: `${docName} for ${roundType} would open in viewer.`,
    })
  }

  const handleViewDataRoom = () => {
    router.push("/documents")
  }

  const displayedShareholders = useMemo(
    () =>
      showAllShareholders
        ? fundingData.capTable.shareholders
        : fundingData.capTable.shareholders.slice(0, 5),
    [showAllShareholders]
  )
  const hasMoreShareholders = fundingData.capTable.shareholders.length > 5

  // Calculate cap table colors for pie chart visualization
  const capTableColors = [
    "bg-primary",
    "bg-blue-500",
    "bg-amber-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-cyan-500",
    "bg-orange-500",
  ]

  return (
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
            <CardTitle className="text-base font-semibold">Funding Rounds</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddRoundOpen(true)}
            >
              <DollarSign className="w-4 h-4 mr-1.5" />
              Add Round
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {roundsList.map((round, index) => (
              <div
                key={round.id}
                className="relative"
              >
                {/* Timeline connector */}
                {index < roundsList.length - 1 && (
                  <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-border" />
                )}
                
                <div className="flex gap-4">
                  {/* Timeline dot */}
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1",
                    index === 0 
                      ? "border-primary bg-primary/10" 
                      : "border-muted-foreground/30 bg-background"
                  )}>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      index === 0 ? "bg-primary" : "bg-muted-foreground/30"
                    )} />
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
                                {" "}· Pre: {formatCurrency(round.preMoney)} · Post: {formatCurrency(round.postMoney)}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <ChevronDown className={cn(
                        "w-5 h-5 text-muted-foreground transition-transform",
                        expandedRounds.includes(round.id) && "rotate-180"
                      )} />
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
                                      {investor.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
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
                                <Button
                                  key={i}
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs bg-transparent"
                                  onClick={() => handleViewDocument(round.type, doc.name)}
                                >
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
        {/* Current Fundraise Card */}
        {fundingData.currentFundraise.active && (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Current Fundraise</CardTitle>
                <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-0">
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Target</p>
                  <p className="text-lg font-semibold text-foreground">
                    {fundingData.currentFundraise.target}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fundingData.currentFundraise.type}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Valuation</p>
                  <p className="text-sm font-medium text-foreground">
                    {fundingData.currentFundraise.valuationExpectation}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Use of Funds</p>
                <div className="space-y-2">
                  {fundingData.currentFundraise.useOfFunds.map((item, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>{item.category}</span>
                        <span className="font-medium">{item.percentage}%</span>
                      </div>
                      <Progress value={item.percentage} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Timeline</p>
                  <p className="text-sm font-medium">{fundingData.currentFundraise.timeline}</p>
                </div>
                <Button size="sm">
                  <ExternalLink className="w-4 h-4 mr-1.5" />
                  View Data Room
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cap Table Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">Cap Table</CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setEditCapTableOpen(true)}
              aria-label="Edit cap table"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Visual Pie Chart Representation */}
            <div className="flex items-center justify-center py-2">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {fundingData.capTable.shareholders.reduce((acc, shareholder, i) => {
                    const startAngle = acc.angle
                    const sliceAngle = (shareholder.percentage / 100) * 360
                    const endAngle = startAngle + sliceAngle
                    
                    const startRad = (startAngle * Math.PI) / 180
                    const endRad = (endAngle * Math.PI) / 180
                    
                    const x1 = 50 + 40 * Math.cos(startRad)
                    const y1 = 50 + 40 * Math.sin(startRad)
                    const x2 = 50 + 40 * Math.cos(endRad)
                    const y2 = 50 + 40 * Math.sin(endRad)
                    
                    const largeArc = sliceAngle > 180 ? 1 : 0
                    
                    const colors = [
                      "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", 
                      "#EC4899", "#06B6D4", "#F97316", "#6366F1"
                    ]
                    
                    acc.paths.push(
                      <path
                        key={i}
                        d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={colors[i % colors.length]}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    )
                    
                    acc.angle = endAngle
                    return acc
                  }, { paths: [] as JSX.Element[], angle: 0 }).paths}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center">
                    <PieChart className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            {/* Shareholders List */}
            <div className="space-y-2">
              {displayedShareholders.map((shareholder, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ 
                        backgroundColor: [
                          "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", 
                          "#EC4899", "#06B6D4", "#F97316", "#6366F1"
                        ][i % 8] 
                      }}
                    />
                    <span className="text-sm truncate max-w-[140px]">{shareholder.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{shareholder.percentage}%</span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {shareholder.type}
                    </Badge>
                  </div>
                </div>
              ))}
              {hasMoreShareholders && !showAllShareholders && (
                <button
                  type="button"
                  className="text-xs text-muted-foreground text-center pt-1 w-full hover:text-primary transition-colors"
                  onClick={() => setShowAllShareholders(true)}
                >
                  +{fundingData.capTable.shareholders.length - 5} more shareholders
                </button>
              )}
            </div>

            <Button
              variant="link"
              className="w-full justify-center text-primary p-0 h-auto"
              onClick={() => {
                setShowAllShareholders(true)
                toast({ title: "Cap table", description: "Showing full cap table." })
              }}
            >
              View Full Cap Table
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Add Round Modal */}
      <Dialog open={addRoundOpen} onOpenChange={setAddRoundOpen}>
        <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Add Funding Round</DialogTitle>
            <DialogDescription>
              Add a new funding round to the startup&apos;s history. Enter round type, date, and amount.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="round-type">Round type</Label>
              <Input
                id="round-type"
                placeholder="e.g. Series A, Seed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="round-date">Date</Label>
              <Input
                id="round-date"
                type="month"
                placeholder="e.g. October 2024"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="round-amount">Amount raised ($)</Label>
              <Input
                id="round-amount"
                type="number"
                placeholder="e.g. 1500000"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="pre-money">Pre-money ($)</Label>
                <Input id="pre-money" type="number" placeholder="Optional" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-money">Post-money ($)</Label>
                <Input id="post-money" type="number" placeholder="Optional" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddRoundOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                setAddRoundOpen(false)
                setRoundsList((prev) => [
                  ...prev,
                  {
                    id: Math.max(...prev.map((r) => r.id), 0) + 1,
                    type: "New Round",
                    date: "TBD",
                    amount: 0,
                    preMoney: 0,
                    postMoney: 0,
                    status: "closed",
                    investors: [],
                    documents: [],
                  },
                ])
                setExpandedRounds((prev) => [...prev, Math.max(...roundsList.map((r) => r.id), 0) + 1])
                toast({ title: "Round added", description: "Funding round has been added. You can edit details next." })
              }}
            >
              Add Round
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Cap Table Modal */}
      <Dialog open={editCapTableOpen} onOpenChange={setEditCapTableOpen}>
        <DialogContent className="max-w-lg" onCloseAutoFocus={(e) => e?.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Edit Cap Table</DialogTitle>
            <DialogDescription>
              Update shareholder information and ownership percentages. Changes will be reflected in the cap table.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
            <p className="text-sm text-muted-foreground">
              Cap table editor would allow adding/editing shareholders, share classes, and percentages. For now, use your spreadsheet or cap table tool and re-upload.
            </p>
            <div className="rounded-lg border p-3 space-y-2">
              {fundingData.capTable.shareholders.slice(0, 4).map((s, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="font-medium truncate max-w-[200px]">{s.name}</span>
                  <span className="text-muted-foreground">{s.percentage}% · {s.type}</span>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCapTableOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                setEditCapTableOpen(false)
                toast({ title: "Cap table updated", description: "Cap table changes have been saved." })
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}

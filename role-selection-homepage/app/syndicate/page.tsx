"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import {
  Search,
  Filter,
  Users,
  TrendingUp,
  Clock,
  IndianRupee,
  Building2,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Send,
  UserPlus,
  Share2,
  Calendar,
  Eye,
  Plus,
  Mail,
  Briefcase,
} from "lucide-react"

// Mock data for syndicate deals
const syndicateDeals = [
  {
    id: "1",
    company: "TalentFlow",
    logo: "/placeholder-logo.png",
    round: "Series A",
    leadInvestor: "Sequoia Capital",
    leadAmount: 50000000, // 5 Cr
    totalRound: 150000000, // 15 Cr
    availableAllocation: 30000000, // 3 Cr
    minimumInvestment: 5000000, // 50 L
    deadline: "2026-02-15",
    sector: "HR Tech",
    coInvestors: ["Accel", "Matrix Partners"],
    description: "AI-powered talent management platform",
    metrics: { arr: "₹8 Cr", growth: "180%", customers: 120 },
    status: "open",
  },
  {
    id: "2",
    company: "FinStack",
    logo: "/placeholder-logo.png",
    round: "Series B",
    leadInvestor: "Tiger Global",
    leadAmount: 200000000, // 20 Cr
    totalRound: 500000000, // 50 Cr
    availableAllocation: 50000000, // 5 Cr
    minimumInvestment: 10000000, // 1 Cr
    deadline: "2026-02-28",
    sector: "FinTech",
    coInvestors: ["Ribbit Capital", "Y Combinator"],
    description: "Embedded finance infrastructure for India",
    metrics: { arr: "₹25 Cr", growth: "220%", customers: 350 },
    status: "open",
  },
  {
    id: "3",
    company: "MedAssist",
    logo: "/placeholder-logo.png",
    round: "Series A",
    leadInvestor: "Lightspeed",
    leadAmount: 80000000, // 8 Cr
    totalRound: 200000000, // 20 Cr
    availableAllocation: 20000000, // 2 Cr
    minimumInvestment: 5000000, // 50 L
    deadline: "2026-03-10",
    sector: "HealthTech",
    coInvestors: ["Elevation Capital"],
    description: "AI diagnostics for rural healthcare",
    metrics: { arr: "₹4 Cr", growth: "150%", customers: 85 },
    status: "filling",
  },
]

// Mock data for co-investor network
const coInvestorNetwork = [
  {
    id: "1",
    name: "Accel Partners",
    logo: "/placeholder-logo.png",
    type: "VC",
    dealsTogetherCount: 8,
    totalCoinvested: 250000000, // 25 Cr
    sectors: ["SaaS", "FinTech", "Consumer"],
    lastCoinvestment: "2026-01-10",
    relationshipStrength: "strong",
  },
  {
    id: "2",
    name: "Matrix Partners",
    logo: "/placeholder-logo.png",
    type: "VC",
    dealsTogetherCount: 5,
    totalCoinvested: 180000000, // 18 Cr
    sectors: ["Enterprise", "HealthTech"],
    lastCoinvestment: "2025-12-15",
    relationshipStrength: "strong",
  },
  {
    id: "3",
    name: "Blume Ventures",
    logo: "/placeholder-logo.png",
    type: "VC",
    dealsTogetherCount: 3,
    totalCoinvested: 80000000, // 8 Cr
    sectors: ["B2B SaaS", "DeepTech"],
    lastCoinvestment: "2025-11-20",
    relationshipStrength: "moderate",
  },
  {
    id: "4",
    name: "Kalaari Capital",
    logo: "/placeholder-logo.png",
    type: "VC",
    dealsTogetherCount: 2,
    totalCoinvested: 50000000, // 5 Cr
    sectors: ["Consumer", "EdTech"],
    lastCoinvestment: "2025-10-05",
    relationshipStrength: "moderate",
  },
  {
    id: "5",
    name: "Rajesh Mehta",
    logo: "/placeholder-user.jpg",
    type: "Angel",
    dealsTogetherCount: 4,
    totalCoinvested: 20000000, // 2 Cr
    sectors: ["SaaS", "AI/ML"],
    lastCoinvestment: "2026-01-05",
    relationshipStrength: "strong",
  },
]

// Mock data for my commitments
const myCommitments = [
  {
    id: "1",
    company: "CloudKitchen Pro",
    round: "Series A",
    leadInvestor: "Peak XV",
    myAllocation: 10000000, // 1 Cr
    status: "confirmed",
    closeDate: "2026-02-20",
    documentsComplete: true,
  },
  {
    id: "2",
    company: "EduBridge",
    round: "Series B",
    leadInvestor: "Nexus VP",
    myAllocation: 25000000, // 2.5 Cr
    status: "pending_docs",
    closeDate: "2026-03-01",
    documentsComplete: false,
  },
  {
    id: "3",
    company: "LogiNext",
    round: "Series A",
    leadInvestor: "Bessemer",
    myAllocation: 15000000, // 1.5 Cr
    status: "closed",
    closeDate: "2026-01-15",
    documentsComplete: true,
  },
]

function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)} Cr`
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(0)} L`
  }
  return `₹${amount.toLocaleString()}`
}

function getDaysUntil(dateStr: string): number {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default function SyndicatePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("deals")
  const [searchQuery, setSearchQuery] = useState("")
  const [requestAllocationOpen, setRequestAllocationOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<typeof syndicateDeals[0] | null>(null)
  const [allocationAmount, setAllocationAmount] = useState("")
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [selectedCoInvestor, setSelectedCoInvestor] = useState<typeof coInvestorNetwork[0] | null>(null)
  const [shareDealOpen, setShareDealOpen] = useState(false)

  const isInstitutionalInvestor = user?.activeRole === "institutional-investor"

  if (!isInstitutionalInvestor) {
  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader title="Syndicate & Co-invest" />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 flex items-center justify-center">
            <Card className="max-w-md">
              <CardContent className="pt-6 text-center">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-lg font-semibold mb-2">Investor Access Only</h2>
                <p className="text-muted-foreground">
                  This feature is only available for institutional investors.
                </p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  const handleRequestAllocation = (deal: typeof syndicateDeals[0]) => {
    setSelectedDeal(deal)
    setRequestAllocationOpen(true)
  }

  const handleInviteToDeal = (coInvestor: typeof coInvestorNetwork[0]) => {
    setSelectedCoInvestor(coInvestor)
    setInviteModalOpen(true)
  }

  const filteredDeals = syndicateDeals.filter(
    (deal) =>
      deal.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.leadInvestor.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredCoInvestors = coInvestorNetwork.filter(
    (investor) =>
      investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.sectors.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Stats
  const openDeals = syndicateDeals.filter((d) => d.status === "open" || d.status === "filling").length
  const totalAvailableAllocation = syndicateDeals.reduce((sum, d) => sum + d.availableAllocation, 0)
  const totalCommitted = myCommitments.reduce((sum, c) => sum + c.myAllocation, 0)
  const pendingCommitments = myCommitments.filter((c) => c.status === "pending_docs").length

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Syndicate & Co-invest" />

        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Open Deals</p>
                      <p className="text-2xl font-bold">{openDeals}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <IndianRupee className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Available Allocation</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalAvailableAllocation)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">My Commitments</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalCommitted)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10">
                      <Users className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Co-investor Network</p>
                      <p className="text-2xl font-bold">{coInvestorNetwork.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <TabsList>
                  <TabsTrigger value="deals">Syndicate Deals</TabsTrigger>
                  <TabsTrigger value="network">Co-investor Network</TabsTrigger>
                  <TabsTrigger value="commitments">My Commitments</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-[250px]"
                    />
                  </div>
                  <Button variant="outline" size="icon" className="bg-transparent">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Syndicate Deals Tab */}
              <TabsContent value="deals" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredDeals.map((deal) => {
                    const daysLeft = getDaysUntil(deal.deadline)
                    const fillPercentage = ((deal.totalRound - deal.availableAllocation) / deal.totalRound) * 100

                    return (
                      <Card key={deal.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12 rounded-lg">
                                <AvatarImage src={deal.logo || "/placeholder.svg"} />
                                <AvatarFallback className="rounded-lg">{deal.company[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-lg">{deal.company}</CardTitle>
                                <CardDescription>{deal.round}</CardDescription>
                              </div>
                            </div>
                            <Badge
                              variant={deal.status === "open" ? "default" : "secondary"}
                              className={cn(
                                deal.status === "open" && "bg-green-500/10 text-green-600 hover:bg-green-500/20",
                                deal.status === "filling" && "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                              )}
                            >
                              {deal.status === "open" ? "Open" : "Filling Fast"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground">{deal.description}</p>

                          {/* Lead Investor */}
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Lead Investor</span>
                            <span className="font-medium">
                              {deal.leadInvestor} ({formatCurrency(deal.leadAmount)} / {formatCurrency(deal.totalRound)})
                            </span>
                          </div>

                          {/* Round Progress */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Round Progress</span>
                              <span className="font-medium">{fillPercentage.toFixed(0)}% filled</span>
                            </div>
                            <Progress value={fillPercentage} className="h-2" />
                          </div>

                          {/* Allocation Details */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Available Allocation</p>
                              <p className="font-semibold text-lg">{formatCurrency(deal.availableAllocation)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Minimum</p>
                              <p className="font-semibold text-lg">{formatCurrency(deal.minimumInvestment)}</p>
                            </div>
                          </div>

                          {/* Deadline */}
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className={cn(
                              daysLeft <= 7 ? "text-red-600 font-medium" : "text-muted-foreground"
                            )}>
                              Deadline: {new Date(deal.deadline).toLocaleDateString()} ({daysLeft} days left)
                            </span>
                          </div>

                          {/* Co-investors */}
                          {deal.coInvestors.length > 0 && (
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Co-investors joined:</span>
                              <span className="font-medium">{deal.coInvestors.join(", ")}</span>
                            </div>
                          )}

                          {/* Metrics */}
                          <div className="flex items-center gap-4 pt-2 border-t">
                            <div className="text-sm">
                              <span className="text-muted-foreground">ARR:</span>
                              <span className="ml-1 font-medium">{deal.metrics.arr}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Growth:</span>
                              <span className="ml-1 font-medium text-green-600">{deal.metrics.growth}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Customers:</span>
                              <span className="ml-1 font-medium">{deal.metrics.customers}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-transparent"
                              onClick={() => router.push(`/deals/${deal.id}`)}
                            >
                              <Eye className="w-4 h-4 mr-1.5" />
                              View Deal
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => handleRequestAllocation(deal)}
                            >
                              <IndianRupee className="w-4 h-4 mr-1.5" />
                              Request Allocation
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedDeal(deal)
                                setShareDealOpen(true)
                              }}
                            >
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              {/* Co-investor Network Tab */}
              <TabsContent value="network" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCoInvestors.map((investor) => (
                    <Card key={investor.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={investor.logo || "/placeholder.svg"} />
                            <AvatarFallback>{investor.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold truncate">{investor.name}</h3>
                              <Badge variant="outline" className="text-xs">
                                {investor.type}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {investor.sectors.slice(0, 2).map((sector) => (
                                <Badge key={sector} variant="secondary" className="text-xs">
                                  {sector}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Deals Together</p>
                            <p className="font-semibold">{investor.dealsTogetherCount}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Total Co-invested</p>
                            <p className="font-semibold">{formatCurrency(investor.totalCoinvested)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Last: {new Date(investor.lastCoinvestment).toLocaleDateString()}</span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "ml-auto text-xs",
                              investor.relationshipStrength === "strong" && "border-green-500 text-green-600",
                              investor.relationshipStrength === "moderate" && "border-amber-500 text-amber-600"
                            )}
                          >
                            {investor.relationshipStrength}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => handleInviteToDeal(investor)}
                          >
                            <Send className="w-4 h-4 mr-1.5" />
                            Invite to Deal
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Add Co-investor Card */}
                  <Card className="border-dashed">
                    <CardContent className="pt-6 flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                      <div className="p-3 rounded-full bg-muted mb-3">
                        <UserPlus className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium mb-1">Add Co-investor</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Expand your network
                      </p>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Plus className="w-4 h-4 mr-1.5" />
                        Add New
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* My Commitments Tab */}
              <TabsContent value="commitments" className="mt-6">
                <div className="space-y-4">
                  {myCommitments.map((commitment) => (
                    <Card key={commitment.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10 rounded-lg">
                              <AvatarFallback className="rounded-lg">{commitment.company[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{commitment.company}</h3>
                              <p className="text-sm text-muted-foreground">
                                {commitment.round} - Lead: {commitment.leadInvestor}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">My Allocation</p>
                              <p className="font-semibold">{formatCurrency(commitment.myAllocation)}</p>
                            </div>

                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Close Date</p>
                              <p className="font-medium">{new Date(commitment.closeDate).toLocaleDateString()}</p>
                            </div>

                            <Badge
                              className={cn(
                                commitment.status === "confirmed" && "bg-green-500/10 text-green-600",
                                commitment.status === "pending_docs" && "bg-amber-500/10 text-amber-600",
                                commitment.status === "closed" && "bg-blue-500/10 text-blue-600"
                              )}
                            >
                              {commitment.status === "confirmed" && (
                                <>
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Confirmed
                                </>
                              )}
                              {commitment.status === "pending_docs" && (
                                <>
                                  <Clock className="w-3 h-3 mr-1" />
                                  Pending Docs
                                </>
                              )}
                              {commitment.status === "closed" && (
                                <>
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Closed
                                </>
                              )}
                            </Badge>

                            {commitment.status === "pending_docs" && (
                              <Button size="sm">Complete Documents</Button>
                            )}
                            {commitment.status === "confirmed" && (
                              <Button variant="outline" size="sm" className="bg-transparent">
                                View Details
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Request Allocation Modal */}
      <Dialog open={requestAllocationOpen} onOpenChange={setRequestAllocationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Allocation</DialogTitle>
            <DialogDescription>
              Request allocation in {selectedDeal?.company} {selectedDeal?.round}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available Allocation</span>
                <span className="font-medium">{selectedDeal && formatCurrency(selectedDeal.availableAllocation)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Minimum Investment</span>
                <span className="font-medium">{selectedDeal && formatCurrency(selectedDeal.minimumInvestment)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Deadline</span>
                <span className="font-medium">{selectedDeal && new Date(selectedDeal.deadline).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Requested Amount</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter amount"
                  value={allocationAmount}
                  onChange={(e) => setAllocationAmount(e.target.value)}
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter amount in lakhs (e.g., 50 for ₹50L)
              </p>
            </div>

            <div className="space-y-2">
              <Label>Notes for Lead Investor (Optional)</Label>
              <Textarea placeholder="Add any notes or context for your allocation request..." />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestAllocationOpen(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button onClick={() => setRequestAllocationOpen(false)}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite to Deal Modal */}
      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite to Deal</DialogTitle>
            <DialogDescription>
              Invite {selectedCoInvestor?.name} to co-invest in a deal
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Deal</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a deal to share" />
                </SelectTrigger>
                <SelectContent>
                  {syndicateDeals.map((deal) => (
                    <SelectItem key={deal.id} value={deal.id}>
                      {deal.company} - {deal.round}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="Add a personal message..."
                defaultValue={`Hi ${selectedCoInvestor?.name},\n\nI wanted to share an interesting deal with you that aligns with your investment thesis.`}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteModalOpen(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button onClick={() => setInviteModalOpen(false)}>
              <Send className="w-4 h-4 mr-1.5" />
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Deal Modal */}
      <Dialog open={shareDealOpen} onOpenChange={setShareDealOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Deal</DialogTitle>
            <DialogDescription>
              Share {selectedDeal?.company} with your co-investor network
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Co-investors</Label>
              <div className="space-y-2 max-h-[200px] overflow-auto">
                {coInvestorNetwork.map((investor) => (
                  <div
                    key={investor.id}
                    className="flex items-center gap-3 p-2 rounded-lg border hover:bg-muted/50 cursor-pointer"
                  >
                    <input type="checkbox" className="rounded" />
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={investor.logo || "/placeholder.svg"} />
                      <AvatarFallback>{investor.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{investor.name}</p>
                      <p className="text-xs text-muted-foreground">{investor.sectors.join(", ")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea placeholder="Add a note about why you're sharing this deal..." />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDealOpen(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button onClick={() => setShareDealOpen(false)}>
              <Share2 className="w-4 h-4 mr-1.5" />
              Share Deal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

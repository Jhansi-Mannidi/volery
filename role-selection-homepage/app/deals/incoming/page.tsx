"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Archive,
  Building2,
  Calendar,
  CheckSquare,
  ChevronDown,
  Eye,
  Filter,
  Plus,
  Search,
  Star,
  TrendingUp,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

// Mock incoming deals data
const incomingDeals = [
  {
    id: "1",
    name: "TalentFlow",
    tagline: "HR Analytics SaaS",
    stage: "Series A",
    checkSize: "₹15 Cr",
    arr: "₹1.2 Cr",
    growth: "180%",
    customers: 85,
    source: "Referred",
    referredBy: "Rajesh Kumar",
    receivedDate: "2 days ago",
    matchScore: 88,
    sector: "HR Tech",
  },
  {
    id: "2",
    name: "GreenEnergy Solutions",
    tagline: "Renewable Energy Infrastructure",
    stage: "Series B",
    checkSize: "₹25 Cr",
    arr: "₹4.5 Cr",
    growth: "210%",
    customers: 142,
    source: "Direct",
    receivedDate: "1 day ago",
    matchScore: 92,
    sector: "CleanTech",
  },
  {
    id: "3",
    name: "MedConnect",
    tagline: "Healthcare Marketplace Platform",
    stage: "Seed",
    checkSize: "₹8 Cr",
    arr: "₹0.5 Cr",
    growth: "320%",
    customers: 45,
    source: "Platform",
    receivedDate: "5 hours ago",
    matchScore: 78,
    sector: "HealthTech",
  },
  {
    id: "4",
    name: "LogiTech AI",
    tagline: "AI-powered Logistics Optimization",
    stage: "Pre-Series A",
    checkSize: "₹12 Cr",
    arr: "₹0.9 Cr",
    growth: "195%",
    customers: 62,
    source: "Cold Inbound",
    receivedDate: "3 days ago",
    matchScore: 65,
    sector: "Logistics",
  },
  {
    id: "5",
    name: "EduNext",
    tagline: "Personalized Learning Platform",
    stage: "Series A",
    checkSize: "₹18 Cr",
    arr: "₹2.1 Cr",
    growth: "165%",
    customers: 120,
    source: "Referred",
    referredBy: "Amit Sharma",
    receivedDate: "1 week ago",
    matchScore: 85,
    sector: "EdTech",
  },
  {
    id: "6",
    name: "FinFlow",
    tagline: "B2B Payment Infrastructure",
    stage: "Series A",
    checkSize: "₹20 Cr",
    arr: "₹3.2 Cr",
    growth: "240%",
    customers: 95,
    source: "Platform",
    receivedDate: "4 days ago",
    matchScore: 90,
    sector: "Fintech",
  },
]

type TabType = "all" | "ai-matched" | "referred" | "cold-inbound"

const passReasons = [
  { value: "outside-thesis", label: "Outside thesis" },
  { value: "stage-mismatch", label: "Stage mismatch" },
  { value: "valuation-concerns", label: "Valuation concerns" },
  { value: "team-concerns", label: "Team concerns" },
  { value: "market-concerns", label: "Market concerns" },
  { value: "competitor", label: "Already invested in competitor" },
]

export default function IncomingDealsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDeals, setSelectedDeals] = useState<string[]>([])
  const [passModalOpen, setPassModalOpen] = useState(false)
  const [selectedPassReason, setSelectedPassReason] = useState("")
  const [passNotes, setPassNotes] = useState("")

  const filteredDeals = incomingDeals.filter((deal) => {
    const matchesSearch =
      deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.sector.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "ai-matched" && deal.matchScore >= 80) ||
      (activeTab === "referred" && deal.source === "Referred") ||
      (activeTab === "cold-inbound" && deal.source === "Cold Inbound")

    return matchesSearch && matchesTab
  })

  const toggleDealSelection = (dealId: string) => {
    setSelectedDeals((prev) =>
      prev.includes(dealId) ? prev.filter((id) => id !== dealId) : [...prev, dealId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedDeals.length === filteredDeals.length) {
      setSelectedDeals([])
    } else {
      setSelectedDeals(filteredDeals.map((d) => d.id))
    }
  }

  const handleBulkPass = () => {
    setPassModalOpen(true)
  }

  const handlePassSubmit = () => {
    console.log("[v0] Passing deals:", selectedDeals, selectedPassReason, passNotes)
    setPassModalOpen(false)
    setSelectedDeals([])
    setSelectedPassReason("")
    setPassNotes("")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader title="Deal Flow Inbox" />

        <main className="flex-1 overflow-auto">
          {/* Page Header */}
          <div className="border-b bg-card px-4 md:px-6 py-4">
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Deal Flow Inbox</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredDeals.length} incoming deals
                </p>
              </div>

              {/* Inbox Tabs */}
              <div className="flex items-center gap-1 border-b">
                <button
                  onClick={() => setActiveTab("all")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                    activeTab === "all"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab("ai-matched")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium border-b-2 transition-colors inline-flex items-center gap-1.5",
                    activeTab === "ai-matched"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Star className="w-3.5 h-3.5" />
                  AI Matched
                </button>
                <button
                  onClick={() => setActiveTab("referred")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                    activeTab === "referred"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  Referred
                </button>
                <button
                  onClick={() => setActiveTab("cold-inbound")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                    activeTab === "cold-inbound"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  Cold Inbound
                </button>
              </div>

              {/* Filter Bar */}
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search deals..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Select defaultValue="all-sectors">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-sectors">All Sectors</SelectItem>
                      <SelectItem value="fintech">Fintech</SelectItem>
                      <SelectItem value="healthtech">HealthTech</SelectItem>
                      <SelectItem value="edtech">EdTech</SelectItem>
                      <SelectItem value="cleantech">CleanTech</SelectItem>
                      <SelectItem value="logistics">Logistics</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="all-stages">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-stages">All Stages</SelectItem>
                      <SelectItem value="seed">Seed</SelectItem>
                      <SelectItem value="pre-series-a">Pre-Series A</SelectItem>
                      <SelectItem value="series-a">Series A</SelectItem>
                      <SelectItem value="series-b">Series B</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="all-sizes">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Check Size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-sizes">All Sizes</SelectItem>
                      <SelectItem value="small">{"< ₹10 Cr"}</SelectItem>
                      <SelectItem value="medium">₹10-20 Cr</SelectItem>
                      <SelectItem value="large">{"> ₹20 Cr"}</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="all-sources">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-sources">All Sources</SelectItem>
                      <SelectItem value="direct">Direct</SelectItem>
                      <SelectItem value="platform">Platform</SelectItem>
                      <SelectItem value="referred">Referred</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="7">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Last 24 hours</SelectItem>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="all">All time</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="0">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Match Score" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">All Match Scores</SelectItem>
                      <SelectItem value="90">90% and above</SelectItem>
                      <SelectItem value="80">80% and above</SelectItem>
                      <SelectItem value="70">70% and above</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bulk Actions Bar */}
              {selectedDeals.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedDeals.length === filteredDeals.length}
                      onCheckedChange={toggleSelectAll}
                    />
                    <span className="text-sm font-medium">
                      {selectedDeals.length} deal{selectedDeals.length !== 1 ? "s" : ""} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                      onClick={() => {
                        console.log("[v0] Adding to pipeline:", selectedDeals)
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      Add to Pipeline
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                      onClick={handleBulkPass}
                    >
                      <X className="w-4 h-4 mr-1.5" />
                      Pass
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                      onClick={() => {
                        console.log("[v0] Archiving:", selectedDeals)
                      }}
                    >
                      <Archive className="w-4 h-4 mr-1.5" />
                      Archive
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Deals List */}
          <div className="p-4 md:p-6">
            <div className="space-y-3">
              {filteredDeals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  isSelected={selectedDeals.includes(deal.id)}
                  onToggleSelect={() => toggleDealSelection(deal.id)}
                  onPass={() => {
                    setSelectedDeals([deal.id])
                    setPassModalOpen(true)
                  }}
                  onViewDetails={() => router.push(`/deals/${deal.id}`)}
                />
              ))}
            </div>

            {filteredDeals.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Building2 className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-1">No deals found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Pass Reason Modal */}
      <Dialog open={passModalOpen} onOpenChange={setPassModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Pass on Deal{selectedDeals.length > 1 ? "s" : ""}</DialogTitle>
            <DialogDescription>
              Please select a reason for passing on{" "}
              {selectedDeals.length === 1 ? "this deal" : `these ${selectedDeals.length} deals`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label>Reason for passing (required)</Label>
              <RadioGroup value={selectedPassReason} onValueChange={setSelectedPassReason}>
                {passReasons.map((reason) => (
                  <div key={reason.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={reason.value} id={reason.value} />
                    <Label htmlFor={reason.value} className="font-normal cursor-pointer">
                      {reason.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional notes (optional)</Label>
              <Textarea
                id="notes"
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
            <Button onClick={handlePassSubmit} disabled={!selectedPassReason}>
              Confirm Pass
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface DealCardProps {
  deal: (typeof incomingDeals)[0]
  isSelected: boolean
  onToggleSelect: () => void
  onPass: () => void
  onViewDetails: () => void
}

function DealCard({ deal, isSelected, onToggleSelect, onPass, onViewDetails }: DealCardProps) {
  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 dark:text-green-400"
    if (score >= 70) return "text-amber-600 dark:text-amber-400"
    return "text-muted-foreground"
  }

  return (
    <Card className={cn("hover:shadow-md transition-all", isSelected && "ring-2 ring-primary")}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} className="mt-1" />

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground text-lg truncate">
                      {deal.name}
                    </h3>
                    <div
                      className={cn(
                        "flex items-center gap-1 text-sm font-medium shrink-0",
                        getMatchScoreColor(deal.matchScore)
                      )}
                    >
                      <span>{deal.matchScore}%</span>
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {deal.tagline} · {deal.stage} · {deal.checkSize}
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-4 mb-3 text-sm">
              <div>
                <span className="font-semibold text-foreground">{deal.arr}</span>
                <span className="text-muted-foreground"> ARR</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                <span className="font-semibold text-foreground">{deal.growth}</span>
                <span className="text-muted-foreground"> YoY</span>
              </div>
              <div>
                <span className="font-semibold text-foreground">{deal.customers}</span>
                <span className="text-muted-foreground"> customers</span>
              </div>
            </div>

            {/* Source & Date */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1.5">
                <span className="font-medium">Source:</span>
                {deal.source === "Referred" && deal.referredBy ? (
                  <span>
                    Referred by <span className="text-foreground">{deal.referredBy}</span>
                  </span>
                ) : (
                  <span className="text-foreground">{deal.source}</span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Received: {deal.receivedDate}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent"
                onClick={onViewDetails}
              >
                <Eye className="w-4 h-4 mr-1.5" />
                View Details
              </Button>
              <Button
                size="sm"
                onClick={() => console.log("[v0] Adding to pipeline:", deal.id)}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add to Pipeline
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent"
                onClick={onPass}
              >
                <X className="w-4 h-4 mr-1.5" />
                Pass
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => console.log("[v0] Archive:", deal.id)}
              >
                <Archive className="w-4 h-4 mr-1.5" />
                Archive
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

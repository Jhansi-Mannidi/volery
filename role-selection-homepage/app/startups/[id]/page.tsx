"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Edit2,
  ExternalLink,
  FileText,
  Globe,
  Linkedin,
  MapPin,
  MoreHorizontal,
  Plus,
  Share2,
  Sparkles,
  Star,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { FundingTab } from "@/components/startup-profile/funding-tab"
import { TeamTab } from "@/components/startup-profile/team-tab"
import { DocumentsTab } from "@/components/startup-profile/documents-tab"
import { MatchesTab } from "@/components/startup-profile/matches-tab"
import { ActivityTab } from "@/components/startup-profile/activity-tab"
import { NotesTab } from "@/components/startup-profile/notes-tab"
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
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Mock data for demo
const startupData = {
  id: "1",
  name: "TechCorp AI",
  tagline: "AI-powered financial document analysis for enterprises",
  verified: true,
  founded: "March 2023",
  location: "Mumbai, Maharashtra, India",
  employees: 15,
  stage: "Seed",
  website: "techcorp.ai",
  linkedin: "/company/techcorp",
  legalName: "TechCorp AI Pvt Ltd",
  entityType: "Private Limited",
  tags: ["Fintech", "B2B", "AI/ML"],
  profileCompletion: 75,
  profileCompletionHint: "Add financials to improve matching",
  description: `TechCorp AI is revolutionizing how financial institutions process and analyze documents. Our AI-powered platform reduces document processing time by 90% while improving accuracy to 99.5%.

**The Problem:** Financial services firms spend 40% of their operational costs on document processing, with error rates as high as 10% using traditional methods.

**Our Solution:** We've built a proprietary AI engine that combines computer vision, NLP, and deep learning to automatically extract, validate, and process financial documents including contracts, statements, and regulatory filings.`,
  metrics: {
    mrr: { value: 52000, change: 15 },
    arr: { value: 624000 },
    customers: { value: 45, change: 8 },
    growthRate: { value: 15 },
    burnRate: { value: 80000 },
    runway: { value: 14 },
    lastUpdated: "Jan 15, 2026",
  },
  businessModel: {
    type: "B2B SaaS",
    revenueStreams: ["Subscription", "Usage-based"],
    pricing: "$500-$5,000/month per customer",
    targetCustomer: "Mid-market financial services",
  },
  market: {
    tam: "$5B",
    competitors: [
      { name: "DocuAI", url: "#" },
      { name: "FinanceFlow", url: "#" },
      { name: "DataExtract Pro", url: "#" },
    ],
    advantages: [
      "Proprietary ML models trained on 10M+ financial documents",
      "99.5% accuracy vs 85% industry average",
      "SOC 2 Type II and ISO 27001 certified",
      "Real-time processing (< 2 seconds per document)",
    ],
  },
  thesis: {
    rating: 4,
    summary:
      "Strong technical team with deep domain expertise. Product-market fit validated with early enterprise customers. Unit economics are healthy with 85% gross margins.",
    pros: [
      "Experienced founding team from Goldman and Google",
      "Clear path to $1M ARR within 12 months",
      "Enterprise customers with strong retention (120% NRR)",
    ],
    cons: [
      "Competitive market with well-funded incumbents",
      "Long enterprise sales cycles (3-6 months)",
    ],
    risks: [
      "Key person dependency on CTO for core AI",
      "Regulatory changes in financial services",
    ],
  },
  pipeline: {
    currentStage: "Due Diligence",
    stageColor: "amber",
    daysInStage: 5,
    totalDaysInPipeline: 23,
    assignee: { name: "Priya Sharma", initials: "PS" },
    history: [
      { stage: "Intake", date: "Jan 1", days: 2 },
      { stage: "Screening", date: "Jan 3", days: 8 },
      { stage: "Due Diligence", date: "Jan 11", days: 5, current: true },
    ],
  },
  documents: [
    { name: "Pitch Deck v3.pdf", date: "Jan 12, 2026", type: "pitch" },
    { name: "Financial Model.xlsx", date: "Jan 10, 2026", type: "financial" },
    { name: "Cap Table.xlsx", date: "Jan 8, 2026", type: "legal" },
  ],
}

const stageColors: Record<string, { bg: string; text: string; border: string }> = {
  intake: { bg: "bg-muted/50", text: "text-muted-foreground", border: "border-muted-foreground/30" },
  screening: { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-600 dark:text-blue-400", border: "border-blue-300 dark:border-blue-800" },
  "due-diligence": { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-600 dark:text-amber-400", border: "border-amber-300 dark:border-amber-800" },
  decision: { bg: "bg-purple-50 dark:bg-purple-950/30", text: "text-purple-600 dark:text-purple-400", border: "border-purple-300 dark:border-purple-800" },
  "term-sheet": { bg: "bg-teal-50 dark:bg-teal-950/30", text: "text-teal-600 dark:text-teal-400", border: "border-teal-300 dark:border-teal-800" },
  "closed-won": { bg: "bg-green-50 dark:bg-green-950/30", text: "text-green-600 dark:text-green-400", border: "border-green-300 dark:border-green-800" },
  "closed-lost": { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-600 dark:text-red-400", border: "border-red-300 dark:border-red-800" },
}

type EditSection = "about" | "business" | "market" | "quickfacts" | "thesis" | null

export default function StartupProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [editSection, setEditSection] = useState<EditSection>(null)
  const [archiveModalOpen, setArchiveModalOpen] = useState(false)
  const [pipelineStage, setPipelineStage] = useState(startupData.pipeline.currentStage)

  const currentStageColors = stageColors["due-diligence"]

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader title="Startup Profile" />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 overflow-auto">
          {/* Page Header */}
          <div className="border-b bg-card">
            <div className="px-4 md:px-6 py-4">
              {/* Back Button */}
              <Link
                href="/pipeline"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Pipeline
              </Link>

              {/* Company Header */}
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                {/* Logo */}
                <div className="relative group">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border flex items-center justify-center">
                    <Building2 className="w-10 h-10 text-primary" />
                  </div>
                  <button
                    type="button"
                    className="absolute inset-0 flex items-center justify-center bg-foreground/80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => toast({ title: "Upload logo", description: "Select an image to upload." })}
                  >
                    <Upload className="w-5 h-5 text-background" />
                  </button>
                </div>

                {/* Company Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-semibold text-foreground">
                      {startupData.name}
                    </h1>
                    {startupData.verified && (
                      <CheckCircle2 className="w-5 h-5 text-primary fill-primary/20" />
                    )}
                  </div>
                  <p className="text-muted-foreground mb-2">{startupData.tagline}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Founded {startupData.founded}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {startupData.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {startupData.employees} employees
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={cn("font-medium", currentStageColors.bg, currentStageColors.text)}>
                      {startupData.stage}
                    </Badge>
                    {startupData.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => setEditSection("about")}>
                    <Edit2 className="w-4 h-4 mr-1.5" />
                    Edit Profile
                  </Button>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => router.push("/matching")}>
                    <Sparkles className="w-4 h-4 mr-1.5" />
                    Find Matches
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" onClick={() => toast({ title: "Share", description: "Share link copied to clipboard." })}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="z-[100]">
                      <DropdownMenuItem onClick={() => toast({ title: "Export Profile", description: "Profile export started." })}>Export Profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast({ title: "Generate Report", description: "Report generation started." })}>Generate Report</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => setArchiveModalOpen(true)}>Archive Startup</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Profile Completion */}
              <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    {startupData.profileCompletion}% complete
                  </span>
                  <span className="text-xs text-amber-600 dark:text-amber-400">
                    {startupData.profileCompletionHint}
                  </span>
                </div>
                <Progress value={startupData.profileCompletion} className="h-1.5 bg-amber-200 dark:bg-amber-900 [&>div]:bg-amber-500" />
              </div>
            </div>

            {/* Tab Navigation - pill style: light grey container, white pill for active */}
            <div className="px-4 md:px-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="h-auto w-full justify-start rounded-lg bg-muted/80 p-1.5 border border-border/50 shadow-sm overflow-x-auto">
                  {["Overview", "Funding", "Team", "Documents", "Matches", "Activity", "Notes"].map(
                    (tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab.toLowerCase()}
                        className={cn(
                          "rounded-md px-4 py-2 text-sm font-medium transition-all",
                          "text-muted-foreground bg-transparent hover:text-foreground data-[state=inactive]:hover:bg-muted",
                          "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                        )}
                      >
                        {tab}
                      </TabsTrigger>
                    )
                  )}
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 md:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Left Column (60%) */}
                  <div className="lg:col-span-3 space-y-6">
                    {/* About Section */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-base font-semibold">About</CardTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div
                          className={cn(
                            "prose prose-sm dark:prose-invert max-w-none",
                            !showFullDescription && "line-clamp-6"
                          )}
                        >
                          {startupData.description.split("\n\n").map((paragraph, i) => (
                            <p key={i} className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                        <Button
                          variant="link"
                          className="px-0 h-auto text-primary"
                          onClick={() => setShowFullDescription(!showFullDescription)}
                        >
                          {showFullDescription ? "Show less" : "Read more"}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Key Metrics */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-base font-semibold">Key Metrics</CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Last updated: {startupData.metrics.lastUpdated}
                          </span>
                          <Button variant="outline" size="sm" onClick={() => toast({ title: "Request Update", description: "Update request sent to startup." })}>
                            Request Update
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <MetricCard
                            label="MRR"
                            value={`$${(startupData.metrics.mrr.value / 1000).toFixed(0)}K`}
                            change={`+${startupData.metrics.mrr.change}% MoM`}
                            positive
                          />
                          <MetricCard
                            label="ARR"
                            value={`$${(startupData.metrics.arr.value / 1000).toFixed(0)}K`}
                          />
                          <MetricCard
                            label="Customers"
                            value={startupData.metrics.customers.value.toString()}
                            change={`+${startupData.metrics.customers.change} this month`}
                            positive
                          />
                          <MetricCard
                            label="Growth Rate"
                            value={`${startupData.metrics.growthRate.value}%`}
                            subtext="MoM"
                          />
                          <MetricCard
                            label="Burn Rate"
                            value={`$${startupData.metrics.burnRate.value / 1000}K`}
                            subtext="/month"
                          />
                          <MetricCard
                            label="Runway"
                            value={`${startupData.metrics.runway.value}`}
                            subtext="months"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Business Model */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-base font-semibold">Business Model</CardTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditSection("business")}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Model Type</p>
                            <p className="text-sm font-medium">{startupData.businessModel.type}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Revenue Streams</p>
                            <p className="text-sm font-medium">
                              {startupData.businessModel.revenueStreams.join(", ")}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Pricing</p>
                            <p className="text-sm font-medium">{startupData.businessModel.pricing}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Target Customer</p>
                            <p className="text-sm font-medium">{startupData.businessModel.targetCustomer}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Market & Competition */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-base font-semibold">Market & Competition</CardTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditSection("market")}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Target Market Size (TAM)</p>
                          <p className="text-xl font-semibold text-foreground">{startupData.market.tam}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Key Competitors</p>
                          <div className="flex flex-wrap gap-2">
                            {startupData.market.competitors.map((competitor) => (
                              <a
                                key={competitor.name}
                                href={competitor.url}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-sm hover:bg-muted/80 transition-colors"
                              >
                                {competitor.name}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Competitive Advantages</p>
                          <ul className="space-y-1.5">
                            {startupData.market.advantages.map((advantage, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                <span>{advantage}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column (40%) */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Quick Facts */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-base font-semibold">Quick Facts</CardTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditSection("quickfacts")}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <QuickFactRow
                          icon={Globe}
                          label="Website"
                          value={startupData.website}
                          isLink
                        />
                        <QuickFactRow
                          icon={Linkedin}
                          label="LinkedIn"
                          value={startupData.linkedin}
                          isLink
                        />
                        <QuickFactRow icon={Calendar} label="Founded" value={startupData.founded} />
                        <QuickFactRow icon={Building2} label="Legal Name" value={startupData.legalName} />
                        <QuickFactRow icon={FileText} label="Entity Type" value={startupData.entityType} />
                        <QuickFactRow icon={MapPin} label="Location" value={startupData.location} />
                      </CardContent>
                    </Card>

                    {/* Investment Thesis */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-base font-semibold">Investment Thesis</CardTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditSection("thesis")}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Internal Rating:</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  "w-4 h-4",
                                  star <= startupData.thesis.rating
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-muted-foreground/30"
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({startupData.thesis.rating}/5)
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{startupData.thesis.summary}</p>
                        <div>
                          <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1.5">
                            Pros
                          </p>
                          <ul className="space-y-1">
                            {startupData.thesis.pros.map((pro, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <Plus className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1.5">
                            Cons
                          </p>
                          <ul className="space-y-1">
                            {startupData.thesis.cons.map((con, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="w-3.5 h-0.5 bg-red-500 shrink-0 mt-2" />
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1.5">
                            Key Risks
                          </p>
                          <ul className="space-y-1">
                            {startupData.thesis.risks.map((risk, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0 mt-1.5" />
                                <span>{risk}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Pipeline Status */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Pipeline Status</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Current Stage</p>
                            <Badge
                              className={cn(
                                "font-medium text-sm",
                                currentStageColors.bg,
                                currentStageColors.text
                              )}
                            >
                              {pipelineStage}
                            </Badge>
                          </div>
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                Move Stage
                                <ChevronDown className="w-4 h-4 ml-1" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="z-[100]">
                              <DropdownMenuItem onClick={() => { setPipelineStage("Decision"); toast({ title: "Stage updated", description: "Moved to Decision." }); }}>Decision</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setPipelineStage("Term Sheet"); toast({ title: "Stage updated", description: "Moved to Term Sheet." }); }}>Term Sheet</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-green-600" onClick={() => { setPipelineStage("Closed Won"); toast({ title: "Stage updated", description: "Moved to Closed Won." }); }}>Closed Won</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => { setPipelineStage("Closed Lost"); toast({ title: "Stage updated", description: "Moved to Closed Lost." }); }}>Closed Lost</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Days in Stage</p>
                            <p className="text-lg font-semibold">
                              {startupData.pipeline.daysInStage} days
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Total in Pipeline</p>
                            <p className="text-lg font-semibold">
                              {startupData.pipeline.totalDaysInPipeline} days
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Stage History</p>
                          <div className="relative">
                            {startupData.pipeline.history.map((item, i) => (
                              <div key={i} className="flex items-center gap-3 pb-3 last:pb-0">
                                <div
                                  className={cn(
                                    "w-2 h-2 rounded-full shrink-0",
                                    item.current ? "bg-primary" : "bg-muted-foreground/30"
                                  )}
                                />
                                <div className="flex-1 flex items-center justify-between">
                                  <span
                                    className={cn(
                                      "text-sm",
                                      item.current ? "font-medium" : "text-muted-foreground"
                                    )}
                                  >
                                    {item.stage}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {item.date} · {item.days}d
                                  </span>
                                </div>
                              </div>
                            ))}
                            <div className="absolute left-[3px] top-2 bottom-2 w-0.5 bg-border -z-10" />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t">
                          <p className="text-xs text-muted-foreground">Assigned to:</p>
                          <Avatar className="w-5 h-5">
                            <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
                              {startupData.pipeline.assignee.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">@{startupData.pipeline.assignee.name.split(" ")[0]}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Related Documents */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-base font-semibold">Related Documents</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {startupData.documents.map((doc, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                          >
                            <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">{doc.date}</p>
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="link"
                          className="w-full justify-center text-primary"
                          onClick={() => setActiveTab("documents")}
                        >
                          View All Documents
                          <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Funding Tab */}
              <TabsContent value="funding" className="mt-0">
                <FundingTab />
              </TabsContent>

              {/* Team Tab */}
              <TabsContent value="team" className="mt-0">
                <TeamTab />
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="mt-0">
                <DocumentsTab />
              </TabsContent>

              {/* Matches Tab */}
              <TabsContent value="matches" className="mt-0">
                <MatchesTab />
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="mt-0">
                <ActivityTab />
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="mt-0">
                <NotesTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <Toaster />

      {/* Edit Section Modal */}
      <Dialog open={!!editSection} onOpenChange={(open) => { if (!open) setEditSection(null); }}>
        <DialogContent className="max-w-lg" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              {editSection === "about" && "Edit About"}
              {editSection === "business" && "Edit Business Model"}
              {editSection === "market" && "Edit Market & Competition"}
              {editSection === "quickfacts" && "Edit Quick Facts"}
              {editSection === "thesis" && "Edit Investment Thesis"}
            </DialogTitle>
            <DialogDescription>
              Update the content for this section. Changes will be saved to the profile.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Content</Label>
            <Textarea
              placeholder={editSection === "about" ? "Company description..." : "Enter details..."}
              rows={6}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSection(null)}>Cancel</Button>
            <Button onClick={() => { setEditSection(null); toast({ title: "Saved", description: "Section updated successfully." }); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Startup Confirmation */}
      <Dialog open={archiveModalOpen} onOpenChange={setArchiveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Startup?</DialogTitle>
            <DialogDescription>
              This will move {startupData.name} to the archive. You can restore it later from the pipeline settings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArchiveModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { setArchiveModalOpen(false); toast({ title: "Archived", description: `${startupData.name} has been archived.` }); }}>Archive</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function MetricCard({
  label,
  value,
  change,
  positive,
  subtext,
}: {
  label: string
  value: string
  change?: string
  positive?: boolean
  subtext?: string
}) {
  return (
    <div className="p-3 rounded-lg bg-muted/50 border">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex items-baseline gap-1.5">
        <p className="text-xl font-semibold text-foreground">{value}</p>
        {subtext && <span className="text-xs text-muted-foreground">{subtext}</span>}
      </div>
      {change && (
        <p
          className={cn(
            "text-xs mt-1 flex items-center gap-1",
            positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          )}
        >
          {positive && <TrendingUp className="w-3 h-3" />}
          {change}
        </p>
      )}
    </div>
  )
}

function QuickFactRow({
  icon: Icon,
  label,
  value,
  isLink,
}: {
  icon: React.ElementType
  label: string
  value: string
  isLink?: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        {isLink ? (
          <a
            href={value.startsWith("/") ? `https://linkedin.com${value}` : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline truncate block"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm truncate">{value}</p>
        )}
      </div>
    </div>
  )
}

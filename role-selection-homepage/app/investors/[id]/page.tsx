"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  Building2,
  Calendar,
  ChevronDown,
  Clock,
  DollarSign,
  Edit2,
  ExternalLink,
  Eye,
  FileText,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Plus,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/toaster"
import { AddEditInvestorModal } from "@/components/investor/add-edit-investor-modal"

// Mock data for demo
const investorData = {
  id: "1",
  name: "Sequoia Capital",
  type: "Venture Capital",
  location: "Menlo Park, CA, USA",
  website: "sequoiacap.com",
  linkedin: "/company/sequoia-capital",
  relationshipStrength: "Champion",
  relationshipOwner: { name: "Priya Sharma", initials: "PS" },
  founded: "1972",
  aum: "$85B",
  fundSize: "$2.85B",
  about: `Sequoia Capital is a legendary venture capital firm that has been at the forefront of technology investing for over 50 years. We partner with daring founders who want to build legendary companies.

Our investment philosophy centers on backing founders with original ideas, relentless determination, and the ability to inspire teams to achieve the extraordinary. We've had the privilege of partnering with Apple, Google, Oracle, PayPal, Stripe, YouTube, Instagram, WhatsApp, and many more.

We believe in long-term partnerships and provide more than capital - we offer operational expertise, network access, and strategic guidance to help our portfolio companies scale globally.`,
  investmentSnapshot: {
    checkSize: "$5M - $50M",
    stages: ["Series A", "Series B"],
    sectors: ["Fintech", "SaaS", "Enterprise Software", "AI/ML"],
    geographies: ["US", "India", "SEA"],
    businessModels: ["B2B", "B2B2C"],
    excluded: ["Hardware", "Biotech"],
  },
  quickStats: {
    totalInvestments: 150,
    recentInvestments: 12,
    avgCheckSize: "$15M",
  },
  recentActivity: [
    { type: "email", title: "Re: TechCorp AI intro", date: "Jan 15, 2026" },
    { type: "meeting", title: "Portfolio review call", date: "Jan 10, 2026" },
    { type: "document", title: "FinApp Pitch Deck", duration: "4 min", date: "Jan 8, 2026" },
  ],
  matchedStartups: [
    { name: "TechCorp AI", score: 92, sector: "AI/ML" },
    { name: "FinApp Inc", score: 87, sector: "Fintech" },
    { name: "CloudAI", score: 84, sector: "SaaS" },
    { name: "DataStream", score: 81, sector: "Enterprise" },
    { name: "SecureNet", score: 78, sector: "Security" },
  ],
  teamMembers: [
    { name: "John Smith", role: "Partner", initials: "JS", primary: true },
    { name: "Sarah Chen", role: "Principal", initials: "SC" },
    { name: "Mike Johnson", role: "Associate", initials: "MJ" },
  ],
  internalNotes: "Best approached through portfolio intros. Very responsive to warm introductions from existing portfolio founders. Prefers detailed financial models upfront.",
  contacts: [
    {
      id: "1",
      name: "John Smith",
      role: "Partner",
      email: "john@sequoia.com",
      phone: "+1-555-0123",
      linkedin: "johnsmith",
      notes: "Focuses on fintech, very responsive",
      lastContacted: "2 weeks ago",
      primary: true,
      initials: "JS",
    },
    {
      id: "2",
      name: "Sarah Chen",
      role: "Principal",
      email: "sarah@sequoia.com",
      phone: "+1-555-0124",
      linkedin: "sarahchen",
      notes: "AI/ML specialist, prefers email",
      lastContacted: "1 month ago",
      primary: false,
      initials: "SC",
    },
    {
      id: "3",
      name: "Mike Johnson",
      role: "Associate",
      email: "mike@sequoia.com",
      phone: "+1-555-0125",
      linkedin: "mikejohnson",
      notes: "Handles initial screening",
      lastContacted: "3 weeks ago",
      primary: false,
      initials: "MJ",
    },
  ],
  portfolio: [
    { name: "Stripe", sector: "Fintech", stage: "Series A", year: 2012, status: "Active", logo: "S" },
    { name: "Airbnb", sector: "Marketplace", stage: "Seed", year: 2009, status: "Exited", logo: "A" },
    { name: "DoorDash", sector: "Logistics", stage: "Series A", year: 2014, status: "Exited", logo: "D" },
    { name: "Notion", sector: "SaaS", stage: "Series B", year: 2019, status: "Active", logo: "N" },
    { name: "Figma", sector: "Design", stage: "Series A", year: 2015, status: "Acquired", logo: "F" },
    { name: "Plaid", sector: "Fintech", stage: "Series A", year: 2015, status: "Active", logo: "P" },
  ],
  interactions: [
    {
      id: "1",
      type: "email",
      title: "Re: TechCorp AI intro",
      description: "Shared pitch deck and intro materials. John expressed strong interest.",
      date: "Jan 15, 2026",
      user: { name: "Priya Sharma", initials: "PS" },
    },
    {
      id: "2",
      type: "meeting",
      title: "Portfolio review call",
      description: "Discussed Q4 performance and upcoming deal flow. Mentioned interest in AI/ML startups.",
      date: "Jan 10, 2026",
      user: { name: "Priya Sharma", initials: "PS" },
    },
    {
      id: "3",
      type: "document",
      title: "FinApp Pitch Deck viewed",
      description: "John viewed the deck for 4 minutes, spent most time on financials slide.",
      date: "Jan 8, 2026",
      user: { name: "System", initials: "SY" },
    },
    {
      id: "4",
      type: "email",
      title: "Holiday greetings",
      description: "Sent holiday wishes and year-end update on portfolio companies.",
      date: "Dec 22, 2025",
      user: { name: "Priya Sharma", initials: "PS" },
    },
    {
      id: "5",
      type: "meeting",
      title: "In-person meeting at TechCrunch",
      description: "Met at the conference. Discussed trends in enterprise software.",
      date: "Dec 5, 2025",
      user: { name: "Rahul Verma", initials: "RV" },
    },
  ],
  documents: [] as { name: string; date: string; type: string }[],
  investmentCriteria: {
    philosophy: `We look for founders who are missionaries, not mercenaries. Our best investments have been in companies where the founders had a deep personal connection to the problem they were solving.

Key attributes we seek:
- Technical depth and product intuition
- Ability to attract and retain top talent
- Clear vision for a large market opportunity
- Evidence of early traction or product-market fit signals`,
    decisionProcess: "Initial screening (1-2 weeks) → Partner meeting → Due diligence (2-4 weeks) → IC approval",
    typicalTerms: "Board seat, pro-rata rights, information rights",
    coInvestors: ["Accel", "a16z", "Benchmark", "Greylock"],
    antiPortfolio: "Companies we passed on that became successful - we track these to improve our judgment",
  },
}

const relationshipColors: Record<string, { bg: string; text: string }> = {
  Champion: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400" },
  Active: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400" },
  Warm: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400" },
  New: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400" },
  Dormant: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400" },
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400" },
  Exited: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400" },
  Acquired: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400" },
}

export default function InvestorProfilePage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const investorId = (params?.id as string) || investorData.id

  const [activeTab, setActiveTab] = useState("overview")
  const [showFullAbout, setShowFullAbout] = useState(false)
  const [editingNotes, setEditingNotes] = useState(false)
  const [notes, setNotes] = useState(investorData.internalNotes)
  const [portfolioFilter, setPortfolioFilter] = useState("all")
  const [relationshipStrength, setRelationshipStrength] = useState(investorData.relationshipStrength)

  const [editInvestorModalOpen, setEditInvestorModalOpen] = useState(false)
  const [editAboutOpen, setEditAboutOpen] = useState(false)
  const [editSnapshotOpen, setEditSnapshotOpen] = useState(false)
  const [editCriteriaOpen, setEditCriteriaOpen] = useState(false)
  const [editContactOpen, setEditContactOpen] = useState(false)
  const [editingContactIndex, setEditingContactIndex] = useState<number | null>(null)
  const [uploadDocumentOpen, setUploadDocumentOpen] = useState(false)
  const [logInteractionOpen, setLogInteractionOpen] = useState(false)
  const [logInteractionContactName, setLogInteractionContactName] = useState<string | null>(null)
  const [addContactOpen, setAddContactOpen] = useState(false)

  const [aboutForm, setAboutForm] = useState({
    founded: investorData.founded,
    aum: investorData.aum,
    fundSize: investorData.fundSize,
    about: investorData.about,
  })
  const [snapshotForm, setSnapshotForm] = useState({
    checkSize: investorData.investmentSnapshot.checkSize,
    stages: [...investorData.investmentSnapshot.stages],
    sectors: [...investorData.investmentSnapshot.sectors],
    geographies: investorData.investmentSnapshot.geographies.join(", "),
    businessModels: investorData.investmentSnapshot.businessModels.join(", "),
    excluded: investorData.investmentSnapshot.excluded.join(", "),
  })
  const [criteriaPhilosophy, setCriteriaPhilosophy] = useState(investorData.investmentCriteria.philosophy)
  const [contactsList, setContactsList] = useState([...investorData.contacts])
  const [contactForm, setContactForm] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    linkedin: "",
    notes: "",
  })
  const [uploadDocForm, setUploadDocForm] = useState({ documentType: "term-sheet", notes: "" })
  const [logInteractionForm, setLogInteractionForm] = useState({
    type: "email",
    title: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
  })

  const currentRelationshipColors = relationshipColors[relationshipStrength] || relationshipColors.New

  const filteredPortfolio = portfolioFilter === "all" 
    ? investorData.portfolio 
    : investorData.portfolio.filter(p => p.status === portfolioFilter)

  const getContactByMemberName = (name: string) =>
    contactsList.find((c) => c.name === name)

  const relationshipToModal = (s: string) => {
    const map: Record<string, string> = { Champion: "champion", Active: "warm", Warm: "warm", New: "new", Dormant: "new" }
    return map[s] ?? "warm"
  }

  const mappedInvestorForModal = {
    id: investorData.id,
    name: investorData.name,
    type: investorData.type,
    website: investorData.website,
    linkedin: investorData.linkedin,
    crunchbase: "",
    city: investorData.location.split(",")[0]?.trim() ?? "",
    country: investorData.location.split(",").slice(1).join(",").trim() || "",
    address: "",
    description: aboutForm.about,
    yearFounded: aboutForm.founded,
    aum: aboutForm.aum,
    currentFundSize: aboutForm.fundSize,
    relationshipOwner: investorData.relationshipOwner.name,
    relationshipStrength: relationshipToModal(relationshipStrength),
    source: "",
    tags: [],
    checkSizeMin: 5000000,
    checkSizeMax: 50000000,
    currency: "USD",
    investmentStages: snapshotForm.stages,
    sectors: snapshotForm.sectors,
    geographies: snapshotForm.geographies.split(",").map((s) => s.trim()).filter(Boolean),
    businessModels: snapshotForm.businessModels.split(",").map((s) => s.trim()).filter(Boolean),
    exclusions: snapshotForm.excluded,
    contacts: contactsList.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      role: c.role,
      linkedin: c.linkedin,
      isPrimary: c.primary,
      notes: c.notes ?? "",
    })),
    internalNotes: notes,
    thesisNotes: criteriaPhilosophy,
    meetingNotes: "",
    redFlags: "",
  }

  const openEditContact = (index: number) => {
    const c = contactsList[index]
    setContactForm({
      name: c.name,
      role: c.role,
      email: c.email,
      phone: c.phone,
      linkedin: c.linkedin,
      notes: c.notes ?? "",
    })
    setEditingContactIndex(index)
    setEditContactOpen(true)
  }

  const handleSaveContact = () => {
    if (editingContactIndex === null) return
    setContactsList((prev) => {
      const next = [...prev]
      next[editingContactIndex] = { ...next[editingContactIndex], ...contactForm }
      return next
    })
    setEditContactOpen(false)
    setEditingContactIndex(null)
    toast({ title: "Contact updated", description: `${contactForm.name} has been updated.` })
  }

  const handleAddContact = () => {
    const initials = contactForm.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    setContactsList((prev) => [
      ...prev,
      {
        id: String(prev.length + 1),
        name: contactForm.name,
        role: contactForm.role,
        email: contactForm.email,
        phone: contactForm.phone,
        linkedin: contactForm.linkedin,
        notes: contactForm.notes ?? "",
        lastContacted: "Just now",
        primary: false,
        initials: initials || "??",
      },
    ])
    setAddContactOpen(false)
    setContactForm({ name: "", role: "", email: "", phone: "", linkedin: "", notes: "" })
    toast({ title: "Contact added", description: `${contactForm.name} has been added.` })
  }

  const handleSaveNotes = () => {
    setEditingNotes(false)
    toast({ title: "Notes saved", description: "Internal notes have been updated." })
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader title="Investor Profile" />

      <div className="flex flex-1 overflow-hidden min-h-0">
        <DashboardSidebar />

        <main className="flex-1 overflow-auto min-w-0">
          {/* Page Header */}
          <div className="border-b bg-card">
            <div className="px-4 md:px-6 py-4">
              {/* Back Button */}
              <Link
                href="/investors"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Investors
              </Link>

              {/* Investor Header */}
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                {/* Logo */}
                <div className="relative group">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border flex items-center justify-center">
                    <Building2 className="w-10 h-10 text-primary" />
                  </div>
                  <button
                    type="button"
                    className="absolute inset-0 flex items-center justify-center bg-foreground/80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => toast({ title: "Upload logo", description: "Select an image to upload for this investor." })}
                  >
                    <Upload className="w-5 h-5 text-background" />
                  </button>
                </div>

                {/* Investor Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-semibold text-foreground">
                      {investorData.name}
                    </h1>
                    <Badge variant="outline" className="font-medium">
                      {investorData.type}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {investorData.location}
                    </span>
                    <a
                      href={`https://${investorData.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      {investorData.website}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium transition-colors",
                          currentRelationshipColors.bg,
                          currentRelationshipColors.text
                        )}>
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {relationshipStrength}
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {Object.keys(relationshipColors).map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => {
                              setRelationshipStrength(status)
                              toast({ title: "Relationship updated", description: `Set to ${status}.` })
                            }}
                          >
                            <Star className="w-4 h-4 mr-2" />
                            {status}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <span className="text-sm text-muted-foreground">
                      Owner: <span className="text-foreground">@{investorData.relationshipOwner.name}</span>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditInvestorModalOpen(true)}
                  >
                    <Edit2 className="w-4 h-4 mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => {
                      router.push(`/matching?investor=${investorId}`)
                      toast({ title: "Find matches", description: "Opening match results for this investor." })
                    }}
                  >
                    <Sparkles className="w-4 h-4 mr-1.5" />
                    Find Matches
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setLogInteractionContactName(null)
                      setLogInteractionForm({
                        type: "email",
                        title: "",
                        description: "",
                        date: new Date().toISOString().slice(0, 10),
                      })
                      setLogInteractionOpen(true)
                    }}
                  >
                    <MessageSquare className="w-4 h-4 mr-1.5" />
                    Log Interaction
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => toast({ title: "Export profile", description: "PDF export will download shortly." })}
                      >
                        Export Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => toast({ title: "Generate report", description: "Report generation started." })}
                      >
                        Generate Report
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          toast({ title: "Investor archived", description: `${investorData.name} has been archived.`, variant: "destructive" })
                          router.push("/investors")
                        }}
                      >
                        Archive Investor
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Tab Navigation - pill style: light grey container, white pill for active */}
            <div className="px-4 md:px-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="h-auto w-full justify-start rounded-lg bg-muted/80 p-1.5 border border-border/50 shadow-sm overflow-x-auto">
                  {["Overview", "Investment Criteria", "Portfolio", "Contacts", "Interactions", "Documents"].map(
                    (tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab.toLowerCase().replace(" ", "-")}
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
              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Left Column (60%) */}
                  <div className="lg:col-span-3 space-y-6">
                    {/* About Card */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-base font-semibold">About</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setEditAboutOpen(true)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 mb-3">
                          <div className="flex items-center gap-6 text-sm">
                            <div>
                              <span className="text-muted-foreground">Founded: </span>
                              <span className="font-medium">{aboutForm.founded}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">AUM: </span>
                              <span className="font-medium">{aboutForm.aum}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Fund Size: </span>
                              <span className="font-medium">{aboutForm.fundSize}</span>
                            </div>
                          </div>
                        </div>
                        <div
                          className={cn(
                            "prose prose-sm dark:prose-invert max-w-none",
                            !showFullAbout && "line-clamp-4"
                          )}
                        >
                          {aboutForm.about.split("\n\n").map((paragraph, i) => (
                            <p key={i} className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                        <Button
                          variant="link"
                          className="px-0 h-auto text-primary"
                          onClick={() => setShowFullAbout(!showFullAbout)}
                        >
                          {showFullAbout ? "Show less" : "Read more"}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Investment Snapshot Card */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-base font-semibold">Investment Snapshot</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setEditSnapshotOpen(true)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Check Size</p>
                            <p className="text-sm font-medium">{snapshotForm.checkSize}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Preferred Stages</p>
                            <div className="flex flex-wrap gap-1">
                              {snapshotForm.stages.map((stage) => (
                                <Badge key={stage} variant="secondary" className="text-xs">
                                  {stage}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Sectors</p>
                          <div className="flex flex-wrap gap-1">
                            {snapshotForm.sectors.map((sector) => (
                              <Badge key={sector} variant="outline" className="text-xs">
                                {sector}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Geographies</p>
                            <p className="text-sm">{snapshotForm.geographies}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Business Models</p>
                            <p className="text-sm">{snapshotForm.businessModels}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Excluded</p>
                          <div className="flex flex-wrap gap-1">
                            {snapshotForm.excluded.split(",").map((s) => s.trim()).filter(Boolean).map((item) => (
                              <Badge key={item} variant="secondary" className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Activity Card */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary"
                          onClick={() => setActiveTab("interactions")}
                        >
                          View All
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {investorData.recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                activity.type === "email" && "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
                                activity.type === "meeting" && "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
                                activity.type === "document" && "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                              )}>
                                {activity.type === "email" && <Mail className="w-4 h-4" />}
                                {activity.type === "meeting" && <Users className="w-4 h-4" />}
                                {activity.type === "document" && <Eye className="w-4 h-4" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {activity.date}
                                  {activity.duration && ` · ${activity.duration}`}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column (40%) */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Quick Stats Card */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Quick Stats</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 rounded-lg bg-muted/50">
                            <p className="text-2xl font-semibold text-foreground">{investorData.quickStats.totalInvestments}+</p>
                            <p className="text-xs text-muted-foreground">Total investments</p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50">
                            <p className="text-2xl font-semibold text-foreground">{investorData.quickStats.recentInvestments}</p>
                            <p className="text-xs text-muted-foreground">Recent (12 mo)</p>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-2xl font-semibold text-foreground">{investorData.quickStats.avgCheckSize}</p>
                          <p className="text-xs text-muted-foreground">Avg check size</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Sector breakdown</p>
                          <div className="space-y-2">
                            {[
                              { name: "Fintech", percentage: 35 },
                              { name: "SaaS", percentage: 30 },
                              { name: "AI/ML", percentage: 20 },
                              { name: "Other", percentage: 15 },
                            ].map((sector) => (
                              <div key={sector.name} className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground w-16">{sector.name}</span>
                                <Progress value={sector.percentage} className="h-2 flex-1" />
                                <span className="text-xs font-medium w-8">{sector.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Matched Startups Card */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-base font-semibold">Matched Startups</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {investorData.matchedStartups.length} matches
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {investorData.matchedStartups.slice(0, 4).map((startup, index) => (
                            <Link
                              key={startup.name}
                              href="/startups/1"
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <Building2 className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{startup.name}</p>
                                  <p className="text-xs text-muted-foreground">{startup.sector}</p>
                                </div>
                              </div>
                              <Badge 
                                variant="secondary" 
                                className={cn(
                                  "text-xs",
                                  startup.score >= 90 && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                                  startup.score >= 80 && startup.score < 90 && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                                  startup.score < 80 && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                )}
                              >
                                {startup.score}%
                              </Badge>
                            </Link>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          className="w-full mt-3 bg-transparent"
                          size="sm"
                          onClick={() => {
                            router.push(`/matching?investor=${investorId}`)
                            toast({ title: "View all matches", description: "Opening full match results." })
                          }}
                        >
                          View All Matched Startups
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Team Members Card */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-base font-semibold">Team Members</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {investorData.teamMembers.map((member) => {
                            const contact = getContactByMemberName(member.name)
                            return (
                              <div key={member.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                      {member.initials}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium">{member.name}</p>
                                    <p className="text-xs text-muted-foreground">{member.role}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  {contact ? (
                                    <>
                                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                        <a href={`mailto:${contact.email}`} aria-label={`Email ${member.name}`}>
                                          <Mail className="w-3.5 h-3.5" />
                                        </a>
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                        <a href={`tel:${contact.phone}`} aria-label={`Call ${member.name}`}>
                                          <Phone className="w-3.5 h-3.5" />
                                        </a>
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => toast({ title: "Contact info", description: "No email on file for this team member." })}
                                      >
                                        <Mail className="w-3.5 h-3.5" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => toast({ title: "Contact info", description: "No phone on file for this team member." })}
                                      >
                                        <Phone className="w-3.5 h-3.5" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Internal Notes Card */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          Internal Notes
                          <Badge variant="outline" className="text-xs font-normal">Private</Badge>
                        </CardTitle>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => setEditingNotes(!editingNotes)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        {editingNotes ? (
                          <div className="space-y-2">
                            <Textarea
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              className="min-h-[100px] text-sm"
                            />
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => setEditingNotes(false)}>
                                Cancel
                              </Button>
                              <Button size="sm" onClick={handleSaveNotes}>
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            "{notes}"
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Investment Criteria Tab */}
              <TabsContent value="investment-criteria" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                      <CardTitle className="text-base font-semibold">Investment Philosophy</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditCriteriaOpen(true)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {criteriaPhilosophy.split("\n\n").map((paragraph, i) => (
                          <p key={i} className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Decision Process</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {investorData.investmentCriteria.decisionProcess}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Typical Terms</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {investorData.investmentCriteria.typicalTerms}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Preferred Co-Investors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {investorData.investmentCriteria.coInvestors.map((investor) => (
                            <Badge key={investor} variant="secondary">
                              {investor}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Portfolio Tab */}
              <TabsContent value="portfolio" className="mt-0">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-base font-semibold">Portfolio Companies</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                        {["all", "Active", "Exited", "Acquired"].map((filter) => (
                          <button
                            key={filter}
                            onClick={() => setPortfolioFilter(filter)}
                            className={cn(
                              "px-3 py-1 text-xs rounded-md transition-colors",
                              portfolioFilter === filter
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {filter === "all" ? "All" : filter}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredPortfolio.map((company) => (
                        <div
                          key={company.name}
                          className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-semibold">{company.logo}</span>
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{company.name}</p>
                                <p className="text-xs text-muted-foreground">{company.sector}</p>
                              </div>
                            </div>
                            <Badge 
                              className={cn(
                                "text-xs",
                                statusColors[company.status]?.bg,
                                statusColors[company.status]?.text
                              )}
                            >
                              {company.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{company.stage} · {company.year}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => router.push("/startups/1")}
                            >
                              Link to startup
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Contacts Tab */}
              <TabsContent value="contacts" className="mt-0">
                <div className="space-y-6">
                  {/* Primary Contact */}
                  {contactsList.filter(c => c.primary).map((contact) => (
                    <Card key={contact.id} className="border-2 border-primary/20">
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                          <Avatar className="w-16 h-16">
                            <AvatarFallback className="text-lg bg-primary/10 text-primary">
                              {contact.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold">{contact.name}</h3>
                              <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                <Star className="w-3 h-3 mr-1 fill-current" />
                                Primary
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-3">{contact.role}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3 text-sm">
                              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                                <Mail className="w-4 h-4" />
                                {contact.email}
                              </a>
                              <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                                <Phone className="w-4 h-4" />
                                {contact.phone}
                              </a>
                              <a href={`https://linkedin.com/in/${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                                <Linkedin className="w-4 h-4" />
                                LinkedIn
                              </a>
                            </div>
                            <p className="text-sm text-muted-foreground italic mb-2">"{contact.notes}"</p>
                            <p className="text-xs text-muted-foreground">Last contacted: {contact.lastContacted}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={`mailto:${contact.email}`}>
                                <Mail className="w-4 h-4 mr-1.5" />
                                Email
                              </a>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <a href={`tel:${contact.phone}`}>
                                <Phone className="w-4 h-4 mr-1.5" />
                                Call
                              </a>
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setLogInteractionContactName(contact.name)
                                setLogInteractionForm({
                                  type: "email",
                                  title: "",
                                  description: "",
                                  date: new Date().toISOString().slice(0, 10),
                                })
                                setLogInteractionOpen(true)
                              }}
                            >
                              <MessageSquare className="w-4 h-4 mr-1.5" />
                              Log Interaction
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Other Contacts */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                      <CardTitle className="text-base font-semibold">Other Contacts</CardTitle>
                      <Button
                        size="sm"
                        onClick={() => {
                          setContactForm({
                            name: "",
                            role: "",
                            email: "",
                            phone: "",
                            linkedin: "",
                            notes: "",
                          })
                          setEditingContactIndex(null)
                          setAddContactOpen(true)
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1.5" />
                        Add Contact
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {contactsList.filter(c => !c.primary).map((contact, index) => {
                          const actualIndex = contactsList.findIndex((c) => c.id === contact.id)
                          return (
                          <div key={contact.id} className="flex items-center justify-between p-4 rounded-lg border">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="text-sm bg-muted">
                                  {contact.initials}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{contact.name}</p>
                                <p className="text-sm text-muted-foreground">{contact.role}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-xs text-muted-foreground">Last: {contact.lastContacted}</span>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                  <a href={`mailto:${contact.email}`} aria-label={`Email ${contact.name}`}>
                                    <Mail className="w-4 h-4" />
                                  </a>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                  <a href={`tel:${contact.phone}`} aria-label={`Call ${contact.name}`}>
                                    <Phone className="w-4 h-4" />
                                  </a>
                                </Button>
                                <DropdownMenu modal={false}>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="z-[100]">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setLogInteractionContactName(contact.name)
                                        setLogInteractionForm({
                                          type: "email",
                                          title: "",
                                          description: "",
                                          date: new Date().toISOString().slice(0, 10),
                                        })
                                        setLogInteractionOpen(true)
                                      }}
                                    >
                                      Log Interaction
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => openEditContact(actualIndex)}>
                                      Edit Contact
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Interactions Tab */}
              <TabsContent value="interactions" className="mt-0">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-base font-semibold">Interaction History</CardTitle>
                    <Button
                      size="sm"
                      onClick={() => {
                        setLogInteractionContactName(null)
                        setLogInteractionForm({
                          type: "email",
                          title: "",
                          description: "",
                          date: new Date().toISOString().slice(0, 10),
                        })
                        setLogInteractionOpen(true)
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      Log Interaction
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                      
                      <div className="space-y-6">
                        {investorData.interactions.map((interaction) => (
                          <div key={interaction.id} className="relative flex gap-4 pl-10">
                            {/* Timeline dot */}
                            <div className={cn(
                              "absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2 border-background",
                              interaction.type === "email" && "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
                              interaction.type === "meeting" && "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
                              interaction.type === "document" && "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                            )}>
                              {interaction.type === "email" && <Mail className="w-4 h-4" />}
                              {interaction.type === "meeting" && <Users className="w-4 h-4" />}
                              {interaction.type === "document" && <Eye className="w-4 h-4" />}
                            </div>
                            
                            <div className="flex-1 pb-6">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium text-foreground">{interaction.title}</p>
                                  <p className="text-sm text-muted-foreground mt-1">{interaction.description}</p>
                                </div>
                                <div className="text-right shrink-0 ml-4">
                                  <p className="text-xs text-muted-foreground">{interaction.date}</p>
                                  <div className="flex items-center gap-1 mt-1 justify-end">
                                    <Avatar className="w-5 h-5">
                                      <AvatarFallback className="text-[10px] bg-muted">
                                        {interaction.user.initials}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs text-muted-foreground">{interaction.user.name}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="mt-0">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-base font-semibold">Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {investorData.documents.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                          <FileText className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-medium text-foreground mb-1">No documents yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Upload NDAs, term sheets, or other relevant documents
                        </p>
                        <Button
                          onClick={() => {
                            setUploadDocForm({ documentType: "term-sheet", notes: "" })
                            setUploadDocumentOpen(true)
                          }}
                        >
                          <Upload className="w-4 h-4 mr-1.5" />
                          Upload Document
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {investorData.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{doc.name}</p>
                                <p className="text-xs text-muted-foreground">{doc.date}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toast({ title: "View document", description: `Opening ${doc.name}.` })}
                            >
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Edit Investor (full) modal */}
      <AddEditInvestorModal
        open={editInvestorModalOpen}
        onOpenChange={setEditInvestorModalOpen}
        investor={mappedInvestorForModal}
        mode="edit"
      />

      {/* Edit About modal */}
      <Dialog open={editAboutOpen} onOpenChange={setEditAboutOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit About</DialogTitle>
            <DialogDescription>Update the investor overview and key facts.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="founded">Founded</Label>
                <Input
                  id="founded"
                  value={aboutForm.founded}
                  onChange={(e) => setAboutForm((prev) => ({ ...prev, founded: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aum">AUM</Label>
                <Input
                  id="aum"
                  value={aboutForm.aum}
                  onChange={(e) => setAboutForm((prev) => ({ ...prev, aum: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fundSize">Fund Size</Label>
                <Input
                  id="fundSize"
                  value={aboutForm.fundSize}
                  onChange={(e) => setAboutForm((prev) => ({ ...prev, fundSize: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                value={aboutForm.about}
                onChange={(e) => setAboutForm((prev) => ({ ...prev, about: e.target.value }))}
                className="min-h-[160px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditAboutOpen(false)}>Cancel</Button>
            <Button onClick={() => { setEditAboutOpen(false); toast({ title: "About updated", description: "Investor about section has been saved." }); }}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Investment Snapshot modal */}
      <Dialog open={editSnapshotOpen} onOpenChange={setEditSnapshotOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Investment Snapshot</DialogTitle>
            <DialogDescription>Update check size, stages, sectors, and criteria.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="checkSize">Check Size</Label>
              <Input
                id="checkSize"
                value={snapshotForm.checkSize}
                onChange={(e) => setSnapshotForm((prev) => ({ ...prev, checkSize: e.target.value }))}
                placeholder="e.g. $5M - $50M"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stages">Preferred Stages (comma-separated)</Label>
              <Input
                id="stages"
                value={snapshotForm.stages.join(", ")}
                onChange={(e) => setSnapshotForm((prev) => ({ ...prev, stages: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))}
                placeholder="Series A, Series B"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sectors">Sectors (comma-separated)</Label>
              <Input
                id="sectors"
                value={snapshotForm.sectors.join(", ")}
                onChange={(e) => setSnapshotForm((prev) => ({ ...prev, sectors: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))}
                placeholder="Fintech, SaaS, AI/ML"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="geographies">Geographies</Label>
              <Input
                id="geographies"
                value={snapshotForm.geographies}
                onChange={(e) => setSnapshotForm((prev) => ({ ...prev, geographies: e.target.value }))}
                placeholder="US, India, SEA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessModels">Business Models</Label>
              <Input
                id="businessModels"
                value={snapshotForm.businessModels}
                onChange={(e) => setSnapshotForm((prev) => ({ ...prev, businessModels: e.target.value }))}
                placeholder="B2B, B2B2C"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excluded">Excluded (comma-separated)</Label>
              <Input
                id="excluded"
                value={snapshotForm.excluded}
                onChange={(e) => setSnapshotForm((prev) => ({ ...prev, excluded: e.target.value }))}
                placeholder="Hardware, Biotech"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSnapshotOpen(false)}>Cancel</Button>
            <Button onClick={() => { setEditSnapshotOpen(false); toast({ title: "Snapshot updated", description: "Investment snapshot has been saved." }); }}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Investment Criteria (Philosophy) modal */}
      <Dialog open={editCriteriaOpen} onOpenChange={setEditCriteriaOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Investment Philosophy</DialogTitle>
            <DialogDescription>Update the investment philosophy and criteria.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="philosophy">Philosophy</Label>
            <Textarea
              id="philosophy"
              value={criteriaPhilosophy}
              onChange={(e) => setCriteriaPhilosophy(e.target.value)}
              className="min-h-[200px] mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCriteriaOpen(false)}>Cancel</Button>
            <Button onClick={() => { setEditCriteriaOpen(false); toast({ title: "Criteria updated", description: "Investment philosophy has been saved." }); }}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document modal */}
      <Dialog
        open={uploadDocumentOpen}
        onOpenChange={(open) => {
          setUploadDocumentOpen(open)
          if (!open) setUploadDocForm({ documentType: "term-sheet", notes: "" })
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload NDAs, term sheets, or other relevant documents for this investor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Document type</Label>
              <Select
                value={uploadDocForm.documentType}
                onValueChange={(v) => setUploadDocForm((prev) => ({ ...prev, documentType: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="term-sheet">Term Sheet</SelectItem>
                  <SelectItem value="nda">NDA</SelectItem>
                  <SelectItem value="pitch-deck">Pitch Deck</SelectItem>
                  <SelectItem value="financials">Financials</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>File</Label>
              <div className="relative flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6">
                <Upload className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, DOCX up to 10MB</p>
                </div>
                <Input type="file" className="absolute inset-0 cursor-pointer opacity-0" accept=".pdf,.doc,.docx" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="uploadNotes">Notes (optional)</Label>
              <Textarea
                id="uploadNotes"
                value={uploadDocForm.notes}
                onChange={(e) => setUploadDocForm((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Add a note about this document"
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDocumentOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setUploadDocumentOpen(false)
                toast({ title: "Document uploaded", description: "Your document has been uploaded successfully." })
              }}
            >
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Log Interaction modal */}
      <Dialog
        open={logInteractionOpen}
        onOpenChange={(open) => {
          setLogInteractionOpen(open)
          if (!open) setLogInteractionContactName(null)
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Log Interaction</DialogTitle>
            <DialogDescription>
              {logInteractionContactName
                ? `Record an interaction with ${logInteractionContactName}.`
                : "Record a new interaction with this investor."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={logInteractionForm.type}
                onValueChange={(v) => setLogInteractionForm((prev) => ({ ...prev, type: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="logTitle">Title</Label>
              <Input
                id="logTitle"
                value={logInteractionForm.title}
                onChange={(e) => setLogInteractionForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Intro call, Follow-up email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logDate">Date</Label>
              <Input
                id="logDate"
                type="date"
                value={logInteractionForm.date}
                onChange={(e) => setLogInteractionForm((prev) => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logDescription">Description</Label>
              <Textarea
                id="logDescription"
                value={logInteractionForm.description}
                onChange={(e) => setLogInteractionForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Summary of the interaction"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogInteractionOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setLogInteractionOpen(false)
                toast({
                  title: "Interaction logged",
                  description: logInteractionContactName
                    ? `Interaction with ${logInteractionContactName} has been recorded.`
                    : "Interaction has been recorded.",
                })
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Contact modal */}
      <Dialog
        open={addContactOpen}
        onOpenChange={(open) => {
          setAddContactOpen(open)
          if (!open) setContactForm({ name: "", role: "", email: "", phone: "", linkedin: "", notes: "" })
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Contact</DialogTitle>
            <DialogDescription>Add a new contact for this investor.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="addContactName">Name</Label>
              <Input
                id="addContactName"
                value={contactForm.name}
                onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addContactRole">Role</Label>
              <Input
                id="addContactRole"
                value={contactForm.role}
                onChange={(e) => setContactForm((prev) => ({ ...prev, role: e.target.value }))}
                placeholder="e.g. Partner, Principal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addContactEmail">Email</Label>
              <Input
                id="addContactEmail"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addContactPhone">Phone</Label>
              <Input
                id="addContactPhone"
                value={contactForm.phone}
                onChange={(e) => setContactForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 234 567 8900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addContactLinkedin">LinkedIn</Label>
              <Input
                id="addContactLinkedin"
                value={contactForm.linkedin}
                onChange={(e) => setContactForm((prev) => ({ ...prev, linkedin: e.target.value }))}
                placeholder="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addContactNotes">Notes</Label>
              <Textarea
                id="addContactNotes"
                value={contactForm.notes}
                onChange={(e) => setContactForm((prev) => ({ ...prev, notes: e.target.value }))}
                className="min-h-[80px]"
                placeholder="Notes about this contact"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddContactOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddContact} disabled={!contactForm.name.trim()}>
              Add Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Contact modal */}
      <Dialog open={editContactOpen} onOpenChange={(open) => { setEditContactOpen(open); if (!open) setEditingContactIndex(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>Update contact details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Name</Label>
                <Input
                  id="contactName"
                  value={contactForm.name}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactRole">Role</Label>
                <Input
                  id="contactRole"
                  value={contactForm.role}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, role: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone</Label>
              <Input
                id="contactPhone"
                value={contactForm.phone}
                onChange={(e) => setContactForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactLinkedin">LinkedIn</Label>
              <Input
                id="contactLinkedin"
                value={contactForm.linkedin}
                onChange={(e) => setContactForm((prev) => ({ ...prev, linkedin: e.target.value }))}
                placeholder="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNotes">Notes</Label>
              <Textarea
                id="contactNotes"
                value={contactForm.notes}
                onChange={(e) => setContactForm((prev) => ({ ...prev, notes: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditContactOpen(false); setEditingContactIndex(null); }}>Cancel</Button>
            <Button onClick={handleSaveContact}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}

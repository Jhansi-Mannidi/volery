"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertCircle,
  ArrowLeft,
  Bot,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Edit3,
  Eye,
  FileText,
  Lightbulb,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wand2,
  X,
} from "lucide-react"

// Sample company data for the memo
const companyData = {
  name: "TechFlow AI",
  sector: "Enterprise Software / AI",
  stage: "Series A",
  location: "San Francisco, CA",
  founded: "2022",
  employees: 45,
  website: "techflow.ai",
  ask: "$15M",
  valuation: "$60M pre-money",
  description: "AI-powered workflow automation platform for enterprise teams",
  
  // Market data
  tam: "$84B",
  sam: "$12B",
  som: "$1.2B",
  marketGrowth: "24% CAGR",
  
  // Traction
  arr: "$2.4M",
  mrrGrowth: "18%",
  customers: 48,
  nrr: "135%",
  
  // Team
  founders: [
    { name: "Sarah Chen", role: "CEO", background: "Ex-Google PM, Stanford CS" },
    { name: "Michael Park", role: "CTO", background: "Ex-Meta ML Lead, MIT PhD" },
  ],
  
  // Financials
  runway: "8 months",
  burnRate: "$380K/mo",
  grossMargin: "82%",
}

// Memo sections configuration
const memoSections = [
  { id: "executive-summary", title: "Executive Summary", icon: FileText, required: true },
  { id: "company-overview", title: "Company Overview", icon: Building2, required: true },
  { id: "market-analysis", title: "Market Analysis", icon: Target, required: true },
  { id: "product-traction", title: "Product & Traction", icon: TrendingUp, required: true },
  { id: "team", title: "Team", icon: Users, required: true },
  { id: "financial-projections", title: "Financial Projections", icon: TrendingUp, required: true },
  { id: "investment-thesis", title: "Investment Thesis", icon: Lightbulb, required: true },
  { id: "risks-mitigations", title: "Risks & Mitigations", icon: AlertCircle, required: true },
  { id: "terms", title: "Terms", icon: FileText, required: true },
]

// Initial memo content
const initialMemoContent = {
  "executive-summary": {
    company: companyData.name,
    sector: companyData.sector,
    stage: companyData.stage,
    ask: companyData.ask,
    valuation: companyData.valuation,
    recommendation: "INVEST",
    summary: "",
  },
  "company-overview": {
    description: companyData.description,
    founded: companyData.founded,
    location: companyData.location,
    employees: companyData.employees,
    website: companyData.website,
  },
  "market-analysis": {
    tam: companyData.tam,
    sam: companyData.sam,
    som: companyData.som,
    growthDrivers: "",
    competitiveLandscape: "",
  },
  "product-traction": {
    keyMetrics: {
      arr: companyData.arr,
      mrrGrowth: companyData.mrrGrowth,
      customers: companyData.customers,
      nrr: companyData.nrr,
    },
    customerInsights: "",
    productRoadmap: "",
  },
  "team": {
    founders: companyData.founders,
    gaps: "",
    hiringPlan: "",
  },
  "financial-projections": {
    modelSummary: "",
    assumptions: "",
    scenarios: {
      base: "",
      upside: "",
      downside: "",
    },
  },
  "investment-thesis": {
    whyNow: "",
    keyDrivers: "",
    exitPotential: "",
  },
  "risks-mitigations": {
    risks: [
      { risk: "", severity: "medium", mitigation: "" },
    ],
  },
  "terms": {
    proposedStructure: "",
    comparables: "",
  },
}

export default function ICMemoGeneratorPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState("executive-summary")
  const [memoContent, setMemoContent] = useState(initialMemoContent)
  const [completedSections, setCompletedSections] = useState<string[]>(["company-overview"])
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const isInstitutionalInvestor = user?.activeRole === "institutional-investor"
  
  // Calculate completion percentage
  const completionPercentage = Math.round((completedSections.length / memoSections.length) * 100)
  
  // Mark section as complete
  const markSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId])
    }
  }
  
  // AI auto-populate section
  const handleAutoPopulate = async (sectionId: string) => {
    setIsGenerating(true)
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Sample generated content based on section
    const generatedContent: Record<string, unknown> = {
      "executive-summary": {
        ...memoContent["executive-summary"],
        summary: `TechFlow AI is a compelling Series A investment opportunity in the rapidly growing enterprise AI workflow automation space. The company has demonstrated strong product-market fit with $2.4M ARR, 135% NRR, and a clear path to $10M+ ARR within 18 months. The experienced founding team from Google and Meta brings deep technical expertise and enterprise sales experience. We recommend investing $15M at a $60M pre-money valuation for approximately 20% ownership.`,
      },
      "market-analysis": {
        ...memoContent["market-analysis"],
        growthDrivers: `1. Enterprise digital transformation acceleration post-pandemic\n2. Labor cost pressures driving automation adoption\n3. AI/ML capabilities reaching enterprise-grade reliability\n4. Remote work increasing demand for workflow tools`,
        competitiveLandscape: `Key competitors include Zapier (consumer-focused), Workato (enterprise, $1.7B valuation), and Tray.io (mid-market). TechFlow AI differentiates through superior AI capabilities, faster implementation times (2 weeks vs. 2 months), and a more intuitive user experience that enables business users to create workflows without IT involvement.`,
      },
      "investment-thesis": {
        whyNow: `The enterprise workflow automation market is at an inflection point. AI capabilities have matured to handle complex enterprise workflows reliably, while labor costs and talent shortages are pushing companies to automate. TechFlow AI has built a differentiated product at the right time.`,
        keyDrivers: `1. Land-and-expand model with 135% NRR demonstrating strong upsell potential\n2. AI-native architecture provides sustainable competitive advantage\n3. Enterprise sales motion proven with 48 customers including 5 Fortune 500\n4. Platform effects as more integrations drive higher switching costs`,
        exitPotential: `Strategic acquirers include Salesforce, Microsoft, ServiceNow, and SAP. Comparable exits: Workato ($4.1B series E implied), Tray.io ($600M), MuleSoft (acquired by Salesforce for $6.5B). IPO path viable at $100M+ ARR.`,
      },
    }
    
    if (generatedContent[sectionId]) {
      setMemoContent(prev => ({
        ...prev,
        [sectionId]: generatedContent[sectionId],
      }))
    }
    
    setIsGenerating(false)
    markSectionComplete(sectionId)
  }
  
  // AI suggestions
  const getAiSuggestions = async () => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setAiSuggestions([
      "Consider adding more detail on customer concentration risk",
      "The competitive analysis could include more recent funding data",
      "Add specific metrics for the exit comparables",
      "Include information about the sales pipeline and velocity",
    ])
    setIsGenerating(false)
  }
  
  // Check completeness
  const incompleteSections = memoSections.filter(s => !completedSections.includes(s.id))
  
  // Handle save
  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }
  
  // Redirect non-institutional investors
  if (!isInstitutionalInvestor) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="IC Memo Generator" />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 flex items-center justify-center">
            <Card className="max-w-md">
              <CardContent className="pt-6 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-lg font-semibold mb-2">Access Restricted</h2>
                <p className="text-muted-foreground">
                  The IC Memo Generator is only available for institutional investors.
                </p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader 
          title="IC Memo Generator" 
          breadcrumbs={[
            { label: "Deal Flow", href: "/deals/incoming" },
            { label: companyData.name },
            { label: "IC Memo" },
          ]}
        />
        
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Left Sidebar - Section Navigation */}
            <div className="w-72 border-r border-border bg-muted/30 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{companyData.name}</h3>
                    <p className="text-xs text-muted-foreground">{companyData.stage} Memo</p>
                  </div>
                </div>
                
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-medium">{completionPercentage}%</span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                </div>
              </div>
              
              {/* Section List */}
              <ScrollArea className="flex-1">
                <div className="p-2">
                  {memoSections.map((section, index) => {
                    const isCompleted = completedSections.includes(section.id)
                    const isActive = activeSection === section.id
                    const Icon = section.icon
                    
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                          isActive 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-muted"
                        )}
                      >
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                          isCompleted 
                            ? "bg-green-500/20 text-green-600" 
                            : isActive 
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-muted-foreground/20 text-muted-foreground"
                        )}>
                          {isCompleted ? <Check className="w-3.5 h-3.5" /> : index + 1}
                        </div>
                        <span className={cn(
                          "text-sm font-medium flex-1",
                          !isActive && !isCompleted && "text-muted-foreground"
                        )}>
                          {section.title}
                        </span>
                        {section.required && !isCompleted && (
                          <span className="text-[10px] text-orange-500 font-medium">Required</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </ScrollArea>
              
              {/* AI Actions */}
              <div className="p-4 border-t border-border space-y-2">
                <Button 
                  className="w-full gap-2 bg-transparent" 
                  variant="outline"
                  onClick={getAiSuggestions}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Lightbulb className="w-4 h-4" />
                  )}
                  Check Completeness
                </Button>
                <Button 
                  className="w-full gap-2"
                  onClick={() => handleAutoPopulate(activeSection)}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                  Auto-Populate All
                </Button>
              </div>
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Toolbar */}
              <div className="h-14 border-b border-border px-6 flex items-center justify-between bg-background">
                <div className="flex items-center gap-4">
                  <h2 className="font-semibold">
                    {memoSections.find(s => s.id === activeSection)?.title}
                  </h2>
                  {completedSections.includes(activeSection) && (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Complete
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 bg-transparent"
                    onClick={() => handleAutoPopulate(activeSection)}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    AI Populate
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowPreview(true)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Export
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setShowExportModal(true)}>
                        <FileText className="w-4 h-4 mr-2" />
                        Export as PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowExportModal(true)}>
                        <FileText className="w-4 h-4 mr-2" />
                        Export to Notion
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowExportModal(true)}>
                        <FileText className="w-4 h-4 mr-2" />
                        Export to Google Docs
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Section Content */}
              <ScrollArea className="flex-1">
                <div className="p-6 max-w-4xl">
                  {/* Executive Summary */}
                  {activeSection === "executive-summary" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Company</Label>
                          <Input value={companyData.name} readOnly className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                          <Label>Sector</Label>
                          <Input value={companyData.sector} readOnly className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                          <Label>Stage</Label>
                          <Input value={companyData.stage} readOnly className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                          <Label>Ask</Label>
                          <Input value={companyData.ask} readOnly className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                          <Label>Valuation</Label>
                          <Input value={companyData.valuation} readOnly className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                          <Label>Investment Recommendation</Label>
                          <Select defaultValue="invest">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="invest">INVEST</SelectItem>
                              <SelectItem value="pass">PASS</SelectItem>
                              <SelectItem value="more-dd">MORE DD REQUIRED</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Executive Summary</Label>
                        <Textarea 
                          placeholder="Write a compelling summary of the investment opportunity..."
                          className="min-h-[200px]"
                          value={memoContent["executive-summary"].summary}
                          onChange={(e) => setMemoContent(prev => ({
                            ...prev,
                            "executive-summary": {
                              ...prev["executive-summary"],
                              summary: e.target.value,
                            }
                          }))}
                        />
                        <p className="text-xs text-muted-foreground">
                          Summarize the key investment thesis, opportunity, and recommendation in 2-3 paragraphs.
                        </p>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="gap-2 bg-transparent"
                        onClick={() => markSectionComplete("executive-summary")}
                      >
                        <Check className="w-4 h-4" />
                        Mark as Complete
                      </Button>
                    </div>
                  )}
                  
                  {/* Company Overview */}
                  {activeSection === "company-overview" && (
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Auto-filled from Company Profile</CardTitle>
                          <CardDescription>This information is pulled from the deal profile</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Company Name</p>
                              <p className="font-medium">{companyData.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Founded</p>
                              <p className="font-medium">{companyData.founded}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Location</p>
                              <p className="font-medium">{companyData.location}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Employees</p>
                              <p className="font-medium">{companyData.employees}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm text-muted-foreground">Description</p>
                              <p className="font-medium">{companyData.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <div className="space-y-2">
                        <Label>Additional Context</Label>
                        <Textarea 
                          placeholder="Add any additional context about the company..."
                          className="min-h-[150px]"
                        />
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="gap-2 bg-transparent"
                        onClick={() => markSectionComplete("company-overview")}
                      >
                        <Check className="w-4 h-4" />
                        Mark as Complete
                      </Button>
                    </div>
                  )}
                  
                  {/* Market Analysis */}
                  {activeSection === "market-analysis" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="pt-6 text-center">
                            <p className="text-2xl font-bold text-primary">{companyData.tam}</p>
                            <p className="text-sm text-muted-foreground">TAM</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6 text-center">
                            <p className="text-2xl font-bold text-primary">{companyData.sam}</p>
                            <p className="text-sm text-muted-foreground">SAM</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6 text-center">
                            <p className="text-2xl font-bold text-primary">{companyData.som}</p>
                            <p className="text-sm text-muted-foreground">SOM</p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Growth Drivers</Label>
                        <Textarea 
                          placeholder="What are the key market growth drivers?"
                          className="min-h-[150px]"
                          value={memoContent["market-analysis"].growthDrivers}
                          onChange={(e) => setMemoContent(prev => ({
                            ...prev,
                            "market-analysis": {
                              ...prev["market-analysis"],
                              growthDrivers: e.target.value,
                            }
                          }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Competitive Landscape</Label>
                        <Textarea 
                          placeholder="Describe the competitive landscape and positioning..."
                          className="min-h-[150px]"
                          value={memoContent["market-analysis"].competitiveLandscape}
                          onChange={(e) => setMemoContent(prev => ({
                            ...prev,
                            "market-analysis": {
                              ...prev["market-analysis"],
                              competitiveLandscape: e.target.value,
                            }
                          }))}
                        />
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="gap-2 bg-transparent"
                        onClick={() => markSectionComplete("market-analysis")}
                      >
                        <Check className="w-4 h-4" />
                        Mark as Complete
                      </Button>
                    </div>
                  )}
                  
                  {/* Product & Traction */}
                  {activeSection === "product-traction" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="pt-6 text-center">
                            <p className="text-2xl font-bold text-primary">{companyData.arr}</p>
                            <p className="text-sm text-muted-foreground">ARR</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6 text-center">
                            <p className="text-2xl font-bold text-green-600">{companyData.mrrGrowth}</p>
                            <p className="text-sm text-muted-foreground">MRR Growth</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6 text-center">
                            <p className="text-2xl font-bold text-primary">{companyData.customers}</p>
                            <p className="text-sm text-muted-foreground">Customers</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6 text-center">
                            <p className="text-2xl font-bold text-green-600">{companyData.nrr}</p>
                            <p className="text-sm text-muted-foreground">NRR</p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Customer Insights</Label>
                        <Textarea 
                          placeholder="Key customer insights, testimonials, and use cases..."
                          className="min-h-[150px]"
                          value={memoContent["product-traction"].customerInsights}
                          onChange={(e) => setMemoContent(prev => ({
                            ...prev,
                            "product-traction": {
                              ...prev["product-traction"],
                              customerInsights: e.target.value,
                            }
                          }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Product Roadmap</Label>
                        <Textarea 
                          placeholder="Key product initiatives and roadmap..."
                          className="min-h-[150px]"
                          value={memoContent["product-traction"].productRoadmap}
                          onChange={(e) => setMemoContent(prev => ({
                            ...prev,
                            "product-traction": {
                              ...prev["product-traction"],
                              productRoadmap: e.target.value,
                            }
                          }))}
                        />
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="gap-2 bg-transparent"
                        onClick={() => markSectionComplete("product-traction")}
                      >
                        <Check className="w-4 h-4" />
                        Mark as Complete
                      </Button>
                    </div>
                  )}
                  
                  {/* Team */}
                  {activeSection === "team" && (
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Founding Team</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {companyData.founders.map((founder, index) => (
                            <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Users className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{founder.name}</p>
                                <p className="text-sm text-muted-foreground">{founder.role}</p>
                                <p className="text-sm text-muted-foreground mt-1">{founder.background}</p>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                      
                      <div className="space-y-2">
                        <Label>Team Gaps</Label>
                        <Textarea 
                          placeholder="Identify any gaps in the current team..."
                          className="min-h-[100px]"
                          value={memoContent["team"].gaps}
                          onChange={(e) => setMemoContent(prev => ({
                            ...prev,
                            "team": {
                              ...prev["team"],
                              gaps: e.target.value,
                            }
                          }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Hiring Plan</Label>
                        <Textarea 
                          placeholder="Key hires planned and timeline..."
                          className="min-h-[100px]"
                          value={memoContent["team"].hiringPlan}
                          onChange={(e) => setMemoContent(prev => ({
                            ...prev,
                            "team": {
                              ...prev["team"],
                              hiringPlan: e.target.value,
                            }
                          }))}
                        />
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="gap-2 bg-transparent"
                        onClick={() => markSectionComplete("team")}
                      >
                        <Check className="w-4 h-4" />
                        Mark as Complete
                      </Button>
                    </div>
                  )}
                  
                  {/* Financial Projections */}
                  {activeSection === "financial-projections" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="pt-6 text-center">
                            <p className="text-2xl font-bold text-primary">{companyData.grossMargin}</p>
                            <p className="text-sm text-muted-foreground">Gross Margin</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6 text-center">
                            <p className="text-2xl font-bold text-orange-600">{companyData.burnRate}</p>
                            <p className="text-sm text-muted-foreground">Monthly Burn</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6 text-center">
                            <p className="text-2xl font-bold text-primary">{companyData.runway}</p>
                            <p className="text-sm text-muted-foreground">Runway</p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Model Summary</Label>
                        <Textarea 
                          placeholder="Summarize the financial model and key projections..."
                          className="min-h-[150px]"
                          value={memoContent["financial-projections"].modelSummary}
                          onChange={(e) => setMemoContent(prev => ({
                            ...prev,
                            "financial-projections": {
                              ...prev["financial-projections"],
                              modelSummary: e.target.value,
                            }
                          }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Key Assumptions</Label>
                        <Textarea 
                          placeholder="List the key assumptions in the model..."
                          className="min-h-[100px]"
                          value={memoContent["financial-projections"].assumptions}
                          onChange={(e) => setMemoContent(prev => ({
                            ...prev,
                            "financial-projections": {
                              ...prev["financial-projections"],
                              assumptions: e.target.value,
                            }
                          }))}
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Base Case</Label>
                          <Textarea 
                            placeholder="Base case scenario..."
                            className="min-h-[100px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Upside Case</Label>
                          <Textarea 
                            placeholder="Upside scenario..."
                            className="min-h-[100px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Downside Case</Label>
                          <Textarea 
                            placeholder="Downside scenario..."
                            className="min-h-[100px]"
                          />
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="gap-2 bg-transparent"
                        onClick={() => markSectionComplete("financial-projections")}
                      >
                        <Check className="w-4 h-4" />
                        Mark as Complete
                      </Button>
                    </div>
                  )}
                  
                  {/* Investment Thesis */}
                  {activeSection === "investment-thesis" && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Why Now?</Label>
                        <Textarea 
                          placeholder="Why is now the right time to invest?"
                          className="min-h-[150px]"
                          value={memoContent["investment-thesis"].whyNow}
                          onChange={(e) => setMemoContent(prev => ({
                            ...prev,
                            "investment-thesis": {
                              ...prev["investment-thesis"],
                              whyNow: e.target.value,
                            }
                          }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Key Investment Drivers</Label>
                        <Textarea 
                          placeholder="What are the key drivers that will make this investment successful?"
                          className="min-h-[150px]"
                          value={memoContent["investment-thesis"].keyDrivers}
                          onChange={(e) => setMemoContent(prev => ({
                            ...prev,
                            "investment-thesis": {
                              ...prev["investment-thesis"],
                              keyDrivers: e.target.value,
                            }
                          }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Exit Potential</Label>
                        <Textarea 
                          placeholder="Describe the exit potential and comparable transactions..."
                          className="min-h-[150px]"
                          value={memoContent["investment-thesis"].exitPotential}
                          onChange={(e) => setMemoContent(prev => ({
                            ...prev,
                            "investment-thesis": {
                              ...prev["investment-thesis"],
                              exitPotential: e.target.value,
                            }
                          }))}
                        />
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="gap-2 bg-transparent"
                        onClick={() => markSectionComplete("investment-thesis")}
                      >
                        <Check className="w-4 h-4" />
                        Mark as Complete
                      </Button>
                    </div>
                  )}
                  
                  {/* Risks & Mitigations */}
                  {activeSection === "risks-mitigations" && (
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Risk Assessment Table</CardTitle>
                          <CardDescription>Identify key risks and mitigation strategies</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="border rounded-lg overflow-hidden">
                            <table className="w-full">
                              <thead className="bg-muted">
                                <tr>
                                  <th className="text-left p-3 text-sm font-medium">Risk</th>
                                  <th className="text-left p-3 text-sm font-medium w-28">Severity</th>
                                  <th className="text-left p-3 text-sm font-medium">Mitigation</th>
                                  <th className="p-3 w-10"></th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-t">
                                  <td className="p-3">
                                    <Input placeholder="Describe the risk..." className="border-0 bg-transparent p-0 h-auto" />
                                  </td>
                                  <td className="p-3">
                                    <Select defaultValue="medium">
                                      <SelectTrigger className="h-8">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </td>
                                  <td className="p-3">
                                    <Input placeholder="Mitigation strategy..." className="border-0 bg-transparent p-0 h-auto" />
                                  </td>
                                  <td className="p-3">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </td>
                                </tr>
                                <tr className="border-t">
                                  <td className="p-3">
                                    <Input placeholder="Describe the risk..." className="border-0 bg-transparent p-0 h-auto" />
                                  </td>
                                  <td className="p-3">
                                    <Select defaultValue="medium">
                                      <SelectTrigger className="h-8">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </td>
                                  <td className="p-3">
                                    <Input placeholder="Mitigation strategy..." className="border-0 bg-transparent p-0 h-auto" />
                                  </td>
                                  <td className="p-3">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <Button variant="outline" size="sm" className="mt-4 gap-2 bg-transparent">
                            <Plus className="w-4 h-4" />
                            Add Risk
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Button 
                        variant="outline" 
                        className="gap-2 bg-transparent"
                        onClick={() => markSectionComplete("risks-mitigations")}
                      >
                        <Check className="w-4 h-4" />
                        Mark as Complete
                      </Button>
                    </div>
                  )}
                  
                  {/* Terms */}
                  {activeSection === "terms" && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Proposed Structure</Label>
                        <Textarea 
                          placeholder="Describe the proposed deal structure, terms, and any special provisions..."
                          className="min-h-[200px]"
                          value={memoContent["terms"].proposedStructure}
                          onChange={(e) => setMemoContent(prev => ({
                            ...prev,
                            "terms": {
                              ...prev["terms"],
                              proposedStructure: e.target.value,
                            }
                          }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Comparable Transactions</Label>
                        <Textarea 
                          placeholder="List comparable transactions and valuations..."
                          className="min-h-[150px]"
                          value={memoContent["terms"].comparables}
                          onChange={(e) => setMemoContent(prev => ({
                            ...prev,
                            "terms": {
                              ...prev["terms"],
                              comparables: e.target.value,
                            }
                          }))}
                        />
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="gap-2 bg-transparent"
                        onClick={() => markSectionComplete("terms")}
                      >
                        <Check className="w-4 h-4" />
                        Mark as Complete
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
            
            {/* Right Sidebar - AI Suggestions */}
            {aiSuggestions.length > 0 && (
              <div className="w-80 border-l border-border bg-muted/30 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-sm">AI Suggestions</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={() => setAiSuggestions([])}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {aiSuggestions.map((suggestion, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">{suggestion}</p>
                      </div>
                    </Card>
                  ))}
                </div>
                
                {incompleteSections.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-3">Incomplete Sections</h4>
                    <div className="space-y-2">
                      {incompleteSections.map(section => (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted text-left"
                        >
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                          <span className="text-sm">{section.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Memo Preview</DialogTitle>
            <DialogDescription>
              Review your IC memo before exporting
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6 py-4">
              <div className="text-center border-b pb-6">
                <h1 className="text-2xl font-bold mb-2">Investment Committee Memo</h1>
                <h2 className="text-xl text-primary">{companyData.name}</h2>
                <p className="text-muted-foreground">{companyData.stage} - {companyData.ask} at {companyData.valuation}</p>
              </div>
              
              <div className="space-y-6">
                <section>
                  <h3 className="font-semibold text-lg mb-2">Executive Summary</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {memoContent["executive-summary"].summary || "Not yet completed"}
                  </p>
                </section>
                
                <Separator />
                
                <section>
                  <h3 className="font-semibold text-lg mb-2">Market Analysis</h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="font-bold text-primary">{companyData.tam}</p>
                      <p className="text-xs text-muted-foreground">TAM</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="font-bold text-primary">{companyData.sam}</p>
                      <p className="text-xs text-muted-foreground">SAM</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="font-bold text-primary">{companyData.som}</p>
                      <p className="text-xs text-muted-foreground">SOM</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {memoContent["market-analysis"].competitiveLandscape || "Not yet completed"}
                  </p>
                </section>
                
                <Separator />
                
                <section>
                  <h3 className="font-semibold text-lg mb-2">Investment Thesis</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {memoContent["investment-thesis"].whyNow || "Not yet completed"}
                  </p>
                </section>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Export Modal */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export IC Memo</DialogTitle>
            <DialogDescription>
              Choose your export format
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <button className="w-full flex items-center gap-4 p-4 rounded-lg border hover:bg-muted transition-colors">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-left">
                <p className="font-medium">Export as PDF</p>
                <p className="text-sm text-muted-foreground">Download a formatted PDF document</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-4 p-4 rounded-lg border hover:bg-muted transition-colors">
              <div className="w-10 h-10 rounded-lg bg-gray-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-500" />
              </div>
              <div className="text-left">
                <p className="font-medium">Export to Notion</p>
                <p className="text-sm text-muted-foreground">Create a new page in your workspace</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-4 p-4 rounded-lg border hover:bg-muted transition-colors">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-left">
                <p className="font-medium">Export to Google Docs</p>
                <p className="text-sm text-muted-foreground">Create a new Google Doc</p>
              </div>
            </button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

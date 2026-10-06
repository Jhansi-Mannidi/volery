"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import {
  Sparkles,
  ChevronRight,
  Upload,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ZoomIn,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  Building2,
  X,
  Edit,
  ExternalLink,
  Eye,
  Loader2,
  FileSpreadsheet,
  FileCheck,
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

const documentTypes = [
  { id: "pitch-deck", label: "Pitch Deck" },
  { id: "financial", label: "Financial Model" },
  { id: "cap-table", label: "Cap Table" },
  { id: "legal", label: "Legal Docs" },
  { id: "other", label: "Other" },
]

const analysisHistory = [
  {
    id: "1",
    name: "TechCorp_Pitch_v3.pdf",
    type: "Pitch Deck",
    deal: "TechCorp AI",
    dataPoints: 45,
    redFlags: 3,
    confidence: 94,
    time: "2h ago",
    icon: FileText,
  },
  {
    id: "2",
    name: "GreenEnergy_Model.xlsx",
    type: "Financial",
    deal: "GreenEnergy",
    dataPoints: 32,
    redFlags: 2,
    confidence: 91,
    time: "5h ago",
    icon: FileSpreadsheet,
  },
  {
    id: "3",
    name: "HealthX_CapTable.pdf",
    type: "Cap Table",
    deal: "HealthX",
    dataPoints: 18,
    redFlags: 0,
    confidence: 97,
    time: "1d ago",
    icon: FileCheck,
  },
]

type CompanyField = { field: string; value: string; confidence: number; status: string }
type TractionItem = { field: string; value: string; confidence: number; status: string }
type RedFlag = {
  id: string
  severity: string
  title: string
  page: number
  quote: string
  explanation: string
  benchmark: string
  questions: string[]
}

const initialExtractedData = {
  company: [
    { field: "Company Name", value: "TechCorp AI", confidence: 100, status: "verified" },
    { field: "Tagline", value: "AI for finance docs", confidence: 95, status: "verified" },
    { field: "Founded", value: "2021", confidence: 100, status: "verified" },
    { field: "Headquarters", value: "Bangalore, India", confidence: 100, status: "verified" },
    { field: "Website", value: "techcorp.ai", confidence: 95, status: "verified" },
    { field: "Sector", value: "Fintech", confidence: 95, status: "verified" },
    { field: "Sub-sector", value: "Document Processing", confidence: 80, status: "needs-review" },
    { field: "Business Model", value: "B2B SaaS", confidence: 100, status: "verified" },
  ] as CompanyField[],
  traction: {
    revenue: [
      { field: "ARR", value: "₹1.2 Cr", confidence: 100, status: "verified" },
      { field: "MRR", value: "₹10 Lakhs", confidence: 100, status: "verified" },
      { field: "MoM Growth", value: "15%", confidence: 95, status: "verified" },
      { field: "YoY Growth", value: "180%", confidence: 95, status: "verified" },
    ],
    customers: [
      { field: "Total Customers", value: "85", confidence: 100, status: "verified" },
      { field: "Enterprise", value: "12", confidence: 80, status: "needs-review" },
      { field: "Net Revenue Ret.", value: "115%", confidence: 80, status: "needs-review" },
      { field: "Churn Rate", value: "Not found", confidence: 0, status: "missing" },
    ],
  },
  team: [
    { name: "Vikram Sharma", role: "CEO & Co-founder", background: "Ex-Flipkart PM, IIT Delhi", linkedin: "linkedin.com/in/vikramsharma", confidence: 98 },
    { name: "Anita Reddy", role: "CTO & Co-founder", background: "Ex-Google Engineer, IIT Bombay", linkedin: "linkedin.com/in/anitareddy", confidence: 95 },
  ],
  fundraising: {
    current: [
      { field: "Round Type", value: "Series A", confidence: 100, status: "verified" },
      { field: "Amount Raising", value: "₹15 Crores", confidence: 100, status: "verified" },
      { field: "Pre-money Val.", value: "₹60 Crores", confidence: 95, status: "verified" },
      { field: "Post-money Val.", value: "₹75 Crores", confidence: 100, status: "verified" },
    ],
    useOfFunds: [
      { field: "Team Expansion", value: "40%", confidence: 95, status: "verified" },
      { field: "Product Dev.", value: "30%", confidence: 95, status: "verified" },
      { field: "Sales & Marketing", value: "20%", confidence: 80, status: "needs-review" },
      { field: "Operations", value: "10%", confidence: 80, status: "needs-review" },
    ],
    previous: [
      { field: "Seed Round", value: "₹3 Cr (2022)", confidence: 100, status: "verified" },
      { field: "Investors", value: "Anthill, Angels", confidence: 95, status: "verified" },
    ],
  },
}

const initialRedFlags: RedFlag[] = [
  {
    id: "1",
    severity: "high",
    title: "Customer Concentration Risk",
    page: 8,
    quote: "Top 3 customers contribute 45% of revenue",
    explanation: "Revenue concentration above 25% creates significant churn risk. If any major customer leaves, it could materially impact the business.",
    benchmark: "Healthy = <25% from top 3 customers",
    questions: ["What is the contract duration with top customers?", "What is the pipeline of new enterprise customers?", "Have you lost any major customers? Why?"],
  },
  {
    id: "2",
    severity: "medium",
    title: "Aggressive Growth Assumptions",
    page: 12,
    quote: "Projecting 300% growth for next 3 years",
    explanation: "While current growth is strong (180% YoY), assuming sustained 300% growth may be optimistic. Only top 5% of companies achieve this consistently.",
    benchmark: "Typical Series A growth rate: 150-200% YoY",
    questions: [],
  },
  {
    id: "3",
    severity: "medium",
    title: "Missing Churn Data",
    page: 9,
    quote: "Churn rate not disclosed in deck",
    explanation: "For SaaS companies, churn is a critical metric. Its absence could indicate higher-than-desired churn or lack of tracking.",
    benchmark: "Good SaaS churn: <5% monthly",
    questions: ["What is your current monthly/annual churn rate?"],
  },
]

export default function DocumentAnalysisPage() {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasResults, setHasResults] = useState(true)
  const [processingStep, setProcessingStep] = useState(4)
  const [progress, setProgress] = useState(65)
  const [selectedDocType, setSelectedDocType] = useState("pitch-deck")
  const [currentPage, setCurrentPage] = useState(8)
  const [isDragging, setIsDragging] = useState(false)
  const [extractedData, setExtractedData] = useState(initialExtractedData)
  const [redFlags, setRedFlags] = useState<RedFlag[]>(initialRedFlags)
  const [activeTab, setActiveTab] = useState("extracted")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const processingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [analysisHistoryOpen, setAnalysisHistoryOpen] = useState(false)
  const [batchUploadOpen, setBatchUploadOpen] = useState(false)
  const [batchFiles, setBatchFiles] = useState<File[]>([])
  const [exportOpen, setExportOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState("pdf")
  const [exportSections, setExportSections] = useState({ extracted: true, redFlags: true, highlights: true })
  const [reanalyzeConfirmOpen, setReanalyzeConfirmOpen] = useState(false)
  const [reanalyzeLoading, setReanalyzeLoading] = useState(false)
  const [applyToDealOpen, setApplyToDealOpen] = useState(false)
  const [selectedDealId, setSelectedDealId] = useState("")
  const [editCompanyOpen, setEditCompanyOpen] = useState(false)
  const [editTractionOpen, setEditTractionOpen] = useState(false)
  const [editTeamOpen, setEditTeamOpen] = useState(false)
  const [editFundraisingOpen, setEditFundraisingOpen] = useState(false)
  const [fieldEditOpen, setFieldEditOpen] = useState<{ section: "company"; index: number } | null>(null)
  const [fieldEditValue, setFieldEditValue] = useState("")
  const [addToDealNotesOpen, setAddToDealNotesOpen] = useState<{ flagId: string; title: string } | null>(null)
  const [dealNoteContent, setDealNoteContent] = useState("")
  const [dismissFlagId, setDismissFlagId] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(100)

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return
    if (processingIntervalRef.current) clearInterval(processingIntervalRef.current)
    setIsProcessing(true)
    setHasResults(false)
    setProcessingStep(1)
    setProgress(10)
    let step = 1
    const interval = setInterval(() => {
      step++
      setProcessingStep(step)
      setProgress(step * 15)
      if (step >= 7) {
        clearInterval(interval)
        processingIntervalRef.current = null
        setTimeout(() => {
          setIsProcessing(false)
          setHasResults(true)
          setProgress(100)
        }, 1000)
      }
    }, 1500)
    processingIntervalRef.current = interval
  }

  const handleCancelProcessing = () => {
    if (processingIntervalRef.current) {
      clearInterval(processingIntervalRef.current)
      processingIntervalRef.current = null
    }
    setIsProcessing(false)
    setHasResults(false)
    setProgress(0)
    setProcessingStep(0)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const processingSteps = [
    { label: "Document uploaded", complete: true },
    { label: "Text extracted (15 pages)", complete: true },
    { label: "Company information identified", complete: true },
    { label: "Analyzing traction metrics", complete: processingStep >= 4 },
    { label: "Detecting red flags", complete: processingStep >= 5 },
    { label: "Generating insights", complete: processingStep >= 6 },
    { label: "Benchmarking comparison", complete: processingStep >= 7 },
  ]

  const getConfidenceBar = (confidence: number) => {
    const bars = Math.round(confidence / 10)
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`h-3 w-1.5 rounded-sm ${
              i < bars ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case "needs-review":
        return <AlertCircle className="w-4 h-4 text-amber-600" />
      case "missing":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Document Analysis" />

        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />

          <main className="flex-1 overflow-auto">
            <div className="min-h-full bg-background">
              {/* Header */}
              <div className="border-b bg-card">
                <div className="container mx-auto px-6 py-4">
                  {/* Breadcrumb */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Link href="/role-selection" className="hover:text-foreground transition-colors">
                      Home
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link
                      href="/ai-insights"
                      className="hover:text-foreground transition-colors"
                    >
                      AI Insights
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-foreground font-medium">Document Analysis</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-6 h-6 text-primary" />
                        <h1 className="text-2xl font-bold text-foreground">Document Analysis</h1>
                      </div>
                      <p className="text-muted-foreground">
                        AI extracts insights from your documents
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" type="button" onClick={() => setAnalysisHistoryOpen(true)} aria-label="View analysis history">
                        <Clock className="w-4 h-4 mr-2" />
                        Analysis History
                      </Button>
                      <Button variant="outline" size="sm" type="button" onClick={() => setBatchUploadOpen(true)} aria-label="Batch upload documents">
                        Batch Upload
                      </Button>
                      <Button size="sm" type="button" onClick={handleUploadClick} aria-label="Upload document">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Document
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.pptx,.xlsx,.docx"
                        onChange={(e) => handleFileSelect(e.target.files)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="container mx-auto px-6 py-6">
                {!hasResults && !isProcessing && (
                  <Card>
                    <CardContent className="p-12">
                      {/* Upload Zone */}
                      <div
                        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                          isDragging
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault()
                          setIsDragging(true)
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault()
                          setIsDragging(false)
                          handleFileSelect(e.dataTransfer.files)
                        }}
                        onClick={handleUploadClick}
                      >
                        <div className="flex flex-col items-center gap-4">
                          <div className="flex items-center gap-2">
                            <FileText className="w-12 h-12 text-muted-foreground" />
                            <Sparkles className="w-8 h-8 text-primary" />
                          </div>
                          <div>
                            <p className="text-lg font-medium text-foreground mb-1">
                              Drop documents here or click to upload
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Supported: PDF, PPTX, XLSX, DOCX
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Max size: 50MB per file
                            </p>
                          </div>
                          <Button onClick={handleUploadClick}>Browse Files</Button>
                        </div>
                      </div>

                      {/* Document Type Selection */}
                      <div className="mt-6 space-y-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Document Types:
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {documentTypes.map((type) => (
                              <Button
                                key={type.id}
                                variant={selectedDocType === type.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedDocType(type.id)}
                              >
                                {type.label}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Associate with Deal (Optional):
                          </label>
                          <Select>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Search or select deal..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="techcorp">TechCorp AI</SelectItem>
                              <SelectItem value="greenenergy">GreenEnergy</SelectItem>
                              <SelectItem value="healthx">HealthX</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Processing Status */}
                {isProcessing && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        <CardTitle>Analyzing: TechCorp_AI_Pitch_Deck_v3.pdf</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Progress value={progress} className="h-2" />
                        <p className="text-sm text-muted-foreground text-center">{progress}%</p>
                      </div>

                      <p className="text-sm text-foreground">
                        Current Step: Extracting financial metrics...
                      </p>

                      <div className="space-y-2">
                        {processingSteps.map((step, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            {step.complete ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            ) : index === processingStep ? (
                              <Loader2 className="w-4 h-4 text-primary animate-spin" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-muted" />
                            )}
                            <span
                              className={
                                step.complete ? "text-foreground" : "text-muted-foreground"
                              }
                            >
                              {step.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      <p className="text-sm text-muted-foreground">
                        Estimated time remaining: ~45 seconds
                      </p>

                      <Button variant="outline" size="sm" type="button" onClick={handleCancelProcessing} aria-label="Cancel analysis">
                        Cancel
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Analysis Results */}
                {hasResults && (
                  <div className="space-y-6">
                    {/* Results Overview */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Sparkles className="w-5 h-5 text-primary" />
                              <CardTitle>Analysis Complete</CardTitle>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              TechCorp_AI_Pitch_Deck_v3.pdf
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" type="button" onClick={() => setExportOpen(true)} aria-label="Export report">
                              <Download className="w-4 h-4 mr-2" />
                              Export
                            </Button>
                            <Button variant="outline" size="sm" type="button" onClick={() => setReanalyzeConfirmOpen(true)} disabled={reanalyzeLoading} aria-label="Re-analyze document">
                              {reanalyzeLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                              Re-analyze
                            </Button>
                            <Button size="sm" type="button" onClick={() => setApplyToDealOpen(true)} aria-label="Apply to deal profile">
                              Apply to Deal Profile
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-4 gap-4 mb-6">
                          <div className="text-center p-4 rounded-lg bg-muted/50">
                            <p className="text-2xl font-bold text-foreground">45</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Data Points Extracted
                            </p>
                          </div>
                          <div className="text-center p-4 rounded-lg bg-muted/50">
                            <p className="text-2xl font-bold text-primary">94%</p>
                            <p className="text-xs text-muted-foreground mt-1">Confidence Score</p>
                          </div>
                          <div className="text-center p-4 rounded-lg bg-muted/50">
                            <p className="text-2xl font-bold text-red-600">3</p>
                            <p className="text-xs text-muted-foreground mt-1">Red Flags Found</p>
                          </div>
                          <div className="text-center p-4 rounded-lg bg-muted/50">
                            <p className="text-2xl font-bold text-green-600">8</p>
                            <p className="text-xs text-muted-foreground mt-1">Highlights Found</p>
                          </div>
                        </div>

                        {/* Document Info */}
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium text-foreground">Document Type:</span>{" "}
                            Pitch Deck (15 pages)
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Analysis Time:</span> 1
                            min 23 sec
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Model Used:</span> GPT-4
                            Turbo + Custom Extraction
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList>
                        <TabsTrigger value="extracted">Extracted Data</TabsTrigger>
                        <TabsTrigger value="red-flags">
                          Red Flags
                          <Badge variant="destructive" className="ml-2">
                            3
                          </Badge>
                        </TabsTrigger>
                        <TabsTrigger value="highlights">Highlights</TabsTrigger>
                        <TabsTrigger value="preview">Document Preview</TabsTrigger>
                      </TabsList>

                      {/* Extracted Data Tab */}
                      <TabsContent value="extracted" className="space-y-6 mt-6">
                        {/* Company Information */}
                        <Card>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-primary" />
                                <CardTitle>Company Information</CardTitle>
                              </div>
                              <Button variant="outline" size="sm" type="button" onClick={() => setEditCompanyOpen(true)} aria-label="Edit company information">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit All
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {extractedData.company.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between py-2 border-b last:border-0"
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    <span className="text-sm text-muted-foreground w-32">
                                      {item.field}
                                    </span>
                                    <button
                                      type="button"
                                      className={item.status === "needs-review" || item.status === "missing" ? "text-sm font-medium text-foreground underline decoration-dashed hover:no-underline" : "text-sm font-medium text-foreground cursor-default"}
                                      onClick={() => {
                                        if (item.status === "needs-review" || item.status === "missing") {
                                          setFieldEditOpen({ section: "company", index })
                                          setFieldEditValue(item.value)
                                        }
                                      }}
                                      tabIndex={item.status === "needs-review" || item.status === "missing" ? 0 : -1}
                                      aria-label={`Edit ${item.field}`}
                                    >
                                      {item.value}
                                    </button>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {getConfidenceBar(item.confidence)}
                                    {getStatusIcon(item.status)}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground mt-4">
                              ⚠️ = Needs verification (click to edit)
                            </p>
                          </CardContent>
                        </Card>

                        {/* Traction Metrics */}
                        <Card>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                <CardTitle>Traction Metrics</CardTitle>
                              </div>
                              <Button variant="outline" size="sm" type="button" onClick={() => setEditTractionOpen(true)} aria-label="Edit traction metrics">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit All
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {/* Revenue Metrics */}
                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-3">
                                Revenue Metrics
                              </h4>
                              <div className="space-y-3">
                                {extractedData.traction.revenue.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between py-2 border-b last:border-0"
                                  >
                                    <div className="flex items-center gap-3 flex-1">
                                      <span className="text-sm text-muted-foreground w-32">
                                        {item.field}
                                      </span>
                                      <span className="text-sm font-medium text-foreground">
                                        {item.value}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      {getConfidenceBar(item.confidence)}
                                      {getStatusIcon(item.status)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Customer Metrics */}
                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-3">
                                Customer Metrics
                              </h4>
                              <div className="space-y-3">
                                {extractedData.traction.customers.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between py-2 border-b last:border-0"
                                  >
                                    <div className="flex items-center gap-3 flex-1">
                                      <span className="text-sm text-muted-foreground w-32">
                                        {item.field}
                                      </span>
                                      <span className="text-sm font-medium text-foreground">
                                        {item.value}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      {getConfidenceBar(item.confidence)}
                                      {getStatusIcon(item.status)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              ❓ = Not found in document (add manually)
                            </p>
                          </CardContent>
                        </Card>

                        {/* Team Information */}
                        <Card>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                <CardTitle>Team Information</CardTitle>
                              </div>
                              <Button variant="outline" size="sm" type="button" onClick={() => setEditTeamOpen(true)} aria-label="Edit team information">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit All
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-3">
                                Founders
                              </h4>
                              <div className="space-y-4">
                                {extractedData.team.map((founder, index) => (
                                  <div
                                    key={index}
                                    className="p-4 rounded-lg border bg-card space-y-2"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <Avatar>
                                          <AvatarFallback className="bg-primary/10 text-primary">
                                            {founder.name
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="font-medium text-foreground">
                                            {founder.name}
                                          </p>
                                          <p className="text-sm text-muted-foreground">
                                            {founder.role}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {getConfidenceBar(founder.confidence)}
                                        <span className="text-xs text-muted-foreground">
                                          {founder.confidence}%
                                        </span>
                                      </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      Background: {founder.background}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-primary">
                                      <ExternalLink className="w-3 h-3" />
                                      <a
                                        href={`https://${founder.linkedin}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                      >
                                        {founder.linkedin}
                                      </a>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-muted-foreground">Team Size</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">22 employees</span>
                                  {getConfidenceBar(95)}
                                  {getStatusIcon("verified")}
                                </div>
                              </div>
                              <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-muted-foreground">
                                  Engineering %
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">60%</span>
                                  {getConfidenceBar(80)}
                                  {getStatusIcon("needs-review")}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Fundraising Details */}
                        <Card>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-primary" />
                                <CardTitle>Fundraising Details</CardTitle>
                              </div>
                              <Button variant="outline" size="sm" type="button" onClick={() => setEditFundraisingOpen(true)} aria-label="Edit fundraising details">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit All
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {/* Current Round */}
                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-3">
                                Current Round
                              </h4>
                              <div className="space-y-3">
                                {extractedData.fundraising.current.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between py-2 border-b last:border-0"
                                  >
                                    <div className="flex items-center gap-3 flex-1">
                                      <span className="text-sm text-muted-foreground w-32">
                                        {item.field}
                                      </span>
                                      <span className="text-sm font-medium text-foreground">
                                        {item.value}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      {getConfidenceBar(item.confidence)}
                                      {getStatusIcon(item.status)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Use of Funds */}
                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-3">
                                Use of Funds
                              </h4>
                              <div className="space-y-3">
                                {extractedData.fundraising.useOfFunds.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between py-2 border-b last:border-0"
                                  >
                                    <div className="flex items-center gap-3 flex-1">
                                      <span className="text-sm text-muted-foreground w-32">
                                        {item.field}
                                      </span>
                                      <span className="text-sm font-medium text-foreground">
                                        {item.value}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      {getConfidenceBar(item.confidence)}
                                      {getStatusIcon(item.status)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Previous Funding */}
                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-3">
                                Previous Funding
                              </h4>
                              <div className="space-y-3">
                                {extractedData.fundraising.previous.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between py-2 border-b last:border-0"
                                  >
                                    <div className="flex items-center gap-3 flex-1">
                                      <span className="text-sm text-muted-foreground w-32">
                                        {item.field}
                                      </span>
                                      <span className="text-sm font-medium text-foreground">
                                        {item.value}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      {getConfidenceBar(item.confidence)}
                                      {getStatusIcon(item.status)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      {/* Red Flags Tab */}
                      <TabsContent value="red-flags" className="space-y-4 mt-6">
                        <Card>
                          <CardHeader>
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-5 h-5 text-red-600" />
                              <CardTitle>Red Flags Detected ({redFlags.length})</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {redFlags.map((flag) => (
                              <div
                                key={flag.id}
                                className={`p-4 rounded-lg border-l-4 ${
                                  flag.severity === "high"
                                    ? "border-l-red-600 bg-red-50 dark:bg-red-950/20"
                                    : "border-l-amber-600 bg-amber-50 dark:bg-amber-950/20"
                                }`}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <AlertCircle
                                      className={`w-5 h-5 ${
                                        flag.severity === "high"
                                          ? "text-red-600"
                                          : "text-amber-600"
                                      }`}
                                    />
                                    <div>
                                      <h4 className="font-semibold text-foreground">
                                        {flag.title}
                                      </h4>
                                      <p className="text-xs text-muted-foreground mt-0.5">
                                        Page {flag.page}
                                      </p>
                                    </div>
                                  </div>
                                  <Badge
                                    variant={flag.severity === "high" ? "destructive" : "secondary"}
                                  >
                                    {flag.severity === "high" ? "High" : "Medium"} Severity
                                  </Badge>
                                </div>

                                <div className="space-y-3">
                                  <div className="p-3 rounded bg-background/50 border">
                                    <p className="text-sm text-foreground italic">
                                      "{flag.quote}"
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-sm font-medium text-foreground mb-1">
                                      Why this matters:
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {flag.explanation}
                                    </p>
                                  </div>

                                  {flag.benchmark && (
                                    <div className="p-2 rounded bg-primary/5 border border-primary/20">
                                      <p className="text-sm text-foreground">
                                        <span className="font-medium">Industry benchmark:</span>{" "}
                                        {flag.benchmark}
                                      </p>
                                    </div>
                                  )}

                                  {flag.questions.length > 0 && (
                                    <div>
                                      <p className="text-sm font-medium text-foreground mb-2">
                                        Questions to ask:
                                      </p>
                                      <ul className="space-y-1">
                                        {flag.questions.map((q, i) => (
                                          <li key={i} className="text-sm text-muted-foreground">
                                            • {q}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 mt-4">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    type="button"
                                    onClick={() => {
                                      setActiveTab("preview")
                                      setCurrentPage(flag.page)
                                    }}
                                    aria-label="View in document"
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View in Document
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    type="button"
                                    onClick={() => setAddToDealNotesOpen({ flagId: flag.id, title: flag.title })}
                                    aria-label="Add to deal notes"
                                  >
                                    Add to Deal Notes
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    type="button"
                                    onClick={() => setDismissFlagId(flag.id)}
                                    aria-label="Dismiss red flag"
                                  >
                                    <X className="w-4 h-4 mr-2" />
                                    Dismiss
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </TabsContent>

                      {/* Highlights Tab */}
                      <TabsContent value="highlights" className="mt-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Key Highlights</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {[
                                "Strong year-over-year growth of 180%",
                                "Net revenue retention of 115% indicates strong customer satisfaction",
                                "Experienced founding team with relevant backgrounds",
                                "12 enterprise customers provide revenue stability",
                                "Clear product-market fit in fintech document processing",
                                "Reasonable burn rate with 18 months runway",
                                "Strong investor backing from previous round",
                                "Growing market opportunity in AI-powered fintech",
                              ].map((highlight, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                                  <p className="text-sm text-foreground">{highlight}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      {/* Document Preview Tab */}
                      <TabsContent value="preview" className="mt-6">
                        <Card>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle>Document Preview</CardTitle>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                Page {currentPage} of 15
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-6">
                              {/* Document Preview */}
                              <div className="aspect-[3/4] bg-muted/30 rounded-lg border flex items-center justify-center">
                                <div className="text-center text-muted-foreground">
                                  <FileText className="w-16 h-16 mx-auto mb-2" />
                                  <p className="text-sm">Document Page {currentPage}</p>
                                  <p className="text-xs mt-1">Preview would render here</p>
                                </div>
                              </div>

                              {/* AI Annotations */}
                              <div className="space-y-4">
                                <h4 className="font-semibold text-foreground">AI Annotations:</h4>

                                <div className="space-y-3">
                                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                                    <div className="flex items-center gap-2 mb-1">
                                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                                      <span className="text-sm font-medium">ARR: ₹1.2 Cr</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      Confidence: 98%
                                    </p>
                                  </div>

                                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                                    <div className="flex items-center gap-2 mb-1">
                                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                                      <span className="text-sm font-medium">Customers: 85</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      Confidence: 99%
                                    </p>
                                  </div>

                                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                                    <div className="flex items-center gap-2 mb-2">
                                      <AlertCircle className="w-4 h-4 text-red-600" />
                                      <span className="text-sm font-medium">
                                        Red Flag: Concentration
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-2">
                                      Top 3 = 45% revenue
                                    </p>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      type="button"
                                      onClick={() => setActiveTab("red-flags")}
                                      aria-label="View red flag details"
                                    >
                                      View Details
                                    </Button>
                                  </div>
                                </div>

                                <p className="text-xs text-muted-foreground mt-4">
                                  Click any highlight to see extracted data details.
                                </p>
                              </div>
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center justify-between mt-6 pt-4 border-t">
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Previous
                              </Button>

                              <Select
                                value={currentPage.toString()}
                                onValueChange={(value) => setCurrentPage(Number.parseInt(value))}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: 15 }).map((_, i) => (
                                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                                      Page {i + 1}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 15}
                                onClick={() => setCurrentPage(Math.min(15, currentPage + 1))}
                              >
                                Next
                                <ChevronRightIcon className="w-4 h-4 ml-2" />
                              </Button>
                            </div>

                            <div className="flex items-center justify-center gap-2 mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={() => setZoomLevel((z) => Math.min(200, z + 25))}
                                aria-label="Zoom in"
                              >
                                <ZoomIn className="w-4 h-4 mr-2" />
                                Zoom ({zoomLevel}%)
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={() => {
                                  toast({ title: "Download started", description: "TechCorp_AI_Pitch_Deck_v3.pdf" })
                                }}
                                aria-label="Download document"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>

                    {/* Analysis History */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Recent Document Analyses</CardTitle>
                          <Button variant="link" size="sm" type="button" onClick={() => setAnalysisHistoryOpen(true)} aria-label="View all analyses">
                            View All
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {analysisHistory.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <doc.icon className="w-10 h-10 text-primary" />
                                <div>
                                  <p className="font-medium text-foreground">{doc.name}</p>
                                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                    <span>{doc.type}</span>
                                    <span>•</span>
                                    <span>{doc.deal}</span>
                                    <span>•</span>
                                    <span>{doc.time}</span>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                    <span>{doc.dataPoints} data points</span>
                                    <span>•</span>
                                    <span>{doc.redFlags} flags</span>
                                    <span>•</span>
                                    <span>{doc.confidence}% confidence</span>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={() => {
                                  setAnalysisHistoryOpen(false)
                                  toast({ title: "Viewing analysis", description: doc.name })
                                }}
                                aria-label={`View ${doc.name}`}
                              >
                                View
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>

        {/* Analysis History Dialog */}
        <Dialog open={analysisHistoryOpen} onOpenChange={setAnalysisHistoryOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Analysis History</DialogTitle>
              <DialogDescription>
                Chronological list of documents analyzed. Click View to open an analysis.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              {analysisHistory.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <doc.icon className="w-10 h-10 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{doc.name}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span>{doc.type}</span>
                        <span>•</span>
                        <span>{doc.deal}</span>
                        <span>•</span>
                        <span>{doc.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span>{doc.dataPoints} data points</span>
                        <span>•</span>
                        <span>{doc.redFlags} flags</span>
                        <span>•</span>
                        <span>{doc.confidence}% confidence</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => {
                      setAnalysisHistoryOpen(false)
                      toast({ title: "Viewing analysis", description: doc.name })
                    }}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Batch Upload Dialog */}
        <Dialog open={batchUploadOpen} onOpenChange={(open) => !open && setBatchFiles([])}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Batch Upload Documents</DialogTitle>
              <DialogDescription>
                Select multiple files to upload and queue for AI analysis. Supported: PDF, PPTX, XLSX, DOCX. Max 50MB per file.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Files</Label>
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.pptx,.xlsx,.docx"
                  className="mt-2"
                  onChange={(e) => setBatchFiles(e.target.files ? Array.from(e.target.files) : [])}
                />
                {batchFiles.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">{batchFiles.length} file(s) selected</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setBatchUploadOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (batchFiles.length > 0) {
                    const dt = new DataTransfer()
                    batchFiles.forEach((f) => dt.items.add(f))
                    handleFileSelect(dt.files)
                    setBatchUploadOpen(false)
                    setBatchFiles([])
                    toast({ title: "Batch upload started", description: `${batchFiles.length} file(s) queued for analysis` })
                  } else {
                    toast({ title: "Select files", description: "Please select at least one file", variant: "destructive" })
                  }
                }}
              >
                Upload & Analyze
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Export Report Dialog */}
        <Dialog open={exportOpen} onOpenChange={setExportOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Export Report</DialogTitle>
              <DialogDescription>
                Choose format and sections to include. A file will be downloaded when you export.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Format</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Sections to include</Label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={exportSections.extracted} onChange={(e) => setExportSections((s) => ({ ...s, extracted: e.target.checked }))} className="rounded" />
                    Extracted Data
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={exportSections.redFlags} onChange={(e) => setExportSections((s) => ({ ...s, redFlags: e.target.checked }))} className="rounded" />
                    Red Flags
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={exportSections.highlights} onChange={(e) => setExportSections((s) => ({ ...s, highlights: e.target.checked }))} className="rounded" />
                    Highlights
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setExportOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setExportOpen(false)
                  toast({ title: "Export started", description: `Report exported as ${exportFormat.toUpperCase()}` })
                }}
              >
                Export
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Re-analyze Confirmation Dialog */}
        <Dialog open={reanalyzeConfirmOpen} onOpenChange={setReanalyzeConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Re-analyze document?</DialogTitle>
              <DialogDescription>
                Are you sure you want to re-analyze this document? This may take a few moments and will replace the current analysis.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setReanalyzeConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setReanalyzeConfirmOpen(false)
                  setReanalyzeLoading(true)
                  setTimeout(() => {
                    setReanalyzeLoading(false)
                    toast({ title: "Re-analysis complete", description: "Document has been re-analyzed." })
                  }, 2500)
                }}
              >
                Re-analyze
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Apply to Deal Profile Dialog */}
        <Dialog open={applyToDealOpen} onOpenChange={setApplyToDealOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Apply to Deal Profile</DialogTitle>
              <DialogDescription>
                Select a deal profile to apply the extracted insights from this document.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Deal / Startup</Label>
                <Select value={selectedDealId} onValueChange={setSelectedDealId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select deal..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="techcorp">TechCorp AI</SelectItem>
                    <SelectItem value="greenenergy">GreenEnergy</SelectItem>
                    <SelectItem value="healthx">HealthX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setApplyToDealOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                disabled={!selectedDealId}
                onClick={() => {
                  if (selectedDealId) {
                    setApplyToDealOpen(false)
                    toast({ title: "Applied to deal", description: "Insights applied to selected deal profile." })
                  } else {
                    toast({ title: "Select a deal", description: "Please select a deal profile.", variant: "destructive" })
                  }
                }}
              >
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Company Information Dialog */}
        <Dialog open={editCompanyOpen} onOpenChange={setEditCompanyOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Company Information</DialogTitle>
              <DialogDescription>
                Update extracted company fields. Changes are saved to this analysis.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {extractedData.company.map((item, index) => (
                <div key={index} className="space-y-2">
                  <Label>{item.field}</Label>
                  <Input
                    value={item.value}
                    onChange={(e) =>
                      setExtractedData((prev) => ({
                        ...prev,
                        company: prev.company.map((c, i) => (i === index ? { ...c, value: e.target.value, status: "verified" as const } : c)),
                      }))
                    }
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setEditCompanyOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={() => { setEditCompanyOpen(false); toast({ title: "Saved", description: "Company information updated." }) }}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Traction Metrics Dialog */}
        <Dialog open={editTractionOpen} onOpenChange={setEditTractionOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Traction Metrics</DialogTitle>
              <DialogDescription>
                Update revenue and customer metrics. Changes are saved to this analysis.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <h4 className="text-sm font-semibold">Revenue</h4>
              {extractedData.traction.revenue.map((item, index) => (
                <div key={`r-${index}`} className="space-y-2">
                  <Label>{item.field}</Label>
                  <Input
                    value={item.value}
                    onChange={(e) =>
                      setExtractedData((prev) => ({
                        ...prev,
                        traction: {
                          ...prev.traction,
                          revenue: prev.traction.revenue.map((r, i) => (i === index ? { ...r, value: e.target.value, status: "verified" as const } : r)),
                        },
                      }))
                    }
                  />
                </div>
              ))}
              <h4 className="text-sm font-semibold mt-4">Customers</h4>
              {extractedData.traction.customers.map((item, index) => (
                <div key={`c-${index}`} className="space-y-2">
                  <Label>{item.field}</Label>
                  <Input
                    value={item.value}
                    onChange={(e) =>
                      setExtractedData((prev) => ({
                        ...prev,
                        traction: {
                          ...prev.traction,
                          customers: prev.traction.customers.map((c, i) => (i === index ? { ...c, value: e.target.value, status: "verified" as const } : c)),
                        },
                      }))
                    }
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setEditTractionOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={() => { setEditTractionOpen(false); toast({ title: "Saved", description: "Traction metrics updated." }) }}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Team Dialog */}
        <Dialog open={editTeamOpen} onOpenChange={setEditTeamOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Team Information</DialogTitle>
              <DialogDescription>
                Update team and founder details. Changes are saved to this analysis.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {extractedData.team.map((member, index) => (
                <div key={index} className="space-y-2 p-3 rounded-lg border">
                  <Label>Name</Label>
                  <Input
                    value={member.name}
                    onChange={(e) =>
                      setExtractedData((prev) => ({
                        ...prev,
                        team: prev.team.map((t, i) => (i === index ? { ...t, name: e.target.value } : t)),
                      }))
                    }
                  />
                  <Label className="mt-2 block">Role</Label>
                  <Input
                    value={member.role}
                    onChange={(e) =>
                      setExtractedData((prev) => ({
                        ...prev,
                        team: prev.team.map((t, i) => (i === index ? { ...t, role: e.target.value } : t)),
                      }))
                    }
                  />
                  <Label className="mt-2 block">Background</Label>
                  <Input
                    value={member.background}
                    onChange={(e) =>
                      setExtractedData((prev) => ({
                        ...prev,
                        team: prev.team.map((t, i) => (i === index ? { ...t, background: e.target.value } : t)),
                      }))
                    }
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setEditTeamOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={() => { setEditTeamOpen(false); toast({ title: "Saved", description: "Team information updated." }) }}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Fundraising Dialog */}
        <Dialog open={editFundraisingOpen} onOpenChange={setEditFundraisingOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Fundraising Details</DialogTitle>
              <DialogDescription>
                Update current round, use of funds, and previous funding. Changes are saved to this analysis.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {[
                ...extractedData.fundraising.current.map((item, i) => ({ ...item, key: "current" as const, subIndex: i })),
                ...extractedData.fundraising.useOfFunds.map((item, i) => ({ ...item, key: "useOfFunds" as const, subIndex: i })),
                ...extractedData.fundraising.previous.map((item, i) => ({ ...item, key: "previous" as const, subIndex: i })),
              ].map((item, index) => (
                <div key={`${item.key}-${item.subIndex}`} className="space-y-2">
                  <Label>{item.field}</Label>
                  <Input
                    value={item.value}
                    onChange={(e) => {
                      const key = item.key
                      const subIndex = item.subIndex
                      setExtractedData((prev) => ({
                        ...prev,
                        fundraising: {
                          ...prev.fundraising,
                          [key]: (prev.fundraising[key] as { field: string; value: string; confidence: number; status: string }[]).map((it, i) =>
                            i === subIndex ? { ...it, value: e.target.value, status: "verified" as const } : it
                          ),
                        },
                      }))
                    }}
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setEditFundraisingOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={() => { setEditFundraisingOpen(false); toast({ title: "Saved", description: "Fundraising details updated." }) }}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Inline field edit (needs verification) */}
        <Dialog open={!!fieldEditOpen} onOpenChange={(open) => !open && setFieldEditOpen(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Verify &amp; edit</DialogTitle>
              <DialogDescription>
                {fieldEditOpen && extractedData.company[fieldEditOpen.index] ? extractedData.company[fieldEditOpen.index].field : ""}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={fieldEditOpen ? (fieldEditValue !== "" ? fieldEditValue : extractedData.company[fieldEditOpen.index]?.value ?? "") : ""}
                onChange={(e) => setFieldEditValue(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setFieldEditOpen(null)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (fieldEditOpen != null) {
                    setExtractedData((prev) => ({
                      ...prev,
                      company: prev.company.map((c, i) =>
                        i === fieldEditOpen.index ? { ...c, value: fieldEditValue || c.value, status: "verified" as const } : c
                      ),
                    }))
                    setFieldEditOpen(null)
                    setFieldEditValue("")
                    toast({ title: "Updated", description: "Field verified and saved." })
                  }
                }}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add to Deal Notes Dialog */}
        <Dialog open={!!addToDealNotesOpen} onOpenChange={(open) => !open && (setAddToDealNotesOpen(null), setDealNoteContent(""))}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add to Deal Notes</DialogTitle>
              <DialogDescription>
                {addToDealNotesOpen ? `Add "${addToDealNotesOpen.title}" to deal notes.` : ""}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label>Note content</Label>
              <Textarea
                placeholder="Optional: add context or follow-up..."
                value={dealNoteContent}
                onChange={(e) => setDealNoteContent(e.target.value)}
                className="mt-2 min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setAddToDealNotesOpen(null)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setAddToDealNotesOpen(null)
                  setDealNoteContent("")
                  toast({ title: "Added to deal notes", description: addToDealNotesOpen?.title ?? "Red flag" })
                }}
              >
                Add to Notes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dismiss Red Flag Confirmation */}
        <Dialog open={!!dismissFlagId} onOpenChange={(open) => !open && setDismissFlagId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dismiss red flag?</DialogTitle>
              <DialogDescription>
                This red flag will be removed from the list. You can still find it in the document or analysis history.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setDismissFlagId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                type="button"
                onClick={() => {
                  const flag = redFlags.find((f) => f.id === dismissFlagId)
                  if (dismissFlagId) {
                    setRedFlags((prev) => prev.filter((f) => f.id !== dismissFlagId))
                    setDismissFlagId(null)
                    toast({ title: "Red flag dismissed", description: flag?.title })
                  }
                }}
              >
                Dismiss
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}

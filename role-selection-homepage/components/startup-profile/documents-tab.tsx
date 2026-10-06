"use client"

import React, { useState, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Eye,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Flame,
  FolderOpen,
  Link2,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  Snowflake,
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
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/toaster"

// Map category display names (filter pills) to document category values
const categoryToDocValue: Record<string, string> = {
  "Pitch Decks": "Pitch Deck",
  "Financial Models": "Financial Model",
  "Legal Documents": "Legal",
  "Due Diligence": "Due Diligence",
}

// Mock documents data for startup profile
const documentsData = {
  summary: {
    totalDocuments: 12,
    sharedWithInvestors: 8,
    totalViews: 156,
    avgEngagement: 72,
  },
  categories: [
    { name: "Pitch Decks", count: 3, icon: FileText },
    { name: "Financial Models", count: 4, icon: FileSpreadsheet },
    { name: "Legal Documents", count: 3, icon: FileText },
    { name: "Due Diligence", count: 2, icon: FolderOpen },
  ],
  documents: [
    {
      id: "1",
      name: "TechCorp_PitchDeck_v3.pdf",
      category: "Pitch Deck",
      version: "v3",
      size: "2.4 MB",
      pages: 15,
      uploadedBy: { name: "Rajesh Kumar", initials: "RK" },
      uploadedAt: "Jan 12, 2026",
      lastUpdated: "Jan 12, 2026",
      views: 45,
      uniqueViewers: 28,
      avgTime: "4.2 min",
      completionRate: 82,
      engagement: "hot",
      sharedWith: 12,
      versions: [
        { version: "v3", date: "Jan 12, 2026", uploadedBy: "Rajesh Kumar" },
        { version: "v2", date: "Dec 28, 2025", uploadedBy: "Priya Patel" },
        { version: "v1", date: "Dec 15, 2025", uploadedBy: "Rajesh Kumar" },
      ],
    },
    {
      id: "2",
      name: "Financial_Model_2026.xlsx",
      category: "Financial Model",
      version: "v2",
      size: "1.8 MB",
      pages: 8,
      uploadedBy: { name: "Priya Patel", initials: "PP" },
      uploadedAt: "Jan 10, 2026",
      lastUpdated: "Jan 10, 2026",
      views: 32,
      uniqueViewers: 18,
      avgTime: "6.5 min",
      completionRate: 78,
      engagement: "trending",
      sharedWith: 8,
      versions: [
        { version: "v2", date: "Jan 10, 2026", uploadedBy: "Priya Patel" },
        { version: "v1", date: "Nov 20, 2025", uploadedBy: "Priya Patel" },
      ],
    },
    {
      id: "3",
      name: "Cap_Table_Jan2026.xlsx",
      category: "Financial Model",
      version: "v1",
      size: "520 KB",
      pages: 4,
      uploadedBy: { name: "Rajesh Kumar", initials: "RK" },
      uploadedAt: "Jan 8, 2026",
      lastUpdated: "Jan 8, 2026",
      views: 28,
      uniqueViewers: 15,
      avgTime: "2.8 min",
      completionRate: 95,
      engagement: "normal",
      sharedWith: 6,
      versions: [
        { version: "v1", date: "Jan 8, 2026", uploadedBy: "Rajesh Kumar" },
      ],
    },
    {
      id: "4",
      name: "Term_Sheet_Seed_Round.pdf",
      category: "Legal",
      version: "Final",
      size: "850 KB",
      pages: 12,
      uploadedBy: { name: "Rajesh Kumar", initials: "RK" },
      uploadedAt: "Oct 15, 2024",
      lastUpdated: "Oct 15, 2024",
      views: 18,
      uniqueViewers: 8,
      avgTime: "5.1 min",
      completionRate: 88,
      engagement: "normal",
      sharedWith: 4,
      versions: [
        { version: "Final", date: "Oct 15, 2024", uploadedBy: "Rajesh Kumar" },
        { version: "Draft", date: "Oct 5, 2024", uploadedBy: "Rajesh Kumar" },
      ],
    },
    {
      id: "5",
      name: "SHA_Seed_Round.pdf",
      category: "Legal",
      version: "Executed",
      size: "1.2 MB",
      pages: 28,
      uploadedBy: { name: "Rajesh Kumar", initials: "RK" },
      uploadedAt: "Oct 20, 2024",
      lastUpdated: "Oct 20, 2024",
      views: 12,
      uniqueViewers: 6,
      avgTime: "8.2 min",
      completionRate: 65,
      engagement: "cold",
      sharedWith: 4,
      versions: [
        { version: "Executed", date: "Oct 20, 2024", uploadedBy: "Rajesh Kumar" },
      ],
    },
    {
      id: "6",
      name: "Technical_DD_Report.pdf",
      category: "Due Diligence",
      version: "v1",
      size: "3.5 MB",
      pages: 35,
      uploadedBy: { name: "Priya Patel", initials: "PP" },
      uploadedAt: "Jan 5, 2026",
      lastUpdated: "Jan 5, 2026",
      views: 8,
      uniqueViewers: 4,
      avgTime: "12.5 min",
      completionRate: 45,
      engagement: "normal",
      sharedWith: 3,
      versions: [
        { version: "v1", date: "Jan 5, 2026", uploadedBy: "Priya Patel" },
      ],
    },
  ],
  recentActivity: [
    { action: "viewed", document: "TechCorp_PitchDeck_v3.pdf", user: "Sequoia Capital", time: "2 hours ago" },
    { action: "downloaded", document: "Financial_Model_2026.xlsx", user: "Accel Partners", time: "5 hours ago" },
    { action: "shared", document: "Cap_Table_Jan2026.xlsx", user: "You", time: "1 day ago" },
    { action: "viewed", document: "TechCorp_PitchDeck_v3.pdf", user: "Lightspeed", time: "2 days ago" },
    { action: "uploaded", document: "Technical_DD_Report.pdf", user: "Priya Patel", time: "3 days ago" },
  ],
  sharedLinks: [
    {
      id: "1",
      document: "TechCorp_PitchDeck_v3.pdf",
      sharedWith: "All Investors",
      accessCount: 28,
      createdAt: "Jan 12, 2026",
      expiresAt: "Feb 12, 2026",
      permissions: "View only",
    },
    {
      id: "2",
      document: "Financial_Model_2026.xlsx",
      sharedWith: "Sequoia, Accel",
      accessCount: 12,
      createdAt: "Jan 10, 2026",
      expiresAt: "Jan 25, 2026",
      permissions: "View & Download",
    },
  ],
}

const engagementConfig = {
  hot: {
    label: "Hot",
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/30",
  },
  trending: {
    label: "Trending",
    icon: TrendingUp,
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-950/30",
  },
  normal: {
    label: "Normal",
    icon: Clock,
    color: "text-muted-foreground",
    bg: "bg-muted/50",
  },
  cold: {
    label: "Cold",
    icon: Snowflake,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
}

const getFileIcon = (category: string) => {
  switch (category) {
    case "Pitch Deck":
      return FileText
    case "Financial Model":
      return FileSpreadsheet
    case "Legal":
      return FileText
    case "Due Diligence":
      return FolderOpen
    default:
      return FileText
  }
}

type DocItem = (typeof documentsData.documents)[number]

export function DocumentsTab() {
  const router = useRouter()
  const { toast } = useToast()
  const [documentsList, setDocumentsList] = useState<DocItem[]>(documentsData.documents)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [previewDocId, setPreviewDocId] = useState<string | null>(null)
  const [shareDocId, setShareDocId] = useState<string | null>(null)
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null)
  const [newLinkOpen, setNewLinkOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const quickUploadRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null, _source: "main" | "quick" = "main") => {
    if (!files || files.length === 0) return
    const newFiles = Array.from(files)
    setUploadedFiles((prev) => [...prev, ...newFiles])
    toast({
      title: "Upload started",
      description: `${newFiles.length} file(s) selected: ${newFiles.map((f) => f.name).join(", ")}`,
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files, "quick")
  }

  const filteredDocuments = useMemo(() => {
    const categoryValue = selectedCategory ? categoryToDocValue[selectedCategory] ?? selectedCategory : null
    return documentsList.filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !categoryValue || doc.category === categoryValue
      return matchesSearch && matchesCategory
    })
  }, [documentsList, searchQuery, selectedCategory])

  const handleDeleteDocument = (id: string) => {
    setDocumentsList((prev) => prev.filter((d) => d.id !== id))
    setExpandedDoc((prev) => (prev === id ? null : prev))
    setDeleteDocId(null)
    toast({ title: "Document removed", description: "The document has been deleted." })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Document Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Document Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">{documentsData.summary.totalDocuments}</p>
                <p className="text-xs text-muted-foreground">Total Documents</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">{documentsData.summary.sharedWithInvestors}</p>
                <p className="text-xs text-muted-foreground">Shared</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">{documentsData.summary.totalViews}</p>
                <p className="text-xs text-muted-foreground">Total Views</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">{documentsData.summary.avgEngagement}%</p>
                <p className="text-xs text-muted-foreground">Avg. Engagement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">All Documents</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 w-[200px]"
                />
              </div>
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  accept=".pdf,.xlsx,.xls,.pptx,.ppt,.docx,.doc"
                  onChange={(e) => handleFileSelect(e.target.files, "main")}
                />
                <Button size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-1.5" />
                  Upload
                </Button>
              </>
            </div>
          </CardHeader>
          <CardContent>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? "" : "bg-transparent"}
              >
                All
              </Button>
              {documentsData.categories.map((cat) => (
                <Button
                  key={cat.name}
                  variant={selectedCategory === cat.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.name === selectedCategory ? null : cat.name)}
                  className={selectedCategory === cat.name ? "" : "bg-transparent"}
                >
                  {cat.name}
                  <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-[10px]">
                    {cat.count}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Documents */}
            <div className="space-y-3">
              {filteredDocuments.map((doc) => {
                const FileIcon = getFileIcon(doc.category)
                const engagement = engagementConfig[doc.engagement as keyof typeof engagementConfig]
                const EngagementIcon = engagement.icon
                const isExpanded = expandedDoc === doc.id

                return (
                  <div
                    key={doc.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    {/* Document Row */}
                    <div className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                      {/* File Icon */}
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileIcon className="w-5 h-5 text-primary" />
                      </div>

                      {/* Document Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm text-foreground truncate">{doc.name}</h4>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
                            {doc.version}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>{doc.category}</span>
                          <span>{doc.size}</span>
                          <span>{doc.pages} pages</span>
                          <span>Updated {doc.lastUpdated}</span>
                        </div>
                      </div>

                      {/* Engagement Badge */}
                      <div className={cn("flex items-center gap-1 px-2 py-1 rounded-full text-xs", engagement.bg)}>
                        <EngagementIcon className={cn("w-3 h-3", engagement.color)} />
                        <span className={engagement.color}>{engagement.label}</span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{doc.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{doc.sharedWith}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          size="sm"
                          className="h-8"
                          onClick={() => setPreviewDocId(doc.id)}
                        >
                          <Eye className="w-3.5 h-3.5 mr-1.5" />
                          Preview
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setExpandedDoc(isExpanded ? null : doc.id)}
                        >
                          <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
                        </Button>
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="z-[100]">
                            <DropdownMenuItem onClick={() => toast({ title: "Download started", description: doc.name })}>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShareDocId(doc.id)}>
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                              <Upload className="w-4 h-4 mr-2" />
                              Upload New Version
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setDeleteDocId(doc.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t px-4 py-4 bg-muted/20">
                        <div className="grid grid-cols-3 gap-6">
                          {/* Engagement Metrics */}
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-3">Engagement Metrics</p>
                            <div className="space-y-3">
                              <div>
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span>Completion Rate</span>
                                  <span className="font-medium">{doc.completionRate}%</span>
                                </div>
                                <Progress value={doc.completionRate} className="h-1.5" />
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Unique Viewers</span>
                                <span className="font-medium">{doc.uniqueViewers}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Avg. Time Spent</span>
                                <span className="font-medium">{doc.avgTime}</span>
                              </div>
                            </div>
                          </div>

                          {/* Version History */}
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-3">Version History</p>
                            <div className="space-y-2">
                              {doc.versions.map((v, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <Badge variant={i === 0 ? "default" : "outline"} className="text-[10px] px-1.5 py-0">
                                      {v.version}
                                    </Badge>
                                    <span className="text-muted-foreground">{v.date}</span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">{v.uploadedBy}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Upload Info */}
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-3">Details</p>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
                                    {doc.uploadedBy.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">{doc.uploadedBy.name}</p>
                                  <p className="text-xs text-muted-foreground">Uploaded {doc.uploadedAt}</p>
                                </div>
                              </div>
                              <div className="flex gap-2 pt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 bg-transparent"
                                  onClick={() => setPreviewDocId(doc.id)}
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  Preview
                                </Button>
                                <Button
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => setShareDocId(doc.id)}
                                >
                                  <Share2 className="w-3 h-3 mr-1" />
                                  Share
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Sidebar */}
      <div className="space-y-6">
        {/* Quick Upload */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Quick Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="file"
              ref={quickUploadRef}
              className="hidden"
              multiple
              accept=".pdf,.xlsx,.xls,.pptx,.ppt,.docx,.doc"
              onChange={(e) => handleFileSelect(e.target.files, "quick")}
            />
            <div 
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
                isDragging ? "border-primary bg-primary/5" : "hover:border-primary/50"
              )}
              onClick={() => quickUploadRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className={cn("w-8 h-8 mx-auto mb-2", isDragging ? "text-primary" : "text-muted-foreground")} />
              <p className="text-sm font-medium">{isDragging ? "Drop files to upload" : "Drop files here"}</p>
              <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
            </div>
            <div className="mt-3 space-y-2">
              <p className="text-xs text-muted-foreground">Supported formats:</p>
              <div className="flex flex-wrap gap-1">
                {["PDF", "XLSX", "PPTX", "DOCX"].map((format) => (
                  <Badge key={format} variant="secondary" className="text-[10px]">
                    {format}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {documentsData.recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                  activity.action === "viewed" && "bg-blue-100 dark:bg-blue-950/50",
                  activity.action === "downloaded" && "bg-green-100 dark:bg-green-950/50",
                  activity.action === "shared" && "bg-purple-100 dark:bg-purple-950/50",
                  activity.action === "uploaded" && "bg-amber-100 dark:bg-amber-950/50",
                )}>
                  {activity.action === "viewed" && <Eye className="w-3 h-3 text-blue-600 dark:text-blue-400" />}
                  {activity.action === "downloaded" && <Download className="w-3 h-3 text-green-600 dark:text-green-400" />}
                  {activity.action === "shared" && <Share2 className="w-3 h-3 text-purple-600 dark:text-purple-400" />}
                  {activity.action === "uploaded" && <Upload className="w-3 h-3 text-amber-600 dark:text-amber-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{activity.document}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
            <Button
              variant="link"
              className="w-full justify-center text-primary p-0 h-auto"
              onClick={() => router.push("/activity")}
            >
              View All Activity
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        {/* Shared Links */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">Shared Links</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent"
              onClick={() => setNewLinkOpen(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              New Link
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {documentsData.sharedLinks.map((link) => (
              <div key={link.id} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-primary shrink-0" />
                    <p className="text-sm font-medium truncate">{link.document}</p>
                  </div>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="z-[100]">
                      <DropdownMenuItem onClick={() => toast({ title: "Link copied", description: "Share link copied to clipboard." })}>
                        Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast({ title: "Edit settings", description: "Link settings opened." })}>
                        Edit Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => toast({ title: "Access revoked", description: "Link has been revoked.", variant: "destructive" })}
                      >
                        Revoke Access
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Shared with:</span>
                    <span className="font-medium text-foreground">{link.sharedWith}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Access count:</span>
                    <span className="font-medium text-foreground">{link.accessCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Expires:</span>
                    <span className="font-medium text-foreground">{link.expiresAt}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="mt-2 text-[10px]">
                  {link.permissions}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Data Room Card */}
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Data Room</CardTitle>
              <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-0">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Secure data room for due diligence with all investor-ready documents.
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Documents</span>
              <span className="font-medium">{documentsData.summary.sharedWithInvestors}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Investors with access</span>
              <span className="font-medium">12</span>
            </div>
            <Button
              size="sm"
              className="w-full"
              onClick={() => router.push("/documents")}
            >
              <ExternalLink className="w-4 h-4 mr-1.5" />
              Open Data Room
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <Dialog open={!!previewDocId} onOpenChange={(open) => !open && setPreviewDocId(null)}>
        <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Preview</DialogTitle>
            <DialogDescription>
              {documentsList.find((d) => d.id === previewDocId)?.name ?? "Document"}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Document preview would open here. In production this would load the file viewer.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDocId(null)}>Close</Button>
            <Button onClick={() => { setPreviewDocId(null); toast({ title: "Opened in viewer", description: "Document opened in full-screen viewer." }); }}>
              Open in viewer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!shareDocId} onOpenChange={(open) => !open && setShareDocId(null)}>
        <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Share document</DialogTitle>
            <DialogDescription>
              Share {documentsList.find((d) => d.id === shareDocId)?.name ?? "document"} with investors or team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="share-message">Message (optional)</Label>
              <Textarea
                id="share-message"
                placeholder="Add a note with the share..."
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDocId(null)}>Cancel</Button>
            <Button onClick={() => { setShareDocId(null); toast({ title: "Share link created", description: "Recipients will receive access to the document." }); }}>
              Share
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteDocId} onOpenChange={(open) => !open && setDeleteDocId(null)}>
        <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Delete document?</DialogTitle>
            <DialogDescription>
              This will remove {documentsList.find((d) => d.id === deleteDocId)?.name ?? "this document"} from the startup. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDocId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deleteDocId && handleDeleteDocument(deleteDocId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={newLinkOpen} onOpenChange={setNewLinkOpen}>
        <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
          <DialogHeader>
            <DialogTitle>New share link</DialogTitle>
            <DialogDescription>Create a link to share one or more documents with investors.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Document</Label>
              <Input placeholder="Select document(s)..." readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <Input placeholder="View only" readOnly className="bg-muted" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewLinkOpen(false)}>Cancel</Button>
            <Button onClick={() => { setNewLinkOpen(false); toast({ title: "Link created", description: "Share link has been generated." }); }}>
              Create link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}

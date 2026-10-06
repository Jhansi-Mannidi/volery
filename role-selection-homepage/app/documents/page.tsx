"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  Flame,
  Grid3X3,
  LayoutList,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  Snowflake,
  TrendingUp,
  Upload,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { DocumentPreviewModal } from "@/components/documents/document-preview-modal"
import { ShareDocumentModal } from "@/components/documents/share-document-modal"
import { UploadDocumentModal } from "@/components/documents/upload-document-modal"
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb"
import DocumentCard from "@/components/documents/document-card"
import DocumentTableRow from "@/components/documents/document-table-row"
import { Toaster } from "@/components/ui/toaster"

// Mock documents data
const documents = [
  {
    id: "1",
    name: "TechCorp_PitchDeck_v2.pdf",
    type: "Pitch Deck",
    size: "2.4 MB",
    pages: 15,
    uploadedBy: { name: "Priya Sharma", initials: "PS" },
    uploadedAt: "Jan 10, 2026",
    relatedTo: { type: "startup", name: "TechCorp AI", id: "1" },
    views: 23,
    uniqueViewers: 15,
    avgTime: "4.2 min",
    completionRate: 78,
    engagement: "hot",
    thumbnail: "/placeholder-pdf.png",
  },
  {
    id: "2",
    name: "GreenLeaf_FinancialModel_Q4.xlsx",
    type: "Financial Model",
    size: "1.8 MB",
    pages: 8,
    uploadedBy: { name: "Rahul Mehta", initials: "RM" },
    uploadedAt: "Jan 8, 2026",
    relatedTo: { type: "startup", name: "GreenLeaf Energy", id: "2" },
    views: 45,
    uniqueViewers: 28,
    avgTime: "6.5 min",
    completionRate: 92,
    engagement: "trending",
    thumbnail: "/placeholder-excel.png",
  },
  {
    id: "3",
    name: "HealthBridge_TermSheet_Draft.pdf",
    type: "Legal",
    size: "850 KB",
    pages: 12,
    uploadedBy: { name: "Amit Patel", initials: "AP" },
    uploadedAt: "Jan 5, 2026",
    relatedTo: { type: "startup", name: "HealthBridge", id: "3" },
    views: 8,
    uniqueViewers: 4,
    avgTime: "3.1 min",
    completionRate: 65,
    engagement: "normal",
    thumbnail: "/placeholder-pdf.png",
  },
  {
    id: "4",
    name: "EduSpark_DueDiligence_Report.pdf",
    type: "Due Diligence",
    size: "5.2 MB",
    pages: 45,
    uploadedBy: { name: "Priya Sharma", initials: "PS" },
    uploadedAt: "Jan 3, 2026",
    relatedTo: { type: "startup", name: "EduSpark", id: "4" },
    views: 3,
    uniqueViewers: 2,
    avgTime: "1.5 min",
    completionRate: 25,
    engagement: "cold",
    thumbnail: "/placeholder-pdf.png",
  },
  {
    id: "5",
    name: "LogiFlow_Investor_Presentation.pptx",
    type: "Pitch Deck",
    size: "12.4 MB",
    pages: 28,
    uploadedBy: { name: "Rahul Mehta", initials: "RM" },
    uploadedAt: "Jan 1, 2026",
    relatedTo: { type: "startup", name: "LogiFlow", id: "5" },
    views: 67,
    uniqueViewers: 42,
    avgTime: "5.8 min",
    completionRate: 85,
    engagement: "hot",
    thumbnail: "/placeholder-pptx.png",
  },
  {
    id: "6",
    name: "Sequoia_Partnership_Agreement.pdf",
    type: "Legal",
    size: "1.1 MB",
    pages: 18,
    uploadedBy: { name: "Amit Patel", initials: "AP" },
    uploadedAt: "Dec 28, 2025",
    relatedTo: { type: "investor", name: "Sequoia Capital", id: "1" },
    views: 12,
    uniqueViewers: 6,
    avgTime: "4.0 min",
    completionRate: 70,
    engagement: "normal",
    thumbnail: "/placeholder-pdf.png",
  },
  {
    id: "7",
    name: "PayFlow_Cap_Table.xlsx",
    type: "Financial Model",
    size: "520 KB",
    pages: 4,
    uploadedBy: { name: "Priya Sharma", initials: "PS" },
    uploadedAt: "Dec 25, 2025",
    relatedTo: { type: "startup", name: "PayFlow", id: "6" },
    views: 31,
    uniqueViewers: 18,
    avgTime: "2.8 min",
    completionRate: 95,
    engagement: "trending",
    thumbnail: "/placeholder-excel.png",
  },
  {
    id: "8",
    name: "Market_Research_B2B_SaaS_2026.pdf",
    type: "Research",
    size: "8.7 MB",
    pages: 62,
    uploadedBy: { name: "Rahul Mehta", initials: "RM" },
    uploadedAt: "Dec 20, 2025",
    relatedTo: null,
    views: 89,
    uniqueViewers: 54,
    avgTime: "8.2 min",
    completionRate: 45,
    engagement: "hot",
    thumbnail: "/placeholder-pdf.png",
  },
]

const documentTypes = ["All Types", "Pitch Deck", "Financial Model", "Legal", "Due Diligence", "Research", "Other"]

type ViewMode = "grid" | "list"

const engagementConfig = {
  hot: {
    label: "Hot",
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-200 dark:border-orange-800",
  },
  trending: {
    label: "Trending",
    icon: TrendingUp,
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-800",
  },
  normal: {
    label: "Normal",
    icon: Eye,
    color: "text-muted-foreground",
    bg: "bg-muted/50",
    border: "border-border",
  },
  cold: {
    label: "Cold",
    icon: Snowflake,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
  },
}

export default function DocumentsPage() {
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("All Types")
  const [sortBy, setSortBy] = useState("recent")
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<(typeof documents)[0] | null>(null)

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.relatedTo?.name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "All Types" || doc.type === typeFilter
    return matchesSearch && matchesType
  })

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      case "name":
        return a.name.localeCompare(b.name)
      case "views":
        return b.views - a.views
      default:
        return 0
    }
  })

  const handlePreview = (doc: (typeof documents)[0]) => {
    setSelectedDocument(doc)
    setPreviewModalOpen(true)
  }

  const handleShare = (doc: (typeof documents)[0]) => {
    setSelectedDocument(doc)
    setShareModalOpen(true)
  }

  const handleDownload = (doc: (typeof documents)[0]) => {
    const blob = new Blob([`Placeholder content for ${doc.name}`], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = doc.name
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: "Download started", description: `${doc.name} is being downloaded.` })
  }

  // Stats
  const totalDocuments = documents.length
  const totalViews = documents.reduce((sum, doc) => sum + doc.views, 0)
  const hotDocuments = documents.filter((doc) => doc.engagement === "hot").length

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader title="Documents" />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 overflow-auto">
          {/* Breadcrumb & Stats Bar */}
          <div className="border-b bg-card px-4 md:px-6 py-3 space-y-3">
            <PageBreadcrumb segments={[{ label: "Documents" }]} />
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Total Documents:</span>
                <span className="text-sm font-semibold text-foreground">{totalDocuments}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">Total Views:</span>
                <span className="text-sm font-semibold text-foreground">{totalViews}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-sm text-muted-foreground">Hot Documents:</span>
                <span className="text-sm font-semibold text-foreground">{hotDocuments}</span>
              </div>
            </div>
          </div>

          {/* Page Header */}
          <div className="border-b bg-card px-4 md:px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Documents</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage and track engagement for all your documents
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => setUploadModalOpen(true)}
                >
                  <Upload className="w-4 h-4 mr-1.5" />
                  Upload
                </Button>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 mt-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recent</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="views">Views</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Toggle */}
                <div className="flex items-center border border-border rounded-lg p-1 bg-muted/30">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-md"
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-md"
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                  >
                    <LayoutList className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4 md:p-6">
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedDocuments.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onPreview={() => handlePreview(doc)}
                    onShare={() => handleShare(doc)}
                    onDownload={() => handleDownload(doc)}
                  />
                ))}
              </div>
            )}

            {viewMode === "list" && (
              <div className="rounded-lg border bg-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[50px]">Preview</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Related To</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Avg Time</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedDocuments.map((doc) => (
                        <DocumentTableRow
                        key={doc.id}
                        document={doc}
                        onPreview={() => handlePreview(doc)}
                        onShare={() => handleShare(doc)}
                        onDownload={() => handleDownload(doc)}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {sortedDocuments.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <FileText className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-1">No documents found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <UploadDocumentModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} />
      {selectedDocument && (
        <>
          <DocumentPreviewModal
            open={previewModalOpen}
            onOpenChange={setPreviewModalOpen}
            document={selectedDocument}
            onShare={() => { setPreviewModalOpen(false); setShareModalOpen(true) }}
            onDownload={() => handleDownload(selectedDocument)}
          />
          <ShareDocumentModal
            open={shareModalOpen}
            onOpenChange={setShareModalOpen}
            document={selectedDocument}
          />
        </>
      )}
      <Toaster />
    </div>
  )
}

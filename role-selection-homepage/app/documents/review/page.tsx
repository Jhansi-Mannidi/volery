"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import {
  Search,
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Bookmark,
  BookmarkCheck,
  MessageSquare,
  Highlighter,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Filter,
  FolderOpen,
  Clock,
  Building2,
  Eye,
  MoreVertical,
  Plus,
  Send,
  X,
  CheckCircle2,
  StickyNote,
  ArrowLeftRight,
} from "lucide-react"

// Mock data for document inbox
const documentInbox = [
  {
    id: "1",
    name: "TalentFlow - Pitch Deck Q1 2026",
    type: "Pitch Deck",
    company: "TalentFlow",
    companyLogo: "/placeholder-logo.png",
    sharedBy: "Sarah Chen",
    sharedDate: "2026-01-25",
    pages: 24,
    status: "unread",
    bookmarked: false,
  },
  {
    id: "2",
    name: "TalentFlow - Financial Model",
    type: "Financial Model",
    company: "TalentFlow",
    companyLogo: "/placeholder-logo.png",
    sharedBy: "Sarah Chen",
    sharedDate: "2026-01-25",
    pages: 12,
    status: "in_review",
    bookmarked: true,
  },
  {
    id: "3",
    name: "FinStack - Series B Deck",
    type: "Pitch Deck",
    company: "FinStack",
    companyLogo: "/placeholder-logo.png",
    sharedBy: "Raj Patel",
    sharedDate: "2026-01-24",
    pages: 32,
    status: "reviewed",
    bookmarked: false,
  },
  {
    id: "4",
    name: "FinStack - Cap Table",
    type: "Cap Table",
    company: "FinStack",
    companyLogo: "/placeholder-logo.png",
    sharedBy: "Raj Patel",
    sharedDate: "2026-01-24",
    pages: 3,
    status: "unread",
    bookmarked: false,
  },
  {
    id: "5",
    name: "MedAssist - Due Diligence Pack",
    type: "DD Materials",
    company: "MedAssist",
    companyLogo: "/placeholder-logo.png",
    sharedBy: "Dr. Priya Sharma",
    sharedDate: "2026-01-23",
    pages: 48,
    status: "in_review",
    bookmarked: true,
  },
  {
    id: "6",
    name: "CloudKitchen - Term Sheet Draft",
    type: "Term Sheet",
    company: "CloudKitchen Pro",
    companyLogo: "/placeholder-logo.png",
    sharedBy: "Legal Team",
    sharedDate: "2026-01-22",
    pages: 8,
    status: "reviewed",
    bookmarked: false,
  },
]

// Mock data for review notes
const reviewNotes = [
  {
    id: "1",
    page: 5,
    content: "Strong team background - all ex-Google/Meta",
    author: "Me",
    timestamp: "2026-01-25 14:30",
    type: "note",
  },
  {
    id: "2",
    page: 12,
    content: "Revenue projections seem aggressive - need to validate assumptions",
    author: "Me",
    timestamp: "2026-01-25 14:45",
    type: "highlight",
    highlightColor: "yellow",
  },
  {
    id: "3",
    page: 18,
    content: "Competitive landscape analysis is thorough",
    author: "Team Member",
    timestamp: "2026-01-25 15:00",
    type: "note",
  },
]

// Mock page content for PDF viewer
const mockPages = Array.from({ length: 24 }, (_, i) => ({
  pageNumber: i + 1,
  hasHighlight: [5, 12, 18].includes(i + 1),
  hasBookmark: [1, 5, 12].includes(i + 1),
}))

export default function DocumentReviewPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("inbox")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDocument, setSelectedDocument] = useState<typeof documentInbox[0] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [showNotes, setShowNotes] = useState(true)
  const [newNote, setNewNote] = useState("")
  const [isHighlighting, setIsHighlighting] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [filterCompany, setFilterCompany] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")

  const isInstitutionalInvestor = user?.activeRole === "institutional-investor"

  if (!isInstitutionalInvestor) {
  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader title="Document Review" />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 flex items-center justify-center">
            <Card className="max-w-md">
              <CardContent className="pt-6 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
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

  const filteredDocuments = documentInbox.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCompany = filterCompany === "all" || doc.company === filterCompany
    const matchesType = filterType === "all" || doc.type === filterType
    return matchesSearch && matchesCompany && matchesType
  })

  const companies = [...new Set(documentInbox.map((d) => d.company))]
  const documentTypes = [...new Set(documentInbox.map((d) => d.type))]

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (selectedDocument?.pages || 1)) {
      setCurrentPage(page)
    }
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      // Add note logic here
      setNewNote("")
    }
  }

  const pageNotes = reviewNotes.filter((n) => n.page === currentPage)

  // Document viewer when a document is selected
  if (selectedDocument) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Document Viewer Header */}
          <div className="border-b bg-background px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDocument(null)}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                <div className="h-6 w-px bg-border" />
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={selectedDocument.companyLogo || "/placeholder.svg"} />
                  <AvatarFallback className="rounded-lg">{selectedDocument.company[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-sm font-semibold">{selectedDocument.name}</h1>
                  <p className="text-xs text-muted-foreground">{selectedDocument.company}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                <div className="flex items-center gap-1 border rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setZoom(Math.max(50, zoom - 10))}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-xs w-12 text-center">{zoom}%</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setZoom(Math.min(200, zoom + 10))}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>

                {/* Page Navigation */}
                <div className="flex items-center gap-1 border rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-xs w-20 text-center">
                    Page {currentPage} / {selectedDocument.pages}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === selectedDocument.pages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                <div className="h-6 w-px bg-border" />

                {/* Tools */}
                <Button
                  variant={isHighlighting ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsHighlighting(!isHighlighting)}
                >
                  <Highlighter className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    // Toggle bookmark
                  }}
                >
                  {mockPages[currentPage - 1]?.hasBookmark ? (
                    <BookmarkCheck className="w-4 h-4 text-primary" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant={showNotes ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowNotes(!showNotes)}
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>

                <div className="h-6 w-px bg-border" />

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCompareMode(!compareMode)}
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <RotateCw className="w-4 h-4" />
                </Button>

                <div className="h-6 w-px bg-border" />

                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                  onClick={() => setShareModalOpen(true)}
                >
                  <Share2 className="w-4 h-4 mr-1.5" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Download className="w-4 h-4 mr-1.5" />
                  Download
                </Button>
              </div>
            </div>
          </div>

          {/* Document Viewer Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Page Thumbnails */}
            <div className="w-20 border-r bg-muted/30 overflow-auto">
              <div className="p-2 space-y-2">
                {mockPages.map((page) => (
                  <button
                    key={page.pageNumber}
                    onClick={() => setCurrentPage(page.pageNumber)}
                    className={cn(
                      "relative w-full aspect-[3/4] rounded border bg-background hover:border-primary transition-colors",
                      currentPage === page.pageNumber && "ring-2 ring-primary"
                    )}
                  >
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground">
                      {page.pageNumber}
                    </span>
                    {page.hasBookmark && (
                      <BookmarkCheck className="absolute top-1 right-1 w-3 h-3 text-primary" />
                    )}
                    {page.hasHighlight && (
                      <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-yellow-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Document View */}
            <div className={cn("flex-1 overflow-auto bg-muted/50 p-8", compareMode && "flex gap-4")}>
              <div
                className={cn(
                  "mx-auto bg-background rounded-lg shadow-lg",
                  compareMode ? "flex-1" : "max-w-4xl"
                )}
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
              >
                {/* Mock PDF Page */}
                <div className="aspect-[8.5/11] flex items-center justify-center border">
                  <div className="text-center text-muted-foreground p-8">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">{selectedDocument.name}</p>
                    <p className="text-sm">Page {currentPage} of {selectedDocument.pages}</p>
                    <p className="text-xs mt-4">PDF content would be rendered here</p>
                  </div>
                </div>
              </div>

              {/* Compare Document (when in compare mode) */}
              {compareMode && (
                <div className="flex-1 bg-background rounded-lg shadow-lg">
                  <div className="aspect-[8.5/11] flex items-center justify-center border">
                    <div className="text-center text-muted-foreground p-8">
                      <Plus className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Select document to compare</p>
                      <Button variant="outline" size="sm" className="mt-4 bg-transparent">
                        Choose Document
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notes Panel */}
            {showNotes && (
              <div className="w-80 border-l bg-background flex flex-col">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Review Notes</h3>
                  <p className="text-xs text-muted-foreground">Page {currentPage}</p>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {pageNotes.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No notes on this page yet
                      </p>
                    ) : (
                      pageNotes.map((note) => (
                        <div
                          key={note.id}
                          className={cn(
                            "p-3 rounded-lg text-sm",
                            note.type === "highlight" ? "bg-yellow-100 dark:bg-yellow-900/30" : "bg-muted"
                          )}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-xs">{note.author}</span>
                            <span className="text-xs text-muted-foreground">{note.timestamp.split(" ")[1]}</span>
                          </div>
                          <p>{note.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>

                {/* Add Note */}
                <div className="p-4 border-t">
                  <Textarea
                    placeholder="Add a note for this page..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="min-h-[80px] mb-2"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Highlighter className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <StickyNote className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim()}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Note
                    </Button>
                  </div>
                </div>

                {/* All Notes Summary */}
                <div className="p-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">All Notes ({reviewNotes.length})</h4>
                    <Button variant="ghost" size="sm">
                      Export
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {reviewNotes.slice(0, 3).map((note) => (
                      <button
                        key={note.id}
                        onClick={() => setCurrentPage(note.page)}
                        className="w-full text-left p-2 rounded hover:bg-muted text-xs"
                      >
                        <span className="text-muted-foreground">Page {note.page}:</span>{" "}
                        <span className="line-clamp-1">{note.content}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Share Modal */}
        <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Document with Notes</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Share with team members</label>
                <Input placeholder="Enter email addresses..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Include</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm">All highlights</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm">All notes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Bookmarked pages only</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message (optional)</label>
                <Textarea placeholder="Add a message..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShareModalOpen(false)} className="bg-transparent">
                Cancel
              </Button>
              <Button onClick={() => setShareModalOpen(false)}>
                <Send className="w-4 h-4 mr-1.5" />
                Share
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Document Inbox View
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Document Review" />

        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Documents</p>
                      <p className="text-2xl font-bold">{documentInbox.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10">
                      <Eye className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Unread</p>
                      <p className="text-2xl font-bold">
                        {documentInbox.filter((d) => d.status === "unread").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">In Review</p>
                      <p className="text-2xl font-bold">
                        {documentInbox.filter((d) => d.status === "in_review").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reviewed</p>
                      <p className="text-2xl font-bold">
                        {documentInbox.filter((d) => d.status === "reviewed").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={filterCompany} onValueChange={setFilterCompany}>
                  <SelectTrigger className="w-[160px]">
                    <Building2 className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[160px]">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Document List */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="inbox">All Documents</TabsTrigger>
                <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
                <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
              </TabsList>

              <TabsContent value="inbox" className="mt-6">
                <div className="space-y-3">
                  {filteredDocuments.map((doc) => (
                    <Card
                      key={doc.id}
                      className={cn(
                        "cursor-pointer transition-colors hover:bg-muted/50",
                        doc.status === "unread" && "border-l-4 border-l-primary"
                      )}
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <CardContent className="py-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10 rounded-lg">
                            <AvatarImage src={doc.companyLogo || "/placeholder.svg"} />
                            <AvatarFallback className="rounded-lg">{doc.company[0]}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className={cn(
                                "font-medium truncate",
                                doc.status === "unread" && "font-semibold"
                              )}>
                                {doc.name}
                              </h3>
                              {doc.bookmarked && (
                                <BookmarkCheck className="w-4 h-4 text-primary flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{doc.company}</span>
                              <span>•</span>
                              <span>{doc.type}</span>
                              <span>•</span>
                              <span>{doc.pages} pages</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right text-sm">
                              <p className="text-muted-foreground">Shared by {doc.sharedBy}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(doc.sharedDate).toLocaleDateString()}
                              </p>
                            </div>

                            <Badge
                              variant="outline"
                              className={cn(
                                doc.status === "unread" && "border-primary text-primary",
                                doc.status === "in_review" && "border-amber-500 text-amber-600",
                                doc.status === "reviewed" && "border-green-500 text-green-600"
                              )}
                            >
                              {doc.status === "unread" && "Unread"}
                              {doc.status === "in_review" && "In Review"}
                              {doc.status === "reviewed" && "Reviewed"}
                            </Badge>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                              }}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="bookmarked" className="mt-6">
                <div className="space-y-3">
                  {filteredDocuments
                    .filter((d) => d.bookmarked)
                    .map((doc) => (
                      <Card
                        key={doc.id}
                        className="cursor-pointer transition-colors hover:bg-muted/50"
                        onClick={() => setSelectedDocument(doc)}
                      >
                        <CardContent className="py-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10 rounded-lg">
                              <AvatarImage src={doc.companyLogo || "/placeholder.svg"} />
                              <AvatarFallback className="rounded-lg">{doc.company[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">{doc.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {doc.company} • {doc.type}
                              </p>
                            </div>
                            <BookmarkCheck className="w-5 h-5 text-primary" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="recent" className="mt-6">
                <div className="space-y-3">
                  {filteredDocuments.slice(0, 3).map((doc) => (
                    <Card
                      key={doc.id}
                      className="cursor-pointer transition-colors hover:bg-muted/50"
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <CardContent className="py-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10 rounded-lg">
                            <AvatarImage src={doc.companyLogo || "/placeholder.svg"} />
                            <AvatarFallback className="rounded-lg">{doc.company[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{doc.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {doc.company} • {doc.type}
                            </p>
                          </div>
                          <Clock className="w-4 h-4 text-muted-foreground" />
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
    </div>
  )
}

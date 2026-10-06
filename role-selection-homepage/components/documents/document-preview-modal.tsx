"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Share2,
  User,
  Users,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DocumentPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: {
    id: string
    name: string
    type: string
    size: string
    pages: number
    uploadedBy: { name: string; initials: string }
    uploadedAt: string
    relatedTo: { type: string; name: string; id: string } | null
    views: number
    uniqueViewers: number
    avgTime: string
    completionRate: number
    engagement: string
  }
  onShare?: () => void
  onDownload?: () => void
}

// Mock viewer data
const viewers = [
  {
    email: "john@investor.com",
    name: "John Smith",
    timeSpent: "6 min",
    pagesViewed: 12,
    totalPages: 15,
    viewedAt: "2 hours ago",
  },
  {
    email: "sarah@fundxyz.com",
    name: "Sarah Chen",
    timeSpent: "3 min",
    pagesViewed: 8,
    totalPages: 15,
    viewedAt: "5 hours ago",
  },
  {
    email: "mike@vcpartners.com",
    name: "Mike Johnson",
    timeSpent: "8 min",
    pagesViewed: 15,
    totalPages: 15,
    viewedAt: "1 day ago",
  },
  {
    email: "lisa@angelinvest.com",
    name: "Lisa Wong",
    timeSpent: "4 min",
    pagesViewed: 10,
    totalPages: 15,
    viewedAt: "2 days ago",
  },
]

// Mock version history
const versions = [
  { version: "v2", uploadedAt: "Jan 10, 2026", uploadedBy: "Priya Sharma", current: true },
  { version: "v1", uploadedAt: "Jan 5, 2026", uploadedBy: "Priya Sharma", current: false },
]

// Mock activity timeline
const activityTimeline = [
  { action: "Viewed", user: "john@investor.com", time: "2 hours ago", details: "Viewed 12/15 pages" },
  { action: "Shared", user: "Priya Sharma", time: "1 day ago", details: "Shared with 3 recipients" },
  { action: "Viewed", user: "sarah@fundxyz.com", time: "1 day ago", details: "Viewed 8/15 pages" },
  { action: "Uploaded", user: "Priya Sharma", time: "5 days ago", details: "Version 2 uploaded" },
  { action: "Viewed", user: "mike@vcpartners.com", time: "6 days ago", details: "Completed all pages" },
]

export function DocumentPreviewModal({ open, onOpenChange, document, onShare, onDownload }: DocumentPreviewModalProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(75)

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNextPage = () => {
    if (currentPage < document.pages) setCurrentPage(currentPage + 1)
  }

  const handleZoomIn = () => {
    if (zoom < 200) setZoom(zoom + 25)
  }

  const handleZoomOut = () => {
    if (zoom > 50) setZoom(zoom - 25)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-[1600px] w-[95vw] h-[85vh] max-h-[85vh] p-0 overflow-hidden flex flex-col"
        showCloseButton={false}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {/* Custom Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-background shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base font-semibold">{document.name}</DialogTitle>
              <p className="text-xs text-muted-foreground">
                {document.type} · {document.size} · {document.pages} pages
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={onShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={onDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Document Viewer */}
          <div className="flex-1 flex flex-col min-w-0 bg-muted/20">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b bg-background shrink-0">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="px-3 py-1.5 rounded-md bg-muted/50 border text-xs min-w-[80px] text-center">
                  <span className="font-medium">{currentPage}</span>
                  <span className="text-muted-foreground"> / {document.pages}</span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={handleNextPage}
                  disabled={currentPage === document.pages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <div className="px-3 py-1.5 rounded-md bg-muted/50 border text-xs font-medium min-w-[60px] text-center">
                  {zoom}%
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={handleZoomIn}
                  disabled={zoom >= 200}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
              <div
                className="bg-background rounded-lg shadow-lg border flex items-center justify-center transition-all duration-200"
                style={{
                  width: `${(595 * zoom) / 100}px`,
                  height: `${(842 * zoom) / 100}px`,
                }}
              >
                <div className="text-center text-muted-foreground p-6">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-sm font-medium">Document Preview</p>
                  <p className="text-xs mt-1 opacity-70">Page {currentPage} of {document.pages}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-[340px] border-l bg-background flex flex-col shrink-0">
            <Tabs defaultValue="info" className="flex-1 flex flex-col min-h-0">
              <div className="px-4 pt-4 pb-3 shrink-0 border-b">
                <TabsList className="grid w-full grid-cols-3 h-9">
                  <TabsTrigger value="info" className="text-xs">Info</TabsTrigger>
                  <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
                  <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
                </TabsList>
              </div>

              <ScrollArea className="flex-1">
                {/* Info Tab */}
                <TabsContent value="info" className="p-4 mt-0 space-y-4">
                  {/* File Details */}
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">File Details</h4>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Type</span>
                        <Badge variant="outline" className="text-[10px] h-5 font-normal">{document.type}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Size</span>
                        <span className="font-medium">{document.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pages</span>
                        <span className="font-medium">{document.pages}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Related To */}
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Related To</h4>
                    {document.relatedTo ? (
                      <div className="flex items-center gap-2.5 p-2.5 rounded-md bg-muted/50 border">
                        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                          <Building2 className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate">{document.relatedTo.name}</p>
                          <p className="text-[10px] text-muted-foreground capitalize">{document.relatedTo.type}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Not linked to any entity</p>
                    )}
                  </div>

                  <Separator />

                  {/* Upload Info */}
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Upload Info</h4>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">By:</span>
                        <span className="font-medium truncate">{document.uploadedBy.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">{document.uploadedAt}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Version History */}
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Version History</h4>
                    <div className="space-y-1.5">
                      {versions.map((version) => (
                        <div
                          key={version.version}
                          className={cn(
                            "flex items-center justify-between p-2 rounded-md",
                            version.current ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/50"
                          )}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-medium">{version.version}</span>
                              {version.current && (
                                <Badge variant="secondary" className="text-[9px] h-4 px-1 bg-primary/10 text-primary">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                              {version.uploadedAt} by {version.uploadedBy.split(" ")[0]}
                            </p>
                          </div>
                          {!version.current && (
                            <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2">
                              Restore
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="p-4 mt-0 space-y-4">
                  {/* Stats Grid */}
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Engagement Stats</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-md bg-muted/50 border">
                        <div className="flex items-center gap-1 mb-0.5">
                          <Eye className="w-3 h-3 text-primary" />
                          <span className="text-[10px] text-muted-foreground">Views</span>
                        </div>
                        <p className="text-sm font-semibold">{document.views}</p>
                      </div>
                      <div className="p-2.5 rounded-md bg-muted/50 border">
                        <div className="flex items-center gap-1 mb-0.5">
                          <Users className="w-3 h-3 text-primary" />
                          <span className="text-[10px] text-muted-foreground">Unique</span>
                        </div>
                        <p className="text-sm font-semibold">{document.uniqueViewers}</p>
                      </div>
                      <div className="p-2.5 rounded-md bg-muted/50 border">
                        <div className="flex items-center gap-1 mb-0.5">
                          <Clock className="w-3 h-3 text-primary" />
                          <span className="text-[10px] text-muted-foreground">Avg Time</span>
                        </div>
                        <p className="text-sm font-semibold">{document.avgTime}</p>
                      </div>
                      <div className="p-2.5 rounded-md bg-muted/50 border">
                        <div className="flex items-center gap-1 mb-0.5">
                          <FileText className="w-3 h-3 text-primary" />
                          <span className="text-[10px] text-muted-foreground">Complete</span>
                        </div>
                        <p className="text-sm font-semibold">{document.completionRate}%</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Viewer List */}
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Viewer Details</h4>
                    <div className="space-y-2">
                      {viewers.map((viewer) => (
                        <div key={viewer.email} className="p-2.5 rounded-md bg-muted/50 border">
                          <div className="flex items-start justify-between mb-1.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <Avatar className="w-6 h-6 shrink-0">
                                <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
                                  {viewer.name.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="text-xs font-medium truncate">{viewer.name}</p>
                                <p className="text-[10px] text-muted-foreground truncate">{viewer.email}</p>
                              </div>
                            </div>
                            <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{viewer.viewedAt}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                            <span>{viewer.timeSpent}</span>
                            <span>{viewer.pagesViewed}/{viewer.totalPages} pages</span>
                          </div>
                          <Progress value={(viewer.pagesViewed / viewer.totalPages) * 100} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity" className="p-4 mt-0">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Activity Timeline</h4>
                  <div className="space-y-0">
                    {activityTimeline.map((activity, index) => (
                      <div key={index} className="flex gap-2.5">
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                              activity.action === "Viewed" && "bg-blue-100 dark:bg-blue-950/50",
                              activity.action === "Shared" && "bg-green-100 dark:bg-green-950/50",
                              activity.action === "Uploaded" && "bg-primary/10"
                            )}
                          >
                            {activity.action === "Viewed" && <Eye className="w-3 h-3 text-blue-600 dark:text-blue-400" />}
                            {activity.action === "Shared" && <Share2 className="w-3 h-3 text-green-600 dark:text-green-400" />}
                            {activity.action === "Uploaded" && <FileText className="w-3 h-3 text-primary" />}
                          </div>
                          {index < activityTimeline.length - 1 && (
                            <div className="w-px flex-1 bg-border my-0.5" />
                          )}
                        </div>
                        <div className="flex-1 pb-3 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-medium">{activity.action}</p>
                            <span className="text-[10px] text-muted-foreground shrink-0">{activity.time}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate">{activity.user}</p>
                          <p className="text-[10px] text-muted-foreground/70">{activity.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

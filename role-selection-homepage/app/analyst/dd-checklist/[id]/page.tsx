"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  Download,
  Mail,
  RotateCw,
  Sparkles,
  Plus,
  MoreHorizontal,
  ChevronDown,
  Check,
  AlertCircle,
  Clock,
  Flag,
  FileText,
  Send,
  Edit,
  Paperclip,
  MessageSquare,
  Zap,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"

const categories = [
  { id: "financial", label: "Financial", icon: "💰", completion: 92 },
  { id: "legal", label: "Legal", icon: "⚖️", completion: 85 },
  { id: "team", label: "Team", icon: "👥", completion: 100 },
  { id: "technical", label: "Technical", icon: "🔧", completion: 60 },
  { id: "commercial", label: "Commercial", icon: "🏪", completion: 75 },
]

const checklistItems = [
  {
    id: 1,
    category: "financial",
    title: "Revenue verification",
    description: "Verify revenue figures from pitch deck against financial statements",
    status: "completed",
    priority: "high",
    attachments: ["Financials.xlsx", "Bank_Statement.pdf"],
    notes: "Verified against bank statements. Revenue matches ±2%",
    aiConfidence: 96,
    verifiedBy: "Arjun Malhotra",
    verifiedDate: "27 Jan 2026",
  },
  {
    id: 2,
    category: "financial",
    title: "Customer concentration analysis",
    description: "Analyze revenue concentration across top customers",
    status: "flagged",
    priority: "high",
    flagged: true,
    flagType: "red",
    flagMessage: "Top 3 customers = 65% of revenue. Risk level: High",
    attachments: ["Customer_List.xlsx"],
    notes: "Need to request customer diversification roadmap",
    aiConfidence: 94,
    flaggedBy: "AI Auto-Detection",
    flaggedDate: "26 Jan 2026",
  },
  {
    id: 3,
    category: "financial",
    title: "Cap table verification",
    description: "Review cap table for accuracy and completeness",
    status: "in-progress",
    priority: "high",
    assignee: "Arjun Malhotra",
    attachments: ["Cap_Table.pdf"],
    notes: "Waiting for updated version with ESOP pool details",
    startedDate: "27 Jan 2026",
  },
  {
    id: 4,
    category: "financial",
    title: "Historical financial audit review",
    description: "Review last 3 years audited financial statements",
    status: "not-started",
    priority: "medium",
    requiredDocuments: ["Audited statements FY23", "FY24", "FY25"],
  },
  {
    id: 5,
    category: "legal",
    title: "Articles of Association review",
    description: "Review company's constitutional documents",
    status: "completed",
    priority: "high",
    attachments: ["AoA.pdf"],
    verifiedBy: "Vikram Mehta",
    verifiedDate: "25 Jan 2026",
  },
  {
    id: 6,
    category: "team",
    title: "Founder background verification",
    description: "Verify founder credentials and track record",
    status: "completed",
    priority: "high",
    verifiedBy: "Priya Sharma",
    verifiedDate: "28 Jan 2026",
  },
]

export default function DDChecklistPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState("all")
  const [openAddItem, setOpenAddItem] = useState(false)
  const [openFlagIssue, setOpenFlagIssue] = useState(false)
  const [openExport, setOpenExport] = useState(false)
  const [openAIScan, setOpenAIScan] = useState(false)
  const [aiScanComplete, setAiScanComplete] = useState(false)
  const [expandedItem, setExpandedItem] = useState<number | null>(null)

  const filteredItems =
    activeCategory === "all"
      ? checklistItems
      : checklistItems.filter((item) => item.category === activeCategory)

  const totalItems = checklistItems.length
  const completedItems = checklistItems.filter((i) => i.status === "completed").length
  const flaggedItems = checklistItems.filter((i) => i.flagged).length
  const overallProgress = Math.round((completedItems / totalItems) * 100)

  const getCategoryStats = (categoryId: string) => {
    const items = checklistItems.filter((i) => i.category === categoryId)
    const completed = items.filter((i) => i.status === "completed").length
    return { total: items.length, completed }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "flagged":
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case "in-progress":
        return <Clock className="w-5 h-5 text-amber-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-slate-400" />
    }
  }

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "flagged":
        return "bg-red-500"
      case "in-progress":
        return "bg-amber-500"
      default:
        return "bg-slate-300"
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="DD Checklist" />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto">
            <div className="p-4 md:p-6">
              <div className="max-w-[1600px] mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="hover:bg-muted"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <h1 className="text-2xl font-semibold">Due Diligence Checklist</h1>
                </div>

                {/* Progress Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg">TechCorp AI - Series A</CardTitle>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">
                            {completedItems} of {totalItems} items complete
                          </span>
                          <span className="text-muted-foreground">
                            {flaggedItems} flagged items
                          </span>
                          <span className="text-muted-foreground">
                            Last updated: 2 hours ago
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant={overallProgress >= 70 ? "default" : "secondary"}
                        className="text-base px-3 py-1"
                      >
                        {overallProgress >= 70 ? "✓ Good" : "In Progress"} {overallProgress}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-teal-500 h-3 rounded-full transition-all"
                          style={{ width: `${overallProgress}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setOpenExport(true)}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <RotateCw className="w-4 h-4 mr-2" />
                    Sync
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setOpenAIScan(true)
                      setAiScanComplete(false)
                    }}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Scan
                  </Button>
                  <Button size="sm" onClick={() => setOpenAddItem(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                {/* Category Tabs */}
                <div className="flex gap-1 flex-wrap border-b">
                  <button
                    onClick={() => setActiveCategory("all")}
                    className={cn(
                      "pb-3 px-2 font-medium text-sm transition-colors border-b-2",
                      activeCategory === "all"
                        ? "border-teal-500 text-teal-600"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    All Items ({overallProgress}%)
                  </button>
                  {categories.map((cat) => {
                    const stats = getCategoryStats(cat.id)
                    const completion = Math.round((stats.completed / stats.total) * 100)
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={cn(
                          "pb-3 px-3 font-medium text-sm transition-colors border-b-2 flex items-center gap-1",
                          activeCategory === cat.id
                            ? "border-teal-500 text-teal-600"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <span>{cat.icon}</span>
                        {cat.label} ({completion}%)
                      </button>
                    )
                  })}
                </div>

                {/* Category Summary Cards (All Items View) */}
                {activeCategory === "all" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {categories.map((cat) => {
                      const stats = getCategoryStats(cat.id)
                      const completion = Math.round((stats.completed / stats.total) * 100)
                      const flagged = checklistItems.filter(
                        (i) => i.category === cat.id && i.flagged
                      ).length
                      return (
                        <Card key={cat.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <span className="text-2xl">{cat.icon}</span>
                            </div>
                            <CardTitle className="text-sm">{cat.label}</CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                              {stats.completed}/{stats.total} items
                            </p>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-teal-500 h-2 rounded-full"
                                style={{ width: `${completion}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium">{completion}%</span>
                              {flagged > 0 && (
                                <span className="text-red-600 font-medium">{flagged} flagged</span>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-xs bg-transparent"
                              onClick={() => setActiveCategory(cat.id)}
                            >
                              View →
                            </Button>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}

                {/* Checklist Items */}
                <div className="space-y-3">
                  {filteredItems.map((item) => (
                    <Card
                      key={item.id}
                      className="overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div
                        className="p-4 space-y-3 cursor-pointer"
                        onClick={() =>
                          setExpandedItem(expandedItem === item.id ? null : item.id)
                        }
                      >
                        {/* Item Header */}
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={item.status === "completed"}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{item.title}</h3>
                              {getStatusIcon(item.status)}
                              {item.status === "flagged" && item.flagType === "red" && (
                                <Badge variant="destructive" className="text-xs">
                                  🔴 High
                                </Badge>
                              )}
                              {item.status === "completed" && (
                                <Badge variant="outline" className="text-xs">
                                  ✓ Completed
                                </Badge>
                              )}
                              {item.status === "in-progress" && (
                                <Badge variant="outline" className="text-xs">
                                  🔄 In Progress
                                </Badge>
                              )}
                              {item.status === "flagged" && (
                                <Badge variant="destructive" className="text-xs">
                                  🚩 Flagged
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Item
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Paperclip className="w-4 h-4 mr-2" />
                                Add Attachment
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Add Note
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setOpenFlagIssue(true)}>
                                <Flag className="w-4 h-4 mr-2" />
                                Flag Issue
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <X className="w-4 h-4 mr-2" />
                                Delete Item
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Expanded Content */}
                        {expandedItem === item.id && (
                          <div className="mt-4 pt-4 border-t space-y-3">
                            {item.attachments && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-2">
                                  📎 Attachments
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {item.attachments.map((att) => (
                                    <Badge key={att} variant="secondary" className="text-xs">
                                      {att}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {item.notes && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1">
                                  📝 Notes
                                </p>
                                <p className="text-sm text-foreground">{item.notes}</p>
                              </div>
                            )}

                            {item.flagMessage && (
                              <div className="bg-red-50 border border-red-200 rounded p-3">
                                <p className="text-xs font-semibold text-red-700 mb-1">
                                  🚩 FLAG: {item.flagMessage}
                                </p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs mt-2 bg-transparent"
                                  onClick={() => setOpenFlagIssue(true)}
                                >
                                  Resolve Flag
                                </Button>
                              </div>
                            )}

                            {item.aiConfidence && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Sparkles className="w-3 h-3" />
                                AI Confidence: {item.aiConfidence}%
                              </div>
                            )}

                            {(item.verifiedBy || item.flaggedBy) && (
                              <div className="text-xs text-muted-foreground">
                                {item.verifiedBy && `Verified by: ${item.verifiedBy} • ${item.verifiedDate}`}
                                {item.flaggedBy && `Flagged by: ${item.flaggedBy} • ${item.flaggedDate}`}
                              </div>
                            )}

                            {item.status === "not-started" && (
                              <div className="flex gap-2 pt-2">
                                <Button size="sm" className="text-xs">
                                  Start
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                  Request Documents
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                  Skip with Reason
                                </Button>
                              </div>
                            )}

                            {item.status === "in-progress" && (
                              <div className="flex gap-2 pt-2">
                                <Button size="sm" className="text-xs">
                                  Mark Complete
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                  Add Note
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs bg-transparent"
                                  onClick={() => setOpenFlagIssue(true)}
                                >
                                  Flag Issue
                                </Button>
                              </div>
                            )}

                            {item.status === "flagged" && (
                              <div className="flex gap-2 pt-2">
                                <Button size="sm" className="text-xs">
                                  Request Info from Founder
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                  Resolve Flag
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                  Add to Risk Register
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Add Item Modal */}
      <Dialog open={openAddItem} onOpenChange={setOpenAddItem}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add DD Checklist Item</DialogTitle>
            <DialogDescription>Create a new checklist item or use a template</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold">Choose Template or Create Custom</p>
              <div className="space-y-2">
                {[
                  { id: "financial", label: "📋 Standard Financial DD - 15 items" },
                  { id: "legal", label: "⚖️ Standard Legal DD - 12 items" },
                  { id: "technical", label: "🔧 Standard Technical DD - 10 items" },
                  { id: "custom", label: "✏️ Custom Item - Create your own" },
                ].map((template) => (
                  <label key={template.id} className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-muted">
                    <input type="radio" name="template" defaultChecked={template.id === "custom"} />
                    <span className="text-sm">{template.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              <div>
                <label className="text-sm font-semibold">Item Title *</label>
                <Input placeholder="e.g., Verify ESOP documentation" className="mt-1" />
              </div>

              <div>
                <label className="text-sm font-semibold">Description</label>
                <Textarea placeholder="Detailed description..." className="mt-1" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold">Category *</label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.icon} {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-semibold">Priority</label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">🔴 High</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                      <SelectItem value="low">🟢 Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddItem(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpenAddItem(false)}>Create Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Flag Issue Modal */}
      <Dialog open={openFlagIssue} onOpenChange={setOpenFlagIssue}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Flag Issue</DialogTitle>
            <DialogDescription>Report a potential red flag or concern</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold">Issue Type *</p>
              {[
                { id: "red", label: "🔴 Red Flag - Critical issue" },
                { id: "yellow", label: "🟡 Yellow Flag - Concern" },
                { id: "green", label: "🟢 Information - Note" },
              ].map((flag) => (
                <label key={flag.id} className="flex items-center gap-3 p-2 border rounded cursor-pointer hover:bg-muted">
                  <input type="radio" name="flagType" defaultChecked={flag.id === "red"} />
                  <span className="text-sm">{flag.label}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="text-sm font-semibold">Issue Description *</label>
              <Textarea placeholder="Describe the issue..." className="mt-1" />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">Risk Assessment</p>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Impact</p>
                  <div className="flex gap-2">
                    {["Low", "Medium", "High"].map((level) => (
                      <Button key={level} size="sm" variant={level === "High" ? "default" : "outline"}>
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Likelihood</p>
                  <div className="flex gap-2">
                    {["Low", "Medium", "High"].map((level) => (
                      <Button key={level} size="sm" variant={level === "Medium" ? "default" : "outline"}>
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenFlagIssue(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpenFlagIssue(false)}>Flag Issue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      <Dialog open={openExport} onOpenChange={setOpenExport}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Export DD Checklist</DialogTitle>
            <DialogDescription>Choose format and options</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold">Format</p>
              {[
                { id: "pdf", label: "📄 PDF Report" },
                { id: "excel", label: "📊 Excel Workbook" },
                { id: "word", label: "📝 Word Document" },
                { id: "email", label: "📧 Email Summary" },
                { id: "link", label: "🔗 Share Link" },
              ].map((format) => (
                <label key={format.id} className="flex items-center gap-3 p-2 border rounded cursor-pointer hover:bg-muted">
                  <input type="radio" name="format" defaultChecked={format.id === "pdf"} />
                  <span className="text-sm">{format.label}</span>
                </label>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">Include</p>
              <div className="space-y-1">
                {[
                  { id: "items", label: "All checklist items" },
                  { id: "notes", label: "Notes and comments" },
                  { id: "flags", label: "Flagged issues summary" },
                  { id: "attachments", label: "Attachments" },
                  { id: "history", label: "Activity history" },
                ].map((option) => (
                  <label key={option.id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox defaultChecked={option.id === "items" || option.id === "notes" || option.id === "flags"} />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenExport(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpenExport(false)}>Export</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Scan Modal */}
      <Dialog open={openAIScan} onOpenChange={setOpenAIScan}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {aiScanComplete ? "✨ AI Red Flag Detection - Results" : "✨ AI Red Flag Detection"}
            </DialogTitle>
          </DialogHeader>

          {!aiScanComplete ? (
            <div className="space-y-4 py-6">
              <p className="text-sm">
                Scanning documents and checklist items for potential issues...
              </p>
              <div className="space-y-3">
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div className="bg-teal-500 h-3 rounded-full" style={{ width: "78%" }} />
                </div>
                <p className="text-xs text-center text-muted-foreground">78%</p>
              </div>
              <div className="space-y-1 text-sm">
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Pitch Deck analyzed
                </p>
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Financials analyzed
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Cap Table analyzing...
                </p>
                <p className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-slate-400" />
                  MoM pending
                </p>
              </div>
              <Button
                onClick={() => setAiScanComplete(true)}
                className="w-full mt-4"
              >
                View Results
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <p className="text-sm font-semibold">Found 3 potential issues:</p>
              {[
                {
                  type: "red",
                  title: "Customer concentration exceeds 40% threshold",
                  detail: "Top 3 customers = 65% revenue",
                  confidence: 94,
                },
                {
                  type: "yellow",
                  title: "Burn rate increase without proportional revenue growth",
                  detail: "Q3 burn +40%, revenue +15%",
                  confidence: 87,
                },
                {
                  type: "yellow",
                  title: "ESOP pool not fully allocated in cap table",
                  detail: "5% reserved but only 2% allocated",
                  confidence: 91,
                },
              ].map((issue, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "p-3 border rounded",
                    issue.type === "red" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
                  )}
                >
                  <p className="text-sm font-semibold mb-1">
                    {issue.type === "red" ? "🔴" : "🟡"} {issue.type.toUpperCase()} RISK
                  </p>
                  <p className="text-sm font-medium mb-1">{issue.title}</p>
                  <p className="text-xs text-muted-foreground mb-2">{issue.detail}</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Confidence: {issue.confidence}%
                  </p>
                  <Button size="sm" className="text-xs">
                    Add to Checklist
                  </Button>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            {aiScanComplete && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setOpenAIScan(false)}
                >
                  Dismiss All
                </Button>
                <Button onClick={() => setOpenAIScan(false)}>
                  Add All to Checklist
                </Button>
              </>
            )}
            {!aiScanComplete && (
              <Button variant="outline" onClick={() => setOpenAIScan(false)}>
                Cancel
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  )
}

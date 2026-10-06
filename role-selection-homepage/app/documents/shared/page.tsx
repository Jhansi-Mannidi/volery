"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { exportToCsv } from "@/lib/export-utils"
import {
  AlertTriangle,
  Calendar,
  ChevronRight,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  FolderOpen,
  Grid3X3,
  LayoutList,
  Link2,
  Lock,
  Mail,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Table2,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Toaster } from "@/components/ui/toaster"

// Types
interface SharedLink {
  id: string
  document: {
    name: string
    type: "pitch-deck" | "financial-model" | "term-sheet" | "data-room" | "other"
    fileCount?: number
  }
  sharedWith: {
    name: string
    contact?: string
    count?: number
  }
  status: "active" | "expired" | "expiring" | "revoked"
  protection: {
    password: boolean
    emailRequired: boolean
    ndaRequired: boolean
    watermarked: boolean
    downloadAllowed: boolean
  }
  link: string
  createdBy: { name: string; initials: string }
  createdAt: string
  expiresAt: string | null
  daysRemaining: number | null
  stats: {
    views: number
    uniqueViewers: number
    avgTime: string
    downloads: number
  }
  lastActivity?: {
    action: string
    time: string
  }
}

// Mock data
const sharedLinks: SharedLink[] = [
  {
    id: "1",
    document: { name: "TechCorp AI - Pitch Deck v3.pdf", type: "pitch-deck" },
    sharedWith: { name: "Sequoia Capital", contact: "Rajan Anandan" },
    status: "active",
    protection: { password: true, emailRequired: false, ndaRequired: false, watermarked: false, downloadAllowed: true },
    link: "volery.co/s/x7k9p2m",
    createdBy: { name: "Priya Sharma", initials: "PS" },
    createdAt: "Jan 20, 2026",
    expiresAt: "Jan 27, 2026",
    daysRemaining: 5,
    stats: { views: 12, uniqueViewers: 4, avgTime: "8 min", downloads: 2 },
    lastActivity: { action: "Rajan viewed pages 3-8", time: "2 hours ago" },
  },
  {
    id: "2",
    document: { name: "GreenEnergy_Financial_Model_2026.xlsx", type: "financial-model" },
    sharedWith: { name: "Accel Partners", contact: "Prashanth P." },
    status: "active",
    protection: { password: false, emailRequired: false, ndaRequired: false, watermarked: false, downloadAllowed: false },
    link: "volery.co/s/m3n8k1j",
    createdBy: { name: "Rahul Mehta", initials: "RM" },
    createdAt: "Jan 18, 2026",
    expiresAt: "Feb 1, 2026",
    daysRemaining: 12,
    stats: { views: 8, uniqueViewers: 2, avgTime: "15 min", downloads: 0 },
    lastActivity: { action: "Prashanth viewed all pages", time: "1 day ago" },
  },
  {
    id: "3",
    document: { name: "HealthX Complete Data Room", type: "data-room", fileCount: 28 },
    sharedWith: { name: "Multiple Investors", count: 5 },
    status: "active",
    protection: { password: true, emailRequired: true, ndaRequired: true, watermarked: true, downloadAllowed: true },
    link: "volery.co/s/dataroom/healthx",
    createdBy: { name: "Amit Patel", initials: "AP" },
    createdAt: "Jan 10, 2026",
    expiresAt: null,
    daysRemaining: null,
    stats: { views: 45, uniqueViewers: 12, avgTime: "22 min", downloads: 8 },
    lastActivity: { action: "Multiple views", time: "30 min ago" },
  },
  {
    id: "4",
    document: { name: "EduLearn_TermSheet_Draft_v2.pdf", type: "term-sheet" },
    sharedWith: { name: "Blume Ventures", contact: "Karthik Reddy" },
    status: "expiring",
    protection: { password: false, emailRequired: false, ndaRequired: false, watermarked: false, downloadAllowed: true },
    link: "volery.co/s/p9q2r5t",
    createdBy: { name: "Priya Sharma", initials: "PS" },
    createdAt: "Jan 15, 2026",
    expiresAt: "Jan 26, 2026",
    daysRemaining: 2,
    stats: { views: 3, uniqueViewers: 1, avgTime: "5 min", downloads: 1 },
    lastActivity: { action: "Karthik viewed once", time: "3 days ago" },
  },
  {
    id: "5",
    document: { name: "LogiFlow_Q4_Investor_Update.pdf", type: "pitch-deck" },
    sharedWith: { name: "Multiple Investors", count: 8 },
    status: "expired",
    protection: { password: true, emailRequired: false, ndaRequired: false, watermarked: false, downloadAllowed: true },
    link: "volery.co/s/k2l5m8n",
    createdBy: { name: "Rahul Mehta", initials: "RM" },
    createdAt: "Dec 15, 2025",
    expiresAt: "Jan 15, 2026",
    daysRemaining: -9,
    stats: { views: 34, uniqueViewers: 8, avgTime: "6 min", downloads: 5 },
  },
  {
    id: "6",
    document: { name: "FinSecure_Financial_Projections.xlsx", type: "financial-model" },
    sharedWith: { name: "Matrix Partners", contact: "Avnish Bajaj" },
    status: "expiring",
    protection: { password: false, emailRequired: true, ndaRequired: false, watermarked: false, downloadAllowed: true },
    link: "volery.co/s/f5g7h9k",
    createdBy: { name: "Amit Patel", initials: "AP" },
    createdAt: "Jan 19, 2026",
    expiresAt: "Jan 29, 2026",
    daysRemaining: 5,
    stats: { views: 6, uniqueViewers: 2, avgTime: "12 min", downloads: 1 },
    lastActivity: { action: "Downloaded PDF", time: "yesterday" },
  },
  {
    id: "7",
    document: { name: "RetailAI_Pitch_Deck_Final.pdf", type: "pitch-deck" },
    sharedWith: { name: "Lightspeed India", contact: "Dev Khare" },
    status: "expiring",
    protection: { password: true, emailRequired: false, ndaRequired: false, watermarked: true, downloadAllowed: false },
    link: "volery.co/s/r4t6y8u",
    createdBy: { name: "Priya Sharma", initials: "PS" },
    createdAt: "Jan 17, 2026",
    expiresAt: "Jan 30, 2026",
    daysRemaining: 6,
    stats: { views: 15, uniqueViewers: 3, avgTime: "10 min", downloads: 0 },
    lastActivity: { action: "Dev viewed team slide", time: "5 hours ago" },
  },
]

type ViewMode = "cards" | "list" | "table"

function getDocumentIcon(type: SharedLink["document"]["type"]) {
  switch (type) {
    case "pitch-deck":
      return <FileText className="w-5 h-5 text-primary" />
    case "financial-model":
      return <FileSpreadsheet className="w-5 h-5 text-green-600" />
    case "term-sheet":
      return <FileText className="w-5 h-5 text-amber-600" />
    case "data-room":
      return <FolderOpen className="w-5 h-5 text-purple-600" />
    default:
      return <FileText className="w-5 h-5 text-muted-foreground" />
  }
}

function getStatusBadge(status: SharedLink["status"]) {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
          Active
        </Badge>
      )
    case "expiring":
      return (
        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Expiring Soon
        </Badge>
      )
    case "expired":
      return (
        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0">
          Expired
        </Badge>
      )
    case "revoked":
      return (
        <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border-0">
          Revoked
        </Badge>
      )
  }
}

export default function SharedLinksPage() {
  const { toast } = useToast()
  const [links, setLinks] = useState<SharedLink[]>(() => [...sharedLinks])
  const [viewMode, setViewMode] = useState<ViewMode>("cards")
  const [searchQuery, setSearchQuery] = useState("")
  const [documentFilter, setDocumentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editLink, setEditLink] = useState<SharedLink | null>(null)
  const [analyticsOpen, setAnalyticsOpen] = useState(false)
  const [activityLogOpen, setActivityLogOpen] = useState(false)
  const [selectedLink, setSelectedLink] = useState<SharedLink | null>(null)
  const [selectedLinks, setSelectedLinks] = useState<string[]>([])
  const [revokeConfirm, setRevokeConfirm] = useState<{ type: "selected" | "expired"; ids?: string[] } | null>(null)

  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      link.document.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.sharedWith.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDocument = documentFilter === "all" || link.document.type === documentFilter
    const matchesStatus = statusFilter === "all" || link.status === statusFilter
    return matchesSearch && matchesDocument && matchesStatus
  })

  const activeLinks = links.filter((l) => l.status === "active" || l.status === "expiring").length
  const totalViews = links.reduce((sum, l) => sum + l.stats.views, 0)
  const uniqueViewers = links.reduce((sum, l) => sum + l.stats.uniqueViewers, 0)
  const expiringLinks = links.filter((l) => l.status === "expiring").length
  const expiredLinks = links.filter((l) => l.status === "expired")

  const handleViewAnalytics = (link: SharedLink) => {
    setSelectedLink(link)
    setAnalyticsOpen(true)
  }

  const toggleSelectLink = (id: string) => {
    setSelectedLinks((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    )
  }

  const copyLink = (linkUrl: string) => {
    navigator.clipboard.writeText(`https://${linkUrl}`)
    toast({ title: "Link copied", description: "Share link copied to clipboard." })
  }

  const extendLink = (id: string) => {
    setLinks((prev) =>
      prev.map((l) =>
        l.id === id && l.daysRemaining != null
          ? { ...l, daysRemaining: l.daysRemaining + 7 }
          : l
      )
    )
    toast({ title: "Link extended", description: "Expiration extended by 7 days." })
  }

  const revokeLink = (id: string) => {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, status: "revoked" as const } : l)))
    setSelectedLinks((prev) => prev.filter((x) => x !== id))
    toast({ title: "Access revoked", description: "Shared link has been revoked.", variant: "destructive" })
  }

  const handleExtendAll = (ids?: string[]) => {
    const targetIds = ids ?? (selectedLinks.length > 0 ? selectedLinks : links.filter((l) => l.status === "expiring").map((l) => l.id))
    setLinks((prev) =>
      prev.map((l) =>
        targetIds.includes(l.id) && l.daysRemaining != null
          ? { ...l, daysRemaining: l.daysRemaining + 7 }
          : l
      )
    )
    toast({ title: "Links extended", description: `${targetIds.length} link(s) extended by 7 days.` })
  }

  const handleRevokeConfirmed = () => {
    if (!revokeConfirm) return
    if (revokeConfirm.type === "selected" && revokeConfirm.ids?.length) {
      setLinks((prev) =>
        prev.map((l) => (revokeConfirm.ids!.includes(l.id) ? { ...l, status: "revoked" as const } : l))
      )
      setSelectedLinks([])
      toast({ title: "Access revoked", description: `${revokeConfirm.ids.length} link(s) revoked.`, variant: "destructive" })
    } else if (revokeConfirm.type === "expired") {
      const expiredIds = links.filter((l) => l.status === "expired").map((l) => l.id)
      setLinks((prev) => prev.map((l) => (l.status === "expired" ? { ...l, status: "revoked" as const } : l)))
      toast({ title: "Expired links revoked", description: `${expiredIds.length} expired link(s) revoked.`, variant: "destructive" })
    }
    setRevokeConfirm(null)
  }

  const handleExportReport = () => {
    const headers = ["Document", "Shared With", "Status", "Views", "Unique Viewers", "Avg Time", "Downloads", "Created", "Expires"]
    const rows = filteredLinks.map((l) => [
      l.document.name,
      l.sharedWith.name,
      l.status,
      l.stats.views,
      l.stats.uniqueViewers,
      l.stats.avgTime,
      l.stats.downloads,
      l.createdAt,
      l.expiresAt ?? "Never",
    ])
    exportToCsv({
      headers,
      rows,
      filename: `shared-links-report-${new Date().toISOString().slice(0, 10)}.csv`,
    })
    toast({ title: "Report exported", description: "Shared links report downloaded as CSV." })
  }

  const handleSaveEditLink = (updated: Partial<SharedLink["protection"]> & { daysRemaining?: number | null; sharedWithName?: string }) => {
    if (!editLink) return
    const { daysRemaining: newDays, sharedWithName: newSharedWith, ...protectionUpdates } = updated
    setLinks((prev) =>
      prev.map((l) =>
        l.id === editLink.id
          ? {
              ...l,
              protection: { ...l.protection, ...protectionUpdates },
              daysRemaining: newDays !== undefined ? newDays : l.daysRemaining,
              sharedWith: newSharedWith !== undefined ? { ...l.sharedWith, name: newSharedWith } : l.sharedWith,
            }
          : l
      )
    )
    setEditLink(null)
    toast({ title: "Link updated", description: "Shared link settings have been saved." })
  }

  const handleExportSelected = () => {
    const ids = selectedLinks.length > 0 ? selectedLinks : filteredLinks.map((l) => l.id)
    const toExport = links.filter((l) => ids.includes(l.id))
    const headers = ["Document", "Shared With", "Status", "Views", "Unique Viewers", "Avg Time", "Downloads"]
    const rows = toExport.map((l) => [
      l.document.name,
      l.sharedWith.name,
      l.status,
      l.stats.views,
      l.stats.uniqueViewers,
      l.stats.avgTime,
      l.stats.downloads,
    ])
    exportToCsv({ headers, rows, filename: `shared-links-export-${new Date().toISOString().slice(0, 10)}.csv` })
    toast({ title: "Export complete", description: `${toExport.length} link(s) exported.` })
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader title="Shared Links" />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 overflow-auto">
          {/* Breadcrumb */}
          <div className="border-b bg-card px-4 md:px-6 py-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/role-selection" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/documents" className="hover:text-foreground transition-colors">Documents</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">Shared Links</span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="border-b bg-card px-4 md:px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-background">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{activeLinks}</p>
                  <p className="text-xs text-muted-foreground">Active Links</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-background">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalViews}</p>
                  <p className="text-xs text-muted-foreground">Total Views</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-background">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{uniqueViewers}</p>
                  <p className="text-xs text-muted-foreground">Unique Viewers</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-background">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{expiringLinks}</p>
                  <p className="text-xs text-muted-foreground">Expiring Soon</p>
                </div>
              </div>
            </div>
          </div>

          {/* Page Header */}
          <div className="border-b bg-card px-4 md:px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Shared Links</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeLinks} active shared links
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* View Toggle */}
                <div className="flex items-center border border-border rounded-lg p-1 bg-muted/30">
                  <Button
                    variant={viewMode === "cards" ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-md"
                    onClick={() => setViewMode("cards")}
                    aria-label="Cards view"
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
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-md"
                    onClick={() => setViewMode("table")}
                    aria-label="Table view"
                  >
                    <Table2 className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => setCreateModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Create Link
                </Button>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 mt-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search links..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Select value={documentFilter} onValueChange={setDocumentFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="All Documents" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Documents</SelectItem>
                    <SelectItem value="pitch-deck">Pitch Decks</SelectItem>
                    <SelectItem value="financial-model">Financial Models</SelectItem>
                    <SelectItem value="term-sheet">Term Sheets</SelectItem>
                    <SelectItem value="data-room">Data Rooms</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expiring">Expiring Soon</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="revoked">Revoked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedLinks.length > 0 && (
            <div className="border-b bg-primary/5 px-4 md:px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedLinks.length === filteredLinks.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedLinks(filteredLinks.map((l) => l.id))
                      } else {
                        setSelectedLinks([])
                      }
                    }}
                  />
                  <span className="text-sm font-medium">{selectedLinks.length} selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="bg-transparent" onClick={() => handleExtendAll(selectedLinks)}>
                    <RefreshCw className="w-4 h-4 mr-1.5" />
                    Extend All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent text-destructive border-destructive/50"
                    onClick={() => setRevokeConfirm({ type: "selected", ids: selectedLinks })}
                  >
                    <X className="w-4 h-4 mr-1.5" />
                    Revoke All
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent" onClick={handleExportSelected}>
                    <Download className="w-4 h-4 mr-1.5" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex gap-6 p-4 md:p-6">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {viewMode === "cards" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredLinks.map((link) => (
                    <SharedLinkCard
                      key={link.id}
                      link={link}
                      selected={selectedLinks.includes(link.id)}
                      onToggleSelect={() => toggleSelectLink(link.id)}
                      onViewAnalytics={() => handleViewAnalytics(link)}
                      onCopyLink={() => copyLink(link.link)}
                      onExtend={() => extendLink(link.id)}
                      onRevoke={() => revokeLink(link.id)}
                      onEdit={() => setEditLink(link)}
                    />
                  ))}
                </div>
              )}

              {viewMode === "list" && (
                <div className="space-y-3">
                  {filteredLinks.map((link) => (
                    <SharedLinkListItem
                      key={link.id}
                      link={link}
                      selected={selectedLinks.includes(link.id)}
                      onToggleSelect={() => toggleSelectLink(link.id)}
                      onViewAnalytics={() => handleViewAnalytics(link)}
                      onCopyLink={() => copyLink(link.link)}
                      onExtend={() => extendLink(link.id)}
                      onRevoke={() => revokeLink(link.id)}
                      onEdit={() => setEditLink(link)}
                    />
                  ))}
                </div>
              )}

              {viewMode === "table" && (
                <div className="rounded-lg border bg-card overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[40px]">
                          <Checkbox
                            checked={selectedLinks.length === filteredLinks.length && filteredLinks.length > 0}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedLinks(filteredLinks.map((l) => l.id))
                              } else {
                                setSelectedLinks([])
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Document</TableHead>
                        <TableHead>Shared With</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Last Viewed</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLinks.map((link) => (
                        <SharedLinkTableRow
                          key={link.id}
                          link={link}
                          selected={selectedLinks.includes(link.id)}
                          onToggleSelect={() => toggleSelectLink(link.id)}
                          onViewAnalytics={() => handleViewAnalytics(link)}
                          onCopyLink={() => copyLink(link.link)}
                          onExtend={() => extendLink(link.id)}
                          onRevoke={() => revokeLink(link.id)}
                          onEdit={() => setEditLink(link)}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {filteredLinks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Link2 className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-1">No shared links found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create shareable links to securely share documents with investors
                  </p>
                  <Button onClick={() => setCreateModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-1.5" />
                    Create Your First Link
                  </Button>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="hidden xl:block w-80 shrink-0 space-y-4">
              {/* Link Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Link Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Active links</span>
                    <span className="font-medium">{activeLinks}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Views this week</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Most viewed</span>
                    <span className="font-medium truncate max-w-[120px]">TechCorp Deck</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                    <Link href="/documents/analytics">View All Analytics</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Expiring Soon */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Expiring Soon
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {links
                    .filter((l) => l.status === "expiring")
                    .slice(0, 3)
                    .map((link) => (
                      <div key={link.id} className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-amber-900 dark:text-amber-100 truncate">{link.document.name.split("_")[0]}</p>
                          <p className="text-xs text-amber-700 dark:text-amber-300">{link.daysRemaining} days left</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="shrink-0 h-7 text-xs text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100"
                          onClick={() => extendLink(link.id)}
                        >
                          Extend
                        </Button>
                      </div>
                    ))}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => handleExtendAll()}>
                      Extend All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => toast({ title: "Review expiring", description: `${expiringLinks} link(s) expiring soon. Use Extend to renew.` })}
                    >
                      Review
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {links
                    .filter((l) => l.lastActivity)
                    .slice(0, 3)
                    .map((link) => (
                      <div key={link.id} className="flex items-start gap-2">
                        <Avatar className="w-6 h-6 shrink-0">
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                            {link.sharedWith.contact?.split(" ").map((n) => n[0]).join("") || "??"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm text-foreground truncate">{link.lastActivity?.action}</p>
                          <p className="text-xs text-muted-foreground">{link.lastActivity?.time}</p>
                        </div>
                      </div>
                    ))}
                  <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={() => setActivityLogOpen(true)}>
                    View Activity Log
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => { setCreateModalOpen(true); toast({ title: "Create links", description: "Add multiple documents in the next step." }) }}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Create bulk links
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => expiredLinks.length > 0 ? setRevokeConfirm({ type: "expired" }) : toast({ title: "No expired links", description: "There are no expired links to revoke." })}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Revoke all expired
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" onClick={handleExportReport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export link report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Create Link Modal */}
      <CreateLinkModal open={createModalOpen} onOpenChange={setCreateModalOpen} />

      {/* Edit Link Modal */}
      <EditLinkModal
        open={!!editLink}
        link={editLink}
        onOpenChange={(open) => !open && setEditLink(null)}
        onSave={handleSaveEditLink}
      />

      {/* Analytics Panel */}
      <LinkAnalyticsPanel
        open={analyticsOpen}
        onOpenChange={setAnalyticsOpen}
        link={selectedLink}
      />

      {/* Revoke confirmation */}
      <AlertDialog open={!!revokeConfirm} onOpenChange={(open) => !open && setRevokeConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {revokeConfirm?.type === "expired" ? "Revoke all expired links?" : "Revoke selected links?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {revokeConfirm?.type === "expired"
                ? `This will revoke ${expiredLinks.length} expired link(s). Recipients will no longer be able to access them.`
                : "Selected links will be revoked. Recipients will no longer be able to access these documents."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevokeConfirmed} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Activity Log sheet */}
      <Sheet open={activityLogOpen} onOpenChange={setActivityLogOpen}>
        <SheetContent className="w-[400px] sm:max-w-[400px] overflow-y-auto p-8">
          <SheetHeader>
            <SheetTitle>Activity Log</SheetTitle>
          </SheetHeader>
          <div className="space-y-3 py-4">
            {links
              .filter((l) => l.lastActivity)
              .map((link) => (
                <div key={link.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{link.document.name}</p>
                    <p className="text-xs text-muted-foreground">{link.lastActivity?.action}</p>
                    <p className="text-xs text-muted-foreground">{link.lastActivity?.time}</p>
                  </div>
                </div>
              ))}
            {links.filter((l) => l.lastActivity).length === 0 && (
              <p className="text-sm text-muted-foreground py-4">No recent activity.</p>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Toaster />
    </div>
  )
}

// Shared Link Card Component
interface SharedLinkCardProps {
  link: SharedLink
  selected: boolean
  onToggleSelect: () => void
  onViewAnalytics: () => void
  onCopyLink: () => void
  onExtend: () => void
  onRevoke: () => void
  onEdit: () => void
}

function SharedLinkCard({ link, selected, onToggleSelect, onViewAnalytics, onCopyLink, onExtend, onRevoke, onEdit }: SharedLinkCardProps) {
  return (
    <Card className={cn(
      "group hover:shadow-md transition-all overflow-hidden",
      link.status === "expired" && "opacity-60",
      link.status === "expiring" && "border-amber-300 dark:border-amber-700"
    )}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Checkbox
            checked={selected}
            onCheckedChange={() => onToggleSelect()}
            className="mt-1"
          />
          <div className="w-10 h-10 rounded-lg bg-muted/50 border flex items-center justify-center shrink-0">
            {getDocumentIcon(link.document.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-foreground truncate">{link.document.name}</span>
              {link.protection.password && <Lock className="w-3 h-3 text-muted-foreground shrink-0" />}
            </div>
            <p className="text-xs text-muted-foreground">
              Shared with: {link.sharedWith.name}
              {link.sharedWith.contact && ` (@${link.sharedWith.contact.split(" ")[0]})`}
              {link.sharedWith.count && ` (${link.sharedWith.count} investors)`}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onExtend}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Extend
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={onRevoke}>
                <Trash2 className="w-4 h-4 mr-2" />
                Revoke Access
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mt-4 p-2 bg-muted/50 rounded-lg">
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">{link.stats.views}</p>
            <p className="text-[10px] text-muted-foreground">Views</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">{link.stats.uniqueViewers}</p>
            <p className="text-[10px] text-muted-foreground">Unique</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">{link.stats.avgTime}</p>
            <p className="text-[10px] text-muted-foreground">Avg Time</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">{link.stats.downloads}</p>
            <p className="text-[10px] text-muted-foreground">Downloads</p>
          </div>
        </div>

        {/* Link */}
        <div className="flex items-center gap-2 mt-3 p-2 bg-muted/30 rounded-lg">
          <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground truncate flex-1">{link.link}</span>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs shrink-0" onClick={onCopyLink}>
            <Copy className="w-3 h-3 mr-1" />
            Copy
          </Button>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <span>Created: {link.createdAt}</span>
          <span>
            {link.expiresAt ? (
              link.daysRemaining && link.daysRemaining > 0 ? (
                <span className={cn(link.daysRemaining <= 7 && "text-amber-600")}>
                  Expires in {link.daysRemaining} days
                </span>
              ) : (
                <span className="text-red-600">Expired</span>
              )
            ) : (
              "Never expires"
            )}
          </span>
        </div>

        {/* Protection badges */}
        <div className="flex flex-wrap gap-1 mt-3">
          {link.protection.password && (
            <Badge variant="secondary" className="text-[10px] px-1.5">
              <Lock className="w-3 h-3 mr-1" />
              Password
            </Badge>
          )}
          {link.protection.emailRequired && (
            <Badge variant="secondary" className="text-[10px] px-1.5">
              <Mail className="w-3 h-3 mr-1" />
              Email
            </Badge>
          )}
          {link.protection.ndaRequired && (
            <Badge variant="secondary" className="text-[10px] px-1.5">
              <Shield className="w-3 h-3 mr-1" />
              NDA
            </Badge>
          )}
          {link.protection.watermarked && (
            <Badge variant="secondary" className="text-[10px] px-1.5">
              Watermarked
            </Badge>
          )}
        </div>

        {/* Last Activity */}
        {link.lastActivity && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              Last: {link.lastActivity.action} ({link.lastActivity.time})
            </p>
          </div>
        )}

        {/* Status & Actions */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          {getStatusBadge(link.status)}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent" onClick={onViewAnalytics}>
              Analytics
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent" onClick={onEdit}>
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Shared Link List Item Component
function SharedLinkListItem({ link, selected, onToggleSelect, onViewAnalytics, onCopyLink, onExtend, onRevoke, onEdit }: SharedLinkCardProps) {
  return (
    <Card className={cn(
      "hover:shadow-sm transition-all",
      link.status === "expired" && "opacity-60",
      link.status === "expiring" && "border-l-4 border-l-amber-500"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Checkbox
            checked={selected}
            onCheckedChange={() => onToggleSelect()}
          />
          <div className="w-10 h-10 rounded-lg bg-muted/50 border flex items-center justify-center shrink-0">
            {getDocumentIcon(link.document.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground truncate">{link.document.name}</span>
              {link.protection.password && <Lock className="w-3 h-3 text-muted-foreground" />}
              {getStatusBadge(link.status)}
            </div>
            <p className="text-sm text-muted-foreground">
              Shared with: {link.sharedWith.name}
              {link.sharedWith.contact && ` (@${link.sharedWith.contact.split(" ")[0]})`}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <div className="text-center">
              <p className="font-medium text-foreground">{link.stats.views}</p>
              <p className="text-xs">Views</p>
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">{link.lastActivity?.time || "-"}</p>
              <p className="text-xs">Last Viewed</p>
            </div>
            <div className="text-center">
              <p className={cn("font-medium", link.daysRemaining && link.daysRemaining <= 7 ? "text-amber-600" : "text-foreground")}>
                {link.daysRemaining ? `${link.daysRemaining} days` : "Never"}
              </p>
              <p className="text-xs">Expires</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCopyLink}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent" onClick={onViewAnalytics}>
              Analytics
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>Edit Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={onExtend}>Extend</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={onRevoke}>Revoke Access</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Table Row Component
function SharedLinkTableRow({ link, selected, onToggleSelect, onViewAnalytics, onCopyLink, onExtend, onRevoke, onEdit }: SharedLinkCardProps) {
  return (
    <TableRow className={cn(
      "hover:bg-muted/50",
      link.status === "expired" && "opacity-60"
    )}>
      <TableCell>
        <Checkbox checked={selected} onCheckedChange={() => onToggleSelect()} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {getDocumentIcon(link.document.type)}
          <div className="min-w-0">
            <span className="font-medium text-foreground truncate block max-w-[200px]">{link.document.name}</span>
            {link.protection.password && <Lock className="w-3 h-3 text-muted-foreground inline ml-1" />}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <span className="text-foreground">{link.sharedWith.name}</span>
          {link.sharedWith.contact && (
            <span className="text-muted-foreground text-xs block">@{link.sharedWith.contact}</span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-center">{link.stats.views}</TableCell>
      <TableCell>{link.lastActivity?.time || "-"}</TableCell>
      <TableCell>
        <span className={cn(
          link.daysRemaining && link.daysRemaining <= 7 && "text-amber-600 font-medium"
        )}>
          {link.daysRemaining ? `${link.daysRemaining} days` : "Never"}
        </span>
      </TableCell>
      <TableCell>{getStatusBadge(link.status)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onCopyLink}>
            <Copy className="w-3 h-3" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onViewAnalytics}>View Analytics</DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>Edit Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={onExtend}>Extend</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={onRevoke}>Revoke</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  )
}

// Create Link Modal
function CreateLinkModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [expiration, setExpiration] = useState("7")
  const { toast } = useToast()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Shared Link</DialogTitle>
          <DialogDescription>
            Create a secure link to share documents with external parties
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Document Selection */}
          <div className="space-y-2">
            <Label>Select Document(s)</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search documents..." className="pl-9" />
            </div>
            <div className="space-y-2 max-h-[150px] overflow-y-auto border rounded-lg p-2">
              <div className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded">
                <Checkbox />
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm">TechCorp AI - Pitch Deck v3.pdf</span>
              </div>
              <div className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded">
                <Checkbox />
                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                <span className="text-sm">TechCorp AI - Financial Model</span>
              </div>
            </div>
          </div>

          {/* Share With */}
          <div className="space-y-2">
            <Label>Share With (Optional)</Label>
            <Input placeholder="Enter name or email..." />
            <p className="text-xs text-muted-foreground">
              Suggested: Rajan Anandan (Sequoia), Prashanth P. (Accel)
            </p>
          </div>

          {/* Expiration */}
          <div className="space-y-2">
            <Label>Expiration</Label>
            <RadioGroup value={expiration} onValueChange={setExpiration} className="flex flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="7" id="7days" />
                <Label htmlFor="7days" className="text-sm font-normal">7 days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="14" id="14days" />
                <Label htmlFor="14days" className="text-sm font-normal">14 days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="30" id="30days" />
                <Label htmlFor="30days" className="text-sm font-normal">30 days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="never" id="never" />
                <Label htmlFor="never" className="text-sm font-normal">Never</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Security */}
          <div className="space-y-3">
            <Label>Security</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-normal">Require password</Label>
                <Switch id="password" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email" className="text-sm font-normal">Require email to view</Label>
                <Switch id="email" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="nda" className="text-sm font-normal">Require NDA acceptance</Label>
                <Switch id="nda" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="watermark" className="text-sm font-normal">Add watermark with viewer info</Label>
                <Switch id="watermark" />
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-2">
            <Label>Permissions</Label>
            <RadioGroup defaultValue="view" className="space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="view" id="view" />
                <Label htmlFor="view" className="text-sm font-normal">View only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="download" id="download" />
                <Label htmlFor="download" className="text-sm font-normal">View + Download</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="print" id="print" />
                <Label htmlFor="print" className="text-sm font-normal">View + Download + Print</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Notifications */}
          <div className="space-y-2">
            <Label>Notifications</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox id="notify-view" defaultChecked />
                <Label htmlFor="notify-view" className="text-sm font-normal">Notify me when link is first viewed</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="notify-download" defaultChecked />
                <Label htmlFor="notify-download" className="text-sm font-normal">Notify me when document is downloaded</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="notify-daily" />
                <Label htmlFor="notify-daily" className="text-sm font-normal">Send daily view summary</Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false)
              toast({ title: "Link created", description: "Share link has been created. Recipients can access the document." })
            }}
          >
            Create Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Edit Link Modal
function EditLinkModal({
  open,
  link,
  onOpenChange,
  onSave,
}: {
  open: boolean
  link: SharedLink | null
  onOpenChange: (open: boolean) => void
  onSave: (updated: Partial<SharedLink["protection"]> & { daysRemaining?: number | null; sharedWithName?: string }) => void
}) {
  const [sharedWithName, setSharedWithName] = useState("")
  const [password, setPassword] = useState(false)
  const [emailRequired, setEmailRequired] = useState(false)
  const [ndaRequired, setNdaRequired] = useState(false)
  const [watermarked, setWatermarked] = useState(false)
  const [downloadAllowed, setDownloadAllowed] = useState(false)
  const [extendDays, setExtendDays] = useState<string>("7")

  useEffect(() => {
    if (link) {
      setSharedWithName(link.sharedWith.name)
      setPassword(link.protection.password)
      setEmailRequired(link.protection.emailRequired)
      setNdaRequired(link.protection.ndaRequired)
      setWatermarked(link.protection.watermarked)
      setDownloadAllowed(link.protection.downloadAllowed)
      setExtendDays("7")
    }
  }, [link?.id, open])

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setExtendDays("7")
    }
    onOpenChange(next)
  }

  const handleSave = () => {
    if (!link) return
    const newDays = link.daysRemaining != null ? link.daysRemaining + parseInt(extendDays, 10) : parseInt(extendDays, 10)
    onSave({
      password,
      emailRequired,
      ndaRequired,
      watermarked,
      downloadAllowed,
      daysRemaining: newDays,
      sharedWithName: sharedWithName.trim() || undefined,
    })
    handleOpenChange(false)
  }

  if (!link) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Shared Link</DialogTitle>
          <DialogDescription>
            Update settings for this shared link. Changes apply immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Document (read-only) */}
          <div className="space-y-2">
            <Label>Document</Label>
            <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/30">
              <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-medium truncate">{link.document.name}</span>
            </div>
          </div>

          {/* Share With */}
          <div className="space-y-2">
            <Label>Shared with</Label>
            <Input
              placeholder="Name or company"
              value={sharedWithName}
              onChange={(e) => setSharedWithName(e.target.value)}
            />
          </div>

          {/* Extend expiration */}
          <div className="space-y-2">
            <Label>Extend expiration by</Label>
            <RadioGroup value={extendDays} onValueChange={setExtendDays} className="flex flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="7" id="edit-7" />
                <Label htmlFor="edit-7" className="text-sm font-normal">7 days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="14" id="edit-14" />
                <Label htmlFor="edit-14" className="text-sm font-normal">14 days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="30" id="edit-30" />
                <Label htmlFor="edit-30" className="text-sm font-normal">30 days</Label>
              </div>
            </RadioGroup>
            {link.daysRemaining != null && (
              <p className="text-xs text-muted-foreground">Current: {link.daysRemaining} days remaining</p>
            )}
          </div>

          {/* Security */}
          <div className="space-y-3">
            <Label>Security</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-password" className="text-sm font-normal">Require password</Label>
                <Switch id="edit-password" checked={password} onCheckedChange={setPassword} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-email" className="text-sm font-normal">Require email to view</Label>
                <Switch id="edit-email" checked={emailRequired} onCheckedChange={setEmailRequired} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-nda" className="text-sm font-normal">Require NDA acceptance</Label>
                <Switch id="edit-nda" checked={ndaRequired} onCheckedChange={setNdaRequired} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-watermark" className="text-sm font-normal">Add watermark with viewer info</Label>
                <Switch id="edit-watermark" checked={watermarked} onCheckedChange={setWatermarked} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-download" className="text-sm font-normal">Allow download</Label>
                <Switch id="edit-download" checked={downloadAllowed} onCheckedChange={setDownloadAllowed} />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} className="bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Link Analytics Panel
function LinkAnalyticsPanel({ open, onOpenChange, link }: { open: boolean; onOpenChange: (open: boolean) => void; link: SharedLink | null }) {
  const { toast } = useToast()
  if (!link) return null

  const handleExportCsv = () => {
    const rows: (string | number)[][] = [
      ["Document", link.document.name],
      ["Views", link.stats.views],
      ["Unique Viewers", link.stats.uniqueViewers],
      ["Avg Time", link.stats.avgTime],
      ["Downloads", link.stats.downloads],
    ]
    exportToCsv({
      headers: ["Metric", "Value"],
      rows,
      filename: `link-analytics-${link.document.name.replace(/\s+/g, "-").slice(0, 30)}-${new Date().toISOString().slice(0, 10)}.csv`,
    })
    toast({ title: "Export complete", description: "Link analytics downloaded as CSV." })
  }

  const pageViews = [
    { page: "Cover", views: 12, highlight: false },
    { page: "Problem", views: 10, highlight: false },
    { page: "Solution", views: 12, highlight: false },
    { page: "Market", views: 8, highlight: false },
    { page: "Traction", views: 12, highlight: true },
    { page: "Business", views: 6, highlight: false },
    { page: "Competition", views: 5, highlight: false },
    { page: "Team", views: 10, highlight: false },
    { page: "Financials", views: 12, highlight: true },
    { page: "Ask", views: 12, highlight: false },
  ]

  const maxViews = Math.max(...pageViews.map((p) => p.views))

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[450px] sm:max-w-[450px] overflow-y-auto px-8">
        <SheetHeader>
          <SheetTitle>Link Analytics</SheetTitle>
          <p className="text-sm text-muted-foreground truncate">{link.document.name}</p>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Overview Stats */}
          <div>
            <h4 className="text-sm font-medium mb-3">Overview</h4>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-xl font-bold text-foreground">{link.stats.views}</p>
                <p className="text-xs text-muted-foreground">Views</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-xl font-bold text-foreground">{link.stats.uniqueViewers}</p>
                <p className="text-xs text-muted-foreground">Unique</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-xl font-bold text-foreground">{link.stats.avgTime}</p>
                <p className="text-xs text-muted-foreground">Avg Time</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-xl font-bold text-foreground">{link.stats.downloads}</p>
                <p className="text-xs text-muted-foreground">Downloads</p>
              </div>
            </div>
          </div>

          {/* Views Over Time */}
          <div>
            <h4 className="text-sm font-medium mb-3">Views Over Time (Last 7 Days)</h4>
            <div className="h-24 bg-muted/50 rounded-lg flex items-end justify-around p-3 gap-1">
              {[3, 5, 4, 7, 6, 2, 4].map((val, i) => (
                <div
                  key={i}
                  className="w-full bg-primary rounded-t"
                  style={{ height: `${(val / 7) * 100}%` }}
                />
              ))}
            </div>
            <div className="flex justify-around text-[10px] text-muted-foreground mt-1">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>
          </div>

          {/* Viewers */}
          <div>
            <h4 className="text-sm font-medium mb-3">Viewers</h4>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">RA</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Rajan Anandan (Sequoia)</p>
                    <p className="text-xs text-muted-foreground">Views: 5 - Avg: 12 min - Last: 2 hours ago</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Pages viewed: 1-12 (complete)</p>
                <p className="text-xs text-green-600">Downloaded: Yes (2x)</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs">AS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Associate (Sequoia)</p>
                    <p className="text-xs text-muted-foreground">Views: 4 - Avg: 6 min - Last: yesterday</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Pages viewed: 1-5, 8-10</p>
                <p className="text-xs text-muted-foreground">Downloaded: No</p>
              </div>
            </div>
          </div>

          {/* Page Analytics */}
          <div>
            <h4 className="text-sm font-medium mb-3">Page-by-Page Analytics</h4>
            <div className="space-y-2">
              {pageViews.map((page, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-20 truncate">Page {i + 1}</span>
                  <div className="flex-1 h-4 bg-muted/50 rounded overflow-hidden">
                    <div
                      className={cn("h-full rounded", page.highlight ? "bg-primary" : "bg-primary/60")}
                      style={{ width: `${(page.views / maxViews) * 100}%` }}
                    />
                  </div>
                  <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground w-12">
                    <span>{page.views}</span>
                    <Eye className="w-4 h-4 shrink-0" />
                  </span>
                  {page.highlight && <span className="text-amber-500 text-xs">High</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Export */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={handleExportCsv}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent"
              onClick={() => toast({ title: "PDF report", description: "PDF report will be generated. Connect to PDF export service." })}
            >
              <FileText className="w-4 h-4 mr-2" />
              PDF Report
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

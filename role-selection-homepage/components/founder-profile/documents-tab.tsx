"use client"

import React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Edit2,
  Eye,
  File,
  FileSpreadsheet,
  FileText,
  Film,
  Folder,
  FolderOpen,
  ImageIcon,
  Lock,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  Trash2,
  Upload,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface Document {
  id: string
  name: string
  type: string
  size: string
  uploadedDate: string
  views: number
  avgTimeSpent: string
  uniqueViewers: number
  downloads: number
  requiresNDA: boolean
  version?: string
  previousVersions?: Array<{
    version: string
    date: string
    size: string
  }>
}

interface FolderItem {
  id: string
  name: string
  icon: typeof Folder
  count: number
  requiresNDA: boolean
  documents: Document[]
}

const mockFolders: FolderItem[] = [
  {
    id: "1",
    name: "Pitch Materials",
    icon: Folder,
    count: 3,
    requiresNDA: false,
    documents: [
      {
        id: "d1",
        name: "Pitch Deck v3.pdf",
        type: "pdf",
        size: "2.4 MB",
        uploadedDate: "Jan 15, 2026",
        views: 156,
        avgTimeSpent: "4.2 min",
        uniqueViewers: 42,
        downloads: 18,
        requiresNDA: false,
        version: "v3.0",
        previousVersions: [
          { version: "v2.1", date: "Jan 8, 2026", size: "2.3 MB" },
          { version: "v2.0", date: "Dec 20, 2025", size: "2.2 MB" },
        ],
      },
      {
        id: "d2",
        name: "One-Pager.pdf",
        type: "pdf",
        size: "450 KB",
        uploadedDate: "Jan 12, 2026",
        views: 89,
        avgTimeSpent: "1.8 min",
        uniqueViewers: 38,
        downloads: 12,
        requiresNDA: false,
      },
      {
        id: "d3",
        name: "Demo Video.mp4",
        type: "video",
        size: "45 MB",
        uploadedDate: "Jan 10, 2026",
        views: 67,
        avgTimeSpent: "3.5 min",
        uniqueViewers: 29,
        downloads: 5,
        requiresNDA: false,
      },
    ],
  },
  {
    id: "2",
    name: "Financials",
    icon: Folder,
    count: 4,
    requiresNDA: true,
    documents: [
      {
        id: "d4",
        name: "Financial Model.xlsx",
        type: "xlsx",
        size: "1.8 MB",
        uploadedDate: "Jan 14, 2026",
        views: 124,
        avgTimeSpent: "8.5 min",
        uniqueViewers: 31,
        downloads: 22,
        requiresNDA: true,
      },
      {
        id: "d5",
        name: "Cap Table.xlsx",
        type: "xlsx",
        size: "520 KB",
        uploadedDate: "Jan 11, 2026",
        views: 98,
        avgTimeSpent: "3.2 min",
        uniqueViewers: 28,
        downloads: 15,
        requiresNDA: true,
      },
      {
        id: "d6",
        name: "Bank Statements Q4.pdf",
        type: "pdf",
        size: "890 KB",
        uploadedDate: "Jan 8, 2026",
        views: 45,
        avgTimeSpent: "2.1 min",
        uniqueViewers: 12,
        downloads: 8,
        requiresNDA: true,
      },
    ],
  },
  {
    id: "3",
    name: "Legal",
    icon: Folder,
    count: 2,
    requiresNDA: true,
    documents: [
      {
        id: "d7",
        name: "Certificate of Incorporation.pdf",
        type: "pdf",
        size: "1.2 MB",
        uploadedDate: "Dec 20, 2025",
        views: 78,
        avgTimeSpent: "4.5 min",
        uniqueViewers: 25,
        downloads: 20,
        requiresNDA: true,
      },
      {
        id: "d8",
        name: "Term Sheet Template.pdf",
        type: "pdf",
        size: "650 KB",
        uploadedDate: "Dec 18, 2025",
        views: 112,
        avgTimeSpent: "5.8 min",
        uniqueViewers: 35,
        downloads: 28,
        requiresNDA: true,
      },
    ],
  },
  {
    id: "4",
    name: "Customer Evidence",
    icon: Folder,
    count: 2,
    requiresNDA: false,
    documents: [
      {
        id: "d9",
        name: "Customer Testimonials.pdf",
        type: "pdf",
        size: "780 KB",
        uploadedDate: "Jan 5, 2026",
        views: 67,
        avgTimeSpent: "2.8 min",
        uniqueViewers: 22,
        downloads: 11,
        requiresNDA: false,
      },
      {
        id: "d10",
        name: "Case Study - Enterprise Client.pdf",
        type: "pdf",
        size: "1.1 MB",
        uploadedDate: "Jan 3, 2026",
        views: 54,
        avgTimeSpent: "4.1 min",
        uniqueViewers: 19,
        downloads: 9,
        requiresNDA: false,
      },
    ],
  },
]

function getFileIcon(type: string) {
  switch (type) {
    case "pdf":
      return <FileText className="w-5 h-5 text-red-500" />
    case "xlsx":
    case "xls":
      return <FileSpreadsheet className="w-5 h-5 text-green-500" />
    case "video":
    case "mp4":
      return <Film className="w-5 h-5 text-purple-500" />
    case "image":
    case "png":
    case "jpg":
      return <ImageIcon className="w-5 h-5 text-blue-500" />
    default:
      return <File className="w-5 h-5 text-muted-foreground" />
  }
}

export function DocumentsTab() {
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["1"])
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [accessControlModalOpen, setAccessControlModalOpen] = useState(false)
  const [editDetailsModalOpen, setEditDetailsModalOpen] = useState(false)
  const [versionHistoryModalOpen, setVersionHistoryModalOpen] = useState(false)
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false)
  const [editFolderModalOpen, setEditFolderModalOpen] = useState(false)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [selectedFolder, setSelectedFolder] = useState<FolderItem | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingDocName, setEditingDocName] = useState("")
  const [editingFolderName, setEditingFolderName] = useState("")
  const { toast } = useToast()
  const [localFolders, setLocalFolders] = useState<FolderItem[]>(mockFolders) // Use localFolders instead of folders

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId]
    )
  }

  const handlePreviewDocument = (doc: Document) => {
    setSelectedDocument(doc)
    setPreviewModalOpen(true)
    toast({
      title: "Document Preview",
      description: `Viewing ${doc.name}`,
    })
  }

  const handleDownloadDocument = (doc: Document) => {
    toast({
      title: "Download Started",
      description: `Downloading ${doc.name}`,
    })
    // Simulate download
    console.log("[v0] Downloading document:", doc.name)
  }

  const handleUploadNewVersion = (doc: Document) => {
    setSelectedDocument(doc)
    setUploadModalOpen(true)
    toast({
      title: "Upload New Version",
      description: `Upload a new version for ${doc.name}`,
    })
  }

  const handleEditDetails = (doc: Document) => {
    setSelectedDocument(doc)
    setEditingDocName(doc.name)
    setEditDetailsModalOpen(true)
  }

  const handleSaveEditDetails = () => {
    if (selectedDocument && editingDocName.trim()) {
      // Update the document in the folders state
      const updatedFolders = localFolders.map((folder) => ({
        ...folder,
        documents: folder.documents.map((doc) =>
          doc.id === selectedDocument.id ? { ...doc, name: editingDocName } : doc
        ),
      }))
      setLocalFolders(updatedFolders)
      
      toast({
        title: "Document Updated",
        description: `Document renamed to ${editingDocName}`,
      })
      setEditDetailsModalOpen(false)
      setSelectedDocument(null)
    }
  }

  const handleAccessControl = (doc: Document) => {
    setSelectedDocument(doc)
    setAccessControlModalOpen(true)
  }

  const handleViewVersionHistory = (doc: Document) => {
    setSelectedDocument(doc)
    setVersionHistoryModalOpen(true)
  }

  const handleDeleteDocument = (doc: Document) => {
    setSelectedDocument(doc)
    setDeleteConfirmModalOpen(true)
  }

  const confirmDeleteDocument = () => {
    if (selectedDocument) {
      // Remove document from folders state
      const updatedFolders = localFolders.map((folder) => ({
        ...folder,
        documents: folder.documents.filter((doc) => doc.id !== selectedDocument.id),
        count: folder.documents.filter((doc) => doc.id !== selectedDocument.id).length,
      }))
      setLocalFolders(updatedFolders)
      
      toast({
        title: "Document Deleted",
        description: `${selectedDocument.name} has been deleted`,
      })
      setDeleteConfirmModalOpen(false)
      setSelectedDocument(null)
    }
  }

  const handleEditFolder = (folder: FolderItem) => {
    setSelectedFolder(folder)
    setEditingFolderName(folder.name)
    setEditFolderModalOpen(true)
  }

  const handleSaveEditFolder = () => {
    if (selectedFolder && editingFolderName.trim()) {
      // Update folder name in state
      const updatedFolders = localFolders.map((folder) =>
        folder.id === selectedFolder.id ? { ...folder, name: editingFolderName } : folder
      )
      setLocalFolders(updatedFolders)
      
      toast({
        title: "Folder Updated",
        description: `Folder renamed to ${editingFolderName}`,
      })
      setEditFolderModalOpen(false)
      setSelectedFolder(null)
    }
  }

  const handleShareFolder = (folder: FolderItem) => {
    setSelectedFolder(folder)
    setAccessControlModalOpen(true)
    toast({
      title: "Share Folder",
      description: `Share ${folder.name} with investors`,
    })
  }

  const handleFolderPermissions = (folder: FolderItem) => {
    setSelectedFolder(folder)
    toast({
      title: "Folder Permissions",
      description: `Manage permissions for ${folder.name}`,
    })
  }

  const handleDeleteFolder = (folder: FolderItem) => {
    setSelectedFolder(folder)
    // Delete folder from state
    const updatedFolders = localFolders.filter((f) => f.id !== folder.id)
    setLocalFolders(updatedFolders)
    
    toast({
      title: "Folder Deleted",
      description: `${folder.name} has been deleted`,
    })
  }

  // Calculate total stats
  const totalDocuments = localFolders.reduce((sum, folder) => sum + folder.documents.length, 0)
  const totalViews = localFolders.reduce(
    (sum, folder) => sum + folder.documents.reduce((s, doc) => s + doc.views, 0),
    0
  )
  const totalViewers = localFolders.reduce(
    (sum, folder) => sum + folder.documents.reduce((s, doc) => s + doc.uniqueViewers, 0),
    0
  )

  // Filter logic for search
  const filteredFolders = searchQuery.trim() === "" 
    ? localFolders 
    : localFolders
        .map((folder) => ({
          ...folder,
          documents: folder.documents.filter(
            (doc) =>
              doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              doc.type.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((folder) => {
          // Show folder if it matches the search or has documents that match
          const folderMatches = folder.name.toLowerCase().includes(searchQuery.toLowerCase())
          const hasMatchingDocuments = folder.documents.length > 0
          return folderMatches || hasMatchingDocuments
        })

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Data Room</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage documents and track investor engagement
          </p>
        </div>
        <Button onClick={() => setUploadModalOpen(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Documents
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold text-foreground mt-1">{totalDocuments}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold text-foreground mt-1">{totalViews}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unique Viewers</p>
                <p className="text-2xl font-bold text-foreground mt-1">{totalViewers}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="folders" className="w-full">
        <TabsList>
          <TabsTrigger value="folders">Folders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="folders" className="space-y-4 mt-4">
          {filteredFolders.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">
                {searchQuery.trim() === "" ? "No folders found" : "No documents matching your search"}
              </p>
            </div>
          ) : (
            filteredFolders.map((folder) => {
              const isExpanded = expandedFolders.includes(folder.id)
              const FolderIcon = isExpanded ? FolderOpen : Folder

              return (
                <Card key={folder.id}>
                  <CardHeader
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleFolder(folder.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FolderIcon className="w-5 h-5 text-primary" />
                        <div>
                          <CardTitle className="text-base font-semibold flex items-center gap-2">
                            {folder.name}
                            {folder.requiresNDA && (
                              <Badge variant="secondary" className="text-xs">
                                <Lock className="w-3 h-3 mr-1" />
                                NDA Required
                              </Badge>
                            )}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {folder.documents.length} document{folder.documents.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditFolder(folder)}>
                              <Edit2 className="w-4 h-4 mr-2" />
                              Edit Folder
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShareFolder(folder)}>
                              <Share2 className="w-4 h-4 mr-2" />
                              Share Folder
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleFolderPermissions(folder)}>
                              <Lock className="w-4 h-4 mr-2" />
                              Permissions
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteFolder(folder)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Folder
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {folder.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {getFileIcon(doc.type)}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-sm text-foreground truncate">
                                    {doc.name}
                                  </p>
                                  {doc.version && (
                                    <Badge variant="secondary" className="text-xs shrink-0">
                                      {doc.version}
                                    </Badge>
                                  )}
                                  {doc.requiresNDA && (
                                    <Lock className="w-3 h-3 text-muted-foreground shrink-0" />
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                  <span>{doc.size}</span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {doc.views} views
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {doc.avgTimeSpent} avg
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handlePreviewDocument(doc)}
                                title="Preview document"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAccessControl(doc)}
                                title="Share document"
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleDownloadDocument(doc)}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                  </DropdownMenuItem>
                                  {doc.version && (
                                    <DropdownMenuItem onClick={() => handleUploadNewVersion(doc)}>
                                      <Upload className="w-4 h-4 mr-2" />
                                      Upload New Version
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={() => handleEditDetails(doc)}>
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Edit Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleAccessControl(doc)}>
                                    <Lock className="w-4 h-4 mr-2" />
                                    Access Control
                                  </DropdownMenuItem>
                                  {doc.previousVersions && doc.previousVersions.length > 0 && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={() => handleViewVersionHistory(doc)}>
                                        <Clock className="w-4 h-4 mr-2" />
                                        View Version History ({doc.previousVersions.length})
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => handleDeleteDocument(doc)}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">Top Viewed Documents</h4>
                {filteredFolders
                  .flatMap((f) => f.documents)
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {getFileIcon(doc.type)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.uniqueViewers} unique viewers
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">{doc.views}</p>
                        <p className="text-xs text-muted-foreground">views</p>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="space-y-3 pt-4">
                <h4 className="text-sm font-medium text-foreground">Engagement by Document Type</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">PDF Documents</span>
                    <span className="font-medium text-foreground">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Spreadsheets</span>
                    <span className="font-medium text-foreground">24%</span>
                  </div>
                  <Progress value={24} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Videos</span>
                    <span className="font-medium text-foreground">8%</span>
                  </div>
                  <Progress value={8} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Documents</DialogTitle>
            <DialogDescription>
              Add documents to your data room for investor access
            </DialogDescription>
          </DialogHeader>
          <UploadDocumentForm onClose={() => setUploadModalOpen(false)} folders={localFolders} />
        </DialogContent>
      </Dialog>

      {/* Access Control Modal */}
      <Dialog open={accessControlModalOpen} onOpenChange={setAccessControlModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Access Control</DialogTitle>
            <DialogDescription>
              {selectedDocument && `Configure access settings for ${selectedDocument.name}`}
              {selectedFolder && `Configure access settings for ${selectedFolder.name}`}
            </DialogDescription>
          </DialogHeader>
          <AccessControlForm
            document={selectedDocument}
            onClose={() => setAccessControlModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Details Modal */}
      <Dialog open={editDetailsModalOpen} onOpenChange={setEditDetailsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Document Details</DialogTitle>
            <DialogDescription>
              Update the name and properties of your document
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="doc-name">Document Name</Label>
              <Input
                id="doc-name"
                value={editingDocName}
                onChange={(e) => setEditingDocName(e.target.value)}
                placeholder="Enter document name"
              />
            </div>
            {selectedDocument && (
              <>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Size</p>
                    <p className="font-medium">{selectedDocument.size}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Views</p>
                    <p className="font-medium">{selectedDocument.views}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="requires-nda">Requires NDA</Label>
                  <Switch id="requires-nda" defaultChecked={selectedDocument.requiresNDA} />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDetailsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEditDetails}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Version History Modal */}
      <Dialog open={versionHistoryModalOpen} onOpenChange={setVersionHistoryModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
            <DialogDescription>
              {selectedDocument && `Version history for ${selectedDocument.name}`}
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && selectedDocument.previousVersions && (
            <div className="space-y-3">
              <div className="border rounded-lg p-3 bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{selectedDocument.version} (Current)</p>
                    <p className="text-xs text-muted-foreground">
                      Uploaded on {selectedDocument.uploadedDate}
                    </p>
                  </div>
                  <Badge>Current</Badge>
                </div>
              </div>
              {selectedDocument.previousVersions.map((version, idx) => (
                <div key={idx} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{version.version}</p>
                      <p className="text-xs text-muted-foreground">
                        {version.date} • {version.size}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Version Restored",
                          description: `Restored to version ${version.version}`,
                        })
                        setVersionHistoryModalOpen(false)
                      }}
                    >
                      Restore
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setVersionHistoryModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmModalOpen} onOpenChange={setDeleteConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              {selectedDocument && (
                <>
                  Are you sure you want to delete <strong>{selectedDocument.name}</strong>? This action cannot be
                  undone.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteDocument}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Folder Modal */}
      <Dialog open={editFolderModalOpen} onOpenChange={setEditFolderModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Folder</DialogTitle>
            <DialogDescription>
              Update the name of your folder
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                value={editingFolderName}
                onChange={(e) => setEditingFolderName(e.target.value)}
                placeholder="Enter folder name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditFolderModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEditFolder}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
            <DialogDescription>
              {selectedDocument && `Previewing ${selectedDocument.name}`}
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="bg-muted rounded-lg p-8 min-h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4">{getFileIcon(selectedDocument.type)}</div>
                <p className="font-medium text-foreground mb-2">{selectedDocument.name}</p>
                <p className="text-sm text-muted-foreground mb-4">{selectedDocument.size}</p>
                <p className="text-xs text-muted-foreground">
                  Document preview would be displayed here based on file type
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewModalOpen(false)}>
              Close
            </Button>
            {selectedDocument && (
              <Button onClick={() => handleDownloadDocument(selectedDocument)}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function UploadDocumentForm({ onClose, folders }: { onClose: () => void; folders: FolderItem[] }) {
  const [selectedFolder, setSelectedFolder] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const { toast } = useToast()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles((prev) => [...prev, ...files])
    console.log("[v0] Files selected:", files.map((f) => f.name))
  }

  const handleUpload = () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload",
      })
      return
    }

    if (!selectedFolder) {
      toast({
        title: "No folder selected",
        description: "Please select a folder for uploading documents",
      })
      return
    }

    toast({
      title: "Upload Started",
      description: `Uploading ${uploadedFiles.length} file(s)...`,
    })

    console.log("[v0] Uploading files:", uploadedFiles.map((f) => f.name))
    console.log("[v0] To folder:", selectedFolder)

    // Close the modal after upload
    setTimeout(() => {
      onClose()
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">Drag and drop files here</p>
          <p className="text-xs text-muted-foreground mb-4">or click to browse (multiple files supported)</p>
          <input
            type="file"
            id="doc-upload"
            multiple
            accept=".pdf,.xlsx,.pptx,.mp4"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button variant="outline" size="sm" asChild>
            <label htmlFor="doc-upload" className="cursor-pointer">
              Browse Files
            </label>
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Supported: PDF, XLSX, PPTX, MP4 (Max 50MB per file)
          </p>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Files ({uploadedFiles.length})</Label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted rounded">
                <span className="truncate flex-1">{file.name}</span>
                <span className="text-xs text-muted-foreground ml-2">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Label>Upload to Folder</Label>
        <Select value={selectedFolder} onValueChange={setSelectedFolder}>
          <SelectTrigger>
            <SelectValue placeholder="Select folder" />
          </SelectTrigger>
          <SelectContent>
            {folders.map((folder) => (
              <SelectItem key={folder.id} value={folder.id}>
                {folder.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleUpload}>Upload</Button>
      </div>
    </div>
  )
}

function AccessControlForm({
  document,
  onClose,
}: {
  document: Document | null
  onClose: () => void
}) {
  const [requireNDA, setRequireNDA] = useState(document?.requiresNDA || false)
  const [timeLimited, setTimeLimited] = useState(false)
  const [shareOption, setShareOption] = useState("all")
  const { toast } = useToast()

  const handleSaveSettings = () => {
    toast({
      title: "Access Settings Saved",
      description: `Document sharing preferences updated${requireNDA ? " (NDA required)" : ""}`,
    })
    console.log("[v0] Access control settings saved:", {
      requireNDA,
      timeLimited,
      shareOption,
    })
    onClose()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-3 border-b">
        <div>
          <Label className="text-sm font-medium">Require NDA</Label>
          <p className="text-xs text-muted-foreground mt-1">
            Investors must sign NDA before accessing
          </p>
        </div>
        <Switch checked={requireNDA} onCheckedChange={setRequireNDA} />
      </div>

      <div className="flex items-center justify-between py-3 border-b">
        <div>
          <Label className="text-sm font-medium">Time-Limited Access</Label>
          <p className="text-xs text-muted-foreground mt-1">
            Set expiration date for document access
          </p>
        </div>
        <Switch checked={timeLimited} onCheckedChange={setTimeLimited} />
      </div>

      <div className="space-y-2">
        <Label>Share with Specific Investors</Label>
        <Select value={shareOption} onValueChange={setShareOption}>
          <SelectTrigger>
            <SelectValue placeholder="Select investors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Investors</SelectItem>
            <SelectItem value="specific">Specific Investors Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
    </div>
  )
}

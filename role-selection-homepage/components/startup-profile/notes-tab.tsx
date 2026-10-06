"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Archive,
  AtSign,
  Bold,
  BookmarkPlus,
  Check,
  ChevronDown,
  Clock,
  Edit2,
  FileText,
  Filter,
  Hash,
  Italic,
  Link2,
  List,
  Lock,
  MoreHorizontal,
  Pin,
  PinOff,
  Plus,
  Search,
  Share2,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Underline,
  User,
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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types
interface Note {
  id: string
  title: string
  content: string
  author: {
    name: string
    initials: string
  }
  createdAt: string
  updatedAt: string
  category: "general" | "meeting" | "dd" | "feedback" | "important"
  isPinned: boolean
  isPrivate: boolean
  tags: string[]
  mentions: string[]
  linkedTo?: {
    type: "investor" | "document" | "task"
    name: string
    link: string
  }
}

// Category configuration
const categoryConfig = {
  general: {
    label: "General",
    bg: "bg-muted",
    color: "text-muted-foreground",
  },
  meeting: {
    label: "Meeting Notes",
    bg: "bg-blue-500/10",
    color: "text-blue-600 dark:text-blue-400",
  },
  dd: {
    label: "Due Diligence",
    bg: "bg-amber-500/10",
    color: "text-amber-600 dark:text-amber-400",
  },
  feedback: {
    label: "Feedback",
    bg: "bg-purple-500/10",
    color: "text-purple-600 dark:text-purple-400",
  },
  important: {
    label: "Important",
    bg: "bg-red-500/10",
    color: "text-red-600 dark:text-red-400",
  },
}

// Mock notes data
const notesData: Note[] = [
  {
    id: "1",
    title: "IC Meeting Prep Notes",
    content: "Key points to discuss:\n\n1. Revenue growth trajectory - 32% MoM is impressive, but need to validate sustainability\n2. Customer acquisition cost trends - improving from ₹2,400 to ₹1,800\n3. Technical moat assessment - AI models show strong differentiation\n4. Competition analysis - main competitors are lagging by 6-9 months\n\nQuestions for founders:\n- What's the path to profitability?\n- How defensible is the tech stack?\n- Plans for international expansion?",
    author: { name: "Priya Sharma", initials: "PS" },
    createdAt: "Today, 2:30 PM",
    updatedAt: "Today, 3:15 PM",
    category: "important",
    isPinned: true,
    isPrivate: false,
    tags: ["IC-meeting", "prep"],
    mentions: ["Rahul Singh", "Amit Kumar"],
    linkedTo: {
      type: "document",
      name: "IC Memo Draft",
      link: "/documents/ic-memo",
    },
  },
  {
    id: "2",
    title: "Founder Call - Jan 20",
    content: "Call with Rajesh (CEO) and Priya (CTO)\n\nKey takeaways:\n- Team is executing well, ahead of Q4 targets\n- New enterprise contract signed with HDFC Bank (₹2Cr ARR)\n- Planning to raise Series A by March 2026\n- Looking for lead investor with fintech expertise\n\nFollow-ups:\n- Schedule technical DD session with CTO\n- Request updated financial model\n- Connect them with our portfolio company (PayFlow) for potential partnership",
    author: { name: "Rahul Singh", initials: "RS" },
    createdAt: "Jan 20, 2026",
    updatedAt: "Jan 20, 2026",
    category: "meeting",
    isPinned: true,
    isPrivate: false,
    tags: ["founder-call", "follow-up"],
    mentions: [],
  },
  {
    id: "3",
    title: "Technical DD Findings",
    content: "Completed technical assessment with CTO Priya Patel:\n\nStrengths:\n- Solid microservices architecture on AWS\n- ML pipeline is well-structured, uses modern tooling\n- Good test coverage (78%)\n- Security practices are above average for stage\n\nAreas of concern:\n- Some technical debt in legacy modules\n- Need to scale database infrastructure before 10x growth\n- Missing disaster recovery plan\n\nOverall: Strong technical foundation with manageable risks.",
    author: { name: "Amit Kumar", initials: "AK" },
    createdAt: "Jan 18, 2026",
    updatedAt: "Jan 19, 2026",
    category: "dd",
    isPinned: false,
    isPrivate: false,
    tags: ["technical", "dd-complete"],
    mentions: ["Priya Sharma"],
    linkedTo: {
      type: "document",
      name: "Tech DD Report",
      link: "/documents/tech-dd",
    },
  },
  {
    id: "4",
    title: "Reference Check - HDFC Contact",
    content: "Spoke with Vikram Mehta (VP Digital Banking, HDFC):\n\nHow did you find TechCorp AI?\n\"They were recommended by our fintech advisor. The pilot went exceptionally well.\"\n\nWhat problem are they solving for you?\n\"Automating our loan document processing. Previously took 2 days, now takes 2 hours.\"\n\nWould you expand the contract?\n\"Already in discussions for 3 more use cases. Very likely to 3x the contract.\"\n\nAny concerns?\n\"Just need them to maintain response times as we scale. So far, excellent support.\"",
    author: { name: "Priya Sharma", initials: "PS" },
    createdAt: "Jan 15, 2026",
    updatedAt: "Jan 15, 2026",
    category: "dd",
    isPinned: false,
    isPrivate: true,
    tags: ["reference", "customer"],
    mentions: [],
  },
  {
    id: "5",
    title: "Competition Analysis",
    content: "Main competitors in the space:\n\n1. DocuAI (Series B, $15M raised)\n- Broader focus, less specialized\n- Slower processing speeds\n- Weaker enterprise presence in India\n\n2. SmartDocs (Series A, $5M raised)\n- Similar focus but 6 months behind in product\n- Limited ML capabilities\n- Mostly SMB customers\n\nTechCorp advantages:\n- Best-in-class accuracy (98.5% vs 94% avg)\n- Strong enterprise relationships\n- Patent-pending algorithms",
    author: { name: "Rahul Singh", initials: "RS" },
    createdAt: "Jan 12, 2026",
    updatedAt: "Jan 14, 2026",
    category: "general",
    isPinned: false,
    isPrivate: false,
    tags: ["competition", "market"],
    mentions: [],
  },
  {
    id: "6",
    title: "Quick Feedback",
    content: "Strong founding team with complementary skills. CEO has great GTM instincts, CTO is technically sharp. Culture seems healthy based on team interactions. Worth pursuing.",
    author: { name: "Amit Kumar", initials: "AK" },
    createdAt: "Jan 10, 2026",
    updatedAt: "Jan 10, 2026",
    category: "feedback",
    isPinned: false,
    isPrivate: false,
    tags: ["quick-take"],
    mentions: [],
  },
]

// Quick templates
const noteTemplates = [
  { id: "meeting", label: "Meeting Notes", icon: Users },
  { id: "call", label: "Call Summary", icon: User },
  { id: "dd", label: "DD Checklist", icon: FileText },
  { id: "feedback", label: "Quick Feedback", icon: Star },
]

export function NotesTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("recent")
  const [isComposing, setIsComposing] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [newNoteCategory, setNewNoteCategory] = useState<Note["category"]>("general")

  // Filter and sort notes
  const filteredNotes = notesData
    .filter((note) => {
      const matchesSearch =
        searchQuery === "" ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = categoryFilter === "all" || note.category === categoryFilter
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return 0
    })

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned)
  const regularNotes = filteredNotes.filter((n) => !n.isPinned)

  const stats = {
    total: notesData.length,
    pinned: notesData.filter((n) => n.isPinned).length,
    private: notesData.filter((n) => n.isPrivate).length,
    thisWeek: 4,
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Compose New Note */}
        <Card>
          <CardContent className="p-4">
            {!isComposing ? (
              <button
                onClick={() => setIsComposing(true)}
                className="w-full flex items-center gap-3 p-3 border border-dashed rounded-lg hover:bg-muted/50 hover:border-primary/50 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-primary" />
                </div>
                <span className="text-muted-foreground">Add a note about this startup...</span>
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Note title"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    className="font-medium"
                  />
                  <Select
                    value={newNoteCategory}
                    onValueChange={(v) => setNewNoteCategory(v as Note["category"])}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Textarea
                  placeholder="Write your note here... Use @mentions and #tags"
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="min-h-[150px] resize-none"
                />

                {/* Formatting Toolbar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Underline className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <List className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-4 bg-border mx-1" />
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <AtSign className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Hash className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Link2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsComposing(false)
                        setNewNoteTitle("")
                        setNewNoteContent("")
                      }}
                    >
                      Cancel
                    </Button>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Note
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notes, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Notes</SelectItem>
              {Object.entries(categoryConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="updated">Last Updated</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pinned Notes */}
        {pinnedNotes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Pin className="w-4 h-4" />
              Pinned Notes
            </div>
            <div className="space-y-3">
              {pinnedNotes.map((note) => (
                <NoteCard key={note.id} note={note} onSelect={setSelectedNote} />
              ))}
            </div>
          </div>
        )}

        {/* All Notes */}
        <div className="space-y-3">
          {pinnedNotes.length > 0 && regularNotes.length > 0 && (
            <div className="text-sm font-medium text-muted-foreground">All Notes</div>
          )}
          {regularNotes.length > 0 ? (
            <div className="space-y-3">
              {regularNotes.map((note) => (
                <NoteCard key={note.id} note={note} onSelect={setSelectedNote} />
              ))}
            </div>
          ) : (
            filteredNotes.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No notes found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchQuery ? "Try adjusting your search" : "Add your first note above"}
                  </p>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </div>

      {/* Right Column - Sidebar */}
      <div className="space-y-6">
        {/* Note Stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Notes Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Notes</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-foreground">{stats.thisWeek}</p>
                <p className="text-xs text-muted-foreground">This Week</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pinned</span>
              <span className="font-medium">{stats.pinned}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Private</span>
              <span className="font-medium">{stats.private}</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Templates */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Quick Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {noteTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => setIsComposing(true)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <template.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">{template.label}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Tags */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {["IC-meeting", "prep", "founder-call", "follow-up", "technical", "dd-complete", "reference", "customer", "competition", "market", "quick-take"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted hover:bg-muted/80 text-xs transition-colors"
                >
                  <Hash className="w-3 h-3" />
                  {tag}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Contributors */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Contributors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Priya Sharma", initials: "PS", count: 3 },
              { name: "Rahul Singh", initials: "RS", count: 2 },
              { name: "Amit Kumar", initials: "AK", count: 2 },
            ].map((contributor) => (
              <div key={contributor.initials} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {contributor.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{contributor.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {contributor.count} notes
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Summary */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Based on {notesData.length} notes, the team is positive about this startup. Key themes: strong technical foundation, impressive traction, good founder-market fit. Main concerns: scaling infrastructure and path to profitability need clarification.
            </p>
            <Button variant="outline" size="sm" className="mt-3 w-full bg-transparent">
              <Sparkles className="w-3 h-3 mr-2" />
              Generate Full Summary
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Note Card Component
function NoteCard({ note, onSelect }: { note: Note; onSelect: (note: Note) => void }) {
  const config = categoryConfig[note.category]

  return (
    <Card
      className={cn(
        "group hover:shadow-md transition-all cursor-pointer",
        note.isPinned && "border-primary/30"
      )}
      onClick={() => onSelect(note)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {note.isPinned && <Pin className="w-3 h-3 text-primary shrink-0" />}
              {note.isPrivate && <Lock className="w-3 h-3 text-muted-foreground shrink-0" />}
              <h4 className="font-medium text-foreground truncate">{note.title}</h4>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{note.content}</p>

            <div className="flex flex-wrap items-center gap-2">
              <Badge className={cn("text-xs", config.bg, config.color, "border-0")}>
                {config.label}
              </Badge>
              {note.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {note.tags.length > 2 && (
                <span className="text-xs text-muted-foreground">+{note.tags.length - 2} more</span>
              )}
            </div>

            {note.linkedTo && (
              <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                <Link2 className="w-3 h-3" />
                <span>Linked to {note.linkedTo.name}</span>
              </div>
            )}
          </div>

          <div className="text-right shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {note.isPinned ? (
                    <>
                      <PinOff className="w-4 h-4 mr-2" />
                      Unpin
                    </>
                  ) : (
                    <>
                      <Pin className="w-4 h-4 mr-2" />
                      Pin
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="mt-1">
              <Avatar className="w-6 h-6 ml-auto">
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                  {note.author.initials}
                </AvatarFallback>
              </Avatar>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{note.createdAt}</p>
          </div>
        </div>

        {note.mentions.length > 0 && (
          <div className="flex items-center gap-1 mt-3 pt-3 border-t text-xs text-muted-foreground">
            <AtSign className="w-3 h-3" />
            <span>Mentions: {note.mentions.join(", ")}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

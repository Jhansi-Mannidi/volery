'use client'

import React, { useState } from 'react'
import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  FileText,
  Search,
  Download,
  Plus,
  Pin,
  Share2,
  MoreVertical,
  Grid3X3,
  List,
  X,
  Bold,
  Italic,
  Underline,
  Link2,
  ImageIcon as ImageIcon,
  Sparkles,
  ChevronDown,
  CheckSquare,
  Paperclip,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Mock data for notes
const mockNotes = [
  {
    id: 1,
    title: 'TechCorp AI - Key Findings Summary',
    company: 'TechCorp AI',
    tags: ['Due Diligence', 'Financial', 'Important'],
    isPinned: true,
    preview: `## Key Takeaways
1. Strong revenue growth (180% YoY)
2. Customer concentration risk (60% top 3)
3. Excellent unit economics (8x LTV/CAC)`,
    lastEdited: '2 hours ago',
    author: 'AM',
    date: 'pinned',
  },
  {
    id: 2,
    title: 'Customer Interview - Acme Corp',
    company: 'TechCorp AI',
    tags: ['Customer Research', 'TechCorp AI'],
    isPinned: false,
    preview: 'Key quote: "TechCorp saved us 40 hours per month"',
    lastEdited: '10:30 AM',
    author: 'AM',
    date: 'today',
  },
  {
    id: 3,
    title: 'Competitive Analysis Notes',
    company: 'TechCorp AI',
    tags: ['Competition', 'TechCorp AI'],
    isPinned: false,
    preview: 'Found 3 new competitors entering market...',
    lastEdited: '9:15 AM',
    author: 'AM',
    date: 'today',
  },
  {
    id: 4,
    title: 'Market Size Calculation Methodology',
    company: 'All Companies',
    tags: ['Market Analysis', 'Methodology'],
    isPinned: false,
    preview: 'Used bottom-up approach based on...',
    lastEdited: '5:45 PM',
    author: 'JD',
    date: 'yesterday',
  },
]

export default function ResearchNotesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [showEditor, setShowEditor] = useState(false)
  const [selectedNote, setSelectedNote] = useState<any>(null)
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('TechCorp AI')
  const [noteTags, setNoteTags] = useState<string[]>([])

  const openEditor = (note?: any) => {
    if (note) {
      setSelectedNote(note)
      setNoteTitle(note.title)
      setNoteContent(note.preview)
      setSelectedCompany(note.company)
      setNoteTags(note.tags)
    } else {
      setSelectedNote(null)
      setNoteTitle('')
      setNoteContent('')
      setSelectedCompany('TechCorp AI')
      setNoteTags([])
    }
    setShowEditor(true)
  }

  const closeEditor = () => {
    setShowEditor(false)
    setSelectedNote(null)
  }

  const pinnedNotes = mockNotes.filter((note) => note.isPinned)
  const todayNotes = mockNotes.filter((note) => note.date === 'today')
  const yesterdayNotes = mockNotes.filter((note) => note.date === 'yesterday')

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Research Notes" />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto">
            <div className="p-4 md:p-6">
              <div className="max-w-[1600px] mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                      <FileText className="w-8 h-8" />
                      Research Notes
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      Company: <span className="font-medium">TechCorp AI</span>
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 bg-transparent"
                    >
                      <Search className="w-4 h-4" />
                      Search
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 bg-transparent"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1"
                      onClick={() => openEditor()}
                    >
                      <Plus className="w-4 h-4" />
                      New Note
                    </Button>
                  </div>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    All Notes (45)
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                        By Company
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>All Companies</DropdownMenuItem>
                      <DropdownMenuItem>TechCorp AI</DropdownMenuItem>
                      <DropdownMenuItem>DataMesh</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                        By Tag
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Due Diligence</DropdownMenuItem>
                      <DropdownMenuItem>Financial</DropdownMenuItem>
                      <DropdownMenuItem>Customer Research</DropdownMenuItem>
                      <DropdownMenuItem>Competition</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                        By Date
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Today</DropdownMenuItem>
                      <DropdownMenuItem>Yesterday</DropdownMenuItem>
                      <DropdownMenuItem>This Week</DropdownMenuItem>
                      <DropdownMenuItem>This Month</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="flex gap-1 ml-auto">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      My Notes
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Team Notes
                    </Button>
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Research Notes
                  </h3>
                  <div className="flex gap-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className={viewMode === 'grid' ? '' : 'bg-transparent'}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className={viewMode === 'list' ? '' : 'bg-transparent'}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Pinned Notes */}
                {pinnedNotes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                      <Pin className="w-4 h-4" />
                      Pinned Notes
                    </h4>
                    <div className="space-y-3">
                      {pinnedNotes.map((note) => (
                        <Card
                          key={note.id}
                          className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-cyan-500"
                          onClick={() => openEditor(note)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <FileText className="w-4 h-4 text-cyan-600" />
                                  <h5 className="font-semibold text-foreground">
                                    {note.title}
                                  </h5>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs gap-1"
                                  >
                                    <Pin className="w-3 h-3" />
                                    Pinned
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {note.tags.map((tag, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="text-sm text-muted-foreground whitespace-pre-line mb-3">
                                  {note.preview}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Last edited: {note.lastEdited} by {note.author}
                                </p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Open</DropdownMenuItem>
                                  <DropdownMenuItem>Share</DropdownMenuItem>
                                  <DropdownMenuItem>Unpin</DropdownMenuItem>
                                  <DropdownMenuItem>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-transparent"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openEditor(note)
                                }}
                              >
                                Open
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-transparent"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Share2 className="w-3 h-3 mr-1" />
                                Share
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Today Notes */}
                {todayNotes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Today
                    </h4>
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-3' : 'space-y-3'}>
                      {todayNotes.map((note) => (
                        <Card
                          key={note.id}
                          className="hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => openEditor(note)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <FileText className="w-4 h-4 text-cyan-600" />
                                  <h5 className="font-semibold text-sm text-foreground">
                                    {note.title}
                                  </h5>
                                  <span className="text-xs text-muted-foreground ml-auto">
                                    {note.lastEdited}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {note.tags.map((tag, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {note.preview}
                                </p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Open</DropdownMenuItem>
                                  <DropdownMenuItem>Share</DropdownMenuItem>
                                  <DropdownMenuItem>Pin</DropdownMenuItem>
                                  <DropdownMenuItem>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-transparent"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openEditor(note)
                                }}
                              >
                                Open
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-transparent"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Share2 className="w-3 h-3 mr-1" />
                                Share
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Yesterday Notes */}
                {yesterdayNotes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Yesterday
                    </h4>
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-3' : 'space-y-3'}>
                      {yesterdayNotes.map((note) => (
                        <Card
                          key={note.id}
                          className="hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => openEditor(note)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <FileText className="w-4 h-4 text-cyan-600" />
                                  <h5 className="font-semibold text-sm text-foreground">
                                    {note.title}
                                  </h5>
                                  <span className="text-xs text-muted-foreground ml-auto">
                                    {note.lastEdited}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {note.tags.map((tag, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {note.preview}
                                </p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Open</DropdownMenuItem>
                                  <DropdownMenuItem>Share</DropdownMenuItem>
                                  <DropdownMenuItem>Pin</DropdownMenuItem>
                                  <DropdownMenuItem>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-transparent"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openEditor(note)
                                }}
                              >
                                Open
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-transparent"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Share2 className="w-3 h-3 mr-1" />
                                Share
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Note Editor Modal */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {selectedNote ? 'Edit Research Note' : 'New Research Note'}
              </DialogTitle>
              <div className="flex gap-2">
                <Button size="sm">Save</Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeEditor}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {/* Title */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Title
              </label>
              <Input
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Customer Interview - Acme Corp"
                className="text-base"
              />
            </div>

            {/* Company and Tags */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Company
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between bg-transparent">
                      {selectedCompany}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem onClick={() => setSelectedCompany('TechCorp AI')}>
                      TechCorp AI
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedCompany('DataMesh')}>
                      DataMesh
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedCompany('All Companies')}>
                      All Companies
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Tags
                </label>
                <div className="flex flex-wrap gap-1">
                  {noteTags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm" className="h-6 px-2 bg-transparent">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Formatting Toolbar */}
            <div className="border-y py-2">
              <div className="flex flex-wrap gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Bold className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Italic className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Underline className="w-4 h-4" />
                </Button>
                <div className="w-px h-8 bg-border mx-1" />
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                  H1
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                  H2
                </Button>
                <div className="w-px h-8 bg-border mx-1" />
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  •
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  1.
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <CheckSquare className="w-4 h-4" />
                </Button>
                <div className="w-px h-8 bg-border mx-1" />
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Link2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <div className="w-px h-8 bg-border mx-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 gap-1 text-cyan-600"
                >
                  <Sparkles className="w-4 h-4" />
                  AI
                </Button>
              </div>
            </div>

            {/* Content Editor */}
            <div>
              <Textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="## Interview Summary

**Interviewee:** John Smith, VP Operations at Acme Corp
**Date:** January 25, 2026
**Duration:** 45 minutes

### Key Quotes
> 'TechCorp AI's document processing saved us 40 hours per month'

### Pain Points (before TechCorp)
- Manual document processing took 2 FTEs
- Error rate was 15%

### Value Delivered
- [ ] 40 hours/month saved
- [ ] Error rate reduced to <1%"
                className="min-h-[400px] font-mono text-sm resize-none"
              />
            </div>

            {/* AI Actions */}
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                <Sparkles className="w-3 h-3" />
                AI: Generate key takeaways
              </Button>
              <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                <Sparkles className="w-3 h-3" />
                AI: Suggest follow-up questions
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  )
}

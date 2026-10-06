"use client"

import React, { useState, useCallback } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Plus,
  MoreHorizontal,
  GripVertical,
  Eye,
  Pencil,
  Calendar,
  MessageSquare,
  Users,
  Clock,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  UserPlus,
  StickyNote,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Deal {
  id: string
  companyName: string
  logo?: string
  sector: string
  revenue: string
  growth: string
  assignedTo: {
    name: string
    initials: string
    avatar?: string
  }
  collaborators?: {
    name: string
    initials: string
    avatar?: string
  }[]
  daysInStage: number
  nextAction: {
    type: "call" | "meeting" | "review" | "memo"
    label: string
    dueDate: string
  }
  metrics: {
    arr: string
    growth: string
    burn: string
  }
  hasNotes?: boolean
}

interface Stage {
  id: string
  name: string
  count: number
  color: string
  bgColor: string
  deals: Deal[]
}

const initialStages: Stage[] = [
  {
    id: "initial-review",
    name: "Initial Review",
    count: 5,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    deals: [
      {
        id: "1",
        companyName: "CloudScale AI",
        sector: "DevOps SaaS",
        revenue: "$2M ARR",
        growth: "+180% YoY",
        assignedTo: { name: "Priya Sharma", initials: "PS" },
        collaborators: [
          { name: "Rahul Mehta", initials: "RM" },
          { name: "Amit Patel", initials: "AP" },
        ],
        daysInStage: 2,
        nextAction: {
          type: "call",
          label: "Founder Call",
          dueDate: "Tomorrow",
        },
        metrics: {
          arr: "$2.1M",
          growth: "180%",
          burn: "$120K/mo",
        },
        hasNotes: true,
      },
      {
        id: "2",
        companyName: "FinSecure Pro",
        sector: "Cybersecurity",
        revenue: "$5M ARR",
        growth: "+120% YoY",
        assignedTo: { name: "Rahul Mehta", initials: "RM" },
        daysInStage: 5,
        nextAction: {
          type: "review",
          label: "Review Deck",
          dueDate: "Jan 30",
        },
        metrics: {
          arr: "$5.2M",
          growth: "120%",
          burn: "$280K/mo",
        },
      },
    ],
  },
  {
    id: "deep-dive",
    name: "Deep Dive",
    count: 3,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    deals: [
      {
        id: "3",
        companyName: "HealthTech India",
        sector: "Healthcare SaaS",
        revenue: "$3.5M ARR",
        growth: "+150% YoY",
        assignedTo: { name: "Amit Patel", initials: "AP" },
        collaborators: [{ name: "Priya Sharma", initials: "PS" }],
        daysInStage: 14,
        nextAction: {
          type: "meeting",
          label: "Team Meeting",
          dueDate: "Feb 2",
        },
        metrics: {
          arr: "$3.5M",
          growth: "150%",
          burn: "$180K/mo",
        },
        hasNotes: true,
      },
    ],
  },
  {
    id: "ic-memo",
    name: "IC Memo",
    count: 2,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    deals: [
      {
        id: "4",
        companyName: "AgriFlow",
        sector: "AgriTech",
        revenue: "$1.8M ARR",
        growth: "+200% YoY",
        assignedTo: { name: "Priya Sharma", initials: "PS" },
        daysInStage: 7,
        nextAction: {
          type: "memo",
          label: "Complete IC Memo",
          dueDate: "Feb 5",
        },
        metrics: {
          arr: "$1.8M",
          growth: "200%",
          burn: "$95K/mo",
        },
      },
    ],
  },
  {
    id: "ic-meeting",
    name: "IC Meeting",
    count: 1,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    deals: [
      {
        id: "5",
        companyName: "EduLearn AI",
        sector: "EdTech",
        revenue: "$4M ARR",
        growth: "+135% YoY",
        assignedTo: { name: "Rahul Mehta", initials: "RM" },
        collaborators: [
          { name: "Priya Sharma", initials: "PS" },
          { name: "Amit Patel", initials: "AP" },
        ],
        daysInStage: 3,
        nextAction: {
          type: "meeting",
          label: "IC Meeting",
          dueDate: "Feb 8",
        },
        metrics: {
          arr: "$4M",
          growth: "135%",
          burn: "$220K/mo",
        },
        hasNotes: true,
      },
    ],
  },
  {
    id: "term-sheet",
    name: "Term Sheet",
    count: 1,
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
    deals: [
      {
        id: "6",
        companyName: "LogiTech Pro",
        sector: "Logistics",
        revenue: "$6M ARR",
        growth: "+110% YoY",
        assignedTo: { name: "Amit Patel", initials: "AP" },
        daysInStage: 5,
        nextAction: {
          type: "review",
          label: "Negotiate Terms",
          dueDate: "Feb 12",
        },
        metrics: {
          arr: "$6M",
          growth: "110%",
          burn: "$340K/mo",
        },
      },
    ],
  },
  {
    id: "closed",
    name: "Closed",
    count: 0,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    deals: [],
  },
]

export function InvestorPipelineKanban() {
  const [stages, setStages] = useState<Stage[]>(initialStages)
  const [draggedCard, setDraggedCard] = useState<{ stageId: string; deal: Deal } | null>(null)
  const [dragOverStage, setDragOverStage] = useState<string | null>(null)
  const [collapsedStages, setCollapsedStages] = useState<string[]>([])
  const [noteDialog, setNoteDialog] = useState<{ open: boolean; deal: Deal | null }>({
    open: false,
    deal: null,
  })
  const [assignDialog, setAssignDialog] = useState<{ open: boolean; deal: Deal | null }>({
    open: false,
    deal: null,
  })

  const toggleCollapse = (stageId: string) => {
    setCollapsedStages((prev) =>
      prev.includes(stageId) ? prev.filter((id) => id !== stageId) : [...prev, stageId]
    )
  }

  const handleDragStart = (stageId: string, deal: Deal) => {
    setDraggedCard({ stageId, deal })
  }

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    setDragOverStage(stageId)
  }

  const handleDragLeave = () => {
    setDragOverStage(null)
  }

  const handleDrop = useCallback(
    (targetStageId: string) => {
      if (!draggedCard || draggedCard.stageId === targetStageId) {
        setDraggedCard(null)
        setDragOverStage(null)
        return
      }

      moveCard(draggedCard.stageId, targetStageId, draggedCard.deal)
    },
    [draggedCard]
  )

  const moveCard = (fromStageId: string, toStageId: string, deal: Deal) => {
    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id === fromStageId) {
          return {
            ...stage,
            deals: stage.deals.filter((d) => d.id !== deal.id),
            count: stage.count - 1,
          }
        }
        if (stage.id === toStageId) {
          return {
            ...stage,
            deals: [...stage.deals, { ...deal, daysInStage: 0 }],
            count: stage.count + 1,
          }
        }
        return stage
      })
    )
    setDraggedCard(null)
    setDragOverStage(null)
  }

  // Calculate pipeline analytics
  const totalDeals = stages.reduce((sum, stage) => sum + stage.count, 0)
  const avgTimePerStage = 8.5 // days
  const conversionRate = 15 // percentage

  return (
    <>
      {/* Analytics Bar */}
      <div className="border-b border-border bg-muted/30 px-4 md:px-6 py-3">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Total Deals:</span>
            <span className="font-semibold">{totalDeals}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Avg Time/Stage:</span>
            <span className="font-semibold">{avgTimePerStage} days</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Conversion Rate:</span>
            <span className="font-semibold">{conversionRate}%</span>
          </div>
        </div>
      </div>

      <div className="flex h-full overflow-x-auto px-4 md:px-6 py-4">
        <div className="flex gap-4">
          {stages.map((stage) => {
            const isCollapsed = collapsedStages.includes(stage.id)
            const isDragOver = dragOverStage === stage.id

            return (
              <div
                key={stage.id}
                className={cn(
                  "flex flex-col rounded-xl border bg-card transition-all",
                  isCollapsed ? "w-12" : "w-80 min-w-80",
                  isDragOver && "ring-2 ring-primary ring-offset-2"
                )}
                onDragOver={(e) => handleDragOver(e, stage.id)}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDrop(stage.id)}
              >
                {/* Column Header */}
                <div className={cn("flex items-center gap-2 p-3 border-b", stage.bgColor)}>
                  <button
                    onClick={() => toggleCollapse(stage.id)}
                    className="p-0.5 hover:bg-background/50 rounded transition-colors"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>

                  {isCollapsed ? (
                    <div className="flex-1 flex flex-col items-center gap-2 py-2">
                      <span
                        className={cn(
                          "text-xs font-semibold tracking-wider",
                          stage.color,
                          "[writing-mode:vertical-rl] rotate-180"
                        )}
                      >
                        {stage.name.toUpperCase()}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {stage.count}
                      </Badge>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <div className={cn("text-xs font-semibold tracking-wider", stage.color)}>
                          {stage.name.toUpperCase()}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          {stage.count} {stage.count === 1 ? "deal" : "deals"}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Add deal to stage</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </div>

                {/* Cards Container */}
                {!isCollapsed && (
                  <div className="flex-1 overflow-y-auto p-2 space-y-3">
                    {stage.deals.map((deal) => (
                      <DealCard
                        key={deal.id}
                        deal={deal}
                        isDragging={draggedCard?.deal.id === deal.id}
                        onDragStart={() => handleDragStart(stage.id, deal)}
                        onAddNote={() => setNoteDialog({ open: true, deal })}
                        onAssign={() => setAssignDialog({ open: true, deal })}
                      />
                    ))}

                    {stage.deals.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <p className="text-sm">No deals</p>
                        <p className="text-xs mt-1">Drag deals here</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Note Dialog */}
      <Dialog
        open={noteDialog.open}
        onOpenChange={(open) => !open && setNoteDialog({ open: false, deal: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note for {noteDialog.deal?.companyName}</DialogTitle>
            <DialogDescription>
              Internal notes visible to your team members
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                placeholder="Add your thoughts, concerns, or action items..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNoteDialog({ open: false, deal: null })}
            >
              Cancel
            </Button>
            <Button onClick={() => setNoteDialog({ open: false, deal: null })}>
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Team Member Dialog */}
      <Dialog
        open={assignDialog.open}
        onOpenChange={(open) => !open && setAssignDialog({ open: false, deal: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Team Member</DialogTitle>
            <DialogDescription>
              Add collaborators to {assignDialog.deal?.companyName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Team Members</Label>
              <div className="space-y-2">
                {["Priya Sharma", "Rahul Mehta", "Amit Patel", "Sneha Reddy"].map((name) => (
                  <div key={name} className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignDialog({ open: false, deal: null })}
            >
              Cancel
            </Button>
            <Button onClick={() => setAssignDialog({ open: false, deal: null })}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface DealCardProps {
  deal: Deal
  isDragging: boolean
  onDragStart: () => void
  onAddNote: () => void
  onAssign: () => void
}

function DealCard({ deal, isDragging, onDragStart, onAddNote, onAssign }: DealCardProps) {
  const [showActions, setShowActions] = useState(false)

  const getActionIcon = (type: string) => {
    switch (type) {
      case "call":
        return <Calendar className="w-3 h-3" />
      case "meeting":
        return <Users className="w-3 h-3" />
      case "review":
        return <Eye className="w-3 h-3" />
      case "memo":
        return <Pencil className="w-3 h-3" />
      default:
        return <Calendar className="w-3 h-3" />
    }
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className={cn(
        "group relative bg-background border rounded-lg transition-all hover:shadow-md cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 ring-2 ring-primary"
      )}
    >
      {/* Drag Handle */}
      <div className="absolute left-1 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="p-3 pl-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <Link
              href={`/startups/${deal.id}`}
              className="font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
            >
              {deal.companyName}
            </Link>
            <p className="text-xs text-muted-foreground mt-0.5">{deal.sector}</p>
          </div>

          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/startups/${deal.id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onAddNote}>
                  <StickyNote className="w-4 h-4 mr-2" />
                  Add Note
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onAssign}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Assign Team
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 mb-3 p-2 bg-muted/50 rounded-lg">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">ARR</div>
            <div className="text-xs font-semibold">{deal.metrics.arr}</div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">Growth</div>
            <div className="text-xs font-semibold text-green-600">{deal.metrics.growth}</div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">Burn</div>
            <div className="text-xs font-semibold">{deal.metrics.burn}</div>
          </div>
        </div>

        {/* Next Action */}
        <div className="flex items-center gap-2 mb-3 p-2 bg-primary/5 border border-primary/20 rounded-lg">
          {getActionIcon(deal.nextAction.type)}
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-foreground line-clamp-1">
              {deal.nextAction.label}
            </div>
            <div className="text-[10px] text-muted-foreground">{deal.nextAction.dueDate}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Avatar className="w-5 h-5 border border-border">
              <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
                {deal.assignedTo.initials}
              </AvatarFallback>
            </Avatar>
            {deal.collaborators && deal.collaborators.length > 0 && (
              <>
                {deal.collaborators.slice(0, 2).map((collab, idx) => (
                  <Avatar key={idx} className="w-5 h-5 -ml-2 border border-border">
                    <AvatarFallback className="text-[8px] bg-secondary">
                      {collab.initials}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {deal.collaborators.length > 2 && (
                  <div className="w-5 h-5 -ml-2 rounded-full bg-muted border border-border flex items-center justify-center text-[8px] font-medium">
                    +{deal.collaborators.length - 2}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {deal.hasNotes && (
              <MessageSquare className="w-3 h-3 text-muted-foreground" />
            )}
            <span className="text-[10px] text-muted-foreground font-medium">
              {deal.daysInStage}d in stage
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

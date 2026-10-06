"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Pencil,
  ArrowRight,
  Flame,
  Users,
  StickyNote,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface Startup {
  id: string
  name: string
  sector: string
  stage: string
  fundingStage: string
  assignee: {
    name: string
    initials: string
  }
  daysInStage: number
  tags?: string[]
  isHot?: boolean
  amountRaised?: string
  founded?: number
  teamSize?: number
  mrr?: string
  latestNote?: string
}

interface Stage {
  id: string
  name: string
  color: string
  bgColor: string
  textColor: string
  startups: Startup[]
}

const initialStages: Stage[] = [
  {
    id: "intake",
    name: "Intake",
    color: "bg-slate-500",
    bgColor: "bg-slate-50 dark:bg-slate-900/30",
    textColor: "text-slate-700 dark:text-slate-300",
    startups: [
      {
        id: "1",
        name: "TechCorp AI",
        sector: "Fintech",
        stage: "intake",
        fundingStage: "Seed",
        assignee: { name: "Priya Sharma", initials: "PS" },
        daysInStage: 2,
        tags: ["AI", "B2B"],
        isHot: true,
        amountRaised: "$1.2M",
        founded: 2023,
        teamSize: 12,
        mrr: "$50K",
        latestNote: "Strong team with deep fintech experience. Interesting approach to AI-powered fraud detection. Need to dig deeper into unit economics.",
      },
      {
        id: "2",
        name: "HealthX",
        sector: "Healthcare",
        stage: "intake",
        fundingStage: "Pre-Seed",
        assignee: { name: "Rahul Mehta", initials: "RM" },
        daysInStage: 5,
        tags: ["SaaS"],
        amountRaised: "$500K",
        founded: 2024,
        teamSize: 5,
        mrr: "$8K",
        latestNote: "Interesting play in telehealth space. Founders have medical background.",
      },
      {
        id: "3",
        name: "EduLearn",
        sector: "EdTech",
        stage: "intake",
        fundingStage: "Seed",
        assignee: { name: "Priya Sharma", initials: "PS" },
        daysInStage: 1,
        amountRaised: "$800K",
        founded: 2022,
        teamSize: 8,
        mrr: "$25K",
      },
    ],
  },
  {
    id: "screening",
    name: "Screening",
    color: "bg-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/30",
    textColor: "text-blue-700 dark:text-blue-300",
    startups: [
      {
        id: "4",
        name: "GreenEnergy",
        sector: "CleanTech",
        stage: "screening",
        fundingStage: "Series A",
        assignee: { name: "Amit Patel", initials: "AP" },
        daysInStage: 8,
        tags: ["Impact"],
        isHot: true,
        amountRaised: "$4.5M",
        founded: 2021,
        teamSize: 25,
        mrr: "$120K",
        latestNote: "Very strong traction in solar panel optimization. Unit economics look solid.",
      },
      {
        id: "5",
        name: "LogiFlow",
        sector: "Logistics",
        stage: "screening",
        fundingStage: "Seed",
        assignee: { name: "Rahul Mehta", initials: "RM" },
        daysInStage: 3,
        amountRaised: "$1.5M",
        founded: 2023,
        teamSize: 10,
        mrr: "$35K",
      },
    ],
  },
  {
    id: "due-diligence",
    name: "Due Diligence",
    color: "bg-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/30",
    textColor: "text-amber-700 dark:text-amber-300",
    startups: [
      {
        id: "6",
        name: "FinSecure",
        sector: "Fintech",
        stage: "due-diligence",
        fundingStage: "Series A",
        assignee: { name: "Priya Sharma", initials: "PS" },
        daysInStage: 14,
        tags: ["Security", "B2B"],
        isHot: true,
        amountRaised: "$3.8M",
        founded: 2022,
        teamSize: 18,
        mrr: "$85K",
        latestNote: "Customer references checked out well. Legal review in progress.",
      },
      {
        id: "7",
        name: "RetailAI",
        sector: "Retail",
        stage: "due-diligence",
        fundingStage: "Seed",
        assignee: { name: "Amit Patel", initials: "AP" },
        daysInStage: 7,
        tags: ["AI"],
        amountRaised: "$2.1M",
        founded: 2023,
        teamSize: 14,
        mrr: "$42K",
      },
      {
        id: "8",
        name: "CloudOps",
        sector: "DevTools",
        stage: "due-diligence",
        fundingStage: "Series A",
        assignee: { name: "Rahul Mehta", initials: "RM" },
        daysInStage: 21,
        amountRaised: "$5.2M",
        founded: 2021,
        teamSize: 30,
        mrr: "$150K",
      },
    ],
  },
  {
    id: "decision",
    name: "Decision",
    color: "bg-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/30",
    textColor: "text-purple-700 dark:text-purple-300",
    startups: [
      {
        id: "9",
        name: "DataMesh",
        sector: "Data",
        stage: "decision",
        fundingStage: "Series A",
        assignee: { name: "Priya Sharma", initials: "PS" },
        daysInStage: 5,
        tags: ["Infrastructure"],
        isHot: true,
        amountRaised: "$6.0M",
        founded: 2022,
        teamSize: 22,
        mrr: "$180K",
        latestNote: "IC approved. Preparing term sheet discussion.",
      },
    ],
  },
  {
    id: "term-sheet",
    name: "Term Sheet",
    color: "bg-teal-500",
    bgColor: "bg-teal-50 dark:bg-teal-900/30",
    textColor: "text-teal-700 dark:text-teal-300",
    startups: [
      {
        id: "10",
        name: "AgriSmart",
        sector: "AgriTech",
        stage: "term-sheet",
        fundingStage: "Seed",
        assignee: { name: "Amit Patel", initials: "AP" },
        daysInStage: 3,
        tags: ["Rural", "Impact"],
        amountRaised: "$1.8M",
        founded: 2023,
        teamSize: 15,
        mrr: "$55K",
        latestNote: "Term sheet sent. Awaiting founder response.",
      },
    ],
  },
  {
    id: "closed-won",
    name: "Closed Won",
    color: "bg-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/30",
    textColor: "text-green-700 dark:text-green-300",
    startups: [
      {
        id: "11",
        name: "PayFlow",
        sector: "Fintech",
        stage: "closed-won",
        fundingStage: "Series A",
        assignee: { name: "Priya Sharma", initials: "PS" },
        daysInStage: 0,
        tags: ["Payments"],
        amountRaised: "$8.0M",
        founded: 2021,
        teamSize: 35,
        mrr: "$220K",
      },
      {
        id: "12",
        name: "MedTech Plus",
        sector: "Healthcare",
        stage: "closed-won",
        fundingStage: "Seed",
        assignee: { name: "Rahul Mehta", initials: "RM" },
        daysInStage: 0,
        amountRaised: "$2.5M",
        founded: 2022,
        teamSize: 12,
        mrr: "$65K",
      },
    ],
  },
  {
    id: "closed-lost",
    name: "Closed Lost",
    color: "bg-red-500",
    bgColor: "bg-red-50 dark:bg-red-900/30",
    textColor: "text-red-700 dark:text-red-300",
    startups: [
      {
        id: "13",
        name: "TravelBuddy",
        sector: "Travel",
        stage: "closed-lost",
        fundingStage: "Pre-Seed",
        assignee: { name: "Amit Patel", initials: "AP" },
        daysInStage: 0,
        amountRaised: "$300K",
        founded: 2024,
        teamSize: 4,
        mrr: "$3K",
      },
    ],
  },
]

export function PipelineList() {
  const router = useRouter()
  const { toast } = useToast()
  const [stages, setStages] = useState<Stage[]>(initialStages)
  const [collapsedStages, setCollapsedStages] = useState<string[]>([])
  const [expandedCards, setExpandedCards] = useState<string[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [addNoteOpen, setAddNoteOpen] = useState<{ startup: Startup; stageId: string } | null>(null)
  const [addNoteContent, setAddNoteContent] = useState("")
  const [moveStageOpen, setMoveStageOpen] = useState<{ startup: Startup; stageId: string } | null>(null)
  const [moveStageTargetId, setMoveStageTargetId] = useState("")
  const [bulkMoveTargetId, setBulkMoveTargetId] = useState("")
  const [bulkAssignTo, setBulkAssignTo] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const moveStartupToStage = (startupId: string, fromStageId: string, toStageId: string) => {
    if (fromStageId === toStageId) return
    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id === fromStageId) {
          const startup = stage.startups.find((s) => s.id === startupId)
          if (!startup) return stage
          return {
            ...stage,
            startups: stage.startups.filter((s) => s.id !== startupId),
          }
        }
        if (stage.id === toStageId) {
          const fromStage = prev.find((s) => s.id === fromStageId)
          const startup = fromStage?.startups.find((s) => s.id === startupId)
          if (!startup) return stage
          return {
            ...stage,
            startups: [...stage.startups, { ...startup, stage: toStageId, daysInStage: 0 }],
          }
        }
        return stage
      })
    )
    toast({ title: "Moved", description: "Startup moved to new stage." })
  }

  const updateStartupNote = (startupId: string, stageId: string, note: string) => {
    setStages((prev) =>
      prev.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              startups: stage.startups.map((s) =>
                s.id === startupId ? { ...s, latestNote: note } : s
              ),
            }
          : stage
      )
    )
    toast({ title: "Note saved", description: "Note has been updated." })
  }

  const assignStartups = (startupIds: string[], assigneeKey: string) => {
    const assignees: Record<string, { name: string; initials: string }> = {
      ps: { name: "Priya Sharma", initials: "PS" },
      rm: { name: "Rahul Mehta", initials: "RM" },
      ap: { name: "Amit Patel", initials: "AP" },
    }
    const assignee = assignees[assigneeKey] ?? assignees.ps
    setStages((prev) =>
      prev.map((stage) => ({
        ...stage,
        startups: stage.startups.map((s) =>
          startupIds.includes(s.id) ? { ...s, assignee } : s
        ),
      }))
    )
    setSelectedItems([])
    toast({ title: "Assigned", description: `${startupIds.length} startup(s) assigned.` })
  }

  const removeStartups = (startupIds: string[]) => {
    setStages((prev) =>
      prev.map((stage) => ({
        ...stage,
        startups: stage.startups.filter((s) => !startupIds.includes(s.id)),
      }))
    )
    setSelectedItems([])
    setDeleteConfirmOpen(false)
    toast({ title: "Removed", description: "Startup(s) removed from pipeline." })
  }

  const toggleStageCollapse = (stageId: string) => {
    setCollapsedStages((prev) =>
      prev.includes(stageId) ? prev.filter((id) => id !== stageId) : [...prev, stageId]
    )
  }

  const toggleCardExpand = (startupId: string) => {
    setExpandedCards((prev) =>
      prev.includes(startupId) ? prev.filter((id) => id !== startupId) : [...prev, startupId]
    )
  }

  const toggleSelectItem = (startupId: string) => {
    setSelectedItems((prev) =>
      prev.includes(startupId) ? prev.filter((id) => id !== startupId) : [...prev, startupId]
    )
  }

  const toggleSelectAll = (stageStartups: Startup[]) => {
    const stageIds = stageStartups.map((s) => s.id)
    const allSelected = stageIds.every((id) => selectedItems.includes(id))
    if (allSelected) {
      setSelectedItems((prev) => prev.filter((id) => !stageIds.includes(id)))
    } else {
      setSelectedItems((prev) => [...new Set([...prev, ...stageIds])])
    }
  }

  const collapseAll = () => {
    setCollapsedStages(stages.map((s) => s.id))
  }

  const expandAll = () => {
    setCollapsedStages([])
  }

  const totalStartups = stages.reduce((acc, s) => acc + s.startups.length, 0)

  return (
    <div className="h-full flex flex-col">
      {/* Bulk Actions Bar */}
      {selectedItems.length > 0 && (
        <div className="sticky top-0 z-10 bg-primary text-primary-foreground px-4 md:px-6 py-3 flex items-center gap-4 border-b">
          <span className="text-sm font-medium">{selectedItems.length} selected</span>
          <div className="flex items-center gap-2">
            <Select value={bulkMoveTargetId} onValueChange={setBulkMoveTargetId}>
              <SelectTrigger className="h-8 w-[140px] bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <SelectValue placeholder="Move to Stage" />
              </SelectTrigger>
              <SelectContent>
                {stages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              disabled={!bulkMoveTargetId}
              onClick={() => {
                if (!bulkMoveTargetId) return
                setStages((prev) => {
                  const moved: Startup[] = []
                  prev.forEach((stage) => {
                    stage.startups
                      .filter((s) => selectedItems.includes(s.id))
                      .forEach((s) => moved.push({ ...s, stage: bulkMoveTargetId, daysInStage: 0 }))
                  })
                  return prev.map((stage) => {
                    if (stage.id === bulkMoveTargetId) {
                      const existing = stage.startups.filter((s) => !selectedItems.includes(s.id))
                      return { ...stage, startups: [...existing, ...moved] }
                    }
                    return { ...stage, startups: stage.startups.filter((s) => !selectedItems.includes(s.id)) }
                  })
                })
                setSelectedItems([])
                setBulkMoveTargetId("")
                toast({ title: "Moved", description: `${selectedItems.length} startup(s) moved.` })
              }}
            >
              Apply Move
            </Button>
            <Select value={bulkAssignTo} onValueChange={setBulkAssignTo}>
              <SelectTrigger className="h-8 w-[130px] bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <SelectValue placeholder="Assign to" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ps">Priya Sharma</SelectItem>
                <SelectItem value="rm">Rahul Mehta</SelectItem>
                <SelectItem value="ap">Amit Patel</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              disabled={!bulkAssignTo}
              onClick={() => {
                if (bulkAssignTo) assignStartups(selectedItems, bulkAssignTo)
                setBulkAssignTo("")
              }}
            >
              Apply Assign
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setDeleteConfirmOpen(true)}
            >
              Delete
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => setSelectedItems([])}
            className="ml-auto text-primary-foreground hover:bg-primary-foreground/10"
          >
            Clear selection
          </Button>
        </div>
      )}

      {/* List Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">{totalStartups} startups in pipeline</p>
            <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={expandAll} className="text-xs" aria-label="Expand all stages">
              Expand All
            </Button>
            <Button variant="ghost" size="sm" type="button" onClick={collapseAll} className="text-xs" aria-label="Collapse all stages">
              Collapse All
            </Button>
          </div>
        </div>

        {/* Stages */}
        <div className="space-y-4">
          {stages.map((stage) => {
            const isCollapsed = collapsedStages.includes(stage.id)
            const stageIds = stage.startups.map((s) => s.id)
            const allSelected = stageIds.length > 0 && stageIds.every((id) => selectedItems.includes(id))
            const someSelected = stageIds.some((id) => selectedItems.includes(id))

            return (
              <div key={stage.id} className="border rounded-lg overflow-hidden">
                {/* Stage Header */}
                <button
                  type="button"
                  onClick={() => toggleStageCollapse(stage.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 transition-colors",
                    stage.bgColor
                  )}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                    <div className={cn("w-2.5 h-2.5 rounded-full", stage.color)} />
                    <span className={cn("font-semibold text-sm", stage.textColor)}>
                      {stage.name.toUpperCase()}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {stage.startups.length} startups
                    </Badge>
                  </div>
                </button>

                {/* Stage Content */}
                {!isCollapsed && (
                  <div className="divide-y">
                    {/* Select All Row */}
                    {stage.startups.length > 0 && (
                      <div className="px-4 py-2 bg-muted/30 flex items-center gap-3">
                        <Checkbox
                          checked={allSelected}
                          onCheckedChange={() => toggleSelectAll(stage.startups)}
                          className={someSelected && !allSelected ? "data-[state=checked]:bg-primary/50" : ""}
                        />
                        <span className="text-xs text-muted-foreground">
                          {allSelected ? "Deselect all" : "Select all"} in {stage.name}
                        </span>
                      </div>
                    )}

                    {/* Startup Items */}
                    {stage.startups.map((startup) => {
                      const isExpanded = expandedCards.includes(startup.id)
                      const isSelected = selectedItems.includes(startup.id)

                      return (
                        <div
                          key={startup.id}
                          className={cn(
                            "transition-colors",
                            isSelected && "bg-primary/5"
                          )}
                        >
                          {/* Collapsed Row */}
                          <div
                            className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer"
                            onClick={() => toggleCardExpand(startup.id)}
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleSelectItem(startup.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0 flex items-center gap-4">
                              <div className="flex items-center gap-2 min-w-0">
                                <Link 
                                  href={`/startups/${startup.id}`}
                                  className="font-medium text-sm text-foreground truncate hover:text-primary transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {startup.name}
                                </Link>
                                {startup.isHot && (
                                  <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                                )}
                              </div>
                              <Badge variant="outline" className="text-xs shrink-0">
                                {startup.sector}
                              </Badge>
                              <Badge variant="secondary" className="text-xs shrink-0">
                                {startup.fundingStage}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Avatar className="w-5 h-5">
                                  <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
                                    {startup.assignee.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs">@{startup.assignee.name.split(" ")[0]}</span>
                              </div>
                              <span className="text-xs">
                                {startup.daysInStage === 0
                                  ? "Today"
                                  : startup.daysInStage === 1
                                  ? "1d ago"
                                  : `${startup.daysInStage}d ago`}
                              </span>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  type="button"
                                  className="h-8 w-8 shrink-0"
                                  onClick={(e) => e.stopPropagation()}
                                  aria-label="Card actions"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/startups/${startup.id}`} onClick={(e) => e.stopPropagation()}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Profile
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem type="button" onClick={(e) => { e.stopPropagation(); router.push(`/startups/${startup.id}`); }}>
                                  <Pencil className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem type="button" onClick={(e) => { e.stopPropagation(); setMoveStageOpen({ startup, stageId: stage.id }); setMoveStageTargetId(stage.id); }}>
                                  <ArrowRight className="w-4 h-4 mr-2" />
                                  Move to Stage
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Expanded Content */}
                          {isExpanded && (
                            <div className="px-4 pb-4 pt-1 ml-11 border-t">
                              {/* Details Grid */}
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-3">
                                <div className="flex items-center gap-2 text-sm">
                                  <Badge variant="outline" className="text-xs font-normal">
                                    Sector
                                  </Badge>
                                  <span className="text-foreground">{startup.sector}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Badge variant="outline" className="text-xs font-normal">
                                    Stage
                                  </Badge>
                                  <span className="text-foreground">{startup.fundingStage}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                                  <span className="text-foreground">{startup.amountRaised || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                  <span className="text-foreground">Founded {startup.founded || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                                  <span className="text-foreground">{startup.teamSize || "N/A"} team</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                                  <span className="text-foreground">MRR: {startup.mrr || "N/A"}</span>
                                </div>
                              </div>

                              {/* Tags */}
                              {startup.tags && startup.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 py-2">
                                  {startup.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Latest Note */}
                              {startup.latestNote && (
                                <div className="py-3 border-t mt-2">
                                  <div className="flex items-start gap-2">
                                    <StickyNote className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                      {startup.latestNote}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Actions */}
                              <div className="flex items-center gap-2 pt-3 border-t mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  type="button"
                                  onClick={() => router.push(`/startups/${startup.id}`)}
                                >
                                  View Profile
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  type="button"
                                  onClick={() => router.push("/ai-insights/investor-matching")}
                                >
                                  <Users className="w-3.5 h-3.5 mr-1.5" />
                                  Find Matches
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  type="button"
                                  onClick={() => {
                                    setAddNoteOpen({ startup, stageId: stage.id })
                                    setAddNoteContent(startup.latestNote ?? "")
                                  }}
                                >
                                  <StickyNote className="w-3.5 h-3.5 mr-1.5" />
                                  Add Note
                                </Button>
                                <Select
                                  value={stage.id}
                                  onValueChange={(toId) => {
                                    if (toId !== stage.id) moveStartupToStage(startup.id, stage.id, toId)
                                  }}
                                >
                                  <SelectTrigger className="h-8 w-[130px]" aria-label={`Move ${startup.name} to stage`}>
                                    <SelectValue placeholder="Move Stage" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {stages.map((s) => (
                                      <SelectItem key={s.id} value={s.id}>
                                        {s.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}

                    {/* Empty State */}
                    {stage.startups.length === 0 && (
                      <div className="py-8 text-center text-muted-foreground">
                        <p className="text-sm">No startups in this stage</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Add Note */}
      <Dialog open={!!addNoteOpen} onOpenChange={(open) => !open && (setAddNoteOpen(null), setAddNoteContent(""))}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add note</DialogTitle>
            <DialogDescription>
              Add or update a note for {addNoteOpen?.startup.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="note-content">Note</Label>
            <Textarea
              id="note-content"
              value={addNoteContent}
              onChange={(e) => setAddNoteContent(e.target.value)}
              placeholder="Enter your note..."
              className="mt-2 min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => { setAddNoteOpen(null); setAddNoteContent(""); }}>Cancel</Button>
            <Button
              type="button"
              onClick={() => {
                if (addNoteOpen) {
                  updateStartupNote(addNoteOpen.startup.id, addNoteOpen.stageId, addNoteContent)
                  setAddNoteOpen(null)
                  setAddNoteContent("")
                }
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move to Stage (from dropdown) */}
      <Dialog open={!!moveStageOpen} onOpenChange={(open) => !open && (setMoveStageOpen(null), setMoveStageTargetId(""))}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Move to stage</DialogTitle>
            <DialogDescription>
              Move {moveStageOpen?.startup.name} to another pipeline stage.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Target stage</Label>
            <Select value={moveStageTargetId} onValueChange={setMoveStageTargetId}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                {stages.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => { setMoveStageOpen(null); setMoveStageTargetId(""); }}>Cancel</Button>
            <Button
              type="button"
              disabled={!moveStageTargetId || moveStageTargetId === moveStageOpen?.stageId}
              onClick={() => {
                if (moveStageOpen && moveStageTargetId && moveStageTargetId !== moveStageOpen.stageId) {
                  moveStartupToStage(moveStageOpen.startup.id, moveStageOpen.stageId, moveStageTargetId)
                  setMoveStageOpen(null)
                  setMoveStageTargetId("")
                }
              }}
            >
              Move
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove from pipeline?</DialogTitle>
            <DialogDescription>
              Remove {selectedItems.length} startup(s) from the pipeline? This does not delete the startup profile.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" type="button" onClick={() => removeStartups(selectedItems)}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

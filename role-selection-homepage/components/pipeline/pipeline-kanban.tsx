"use client"

import React from "react"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Plus,
  MoreHorizontal,
  GripVertical,
  Flame,
  Eye,
  Pencil,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Settings,
  CheckSquare,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Startup {
  id: string
  name: string
  sector: string
  stage: string
  assignee: {
    name: string
    initials: string
  }
  daysInStage: number
  tags?: string[]
  isHot?: boolean
}

interface Stage {
  id: string
  name: string
  color: string
  bgColor: string
  borderColor: string
  countBadgeClass: string
  startups: Startup[]
  wipLimit?: number
}

const initialStages: Stage[] = [
  {
    id: "intake",
    name: "Intake",
    color: "text-muted-foreground",
    bgColor: "bg-muted/50 dark:bg-muted/30",
    borderColor: "border-muted-foreground/30",
    countBadgeClass: "bg-muted-foreground/20 text-muted-foreground",
    startups: [
      {
        id: "1",
        name: "TechCorp AI",
        sector: "Fintech",
        stage: "Seed",
        assignee: { name: "Priya Sharma", initials: "PS" },
        daysInStage: 2,
        tags: ["AI", "B2B"],
        isHot: true,
      },
      {
        id: "2",
        name: "HealthX",
        sector: "Healthcare",
        stage: "Pre-Seed",
        assignee: { name: "Rahul Mehta", initials: "RM" },
        daysInStage: 5,
        tags: ["SaaS"],
      },
      {
        id: "3",
        name: "EduLearn",
        sector: "EdTech",
        stage: "Seed",
        assignee: { name: "Priya Sharma", initials: "PS" },
        daysInStage: 1,
      },
    ],
  },
  {
    id: "screening",
    name: "Screening",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/40",
    borderColor: "border-blue-300 dark:border-blue-700",
    countBadgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-800/50 dark:text-blue-300",
    startups: [
      {
        id: "4",
        name: "GreenEnergy",
        sector: "CleanTech",
        stage: "Series A",
        assignee: { name: "Amit Patel", initials: "AP" },
        daysInStage: 8,
        tags: ["Impact"],
        isHot: true,
      },
      {
        id: "5",
        name: "LogiFlow",
        sector: "Logistics",
        stage: "Seed",
        assignee: { name: "Rahul Mehta", initials: "RM" },
        daysInStage: 3,
      },
    ],
  },
  {
    id: "due-diligence",
    name: "Due Diligence",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/40",
    borderColor: "border-amber-300 dark:border-amber-700",
    countBadgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-800/50 dark:text-amber-300",
    startups: [
      {
        id: "6",
        name: "FinSecure",
        sector: "Fintech",
        stage: "Series A",
        assignee: { name: "Priya Sharma", initials: "PS" },
        daysInStage: 14,
        tags: ["Security", "B2B"],
        isHot: true,
      },
      {
        id: "7",
        name: "RetailAI",
        sector: "Retail",
        stage: "Seed",
        assignee: { name: "Amit Patel", initials: "AP" },
        daysInStage: 7,
        tags: ["AI"],
      },
      {
        id: "8",
        name: "CloudOps",
        sector: "DevTools",
        stage: "Series A",
        assignee: { name: "Rahul Mehta", initials: "RM" },
        daysInStage: 21,
      },
    ],
  },
  {
    id: "decision",
    name: "Decision",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/40",
    borderColor: "border-purple-300 dark:border-purple-700",
    countBadgeClass: "bg-purple-100 text-purple-700 dark:bg-purple-800/50 dark:text-purple-300",
    startups: [
      {
        id: "9",
        name: "DataMesh",
        sector: "Data",
        stage: "Series A",
        assignee: { name: "Priya Sharma", initials: "PS" },
        daysInStage: 5,
        tags: ["Infrastructure"],
        isHot: true,
      },
    ],
  },
  {
    id: "term-sheet",
    name: "Term Sheet",
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-50 dark:bg-teal-900/40",
    borderColor: "border-teal-300 dark:border-teal-700",
    countBadgeClass: "bg-teal-100 text-teal-700 dark:bg-teal-800/50 dark:text-teal-300",
    startups: [
      {
        id: "10",
        name: "AgriSmart",
        sector: "AgriTech",
        stage: "Seed",
        assignee: { name: "Amit Patel", initials: "AP" },
        daysInStage: 3,
        tags: ["Rural", "Impact"],
      },
    ],
  },
  {
    id: "closed-won",
    name: "Closed Won",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/40",
    borderColor: "border-green-300 dark:border-green-700",
    countBadgeClass: "bg-green-100 text-green-700 dark:bg-green-800/50 dark:text-green-300",
    startups: [
      {
        id: "11",
        name: "PayFlow",
        sector: "Fintech",
        stage: "Series A",
        assignee: { name: "Priya Sharma", initials: "PS" },
        daysInStage: 0,
        tags: ["Payments"],
      },
      {
        id: "12",
        name: "MedTech Plus",
        sector: "Healthcare",
        stage: "Seed",
        assignee: { name: "Rahul Mehta", initials: "RM" },
        daysInStage: 0,
      },
    ],
  },
  {
    id: "closed-lost",
    name: "Closed Lost",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/40",
    borderColor: "border-red-300 dark:border-red-700",
    countBadgeClass: "bg-red-100 text-red-700 dark:bg-red-800/50 dark:text-red-300",
    startups: [
      {
        id: "13",
        name: "TravelBuddy",
        sector: "Travel",
        stage: "Pre-Seed",
        assignee: { name: "Amit Patel", initials: "AP" },
        daysInStage: 0,
      },
    ],
  },
]

interface PipelineKanbanProps {
  onAddStartup?: () => void
}

export function PipelineKanban({ onAddStartup }: PipelineKanbanProps) {
  const [stages, setStages] = useState<Stage[]>(initialStages)
  const [draggedCard, setDraggedCard] = useState<{ stageId: string; startup: Startup } | null>(null)
  const [dragOverStage, setDragOverStage] = useState<string | null>(null)
  const [collapsedStages, setCollapsedStages] = useState<string[]>([])
  const [columnSettingsStageId, setColumnSettingsStageId] = useState<string | null>(null)
  const [columnSettingsName, setColumnSettingsName] = useState("")
  const [columnSettingsWip, setColumnSettingsWip] = useState<string>("")
  const [selectAllStageId, setSelectAllStageId] = useState<string | null>(null)
  const [bulkAction, setBulkAction] = useState<"move" | "assign">("move")
  const [bulkTargetStageId, setBulkTargetStageId] = useState<string>("")
  const [bulkAssignee, setBulkAssignee] = useState<string>("")
  const [automationRulesStageId, setAutomationRulesStageId] = useState<string | null>(null)
  const [automationRules, setAutomationRules] = useState<Record<string, { id: string; condition: string; action: string }[]>>({})
  const [newRuleCondition, setNewRuleCondition] = useState("")
  const [newRuleAction, setNewRuleAction] = useState("")
  const [importCsvOpen, setImportCsvOpen] = useState(false)
  const [importCsvStageId, setImportCsvStageId] = useState<string | null>(null)
  const [importCsvFile, setImportCsvFile] = useState<File | null>(null)
  const [moveCardDialog, setMoveCardDialog] = useState<{ startup: Startup; fromStageId: string } | null>(null)
  const [moveCardTargetStageId, setMoveCardTargetStageId] = useState("")
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    startup: Startup | null
    fromStage: string
    toStage: string
  }>({ open: false, startup: null, fromStage: "", toStage: "" })

  const toggleCollapse = (stageId: string) => {
    setCollapsedStages((prev) =>
      prev.includes(stageId) ? prev.filter((id) => id !== stageId) : [...prev, stageId]
    )
  }

  const handleDragStart = (stageId: string, startup: Startup) => {
    setDraggedCard({ stageId, startup })
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

      // Check if moving to Closed Lost - require confirmation
      if (targetStageId === "closed-lost") {
        setConfirmDialog({
          open: true,
          startup: draggedCard.startup,
          fromStage: draggedCard.stageId,
          toStage: targetStageId,
        })
        setDragOverStage(null)
        return
      }

      moveCard(draggedCard.stageId, targetStageId, draggedCard.startup)
    },
    [draggedCard]
  )

  const moveCard = (fromStageId: string, toStageId: string, startup: Startup) => {
    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id === fromStageId) {
          return {
            ...stage,
            startups: stage.startups.filter((s) => s.id !== startup.id),
          }
        }
        if (stage.id === toStageId) {
          return {
            ...stage,
            startups: [...stage.startups, { ...startup, daysInStage: 0 }],
          }
        }
        return stage
      })
    )
    setDraggedCard(null)
    setDragOverStage(null)
  }

  const confirmMove = () => {
    if (confirmDialog.startup) {
      moveCard(confirmDialog.fromStage, confirmDialog.toStage, confirmDialog.startup)
    }
    setConfirmDialog({ open: false, startup: null, fromStage: "", toStage: "" })
  }

  return (
    <>
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
                  isCollapsed ? "w-12" : "w-72 min-w-72",
                  isDragOver && "ring-2 ring-primary ring-offset-2"
                )}
                onDragOver={(e) => handleDragOver(e, stage.id)}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDrop(stage.id)}
              >
                {/* Column Header */}
                <div
                  className={cn(
                    "flex items-center gap-2 p-3 border-b",
                    stage.bgColor
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleCollapse(stage.id)}
                    className="p-0.5 hover:bg-background/50 rounded transition-colors"
                    aria-label={isCollapsed ? "Expand column" : "Collapse column"}
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
                      <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-md", stage.countBadgeClass)}>
                        {stage.startups.length}
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className={cn("text-xs font-semibold tracking-wider flex-1", stage.color)}>
                        {stage.name.toUpperCase()}
                        {stage.wipLimit != null && stage.wipLimit > 0 && (
                          <span className="ml-1 font-normal opacity-80">
                            ({stage.startups.length}/{stage.wipLimit})
                          </span>
                        )}
                      </span>
                      <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-md", stage.countBadgeClass)}>
                        {stage.startups.length}
                      </span>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6" type="button" aria-label="Add to column">
                            <Plus className="w-3.5 h-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="z-[100]">
                          <DropdownMenuItem onClick={() => onAddStartup?.()} type="button">
                            Add new startup
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setImportCsvStageId(stage.id)
                              setImportCsvOpen(true)
                            }}
                            type="button"
                          >
                            Import from CSV
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6" type="button" aria-label="Column options">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="z-[100]">
                          <DropdownMenuItem
                            onClick={() => {
                              setColumnSettingsStageId(stage.id)
                              setColumnSettingsName(stage.name)
                              setColumnSettingsWip(stage.wipLimit != null ? String(stage.wipLimit) : "")
                            }}
                            type="button"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Column settings
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectAllStageId(stage.id)
                              setBulkAction("move")
                              setBulkTargetStageId(stages.find((s) => s.id !== stage.id)?.id ?? "")
                              setBulkAssignee("")
                            }}
                            type="button"
                          >
                            <CheckSquare className="w-4 h-4 mr-2" />
                            Select all cards
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setAutomationRulesStageId(stage.id)} type="button">
                            Automation rules
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </div>

                {/* Cards Container */}
                {!isCollapsed && (
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {stage.startups.map((startup) => (
                      <StartupCard
                        key={startup.id}
                        startup={startup}
                        stageId={stage.id}
                        stageColor={stage.color}
                        isDragging={draggedCard?.startup.id === startup.id}
                        onDragStart={() => handleDragStart(stage.id, startup)}
                        onMoveTo={() => {
                          setMoveCardDialog({ startup, fromStageId: stage.id })
                          setMoveCardTargetStageId(stages.find((s) => s.id !== stage.id)?.id ?? "")
                        }}
                      />
                    ))}

                    {stage.startups.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <p className="text-sm">No startups</p>
                        <p className="text-xs">Drag cards here or add new</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Column settings */}
      <Dialog open={!!columnSettingsStageId} onOpenChange={(open) => !open && setColumnSettingsStageId(null)}>
        <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Column settings</DialogTitle>
            <DialogDescription>
              Configure the column. Changes apply to this pipeline view.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="column-name">Column name</Label>
              <Input
                id="column-name"
                value={columnSettingsName}
                onChange={(e) => setColumnSettingsName(e.target.value)}
                className="bg-transparent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wip-limit">WIP limit (optional)</Label>
              <Input
                id="wip-limit"
                type="number"
                placeholder="No limit"
                min={0}
                value={columnSettingsWip}
                onChange={(e) => setColumnSettingsWip(e.target.value)}
                className="bg-transparent"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setColumnSettingsStageId(null)} type="button">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!columnSettingsStageId) return
                setStages((prev) =>
                  prev.map((s) =>
                    s.id === columnSettingsStageId
                      ? {
                          ...s,
                          name: columnSettingsName.trim() || s.name,
                          wipLimit: columnSettingsWip === "" ? undefined : Math.max(0, parseInt(columnSettingsWip, 10) || 0),
                        }
                      : s
                  )
                )
                setColumnSettingsStageId(null)
              }}
              type="button"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Select all cards / Bulk actions */}
      <Dialog open={!!selectAllStageId} onOpenChange={(open) => !open && setSelectAllStageId(null)}>
        <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Bulk actions</DialogTitle>
            <DialogDescription>
              {stages.find((s) => s.id === selectAllStageId)?.startups.length ?? 0} cards selected in{" "}
              {stages.find((s) => s.id === selectAllStageId)?.name ?? "this column"}. Choose an action to apply to all.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Action</Label>
              <Select value={bulkAction} onValueChange={(v) => setBulkAction(v as "move" | "assign")}>
                <SelectTrigger className="bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="move">Move to stage</SelectItem>
                  <SelectItem value="assign">Assign to</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {bulkAction === "move" && (
              <div className="space-y-2">
                <Label>Target stage</Label>
                <Select value={bulkTargetStageId} onValueChange={setBulkTargetStageId}>
                  <SelectTrigger className="bg-transparent">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages
                      .filter((s) => s.id !== selectAllStageId)
                      .map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {bulkAction === "assign" && (
              <div className="space-y-2">
                <Label>Assign to</Label>
                <Select value={bulkAssignee} onValueChange={setBulkAssignee}>
                  <SelectTrigger className="bg-transparent">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Priya Sharma">Priya Sharma</SelectItem>
                    <SelectItem value="Rahul Mehta">Rahul Mehta</SelectItem>
                    <SelectItem value="Amit Patel">Amit Patel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {selectAllStageId && (
              <ul className="text-sm text-muted-foreground list-disc list-inside max-h-32 overflow-y-auto">
                {stages.find((s) => s.id === selectAllStageId)?.startups.map((s) => (
                  <li key={s.id}>{s.name}</li>
                ))}
              </ul>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectAllStageId(null)} type="button">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!selectAllStageId) return
                const stage = stages.find((s) => s.id === selectAllStageId)
                if (!stage) return
                if (bulkAction === "move" && bulkTargetStageId) {
                  setStages((prev) => {
                    const fromStage = prev.find((s) => s.id === selectAllStageId)
                    const toStage = prev.find((s) => s.id === bulkTargetStageId)
                    if (!fromStage || !toStage) return prev
                    const moved = fromStage.startups.map((s) => ({ ...s, daysInStage: 0 }))
                    return prev.map((s) => {
                      if (s.id === selectAllStageId) return { ...s, startups: [] }
                      if (s.id === bulkTargetStageId) return { ...s, startups: [...s.startups, ...moved] }
                      return s
                    })
                  })
                }
                if (bulkAction === "assign" && bulkAssignee) {
                  const [firstName, lastName] = bulkAssignee.split(" ")
                  const initials = (firstName?.[0] ?? "") + (lastName?.[0] ?? "")
                  setStages((prev) =>
                    prev.map((s) =>
                      s.id === selectAllStageId
                        ? {
                            ...s,
                            startups: s.startups.map((startup) => ({
                              ...startup,
                              assignee: { name: bulkAssignee, initials },
                            })),
                          }
                        : s
                    )
                  )
                }
                setSelectAllStageId(null)
              }}
              type="button"
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Automation rules */}
      <Dialog open={!!automationRulesStageId} onOpenChange={(open) => !open && (setAutomationRulesStageId(null), setNewRuleCondition(""), setNewRuleAction(""))}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" onCloseAutoFocus={(e) => e?.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Automation rules</DialogTitle>
            <DialogDescription>
              Define rules for the {stages.find((s) => s.id === automationRulesStageId)?.name ?? "stage"} column. When conditions are met, actions run automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Example: When a card is in this column for more than 7 days, send a reminder to the assignee.
            </p>
            {automationRulesStageId && (automationRules[automationRulesStageId] ?? []).length > 0 ? (
              <ul className="space-y-2 rounded-lg border p-3">
                {(automationRules[automationRulesStageId] ?? []).map((rule) => (
                  <li key={rule.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-muted-foreground">When {rule.condition} → {rule.action}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-destructive hover:text-destructive"
                      type="button"
                      aria-label="Remove rule"
                      onClick={() =>
                        setAutomationRules((prev) => ({
                          ...prev,
                          [automationRulesStageId]: (prev[automationRulesStageId] ?? []).filter((r) => r.id !== rule.id),
                        }))
                      }
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                No rules yet. Add your first rule below.
              </div>
            )}
            <div className="space-y-2">
              <Label>New rule</Label>
              <Input
                placeholder="e.g. Card in column &gt; 7 days"
                value={newRuleCondition}
                onChange={(e) => setNewRuleCondition(e.target.value)}
                className="bg-transparent"
              />
              <Input
                placeholder="e.g. Send reminder to assignee"
                value={newRuleAction}
                onChange={(e) => setNewRuleAction(e.target.value)}
                className="bg-transparent"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAutomationRulesStageId(null)} type="button">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!automationRulesStageId || !newRuleCondition.trim() || !newRuleAction.trim()) return
                const id = `rule-${Date.now()}`
                setAutomationRules((prev) => ({
                  ...prev,
                  [automationRulesStageId]: [...(prev[automationRulesStageId] ?? []), { id, condition: newRuleCondition.trim(), action: newRuleAction.trim() }],
                }))
                setNewRuleCondition("")
                setNewRuleAction("")
              }}
              type="button"
            >
              Add rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import from CSV */}
      <Dialog
        open={importCsvOpen}
        onOpenChange={(open) => {
          if (!open) setImportCsvFile(null)
          setImportCsvOpen(open)
        }}
      >
        <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Import from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file to add multiple startups to the pipeline. Columns: Name, Sector, Stage, Assignee (optional).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">CSV file</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                className="bg-transparent"
                onChange={(e) => setImportCsvFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportCsvOpen(false)} type="button">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!importCsvStageId) return
                if (!importCsvFile) {
                  setImportCsvOpen(false)
                  return
                }
                const reader = new FileReader()
                reader.onload = () => {
                  const text = String(reader.result ?? "")
                  const lines = text.split(/\r?\n/).filter((line) => line.trim())
                  const isHeader = (row: string[]) =>
                    row[0]?.toLowerCase() === "name" || row.some((c) => c.toLowerCase().includes("sector"))
                  const rows = lines.map((line) => line.split(",").map((c) => c.trim()))
                  const dataRows = rows.length > 0 && isHeader(rows[0]) ? rows.slice(1) : rows
                  const assignees: { name: string; initials: string }[] = [
                    { name: "Priya Sharma", initials: "PS" },
                    { name: "Rahul Mehta", initials: "RM" },
                    { name: "Amit Patel", initials: "AP" },
                  ]
                  const parseAssignee = (val: string) => {
                    if (!val) return assignees[0]
                    const found = assignees.find((a) => a.name.toLowerCase().includes(val.toLowerCase()))
                    return found ?? { name: val, initials: val.slice(0, 2).toUpperCase() }
                  }
                  const newStartups: Startup[] = dataRows.map((row, i) => ({
                    id: `import-${Date.now()}-${i}`,
                    name: row[0] ?? `Startup ${i + 1}`,
                    sector: row[1] ?? "Other",
                    stage: row[2] ?? "Seed",
                    assignee: parseAssignee(row[3]),
                    daysInStage: 0,
                  }))
                  setStages((prev) =>
                    prev.map((s) =>
                      s.id === importCsvStageId
                        ? { ...s, startups: [...s.startups, ...newStartups] }
                        : s
                    )
                  )
                  setImportCsvOpen(false)
                  setImportCsvFile(null)
                }
                reader.readAsText(importCsvFile)
              }}
              type="button"
            >
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ ...confirmDialog, open: false })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to Closed Lost?</DialogTitle>
            <DialogDescription>
              Are you sure you want to move{" "}
              <span className="font-medium text-foreground">{confirmDialog.startup?.name}</span> to
              Closed Lost? This action indicates the deal has been passed or rejected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
              type="button"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmMove} type="button">
              Move to Closed Lost
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move card to stage */}
      <Dialog
        open={!!moveCardDialog}
        onOpenChange={(open) => !open && (setMoveCardDialog(null), setMoveCardTargetStageId(""))}
      >
        <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Move to stage</DialogTitle>
            <DialogDescription>
              Move {moveCardDialog?.startup.name} to another column.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Target stage</Label>
              <Select value={moveCardTargetStageId} onValueChange={setMoveCardTargetStageId}>
                <SelectTrigger className="bg-transparent">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages
                    .filter((s) => s.id !== moveCardDialog?.fromStageId)
                    .map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveCardDialog(null)} type="button">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!moveCardDialog || !moveCardTargetStageId) return
                moveCard(moveCardDialog.fromStageId, moveCardTargetStageId, moveCardDialog.startup)
                setMoveCardDialog(null)
                setMoveCardTargetStageId("")
              }}
              type="button"
            >
              Move
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface StartupCardProps {
  startup: Startup
  stageId: string
  stageColor: string
  isDragging: boolean
  onDragStart: () => void
  onMoveTo: () => void
}

function StartupCard({ startup, stageId, stageColor, isDragging, onDragStart, onMoveTo }: StartupCardProps) {
  const router = useRouter()
  const [showActions, setShowActions] = useState(false)

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if dragging or clicking on actions
    if (isDragging) {
      e.preventDefault()
    }
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className={cn(
        "group relative bg-background border rounded-lg transition-all hover:shadow-md",
        isDragging && "opacity-50 ring-2 ring-primary"
      )}
    >
      {/* Drag Handle */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10">
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* 3-dots menu: outside Link so clicks don't propagate and menu doesn't flicker */}
      {showActions && (
        <div className="absolute right-1 top-3 z-20">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                type="button"
                aria-label="Card actions"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[100]" sideOffset={4}>
              <DropdownMenuItem asChild>
                <Link href={`/startups/${startup.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem type="button" onClick={() => router.push(`/startups/${startup.id}`)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem type="button" onClick={onMoveTo}>
                <ArrowRight className="w-4 h-4 mr-2" />
                Move to...
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Content - Wrapped in Link */}
      <Link
        href={`/startups/${startup.id}`}
        onClick={handleCardClick}
        className="block p-3 pl-6 cursor-pointer"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">{startup.name}</h4>
              {startup.isHot && (
                <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {startup.sector} · {startup.stage}
            </p>
          </div>
          <div className="w-7 shrink-0" />
        </div>

        {/* Tags */}
        {startup.tags && startup.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {startup.tags.map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 text-[10px] font-medium bg-secondary text-secondary-foreground rounded border border-border/50"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Avatar className="w-5 h-5">
              <AvatarFallback className="text-[8px] bg-primary/20 text-primary border border-primary/30">
                {startup.assignee.initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-[10px] text-muted-foreground">@{startup.assignee.name.split(" ")[0]}</span>
          </div>
          <span className="text-[10px] text-muted-foreground">
            {startup.daysInStage === 0 ? "Today" : `${startup.daysInStage}d`}
          </span>
        </div>
      </Link>
    </div>
  )
}

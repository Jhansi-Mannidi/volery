"use client"

import { useState, useEffect } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Save, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export interface PipelineFilterState {
  sectors: string[]
  stages: string[]
  assignees: string[]
  tags: string[]
  fundingRange: [number, number]
  dateRange: { from?: Date; to?: Date }
}

const defaultFilterState: PipelineFilterState = {
  sectors: [],
  stages: [],
  assignees: [],
  tags: [],
  fundingRange: [0, 50],
  dateRange: {},
}

interface PipelineFiltersProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Applied filter values (controlled). When user clicks Apply, these are updated by parent. */
  value?: PipelineFilterState
  /** Called when user clicks "Apply Filters". Parent should update value and close sheet. */
  onApply?: (filters: PipelineFilterState) => void
}

const sectors = [
  "Fintech",
  "Healthcare",
  "EdTech",
  "CleanTech",
  "Logistics",
  "AgriTech",
  "SaaS",
  "AI/ML",
  "E-commerce",
  "Deep Tech",
]

const stages = [
  "Intake",
  "Screening",
  "Due Diligence",
  "Decision",
  "Term Sheet",
  "Closed Won",
  "Closed Lost",
]

const teamMembers = [
  { name: "Priya Sharma", initials: "PS" },
  { name: "Rahul Mehta", initials: "RM" },
  { name: "Amit Patel", initials: "AP" },
  { name: "Sara Khan", initials: "SK" },
]

const tags = [
  "AI",
  "B2B",
  "B2C",
  "SaaS",
  "Impact",
  "Deep Tech",
  "Platform",
  "Marketplace",
  "Hardware",
]

export function PipelineFilters({ open, onOpenChange, value, onApply }: PipelineFiltersProps) {
  const applied = value ?? defaultFilterState
  const [selectedSectors, setSelectedSectors] = useState<string[]>(applied.sectors)
  const [selectedStages, setSelectedStages] = useState<string[]>(applied.stages)
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(applied.assignees)
  const [selectedTags, setSelectedTags] = useState<string[]>(applied.tags)
  const [fundingRange, setFundingRange] = useState<[number, number]>(applied.fundingRange)
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>(applied.dateRange)

  useEffect(() => {
    if (open) {
      setSelectedSectors(applied.sectors)
      setSelectedStages(applied.stages)
      setSelectedAssignees(applied.assignees)
      setSelectedTags(applied.tags)
      setFundingRange(applied.fundingRange)
      setDateRange(applied.dateRange)
    }
  }, [open, value])

  const toggleSelection = (
    value: string,
    selected: string[],
    setSelected: (val: string[]) => void
  ) => {
    setSelected(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    )
  }

  const clearAll = () => {
    setSelectedSectors([])
    setSelectedStages([])
    setSelectedAssignees([])
    setSelectedTags([])
    setFundingRange([0, 50])
    setDateRange({})
  }

  const handleApply = () => {
    const next: PipelineFilterState = {
      sectors: selectedSectors,
      stages: selectedStages,
      assignees: selectedAssignees,
      tags: selectedTags,
      fundingRange,
      dateRange,
    }
    onApply?.(next)
    onOpenChange(false)
  }

  const hasFilters =
    selectedSectors.length > 0 ||
    selectedStages.length > 0 ||
    selectedAssignees.length > 0 ||
    selectedTags.length > 0 ||
    fundingRange[0] > 0 ||
    fundingRange[1] < 50 ||
    dateRange.from ||
    dateRange.to

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto flex flex-col">
        <SheetHeader>
          <SheetTitle>Filter Pipeline</SheetTitle>
          <SheetDescription>
            Narrow down the startups displayed in your pipeline view.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6 px-4 flex-1 overflow-y-auto">
          {/* Sector Multi-select */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Sector</Label>
            <div className="flex flex-wrap gap-2">
              {sectors.map((sector) => (
                <button
                  key={sector}
                  onClick={() =>
                    toggleSelection(sector, selectedSectors, setSelectedSectors)
                  }
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-full border transition-colors",
                    selectedSectors.includes(sector)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary hover:text-foreground"
                  )}
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>

          {/* Stage Multi-select */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Stage</Label>
            <div className="flex flex-wrap gap-2">
              {stages.map((stage) => (
                <button
                  key={stage}
                  onClick={() =>
                    toggleSelection(stage, selectedStages, setSelectedStages)
                  }
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-full border transition-colors",
                    selectedStages.includes(stage)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary hover:text-foreground"
                  )}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          {/* Assigned To Multi-select */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Assigned To</Label>
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <label
                  key={member.name}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedAssignees.includes(member.name)}
                    onCheckedChange={() =>
                      toggleSelection(member.name, selectedAssignees, setSelectedAssignees)
                    }
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-[10px] font-medium text-primary">
                        {member.initials}
                      </span>
                    </div>
                    <span className="text-sm text-foreground">{member.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Funding Range Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Funding Range</Label>
              <span className="text-xs text-muted-foreground">
                ${fundingRange[0]}M - ${fundingRange[1]}M
              </span>
            </div>
            <Slider
              value={fundingRange}
              onValueChange={setFundingRange}
              min={0}
              max={50}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>$0M</span>
              <span>$50M+</span>
            </div>
          </div>

          {/* Tags Multi-select */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() =>
                    toggleSelection(tag, selectedTags, setSelectedTags)
                  }
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-full border transition-colors",
                    selectedTags.includes(tag)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary hover:text-foreground"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Date Added Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Date Added</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, "MMM d, yyyy") : "From"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !dateRange.to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, "MMM d, yyyy") : "To"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasFilters && (
            <div className="space-y-2 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Active Filters</Label>
                <button
                  onClick={clearAll}
                  className="text-xs text-primary hover:underline"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedSectors.map((s) => (
                  <Badge key={s} variant="secondary" className="gap-1 text-xs">
                    {s}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() =>
                        setSelectedSectors(selectedSectors.filter((v) => v !== s))
                      }
                    />
                  </Badge>
                ))}
                {selectedStages.map((s) => (
                  <Badge key={s} variant="secondary" className="gap-1 text-xs">
                    {s}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() =>
                        setSelectedStages(selectedStages.filter((v) => v !== s))
                      }
                    />
                  </Badge>
                ))}
                {selectedAssignees.map((s) => (
                  <Badge key={s} variant="secondary" className="gap-1 text-xs">
                    {s}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() =>
                        setSelectedAssignees(selectedAssignees.filter((v) => v !== s))
                      }
                    />
                  </Badge>
                ))}
                {selectedTags.map((s) => (
                  <Badge key={s} variant="secondary" className="gap-1 text-xs">
                    {s}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() =>
                        setSelectedTags(selectedTags.filter((v) => v !== s))
                      }
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="flex-col gap-2 sm:flex-col">
          <Button className="w-full gap-2" onClick={handleApply}>
            Apply Filters
          </Button>
          <Button variant="outline" className="w-full gap-2 bg-transparent">
            <Save className="w-4 h-4" />
            Save as View
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

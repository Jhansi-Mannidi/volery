"use client"

import * as React from "react"
import { X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { DealsFilters } from "./types"

const STAGES = ["Pre-Seed", "Seed", "Series A", "Series B+"]
const SECTORS = ["Fintech", "SaaS", "AI/ML", "Healthcare", "CleanTech", "EdTech", "Consumer"]
const LOCATIONS = ["Bangalore", "Mumbai", "Delhi", "Other"]

interface FilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: DealsFilters
  onFiltersChange: (f: DealsFilters) => void
  resultCount: number
  onApply: () => void
}

export function FilterModal({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  resultCount,
  onApply,
}: FilterModalProps) {
  const [local, setLocal] = React.useState<DealsFilters>(filters)

  React.useEffect(() => {
    if (open) setLocal(filters)
  }, [open, filters])

  const update = (patch: Partial<DealsFilters>) => {
    setLocal((prev) => ({ ...prev, ...patch }))
  }

  const handleReset = () => {
    setLocal({
      matchMin: 70,
      stages: ["Pre-Seed", "Seed", "Series A"],
      sectors: ["Fintech", "SaaS", "AI/ML", "CleanTech", "EdTech"],
      checkMin: 5,
      checkMax: 50,
      locations: ["Bangalore", "Mumbai", "Delhi"],
      syndicateOnly: false,
      warmIntrosOnly: false,
      closingThisMonth: false,
    })
  }

  const handleApply = () => {
    onFiltersChange(local)
    onApply()
    onOpenChange(false)
  }

  const toggleStage = (s: string) => {
    update({
      stages: local.stages.includes(s)
        ? local.stages.filter((x) => x !== s)
        : [...local.stages, s],
    })
  }
  const toggleSector = (s: string) => {
    update({
      sectors: local.sectors.includes(s)
        ? local.sectors.filter((x) => x !== s)
        : [...local.sectors, s],
    })
  }
  const toggleLocation = (s: string) => {
    update({
      locations: local.locations.includes(s)
        ? local.locations.filter((x) => x !== s)
        : [...local.locations, s],
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Filter Deals</DialogTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Match Score */}
          <div className="space-y-2">
            <Label>Match Score</Label>
            <div className="flex items-center gap-3">
              <Slider
                value={[local.matchMin]}
                onValueChange={([v]) => update({ matchMin: v ?? 70 })}
                min={50}
                max={100}
                step={5}
                className="flex-1"
              />
              <span className="text-sm font-medium w-14 shrink-0">
                {local.matchMin}% min
              </span>
            </div>
          </div>

          {/* Stage */}
          <div className="space-y-2">
            <Label>Stage</Label>
            <div className="flex flex-wrap gap-2">
              {STAGES.map((s) => (
                <label
                  key={s}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={local.stages.includes(s)}
                    onCheckedChange={() => toggleStage(s)}
                  />
                  <span className="text-sm">{s}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sectors */}
          <div className="space-y-2">
            <Label>Sectors (Your preferences shown)</Label>
            <div className="flex flex-wrap gap-2">
              {SECTORS.map((s) => (
                <label
                  key={s}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={local.sectors.includes(s)}
                    onCheckedChange={() => toggleSector(s)}
                  />
                  <span className="text-sm">{s}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Check Size */}
          <div className="space-y-2">
            <Label>Check Size (₹ Lakhs)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={local.checkMin}
                onChange={(e) =>
                  update({ checkMin: Number(e.target.value) || 0 })
                }
                className="w-24"
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="number"
                placeholder="Max"
                value={local.checkMax}
                onChange={(e) =>
                  update({ checkMax: Number(e.target.value) || 0 })
                }
                className="w-24"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>Location</Label>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((s) => (
                <label
                  key={s}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={local.locations.includes(s)}
                    onCheckedChange={() => toggleLocation(s)}
                  />
                  <span className="text-sm">{s}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Special Filters */}
          <div className="space-y-2">
            <Label>Special Filters</Label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={local.syndicateOnly}
                  onCheckedChange={(c) =>
                    update({ syndicateOnly: c === true })
                  }
                />
                <span className="text-sm">Syndicate opportunities only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={local.warmIntrosOnly}
                  onCheckedChange={(c) =>
                    update({ warmIntrosOnly: c === true })
                  }
                />
                <span className="text-sm">Warm intros available</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={local.closingThisMonth}
                  onCheckedChange={(c) =>
                    update({ closingThisMonth: c === true })
                  }
                />
                <span className="text-sm">Closing this month</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pt-4 border-t border-border">
          <Button variant="outline" onClick={handleReset}>
            Reset Filters
          </Button>
          <Button onClick={handleApply}>
            Apply Filters ({resultCount} deals)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

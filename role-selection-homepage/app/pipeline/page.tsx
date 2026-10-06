"use client"

import { useState, useCallback } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { PipelineKanban } from "@/components/pipeline/pipeline-kanban"
import { InvestorPipelineKanban } from "@/components/pipeline/investor-pipeline-kanban"
import { PipelineList } from "@/components/pipeline/pipeline-list"
import { PipelineTable } from "@/components/pipeline/pipeline-table"
import { PipelineFilters, type PipelineFilterState } from "@/components/pipeline/pipeline-filters"
import { QuickAddModal } from "@/components/startup/quick-add-modal"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Kanban,
  List,
  Table2,
  SlidersHorizontal,
  ChevronDown,
  Plus,
  ArrowUpDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

type ViewMode = "kanban" | "list" | "table"

export type PipelineSortBy =
  | "recently-updated"
  | "name-asc"
  | "name-desc"
  | "stage-age"
  | "date-added"

const defaultFilters: PipelineFilterState = {
  sectors: [],
  stages: [],
  assignees: [],
  tags: [],
  fundingRange: [0, 50],
  dateRange: {},
}

export default function PipelinePage() {
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState<ViewMode>("kanban")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [selectedPipeline, setSelectedPipeline] = useState("main")
  const [sortBy, setSortBy] = useState<PipelineSortBy>("recently-updated")
  const [filters, setFilters] = useState<PipelineFilterState>(defaultFilters)

  const handleApplyFilters = useCallback((next: PipelineFilterState) => {
    setFilters(next)
  }, [])

  const isInstitutionalInvestor = user?.activeRole === "institutional-investor"

  // Simplified view for Institutional Investors
  if (isInstitutionalInvestor) {
    return (
      <div className="flex flex-col h-screen bg-background">
        {/* Header */}
        <DashboardHeader title="My Pipeline" />

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <DashboardSidebar />

          {/* Content Area - Simple Kanban Only */}
          <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
            <div className="max-w-[1600px] mx-auto space-y-6">
              {/* Breadcrumb */}
              <PageBreadcrumb segments={[{ label: "My Pipeline" }]} />
              
              <InvestorPipelineKanban />
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Full-featured view for all other roles
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <DashboardHeader title="Pipeline" />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Content Area - Full Width Flex Column */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Toolbar */}
          <div className="border-b border-border bg-background px-4 md:px-6 py-4 shrink-0">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Breadcrumb & Title */}
            <div className="flex flex-col gap-2">
              <PageBreadcrumb segments={[{ label: "Pipeline" }]} />
              {/* Left: Title & Pipeline Selector */}
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-foreground">Pipeline</h1>
                <Select value={selectedPipeline} onValueChange={setSelectedPipeline}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select pipeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Pipeline</SelectItem>
                    <SelectItem value="seed">Seed Deals</SelectItem>
                    <SelectItem value="series-a">Series A</SelectItem>
                    <SelectItem value="strategic">Strategic Investments</SelectItem>
                </SelectContent>
              </Select>
              </div>
            </div>

            {/* Right: Controls */}
              <div className="flex flex-wrap items-center gap-2">
                {/* View Toggle */}
                <div className="flex items-center border border-border rounded-lg p-1 bg-muted/30">
                  <Button
                    type="button"
                    variant={viewMode === "kanban" ? "default" : "ghost"}
                    size="sm"
                    className="h-8 px-3 gap-1.5 rounded-md"
                    onClick={() => setViewMode("kanban")}
                    aria-label="Kanban view"
                  >
                    <Kanban className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:inline">Kanban</span>
                  </Button>
                  <Button
                    type="button"
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    className="h-8 px-3 gap-1.5 rounded-md"
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:inline">List</span>
                  </Button>
                  <Button
                    type="button"
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    className="h-8 px-3 gap-1.5 rounded-md"
                    onClick={() => setViewMode("table")}
                    aria-label="Table view"
                  >
                    <Table2 className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:inline">Table</span>
                  </Button>
                </div>

                {/* Filters Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFiltersOpen(true)}
                  className={cn(
                    "gap-2",
                    (filters.sectors.length > 0 ||
                      filters.stages.length > 0 ||
                      filters.assignees.length > 0 ||
                      filters.tags.length > 0 ||
                      filters.fundingRange[0] > 0 ||
                      filters.fundingRange[1] < 50 ||
                      filters.dateRange.from ||
                      filters.dateRange.to) &&
                      "border-primary bg-primary/5"
                  )}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {(filters.sectors.length > 0 ||
                    filters.stages.length > 0 ||
                    filters.assignees.length > 0 ||
                    filters.tags.length > 0 ||
                    filters.fundingRange[0] > 0 ||
                    filters.fundingRange[1] < 50 ||
                    filters.dateRange.from ||
                    filters.dateRange.to) && (
                    <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-medium text-primary-foreground">
                      {[
                        filters.sectors.length,
                        filters.stages.length,
                        filters.assignees.length,
                        filters.tags.length,
                        filters.fundingRange[0] > 0 || filters.fundingRange[1] < 50 ? 1 : 0,
                        filters.dateRange.from || filters.dateRange.to ? 1 : 0,
                      ].reduce((a, b) => a + b, 0)}
                    </span>
                  )}
                </Button>

                {/* Sort Dropdown - drives table/list sort when in table view */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent min-w-[120px] sm:min-w-[140px] justify-between">
                      <span className="flex items-center gap-2 truncate">
                        <ArrowUpDown className="w-4 h-4 shrink-0" />
                        <span className="hidden sm:inline truncate">
                          {sortBy === "recently-updated"
                            ? "Recently Updated"
                            : sortBy === "name-asc"
                              ? "Name A-Z"
                              : sortBy === "name-desc"
                                ? "Name Z-A"
                                : sortBy === "stage-age"
                                  ? "Stage Age"
                                  : sortBy === "date-added"
                                    ? "Date Added"
                                    : "Sort"}
                        </span>
                      </span>
                      <ChevronDown className="w-3 h-3 shrink-0 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setSortBy("recently-updated")}
                      className={cn(sortBy === "recently-updated" && "bg-accent")}
                    >
                      Recently Updated
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortBy("name-asc")}
                      className={cn(sortBy === "name-asc" && "bg-accent")}
                    >
                      Name A-Z
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortBy("name-desc")}
                      className={cn(sortBy === "name-desc" && "bg-accent")}
                    >
                      Name Z-A
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortBy("stage-age")}
                      className={cn(sortBy === "stage-age" && "bg-accent")}
                    >
                      Stage Age
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortBy("date-added")}
                      className={cn(sortBy === "date-added" && "bg-accent")}
                    >
                      Date Added
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Add Startup Button */}
                <Button size="sm" className="gap-2" onClick={() => setQuickAddOpen(true)} type="button">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Startup</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <main className="flex-1 overflow-hidden">
            <div className="max-w-[1600px] mx-auto space-y-6">
              {viewMode === "kanban" && <PipelineKanban onAddStartup={() => setQuickAddOpen(true)} />}
              {viewMode === "list" && <PipelineList />}
              {viewMode === "table" && (
                <PipelineTable
                  filters={filters}
                  sortBy={sortBy}
                  onSortByChange={(s) => setSortBy(s as PipelineSortBy)}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Filter Panel */}
      <PipelineFilters
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        value={filters}
        onApply={handleApplyFilters}
      />

      {/* Quick Add Startup */}
      <QuickAddModal open={quickAddOpen} onOpenChange={setQuickAddOpen} />
    </div>
  )
}

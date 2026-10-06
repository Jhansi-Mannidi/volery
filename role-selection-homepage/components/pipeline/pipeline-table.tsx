"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import type { PipelineFilterState } from "@/components/pipeline/pipeline-filters"
import { cn } from "@/lib/utils"
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Eye,
  Pencil,
  ArrowRight,
  Flame,
  ChevronLeft,
  ChevronRight,
  Users,
  Building2,
  FileImage,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Startup {
  id: string
  name: string
  sector: string
  pipelineStage: string
  pipelineStageColor: string
  fundingStage: string
  amountRaised: number
  amountRaisedDisplay: string
  owner: {
    name: string
    initials: string
  }
  lastUpdated: Date
  lastUpdatedDisplay: string
  isHot?: boolean
}

const allStartups: Startup[] = [
  {
    id: "1",
    name: "TechCorp AI",
    sector: "Fintech",
    pipelineStage: "Intake",
    pipelineStageColor: "bg-slate-500",
    fundingStage: "Seed",
    amountRaised: 1200000,
    amountRaisedDisplay: "$1.2M",
    owner: { name: "Priya Sharma", initials: "PS" },
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    lastUpdatedDisplay: "2 days ago",
    isHot: true,
  },
  {
    id: "2",
    name: "HealthX",
    sector: "Healthcare",
    pipelineStage: "Intake",
    pipelineStageColor: "bg-slate-500",
    fundingStage: "Pre-Seed",
    amountRaised: 500000,
    amountRaisedDisplay: "$500K",
    owner: { name: "Rahul Mehta", initials: "RM" },
    lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    lastUpdatedDisplay: "5 days ago",
  },
  {
    id: "3",
    name: "EduLearn",
    sector: "EdTech",
    pipelineStage: "Intake",
    pipelineStageColor: "bg-slate-500",
    fundingStage: "Seed",
    amountRaised: 800000,
    amountRaisedDisplay: "$800K",
    owner: { name: "Priya Sharma", initials: "PS" },
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    lastUpdatedDisplay: "1 day ago",
  },
  {
    id: "4",
    name: "GreenEnergy",
    sector: "CleanTech",
    pipelineStage: "Screening",
    pipelineStageColor: "bg-blue-500",
    fundingStage: "Series A",
    amountRaised: 4500000,
    amountRaisedDisplay: "$4.5M",
    owner: { name: "Amit Patel", initials: "AP" },
    lastUpdated: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    lastUpdatedDisplay: "8 days ago",
    isHot: true,
  },
  {
    id: "5",
    name: "LogiFlow",
    sector: "Logistics",
    pipelineStage: "Screening",
    pipelineStageColor: "bg-blue-500",
    fundingStage: "Seed",
    amountRaised: 1500000,
    amountRaisedDisplay: "$1.5M",
    owner: { name: "Rahul Mehta", initials: "RM" },
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    lastUpdatedDisplay: "3 days ago",
  },
  {
    id: "6",
    name: "FinSecure",
    sector: "Fintech",
    pipelineStage: "Due Diligence",
    pipelineStageColor: "bg-amber-500",
    fundingStage: "Series A",
    amountRaised: 3800000,
    amountRaisedDisplay: "$3.8M",
    owner: { name: "Priya Sharma", initials: "PS" },
    lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    lastUpdatedDisplay: "14 days ago",
    isHot: true,
  },
  {
    id: "7",
    name: "RetailAI",
    sector: "Retail",
    pipelineStage: "Due Diligence",
    pipelineStageColor: "bg-amber-500",
    fundingStage: "Seed",
    amountRaised: 2100000,
    amountRaisedDisplay: "$2.1M",
    owner: { name: "Amit Patel", initials: "AP" },
    lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastUpdatedDisplay: "7 days ago",
  },
  {
    id: "8",
    name: "CloudOps",
    sector: "DevTools",
    pipelineStage: "Due Diligence",
    pipelineStageColor: "bg-amber-500",
    fundingStage: "Series A",
    amountRaised: 5200000,
    amountRaisedDisplay: "$5.2M",
    owner: { name: "Rahul Mehta", initials: "RM" },
    lastUpdated: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    lastUpdatedDisplay: "21 days ago",
  },
  {
    id: "9",
    name: "DataMesh",
    sector: "Data",
    pipelineStage: "Decision",
    pipelineStageColor: "bg-purple-500",
    fundingStage: "Series A",
    amountRaised: 6000000,
    amountRaisedDisplay: "$6.0M",
    owner: { name: "Priya Sharma", initials: "PS" },
    lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    lastUpdatedDisplay: "5 days ago",
    isHot: true,
  },
  {
    id: "10",
    name: "AgriSmart",
    sector: "AgriTech",
    pipelineStage: "Term Sheet",
    pipelineStageColor: "bg-teal-500",
    fundingStage: "Seed",
    amountRaised: 1800000,
    amountRaisedDisplay: "$1.8M",
    owner: { name: "Amit Patel", initials: "AP" },
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    lastUpdatedDisplay: "3 days ago",
  },
  {
    id: "11",
    name: "PayFlow",
    sector: "Fintech",
    pipelineStage: "Closed Won",
    pipelineStageColor: "bg-green-500",
    fundingStage: "Series A",
    amountRaised: 8000000,
    amountRaisedDisplay: "$8.0M",
    owner: { name: "Priya Sharma", initials: "PS" },
    lastUpdated: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000),
    lastUpdatedDisplay: "Today",
  },
  {
    id: "12",
    name: "MedTech Plus",
    sector: "Healthcare",
    pipelineStage: "Closed Won",
    pipelineStageColor: "bg-green-500",
    fundingStage: "Seed",
    amountRaised: 2500000,
    amountRaisedDisplay: "$2.5M",
    owner: { name: "Rahul Mehta", initials: "RM" },
    lastUpdated: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000),
    lastUpdatedDisplay: "Today",
  },
  {
    id: "13",
    name: "TravelBuddy",
    sector: "Travel",
    pipelineStage: "Closed Lost",
    pipelineStageColor: "bg-red-500",
    fundingStage: "Pre-Seed",
    amountRaised: 300000,
    amountRaisedDisplay: "$300K",
    owner: { name: "Amit Patel", initials: "AP" },
    lastUpdated: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000),
    lastUpdatedDisplay: "Today",
  },
]

type SortField = "name" | "sector" | "pipelineStage" | "fundingStage" | "amountRaised" | "owner" | "lastUpdated"
type SortDirection = "asc" | "desc"

const stages = [
  { id: "intake", name: "Intake" },
  { id: "screening", name: "Screening" },
  { id: "due-diligence", name: "Due Diligence" },
  { id: "decision", name: "Decision" },
  { id: "term-sheet", name: "Term Sheet" },
  { id: "closed-won", name: "Closed Won" },
  { id: "closed-lost", name: "Closed Lost" },
]

const owners = [
  { id: "ps", name: "Priya Sharma", initials: "PS" },
  { id: "rm", name: "Rahul Mehta", initials: "RM" },
  { id: "ap", name: "Amit Patel", initials: "AP" },
]

const PIPELINE_STAGE_ORDER = [
  "Intake",
  "Screening",
  "Due Diligence",
  "Decision",
  "Term Sheet",
  "Closed Won",
  "Closed Lost",
]

function sortByToFieldDirection(
  sortBy: string
): { field: SortField; direction: SortDirection } {
  switch (sortBy) {
    case "name-asc":
      return { field: "name", direction: "asc" }
    case "name-desc":
      return { field: "name", direction: "desc" }
    case "stage-age":
      return { field: "pipelineStage", direction: "asc" }
    case "date-added":
      return { field: "lastUpdated", direction: "desc" }
    case "recently-updated":
    default:
      return { field: "lastUpdated", direction: "desc" }
  }
}

function applyFilters(
  items: Startup[],
  filters: PipelineFilterState
): Startup[] {
  return items.filter((item) => {
    if (
      filters.sectors.length > 0 &&
      !filters.sectors.includes(item.sector)
    ) {
      return false
    }
    if (
      filters.stages.length > 0 &&
      !filters.stages.includes(item.pipelineStage)
    ) {
      return false
    }
    if (
      filters.assignees.length > 0 &&
      !filters.assignees.includes(item.owner.name)
    ) {
      return false
    }
    const amountM = item.amountRaised / 1_000_000
    if (amountM < filters.fundingRange[0] || amountM > filters.fundingRange[1]) {
      return false
    }
    if (filters.dateRange.from && item.lastUpdated < filters.dateRange.from) {
      return false
    }
    if (filters.dateRange.to) {
      const toEnd = new Date(filters.dateRange.to)
      toEnd.setHours(23, 59, 59, 999)
      if (item.lastUpdated > toEnd) return false
    }
    return true
  })
}

export interface PipelineTableProps {
  filters?: PipelineFilterState
  sortBy?: string
  onSortByChange?: (sortBy: string) => void
}

export function PipelineTable({
  filters = {
    sectors: [],
    stages: [],
    assignees: [],
    tags: [],
    fundingRange: [0, 50],
    dateRange: {},
  },
  sortBy: sortByProp,
  onSortByChange,
}: PipelineTableProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [sortField, setSortField] = useState<SortField>("lastUpdated")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)

  useEffect(() => {
    if (sortByProp) {
      const { field, direction } = sortByToFieldDirection(sortByProp)
      setSortField(field)
      setSortDirection(direction)
    }
  }, [sortByProp])

  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === paginatedStartups.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(paginatedStartups.map((s) => s.id))
    }
  }

  const fieldDirectionToSortBy = (
    field: SortField,
    direction: SortDirection
  ): string | null => {
    if (field === "lastUpdated" && direction === "desc") return "recently-updated"
    if (field === "lastUpdated" && direction === "asc") return "date-added"
    if (field === "name" && direction === "asc") return "name-asc"
    if (field === "name" && direction === "desc") return "name-desc"
    if (field === "pipelineStage" && direction === "asc") return "stage-age"
    return null
  }

  const handleSort = (field: SortField) => {
    const nextDirection =
      sortField === field
        ? (sortDirection === "asc" ? "desc" : "asc")
        : "asc"
    setSortField(field)
    setSortDirection(nextDirection)
    const nextSortBy = fieldDirectionToSortBy(
      field,
      nextDirection as SortDirection
    )
    if (nextSortBy != null) onSortByChange?.(nextSortBy)
  }

  const filteredStartups = useMemo(
    () => applyFilters(allStartups, filters),
    [filters]
  )

  const sortedStartups = useMemo(() => {
    return [...filteredStartups].sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "sector":
          comparison = a.sector.localeCompare(b.sector)
          break
        case "pipelineStage": {
          const ai = PIPELINE_STAGE_ORDER.indexOf(a.pipelineStage)
          const bi = PIPELINE_STAGE_ORDER.indexOf(b.pipelineStage)
          comparison = (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
          break
        }
        case "fundingStage":
          comparison = a.fundingStage.localeCompare(b.fundingStage)
          break
        case "amountRaised":
          comparison = a.amountRaised - b.amountRaised
          break
        case "owner":
          comparison = a.owner.name.localeCompare(b.owner.name)
          break
        case "lastUpdated":
          comparison = a.lastUpdated.getTime() - b.lastUpdated.getTime()
          break
      }
      return sortDirection === "asc" ? comparison : -comparison
    })
  }, [filteredStartups, sortField, sortDirection])

  const totalPages = Math.ceil(sortedStartups.length / itemsPerPage)
  const paginatedStartups = sortedStartups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      type="button"
      className="flex items-center gap-1.5 hover:text-foreground transition-colors"
      onClick={() => handleSort(field)}
    >
      {children}
      {sortField === field ? (
        sortDirection === "asc" ? (
          <ArrowUp className="w-3.5 h-3.5" />
        ) : (
          <ArrowDown className="w-3.5 h-3.5" />
        )
      ) : (
        <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
      )}
    </button>
  )

  return (
    <div className="h-full flex flex-col">
      {/* Bulk Actions Bar */}
      {selectedItems.length > 0 && (
        <div className="sticky top-0 z-10 bg-primary text-primary-foreground px-4 md:px-6 py-3 flex items-center gap-4 border-b">
          <span className="text-sm font-medium">{selectedItems.length} selected</span>
          <div className="flex items-center gap-2">
            <Select>
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
            <Select>
              <SelectTrigger className="h-8 w-[130px] bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <SelectValue placeholder="Assign to" />
              </SelectTrigger>
              <SelectContent>
                {owners.map((owner) => (
                  <SelectItem key={owner.id} value={owner.id}>
                    {owner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              Delete
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedItems([])}
            className="ml-auto text-primary-foreground hover:bg-primary-foreground/10"
          >
            Clear selection
          </Button>
        </div>
      )}

      {/* Table Container */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    paginatedStartups.length > 0 &&
                    selectedItems.length === paginatedStartups.length
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="min-w-[200px]">
                <SortHeader field="name">Name</SortHeader>
              </TableHead>
              <TableHead className="min-w-[120px]">
                <SortHeader field="sector">Sector</SortHeader>
              </TableHead>
              <TableHead className="min-w-[140px]">
                <SortHeader field="pipelineStage">Stage</SortHeader>
              </TableHead>
              <TableHead className="min-w-[120px]">
                <SortHeader field="fundingStage">Funding Stage</SortHeader>
              </TableHead>
              <TableHead className="min-w-[120px]">
                <SortHeader field="amountRaised">Amount Raised</SortHeader>
              </TableHead>
              <TableHead className="min-w-[140px]">
                <SortHeader field="owner">Owner</SortHeader>
              </TableHead>
              <TableHead className="min-w-[120px]">
                <SortHeader field="lastUpdated">Last Updated</SortHeader>
              </TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStartups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-60">
                  <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <FileImage className="w-8 h-8" />
                    </div>
                    <p className="text-base font-medium">No startups match your filters</p>
                    <p className="text-sm">
                      Try adjusting your filters or{" "}
                      <button type="button" className="text-primary hover:underline">
                        add a new startup
                      </button>
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedStartups.map((startup) => {
                const isSelected = selectedItems.includes(startup.id)

                return (
                  <TableRow
                    key={startup.id}
                    className={cn(
                      "cursor-pointer",
                      isSelected && "bg-primary/5"
                    )}
                  >
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelectItem(startup.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
<TableCell>
  <Link href={`/startups/${startup.id}`} className="flex items-center gap-3 group">
  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
  <Building2 className="w-4 h-4 text-primary" />
  </div>
  <div className="flex items-center gap-2 min-w-0">
  <span className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
  {startup.name}
  </span>
  {startup.isHot && (
  <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
  )}
  </div>
  </Link>
  </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-normal">
                        {startup.sector}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", startup.pipelineStageColor)} />
                        <span className="text-sm">{startup.pipelineStage}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {startup.fundingStage}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {startup.amountRaisedDisplay}
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={startup.owner.initials.toLowerCase()}>
                        <SelectTrigger className="h-8 w-[130px] border-0 bg-transparent hover:bg-muted/50 p-0 focus:ring-0">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-5 h-5">
                              <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
                                {startup.owner.initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{startup.owner.name.split(" ")[0]}</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {owners.map((owner) => (
                            <SelectItem key={owner.id} value={owner.initials.toLowerCase()}>
                              <div className="flex items-center gap-2">
                                <Avatar className="w-5 h-5">
                                  <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
                                    {owner.initials}
                                  </AvatarFallback>
                                </Avatar>
                                {owner.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {startup.lastUpdatedDisplay}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
<DropdownMenuContent align="end">
  <DropdownMenuItem asChild>
  <Link href={`/startups/${startup.id}`}>
  <Eye className="w-4 h-4 mr-2" />
  View Profile
  </Link>
  </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="w-4 h-4 mr-2" />
                            Find Matches
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Move to Stage
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="border-t bg-background px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, sortedStartups.length)} of{" "}
            {sortedStartups.length} startups
          </span>
          <div className="flex items-center gap-2">
            <span>Items per page:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Prev
          </Button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum: number
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </Button>
            )
          })}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="px-2 text-muted-foreground">...</span>
              <Button
                variant="outline"
                size="sm"
                className="w-8 h-8 p-0 bg-transparent"
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}

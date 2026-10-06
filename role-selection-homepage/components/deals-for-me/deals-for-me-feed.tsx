"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Sparkles,
  Search,
  Settings,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { QuickFilterId, SortOption, DealsFilters } from "./types"
import { DealCard } from "./deal-card"
import { FilterModal } from "./filter-modal"
import { EmptyState } from "./empty-state"
import { MOCK_DEALS_FOR_ME } from "./mock-deals"

const QUICK_FILTERS: { id: QuickFilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "90plus", label: "90%+ Match" },
  { id: "seed", label: "Seed" },
  { id: "series-a", label: "Series A" },
  { id: "fintech", label: "Fintech" },
  { id: "saas", label: "SaaS" },
  { id: "health", label: "Health" },
]

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "best-match", label: "Best Match" },
  { value: "newest", label: "Newest" },
  { value: "closing-soon", label: "Closing Soon" },
  { value: "most-popular", label: "Most Popular" },
]

const DEFAULT_FILTERS: DealsFilters = {
  matchMin: 70,
  stages: ["Pre-Seed", "Seed", "Series A"],
  sectors: ["Fintech", "SaaS", "AI/ML", "CleanTech", "EdTech"],
  checkMin: 5,
  checkMax: 50,
  locations: ["Bangalore", "Mumbai", "Delhi"],
  syndicateOnly: false,
  warmIntrosOnly: false,
  closingThisMonth: false,
}

export function DealsForMeFeed() {
  const router = useRouter()
  const [quickFilter, setQuickFilter] = React.useState<QuickFilterId>("all")
  const [sort, setSort] = React.useState<SortOption>("best-match")
  const [filters, setFilters] = React.useState<DealsFilters>(DEFAULT_FILTERS)
  const [filterModalOpen, setFilterModalOpen] = React.useState(false)
  const [deals, setDeals] = React.useState(MOCK_DEALS_FOR_ME)
  const [loadingMore, setLoadingMore] = React.useState(false)
  const [hasMore] = React.useState(true)
  const loadMoreRef = React.useRef<HTMLDivElement>(null)

  const filteredDeals = React.useMemo(() => {
    let list = deals.filter((d) => d.matchPct >= filters.matchMin)
    list = list.filter((d) => filters.stages.includes(d.stage))
    list = list.filter((d) => filters.sectors.includes(d.sector))
    list = list.filter((d) => filters.locations.includes(d.location))
    if (filters.syndicateOnly) list = list.filter((d) => d.variant === "syndicate")
    if (quickFilter === "90plus") {
      list = list.filter((d) => d.matchPct >= 90)
    } else if (quickFilter === "seed") {
      list = list.filter((d) => d.stage === "Seed")
    } else if (quickFilter === "series-a") {
      list = list.filter((d) => d.stage === "Series A")
    } else if (quickFilter === "fintech") {
      list = list.filter((d) => d.sector === "Fintech")
    } else if (quickFilter === "saas") {
      list = list.filter((d) => d.sector === "SaaS")
    } else if (quickFilter === "health") {
      list = list.filter((d) => d.sector === "Healthcare")
    }
    if (sort === "best-match") {
      list.sort((a, b) => b.matchPct - a.matchPct)
    } else if (sort === "newest") {
      list.sort((a, b) => (a.id < b.id ? 1 : -1))
    }
    return list
  }, [deals, quickFilter, sort, filters])

  const handleSave = (id: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== id))
  }
  const handlePass = (id: string, _name?: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== id))
  }

  const handleLoadMore = React.useCallback(() => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    setTimeout(() => setLoadingMore(false), 800)
  }, [loadingMore, hasMore])

  React.useEffect(() => {
    const el = loadMoreRef.current
    if (!el) return
    const ob = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) handleLoadMore()
      },
      { rootMargin: "200px" }
    )
    ob.observe(el)
    return () => ob.disconnect()
  }, [handleLoadMore, filteredDeals.length])

  const totalDeals = 47
  const newToday = 3

  return (
    <div className="flex flex-col min-h-0">
      {/* Header */}
      <div className="border-b border-border bg-background px-3 py-4 md:px-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground truncate">
              Deals For Me
            </h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="icon" aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFilterModalOpen(true)}
              aria-label="Filter"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
            AI-curated based on your investment preferences
          </p>
          <p className="text-sm text-muted-foreground">
            {totalDeals} deals • {newToday} new today
          </p>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="border-b border-border bg-muted/30 px-3 py-3 md:px-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-1">
          {QUICK_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setQuickFilter(f.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                quickFilter === f.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-background border border-border text-foreground hover:bg-muted"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="px-3 py-3 md:px-4 flex items-center gap-2 border-b border-border">
        <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Deal list or empty - full width, minimal side padding */}
      <div className="flex-1 overflow-auto px-3 py-4 md:px-4">
        {filteredDeals.length === 0 ? (
          <EmptyState onAdjustFilters={() => setFilterModalOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {filteredDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onSave={handleSave}
                onPass={handlePass}
              />
            ))}
            <div
              ref={loadMoreRef}
              className="col-span-full flex justify-center py-6"
            >
              {loadingMore && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading more deals...
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <FilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        filters={filters}
        onFiltersChange={setFilters}
        resultCount={filteredDeals.length}
        onApply={() => {}}
      />
    </div>
  )
}
